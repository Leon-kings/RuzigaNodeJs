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
//   getTimelineStatistics // New function added
// } = require('../controllers/admissionBookingController');
// const upload = require('../services/documentService'); // For file uploads

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

// // Document management routes
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
const express = require('express');
const router = express.Router();
const {
  getAllApplications,
  getApplication,
  createApplication,
  updateApplication,
  deleteApplication,
  submitApplication,
  updateStatus,
  uploadDocument,
  verifyDocument,
  addNote,
  getStatistics,
  getAdmissionRates,
  sendEmail,
  bulkUpdate,
  exportApplications,
  searchApplications,
  getTimelineStatistics
} = require('../controllers/admissionBookingController');

// CORRECT: Import multer middleware, NOT documentService
const upload = require('../services/documentService'); // This is the multer middleware

// Public routes
router.post('/', createApplication);

// Basic CRUD routes
router.get('/', getAllApplications);
router.get('/search', searchApplications);
router.get('/:id', getApplication);
router.put('/:id', updateApplication);
router.delete('/:id', deleteApplication);

// Application workflow routes
router.post('/:id/submit', submitApplication);
router.put('/:id/status', updateStatus);

// Document management routes - upload.single() will work now
router.post('/:id/documents', upload.single('document'), uploadDocument);
router.put('/:id/documents/:docId/verify', verifyDocument);

// Notes management
router.post('/:id/notes', addNote);

// Statistics routes
router.get('/statistics/all', getStatistics);
router.get('/statistics/timeline', getTimelineStatistics);
router.get('/statistics/admission-rates', getAdmissionRates);

// Email routes
router.post('/:id/send-email', sendEmail);

// Bulk operations (admin only)
router.post('/bulk/update', bulkUpdate);

// Export routes
router.get('/export/data', exportApplications);

module.exports = router;