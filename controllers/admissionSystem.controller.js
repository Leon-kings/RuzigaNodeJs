

// const mongoose = require("mongoose");
// const cloudinary = require("../cloudinary/cloudinary");
// const { University, Booking } = require("../models/AdmissionSystem");
// const streamifier = require("streamifier");
// const nodemailer = require("nodemailer");

// /* ===================== EMAIL TRANSPORTER ===================== */
// const createTransporter = () => {
//   return nodemailer.createTransport({
//     host: process.env.SMTP_HOST,
//     port: parseInt(process.env.SMTP_PORT),
//     secure: false,
//     auth: {
//       user: process.env.SMTP_USER,
//       pass: process.env.SMTP_PASS,
//     },
//     tls: {
//       rejectUnauthorized: false
//     }
//   });
// };

// /* ===================== EMAIL SERVICE ===================== */
// const emailService = {
//   sendEmail: async (to, subject, html, isAdminNotification = false) => {
//     // Skip emails if SKIP_EMAILS is true (for development)
//     if (process.env.SKIP_EMAILS === 'true' && !isAdminNotification) {
//       console.log('Email sending skipped (SKIP_EMAILS=true)');
//       return { success: true, skipped: true };
//     }

//     try {
//       const transporter = createTransporter();
      
//       const info = await transporter.sendMail({
//         from: `"${process.env.COMPANY_NAME || 'REC APPLY'} Admissions" <${process.env.EMAIL_FROM}>`,
//         to,
//         subject,
//         html
//       });
      
//       console.log('Email sent successfully to:', to, 'Message ID:', info.messageId);
//       return { success: true, messageId: info.messageId };
//     } catch (error) {
//       console.error('Email sending error:', error);
      
//       if (process.env.NODE_ENV === 'development') {
//         console.log('Email failed but continuing in development mode');
//         return { success: false, error: error.message, skipped: true };
//       }
      
//       return { success: false, error: error.message };
//     }
//   },

//   sendBookingConfirmation: async (bookingData, customerEmail, customerName) => {
//     const subject = `Booking Confirmed - ${bookingData.bookingReference || 'New Booking'}`;
    
//     const html = `
//       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f4f4; padding: 20px;">
//         <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
//           <h1 style="color: white; margin: 0; font-size: 28px;">${process.env.COMPANY_NAME || 'REC APPLY'}</h1>
//           <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">University Admission Booking</p>
//         </div>
        
//         <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
//           <h2 style="color: #333; margin-top: 0; border-bottom: 2px solid #f0f0f0; padding-bottom: 15px;">
//             Thank You for Your Booking! 🎓
//           </h2>
          
//           <p style="font-size: 16px; line-height: 1.6; color: #555;">Dear ${customerName || 'Student'},</p>
          
//           <p style="font-size: 16px; line-height: 1.6; color: #555;">Your university admission consultation booking has been confirmed. Here are your booking details:</p>
          
//           <div style="background-color: #f0f7ff; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #667eea;">
//             <h3 style="margin-top: 0; color: #667eea; font-size: 20px;">Booking Reference: ${bookingData.bookingReference || 'N/A'}</h3>
            
//             <table style="width: 100%; border-collapse: collapse;">
//               ${bookingData.universityName ? `
//                 <tr>
//                   <td style="padding: 8px 0; color: #666;"><strong>University:</strong></td>
//                   <td style="padding: 8px 0; color: #333;">${bookingData.universityName}</td>
//                 </tr>
//               ` : ''}
//               ${bookingData.program ? `
//                 <tr>
//                   <td style="padding: 8px 0; color: #666;"><strong>Program:</strong></td>
//                   <td style="padding: 8px 0; color: #333;">${bookingData.program}</td>
//                 </tr>
//               ` : ''}
//               ${bookingData.consultationDate ? `
//                 <tr>
//                   <td style="padding: 8px 0; color: #666;"><strong>Consultation Date:</strong></td>
//                   <td style="padding: 8px 0; color: #333;">${new Date(bookingData.consultationDate).toLocaleDateString()}</td>
//                 </tr>
//               ` : ''}
//               ${bookingData.timeSlot ? `
//                 <tr>
//                   <td style="padding: 8px 0; color: #666;"><strong>Time Slot:</strong></td>
//                   <td style="padding: 8px 0; color: #333;">${bookingData.timeSlot}</td>
//                 </tr>
//               ` : ''}
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Status:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">
//                   <span style="background-color: ${bookingData.status === 'confirmed' ? '#4CAF50' : '#FFC107'}; color: ${bookingData.status === 'confirmed' ? 'white' : '#333'}; padding: 3px 10px; border-radius: 12px; font-size: 12px;">
//                     ${bookingData.status || 'Pending'}
//                   </span>
//                 </td>
//               </tr>
//             </table>
            
