// const models = require('../models/Blog');
// const nodemailer = require('nodemailer');
// const mongoose = require('mongoose');
// const cloudinary = require('cloudinary').v2;
// const multer = require('multer');
// const streamifier = require('streamifier');

// // Cloudinary configuration
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET
// });

// // Multer configuration for file upload
// const storage = multer.memoryStorage();
// const upload = multer({ 
//   storage: storage,
//   limits: {
//     fileSize: 1 * 1024 * 1024, // 5MB limit
//   },
//   fileFilter: (req, file, cb) => {
//     const allowedTypes = /jpeg|jpg|png|gif|webp/;
//     const extname = allowedTypes.test(file.originalname.toLowerCase());
//     const mimetype = allowedTypes.test(file.mimetype);
    
//     if (extname && mimetype) {
//       return cb(null, true);
//     } else {
//       cb(new Error('Only image files are allowed!'));
//     }
//   }
// });

// // Helper functions
// const generateSlug = (text) => {
//   return text
//     .toLowerCase()
//     .replace(/[^a-z0-9]+/g, '-')
//     .replace(/(^-|-$)/g, '');
// };

// const calculateReadTime = (content) => {
//   const wordsPerMinute = 200;
//   const wordCount = content.split(/\s+/).length;
//   return Math.ceil(wordCount / wordsPerMinute);
// };

// // Cloudinary upload function
// const uploadToCloudinary = (fileBuffer, folder = 'blog-images') => {
//   return new Promise((resolve, reject) => {
//     const uploadStream = cloudinary.uploader.upload_stream(
//       {
//         folder: folder,
//         transformation: [
//           { width: 1200, height: 630, crop: 'fill', gravity: 'auto' },
//           { quality: 'auto:good' }
//         ]
//       },
//       (error, result) => {
//         if (error) {
//           reject(error);
//         } else {
//           resolve(result);
//         }
//       }
//     );
    
//     streamifier.createReadStream(fileBuffer).pipe(uploadStream);
//   });
// };

// // Delete from Cloudinary
// const deleteFromCloudinary = async (publicId) => {
//   try {
//     const result = await cloudinary.uploader.destroy(publicId);
//     return result;
//   } catch (error) {
//     console.error('Cloudinary delete error:', error);
//     return null;
//   }
// };

// // Email transporter
// const createTransporter = () => {
//   return nodemailer.createTransport({
//     host: process.env.SMTP_HOST || 'smtp.gmail.com',
//     port: process.env.SMTP_PORT || 587,
//     secure: process.env.EMAIL_SECURE === 'true',
//     auth: {
//       user: process.env.SMTP_USER,
//       pass: process.env.SMTP_PASS
//     }
//   });
// };

// // Send email function
// const sendEmail = async (to, subject, html) => {
//   try {
//     const transporter = createTransporter();
//     const info = await transporter.sendMail({
//       from: process.env.EMAIL_FROM || 'noreply@ruziga.com',
//       to,
//       subject,
//       html
//     });
//     console.log('Email sent:', info.messageId);
//     return { success: true };
//   } catch (error) {
//     console.error('Email error:', error);
//     return { success: false, error: error.message };
//   }
// };

// // Track event
// const trackEvent = async (type, data = {}, req = null) => {
//   try {
//     const statData = {
//       type,
//       ...data,
//       timestamp: new Date()
//     };

//     if (req) {
//       statData.ip = req.ip;
//       statData.userAgent = req.get('user-agent');
//       statData.browser = req.headers['sec-ch-ua'] || 'Unknown';
//       statData.device = req.headers['sec-ch-ua-mobile'] ? 'Mobile' : 'Desktop';
//     }

//     const stat = new models.Statistics(statData);
//     await stat.save();
//     return true;
//   } catch (error) {
//     console.error('Track error:', error);
//     return false;
//   }
// };

// // =========== IMAGE UPLOAD CONTROLLERS ===========

// // Upload single image
// exports.uploadImage = [
//   upload.single('image'),
//   async (req, res) => {
//     try {
//       if (!req.file) {
//         return res.status(400).json({
//           success: false,
//           message: 'No image file provided'
//         });
//       }

//       const result = await uploadToCloudinary(req.file.buffer);
      
