import { getPool } from '../config/mysql.js';
import { AppError } from '../middleware/errorHandler.js';
import { fromJson, newId, toJson } from '../utils/dbHelpers.js';

const mapResume = (row) => ({
  _id: row.id,
  id: row.id,
  userId: row.user_id,
  title: row.title || 'My Resume',
  personalInfo: fromJson(row.personal_info_json, {}),
  experiences: fromJson(row.experiences_json, []),
  education: fromJson(row.education_json, []),
  skills: fromJson(row.skills_json, []),
  certifications: fromJson(row.certifications_json, []),
  projects: fromJson(row.projects_json, []),
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export const getResume = async (req, res, next) => {
  try {
    const pool = getPool();
    const [rows] = await pool.query('SELECT * FROM resumes WHERE user_id = ? LIMIT 1', [req.user.userId]);
    res.json(rows.length ? mapResume(rows[0]) : null);
  } catch (error) {
    next(error);
  }
};

export const createResume = async (req, res, next) => {
  try {
    const pool = getPool();
    const [existingRows] = await pool.query('SELECT id FROM resumes WHERE user_id = ? LIMIT 1', [req.user.userId]);
    if (existingRows.length > 0) {
      return next(new AppError('Resume already exists. Use PUT to update.', 400));
    }

    const resumeId = newId();
    const payload = req.body || {};

    await pool.query(
      `INSERT INTO resumes (
        id, user_id, title, personal_info_json, experiences_json,
        education_json, skills_json, certifications_json, projects_json
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        resumeId,
        req.user.userId,
        payload.title || 'My Resume',
        toJson(payload.personalInfo, {}),
        toJson(payload.experiences, []),
        toJson(payload.education, []),
        toJson(payload.skills, []),
        toJson(payload.certifications, []),
        toJson(payload.projects, []),
      ]
    );

    await pool.query('UPDATE users SET resume_id = ?, updated_at = NOW() WHERE id = ?', [resumeId, req.user.userId]);

    const [rows] = await pool.query('SELECT * FROM resumes WHERE id = ? LIMIT 1', [resumeId]);

    res.status(201).json({ message: 'Resume created', resume: mapResume(rows[0]) });
  } catch (error) {
    next(error);
  }
};

export const updateResume = async (req, res, next) => {
  try {
    const pool = getPool();
    const [existingRows] = await pool.query(
      'SELECT id FROM resumes WHERE id = ? AND user_id = ? LIMIT 1',
      [req.params.id, req.user.userId]
    );

    if (existingRows.length === 0) {
      return next(new AppError('Resume not found', 404));
    }

    const updates = [];
    const values = [];
    const payloadToColumn = {
      title: 'title',
      personalInfo: 'personal_info_json',
      experiences: 'experiences_json',
      education: 'education_json',
      skills: 'skills_json',
      certifications: 'certifications_json',
      projects: 'projects_json',
    };

    for (const [key, column] of Object.entries(payloadToColumn)) {
      if (req.body[key] !== undefined) {
        updates.push(`${column} = ?`);
        if (column.endsWith('_json')) {
          values.push(toJson(req.body[key], Array.isArray(req.body[key]) ? [] : {}));
        } else {
          values.push(req.body[key]);
        }
      }
    }

    if (updates.length > 0) {
      values.push(req.params.id, req.user.userId);
      await pool.query(
        `UPDATE resumes SET ${updates.join(', ')}, updated_at = NOW() WHERE id = ? AND user_id = ?`,
        values
      );
    }

    const [rows] = await pool.query('SELECT * FROM resumes WHERE id = ? LIMIT 1', [req.params.id]);
    res.json({ message: 'Resume updated', resume: mapResume(rows[0]) });
  } catch (error) {
    next(error);
  }
};

export const deleteResume = async (req, res, next) => {
  try {
    const pool = getPool();
    const [result] = await pool.query('DELETE FROM resumes WHERE id = ? AND user_id = ?', [
      req.params.id,
      req.user.userId,
    ]);

    if (result.affectedRows === 0) {
      return next(new AppError('Resume not found', 404));
    }

    await pool.query('UPDATE users SET resume_id = NULL, updated_at = NOW() WHERE id = ?', [req.user.userId]);

    res.json({ message: 'Resume deleted' });
  } catch (error) {
    next(error);
  }
};