//             ${bookingData.notes ? `
//               <div style="margin-top: 15px;">
//                 <strong style="color: #666;">Additional Notes:</strong>
//                 <p style="color: #555; font-style: italic; margin: 5px 0 0 0; background-color: white; padding: 10px; border-radius: 5px;">${bookingData.notes}</p>
//               </div>
//             ` : ''}
//           </div>
          
//           <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
//             <h4 style="margin-top: 0; color: #333;">Next Steps</h4>
//             <p style="margin: 5px 0; color: #555;">Our admissions counselor will contact you shortly to discuss your university options and guide you through the application process.</p>
//           </div>
          
//           <hr style="border: none; border-top: 2px solid #f0f0f0; margin: 30px 0;">
          
//           <div style="text-align: center;">
//             <p style="color: #666; font-size: 14px; line-height: 1.6;">
//               Thank you for choosing ${process.env.COMPANY_NAME || 'REC APPLY'} for your educational journey.<br>
//               We're excited to help you achieve your academic goals!
//             </p>
//           </div>
//         </div>
        
//         <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
//           © ${new Date().getFullYear()} ${process.env.COMPANY_NAME || 'REC APPLY'}. All rights reserved.<br>
//           This is an automated message, please do not reply to this email.
//         </div>
//       </div>
//     `;

//     return await this.sendEmail(customerEmail, subject, html);
//   },

//   sendAdminNotification: async (bookingData, customerEmail, customerName) => {
//     const subject = `New University Booking Received - ${bookingData.bookingReference || 'New Booking'}`;
    
//     const html = `
//       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f4f4; padding: 20px;">
//         <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
//           <h1 style="color: white; margin: 0; font-size: 28px;">${process.env.COMPANY_NAME || 'REC APPLY'}</h1>
//           <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Admin Notification - New Booking</p>
//         </div>
        
//         <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
//           <h2 style="color: #333; margin-top: 0; border-bottom: 2px solid #f0f0f0; padding-bottom: 15px;">
//             New University Booking Alert! 🏛️
//           </h2>
          
//           <div style="background-color: #fff3e0; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #f5576c;">
//             <h3 style="margin-top: 0; color: #f5576c; font-size: 20px;">Booking Reference: ${bookingData.bookingReference || 'N/A'}</h3>
            
//             <table style="width: 100%; border-collapse: collapse;">
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Customer Name:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${customerName || 'Not provided'}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Customer Email:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${customerEmail || 'Not provided'}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Customer Phone:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${bookingData.customer?.phone || bookingData.phone || 'Not provided'}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>University:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${bookingData.universityName || 'Not specified'}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Program:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${bookingData.program || 'Not specified'}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Consultation Date:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${bookingData.consultationDate ? new Date(bookingData.consultationDate).toLocaleDateString() : 'Not specified'}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Time Slot:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${bookingData.timeSlot || 'Not specified'}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Booking Date:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${new Date().toLocaleString()}</td>
//               </tr>
//             </table>
            
//             ${bookingData.notes ? `
//               <div style="margin-top: 15px; background-color: #fff9e6; padding: 15px; border-radius: 5px;">
//                 <strong style="color: #666;">Customer Notes:</strong>
//                 <p style="color: #555; margin: 5px 0 0 0;">${bookingData.notes}</p>
//               </div>
//             ` : ''}
//           </div>
          
//           <hr style="border: none; border-top: 2px solid #f0f0f0; margin: 30px 0;">
          
//           <div style="text-align: center;">
//             <p style="color: #666; font-size: 14px; line-height: 1.6;">
//               Please contact the customer to confirm their consultation and provide further guidance.<br>
//               This is an automated admin notification from ${process.env.COMPANY_NAME || 'REC APPLY'}.
//             </p>
//           </div>
//         </div>
        
//         <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
//           © ${new Date().getFullYear()} ${process.env.COMPANY_NAME || 'REC APPLY'}. All rights reserved.
//         </div>
//       </div>
//     `;

//     return await this.sendEmail(process.env.ADMIN_EMAIL, subject, html, true);
//   },

//   sendStatusUpdate: async (bookingData, customerEmail, customerName, oldStatus, newStatus) => {
//     const subject = `Your Booking Status Has Been Updated - ${bookingData.bookingReference}`;
    
//     const html = `
//       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f4f4; padding: 20px;">
//         <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
//           <h1 style="color: white; margin: 0; font-size: 28px;">${process.env.COMPANY_NAME || 'REC APPLY'}</h1>
//           <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Booking Status Update</p>
//         </div>
        
//         <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
//           <h2 style="color: #333; margin-top: 0; border-bottom: 2px solid #f0f0f0; padding-bottom: 15px;">
//             Your Booking Status Has Been Updated
//           </h2>
          