//       res.json({
//         success: true,
//         data: {
//           url: result.secure_url,
//           public_id: result.public_id,
//           width: result.width,
//           height: result.height,
//           format: result.format
//         }
//       });
//     } catch (error) {
//       console.error('Upload image error:', error);
//       res.status(500).json({
//         success: false,
//         message: 'Error uploading image'
//       });
//     }
//   }
// ];

// // Upload multiple images
// exports.uploadMultipleImages = [
//   upload.array('images', 10),
//   async (req, res) => {
//     try {
//       if (!req.files || req.files.length === 0) {
//         return res.status(400).json({
//           success: false,
//           message: 'No images provided'
//         });
//       }

//       const uploadPromises = req.files.map(file => 
//         uploadToCloudinary(file.buffer, 'blog-gallery')
//       );

//       const results = await Promise.all(uploadPromises);

//       const imageData = results.map(result => ({
//         url: result.secure_url,
//         public_id: result.public_id,
//         width: result.width,
//         height: result.height
//       }));

//       res.json({
//         success: true,
//         message: `${req.files.length} images uploaded successfully`,
//         data: imageData
//       });
//     } catch (error) {
//       console.error('Bulk upload error:', error);
//       res.status(500).json({
//         success: false,
//         message: 'Error uploading images'
//       });
//     }
//   }
// ];

// // =========== BLOG CONTROLLERS ===========

// // Get all blogs
// exports.getAllBlogs = async (req, res) => {
//   try {
//     const { page = 1, limit = 10, category, search } = req.query;
//     const query = { status: 'published' };

//     if (category && category !== 'all') query.category = category;
    
//     if (search) {
//       query.$or = [
//         { title: new RegExp(search, 'i') },
//         { excerpt: new RegExp(search, 'i') },
//         { tags: new RegExp(search, 'i') }
//       ];
//     }

//     const blogs = await models.Blog.find(query)
//       .sort('-createdAt')
//       .skip((page - 1) * limit)
//       .limit(parseInt(limit))
//       .select('-content');

//     const total = await models.Blog.countDocuments(query);

//     if (search) {
//       await trackEvent('search', { query: search, category }, req);
//     }

//     res.json({
//       success: true,
//       data: blogs,
//       total,
//       totalPages: Math.ceil(total / limit),
//       currentPage: parseInt(page)
//     });
//   } catch (error) {
//     console.error('Get blogs error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching blogs'
//     });
//   }
// };

// // Get blog by ID
// exports.getBlogById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const blog = await models.Blog.findById(id);

//     if (!blog) {
//       return res.status(404).json({
//         success: false,
//         message: 'Blog not found'
//       });
//     }

//     blog.views += 1;
//     await blog.save();

//     await trackEvent('post_view', {
//       post: blog._id,
//       category: blog.category
//     }, req);

//     res.json({
//       success: true,
//       data: blog
//     });
//   } catch (error) {
//     console.error('Get blog error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching blog'
//     });
//   }
// };

// // Create blog with image upload
// exports.createBlog = [
//   upload.single('image'),
//   async (req, res) => {
//     try {
//       const { title, excerpt, content, category, tags, author, featured } = req.body;
      
//       let imageData = {
//         url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80',
//         alt: title
//       };

//       // Upload image to Cloudinary if provided
//       if (req.file) {
//         const uploadResult = await uploadToCloudinary(req.file.buffer);
//         imageData = {
//           url: uploadResult.secure_url,
//           public_id: uploadResult.public_id,
//           alt: title
//         };
//       }

//       const blog = new models.Blog({
//         title,
//         slug: generateSlug(title),
//         excerpt,
//         content,
//         category,
//         tags: tags ? (Array.isArray(tags) ? tags : tags.split(',')) : [],
//         author,
//         readTime: calculateReadTime(content),
//         featured: featured === 'true' || featured === true,
//         image: imageData
//       });

//       await blog.save();

//       res.status(201).json({
//         success: true,
//         message: 'Blog created successfully',
//         data: blog
//       });
//     } catch (error) {
//       console.error('Create blog error:', error);
//       res.status(500).json({
//         success: false,
//         message: 'Error creating blog'
//       });
//     }
//   }
// ];

// // Update blog with optional image update
// exports.updateBlog = [
//   upload.single('image'),
//   async (req, res) => {
//     try {
//       const { id } = req.params;
//       const updates = req.body;

