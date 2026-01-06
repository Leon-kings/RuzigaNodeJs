// // const express = require('express');
// // const router = express.Router();
// // const {
// //   getAllApplications,
// //   getApplication,
// //   createApplication,
// //   updateApplication,
// //   deleteApplication,
// //   submitApplication,
// //   updateStatus,
// //   uploadDocument,
// //   verifyDocument,
// //   addNote,
// //   getStatistics,
// //   getAdmissionRates,
// //   sendEmail,
// //   bulkUpdate,
// //   exportApplications,
// //   searchApplications,
// //   getTimelineStatistics // New function added
// // } = require('../controllers/admissionBookingController');
// // const upload = require('../services/documentService'); // For file uploads

// // // Public routes
// // router.post('/', createApplication);

// // // Basic CRUD routes
// // router.get('/', getAllApplications);
// // router.get('/search', searchApplications);
// // router.get('/:id', getApplication);
// // router.put('/:id', updateApplication);
// // router.delete('/:id', deleteApplication);

// // // Application workflow routes
// // router.post('/:id/submit', submitApplication);
// // router.put('/:id/status', updateStatus);

// // // Document management routes
// // router.post('/:id/documents', upload.single('document'), uploadDocument);
// // router.put('/:id/documents/:docId/verify', verifyDocument);

// // // Notes management
// // router.post('/:id/notes', addNote);

// // // Statistics routes
// // router.get('/statistics/all', getStatistics);
// // router.get('/statistics/timeline', getTimelineStatistics);
// // router.get('/statistics/admission-rates', getAdmissionRates);

// // // Email routes
// // router.post('/:id/send-email', sendEmail);

// // // Bulk operations (admin only)
// // router.post('/bulk/update', bulkUpdate);

// // // Export routes
// // router.get('/export/data', exportApplications);

// // module.exports = router;
// const express = require('express');
// const router = express.Router();
// const {
//   getAllApplications,
//   getApplication,
//   createApplication,
//   updateApplication,
//   deleteApplication,
//   submitApplication,
//   updateStatus,
//   uploadDocument,
//   verifyDocument,
//   addNote,
//   getStatistics,
//   getAdmissionRates,
//   sendEmail,
//   bulkUpdate,
//   exportApplications,
//   searchApplications,
//   getTimelineStatistics
// } = require('../controllers/admissionBookingController');

// // CORRECT: Import multer middleware, NOT documentService
// const upload = require('../services/documentService'); // This is the multer middleware

// // Public routes
// router.post('/', createApplication);

// // Basic CRUD routes
// router.get('/', getAllApplications);
// router.get('/search', searchApplications);
// router.get('/:id', getApplication);
// router.put('/:id', updateApplication);
// router.delete('/:id', deleteApplication);

// // Application workflow routes
// router.post('/:id/submit', submitApplication);
// router.put('/:id/status', updateStatus);

// // Document management routes - upload.single() will work now
// router.post('/:id/documents', upload.single('document'), uploadDocument);
// router.put('/:id/documents/:docId/verify', verifyDocument);

// // Notes management
// router.post('/:id/notes', addNote);

// // Statistics routes
// router.get('/statistics/all', getStatistics);
// router.get('/statistics/timeline', getTimelineStatistics);
// router.get('/statistics/admission-rates', getAdmissionRates);

// // Email routes
// router.post('/:id/send-email', sendEmail);

// // Bulk operations (admin only)
// router.post('/bulk/update', bulkUpdate);

// // Export routes
// router.get('/export/data', exportApplications);

// module.exports = router;





const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const AdmissionController = require("../controllers/admissionBookingController");

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const fileFilter = (req, file, cb) => {
  // Accept images and documents
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Invalid file type. Only images and documents are allowed."),
      false
    );
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// ====================
// ROUTES
// ====================

// Health check
router.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Admission Management API is running",
    timestamp: new Date(),
    version: "1.0.0",
  });
});

// ====================
// BOOKING ROUTES
// ====================

// Create booking
router.post(
  "/bookings",

  (req, res, next) => {
    // Simple validation
    if (!req.body.booking) {
      return res.status(400).json({
        success: false,
        message: "Booking data is required",
      });
    }
    next();
  },
  AdmissionController.createBooking.bind(AdmissionController)
);

// Get all bookings
router.get(
  "/bookings",

  AdmissionController.getRecords.bind(AdmissionController)
);

// Get booking by ID
router.get(
  "/bookings/:id",

  AdmissionController.getRecord.bind(AdmissionController)
);

// Update booking
router.put(
  "/bookings/:id",

  AdmissionController.updateRecord.bind(AdmissionController)
);

