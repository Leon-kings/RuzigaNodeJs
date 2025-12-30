const models = require('../models/Blog');
const nodemailer = require('nodemailer');

// Email transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

// Send email function
const sendEmail = async (to, subject, html) => {
  try {
    const transporter = createTransporter();
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'noreply@ruziga.com',
      to,
      subject,
      html
    });
    console.log('Email sent:', info.messageId);
    return { success: true };
  } catch (error) {
    console.error('Email error:', error);
    return { success: false, error: error.message };
  }
};

// Track event
const trackEvent = async (type, data = {}, req = null) => {
  try {
    const statData = {
      type,
      ...data,
      timestamp: new Date()
    };

    if (req) {
      statData.ip = req.ip;
      statData.userAgent = req.get('user-agent');
      statData.browser = req.headers['sec-ch-ua'] || 'Unknown';
      statData.device = req.headers['sec-ch-ua-mobile'] ? 'Mobile' : 'Desktop';
    }

    if (models.Statistics) {
      const stat = new models.Statistics(statData);
      await stat.save();
    }
    
    return true;
  } catch (error) {
    console.error('Track error:', error);
    return false;
  }
};

// =========== COMMENT CONTROLLERS ===========

// Get comments for a blog post (public)
exports.getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params;
    
    // Check if post exists
    const post = await models.Blog.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    const comments = await models.Comment.find({ 
      post: postId, 
      isApproved: true 
    })
    .sort('-createdAt')
    .select('-email -__v');

    res.json({
      success: true,
      data: comments,
      total: comments.length
    });
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching comments'
    });
  }
};

