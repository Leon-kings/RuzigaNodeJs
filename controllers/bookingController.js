

// const models = require('../models/Services');
// const nodemailer = require('nodemailer');
// const validator = require('validator');
// const moment = require('moment');

// /* =====================================================
//    EMAIL TRANSPORTER
// ===================================================== */
// const createTransporter = () => {
//   return nodemailer.createTransport({
//     host: process.env.SMTP_HOST,
//     port: parseInt(process.env.SMTP_PORT),
//     secure: false,
//     auth: {
//       user: process.env.SMTP_USER,
//       pass: process.env.SMTP_PASS
//     },
//     tls: {
//       rejectUnauthorized: false
//     }
//   });
// };

// /* =====================================================
//    EMAIL SERVICE
// ===================================================== */
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
//         from: `"${process.env.COMPANY_NAME || 'REC APPLY'} Services" <${process.env.EMAIL_FROM}>`,
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

//   // Send booking confirmation to user
//   sendUserConfirmation: async (booking) => {
//     const bookingId = booking._id.toString().substring(0, 8).toUpperCase();
//     const subject = `Booking Confirmation #${bookingId} - ${booking.service}`;
    
//     const statusColors = {
//       pending: '#FFC107',
//       confirmed: '#4CAF50',
//       cancelled: '#f44336',
//       completed: '#2196f3'
//     };

//     const statusColor = statusColors[booking.status] || '#666';
    
//     const html = `
//       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f4f4; padding: 20px;">
//         <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
//           <h1 style="color: white; margin: 0; font-size: 28px;">${process.env.COMPANY_NAME || 'REC APPLY'}</h1>
//           <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Booking Confirmation</p>
//         </div>
        
//         <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
//           <h2 style="color: #333; margin-top: 0; border-bottom: 2px solid #f0f0f0; padding-bottom: 15px;">
//             Thank You for Your Booking! 📅
//           </h2>
          
//           <p style="font-size: 16px; line-height: 1.6; color: #555;">Dear ${booking.name},</p>
          
//           <p style="font-size: 16px; line-height: 1.6; color: #555;">Your booking request has been received and is being processed. Here are your booking details:</p>
          
//           <div style="background-color: #f0f7ff; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #667eea;">
//             <h3 style="margin-top: 0; color: #667eea; font-size: 20px;">Booking Reference: #${bookingId}</h3>
            
//             <table style="width: 100%; border-collapse: collapse;">
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Service:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">
//                   <span style="background-color: #e3f2fd; color: #1976d2; padding: 3px 10px; border-radius: 12px; font-size: 12px;">
//                     ${booking.service.charAt(0).toUpperCase() + booking.service.slice(1)}
//                   </span>
//                 </td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Date:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${moment(booking.date).format('dddd, MMMM Do YYYY')}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Time:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${booking.scheduledTime || 'To be confirmed'}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Duration:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${booking.duration || '1 hour'}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Meeting Type:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">
//                   <span style="background-color: ${booking.meetingType === 'online' ? '#e8f5e8' : '#fff3e0'}; color: ${booking.meetingType === 'online' ? '#4CAF50' : '#f39c12'}; padding: 3px 10px; border-radius: 12px; font-size: 12px;">
//                     ${booking.meetingType?.toUpperCase() || 'ONLINE'}
//                   </span>
//                 </td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Country:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${booking.country}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Phone:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${booking.phone}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Status:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">
//                   <span style="background-color: ${statusColor}; color: white; padding: 3px 10px; border-radius: 12px; font-size: 12px;">
//                     ${booking.status.toUpperCase()}
//                   </span>
//                 </td>
//               </tr>
//             </table>
            
//             ${booking.message ? `
//               <div style="margin-top: 15px;">
//                 <strong style="color: #666;">Your Message:</strong>
//                 <p style="color: #555; font-style: italic; margin: 5px 0 0 0; background-color: white; padding: 10px; border-radius: 5px;">${booking.message}</p>
//               </div>
//             ` : ''}
//           </div>
          
//           <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
//             <h4 style="margin-top: 0; color: #333;">What Happens Next?</h4>
//             <ol style="margin: 5px 0 0 0; color: #555;">
//               <li style="margin: 5px 0;">Our team will review your booking within 24 hours</li>
//               <li style="margin: 5px 0;">You'll receive a confirmation email with meeting details</li>
//               <li style="margin: 5px 0;">A calendar invitation will be sent to your email</li>
//               <li style="margin: 5px 0;">You can reschedule or cancel up to 24 hours in advance</li>
//             </ol>
//           </div>
          
//           <hr style="border: none; border-top: 2px solid #f0f0f0; margin: 30px 0;">
          
//           <div style="text-align: center;">
//             <p style="color: #666; font-size: 14px; line-height: 1.6;">
//               We look forward to connecting with you!<br>
//               If you have any questions, please reply to this email.
//             </p>
//           </div>
//         </div>
        
//         <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
//           © ${new Date().getFullYear()} ${process.env.COMPANY_NAME || 'REC APPLY'}. All rights reserved.<br>
//           This is an automated message, please do not reply to this email.
//         </div>
//       </div>
//     `;

//     return await this.sendEmail(booking.email, subject, html);
//   },

//   // Send admin notification for new booking
//   sendAdminNotification: async (booking, req) => {
//     const bookingId = booking._id.toString().substring(0, 8).toUpperCase();
//     const subject = `📋 New Booking: ${booking.name} - ${booking.service}`;
    
//     const html = `
//       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f4f4; padding: 20px;">
//         <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
//           <h1 style="color: white; margin: 0; font-size: 28px;">${process.env.COMPANY_NAME || 'REC APPLY'}</h1>
//           <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Admin Notification - New Booking</p>
//         </div>
        
//         <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
//           <h2 style="color: #333; margin-top: 0; border-bottom: 2px solid #f0f0f0; padding-bottom: 15px;">
//             New Booking Alert! 📅
//           </h2>
          
//           <div style="background-color: #fff3e0; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #f5576c;">
//             <h3 style="margin-top: 0; color: #f5576c; font-size: 20px;">Booking Reference: #${bookingId}</h3>
            
//             <h4 style="color: #333; margin: 15px 0 5px 0;">Client Details</h4>
//             <table style="width: 100%; border-collapse: collapse;">
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Name:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${booking.name}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Email:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${booking.email}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Phone:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${booking.phone}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Country:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${booking.country}</td>
//               </tr>
//             </table>
            
//             <h4 style="color: #333; margin: 15px 0 5px 0;">Booking Details</h4>
//             <table style="width: 100%; border-collapse: collapse;">
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Service:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${booking.service}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Date:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${moment(booking.date).format('dddd, MMMM Do YYYY')}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Time:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${booking.scheduledTime || 'Not specified'}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Duration:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${booking.duration || '1 hour'}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Meeting Type:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${booking.meetingType || 'online'}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Status:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">
//                   <span style="background-color: #FFC107; color: #333; padding: 3px 10px; border-radius: 12px; font-size: 12px;">
//                     ${booking.status}
//                   </span>
//                 </td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Booking Date:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${moment(booking.createdAt).format('MMMM Do YYYY, h:mm a')}</td>
//               </tr>
//             </table>
            
//             ${booking.postTitle ? `
//               <h4 style="color: #333; margin: 15px 0 5px 0;">Related Content</h4>
//               <p style="margin: 5px 0; color: #555;"><strong>Post Title:</strong> ${booking.postTitle}</p>
//               <p style="margin: 5px 0; color: #555;"><strong>Post ID:</strong> ${booking.postId}</p>
//             ` : ''}
            
//             ${booking.message ? `
//               <h4 style="color: #333; margin: 15px 0 5px 0;">Client Message</h4>
//               <div style="background-color: #fff9e6; padding: 15px; border-radius: 5px;">
//                 <p style="color: #555; margin: 0;">${booking.message}</p>
//               </div>
//             ` : ''}
            
