
// const nodemailer = require("nodemailer");
// const cloudinary = require("cloudinary").v2;
// const Exam = require("../models/Exam");

// // ================== Cloudinary Setup ==================
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// class CSEController {
//   constructor() {
//     // Nodemailer transporter
//     this.mailer = nodemailer.createTransport({
//       host: process.env.SMTP_HOST,
//       port: process.env.SMTP_PORT,
//       secure: false,
//       auth: {
//         user: process.env.SMTP_USER,
//         pass: process.env.SMTP_PASS,
//       },
//     });
    
//     this.companyName = process.env.COMPANY_NAME || "REC APPLY";
//     this.adminEmail = process.env.ADMIN_EMAIL || "r.educationalconsultance@gmail.com";
//     this.frontendUrl = process.env.FRONTEND_URL || "https://rk-services-xi.vercel.app";
//   }

//   // ================== Email Helper with Beautiful Templates ==================
//   sendEmail = async (to, subject, html) => {
//     // Skip emails if configured
//     if (process.env.SKIP_EMAILS === "true") {
//       console.log(`📧 Email would be sent to: ${to}`);
//       console.log(`📋 Subject: ${subject}`);
//       return { success: true, skipped: true };
//     }
    
//     try {
//       await this.mailer.sendMail({
//         from: `"${this.companyName}" <${process.env.SMTP_USER}>`,
//         to,
//         subject,
//         html,
//       });
//       console.log(`✅ Email sent successfully to: ${to}`);
//       return { success: true };
//     } catch (error) {
//       console.error("❌ Email sending failed:", error);
//       return { success: false, error: error.message };
//     }
//   };

//   getUserBookingConfirmationEmail = (userName, examName, bookingDetails) => {
//     const { examSession, registrationDate, status } = bookingDetails;
//     const formattedDate = new Date(registrationDate).toLocaleDateString("en-US", {
//       weekday: "long",
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//     });
    
//     return `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <meta charset="utf-8">
//         <meta name="viewport" content="width=device-width, initial-scale=1.0">
//         <title>Booking Confirmation</title>
//       </head>
//       <body style="font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f8;">
//         <div style="max-width: 600px; margin: 20px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
//           <!-- Header -->
//           <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px 20px; text-align: center;">
//             <h1 style="color: white; margin: 0; font-size: 28px;">${this.companyName}</h1>
//             <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0; font-size: 16px;">Your Success Journey Starts Here</p>
//           </div>
          
//           <!-- Content -->
//           <div style="padding: 30px;">
//             <h2 style="color: #333; margin: 0 0 20px;">Booking Confirmed! 🎉</h2>
//             <p style="color: #666; line-height: 1.6; font-size: 16px;">Hello <strong>${userName}</strong>,</p>
//             <p style="color: #666; line-height: 1.6; font-size: 16px;">Your exam booking has been successfully confirmed. Here are your booking details:</p>
            
//             <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0;">
//               <table style="width: 100%; border-collapse: collapse;">
//                 <tr>
//                   <td style="padding: 10px 0; color: #555; width: 40%;">Exam Name:</td>
//                   <td style="padding: 10px 0; color: #333; font-weight: bold;">${examName}</td>
//                 </tr>
//                 <tr>
//                   <td style="padding: 10px 0; color: #555;">Session:</td>
//                   <td style="padding: 10px 0; color: #333; font-weight: bold;">${examSession || "Not specified"}</td>
//                 </tr>
//                 <tr>
//                   <td style="padding: 10px 0; color: #555;">Booking Date:</td>
//                   <td style="padding: 10px 0; color: #333; font-weight: bold;">${formattedDate}</td>
//                 </tr>
//                 <tr>
//                   <td style="padding: 10px 0; color: #555;">Status:</td>
//                   <td style="padding: 10px 0;"><span style="background: #28a745; color: white; padding: 5px 12px; border-radius: 20px; font-size: 14px;">${status || "Confirmed"}</span></td>
//                 </tr>
//               </table>
//             </div>
            
//             <div style="background: #e3f2fd; border-left: 4px solid #2196f3; padding: 15px; margin: 20px 0;">
//               <p style="color: #0c5460; margin: 0; font-size: 14px;">
//                 <strong>📌 Important:</strong> Please arrive 30 minutes before your exam session. Don't forget to bring a valid ID and your booking reference.
//               </p>
//             </div>
            
//             <div style="text-align: center; margin: 30px 0;">
//               <a href="${this.frontendUrl}/my-bookings?email=${encodeURIComponent(bookingDetails.userEmail)}" 
//                  style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
//                 View My Bookings
//               </a>
//             </div>
//           </div>
          
