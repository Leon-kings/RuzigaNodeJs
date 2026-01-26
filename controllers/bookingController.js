// const models = require('../models/Services');
// const nodemailer = require('nodemailer');
// const validator = require('validator');

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

//     if (models.Statistics) {
//       const stat = new models.Statistics(statData);
//       await stat.save();
//     }
    
//     return true;
//   } catch (error) {
//     console.error('Track error:', error);
//     return false;
//   }
// };

// // =========== BOOKING CONTROLLERS ===========

// // Create booking (public)
// // exports.createBooking = async (req, res) => {
// //   try {
// //     const { 
// //       name, 
// //       email, 
// //       phone, 
// //       country, 
// //       service, 
// //       date, 
// //       message, 
// //       postTitle, 
// //       postId,
// //       scheduledTime,
// //       duration,
// //       meetingType
// //     } = req.body;

// //     // Validate required fields
// //     if (!name || !email || !phone || !country || !service || !date) {
// //       return res.status(400).json({
// //         success: false,
// //         message: 'Name, email, phone, country, service, and date are required'
// //       });
// //     }

// //     // Validate email
// //     if (!validator.isEmail(email)) {
// //       return res.status(400).json({
// //         success: false,
// //         message: 'Please provide a valid email address'
// //       });
// //     }

// //     // Validate date
// //     const bookingDate = new Date(date);
// //     if (isNaN(bookingDate.getTime())) {
// //       return res.status(400).json({
// //         success: false,
// //         message: 'Please provide a valid date'
// //       });
// //     }

// //     // Check if date is in the future
// //     if (bookingDate < new Date()) {
// //       return res.status(400).json({
// //         success: false,
// //         message: 'Booking date must be in the future'
// //       });
// //     }

// //     // Validate service
// //     const validServices = ['consultation', 'workshop', 'training', 'speaking', 'other'];
// //     if (!validServices.includes(service)) {
// //       return res.status(400).json({
// //         success: false,
// //         message: 'Invalid service type'
// //       });
// //     }

// //     // Create booking
// //     const booking = new models.Booking({
// //       name: name.trim(),
// //       email: email.toLowerCase().trim(),
// //       phone: phone.trim(),
// //       country: country.trim(),
// //       service,
// //       date: bookingDate,
// //       message: message ? message.trim() : '',
// //       postTitle,
// //       postId,
// //       scheduledTime: scheduledTime || '10:00 AM',
// //       duration: duration || '1 hour',
// //       meetingType: meetingType || 'online',
// //       status: 'pending'
// //     });

// //     await booking.save();

// //     // Track event
// //     await trackEvent('booking', {
      
// //       service,
// //       country,
// //       name: booking.name
// //     }, req);

// //     // Send confirmation email to user
// //     const userEmailHtml = `
// //       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
// //         <h2 style="color: #333;">Booking Confirmation #${booking._id.toString().substring(0, 8)}</h2>
// //         <p>Dear ${name},</p>
// //         <p>Thank you for booking with RECAPPLY. Your booking request has been received.</p>
        
// //         <div style="background: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
// //           <h3 style="margin-top: 0;">Booking Details</h3>
// //           <p><strong>Booking ID:</strong> ${booking._id}</p>
// //           <p><strong>Service:</strong> ${service.charAt(0).toUpperCase() + service.slice(1)}</p>
// //           <p><strong>Date:</strong> ${bookingDate.toLocaleDateString()}</p>
// //           <p><strong>Time:</strong> ${scheduledTime || 'To be confirmed'}</p>
// //           <p><strong>Duration:</strong> ${duration || '1 hour'}</p>
// //           <p><strong>Type:</strong> ${meetingType || 'online'}</p>
// //           <p><strong>Country:</strong> ${country}</p>
// //           <p><strong>Phone:</strong> ${phone}</p>
// //           ${message ? `<p><strong>Your Message:</strong> ${message}</p>` : ''}
// //         </div>
        
// //         <p><strong>Next Steps:</strong></p>
// //         <ol>
// //           <li>Our team will review your booking request</li>
// //           <li>You will receive a confirmation email within 24 hours</li>
// //           <li>Meeting details will be sent to you upon confirmation</li>
// //         </ol>
        
// //         <p>If you have any questions, please reply to this email.</p>
        
// //         <p>Best regards,<br>RECAPPLY Team</p>
// //       </div>
// //     `;

