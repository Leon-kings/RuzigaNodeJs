

// const express = require("express");
// const router = express.Router();
// const controller = require("../controllers/airportBookingController");
// const { body } = require("express-validator");
// const upload = require("../services/planeUpload");

// /* =======================
//    PLANES (Independent)
// ======================= */
// router.get("/planes/all", controller.getAllPlanes);
// router.get("/planes/:id", controller.getPlane);

// router.post(
//   "/planes",
//   upload.single("image"),
//   [
//     body("model").notEmpty(),
//     body("manufacturer").notEmpty(),
//     body("yearOfManufacture").toInt().isInt({ min: 1950 }),
//   ],
//   controller.createPlane
// );

// router.put("/planes/:id", controller.updatePlane);
// router.delete("/planes/:id", controller.deletePlane);
// router.post("/planes/:id/upload-image", controller.uploadPlaneImage);

// /* =======================
//    BOOKINGS
// ======================= */
// router.get("/", controller.getAllBookings);
// router.get("/:email", controller.getBookingsByEmail);
// router.get("/:id", controller.getBooking); // ⚠️ Booking ID


// router.post(
//   "/",
//   [
//     body("firstName").notEmpty(),
//     body("lastName").notEmpty(),
//     body("email").isEmail(),
//     body("serviceType").notEmpty(),
//     body("numberOfPassengers").isInt({ min: 1 }),
//     body("plane").notEmpty().withMessage("Plane ID is required"),
//   ],
//   controller.createBooking
// );

// router.put("/:id", controller.updateBooking); // Booking ID
// router.patch("/:id/status", controller.updateStatus); // Booking ID
// router.delete("/:id", controller.deleteBooking); // Booking ID

// module.exports = router;















// const express = require("express");
// const router = express.Router();
// const controller = require("../controllers/airportBookingController");
// const { body } = require("express-validator");

// /* =======================
//    PLANES (Independent)
// ======================= */

// // GET ALL PLANES
// router.get("/planes/all", controller.getAllPlanes);

// // GET SINGLE PLANE
// router.get("/planes/:id", controller.getPlane);

// // CREATE PLANE (Image handled INSIDE controller via Cloudinary)
// router.post(
//   "/planes",
//   [
//     body("model").notEmpty().withMessage("Model is required"),
//     body("manufacturer").notEmpty().withMessage("Manufacturer is required"),
//     body("yearOfManufacture")
//       .toInt()
//       .isInt({ min: 1950 })
//       .withMessage("Invalid year"),
//   ],
//   controller.createPlane
// );

// // UPDATE PLANE
// router.put("/planes/:id", controller.updatePlane);

// // DELETE PLANE (also deletes Cloudinary images)
// router.delete("/planes/:id", controller.deletePlane);

// // UPLOAD EXTRA PLANE IMAGE
// router.post("/planes/:id/upload-image", controller.uploadPlaneImage);

// /* =======================
//    BOOKINGS
// ======================= */

// // GET ALL BOOKINGS
// router.get("/", controller.getAllBookings);

// // GET BOOKINGS BY EMAIL
// router.get("/email/:email", controller.getBookingsByEmail);

// // GET SINGLE BOOKING BY ID
// router.get("/booking/:id", controller.getBooking);

// // CREATE BOOKING
// router.post(
//   "/",
//   [
//     body("firstName").notEmpty().withMessage("First name is required"),
//     body("lastName").notEmpty().withMessage("Last name is required"),
//     body("email").isEmail().withMessage("Valid email is required"),
//     body("serviceType").notEmpty().withMessage("Service type is required"),
//     body("numberOfPassengers")
//       .isInt({ min: 1 })
//       .withMessage("Passengers must be at least 1"),
//     body("plane").notEmpty().withMessage("Plane ID is required"),
//   ],
//   controller.createBooking
// );

// // UPDATE BOOKING
// router.put("/:id", controller.updateBooking);

// // UPDATE BOOKING STATUS ONLY
// router.patch("/:id/status", controller.updateStatus);

