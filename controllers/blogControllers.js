const models = require('../models/Blog');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');

// Helper functions
const generateSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

const calculateReadTime = (content) => {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
};

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

    const stat = new models.Statistics(statData);
    await stat.save();
    return true;
  } catch (error) {
    console.error('Track error:', error);
    return false;
  }
};

// Blog Controllers
exports.getAllBlogs = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, search } = req.query;
    const query = { status: 'published' };

    if (category && category !== 'all') query.category = category;
    
    if (search) {
      query.$or = [
        { title: new RegExp(search, 'i') },
        { excerpt: new RegExp(search, 'i') },
        { tags: new RegExp(search, 'i') }
      ];
    }

    const blogs = await models.Blog.find(query)
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .select('-content');

    const total = await models.Blog.countDocuments(query);

    if (search) {
      await trackEvent('search', { query: search, category }, req);
    }

    res.json({
      success: true,
      data: blogs,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page)
    });
  } catch (error) {
    console.error('Get blogs error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching blogs'
    });
  }
};

exports.getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await models.Blog.findById(id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    blog.views += 1;
    await blog.save();

    await trackEvent('post_view', {
      post: blog._id,
      category: blog.category
    }, req);

    res.json({
      success: true,
      data: blog
    });
  } catch (error) {
    console.error('Get blog error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching blog'
    });
  }
};

exports.createBlog = async (req, res) => {
  try {
    const { title, excerpt, content, category, tags, author, featured, image } = req.body;
    
    const blog = new models.Blog({
      title,
      slug: generateSlug(title),
      excerpt,
      content,
      category,
      tags: tags || [],
      author,
      readTime: calculateReadTime(content),
      featured: featured || false,
      image: image || {
        url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80',
        alt: title
      }
    });

    await blog.save();

    res.status(201).json({
      success: true,
      message: 'Blog created',
      data: blog
    });
  } catch (error) {
    console.error('Create blog error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating blog'
    });
  }
};

exports.updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.title) updates.slug = generateSlug(updates.title);
    if (updates.content) updates.readTime = calculateReadTime(updates.content);

    const blog = await models.Blog.findByIdAndUpdate(id, updates, { new: true });

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    res.json({
      success: true,
      message: 'Blog updated',
      data: blog
    });
  } catch (error) {
    console.error('Update blog error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating blog'
    });
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await models.Blog.findByIdAndUpdate(id, { status: 'archived' }, { new: true });

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    res.json({
      success: true,
      message: 'Blog archived'
    });
  } catch (error) {
    console.error('Delete blog error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting blog'
    });
  }
};

exports.getTrendingBlogs = async (req, res) => {
  try {
    const blogs = await models.Blog.find({ status: 'published' })
      .sort({ views: -1, likes: -1 })
      .limit(5);

    res.json({
      success: true,
      data: blogs
    });
  } catch (error) {
    console.error('Trending error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching trending blogs'
    });
  }
};

exports.likeBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await models.Blog.findById(id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    blog.likes += 1;
    await blog.save();

    await trackEvent('like', { post: blog._id }, req);

    res.json({
      success: true,
      message: 'Blog liked',
      likes: blog.likes
    });
  } catch (error) {
    console.error('Like error:', error);
    res.status(500).json({
      success: false,
      message: 'Error liking blog'
    });
  }
};

// Comment Controllers
exports.getComments = async (req, res) => {
  try {
    const { postId } = req.params;
    const comments = await models.Comment.find({ post: postId, isApproved: true })
      .sort('-createdAt');

    res.json({
      success: true,
      data: comments
    });
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching comments'
    });
  }
};

exports.createComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content, author, email } = req.body;

    const post = await models.Blog.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    const comment = new models.Comment({
      content,
      post: postId,
      author: author || 'Anonymous',
      email
    });

    await comment.save();

    post.comments += 1;
    await post.save();

    await trackEvent('comment', { post: postId }, req);

    // Send email notification
    if (process.env.ADMIN_EMAIL) {
      const emailHtml = `
        <div>
          <h2>New Comment on "${post.title}"</h2>
          <p>Author: ${comment.author}</p>
          <p>Comment: ${comment.content}</p>
          <p>Date: ${new Date().toLocaleString()}</p>
        </div>
      `;
      
      await sendEmail(
        process.env.ADMIN_EMAIL,
        `New Comment on "${post.title}"`,
        emailHtml
      );
    }

    res.status(201).json({
      success: true,
      message: 'Comment added',
      data: comment
    });
  } catch (error) {
    console.error('Create comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding comment'
    });
  }
};

