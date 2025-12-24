const Booking = require('../models/Services');
const Joi = require('joi');
const moment = require('moment');
const nodemailer = require('nodemailer');

// Email Configuration
const emailTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Email Templates Generator
const emailTemplates = {
  bookingConfirmation: (booking) => ({
    subject: `RECAPPLY Booking Confirmation - ${booking.service.name}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 30px; text-align: center; }
          .header h1 { margin: 0; font-size: 28px; font-weight: 600; }
          .header p { margin: 10px 0 0; opacity: 0.9; }
          .content { padding: 30px; }
          .greeting { font-size: 18px; margin-bottom: 25px; color: #2d3748; }
          .message { font-size: 16px; color: #4a5568; margin-bottom: 30px; line-height: 1.8; }
          .booking-details { background: #f8fafc; border-radius: 10px; padding: 25px; margin: 25px 0; border: 1px solid #e2e8f0; }
          .booking-details h3 { color: #2d3748; margin-top: 0; margin-bottom: 20px; font-size: 20px; }
          .detail-row { display: flex; justify-content: space-between; margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid #e2e8f0; }
          .detail-row:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
          .detail-label { font-weight: 600; color: #4a5568; min-width: 160px; }
          .detail-value { color: #2d3748; text-align: right; }
          .highlight { color: #667eea; font-weight: 600; }
          .next-steps { background: #f0f7ff; border-left: 4px solid #667eea; padding: 20px; margin: 30px 0; border-radius: 0 8px 8px 0; }
          .next-steps h4 { margin-top: 0; color: #2d3748; }
          .next-steps ul { margin: 10px 0; padding-left: 20px; }
          .next-steps li { margin-bottom: 8px; color: #4a5568; }
          .contact-info { background: #f7fafc; border-radius: 8px; padding: 20px; margin: 30px 0; border: 1px solid #e2e8f0; }
          .contact-info h4 { margin-top: 0; color: #2d3748; }
          .contact-item { display: flex; align-items: center; margin-bottom: 12px; }
          .contact-icon { margin-right: 12px; color: #667eea; }
          .status-badge { display: inline-block; padding: 6px 12px; background: #c6f6d5; color: #22543d; border-radius: 20px; font-size: 14px; font-weight: 600; }
          .footer { text-align: center; padding: 25px; background: #f8fafc; color: #718096; font-size: 14px; border-top: 1px solid #e2e8f0; }
          .footer p { margin: 5px 0; }
          .social-links { margin: 15px 0; }
          .social-links a { margin: 0 10px; color: #667eea; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>RECAPPLY Booking Confirmation</h1>
            <p>Your journey to international education starts here!</p>
          </div>
          
          <div class="content">
            <div class="greeting">
              Dear <strong>${booking.customer.fullName}</strong>,
            </div>
            
            <div class="message">
              Thank you for choosing RECAPPLY for your international education journey. 
              Your booking for <span class="highlight">${booking.service.name}</span> has been received successfully. 
              Our team will contact you within <strong>24 hours</strong> to begin processing your application.
            </div>
            
            <div class="booking-details">
              <h3>📋 Booking Details</h3>
              <div class="detail-row">
                <span class="detail-label">Booking Reference:</span>
                <span class="detail-value highlight">${booking._id.toString().slice(-8).toUpperCase()}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Service:</span>
                <span class="detail-value">${booking.service.name}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Category:</span>
                <span class="detail-value">${getCategoryName(booking.service.category)}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Price (USD):</span>
                <span class="detail-value">${booking.service.priceUSD}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Price (RWF):</span>
                <span class="detail-value">${booking.service.priceRWF}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Target Country:</span>
                <span class="detail-value">${booking.customer.targetCountry}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Program:</span>
                <span class="detail-value">${booking.customer.program}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Preferred Start:</span>
                <span class="detail-value">${moment(booking.customer.startDate).format('MMMM YYYY')}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Status:</span>
                <span class="detail-value"><span class="status-badge">Confirmed</span></span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Booking Date:</span>
                <span class="detail-value">${moment(booking.bookingDate).format('MMMM Do YYYY, h:mm A')}</span>
              </div>
            </div>
            
            <div class="next-steps">
              <h4>📝 Next Steps</h4>
              <ul>
                <li>Our team will review your requirements within 24 hours</li>
                <li>You'll receive a dedicated consultant contact</li>
                <li>Required documents list will be provided</li>
                <li>Consultation schedule will be shared</li>
                <li>Regular updates on application progress</li>
              </ul>
            </div>
            
            <div class="contact-info">
              <h4>📞 Contact Information</h4>
              <div class="contact-item">
                <span class="contact-icon">📧</span>
                <span>Email: services@recapply.com</span>
              </div>
              <div class="contact-item">
                <span class="contact-icon">📱</span>
                <span>Rwanda: +250 783 408 617</span>
              </div>
              <div class="contact-item">
                <span class="contact-icon">🌍</span>
                <span>China: +86 186 5833 2879</span>
              </div>
              <div class="contact-item">
                <span class="contact-icon">🏢</span>
                <span>Kigali – Kicukiro Centre, Sangwa Plaza, 1st Floor</span>
              </div>
            </div>
            
            <div class="message">
              <strong>Important:</strong> Please keep this email for your records. 
              Your booking reference will be required for all future communications regarding this service.
            </div>
          </div>
          
          <div class="footer">
            <p>RECAPPLY International Education Services</p>
            <p>Comprehensive support from application to arrival</p>
            <div class="social-links">
              <a href="#">Website</a> • 
              <a href="#">Facebook</a> • 
              <a href="#">Twitter</a> • 
              <a href="#">LinkedIn</a>
            </div>
            <p>© ${new Date().getFullYear()} RECAPPLY. All rights reserved.</p>
            <p><small>This is an automated email. Please do not reply to this address.</small></p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  adminNotification: (booking) => ({
    subject: `📥 New Booking - ${booking.service.name}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; }
          .header { background: linear-gradient(135deg, #4c51bf 0%, #667eea 100%); color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; background: #f9f9f9; }
          .alert-box { background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 5px; padding: 15px; margin: 20px 0; }
          .booking-info { background: white; border-radius: 8px; padding: 20px; margin: 20px 0; }
          .info-row { display: flex; margin-bottom: 10px; }
          .info-label { font-weight: bold; min-width: 150px; color: #555; }
          .info-value { color: #333; }
          .actions { text-align: center; margin: 30px 0; }
          .btn { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 0 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>New Booking Notification</h2>
          </div>
          <div class="content">
            <div class="alert-box">
              <strong>New booking received!</strong> Please review and assign a consultant.
            </div>
            
            <div class="booking-info">
              <h3>Customer Details</h3>
              <div class="info-row">
                <span class="info-label">Name:</span>
                <span class="info-value">${booking.customer.fullName}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Email:</span>
                <span class="info-value">${booking.customer.email}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Phone:</span>
                <span class="info-value">${booking.customer.phone}</span>
              </div>
              
              <h3>Service Details</h3>
              <div class="info-row">
                <span class="info-label">Service:</span>
                <span class="info-value">${booking.service.name}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Category:</span>
                <span class="info-value">${getCategoryName(booking.service.category)}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Target Country:</span>
                <span class="info-value">${booking.customer.targetCountry}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Program:</span>
                <span class="info-value">${booking.customer.program}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Start Date:</span>
                <span class="info-value">${moment(booking.customer.startDate).format('MMMM YYYY')}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Booking Time:</span>
                <span class="info-value">${moment(booking.bookingDate).format('MMMM Do YYYY, h:mm A')}</span>
              </div>
            </div>
            
            <div class="actions">
              <a href="${process.env.ADMIN_URL}/bookings/${booking._id}" class="btn">View Booking</a>
              <a href="mailto:${booking.customer.email}" class="btn">Contact Customer</a>
            </div>
            
            <p><strong>Booking Reference:</strong> ${booking._id.toString().slice(-8).toUpperCase()}</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  statusUpdate: (booking, newStatus) => ({
    subject: `RECAPPLY Booking Update - ${getStatusText(newStatus)}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; }
          .header { background: linear-gradient(135deg, #10b981 0%, #34d399 100%); color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; background: #f9f9f9; }
          .status-box { background: white; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center; }
          .status-icon { font-size: 48px; margin-bottom: 20px; }
          .status-text { font-size: 24px; color: #10b981; margin-bottom: 10px; }
          .info { background: #f0f9ff; border-radius: 8px; padding: 20px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Booking Status Update</h2>
          </div>
          <div class="content">
            <div class="status-box">
              <div class="status-icon">📋</div>
              <div class="status-text">${getStatusText(newStatus)}</div>
              <p>Your booking status has been updated</p>
            </div>
            
            <div class="info">
              <p><strong>Booking:</strong> ${booking.service.name}</p>
              <p><strong>Reference:</strong> ${booking._id.toString().slice(-8).toUpperCase()}</p>
              <p><strong>Previous Status:</strong> ${getStatusText(booking.status)}</p>
              <p><strong>New Status:</strong> ${getStatusText(newStatus)}</p>
              <p><strong>Updated:</strong> ${moment().format('MMMM Do YYYY, h:mm A')}</p>
            </div>
            
            <p>For any questions, please contact our support team.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  cancellation: (booking) => ({
    subject: 'RECAPPLY Booking Cancellation',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; }
          .header { background: linear-gradient(135deg, #ef4444 0%, #f87171 100%); color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; background: #f9f9f9; }
          .cancellation-box { background: white; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Booking Cancelled</h2>
          </div>
          <div class="content">
            <div class="cancellation-box">
              <p>Your booking for <strong>${booking.service.name}</strong> has been cancelled.</p>
              <p>Reference: ${booking._id.toString().slice(-8).toUpperCase()}</p>
              <p>If this was a mistake or you'd like to rebook, please contact us immediately.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  })
};

// Helper functions
const getCategoryName = (category) => {
  const categories = {
    'admissions': 'Admissions Services',
    'scholarship': 'Scholarship Services',
    'visa': 'Visa & Immigration',
    'support': 'Student Support'
  };
  return categories[category] || category;
};

const getStatusText = (status) => {
  const statusMap = {
    'pending': 'Pending Review',
    'contacted': 'Contacted',
    'in_progress': 'In Progress',
    'completed': 'Completed',
    'cancelled': 'Cancelled'
  };
  return statusMap[status] || status;
};

// Email sending functions
const sendEmail = async (to, subject, html, attachments = []) => {
  try {
    const mailOptions = {
      from: `"RECAPPLY Services" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to,
      subject,
      html,
      attachments
    };

    const info = await emailTransporter.sendMail(mailOptions);
    console.log('📧 Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    throw error;
  }
};

const sendBookingConfirmation = async (booking) => {
  try {
    const template = emailTemplates.bookingConfirmation(booking);
    await sendEmail(booking.customer.email, template.subject, template.html);
    console.log(`✅ Confirmation email sent to ${booking.customer.email}`);
    return true;
  } catch (error) {
    console.error('❌ Failed to send confirmation email:', error);
    throw error;
  }
};

const sendAdminNotification = async (booking) => {
  try {
    const template = emailTemplates.adminNotification(booking);
    const adminEmails = process.env.ADMIN_EMAILS ? 
      process.env.ADMIN_EMAILS.split(',') : 
      [process.env.SMTP_USER];
    
    for (const email of adminEmails) {
      await sendEmail(email, template.subject, template.html);
      console.log(`📤 Admin notification sent to ${email}`);
    }
    return true;
  } catch (error) {
    console.error('❌ Failed to send admin notification:', error);
    throw error;
  }
};

const sendStatusUpdate = async (booking, newStatus) => {
  try {
    const template = emailTemplates.statusUpdate(booking, newStatus);
    await sendEmail(booking.customer.email, template.subject, template.html);
    console.log(`🔄 Status update email sent for booking ${booking._id}`);
    return true;
  } catch (error) {
    console.error('❌ Failed to send status update:', error);
    throw error;
  }
};

const sendCancellationEmail = async (booking) => {
  try {
    const template = emailTemplates.cancellation(booking);
    await sendEmail(booking.customer.email, template.subject, template.html);
    console.log(`❌ Cancellation email sent for booking ${booking._id}`);
    return true;
  } catch (error) {
    console.error('❌ Failed to send cancellation email:', error);
    throw error;
  }
};

// Validation schema
const bookingSchema = Joi.object({
  service: Joi.object({
    id: Joi.number().required(),
    name: Joi.string().required(),
    category: Joi.string().valid('admissions', 'scholarship', 'visa', 'support').required(),
    priceUSD: Joi.string().required(),
    priceRWF: Joi.string().required()
  }).required(),
  
  customer: Joi.object({
    fullName: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    targetCountry: Joi.string().valid('China', 'Canada', 'Germany', 'USA', 'UK', 'Australia', 'Poland', 'Turkey', 'Other').required(),
    program: Joi.string().required(),
    startDate: Joi.date().required(),
    educationLevel: Joi.string().valid('highschool', 'bachelor', 'master', 'phd', '').optional(),
    budget: Joi.string().valid('low', 'medium', 'high', 'premium', '').optional(),
    requirements: Joi.string().max(1000).optional()
  }).required()
});

// Statistics calculation
const calculateStatistics = async () => {
  try {
    const today = moment().startOf('day');
    const weekStart = moment().startOf('week');
    const monthStart = moment().startOf('month');

    const [
      totalBookings,
      todayBookings,
      weekBookings,
      monthBookings,
      bookingsByStatus,
      bookingsByCategory,
      bookingsByCountry,
      revenueStats
    ] = await Promise.all([
      Booking.countDocuments(),
      Booking.countDocuments({ bookingDate: { $gte: today.toDate() } }),
      Booking.countDocuments({ bookingDate: { $gte: weekStart.toDate() } }),
      Booking.countDocuments({ bookingDate: { $gte: monthStart.toDate() } }),
      Booking.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Booking.aggregate([{ $group: { _id: '$service.category', count: { $sum: 1 } } }]),
      Booking.aggregate([{ $group: { _id: '$customer.targetCountry', count: { $sum: 1 } } }]),
      Booking.aggregate([
        {
          $group: {
            _id: null,
            totalRevenue: {
              $sum: {
                $toDouble: {
                  $arrayElemAt: [{ $split: ['$service.priceUSD', '$'] }, 1]
                }
              }
            },
            avgRevenue: {
              $avg: {
                $toDouble: {
                  $arrayElemAt: [{ $split: ['$service.priceUSD', '$'] }, 1]
                }
              }
            }
          }
        }
      ])
    ]);

    const recentBookings = await Booking.find()
      .sort({ bookingDate: -1 })
      .limit(5)
      .select('customer.fullName customer.email service.name status bookingDate')
      .lean();

    const popularServices = await Booking.aggregate([
      { $group: { _id: '$service.name', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    return {
      overview: {
        totalBookings,
        todayBookings,
        weekBookings,
        monthBookings,
        totalRevenue: revenueStats[0]?.totalRevenue || 0,
        averageRevenue: revenueStats[0]?.avgRevenue || 0
      },
      distribution: {
        byStatus: bookingsByStatus.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        byCategory: bookingsByCategory.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        byCountry: bookingsByCountry.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {})
      },
      recentBookings,
      popularServices,
      generatedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Statistics calculation error:', error);
    throw error;
  }
};

// 📋 CONTROLLER FUNCTIONS

// 1. Create Booking
exports.createBooking = async (req, res) => {
  try {
    // Validate request
    const { error, value } = bookingSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => detail.message)
      });
    }

    // Add client info
    const clientInfo = {
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.headers['user-agent']
    };

    // Create booking
    const bookingData = {
      ...value,
      ipAddress: clientInfo.ipAddress,
      userAgent: clientInfo.userAgent
    };

    const booking = new Booking(bookingData);
    await booking.save();

    // Send emails (async - don't block response)
    try {
      await Promise.all([
        sendBookingConfirmation(booking),
        sendAdminNotification(booking)
      ]);
      
      booking.notes.push({
        content: 'Confirmation emails sent successfully',
        addedBy: 'system'
      });
      await booking.save();
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      booking.notes.push({
        content: 'Email sending failed but booking was saved',
        addedBy: 'system'
      });
      await booking.save();
    }

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: {
        booking: booking.toJSON(),
        reference: booking._id.toString().slice(-8).toUpperCase()
      }
    });

  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create booking',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// 2. Get All Bookings
exports.getAllBookings = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      category,
      startDate,
      endDate,
      search,
      sortBy = 'bookingDate',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    const query = {};
    if (status) query.status = status;
    if (category) query['service.category'] = category;
    
    if (startDate || endDate) {
      query.bookingDate = {};
      if (startDate) query.bookingDate.$gte = new Date(startDate);
      if (endDate) query.bookingDate.$lte = new Date(endDate);
    }
    
    if (search) {
      query.$or = [
        { 'customer.fullName': { $regex: search, $options: 'i' } },
        { 'customer.email': { $regex: search, $options: 'i' } },
        { 'service.name': { $regex: search, $options: 'i' } }
      ];
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Booking.countDocuments(query);
    
    // Sorting
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query
    const bookings = await Booking.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    res.status(200).json({
      success: true,
      data: bookings,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bookings'
    });
  }
};

// 3. Get Booking by ID
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.status(200).json({
      success: true,
      data: booking
    });

  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch booking'
    });
  }
};

// 4. Update Booking Status
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status, note } = req.body;
    
    // Validate status
    const validStatuses = ['pending', 'contacted', 'in_progress', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }

    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Update status
    const oldStatus = booking.status;
    booking.status = status;
    booking.updatedAt = Date.now();
    
    // Add note
    if (note) {
      booking.notes.push({
        content: `Status changed from ${oldStatus} to ${status}: ${note}`,
        addedBy: 'admin'
      });
    }

    await booking.save();

    // Send status update email
    try {
      await sendStatusUpdate(booking, status);
    } catch (emailError) {
      console.error('Status update email failed:', emailError);
    }

    res.status(200).json({
      success: true,
      message: 'Booking status updated successfully',
      data: booking
    });

  } catch (error) {
    console.error('Update booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update booking'
    });
  }
};