//       const existingBlog = await models.Blog.findById(id);
//       if (!existingBlog) {
//         return res.status(404).json({
//           success: false,
//           message: 'Blog not found'
//         });
//       }

//       // Update slug if title changed
//       if (updates.title) {
//         updates.slug = generateSlug(updates.title);
//       }

//       // Update read time if content changed
//       if (updates.content) {
//         updates.readTime = calculateReadTime(updates.content);
//       }

//       // Handle image update
//       if (req.file) {
//         // Delete old image from Cloudinary if it exists
//         if (existingBlog.image && existingBlog.image.public_id) {
//           await deleteFromCloudinary(existingBlog.image.public_id);
//         }

//         // Upload new image
//         const uploadResult = await uploadToCloudinary(req.file.buffer);
//         updates.image = {
//           url: uploadResult.secure_url,
//           public_id: uploadResult.public_id,
//           alt: updates.title || existingBlog.title
//         };
//       } else if (updates.imageUrl) {
//         // If image is provided as URL (for existing images)
//         updates.image = {
//           url: updates.imageUrl,
//           alt: updates.title || existingBlog.title
//         };
//         delete updates.imageUrl;
//       }

//       // Parse tags if provided as string
//       if (updates.tags && typeof updates.tags === 'string') {
//         updates.tags = updates.tags.split(',');
//       }

//       const blog = await models.Blog.findByIdAndUpdate(
//         id,
//         updates,
//         { new: true, runValidators: true }
//       );

//       res.json({
//         success: true,
//         message: 'Blog updated successfully',
//         data: blog
//       });
//     } catch (error) {
//       console.error('Update blog error:', error);
//       res.status(500).json({
//         success: false,
//         message: 'Error updating blog'
//       });
//     }
//   }
// ];

// // Soft delete (archive) blog
// exports.deleteBlog = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const blog = await models.Blog.findByIdAndUpdate(
//       id, 
//       { status: 'archived' }, 
//       { new: true }
//     );

//     if (!blog) {
//       return res.status(404).json({
//         success: false,
//         message: 'Blog not found'
//       });
//     }

//     res.json({
//       success: true,
//       message: 'Blog archived successfully'
//     });
//   } catch (error) {
//     console.error('Delete blog error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error deleting blog'
//     });
//   }
// };

// // Hard delete blog with image removal
// exports.hardDeleteBlog = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const blog = await models.Blog.findById(id);

//     if (!blog) {
//       return res.status(404).json({
//         success: false,
//         message: 'Blog not found'
//       });
//     }

//     // Delete image from Cloudinary if it exists
//     if (blog.image && blog.image.public_id) {
//       await deleteFromCloudinary(blog.image.public_id);
//     }

//     // Delete blog from database
//     await models.Blog.findByIdAndDelete(id);

//     // Delete related comments
//     await models.Comment.deleteMany({ post: id });

//     res.json({
//       success: true,
//       message: 'Blog permanently deleted'
//     });
//   } catch (error) {
//     console.error('Hard delete error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error deleting blog'
//     });
//   }
// };

// // Get trending blogs
// exports.getTrendingBlogs = async (req, res) => {
//   try {
//     const blogs = await models.Blog.find({ status: 'published' })
//       .sort({ views: -1, likes: -1 })
//       .limit(5)
//       .select('title excerpt image category views likes createdAt slug');

//     res.json({
//       success: true,
//       data: blogs
//     });
//   } catch (error) {
//     console.error('Trending error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching trending blogs'
//     });
//   }
// };

// // Like a blog
// exports.likeBlog = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const blog = await models.Blog.findById(id);

//     if (!blog) {
//       return res.status(404).json({
//         success: false,
//         message: 'Blog not found'
//       });
//     }

//     blog.likes += 1;
//     await blog.save();

//     await trackEvent('like', { post: blog._id }, req);

//     res.json({
//       success: true,
//       message: 'Blog liked',
//       likes: blog.likes
//     });
//   } catch (error) {
//     console.error('Like error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error liking blog'
//     });
//   }
// };

// // Update blog image only
// exports.updateBlogImage = [
//   upload.single('image'),
//   async (req, res) => {
//     try {
//       const { id } = req.params;
      
