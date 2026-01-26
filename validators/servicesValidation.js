// const { body } = require('express-validator');

// const validateFormData = [
//   body('fullName')
//     .trim()
//     .notEmpty().withMessage('Full name is required')
//     .isLength({ min: 2, max: 100 }).withMessage('Full name must be between 2 and 100 characters'),
  
//   body('email')
//     .trim()
//     .notEmpty().withMessage('Email is required')
//     .isEmail().withMessage('Please enter a valid email address')
//     .normalizeEmail(),
  
//   body('phone')
//     .trim()
//     .notEmpty().withMessage('Phone number is required')
//     .matches(/^[\+]?[0-9\s\-\(\)]+$/).withMessage('Please enter a valid phone number'),
  
//   body('targetCountry')
//     .trim()
//     .notEmpty().withMessage('Target country is required'),
  
//   body('program')
//     .trim()
//     .notEmpty().withMessage('Program is required'),
  
//   body('startDate')
//     .notEmpty().withMessage('Start date is required')
//     .isISO8601().withMessage('Please enter a valid date')
//     .custom(value => {
//       const selectedDate = new Date(value);
//       const today = new Date();
//       today.setHours(0, 0, 0, 0);
//       return selectedDate >= today;
//     }).withMessage('Start date must be today or in the future'),
  
//   body('educationLevel')
//     .trim()
//     .notEmpty().withMessage('Education level is required'),
  
//   body('budget')
//     .trim()
//     .notEmpty().withMessage('Budget is required'),
  
//   body('requirements')
//     .optional()
//     .trim()
//     .isLength({ max: 1000 }).withMessage('Requirements must not exceed 1000 characters')
// ];

// module.exports = {
//   validateFormData
// };









const Joi = require('joi');

exports.validateFormData = Joi.object({
  name: Joi.string().trim().required().messages({
    'string.empty': 'Name is required'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Email must be valid',
    'string.empty': 'Email is required'
  }),
  phone: Joi.string().trim().required().messages({
    'string.empty': 'Phone is required'
  }),
  country: Joi.string().trim().required().messages({
    'string.empty': 'Country is required'
  }),
  service: Joi.string().trim().required().messages({
    'string.empty': 'Service is required'
  }),
  serviceCategory: Joi.string().valid("admissions", "scholarship", "visa", "support").optional(),
  date: Joi.date().required().messages({
    'date.base': 'Date must be a valid date',
    'any.required': 'Date is required'
  }),
  startDate: Joi.date().required().messages({
    'date.base': 'Start date must be a valid date',
    'any.required': 'Start date is required'
  }),
  educationLevel: Joi.string().valid("highschool", "bachelor", "master", "phd", "").optional(),
  program: Joi.string().allow("").optional(),
  budget: Joi.string().valid("low", "medium", "high", "premium", "").optional(),
  message: Joi.string().allow("").optional(),
  notes: Joi.array().items(
    Joi.object({
      content: Joi.string().required(),
      addedAt: Joi.date().optional()
    })
  ).optional(),
  status: Joi.string().valid("pending", "contacted", "in_progress", "completed", "cancelled").optional()
});