//           <!-- Footer -->
//           <div style="background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e9ecef;">
//             <p style="color: #999; margin: 5px 0; font-size: 14px;">Need help? Contact us at <a href="mailto:${this.adminEmail}" style="color: #667eea; text-decoration: none;">${this.adminEmail}</a></p>
//             <p style="color: #999; margin: 5px 0; font-size: 12px;">© ${new Date().getFullYear()} ${this.companyName}. All rights reserved.</p>
//           </div>
//         </div>
//       </body>
//       </html>
//     `;
//   };

//   getAdminNewBookingNotification = (userName, userEmail, examName, bookingDetails) => {
//     return `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <meta charset="utf-8">
//         <title>New Booking Alert - Admin</title>
//       </head>
//       <body style="font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f8;">
//         <div style="max-width: 600px; margin: 20px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
//           <!-- Header -->
//           <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 30px 20px; text-align: center;">
//             <h1 style="color: white; margin: 0; font-size: 28px;">Admin Notification</h1>
//             <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0; font-size: 16px;">New Exam Booking Received</p>
//           </div>
          
//           <!-- Content -->
//           <div style="padding: 30px;">
//             <div style="text-align: center; margin-bottom: 25px;">
//               <span style="background: #dc3545; color: white; padding: 8px 20px; border-radius: 20px; font-size: 14px; font-weight: bold;">🔔 NEW BOOKING</span>
//             </div>
            
//             <h2 style="color: #333; margin: 0 0 20px;">Booking Details</h2>
            
//             <div style="background: #f8f9fa; border-radius: 8px; padding: 20px;">
//               <table style="width: 100%; border-collapse: collapse;">
//                 <tr>
//                   <td style="padding: 10px 0; color: #555; width: 40%;">👤 User Name:</td>
//                   <td style="padding: 10px 0; color: #333; font-weight: bold;">${userName}</td>
//                 </tr>
//                 <tr>
//                   <td style="padding: 10px 0; color: #555;">📧 User Email:</td>
//                   <td style="padding: 10px 0; color: #333; font-weight: bold;">${userEmail}</td>
//                 </tr>
//                 <tr>
//                   <td style="padding: 10px 0; color: #555;">📚 Exam Name:</td>
//                   <td style="padding: 10px 0; color: #333; font-weight: bold;">${examName}</td>
//                 </tr>
//                 <tr>
//                   <td style="padding: 10px 0; color: #555;">⏰ Session:</td>
//                   <td style="padding: 10px 0; color: #333; font-weight: bold;">${bookingDetails.examSession || "Not specified"}</td>
//                 </tr>
//                 <tr>
//                   <td style="padding: 10px 0; color: #555;">📅 Booking Time:</td>
//                   <td style="padding: 10px 0; color: #333; font-weight: bold;">${new Date().toLocaleString()}</td>
//                 </tr>
//                 <tr>
//                   <td style="padding: 10px 0; color: #555;">📊 Status:</td>
//                   <td style="padding: 10px 0;"><span style="background: #ffc107; color: #333; padding: 5px 12px; border-radius: 20px; font-size: 14px;">Pending Review</span></td>
//                 </tr>
//               </table>
//             </div>
            
//             <div style="margin-top: 30px;">
//               <a href="${this.frontendUrl}/admin/bookings" 
//                  style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
//                 Go to Admin Dashboard
//               </a>
//             </div>
//           </div>
          
//           <!-- Footer -->
//           <div style="background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e9ecef;">
//             <p style="color: #999; margin: 5px 0; font-size: 14px;">This is an automated notification from ${this.companyName}</p>
//           </div>
//         </div>
//       </body>
//       </html>
//     `;
//   };

//   getBookingStatusUpdateEmail = (userName, examName, newStatus, bookingDetails) => {
//     const statusColors = {
//       "confirmed": "#28a745",
//       "pending": "#ffc107",
//       "cancelled": "#dc3545",
//       "completed": "#17a2b8"
//     };
    
//     const color = statusColors[newStatus.toLowerCase()] || "#6c757d";
    
//     return `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <meta charset="utf-8">
//         <title>Booking Status Update</title>
//       </head>
//       <body style="font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f8;">
//         <div style="max-width: 600px; margin: 20px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
//           <!-- Header -->
//           <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px 20px; text-align: center;">
//             <h1 style="color: white; margin: 0; font-size: 28px;">${this.companyName}</h1>
//           </div>
          
//           <!-- Content -->
//           <div style="padding: 30px;">
//             <h2 style="color: #333; margin: 0 0 20px;">Booking Status Update</h2>
//             <p style="color: #666; line-height: 1.6;">Hello <strong>${userName}</strong>,</p>
//             <p style="color: #666; line-height: 1.6;">The status of your booking for <strong>${examName}</strong> has been updated:</p>
            
//             <div style="text-align: center; margin: 30px 0;">
//               <span style="background: ${color}; color: white; padding: 12px 30px; border-radius: 25px; font-size: 18px; font-weight: bold; display: inline-block;">
//                 ${newStatus.toUpperCase()}
//               </span>
//             </div>
            