// 5. Add Note to Booking
exports.addNoteToBooking = async (req, res) => {
  try {
    const { content } = req.body;
    
    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Note content is required'
      });
    }

    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    booking.notes.push({
      content: content.trim(),
      addedBy: req.user?.name || 'admin'
    });
    
    booking.updatedAt = Date.now();
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Note added successfully',
      data: booking.notes
    });

  } catch (error) {
    console.error('Add note error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add note'
    });
  }
};

// 6. Get Statistics
exports.getStatistics = async (req, res) => {
  try {
    const stats = await calculateStatistics();
    
    res.status(200).json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Get statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics'
    });
  }
};

// 7. Get Bookings by Date Range
exports.getBookingsByDateRange = async (req, res) => {
  try {
    const { startDate, endDate, groupBy = 'day' } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'startDate and endDate are required'
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    
    let groupStage;
    switch (groupBy) {
      case 'day':
        groupStage = {
          _id: {
            year: { $year: '$bookingDate' },
            month: { $month: '$bookingDate' },
            day: { $dayOfMonth: '$bookingDate' }
          }
        };
        break;
      case 'month':
        groupStage = {
          _id: {
            year: { $year: '$bookingDate' },
            month: { $month: '$bookingDate' }
          }
        };
        break;
      case 'week':
        groupStage = {
          _id: {
            year: { $year: '$bookingDate' },
            week: { $week: '$bookingDate' }
          }
        };
        break;
      default:
        groupStage = {
          _id: {
            year: { $year: '$bookingDate' },
            month: { $month: '$bookingDate' },
            day: { $dayOfMonth: '$bookingDate' }
          }
        };
    }

    const bookings = await Booking.aggregate([
      {
        $match: {
          bookingDate: {
            $gte: start,
            $lte: end
          }
        }
      },
      {
        $group: {
          ...groupStage,
          count: { $sum: 1 },
          services: { $addToSet: '$service.name' },
          totalRevenue: {
            $sum: {
              $toDouble: {
                $arrayElemAt: [
                  { $split: ['$service.priceUSD', '$'] },
                  1
                ]
              }
            }
          }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1, '_id.week': 1 } }
    ]);

    res.status(200).json({
      success: true,
      data: bookings
    });

  } catch (error) {
    console.error('Date range bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bookings by date range'
    });
  }
};

