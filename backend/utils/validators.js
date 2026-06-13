import { body, validationResult } from 'express-validator';

export const validateRegister = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('securityQuestion').notEmpty().withMessage('Security question answer is required'),
  body('securityPIN').isLength({ min: 4 }).withMessage('Security PIN must be at least 4 digits')
];

export const validateLogin = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
];

export const validateForgotPassword = [
  body('email').isEmail().withMessage('Valid email is required'),
];

export const validateResetPassword = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('otp').notEmpty().withMessage('Reset code is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

export const validateEmail = [
  body('email').isEmail().withMessage('Valid email is required')
];

export const validateProfileUpdate = [
  body('name')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be 2–50 characters'),
  body('phone')
    .optional()
    .matches(/^[\d\s\-+()]*$/)
    .withMessage('Invalid phone number format'),
  body('bio')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Bio must be under 500 characters'),
  body('skills')
    .optional()
    .isArray({ max: 20 })
    .withMessage('Maximum 20 skills allowed'),
  body('skills.*')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Each skill must be under 50 characters'),
  body('experience')
    .optional()
    .isInt({ min: 0, max: 50 })
    .withMessage('Experience must be 0–50 years'),
  body('github')
    .optional({ values: 'falsy' })
    .isURL()
    .withMessage('GitHub must be a valid URL'),
  body('linkedin')
    .optional({ values: 'falsy' })
    .isURL()
    .withMessage('LinkedIn must be a valid URL'),
  body('portfolio')
    .optional({ values: 'falsy' })
    .isURL()
    .withMessage('Portfolio must be a valid URL'),
  body('location')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Location must be under 100 characters'),
  body('university')
    .optional()
    .isLength({ max: 100 })
    .withMessage('University must be under 100 characters'),
  body('graduationYear')
    .optional({ values: 'null' })
    .isInt({ min: 1950, max: 2040 })
    .withMessage('Graduation year must be between 1950–2040'),
  body('targetRole')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Target role must be under 100 characters'),
  body('education')
    .optional()
    .isArray()
    .withMessage('Education must be an array'),
  body('education.*.institution')
    .optional()
    .notEmpty()
    .withMessage('Institution is required for each education entry'),
  body('education.*.degree')
    .optional()
    .notEmpty()
    .withMessage('Degree is required for each education entry'),
  body('workExperience')
    .optional()
    .isArray()
    .withMessage('Work experience must be an array'),
  body('workExperience.*.title')
    .optional()
    .notEmpty()
    .withMessage('Title is required for each work entry'),
  body('workExperience.*.company')
    .optional()
    .notEmpty()
    .withMessage('Company is required for each work entry'),
];

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
