import { getPool } from '../config/mysql.js';
import { interviewQuestionBank, getAvailableInterviewRoles } from '../data/interviewQuestions.js';
import { AppError } from '../middleware/errorHandler.js';
import { fromJson, newId, toJson } from '../utils/dbHelpers.js';
import { scoreInterviewSession } from '../utils/interviewScoring.js';

const buildQuestionsForRole = (role, setIndex = 0) => {
  const sets = interviewQuestionBank[role];
  if (!sets || sets.length === 0) {
    return null;
  }
  
  // Pick the set sequentially based on previous attempt count
  const selectedSet = sets[setIndex % sets.length];

  // Strip correct answers to prevent cheating
  return selectedSet.map((q) => ({
    question: q.question,
    options: q.options,
    answer: '', // User's selected option
    duration: 0,
  }));
};

const mapInterview = (row) => ({
  _id: row.id,
  userId: row.user_id,
  role: row.role,
  category: row.category,
  status: row.status,
  questions: fromJson(row.questions_json, []),
  totalDuration: row.total_duration,
  score: row.score,
  feedback: row.feedback,
  completedAt: row.completed_at,
  createdAt: row.created_at,
});

export const getInterviewRoles = async (req, res) => {
  res.json({
    roles: getAvailableInterviewRoles(),
  });
};

export const getInterviewQuestions = async (req, res, next) => {
  try {
    const role = req.query.role || req.body.role;
    const questions = buildQuestionsForRole(role);

    if (!questions) {
      return next(new AppError('Unsupported interview role', 400));
    }

    res.json({
      role,
      questions,
    });
  } catch (error) {
    next(error);
  }
};

export const startInterview = async (req, res, next) => {
  try {
    const { role } = req.body;
    const pool = getPool();
    
    const [historyRows] = await pool.query(
      'SELECT COUNT(*) as count FROM interviews WHERE user_id = ? AND role = ?',
      [req.user.userId, role]
    );
    const count = historyRows[0].count;

    const questions = buildQuestionsForRole(role, count);

    if (!questions) {
      return next(new AppError('Unsupported interview role', 400));
    }

    const interviewId = newId();
    await pool.query(
      `INSERT INTO interviews (id, user_id, role, category, status, questions_json)
       VALUES (?, ?, ?, 'Technical', 'in_progress', ?)`,
      [interviewId, req.user.userId, role, toJson(questions)]
    );
    const [rows] = await pool.query('SELECT * FROM interviews WHERE id = ? LIMIT 1', [interviewId]);

    res.status(201).json({
      interview: mapInterview(rows[0]),
    });
  } catch (error) {
    next(error);
  }
};

export const saveInterviewAnswers = async (req, res, next) => {
  try {
    const pool = getPool();
    const { interviewId } = req.params;
    const { questions, totalDuration } = req.body;

    const [rows] = await pool.query(
      'SELECT * FROM interviews WHERE id = ? AND user_id = ? LIMIT 1',
      [interviewId, req.user.userId]
    );
    if (rows.length === 0) {
      return next(new AppError('Interview session not found', 404));
    }

    await pool.query(
      `UPDATE interviews
       SET questions_json = ?, total_duration = COALESCE(?, total_duration)
       WHERE id = ? AND user_id = ?`,
      [toJson(questions, []), totalDuration || null, interviewId, req.user.userId]
    );
    const [updatedRows] = await pool.query(
      'SELECT * FROM interviews WHERE id = ? AND user_id = ? LIMIT 1',
      [interviewId, req.user.userId]
    );

    res.json({
      message: 'Answers saved',
      interview: mapInterview(updatedRows[0]),
    });
  } catch (error) {
    next(error);
  }
};

export const submitInterview = async (req, res, next) => {
  try {
    const pool = getPool();
    const { interviewId } = req.params;
    const { questions: submittedQuestions, totalDuration } = req.body || {};

    const [rows] = await pool.query(
      'SELECT * FROM interviews WHERE id = ? AND user_id = ? LIMIT 1',
      [interviewId, req.user.userId]
    );
    if (rows.length === 0) {
      return next(new AppError('Interview session not found', 404));
    }

    const existingQuestions = fromJson(rows[0].questions_json, []);
    const questionsToScore = Array.isArray(submittedQuestions) && submittedQuestions.length > 0
      ? submittedQuestions
      : existingQuestions;

    // Retrieve original sets to find correct answers
    const roleSets = interviewQuestionBank[rows[0].role] || [];
    
    // Grade MCQ Quiz
    let score = 0;
    const scoredQuestions = questionsToScore.map(q => {
      // Find the original question in any set
      let correctAns = '';
      for (const set of roleSets) {
        const found = set.find(sq => sq.question === q.question);
        if (found) { correctAns = found.correctAnswer; break; }
      }
      
      const isCorrect = q.answer && q.answer === correctAns;
      if (isCorrect) score += 10; // 10 points per question = 100 max

      return {
        ...q,
        isCorrect,
        correctAnswer: correctAns
      };
    });

    const feedback = `You scored ${score}/100. Keep practicing!`;

    await pool.query(
      `UPDATE interviews
       SET status = 'completed',
           questions_json = ?,
           score = ?,
           feedback = ?,
           total_duration = COALESCE(?, total_duration),
           completed_at = NOW()
       WHERE id = ? AND user_id = ?`,
      [
        toJson(scoredQuestions, []),
        score,
        feedback,
        totalDuration || null,
        interviewId,
        req.user.userId,
      ]
    );
    const [updatedRows] = await pool.query(
      'SELECT * FROM interviews WHERE id = ? AND user_id = ? LIMIT 1',
      [interviewId, req.user.userId]
    );

    res.json({
      message: 'Interview submitted successfully',
      interview: mapInterview(updatedRows[0]),
      scoringMode: 'local',
    });
  } catch (error) {
    next(error);
  }
};

export const getInterviewHistory = async (req, res, next) => {
  try {
    const pool = getPool();
    const [rows] = await pool.query(
      'SELECT * FROM interviews WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.userId]
    );

    res.json({
      history: rows.map(mapInterview),
    });
  } catch (error) {
    next(error);
  }
};

export const getInterviewSession = async (req, res, next) => {
  try {
    const pool = getPool();
    const { interviewId } = req.params;

    const [rows] = await pool.query(
      'SELECT * FROM interviews WHERE id = ? AND user_id = ? LIMIT 1',
      [interviewId, req.user.userId]
    );
    if (rows.length === 0) {
      return next(new AppError('Interview session not found', 404));
    }

    res.json({
      interview: mapInterview(rows[0]),
    });
  } catch (error) {
    next(error);
  }
};
