// // const express = require('express');
// // const router = express.Router();
// // const { VisaController, errorHandler } = require('../controllers/visaController');

// // // CRUD operations
// // router.post('/', (req, res, next) => VisaController.createVisa(req, res, next));
// // router.get('/', (req, res, next) => VisaController.getAllVisas(req, res, next));
// // router.get('/search', (req, res, next) => VisaController.searchVisas(req, res, next));
// // router.get('/:id', (req, res, next) => VisaController.getVisaById(req, res, next));
// // router.put('/:id', (req, res, next) => VisaController.updateVisa(req, res, next));
// // router.delete('/:id', (req, res, next) => VisaController.deleteVisa(req, res, next));

// // // Bulk operations
// // router.post('/bulk', (req, res, next) => VisaController.bulkUpdate(req, res, next));

// // // Statistics
// // router.get('/stats/overall', (req, res, next) => VisaController.getStatistics(req, res, next));
// // router.get('/stats/inventory', (req, res, next) => VisaController.getInventoryStatistics(req, res, next));

// // // Email services
// // router.post('/send-email', (req, res, next) => VisaController.sendEmail(req, res, next));

// // module.exports = router;







// // routes/visaRoutes.js
// const express = require('express');
// const router = express.Router();
// const { VisaController } = require('../controllers/visaController');

// /* ===========================
//    VISA APPLICATION ROUTES
// =========================== */

// // 1. GET ALL VISAS WITH FILTERING & PAGINATION
// // GET /api?status=pending&type=tourist&country=USA&page=1&limit=10&sortBy=createdAt&sortOrder=desc
// router.get('/', VisaController.getAllVisas);

// // 2. GET SINGLE VISA BY ID
// // GET /api/VISA-2024-001
// router.get('/:id', VisaController.getVisaById);

// // 3. CREATE NEW VISA APPLICATION
// // POST /api
// router.post('/', VisaController.createVisa);

// // 4. UPDATE VISA APPLICATION
// // PUT /api/VISA-2024-001
// router.put('/:id', VisaController.updateVisa);

// // 5. DELETE VISA APPLICATION
// // DELETE /api/VISA-2024-001
// router.delete('/:id', VisaController.deleteVisa);

// /* ===========================
//    SEARCH & FILTER ROUTES
// =========================== */

// // 6. SEARCH VISAS
// // GET /api/search?query=john
// router.get('/search', VisaController.searchVisas);

// /* ===========================
//    STATUS MANAGEMENT ROUTES
// =========================== */

// // 7. UPDATE STATUS OF SINGLE VISA
// // PUT /api/VISA-2024-001/status
// router.put('/:id/status', VisaController.updateStatus);

// // 8. GET STATUS HISTORY OF A VISA
// // GET /api/VISA-2024-001/status-history
// router.get('/:id/status-history', VisaController.getStatusHistory);

// // 9. GET AVAILABLE STATUS OPTIONS
// // GET /api/status-options?currentStatus=pending
// router.get('/status-options', VisaController.getStatusOptions);

// // 10. GET APPLICATIONS BY SPECIFIC STATUS
// // GET /api/status/pending
// router.get('/status/:status', VisaController.getApplicationsByStatus);

// /* ===========================
//    BULK OPERATIONS ROUTES
// =========================== */

// // 11. BULK UPDATE STATUS
// // POST /api/bulk/status
// router.post('/bulk/status', VisaController.bulkUpdateStatus);

// /* ===========================
//    STATISTICS & ANALYTICS ROUTES
// =========================== */

// // 12. GET OVERALL STATISTICS
// // GET /api/statistics
// router.get('/statistics', VisaController.getStatistics);

// // 13. GET INVENTORY STATISTICS
// // GET /api/statistics/inventory
// router.get('/statistics/inventory', VisaController.getInventoryStatistics);

// /* ===========================
//    EMAIL & NOTIFICATION ROUTES
// =========================== */

// // 14. SEND EMAIL NOTIFICATION
// // POST /api/notifications/email
// router.post('/notifications/email', VisaController.sendEmail);

// /* ===========================
//    HEALTH & INFO ROUTES
// =========================== */

// // 15. API HEALTH CHECK
// router.get('/health', (req, res) => {
//   res.status(200).json({
//     success: true,
//     message: 'Visa Management API is running',
//     timestamp: new Date().toISOString(),
//     version: '1.0.0'
//   });
// });


