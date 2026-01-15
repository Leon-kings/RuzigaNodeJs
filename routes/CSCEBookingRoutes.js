// // // const express = require("express");
// // // const router = express.Router();
// // // const csceController = require("../controllers/CSCEBookingController");
// // // // const auth = require("../middlewares/auth");
// // // // const admin = require("../middlewares/admin");

// // // // ===================== PUBLIC ROUTES =====================
// // // router.get("/", csceController.getAllExams);
// // // router.get("/:id", csceController.getExam);

// // // // ===================== AUTHENTICATED ROUTES =====================
// // // router.post("/:examId/register", csceController.registerForExam);
// // // router.get("/:examId/registrations", csceController.getExamRegistrations);

// // // // ===================== ADMIN ROUTES =====================
// // // // Exam Management
// // // router.post("/", csceController.createExam);
// // // router.put("/:id", csceController.updateExam);
// // // router.delete("/:id", csceController.deleteExam);

// // // // Registration Management
// // // router.put(
// // //   "/:examId/registrations/:registrationId",

// // //   csceController.updateRegistrationStatus
// // // );

// // // // Dashboard & Statistics
// // // router.get("/dashboard/stats", csceController.getDashboardStats);
// // // router.get("/:examId/stats", csceController.getExamStatistics);

// // // // Export Routes
// // // router.get(
// // //   "/:examId/export/excel",

// // //   csceController.exportRegistrations
// // // );
// // // router.get("/:examId/export/pdf", csceController.exportExamReport);

// // // module.exports = router;

// // const express = require('express');
// // const router = express.Router();

// // // Controller
// // const cseController = require('../controllers/CSCEBookingController');

// // // ===================== DASHBOARD =====================

// // // Get dashboard statistics
// // router.get(
// //   '/dashboard',
// //   cseController.getDashboardStats
// // );

// // // ===================== ANALYTICS (OPTIONAL SEPARATE ENDPOINTS) =====================

// // // Revenue by month
// // router.get(
// //   '/analytics/revenue',
// //   async (req, res) => {
// //     try {
// //       const data = await cseController.getRevenueByMonth();
// //       res.json({ success: true, data });
// //     } catch (error) {
// //       res.status(500).json({ success: false, message: error.message });
// //     }
// //   }
// // );

// // // Registration trends
// // router.get(
// //   '/analytics/registrations/trends',
// //   async (req, res) => {
// //     try {
// //       const data = await cseController.getRegistrationTrends();
// //       res.json({ success: true, data });
// //     } catch (error) {
// //       res.status(500).json({ success: false, message: error.message });
// //     }
// //   }
// // );

// // // Registration rate
// // router.get(
// //   '/analytics/registrations/rate',
// //   async (req, res) => {
// //     try {
// //       const rate = await cseController.calculateRegistrationRate();
// //       res.json({ success: true, rate });
// //     } catch (error) {
// //       res.status(500).json({ success: false, message: error.message });
// //     }
// //   }
// // );

// // // Pass rate
// // router.get(
// //   '/analytics/pass-rate',
// //   async (req, res) => {
// //     try {
// //       const rate = await cseController.calculateAveragePassRate();
// //       res.json({ success: true, rate });
// //     } catch (error) {
// //       res.status(500).json({ success: false, message: error.message });
// //     }
// //   }
// // );

// // // ====================================
// // // EXAM ROUTES
// // // ====================================

// // // Create a new exam (Admin only)
// // router.post(
// //   '/exams',
// //   // isAuthenticated, isAdmin,
// //   cseController.createExam
// // );

// // // Get all active exams
// // router.get(
// //   '/exams',
// //   // isAuthenticated,
// //   cseController.getAllExams
// // );

// // // Get single exam by ID
// // router.get(
// //   '/exams/:id',
// //   // isAuthenticated,
// //   cseController.getSingleExam
// // );

// // // ====================================
// // // REGISTRATION ROUTES
// // // ====================================

// // // Register for an exam
// // router.post(
// //   '/exams/:examId/register',
// //   // isAuthenticated,
// //   cseController.registerForExam
// // );

