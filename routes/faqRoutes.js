const express = require('express');
const router = express.Router();
const faqController = require('../controllers/faqController');
const { body, param, query } = require('express-validator');

// ==================== VALIDATION MIDDLEWARE ====================

// FAQ validation
const faqValidation = [
  body('question').notEmpty().withMessage('Question is required'),
  body('answer').notEmpty().withMessage('Answer is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('tags').optional().isArray().withMessage('Tags must be an array'),
  body('isPublished').optional().isBoolean().withMessage('isPublished must be a boolean')
];

// Question validation
const questionValidation = [
  body('question').notEmpty().withMessage('Question is required'),
  body('email').isEmail().withMessage('Valid email is required')
];

// Answer validation
const answerValidation = [
  body('answer').notEmpty().withMessage('Answer is required')
];

// ==================== PUBLIC ROUTES (No Authentication Required) ====================

// Get all published FAQs with pagination
router.get('/', 
  [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    query('category').optional().isString().trim(),
    query('search').optional().isString().trim(),
    query('sort').optional().isString().withMessage('Sort must be a string')
  ],
  faqController.getAllFAQs
);

// Get single FAQ by ID
router.get('/faqs/:id',
  [
    param('id').isMongoId().withMessage('Invalid FAQ ID')
  ],
  faqController.getFAQById
);

// Submit a question (public)
router.post('/questions',
  questionValidation,
  faqController.submitQuestion
);

// Alternative submit question endpoint
router.post('/questions/v2',
  faqController.submitQuestionV2
);

// Get statistics (public, but you might want to protect this)
router.get('/statistics',
  [
    query('period').optional().isIn(['today', 'week', 'month', 'year']).withMessage('Invalid period')
  ],
  faqController.getStatistics
);

// ==================== ADMIN ROUTES (Protected - Add Authentication Middleware) ====================

// Get all questions (admin only)
router.get('/admin/questions',
  [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    query('status').optional().isIn(['pending', 'answered']).withMessage('Invalid status'),
    query('category').optional().isString().trim(),
    query('startDate').optional().isISO8601().withMessage('Invalid start date'),
    query('endDate').optional().isISO8601().withMessage('Invalid end date')
  ],
  // Add authentication middleware here
  // Example: requireAuth, requireAdmin
  faqController.getAllQuestions
);

// Answer a question (admin only)
router.put('/admin/questions/:id/answer',
  [
    param('id').isMongoId().withMessage('Invalid question ID')
  ].concat(answerValidation),
  // Add authentication middleware here
  faqController.answerQuestion
);

// Create FAQ (admin only)
router.post('/admin/faqs',
  faqValidation,
  // Add authentication middleware here
  faqController.createFAQ
);

// Update FAQ (admin only)
router.put('/admin/faqs/:id',
  [
    param('id').isMongoId().withMessage('Invalid FAQ ID')
  ].concat(faqValidation.map(validation => validation.optional())),
  // Add authentication middleware here
  faqController.updateFAQ
);

// Delete FAQ (admin only)
router.delete('/admin/faqs/:id',
  [
    param('id').isMongoId().withMessage('Invalid FAQ ID')
  ],
  // Add authentication middleware here
  faqController.deleteFAQ
);

// Get dashboard data (admin only)
router.get('/admin/dashboard',
  // Add authentication middleware here
  faqController.getDashboardData
);

// Get statistics for admin (with more details)
router.get('/admin/statistics',
  [
    query('period').optional().isIn(['today', 'week', 'month', 'year', 'all']).withMessage('Invalid period'),
    query('startDate').optional().isISO8601().withMessage('Invalid start date'),
    query('endDate').optional().isISO8601().withMessage('Invalid end date')
  ],
  // Add authentication middleware here
  faqController.getStatistics
);

// Get popular categories
router.get('/admin/categories/popular',
  // Add authentication middleware here
  async (req, res) => {
    try {
      const popularCategories = await faqController.getPopularCategories();
      res.status(200).json({
        success: true,
        data: popularCategories
      });
    } catch (error) {
      console.error('Error getting popular categories:', error);
      res.status(500).json({
        success: false,
        message: 'Server error while fetching popular categories'
      });
    }
  }
);

// ==================== WEBHOOK/INTERNAL ROUTES ====================

// Update statistics (can be called via cron job)
router.post('/internal/update-statistics',
  // Add API key authentication or internal auth here
  async (req, res) => {
    try {
      const stats = await faqController.updateStatistics();
      res.status(200).json({
        success: true,
        message: 'Statistics updated successfully',
        data: stats
      });
    } catch (error) {
      console.error('Error updating statistics:', error);
      res.status(500).json({
        success: false,
        message: 'Server error while updating statistics'
      });
    }
  }
);

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'FAQ System is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// ==================== ERROR HANDLING MIDDLEWARE ====================

// 404 handler for FAQ routes
router.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `FAQ route not found: ${req.method} ${req.originalUrl}`
  });
});

// Error handler
router.use((error, req, res, next) => {
  console.error('FAQ Route Error:', error);
  
  // Validation errors
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: Object.values(error.errors).map(err => err.message)
    });
  }
  
  // Mongoose CastError (invalid ID)
  if (error.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format'
    });
  }
  
  // Duplicate key error
  if (error.code === 11000) {
    return res.status(400).json({
      success: false,
      message: 'Duplicate entry found'
    });
  }
  
  // Default error
  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Internal server error'
  });
});

module.exports = router;