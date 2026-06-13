import express from 'express';
import { protect } from '../middleware/auth.js';
import { chatWithAssistant, getChatHistory } from '../controllers/aiController.js';

const router = express.Router();

router.get('/history', protect, getChatHistory);
router.post('/chat', protect, chatWithAssistant);

export default router;