// // 18. CLEAR TEST DATA (Development only)
// router.delete('/test-data', async (req, res) => {
//   try {
//     // Note: In production, implement proper deletion
//     // const result = await Visa.deleteMany({ id: /^TEST-/ });
    
//     res.json({
//       success: true,
//       message: 'Test data cleared'
//     });
//   } catch (err) {
//     res.status(500).json({
//       success: false,
//       message: 'Error clearing test data',
//       error: err.message
//     });
//   }
// });

// module.exports = router;






// const express = require('express');
// const router = express.Router();
// const multer = require('multer');
// const {
//   BookingController,
//   ApplicationController,
//   StatisticsController,
//   QueryController
// } = require('../controllers/visaController');

// // Configure multer for file uploads
// const storage = multer.memoryStorage();
// const upload = multer({
//   storage: storage,
//   limits: {
//     fileSize: 10 * 1024 * 1024 // 10MB limit
//   },
//   fileFilter: (req, file, cb) => {
//     const allowedTypes = /jpeg|jpg|png|pdf|doc|docx/;
//     const extname = allowedTypes.test(file.originalname.toLowerCase().split('.').pop());
//     const mimetype = allowedTypes.test(file.mimetype);
    
//     if (extname && mimetype) {
//       return cb(null, true);
//     }
//     cb(new Error('Only images and PDF/DOC files are allowed'));
//   }
// });

// // ========== BOOKING ROUTES ==========
// router.post('/bookings', BookingController.createBooking);
// router.put('/bookings/:bookingId', BookingController.updateBooking);
// router.post('/bookings/:bookingId/schedule', BookingController.scheduleAppointment);
// router.post('/bookings/:bookingId/convert-to-application', BookingController.convertToApplication);

// // ========== APPLICATION ROUTES ==========
// router.post('/applications', ApplicationController.createApplication);
// router.post('/applications/:trackingNumber/documents', upload.single('file'), ApplicationController.uploadDocument);
// router.put('/applications/:trackingNumber/documents/verify', ApplicationController.verifyDocument);
// router.put('/applications/:trackingNumber/payments', ApplicationController.updatePayment);
// router.put('/applications/:trackingNumber/status', ApplicationController.updateStatus);

// // ========== STATISTICS ROUTES ==========
// router.get('/statistics/overview', StatisticsController.getOverview);
// router.get('/statistics/dashboard', StatisticsController.getDashboardStats);
// router.get('/statistics/agent-performance', StatisticsController.getAgentPerformance);
// router.get('/statistics/revenue', StatisticsController.getRevenueStats);

// // ========== QUERY ROUTES ==========
// router.get('/applications/search', QueryController.searchApplications);
// router.get('/applications/tracking/:trackingNumber', QueryController.getApplicationByTrackingNumber);
// router.get('/applications/status/:status', QueryController.getApplicationsByStatus);
// router.get('/applications/email/:email', QueryController.getApplicationsByEmail);

// module.exports = router;


























// const express = require('express');
// const router = express.Router();
// const multer = require('multer');
// const {
//   BookingController,
//   ApplicationController,
//   StatisticsController,
//   QueryController
// } = require('../controllers/visaController');

// // Configure multer for file uploads
// const storage = multer.memoryStorage();
// const upload = multer({
//   storage: storage,
//   limits: {
//     fileSize: 10 * 1024 * 1024 // 10MB limit
//   },
//   fileFilter: (req, file, cb) => {
//     const allowedTypes = /jpeg|jpg|png|pdf|doc|docx/;
//     const extname = allowedTypes.test(file.originalname.toLowerCase().split('.').pop());
//     const mimetype = allowedTypes.test(file.mimetype);
    
//     if (extname && mimetype) {
//       return cb(null, true);
//     }
//     cb(new Error('Only images and PDF/DOC files are allowed'));
//   }
// });

// // ========== BOOKING ROUTES ==========

// // Create and manage bookings
// router.post('/bookings', BookingController.createBooking);
// router.get('/bookings', BookingController.getAllBookings);
// router.get('/bookings/:bookingId', BookingController.getBookingById);
// router.put('/bookings/:bookingId', BookingController.updateBooking);
// router.post('/bookings/:bookingId/schedule', BookingController.scheduleAppointment);
// router.post('/bookings/:bookingId/convert-to-application', BookingController.convertToApplication);
// router.delete('/bookings/:bookingId/cancel', BookingController.cancelBooking);

