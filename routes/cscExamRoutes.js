

// const express = require('express');
// const router = express.Router();
// const examController = require('../controllers/cscExamController');

// /* =====================================================
//    PUBLIC ROUTES
// ===================================================== */

// // Get all active exams (search + pagination)
// router.get('/', examController.getAllExams);

// // Get single exam by ID
// router.get('/:email', examController.getExamsByEmail);
// router.get('/:id', examController.getExamById);


// /* =====================================================
//    AUTHENTICATED USER ROUTES
// ===================================================== */

// // Register (request to sit) for an exam
// router.post('/:id/register',  examController.registerForExam);

// // Get exams the logged-in user registered for
// router.get('/user/my-exams',  examController.getMyRegisteredExams);

// /* =====================================================
//    ADMIN ROUTES
// ===================================================== */

// // Create exam
// router.post('/', examController.createExam);

// // Update exam
// router.put('/:id', examController.updateExam);

// // Soft delete exam
// router.delete('/:id', examController.deleteExam);

// // Get all registrations for an exam
// router.get('/:id/registrations', examController.getExamRegistrations);

// // Send bulk email to confirmed registrants
// router.post('/:id/bulk-email', examController.sendBulkEmail);

// module.exports = router;

















const express = require('express');
const router = express.Router();
const CSEController = require('../controllers/cscExamController');
const multer = require('multer');

// --------------------
// Multer config for image uploads
// --------------------
const storage = multer.memoryStorage(); // store files in memory
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // max 5MB
});

// --------------------
// Exam CRUD
// --------------------
router.post('/create', upload.single('image'), CSEController.createExam); // create exam
router.get('/', CSEController.getAllExams); // list all exams
router.get('/:id', CSEController.getSingleExam); // single exam
router.put('/:id', upload.single('image'), CSEController.updateExam); // update exam
router.delete('/:id', CSEController.deleteExam); // soft delete exam

// --------------------
// Exam Registrations
// --------------------
router.post('/:examId/register', CSEController.registerForExam); // register user for exam
router.get('/:examId/registrations', CSEController.getExamRegistrations); // registrations per exam
router.patch('/:examId/registrations/:registrationId', CSEController.updateRegistrationStatus); // update status
router.get('/registrations', CSEController.getAllRegistrations); // all registrations
router.get('/bookings', CSEController.getAllBookings); // same as registrations
router.get('/bookings/:email', CSEController.getBookingsByEmail); // filter bookings by email

// --------------------
// Dashboard
// --------------------
router.get('/dashboard/stats', CSEController.getDashboardStats);

module.exports = router;