//           <p style="font-size: 16px; line-height: 1.6; color: #555;">Dear ${customerName || 'Student'},</p>
          
//           <p style="font-size: 16px; line-height: 1.6; color: #555;">The status of your university admission booking has been updated:</p>
          
//           <div style="background-color: #f9f9f9; padding: 30px; text-align: center; border-radius: 5px; margin: 20px 0;">
//             <div style="display: inline-block; background-color: #ffebee; padding: 15px 30px; border-radius: 5px; margin-right: 10px;">
//               <span style="color: #f44336; font-weight: bold;">${oldStatus || 'Previous'}</span>
//             </div>
//             <span style="font-size: 24px; color: #999; margin: 0 15px;">→</span>
//             <div style="display: inline-block; background-color: #e8f5e8; padding: 15px 30px; border-radius: 5px;">
//               <span style="color: #4CAF50; font-weight: bold;">${newStatus || 'Current'}</span>
//             </div>
//           </div>
          
//           <div style="background-color: #f0f7ff; padding: 20px; border-radius: 5px; margin: 20px 0;">
//             <h4 style="margin-top: 0; color: #333;">Booking Reference: ${bookingData.bookingReference || 'N/A'}</h4>
//             <p style="margin: 5px 0; color: #555;"><strong>Current Status:</strong> 
//               <span style="background-color: ${newStatus === 'confirmed' ? '#4CAF50' : newStatus === 'cancelled' ? '#f44336' : '#FFC107'}; color: ${newStatus === 'pending' ? '#333' : 'white'}; padding: 3px 10px; border-radius: 12px; font-size: 12px;">
//                 ${newStatus || 'Pending'}
//               </span>
//             </p>
//             <p style="margin: 5px 0; color: #555;"><strong>University:</strong> ${bookingData.universityName || 'Not specified'}</p>
//             <p style="margin: 5px 0; color: #555;"><strong>Consultation Date:</strong> ${bookingData.consultationDate ? new Date(bookingData.consultationDate).toLocaleDateString() : 'Not specified'}</p>
//           </div>
          
//           <hr style="border: none; border-top: 2px solid #f0f0f0; margin: 30px 0;">
          
//           <div style="text-align: center;">
//             <p style="color: #666; font-size: 14px; line-height: 1.6;">
//               If you have any questions, please don't hesitate to contact us.<br>
//               Thank you for choosing ${process.env.COMPANY_NAME || 'REC APPLY'}.
//             </p>
//           </div>
//         </div>
        
//         <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
//           © ${new Date().getFullYear()} ${process.env.COMPANY_NAME || 'REC APPLY'}. All rights reserved.
//         </div>
//       </div>
//     `;

//     return await this.sendEmail(customerEmail, subject, html);
//   }
// };

// /* ===================== CLOUDINARY SERVICE ===================== */
// class CloudinaryService {
//   uploadFromBuffer(buffer, folder = "universities") {
//     return new Promise((resolve, reject) => {
//       const stream = cloudinary.uploader.upload_stream(
//         { folder, quality: "auto" },
//         (err, result) => {
//           if (err) return reject(err);
//           resolve({ public_id: result.public_id, url: result.secure_url });
//         },
//       );
//       streamifier.createReadStream(buffer).pipe(stream);
//     });
//   }

//   async uploadMultiple(files) {
//     const images = [];
//     for (const file of files) {
//       images.push(await this.uploadFromBuffer(file.buffer));
//     }
//     return images;
//   }

//   async deleteMultiple(ids) {
//     for (const id of ids) await cloudinary.uploader.destroy(id);
//   }
// }

// const cloudinaryService = new CloudinaryService();
// const DEFAULT_IMAGE = [
//   {
//     public_id: "default",
//     url: "https://wenr.wes.org/wp-content/uploads/2019/09/iStock-1142918319_WENR_Ranking_740_430.jpg",
//   },
// ];

// /* ===================== UNIVERSITY CRUD ===================== */
// exports.createUniversity = async (req, res) => {
//   try {
//     let images = DEFAULT_IMAGE;

//     if (req.files?.images) {
//       const files = Array.isArray(req.files.images)
//         ? req.files.images
//         : [req.files.images];
//       images = await cloudinaryService.uploadMultiple(files);
//     }

//     const university = await University.create({ ...req.body, images });
//     res.status(201).json({ success: true, data: university });
//   } catch (e) {
//     res.status(500).json({ success: false, message: e.message });
//   }
// };

// exports.getUniversities = async (_, res) => {
//   const data = await University.find();
//   res.json({ success: true, data });
// };

// exports.getUniversity = async (req, res) => {
//   const uni = await University.findById(req.params.id);
//   if (!uni) return res.status(404).json({ success: false });
//   res.json({ success: true, data: uni });
// };