//       if (!req.file) {
//         return res.status(400).json({
//           success: false,
//           message: 'No image file provided'
//         });
//       }

//       const blog = await models.Blog.findById(id);
//       if (!blog) {
//         return res.status(404).json({
//           success: false,
//           message: 'Blog not found'
//         });
//       }

//       // Delete old image from Cloudinary
//       if (blog.image && blog.image.public_id) {
//         await deleteFromCloudinary(blog.image.public_id);
//       }

//       // Upload new image
//       const uploadResult = await uploadToCloudinary(req.file.buffer);
      
//       blog.image = {
//         url: uploadResult.secure_url,
//         public_id: uploadResult.public_id,
//         alt: blog.title
//       };

//       await blog.save();

//       res.json({
//         success: true,
//         message: 'Blog image updated successfully',
//         data: {
//           image: blog.image
//         }
//       });
//     } catch (error) {
//       console.error('Update blog image error:', error);
//       res.status(500).json({
//         success: false,
//         message: 'Error updating blog image'
//       });
//     }
//   }
// ];

// // =========== COMMENT CONTROLLERS ===========

// // Get comments for a blog post
// exports.getComments = async (req, res) => {
//   try {
//     const { postId } = req.params;
//     const comments = await models.Comment.find({ post: postId, isApproved: true })
//       .sort('-createdAt')
//       .select('-email');

//     res.json({
//       success: true,
//       data: comments
//     });
//   } catch (error) {
//     console.error('Get comments error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching comments'
//     });
//   }
// };

// // Create comment
// exports.createComment = async (req, res) => {
//   try {
//     const { postId } = req.params;
//     const { content, author, email } = req.body;

//     const post = await models.Blog.findById(postId);
//     if (!post) {
//       return res.status(404).json({
//         success: false,
//         message: 'Blog post not found'
//       });
//     }

//     const comment = new models.Comment({
//       content,
//       post: postId,
//       author: author || 'Anonymous',
//       email
//     });

//     await comment.save();

//     post.comments += 1;
//     await post.save();

//     await trackEvent('comment', { post: postId }, req);

//     // Send email notification
//     if (process.env.ADMIN_EMAIL) {
//       const emailHtml = `
//         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//           <h2 style="color: #333;">New Comment on "${post.title}"</h2>
//           <div style="background: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
//             <p><strong>Author:</strong> ${comment.author}</p>
//             <p><strong>Email:</strong> ${comment.email}</p>
//             <p><strong>Comment:</strong> ${comment.content}</p>
//             <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
//           </div>
//           <p>Post URL: ${process.env.FRONTEND_URL || 'https://yourdomain.com'}/blog/${post.slug}</p>
//         </div>
//       `;
      
//       await sendEmail(
//         process.env.ADMIN_EMAIL,
//         `New Comment on "${post.title}"`,
//         emailHtml
//       );
//     }

//     res.status(201).json({
//       success: true,
//       message: 'Comment added successfully',
//       data: comment
//     });
//   } catch (error) {
//     console.error('Create comment error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error adding comment'
//     });
//   }
// };

// // Admin: Get all comments (including unapproved)
// exports.getAllComments = async (req, res) => {
//   try {
//     const { page = 1, limit = 20, approved } = req.query;
//     const query = {};

//     if (approved !== undefined) {
//       query.isApproved = approved === 'true';
//     }

//     const comments = await models.Comment.find(query)
//       .populate('post', 'title slug')
//       .sort('-createdAt')
//       .skip((page - 1) * limit)
//       .limit(parseInt(limit));

//     const total = await models.Comment.countDocuments(query);

//     res.json({
//       success: true,
//       data: comments,
//       total,
//       totalPages: Math.ceil(total / limit),
//       currentPage: parseInt(page)
//     });
//   } catch (error) {
//     console.error('Get all comments error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching comments'
//     });
//   }
// };

// // Admin: Update comment status
// exports.updateCommentStatus = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { isApproved } = req.body;

//     const comment = await models.Comment.findByIdAndUpdate(
//       id,
//       { isApproved },
//       { new: true }
//     ).populate('post', 'title');

//     if (!comment) {
//       return res.status(404).json({
//         success: false,
//         message: 'Comment not found'
//       });
//     }

