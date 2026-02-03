const router = require("express").Router();
const controller = require("../controllers/admissionSystem.controller");
const multer = require("multer");

const upload = multer({ storage: multer.memoryStorage() });

/* Universities */
router.post("/universities", upload.any(), controller.createUniversity);
router.get("/universities", controller.getUniversities);
router.get("/universities/:id", controller.getUniversity);
router.put("/universities/:id", upload.any(), controller.updateUniversity);
router.delete("/universities/:id", controller.deleteUniversity);

/* Bookings */
router.post("/bookings", controller.createBooking);
router.get("/bookings", controller.getBookings);
router.get("/bookings/email/:email", controller.getBookingsByEmail);
router.put("/bookings/:bookingId", controller.editBooking);
router.get("/bookings/:id", controller.getBooking);
router.patch("/bookings/:id/status", controller.updateBookingStatus);
router.delete("/bookings/:id", controller.deleteBooking);

/* Stats */
router.get("/dashboard/stats", controller.getDashboardStats);

module.exports = router;
