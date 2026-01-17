const express = require("express");
const router = express.Router();
const scholarshipController = require("../controllers/scholarshipController");
const {
  specificDocumentUpload,
  cleanupTempFiles,
  singleDocumentUpload,
} = require("../services/uploadScholarship");

// Public routes
router.post("/", scholarshipController.createScholarshipApplication);
router.get("/", scholarshipController.getAllApplications);
router.get("/:email", scholarshipController.getApplicationsByEmail);
router.get("/:id", scholarshipController.getApplicationById);

router.get("/:id/statistics", scholarshipController.getApplicationStatistics);

// Protected routes (add auth middleware as needed)
router.put("/:id", scholarshipController.updateApplication);
router.delete("/:id", scholarshipController.deleteApplication);

// Document management routes
// router.post('/:id/upload/:documentType', singleDocumentUpload, scholarshipController.uploadDocument);
router.post(
  "/:id/upload/:documentType",
  singleDocumentUpload,
  cleanupTempFiles,
  scholarshipController.uploadDocument
);
router.delete(
  "/:id/documents/:documentType/:documentId",
  scholarshipController.deleteDocument
);

// Status and review routes
router.post("/:id/status", scholarshipController.updateStatus);
router.post("/:id/assign", scholarshipController.assignToReviewer);
router.post("/:id/review/comments", scholarshipController.addReviewComment);
router.post("/:id/review/scores", scholarshipController.updateReviewScores);
router.post("/:id/decision", scholarshipController.makeDecision);

// Email routes
router.post("/email/bulk", scholarshipController.sendBulkEmailToApplicants);

module.exports = router;