//     res.json({
//       success: true,
//       message: `Comment ${isApproved ? 'approved' : 'rejected'}`,
//       data: comment
//     });
//   } catch (error) {
//     console.error('Update comment status error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error updating comment status'
//     });
//   }
// };

// // Admin: Delete comment
// exports.deleteComment = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const comment = await models.Comment.findByIdAndDelete(id);

//     if (!comment) {
//       return res.status(404).json({
//         success: false,
//         message: 'Comment not found'
//       });
//     }

//     // Decrement comment count on blog post
//     await models.Blog.findByIdAndUpdate(comment.post, {
//       $inc: { comments: -1 }
//     });

//     res.json({
//       success: true,
//       message: 'Comment deleted successfully'
//     });
//   } catch (error) {
//     console.error('Delete comment error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error deleting comment'
//     });
//   }
// };

// // =========== BOOKING CONTROLLERS ===========

// // Create booking
// exports.createBooking = async (req, res) => {
//   try {
//     const { name, email, phone, country, service, date, message, postTitle, postId } = req.body;

//     const booking = new models.Booking({
//       name,
//       email,
//       phone,
//       country,
//       service,
//       date: new Date(date),
//       message,
//       postTitle,
//       postId
//     });

//     await booking.save();

//     await trackEvent('booking', {
//       bookingId: booking._id,
//       service,
//       country
//     }, req);

//     // Send confirmation email to user
//     const userEmailHtml = `
//       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//         <h2 style="color: #333;">Booking Confirmation</h2>
//         <p>Dear ${name},</p>
//         <div style="background: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
//           <p><strong>Service:</strong> ${service}</p>
//           <p><strong>Date:</strong> ${new Date(date).toLocaleDateString()}</p>
//           <p><strong>Country:</strong> ${country}</p>
//           <p><strong>Phone:</strong> ${phone}</p>
//           ${message ? `<p><strong>Message:</strong> ${message}</p>` : ''}
//         </div>
//         <p>Thank you for booking with RECAPPLY. We will contact you within 24 hours.</p>
//         <p>Best regards,<br>RECAPPLY Team</p>
//       </div>
//     `;

//     await sendEmail(email, `Booking Confirmation - ${service}`, userEmailHtml);

//     // Send notification to admin
//     if (process.env.ADMIN_EMAIL) {
//       const adminEmailHtml = `
//         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//           <h2 style="color: #333;">New Booking Request</h2>
//           <div style="background: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
//             <p><strong>Name:</strong> ${name}</p>
//             <p><strong>Email:</strong> ${email}</p>
//             <p><strong>Phone:</strong> ${phone}</p>
//             <p><strong>Country:</strong> ${country}</p>
//             <p><strong>Service:</strong> ${service}</p>
//             <p><strong>Date:</strong> ${new Date(date).toLocaleDateString()}</p>
//             ${postTitle ? `<p><strong>Related Post:</strong> ${postTitle}</p>` : ''}
//             ${message ? `<p><strong>Message:</strong> ${message}</p>` : ''}
//           </div>
//           <p><strong>Booking ID:</strong> ${booking._id}</p>
//         </div>
//       `;

//       await sendEmail(
//         process.env.ADMIN_EMAIL,
//         `New Booking: ${name} - ${service}`,
//         adminEmailHtml
//       );
//     }

//     res.status(201).json({
//       success: true,
//       message: 'Booking submitted successfully',
//       data: booking
//     });
//   } catch (error) {
//     console.error('Create booking error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error submitting booking'
//     });
//   }
// };

// // Get all bookings (admin)
// exports.getAllBookings = async (req, res) => {
//   try {
//     const { page = 1, limit = 20, status, startDate, endDate } = req.query;
//     const query = {};

//     if (status && status !== 'all') {
//       query.status = status;
//     }

//     if (startDate || endDate) {
//       query.date = {};
//       if (startDate) query.date.$gte = new Date(startDate);
//       if (endDate) query.date.$lte = new Date(endDate);
//     }

//     const bookings = await models.Booking.find(query)
//       .sort('-createdAt')
//       .skip((page - 1) * limit)
//       .limit(parseInt(limit));

//     const total = await models.Booking.countDocuments(query);

