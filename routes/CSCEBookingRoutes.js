
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
router.get(
  "/:email/bookings",

  cseController.getBookingsByEmail
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