//             <h4 style="color: #333; margin: 15px 0 5px 0;">Client Information</h4>
//             <table style="width: 100%; border-collapse: collapse;">
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>IP Address:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${req.ip}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>User Agent:</strong></td>
//                 <td style="padding: 8px 0; color: #333; font-size: 11px;">${req.get('user-agent')}</td>
//               </tr>
//             </table>
//           </div>
          
//           <hr style="border: none; border-top: 2px solid #f0f0f0; margin: 30px 0;">
          
//           <div style="text-align: center;">
//             <p style="color: #666; font-size: 14px; line-height: 1.6;">
//               Please review this booking and respond within 24 hours.<br>
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

//   // Send status update notification to user
//   sendStatusUpdate: async (booking, oldStatus, newStatus, notes, meetingLink) => {
//     const bookingId = booking._id.toString().substring(0, 8).toUpperCase();
//     const subject = `Booking Status Update #${bookingId} - ${newStatus}`;
    
//     const statusColors = {
//       pending: '#FFC107',
//       confirmed: '#4CAF50',
//       cancelled: '#f44336',
//       completed: '#2196f3'
//     };

//     const oldColor = statusColors[oldStatus] || '#666';
//     const newColor = statusColors[newStatus] || '#666';
    
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
          
//           <p style="font-size: 16px; line-height: 1.6; color: #555;">Dear ${booking.name},</p>
          
//           <p style="font-size: 16px; line-height: 1.6; color: #555;">The status of your booking has been updated:</p>
          
//           <div style="background-color: #f9f9f9; padding: 30px; text-align: center; border-radius: 5px; margin: 20px 0;">
//             <div style="display: inline-block; background-color: ${oldColor}20; padding: 15px 30px; border-radius: 5px; margin-right: 10px;">
//               <span style="color: ${oldColor}; font-weight: bold;">${oldStatus.toUpperCase()}</span>
//             </div>
//             <span style="font-size: 24px; color: #999; margin: 0 15px;">→</span>
//             <div style="display: inline-block; background-color: ${newColor}20; padding: 15px 30px; border-radius: 5px;">
//               <span style="color: ${newColor}; font-weight: bold;">${newStatus.toUpperCase()}</span>
//             </div>
//           </div>
          
//           <div style="background-color: #f0f7ff; padding: 20px; border-radius: 5px; margin: 20px 0;">
//             <h4 style="margin-top: 0; color: #333;">Booking Details</h4>
//             <p style="margin: 5px 0; color: #555;"><strong>Booking Reference:</strong> #${bookingId}</p>
//             <p style="margin: 5px 0; color: #555;"><strong>Service:</strong> ${booking.service}</p>
//             <p style="margin: 5px 0; color: #555;"><strong>Date:</strong> ${moment(booking.date).format('dddd, MMMM Do YYYY')}</p>
//             <p style="margin: 5px 0; color: #555;"><strong>Time:</strong> ${booking.scheduledTime || 'To be confirmed'}</p>
//             <p style="margin: 5px 0; color: #555;"><strong>Status:</strong> 
//               <span style="background-color: ${newColor}; color: white; padding: 3px 10px; border-radius: 12px; font-size: 12px;">
//                 ${newStatus.toUpperCase()}
//               </span>
//             </p>
            
//             ${notes ? `
//               <div style="margin-top: 15px;">
//                 <strong style="color: #666;">Notes from our team:</strong>
//                 <p style="color: #555; margin: 5px 0 0 0; background-color: white; padding: 10px; border-radius: 5px;">${notes}</p>
//               </div>
//             ` : ''}
            
//             ${meetingLink ? `
//               <div style="margin-top: 15px;">
//                 <strong style="color: #666;">Meeting Link:</strong>
//                 <p style="color: #555; margin: 5px 0 0 0; background-color: white; padding: 10px; border-radius: 5px; word-break: break-all;">${meetingLink}</p>
//               </div>
//             ` : ''}
//           </div>
          
//           ${newStatus === 'confirmed' ? `
//             <div style="background-color: #e8f5e8; padding: 15px; border-radius: 5px; margin: 20px 0;">
//               <h4 style="margin-top: 0; color: #4CAF50;">✅ Next Steps</h4>
//               <ol style="margin: 5px 0 0 0; color: #555;">
//                 <li>Please save the date: ${moment(booking.date).format('dddd, MMMM Do YYYY')}</li>
//                 <li>Add the meeting to your calendar</li>
//                 ${meetingLink ? '<li>Use the meeting link above to join at the scheduled time</li>' : '<li>Meeting details will be sent separately</li>'}
//                 <li>If you need to reschedule, please contact us at least 24 hours in advance</li>
//               </ol>
//             </div>
//           ` : ''}
          
//           ${newStatus === 'cancelled' ? `
//             <div style="background-color: #ffebee; padding: 15px; border-radius: 5px; margin: 20px 0;">
//               <h4 style="margin-top: 0; color: #f44336;">ℹ️ Important</h4>
//               <p style="margin: 5px 0; color: #555;">We're sorry to see you go. If you'd like to reschedule or have any questions, please reply to this email.</p>
//             </div>
//           ` : ''}
          
//           ${newStatus === 'completed' ? `
//             <div style="background-color: #e3f2fd; padding: 15px; border-radius: 5px; margin: 20px 0;">
//               <h4 style="margin-top: 0; color: #2196f3;">🎉 Thank You!</h4>
//               <p style="margin: 5px 0; color: #555;">We hope your session was valuable. We'd love to hear your feedback!</p>
//             </div>
//           ` : ''}
          
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

//     return await this.sendEmail(booking.email, subject, html);
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
//       statData.ip = req.ip || req.connection.remoteAddress;
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
// exports.createBooking = async (req, res) => {
//   try {
//     const { 
//       name, 
//       email, 
//       phone, 
//       country, 
//       service, 
//       date, 
//       message, 
//       postTitle, 
//       postId,
//       scheduledTime,
//       duration,
//       meetingType
//     } = req.body;

//     // Validate required fields
//     if (!name || !email || !phone || !country || !service || !date) {
//       return res.status(400).json({
//         success: false,
//         message: 'Name, email, phone, country, service, and date are required'
//       });
//     }

//     // Validate email
//     if (!validator.isEmail(email)) {
//       return res.status(400).json({
//         success: false,
//         message: 'Please provide a valid email address'
//       });
//     }

//     // Validate date
//     const bookingDate = new Date(date);
//     if (isNaN(bookingDate.getTime())) {
//       return res.status(400).json({
//         success: false,
//         message: 'Please provide a valid date'
//       });
//     }

//     // Check if date is in the future
//     if (bookingDate < new Date()) {
//       return res.status(400).json({
//         success: false,
//         message: 'Booking date must be in the future'
//       });
//     }

//     // Validate service
//     const validServices = ['consultation', 'workshop', 'training', 'speaking', 'other'];
//     if (!validServices.includes(service)) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid service type'
//       });
//     }

//     // Create booking
//     const booking = new models.Booking({
//       name: name.trim(),
//       email: email.toLowerCase().trim(),
//       phone: phone.trim(),
//       country: country.trim(),
//       service,
//       date: bookingDate,
//       message: message ? message.trim() : '',
//       postTitle,
//       postId,
//       scheduledTime: scheduledTime || '10:00 AM',
//       duration: duration || '1 hour',
//       meetingType: meetingType || 'online',
//       status: 'pending'
//     });

//     await booking.save();

//     // Track event
//     await trackEvent('booking', {
//       bookingId: booking._id,
//       service,
//       country,
//       name: booking.name
//     }, req);

//     // Send email notifications (fire and forget)
//     Promise.allSettled([
//       emailService.sendUserConfirmation(booking),
//       emailService.sendAdminNotification(booking, req)
//     ]).then(results => {
//       console.log('Email notifications sent:', results.map(r => r.status));
//     }).catch(err => {
//       console.error('Error sending notification emails:', err);
//     });

//     res.status(201).json({
//       success: true,
//       message: 'Booking submitted successfully',
//       data: {
//         _id: booking._id,
//         name: booking.name,
//         service: booking.service,
//         date: booking.date,
//         status: booking.status,
//         bookingId: booking._id.toString().substring(0, 8).toUpperCase()
//       }
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