// exports.updateUniversity = async (req, res) => {
//   try {
//     const uni = await University.findById(req.params.id);
//     if (!uni) return res.status(404).json({ success: false });

//     if (req.files?.images) {
//       if (uni.images.length)
//         await cloudinaryService.deleteMultiple(
//           uni.images.map((i) => i.public_id),
//         );

//       const files = Array.isArray(req.files.images)
//         ? req.files.images
//         : [req.files.images];
//       uni.images = await cloudinaryService.uploadMultiple(files);
//     }

//     Object.assign(uni, req.body);
//     await uni.save();

//     res.json({ success: true, data: uni });
//   } catch (e) {
//     res.status(500).json({ success: false, message: e.message });
//   }
// };

// exports.deleteUniversity = async (req, res) => {
//   const uni = await University.findById(req.params.id);
//   if (!uni) return res.status(404).json({ success: false });

//   if (uni.images.length)
//     await cloudinaryService.deleteMultiple(uni.images.map((i) => i.public_id));

//   await uni.deleteOne();
//   res.json({ success: true });
// };

// /* ===================== BOOKING CRUD ===================== */

// // ------------------ CREATE BOOKING ------------------
// exports.createBooking = async (req, res) => {
//   try {
//     // Generate booking reference
//     const bookingRef = 'UNI-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 5).toUpperCase();
    
//     const bookingData = {
//       ...req.body,
//       bookingReference: bookingRef
//     };

//     const booking = await Booking.create(bookingData);

//     // Send email notifications
//     const customerEmail = booking.customer?.email;
//     const customerName = booking.customer?.name || 'Student';

//     if (customerEmail) {
//       Promise.allSettled([
//         emailService.sendBookingConfirmation(bookingData, customerEmail, customerName),
//         emailService.sendAdminNotification(bookingData, customerEmail, customerName)
//       ]).then(results => {
//         console.log('Email notifications sent:', results.map(r => r.status));
//       }).catch(err => {
//         console.error('Error sending notification emails:', err);
//       });
//     }

//     res.status(201).json({
//       success: true,
//       data: booking,
//     });
//   } catch (error) {
//     res.status(400).json({
//       success: false,
//       message: "Failed to create booking",
//       error: error.message,
//     });
//   }
// };

// exports.getBookingsByEmail = async (req, res) => {
//   try {
//     const { email } = req.params;

//     if (!email) {
//       return res.status(400).json({
//         success: false,
//         message: "Email is required",
//       });
//     }

//     // Query nested customer.email
//     const bookings = await Booking.find({
//       "customer.email": { $regex: `^${email.trim()}$`, $options: 'i' }
//     }).sort({ createdAt: -1 });

//     res.status(200).json({
//       success: true,
//       count: bookings.length,
//       data: bookings,
//     });
//   } catch (error) {
//     console.error("Get Bookings By Email Error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch bookings by email",
//       error: error.message,
//     });
//   }
// };

// exports.getBookings = async (_, res) => {
//   try {
//     const bookings = await Booking.find().sort({ createdAt: -1 });
//     res.json({ success: true, data: bookings });
//   } catch (error) {
//     console.error("Get Bookings Error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch bookings",
//       error: error.message,
//     });
//   }
// };

// exports.getBooking = async (req, res) => {
//   const booking = await Booking.findById(req.params.id);
//   if (!booking) return res.status(404).json({ success: false });
//   res.json({ success: true, data: booking });
// };

// /* ===================== EDIT BOOKING ===================== */

// exports.editBooking = async (req, res) => {
//   try {
//     const { bookingId } = req.params;
//     const updates = { ...req.body };

//     const booking = await Booking.findById(bookingId);
//     if (!booking) {
//       return res.status(404).json({
//         success: false,
//         message: "Booking not found",
//       });
//     }

//     // Store old status for email notification
//     const oldStatus = booking.booking?.status;

//     // 🔥 ENSURE NESTED OBJECT EXISTS
//     if (!booking.booking) {
//       booking.booking = {};
//     }

//     // ---------------- NOTES HANDLING ----------------
//     if (updates.notes) {
//       if (typeof updates.notes === "string") {
//         updates.notes = {
//           text: updates.notes,
//           author: "System",
//           date: new Date(),
//         };
//       } else if (typeof updates.notes === "object") {
//         updates.notes.date = updates.notes.date || new Date();
//       }
//     }

//     // ---------------- UPDATE NESTED BOOKING ----------------
//     Object.keys(updates).forEach((key) => {
//       booking.booking[key] = updates[key];
//     });

//     await booking.save();

//     // Send status update email if status changed
//     const newStatus = booking.booking?.status;
//     if (oldStatus && newStatus && oldStatus !== newStatus) {
//       const customerEmail = booking.customer?.email;
//       const customerName = booking.customer?.name || 'Student';

