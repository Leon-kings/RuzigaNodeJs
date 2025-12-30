const express = require('express');
const router = express.Router();
const {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  getTrendingBlogs,
  likeBlog,
  getComments,
  createComment,
  createBooking,
  getAllBookings,
  updateBookingStatus,
  getStatistics,
  sendContactEmail,
  testEmail
} = require('../controllers/blogControllers');

// Blog routes
router.get('/', getAllBlogs);
router.get('/trending', getTrendingBlogs);
router.get('/:id', getBlogById);
router.post('/', createBlog);
router.put('/:id', updateBlog);
router.delete('/:id', deleteBlog);
router.post('/:id/like', likeBlog);

// Comment routes
router.get('/:postId/comments', getComments);
router.post('/:postId/comments', createComment);

// Booking routes
router.post('/bookings', createBooking);
router.get('/bookings', getAllBookings);
router.put('/bookings/:id/status', updateBookingStatus);

// Statistics routes
router.get('/statistics', getStatistics);

// Email routes
router.post('/contact', sendContactEmail);
router.post('/email/test', testEmail);

module.exports = router;