// //     await sendEmail(email, `Booking Confirmation - ${service}`, userEmailHtml);

// //     // Send notification to admin
// //     if (process.env.ADMIN_EMAIL) {
// //       const adminEmailHtml = `
// //         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
// //           <h2 style="color: #333;">New Booking Request</h2>
// //           <div style="background: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
// //             <h3 style="margin-top: 0;">Client Details</h3>
// //             <p><strong>Name:</strong> ${name}</p>
// //             <p><strong>Email:</strong> ${email}</p>
// //             <p><strong>Phone:</strong> ${phone}</p>
// //             <p><strong>Country:</strong> ${country}</p>
            
// //             <h3>Booking Details</h3>
// //             <p><strong>Booking ID:</strong> ${booking._id}</p>
// //             <p><strong>Service:</strong> ${service}</p>
// //             <p><strong>Date:</strong> ${bookingDate.toLocaleDateString()}</p>
// //             <p><strong>Time:</strong> ${scheduledTime || 'Not specified'}</p>
// //             <p><strong>Duration:</strong> ${duration || '1 hour'}</p>
// //             <p><strong>Type:</strong> ${meetingType || 'online'}</p>
// //             ${postTitle ? `<p><strong>Related Post:</strong> ${postTitle}</p>` : ''}
// //             ${message ? `<p><strong>Message:</strong> ${message}</p>` : ''}
            
// //             <h3>Client IP & Device</h3>
// //             <p><strong>IP Address:</strong> ${req.ip}</p>
// //             <p><strong>User Agent:</strong> ${req.get('user-agent')}</p>
// //           </div>
          
// //           <p><a href="${process.env.ADMIN_URL || 'https://admin.recapply.com'}/bookings/${booking._id}" 
// //                 style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
// //             View Booking in Admin Panel
// //           </a></p>
// //         </div>
// //       `;

// //       await sendEmail(
// //         process.env.ADMIN_EMAIL,
// //         `New Booking: ${name} - ${service}`,
// //         adminEmailHtml
// //       );
// //     }

// //     res.status(201).json({
// //       success: true,
// //       message: 'Booking submitted successfully',
// //       data: {
// //         _id: booking._id,
// //         name: booking.name,
// //         service: booking.service,
// //         date: booking.date,
// //         status: booking.status,
// //         bookingId: booking._id.toString()
// //       }
// //     });
// //   } catch (error) {
// //     console.error('Create booking error:', error);
// //     res.status(500).json({
// //       success: false,
// //       message: 'Error submitting booking'
// //     });
// //   }
// // };

// // Create booking (public)
// exports.createBooking = async (req, res) => {
//   try {
//     const {
//       name,
//       email,
//       phone,
//       country,
//       service,
//       serviceCategory,
//       date,
//       educationLevel,
//       program,
//       budget,
//       startDate,
//       message,
//       notes,
//       status
//     } = req.body;

//     // Validate required fields
//     if (!name || !email || !phone || !country || !service || !date || !startDate) {
//       return res.status(400).json({
//         success: false,
//         message: 'Missing required fields'
//       });
//     }

//     // Validate email
//     if (!validator.isEmail(email)) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid email address'
//       });
//     }

//     const bookingDate = new Date(date);
//     const start = new Date(startDate);

//     if (isNaN(bookingDate) || isNaN(start)) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid date'
//       });
//     }

//     const booking = new models.Booking({
//       name: name.trim(),
//       email: email.toLowerCase().trim(),
//       phone: phone.trim(),
//       country: country.trim(),
//       service: service.trim(),
//       serviceCategory,
//       date: bookingDate,
//       educationLevel,
//       program,
//       budget,
//       startDate: start,
//       message: message || '',
//       notes: notes || [],
//       status: status || 'pending',
//       ipAddress: req.ip,
//       userAgent: req.get('user-agent')
//     });

//     await booking.save();

//     await trackEvent(
//       'booking',
//       { service, country, name: booking.name },
//       req
//     );

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


// // Admin: Get all bookings
// // exports.getAllBookings = async (req, res) => {
// //   try {
// //     const { 
// //       page = 1, 
// //       limit = 20, 
// //       status, 
// //       service, 
// //       country,
// //       startDate, 
// //       endDate,
// //       search 
// //     } = req.query;
    
// //     const query = {};

// //     // Filter by status
// //     if (status && status !== 'all') {
// //       query.status = status;
// //     }

