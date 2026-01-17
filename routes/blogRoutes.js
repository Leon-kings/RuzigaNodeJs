const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogControllers');


// =========== PUBLIC ROUTES ===========

// Get all published blogs (with optional filters)
router.get('/', blogController.getAllBlogs);

// Get blog by ID
router.get('/:id', blogController.getBlogById);
router.get('/:email', blogController.getBlogsByEmail);

// Get trending blogs
router.get('/trending/posts', blogController.getTrendingBlogs);

// Search blogs
router.get('/search/all', blogController.searchBlogs);

// Like a blog
router.post('/:id/like', blogController.likeBlog);

// =========== PROTECTED ADMIN ROUTES ===========

// Statistics route - MUST come before /:id to avoid conflict
router.get('/admin/statistics/all', blogController.getStatistics);

// Create new blog
router.post('/admin/create', blogController.createBlog);

// Update blog
router.put('/admin/:id/update', blogController.updateBlog);

// Soft delete (archive) blog
router.delete('/admin/:id/archive', blogController.deleteBlog);

// Hard delete blog
router.delete('/admin/:id/permanent', blogController.hardDeleteBlog);

// Restore blog
router.put('/admin/:id/restore', blogController.restoreBlog);

// Update blog image only
router.put('/admin/:id/image', blogController.updateBlogImage);

// Upload image
router.post('/admin/upload/image', blogController.uploadImage);

// Upload multiple images
router.post('/admin/upload/images', blogController.uploadMultipleImages);

module.exports = router;