//     // Filter by status
//     if (status && status !== 'all') {
//       query.status = status;
//     }

//     // Filter by service
//     if (service && service !== 'all') {
//       query.service = service;
//     }

//     // Filter by country
//     if (country && country !== 'all') {
//       query.country = country;
//     }

//     // Filter by date range
//     if (startDate || endDate) {
//       query.date = {};
//       if (startDate) {
//         query.date.$gte = new Date(startDate);
//       }
//       if (endDate) {
//         query.date.$lte = new Date(endDate);
//       }
//     }

//     // Search by name, email, or phone
//     if (search) {
//       query.$or = [
//         { name: { $regex: search, $options: 'i' } },
//         { email: { $regex: search, $options: 'i' } },
//         { phone: { $regex: search, $options: 'i' } }
//       ];
//     }

//     const bookings = await models.Booking.find(query)
//       .sort('-createdAt')
//       .skip((parseInt(page) - 1) * parseInt(limit))
//       .limit(parseInt(limit))
//       .populate('postId', 'title slug');

//     const total = await models.Booking.countDocuments(query);

//     // Get available filters data
//     const services = await models.Booking.distinct('service');
//     const countries = await models.Booking.distinct('country');
//     const statuses = ['pending', 'confirmed', 'cancelled', 'completed'];

//     res.json({
//       success: true,
//       data: bookings,
//       total,
//       totalPages: Math.ceil(total / parseInt(limit)),
//       currentPage: parseInt(page),
//       filters: {
//         services,
//         countries,
//         statuses
//       }
//     });
//   } catch (error) {
//     console.error('Get bookings error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching bookings'
//     });
//   }
// };

// // Get bookings by email
// exports.getBookingsByEmail = async (req, res) => {
//   try {
//     const { email } = req.params;
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

//     const query = { email: email.toLowerCase() };

//     // Apply same filters as getAllBookings
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
//         { name: { $regex: search, $options: 'i' } },
//         { email: { $regex: search, $options: 'i' } },
//         { phone: { $regex: search, $options: 'i' } }
//       ];
//     }

//     const bookings = await models.Booking.find(query)
//       .sort('-createdAt')
//       .skip((parseInt(page) - 1) * parseInt(limit))
//       .limit(parseInt(limit))
//       .populate('postId', 'title slug');

//     const total = await models.Booking.countDocuments(query);

//     res.json({
//       success: true,
//       data: bookings,
//       total,
//       totalPages: Math.ceil(total / parseInt(limit)),
//       currentPage: parseInt(page)
//     });
//   } catch (error) {
//     console.error('Get bookings by email error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching bookings by email'
//     });
//   }
// };

// // Admin: Get booking by ID
// exports.getBookingById = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     const booking = await models.Booking.findById(id)
//       .populate('postId', 'title slug category');

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
//     const { id } = req.params;
//     const { status, notes, meetingLink } = req.body;

//     // Validate status
//     const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
//     if (status && !validStatuses.includes(status)) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid status. Must be: pending, confirmed, cancelled, or completed'
//       });
//     }

//     const booking = await models.Booking.findById(id);
//     if (!booking) {
//       return res.status(404).json({
//         success: false,
//         message: 'Booking not found'
//       });
//     }

//     const oldStatus = booking.status;

//     // Update fields
//     const updates = {};
//     if (status) updates.status = status;
//     if (notes !== undefined) updates.notes = notes;
//     if (meetingLink !== undefined) updates.meetingLink = meetingLink;

//     const updatedBooking = await models.Booking.findByIdAndUpdate(
//       id,
//       updates,
//       { new: true, runValidators: true }
//     ).populate('postId', 'title');

//     // Send status update email to client
//     if (status && status !== oldStatus) {
//       emailService.sendStatusUpdate(updatedBooking, oldStatus, status, notes, meetingLink)
//         .catch(err => console.error('Error sending status update email:', err));
//     }

//     res.json({
//       success: true,
//       message: `Booking status updated to ${status}`,
//       data: updatedBooking
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
//           count: { $sum: 1 }
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










// const models = require('../models/Services');
// const nodemailer = require('nodemailer');
// const validator = require('validator');
// const moment = require('moment');

// /* =====================================================
//    EMAIL TRANSPORTER
// ===================================================== */
// const createTransporter = () => {
//   return nodemailer.createTransport({
//     host: process.env.SMTP_HOST,
//     port: parseInt(process.env.SMTP_PORT),
//     secure: false,
//     auth: {
//       user: process.env.SMTP_USER,
//       pass: process.env.SMTP_PASS
//     },
//     tls: {
//       rejectUnauthorized: false
//     }
//   });
// };

// /* =====================================================
//    EMAIL SERVICE
// ===================================================== */
// const emailService = {
//   sendEmail: async (to, subject, html, isAdminNotification = false) => {
//     try {
//       const transporter = createTransporter();
      
//       const info = await transporter.sendMail({
//         from: `"${process.env.COMPANY_NAME || 'REC APPLY'} Services" <${process.env.EMAIL_FROM}>`,
//         to,
//         subject,
//         html
//       });
      
//       console.log('Email sent successfully to:', to, 'Message ID:', info.messageId);
//       return { success: true, messageId: info.messageId };
//     } catch (error) {
//       console.error('Email sending error:', error);
//       return { success: false, error: error.message };
//     }
//   },

//   // Send booking confirmation to user
//   sendUserConfirmation: async (booking) => {
//     const bookingId = booking._id.toString().substring(0, 8).toUpperCase();
//     const subject = `Booking Confirmation #${bookingId} - ${booking.service}`;
    
//     const statusColors = {
//       pending: '#FFC107',
//       confirmed: '#4CAF50',
//       cancelled: '#f44336',
//       completed: '#2196f3'
//     };

//     const statusColor = statusColors[booking.status] || '#666';
    
//     const html = `
//       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f4f4; padding: 20px;">
//         <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
//           <h1 style="color: white; margin: 0; font-size: 28px;">${process.env.COMPANY_NAME || 'REC APPLY'}</h1>
//           <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Booking Confirmation</p>
//         </div>
        
//         <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
//           <h2 style="color: #333; margin-top: 0; border-bottom: 2px solid #f0f0f0; padding-bottom: 15px;">
//             Thank You for Your Booking! 📅
//           </h2>
          
//           <p style="font-size: 16px; line-height: 1.6; color: #555;">Dear ${booking.name},</p>
          
//           <p style="font-size: 16px; line-height: 1.6; color: #555;">Your booking request has been received and is being processed. Here are your booking details:</p>
          
//           <div style="background-color: #f0f7ff; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #667eea;">
//             <h3 style="margin-top: 0; color: #667eea; font-size: 20px;">Booking Reference: #${bookingId}</h3>
            
//             <table style="width: 100%; border-collapse: collapse;">
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Service:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">
//                   <span style="background-color: #e3f2fd; color: #1976d2; padding: 3px 10px; border-radius: 12px; font-size: 12px;">
//                     ${booking.service.charAt(0).toUpperCase() + booking.service.slice(1)}
//                   </span>
//                 </td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Date:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${moment(booking.date).format('dddd, MMMM Do YYYY')}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Time:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${booking.scheduledTime || 'To be confirmed'}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Duration:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${booking.duration || '1 hour'}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Meeting Type:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">
//                   <span style="background-color: ${booking.meetingType === 'online' ? '#e8f5e8' : '#fff3e0'}; color: ${booking.meetingType === 'online' ? '#4CAF50' : '#f39c12'}; padding: 3px 10px; border-radius: 12px; font-size: 12px;">
//                     ${booking.meetingType?.toUpperCase() || 'ONLINE'}
//                   </span>
//                 </td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Country:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${booking.country}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Phone:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${booking.phone}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Status:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">
//                   <span style="background-color: ${statusColor}; color: white; padding: 3px 10px; border-radius: 12px; font-size: 12px;">
//                     ${booking.status.toUpperCase()}
//                   </span>
//                 </td>
//               </tr>
//             </table>
            