// //     // Filter by service
// //     if (service && service !== 'all') {
// //       query.service = service;
// //     }

// //     // Filter by country
// //     if (country && country !== 'all') {
// //       query.country = country;
// //     }

// //     // Filter by date range
// //     if (startDate || endDate) {
// //       query.date = {};
// //       if (startDate) {
// //         query.date.$gte = new Date(startDate);
// //       }
// //       if (endDate) {
// //         query.date.$lte = new Date(endDate);
// //       }
// //     }

// //     // Search by name, email, or phone
// //     if (search) {
// //       query.$or = [
// //         { name: new RegExp(search, 'i') },
// //         { email: new RegExp(search, 'i') },
// //         { phone: new RegExp(search, 'i') }
// //       ];
// //     }

// //     const bookings = await models.Booking.find(query)
// //       .sort('-createdAt')
// //       .skip((page - 1) * limit)
// //       .limit(parseInt(limit))
// //       .populate('postId', 'title slug');

// //     const total = await models.Booking.countDocuments(query);

// //     // Get available filters data
// //     const services = await models.Booking.distinct('service');
// //     const countries = await models.Booking.distinct('country');
// //     const statuses = ['pending', 'confirmed', 'cancelled', 'completed'];

// //     res.json({
// //       success: true,
// //       data: bookings,
// //       total,
// //       totalPages: Math.ceil(total / limit),
// //       currentPage: parseInt(page),
// //       filters: {
// //         services,
// //         countries,
// //         statuses
// //       }
// //     });
// //   } catch (error) {
// //     console.error('Get bookings error:', error);
// //     res.status(500).json({
// //       success: false,
// //       message: 'Error fetching bookings'
// //     });
// //   }
// // };


// exports.getAllBookings = async (req, res) => {
//   try {
//     const {
//       page = 1,
//       limit = 20,
//       status,
//       service,
//       country,
//       startDate,
//       endDate,
//       search
//     } = req.query;

//     const query = {};

//     if (status && status !== 'all') query.status = status;
//     if (service && service !== 'all') query.service = service;
//     if (country && country !== 'all') query.country = country;

//     if (startDate || endDate) {
//       query.date = {};
//       if (startDate) query.date.$gte = new Date(startDate);
//       if (endDate) query.date.$lte = new Date(endDate);
//     }

//     if (search) {
//       query.$or = [
//         { name: new RegExp(search, 'i') },
//         { email: new RegExp(search, 'i') },
//         { phone: new RegExp(search, 'i') }
//       ];
//     }

//     const bookings = await models.Booking.find(query)
//       .sort('-createdAt')
//       .skip((page - 1) * limit)
//       .limit(Number(limit));

//     const total = await models.Booking.countDocuments(query);

//     res.json({
//       success: true,
//       data: bookings,
//       total,
//       totalPages: Math.ceil(total / limit),
//       currentPage: Number(page)
//     });
//   } catch (error) {
//     console.error('Get bookings error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching bookings'
//     });
//   }
// };


// exports.getBookingsByEmail = async (req, res) => {
//   try {
//     const { email } = req.params;

//     const bookings = await models.Booking.find({
//       email: email.toLowerCase()
//     }).sort('-createdAt');

//     res.json({
//       success: true,
//       data: bookings
//     });
//   } catch (error) {
//     console.error('Get bookings by email error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching bookings'
//     });
//   }
// };


// exports.getBookingById = async (req, res) => {
//   try {
//     const booking = await models.Booking.findById(req.params.id);

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



// // Admin: Update booking status
// exports.updateBookingStatus = async (req, res) => {
//   try {
//     const { status, notes } = req.body;

//     const validStatuses = [
//       'pending',
//       'contacted',
//       'in_progress',
//       'completed',
//       'cancelled'
//     ];

//     if (status && !validStatuses.includes(status)) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid status'
//       });
//     }

//     const booking = await models.Booking.findByIdAndUpdate(
//       req.params.id,
//       { status, notes },
//       { new: true, runValidators: true }
//     );

//     if (!booking) {
//       return res.status(404).json({
//         success: false,
//         message: 'Booking not found'
//       });
//     }

//     res.json({
//       success: true,
//       message: 'Booking updated',
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

// // Admin: Delete booking
// exports.deleteBooking = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     const booking = await models.Booking.findByIdAndDelete(id);

