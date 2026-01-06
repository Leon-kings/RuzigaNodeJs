// const AirportBooking = require('../models/AirportBooking');
// const emailService = require('../mails/sendEmail');
// const { validationResult } = require('express-validator');

// // Get all bookings
// exports.getAllBookings = async (req, res) => {
//   try {
//     const {
//       page = 1,
//       limit = 10,
//       status,
//       serviceType,
//       startDate,
//       endDate,
//       sortBy = 'createdAt',
//       sortOrder = 'desc'
//     } = req.query;

//     const query = {};

//     if (status) query.status = status;
//     if (serviceType) query.serviceType = serviceType;

//     if (startDate || endDate) {
//       query.createdAt = {};
//       if (startDate) query.createdAt.$gte = new Date(startDate);
//       if (endDate) query.createdAt.$lte = new Date(endDate);
//     }

//     const sortOptions = {};
//     sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

//     const bookings = await AirportBooking.find(query)
//       .sort(sortOptions)
//       .limit(limit * 1)
//       .skip((page - 1) * limit)
//       .exec();

//     const total = await AirportBooking.countDocuments(query);

//     res.status(200).json({
//       success: true,
//       data: bookings,
//       pagination: {
//         currentPage: page * 1,
//         totalPages: Math.ceil(total / limit),
//         totalItems: total,
//         itemsPerPage: limit * 1
//       }
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching bookings',
//       error: error.message
//     });
//   }
// };

// // Get single booking
// exports.getBooking = async (req, res) => {
//   try {
//     const booking = await AirportBooking.findById(req.params.id);

//     if (!booking) {
//       return res.status(404).json({
//         success: false,
//         message: 'Booking not found'
//       });
//     }

//     res.status(200).json({
//       success: true,
//       data: booking
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching booking',
//       error: error.message
//     });
//   }
// };

// // Create booking
// exports.createBooking = async (req, res) => {
//   try {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({
//         success: false,
//         errors: errors.array()
//       });
//     }

//     const booking = new AirportBooking(req.body);

//     // Calculate total amount based on service type and passengers
//     const basePrices = {
//       standard: 50,
//       vip_service: 150,
//       executive: 100,
//       family: 75,
//       group: 40
//     };

//     const basePrice = basePrices[booking.serviceType] || 50;
//     booking.totalAmount = basePrice * booking.numberOfPassengers;
//     booking.statistics.totalRevenue = booking.totalAmount;

//     await booking.save();

//     // Send confirmation email
//     try {
//       await emailService.sendBookingConfirmation(booking);
//       await booking.incrementEmailCount();
//     } catch (emailError) {
//       console.error('Email sending failed:', emailError);
//     }

//     res.status(201).json({
//       success: true,
//       message: 'Booking created successfully',
//       data: booking
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error creating booking',
//       error: error.message
//     });
//   }
// };

// // Update booking
// exports.updateBooking = async (req, res) => {
//   try {
//     const booking = await AirportBooking.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true, runValidators: true }
//     );

//     if (!booking) {
//       return res.status(404).json({
//         success: false,
//         message: 'Booking not found'
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: 'Booking updated successfully',
//       data: booking
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error updating booking',
//       error: error.message
//     });
//   }
// };

// // Delete booking
// exports.deleteBooking = async (req, res) => {
//   try {
//     const booking = await AirportBooking.findByIdAndDelete(req.params.id);

//     if (!booking) {
//       return res.status(404).json({
//         success: false,
//         message: 'Booking not found'
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: 'Booking deleted successfully'
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error deleting booking',
//       error: error.message
//     });
//   }
// };

// // Get statistics
// exports.getStatistics = async (req, res) => {
//   try {
//     const statistics = await AirportBooking.getStatistics();

//     // Calculate additional statistics
//     const today = new Date();
//     const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
//     const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));

//     const monthlyStats = await AirportBooking.aggregate([
//       {
//         $match: {
//           createdAt: { $gte: startOfMonth }
//         }
//       },
//       {
//         $group: {
//           _id: null,
//           monthlyBookings: { $sum: 1 },
//           monthlyRevenue: { $sum: '$totalAmount' }
//         }
//       }
//     ]);

//     const weeklyStats = await AirportBooking.aggregate([
//       {
//         $match: {
//           createdAt: { $gte: startOfWeek }
//         }
//       },
//       {
//         $group: {
//           _id: null,
//           weeklyBookings: { $sum: 1 },
//           weeklyRevenue: { $sum: '$totalAmount' }
//         }
//       }
//     ]);

//     res.status(200).json({
//       success: true,
//       data: {
//         ...statistics,
//         timeframeStats: {
//           monthly: monthlyStats[0] || { monthlyBookings: 0, monthlyRevenue: 0 },
//           weekly: weeklyStats[0] || { weeklyBookings: 0, weeklyRevenue: 0 }
//         },
//         calculatedAt: new Date()
//       }
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching statistics',
//       error: error.message
//     });
//   }
// };

// // Send email
// exports.sendEmail = async (req, res) => {
//   try {
//     const { bookingId, emailType, customMessage } = req.body;

//     const booking = await AirportBooking.findById(bookingId);

//     if (!booking) {
//       return res.status(404).json({
//         success: false,
//         message: 'Booking not found'
//       });
//     }

//     let emailResult;

//     switch (emailType) {
//       case 'confirmation':
//         emailResult = await emailService.sendBookingConfirmation(booking, customMessage);
//         break;
//       case 'reminder':
//         emailResult = await emailService.sendReminderEmail(booking, customMessage);
//         break;
//       case 'cancellation':
//         emailResult = await emailService.sendCancellationEmail(booking, customMessage);
//         break;
//       case 'update':
//         emailResult = await emailService.sendUpdateEmail(booking, customMessage);
//         break;
//       default:
//         return res.status(400).json({
//           success: false,
//           message: 'Invalid email type'
//         });
//     }

//     // Increment email count
//     await booking.incrementEmailCount();

//     res.status(200).json({
//       success: true,
//       message: 'Email sent successfully',
//       data: {
//         emailResult,
//         emailCount: booking.statistics.emailsSent
//       }
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error sending email',
//       error: error.message
//     });
//   }
// };

// // Update booking status
// exports.updateStatus = async (req, res) => {
//   try {
//     const { status } = req.body;

//     const booking = await AirportBooking.findByIdAndUpdate(
//       req.params.id,
//       { status },
//       { new: true, runValidators: true }
//     );

//     if (!booking) {
//       return res.status(404).json({
//         success: false,
//         message: 'Booking not found'
//       });
//     }

//     // Send status update email
//     try {
//       await emailService.sendStatusUpdateEmail(booking, status);
//       await booking.incrementEmailCount();
//     } catch (emailError) {
//       console.error('Status email failed:', emailError);
//     }

//     res.status(200).json({
//       success: true,
//       message: 'Status updated successfully',
//       data: booking
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error updating status',
//       error: error.message
//     });
//   }
// };

// // Search bookings
// exports.searchBookings = async (req, res) => {
//   try {
//     const { query } = req.query;

//     if (!query) {
//       return res.status(400).json({
//         success: false,
//         message: 'Search query is required'
//       });
//     }

//     const bookings = await AirportBooking.find({
//       $or: [
//         { bookingReference: { $regex: query, $options: 'i' } },
//         { firstName: { $regex: query, $options: 'i' } },
//         { lastName: { $regex: query, $options: 'i' } },
//         { email: { $regex: query, $options: 'i' } },
//         { flightNumber: { $regex: query, $options: 'i' } }
//       ]
//     }).limit(20);

//     res.status(200).json({
//       success: true,
//       data: bookings,
//       count: bookings.length
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error searching bookings',
//       error: error.message
//     });
//   }
// };

// // Bulk operations
// exports.bulkUpdate = async (req, res) => {
//   try {
//     const { ids, updates } = req.body;

//     if (!ids || !Array.isArray(ids) || ids.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid IDs array'
//       });
//     }

//     const result = await AirportBooking.updateMany(
//       { _id: { $in: ids } },
//       updates,
//       { runValidators: true }
//     );

//     res.status(200).json({
//       success: true,
//       message: 'Bulk update completed',
//       data: {
//         matched: result.matchedCount,
//         modified: result.modifiedCount
//       }
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error in bulk update',
//       error: error.message
//     });
//   }
// };

// const AirportBooking = require('../models/AirportBooking');
// const Plane = require('../models/AirportBooking');
// const { validationResult } = require('express-validator');
// const cloudinary = require('cloudinary').v2;
// const nodemailer = require('nodemailer');
// const multer = require('multer');
// const { CloudinaryStorage } = require('multer-storage-cloudinary');

// // =========================
// // CLOUDINARY CONFIGURATION
// // =========================
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET
// });

// // Cloudinary storage for multer
// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: 'airport-service',
//     allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
//     transformation: [{ width: 1200, height: 800, crop: 'limit' }],
//     public_id: (req, file) => {
//       const timestamp = Date.now();
//       const randomString = Math.random().toString(36).substring(2, 8);
//       return `plane_${timestamp}_${randomString}`;
//     }
//   }
// });

// // Multer configuration
// const upload = multer({
//   storage: storage,
//   limits: {
//     fileSize: 1 * 1024 * 1024 // 5MB
//   },
//   fileFilter: (req, file, cb) => {
//     if (file.mimetype.startsWith('image/')) {
//       cb(null, true);
//     } else {
//       cb(new Error('Only image files are allowed'), false);
//     }
//   }
// });