// // CANCEL BOOKING (safe delete)
// router.delete("/:id", controller.cancelBooking);

// module.exports = router;

















// const express = require("express");
// const router = express.Router();
// const controller = require("../controllers/airportBookingController");
// const { body } = require("express-validator");

// /* =======================
//    PLANES
// ======================= */
// router.get("/planes/all", controller.getAllPlanes);
// router.get("/planes/:id", controller.getPlane);

// router.post(
//   "/planes",
//   [
//     body("model").notEmpty().withMessage("Model is required"),
//     body("manufacturer").notEmpty().withMessage("Manufacturer is required"),
//     body("yearOfManufacture")
//       .toInt()
//       .isInt({ min: 1950 })
//       .withMessage("Invalid year"),
//   ],
//   controller.createPlane
// );

// router.put("/planes/:id", controller.updatePlane);
// router.delete("/planes/:id", controller.deletePlane);
// router.post("/planes/:id/upload-image", controller.uploadPlaneImage);

// /* =======================
//    BOOKINGS
// ======================= */
// router.get("/", controller.getAllBookings);
// router.get("/email/:email", controller.getBookingsByEmail);
// router.get("/booking/:id", controller.getBooking);

// router.post(
//   "/",
//   [
//     body("firstName").notEmpty().withMessage("First name is required"),
//     body("lastName").notEmpty().withMessage("Last name is required"),
//     body("email").isEmail().withMessage("Valid email is required"),
//     body("serviceType").notEmpty().withMessage("Service type is required"),
//     body("numberOfPassengers")
//       .isInt({ min: 1 })
//       .withMessage("Passengers must be at least 1"),
//     body("plane").notEmpty().withMessage("Plane ID is required"),
//   ],
//   controller.createBooking
// );

// router.put("/:id", controller.updateBooking);
// router.patch("/:id/status", controller.updateStatus);
// router.delete("/:id", controller.cancelBooking);

// module.exports = router;




















const express = require("express");
const router = express.Router();
const controller = require("../controllers/airportBookingController");
const { body } = require("express-validator");

/* =======================
   PLANES ROUTES
======================= */

// Get all planes
router.get("/planes/all", controller.getPlanes);

// Get single plane
router.get("/planes/:id", controller.getPlane);

// Create plane + Cloudinary images
router.post(
  "/planes",
  controller.upload.array("images", 5), // 👈 multer from controller
  [
    body("registrationNumber").notEmpty().withMessage("Registration number is required"),
    body("model").notEmpty().withMessage("Model is required"),
    body("manufacturer").notEmpty().withMessage("Manufacturer is required"),
    body("yearOfManufacture")
      .toInt()
      .isInt({ min: 1950 })
      .withMessage("Invalid year of manufacture"),
  ],
  controller.createPlane
);

// Update plane (optionally add images)
router.put(
  "/planes/:id",
  controller.upload.array("images", 5),
  controller.updatePlane
);

// Delete plane (also deletes Cloudinary images)
router.delete("/planes/:id", controller.deletePlane);


/* =======================
   BOOKINGS ROUTES
======================= */

// Get all bookings
router.get("/", controller.getBookings);

// Get bookings by email
router.get("/email/:email", controller.getBookingsByEmail);

// Get single booking
router.get("/booking/:id", controller.getBooking);

// Create booking + email notification
router.post(
  "/",
  [
    body("firstName").notEmpty().withMessage("First name is required"),
    body("lastName").notEmpty().withMessage("Last name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("serviceType").notEmpty().withMessage("Service type is required"),
    body("numberOfPassengers")
      .isInt({ min: 1 })
      .withMessage("Passengers must be at least 1"),
    body("plane").notEmpty().withMessage("Plane ID is required"),
  ],
  controller.createBooking
);

// Update booking (full update)
router.put("/:id", controller.updateBooking);

// Update booking status only + email
router.patch("/:id/status", controller.updateBookingStatus);

// Cancel / delete booking
router.delete("/:id", controller.deleteBooking);

module.exports = router;
