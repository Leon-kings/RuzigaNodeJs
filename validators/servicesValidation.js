const { body } = require('express-validator');

const validateFormData = [
  body('fullName')
    .trim()
    .notEmpty().withMessage('Full name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Full name must be between 2 and 100 characters'),
  
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email address')
    .normalizeEmail(),
  
  body('phone')
    .trim()
    .notEmpty().withMessage('Phone number is required')
    .matches(/^[\+]?[0-9\s\-\(\)]+$/).withMessage('Please enter a valid phone number'),
  
  body('targetCountry')
    .trim()
    .notEmpty().withMessage('Target country is required'),
  
  body('program')
    .trim()
    .notEmpty().withMessage('Program is required'),
  
  body('startDate')
    .notEmpty().withMessage('Start date is required')
    .isISO8601().withMessage('Please enter a valid date')
    .custom(value => {
      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate >= today;
    }).withMessage('Start date must be today or in the future'),
  
  body('educationLevel')
    .trim()
    .notEmpty().withMessage('Education level is required'),
  
  body('budget')
    .trim()
    .notEmpty().withMessage('Budget is required'),
  
  body('requirements')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('Requirements must not exceed 1000 characters')
];

module.exports = {
  validateFormData
};