//             <div style="background: #f8f9fa; border-radius: 8px; padding: 20px;">
//               <p style="color: #555; margin: 5px 0;"><strong>Exam:</strong> ${examName}</p>
//               <p style="color: #555; margin: 5px 0;"><strong>Session:</strong> ${bookingDetails.examSession || "Not specified"}</p>
//             </div>
            
//             <div style="text-align: center; margin-top: 30px;">
//               <a href="${this.frontendUrl}/my-bookings?email=${encodeURIComponent(bookingDetails.userEmail)}" 
//                  style="background: ${color}; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
//                 View Updated Booking
//               </a>
//             </div>
//           </div>
//         </div>
//       </body>
//       </html>
//     `;
//   };

//   // ================== Cloudinary Upload Helper ==================
//   uploadFilesToCloudinary = async (files, folder = "exams") => {
//     const uploadedImages = [];
//     if (files && files.length) {
//       for (const file of files) {
//         const result = await cloudinary.uploader.upload(
//           `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
//           { folder }
//         );
//         uploadedImages.push({ url: result.secure_url, public_id: result.public_id });
//       }
//     }
//     return uploadedImages;
//   };

//   // ================== EXAMS CRUD ==================
//   createExam = async (req, res) => {
//     try {
//       let images = [];

//       if (req.files && req.files.length > 0) {
//         images = await this.uploadFilesToCloudinary(req.files);
//       }

//       const exam = await Exam.create({
//         ...req.body,
//         images,
//         createdBy: req.user?._id,
//       });

//       // Notify admin about new exam
//       if (!process.env.SKIP_EMAILS) {
//         const adminHtml = `
//           <div style="padding: 20px;">
//             <h2>New Exam Created</h2>
//             <p><strong>Exam:</strong> ${exam.name}</p>
//             <p><strong>Code:</strong> ${exam.code}</p>
//             <p><strong>Created by:</strong> ${req.user?.email || 'System'}</p>
//             <a href="${this.frontendUrl}/admin/exams/${exam._id}" style="background: #667eea; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Exam</a>
//           </div>
//         `;
        
//         await this.sendEmail(
//           this.adminEmail,
//           `📝 New Exam Created: ${exam.name}`,
//           adminHtml
//         );
//       }

//       res.status(201).json({
//         success: true,
//         data: exam,
//       });
//     } catch (error) {
//       console.error("Create exam error:", error);
//       res.status(400).json({
//         success: false,
//         message: error.message,
//       });
//     }
//   };

//   getAllExams = async (req, res) => {
//     try {
//       const exams = await Exam.find({ isActive: true });
//       res.json({ success: true, data: exams });
//     } catch (error) {
//       res.status(500).json({ success: false, message: error.message });
//     }
//   };

//   getSingleExam = async (req, res) => {
//     try {
//       const exam = await Exam.findById(req.params.examId);
//       if (!exam) return res.status(404).json({ success: false, message: "Exam not found" });
//       res.json({ success: true, data: exam });
//     } catch (error) {
//       res.status(500).json({ success: false, message: error.message });
//     }
//   };

//   updateExam = async (req, res) => {
//     try {
//       const exam = await Exam.findById(req.params.examId);
//       if (!exam) return res.status(404).json({ success: false, message: "Exam not found" });

//       // Delete old images if new ones are uploaded
//       if (req.files && req.files.length) {
//         for (const img of exam.images || []) {
//           await cloudinary.uploader.destroy(img.public_id);
//         }
//         exam.images = await this.uploadFilesToCloudinary(req.files);
//       }

//       Object.assign(exam, req.body);
//       await exam.save();
      
//       res.json({ success: true, data: exam });
//     } catch (error) {
//       res.status(400).json({ success: false, message: error.message });
//     }
//   };

//   deleteExam = async (req, res) => {
//     try {
//       const exam = await Exam.findByIdAndUpdate(
//         req.params.examId, 
//         { isActive: false }, 
//         { new: true }
//       );
      
//       if (!exam) return res.status(404).json({ success: false, message: "Exam not found" });
      
//       res.json({ success: true, message: "Exam deleted" });
//     } catch (error) {
//       res.status(400).json({ success: false, message: error.message });
//     }
//   };

//   // ================== BOOKINGS CRUD ==================
//   createBooking = async (req, res) => {
//     try {
//       const exam = await Exam.findById(req.params.examId);
//       if (!exam) return res.status(404).json({ success: false, message: "Exam not found" });

//       // Add registration date
//       const bookingData = {
//         ...req.body,
//         registrationDate: new Date(),
//         status: req.body.status || "pending"
//       };

//       exam.registrations.push(bookingData);
//       await exam.save();

//       const savedBooking = exam.registrations[exam.registrations.length - 1];

//       // Send beautiful confirmation email to user
//       const userHtml = this.getUserBookingConfirmationEmail(
//         req.body.userName,
//         exam.name,
//         {
//           ...savedBooking.toObject(),
//           userEmail: req.body.userEmail
//         }
//       );
      
