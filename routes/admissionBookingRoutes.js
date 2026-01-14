const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const AdmissionController = require("../controllers/admissionBookingController");

// ====================
// MULTER CONFIG
// ====================
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    const uniqueSuffix =
      Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname +
        "-" +
        uniqueSuffix +
        path.extname(file.originalname)
    );
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/webp",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});

// ====================
// HEALTH
// ====================
router.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Admission Booking API running",
  });
});

// ====================
// BOOKINGS
// ====================
router.post(
  "/bookings",
  (req, res, next) => {
    if (!req.body.booking) {
      return res.status(400).json({
        success: false,
        message: "Booking data is required",
      });
    }
    next();
  },
  AdmissionController.createBooking
);

router.get("/bookings", AdmissionController.getRecords);

router.get(
  "/my-bookings",
  (req, res, next) => {
    req.params.recordType = "booking";
    next();
  },
  AdmissionController.getUserRecords
);

router.get("/bookings/:id", AdmissionController.getRecord);

router.put("/bookings/:id", AdmissionController.updateRecord);

router.delete("/bookings/:id", AdmissionController.deleteRecord);

router.post(
  "/bookings/reminders/send",
  AdmissionController.sendBookingReminders
);

// ====================
// UNIVERSITIES
// ====================
router.post(
  "/universities",
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ]),
  (req, res, next) => {
    if (!req.body.university) {
      return res.status(400).json({
        success: false,
        message: "University data is required",
      });
    }
    next();
  },
  AdmissionController.createUniversity
);

router.get("/universities", AdmissionController.getRecords);

router.get(
  "/my-universities",
  (req, res, next) => {
    req.params.recordType = "university";
    next();
  },
  AdmissionController.getUserRecords
);

router.get("/universities/:id", AdmissionController.getRecord);

router.put(
  "/universities/:id",
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ]),
  AdmissionController.updateRecord
);

router.delete(
  "/universities/:id",
  AdmissionController.deleteRecord
);

// ====================
// APPLICATIONS
// ====================
router.post(
  "/applications",
  upload.array("documents", 20),
  (req, res, next) => {
    if (!req.body.application) {
      return res.status(400).json({
        success: false,
        message: "Application data is required",
      });
    }
    next();
  },
  AdmissionController.createApplication
);

router.get("/applications", AdmissionController.getRecords);

router.get(
  "/my-applications",
  (req, res, next) => {
    req.params.recordType = "application";
    next();
  },
  AdmissionController.getUserRecords
);

router.get("/applications/:id", AdmissionController.getRecord);

router.put(
  "/applications/:id",
  upload.array("documents", 20),
  AdmissionController.updateRecord
);

router.delete(
  "/applications/:id",
  AdmissionController.deleteRecord
);

// ====================
// STATISTICS & ANALYTICS
// ====================
router.get(
  "/statistics/:recordType",
  AdmissionController.getStatistics
);

router.get(
  "/statistics/dashboard/overview",
  AdmissionController.getDashboardStatistics
);

router.get(
  "/analytics/:type",
  AdmissionController.getAnalytics
);

// ====================
// ERROR HANDLING
// ====================
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  if (err.message === "Invalid file type") {
    return res.status(400).json({
      success: false,
      message: "Invalid file type uploaded",
    });
  }

  next(err);
});

// ====================
// EXPORT
// ====================
module.exports = router;
