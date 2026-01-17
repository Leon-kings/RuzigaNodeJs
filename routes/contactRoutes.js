const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { contactValidation, validate } = require('../validators/validation');
const rateLimit = require('express-rate-limit');

// Rate limiting configurations
const contactSubmitLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 contact submissions per windowMs
  message: {
    success: false,
    message: 'Too many contact submissions. Please try again later.'
  },
  skipSuccessfulRequests: false
});



// ========== PUBLIC ROUTES ==========

// Submit contact form (Public)
router.post(
  '/',
  contactSubmitLimiter,
  validate(contactValidation.createContact),
  contactController.createContact
);

// ========== ADMIN ROUTES ==========




// CRUD Operations
router.get(
  '/',
  validate(contactValidation.getContacts, 'query'),
  contactController.getAllContacts
);

router.get('/:id', contactController.getContactById);
router.get('/:email', contactController.getContactsByEmail);

router.get(
  '/:email',
  validate(contactValidation.getContacts, 'query'),
  contactController.getContactsByEmail
);

router.put(
  '/:id',
  validate(contactValidation.updateContact),
  contactController.updateContact
);

router.patch(
  '/:id/status',
  validate(contactValidation.updateStatus),
  contactController.updateContactStatus
);

router.delete('/:id', contactController.deleteContact);

// Bulk Operations
router.post(
  '/bulk/update',
  validate(contactValidation.bulkUpdate),
  contactController.bulkUpdateContacts
);

router.post(
  '/bulk/delete',
  validate(contactValidation.bulkDelete),
  contactController.bulkDeleteContacts
);

// Reply Functionality
router.post(
  '/:id/reply',
  validate(contactValidation.replyContact),
  contactController.replyToContact
);

// ========== STATISTICS & ANALYTICS ROUTES ==========

router.get(
  '/stats/dashboard',
  contactController.getDashboardStats
);

router.get(
  '/stats/analytics',
  validate(contactValidation.getAnalytics, 'query'),
  contactController.getContactAnalytics
);

router.get(
  '/stats/performance',
  contactController.getPerformanceMetrics
);

// ========== EXPORT ROUTES ==========

router.get(
  '/export',
  validate(contactValidation.exportContacts, 'query'),
  contactController.exportContacts
);

// ========== HEALTH CHECK ==========

router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Contact API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

module.exports = router;