// Delete booking
router.delete(
  "/bookings/:id",

  AdmissionController.deleteRecord.bind(AdmissionController)
);

// Send booking reminders
router.post(
  "/bookings/reminders/send",

  AdmissionController.sendBookingReminders.bind(AdmissionController)
);

// ====================
// UNIVERSITY ROUTES
// ====================

// Create university
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
  AdmissionController.createUniversity.bind(AdmissionController)
);

// Get all universities
router.get(
  "/universities",
  AdmissionController.getRecords.bind(AdmissionController)
);

// Get university by ID
router.get(
  "/universities/:id",

  AdmissionController.getRecord.bind(AdmissionController)
);

// Update university
router.put(
  "/universities/:id",

  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ]),
  AdmissionController.updateRecord.bind(AdmissionController)
);

// Delete university
router.delete(
  "/universities/:id",

  AdmissionController.deleteRecord.bind(AdmissionController)
);

// ====================
// APPLICATION ROUTES
// ====================

// Create application
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
  AdmissionController.createApplication.bind(AdmissionController)
);

// Get all applications
router.get(
  "/applications",

  AdmissionController.getRecords.bind(AdmissionController)
);

// Get application by ID
router.get(
  "/applications/:id",

  AdmissionController.getRecord.bind(AdmissionController)
);

// Update application
router.put(
  "/applications/:id",

  upload.array("documents", 20),
  AdmissionController.updateRecord.bind(AdmissionController)
);

// Delete application
router.delete(
  "/applications/:id",

  AdmissionController.deleteRecord.bind(AdmissionController)
);

// Upload documents to application
router.post(
  "/applications/:id/documents",

  upload.array("documents", 20),
  AdmissionController.uploadDocuments.bind(AdmissionController)
);

// Update application status
router.patch(
  "/applications/:id/status",

  (req, res, next) => {
    if (!req.body.status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }
    next();
  },
  AdmissionController.updateApplicationStatus.bind(AdmissionController)
);

// Schedule interview
router.post(
  "/applications/:id/interview",

  (req, res, next) => {
    if (!req.body.interview) {
      return res.status(400).json({
        success: false,
        message: "Interview data is required",
      });
    }
    next();
  },
  AdmissionController.scheduleInterview.bind(AdmissionController)
);

// ====================
// STATISTICS ROUTES
// ====================

// Get statistics by record type
router.get(
  "/statistics/:recordType",

  AdmissionController.getStatistics.bind(AdmissionController)
);

// Get dashboard statistics
router.get(
  "/statistics/dashboard/overview",

  AdmissionController.getDashboardStatistics.bind(AdmissionController)
);

// Get analytics
router.get(
  "/analytics/:type",

  AdmissionController.getAnalytics.bind(AdmissionController)
);

// ====================
// FILE UPLOAD ROUTES
// ====================

// Upload file to Cloudinary
router.post(
  "/upload",

  upload.single("file"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded",
        });
      }

      const result = await AdmissionController.uploadToCloudinary(
        req.file,
        req.body.folder || "general"
      );

      if (!result.success) {
        return res.status(500).json(result);
      }

      res.json(result);
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to upload file",
        error: error.message,
      });
    }
  }
);

// Upload multiple files
router.post(
  "/upload/multiple",

  upload.array("files", 10),
  async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: "No files uploaded",
        });
      }

      const result = await AdmissionController.uploadMultipleToCloudinary(
        req.files,
        req.body.folder || "general"
      );

      res.json(result);
    } catch (error) {
      console.error("Multiple upload error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to upload files",
        error: error.message,
      });
    }
  }
);

// Delete file from Cloudinary
router.delete(
  "/upload/:publicId",

  async (req, res) => {
    try {
      const result = await AdmissionController.deleteFromCloudinary(
        req.params.publicId
      );
      res.json(result);
    } catch (error) {
      console.error("Delete upload error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to delete file",
        error: error.message,
      });
    }
  }
);

// ====================
// EMAIL TEST ROUTES
// ====================

// Test email sending
router.post(
  "/email/test",

  async (req, res) => {
    try {
      const { to, template, data } = req.body;

      if (!to) {
        return res.status(400).json({
          success: false,
          message: "Recipient email is required",
        });
      }

      const result = await AdmissionController.sendEmail(
        to,
        "Test Email - Admission Management",
        template || "application_submission",
        data || {}
      );

      res.json(result);
    } catch (error) {
      console.error("Test email error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to send test email",
        error: error.message,
      });
    }
  }
);

// ====================
// EXPORT
// ====================

module.exports = router;
