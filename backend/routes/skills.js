import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  getRoles,
  getRoleSkills,
  analyzeGap,
  getHistory,
  getAnalysis,
  deleteAnalysis,
} from '../controllers/skillController.js';

const router = express.Router();

router.get('/roles', protect, getRoles);
router.get('/roles/:role', protect, getRoleSkills);
router.post('/analyze', protect, analyzeGap);
router.get('/history', protect, getHistory);
router.get('/analysis/:id', protect, getAnalysis);
router.delete('/analysis/:id', protect, deleteAnalysis);

export default router;