// // Booking queries
// router.get('/bookings/customer/:email', BookingController.getBookingsByCustomerEmail);
// router.get('/bookings/upcoming/appointments', BookingController.getUpcomingAppointments);
// router.get('/bookings/statistics', BookingController.getBookingStatistics);

// // ========== APPLICATION ROUTES ==========

// // Create and manage applications
// router.post('/applications', ApplicationController.createApplication);
// router.get('/applications', ApplicationController.getAllApplications);
// router.get('/applications/tracking/:trackingNumber', ApplicationController.getApplicationByTrackingNumber);
// router.put('/applications/:trackingNumber/status', ApplicationController.updateStatus);
// router.put('/applications/:trackingNumber/payments', ApplicationController.updatePayment);

// // Document management
// router.post('/applications/:trackingNumber/documents', upload.single('file'), ApplicationController.uploadDocument);
// router.put('/applications/:trackingNumber/documents/verify', ApplicationController.verifyDocument);

// // Application queries
// router.get('/applications/status/:status', ApplicationController.getApplicationsByStatus);
// router.get('/applications/customer/:email', ApplicationController.getApplicationsByEmail);
// router.get('/applications/pending/documents', ApplicationController.getPendingDocumentsApplications);
// router.get('/applications/statistics', ApplicationController.getApplicationStatistics);

// // ========== STATISTICS ROUTES ==========
// router.get('/statistics/overview', StatisticsController.getOverview);
// router.get('/statistics/dashboard', StatisticsController.getDashboardStats);
// router.get('/statistics/agent-performance', StatisticsController.getAgentPerformance);
// router.get('/statistics/revenue', StatisticsController.getRevenueStats);

// // ========== QUERY ROUTES ==========
// router.get('/search', QueryController.searchApplications);
// router.get('/services', QueryController.getAllServices);

// module.exports = router;




























const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
  BookingController,
  ApplicationController,
  DocumentController,
  StatisticsController,
  QueryController
} = require('../controllers/visaController');

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf|doc|docx/;
    const extname = allowedTypes.test(file.originalname.toLowerCase().split('.').pop());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only images and PDF/DOC files are allowed'));
  }
});

// ========== BOOKING ROUTES ==========

// Create and manage bookings
router.post('/bookings', BookingController.createBooking);
router.get('/bookings', BookingController.getAllBookings);
router.get('/bookings/:bookingId', BookingController.getBookingById);
router.put('/bookings/:bookingId', BookingController.updateBooking);
router.post('/bookings/:bookingId/confirm-appointment', BookingController.confirmAppointment);
router.post('/bookings/:bookingId/complete-consultation', BookingController.markConsultationCompleted);
router.post('/bookings/:bookingId/convert-to-application', BookingController.convertToApplication);
router.post('/bookings/:bookingId/cancel', BookingController.cancelBooking);
router.get('/bookings/upcoming/appointments', BookingController.getUpcomingAppointments);

// ========== APPLICATION ROUTES ==========

// Create and manage applications
router.post('/applications', ApplicationController.createApplication);
router.get('/applications', ApplicationController.getAllApplications);
router.get('/applications/tracking/:trackingNumber', ApplicationController.getApplicationByTrackingNumber);
router.put('/applications/:trackingNumber', ApplicationController.updateApplication);
router.put('/applications/:trackingNumber/status', ApplicationController.updateApplicationStatus);
router.put('/applications/:trackingNumber/payment', ApplicationController.updatePayment);
router.post('/applications/:trackingNumber/add-country', ApplicationController.addAppliedCountry);

// Document management
router.post('/applications/:trackingNumber/documents', upload.single('file'), ApplicationController.uploadDocument);
router.put('/applications/:trackingNumber/documents/verify', ApplicationController.verifyDocument);

// Application queries
router.get('/applications/customer/:email', ApplicationController.getApplicationsByCustomerEmail);

// ========== DOCUMENT ROUTES ==========
router.get('/applications/:trackingNumber/documents', DocumentController.getApplicationDocuments);
router.delete('/applications/:trackingNumber/documents', DocumentController.deleteDocument);

// ========== QUERY ROUTES ==========
router.get('/search', ApplicationController.searchApplications); // Using ApplicationController.searchApplications
router.get('/applications/search', ApplicationController.searchApplications); // Alternative route

// ========== STATISTICS ROUTES ==========
router.get('/statistics/dashboard', StatisticsController.getDashboardStats);
router.get('/statistics/overview', StatisticsController.getDashboardStats); // Alias for compatibility

module.exports = router;