//       await this.sendEmail(
//         req.body.userEmail,
//         `✅ Booking Confirmed: ${exam.name}`,
//         userHtml
//       );

//       // Send notification to admin
//       const adminHtml = this.getAdminNewBookingNotification(
//         req.body.userName,
//         req.body.userEmail,
//         exam.name,
//         savedBooking
//       );
      
//       await this.sendEmail(
//         this.adminEmail,
//         `🔔 New Booking: ${req.body.userName} - ${exam.name}`,
//         adminHtml
//       );

//       res.status(201).json({ 
//         success: true, 
//         message: "Booking created successfully",
//         data: savedBooking 
//       });
//     } catch (error) {
//       console.error("Booking creation error:", error);
//       res.status(400).json({ success: false, message: error.message });
//     }
//   };

//   getExamBookings = async (req, res) => {
//     try {
//       const exam = await Exam.findById(req.params.examId).select("registrations");
//       if (!exam) return res.status(404).json({ success: false, message: "Exam not found" });
//       res.json({ success: true, data: exam.registrations });
//     } catch (error) {
//       res.status(500).json({ success: false, message: error.message });
//     }
//   };

//   updateBookingStatus = async (req, res) => {
//     try {
//       const { examId, bookingId } = req.params;
//       const exam = await Exam.findById(examId);
//       const booking = exam?.registrations.id(bookingId);

//       if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });

//       const oldStatus = booking.status;
//       booking.status = req.body.status || booking.status;
//       await exam.save();

//       // Send status update email to user if status changed
//       if (oldStatus !== booking.status && booking.userEmail) {
//         const userHtml = this.getBookingStatusUpdateEmail(
//           booking.userName,
//           exam.name,
//           booking.status,
//           booking
//         );
        
//         await this.sendEmail(
//           booking.userEmail,
//           `📊 Booking Status Updated: ${exam.name}`,
//           userHtml
//         );

//         // Also notify admin of status change
//         const adminHtml = `
//           <div style="padding: 20px;">
//             <h2>Booking Status Updated</h2>
//             <p><strong>User:</strong> ${booking.userName}</p>
//             <p><strong>Exam:</strong> ${exam.name}</p>
//             <p><strong>Old Status:</strong> <span style="color: #999;">${oldStatus}</span></p>
//             <p><strong>New Status:</strong> <span style="color: #28a745; font-weight: bold;">${booking.status}</span></p>
//             <a href="${this.frontendUrl}/admin/bookings/${bookingId}" style="background: #667eea; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Booking</a>
//           </div>
//         `;
        
//         await this.sendEmail(
//           this.adminEmail,
//           `🔄 Booking Status Updated: ${booking.userName}`,
//           adminHtml
//         );
//       }

//       res.json({ 
//         success: true, 
//         message: "Booking updated successfully",
//         data: booking 
//       });
//     } catch (error) {
//       res.status(400).json({ success: false, message: error.message });
//     }
//   };

//   deleteBooking = async (req, res) => {
//     try {
//       const { examId, bookingId } = req.params;
//       const exam = await Exam.findById(examId);
//       const booking = exam?.registrations.id(bookingId);

//       if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });

//       // Notify user about cancellation before deleting
//       if (booking.userEmail && !process.env.SKIP_EMAILS) {
//         const cancellationHtml = `
//           <div style="padding: 20px; font-family: Arial, sans-serif;">
//             <h2 style="color: #dc3545;">Booking Cancelled</h2>
//             <p>Hello ${booking.userName},</p>
//             <p>Your booking for <strong>${exam.name}</strong> has been cancelled.</p>
//             <p>If you have any questions, please contact support.</p>
//             <hr>
//             <p style="color: #666;">Booking Reference: ${bookingId}</p>
//           </div>
//         `;
        
//         await this.sendEmail(
//           booking.userEmail,
//           `❌ Booking Cancelled: ${exam.name}`,
//           cancellationHtml
//         );
//       }

//       booking.remove();
//       await exam.save();

//       res.json({ success: true, message: "Booking deleted successfully" });
//     } catch (error) {
//       res.status(400).json({ success: false, message: error.message });
//     }
//   };

//   getAllBookings = async (req, res) => {
//     try {
//       const exams = await Exam.find().select("name code registrations").lean();
//       const bookings = exams.flatMap((exam) =>
//         (exam.registrations || []).map((r) => ({
//           examId: exam._id,
//           examName: exam.name,
//           examCode: exam.code,
//           bookingId: r._id,
//           userName: r.userName,
//           userEmail: r.userEmail,
//           status: r.status,
//           examSession: r.examSession,
//           registrationDate: r.registrationDate,
//         }))
//       );
      
//       // Sort by most recent first
//       bookings.sort((a, b) => new Date(b.registrationDate) - new Date(a.registrationDate));
      
