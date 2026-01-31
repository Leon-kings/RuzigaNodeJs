const express = require('express');
const router = express.Router();
const controller = require('../controllers/admissionSystem.controller');

// =========== UNIVERSITY ROUTES ===========
router.get('/universities', controller.getUniversities);
router.get('/universities/:id', controller.getUniversity);
router.post('/universities', controller.createUniversity);
router.put('/universities/:id', controller.updateUniversity);
router.delete('/universities/:id', controller.deleteUniversity);


// =========== BOOKING ROUTES ===========
router.get('/bookings', controller.getBookings);
router.get('/bookings/:id', controller.getBooking);
router.post('/bookings', controller.createBooking);
router.put('/bookings/:id/status', controller.updateBookingStatus);
router.put('/bookings/:id/cancel', controller.cancelBooking);
router.get('/bookings/student/:email', controller.getStudentBookings);
router.post('/bookings/:id/reminder', controller.sendBookingReminder);

// =========== DASHBOARD ROUTES ===========
router.get('/dashboard/stats', controller.getDashboardStats);

// =========== HEALTH CHECK ===========
router.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK',
    service: 'University Booking API',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;