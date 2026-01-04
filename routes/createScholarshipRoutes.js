const express = require('express');
const router = express.Router();

const scholarshipController = require('../controllers/createScholarshipController');

// Multer middleware
const uploadMiddleware = scholarshipController.uploadMiddleware;

// CRUD routes
router.get('/featured', scholarshipController.getAllScholarships);
router.get('/:id', scholarshipController.getApplicationById);
router.post(
  '/',
  uploadMiddleware.single('image'),
  scholarshipController.createScholarship
);
router.put(
  '/:id',
  uploadMiddleware.single('image'),
  scholarshipController.updateScholarship
);
router.delete('/:id', scholarshipController.deleteScholarship);

// Image-only upload route
router.post(
  '/:id/image',
  uploadMiddleware.single('image'),
  scholarshipController.uploadScholarshipImage
);

module.exports = router;
