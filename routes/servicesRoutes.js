const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/servicesControllers');

// Public routes
router.post('/', bookingController.createBooking);
router.get('/test-email', bookingController.sendTestEmail);
router.get('/templates', bookingController.getEmailTemplates);

// Protected routes (add authentication middleware as needed)
router.get('/', bookingController.getAllBookings);
router.get('/statistics', bookingController.getStatistics);
router.get('/export', bookingController.exportBookings);
router.get('/search', bookingController.searchBookings);
router.get('/date-range', bookingController.getBookingsByDateRange);

// Single booking routes
router.get('/:id', bookingController.getBookingById);
router.put('/:id/status', bookingController.updateBookingStatus);
router.post('/:id/notes', bookingController.addNoteToBooking);
router.delete('/:id', bookingController.deleteBooking);

module.exports = router;