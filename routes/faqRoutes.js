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

// Question validation (updated for your frontend format)
const questionValidation = [
  body('question').notEmpty().trim().withMessage('Question is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('timestamp').optional().isISO8601().withMessage('Invalid timestamp format'),
  body('source').optional().isString().trim().withMessage('Source must be a string')
];

// Alternative question validation (more flexible)
const questionValidationV2 = [
  body('question').notEmpty().trim().withMessage('Question is required'),
  body('email').notEmpty().trim().isEmail().withMessage('Valid email is required')
];

// Answer validation
const answerValidation = [
  body('answer').notEmpty().trim().withMessage('Answer is required')
];

// ==================== PUBLIC ROUTES (No Authentication Required) ====================

// Get all published FAQs with pagination
router.get('/faqs', 
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

// Submit a question (public) - matches your frontend POST request
router.post('/faqs/questions',
  questionValidation,
  faqController.submitQuestion
);

// Alternative submit question endpoint (no validation)
router.post('/faqs/questions/v2',
  faqController.submitQuestionV2
);

// Get statistics (public)
router.get('/faqs/statistics',
  [
    query('period').optional().isIn(['today', 'week', 'month', 'year']).withMessage('Invalid period')
  ],
  faqController.getStatistics
);

// Health check endpoint
router.get('/faqs/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'FAQ System is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Test endpoint for database connection
router.get('/faqs/test-db', async (req, res) => {
  try {
    const mongoose = require('mongoose');
    
    // Check connection state
    const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
    const connectionState = states[mongoose.connection.readyState];
    
    // Test database operations
    const { Question } = require('../models/FAQ');
    
    // Count documents
    const count = await Question.countDocuments();
    
    // Try to insert a test document
    const testDoc = await Question.create({
      question: `Test question at ${Date.now()}`,
      email: 'test@example.com',
      name: 'Test User',
      source: 'test-route'
    });
    
    // Find the test document
    const foundDoc = await Question.findById(testDoc._id);
    
    // Clean up test document
    await Question.findByIdAndDelete(testDoc._id);
    
    res.json({
      success: true,
      connection: {
        state: connectionState,
        readyState: mongoose.connection.readyState,
        host: mongoose.connection.host,
        port: mongoose.connection.port,
        name: mongoose.connection.name
      },
      database: {
        totalQuestions: count,
        testInsert: {
          success: !!testDoc._id,
          id: testDoc._id,
          verified: !!foundDoc,
          cleanedUp: true
        }
      }
    });
  } catch (error) {
    console.error('Database test error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// ==================== ADMIN ROUTES (Protected) ====================

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
  // TODO: Add authentication middleware here
  // Example: requireAuth, requireAdmin
  faqController.getAllQuestions
);

// Answer a question (admin only)
router.put('/admin/questions/:id/answer',
  [
    param('id').isMongoId().withMessage('Invalid question ID')
  ].concat(answerValidation),
  // TODO: Add authentication middleware here
  faqController.answerQuestion
);

// Create FAQ (admin only)
router.post('/admin/faqs',
  faqValidation,
  // TODO: Add authentication middleware here
  faqController.createFAQ
);

// Update FAQ (admin only)
router.put('/admin/faqs/:id',
  [
    param('id').isMongoId().withMessage('Invalid FAQ ID')
  ].concat(faqValidation.map(validation => validation.optional())),
  // TODO: Add authentication middleware here
  faqController.updateFAQ
);

// Delete FAQ (admin only)
router.delete('/admin/faqs/:id',
  [
    param('id').isMongoId().withMessage('Invalid FAQ ID')
  ],
  // TODO: Add authentication middleware here
  faqController.deleteFAQ
);

// Get dashboard data (admin only)
router.get('/admin/dashboard',
  // TODO: Add authentication middleware here
  faqController.getDashboardData
);

// Get statistics for admin (with more details)
router.get('/admin/statistics',
  [
    query('period').optional().isIn(['today', 'week', 'month', 'year', 'all']).withMessage('Invalid period'),
    query('startDate').optional().isISO8601().withMessage('Invalid start date'),
    query('endDate').optional().isISO8601().withMessage('Invalid end date')
  ],
  // TODO: Add authentication middleware here
  faqController.getStatistics
);

// Get popular categories
router.get('/admin/categories/popular',
  // TODO: Add authentication middleware here
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
  // TODO: Add API key authentication or internal auth here
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

// ==================== ERROR HANDLING MIDDLEWARE ====================

// 404 handler for FAQ routes
router.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `FAQ route not found: ${req.method} ${req.originalUrl}`,
    availableRoutes: [
      'GET    /faqs',
      'GET    /faqs/:id',
      'POST   /faqs/questions',
      'GET    /faqs/statistics',
      'GET    /faqs/health',
      'GET    /faqs/test-db',
      'GET    /admin/questions',
      'PUT    /admin/questions/:id/answer',
      'POST   /admin/faqs',
      'PUT    /admin/faqs/:id',
      'DELETE /admin/faqs/:id',
      'GET    /admin/dashboard',
      'GET    /admin/statistics'
    ]
  });
});

// Error handler
router.use((error, req, res, next) => {
  console.error('FAQ Route Error:', error);
  
  // Validation errors from express-validator
  if (error.errors && Array.isArray(error.errors)) {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: error.errors.map(err => err.msg)
    });
  }
  
  // Mongoose ValidationError
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
    message: error.message || 'Internal server error',
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
  });
});

module.exports = router;