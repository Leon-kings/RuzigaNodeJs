const express = require('express');
const router = express.Router();
const {
  accommodationController,
  bookingController,
  dashboardController,
  uploadMultipleImages
} = require('../controllers/AccommodationControllers');

// Accommodation Routes
router.post('/create', 
  uploadMultipleImages, 
  accommodationController.createAccommodation
);

router.get('/accomodations', accommodationController.getAllAccommodations);
router.get('/accomodations/featured', accommodationController.getFeaturedAccommodations);
router.get('/accomodations/:id', accommodationController.getAccommodation);
router.put('/accomodations/:id', accommodationController.updateAccommodation);
router.delete('/accomodations/:id', accommodationController.deleteAccommodation);

// Accommodation Image Routes
router.post('/:id/images',
  uploadMultipleImages,
  accommodationController.uploadAccommodationImages
);

router.delete('/:id/images/:imageId', 
  accommodationController.deleteAccommodationImage
);

router.put('/:id/images/order',
  accommodationController.updateImagesOrder
);

// Booking Routes
router.post('/', bookingController.createBooking);
router.get('/', bookingController.getAllBookings);
router.get('/:id', bookingController.getBooking);
router.put('/:id/status', bookingController.updateBookingStatus);
router.put('/:id/cancel', bookingController.cancelBooking); 
router.get('/email/:email', bookingController.getBookingsByEmail);

// Dashboard Routes
router.get('/dashboard/statistics', dashboardController.getStatistics);
router.get('/dashboard/analytics', dashboardController.getBookingAnalytics);
module.exports = router; 