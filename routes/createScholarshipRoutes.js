// const express = require('express');
// const router = express.Router();

// const scholarshipController = require('../controllers/createScholarshipController');

// // Multer middleware
// const uploadMiddleware = scholarshipController.uploadMiddleware;

// // CRUD routes
// router.get('/featured', scholarshipController.getAllScholarships);
// router.get('/:id', scholarshipController.getApplicationById);
// router.post(
//   '/',
//   uploadMiddleware.single('image'),
//   scholarshipController.createScholarship
// );
// router.put(
//   '/:id',
//   uploadMiddleware.single('image'),
//   scholarshipController.updateScholarship
// );
// router.delete('/:id', scholarshipController.deleteScholarship);

// // Image-only upload route
// router.post(
//   '/:id/image',
//   uploadMiddleware.single('image'),
//   scholarshipController.uploadScholarshipImage
// );

// module.exports = router;










const express = require('express');
const router = express.Router();

const scholarshipController = require('../controllers/createScholarshipController');

/* ==============================
   SCHOLARSHIP ROUTES
================================ */

// Get all scholarships (supports ?featured=true)
router.get('/', scholarshipController.getAllScholarships);

// Get featured scholarships only
router.get('/featured', (req, res, next) => {
  req.query.featured = 'true';
  next();
}, scholarshipController.getAllScholarships);

// Get scholarship by ID
router.get('/:id', scholarshipController.getApplicationById);
router.get('/:email', scholarshipController.getScholarshipsByEmail);

// Create scholarship
router.post(
  '/',
  scholarshipController.uploadSingleImage,
  scholarshipController.createScholarship
);

// Update scholarship
router.put(
  '/:id',
  scholarshipController.uploadSingleImage,
  scholarshipController.updateScholarship
);

// Delete scholarship
router.delete('/:id', scholarshipController.deleteScholarship);

// Upload / replace scholarship image only
router.post(
  '/:id/image',
  scholarshipController.uploadSingleImage,
  scholarshipController.uploadScholarshipImage
);

module.exports = router;
