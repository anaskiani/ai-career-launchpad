import bcrypt from 'bcryptjs';
import { getPool } from '../config/mysql.js';
import { generateToken, generateRefreshToken } from '../middleware/auth.js';
import { sendOTP, sendPasswordResetOTP } from '../utils/emailService.js';
import { AppError } from '../middleware/errorHandler.js';
import { newId } from '../utils/dbHelpers.js';
import { ensureDevUser, isDevBypassCredentials } from '../utils/devAuth.js';

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password, securityQuestion, securityPIN } = req.body;
    const pool = getPool();

    const [existingRows] = await pool.query('SELECT id FROM users WHERE email = ? LIMIT 1', [email]);
    if (existingRows.length > 0) {
      return next(new AppError('User already exists', 400));
    }

    const userId = newId();
    const passwordHash = await bcrypt.hash(password, 10);
    const securityAnswerHash = await bcrypt.hash(securityQuestion.answer, 10);
    const securityPinHash = await bcrypt.hash(securityPIN, 10);

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await pool.query(
      `INSERT INTO users (
        id, name, email, password_hash, email_verified,
        email_otp_code, email_otp_expires_at,
        security_question_text, security_question_answer_hash, security_pin_hash,
        skills_json, education_json, work_experience_json
      ) VALUES (?, ?, ?, ?, 0, ?, ?, ?, ?, ?, JSON_ARRAY(), JSON_ARRAY(), JSON_ARRAY())`,
      [
        userId,
        name,
        email,
        passwordHash,
        otp,
        expiresAt,
        securityQuestion.question,
        securityAnswerHash,
        securityPinHash,
      ]
    );

    const otpSent = await sendOTP(email, otp);
    const isDev = process.env.NODE_ENV !== 'production';

    res.status(201).json({
      message: otpSent
        ? 'User registered. OTP sent to email.'
        : 'User registered, but email sending failed. Use dev OTP fallback.',
      email,
      ...(isDev && !otpSent ? { devOtp: otp } : {}),
    });
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const pool = getPool();

    const [rows] = await pool.query(
      'SELECT id, email_otp_code, email_otp_expires_at FROM users WHERE email = ? LIMIT 1',
      [email]
    );

    if (rows.length === 0) {
      return next(new AppError('User not found', 404));
    }

    const user = rows[0];
    if (
      !user.email_otp_code ||
      user.email_otp_code !== otp ||
      new Date(user.email_otp_expires_at) < new Date()
    ) {
      return next(new AppError('Invalid or expired OTP', 400));
    }

    await pool.query(
      'UPDATE users SET email_verified = 1, email_otp_code = NULL, email_otp_expires_at = NULL WHERE id = ?',
      [user.id]
    );

    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const pool = getPool();

    if (isDevBypassCredentials(email, password)) {
      const user = await ensureDevUser(pool);
      const token = generateToken(user.id);
      const refreshToken = generateRefreshToken(user.id);

      return res.json({
        message: 'Dev login successful',
        step: 'complete',
        token,
        refreshToken,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      });
    }

    const [rows] = await pool.query('SELECT * FROM users WHERE email = ? LIMIT 1', [email]);
    if (rows.length === 0) {
      return next(new AppError('Invalid credentials', 401));
    }

    const user = rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return next(new AppError('Invalid credentials', 401));
    }

    if (!user.email_verified) {
      const otp = generateOTP();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
      await pool.query(
        'UPDATE users SET email_otp_code = ?, email_otp_expires_at = ? WHERE id = ?',
        [otp, expiresAt, user.id]
      );
      const otpSent = await sendOTP(email, otp);
      const isDev = process.env.NODE_ENV !== 'production';

      return res.status(200).json({
        message: otpSent
          ? 'Please verify email first'
          : 'Please verify email first. Email send failed, use dev OTP fallback.',
        step: 'emailVerification',
        email: user.email,
        ...(isDev && !otpSent ? { devOtp: otp } : {}),
      });
    }

    res.json({
      message: 'Password verified',
      step: 'securityQuestion',
      securityQuestion: user.security_question_text,
      userId: user.id,
    });
  } catch (error) {
    next(error);
  }
};

export const verifySecurityQuestion = async (req, res, next) => {
  try {
    const { userId, answer } = req.body;
    const pool = getPool();

    const [rows] = await pool.query(
      'SELECT id, security_question_answer_hash FROM users WHERE id = ? LIMIT 1',
      [userId]
    );
    if (rows.length === 0) {
      return next(new AppError('User not found', 404));
    }

    const user = rows[0];
    const isValid = await bcrypt.compare(answer, user.security_question_answer_hash);
    if (!isValid) {
      return next(new AppError('Incorrect answer', 401));
    }

    res.json({
      message: 'Security question verified',
      step: 'securityPIN',
    });
  } catch (error) {
    next(error);
  }
};

export const verifySecurityPIN = async (req, res, next) => {
  try {
    const { userId, pin } = req.body;
    const pool = getPool();

    const [rows] = await pool.query(
      'SELECT id, name, email, security_pin_hash FROM users WHERE id = ? LIMIT 1',
      [userId]
    );
    if (rows.length === 0) {
      return next(new AppError('User not found', 404));
    }

    const user = rows[0];
    const isValid = await bcrypt.compare(pin, user.security_pin_hash);
    if (!isValid) {
      return next(new AppError('Incorrect PIN', 401));
    }

    const token = generateToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    res.json({
      message: 'Login successful',
      token,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const pool = getPool();

    const [rows] = await pool.query('SELECT id, email FROM users WHERE email = ? LIMIT 1', [email]);
    if (rows.length === 0) {
      return res.json({
        message: 'If that email exists, a reset code has been sent.',
      });
    }

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await pool.query(
      'UPDATE users SET email_otp_code = ?, email_otp_expires_at = ? WHERE id = ?',
      [otp, expiresAt, rows[0].id]
    );

    const otpSent = await sendPasswordResetOTP(email, otp);
    const isDev = process.env.NODE_ENV !== 'production';

    res.json({
      message: otpSent
        ? 'Password reset code sent to your email.'
        : 'Reset code generated. Email send failed; use dev code if available.',
      ...(isDev && !otpSent ? { devOtp: otp } : {}),
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;
    const pool = getPool();

    const [rows] = await pool.query(
      'SELECT id, email_otp_code, email_otp_expires_at FROM users WHERE email = ? LIMIT 1',
      [email]
    );
    if (rows.length === 0) {
      return next(new AppError('Invalid reset request', 400));
    }

    const user = rows[0];
    if (
      !user.email_otp_code ||
      user.email_otp_code !== otp ||
      new Date(user.email_otp_expires_at) < new Date()
    ) {
      return next(new AppError('Invalid or expired reset code', 400));
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await pool.query(
      'UPDATE users SET password_hash = ?, email_otp_code = NULL, email_otp_expires_at = NULL, email_verified = 1 WHERE id = ?',
      [passwordHash, user.id]
    );

    res.json({ message: 'Password reset successful. You can log in now.' });
  } catch (error) {
    next(error);
  }
};

export const logout = (req, res) => {
  res.json({ message: 'Logged out successfully' });
};
