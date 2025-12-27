const express = require("express");
const router = express.Router();
const csceController = require("../controllers/CSCEBookingController");
const auth = require("../middlewares/auth");
const admin = require("../middlewares/admin");

// ===================== PUBLIC ROUTES =====================
router.get("/", csceController.getAllExams);
router.get("/:id", csceController.getExam);

// ===================== AUTHENTICATED ROUTES =====================
router.post("/:examId/register", auth, csceController.registerForExam);
router.get("/:examId/registrations", auth, csceController.getExamRegistrations);

// ===================== ADMIN ROUTES =====================
// Exam Management
router.post("/", auth, admin, csceController.createExam);
router.put("/:id", auth, admin, csceController.updateExam);
router.delete("/:id", auth, admin, csceController.deleteExam);

// Registration Management
router.put(
  "/:examId/registrations/:registrationId",
  auth,
  admin,
  csceController.updateRegistrationStatus
);

// Dashboard & Statistics
router.get("/dashboard/stats", auth, admin, csceController.getDashboardStats);
router.get("/:examId/stats", auth, admin, csceController.getExamStatistics);

// Export Routes
router.get(
  "/:examId/export/excel",
  auth,
  admin,
  csceController.exportRegistrations
);
router.get("/:examId/export/pdf", auth, admin, csceController.exportExamReport);

module.exports = router;