//     res.json({
//       success: true,
//       data: bookings,
//       total,
//       totalPages: Math.ceil(total / limit),
//       currentPage: parseInt(page)
//     });
//   } catch (error) {
//     console.error('Get bookings error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching bookings'
//     });
//   }
// };

// // Update booking status
// exports.updateBookingStatus = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { status } = req.body;

//     const booking = await models.Booking.findByIdAndUpdate(
//       id,
//       { status },
//       { new: true }
//     );

//     if (!booking) {
//       return res.status(404).json({
//         success: false,
//         message: 'Booking not found'
//       });
//     }

//     // Send status update email
//     const statusEmail = `
//       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//         <h2 style="color: #333;">Booking Status Update</h2>
//         <p>Dear ${booking.name},</p>
//         <div style="background: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
//           <p><strong>Service:</strong> ${booking.service}</p>
//           <p><strong>Booking ID:</strong> ${booking._id}</p>
//           <p><strong>New Status:</strong> <span style="color: ${
//             status === 'confirmed' ? 'green' : 
//             status === 'cancelled' ? 'red' : 
//             'orange'
//           }">${status.toUpperCase()}</span></p>
//         </div>
//         <p>Best regards,<br>RECAPPLY Team</p>
//       </div>
//     `;

//     await sendEmail(booking.email, `Booking Status Update: ${status}`, statusEmail);

//     res.json({
//       success: true,
//       message: 'Booking status updated successfully',
//       data: booking
//     });
//   } catch (error) {
//     console.error('Update booking error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error updating booking'
//     });
//   }
// };

// // Get booking by ID
// exports.getBookingById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const booking = await models.Booking.findById(id);

//     if (!booking) {
//       return res.status(404).json({
//         success: false,
//         message: 'Booking not found'
//       });
//     }

//     res.json({
//       success: true,
//       data: booking
//     });
//   } catch (error) {
//     console.error('Get booking error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching booking'
//     });
//   }
// };

// // =========== STATISTICS CONTROLLERS ===========

// // Get statistics
// // exports.getStatistics = async (req, res) => {
// //   try {
// //     const { period = '30d' } = req.query;
// //     let startDate = new Date();
    
// //     switch (period) {
// //       case '7d':
// //         startDate.setDate(startDate.getDate() - 7);
// //         break;
// //       case '30d':
// //         startDate.setDate(startDate.getDate() - 30);
// //         break;
// //       case '90d':
// //         startDate.setDate(startDate.getDate() - 90);
// //         break;
// //       case '1y':
// //         startDate.setFullYear(startDate.getFullYear() - 1);
// //         break;
// //       default:
// //         startDate.setDate(startDate.getDate() - 30);
// //     }

// //     // Get event counts
// //     const stats = await models.Statistics.aggregate([
// //       {
// //         $match: {
// //           timestamp: { $gte: startDate }
// //         }
// //       },
// //       {
// //         $group: {
// //           _id: '$type',
// //           count: { $sum: 1 }
// //         }
// //       }
// //     ]);

// //     // Get total views
// //     const totalViews = await models.Blog.aggregate([
// //       { $group: { _id: null, total: { $sum: '$views' } } }
// //     ]);

// //     // Get popular posts
// //     const popularPosts = await models.Blog.find({ status: 'published' })
// //       .sort({ views: -1 })
// //       .limit(5)
// //       .select('title slug views category image createdAt');

// //     // Get traffic sources
// //     const trafficSources = await models.Statistics.aggregate([
// //       {
// //         $match: {
// //           timestamp: { $gte: startDate },
// //           type: 'post_view'
// //         }
// //       },
// //       {
// //         $group: {
// //           _id: '$browser',
// //           count: { $sum: 1 }
// //         }
// //       },
// //       { $sort: { count: -1 } },
// //       { $limit: 10 }
// //     ]);

// //     // Get top countries from bookings
// //     const topCountries = await models.Booking.aggregate([
// //       {
// //         $match: {
// //           createdAt: { $gte: startDate }
// //         }
// //       },
// //       {
// //         $group: {
// //           _id: '$country',
// //           count: { $sum: 1 }
// //         }
// //       },
// //       { $sort: { count: -1 } },
// //       { $limit: 10 }
// //     ]);

