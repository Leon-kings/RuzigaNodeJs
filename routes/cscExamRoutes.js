const express = require("express");
const router = express.Router();
const cscExamController = require("../controllers/cscExamController");

// Public routes
router.get("/", cscExamController.getAllExams);
router.get("/:id", cscExamController.getExamById);
router.get("/:id/statistics", cscExamController.getExamStatistics);
router.post("/:id/register", cscExamController.registerForExam);
// Get all registrations for an exam
router.get("/:id/registrations", cscExamController.getExamRegistrations);
// Get logged-in user's registered exams
router.get("/my/registrations", cscExamController.getMyRegisteredExams);

// Protected routes (add your auth middleware as needed)
router.post("/", cscExamController.createExam);
router.put("/:id", cscExamController.updateExam);
router.delete("/:id", cscExamController.deleteExam);

// Statistics routes
router.get("/statistics/overview", cscExamController.getSystemStatistics);

// Email routes
router.post("/:id/email/bulk", cscExamController.sendBulkEmail);

module.exports = router;
