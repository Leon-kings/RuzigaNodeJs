// const express = require("express");
// const router = express.Router();
// const csceController = require("../controllers/CSCEBookingController");
// // const auth = require("../middlewares/auth");
// // const admin = require("../middlewares/admin");

// // ===================== PUBLIC ROUTES =====================
// router.get("/", csceController.getAllExams);
// router.get("/:id", csceController.getExam);

// // ===================== AUTHENTICATED ROUTES =====================
// router.post("/:examId/register", csceController.registerForExam);
// router.get("/:examId/registrations", csceController.getExamRegistrations);

// // ===================== ADMIN ROUTES =====================
// // Exam Management
// router.post("/", csceController.createExam);
// router.put("/:id", csceController.updateExam);
// router.delete("/:id", csceController.deleteExam);

// // Registration Management
// router.put(
//   "/:examId/registrations/:registrationId",

//   csceController.updateRegistrationStatus
// );

// // Dashboard & Statistics
// router.get("/dashboard/stats", csceController.getDashboardStats);
// router.get("/:examId/stats", csceController.getExamStatistics);

// // Export Routes
// router.get(
//   "/:examId/export/excel",

//   csceController.exportRegistrations
// );
// router.get("/:examId/export/pdf", csceController.exportExamReport);

// module.exports = router;












const express = require('express');
const router = express.Router();

// Controller
const cseController = require('../controllers/CSCEBookingController');

// ===================== DASHBOARD =====================

// Get dashboard statistics
router.get(
  '/dashboard',
  cseController.getDashboardStats
);

// ===================== ANALYTICS (OPTIONAL SEPARATE ENDPOINTS) =====================

// Revenue by month
router.get(
  '/analytics/revenue',
  async (req, res) => {
    try {
      const data = await cseController.getRevenueByMonth();
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

// Registration trends
router.get(
  '/analytics/registrations/trends',
  async (req, res) => {
    try {
      const data = await cseController.getRegistrationTrends();
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

// Registration rate
router.get(
  '/analytics/registrations/rate',
  async (req, res) => {
    try {
      const rate = await cseController.calculateRegistrationRate();
      res.json({ success: true, rate });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

// Pass rate
router.get(
  '/analytics/pass-rate',
  async (req, res) => {
    try {
      const rate = await cseController.calculateAveragePassRate();
      res.json({ success: true, rate });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

// ====================================
// EXAM ROUTES
// ====================================

// Create a new exam (Admin only)
router.post(
  '/exams',
  // isAuthenticated, isAdmin,
  cseController.createExam
);

// Get all active exams
router.get(
  '/exams',
  // isAuthenticated,
  cseController.getAllExams
);

// Get single exam by ID
router.get(
  '/exams/:id',
  // isAuthenticated,
  cseController.getSingleExam
);

// ====================================
// REGISTRATION ROUTES
// ====================================

// Register for an exam
router.post(
  '/exams/:examId/register',
  // isAuthenticated,
  cseController.registerForExam
);

// Get all registrations for a specific exam
router.get(
  '/exams/:examId/registrations',
  // isAuthenticated, isAdmin,
  cseController.getExamRegistrations
);

// Update registration status (Admin only)
router.put(
  '/exams/:examId/registrations/:registrationId',
  // isAuthenticated, isAdmin,
  cseController.updateRegistrationStatus
);

// Revenue growth
router.get(
  '/analytics/revenue-growth',
  async (req, res) => {
    try {
      const growth = await cseController.calculateRevenueGrowth();
      res.json({ success: true, growth });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

module.exports = router;