//       if (customerEmail) {
//         emailService.sendStatusUpdate(
//           booking.booking,
//           customerEmail,
//           customerName,
//           oldStatus,
//           newStatus
//         ).catch(err => console.error('Error sending status update email:', err));
//       }
//     }

//     res.json({
//       success: true,
//       data: booking,
//     });
//   } catch (error) {
//     console.error("Edit Booking Error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to update booking",
//       error: error.message,
//     });
//   }
// };

// exports.updateBookingStatus = async (req, res) => {
//   const booking = await Booking.findById(req.params.id);
//   if (!booking) return res.status(404).json({ success: false });

//   const oldStatus = booking.booking?.status;
//   booking.booking.status = req.body.status;
//   await booking.save();

//   // Send status update email
//   const customerEmail = booking.customer?.email;
//   const customerName = booking.customer?.name || 'Student';

//   if (customerEmail) {
//     emailService.sendStatusUpdate(
//       booking.booking,
//       customerEmail,
//       customerName,
//       oldStatus,
//       req.body.status
//     ).catch(err => console.error('Error sending status update email:', err));
//   }

//   res.json({ success: true, data: booking });
// };

// exports.deleteBooking = async (req, res) => {
//   const booking = await Booking.findById(req.params.id);
//   if (!booking) return res.status(404).json({ success: false });

//   await booking.deleteOne();
//   res.json({ success: true });
// };

// /* ===================== DASHBOARD STATS ===================== */
// exports.getDashboardStats = async (_, res) => {
//   const [universities, bookings, pending, confirmed, cancelled] =
//     await Promise.all([
//       University.countDocuments(),
//       Booking.countDocuments(),
//       Booking.countDocuments({ "booking.status": "pending" }),
//       Booking.countDocuments({ "booking.status": "confirmed" }),
//       Booking.countDocuments({ "booking.status": "cancelled" }),
//     ]);

//   res.json({
//     success: true,
//     data: {
//       universities,
//       bookings,
//       status: { pending, confirmed, cancelled },
//     },
//   });
// };















const mongoose = require("mongoose");
const cloudinary = require("../cloudinary/cloudinary");
const { University, Booking } = require("../models/AdmissionSystem");
const streamifier = require("streamifier");
const nodemailer = require("nodemailer");

/* ===================== EMAIL TRANSPORTER ===================== */
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

