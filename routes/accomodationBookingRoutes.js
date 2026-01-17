// const express = require('express');
// const router = express.Router();
// const { bookingController } = require('../controllers/AccommodationControllers');

// // Create booking
// router.post('/create', bookingController.createBooking);

// // Get all bookings
// router.get('/', bookingController.getAllBookings);

// // Get single booking
// router.get('/:id', bookingController.getBooking);

// // Update booking
// router.put('/:id', bookingController.updateBooking);

// // Delete booking
// router.delete('/:id', bookingController.deleteBooking);

// module.exports = router;




const express = require('express');
const router = express.Router();
const { bookingController } = require('../controllers/AccommodationControllers');

// Create booking
router.post('/create', bookingController.createBooking);

// Get all bookings
router.get('/book', bookingController.getAllBookings);

// Get single booking by ID/Email
router.get('/:id', bookingController.getBooking);
router.get('/:email', bookingController.getBookingsByEmail);

// Update booking
router.put('/:id', bookingController.updateBooking);

// Delete booking
router.delete('/:id', bookingController.deleteBooking);

module.exports = router;