// // =========================
// // EMAIL SERVICE CONFIGURATION
// // =========================
// const transporter = nodemailer.createTransport({
//   host: process.env.SMTP_HOST || 'smtp.gmail.com',
//   port: process.env.SMTP_PORT || 587,
//   secure: process.env.SMTP_SECURE === 'true',
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASS
//   }
// });

// // Email templates
// const emailTemplates = {
//   bookingConfirmation: (booking) => `
//     <!DOCTYPE html>
//     <html>
//     <head>
//       <meta charset="utf-8">
//       <meta name="viewport" content="width=device-width, initial-scale=1.0">
//       <title>Booking Confirmation - ${booking.bookingReference}</title>
//       <style>
//         body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
//         .container { max-width: 600px; margin: 0 auto; padding: 20px; }
//         .header { background: #007bff; color: white; padding: 20px; text-align: center; }
//         .content { padding: 20px; background: #f9f9f9; }
//         .booking-details { background: white; padding: 15px; border-radius: 5px; margin: 15px 0; }
//         .detail-row { display: flex; justify-content: space-between; margin: 8px 0; }
//         .detail-label { font-weight: bold; color: #555; }
//         .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
//         .status-badge {
//           display: inline-block;
//           padding: 5px 10px;
//           border-radius: 15px;
//           font-size: 12px;
//           font-weight: bold;
//         }
//         .status-confirmed { background: #d4edda; color: #155724; }
//       </style>
//     </head>
//     <body>
//       <div class="container">
//         <div class="header">
//           <h1>Booking Confirmation</h1>
//           <p>Reference: ${booking.bookingReference}</p>
//         </div>

//         <div class="content">
//           <p>Dear ${booking.firstName} ${booking.lastName},</p>
//           <p>Thank you for booking our airport service. Your booking has been confirmed.</p>

//           <div class="booking-details">
//             <h3>Booking Details</h3>
//             <div class="detail-row">
//               <span class="detail-label">Booking Reference:</span>
//               <span>${booking.bookingReference}</span>
//             </div>
//             <div class="detail-row">
//               <span class="detail-label">Service Type:</span>
//               <span>${booking.serviceType}</span>
//             </div>
//             <div class="detail-row">
//               <span class="detail-label">Number of Passengers:</span>
//               <span>${booking.numberOfPassengers}</span>
//             </div>
//             <div class="detail-row">
//               <span class="detail-label">Flight Number:</span>
//               <span>${booking.flightNumber}</span>
//             </div>
//             <div class="detail-row">
//               <span class="detail-label">Airline:</span>
//               <span>${booking.airline}</span>
//             </div>
//             <div class="detail-row">
//               <span class="detail-label">Arrival:</span>
//               <span>${booking.arrivalDate} at ${booking.arrivalTime}</span>
//             </div>
//             <div class="detail-row">
//               <span class="detail-label">Departure:</span>
//               <span>${booking.departureDate} at ${booking.departureTime}</span>
//             </div>
//             <div class="detail-row">
//               <span class="detail-label">Total Amount:</span>
//               <span>${booking.currency} ${booking.totalAmount}</span>
//             </div>
//             <div class="detail-row">
//               <span class="detail-label">Status:</span>
//               <span class="status-badge status-confirmed">${booking.status}</span>
//             </div>
//           </div>

//           <p>We look forward to serving you at the airport. If you have any questions, please contact us.</p>

//           <p>Best regards,<br>Airport Services Team</p>
//         </div>

//         <div class="footer">
//           <p>This is an automated message. Please do not reply to this email.</p>
//           <p>© ${new Date().getFullYear()} Airport Services. All rights reserved.</p>
//         </div>
//       </div>
//     </body>
//     </html>
//   `,

//   statusUpdate: (booking, status) => `
//     <!DOCTYPE html>
//     <html>
//     <head>
//       <meta charset="utf-8">
//       <meta name="viewport" content="width=device-width, initial-scale=1.0">
//       <title>Booking Status Update - ${booking.bookingReference}</title>
//       <style>
//         body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
//         .container { max-width: 600px; margin: 0 auto; padding: 20px; }
//         .header { background: #17a2b8; color: white; padding: 20px; text-align: center; }
//         .content { padding: 20px; background: #f9f9f9; }
//         .status-update { background: white; padding: 15px; border-radius: 5px; margin: 15px 0; }
//         .detail-row { display: flex; justify-content: space-between; margin: 8px 0; }
//         .detail-label { font-weight: bold; color: #555; }
//         .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
//         .status-badge {
//           display: inline-block;
//           padding: 5px 10px;
//           border-radius: 15px;
//           font-size: 12px;
//           font-weight: bold;
//         }
//         .status-${status} {
//           background: ${status === 'confirmed' ? '#d4edda' :
//                       status === 'cancelled' ? '#f8d7da' :
//                       status === 'completed' ? '#cce5ff' : '#fff3cd'};
//           color: ${status === 'confirmed' ? '#155724' :
//                   status === 'cancelled' ? '#721c24' :
//                   status === 'completed' ? '#004085' : '#856404'};
//         }
//       </style>
//     </head>
//     <body>
//       <div class="container">
//         <div class="header">
//           <h1>Booking Status Update</h1>
//           <p>Reference: ${booking.bookingReference}</p>
//         </div>

//         <div class="content">
//           <p>Dear ${booking.firstName} ${booking.lastName},</p>
//           <p>The status of your booking has been updated.</p>

//           <div class="status-update">
//             <h3>Updated Status</h3>
//             <div class="detail-row">
//               <span class="detail-label">Booking Reference:</span>
//               <span>${booking.bookingReference}</span>
//             </div>
//             <div class="detail-row">
//               <span class="detail-label">New Status:</span>
//               <span class="status-badge status-${status}">${status.toUpperCase()}</span>
//             </div>
//             <div class="detail-row">
//               <span class="detail-label">Updated On:</span>
//               <span>${new Date().toLocaleDateString()}</span>
//             </div>
//           </div>

//           <p>Please log in to your account to view complete details.</p>

//           <p>Best regards,<br>Airport Services Team</p>
//         </div>

//         <div class="footer">
//           <p>This is an automated message. Please do not reply to this email.</p>
//           <p>© ${new Date().getFullYear()} Airport Services. All rights reserved.</p>
//         </div>
//       </div>
//     </body>
//     </html>
//   `,

//   cancellation: (booking) => `
//     <!DOCTYPE html>
//     <html>
//     <head>
//       <meta charset="utf-8">
//       <meta name="viewport" content="width=device-width, initial-scale=1.0">
//       <title>Booking Cancellation - ${booking.bookingReference}</title>
//       <style>
//         body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
//         .container { max-width: 600px; margin: 0 auto; padding: 20px; }
//         .header { background: #dc3545; color: white; padding: 20px; text-align: center; }
//         .content { padding: 20px; background: #f9f9f9; }
//         .cancellation-details { background: white; padding: 15px; border-radius: 5px; margin: 15px 0; }
//         .detail-row { display: flex; justify-content: space-between; margin: 8px 0; }
//         .detail-label { font-weight: bold; color: #555; }
//         .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
//         .refund-info { background: #fff3cd; padding: 15px; border-radius: 5px; margin: 15px 0; }
//       </style>
//     </head>
//     <body>
//       <div class="container">
//         <div class="header">
//           <h1>Booking Cancellation</h1>
//           <p>Reference: ${booking.bookingReference}</p>
//         </div>

//         <div class="content">
//           <p>Dear ${booking.firstName} ${booking.lastName},</p>
//           <p>Your booking has been cancelled as requested.</p>

//           <div class="cancellation-details">
//             <h3>Cancelled Booking Details</h3>
//             <div class="detail-row">
//               <span class="detail-label">Booking Reference:</span>
//               <span>${booking.bookingReference}</span>
//             </div>
//             <div class="detail-row">
//               <span class="detail-label">Service Type:</span>
//               <span>${booking.serviceType}</span>
//             </div>
//             <div class="detail-row">
//               <span class="detail-label">Number of Passengers:</span>
//               <span>${booking.numberOfPassengers}</span>
//             </div>
//             <div class="detail-row">
//               <span class="detail-label">Total Amount:</span>
//               <span>${booking.currency} ${booking.totalAmount}</span>
//             </div>
//             <div class="detail-row">
//               <span class="detail-label">Cancellation Date:</span>
//               <span>${new Date().toLocaleDateString()}</span>
//             </div>
//           </div>

//           <div class="refund-info">
//             <h4>Refund Information</h4>
//             <p>Your refund will be processed within 7-10 business days. The refund amount will be credited to your original payment method.</p>
//             <p>If you have any questions about the refund process, please contact our customer support.</p>
//           </div>

//           <p>We hope to serve you again in the future.</p>

//           <p>Best regards,<br>Airport Services Team</p>
//         </div>

//         <div class="footer">
//           <p>This is an automated message. Please do not reply to this email.</p>
//           <p>© ${new Date().getFullYear()} Airport Services. All rights reserved.</p>
//         </div>
//       </div>
//     </body>
//     </html>
//   `,

//   reminder: (booking) => `
//     <!DOCTYPE html>
//     <html>
//     <head>
//       <meta charset="utf-8">
//       <meta name="viewport" content="width=device-width, initial-scale=1.0">
//       <title>Booking Reminder - ${booking.bookingReference}</title>
//       <style>
//         body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
//         .container { max-width: 600px; margin: 0 auto; padding: 20px; }
//         .header { background: #ffc107; color: #333; padding: 20px; text-align: center; }
//         .content { padding: 20px; background: #f9f9f9; }
//         .reminder-details { background: white; padding: 15px; border-radius: 5px; margin: 15px 0; }
//         .detail-row { display: flex; justify-content: space-between; margin: 8px 0; }
//         .detail-label { font-weight: bold; color: #555; }
//         .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
//         .important-note { background: #fff3cd; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #ffc107; }
//       </style>
//     </head>
//     <body>
//       <div class="container">
//         <div class="header">
//           <h1>Booking Reminder</h1>
//           <p>Your airport service is coming up soon!</p>
//         </div>

