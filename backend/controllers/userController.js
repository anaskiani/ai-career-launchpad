import fs from 'fs';
import path from 'path';
import { getPool } from '../config/mysql.js';
import { AppError } from '../middleware/errorHandler.js';
import { mapUserPublic, toJson } from '../utils/dbHelpers.js';

export const getProfile = async (req, res, next) => {
  try {
    const pool = getPool();
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ? LIMIT 1', [req.user.userId]);
    if (rows.length === 0) {
      return next(new AppError('User not found', 404));
    }
    res.json(mapUserPublic(rows[0]));
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const pool = getPool();
    const [existingRows] = await pool.query('SELECT id FROM users WHERE id = ? LIMIT 1', [req.user.userId]);
    if (existingRows.length === 0) {
      return next(new AppError('User not found', 404));
    }

    const allowedColumns = {
      name: 'name',
      phone: 'phone',
      bio: 'bio',
      skills: 'skills_json',
      experience: 'experience',
      github: 'github',
      linkedin: 'linkedin',
      portfolio: 'portfolio',
      location: 'location',
      university: 'university',
      graduationYear: 'graduation_year',
      targetRole: 'target_role',
      education: 'education_json',
      workExperience: 'work_experience_json',
    };

    const updates = [];
    const values = [];

    for (const [payloadKey, column] of Object.entries(allowedColumns)) {
      if (req.body[payloadKey] !== undefined) {
        updates.push(`${column} = ?`);
        if (['skills', 'education', 'workExperience'].includes(payloadKey)) {
          values.push(toJson(req.body[payloadKey]));
        } else {
          values.push(req.body[payloadKey]);
        }
      }
    }

    if (updates.length > 0) {
      values.push(req.user.userId);
      await pool.query(`UPDATE users SET ${updates.join(', ')}, updated_at = NOW() WHERE id = ?`, values);
    }

    const [rows] = await pool.query('SELECT * FROM users WHERE id = ? LIMIT 1', [req.user.userId]);

    res.json({ message: 'Profile updated successfully', user: mapUserPublic(rows[0]) });
  } catch (error) {
    next(error);
  }
};

export const uploadAvatar = async (req, res, next) => {
  try {
    const pool = getPool();
    if (!req.file) {
      return next(new AppError('No image file provided', 400));
    }

    const [rows] = await pool.query('SELECT profile_image FROM users WHERE id = ? LIMIT 1', [req.user.userId]);
    if (rows.length === 0) {
      return next(new AppError('User not found', 404));
    }
    const user = rows[0];

    if (user.profile_image) {
      const oldPath = path.join(process.cwd(), user.profile_image);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    const avatarPath = `uploads/avatars/${req.file.filename}`;
    await pool.query('UPDATE users SET profile_image = ?, updated_at = NOW() WHERE id = ?', [
      avatarPath,
      req.user.userId,
    ]);

    res.json({
      message: 'Avatar uploaded successfully',
      profileImage: avatarPath
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAvatar = async (req, res, next) => {
  try {
    const pool = getPool();
    const [rows] = await pool.query('SELECT profile_image FROM users WHERE id = ? LIMIT 1', [req.user.userId]);
    if (rows.length === 0) {
      return next(new AppError('User not found', 404));
    }
    const user = rows[0];

    if (user.profile_image) {
      const filePath = path.join(process.cwd(), user.profile_image);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await pool.query('UPDATE users SET profile_image = "", updated_at = NOW() WHERE id = ?', [req.user.userId]);

    res.json({ message: 'Avatar deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const deleteAccount = async (req, res, next) => {
  try {
    const pool = getPool();
    const [rows] = await pool.query('SELECT profile_image FROM users WHERE id = ? LIMIT 1', [req.user.userId]);
    if (rows.length === 0) {
      return next(new AppError('User not found', 404));
    }
    const user = rows[0];

    if (user.profile_image) {
      const filePath = path.join(process.cwd(), user.profile_image);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await pool.query('DELETE FROM users WHERE id = ?', [req.user.userId]);
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    next(error);
  }
};