//     if (!booking) {
//       return res.status(404).json({
//         success: false,
//         message: 'Booking not found'
//       });
//     }

//     res.json({
//       success: true,
//       message: 'Booking deleted successfully'
//     });
//   } catch (error) {
//     console.error('Delete booking error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error deleting booking'
//     });
//   }
// };

// // Admin: Get booking statistics
// exports.getBookingStats = async (req, res) => {
//   try {
//     const { period = '30d' } = req.query;
//     let startDate = new Date();
    
//     // Calculate start date based on period
//     switch (period) {
//       case '7d':
//         startDate.setDate(startDate.getDate() - 7);
//         break;
//       case '30d':
//         startDate.setDate(startDate.getDate() - 30);
//         break;
//       case '90d':
//         startDate.setDate(startDate.getDate() - 90);
//         break;
//       case '1y':
//         startDate.setFullYear(startDate.getFullYear() - 1);
//         break;
//       default:
//         startDate.setDate(startDate.getDate() - 30);
//     }

//     // Get total counts
//     const totalBookings = await models.Booking.countDocuments();
//     const pendingBookings = await models.Booking.countDocuments({ status: 'pending' });
//     const confirmedBookings = await models.Booking.countDocuments({ status: 'confirmed' });
//     const cancelledBookings = await models.Booking.countDocuments({ status: 'cancelled' });
//     const completedBookings = await models.Booking.countDocuments({ status: 'completed' });

//     // Get bookings by service
//     const bookingsByService = await models.Booking.aggregate([
//       {
//         $group: {
//           _id: '$service',
//           count: { $sum: 1 },
//           revenue: { $sum: 1 } // Placeholder for actual revenue calculation
//         }
//       },
//       { $sort: { count: -1 } }
//     ]);

//     // Get bookings by country
//     const bookingsByCountry = await models.Booking.aggregate([
//       {
//         $group: {
//           _id: '$country',
//           count: { $sum: 1 }
//         }
//       },
//       { $sort: { count: -1 } },
//       { $limit: 10 }
//     ]);

//     // Get bookings by date (for chart)
//     const bookingsByDate = await models.Booking.aggregate([
//       {
//         $match: {
//           createdAt: { $gte: startDate }
//         }
//       },
//       {
//         $group: {
//           _id: {
//             $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
//           },
//           count: { $sum: 1 }
//         }
//       },
//       { $sort: { _id: 1 } }
//     ]);

//     // Get recent bookings
//     const recentBookings = await models.Booking.find()
//       .sort('-createdAt')
//       .limit(10)
//       .select('name email service status date createdAt');

//     res.json({
//       success: true,
//       data: {
//         total: totalBookings,
//         pending: pendingBookings,
//         confirmed: confirmedBookings,
//         cancelled: cancelledBookings,
//         completed: completedBookings,
//         stats: {
//           conversionRate: totalBookings > 0 ? 
//             ((confirmedBookings + completedBookings) / totalBookings * 100).toFixed(1) : 0,
//           cancellationRate: totalBookings > 0 ? 
//             (cancelledBookings / totalBookings * 100).toFixed(1) : 0
//         },
//         bookingsByService,
//         bookingsByCountry,
//         bookingsByDate,
//         recentBookings,
//         period
//       }
//     });
//   } catch (error) {
//     console.error('Get booking stats error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching booking statistics'
//     });
//   }
// };

// // Admin: Bulk update bookings
// exports.bulkUpdateBookings = async (req, res) => {
//   try {
//     const { bookingIds, action, status, notes } = req.body;

//     if (!bookingIds || !Array.isArray(bookingIds) || bookingIds.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: 'Please provide an array of booking IDs'
//       });
//     }

//     let updateData = {};
//     let message = '';

//     switch (action) {
//       case 'confirm':
//         updateData = { status: 'confirmed' };
//         message = 'Bookings confirmed';
//         break;
//       case 'cancel':
//         updateData = { status: 'cancelled' };
//         message = 'Bookings cancelled';
//         break;
//       case 'complete':
//         updateData = { status: 'completed' };
//         message = 'Bookings marked as completed';
//         break;
//       case 'addNotes':
//         if (!notes) {
//           return res.status(400).json({
//             success: false,
//             message: 'Notes are required for this action'
//           });
//         }
//         updateData = { notes };
//         message = 'Notes added to bookings';
//         break;
//       case 'delete':
//         await models.Booking.deleteMany({ _id: { $in: bookingIds } });
//         return res.json({
//           success: true,
//           message: 'Bookings deleted successfully',
//           count: bookingIds.length
//         });
//       default:
//         if (status) {
//           updateData = { status };
//           message = `Bookings status updated to ${status}`;
//         } else {
//           return res.status(400).json({
//             success: false,
//             message: 'Invalid action or status'
//           });
//         }
//     }

