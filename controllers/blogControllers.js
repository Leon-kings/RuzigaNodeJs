
const models = require('../models/Blog');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const streamifier = require('streamifier');

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Multer configuration for file upload
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // Use env or default 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = process.env.ALLOWED_FILE_TYPES?.split(',') || ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    const allowedMimeTypes = allowedTypes.map(type => {
      if (type === 'jpg') return 'image/jpeg';
      if (type === 'jpeg') return 'image/jpeg';
      if (type === 'png') return 'image/png';
      if (type === 'gif') return 'image/gif';
      if (type === 'webp') return 'image/webp';
      return `image/${type}`;
    });
    
    const extname = allowedTypes.some(type => 
      file.originalname.toLowerCase().endsWith(`.${type}`)
    );
    const mimetype = allowedMimeTypes.includes(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error(`Only ${allowedTypes.join(', ')} files are allowed!`));
    }
  }
});

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

// Cloudinary upload function
const uploadToCloudinary = (fileBuffer, folder = 'blog-images') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        transformation: [
          { width: 1200, height: 630, crop: 'fill', gravity: 'auto' },
          { quality: 'auto:good' }
        ]
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
    
    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};

// Delete from Cloudinary
const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    return null;
  }
};

// Email transporter with Gmail configuration
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure: false, // Gmail uses STARTTLS
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    },
    tls: {
      rejectUnauthorized: false // Only for development
    }
  });
};

// Send email function
const sendEmail = async (to, subject, html, isAdminNotification = false) => {
  // Skip emails if SKIP_EMAILS is true (for development)
  if (process.env.SKIP_EMAILS === 'true' && !isAdminNotification) {
    console.log('Email sending skipped (SKIP_EMAILS=true)');
    return { success: true, skipped: true };
  }

  try {
    const transporter = createTransporter();
    
    const info = await transporter.sendMail({
      from: `"${process.env.COMPANY_NAME || 'REC APPLY'}" <${process.env.EMAIL_FROM}>`,
      to,
      subject,
      html
    });
    
    console.log('Email sent successfully to:', to, 'Message ID:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email sending error:', error);
    
    // Don't fail the main operation if email fails in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Email failed but continuing in development mode');
      return { success: false, error: error.message, skipped: true };
    }
    
    return { success: false, error: error.message };
  }
};

