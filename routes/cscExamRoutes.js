// routes/cscExamRoutes.js
const express = require("express");
const router = express.Router();
const controller = require("../controllers/CSCEBookingController"); // <- no destructuring
const multer = require("multer");

// Multer memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB

// Exams routes
router.post("/exams", upload.array("images", 5), controller.createExam);
router.put("/exams/:examId", upload.array("images", 5), controller.updateExam);
router.get("/exams", controller.getAllExams);
router.get("/exams/:examId", controller.getSingleExam);
router.delete("/exams/:examId", controller.deleteExam);

// Bookings routes
router.post("/exams/:examId/bookings", controller.createBooking);
router.get("/exams/:examId/bookings", controller.getExamBookings);
router.put("/exams/:examId/bookings/:bookingId", controller.updateBookingStatus);
router.delete("/exams/:examId/bookings/:bookingId", controller.deleteBooking);
router.get("/bookings", controller.getAllBookings);

module.exports = router;
