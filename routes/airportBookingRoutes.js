// // const express = require('express');
// // const router = express.Router();
// // const airportBookingController = require('../controllers/airportBookingController');
// // const { validateBooking, validateEmail } = require('../validators/airportValidation');

// // // Booking routes
// // router.get('/', airportBookingController.getAllBookings);
// // router.get('/search', airportBookingController.searchBookings);
// // router.get('/:id', airportBookingController.getBooking);
// // router.post('/', validateBooking, airportBookingController.createBooking);
// // router.put('/:id', validateBooking, airportBookingController.updateBooking);
// // router.delete('/:id', airportBookingController.deleteBooking);

// // // Status management
// // router.patch('/:id/status', airportBookingController.updateStatus);

// // // Statistics routes
// // router.get('/statistics', airportBookingController.getStatistics);

// // // Email routes
// // router.post('/send-email', validateEmail, airportBookingController.sendEmail);

// // // Bulk operations
// // router.post('/bulk/update', airportBookingController.bulkUpdate);

// // module.exports = router;















// const express = require('express');
// const router = express.Router();
// const airportController = require('../controllers/airportBookingController');
// const { body } = require('express-validator');

// // =========================
// // BOOKING ROUTES
// // =========================

// // GET all bookings
// router.get('/bookings', airportController.getAllBookings);

// // GET single booking
// router.get('/bookings/:id', airportController.getBooking);

// // POST create booking
// router.post('/bookings', [
//   body('firstName').notEmpty().trim(),
//   body('lastName').notEmpty().trim(),
//   body('email').isEmail().normalizeEmail(),
//   body('phone').notEmpty().trim(),
//   body('flightNumber').notEmpty().trim(),
//   body('airline').notEmpty().trim(),
//   body('arrivalDate').isISO8601(),
//   body('departureDate').isISO8601(),
//   body('numberOfPassengers').isInt({ min: 1, max: 50 })
// ], airportController.createBooking);

// // PUT update booking
// router.put('/bookings/:id', airportController.updateBooking);

// // DELETE booking
// router.delete('/bookings/:id', airportController.deleteBooking);

// // GET statistics
// router.get('/bookings/stats/statistics', airportController.getStatistics);

// // POST send email
// router.post('/bookings/send-email', airportController.sendEmailToBooking);

// // PUT update status
// router.put('/bookings/:id/status', airportController.updateStatus);

// // GET search bookings
// router.get('/bookings/search/search', airportController.searchBookings);

// // GET bookings by email
// router.get('/bookings/email/:email', airportController.getBookingsByEmail);

// // POST cancel booking
// router.post('/bookings/:id/cancel', airportController.cancelBooking);

// // =========================
// // PLANE ROUTES
// // =========================

// // GET all planes
// router.get('/planes', airportController.getAllPlanes);

// // GET single plane
// router.get('/planes/:id', airportController.getPlane);

// // POST create plane
// router.post('/planes', [
//   body('name').notEmpty().trim(),
//   body('model').notEmpty().trim(),
//   body('airline').notEmpty().trim(),
//   body('registrationNumber').notEmpty().trim(),
//   body('manufactureYear').isInt({ min: 1950, max: new Date().getFullYear() })
// ], airportController.createPlane);

// // PUT update plane
// router.put('/planes/:id', airportController.updatePlane);

// // DELETE plane
// router.delete('/planes/:id', airportController.deletePlane);

// // POST upload plane image
// router.post('/planes/:id/upload-image', airportController.uploadPlaneImage);

// // POST upload multiple plane images
// router.post('/planes/:id/upload-images', airportController.uploadMultiplePlaneImages);

// // DELETE plane image
// router.delete('/planes/:planeId/images/:publicId', airportController.deletePlaneImage);

// // PUT set primary image
// router.put('/planes/:id/set-primary-image', airportController.setPrimaryImage);

// // GET plane statistics
// router.get('/planes/stats/statistics', airportController.getPlaneStatistics);

// // GET search planes
// router.get('/planes/search/search', airportController.searchPlanes);

// // GET available planes
// router.get('/planes/available/available', airportController.getAvailablePlanes);

// // PUT update plane status
// router.put('/planes/:id/status', airportController.updatePlaneStatus);

