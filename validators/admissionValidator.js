const { body, param, query } = require('express-validator');

exports.validateApplication = [
  body('firstName')
    .notEmpty().withMessage('First name is required')
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage('First name must be between 2 and 50 characters'),
  
  body('lastName')
    .notEmpty().withMessage('Last name is required')
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage('Last name must be between 2 and 50 characters'),
  
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Valid email is required')
    .normalizeEmail(),
  
  body('phone')
    .notEmpty().withMessage('Phone number is required')
    .matches(/^[\d\s\-\+\(\)]{10,20}$/).withMessage('Valid phone number is required'),
  
  body('nationality')
    .notEmpty().withMessage('Nationality is required'),
  
  body('dateOfBirth')
    .notEmpty().withMessage('Date of birth is required')
    .isISO8601().withMessage('Valid date of birth is required')
    .custom(value => {
      const dob = new Date(value);
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear();
      if (age < 16 || age > 70) {
        throw new Error('Age must be between 16 and 70');
      }
      return true;
    }),
  
  body('currentEducation')
    .notEmpty().withMessage('Current education level is required')
    .isIn(['High School', 'Bachelor Degree', 'Master Degree', 'PhD', 'Diploma', 'Other'])
    .withMessage('Invalid education level'),
  
  body('currentInstitution')
    .notEmpty().withMessage('Current institution is required'),
  
  body('gpa')
    .notEmpty().withMessage('GPA is required')
    .isFloat({ min: 0, max: 4.0 }).withMessage('GPA must be between 0 and 4.0'),
  
  body('targetUniversity')
    .notEmpty().withMessage('Target university is required'),
  
  body('targetCountry')
    .notEmpty().withMessage('Target country is required'),
  
  body('targetProgram')
    .notEmpty().withMessage('Target program is required'),
  
  body('programLevel')
    .notEmpty().withMessage('Program level is required')
    .isIn(['Undergraduate', 'Graduate', 'PhD', 'PostDoc', 'Certificate'])
    .withMessage('Invalid program level'),
  
  body('intakeSeason')
    .notEmpty().withMessage('Intake season is required')
    .isIn(['Fall', 'Spring', 'Summer', 'Winter'])
    .withMessage('Invalid intake season'),
  
  body('intakeYear')
    .notEmpty().withMessage('Intake year is required')
    .isInt({ min: new Date().getFullYear(), max: new Date().getFullYear() + 5 })
    .withMessage(`Intake year must be between ${new Date().getFullYear()} and ${new Date().getFullYear() + 5}`),
  
  body('scholarshipInterest')
    .optional()
    .isIn(['Research Scholarship', 'Merit Scholarship', 'Sports Scholarship', 'Need-based Scholarship', 'Government Scholarship', 'University Scholarship', 'None'])
    .withMessage('Invalid scholarship interest'),
  
  body('scholarshipAmount')
    .optional()
    .isFloat({ min: 0 }).withMessage('Scholarship amount must be positive'),
  
  body('status')
    .optional()
    .isIn(['draft', 'submitted', 'under_review', 'interview_scheduled', 'accepted', 'waitlisted', 'rejected', 'withdrawn', 'deferred'])
    .withMessage('Invalid status'),
  
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'urgent'])
    .withMessage('Invalid priority level'),
  
  body('deadline')
    .optional()
    .isISO8601().withMessage('Valid deadline date is required'),
  
  body('additionalInfo')
    .optional()
    .isLength({ max: 1000 }).withMessage('Additional info must be less than 1000 characters')
];

exports.validateEmail = [
  body('applicationId')
    .notEmpty().withMessage('Application ID is required'),
  
  body('emailType')
    .notEmpty().withMessage('Email type is required')
    .isIn(['welcome', 'document_request', 'interview_invitation', 'decision', 'custom'])
    .withMessage('Invalid email type'),
  
  body('subject')
    .optional()
    .isLength({ max: 200 }).withMessage('Subject must be less than 200 characters'),
  
  body('message')
    .optional()
    .isLength({ max: 5000 }).withMessage('Message must be less than 5000 characters')
];

exports.validateDocument = [
  body('documentType')
    .notEmpty().withMessage('Document type is required')
    .isIn(['transcript', 'recommendation', 'essay', 'resume', 'passport', 'financial', 'other'])
    .withMessage('Invalid document type')
];

exports.validateSearch = [
  query('query')
    .optional()
    .isLength({ min: 2, max: 100 }).withMessage('Search query must be between 2 and 100 characters'),
  
  query('field')
    .optional()
    .isIn(['applicationId', 'firstName', 'lastName', 'email', 'targetUniversity', 'targetProgram'])
    .withMessage('Invalid search field')
];

exports.validateExport = [
  query('format')
    .optional()
    .isIn(['excel', 'csv', 'pdf'])
    .withMessage('Invalid export format')
];