//             ${booking.message ? `
//               <div style="margin-top: 15px;">
//                 <strong style="color: #666;">Your Message:</strong>
//                 <p style="color: #555; font-style: italic; margin: 5px 0 0 0; background-color: white; padding: 10px; border-radius: 5px;">${booking.message}</p>
//               </div>
//             ` : ''}
//           </div>
          
//           <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
//             <h4 style="margin-top: 0; color: #333;">What Happens Next?</h4>
//             <ol style="margin: 5px 0 0 0; color: #555;">
//               <li style="margin: 5px 0;">Our team will review your booking within 24 hours</li>
//               <li style="margin: 5px 0;">You'll receive a confirmation email with meeting details</li>
//               <li style="margin: 5px 0;">A calendar invitation will be sent to your email</li>
//               <li style="margin: 5px 0;">You can reschedule or cancel up to 24 hours in advance</li>
//             </ol>
//           </div>
          
//           <hr style="border: none; border-top: 2px solid #f0f0f0; margin: 30px 0;">
          
//           <div style="text-align: center;">
//             <p style="color: #666; font-size: 14px; line-height: 1.6;">
//               We look forward to connecting with you!<br>
//               If you have any questions, please reply to this email.
//             </p>
//           </div>
//         </div>
        
//         <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
//           © ${new Date().getFullYear()} ${process.env.COMPANY_NAME || 'REC APPLY'}. All rights reserved.<br>
//           This is an automated message, please do not reply to this email.
//         </div>
//       </div>
//     `;

//     return await this.sendEmail(booking.email, subject, html);
//   },

//   // Send admin notification for new booking
//   sendAdminNotification: async (booking, req) => {
//     const bookingId = booking._id.toString().substring(0, 8).toUpperCase();
//     const subject = `📋 New Booking: ${booking.name} - ${booking.service}`;
    
//     const html = `
//       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f4f4; padding: 20px;">
//         <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
//           <h1 style="color: white; margin: 0; font-size: 28px;">${process.env.COMPANY_NAME || 'REC APPLY'}</h1>
//           <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Admin Notification - New Booking</p>
//         </div>
        
//         <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
//           <h2 style="color: #333; margin-top: 0; border-bottom: 2px solid #f0f0f0; padding-bottom: 15px;">
//             New Booking Alert! 📅
//           </h2>
          
//           <div style="background-color: #fff3e0; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #f5576c;">
//             <h3 style="margin-top: 0; color: #f5576c; font-size: 20px;">Booking Reference: #${bookingId}</h3>
            
//             <h4 style="color: #333; margin: 15px 0 5px 0;">Client Details</h4>
//             <table style="width: 100%; border-collapse: collapse;">
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Name:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${booking.name}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Email:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${booking.email}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Phone:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${booking.phone}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Country:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${booking.country}</td>
//               </tr>
//             </table>
            
//             <h4 style="color: #333; margin: 15px 0 5px 0;">Booking Details</h4>
//             <table style="width: 100%; border-collapse: collapse;">
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Service:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${booking.service}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Date:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${moment(booking.date).format('dddd, MMMM Do YYYY')}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Time:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${booking.scheduledTime || 'Not specified'}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Duration:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${booking.duration || '1 hour'}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Meeting Type:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${booking.meetingType || 'online'}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Status:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">
//                   <span style="background-color: #FFC107; color: #333; padding: 3px 10px; border-radius: 12px; font-size: 12px;">
//                     ${booking.status}
//                   </span>
//                 </td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Booking Date:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${moment(booking.createdAt).format('MMMM Do YYYY, h:mm a')}</td>
//               </tr>
//             </table>
            
//             ${booking.postTitle ? `
//               <h4 style="color: #333; margin: 15px 0 5px 0;">Related Content</h4>
//               <p style="margin: 5px 0; color: #555;"><strong>Post Title:</strong> ${booking.postTitle}</p>
//               <p style="margin: 5px 0; color: #555;"><strong>Post ID:</strong> ${booking.postId}</p>
//             ` : ''}
            
//             ${booking.message ? `
//               <h4 style="color: #333; margin: 15px 0 5px 0;">Client Message</h4>
//               <div style="background-color: #fff9e6; padding: 15px; border-radius: 5px;">
//                 <p style="color: #555; margin: 0;">${booking.message}</p>
//               </div>
//             ` : ''}
            
//             <h4 style="color: #333; margin: 15px 0 5px 0;">Client Information</h4>
//             <table style="width: 100%; border-collapse: collapse;">
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>IP Address:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${req.ip}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>User Agent:</strong></td>
//                 <td style="padding: 8px 0; color: #333; font-size: 11px;">${req.get('user-agent')}</td>
//               </tr>
//             </table>
//           </div>
          
//           <hr style="border: none; border-top: 2px solid #f0f0f0; margin: 30px 0;">
          
//           <div style="text-align: center;">
//             <p style="color: #666; font-size: 14px; line-height: 1.6;">
//               Please review this booking and respond within 24 hours.<br>
//               This is an automated admin notification from ${process.env.COMPANY_NAME || 'REC APPLY'}.
//             </p>
//           </div>
//         </div>
        
//         <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
//           © ${new Date().getFullYear()} ${process.env.COMPANY_NAME || 'REC APPLY'}. All rights reserved.
//         </div>
//       </div>
//     `;

//     return await this.sendEmail(process.env.ADMIN_EMAIL, subject, html);
//   },

//   // Send status update notification to user
//   sendStatusUpdate: async (booking, oldStatus, newStatus, notes, meetingLink) => {
//     const bookingId = booking._id.toString().substring(0, 8).toUpperCase();
//     const subject = `Booking Status Update #${bookingId} - ${newStatus}`;
    
//     const statusColors = {
//       pending: '#FFC107',
//       confirmed: '#4CAF50',
//       cancelled: '#f44336',
//       completed: '#2196f3'
//     };

//     const oldColor = statusColors[oldStatus] || '#666';
//     const newColor = statusColors[newStatus] || '#666';
    
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
          
//           <p style="font-size: 16px; line-height: 1.6; color: #555;">Dear ${booking.name},</p>
          
//           <p style="font-size: 16px; line-height: 1.6; color: #555;">The status of your booking has been updated:</p>
          
//           <div style="background-color: #f9f9f9; padding: 30px; text-align: center; border-radius: 5px; margin: 20px 0;">
//             <div style="display: inline-block; background-color: ${oldColor}20; padding: 15px 30px; border-radius: 5px; margin-right: 10px;">
//               <span style="color: ${oldColor}; font-weight: bold;">${oldStatus.toUpperCase()}</span>
//             </div>
//             <span style="font-size: 24px; color: #999; margin: 0 15px;">→</span>
//             <div style="display: inline-block; background-color: ${newColor}20; padding: 15px 30px; border-radius: 5px;">
//               <span style="color: ${newColor}; font-weight: bold;">${newStatus.toUpperCase()}</span>
//             </div>
//           </div>
          
//           <div style="background-color: #f0f7ff; padding: 20px; border-radius: 5px; margin: 20px 0;">
//             <h4 style="margin-top: 0; color: #333;">Booking Details</h4>
//             <p style="margin: 5px 0; color: #555;"><strong>Booking Reference:</strong> #${bookingId}</p>
//             <p style="margin: 5px 0; color: #555;"><strong>Service:</strong> ${booking.service}</p>
//             <p style="margin: 5px 0; color: #555;"><strong>Date:</strong> ${moment(booking.date).format('dddd, MMMM Do YYYY')}</p>
//             <p style="margin: 5px 0; color: #555;"><strong>Time:</strong> ${booking.scheduledTime || 'To be confirmed'}</p>
//             <p style="margin: 5px 0; color: #555;"><strong>Status:</strong> 
//               <span style="background-color: ${newColor}; color: white; padding: 3px 10px; border-radius: 12px; font-size: 12px;">
//                 ${newStatus.toUpperCase()}
//               </span>
//             </p>
            
//             ${notes ? `
//               <div style="margin-top: 15px;">
//                 <strong style="color: #666;">Notes from our team:</strong>
//                 <p style="color: #555; margin: 5px 0 0 0; background-color: white; padding: 10px; border-radius: 5px;">${notes}</p>
//               </div>
//             ` : ''}
            
