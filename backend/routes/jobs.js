import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  getJobDetails,
  getSavedJobs,
  saveJob,
  searchJobs,
  unsaveJob,
} from '../controllers/jobController.js';

const router = express.Router();

router.get('/search', protect, searchJobs);
router.get('/saved', protect, getSavedJobs);
router.get('/:jobId', protect, getJobDetails);
router.post('/save/:jobId', protect, saveJob);
router.delete('/save/:jobId', protect, unsaveJob);

export default router;