// Booking Controllers
exports.createBooking = async (req, res) => {
  try {
    const { name, email, phone, country, service, date, message, postTitle, postId } = req.body;

    const booking = new models.Booking({
      name,
      email,
      phone,
      country,
      service,
      date: new Date(date),
      message,
      postTitle,
      postId
    });

    await booking.save();

    await trackEvent('booking', {
      bookingId: booking._id,
      service,
      country
    }, req);

    // Send confirmation email to user
    const userEmailHtml = `
      <div>
        <h2>Booking Confirmation</h2>
        <p>Dear ${name},</p>
        <p>Thank you for booking with RECAPPLY.</p>
        <p><strong>Service:</strong> ${service}</p>
        <p><strong>Date:</strong> ${new Date(date).toLocaleDateString()}</p>
        <p><strong>Country:</strong> ${country}</p>
        <p>We will contact you within 24 hours.</p>
      </div>
    `;

    await sendEmail(email, `Booking Confirmation - ${service}`, userEmailHtml);

    // Send notification to admin
    if (process.env.ADMIN_EMAIL) {
      const adminEmailHtml = `
        <div>
          <h2>New Booking Request</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Service:</strong> ${service}</p>
        </div>
      `;

      await sendEmail(
        process.env.ADMIN_EMAIL,
        `New Booking: ${name} - ${service}`,
        adminEmailHtml
      );
    }

    res.status(201).json({
      success: true,
      message: 'Booking submitted successfully',
      data: booking
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting booking'
    });
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await models.Booking.find().sort('-createdAt');
    res.json({
      success: true,
      data: bookings
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching bookings'
    });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const booking = await models.Booking.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Send status update email
    const statusEmail = `
      <div>
        <h2>Booking Status Update</h2>
        <p>Dear ${booking.name},</p>
        <p>Your booking status has been updated to: <strong>${status}</strong></p>
      </div>
    `;

    await sendEmail(booking.email, `Booking Status Update: ${status}`, statusEmail);

    res.json({
      success: true,
      message: 'Booking status updated',
      data: booking
    });
  } catch (error) {
    console.error('Update booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating booking'
    });
  }
};

// Statistics Controllers
exports.getStatistics = async (req, res) => {
  try {
    const stats = await models.Statistics.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalViews = await models.Blog.aggregate([
      { $group: { _id: null, total: { $sum: '$views' } } }
    ]);

    const popularPosts = await models.Blog.find({ status: 'published' })
      .sort({ views: -1 })
      .limit(5)
      .select('title views category');

    res.json({
      success: true,
      data: {
        stats,
        totalViews: totalViews[0]?.total || 0,
        popularPosts
      }
    });
  } catch (error) {
    console.error('Statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics'
    });
  }
};

// Email Controllers
exports.sendContactEmail = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    await trackEvent('contact', { name, email, subject }, req);

    // Send to admin
    const adminEmailHtml = `
      <div>
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong> ${message}</p>
      </div>
    `;

    await sendEmail(
      process.env.ADMIN_EMAIL || process.env.SMTP_USER,
      `Contact Form: ${subject}`,
      adminEmailHtml
    );

    // Send confirmation to user
    const userEmailHtml = `
      <div>
        <h2>Message Received</h2>
        <p>Dear ${name},</p>
        <p>Thank you for contacting RECAPPLY. We will get back to you within 24 hours.</p>
      </div>
    `;

    await sendEmail(email, 'Message Received - RECAPPLY', userEmailHtml);

    res.json({
      success: true,
      message: 'Message sent successfully'
    });
  } catch (error) {
    console.error('Send contact email error:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending message'
    });
  }
};

exports.testEmail = async (req, res) => {
  try {
    const { to } = req.body;

    const testHtml = `
      <div>
        <h2>Test Email</h2>
        <p>This is a test email from RECAPPLY Blog API.</p>
        <p>Timestamp: ${new Date().toISOString()}</p>
      </div>
    `;

    const result = await sendEmail(
      to || process.env.ADMIN_EMAIL || process.env.SMTP_USER,
      'Test Email - RECAPPLY Blog API',
      testHtml
    );

    if (result.success) {
      res.json({
        success: true,
        message: 'Test email sent successfully'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to send test email',
        error: result.error
      });
    }
  } catch (error) {
    console.error('Test email error:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending test email'
    });
  }
};