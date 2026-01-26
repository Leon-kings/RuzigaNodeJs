// const { body, validationResult } = require('express-validator');

// const validateBooking = [
//   body('fullName').notEmpty().withMessage('Full name is required'),
//   body('email').isEmail().withMessage('Valid email is required'),
//   body('phone').notEmpty().withMessage('Phone number is required'),
//   body('targetCountry').notEmpty().withMessage('Target country is required'),
//   body('program').notEmpty().withMessage('Program is required'),
//   body('startDate').isDate().withMessage('Valid start date is required'),
//   body('serviceId').notEmpty().withMessage('Service ID is required'),
// ];

// const validateService = [
//   body('title').notEmpty().withMessage('Service title is required'),
//   body('description').notEmpty().withMessage('Service description is required'),
//   body('priceUSD').notEmpty().withMessage('USD price is required'),
//   body('priceRWF').notEmpty().withMessage('RWF price is required'),
//   body('category').notEmpty().withMessage('Category is required'),
// ];

// const validateUser = [
//   body('email').isEmail().withMessage('Valid email is required'),
//   body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
//   body('fullName').notEmpty().withMessage('Full name is required'),
// ];

// const validateResult = (req, res, next) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({
//       success: false,
//       errors: errors.array().map(err => ({
//         field: err.param,
//         message: err.msg
//       }))
//     });
//   }
//   next();
// };

// module.exports = {
//   validateBooking,
//   validateService,
//   validateUser,
//   validateResult
// };











const Joi = require('joi');

exports.createBookingSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  country: Joi.string().required(),
  service: Joi.string().required(),
  serviceCategory: Joi.string().optional(),
  date: Joi.date().required(),
  startDate: Joi.date().required(),
  educationLevel: Joi.string().allow(""),
  program: Joi.string().allow(""),
  budget: Joi.string().allow(""),
  message: Joi.string().allow("")
});
