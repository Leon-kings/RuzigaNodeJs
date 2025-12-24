const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const faqController = require('../controllers/faqController');

// Middleware for admin routes (simple token check)
const adminAuth = (req, res, next) => {
  const token = req.headers['admin-token'] || req.query.token;
  const validToken = process.env.ADMIN_TOKEN || 'admin123';
  
  if (token === validToken) {
    next();
  } else {
    res.status(401).json({
      status: 'error',
      message: 'Unauthorized: Invalid admin token'
    });
  }
};

// Public routes
router.get('/faqs', faqController.getAllFAQs);
router.get('/faqs/:id', faqController.getFAQById);

// Submit question (public)
router.post('/questions/submit', 
  [
    body('question').trim().notEmpty().withMessage('Question is required')
      .isLength({ min: 10 }).withMessage('Question must be at least 10 characters')
      .isLength({ max: 500 }).withMessage('Question cannot exceed 500 characters'),
    body('email').optional().isEmail().withMessage('Please provide a valid email'),
    body('name').optional().trim(),
    body('category').optional().isIn([
      'admissions', 'visa', 'accommodation', 'work', 'planning', 'support',
      'funding', 'health', 'culture', 'language', 'cost', 'eligibility',
      'documents', 'family', 'academics'
    ]).withMessage('Invalid category')
  ],
  faqController.submitQuestion
);

// Vote on FAQ
router.post('/faqs/:id/vote',
  [
    body('vote').isIn(['helpful', 'unhelpful']).withMessage('Invalid vote type')
  ],
  faqController.voteFAQ
);

// Admin routes (require admin token)
router.get('/admin/statistics', adminAuth, faqController.getStatistics);
router.post('/admin/stats/daily', adminAuth, faqController.sendDailyStats);

// FAQ management (admin only)
router.put('/admin/faqs/:id', adminAuth, faqController.updateFAQ);
router.delete('/admin/faqs/:id', adminAuth, faqController.deleteFAQ);

// Answer pending question (admin only)
router.post('/admin/questions/:id/answer',
  adminAuth,
  [
    body('answer').trim().notEmpty().withMessage('Answer is required')
      .isLength({ min: 20 }).withMessage('Answer must be at least 20 characters'),
    body('adminEmail').isEmail().withMessage('Valid admin email is required'),
    body('category').optional().isIn([
      'admissions', 'visa', 'accommodation', 'work', 'planning', 'support',
      'funding', 'health', 'culture', 'language', 'cost', 'eligibility',
      'documents', 'family', 'academics'
    ]).withMessage('Invalid category')
  ],
  faqController.answerQuestion
);

// Get pending questions (admin only)
router.get('/admin/questions/pending', adminAuth, async (req, res) => {
  try {
    const faqController = require('../controllers/faqController');
    req.query.status = 'pending';
    return faqController.getAllFAQs(req, res);
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch pending questions',
      error: error.message
    });
  }
});

// Health check
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'FAQ API is healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

module.exports = router;