// //     res.json({
// //       success: true,
// //       data: {
// //         eventStats: stats,
// //         totalViews: totalViews[0]?.total || 0,
// //         popularPosts,
// //         trafficSources,
// //         topCountries,
// //         period
// //       }
// //     });
// //   } catch (error) {
// //     console.error('Statistics error:', error);
// //     res.status(500).json({
// //       success: false,
// //       message: 'Error fetching statistics'
// //     });
// //   }
// // };
// // controllers/blogController.js
// exports.getStatistics = async (req, res) => {
//   try {
//     console.log('Getting statistics...');
    
//     // Get basic blog counts
//     const totalBlogs = await Blog.countDocuments();
//     const publishedBlogs = await Blog.countDocuments({ status: 'published' });
//     const draftBlogs = await Blog.countDocuments({ status: 'draft' });
//     const archivedBlogs = await Blog.countDocuments({ status: 'archived' });
//     const trendingBlogs = await Blog.countDocuments({ featured: true });
    
//     // Get total views safely
//     const viewsResult = await Blog.aggregate([
//       { 
//         $group: { 
//           _id: null, 
//           total: { $sum: { $ifNull: ['$views', 0] } } 
//         } 
//       }
//     ]);
    
//     const totalViews = viewsResult.length > 0 ? viewsResult[0].total : 0;
    
//     // Get popular posts
//     const popularPosts = await Blog.find({ status: 'published' })
//       .sort({ views: -1 })
//       .limit(5)
//       .select('title slug views category image createdAt')
//       .lean();
    
//     res.json({
//       success: true,
//       data: {
//         total: totalBlogs,
//         published: publishedBlogs,
//         draft: draftBlogs,
//         archived: archivedBlogs,
//         trending: trendingBlogs,
//         totalViews: totalViews,
//         popularPosts: popularPosts || [],
//         period: '30d'
//       }
//     });
//   } catch (error) {
//     console.error('Statistics error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching statistics'
//     });
//   }
// };

// // Get detailed analytics
// exports.getAnalytics = async (req, res) => {
//   try {
//     const { days = 30 } = req.query;
//     const startDate = new Date();
//     startDate.setDate(startDate.getDate() - parseInt(days));

//     // Get daily views
//     const dailyViews = await models.Statistics.aggregate([
//       {
//         $match: {
//           type: 'post_view',
//           timestamp: { $gte: startDate }
//         }
//       },
//       {
//         $group: {
//           _id: {
//             $dateToString: { format: "%Y-%m-%d", date: "$timestamp" }
//           },
//           count: { $sum: 1 }
//         }
//       },
//       { $sort: { _id: 1 } }
//     ]);

//     // Get category distribution
//     const categoryStats = await models.Blog.aggregate([
//       {
//         $match: {
//           status: 'published'
//         }
//       },
//       {
//         $group: {
//           _id: '$category',
//           count: { $sum: 1 },
//           totalViews: { $sum: '$views' },
//           avgViews: { $avg: '$views' }
//         }
//       },
//       { $sort: { totalViews: -1 } }
//     ]);

//     // Get top performing posts
//     const topPosts = await models.Blog.find({ status: 'published' })
//       .sort({ views: -1 })
//       .limit(10)
//       .select('title slug category views likes comments createdAt');

//     res.json({
//       success: true,
//       data: {
//         dailyViews,
//         categoryStats,
//         topPosts,
//         timeRange: {
//           startDate,
//           endDate: new Date(),
//           days: parseInt(days)
//         }
//       }
//     });
//   } catch (error) {
//     console.error('Analytics error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching analytics'
//     });
//   }
// };

// // =========== EMAIL CONTROLLERS ===========

// // Send contact email
// exports.sendContactEmail = async (req, res) => {
//   try {
//     const { name, email, subject, message } = req.body;

//     await trackEvent('contact', { name, email, subject }, req);

//     // Send to admin
//     const adminEmailHtml = `
//       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//         <h2 style="color: #333;">New Contact Form Submission</h2>
//         <div style="background: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
//           <p><strong>Name:</strong> ${name}</p>
//           <p><strong>Email:</strong> ${email}</p>
//           <p><strong>Subject:</strong> ${subject}</p>
//           <p><strong>Message:</strong> ${message}</p>
//           <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
//         </div>
//       </div>
//     `;

