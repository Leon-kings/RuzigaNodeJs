// const express = require('express');
// const router = express.Router();
// const bookingController = require('../controllers/bookingController');


// // =========== PUBLIC ROUTES ===========

// // Create booking
// router.post('/', bookingController.createBooking);
// // Get booking statistics
// router.get('/admin/statistics', bookingController.getBookingStats);

// // =========== ADMIN ROUTES ===========

// // Get all bookings
// router.get('/admin/all', bookingController.getAllBookings);

// // Get booking by ID
// router.get('/admin/:email', bookingController.getBookingsByEmail);
// router.get('/admin/:id', bookingController.getBookingById);


// // Update booking status
// router.put('/admin/:id', bookingController.updateBookingStatus);

// // Delete booking
// router.delete('/admin/:id', bookingController.deleteBooking);

// // Bulk update bookings
// router.post('/admin/bulk-update', bookingController.bulkUpdateBookings);

// module.exports = router;































const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

/* ================= PUBLIC ROUTES ================= */

// Create booking (public)
router.post('/', bookingController.createBooking);

/* ================= ADMIN ROUTES ================= */

// Booking statistics
router.get('/admin/statistics', bookingController.getBookingStats);

// Get all bookings
router.get('/admin/all', bookingController.getAllBookings);

// Get bookings by email
// example: /admin/by-email/test@gmail.com
router.get('/admin/by-email/:email', bookingController.getBookingsByEmail);

// Get booking by ID
// example: /admin/booking/64f1a2...
router.get('/admin/booking/:id', bookingController.getBookingById);

// Update booking status
router.put('/admin/booking/:id', bookingController.updateBookingStatus);

// Delete booking
router.delete('/admin/booking/:id', bookingController.deleteBooking);



module.exports = router;