// // POST add maintenance log
// router.post('/planes/:id/maintenance', airportController.addMaintenanceLog);

// // PUT update flight hours
// router.put('/planes/:id/flight-hours', airportController.updateFlightHours);

// // =========================
// // DASHBOARD ROUTES
// // =========================

// // GET dashboard statistics
// router.get('/dashboard/stats', airportController.getDashboardStats);

// module.exports = router;

















// // routes/bookingPlaneRoutes.js
// const express = require('express');
// const router = express.Router();
// const { body, param, query } = require('express-validator');
// const controller = require('../controllers/airportBookingController');

// // =========================
// // BOOKING ROUTES
// // =========================

// // Get all bookings
// router.get('/bookings', controller.getAllBookings);

// // Get single booking
// router.get('/bookings/:id', [
//   param('id').isMongoId()
// ], controller.getBooking);

// // Create booking
// router.post('/bookings', [
//   body('firstName').notEmpty().trim(),
//   body('lastName').notEmpty().trim(),
//   body('email').isEmail().normalizeEmail(),
//   body('phone').notEmpty().trim(),
//   body('flightNumber').notEmpty().trim(),
//   body('airline').notEmpty().trim(),
//   body('arrivalDate').isISO8601(),
//   body('arrivalTime').notEmpty(),
//   body('departureDate').isISO8601(),
//   body('departureTime').notEmpty(),
//   body('airport').notEmpty().trim(),
//   body('terminal').notEmpty().trim(),
//   body('numberOfPassengers').isInt({ min: 1, max: 50 })
// ], controller.createBooking);

// // Update booking
// router.put('/bookings/:id', [
//   param('id').isMongoId()
// ], controller.updateBooking);

// // Delete booking
// router.delete('/bookings/:id', [
//   param('id').isMongoId()
// ], controller.deleteBooking);

// // Get statistics
// router.get('/bookings/stats/dashboard', controller.getDashboardStats);
// router.get('/bookings/stats', controller.getStatistics);

// // Update booking status
// router.patch('/bookings/:id/status', [
//   param('id').isMongoId(),
//   body('status').isIn(['pending', 'confirmed', 'completed', 'cancelled', 'no_show'])
// ], controller.updateStatus);

// // Cancel booking
// router.post('/bookings/:id/cancel', [
//   param('id').isMongoId()
// ], controller.cancelBooking);

// // Send email to booking
// router.post('/bookings/:id/send-email', [
//   param('id').isMongoId(),
//   body('emailType').isIn(['confirmation', 'reminder', 'cancellation', 'update'])
// ], controller.sendEmailToBooking);

// // Search bookings
// router.get('/bookings/search', controller.searchBookings);

// // Get bookings by email
// router.get('/bookings/email/:email', controller.getBookingsByEmail);

// // =========================
// // PLANE ROUTES
// // =========================

// // Get all planes
// router.get('/planes', controller.getAllPlanes);

// // Get single plane
// router.get('/planes/:id', [
//   param('id').isMongoId()
// ], controller.getPlane);

// // Create plane
// router.post('/planes', [
//   body('registrationNumber').notEmpty().trim(),
//   body('model').notEmpty().trim(),
//   body('airline').notEmpty().trim(),
//   body('manufacturer').notEmpty().trim(),
//   body('yearOfManufacture').isInt({ min: 1950, max: new Date().getFullYear() })
// ], controller.createPlane);

// // Update plane
// router.put('/planes/:id', [
//   param('id').isMongoId()
// ], controller.updatePlane);

// // Delete plane
// router.delete('/planes/:id', [
//   param('id').isMongoId()
// ], controller.deletePlane);

// // Upload plane image
// router.post('/planes/:id/upload-image', controller.uploadPlaneImage);

// // Upload multiple plane images
// router.post('/planes/:id/upload-images', controller.uploadMultiplePlaneImages);

// // Delete plane image
// router.delete('/planes/:planeId/images/:publicId', controller.deletePlaneImage);

// // Set primary image
// router.patch('/planes/:id/set-primary-image', [
//   param('id').isMongoId(),
//   body('publicId').notEmpty()
// ], controller.setPrimaryImage);

// // Search planes
// router.get('/planes/search', controller.searchPlanes);

// // Get available planes
// router.get('/planes/available', controller.getAvailablePlanes);

