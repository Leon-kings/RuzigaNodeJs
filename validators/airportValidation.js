const { body } = require('express-validator');

exports.validateBooking = [
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').notEmpty().withMessage('Phone number is required'),
  body('flightNumber').notEmpty().withMessage('Flight number is required'),
  body('arrivalDate').isISO8601().withMessage('Valid arrival date is required'),
  body('arrivalTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid arrival time is required'),
  body('serviceType').isIn(['standard', 'vip_service', 'executive', 'family', 'group']).withMessage('Invalid service type'),
  body('numberOfPassengers').isInt({ min: 1, max: 50 }).withMessage('Number of passengers must be between 1 and 50'),
  body('numberOfBags').optional().isInt({ min: 0 }).withMessage('Number of bags must be non-negative'),
  body('status').optional().isIn(['pending', 'confirmed', 'completed', 'cancelled', 'no_show']).withMessage('Invalid status'),
  body('totalAmount').optional().isFloat({ min: 0 }).withMessage('Total amount must be positive')
];

exports.validateEmail = [
  body('bookingId').notEmpty().withMessage('Booking ID is required'),
  body('emailType').isIn(['confirmation', 'reminder', 'cancellation', 'update']).withMessage('Invalid email type')
];