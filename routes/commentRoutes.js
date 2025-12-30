const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');


// =========== PUBLIC ROUTES ===========

// Get comment statistics (admin)
router.get('/admin/statistics', commentController.getCommentStats);
// Get comments for a blog post
router.get('/post/:postId', commentController.getCommentsByPost);

// Create comment
router.post('/post/:postId', commentController.createComment);

// =========== ADMIN ROUTES ===========

// Get all comments (admin)
router.get('/admin/all', commentController.getAllComments);

// Get comment by ID (admin)
router.get('/admin/:id', commentController.getCommentById);

// Update comment (admin)
router.put('/admin/:id', commentController.updateComment);

// Delete comment (admin)
router.delete('/admin/:id', commentController.deleteComment);

// Bulk update comments (admin)
router.post('/admin/bulk-update', commentController.bulkUpdateComments);



module.exports = router;