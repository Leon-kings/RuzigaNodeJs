

const express = require('express');
const router = express.Router();
const examController = require('../controllers/cscExamController');

/* =====================================================
   PUBLIC ROUTES
===================================================== */

// Get all active exams (search + pagination)
router.get('/', examController.getAllExams);

// Get single exam by ID
router.get('/:email', examController.getExamsByEmail);
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
