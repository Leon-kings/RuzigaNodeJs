// const express = require('express');
// const router = express.Router();
// const multer = require('multer');
// const VisaController = require('../controllers/visaController');

// const upload = multer({
//   storage: multer.diskStorage({}),
//   limits: { fileSize: 5 * 1024 * 1024 }
// });

// /* ================= VISA CATALOG ================= */
// router.post('/catalog', upload.single('coverImage'), VisaController.createVisaCatalog);
// router.get('/catalog', VisaController.getVisaCatalogs);
// router.get('/catalog/:id', VisaController.getVisaCatalogById);
// router.put('/catalog/:id', upload.single('coverImage'), VisaController.updateVisaCatalog);
// router.delete('/catalog/:id', VisaController.deleteVisaCatalog);

// /* ================= BOOKINGS ================= */
// router.post('/bookings', VisaController.createBooking);
// router.get('/bookings', VisaController.getAllBookings);
// router.get('/bookings/:id', VisaController.getBookingById);
// router.put('/bookings/:id', VisaController.updateBooking);
// router.delete('/bookings/:id', VisaController.deleteBooking);

// /* ================= DOCUMENTS ================= */
// router.post(
//   '/bookings/:id/documents/:category',
//   upload.single('file'),
//   VisaController.uploadDocument
// );

// router.delete(
//   '/bookings/:id/documents/:category/:publicId',
//   VisaController.deleteDocument
// );

// /* ================= DASHBOARD ================= */
// router.get('/statistics/dashboard', VisaController.getDashboardStats);

// module.exports = router;



















// const express = require('express');
// const router = express.Router();
// const multer = require('multer');
// const VisaController = require('../controllers/visaController');

// // Configure multer for file uploads (diskStorage)
// const upload = multer({
//   storage: multer.diskStorage({}),
//   limits: { fileSize: 5 * 1024 * 1024 } // 5MB max
// });

// /* =========================
//    VISA CATALOG ROUTES
// ========================= */
// router.post(
//   '/catalog',
//   upload.single('coverImage'),
//   VisaController.createVisaCatalog
// );

// router.get('/catalog', VisaController.getVisaCatalogs);
// router.get('/catalog/:id', VisaController.getVisaCatalogById);

// router.put(
//   '/catalog/:id',
//   upload.single('coverImage'),
//   VisaController.updateVisaCatalog
// );

// router.delete('/catalog/:id', VisaController.deleteVisaCatalog);

// /* =========================
//    VISA BOOKINGS ROUTES
// ========================= */
// router.post('/bookings', VisaController.createBooking);
// router.get('/bookings', VisaController.getAllBookings);
// router.get('/bookings/:id', VisaController.getBookingById);
// router.put('/bookings/:id', VisaController.updateBooking);
// router.delete('/bookings/:id', VisaController.deleteBooking);

// /* =========================
//    DOCUMENTS ROUTES
// ========================= */
// router.post(
//   '/bookings/:id/documents/:category',
//   upload.single('file'),
//   VisaController.uploadDocument
// );

// router.delete(
//   '/bookings/:id/documents/:category/:publicId',
//   VisaController.deleteDocument
// );

// /* =========================
//    DASHBOARD STATISTICS
// ========================= */
// router.get('/statistics/dashboard', VisaController.getDashboardStats);

// module.exports = router;

















const express = require("express");
const router = express.Router();
const VisaController = require("../controllers/visaController");

/* =====================================================
   VISA CATALOG ROUTES
===================================================== */
router.post(
  "/catalog",
  VisaController.upload.single("coverImage"),
  VisaController.createVisaCatalog
);

router.get("/catalog", VisaController.getVisaCatalogs);
router.get("/catalog/:id", VisaController.getVisaCatalogById);

router.put(
  "/catalog/:id",
  VisaController.upload.single("coverImage"),
  VisaController.updateVisaCatalog
);

router.delete("/catalog/:id", VisaController.deleteVisaCatalog);

/* =====================================================
   VISA BOOKINGS ROUTES
===================================================== */
router.post("/bookings", VisaController.createBooking);
router.get("/bookings", VisaController.getAllBookings);
router.get("/bookings/email/:email", VisaController.getBookingsByEmail);
router.get("/bookings/:id", VisaController.getBookingById);
router.put("/bookings/:id", VisaController.updateBooking);
router.delete("/bookings/:id", VisaController.deleteBooking);

/* =====================================================
   DOCUMENTS ROUTES
===================================================== */
router.post(
  "/bookings/:id/documents/:category",
  VisaController.upload.single("file"),
  VisaController.uploadDocument
);

router.delete(
  "/bookings/:id/documents/:category/:publicId",
  VisaController.deleteDocument
);

/* =====================================================
   DASHBOARD STATISTICS
===================================================== */
router.get("/statistics/dashboard", VisaController.getDashboardStats);

module.exports = router;