//             ${meetingLink ? `
//               <div style="margin-top: 15px;">
//                 <strong style="color: #666;">Meeting Link:</strong>
//                 <p style="color: #555; margin: 5px 0 0 0; background-color: white; padding: 10px; border-radius: 5px; word-break: break-all;">${meetingLink}</p>
//               </div>
//             ` : ''}
//           </div>
          
//           ${newStatus === 'confirmed' ? `
//             <div style="background-color: #e8f5e8; padding: 15px; border-radius: 5px; margin: 20px 0;">
//               <h4 style="margin-top: 0; color: #4CAF50;">✅ Next Steps</h4>
//               <ol style="margin: 5px 0 0 0; color: #555;">
//                 <li>Please save the date: ${moment(booking.date).format('dddd, MMMM Do YYYY')}</li>
//                 <li>Add the meeting to your calendar</li>
//                 ${meetingLink ? '<li>Use the meeting link above to join at the scheduled time</li>' : '<li>Meeting details will be sent separately</li>'}
//                 <li>If you need to reschedule, please contact us at least 24 hours in advance</li>
//               </ol>
//             </div>
//           ` : ''}
          
//           ${newStatus === 'cancelled' ? `
//             <div style="background-color: #ffebee; padding: 15px; border-radius: 5px; margin: 20px 0;">
//               <h4 style="margin-top: 0; color: #f44336;">ℹ️ Important</h4>
//               <p style="margin: 5px 0; color: #555;">We're sorry to see you go. If you'd like to reschedule or have any questions, please reply to this email.</p>
//             </div>
//           ` : ''}
          
//           ${newStatus === 'completed' ? `
//             <div style="background-color: #e3f2fd; padding: 15px; border-radius: 5px; margin: 20px 0;">
//               <h4 style="margin-top: 0; color: #2196f3;">🎉 Thank You!</h4>
//               <p style="margin: 5px 0; color: #555;">We hope your session was valuable. We'd love to hear your feedback!</p>
//             </div>
//           ` : ''}
          
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

//     return await this.sendEmail(booking.email, subject, html);
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
//       statData.ip = req.ip || req.connection.remoteAddress;
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
// exports.createBooking = async (req, res) => {
//   try {
//     const { 
//       name, 
//       email, 
//       phone, 
//       country, 
//       service, 
//       date, 
//       message, 
//       postTitle, 
//       postId,
//       scheduledTime,
//       duration,
//       meetingType
//     } = req.body;

//     // Validate required fields
//     if (!name || !email || !phone || !country || !service || !date) {
//       return res.status(400).json({
//         success: false,
//         message: 'Name, email, phone, country, service, and date are required'
//       });
//     }

//     // Validate email
//     if (!validator.isEmail(email)) {
//       return res.status(400).json({
//         success: false,
//         message: 'Please provide a valid email address'
//       });
//     }

//     // Validate date
//     const bookingDate = new Date(date);
//     if (isNaN(bookingDate.getTime())) {
//       return res.status(400).json({
//         success: false,
//         message: 'Please provide a valid date'
//       });
//     }

//     // Check if date is in the future
//     if (bookingDate < new Date()) {
//       return res.status(400).json({
//         success: false,
//         message: 'Booking date must be in the future'
//       });
//     }

//     // Validate service
//     const validServices = ['consultation', 'workshop', 'training', 'speaking', 'other'];
//     if (!validServices.includes(service)) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid service type'
//       });
//     }

//     // Create booking
//     const booking = new models.Booking({
//       name: name.trim(),
//       email: email.toLowerCase().trim(),
//       phone: phone.trim(),
//       country: country.trim(),
//       service,
//       date: bookingDate,
//       message: message ? message.trim() : '',
//       postTitle,
//       postId,
//       scheduledTime: scheduledTime || '10:00 AM',
//       duration: duration || '1 hour',
//       meetingType: meetingType || 'online',
//       status: 'pending'
//     });

//     await booking.save();

//     // Track event
//     await trackEvent('booking', {
//       bookingId: booking._id,
//       service,
//       country,
//       name: booking.name
//     }, req);

//     // Send email notifications (fire and forget)
//     Promise.allSettled([
//       emailService.sendUserConfirmation(booking),
//       emailService.sendAdminNotification(booking, req)
//     ]).then(results => {
//       console.log('Email notifications sent:', results.map(r => r.status));
//     }).catch(err => {
//       console.error('Error sending notification emails:', err);
//     });

//     res.status(201).json({
//       success: true,
//       message: 'Booking submitted successfully',
//       data: {
//         _id: booking._id,
//         name: booking.name,
//         service: booking.service,
//         date: booking.date,
//         status: booking.status,
//         bookingId: booking._id.toString().substring(0, 8).toUpperCase()
//       }
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

//     // Filter by status
//     if (status && status !== 'all') {
//       query.status = status;
//     }

//     // Filter by service
//     if (service && service !== 'all') {
//       query.service = service;
//     }

//     // Filter by country
//     if (country && country !== 'all') {
//       query.country = country;
//     }

//     // Filter by date range
//     if (startDate || endDate) {
//       query.date = {};
//       if (startDate) {
//         query.date.$gte = new Date(startDate);
//       }
//       if (endDate) {
//         query.date.$lte = new Date(endDate);
//       }
//     }

//     // Search by name, email, or phone
//     if (search) {
//       query.$or = [
//         { name: { $regex: search, $options: 'i' } },
//         { email: { $regex: search, $options: 'i' } },
//         { phone: { $regex: search, $options: 'i' } }
//       ];
//     }

//     const bookings = await models.Booking.find(query)
//       .sort('-createdAt')
//       .skip((parseInt(page) - 1) * parseInt(limit))
//       .limit(parseInt(limit))
//       .populate('postId', 'title slug');

//     const total = await models.Booking.countDocuments(query);

//     // Get available filters data
//     const services = await models.Booking.distinct('service');
//     const countries = await models.Booking.distinct('country');
//     const statuses = ['pending', 'confirmed', 'cancelled', 'completed'];

//     res.json({
//       success: true,
//       data: bookings,
//       total,
//       totalPages: Math.ceil(total / parseInt(limit)),
//       currentPage: parseInt(page),
//       filters: {
//         services,
//         countries,
//         statuses
//       }
//     });
//   } catch (error) {
//     console.error('Get bookings error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching bookings'
//     });
//   }
// };

// // Get bookings by email
// exports.getBookingsByEmail = async (req, res) => {
//   try {
//     const { email } = req.params;
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

//     const query = { email: email.toLowerCase() };

//     // Apply same filters as getAllBookings
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
//         { name: { $regex: search, $options: 'i' } },
//         { email: { $regex: search, $options: 'i' } },
//         { phone: { $regex: search, $options: 'i' } }
//       ];
//     }

//     const bookings = await models.Booking.find(query)
//       .sort('-createdAt')
//       .skip((parseInt(page) - 1) * parseInt(limit))
//       .limit(parseInt(limit))
//       .populate('postId', 'title slug');

//     const total = await models.Booking.countDocuments(query);

//     res.json({
//       success: true,
//       data: bookings,
//       total,
//       totalPages: Math.ceil(total / parseInt(limit)),
//       currentPage: parseInt(page)
//     });
//   } catch (error) {
//     console.error('Get bookings by email error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching bookings by email'
//     });
//   }
// };

// // Admin: Get booking by ID
// exports.getBookingById = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     const booking = await models.Booking.findById(id)
//       .populate('postId', 'title slug category');

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
//     const { id } = req.params;
//     const { status, notes, meetingLink } = req.body;

//     // Validate status
//     const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
//     if (status && !validStatuses.includes(status)) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid status. Must be: pending, confirmed, cancelled, or completed'
//       });
//     }

//     const booking = await models.Booking.findById(id);
//     if (!booking) {
//       return res.status(404).json({
//         success: false,
//         message: 'Booking not found'
//       });
//     }

//     const oldStatus = booking.status;