//         <div class="content">
//           <p>Dear ${booking.firstName} ${booking.lastName},</p>
//           <p>This is a friendly reminder about your upcoming airport service booking.</p>

//           <div class="reminder-details">
//             <h3>Booking Details</h3>
//             <div class="detail-row">
//               <span class="detail-label">Booking Reference:</span>
//               <span>${booking.bookingReference}</span>
//             </div>
//             <div class="detail-row">
//               <span class="detail-label">Arrival Date & Time:</span>
//               <span>${booking.arrivalDate} at ${booking.arrivalTime}</span>
//             </div>
//             <div class="detail-row">
//               <span class="detail-label">Departure Date & Time:</span>
//               <span>${booking.departureDate} at ${booking.departureTime}</span>
//             </div>
//             <div class="detail-row">
//               <span class="detail-label">Airport Terminal:</span>
//               <span>${booking.terminal}</span>
//             </div>
//             <div class="detail-row">
//               <span class="detail-label">Number of Passengers:</span>
//               <span>${booking.numberOfPassengers}</span>
//             </div>
//           </div>

//           <div class="important-note">
//             <h4>Important Information</h4>
//             <p>• Please arrive at the airport at least 30 minutes before your scheduled service time.</p>
//             <p>• Bring valid identification documents for all passengers.</p>
//             <p>• Have your booking reference ready when you arrive.</p>
//             ${booking.specialRequirements ? `<p>• Special Requirements: ${booking.specialRequirements}</p>` : ''}
//           </div>

//           <p>We look forward to serving you at the airport!</p>

//           <p>Best regards,<br>Airport Services Team</p>
//         </div>

//         <div class="footer">
//           <p>This is an automated reminder. Please do not reply to this email.</p>
//           <p>© ${new Date().getFullYear()} Airport Services. All rights reserved.</p>
//         </div>
//       </div>
//     </body>
//     </html>
//   `
// };

// // Email sending function
// const sendEmail = async (to, subject, html) => {
//   try {
//     const mailOptions = {
//       from: `"Airport Services" <${process.env.EMAIL_FROM || 'noreply@airportservices.com'}>`,
//       to,
//       subject,
//       html,
//       text: html.replace(/<[^>]*>/g, '') // Fallback text version
//     };

//     const info = await transporter.sendMail(mailOptions);
//     console.log('Email sent:', info.messageId);
//     return info;
//   } catch (error) {
//     console.error('Email sending failed:', error);
//     throw error;
//   }
// };

// // =========================
// // BOOKING CONTROLLERS
// // =========================

// // Get all bookings
// exports.getAllBookings = async (req, res) => {
//   try {
//     const {
//       page = 1,
//       limit = 10,
//       status,
//       serviceType,
//       startDate,
//       endDate,
//       sortBy = 'createdAt',
//       sortOrder = 'desc',
//       search
//     } = req.query;

//     const query = {};

//     if (status) query.status = status;
//     if (serviceType) query.serviceType = serviceType;

//     if (startDate || endDate) {
//       query.createdAt = {};
//       if (startDate) query.createdAt.$gte = new Date(startDate);
//       if (endDate) query.createdAt.$lte = new Date(endDate);
//     }

//     if (search) {
//       query.$or = [
//         { bookingReference: { $regex: search, $options: 'i' } },
//         { firstName: { $regex: search, $options: 'i' } },
//         { lastName: { $regex: search, $options: 'i' } },
//         { email: { $regex: search, $options: 'i' } },
//         { flightNumber: { $regex: search, $options: 'i' } },
//         { airline: { $regex: search, $options: 'i' } }
//       ];
//     }

//     const sortOptions = {};
//     sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

//     const bookings = await AirportBooking.find(query)
//       .sort(sortOptions)
//       .limit(limit * 1)
//       .skip((page - 1) * limit)
//       .populate('plane', 'name model airline registrationNumber images')
//       .exec();

//     const total = await AirportBooking.countDocuments(query);

//     res.status(200).json({
//       success: true,
//       count: bookings.length,
//       data: bookings,
//       pagination: {
//         currentPage: page * 1,
//         totalPages: Math.ceil(total / limit),
//         totalItems: total,
//         itemsPerPage: limit * 1
//       }
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching bookings',
//       error: error.message
//     });
//   }
// };

// // Get single booking
// exports.getBooking = async (req, res) => {
//   try {
//     const booking = await AirportBooking.findById(req.params.id)
//       .populate('plane', 'name model airline registrationNumber images');

//     if (!booking) {
//       return res.status(404).json({
//         success: false,
//         message: 'Booking not found'
//       });
//     }

//     res.status(200).json({
//       success: true,
//       data: booking
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching booking',
//       error: error.message
//     });
//   }
// };

// // Create booking
// exports.createBooking = async (req, res) => {
//   try {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({
//         success: false,
//         errors: errors.array()
//       });
//     }

//     const bookingData = req.body;

//     // Check if plane exists
//     if (bookingData.plane) {
//       const plane = await Plane.findById(bookingData.plane);
//       if (!plane) {
//         return res.status(404).json({
//           success: false,
//           message: 'Plane not found'
//         });
//       }
//     }

//     // Calculate total amount
//     const basePrices = {
//       standard: 50,
//       vip_service: 150,
//       executive: 100,
//       family: 75,
//       group: 40
//     };

//     const basePrice = basePrices[bookingData.serviceType] || 50;
//     const totalAmount = basePrice * bookingData.numberOfPassengers;

//     // Add bag charges if applicable
//     const bagCharge = bookingData.numberOfBags * 10;

//     const booking = new AirportBooking({
//       ...bookingData,
//       totalAmount: totalAmount + bagCharge,
//       statistics: {
//         totalRevenue: totalAmount + bagCharge
//       }
//     });

//     await booking.save();

//     // Send confirmation email
//     try {
//       await sendEmail(
//         booking.email,
//         `Booking Confirmation - ${booking.bookingReference}`,
//         emailTemplates.bookingConfirmation(booking)
//       );
//       await booking.incrementEmailCount();
//     } catch (emailError) {
//       console.error('Email sending failed:', emailError);
//     }

//     res.status(201).json({
//       success: true,
//       message: 'Booking created successfully',
//       data: booking
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error creating booking',
//       error: error.message
//     });
//   }
// };

// // Update booking
// exports.updateBooking = async (req, res) => {
//   try {
//     const booking = await AirportBooking.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true, runValidators: true }
//     ).populate('plane', 'name model airline');

//     if (!booking) {
//       return res.status(404).json({
//         success: false,
//         message: 'Booking not found'
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: 'Booking updated successfully',
//       data: booking
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error updating booking',
//       error: error.message
//     });
//   }
// };

// // Delete booking
// exports.deleteBooking = async (req, res) => {
//   try {
//     const booking = await AirportBooking.findByIdAndDelete(req.params.id);

//     if (!booking) {
//       return res.status(404).json({
//         success: false,
//         message: 'Booking not found'
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: 'Booking deleted successfully'
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error deleting booking',
//       error: error.message
//     });
//   }
// };

// // Get statistics
// exports.getStatistics = async (req, res) => {
//   try {
//     const { period = 'all' } = req.query;

//     const statistics = await AirportBooking.getStatistics(period);

//     // Additional custom statistics
//     const today = new Date();
//     const startOfToday = new Date(today.setHours(0, 0, 0, 0));

//     const todayStats = await AirportBooking.aggregate([
//       {
//         $match: {
//           createdAt: { $gte: startOfToday }
//         }
//       },
//       {
//         $group: {
//           _id: null,
//           bookingsToday: { $sum: 1 },
//           revenueToday: { $sum: '$totalAmount' }
//         }
//       }
//     ]);

//     const upcomingBookings = await AirportBooking.find({
//       arrivalDate: { $gte: new Date() },
//       status: { $in: ['pending', 'confirmed'] }
//     })
//     .sort({ arrivalDate: 1 })
//     .limit(10)
//     .select('bookingReference firstName lastName arrivalDate arrivalTime status')
//     .populate('plane', 'name model');

//     res.status(200).json({
//       success: true,
//       data: {
//         ...statistics,
//         todayStats: todayStats[0] || { bookingsToday: 0, revenueToday: 0 },
//         upcomingBookings,
//         generatedAt: new Date()
//       }
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching statistics',
//       error: error.message
//     });
//   }
// };

// // Send email to booking
// exports.sendEmailToBooking = async (req, res) => {
//   try {
//     const { bookingId, emailType, customMessage } = req.body;

//     const booking = await AirportBooking.findById(bookingId);

//     if (!booking) {
//       return res.status(404).json({
//         success: false,
//         message: 'Booking not found'
//       });
//     }

//     let emailHtml;
//     let subject;

//     switch (emailType) {
//       case 'confirmation':
//         emailHtml = emailTemplates.bookingConfirmation(booking);
//         subject = `Booking Confirmation - ${booking.bookingReference}`;
//         break;
//       case 'reminder':
//         emailHtml = emailTemplates.reminder(booking);
//         subject = `Reminder: Your Airport Service Booking - ${booking.bookingReference}`;
//         break;
//       case 'cancellation':
//         emailHtml = emailTemplates.cancellation(booking);
//         subject = `Booking Cancellation - ${booking.bookingReference}`;
//         break;
//       case 'update':
//         emailHtml = emailTemplates.statusUpdate(booking, booking.status);
//         subject = `Booking Update - ${booking.bookingReference}`;
//         break;
//       default:
//         return res.status(400).json({
//           success: false,
//           message: 'Invalid email type'
//         });
//     }

