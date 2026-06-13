import { getPool } from '../config/mysql.js';
import { AppError } from '../middleware/errorHandler.js';
import { analyzeSkillGap, getAvailableRoles, getSkillsForRole } from '../data/skillRolesData.js';
import { fromJson, newId, toJson } from '../utils/dbHelpers.js';

const mapSkillGap = (row) => ({
  _id: row.id,
  userId: row.user_id,
  targetRole: row.target_role,
  userSkills: fromJson(row.user_skills_json, []),
  requiredSkills: fromJson(row.required_skills_json, []),
  matchingSkills: fromJson(row.matching_skills_json, []),
  missingSkills: fromJson(row.missing_skills_json, []),
  matchPercentage: Number(row.match_percentage || 0),
  missingDetails: fromJson(row.missing_details_json, []),
  roadmap: fromJson(row.roadmap_json, []),
  recommendations: fromJson(row.recommendations_json, []),
  createdAt: row.created_at,
});

// GET /api/skills/roles — list available roles
export const getRoles = (req, res) => {
  res.json({ roles: getAvailableRoles() });
};

// GET /api/skills/roles/:role — get skills for a specific role
export const getRoleSkills = (req, res, next) => {
  const roleData = getSkillsForRole(req.params.role);
  if (!roleData) {
    return next(new AppError('Role not found', 404));
  }
  res.json({ role: req.params.role, ...roleData });
};

// POST /api/skills/analyze — run skill gap analysis
export const analyzeGap = async (req, res, next) => {
  try {
    const { targetRole } = req.body;
    if (!targetRole) {
      return next(new AppError('Target role is required', 400));
    }

    const pool = getPool();
    const [userRows] = await pool.query('SELECT skills_json FROM users WHERE id = ? LIMIT 1', [req.user.userId]);
    if (userRows.length === 0) {
      return next(new AppError('User not found', 404));
    }

    const userSkills = fromJson(userRows[0].skills_json, []);

    // Run analysis
    const result = analyzeSkillGap(userSkills, targetRole);
    if (!result) {
      return next(new AppError('Invalid target role', 400));
    }

    const analysisId = newId();
    await pool.query(
      `INSERT INTO skill_gaps (
        id, user_id, target_role, user_skills_json, required_skills_json,
        matching_skills_json, missing_skills_json, match_percentage,
        missing_details_json, roadmap_json, recommendations_json
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        analysisId,
        req.user.userId,
        result.targetRole,
        toJson(userSkills),
        toJson(result.matchingSkills.concat(result.missingSkills)),
        toJson(result.matchingSkills),
        toJson(result.missingSkills),
        result.matchPercentage,
        toJson(result.missingDetails),
        toJson(result.roadmap),
        toJson(result.recommendations),
      ]
    );

    res.json({ analysis: { _id: analysisId, ...result } });
  } catch (error) {
    next(error);
  }
};

// GET /api/skills/history — get user's analysis history
export const getHistory = async (req, res, next) => {
  try {
    const pool = getPool();
    const [rows] = await pool.query(
      `SELECT id, target_role, match_percentage, matching_skills_json, missing_skills_json, created_at
       FROM skill_gaps WHERE user_id = ? ORDER BY created_at DESC LIMIT 10`,
      [req.user.userId]
    );

    const history = rows.map((row) => ({
      _id: row.id,
      targetRole: row.target_role,
      matchPercentage: Number(row.match_percentage || 0),
      matchingSkills: fromJson(row.matching_skills_json, []),
      missingSkills: fromJson(row.missing_skills_json, []),
      createdAt: row.created_at,
    }));

    res.json({ history });
  } catch (error) {
    next(error);
  }
};

// GET /api/skills/analysis/:id — get specific analysis
export const getAnalysis = async (req, res, next) => {
  try {
    const pool = getPool();
    const [rows] = await pool.query(
      'SELECT * FROM skill_gaps WHERE id = ? AND user_id = ? LIMIT 1',
      [req.params.id, req.user.userId]
    );

    if (rows.length === 0) {
      return next(new AppError('Analysis not found', 404));
    }

    res.json({ analysis: mapSkillGap(rows[0]) });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/skills/analysis/:id — delete analysis
export const deleteAnalysis = async (req, res, next) => {
  try {
    const pool = getPool();
    const [result] = await pool.query('DELETE FROM skill_gaps WHERE id = ? AND user_id = ?', [
      req.params.id,
      req.user.userId,
    ]);

    if (result.affectedRows === 0) {
      return next(new AppError('Analysis not found', 404));
    }

    res.json({ message: 'Analysis deleted' });
  } catch (error) {
    next(error);
  }
};