//       res.json({ success: true, total: bookings.length, data: bookings });
//     } catch (error) {
//       res.status(500).json({ success: false, message: error.message });
//     }
//   };

//   getBookingStatistics = async (req, res) => {
//     try {
//       const exams = await Exam.find().select("registrations").lean();

//       let totalExams = exams.length;
//       let totalBookings = 0;

//       const statusStats = {};
//       const sessionStats = {};
//       const monthlyStats = {};

//       exams.forEach((exam) => {
//         const registrations = exam.registrations || [];

//         totalBookings += registrations.length;

//         registrations.forEach((r) => {
//           // Count status
//           const status = r.status || "unknown";
//           statusStats[status] = (statusStats[status] || 0) + 1;

//           // Count session
//           const session = r.examSession || "unknown";
//           sessionStats[session] = (sessionStats[session] || 0) + 1;

//           // Monthly statistics
//           if (r.registrationDate) {
//             const date = new Date(r.registrationDate);
//             const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
//             monthlyStats[monthYear] = (monthlyStats[monthYear] || 0) + 1;
//           }
//         });
//       });

//       res.json({
//         success: true,
//         statistics: {
//           totalExams,
//           totalBookings,
//           statusStats,
//           sessionStats,
//           monthlyStats,
//           conversionRate: totalExams > 0 ? ((totalBookings / totalExams) * 100).toFixed(2) + "%" : "0%",
//         },
//       });
//     } catch (error) {
//       res.status(500).json({
//         success: false,
//         message: error.message,
//       });
//     }
//   };

//   // ================== GET BOOKINGS BY EMAIL ==================
//   getBookingsByEmail = async (req, res) => {
//     try {
//       const email = req.params.email.toLowerCase();
//       const exams = await Exam.find().select("name code registrations").lean();

//       const filtered = exams.flatMap((exam) =>
//         (exam.registrations || [])
//           .filter((r) => r.userEmail && r.userEmail.toLowerCase() === email)
//           .map((r) => ({
//             examId: exam._id,
//             examName: exam.name,
//             examCode: exam.code,
//             bookingId: r._id,
//             userName: r.userName,
//             userEmail: r.userEmail,
//             status: r.status,
//             examSession: r.examSession,
//             registrationDate: r.registrationDate,
//           }))
//       );
      
//       // Sort by most recent first
//       filtered.sort((a, b) => new Date(b.registrationDate) - new Date(a.registrationDate));

//       res.json({ 
//         success: true, 
//         total: filtered.length, 
//         data: filtered 
//       });
//     } catch (error) {
//       res.status(500).json({ success: false, message: error.message });
//     }
//   };
// }

// module.exports = new CSEController();





















const nodemailer = require("nodemailer");
const cloudinary = require("cloudinary").v2;
const Exam = require("../models/Exam");

// ================== Cloudinary Setup ==================
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

class CSEController {
  constructor() {
    // Nodemailer transporter
    this.mailer = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    
    this.companyName = process.env.COMPANY_NAME || "REC APPLY";
    this.adminEmail = process.env.ADMIN_EMAIL || "r.educationalconsultance@gmail.com";
    this.frontendUrl = process.env.FRONTEND_URL || "https://rk-services-xi.vercel.app";
  }

  // ================== Email Helper with Beautiful Templates ==================
  sendEmail = async (to, subject, html) => {
    try {
      await this.mailer.sendMail({
        from: `"${this.companyName}" <${process.env.SMTP_USER}>`,
        to,
        subject,
        html,
      });
      console.log(`✅ Email sent successfully to: ${to}`);
      return { success: true };
    } catch (error) {
      console.error("❌ Email sending failed:", error);
      return { success: false, error: error.message };
    }
  };

  getUserBookingConfirmationEmail = (userName, examName, bookingDetails) => {
    const { examSession, registrationDate, status } = bookingDetails;
    const formattedDate = new Date(registrationDate).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Booking Confirmation</title>
      </head>
      <body style="font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f8;">
        <div style="max-width: 600px; margin: 20px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">${this.companyName}</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0; font-size: 16px;">Your Success Journey Starts Here</p>
          </div>
          
          <!-- Content -->
          <div style="padding: 30px;">
            <h2 style="color: #333; margin: 0 0 20px;">Booking Confirmed! 🎉</h2>
            <p style="color: #666; line-height: 1.6; font-size: 16px;">Hello <strong>${userName}</strong>,</p>
            <p style="color: #666; line-height: 1.6; font-size: 16px;">Your exam booking has been successfully confirmed. Here are your booking details:</p>
            
            <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px 0; color: #555; width: 40%;">Exam Name:</td>
                  <td style="padding: 10px 0; color: #333; font-weight: bold;">${examName}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #555;">Session:</td>
                  <td style="padding: 10px 0; color: #333; font-weight: bold;">${examSession || "Not specified"}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #555;">Booking Date:</td>
                  <td style="padding: 10px 0; color: #333; font-weight: bold;">${formattedDate}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #555;">Status:</td>
                  <td style="padding: 10px 0;"><span style="background: #28a745; color: white; padding: 5px 12px; border-radius: 20px; font-size: 14px;">${status || "Confirmed"}</span></td>
                </tr>
              </table>
            </div>
            
            <div style="background: #e3f2fd; border-left: 4px solid #2196f3; padding: 15px; margin: 20px 0;">
              <p style="color: #0c5460; margin: 0; font-size: 14px;">
                <strong>📌 Important:</strong> Please arrive 30 minutes before your exam session. Don't forget to bring a valid ID and your booking reference.
              </p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${this.frontendUrl}/my-bookings?email=${encodeURIComponent(bookingDetails.userEmail)}" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
                View My Bookings
              </a>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e9ecef;">
            <p style="color: #999; margin: 5px 0; font-size: 14px;">Need help? Contact us at <a href="mailto:${this.adminEmail}" style="color: #667eea; text-decoration: none;">${this.adminEmail}</a></p>
            <p style="color: #999; margin: 5px 0; font-size: 12px;">© ${new Date().getFullYear()} ${this.companyName}. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  };