// Create comment (public)
exports.createComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content, author, email } = req.body;

    // Validate input
    if (!content || !author || !email) {
      return res.status(400).json({
        success: false,
        message: 'Content, author, and email are required'
      });
    }

    if (content.length > 1000) {
      return res.status(400).json({
        success: false,
        message: 'Comment cannot exceed 1000 characters'
      });
    }

    // Check if post exists
    const post = await models.Blog.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    // Check if post allows comments (published posts only)
    if (post.status !== 'published') {
      return res.status(403).json({
        success: false,
        message: 'Comments are not allowed on this post'
      });
    }

    // Create comment
    const comment = new models.Comment({
      content: content.trim(),
      post: postId,
      author: author.trim(),
      email: email.toLowerCase().trim(),
      isApproved: true // Auto-approve for now
    });

    await comment.save();

    // Increment comment count on blog post
    post.comments += 1;
    await post.save();

    // Track event
    await trackEvent('comment', { 
      post: postId,
      author: comment.author
    }, req);

    // Send notification email to admin
    if (process.env.ADMIN_EMAIL) {
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">New Comment on "${post.title}"</h2>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Post:</strong> ${post.title}</p>
            <p><strong>Author:</strong> ${comment.author}</p>
            <p><strong>Email:</strong> ${comment.email}</p>
            <p><strong>Comment:</strong> ${comment.content}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
          </div>
          <p>Post URL: ${process.env.FRONTEND_URL || 'https://yourdomain.com'}/blog/${post.slug}</p>
        </div>
      `;
      
      await sendEmail(
        process.env.ADMIN_EMAIL,
        `New Comment: ${post.title.substring(0, 50)}...`,
        emailHtml
      );
    }

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: {
        _id: comment._id,
        content: comment.content,
        author: comment.author,
        post: comment.post,
        createdAt: comment.createdAt,
        isApproved: comment.isApproved
      }
    });
  } catch (error) {
    console.error('Create comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding comment'
    });
  }
};

// Admin: Get all comments
exports.getAllComments = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, postId, search } = req.query;
    const query = {};

    // Filter by approval status
    if (status === 'approved') {
      query.isApproved = true;
    } else if (status === 'pending') {
      query.isApproved = false;
    }

    // Filter by post
    if (postId) {
      query.post = postId;
    }

    // Search by author or content
    if (search) {
      query.$or = [
        { author: new RegExp(search, 'i') },
        { content: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') }
      ];
    }

    const comments = await models.Comment.find(query)
      .populate('post', 'title slug')
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await models.Comment.countDocuments(query);

    res.json({
      success: true,
      data: comments,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page)
    });
  } catch (error) {
    console.error('Get all comments error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching comments'
    });
  }
};

// Admin: Get comment by ID
exports.getCommentById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const comment = await models.Comment.findById(id)
      .populate('post', 'title slug category');

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    res.json({
      success: true,
      data: comment
    });
  } catch (error) {
    console.error('Get comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching comment'
    });
  }
};

// Admin: Update comment (approve/reject)
exports.updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { isApproved, content } = req.body;

    const comment = await models.Comment.findById(id);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    // Update fields if provided
    if (isApproved !== undefined) {
      comment.isApproved = isApproved;
    }
    
    if (content) {
      comment.content = content.trim();
    }

    await comment.save();

    // Get updated comment with post info
    const updatedComment = await models.Comment.findById(id)
      .populate('post', 'title');

    res.json({
      success: true,
      message: `Comment ${isApproved ? 'approved' : 'rejected'} successfully`,
      data: updatedComment
    });
  } catch (error) {
    console.error('Update comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating comment'
    });
  }
};

// Admin: Delete comment
exports.deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    
    const comment = await models.Comment.findById(id);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    // Decrement comment count on blog post
    await models.Blog.findByIdAndUpdate(comment.post, {
      $inc: { comments: -1 }
    });

    // Delete the comment
    await models.Comment.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Comment deleted successfully'
    });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting comment'
    });
  }
};

// Admin: Bulk update comments
exports.bulkUpdateComments = async (req, res) => {
  try {
    const { commentIds, action } = req.body;

    if (!commentIds || !Array.isArray(commentIds) || commentIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of comment IDs'
      });
    }

    let updateData = {};
    let message = '';

    switch (action) {
      case 'approve':
        updateData = { isApproved: true };
        message = 'Comments approved';
        break;
      case 'reject':
        updateData = { isApproved: false };
        message = 'Comments rejected';
        break;
      case 'delete':
        // Bulk delete
        const comments = await models.Comment.find({ _id: { $in: commentIds } });
        
        // Update blog post comment counts
        for (const comment of comments) {
          await models.Blog.findByIdAndUpdate(comment.post, {
            $inc: { comments: -1 }
          });
        }
        
        await models.Comment.deleteMany({ _id: { $in: commentIds } });
        return res.json({
          success: true,
          message: 'Comments deleted successfully',
          count: commentIds.length
        });
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid action. Use approve, reject, or delete'
        });
    }

    const result = await models.Comment.updateMany(
      { _id: { $in: commentIds } },
      updateData
    );

    res.json({
      success: true,
      message: `${message} successfully`,
      count: result.modifiedCount
    });
  } catch (error) {
    console.error('Bulk update comments error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating comments'
    });
  }
};

// Admin: Get comment statistics
exports.getCommentStats = async (req, res) => {
  try {
    // Get counts
    const totalComments = await models.Comment.countDocuments();
    const approvedComments = await models.Comment.countDocuments({ isApproved: true });
    const pendingComments = await models.Comment.countDocuments({ isApproved: false });
    
    // Get recent comments
    const recentComments = await models.Comment.find()
      .sort('-createdAt')
      .limit(10)
      .populate('post', 'title slug')
      .select('author content isApproved createdAt');

    // Get comments by post
    const commentsByPost = await models.Comment.aggregate([
      {
        $group: {
          _id: '$post',
          count: { $sum: 1 },
          approved: {
            $sum: { $cond: [{ $eq: ['$isApproved', true] }, 1, 0] }
          }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Populate post titles
    for (const item of commentsByPost) {
      const post = await models.Blog.findById(item._id).select('title slug');
      if (post) {
        item.post = post;
      }
    }

    res.json({
      success: true,
      data: {
        total: totalComments,
        approved: approvedComments,
        pending: pendingComments,
        recentComments,
        commentsByPost,
        stats: {
          approvalRate: totalComments > 0 ? (approvedComments / totalComments * 100).toFixed(1) : 0
        }
      }
    });
  } catch (error) {
    console.error('Get comment stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching comment statistics'
    });
  }
};