//     // Update fields
//     const updates = {};
//     if (status) updates.status = status;
//     if (notes !== undefined) updates.notes = notes;
//     if (meetingLink !== undefined) updates.meetingLink = meetingLink;

//     const updatedBooking = await models.Booking.findByIdAndUpdate(
//       id,
//       updates,
//       { new: true, runValidators: true }
//     ).populate('postId', 'title');

//     // Send status update email to client
//     if (status && status !== oldStatus) {
//       emailService.sendStatusUpdate(updatedBooking, oldStatus, status, notes, meetingLink)
//         .catch(err => console.error('Error sending status update email:', err));
//     }

//     res.json({
//       success: true,
//       message: `Booking status updated to ${status}`,
//       data: updatedBooking
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
//           count: { $sum: 1 }
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
const moment = require('moment');

/* =====================================================
   EMAIL TRANSPORTER
===================================================== */
// const createTransporter = () => {
//   return nodemailer.createTransport({
//     host: process.env.SMTP_HOST,
//     port: parseInt(process.env.SMTP_PORT),
//     secure: false,
//     auth: {
//       user: process.env.SMTP_USER,
//       pass: process.env.SMTP_PASS
//     },
//     tls: {
//       rejectUnauthorized: false
//     }
//   });
// };

const createTransporter = () => {
  const smtpPass = process.env.SMTP_PASS
    ? process.env.SMTP_PASS.toString().trim()
    : "";

  const port = parseInt(process.env.SMTP_PORT) || 587;

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: port,
    secure: false,

    pool: true,
    maxConnections: 5,
    maxMessages: 10,

    auth: {
      user: process.env.SMTP_USER,
      pass: smtpPass,
    },

    tls: {
      rejectUnauthorized: false,
    },

    connectionTimeout: 20000,
    socketTimeout: 30000,
    greetingTimeout: 20000,
  });
};