  getAdminNewBookingNotification = (userName, userEmail, examName, bookingDetails) => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>New Booking Alert - Admin</title>
      </head>
      <body style="font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f8;">
        <div style="max-width: 600px; margin: 20px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 30px 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Admin Notification</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0; font-size: 16px;">New Exam Booking Received</p>
          </div>
          
          <!-- Content -->
          <div style="padding: 30px;">
            <div style="text-align: center; margin-bottom: 25px;">
              <span style="background: #dc3545; color: white; padding: 8px 20px; border-radius: 20px; font-size: 14px; font-weight: bold;">🔔 NEW BOOKING</span>
            </div>
            
            <h2 style="color: #333; margin: 0 0 20px;">Booking Details</h2>
            
            <div style="background: #f8f9fa; border-radius: 8px; padding: 20px;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px 0; color: #555; width: 40%;">👤 User Name:</td>
                  <td style="padding: 10px 0; color: #333; font-weight: bold;">${userName}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #555;">📧 User Email:</td>
                  <td style="padding: 10px 0; color: #333; font-weight: bold;">${userEmail}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #555;">📚 Exam Name:</td>
                  <td style="padding: 10px 0; color: #333; font-weight: bold;">${examName}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #555;">⏰ Session:</td>
                  <td style="padding: 10px 0; color: #333; font-weight: bold;">${bookingDetails.examSession || "Not specified"}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #555;">📅 Booking Time:</td>
                  <td style="padding: 10px 0; color: #333; font-weight: bold;">${new Date().toLocaleString()}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #555;">📊 Status:</td>
                  <td style="padding: 10px 0;"><span style="background: #ffc107; color: #333; padding: 5px 12px; border-radius: 20px; font-size: 14px;">Pending Review</span></td>
                </tr>
              </table>
            </div>
            