/* ===================== EMAIL SERVICE ===================== */
const emailService = {
  sendEmail: async (to, subject, html, isAdminNotification = false) => {
    try {
      const transporter = createTransporter();
      
      const info = await transporter.sendMail({
        from: `"${process.env.COMPANY_NAME || 'REC APPLY'} Admissions" <${process.env.EMAIL_FROM}>`,
        to,
        subject,
        html
      });
      
      console.log('Email sent successfully to:', to, 'Message ID:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Email sending error:', error);
      return { success: false, error: error.message };
    }
  },

  sendBookingConfirmation: async (bookingData, customerEmail, customerName) => {
    const subject = `Booking Confirmed - ${bookingData.bookingReference || 'New Booking'}`;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f4f4; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">${process.env.COMPANY_NAME || 'REC APPLY'}</h1>
          <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">University Admission Booking</p>
        </div>
        
        <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-top: 0; border-bottom: 2px solid #f0f0f0; padding-bottom: 15px;">
            Thank You for Your Booking! 🎓
          </h2>
          
          <p style="font-size: 16px; line-height: 1.6; color: #555;">Dear ${customerName || 'Student'},</p>
          
          <p style="font-size: 16px; line-height: 1.6; color: #555;">Your university admission consultation booking has been confirmed. Here are your booking details:</p>
          
          <div style="background-color: #f0f7ff; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #667eea;">
            <h3 style="margin-top: 0; color: #667eea; font-size: 20px;">Booking Reference: ${bookingData.bookingReference || 'N/A'}</h3>
            
            <table style="width: 100%; border-collapse: collapse;">
              ${bookingData.universityName ? `
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>University:</strong></td>
                  <td style="padding: 8px 0; color: #333;">${bookingData.universityName}</td>
                </tr>
              ` : ''}
              ${bookingData.program ? `
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>Program:</strong></td>
                  <td style="padding: 8px 0; color: #333;">${bookingData.program}</td>
                </tr>
              ` : ''}
              ${bookingData.consultationDate ? `
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>Consultation Date:</strong></td>
                  <td style="padding: 8px 0; color: #333;">${new Date(bookingData.consultationDate).toLocaleDateString()}</td>
                </tr>
              ` : ''}
              ${bookingData.timeSlot ? `
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>Time Slot:</strong></td>
                  <td style="padding: 8px 0; color: #333;">${bookingData.timeSlot}</td>
                </tr>
              ` : ''}
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Status:</strong></td>
                <td style="padding: 8px 0; color: #333;">
                  <span style="background-color: ${bookingData.status === 'confirmed' ? '#4CAF50' : '#FFC107'}; color: ${bookingData.status === 'confirmed' ? 'white' : '#333'}; padding: 3px 10px; border-radius: 12px; font-size: 12px;">
                    ${bookingData.status || 'Pending'}
                  </span>
                </td>
              </tr>
            </table>
            
            ${bookingData.notes ? `
              <div style="margin-top: 15px;">
                <strong style="color: #666;">Additional Notes:</strong>
                <p style="color: #555; font-style: italic; margin: 5px 0 0 0; background-color: white; padding: 10px; border-radius: 5px;">${bookingData.notes}</p>
              </div>
            ` : ''}
          </div>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h4 style="margin-top: 0; color: #333;">Next Steps</h4>
            <p style="margin: 5px 0; color: #555;">Our admissions counselor will contact you shortly to discuss your university options and guide you through the application process.</p>
          </div>
          
          <hr style="border: none; border-top: 2px solid #f0f0f0; margin: 30px 0;">
          
          <div style="text-align: center;">
            <p style="color: #666; font-size: 14px; line-height: 1.6;">
              Thank you for choosing ${process.env.COMPANY_NAME || 'REC APPLY'} for your educational journey.<br>
              We're excited to help you achieve your academic goals!
            </p>
          </div>
        </div>
        
        <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
          © ${new Date().getFullYear()} ${process.env.COMPANY_NAME || 'REC APPLY'}. All rights reserved.<br>
          This is an automated message, please do not reply to this email.
        </div>
      </div>
    `;

    return await this.sendEmail(customerEmail, subject, html);
  },

  sendAdminNotification: async (bookingData, customerEmail, customerName) => {
    const subject = `New University Booking Received - ${bookingData.bookingReference || 'New Booking'}`;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f4f4; padding: 20px;">
        <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">${process.env.COMPANY_NAME || 'REC APPLY'}</h1>
          <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Admin Notification - New Booking</p>
        </div>
        
        <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-top: 0; border-bottom: 2px solid #f0f0f0; padding-bottom: 15px;">
            New University Booking Alert! 🏛️
          </h2>
          
          <div style="background-color: #fff3e0; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #f5576c;">
            <h3 style="margin-top: 0; color: #f5576c; font-size: 20px;">Booking Reference: ${bookingData.bookingReference || 'N/A'}</h3>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Customer Name:</strong></td>
                <td style="padding: 8px 0; color: #333;">${customerName || 'Not provided'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Customer Email:</strong></td>
                <td style="padding: 8px 0; color: #333;">${customerEmail || 'Not provided'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Customer Phone:</strong></td>
                <td style="padding: 8px 0; color: #333;">${bookingData.customer?.phone || bookingData.phone || 'Not provided'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>University:</strong></td>
                <td style="padding: 8px 0; color: #333;">${bookingData.universityName || 'Not specified'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Program:</strong></td>
                <td style="padding: 8px 0; color: #333;">${bookingData.program || 'Not specified'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Consultation Date:</strong></td>
                <td style="padding: 8px 0; color: #333;">${bookingData.consultationDate ? new Date(bookingData.consultationDate).toLocaleDateString() : 'Not specified'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Time Slot:</strong></td>
                <td style="padding: 8px 0; color: #333;">${bookingData.timeSlot || 'Not specified'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Booking Date:</strong></td>
                <td style="padding: 8px 0; color: #333;">${new Date().toLocaleString()}</td>
              </tr>
            </table>
            
            ${bookingData.notes ? `
              <div style="margin-top: 15px; background-color: #fff9e6; padding: 15px; border-radius: 5px;">
                <strong style="color: #666;">Customer Notes:</strong>
                <p style="color: #555; margin: 5px 0 0 0;">${bookingData.notes}</p>
              </div>
            ` : ''}
          </div>
          
          <hr style="border: none; border-top: 2px solid #f0f0f0; margin: 30px 0;">
          
          <div style="text-align: center;">
            <p style="color: #666; font-size: 14px; line-height: 1.6;">
              Please contact the customer to confirm their consultation and provide further guidance.<br>
              This is an automated admin notification from ${process.env.COMPANY_NAME || 'REC APPLY'}.
            </p>
          </div>
        </div>
        
        <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
          © ${new Date().getFullYear()} ${process.env.COMPANY_NAME || 'REC APPLY'}. All rights reserved.
        </div>
      </div>
    `;

    return await this.sendEmail(process.env.ADMIN_EMAIL, subject, html);
  },

  sendStatusUpdate: async (bookingData, customerEmail, customerName, oldStatus, newStatus) => {
    const subject = `Your Booking Status Has Been Updated - ${bookingData.bookingReference}`;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f4f4; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">${process.env.COMPANY_NAME || 'REC APPLY'}</h1>
          <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Booking Status Update</p>
        </div>
        
        <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-top: 0; border-bottom: 2px solid #f0f0f0; padding-bottom: 15px;">
            Your Booking Status Has Been Updated
          </h2>
          
          <p style="font-size: 16px; line-height: 1.6; color: #555;">Dear ${customerName || 'Student'},</p>
          
          <p style="font-size: 16px; line-height: 1.6; color: #555;">The status of your university admission booking has been updated:</p>
          
          <div style="background-color: #f9f9f9; padding: 30px; text-align: center; border-radius: 5px; margin: 20px 0;">
            <div style="display: inline-block; background-color: #ffebee; padding: 15px 30px; border-radius: 5px; margin-right: 10px;">
              <span style="color: #f44336; font-weight: bold;">${oldStatus || 'Previous'}</span>
            </div>
            <span style="font-size: 24px; color: #999; margin: 0 15px;">→</span>
            <div style="display: inline-block; background-color: #e8f5e8; padding: 15px 30px; border-radius: 5px;">
              <span style="color: #4CAF50; font-weight: bold;">${newStatus || 'Current'}</span>
            </div>
          </div>
          
          <div style="background-color: #f0f7ff; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h4 style="margin-top: 0; color: #333;">Booking Reference: ${bookingData.bookingReference || 'N/A'}</h4>
            <p style="margin: 5px 0; color: #555;"><strong>Current Status:</strong> 
              <span style="background-color: ${newStatus === 'confirmed' ? '#4CAF50' : newStatus === 'cancelled' ? '#f44336' : '#FFC107'}; color: ${newStatus === 'pending' ? '#333' : 'white'}; padding: 3px 10px; border-radius: 12px; font-size: 12px;">
                ${newStatus || 'Pending'}
              </span>
            </p>
            <p style="margin: 5px 0; color: #555;"><strong>University:</strong> ${bookingData.universityName || 'Not specified'}</p>
            <p style="margin: 5px 0; color: #555;"><strong>Consultation Date:</strong> ${bookingData.consultationDate ? new Date(bookingData.consultationDate).toLocaleDateString() : 'Not specified'}</p>
          </div>
          
          <hr style="border: none; border-top: 2px solid #f0f0f0; margin: 30px 0;">
          
          <div style="text-align: center;">
            <p style="color: #666; font-size: 14px; line-height: 1.6;">
              If you have any questions, please don't hesitate to contact us.<br>
              Thank you for choosing ${process.env.COMPANY_NAME || 'REC APPLY'}.
            </p>
          </div>
        </div>
        
        <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
          © ${new Date().getFullYear()} ${process.env.COMPANY_NAME || 'REC APPLY'}. All rights reserved.
        </div>
      </div>
    `;

    return await this.sendEmail(customerEmail, subject, html);
  }
};

/* ===================== CLOUDINARY SERVICE ===================== */
class CloudinaryService {
  uploadFromBuffer(buffer, folder = "universities") {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder, quality: "auto" },
        (err, result) => {
          if (err) return reject(err);
          resolve({ public_id: result.public_id, url: result.secure_url });
        },
      );
      streamifier.createReadStream(buffer).pipe(stream);
    });
  }

  async uploadMultiple(files) {
    const images = [];
    for (const file of files) {
      images.push(await this.uploadFromBuffer(file.buffer));
    }
    return images;
  }

  async deleteMultiple(ids) {
    for (const id of ids) await cloudinary.uploader.destroy(id);
  }
}

const cloudinaryService = new CloudinaryService();
const DEFAULT_IMAGE = [
  {
    public_id: "default",
    url: "https://wenr.wes.org/wp-content/uploads/2019/09/iStock-1142918319_WENR_Ranking_740_430.jpg",
  },
];

/* ===================== UNIVERSITY CRUD ===================== */
exports.createUniversity = async (req, res) => {
  try {
    let images = DEFAULT_IMAGE;

    if (req.files?.images) {
      const files = Array.isArray(req.files.images)
        ? req.files.images
        : [req.files.images];
      images = await cloudinaryService.uploadMultiple(files);
    }

    const university = await University.create({ ...req.body, images });
    res.status(201).json({ success: true, data: university });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.getUniversities = async (_, res) => {
  const data = await University.find();
  res.json({ success: true, data });
};

exports.getUniversity = async (req, res) => {
  const uni = await University.findById(req.params.id);
  if (!uni) return res.status(404).json({ success: false });
  res.json({ success: true, data: uni });
};

exports.updateUniversity = async (req, res) => {
  try {
    const uni = await University.findById(req.params.id);
    if (!uni) return res.status(404).json({ success: false });

    if (req.files?.images) {
      if (uni.images.length)
        await cloudinaryService.deleteMultiple(
          uni.images.map((i) => i.public_id),
        );

      const files = Array.isArray(req.files.images)
        ? req.files.images
        : [req.files.images];
      uni.images = await cloudinaryService.uploadMultiple(files);
    }

    Object.assign(uni, req.body);
    await uni.save();

    res.json({ success: true, data: uni });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.deleteUniversity = async (req, res) => {
  const uni = await University.findById(req.params.id);
  if (!uni) return res.status(404).json({ success: false });

  if (uni.images.length)
    await cloudinaryService.deleteMultiple(uni.images.map((i) => i.public_id));

  await uni.deleteOne();
  res.json({ success: true });
};

/* ===================== BOOKING CRUD ===================== */

// ------------------ CREATE BOOKING ------------------
exports.createBooking = async (req, res) => {
  try {
    // Generate booking reference
    const bookingRef = 'UNI-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 5).toUpperCase();
    
    const bookingData = {
      ...req.body,
      bookingReference: bookingRef
    };

    const booking = await Booking.create(bookingData);

    // Send email notifications
    const customerEmail = booking.customer?.email;
    const customerName = booking.customer?.name || 'Student';

    if (customerEmail) {
      Promise.allSettled([
        emailService.sendBookingConfirmation(bookingData, customerEmail, customerName),
        emailService.sendAdminNotification(bookingData, customerEmail, customerName)
      ]).then(results => {
        console.log('Email notifications sent:', results.map(r => r.status));
      }).catch(err => {
        console.error('Error sending notification emails:', err);
      });
    }

    res.status(201).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to create booking",
      error: error.message,
    });
  }
};

exports.getBookingsByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Query nested customer.email
    const bookings = await Booking.find({
      "customer.email": { $regex: `^${email.trim()}$`, $options: 'i' }
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    console.error("Get Bookings By Email Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch bookings by email",
      error: error.message,
    });
  }
};

exports.getBookings = async (_, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json({ success: true, data: bookings });
  } catch (error) {
    console.error("Get Bookings Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
      error: error.message,
    });
  }
};

exports.getBooking = async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) return res.status(404).json({ success: false });
  res.json({ success: true, data: booking });
};

/* ===================== EDIT BOOKING ===================== */

exports.editBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const updates = { ...req.body };

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Store old status for email notification
    const oldStatus = booking.booking?.status;

    // 🔥 ENSURE NESTED OBJECT EXISTS
    if (!booking.booking) {
      booking.booking = {};
    }

    // ---------------- NOTES HANDLING ----------------
    if (updates.notes) {
      if (typeof updates.notes === "string") {
        updates.notes = {
          text: updates.notes,
          author: "System",
          date: new Date(),
        };
      } else if (typeof updates.notes === "object") {
        updates.notes.date = updates.notes.date || new Date();
      }
    }

    // ---------------- UPDATE NESTED BOOKING ----------------
    Object.keys(updates).forEach((key) => {
      booking.booking[key] = updates[key];
    });

    await booking.save();

    // Send status update email if status changed
    const newStatus = booking.booking?.status;
    if (oldStatus && newStatus && oldStatus !== newStatus) {
      const customerEmail = booking.customer?.email;
      const customerName = booking.customer?.name || 'Student';

      if (customerEmail) {
        emailService.sendStatusUpdate(
          booking.booking,
          customerEmail,
          customerName,
          oldStatus,
          newStatus
        ).catch(err => console.error('Error sending status update email:', err));
      }
    }

    res.json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error("Edit Booking Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update booking",
      error: error.message,
    });
  }
};

exports.updateBookingStatus = async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) return res.status(404).json({ success: false });

  const oldStatus = booking.booking?.status;
  booking.booking.status = req.body.status;
  await booking.save();

  // Send status update email
  const customerEmail = booking.customer?.email;
  const customerName = booking.customer?.name || 'Student';

  if (customerEmail) {
    emailService.sendStatusUpdate(
      booking.booking,
      customerEmail,
      customerName,
      oldStatus,
      req.body.status
    ).catch(err => console.error('Error sending status update email:', err));
  }

  res.json({ success: true, data: booking });
};

exports.deleteBooking = async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) return res.status(404).json({ success: false });

  await booking.deleteOne();
  res.json({ success: true });
};

/* ===================== DASHBOARD STATS ===================== */
exports.getDashboardStats = async (_, res) => {
  const [universities, bookings, pending, confirmed, cancelled] =
    await Promise.all([
      University.countDocuments(),
      Booking.countDocuments(),
      Booking.countDocuments({ "booking.status": "pending" }),
      Booking.countDocuments({ "booking.status": "confirmed" }),
      Booking.countDocuments({ "booking.status": "cancelled" }),
    ]);

  res.json({
    success: true,
    data: {
      universities,
      bookings,
      status: { pending, confirmed, cancelled },
    },
  });
};