// 8. Export Bookings to CSV
exports.exportBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .sort({ bookingDate: -1 })
      .lean();

    // CSV headers
    const headers = [
      'Booking ID',
      'Customer Name',
      'Customer Email',
      'Customer Phone',
      'Service',
      'Category',
      'Price (USD)',
      'Price (RWF)',
      'Target Country',
      'Program',
      'Start Date',
      'Education Level',
      'Budget',
      'Status',
      'Booking Date',
      'Created At'
    ];

    // CSV rows
    const rows = bookings.map(booking => [
      booking._id,
      `"${booking.customer.fullName}"`,
      booking.customer.email,
      booking.customer.phone,
      `"${booking.service.name}"`,
      getCategoryName(booking.service.category),
      booking.service.priceUSD,
      booking.service.priceRWF,
      booking.customer.targetCountry,
      `"${booking.customer.program}"`,
      new Date(booking.customer.startDate).toISOString().split('T')[0],
      booking.customer.educationLevel || '',
      booking.customer.budget || '',
      booking.status,
      new Date(booking.bookingDate).toISOString(),
      new Date(booking.createdAt).toISOString()
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // Set response headers
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=recapply-bookings-${Date.now()}.csv`);
    
    res.status(200).send(csvContent);

  } catch (error) {
    console.error('Export bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export bookings'
    });
  }
};

// 9. Search Bookings
exports.searchBookings = async (req, res) => {
  try {
    const { q, limit = 10 } = req.query;
    
    if (!q || q.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 2 characters'
      });
    }

    const bookings = await Booking.find(
      { $text: { $search: q } },
      { score: { $meta: 'textScore' } }
    )
    .sort({ score: { $meta: 'textScore' } })
    .limit(parseInt(limit))
    .select('customer.fullName customer.email service.name service.category status bookingDate')
    .lean();

    res.status(200).json({
      success: true,
      data: bookings
    });

  } catch (error) {
    console.error('Search bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search bookings'
    });
  }
};

// 10. Delete/Cancel Booking
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Update status to cancelled
    booking.status = 'cancelled';
    booking.notes.push({
      content: 'Booking cancelled by admin',
      addedBy: 'admin'
    });
    booking.updatedAt = Date.now();
    
    await booking.save();

    // Send cancellation email
    try {
      await sendCancellationEmail(booking);
    } catch (emailError) {
      console.error('Cancellation email failed:', emailError);
    }

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully'
    });

  } catch (error) {
    console.error('Delete booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel booking'
    });
  }
};

// 11. Send Test Email
exports.sendTestEmail = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email address is required'
      });
    }

    const testTemplate = {
      subject: 'RECAPPLY Test Email',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>✅ RECAPPLY Email Test Successful</h2>
          <p>This is a test email from the RECAPPLY booking system.</p>
          <p>If you're receiving this, email configuration is working correctly.</p>
          <p>Sent at: ${new Date().toISOString()}</p>
        </div>
      `
    };

    await sendEmail(email, testTemplate.subject, testTemplate.html);

    res.status(200).json({
      success: true,
      message: 'Test email sent successfully'
    });

  } catch (error) {
    console.error('Test email error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send test email',
      error: error.message
    });
  }
};

// 12. Get Email Templates Preview
exports.getEmailTemplates = async (req, res) => {
  try {
    // Create a sample booking for template preview
    const sampleBooking = {
      _id: '507f1f77bcf86cd799439011',
      service: {
        name: 'University Admissions',
        category: 'admissions',
        priceUSD: 'Starting from $299',
        priceRWF: 'Starting from Fr 388,700'
      },
      customer: {
        fullName: 'John Doe',
        email: 'john@example.com',
        phone: '+250 783 408 617',
        targetCountry: 'Canada',
        program: 'Computer Science',
        startDate: new Date('2024-09-01')
      },
      bookingDate: new Date(),
      status: 'pending'
    };

    const templates = {
      confirmation: emailTemplates.bookingConfirmation(sampleBooking).html,
      admin: emailTemplates.adminNotification(sampleBooking).html,
      statusUpdate: emailTemplates.statusUpdate(sampleBooking, 'in_progress').html,
      cancellation: emailTemplates.cancellation(sampleBooking).html
    };

    res.status(200).json({
      success: true,
      data: templates
    });

  } catch (error) {
    console.error('Get templates error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch email templates'
    });
  }
};

module.exports = exports;