//     const result = await models.Booking.updateMany(
//       { _id: { $in: bookingIds } },
//       updateData
//     );

//     res.json({
//       success: true,
//       message: `${message} successfully`,
//       count: result.modifiedCount
//     });
//   } catch (error) {
//     console.error('Bulk update bookings error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error updating bookings'
//     });
//   }
// };
























const models = require('../models/Services');
const nodemailer = require('nodemailer');
const validator = require('validator');

/* ================= EMAIL SERVICE ================= */

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

const sendEmail = async (to, subject, html) => {
  try {
    const transporter = createTransporter();
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'RECAPPLY <noreply@recapply.com>',
      to,
      subject,
      html
    });
    return info;
  } catch (error) {
    console.error('Email error:', error);
    throw error;
  }
};

/* ================= TRACK EVENT ================= */

const trackEvent = async (type, data = {}, req = null) => {
  try {
    if (!models.Statistics) return;

    const statData = {
      type,
      ...data,
      timestamp: new Date()
    };

    if (req) {
      statData.ip = req.ip;
      statData.userAgent = req.get('user-agent');
    }

    await new models.Statistics(statData).save();
  } catch (error) {
    console.error('Track event error:', error);
  }
};

/* ================= CREATE BOOKING ================= */

exports.createBooking = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      country,
      service,
      serviceCategory,
      date,
      educationLevel,
      program,
      budget,
      startDate,
      message
    } = req.body;

    /* ---------- VALIDATION ---------- */

    if (!name || !email || !phone || !country || !service || !date || !startDate) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email address'
      });
    }

    const bookingDate = new Date(date);
    const start = new Date(startDate);

    if (isNaN(bookingDate.getTime()) || isNaN(start.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date'
      });
    }

    /* ---------- CREATE ---------- */

    const booking = new models.Booking({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      country: country.trim(),
      service: service.trim(),
      serviceCategory,
      date: bookingDate,
      educationLevel,
      program,
      budget,
      startDate: start,
      message: message || '',
      status: 'pending',
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });

    await booking.save();

    /* ---------- TRACK ---------- */

    await trackEvent(
      'booking',
      { service, country, name: booking.name },
      req
    );

    /* ---------- USER EMAIL ---------- */

    const userEmailHtml = `
      <div style="font-family: Arial; max-width:600px">
        <h2>Booking Confirmation</h2>
        <p>Hello ${booking.name},</p>
        <p>Your booking request has been received successfully.</p>

        <h3>Booking Details</h3>
        <p><strong>Service:</strong> ${booking.service}</p>
        <p><strong>Category:</strong> ${booking.serviceCategory}</p>
        <p><strong>Date:</strong> ${booking.date.toDateString()}</p>
        <p><strong>Start Date:</strong> ${booking.startDate.toDateString()}</p>
        <p><strong>Status:</strong> ${booking.status}</p>

        <p>We will contact you shortly.</p>
        <p>RECAPPLY Team</p>
      </div>
    `;

    await sendEmail(
      booking.email,
      'Booking Received – RECAPPLY',
      userEmailHtml
    );

    /* ---------- ADMIN EMAIL ---------- */

    if (process.env.ADMIN_EMAIL) {
      const adminEmailHtml = `
        <div style="font-family: Arial; max-width:600px">
          <h2>New Booking</h2>

          <p><strong>Name:</strong> ${booking.name}</p>
          <p><strong>Email:</strong> ${booking.email}</p>
          <p><strong>Phone:</strong> ${booking.phone}</p>
          <p><strong>Country:</strong> ${booking.country}</p>

          <h3>Service Info</h3>
          <p><strong>Service:</strong> ${booking.service}</p>
          <p><strong>Category:</strong> ${booking.serviceCategory}</p>
          <p><strong>Education Level:</strong> ${booking.educationLevel}</p>
          <p><strong>Program:</strong> ${booking.program}</p>
          <p><strong>Budget:</strong> ${booking.budget}</p>

          <p><strong>Status:</strong> ${booking.status}</p>
          <p><strong>IP:</strong> ${booking.ipAddress}</p>
        </div>
      `;

      await sendEmail(
        process.env.ADMIN_EMAIL,
        `New Booking – ${booking.name}`,
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

/* ================= GET ALL BOOKINGS ================= */

exports.getAllBookings = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, service, country, search } = req.query;
    const query = {};

    if (status && status !== 'all') query.status = status;
    if (service && service !== 'all') query.service = service;
    if (country && country !== 'all') query.country = country;

    if (search) {
      query.$text = { $search: search };
    }

    const bookings = await models.Booking.find(query)
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await models.Booking.countDocuments(query);

    res.json({
      success: true,
      data: bookings,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page)
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching bookings'
    });
  }
};