// Send email to blog author when blog is created
const sendAuthorCreationEmail = async (blog) => {
  if (!blog.email) {
    console.log('No author email provided, skipping author notification');
    return { success: false, skipped: true };
  }

  const subject = blog.status === 'published' 
    ? `Your Blog Post "${blog.title}" is Now Published! 🎉` 
    : `Your Blog Post "${blog.title}" Has Been Saved as Draft`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f4f4; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px;">${process.env.COMPANY_NAME || 'REC APPLY'}</h1>
      </div>
      
      <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <h2 style="color: #333; margin-top: 0; border-bottom: 2px solid #f0f0f0; padding-bottom: 15px;">
          ${blog.status === 'published' ? 'Congratulations! Your Blog Post is Live! 🚀' : 'Blog Post Saved as Draft'}
        </h2>
        
        <p style="font-size: 16px; line-height: 1.6; color: #555;">Dear Author,</p>
        
        ${blog.status === 'published' 
          ? `<p style="font-size: 16px; line-height: 1.6; color: #555;">Great news! Your blog post has been successfully published and is now live on our platform.</p>` 
          : `<p style="font-size: 16px; line-height: 1.6; color: #555;">Your blog post has been saved as a draft. You can continue editing it anytime before publishing.</p>`
        }
        
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #667eea;">
          <h3 style="margin-top: 0; color: #667eea; font-size: 20px;">${blog.title}</h3>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #666;"><strong>Category:</strong></td>
              <td style="padding: 8px 0; color: #333;">${blog.category}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;"><strong>Status:</strong></td>
              <td style="padding: 8px 0; color: #333;">
                <span style="background-color: ${blog.status === 'published' ? '#4CAF50' : '#FFC107'}; color: white; padding: 3px 10px; border-radius: 12px; font-size: 12px;">
                  ${blog.status === 'published' ? 'Published' : 'Draft'}
                </span>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;"><strong>Created on:</strong></td>
              <td style="padding: 8px 0; color: #333;">${new Date(blog.createdAt).toLocaleDateString()}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;"><strong>Read Time:</strong></td>
              <td style="padding: 8px 0; color: #333;">${blog.readTime} min read</td>
            </tr>
          </table>
          
          ${blog.excerpt ? `
            <div style="margin-top: 15px;">
              <strong style="color: #666;">Excerpt:</strong>
              <p style="color: #555; font-style: italic; margin: 5px 0 0 0;">${blog.excerpt}</p>
            </div>
          ` : ''}
        </div>
        
        ${blog.status === 'published' 
          ? `<p style="font-size: 16px; line-height: 1.6; color: #555;">Share this achievement with your network and start getting views on your valuable content!</p>` 
          : `<p style="font-size: 16px; line-height: 1.6; color: #555;">When you're ready to publish, you can submit your post for review from your dashboard.</p>`
        }
        
        <hr style="border: none; border-top: 2px solid #f0f0f0; margin: 30px 0;">
        
        <p style="color: #666; font-size: 14px; line-height: 1.6; text-align: center;">
          Thank you for contributing to ${process.env.COMPANY_NAME || 'REC APPLY'}.<br>
          We appreciate your valuable content and look forward to seeing more from you!
        </p>
      </div>
      
      <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
        © ${new Date().getFullYear()} ${process.env.COMPANY_NAME || 'REC APPLY'}. All rights reserved.<br>
        This is an automated message, please do not reply to this email.
      </div>
    </div>
  `;

  return await sendEmail(blog.email, subject, html);
};

// Send admin notification for new blog post
const sendAdminNotification = async (blog, author) => {
  const subject = `New Blog Post ${blog.status === 'published' ? 'Published' : 'Created'}: ${blog.title}`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f4f4; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px;">${process.env.COMPANY_NAME || 'REC APPLY'} - Admin Notification</h1>
      </div>
      
      <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <h2 style="color: #333; margin-top: 0; border-bottom: 2px solid #f0f0f0; padding-bottom: 15px;">
          New Blog Post ${blog.status === 'published' ? 'Published' : 'Created'}
        </h2>
        
        <div style="background-color: #f0f7ff; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #2563eb; font-size: 20px;">${blog.title}</h3>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #666;"><strong>Category:</strong></td>
              <td style="padding: 8px 0; color: #333;">${blog.category}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;"><strong>Status:</strong></td>
              <td style="padding: 8px 0; color: #333;">
                <span style="background-color: ${blog.status === 'published' ? '#4CAF50' : '#FFC107'}; color: white; padding: 3px 10px; border-radius: 12px; font-size: 12px;">
                  ${blog.status === 'published' ? 'Published' : 'Draft'}
                </span>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;"><strong>Author:</strong></td>
              <td style="padding: 8px 0; color: #333;">${author || 'Unknown'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;"><strong>Author Email:</strong></td>
              <td style="padding: 8px 0; color: #333;">${blog.email || 'Not provided'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;"><strong>Created on:</strong></td>
              <td style="padding: 8px 0; color: #333;">${new Date(blog.createdAt).toLocaleString()}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;"><strong>Read Time:</strong></td>
              <td style="padding: 8px 0; color: #333;">${blog.readTime} min</td>
            </tr>
          </table>
          
          ${blog.excerpt ? `
            <div style="margin-top: 15px;">
              <strong style="color: #666;">Excerpt:</strong>
              <p style="color: #555; font-style: italic; margin: 5px 0 0 0; background-color: white; padding: 10px; border-radius: 5px;">${blog.excerpt}</p>
            </div>
          ` : ''}
          
          ${blog.tags && blog.tags.length > 0 ? `
            <div style="margin-top: 15px;">
              <strong style="color: #666;">Tags:</strong>
              <div style="margin-top: 5px;">
                ${blog.tags.map(tag => `<span style="background-color: #e0e7ff; color: #4f46e5; padding: 3px 10px; border-radius: 15px; font-size: 12px; margin-right: 5px; display: inline-block; margin-bottom: 5px;">${tag}</span>`).join('')}
              </div>
            </div>
          ` : ''}
        </div>
        
        <hr style="border: none; border-top: 2px solid #f0f0f0; margin: 30px 0;">
        
        <p style="color: #666; font-size: 14px; line-height: 1.6; text-align: center;">
          This is an automated admin notification from ${process.env.COMPANY_NAME || 'REC APPLY'}.<br>
          You can review and manage this blog post in the admin dashboard.
        </p>
      </div>
      
      <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
        © ${new Date().getFullYear()} ${process.env.COMPANY_NAME || 'REC APPLY'}. All rights reserved.
      </div>
    </div>
  `;

  return await sendEmail(process.env.ADMIN_EMAIL, subject, html, true);
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
      statData.ip = req.ip || req.connection.remoteAddress;
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

// =========== IMAGE UPLOAD CONTROLLERS ===========

// Upload single image
exports.uploadImage = [
  upload.single('image'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No image file provided'
        });
      }

      const result = await uploadToCloudinary(req.file.buffer);
      
      res.json({
        success: true,
        data: {
          url: result.secure_url,
          public_id: result.public_id,
          width: result.width,
          height: result.height,
          format: result.format
        }
      });
    } catch (error) {
      console.error('Upload image error:', error);
      res.status(500).json({
        success: false,
        message: 'Error uploading image'
      });
    }
  }
];

