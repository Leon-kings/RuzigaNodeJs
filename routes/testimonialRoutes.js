
const express = require('express');
const router = express.Router();

const testimonialController = require('../controllers/testimonialController');
const upload = require('../services/upload');

// Get all testimonials
router.get('/', testimonialController.getAllTestimonials);

// Get single testimonial
router.get('/:email', testimonialController.getTestimonialsByEmail);
router.get('/:id', testimonialController.getTestimonial);

// Create testimonial
router.post('/', upload.single('image'), testimonialController.createTestimonial);

// Update testimonial
router.put('/:id', upload.single('image'), testimonialController.updateTestimonial);

// Delete testimonial
router.delete('/:id', testimonialController.deleteTestimonial);

// Approve testimonial
router.put('/:id/approve', testimonialController.approveTestimonial);

// STATISTICS
router.get('/stats/overview', testimonialController.getTestimonialStats);
router.get('/stats/country', testimonialController.getStatsByCountry);
router.get('/stats/university', testimonialController.getStatsByUniversity);

module.exports = router;
