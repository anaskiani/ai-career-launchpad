import express from 'express';
import { getProfile, updateProfile, uploadAvatar, deleteAvatar, deleteAccount } from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';
import { uploadAvatar as uploadAvatarMiddleware } from '../middleware/uploadMiddleware.js';
import { validateProfileUpdate, validate } from '../utils/validators.js';

const router = express.Router();

router.get('/profile', protect, getProfile);
router.put('/profile', protect, validateProfileUpdate, validate, updateProfile);
router.post('/profile/avatar', protect, uploadAvatarMiddleware, uploadAvatar);
router.delete('/profile/avatar', protect, deleteAvatar);
router.delete('/account', protect, deleteAccount);

export default router;
