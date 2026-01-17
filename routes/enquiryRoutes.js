// // routes/enquiryRoutes.js
// const express = require('express');
// const router = express.Router();
// const enquiryController = require('../controllers/enquiryController');

// // Basic CRUD routes
// router.post('/', enquiryController.createEnquiry.bind(enquiryController));
// router.get('/', enquiryController.getAllEnquiries.bind(enquiryController));
// router.get('/:id', enquiryController.getEnquiryById.bind(enquiryController));
// router.put('/:id', enquiryController.updateEnquiry.bind(enquiryController));
// router.delete('/:id', enquiryController.deleteEnquiry.bind(enquiryController));

// // Email-related routes
// router.post('/test-email', enquiryController.sendTestEmail.bind(enquiryController));
// router.get('/email/logs', enquiryController.getEmailLogs.bind(enquiryController));
// router.post('/followup', enquiryController.sendFollowupEmail.bind(enquiryController));

// // Statistics routes
// router.get('/statistics/time', enquiryController.getTimeStatistics.bind(enquiryController));
// router.get('/statistics/dashboard', enquiryController.getDashboardStatistics.bind(enquiryController));

// // Additional routes
// router.get('/email/:email', enquiryController.getEnquiriesByEmail.bind(enquiryController));
// router.get('/health', enquiryController.healthCheck.bind(enquiryController));

// module.exports = router;













// const express = require('express');
// const router = express.Router();
// const enquiryController = require('../controllers/EnquiryController');

// // ======================
// // ENQUIRY ROUTES
// // ======================

// // Create a new enquiry
// router.post('/', enquiryController.createEnquiry.bind(enquiryController));

// // Get all enquiries with filters, pagination, search
// router.get('/', enquiryController.getAllEnquiries.bind(enquiryController));

// // Get a single enquiry by ID
// router.get('/:id', enquiryController.getEnquiryById.bind(enquiryController));

// // Update enquiry by ID (status, notes, etc.)
// router.put('/:id', enquiryController.updateEnquiry.bind(enquiryController));

// // Soft-delete enquiry by ID
// router.delete('/:id', enquiryController.deleteEnquiry.bind(enquiryController));

// // ======================
// // EMAIL ROUTES
// // ======================

// // Send follow-up email for an enquiry
// router.post('/:id/followup', enquiryController.sendFollowupEmail.bind(enquiryController));

// // ======================
// // DASHBOARD & HEALTH
// // ======================

// // Get dashboard statistics
// router.get('/dashboard/stats', enquiryController.getDashboardStatistics.bind(enquiryController));

// // Health check route
// router.get('/health', enquiryController.healthCheck.bind(enquiryController));

// module.exports = router;




















const express = require('express');
const router = express.Router();
const enquiryController = require('../controllers/enquiryController');

// ======================
// ENQUIRY ROUTES
// ======================

// Create a new enquiry
router.post('/', enquiryController.createEnquiry.bind(enquiryController));

// Get all enquiries with filters, pagination, search
router.get('/', enquiryController.getAllEnquiries.bind(enquiryController));

// ======================
// DASHBOARD & HEALTH
// ======================

// Get dashboard statistics
router.get('/dashboard/stats', enquiryController.getDashboardStatistics.bind(enquiryController));

// Health check route
router.get('/health', enquiryController.healthCheck.bind(enquiryController));

// ======================
// EMAIL ROUTES
// ======================

// Send follow-up email for an enquiry
router.post('/:id/followup', enquiryController.sendFollowupEmail.bind(enquiryController));

// ======================
// PARAMETERIZED ENQUIRY ROUTES
// ======================

// Get a single enquiry by ID
router.get('/:id', enquiryController.getEnquiryById.bind(enquiryController));
router.get('/:email', enquiryController.getEnquiriesByEmail.bind(enquiryController));

// Update enquiry by ID (status, notes, etc.)
router.put('/:id', enquiryController.updateEnquiry.bind(enquiryController));

// Soft-delete enquiry by ID
router.delete('/:id', enquiryController.deleteEnquiry.bind(enquiryController));

module.exports = router;