//     // Send email
//     const emailResult = await sendEmail(booking.email, subject, emailHtml);

//     // Increment email count
//     await booking.incrementEmailCount();

//     res.status(200).json({
//       success: true,
//       message: 'Email sent successfully',
//       data: {
//         emailResult,
//         emailCount: booking.statistics.emailsSent
//       }
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error sending email',
//       error: error.message
//     });
//   }
// };

// // Update booking status
// exports.updateStatus = async (req, res) => {
//   try {
//     const { status, cancellationReason } = req.body;

//     const updateData = { status };
//     if (cancellationReason) {
//       updateData.cancellationReason = cancellationReason;
//     }

//     const booking = await AirportBooking.findByIdAndUpdate(
//       req.params.id,
//       updateData,
//       { new: true, runValidators: true }
//     ).populate('plane', 'name model airline');

//     if (!booking) {
//       return res.status(404).json({
//         success: false,
//         message: 'Booking not found'
//       });
//     }

//     // Send status update email
//     try {
//       await sendEmail(
//         booking.email,
//         `Booking Status Updated - ${booking.bookingReference}`,
//         emailTemplates.statusUpdate(booking, status)
//       );
//       await booking.incrementEmailCount();
//     } catch (emailError) {
//       console.error('Status email failed:', emailError);
//     }

//     res.status(200).json({
//       success: true,
//       message: 'Status updated successfully',
//       data: booking
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error updating status',
//       error: error.message
//     });
//   }
// };

// // Search bookings
// exports.searchBookings = async (req, res) => {
//   try {
//     const { query } = req.query;

//     if (!query) {
//       return res.status(400).json({
//         success: false,
//         message: 'Search query is required'
//       });
//     }

//     const bookings = await AirportBooking.find({
//       $or: [
//         { bookingReference: { $regex: query, $options: 'i' } },
//         { firstName: { $regex: query, $options: 'i' } },
//         { lastName: { $regex: query, $options: 'i' } },
//         { email: { $regex: query, $options: 'i' } },
//         { flightNumber: { $regex: query, $options: 'i' } },
//         { airline: { $regex: query, $options: 'i' } },
//         { phone: { $regex: query, $options: 'i' } }
//       ]
//     })
//     .limit(20)
//     .populate('plane', 'name model airline')
//     .sort({ createdAt: -1 });

//     res.status(200).json({
//       success: true,
//       data: bookings,
//       count: bookings.length
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error searching bookings',
//       error: error.message
//     });
//   }
// };

// // Get bookings by email
// exports.getBookingsByEmail = async (req, res) => {
//   try {
//     const { email } = req.params;

//     const bookings = await AirportBooking.find({ email: email.toLowerCase() })
//       .sort({ createdAt: -1 })
//       .populate('plane', 'name model airline images');

//     res.status(200).json({
//       success: true,
//       data: bookings,
//       count: bookings.length
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching bookings',
//       error: error.message
//     });
//   }
// };

// // Cancel booking
// exports.cancelBooking = async (req, res) => {
//   try {
//     const { cancellationReason } = req.body;

//     const booking = await AirportBooking.findById(req.params.id);

//     if (!booking) {
//       return res.status(404).json({
//         success: false,
//         message: 'Booking not found'
//       });
//     }

//     // Cancel the booking using instance method
//     await booking.cancelBooking(cancellationReason);

//     // Send cancellation email
//     try {
//       await sendEmail(
//         booking.email,
//         `Booking Cancelled - ${booking.bookingReference}`,
//         emailTemplates.cancellation(booking)
//       );
//       await booking.incrementEmailCount();
//     } catch (emailError) {
//       console.error('Cancellation email failed:', emailError);
//     }

//     res.status(200).json({
//       success: true,
//       message: 'Booking cancelled successfully',
//       data: booking
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error cancelling booking',
//       error: error.message
//     });
//   }
// };

// // Get dashboard statistics
// exports.getDashboardStats = async (req, res) => {
//   try {
//     const [bookingsStats, planesStats, revenueStats] = await Promise.all([
//       // Bookings statistics
//       AirportBooking.aggregate([
//         {
//           $group: {
//             _id: null,
//             totalBookings: { $sum: 1 },
//             activeBookings: {
//               $sum: {
//                 $cond: [{ $in: ['$status', ['pending', 'confirmed']] }, 1, 0]
//               }
//             },
//             todayBookings: {
//               $sum: {
//                 $cond: [
//                   {
//                     $and: [
//                       { $gte: ['$createdAt', new Date(new Date().setHours(0, 0, 0, 0))] },
//                       { $lte: ['$createdAt', new Date(new Date().setHours(23, 59, 59, 999))] }
//                     ]
//                   },
//                   1,
//                   0
//                 ]
//               }
//             }
//           }
//         }
//       ]),

//       // Planes statistics
//       Plane.aggregate([
//         {
//           $group: {
//             _id: null,
//             totalPlanes: { $sum: 1 },
//             activePlanes: {
//               $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
//             },
//             availablePlanes: {
//               $sum: { $cond: [{ $eq: ['$isAvailable', true] }, 1, 0] }
//             }
//           }
//         }
//       ]),

//       // Revenue statistics
//       AirportBooking.aggregate([
//         {
//           $group: {
//             _id: null,
//             totalRevenue: { $sum: '$totalAmount' },
//             todayRevenue: {
//               $sum: {
//                 $cond: [
//                   {
//                     $and: [
//                       { $gte: ['$createdAt', new Date(new Date().setHours(0, 0, 0, 0))] },
//                       { $lte: ['$createdAt', new Date(new Date().setHours(23, 59, 59, 999))] }
//                     ]
//                   },
//                   '$totalAmount',
//                   0
//                 ]
//               }
//             },
//             monthlyRevenue: {
//               $sum: {
//                 $cond: [
//                   { $gte: ['$createdAt', new Date(new Date().getFullYear(), new Date().getMonth(), 1)] },
//                   '$totalAmount',
//                   0
//                 ]
//               }
//             }
//           }
//         }
//       ])
//     ]);

//     // Recent bookings
//     const recentBookings = await AirportBooking.find()
//       .sort({ createdAt: -1 })
//       .limit(5)
//       .populate('plane', 'name model')
//       .select('bookingReference firstName lastName status totalAmount createdAt');

//     // Recent planes
//     const recentPlanes = await Plane.find()
//       .sort({ createdAt: -1 })
//       .limit(5)
//       .select('name model airline registrationNumber status createdAt');

//     res.status(200).json({
//       success: true,
//       data: {
//         bookings: bookingsStats[0] || { totalBookings: 0, activeBookings: 0, todayBookings: 0 },
//         planes: planesStats[0] || { totalPlanes: 0, activePlanes: 0, availablePlanes: 0 },
//         revenue: revenueStats[0] || { totalRevenue: 0, todayRevenue: 0, monthlyRevenue: 0 },
//         recentBookings,
//         recentPlanes,
//         generatedAt: new Date()
//       }
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching dashboard statistics',
//       error: error.message
//     });
//   }
// };

// // =========================
// // PLANE CONTROLLERS
// // =========================

// // Get all planes
// exports.getAllPlanes = async (req, res) => {
//   try {
//     const {
//       page = 1,
//       limit = 10,
//       status,
//       airline,
//       available,
//       sortBy = 'name',
//       sortOrder = 'asc'
//     } = req.query;

//     const query = {};

//     if (status) query.status = status;
//     if (airline) query.airline = { $regex: airline, $options: 'i' };
//     if (available !== undefined) query.isAvailable = available === 'true';

//     const sortOptions = {};
//     sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

//     const planes = await Plane.find(query)
//       .sort(sortOptions)
//       .limit(limit * 1)
//       .skip((page - 1) * limit)
//       .exec();

//     const total = await Plane.countDocuments(query);

//     res.status(200).json({
//       success: true,
//       count: planes.length,
//       data: planes,
//       pagination: {
//         currentPage: page * 1,
//         totalPages: Math.ceil(total / limit),
//         totalItems: total,
//         itemsPerPage: limit * 1
//       }
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching planes',
//       error: error.message
//     });
//   }
// };

// // Get single plane
// exports.getPlane = async (req, res) => {
//   try {
//     const plane = await Plane.findById(req.params.id);

//     if (!plane) {
//       return res.status(404).json({
//         success: false,
//         message: 'Plane not found'
//       });
//     }

//     res.status(200).json({
//       success: true,
//       data: plane
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching plane',
//       error: error.message
//     });
//   }
// };

// // Create plane
// exports.createPlane = async (req, res) => {
//   try {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({
//         success: false,
//         errors: errors.array()
//       });
//     }

//     const planeData = req.body;

//     // Check if registration number already exists
//     const existingPlane = await Plane.findOne({
//       registrationNumber: planeData.registrationNumber?.toUpperCase()
//     });

//     if (existingPlane) {
//       return res.status(400).json({
//         success: false,
//         message: 'A plane with this registration number already exists'
//       });
//     }

//     // Ensure registration number is uppercase
//     if (planeData.registrationNumber) {
//       planeData.registrationNumber = planeData.registrationNumber.toUpperCase();
//     }

//     const plane = new Plane(planeData);
//     await plane.save();

