const express = require('express');
const router = express.Router();
const testimonialController = require('../controllers/testimonialController');
const upload = require('../services/upload');


// Public routes
router.route('/')
  .get(testimonialController.getTestimonials)
  .post(upload.single('image'), testimonialController.createTestimonial);

router.route('/:id')
  .get(testimonialController.getTestimonial);

// Admin routes
router.route('/:id')
  .put(upload.single('image'), testimonialController.updateTestimonial)
  .delete(testimonialController.deleteTestimonial);

router.route('/:id/approve')
  .put(testimonialController.approveTestimonial);

router.route('/stats')
  .get(testimonialController.getStatistics);

module.exports = router;