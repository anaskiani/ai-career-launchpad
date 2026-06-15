import bcrypt from 'bcryptjs';
import { getPool } from '../config/mysql.js';
import { generateToken, generateRefreshToken } from '../middleware/auth.js';
import { sendOTP, sendPasswordResetOTP } from '../utils/emailService.js';
import { AppError } from '../middleware/errorHandler.js';
import { newId } from '../utils/dbHelpers.js';
import { ensureDevUser, isDevBypassCredentials } from '../utils/devAuth.js';
import { OAuth2Client } from 'google-auth-library';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const pool = getPool();

    const [existingRows] = await pool.query('SELECT id FROM users WHERE email = ? LIMIT 1', [email]);
    if (existingRows.length > 0) {
      return next(new AppError('User already exists', 400));
    }

    const userId = newId();
    const passwordHash = await bcrypt.hash(password, 10);

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await pool.query(
      `INSERT INTO users (
        id, name, email, password_hash, email_verified,
        email_otp_code, email_otp_expires_at,
        security_question_text, security_question_answer_hash, security_pin_hash,
        skills_json, education_json, work_experience_json
      ) VALUES (?, ?, ?, ?, 0, ?, ?, NULL, NULL, NULL, JSON_ARRAY(), JSON_ARRAY(), JSON_ARRAY())`,
      [
        userId,
        name,
        email,
        passwordHash,
        otp,
        expiresAt,
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

    const token = generateToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    res.json({
      message: 'Login successful',
      step: 'complete',
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



export const googleLogin = async (req, res, next) => {
  try {
    const { token: googleToken } = req.body;
    if (!googleToken) {
      return next(new AppError('No Google token provided', 400));
    }

    // Verify the Google token
    const ticket = await googleClient.verifyIdToken({
      idToken: googleToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;
    
    const pool = getPool();
    
    // Check if user exists by email
    const [existingUsers] = await pool.query('SELECT * FROM users WHERE email = ? LIMIT 1', [email]);
    
    let user;
    if (existingUsers.length > 0) {
      user = existingUsers[0];
      // Update google_id and profile image if not already set
      if (!user.google_id || !user.profile_image) {
        await pool.query(
          'UPDATE users SET google_id = COALESCE(google_id, ?), profile_image = COALESCE(profile_image, ?), email_verified = 1 WHERE id = ?',
          [googleId, picture, user.id]
        );
      }
    } else {
      // Create new user
      const userId = newId();
      await pool.query(
        `INSERT INTO users (
          id, name, email, google_id, profile_image, email_verified,
          skills_json, education_json, work_experience_json
        ) VALUES (?, ?, ?, ?, ?, 1, JSON_ARRAY(), JSON_ARRAY(), JSON_ARRAY())`,
        [userId, name, email, googleId, picture]
      );
      user = { id: userId, name, email, profile_image: picture };
    }

    const jwtToken = generateToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    res.json({
      message: 'Login successful',
      token: jwtToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        profileImage: user.profile_image,
      },
    });
  } catch (error) {
    console.error('Google login error:', error);
    next(new AppError(`Google login failed: ${error.message}`, 400));
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