/* =====================================================
   EMAIL SERVICE
===================================================== */
const emailService = {
  // sendEmail: async (to, subject, html, isAdminNotification = false) => {
  //   const transporter = createTransporter();
    
  //   const info = await transporter.sendMail({
  //     from: `"${process.env.COMPANY_NAME || 'REC APPLY'} Services" <${process.env.EMAIL_FROM}>`,
  //     to,
  //     subject,
  //     html
  //   });
    
  //   console.log('Email sent successfully to:', to, 'Message ID:', info.messageId);
  //   return { success: true, messageId: info.messageId };
  // },

   sendEmail : async (to, subject, html, isAdminNotification = false, retries = 3) => {
  try {
    console.log("📧 Sending email to:", to);

    const transporter = createTransporter();

    // Verify SMTP connection (non-blocking safety check)
    try {
      await transporter.verify();
      console.log("✅ SMTP connection verified");
    } catch (verifyError) {
      console.log("⚠ SMTP verify warning:", verifyError.message);
    }

    const info = await transporter.sendMail({
      from: `"${process.env.COMPANY_NAME || 'REC APPLY'} Airport Services" <${process.env.EMAIL_FROM}>`,
      to,
      subject,
      html
    });

    console.log("✅ Email sent successfully to:", to, "Message ID:", info.messageId);

    return {
      success: true,
      messageId: info.messageId
    };

  } catch (error) {
    console.error("❌ Email send error:", error.message);

    // ⭐ Retry logic for network failures
    if (retries > 0) {
      console.log(`🔁 Retrying email... Attempts left: ${retries}`);

      await new Promise(res => setTimeout(res, 4000));

      return sendEmail(to, subject, html, isAdminNotification, retries - 1);
    }

    throw error;
  }
},

  // Send booking confirmation to user
  sendUserConfirmation: async (booking) => {
    const bookingId = booking._id.toString().substring(0, 8).toUpperCase();
    const subject = `Booking Confirmation #${bookingId} - ${booking.service}`;
    
    const statusColors = {
      pending: '#FFC107',
      confirmed: '#4CAF50',
      cancelled: '#f44336',
      completed: '#2196f3'
    };

    const statusColor = statusColors[booking.status] || '#666';
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f4f4; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">${process.env.COMPANY_NAME || 'REC APPLY'}</h1>
          <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Booking Confirmation</p>
        </div>
        
        <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-top: 0; border-bottom: 2px solid #f0f0f0; padding-bottom: 15px;">
            Thank You for Your Booking! 📅
          </h2>
          
          <p style="font-size: 16px; line-height: 1.6; color: #555;">Dear ${booking.name},</p>
          
          <p style="font-size: 16px; line-height: 1.6; color: #555;">Your booking request has been received and is being processed. Here are your booking details:</p>
          
          <div style="background-color: #f0f7ff; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #667eea;">
            <h3 style="margin-top: 0; color: #667eea; font-size: 20px;">Booking Reference: #${bookingId}</h3>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Service:</strong></td>
                <td style="padding: 8px 0; color: #333;">
                  <span style="background-color: #e3f2fd; color: #1976d2; padding: 3px 10px; border-radius: 12px; font-size: 12px;">
                    ${booking.service.charAt(0).toUpperCase() + booking.service.slice(1)}
                  </span>
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Date:</strong></td>
                <td style="padding: 8px 0; color: #333;">${moment(booking.date).format('dddd, MMMM Do YYYY')}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Time:</strong></td>
                <td style="padding: 8px 0; color: #333;">${booking.scheduledTime || 'To be confirmed'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Duration:</strong></td>
                <td style="padding: 8px 0; color: #333;">${booking.duration || '1 hour'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Meeting Type:</strong></td>
                <td style="padding: 8px 0; color: #333;">
                  <span style="background-color: ${booking.meetingType === 'online' ? '#e8f5e8' : '#fff3e0'}; color: ${booking.meetingType === 'online' ? '#4CAF50' : '#f39c12'}; padding: 3px 10px; border-radius: 12px; font-size: 12px;">
                    ${booking.meetingType?.toUpperCase() || 'ONLINE'}
                  </span>
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Country:</strong></td>
                <td style="padding: 8px 0; color: #333;">${booking.country}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Phone:</strong></td>
                <td style="padding: 8px 0; color: #333;">${booking.phone}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Status:</strong></td>
                <td style="padding: 8px 0; color: #333;">
                  <span style="background-color: ${statusColor}; color: white; padding: 3px 10px; border-radius: 12px; font-size: 12px;">
                    ${booking.status.toUpperCase()}
                  </span>
                </td>
              </tr>
            </table>
            
            ${booking.message ? `
              <div style="margin-top: 15px;">
                <strong style="color: #666;">Your Message:</strong>
                <p style="color: #555; font-style: italic; margin: 5px 0 0 0; background-color: white; padding: 10px; border-radius: 5px;">${booking.message}</p>
              </div>
            ` : ''}
          </div>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h4 style="margin-top: 0; color: #333;">What Happens Next?</h4>
            <ol style="margin: 5px 0 0 0; color: #555;">
              <li style="margin: 5px 0;">Our team will review your booking within 24 hours</li>
              <li style="margin: 5px 0;">You'll receive a confirmation email with meeting details</li>
              <li style="margin: 5px 0;">A calendar invitation will be sent to your email</li>
              <li style="margin: 5px 0;">You can reschedule or cancel up to 24 hours in advance</li>
            </ol>
          </div>
          
          <hr style="border: none; border-top: 2px solid #f0f0f0; margin: 30px 0;">
          
          <div style="text-align: center;">
            <p style="color: #666; font-size: 14px; line-height: 1.6;">
              We look forward to connecting with you!<br>
              If you have any questions, please reply to this email.
            </p>
          </div>
        </div>
        
        <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
          © ${new Date().getFullYear()} ${process.env.COMPANY_NAME || 'REC APPLY'}. All rights reserved.<br>
          This is an automated message, please do not reply to this email.
        </div>
      </div>
    `;

    return await this.sendEmail(booking.email, subject, html);
  },

  // Send admin notification for new booking
  sendAdminNotification: async (booking, req) => {
    const bookingId = booking._id.toString().substring(0, 8).toUpperCase();
    const subject = `📋 New Booking: ${booking.name} - ${booking.service}`;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f4f4; padding: 20px;">
        <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">${process.env.COMPANY_NAME || 'REC APPLY'}</h1>
          <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Admin Notification - New Booking</p>
        </div>
        
        <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-top: 0; border-bottom: 2px solid #f0f0f0; padding-bottom: 15px;">
            New Booking Alert! 📅
          </h2>
          
          <div style="background-color: #fff3e0; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #f5576c;">
            <h3 style="margin-top: 0; color: #f5576c; font-size: 20px;">Booking Reference: #${bookingId}</h3>
            
            <h4 style="color: #333; margin: 15px 0 5px 0;">Client Details</h4>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Name:</strong></td>
                <td style="padding: 8px 0; color: #333;">${booking.name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Email:</strong></td>
                <td style="padding: 8px 0; color: #333;">${booking.email}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Phone:</strong></td>
                <td style="padding: 8px 0; color: #333;">${booking.phone}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Country:</strong></td>
                <td style="padding: 8px 0; color: #333;">${booking.country}</td>
              </tr>
            </table>
            
            <h4 style="color: #333; margin: 15px 0 5px 0;">Booking Details</h4>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Service:</strong></td>
                <td style="padding: 8px 0; color: #333;">${booking.service}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Date:</strong></td>
                <td style="padding: 8px 0; color: #333;">${moment(booking.date).format('dddd, MMMM Do YYYY')}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Time:</strong></td>
                <td style="padding: 8px 0; color: #333;">${booking.scheduledTime || 'Not specified'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Duration:</strong></td>
                <td style="padding: 8px 0; color: #333;">${booking.duration || '1 hour'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Meeting Type:</strong></td>
                <td style="padding: 8px 0; color: #333;">${booking.meetingType || 'online'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Status:</strong></td>
                <td style="padding: 8px 0; color: #333;">
                  <span style="background-color: #FFC107; color: #333; padding: 3px 10px; border-radius: 12px; font-size: 12px;">
                    ${booking.status}
                  </span>
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Booking Date:</strong></td>
                <td style="padding: 8px 0; color: #333;">${moment(booking.createdAt).format('MMMM Do YYYY, h:mm a')}</td>
              </tr>
            </table>
            
            ${booking.postTitle ? `
              <h4 style="color: #333; margin: 15px 0 5px 0;">Related Content</h4>
              <p style="margin: 5px 0; color: #555;"><strong>Post Title:</strong> ${booking.postTitle}</p>
              <p style="margin: 5px 0; color: #555;"><strong>Post ID:</strong> ${booking.postId}</p>
            ` : ''}
            
            ${booking.message ? `
              <h4 style="color: #333; margin: 15px 0 5px 0;">Client Message</h4>
              <div style="background-color: #fff9e6; padding: 15px; border-radius: 5px;">
                <p style="color: #555; margin: 0;">${booking.message}</p>
              </div>
            ` : ''}
            
            <h4 style="color: #333; margin: 15px 0 5px 0;">Client Information</h4>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>IP Address:</strong></td>
                <td style="padding: 8px 0; color: #333;">${req.ip}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>User Agent:</strong></td>
                <td style="padding: 8px 0; color: #333; font-size: 11px;">${req.get('user-agent')}</td>
              </tr>
            </table>
          </div>
          
          <hr style="border: none; border-top: 2px solid #f0f0f0; margin: 30px 0;">
          
          <div style="text-align: center;">
            <p style="color: #666; font-size: 14px; line-height: 1.6;">
              Please review this booking and respond within 24 hours.<br>
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

  // Send status update notification to user
  sendStatusUpdate: async (booking, oldStatus, newStatus, notes, meetingLink) => {
    const bookingId = booking._id.toString().substring(0, 8).toUpperCase();
    const subject = `Booking Status Update #${bookingId} - ${newStatus}`;
    
    const statusColors = {
      pending: '#FFC107',
      confirmed: '#4CAF50',
      cancelled: '#f44336',
      completed: '#2196f3'
    };

    const oldColor = statusColors[oldStatus] || '#666';
    const newColor = statusColors[newStatus] || '#666';
    
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
          
          <p style="font-size: 16px; line-height: 1.6; color: #555;">Dear ${booking.name},</p>
          
          <p style="font-size: 16px; line-height: 1.6; color: #555;">The status of your booking has been updated:</p>
          
          <div style="background-color: #f9f9f9; padding: 30px; text-align: center; border-radius: 5px; margin: 20px 0;">
            <div style="display: inline-block; background-color: ${oldColor}20; padding: 15px 30px; border-radius: 5px; margin-right: 10px;">
              <span style="color: ${oldColor}; font-weight: bold;">${oldStatus.toUpperCase()}</span>
            </div>
            <span style="font-size: 24px; color: #999; margin: 0 15px;">→</span>
            <div style="display: inline-block; background-color: ${newColor}20; padding: 15px 30px; border-radius: 5px;">
              <span style="color: ${newColor}; font-weight: bold;">${newStatus.toUpperCase()}</span>
            </div>
          </div>
          
          <div style="background-color: #f0f7ff; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h4 style="margin-top: 0; color: #333;">Booking Details</h4>
            <p style="margin: 5px 0; color: #555;"><strong>Booking Reference:</strong> #${bookingId}</p>
            <p style="margin: 5px 0; color: #555;"><strong>Service:</strong> ${booking.service}</p>
            <p style="margin: 5px 0; color: #555;"><strong>Date:</strong> ${moment(booking.date).format('dddd, MMMM Do YYYY')}</p>
            <p style="margin: 5px 0; color: #555;"><strong>Time:</strong> ${booking.scheduledTime || 'To be confirmed'}</p>
            <p style="margin: 5px 0; color: #555;"><strong>Status:</strong> 
              <span style="background-color: ${newColor}; color: white; padding: 3px 10px; border-radius: 12px; font-size: 12px;">
                ${newStatus.toUpperCase()}
              </span>
            </p>
            
            ${notes ? `
              <div style="margin-top: 15px;">
                <strong style="color: #666;">Notes from our team:</strong>
                <p style="color: #555; margin: 5px 0 0 0; background-color: white; padding: 10px; border-radius: 5px;">${notes}</p>
              </div>
            ` : ''}
            
            ${meetingLink ? `
              <div style="margin-top: 15px;">
                <strong style="color: #666;">Meeting Link:</strong>
                <p style="color: #555; margin: 5px 0 0 0; background-color: white; padding: 10px; border-radius: 5px; word-break: break-all;">${meetingLink}</p>
              </div>
            ` : ''}
          </div>
          
          ${newStatus === 'confirmed' ? `
            <div style="background-color: #e8f5e8; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h4 style="margin-top: 0; color: #4CAF50;">✅ Next Steps</h4>
              <ol style="margin: 5px 0 0 0; color: #555;">
                <li>Please save the date: ${moment(booking.date).format('dddd, MMMM Do YYYY')}</li>
                <li>Add the meeting to your calendar</li>
                ${meetingLink ? '<li>Use the meeting link above to join at the scheduled time</li>' : '<li>Meeting details will be sent separately</li>'}
                <li>If you need to reschedule, please contact us at least 24 hours in advance</li>
              </ol>
            </div>
          ` : ''}
          
          ${newStatus === 'cancelled' ? `
            <div style="background-color: #ffebee; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h4 style="margin-top: 0; color: #f44336;">ℹ️ Important</h4>
              <p style="margin: 5px 0; color: #555;">We're sorry to see you go. If you'd like to reschedule or have any questions, please reply to this email.</p>
            </div>
          ` : ''}
          
          ${newStatus === 'completed' ? `
            <div style="background-color: #e3f2fd; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h4 style="margin-top: 0; color: #2196f3;">🎉 Thank You!</h4>
              <p style="margin: 5px 0; color: #555;">We hope your session was valuable. We'd love to hear your feedback!</p>
            </div>
          ` : ''}
          
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

    return await this.sendEmail(booking.email, subject, html);
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

// =========== BOOKING CONTROLLERS ===========

// Create booking (public)
exports.createBooking = async (req, res) => {
  try {
    const { 
      name, 
      email, 
      phone, 
      country, 
      service, 
      date, 
      message, 
      postTitle, 
      postId,
      scheduledTime,
      duration,
      meetingType
    } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !country || !service || !date) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, phone, country, service, and date are required'
      });
    }

    // Validate email
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // Validate date
    const bookingDate = new Date(date);
    if (isNaN(bookingDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid date'
      });
    }

    // Check if date is in the future
    if (bookingDate < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Booking date must be in the future'
      });
    }

    // Validate service
    const validServices = ['consultation', 'workshop', 'training', 'speaking', 'other'];
    if (!validServices.includes(service)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid service type'
      });
    }

    // Create booking
    const booking = new models.Booking({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      country: country.trim(),
      service,
      date: bookingDate,
      message: message ? message.trim() : '',
      postTitle,
      postId,
      scheduledTime: scheduledTime || '10:00 AM',
      duration: duration || '1 hour',
      meetingType: meetingType || 'online',
      status: 'pending'
    });

    await booking.save();

    // Track event
    await trackEvent('booking', {
      bookingId: booking._id,
      service,
      country,
      name: booking.name
    }, req);

    // Send email notifications
    await emailService.sendUserConfirmation(booking);
    await emailService.sendAdminNotification(booking, req);

    res.status(201).json({
      success: true,
      message: 'Booking submitted successfully',
      data: {
        _id: booking._id,
        name: booking.name,
        service: booking.service,
        date: booking.date,
        status: booking.status,
        bookingId: booking._id.toString().substring(0, 8).toUpperCase()
      }
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting booking'
    });
  }
};

