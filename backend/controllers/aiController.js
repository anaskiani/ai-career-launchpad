import { getPool } from '../config/mysql.js';
import { AppError } from '../middleware/errorHandler.js';
import { generateChatReply } from '../utils/chatProvider.js';
import { detectTopic } from '../utils/chatPrompts.js';
import { newId } from '../utils/dbHelpers.js';

export const chatWithAssistant = async (req, res, next) => {
  try {
    const { message, topic } = req.body;
    const pool = getPool();

    if (!message?.trim()) {
      return next(new AppError('Message is required', 400));
    }

    const resolvedTopic = topic || detectTopic(message);

    const [history] = await pool.query(
      `SELECT role, content FROM chat_messages
       WHERE user_id = ?
       ORDER BY created_at DESC
       LIMIT 8`,
      [req.user.userId]
    );

    const historyInOrder = [...history].reverse();
    const { reply, provider, fallbackUsed } = await generateChatReply({
      topic: resolvedTopic,
      message,
      history: historyInOrder,
    });

    await pool.query(
      `INSERT INTO chat_messages (id, user_id, role, topic, content) VALUES
      (?, ?, 'user', ?, ?),
      (?, ?, 'assistant', ?, ?)`,
      [
        newId(),
        req.user.userId,
        resolvedTopic,
        message,
        newId(),
        req.user.userId,
        resolvedTopic,
        reply,
      ]
    );

    res.json({
      reply,
      topic: resolvedTopic,
      provider,
      fallbackUsed,
    });
  } catch (error) {
    next(error);
  }
};

export const getChatHistory = async (req, res, next) => {
  try {
    const pool = getPool();
    const [messages] = await pool.query(
      `SELECT id AS _id, user_id AS userId, role, topic, content, created_at AS createdAt
       FROM chat_messages
       WHERE user_id = ?
       ORDER BY created_at ASC
       LIMIT 50`,
      [req.user.userId]
    );

    res.json({
      messages,
    });
  } catch (error) {
    next(error);
  }
};
