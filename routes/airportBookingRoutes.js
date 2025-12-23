const express = require('express');
const router = express.Router();
const airportBookingController = require('../controllers/airportBookingController');
const { validateBooking, validateEmail } = require('../validators/airportValidation');

// Booking routes
router.get('/', airportBookingController.getAllBookings);
router.get('/search', airportBookingController.searchBookings);
router.get('/:id', airportBookingController.getBooking);
router.post('/', validateBooking, airportBookingController.createBooking);
router.put('/:id', validateBooking, airportBookingController.updateBooking);
router.delete('/:id', airportBookingController.deleteBooking);

// Status management
router.patch('/:id/status', airportBookingController.updateStatus);

// Statistics routes
router.get('/statistics', airportBookingController.getStatistics);

// Email routes
router.post('/send-email', validateEmail, airportBookingController.sendEmail);

// Bulk operations
router.post('/bulk/update', airportBookingController.bulkUpdate);

module.exports = router;