//     res.status(201).json({
//       success: true,
//       message: 'Plane created successfully',
//       data: plane
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error creating plane',
//       error: error.message
//     });
//   }
// };

// // Update plane
// exports.updatePlane = async (req, res) => {
//   try {
//     const plane = await Plane.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true, runValidators: true }
//     );

//     if (!plane) {
//       return res.status(404).json({
//         success: false,
//         message: 'Plane not found'
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: 'Plane updated successfully',
//       data: plane
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error updating plane',
//       error: error.message
//     });
//   }
// };

// // Delete plane
// exports.deletePlane = async (req, res) => {
//   try {
//     const plane = await Plane.findById(req.params.id);

//     if (!plane) {
//       return res.status(404).json({
//         success: false,
//         message: 'Plane not found'
//       });
//     }

//     // Delete images from Cloudinary
//     if (plane.images && plane.images.length > 0) {
//       for (const image of plane.images) {
//         try {
//           await cloudinary.uploader.destroy(image.publicId);
//         } catch (cloudinaryError) {
//           console.error('Error deleting image from Cloudinary:', cloudinaryError);
//         }
//       }
//     }

//     await Plane.findByIdAndDelete(req.params.id);

//     res.status(200).json({
//       success: true,
//       message: 'Plane deleted successfully'
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error deleting plane',
//       error: error.message
//     });
//   }
// };

// // Upload plane image (separate endpoint)
// exports.uploadPlaneImage = async (req, res) => {
//   try {
//     // Handle single image upload
//     upload.single('image')(req, res, async (err) => {
//       if (err) {
//         return res.status(400).json({
//           success: false,
//           message: err.message
//         });
//       }

//       if (!req.file) {
//         return res.status(400).json({
//           success: false,
//           message: 'No image file provided'
//         });
//       }

//       const plane = await Plane.findById(req.params.id);

//       if (!plane) {
//         // Delete uploaded image if plane doesn't exist
//         await cloudinary.uploader.destroy(req.file.filename);
//         return res.status(404).json({
//           success: false,
//           message: 'Plane not found'
//         });
//       }

//       // Add image to plane
//       const imageData = {
//         url: req.file.path,
//         publicId: req.file.filename,
//         caption: req.body.caption || '',
//         isPrimary: req.body.isPrimary === 'true' || plane.images.length === 0
//       };

//       // If setting as primary, remove primary from other images
//       if (imageData.isPrimary) {
//         plane.images.forEach(img => img.isPrimary = false);
//       }

//       plane.images.push(imageData);
//       await plane.save();

//       res.status(200).json({
//         success: true,
//         message: 'Image uploaded successfully',
//         data: {
//           imageUrl: req.file.path,
//           publicId: req.file.filename,
//           images: plane.images
//         }
//       });
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error uploading image',
//       error: error.message
//     });
//   }
// };

// // Upload multiple plane images
// exports.uploadMultiplePlaneImages = async (req, res) => {
//   try {
//     upload.array('images', 10)(req, res, async (err) => {
//       if (err) {
//         return res.status(400).json({
//           success: false,
//           message: err.message
//         });
//       }

//       if (!req.files || req.files.length === 0) {
//         return res.status(400).json({
//           success: false,
//           message: 'No image files provided'
//         });
//       }

//       const plane = await Plane.findById(req.params.id);

//       if (!plane) {
//         // Delete uploaded images if plane doesn't exist
//         for (const file of req.files) {
//           await cloudinary.uploader.destroy(file.filename);
//         }
//         return res.status(404).json({
//           success: false,
//           message: 'Plane not found'
//         });
//       }

//       const uploadedImages = [];

//       // Add all images to plane
//       for (const file of req.files) {
//         const imageData = {
//           url: file.path,
//           publicId: file.filename,
//           caption: req.body.captions?.[req.files.indexOf(file)] || '',
//           isPrimary: false
//         };

//         plane.images.push(imageData);
//         uploadedImages.push(imageData);
//       }

//       await plane.save();

//       res.status(200).json({
//         success: true,
//         message: `${req.files.length} images uploaded successfully`,
//         data: {
//           uploadedImages,
//           totalImages: plane.images.length
//         }
//       });
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error uploading images',
//       error: error.message
//     });
//   }
// };

// // Delete plane image
// exports.deletePlaneImage = async (req, res) => {
//   try {
//     const { publicId } = req.params;

//     const plane = await Plane.findById(req.params.planeId);

//     if (!plane) {
//       return res.status(404).json({
//         success: false,
//         message: 'Plane not found'
//       });
//     }

//     // Find the image
//     const imageIndex = plane.images.findIndex(img => img.publicId === publicId);

//     if (imageIndex === -1) {
//       return res.status(404).json({
//         success: false,
//         message: 'Image not found'
//       });
//     }

//     // Delete from Cloudinary
//     try {
//       await cloudinary.uploader.destroy(publicId);
//     } catch (cloudinaryError) {
//       console.error('Error deleting image from Cloudinary:', cloudinaryError);
//     }

//     // Remove from plane images array
//     const wasPrimary = plane.images[imageIndex].isPrimary;
//     plane.images.splice(imageIndex, 1);

//     // If we removed the primary image and there are other images, set the first one as primary
//     if (wasPrimary && plane.images.length > 0) {
//       plane.images[0].isPrimary = true;
//     }

//     await plane.save();

//     res.status(200).json({
//       success: true,
//       message: 'Image deleted successfully',
//       data: {
//         images: plane.images
//       }
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error deleting image',
//       error: error.message
//     });
//   }
// };

// // Set primary image
// exports.setPrimaryImage = async (req, res) => {
//   try {
//     const { publicId } = req.body;

//     const plane = await Plane.findById(req.params.id);

//     if (!plane) {
//       return res.status(404).json({
//         success: false,
//         message: 'Plane not found'
//       });
//     }

//     // Find the image
//     const image = plane.images.find(img => img.publicId === publicId);

//     if (!image) {
//       return res.status(404).json({
//         success: false,
//         message: 'Image not found'
//       });
//     }

//     // Remove primary flag from all images
//     plane.images.forEach(img => img.isPrimary = false);

//     // Set the specified image as primary
//     image.isPrimary = true;

//     await plane.save();

//     res.status(200).json({
//       success: true,
//       message: 'Primary image set successfully',
//       data: {
//         primaryImage: image
//       }
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error setting primary image',
//       error: error.message
//     });
//   }
// };

// // Get plane statistics
// exports.getPlaneStatistics = async (req, res) => {
//   try {
//     const statistics = await Plane.getFleetStatistics();

//     // Additional plane statistics
//     const planesByStatus = await Plane.aggregate([
//       {
//         $group: {
//           _id: '$status',
//           count: { $sum: 1 },
//           airlines: { $addToSet: '$airline' }
//         }
//       }
//     ]);

//     const planesByAirline = await Plane.aggregate([
//       {
//         $group: {
//           _id: '$airline',
//           count: { $sum: 1 },
//           models: { $addToSet: '$model' },
//           totalSeats: { $sum: { $add: ['$capacity.economy', '$capacity.business', '$capacity.firstClass'] } }
//         }
//       },
//       { $sort: { count: -1 } }
//     ]);

//     const maintenanceDue = await Plane.find({
//       'maintenance.nextCheck': { $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) } // Next 7 days
//     }).select('name model registrationNumber maintenance.nextCheck');

//     res.status(200).json({
//       success: true,
//       data: {
//         ...statistics,
//         planesByStatus,
//         planesByAirline,
//         maintenanceDue,
//         generatedAt: new Date()
//       }
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching plane statistics',
//       error: error.message
//     });
//   }
// };

// // Search planes
// exports.searchPlanes = async (req, res) => {
//   try {
//     const { query } = req.query;

//     if (!query) {
//       return res.status(400).json({
//         success: false,
//         message: 'Search query is required'
//       });
//     }

//     const planes = await Plane.find({
//       $or: [
//         { name: { $regex: query, $options: 'i' } },
//         { model: { $regex: query, $options: 'i' } },
//         { airline: { $regex: query, $options: 'i' } },
//         { registrationNumber: { $regex: query, $options: 'i' } }
//       ]
//     })
//     .limit(20)
//     .sort({ name: 1 });

//     res.status(200).json({
//       success: true,
//       data: planes,
//       count: planes.length
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error searching planes',
//       error: error.message
//     });
//   }
// };

// // Get available planes
// exports.getAvailablePlanes = async (req, res) => {
//   try {
//     const planes = await Plane.find({
//       isAvailable: true,
//       status: 'active'
//     })
//     .sort({ name: 1 })
//     .select('name model airline registrationNumber capacity images');

//     res.status(200).json({
//       success: true,
//       data: planes,
//       count: planes.length
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching available planes',
//       error: error.message
//     });
//   }
// };

// // Update plane status
// exports.updatePlaneStatus = async (req, res) => {
//   try {
//     const { status } = req.body;

//     const allowedStatuses = ['active', 'inactive', 'under_maintenance', 'retired'];

//     if (!allowedStatuses.includes(status)) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid status value'
//       });
//     }

//     const plane = await Plane.findByIdAndUpdate(
//       req.params.id,
//       {
//         status,
//         isAvailable: status === 'active'
//       },
//       { new: true, runValidators: true }
//     );

//     if (!plane) {
//       return res.status(404).json({
//         success: false,
//         message: 'Plane not found'
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: 'Plane status updated successfully',
//       data: plane
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error updating plane status',
//       error: error.message
//     });
//   }
// };

// // Add maintenance log
// exports.addMaintenanceLog = async (req, res) => {
//   try {
//     const { type, description, hours, performedBy } = req.body;

