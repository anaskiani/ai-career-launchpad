import { getPool } from '../config/mysql.js';
import { AppError } from '../middleware/errorHandler.js';
import { calculateProfileCompletion, fromJson } from '../utils/dbHelpers.js';

export const getDashboardSummary = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const pool = getPool();

    const [
      userRows,
      resumeRows,
      savedJobsRows,
      latestSkillGapRows,
      interviewStatsRows,
      chatStatsRows,
      recentInterviewsRows,
      recentChatsRows,
    ] = await Promise.all([
      pool.query('SELECT * FROM users WHERE id = ? LIMIT 1', [userId]).then(([rows]) => rows),
      pool.query('SELECT * FROM resumes WHERE user_id = ? LIMIT 1', [userId]).then(([rows]) => rows),
      pool.query('SELECT COUNT(*) AS count FROM saved_jobs WHERE user_id = ?', [userId]).then(([rows]) => rows),
      pool
        .query(
          `SELECT target_role, match_percentage, missing_skills_json, matching_skills_json, created_at
           FROM skill_gaps WHERE user_id = ? ORDER BY created_at DESC LIMIT 1`,
          [userId]
        )
        .then(([rows]) => rows),
      pool
        .query(
          `SELECT id, status, questions_json
           FROM interviews WHERE user_id = ?`,
          [userId]
        )
        .then(([rows]) => rows),
      pool
        .query(
          `SELECT
            COUNT(*) AS totalMessages,
            SUM(CASE WHEN role = 'assistant' THEN 1 ELSE 0 END) AS assistantReplies
           FROM chat_messages WHERE user_id = ?`,
          [userId]
        )
        .then(([rows]) => rows),
      pool
        .query(
          `SELECT id, role, status, questions_json, created_at
           FROM interviews WHERE user_id = ? ORDER BY created_at DESC LIMIT 5`,
          [userId]
        )
        .then(([rows]) => rows),
      pool
        .query(
          `SELECT id, topic, content, created_at
           FROM chat_messages
           WHERE user_id = ? AND role = 'assistant'
           ORDER BY created_at DESC LIMIT 5`,
          [userId]
        )
        .then(([rows]) => rows),
    ]);

    const user = userRows[0];
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    const resume = resumeRows[0] || null;
    const savedJobsCount = Number(savedJobsRows[0]?.count || 0);
    const latestSkillGap = latestSkillGapRows[0] || null;

    const interviewSummary = {
      totalSessions: interviewStatsRows.length,
      completedSessions: interviewStatsRows.filter((row) => row.status === 'completed').length,
      totalQuestionsAnswered: interviewStatsRows.reduce((sum, row) => {
        const questions = fromJson(row.questions_json, []);
        return sum + questions.filter((question) => question?.answer?.trim()).length;
      }, 0),
    };

    const chatbotSummary = chatStatsRows[0] || {
      totalMessages: 0,
      assistantReplies: 0,
    };

    const skills = fromJson(user.skills_json, []);
    const profileCompletion = calculateProfileCompletion(user);
    const parsedLatestSkillGap = latestSkillGap
      ? {
          targetRole: latestSkillGap.target_role,
          matchPercentage: Number(latestSkillGap.match_percentage || 0),
          missingSkillsCount: fromJson(latestSkillGap.missing_skills_json, []).length,
          matchingSkillsCount: fromJson(latestSkillGap.matching_skills_json, []).length,
          lastAnalyzedAt: latestSkillGap.created_at,
        }
      : null;

    res.json({
      summary: {
        user: {
          name: user.name,
          targetRole: user.target_role || '',
          profileCompletion,
          skillsCount: skills.length,
        },
        resume: {
          exists: Boolean(resume),
          title: resume?.title || 'No resume yet',
          lastUpdated: resume?.updated_at || null,
        },
        jobs: {
          savedCount: savedJobsCount,
        },
        skillGap: parsedLatestSkillGap,
        interviews: interviewSummary,
        chatbot: chatbotSummary,
      },
      charts: {
        overview: [
          { name: 'Saved Jobs', value: savedJobsCount },
          { name: 'Skills', value: skills.length },
          { name: 'Interviews', value: Number(interviewSummary.totalSessions || 0) },
          { name: 'Chat Replies', value: Number(chatbotSummary.assistantReplies || 0) },
        ],
        completion: [
          { name: 'Profile', value: profileCompletion },
          { name: 'Skill Match', value: parsedLatestSkillGap?.matchPercentage || 0 },
        ],
      },
      recentActivity: {
        interviews: recentInterviewsRows.map((item) => {
          const questions = fromJson(item.questions_json, []);
          return {
            _id: item.id,
            role: item.role,
            status: item.status,
            createdAt: item.created_at,
            answeredCount: questions.filter((question) => question?.answer?.trim()).length,
          };
        }),
        chatbot: recentChatsRows.map((item) => ({
          _id: item.id,
          topic: item.topic,
          content: item.content,
          createdAt: item.created_at,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
};