// Admin: Get all bookings
exports.getAllBookings = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      status, 
      service, 
      country,
      startDate, 
      endDate,
      search 
    } = req.query;
    
    const query = {};

    // Filter by status
    if (status && status !== 'all') {
      query.status = status;
    }

    // Filter by service
    if (service && service !== 'all') {
      query.service = service;
    }

    // Filter by country
    if (country && country !== 'all') {
      query.country = country;
    }

    // Filter by date range
    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = new Date(startDate);
      }
      if (endDate) {
        query.date.$lte = new Date(endDate);
      }
    }

    // Search by name, email, or phone
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    const bookings = await models.Booking.find(query)
      .sort('-createdAt')
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit))
      .populate('postId', 'title slug');

    const total = await models.Booking.countDocuments(query);

    // Get available filters data
    const services = await models.Booking.distinct('service');
    const countries = await models.Booking.distinct('country');
    const statuses = ['pending', 'confirmed', 'cancelled', 'completed'];

    res.json({
      success: true,
      data: bookings,
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      filters: {
        services,
        countries,
        statuses
      }
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching bookings'
    });
  }
};

// Get bookings by email
exports.getBookingsByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const { 
      page = 1, 
      limit = 20, 
      status, 
      service, 
      country,
      startDate, 
      endDate,
      search 
    } = req.query;

    const query = { email: email.toLowerCase() };

    // Apply same filters as getAllBookings
    if (status && status !== 'all') query.status = status;
    if (service && service !== 'all') query.service = service;
    if (country && country !== 'all') query.country = country;

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    const bookings = await models.Booking.find(query)
      .sort('-createdAt')
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit))
      .populate('postId', 'title slug');

    const total = await models.Booking.countDocuments(query);

    res.json({
      success: true,
      data: bookings,
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page)
    });
  } catch (error) {
    console.error('Get bookings by email error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching bookings by email'
    });
  }
};

// Admin: Get booking by ID
exports.getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const booking = await models.Booking.findById(id)
      .populate('postId', 'title slug category');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching booking'
    });
  }
};

// Admin: Update booking status
exports.updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes, meetingLink } = req.body;

    // Validate status
    const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be: pending, confirmed, cancelled, or completed'
      });
    }

    const booking = await models.Booking.findById(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    const oldStatus = booking.status;

    // Update fields
    const updates = {};
    if (status) updates.status = status;
    if (notes !== undefined) updates.notes = notes;
    if (meetingLink !== undefined) updates.meetingLink = meetingLink;

    const updatedBooking = await models.Booking.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    ).populate('postId', 'title');

    // Send status update email to client
    if (status && status !== oldStatus) {
      await emailService.sendStatusUpdate(updatedBooking, oldStatus, status, notes, meetingLink);
    }

    res.json({
      success: true,
      message: `Booking status updated to ${status}`,
      data: updatedBooking
    });
  } catch (error) {
    console.error('Update booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating booking'
    });
  }
};

// Admin: Delete booking
exports.deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    
    const booking = await models.Booking.findByIdAndDelete(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.json({
      success: true,
      message: 'Booking deleted successfully'
    });
  } catch (error) {
    console.error('Delete booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting booking'
    });
  }
};

// Admin: Get booking statistics
exports.getBookingStats = async (req, res) => {
  try {
    const { period = '30d' } = req.query;
    let startDate = new Date();
    
    // Calculate start date based on period
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

    // Get total counts
    const totalBookings = await models.Booking.countDocuments();
    const pendingBookings = await models.Booking.countDocuments({ status: 'pending' });
    const confirmedBookings = await models.Booking.countDocuments({ status: 'confirmed' });
    const cancelledBookings = await models.Booking.countDocuments({ status: 'cancelled' });
    const completedBookings = await models.Booking.countDocuments({ status: 'completed' });

    // Get bookings by service
    const bookingsByService = await models.Booking.aggregate([
      {
        $group: {
          _id: '$service',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Get bookings by country
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

    // Get bookings by date (for chart)
    const bookingsByDate = await models.Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Get recent bookings
    const recentBookings = await models.Booking.find()
      .sort('-createdAt')
      .limit(10)
      .select('name email service status date createdAt');

    res.json({
      success: true,
      data: {
        total: totalBookings,
        pending: pendingBookings,
        confirmed: confirmedBookings,
        cancelled: cancelledBookings,
        completed: completedBookings,
        stats: {
          conversionRate: totalBookings > 0 ? 
            ((confirmedBookings + completedBookings) / totalBookings * 100).toFixed(1) : 0,
          cancellationRate: totalBookings > 0 ? 
            (cancelledBookings / totalBookings * 100).toFixed(1) : 0
        },
        bookingsByService,
        bookingsByCountry,
        bookingsByDate,
        recentBookings,
        period
      }
    });
  } catch (error) {
    console.error('Get booking stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching booking statistics'
    });
  }
};

// Admin: Bulk update bookings
exports.bulkUpdateBookings = async (req, res) => {
  try {
    const { bookingIds, action, status, notes } = req.body;

    if (!bookingIds || !Array.isArray(bookingIds) || bookingIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of booking IDs'
      });
    }

    let updateData = {};
    let message = '';

    switch (action) {
      case 'confirm':
        updateData = { status: 'confirmed' };
        message = 'Bookings confirmed';
        break;
      case 'cancel':
        updateData = { status: 'cancelled' };
        message = 'Bookings cancelled';
        break;
      case 'complete':
        updateData = { status: 'completed' };
        message = 'Bookings marked as completed';
        break;
      case 'addNotes':
        if (!notes) {
          return res.status(400).json({
            success: false,
            message: 'Notes are required for this action'
          });
        }
        updateData = { notes };
        message = 'Notes added to bookings';
        break;
      case 'delete':
        await models.Booking.deleteMany({ _id: { $in: bookingIds } });
        return res.json({
          success: true,
          message: 'Bookings deleted successfully',
          count: bookingIds.length
        });
      default:
        if (status) {
          updateData = { status };
          message = `Bookings status updated to ${status}`;
        } else {
          return res.status(400).json({
            success: false,
            message: 'Invalid action or status'
          });
        }
    }

    const result = await models.Booking.updateMany(
      { _id: { $in: bookingIds } },
      updateData
    );

    res.json({
      success: true,
      message: `${message} successfully`,
      count: result.modifiedCount
    });
  } catch (error) {
    console.error('Bulk update bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating bookings'
    });
  }
};