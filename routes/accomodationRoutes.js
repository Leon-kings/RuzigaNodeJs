const express = require('express');
const router = express.Router();
const {
  accommodationController,
  bookingController,
  dashboardController,
  uploadMultipleImages
} = require('../controllers/AccommodationControllers');

// Accommodation Routes
router.post('/', 
  uploadMultipleImages, 
  accommodationController.createAccommodation
);

router.get('/', accommodationController.getAllAccommodations);
router.get('/featured', accommodationController.getFeaturedAccommodations);
router.get('/:id', accommodationController.getAccommodation);
router.put('/:id', accommodationController.updateAccommodation);
router.delete('/:id', accommodationController.deleteAccommodation);

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