// // // Get all registrations for a specific exam
// // router.get(
// //   '/exams/:examId/registrations',
// //   // isAuthenticated, isAdmin,
// //   cseController.getExamRegistrations
// // );

// // // Get all registrations (no examId required)
// // router.get(
// //   '/registrations',
// //   // isAuthenticated, isAdmin,
// //   cseController.getAllRegistrations
// // );

// // // Update registration status (Admin only)
// // router.put(
// //   '/exams/:examId/registrations/:registrationId',
// //   // isAuthenticated, isAdmin,
// //   cseController.updateRegistrationStatus
// // );

// // // Revenue growth
// // router.get(
// //   '/analytics/revenue-growth',
// //   async (req, res) => {
// //     try {
// //       const growth = await cseController.calculateRevenueGrowth();
// //       res.json({ success: true, growth });
// //     } catch (error) {
// //       res.status(500).json({ success: false, message: error.message });
// //     }
// //   }
// // );

// // module.exports = router;

// const express = require('express');
// const router = express.Router();
// const cseController = require('../controllers/CSCEBookingController');

// // ==================================================
// // EXAMS ROUTES
// // ==================================================
// router.post('/exams', cseController.createExam);        // Create Exam
// router.get('/exams', cseController.getAllExams);        // Get all Exams
// router.get('/exams/:id', cseController.getSingleExam); // Get single Exam

// // ==================================================
// // REGISTRATIONS ROUTES
// // ==================================================
// router.post('/exams/:examId/register', cseController.registerForExam); // Register for Exam
// router.get('/exams/:examId/registrations', cseController.getExamRegistrations); // Exam registrations
// router.put('/exams/:examId/registrations/:registrationId', cseController.updateRegistrationStatus); // Update registration
// router.get('/registrations', cseController.getAllRegistrations); // All registrations

// // ==================================================
// // BOOKINGS ROUTES
// // ==================================================
// router.post('/exams/:examId/bookings', cseController.createBooking); // Create Booking
// router.get('/exams/:examId/bookings', cseController.getExamBookings); // Get Bookings for Exam
// router.put('/exams/:examId/bookings/:bookingId', cseController.updateBookingStatus); // Update Booking
// router.delete('/exams/:examId/bookings/:bookingId', cseController.deleteBooking); // Delete Booking
// router.get('/bookings', cseController.getAllBookings); // All bookings

// // ==================================================
// // DASHBOARD ROUTES
// // ==================================================
// router.get('/dashboard', cseController.getDashboardStats);
// router.get('/dashboard/revenue-by-month', cseController.getRevenueByMonth);
// router.get('/dashboard/registration-trends', cseController.getRegistrationTrends);
// router.get('/dashboard/registrations-by-day', cseController.getRegistrationsByDay);
// router.get('/dashboard/exam-type-stats', cseController.getExamTypeStats);
// router.get('/dashboard/registration-rate', cseController.calculateRegistrationRate);
// router.get('/dashboard/average-pass-rate', cseController.calculateAveragePassRate);
// router.get('/dashboard/revenue-growth', cseController.calculateRevenueGrowth);

// module.exports = router;

const express = require("express");
const router = express.Router();
const cseController = require("../controllers/CSCEBookingController");

/* =====================================================
   📌 USER BOOKING ROUTES
===================================================== */

// Create booking for an exam
router.post(
  "/:examId/bookings",

  cseController.createBooking
);

// Get bookings for a specific exam (admin)
router.get(
  "/:examId/bookings",

  cseController.getExamBookings
);

/* =====================================================
   📌 ADMIN BOOKING MANAGEMENT
===================================================== */

// Update booking status
router.put(
  "/:examId/bookings/:bookingId",

  cseController.updateBookingStatus
);

// Delete booking
router.delete(
  "/:examId/bookings/:bookingId",

  cseController.deleteBooking
);

// Get all bookings across all exams
router.get(
  "/bookings/all",

  cseController.getAllBookings
);

module.exports = router;