            <div style="margin-top: 30px;">
              <a href="${this.frontendUrl}/admin/bookings" 
                 style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
                Go to Admin Dashboard
              </a>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e9ecef;">
            <p style="color: #999; margin: 5px 0; font-size: 14px;">This is an automated notification from ${this.companyName}</p>
          </div>
        </div>
      </body>
      </html>
    `;
  };

  getBookingStatusUpdateEmail = (userName, examName, newStatus, bookingDetails) => {
    const statusColors = {
      "confirmed": "#28a745",
      "pending": "#ffc107",
      "cancelled": "#dc3545",
      "completed": "#17a2b8"
    };
    
    const color = statusColors[newStatus.toLowerCase()] || "#6c757d";
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Booking Status Update</title>
      </head>
      <body style="font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f8;">
        <div style="max-width: 600px; margin: 20px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">${this.companyName}</h1>
          </div>
          
          <!-- Content -->
          <div style="padding: 30px;">
            <h2 style="color: #333; margin: 0 0 20px;">Booking Status Update</h2>
            <p style="color: #666; line-height: 1.6;">Hello <strong>${userName}</strong>,</p>
            <p style="color: #666; line-height: 1.6;">The status of your booking for <strong>${examName}</strong> has been updated:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <span style="background: ${color}; color: white; padding: 12px 30px; border-radius: 25px; font-size: 18px; font-weight: bold; display: inline-block;">
                ${newStatus.toUpperCase()}
              </span>
            </div>
            
            <div style="background: #f8f9fa; border-radius: 8px; padding: 20px;">
              <p style="color: #555; margin: 5px 0;"><strong>Exam:</strong> ${examName}</p>
              <p style="color: #555; margin: 5px 0;"><strong>Session:</strong> ${bookingDetails.examSession || "Not specified"}</p>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="${this.frontendUrl}/my-bookings?email=${encodeURIComponent(bookingDetails.userEmail)}" 
                 style="background: ${color}; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
                View Updated Booking
              </a>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  };

  // ================== Cloudinary Upload Helper ==================
  uploadFilesToCloudinary = async (files, folder = "exams") => {
    const uploadedImages = [];
    if (files && files.length) {
      for (const file of files) {
        const result = await cloudinary.uploader.upload(
          `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
          { folder }
        );
        uploadedImages.push({ url: result.secure_url, public_id: result.public_id });
      }
    }
    return uploadedImages;
  };

  // ================== EXAMS CRUD ==================
  createExam = async (req, res) => {
    try {
      let images = [];

      if (req.files && req.files.length > 0) {
        images = await this.uploadFilesToCloudinary(req.files);
      }

      const exam = await Exam.create({
        ...req.body,
        images,
        createdBy: req.user?._id,
      });

      // Notify admin about new exam
      const adminHtml = `
        <div style="padding: 20px;">
          <h2>New Exam Created</h2>
          <p><strong>Exam:</strong> ${exam.name}</p>
          <p><strong>Code:</strong> ${exam.code}</p>
          <p><strong>Created by:</strong> ${req.user?.email || 'System'}</p>
          <a href="${this.frontendUrl}/admin/exams/${exam._id}" style="background: #667eea; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Exam</a>
        </div>
      `;
      
      await this.sendEmail(
        this.adminEmail,
        `📝 New Exam Created: ${exam.name}`,
        adminHtml
      );

      res.status(201).json({
        success: true,
        data: exam,
      });
    } catch (error) {
      console.error("Create exam error:", error);
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

  getAllExams = async (req, res) => {
    try {
      const exams = await Exam.find({ isActive: true });
      res.json({ success: true, data: exams });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  getSingleExam = async (req, res) => {
    try {
      const exam = await Exam.findById(req.params.examId);
      if (!exam) return res.status(404).json({ success: false, message: "Exam not found" });
      res.json({ success: true, data: exam });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  updateExam = async (req, res) => {
    try {
      const exam = await Exam.findById(req.params.examId);
      if (!exam) return res.status(404).json({ success: false, message: "Exam not found" });

      // Delete old images if new ones are uploaded
      if (req.files && req.files.length) {
        for (const img of exam.images || []) {
          await cloudinary.uploader.destroy(img.public_id);
        }
        exam.images = await this.uploadFilesToCloudinary(req.files);
      }

      Object.assign(exam, req.body);
      await exam.save();
      
      res.json({ success: true, data: exam });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  deleteExam = async (req, res) => {
    try {
      const exam = await Exam.findByIdAndUpdate(
        req.params.examId, 
        { isActive: false }, 
        { new: true }
      );
      
      if (!exam) return res.status(404).json({ success: false, message: "Exam not found" });
      
      res.json({ success: true, message: "Exam deleted" });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  // ================== BOOKINGS CRUD ==================
  createBooking = async (req, res) => {
    try {
      const exam = await Exam.findById(req.params.examId);
      if (!exam) return res.status(404).json({ success: false, message: "Exam not found" });

      // Add registration date
      const bookingData = {
        ...req.body,
        registrationDate: new Date(),
        status: req.body.status || "pending"
      };

      exam.registrations.push(bookingData);
      await exam.save();

      const savedBooking = exam.registrations[exam.registrations.length - 1];

      // Send beautiful confirmation email to user
      const userHtml = this.getUserBookingConfirmationEmail(
        req.body.userName,
        exam.name,
        {
          ...savedBooking.toObject(),
          userEmail: req.body.userEmail
        }
      );
      
      await this.sendEmail(
        req.body.userEmail,
        `✅ Booking Confirmed: ${exam.name}`,
        userHtml
      );

      // Send notification to admin
      const adminHtml = this.getAdminNewBookingNotification(
        req.body.userName,
        req.body.userEmail,
        exam.name,
        savedBooking
      );
      
      await this.sendEmail(
        this.adminEmail,
        `🔔 New Booking: ${req.body.userName} - ${exam.name}`,
        adminHtml
      );

      res.status(201).json({ 
        success: true, 
        message: "Booking created successfully",
        data: savedBooking 
      });
    } catch (error) {
      console.error("Booking creation error:", error);
      res.status(400).json({ success: false, message: error.message });
    }
  };

  getExamBookings = async (req, res) => {
    try {
      const exam = await Exam.findById(req.params.examId).select("registrations");
      if (!exam) return res.status(404).json({ success: false, message: "Exam not found" });
      res.json({ success: true, data: exam.registrations });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  updateBookingStatus = async (req, res) => {
    try {
      const { examId, bookingId } = req.params;
      const exam = await Exam.findById(examId);
      const booking = exam?.registrations.id(bookingId);

      if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });

      const oldStatus = booking.status;
      booking.status = req.body.status || booking.status;
      await exam.save();

      // Send status update email to user if status changed
      if (oldStatus !== booking.status && booking.userEmail) {
        const userHtml = this.getBookingStatusUpdateEmail(
          booking.userName,
          exam.name,
          booking.status,
          booking
        );
        
        await this.sendEmail(
          booking.userEmail,
          `📊 Booking Status Updated: ${exam.name}`,
          userHtml
        );

        // Also notify admin of status change
        const adminHtml = `
          <div style="padding: 20px;">
            <h2>Booking Status Updated</h2>
            <p><strong>User:</strong> ${booking.userName}</p>
            <p><strong>Exam:</strong> ${exam.name}</p>
            <p><strong>Old Status:</strong> <span style="color: #999;">${oldStatus}</span></p>
            <p><strong>New Status:</strong> <span style="color: #28a745; font-weight: bold;">${booking.status}</span></p>
            <a href="${this.frontendUrl}/admin/bookings/${bookingId}" style="background: #667eea; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Booking</a>
          </div>
        `;
        
        await this.sendEmail(
          this.adminEmail,
          `🔄 Booking Status Updated: ${booking.userName}`,
          adminHtml
        );
      }

      res.json({ 
        success: true, 
        message: "Booking updated successfully",
        data: booking 
      });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  deleteBooking = async (req, res) => {
    try {
      const { examId, bookingId } = req.params;
      const exam = await Exam.findById(examId);
      const booking = exam?.registrations.id(bookingId);

      if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });

      // Notify user about cancellation before deleting
      if (booking.userEmail) {
        const cancellationHtml = `
          <div style="padding: 20px; font-family: Arial, sans-serif;">
            <h2 style="color: #dc3545;">Booking Cancelled</h2>
            <p>Hello ${booking.userName},</p>
            <p>Your booking for <strong>${exam.name}</strong> has been cancelled.</p>
            <p>If you have any questions, please contact support.</p>
            <hr>
            <p style="color: #666;">Booking Reference: ${bookingId}</p>
          </div>
        `;
        
        await this.sendEmail(
          booking.userEmail,
          `❌ Booking Cancelled: ${exam.name}`,
          cancellationHtml
        );
      }

      booking.remove();
      await exam.save();

      res.json({ success: true, message: "Booking deleted successfully" });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  getAllBookings = async (req, res) => {
    try {
      const exams = await Exam.find().select("name code registrations").lean();
      const bookings = exams.flatMap((exam) =>
        (exam.registrations || []).map((r) => ({
          examId: exam._id,
          examName: exam.name,
          examCode: exam.code,
          bookingId: r._id,
          userName: r.userName,
          userEmail: r.userEmail,
          status: r.status,
          examSession: r.examSession,
          registrationDate: r.registrationDate,
        }))
      );
      
      // Sort by most recent first
      bookings.sort((a, b) => new Date(b.registrationDate) - new Date(a.registrationDate));
      
      res.json({ success: true, total: bookings.length, data: bookings });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  getBookingStatistics = async (req, res) => {
    try {
      const exams = await Exam.find().select("registrations").lean();

      let totalExams = exams.length;
      let totalBookings = 0;

      const statusStats = {};
      const sessionStats = {};
      const monthlyStats = {};

      exams.forEach((exam) => {
        const registrations = exam.registrations || [];

        totalBookings += registrations.length;

        registrations.forEach((r) => {
          // Count status
          const status = r.status || "unknown";
          statusStats[status] = (statusStats[status] || 0) + 1;

          // Count session
          const session = r.examSession || "unknown";
          sessionStats[session] = (sessionStats[session] || 0) + 1;

          // Monthly statistics
          if (r.registrationDate) {
            const date = new Date(r.registrationDate);
            const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            monthlyStats[monthYear] = (monthlyStats[monthYear] || 0) + 1;
          }
        });
      });

      res.json({
        success: true,
        statistics: {
          totalExams,
          totalBookings,
          statusStats,
          sessionStats,
          monthlyStats,
          conversionRate: totalExams > 0 ? ((totalBookings / totalExams) * 100).toFixed(2) + "%" : "0%",
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  // ================== GET BOOKINGS BY EMAIL ==================
  getBookingsByEmail = async (req, res) => {
    try {
      const email = req.params.email.toLowerCase();
      const exams = await Exam.find().select("name code registrations").lean();

      const filtered = exams.flatMap((exam) =>
        (exam.registrations || [])
          .filter((r) => r.userEmail && r.userEmail.toLowerCase() === email)
          .map((r) => ({
            examId: exam._id,
            examName: exam.name,
            examCode: exam.code,
            bookingId: r._id,
            userName: r.userName,
            userEmail: r.userEmail,
            status: r.status,
            examSession: r.examSession,
            registrationDate: r.registrationDate,
          }))
      );
      
      // Sort by most recent first
      filtered.sort((a, b) => new Date(b.registrationDate) - new Date(a.registrationDate));

      res.json({ 
        success: true, 
        total: filtered.length, 
        data: filtered 
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
}

module.exports = new CSEController();