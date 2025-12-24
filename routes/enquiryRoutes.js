// routes/enquiryRoutes.js
const express = require('express');
const router = express.Router();
const enquiryController = require('../controllers/enquiryController');

// Basic CRUD routes
router.post('/', enquiryController.createEnquiry.bind(enquiryController));
router.get('/', enquiryController.getAllEnquiries.bind(enquiryController));
router.get('/:id', enquiryController.getEnquiryById.bind(enquiryController));
router.put('/:id', enquiryController.updateEnquiry.bind(enquiryController));
router.delete('/:id', enquiryController.deleteEnquiry.bind(enquiryController));

// Email-related routes
router.post('/test-email', enquiryController.sendTestEmail.bind(enquiryController));
router.get('/email/logs', enquiryController.getEmailLogs.bind(enquiryController));
router.post('/followup', enquiryController.sendFollowupEmail.bind(enquiryController));

// Statistics routes
router.get('/statistics/time', enquiryController.getTimeStatistics.bind(enquiryController));
router.get('/statistics/dashboard', enquiryController.getDashboardStatistics.bind(enquiryController));

// Additional routes
router.get('/email/:email', enquiryController.getEnquiriesByEmail.bind(enquiryController));
router.get('/health', enquiryController.healthCheck.bind(enquiryController));

module.exports = router;