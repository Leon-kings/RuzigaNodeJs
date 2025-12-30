const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogControllers');

// =========== PUBLIC ROUTES ===========

// Blog routes
router.get('/', blogController.getAllBlogs);
router.get('/trending', blogController.getTrendingBlogs);
router.get('/:id', blogController.getBlogById);
router.post('/:id/like', blogController.likeBlog);

// Comment routes
router.get('/:postId/comments', blogController.getComments);
router.post('/:postId/comments', blogController.createComment);

// Image upload routes (public)
router.post('/upload/image', blogController.uploadImage);
router.post('/upload/images', blogController.uploadMultipleImages);

// Booking routes
router.post('/bookings', blogController.createBooking);

// Contact and newsletter
router.post('/contact', blogController.sendContactEmail);
router.post('/newsletter/subscribe', blogController.subscribeNewsletter);

// =========== ADMIN/PROTECTED ROUTES ===========

// Blog management
router.post('/', blogController.createBlog);
router.put('/:id', blogController.updateBlog);
router.delete('/:id', blogController.deleteBlog);
router.delete('/:id/hard', blogController.hardDeleteBlog);
router.put('/:id/image', blogController.updateBlogImage);

// Comment management
router.get('/comments', blogController.getAllComments);
router.put('/comments/:id/status', blogController.updateCommentStatus);
router.delete('/comments/:id', blogController.deleteComment);

// Booking management
router.get('/bookings', blogController.getAllBookings);
router.get('/bookings/:id', blogController.getBookingById);
router.put('/bookings/:id/status', blogController.updateBookingStatus);

// Statistics and analytics
router.get('/statistics', blogController.getStatistics);
router.get('/analytics', blogController.getAnalytics);

// Email testing
router.post('/test-email', blogController.testEmail);

module.exports = router;