//     const plane = await Plane.findById(req.params.id);

//     if (!plane) {
//       return res.status(404).json({
//         success: false,
//         message: 'Plane not found'
//       });
//     }

//     // Add maintenance log using instance method
//     await plane.addMaintenanceLog({
//       type,
//       description,
//       hours: parseFloat(hours) || 0,
//       performedBy
//     });

//     res.status(200).json({
//       success: true,
//       message: 'Maintenance log added successfully',
//       data: {
//         maintenance: plane.maintenance
//       }
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error adding maintenance log',
//       error: error.message
//     });
//   }
// };

// // Update plane flight hours
// exports.updateFlightHours = async (req, res) => {
//   try {
//     const { additionalHours } = req.body;

//     if (!additionalHours || additionalHours <= 0) {
//       return res.status(400).json({
//         success: false,
//         message: 'Valid additional hours required'
//       });
//     }

//     const plane = await Plane.findById(req.params.id);

//     if (!plane) {
//       return res.status(404).json({
//         success: false,
//         message: 'Plane not found'
//       });
//     }

//     // Update flight hours using instance method
//     await plane.updateFlightHours(parseFloat(additionalHours));

//     res.status(200).json({
//       success: true,
//       message: 'Flight hours updated successfully',
//       data: {
//         flightHours: plane.flightHours
//       }
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error updating flight hours',
//       error: error.message
//     });
//   }
// };

// controllers/bookingPlaneController.js
const { AirportBooking } = require("../models/AirportBooking");
const { Plane } = require("../models/AirportBooking"); // Fixed import
const { validationResult } = require("express-validator");
const cloudinary = require("cloudinary").v2;
const nodemailer = require("nodemailer");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// =========================
// CLOUDINARY CONFIGURATION
// =========================
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cloudinary storage for multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "airport-service",
    allowed_formats: ["jpg", "jpeg", "png", "gif", "webp"],
    transformation: [{ width: 1200, height: 800, crop: "limit" }],
    public_id: (req, file) => {
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 8);
      return `plane_${timestamp}_${randomString}`;
    },
  },
});

// Multer configuration
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
});

// =========================
// EMAIL SERVICE CONFIGURATION
// =========================
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: process.env.SMTP_PORT || 587,
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Email templates
const emailTemplates = {
  bookingConfirmation: (booking) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Booking Confirmation - ${booking.bookingReference}</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #007bff; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .booking-details { background: white; padding: 15px; border-radius: 5px; margin: 15px 0; }
        .detail-row { display: flex; justify-content: space-between; margin: 8px 0; }
        .detail-label { font-weight: bold; color: #555; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        .status-badge { 
          display: inline-block; 
          padding: 5px 10px; 
          border-radius: 15px; 
          font-size: 12px; 
          font-weight: bold; 
        }
        .status-confirmed { background: #d4edda; color: #155724; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Booking Confirmation</h1>
          <p>Reference: ${booking.bookingReference}</p>
        </div>
        
        <div class="content">
          <p>Dear ${booking.firstName} ${booking.lastName},</p>
          <p>Thank you for booking our airport service. Your booking has been confirmed.</p>
          
          <div class="booking-details">
            <h3>Booking Details</h3>
            <div class="detail-row">
              <span class="detail-label">Booking Reference:</span>
              <span>${booking.bookingReference}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Service Type:</span>
              <span>${booking.serviceType}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Number of Passengers:</span>
              <span>${booking.numberOfPassengers}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Flight Number:</span>
              <span>${booking.flightNumber}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Airline:</span>
              <span>${booking.airline}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Arrival:</span>
              <span>${booking.arrivalDate.toISOString().split("T")[0]} at ${
    booking.arrivalTime
  }</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Departure:</span>
              <span>${booking.departureDate.toISOString().split("T")[0]} at ${
    booking.departureTime
  }</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Total Amount:</span>
              <span>${booking.currency} ${booking.totalAmount}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Status:</span>
              <span class="status-badge status-confirmed">${
                booking.status
              }</span>
            </div>
          </div>
          
          <p>We look forward to serving you at the airport. If you have any questions, please contact us.</p>
          
          <p>Best regards,<br>Airport Services Team</p>
        </div>
        
        <div class="footer">
          <p>This is an automated message. Please do not reply to this email.</p>
          <p>© ${new Date().getFullYear()} Airport Services. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `,

  statusUpdate: (booking, status) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Booking Status Update - ${booking.bookingReference}</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #17a2b8; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .status-update { background: white; padding: 15px; border-radius: 5px; margin: 15px 0; }
        .detail-row { display: flex; justify-content: space-between; margin: 8px 0; }
        .detail-label { font-weight: bold; color: #555; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        .status-badge { 
          display: inline-block; 
          padding: 5px 10px; 
          border-radius: 15px; 
          font-size: 12px; 
          font-weight: bold; 
        }
        .status-${status} { 
          background: ${
            status === "confirmed"
              ? "#d4edda"
              : status === "cancelled"
              ? "#f8d7da"
              : status === "completed"
              ? "#cce5ff"
              : "#fff3cd"
          }; 
          color: ${
            status === "confirmed"
              ? "#155724"
              : status === "cancelled"
              ? "#721c24"
              : status === "completed"
              ? "#004085"
              : "#856404"
          }; 
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Booking Status Update</h1>
          <p>Reference: ${booking.bookingReference}</p>
        </div>
        
        <div class="content">
          <p>Dear ${booking.firstName} ${booking.lastName},</p>
          <p>The status of your booking has been updated.</p>
          
          <div class="status-update">
            <h3>Updated Status</h3>
            <div class="detail-row">
              <span class="detail-label">Booking Reference:</span>
              <span>${booking.bookingReference}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">New Status:</span>
              <span class="status-badge status-${status}">${status.toUpperCase()}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Updated On:</span>
              <span>${new Date().toLocaleDateString()}</span>
            </div>
          </div>
          
          <p>Please log in to your account to view complete details.</p>
          
          <p>Best regards,<br>Airport Services Team</p>
        </div>
        
        <div class="footer">
          <p>This is an automated message. Please do not reply to this email.</p>
          <p>© ${new Date().getFullYear()} Airport Services. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `,

  cancellation: (booking) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Booking Cancellation - ${booking.bookingReference}</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #dc3545; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .cancellation-details { background: white; padding: 15px; border-radius: 5px; margin: 15px 0; }
        .detail-row { display: flex; justify-content: space-between; margin: 8px 0; }
        .detail-label { font-weight: bold; color: #555; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        .refund-info { background: #fff3cd; padding: 15px; border-radius: 5px; margin: 15px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Booking Cancellation</h1>
          <p>Reference: ${booking.bookingReference}</p>
        </div>
        
        <div class="content">
          <p>Dear ${booking.firstName} ${booking.lastName},</p>
          <p>Your booking has been cancelled as requested.</p>
          
          <div class="cancellation-details">
            <h3>Cancelled Booking Details</h3>
            <div class="detail-row">
              <span class="detail-label">Booking Reference:</span>
              <span>${booking.bookingReference}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Service Type:</span>
              <span>${booking.serviceType}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Number of Passengers:</span>
              <span>${booking.numberOfPassengers}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Total Amount:</span>
              <span>${booking.currency} ${booking.totalAmount}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Cancellation Date:</span>
              <span>${new Date().toLocaleDateString()}</span>
            </div>
          </div>
          
          <div class="refund-info">
            <h4>Refund Information</h4>
            <p>Your refund will be processed within 7-10 business days. The refund amount will be credited to your original payment method.</p>
            <p>If you have any questions about the refund process, please contact our customer support.</p>
          </div>
          
          <p>We hope to serve you again in the future.</p>
          
          <p>Best regards,<br>Airport Services Team</p>
        </div>
        
        <div class="footer">
          <p>This is an automated message. Please do not reply to this email.</p>
          <p>© ${new Date().getFullYear()} Airport Services. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `,

  reminder: (booking) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Booking Reminder - ${booking.bookingReference}</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #ffc107; color: #333; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .reminder-details { background: white; padding: 15px; border-radius: 5px; margin: 15px 0; }
        .detail-row { display: flex; justify-content: space-between; margin: 8px 0; }
        .detail-label { font-weight: bold; color: #555; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        .important-note { background: #fff3cd; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #ffc107; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Booking Reminder</h1>
          <p>Your airport service is coming up soon!</p>
        </div>
        
        <div class="content">
          <p>Dear ${booking.firstName} ${booking.lastName},</p>
          <p>This is a friendly reminder about your upcoming airport service booking.</p>
          
          <div class="reminder-details">
            <h3>Booking Details</h3>
            <div class="detail-row">
              <span class="detail-label">Booking Reference:</span>
              <span>${booking.bookingReference}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Arrival Date & Time:</span>
              <span>${booking.arrivalDate.toISOString().split("T")[0]} at ${
    booking.arrivalTime
  }</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Departure Date & Time:</span>
              <span>${booking.departureDate.toISOString().split("T")[0]} at ${
    booking.departureTime
  }</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Airport Terminal:</span>
              <span>${booking.terminal}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Number of Passengers:</span>
              <span>${booking.numberOfPassengers}</span>
            </div>
          </div>
          
          <div class="important-note">
            <h4>Important Information</h4>
            <p>• Please arrive at the airport at least 30 minutes before your scheduled service time.</p>
            <p>• Bring valid identification documents for all passengers.</p>
            <p>• Have your booking reference ready when you arrive.</p>
            ${
              booking.specialRequirements
                ? `<p>• Special Requirements: ${booking.specialRequirements}</p>`
                : ""
            }
          </div>
          
          <p>We look forward to serving you at the airport!</p>
          
          <p>Best regards,<br>Airport Services Team</p>
        </div>
        
        <div class="footer">
          <p>This is an automated reminder. Please do not reply to this email.</p>
          <p>© ${new Date().getFullYear()} Airport Services. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `,
};

// Email sending function
const sendEmail = async (to, subject, html) => {
  try {
    const mailOptions = {
      from: `"Airport Services" <${
        process.env.EMAIL_FROM || "noreply@airportservices.com"
      }>`,
      to,
      subject,
      html,
      text: html.replace(/<[^>]*>/g, ""), // Fallback text version
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("Email sending failed:", error);
    throw error;
  }
};

// =========================
// BOOKING CONTROLLERS
// =========================

// Get all bookings
exports.getAllBookings = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      serviceType,
      startDate,
      endDate,
      sortBy = "createdAt",
      sortOrder = "desc",
      search,
    } = req.query;

    const query = {};

    if (status) query.status = status;
    if (serviceType) query.serviceType = serviceType;

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    if (search) {
      query.$or = [
        { bookingReference: { $regex: search, $options: "i" } },
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { flightNumber: { $regex: search, $options: "i" } },
        { airline: { $regex: search, $options: "i" } },
      ];
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;

    const bookings = await AirportBooking.find(query)
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate("plane", "registrationNumber model airline images")
      .exec();

    const total = await AirportBooking.countDocuments(query);

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
      pagination: {
        currentPage: page * 1,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit * 1,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching bookings",
      error: error.message,
    });
  }
};

