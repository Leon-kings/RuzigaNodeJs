const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer(); // memory storage
const controller = require('../controllers/admissionSystem.controller');

// ========== Universities ==========
router.get('/universities', controller.getUniversities);
router.get('/universities/:id', controller.getUniversity);
router.post('/universities', upload.fields([{ name: 'images', maxCount: 5 }]), controller.createUniversity);
router.put('/universities/:id', upload.fields([{ name: 'images', maxCount: 5 }]), controller.updateUniversity);
router.delete('/universities/:id', controller.deleteUniversity);

// ========== Bookings ==========
router.get('/bookings', controller.getBookings);
router.get('/bookings/:id', controller.getBooking);
router.post('/bookings', controller.createBooking);
router.delete('/bookings/:id', controller.deleteBooking);
router.put('/bookings/:id/status', controller.updateBookingStatus);
router.put('/bookings/:id/cancel', controller.cancelBooking);
router.get('/bookings/student/:email', controller.getStudentBookings);
router.put('/bookings/:id/reminder', controller.sendBookingReminder);

// ========== Dashboard ==========
router.get('/dashboard/stats', controller.getDashboardStats);

module.exports = router;