// // Update plane status
// router.patch('/planes/:id/status', [
//   param('id').isMongoId(),
//   body('status').isIn(['active', 'maintenance', 'retired', 'grounded'])
// ], controller.updatePlaneStatus);

// module.exports = router;














// const express = require("express");
// const router = express.Router();
// const airportBookingController = require("../controllers/airportBookingController");
// const { body } = require("express-validator");
// const upload = require('../services/planeUpload');

// /* =====================================================
//    BOOKING ROUTES
// ===================================================== */

// // Get all bookings (with filters, pagination)
// router.get("/", airportBookingController.getAllBookings);

// // Search bookings (quick search)
// router.get("/search", airportBookingController.searchBookings);

// // Booking statistics
// router.get("/statistics/overview", airportBookingController.getStatistics);

// // Dashboard stats
// router.get("/statistics/dashboard", airportBookingController.getDashboardStats);

// // Get bookings by email
// router.get("/by-email/:email", airportBookingController.getBookingsByEmail);

// // Get single booking
// router.get("/:id", airportBookingController.getBooking);

// // Create booking
// router.post(
//   "/",
//   [
//     body("firstName").notEmpty(),
//     body("lastName").notEmpty(),
//     body("email").isEmail(),
//     body("serviceType").notEmpty(),
//     body("numberOfPassengers").isInt({ min: 1 }),
//   ],
//   airportBookingController.createBooking
// );

// // Update booking
// router.put("/:id", airportBookingController.updateBooking);

// // Update booking status
// router.patch("/:id/status", airportBookingController.updateStatus);

// // Cancel booking
// router.patch("/:id/cancel", airportBookingController.cancelBooking);

// // Delete booking
// router.delete("/:id", airportBookingController.deleteBooking);

// // Send email to booking
// router.post("/:id/send-email", airportBookingController.sendEmailToBooking);

// /* =====================================================
//    PLANE ROUTES
// ===================================================== */

// // Get all planes
// router.get("/planes/all", airportBookingController.getAllPlanes);

// // Get single plane
// router.get("/planes/:id", airportBookingController.getPlane);

// router.post(
//   '/planes',
//   upload.single('image'),
//   [
//     body('model').notEmpty().withMessage('Model is required'),
//     body('manufacturer').notEmpty().withMessage('Manufacturer is required'),

//     body('yearOfManufacture')
//       .notEmpty().withMessage('Year is required')
//       .toInt() // 🔥 CONVERT STRING → NUMBER
//       .isInt({ min: 1950, max: new Date().getFullYear() })
//       .withMessage('Invalid manufacture year'),
//   ],
//   airportBookingController.createPlane
// );


// // Update plane
// router.put("/:id", airportBookingController.updatePlane);

// // Delete plane
// router.delete("/:id", airportBookingController.deletePlane);

// // Upload plane image
// router.post(
//   "/planes/:id/upload-image",
//   airportBookingController.uploadPlaneImage
// );

// module.exports = router;

































const express = require("express");
const router = express.Router();
const controller = require("../controllers/airportBookingController");
const { body } = require("express-validator");
const upload = require("../services/planeUpload");

/* BOOKINGS */
router.get("/", controller.getAllBookings);
router.get("/:id", controller.getBooking);

router.post(
  "/",
  [
    body("firstName").notEmpty(),
    body("lastName").notEmpty(),
    body("email").isEmail(),
    body("serviceType").notEmpty(),
    body("numberOfPassengers").isInt({ min: 1 }),
  ],
  controller.createBooking
);

router.put("/:id", controller.updateBooking);
router.patch("/:id/status", controller.updateStatus);
router.delete("/:id", controller.deleteBooking);

/* PLANES */
router.get("/planes/all", controller.getAllPlanes);
router.get("/planes/:id", controller.getPlane);

router.post(
  "/planes",
  upload.single("image"),
  [
    body("model").notEmpty(),
    body("manufacturer").notEmpty(),
    body("yearOfManufacture").toInt().isInt({ min: 1950 }),
  ],
  controller.createPlane
);

router.put("/planes/:id", controller.updatePlane);
router.delete("/planes/:id", controller.deletePlane);
router.post("/planes/:id/upload-image", controller.uploadPlaneImage);

module.exports = router;
