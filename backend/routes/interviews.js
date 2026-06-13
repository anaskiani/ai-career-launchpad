import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  getInterviewHistory,
  getInterviewQuestions,
  getInterviewRoles,
  getInterviewSession,
  saveInterviewAnswers,
  startInterview,
  submitInterview,
} from '../controllers/interviewController.js';

const router = express.Router();

router.get('/roles', protect, getInterviewRoles);
router.get('/questions', protect, getInterviewQuestions);
router.get('/history', protect, getInterviewHistory);
router.get('/:interviewId', protect, getInterviewSession);
router.post('/start', protect, startInterview);
router.put('/:interviewId/answers', protect, saveInterviewAnswers);
router.post('/:interviewId/submit', protect, submitInterview);

export default router;
