

const express = require("express");
const router = express.Router();
const controller = require("../controllers/airportBookingController");
const { body } = require("express-validator");
const upload = require("../services/planeUpload");

/* =======================
   PLANES (Independent)
======================= */
router.get("/planes/all", controller.getAllPlanes);
router.get("/planes/:id", controller.getPlane);

router.post(
  "/planes",
  upload.single("image"),
  [
    body("model").notEmpty(),
    body("manufacturer").notEmpty(),
    body("yearOfManufacture").toInt().isInt({ min: 1950 }),
  ],
  controller.createPlane
);

router.put("/planes/:id", controller.updatePlane);
router.delete("/planes/:id", controller.deletePlane);
router.post("/planes/:id/upload-image", controller.uploadPlaneImage);

/* =======================
   BOOKINGS
======================= */
router.get("/", controller.getAllBookings);
router.get("/:id", controller.getBooking); // ⚠️ Booking ID
router.get("/:email", controller.getBookingsByEmail);

router.post(
  "/",
  [
    body("firstName").notEmpty(),
    body("lastName").notEmpty(),
    body("email").isEmail(),
    body("serviceType").notEmpty(),
    body("numberOfPassengers").isInt({ min: 1 }),
    body("plane").notEmpty().withMessage("Plane ID is required"),
  ],
  controller.createBooking
);

router.put("/:id", controller.updateBooking); // Booking ID
router.patch("/:id/status", controller.updateStatus); // Booking ID
router.delete("/:id", controller.deleteBooking); // Booking ID

module.exports = router;