// Upload multiple images
exports.uploadMultipleImages = [
  upload.array('images', 10),
  async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No images provided'
        });
      }

      const uploadPromises = req.files.map(file => 
        uploadToCloudinary(file.buffer, 'blog-gallery')
      );

      const results = await Promise.all(uploadPromises);

      const imageData = results.map(result => ({
        url: result.secure_url,
        public_id: result.public_id,
        width: result.width,
        height: result.height
      }));

      res.json({
        success: true,
        message: `${req.files.length} images uploaded successfully`,
        data: imageData
      });
    } catch (error) {
      console.error('Bulk upload error:', error);
      res.status(500).json({
        success: false,
        message: 'Error uploading images'
      });
    }
  }
];

// =========== BLOG CONTROLLERS ===========

// Get all blogs
exports.getAllBlogs = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, search, status } = req.query;
    const query = {};

    if (status && status !== 'all') {
      query.status = status;
    } else {
      query.status = 'published';
    }

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
      .limit(parseInt(limit));

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

// Get blog by email
exports.getBlogsByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const { page = 1, limit = 10, category, search, status } = req.query;

    const query = {
      email: email.toLowerCase()
    };

    if (status && status !== 'all') {
      query.status = status;
    }

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
      .limit(parseInt(limit));

    const total = await models.Blog.countDocuments(query);

    res.json({
      success: true,
      data: blogs,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page)
    });
  } catch (error) {
    console.error('Get blogs by email error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching blogs by email'
    });
  }
};

// Get blog by ID
exports.getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid blog ID format'
      });
    }

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

// Create blog with image upload and email notifications (Admin + User)
exports.createBlog = [
  upload.single('image'),
  async (req, res) => {
    try {
      const { title, excerpt, content, category, tags, author, featured, status = 'draft', email } = req.body;
      
      // Validate required fields
      if (!title || !content) {
        return res.status(400).json({
          success: false,
          message: 'Title and content are required'
        });
      }

      let imageData = {
        url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80',
        alt: title
      };

      // Upload image to Cloudinary if provided
      if (req.file) {
        const uploadResult = await uploadToCloudinary(req.file.buffer);
        imageData = {
          url: uploadResult.secure_url,
          public_id: uploadResult.public_id,
          alt: title
        };
      }

      // Parse tags
      let tagsArray = [];
      if (tags) {
        if (Array.isArray(tags)) {
          tagsArray = tags;
        } else if (typeof tags === 'string') {
          tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
        }
      }

      const blog = new models.Blog({
        title,
        slug: generateSlug(title),
        excerpt,
        content,
        category: category || 'education',
        tags: tagsArray,
        author,
        email: email ? email.toLowerCase() : undefined,
        status: status || 'draft',
        readTime: calculateReadTime(content),
        featured: featured === 'true' || featured === true,
        image: imageData
      });

      await blog.save();

      // Send email notifications (don't await to not block response)
      Promise.allSettled([
        sendAuthorCreationEmail(blog),
        sendAdminNotification(blog, author)
      ]).then(results => {
        console.log('Email notifications sent:', results.map(r => r.status));
      }).catch(err => {
        console.error('Error sending notification emails:', err);
      });

      res.status(201).json({
        success: true,
        message: 'Blog created successfully',
        data: blog
      });
    } catch (error) {
      console.error('Create blog error:', error);
      res.status(500).json({
        success: false,
        message: 'Error creating blog'
      });
    }
  }
];

