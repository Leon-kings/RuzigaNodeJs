const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');


// =========== PUBLIC ROUTES ===========

// Create booking
router.post('/', bookingController.createBooking);
// Get booking statistics
router.get('/admin/statistics', bookingController.getBookingStats);

// =========== ADMIN ROUTES ===========

// Get all bookings
router.get('/admin/all', bookingController.getAllBookings);

// Get booking by ID
router.get('/admin/:id', bookingController.getBookingById);

// Update booking status
router.put('/admin/:id', bookingController.updateBookingStatus);

// Delete booking
router.delete('/admin/:id', bookingController.deleteBooking);

// Bulk update bookings
router.post('/admin/bulk-update', bookingController.bulkUpdateBookings);

module.exports = router;