//     await sendEmail(
//       process.env.ADMIN_EMAIL || process.env.SMTP_USER,
//       `Contact Form: ${subject}`,
//       adminEmailHtml
//     );

//     // Send confirmation to user
//     const userEmailHtml = `
//       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//         <h2 style="color: #333;">Message Received</h2>
//         <p>Dear ${name},</p>
//         <p>Thank you for contacting RECAPPLY. We have received your message and will get back to you within 24 hours.</p>
//         <div style="background: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
//           <p><strong>Subject:</strong> ${subject}</p>
//           <p><strong>Message:</strong> ${message}</p>
//         </div>
//         <p>Best regards,<br>RECAPPLY Team</p>
//       </div>
//     `;

//     await sendEmail(email, 'Message Received - RECAPPLY', userEmailHtml);

//     res.json({
//       success: true,
//       message: 'Message sent successfully'
//     });
//   } catch (error) {
//     console.error('Send contact email error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error sending message'
//     });
//   }
// };

// // Test email
// exports.testEmail = async (req, res) => {
//   try {
//     const { to } = req.body;

//     const testHtml = `
//       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//         <h2 style="color: #333;">Test Email</h2>
//         <p>This is a test email from RECAPPLY Blog API.</p>
//         <div style="background: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
//           <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
//           <p><strong>API Version:</strong> 1.0.0</p>
//           <p><strong>Environment:</strong> ${process.env.NODE_ENV || 'development'}</p>
//         </div>
//         <p>If you received this email, your email configuration is working correctly.</p>
//       </div>
//     `;

//     const result = await sendEmail(
//       to || process.env.ADMIN_EMAIL || process.env.SMTP_USER,
//       'Test Email - RECAPPLY Blog API',
//       testHtml
//     );

//     if (result.success) {
//       res.json({
//         success: true,
//         message: 'Test email sent successfully'
//       });
//     } else {
//       res.status(500).json({
//         success: false,
//         message: 'Failed to send test email',
//         error: result.error
//       });
//     }
//   } catch (error) {
//     console.error('Test email error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error sending test email'
//     });
//   }
// };

// // Newsletter subscription
// exports.subscribeNewsletter = async (req, res) => {
//   try {
//     const { email } = req.body;

//     // Here you would typically save to a newsletter database
//     // For now, we'll just send a confirmation email

//     const confirmationHtml = `
//       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//         <h2 style="color: #333;">Welcome to RECAPPLY Newsletter!</h2>
//         <p>Thank you for subscribing to our newsletter.</p>
//         <p>You'll now receive updates about:</p>
//         <ul>
//           <li>New blog posts and articles</li>
//           <li>Latest trends and insights</li>
//           <li>Special offers and promotions</li>
//           <li>Upcoming events and webinars</li>
//         </ul>
//         <p>If you didn't subscribe, please ignore this email.</p>
//         <p>Best regards,<br>RECAPPLY Team</p>
//       </div>
//     `;

//     await sendEmail(email, 'Welcome to RECAPPLY Newsletter!', confirmationHtml);

//     res.json({
//       success: true,
//       message: 'Subscribed to newsletter successfully'
//     });
//   } catch (error) {
//     console.error('Newsletter error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error subscribing to newsletter'
//     });
//   }
// };

// // Export upload middleware
// exports.upload = upload;























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
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(file.originalname.toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
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

// Create blog with image upload
exports.createBlog = [
  upload.single('image'),
  async (req, res) => {
    try {
      const { title, excerpt, content, category, tags, author, featured, status = 'draft' } = req.body;
      
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
        status: status || 'draft',
        readTime: calculateReadTime(content),
        featured: featured === 'true' || featured === true,
        image: imageData
      });

      await blog.save();

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
    const trendingBlogs = await models.Blog.countDocuments({ featured: true });
    
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
    
    // Get popular posts
    const popularPosts = await models.Blog.find({ status: 'published' })
      .sort({ views: -1 })
      .limit(5)
      .select('title slug views likes category image.url image.alt createdAt')
      .lean();
    
    res.json({
      success: true,
      data: {
        total: totalBlogs,
        published: publishedBlogs,
        draft: draftBlogs,
        archived: archivedBlogs,
        trending: trendingBlogs,
        totalViews: totalViews,
        popularPosts: popularPosts || [],
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