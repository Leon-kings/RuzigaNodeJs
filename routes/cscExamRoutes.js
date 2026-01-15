// const express = require("express");
// const router = express.Router();
// const cscExamController = require("../controllers/cscExamController");

// // Public routes
// router.get("/", cscExamController.getAllExams);
// router.get("/:id", cscExamController.getExamById);
// router.get("/:id/statistics", cscExamController.getExamStatistics);
// router.post("/:id/register", cscExamController.registerForExam);
// // Get all registrations for an exam
// router.get("/:id/registrations", cscExamController.getExamRegistrations);
// // Get logged-in user's registered exams
// router.get("/my/registrations", cscExamController.getMyRegisteredExams);

// // Protected routes (add your auth middleware as needed)
// router.post("/", cscExamController.createExam);
// router.put("/:id", cscExamController.updateExam);
// router.delete("/:id", cscExamController.deleteExam);

// // Statistics routes
// router.get("/statistics/overview", cscExamController.getSystemStatistics);

// // Email routes
// router.post("/:id/email/bulk", cscExamController.sendBulkEmail);

// module.exports = router;























const express = require('express');
const router = express.Router();
const examController = require('../controllers/cscExamController');



/* =====================================================
   PUBLIC ROUTES
===================================================== */

// Get all active exams (search + pagination)
router.get('/', examController.getAllExams);

// Get single exam by ID
router.get('/:id', examController.getExamById);

/* =====================================================
   AUTHENTICATED USER ROUTES
===================================================== */

// Register (request to sit) for an exam
router.post('/:id/register',  examController.registerForExam);

// Get exams the logged-in user registered for
router.get('/user/my-exams',  examController.getMyRegisteredExams);

/* =====================================================
   ADMIN ROUTES
===================================================== */

// Create exam
router.post('/', examController.createExam);

// Update exam
router.put('/:id', examController.updateExam);

// Soft delete exam
router.delete('/:id', examController.deleteExam);

// Get all registrations for an exam
router.get('/:id/registrations', examController.getExamRegistrations);

// Send bulk email to confirmed registrants
router.post('/:id/bulk-email', examController.sendBulkEmail);

module.exports = router;
