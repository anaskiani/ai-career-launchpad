import bcrypt from 'bcryptjs';
import { newId } from './dbHelpers.js';

export const DEV_LOGIN_EMAIL = process.env.DEV_LOGIN_EMAIL || 'dev@localhost.com';
export const DEV_LOGIN_PASSWORD = process.env.DEV_LOGIN_PASSWORD || 'devpassword';
const DEV_USER_NAME = process.env.DEV_LOGIN_NAME || 'Dev User';

export const isDevAuthEnabled = () =>
  process.env.NODE_ENV !== 'production' && process.env.DEV_BYPASS_AUTH !== 'false';

export const isDevBypassCredentials = (email, password) =>
  isDevAuthEnabled() &&
  email?.toLowerCase() === DEV_LOGIN_EMAIL.toLowerCase() &&
  password === DEV_LOGIN_PASSWORD;

export const ensureDevUser = async (pool) => {
  const [rows] = await pool.query('SELECT id, name, email FROM users WHERE email = ? LIMIT 1', [
    DEV_LOGIN_EMAIL,
  ]);

  if (rows.length > 0) {
    await pool.query(
      'UPDATE users SET email_verified = 1, email_otp_code = NULL, email_otp_expires_at = NULL WHERE id = ?',
      [rows[0].id]
    );
    return rows[0];
  }

  const userId = newId();
  const passwordHash = await bcrypt.hash(DEV_LOGIN_PASSWORD, 10);
  const securityAnswerHash = await bcrypt.hash('dev', 10);
  const securityPinHash = await bcrypt.hash('0000', 10);

  await pool.query(
    `INSERT INTO users (
      id, name, email, password_hash, email_verified,
      security_question_text, security_question_answer_hash, security_pin_hash,
      skills_json, education_json, work_experience_json
    ) VALUES (?, ?, ?, ?, 1, ?, ?, ?, JSON_ARRAY(), JSON_ARRAY(), JSON_ARRAY())`,
    [
      userId,
      DEV_USER_NAME,
      DEV_LOGIN_EMAIL,
      passwordHash,
      'Dev mode security question',
      securityAnswerHash,
      securityPinHash,
    ]
  );

  return { id: userId, name: DEV_USER_NAME, email: DEV_LOGIN_EMAIL };
};