// Get single booking
exports.getBooking = async (req, res) => {
  try {
    const booking = await AirportBooking.findById(req.params.id).populate(
      "plane",
      "registrationNumber model airline images"
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching booking",
      error: error.message,
    });
  }
};

// Create booking
exports.createBooking = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const bookingData = req.body;

    // Check if plane exists
    if (bookingData.plane) {
      const plane = await Plane.findById(bookingData.plane);
      if (!plane) {
        return res.status(404).json({
          success: false,
          message: "Plane not found",
        });
      }
    }

    // Calculate total amount
    const basePrices = {
      standard: 50,
      vip_service: 150,
      executive: 100,
      family: 75,
      group: 40,
    };

    const basePrice = basePrices[bookingData.serviceType] || 50;
    const totalAmount = basePrice * bookingData.numberOfPassengers;

    // Add bag charges if applicable
    const bagCharge = (bookingData.numberOfBags || 0) * 10;

    const booking = new AirportBooking({
      ...bookingData,
      totalAmount: totalAmount + bagCharge,
      statistics: {
        totalRevenue: totalAmount + bagCharge,
      },
    });

    await booking.save();

    // Send confirmation email
    try {
      await sendEmail(
        booking.email,
        `Booking Confirmation - ${booking.bookingReference}`,
        emailTemplates.bookingConfirmation(booking)
      );
      await booking.incrementEmailCount();
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
    }

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating booking",
      error: error.message,
    });
  }
};

// Update booking
exports.updateBooking = async (req, res) => {
  try {
    const booking = await AirportBooking.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate("plane", "registrationNumber model airline");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Booking updated successfully",
      data: booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating booking",
      error: error.message,
    });
  }
};

// Delete booking
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await AirportBooking.findByIdAndDelete(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Booking deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting booking",
      error: error.message,
    });
  }
};

// Get statistics
exports.getStatistics = async (req, res) => {
  try {
    const { period = "all" } = req.query;

    const statistics = await AirportBooking.getStatistics();

    // Additional custom statistics
    const today = new Date();
    const startOfToday = new Date(today.setHours(0, 0, 0, 0));

    const todayStats = await AirportBooking.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfToday },
        },
      },
      {
        $group: {
          _id: null,
          bookingsToday: { $sum: 1 },
          revenueToday: { $sum: "$totalAmount" },
        },
      },
    ]);

    const upcomingBookings = await AirportBooking.find({
      arrivalDate: { $gte: new Date() },
      status: { $in: ["pending", "confirmed"] },
    })
      .sort({ arrivalDate: 1 })
      .limit(10)
      .select(
        "bookingReference firstName lastName arrivalDate arrivalTime status"
      )
      .populate("plane", "registrationNumber model");

    res.status(200).json({
      success: true,
      data: {
        ...statistics,
        todayStats: todayStats[0] || { bookingsToday: 0, revenueToday: 0 },
        upcomingBookings,
        generatedAt: new Date(),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching statistics",
      error: error.message,
    });
  }
};

// Send email to booking
exports.sendEmailToBooking = async (req, res) => {
  try {
    const { bookingId, emailType, customMessage } = req.body;

    const booking = await AirportBooking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    let emailHtml;
    let subject;

    switch (emailType) {
      case "confirmation":
        emailHtml = emailTemplates.bookingConfirmation(booking);
        subject = `Booking Confirmation - ${booking.bookingReference}`;
        break;
      case "reminder":
        emailHtml = emailTemplates.reminder(booking);
        subject = `Reminder: Your Airport Service Booking - ${booking.bookingReference}`;
        break;
      case "cancellation":
        emailHtml = emailTemplates.cancellation(booking);
        subject = `Booking Cancellation - ${booking.bookingReference}`;
        break;
      case "update":
        emailHtml = emailTemplates.statusUpdate(booking, booking.status);
        subject = `Booking Update - ${booking.bookingReference}`;
        break;
      default:
        return res.status(400).json({
          success: false,
          message: "Invalid email type",
        });
    }

    // Send email
    const emailResult = await sendEmail(booking.email, subject, emailHtml);

    // Increment email count
    await booking.incrementEmailCount();

    res.status(200).json({
      success: true,
      message: "Email sent successfully",
      data: {
        emailResult,
        emailCount: booking.statistics.emailsSent,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error sending email",
      error: error.message,
    });
  }
};

// Update booking status
exports.updateStatus = async (req, res) => {
  try {
    const { status, cancellationReason } = req.body;

    const updateData = { status };
    if (cancellationReason) {
      updateData.cancellationReason = cancellationReason;
    }

    const booking = await AirportBooking.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate("plane", "registrationNumber model airline");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Send status update email
    try {
      await sendEmail(
        booking.email,
        `Booking Status Updated - ${booking.bookingReference}`,
        emailTemplates.statusUpdate(booking, status)
      );
      await booking.incrementEmailCount();
    } catch (emailError) {
      console.error("Status email failed:", emailError);
    }

    res.status(200).json({
      success: true,
      message: "Status updated successfully",
      data: booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating status",
      error: error.message,
    });
  }
};

// Search bookings
exports.searchBookings = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    const bookings = await AirportBooking.find({
      $or: [
        { bookingReference: { $regex: query, $options: "i" } },
        { firstName: { $regex: query, $options: "i" } },
        { lastName: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
        { flightNumber: { $regex: query, $options: "i" } },
        { airline: { $regex: query, $options: "i" } },
        { phone: { $regex: query, $options: "i" } },
      ],
    })
      .limit(20)
      .populate("plane", "registrationNumber model airline")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: bookings,
      count: bookings.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error searching bookings",
      error: error.message,
    });
  }
};

// Get bookings by email
exports.getBookingsByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    const bookings = await AirportBooking.find({ email: email.toLowerCase() })
      .sort({ createdAt: -1 })
      .populate("plane", "registrationNumber model airline images");

    res.status(200).json({
      success: true,
      data: bookings,
      count: bookings.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching bookings",
      error: error.message,
    });
  }
};

// Cancel booking
exports.cancelBooking = async (req, res) => {
  try {
    const { cancellationReason } = req.body;

    const booking = await AirportBooking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    booking.status = "cancelled";
    if (cancellationReason) {
      booking.cancellationReason = cancellationReason;
    }
    await booking.save();

    // Send cancellation email
    try {
      await sendEmail(
        booking.email,
        `Booking Cancelled - ${booking.bookingReference}`,
        emailTemplates.cancellation(booking)
      );
      await booking.incrementEmailCount();
    } catch (emailError) {
      console.error("Cancellation email failed:", emailError);
    }

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      data: booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error cancelling booking",
      error: error.message,
    });
  }
};

