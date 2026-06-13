import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  getResume,
  createResume,
  updateResume,
  deleteResume,
} from '../controllers/resumeController.js';

const router = express.Router();

router.get('/', protect, getResume);
router.post('/', protect, createResume);
router.put('/:id', protect, updateResume);
router.delete('/:id', protect, deleteResume);

export default router;