// Update blog with optional image update
exports.updateBlog = [
  upload.single('image'),
  async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid blog ID format'
        });
      }

      const existingBlog = await models.Blog.findById(id);
      if (!existingBlog) {
        return res.status(404).json({
          success: false,
          message: 'Blog not found'
        });
      }

      // Update slug if title changed
      if (updates.title) {
        updates.slug = generateSlug(updates.title);
      }

      // Update read time if content changed
      if (updates.content) {
        updates.readTime = calculateReadTime(updates.content);
      }

      // Handle email update
      if (updates.email) {
        updates.email = updates.email.toLowerCase();
      }

      // Handle image update
      if (req.file) {
        // Delete old image from Cloudinary if it exists
        if (existingBlog.image && existingBlog.image.public_id) {
          await deleteFromCloudinary(existingBlog.image.public_id);
        }

        // Upload new image
        const uploadResult = await uploadToCloudinary(req.file.buffer);
        updates.image = {
          url: uploadResult.secure_url,
          public_id: uploadResult.public_id,
          alt: updates.title || existingBlog.title
        };
      } else if (updates.imageUrl) {
        // If image is provided as URL (for existing images)
        updates.image = {
          url: updates.imageUrl,
          alt: updates.title || existingBlog.title
        };
        delete updates.imageUrl;
      }

      // Parse tags if provided as string
      if (updates.tags && typeof updates.tags === 'string') {
        updates.tags = updates.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      }

      // Parse featured field
      if (updates.featured !== undefined) {
        updates.featured = updates.featured === 'true' || updates.featured === true;
      }

      const blog = await models.Blog.findByIdAndUpdate(
        id,
        updates,
        { new: true, runValidators: true }
      );

      res.json({
        success: true,
        message: 'Blog updated successfully',
        data: blog
      });
    } catch (error) {
      console.error('Update blog error:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating blog'
      });
    }
  }
];

// Soft delete (archive) blog
exports.deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid blog ID format'
      });
    }

    const blog = await models.Blog.findByIdAndUpdate(
      id, 
      { status: 'archived' }, 
      { new: true }
    );

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    res.json({
      success: true,
      message: 'Blog archived successfully',
      data: blog
    });
  } catch (error) {
    console.error('Delete blog error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting blog'
    });
  }
};

// Hard delete blog with image removal
exports.hardDeleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid blog ID format'
      });
    }

    const blog = await models.Blog.findById(id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    // Delete image from Cloudinary if it exists
    if (blog.image && blog.image.public_id) {
      await deleteFromCloudinary(blog.image.public_id);
    }

    // Delete blog from database
    await models.Blog.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Blog permanently deleted'
    });
  } catch (error) {
    console.error('Hard delete error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting blog'
    });
  }
};

// Restore archived blog
exports.restoreBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { status = 'published' } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid blog ID format'
      });
    }

    const blog = await models.Blog.findByIdAndUpdate(
      id, 
      { status }, 
      { new: true }
    );

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    res.json({
      success: true,
      message: 'Blog restored successfully',
      data: blog
    });
  } catch (error) {
    console.error('Restore blog error:', error);
    res.status(500).json({
      success: false,
      message: 'Error restoring blog'
    });
  }
};