// Get dashboard statistics
exports.getDashboardStats = async (req, res) => {
  try {
    const [bookingsStats, planesStats, revenueStats] = await Promise.all([
      // Bookings statistics
      AirportBooking.aggregate([
        {
          $group: {
            _id: null,
            totalBookings: { $sum: 1 },
            activeBookings: {
              $sum: {
                $cond: [{ $in: ["$status", ["pending", "confirmed"]] }, 1, 0],
              },
            },
            todayBookings: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      {
                        $gte: [
                          "$createdAt",
                          new Date(new Date().setHours(0, 0, 0, 0)),
                        ],
                      },
                      {
                        $lte: [
                          "$createdAt",
                          new Date(new Date().setHours(23, 59, 59, 999)),
                        ],
                      },
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
          },
        },
      ]),

      // Planes statistics
      Plane.aggregate([
        {
          $group: {
            _id: null,
            totalPlanes: { $sum: 1 },
            activePlanes: {
              $sum: { $cond: [{ $eq: ["$status", "active"] }, 1, 0] },
            },
            availablePlanes: {
              $sum: { $cond: [{ $eq: ["$isAvailable", true] }, 1, 0] },
            },
          },
        },
      ]),

      // Revenue statistics
      AirportBooking.aggregate([
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$totalAmount" },
            todayRevenue: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      {
                        $gte: [
                          "$createdAt",
                          new Date(new Date().setHours(0, 0, 0, 0)),
                        ],
                      },
                      {
                        $lte: [
                          "$createdAt",
                          new Date(new Date().setHours(23, 59, 59, 999)),
                        ],
                      },
                    ],
                  },
                  "$totalAmount",
                  0,
                ],
              },
            },
            monthlyRevenue: {
              $sum: {
                $cond: [
                  {
                    $gte: [
                      "$createdAt",
                      new Date(
                        new Date().getFullYear(),
                        new Date().getMonth(),
                        1
                      ),
                    ],
                  },
                  "$totalAmount",
                  0,
                ],
              },
            },
          },
        },
      ]),
    ]);

    // Recent bookings
    const recentBookings = await AirportBooking.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("plane", "registrationNumber model")
      .select(
        "bookingReference firstName lastName status totalAmount createdAt"
      );

    // Recent planes
    const recentPlanes = await Plane.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("registrationNumber model airline status createdAt");

    res.status(200).json({
      success: true,
      data: {
        bookings: bookingsStats[0] || {
          totalBookings: 0,
          activeBookings: 0,
          todayBookings: 0,
        },
        planes: planesStats[0] || {
          totalPlanes: 0,
          activePlanes: 0,
          availablePlanes: 0,
        },
        revenue: revenueStats[0] || {
          totalRevenue: 0,
          todayRevenue: 0,
          monthlyRevenue: 0,
        },
        recentBookings,
        recentPlanes,
        generatedAt: new Date(),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching dashboard statistics",
      error: error.message,
    });
  }
};

// =========================
// PLANE CONTROLLERS
// =========================

// Get all planes
exports.getAllPlanes = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      airline,
      available,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const query = {};

    if (status) query.status = status;
    if (airline) query.airline = { $regex: airline, $options: "i" };
    if (available !== undefined) query.isAvailable = available === "true";

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;

    const planes = await Plane.find(query)
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Plane.countDocuments(query);

    res.status(200).json({
      success: true,
      count: planes.length,
      data: planes,
      pagination: {
        currentPage: page * 1,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit * 1,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching planes",
      error: error.message,
    });
  }
};

// Get single plane
exports.getPlane = async (req, res) => {
  try {
    const plane = await Plane.findById(req.params.id);

    if (!plane) {
      return res.status(404).json({
        success: false,
        message: "Plane not found",
      });
    }

    res.status(200).json({
      success: true,
      data: plane,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching plane",
      error: error.message,
    });
  }
};

// Create plane
exports.createPlane = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const planeData = req.body;

    // Check if registration number already exists
    const existingPlane = await Plane.findOne({
      registrationNumber: planeData.registrationNumber?.toUpperCase(),
    });

    if (existingPlane) {
      return res.status(400).json({
        success: false,
        message: "A plane with this registration number already exists",
      });
    }

    // Ensure registration number is uppercase
    if (planeData.registrationNumber) {
      planeData.registrationNumber = planeData.registrationNumber.toUpperCase();
    }

    const plane = new Plane(planeData);
    await plane.save();

    res.status(201).json({
      success: true,
      message: "Plane created successfully",
      data: plane,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating plane",
      error: error.message,
    });
  }
};

// Update plane
exports.updatePlane = async (req, res) => {
  try {
    const plane = await Plane.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!plane) {
      return res.status(404).json({
        success: false,
        message: "Plane not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Plane updated successfully",
      data: plane,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating plane",
      error: error.message,
    });
  }
};

// Delete plane
exports.deletePlane = async (req, res) => {
  try {
    const plane = await Plane.findById(req.params.id);

    if (!plane) {
      return res.status(404).json({
        success: false,
        message: "Plane not found",
      });
    }

    // Delete images from Cloudinary
    if (plane.images && plane.images.length > 0) {
      for (const image of plane.images) {
        try {
          await cloudinary.uploader.destroy(image.publicId);
        } catch (cloudinaryError) {
          console.error(
            "Error deleting image from Cloudinary:",
            cloudinaryError
          );
        }
      }
    }

    await Plane.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Plane deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting plane",
      error: error.message,
    });
  }
};

// Upload plane image
exports.uploadPlaneImage = async (req, res) => {
  try {
    // Handle single image upload
    upload.single("image")(req, res, async (err) => {
      if (err) {
        return res.status(400).json({
          success: false,
          message: err.message,
        });
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No image file provided",
        });
      }

      const plane = await Plane.findById(req.params.id);

      if (!plane) {
        // Delete uploaded image if plane doesn't exist
        await cloudinary.uploader.destroy(req.file.filename);
        return res.status(404).json({
          success: false,
          message: "Plane not found",
        });
      }

      // Add image to plane
      const imageData = {
        url: req.file.path,
        publicId: req.file.filename,
        caption: req.body.caption || "",
        isPrimary: req.body.isPrimary === "true" || plane.images.length === 0,
      };

      // If setting as primary, remove primary from other images
      if (imageData.isPrimary) {
        plane.images.forEach((img) => (img.isPrimary = false));
      }

      plane.images.push(imageData);
      await plane.save();

      res.status(200).json({
        success: true,
        message: "Image uploaded successfully",
        data: {
          imageUrl: req.file.path,
          publicId: req.file.filename,
          images: plane.images,
        },
      });
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error uploading image",
      error: error.message,
    });
  }
};

// Upload multiple plane images
exports.uploadMultiplePlaneImages = async (req, res) => {
  try {
    upload.array("images", 10)(req, res, async (err) => {
      if (err) {
        return res.status(400).json({
          success: false,
          message: err.message,
        });
      }

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: "No image files provided",
        });
      }

      const plane = await Plane.findById(req.params.id);

      if (!plane) {
        // Delete uploaded images if plane doesn't exist
        for (const file of req.files) {
          await cloudinary.uploader.destroy(file.filename);
        }
        return res.status(404).json({
          success: false,
          message: "Plane not found",
        });
      }

      const uploadedImages = [];

      // Add all images to plane
      for (const file of req.files) {
        const imageData = {
          url: file.path,
          publicId: file.filename,
          caption: req.body.captions?.[req.files.indexOf(file)] || "",
          isPrimary: false,
        };

        plane.images.push(imageData);
        uploadedImages.push(imageData);
      }

      await plane.save();

      res.status(200).json({
        success: true,
        message: `${req.files.length} images uploaded successfully`,
        data: {
          uploadedImages,
          totalImages: plane.images.length,
        },
      });
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error uploading images",
      error: error.message,
    });
  }
};

// Delete plane image
exports.deletePlaneImage = async (req, res) => {
  try {
    const { publicId } = req.params;
    const { planeId } = req.params;

    const plane = await Plane.findById(planeId);

    if (!plane) {
      return res.status(404).json({
        success: false,
        message: "Plane not found",
      });
    }

    // Find the image
    const imageIndex = plane.images.findIndex(
      (img) => img.publicId === publicId
    );

    if (imageIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }

    // Delete from Cloudinary
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (cloudinaryError) {
      console.error("Error deleting image from Cloudinary:", cloudinaryError);
    }

    // Remove from plane images array
    const wasPrimary = plane.images[imageIndex].isPrimary;
    plane.images.splice(imageIndex, 1);

    // If we removed the primary image and there are other images, set the first one as primary
    if (wasPrimary && plane.images.length > 0) {
      plane.images[0].isPrimary = true;
    }

    await plane.save();

    res.status(200).json({
      success: true,
      message: "Image deleted successfully",
      data: {
        images: plane.images,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting image",
      error: error.message,
    });
  }
};

// Set primary image
exports.setPrimaryImage = async (req, res) => {
  try {
    const { publicId } = req.body;

    const plane = await Plane.findById(req.params.id);

    if (!plane) {
      return res.status(404).json({
        success: false,
        message: "Plane not found",
      });
    }

    // Find the image
    const image = plane.images.find((img) => img.publicId === publicId);

    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }

    // Remove primary flag from all images
    plane.images.forEach((img) => (img.isPrimary = false));

    // Set the specified image as primary
    image.isPrimary = true;

    await plane.save();

    res.status(200).json({
      success: true,
      message: "Primary image set successfully",
      data: {
        primaryImage: image,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error setting primary image",
      error: error.message,
    });
  }
};

// Search planes
exports.searchPlanes = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    const planes = await Plane.find({
      $or: [
        { model: { $regex: query, $options: "i" } },
        { airline: { $regex: query, $options: "i" } },
        { registrationNumber: { $regex: query, $options: "i" } },
        { manufacturer: { $regex: query, $options: "i" } },
      ],
    })
      .limit(20)
      .sort({ registrationNumber: 1 });

    res.status(200).json({
      success: true,
      data: planes,
      count: planes.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error searching planes",
      error: error.message,
    });
  }
};

// Get available planes
exports.getAvailablePlanes = async (req, res) => {
  try {
    const planes = await Plane.find({
      isAvailable: true,
      status: "active",
    })
      .sort({ registrationNumber: 1 })
      .select("registrationNumber model airline capacity images");

    res.status(200).json({
      success: true,
      data: planes,
      count: planes.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching available planes",
      error: error.message,
    });
  }
};

// Update plane status
exports.updatePlaneStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = ["active", "maintenance", "retired", "grounded"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const plane = await Plane.findByIdAndUpdate(
      req.params.id,
      {
        status,
        isAvailable: status === "active",
      },
      { new: true, runValidators: true }
    );

    if (!plane) {
      return res.status(404).json({
        success: false,
        message: "Plane not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Plane status updated successfully",
      data: plane,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating plane status",
      error: error.message,
    });
  }
};
