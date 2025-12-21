// const express = require('express');
// const router = express.Router();
// const testimonialController = require('../controllers/testimonialController');
// const upload = require('../services/upload');


// // Public routes
// router.route('/')
//   .get(testimonialController.getTestimonials)
//   .post(upload.single('image'), testimonialController.createTestimonial);

// router.route('/:id')
//   .get(testimonialController.getTestimonial);

// // Admin routes
// router.route('/:id')
//   .put(upload.single('image'), testimonialController.updateTestimonial)
//   .delete(testimonialController.deleteTestimonial);

// router.route('/:id/approve')
//   .put(testimonialController.approveTestimonial);

// router.route('/stats')
//   .get(testimonialController.getStatistics);

// module.exports = router;





const express = require('express');
const router = express.Router();

const controller = require('../controllers/testimonialController');
const upload = require('../services/upload');

// CRUD
router
  .route('/')
  .get(controller.getTestimonials)
  .post(upload.single('image'), controller.createTestimonial);

router
  .route('/:id')
  .get(controller.getTestimonial)
  .delete(controller.deleteTestimonial);

router.patch('/:id/status', controller.updateStatus);

// STATISTICS
router.get('/stats/overview', controller.getTestimonialStats);
router.get('/stats/country', controller.getStatsByCountry);
router.get('/stats/university', controller.getStatsByUniversity);

module.exports = router;
