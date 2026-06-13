import express from 'express';
import {
  register,
  verifyEmail,
  login,
  verifySecurityQuestion,
  verifySecurityPIN,
  forgotPassword,
  resetPassword,
  logout,
} from '../controllers/authController.js';
import {
  validateRegister,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
  validate,
} from '../utils/validators.js';

const router = express.Router();

router.post('/register', validateRegister, validate, register);
router.post('/verify-email', verifyEmail);
router.post('/login', validateLogin, validate, login);
router.post('/verify-security-question', verifySecurityQuestion);
router.post('/verify-security-pin', verifySecurityPIN);
router.post('/forgot-password', validateForgotPassword, validate, forgotPassword);
router.post('/reset-password', validateResetPassword, validate, resetPassword);
router.post('/logout', logout);

export default router;