/* ================= GET BY EMAIL ================= */

exports.getBookingsByEmail = async (req, res) => {
  try {
    const bookings = await models.Booking.find({
      email: req.params.email.toLowerCase()
    }).sort('-createdAt');

    res.json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false });
  }
};

/* ================= GET BY ID ================= */

exports.getBookingById = async (req, res) => {
  try {
    const booking = await models.Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Not found' });
    }
    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false });
  }
};

/* ================= UPDATE STATUS ================= */

exports.updateBookingStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;

    const booking = await models.Booking.findByIdAndUpdate(
      req.params.id,
      { status, notes },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ success: false });
    }

    res.json({
      success: true,
      message: 'Booking updated',
      data: booking
    });
  } catch (error) {
    res.status(500).json({ success: false });
  }
};

/* ================= DELETE ================= */

exports.deleteBooking = async (req, res) => {
  try {
    const booking = await models.Booking.findByIdAndDelete(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false });
    }
    res.json({ success: true, message: 'Booking deleted' });
  } catch (error) {
    res.status(500).json({ success: false });
  }
};

exports.getBookingStats = async (req, res) => {
  try {
    const { period = '30d' } = req.query;

    /* ================= DATE RANGE ================= */

    let startDate = new Date();

    switch (period) {
      case '7d':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(startDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(startDate.getDate() - 90);
        break;
      case '1y':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate.setDate(startDate.getDate() - 30);
    }

    /* ================= TOTAL COUNTS ================= */

    const [
      totalBookings,
      pending,
      contacted,
      inProgress,
      completed,
      cancelled
    ] = await Promise.all([
      models.Booking.countDocuments(),
      models.Booking.countDocuments({ status: 'pending' }),
      models.Booking.countDocuments({ status: 'contacted' }),
      models.Booking.countDocuments({ status: 'in_progress' }),
      models.Booking.countDocuments({ status: 'completed' }),
      models.Booking.countDocuments({ status: 'cancelled' })
    ]);

    /* ================= BY SERVICE ================= */

    const bookingsByService = await models.Booking.aggregate([
      {
        $group: {
          _id: '$service',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    /* ================= BY CATEGORY ================= */

    const bookingsByCategory = await models.Booking.aggregate([
      {
        $group: {
          _id: '$serviceCategory',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    /* ================= BY COUNTRY ================= */

    const bookingsByCountry = await models.Booking.aggregate([
      {
        $group: {
          _id: '$country',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    /* ================= TIMELINE (CHART) ================= */

    const bookingsTimeline = await models.Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$createdAt'
            }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    /* ================= RECENT BOOKINGS ================= */

    const recentBookings = await models.Booking.find()
      .sort('-createdAt')
      .limit(10)
      .select('name email service serviceCategory status createdAt');

    /* ================= CONVERSION RATES ================= */

    const conversionRate =
      totalBookings > 0
        ? (((completed + inProgress) / totalBookings) * 100).toFixed(1)
        : 0;

    const cancellationRate =
      totalBookings > 0
        ? ((cancelled / totalBookings) * 100).toFixed(1)
        : 0;

    /* ================= RESPONSE ================= */

    res.json({
      success: true,
      data: {
        totals: {
          total: totalBookings,
          pending,
          contacted,
          inProgress,
          completed,
          cancelled
        },
        rates: {
          conversionRate,
          cancellationRate
        },
        charts: {
          byService: bookingsByService,
          byCategory: bookingsByCategory,
          byCountry: bookingsByCountry,
          timeline: bookingsTimeline
        },
        recentBookings,
        period
      }
    });

  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching booking statistics'
    });
  }
};