// Get trending blogs
exports.getTrendingBlogs = async (req, res) => {
  try {
    const blogs = await models.Blog.find({ status: 'published', featured: true })
      .sort({ views: -1, likes: -1 })
      .limit(5)
      .select('title excerpt image category views likes createdAt slug');

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

// Like a blog
exports.likeBlog = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid blog ID format'
      });
    }

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

// Update blog image only
exports.updateBlogImage = [
  upload.single('image'),
  async (req, res) => {
    try {
      const { id } = req.params;
      
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid blog ID format'
        });
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No image file provided'
        });
      }

      const blog = await models.Blog.findById(id);
      if (!blog) {
        return res.status(404).json({
          success: false,
          message: 'Blog not found'
        });
      }

      // Delete old image from Cloudinary
      if (blog.image && blog.image.public_id) {
        await deleteFromCloudinary(blog.image.public_id);
      }

      // Upload new image
      const uploadResult = await uploadToCloudinary(req.file.buffer);
      
      blog.image = {
        url: uploadResult.secure_url,
        public_id: uploadResult.public_id,
        alt: blog.title
      };

      await blog.save();

      res.json({
        success: true,
        message: 'Blog image updated successfully',
        data: {
          image: blog.image
        }
      });
    } catch (error) {
      console.error('Update blog image error:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating blog image'
      });
    }
  }
];

// Search blogs
exports.searchBlogs = async (req, res) => {
  try {
    const { query, category } = req.query;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const searchQuery = {
      $or: [
        { title: new RegExp(query, 'i') },
        { excerpt: new RegExp(query, 'i') },
        { content: new RegExp(query, 'i') },
        { tags: new RegExp(query, 'i') }
      ]
    };

    if (category && category !== 'all') {
      searchQuery.category = category;
    }

    const blogs = await models.Blog.find(searchQuery)
      .sort({ createdAt: -1 })
      .limit(20);

    await trackEvent('search', { query, category }, req);

    res.json({
      success: true,
      data: blogs
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching blogs'
    });
  }
};

// =========== STATISTICS CONTROLLER ===========

// Get blog statistics
exports.getStatistics = async (req, res) => {
  try {
    console.log('Getting statistics...');
    
    if (!models.Blog) {
      return res.status(500).json({
        success: false,
        message: 'Blog model not available'
      });
    }
    
    // Get basic blog counts
    const totalBlogs = await models.Blog.countDocuments();
    const publishedBlogs = await models.Blog.countDocuments({ status: 'published' });
    const draftBlogs = await models.Blog.countDocuments({ status: 'draft' });
    const archivedBlogs = await models.Blog.countDocuments({ status: 'archived' });
    const featuredBlogs = await models.Blog.countDocuments({ featured: true });
    
    // Get total views safely
    const viewsResult = await models.Blog.aggregate([
      { 
        $group: { 
          _id: null, 
          total: { $sum: { $ifNull: ['$views', 0] } } 
        } 
      }
    ]);
    
    const totalViews = viewsResult.length > 0 ? viewsResult[0].total : 0;
    
    // Get total likes
    const likesResult = await models.Blog.aggregate([
      { 
        $group: { 
          _id: null, 
          total: { $sum: { $ifNull: ['$likes', 0] } } 
        } 
      }
    ]);
    
    const totalLikes = likesResult.length > 0 ? likesResult[0].total : 0;
    
    // Get popular posts
    const popularPosts = await models.Blog.find({ status: 'published' })
      .sort({ views: -1 })
      .limit(5)
      .select('title slug views likes category image.url image.alt createdAt')
      .lean();
    
    // Get category distribution
    const categoryDistribution = await models.Blog.aggregate([
      { $match: { status: 'published' } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    res.json({
      success: true,
      data: {
        total: totalBlogs,
        published: publishedBlogs,
        draft: draftBlogs,
        archived: archivedBlogs,
        featured: featuredBlogs,
        totalViews: totalViews,
        totalLikes: totalLikes,
        popularPosts: popularPosts || [],
        categoryDistribution: categoryDistribution || [],
        period: '30d'
      }
    });
  } catch (error) {
    console.error('Statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Export upload middleware
exports.upload = upload;