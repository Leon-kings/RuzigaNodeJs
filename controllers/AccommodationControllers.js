
// const { Accommodation, Booking } = require('../models/Accommodation');
// const mongoose = require('mongoose');
// const nodemailer = require('nodemailer');
// const { 
//   generateThumbnailUrl, 
//   deleteImageFromCloudinary 
// } = require('../services/accomodationCloudinaryConfig');

// // -------------------- EMAIL TRANSPORTER --------------------
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

// // -------------------- EMAIL SERVICE --------------------
// const emailService = {
//   // Send email helper
//   sendEmail: async (to, subject, html, isAdminNotification = false) => {
//     // Skip emails if SKIP_EMAILS is true (for development)
//     if (process.env.SKIP_EMAILS === 'true' && !isAdminNotification) {
//       console.log('Email sending skipped (SKIP_EMAILS=true)');
//       return { success: true, skipped: true };
//     }

//     try {
//       const transporter = createTransporter();
      
//       const info = await transporter.sendMail({
//         from: `"${process.env.COMPANY_NAME || 'REC APPLY'} Accommodation" <${process.env.EMAIL_FROM}>`,
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

//   // Send booking confirmation to customer
//   sendBookingConfirmation: async (booking, accommodation) => {
//     const subject = `Booking Confirmed - ${booking.bookingReference || 'New Booking'}`;
    
//     const html = `
//       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f4f4; padding: 20px;">
//         <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
//           <h1 style="color: white; margin: 0; font-size: 28px;">${process.env.COMPANY_NAME || 'REC APPLY'}</h1>
//           <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Booking Confirmation</p>
//         </div>
        
//         <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
//           <h2 style="color: #333; margin-top: 0; border-bottom: 2px solid #f0f0f0; padding-bottom: 15px;">
//             Thank You for Your Booking! 🎉
//           </h2>
          
//           <p style="font-size: 16px; line-height: 1.6; color: #555;">Dear ${booking.customer?.name || 'Customer'},</p>
          
//           <p style="font-size: 16px; line-height: 1.6; color: #555;">Your booking has been confirmed successfully. Here are your booking details:</p>
          
//           <div style="background-color: #f0f7ff; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #667eea;">
//             <h3 style="margin-top: 0; color: #667eea; font-size: 20px;">Booking Reference: ${booking.bookingReference || 'N/A'}</h3>
            
//             <table style="width: 100%; border-collapse: collapse;">
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Accommodation:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${accommodation.name}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Location:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${accommodation.location || 'Not specified'}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Check-in Date:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${booking.checkIn ? new Date(booking.checkIn).toLocaleDateString() : 'Not specified'}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Check-out Date:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${booking.checkOut ? new Date(booking.checkOut).toLocaleDateString() : 'Not specified'}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Number of Guests:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${booking.guests || 1}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Total Price:</strong></td>
//                 <td style="padding: 8px 0; color: #333; font-weight: bold;">$${booking.totalPrice || accommodation.price || '0'}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Status:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">
//                   <span style="background-color: #4CAF50; color: white; padding: 3px 10px; border-radius: 12px; font-size: 12px;">
//                     ${booking.status || 'Confirmed'}
//                   </span>
//                 </td>
//               </tr>
//             </table>
            
//             ${booking.specialRequests ? `
//               <div style="margin-top: 15px;">
//                 <strong style="color: #666;">Special Requests:</strong>
//                 <p style="color: #555; font-style: italic; margin: 5px 0 0 0; background-color: white; padding: 10px; border-radius: 5px;">${booking.specialRequests}</p>
//               </div>
//             ` : ''}
//           </div>
          
//           <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
//             <h4 style="margin-top: 0; color: #333;">Contact Information</h4>
//             <p style="margin: 5px 0; color: #555;"><strong>Email:</strong> ${booking.customer?.email || booking.email}</p>
//             <p style="margin: 5px 0; color: #555;"><strong>Phone:</strong> ${booking.customer?.phone || booking.phone || 'Not provided'}</p>
//           </div>
          
//           <hr style="border: none; border-top: 2px solid #f0f0f0; margin: 30px 0;">
          
//           <div style="text-align: center;">
//             <p style="color: #666; font-size: 14px; line-height: 1.6;">
//               Thank you for choosing ${process.env.COMPANY_NAME || 'REC APPLY'}.<br>
//               We look forward to hosting you!
//             </p>
//           </div>
//         </div>
        
//         <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
//           © ${new Date().getFullYear()} ${process.env.COMPANY_NAME || 'REC APPLY'}. All rights reserved.<br>
//           This is an automated message, please do not reply to this email.
//         </div>
//       </div>
//     `;

//     return await this.sendEmail(booking.customer?.email || booking.email, subject, html);
//   },

//   // Send admin notification for new booking
//   sendAdminNotification: async (booking, accommodation) => {
//     const subject = `New Booking Received - ${booking.bookingReference || 'New Booking'}`;
    
//     const html = `
//       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f4f4; padding: 20px;">
//         <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
//           <h1 style="color: white; margin: 0; font-size: 28px;">${process.env.COMPANY_NAME || 'REC APPLY'}</h1>
//           <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Admin Notification - New Booking</p>
//         </div>
        
//         <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
//           <h2 style="color: #333; margin-top: 0; border-bottom: 2px solid #f0f0f0; padding-bottom: 15px;">
//             New Booking Alert! 🏨
//           </h2>
          
//           <p style="font-size: 16px; line-height: 1.6; color: #555;">A new booking has been received. Please review the details below:</p>
          
//           <div style="background-color: #fff3e0; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #f5576c;">
//             <h3 style="margin-top: 0; color: #f5576c; font-size: 20px;">Booking Reference: ${booking.bookingReference || 'N/A'}</h3>
            
//             <table style="width: 100%; border-collapse: collapse;">
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Accommodation:</strong></td>
//                 <td style="padding: 8px 0; color: #333; font-weight: bold;">${accommodation.name}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Location:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${accommodation.location || 'Not specified'}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Check-in Date:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${booking.checkIn ? new Date(booking.checkIn).toLocaleDateString() : 'Not specified'}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Check-out Date:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${booking.checkOut ? new Date(booking.checkOut).toLocaleDateString() : 'Not specified'}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Number of Guests:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${booking.guests || 1}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Total Price:</strong></td>
//                 <td style="padding: 8px 0; color: #333; font-weight: bold; font-size: 18px;">$${booking.totalPrice || accommodation.price || '0'}</td>
//               </tr>
//             </table>
//           </div>
          
//           <div style="background-color: #f0f7ff; padding: 20px; border-radius: 5px; margin: 20px 0;">
//             <h4 style="margin-top: 0; color: #333;">Customer Information</h4>
//             <table style="width: 100%; border-collapse: collapse;">
//               <tr>
//                 <td style="padding: 5px 0; color: #666;"><strong>Name:</strong></td>
//                 <td style="padding: 5px 0; color: #333;">${booking.customer?.name || 'Not provided'}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 5px 0; color: #666;"><strong>Email:</strong></td>
//                 <td style="padding: 5px 0; color: #333;">${booking.customer?.email || booking.email}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 5px 0; color: #666;"><strong>Phone:</strong></td>
//                 <td style="padding: 5px 0; color: #333;">${booking.customer?.phone || booking.phone || 'Not provided'}</td>
//               </tr>
//             </table>
//           </div>
          
//           ${booking.specialRequests ? `
//             <div style="margin-top: 15px; background-color: #fff9e6; padding: 15px; border-radius: 5px;">
//               <strong style="color: #666;">Special Requests:</strong>
//               <p style="color: #555; margin: 5px 0 0 0;">${booking.specialRequests}</p>
//             </div>
//           ` : ''}
          
//           <hr style="border: none; border-top: 2px solid #f0f0f0; margin: 30px 0;">
          
//           <div style="text-align: center;">
//             <p style="color: #666; font-size: 14px; line-height: 1.6;">
//               Please process this booking and contact the customer if needed.<br>
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

//   // Send booking status update to customer
//   sendStatusUpdate: async (booking, oldStatus, newStatus) => {
//     const subject = `Booking Status Updated - ${booking.bookingReference || 'Booking'}`;
    
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
          
//           <p style="font-size: 16px; line-height: 1.6; color: #555;">Dear ${booking.customer?.name || 'Customer'},</p>
          
//           <p style="font-size: 16px; line-height: 1.6; color: #555;">The status of your booking has been updated:</p>
          
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
//             <h4 style="margin-top: 0; color: #333;">Booking Reference: ${booking.bookingReference || 'N/A'}</h4>
//             <p style="margin: 5px 0; color: #555;"><strong>Current Status:</strong> 
//               <span style="background-color: ${newStatus === 'confirmed' ? '#4CAF50' : '#FFC107'}; color: white; padding: 3px 10px; border-radius: 12px; font-size: 12px;">
//                 ${newStatus || 'Pending'}
//               </span>
//             </p>
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

//     return await this.sendEmail(booking.customer?.email || booking.email, subject, html);
//   }
// };

// // -------------------- ACCOMMODATION CONTROLLER --------------------
// const accommodationController = {

//   createAccommodation: async (req, res) => {
//     try {
//       const images = [];
//       if (req.files?.length > 0) {
//         for (const file of req.files) {
//           images.push({
//             public_id: file.filename || file.originalname,
//             url: file.path,
//             thumbnailUrl: generateThumbnailUrl(file.path)
//           });
//         }
//       }

//       // Parse JSON fields
//       if (typeof req.body.amenities === 'string') req.body.amenities = JSON.parse(req.body.amenities);
//       if (typeof req.body.features === 'string') req.body.features = JSON.parse(req.body.features);

//       const accommodation = new Accommodation({ ...req.body, images });
//       await accommodation.save();

//       res.status(201).json({ success: true, message: 'Accommodation created', data: accommodation });
//     } catch (error) {
//       res.status(400).json({ success: false, message: 'Error creating accommodation', error: error.message });
//     }
//   },

//   getAllAccommodations: async (req, res) => {
//     try {
//       const accommodations = await Accommodation.find().sort({ createdAt: -1 });
//       res.json({ success: true, count: accommodations.length, data: accommodations });
//     } catch (error) {
//       res.status(500).json({ success: false, message: 'Error fetching accommodations', error: error.message });
//     }
//   },

//   getAccommodation: async (req, res) => {
//     const { id } = req.params;
//     try {
//       const accommodation = await Accommodation.findById(id);
//       if (!accommodation) return res.status(404).json({ success: false, message: 'Accommodation not found' });
//       res.json({ success: true, data: accommodation });
//     } catch (error) {
//       res.status(500).json({ success: false, message: 'Error fetching accommodation', error: error.message });
//     }
//   },

//   getAccommodationByEmail: async (req, res) => {
//     const { email } = req.params;
//     try {
//       const accommodation = await Accommodation.findOne({ email });
//       if (!accommodation) return res.status(404).json({ success: false, message: 'Accommodation not found for this email' });
//       res.json({ success: true, data: accommodation });
//     } catch (error) {
//       res.status(500).json({ success: false, message: 'Error fetching accommodation by email', error: error.message });
//     }
//   },

//   updateAccommodation: async (req, res) => {
//     const { id } = req.params;
//     try {
//       const accommodation = await Accommodation.findById(id);
//       if (!accommodation) return res.status(404).json({ success: false, message: 'Accommodation not found' });

//       if (req.body.amenities && typeof req.body.amenities === 'string') req.body.amenities = JSON.parse(req.body.amenities);
//       if (req.body.features && typeof req.body.features === 'string') req.body.features = JSON.parse(req.body.features);

//       Object.keys(req.body).forEach(key => { if (key !== 'images') accommodation[key] = req.body[key]; });

//       await accommodation.save();
//       res.json({ success: true, message: 'Accommodation updated', data: accommodation });
//     } catch (error) {
//       res.status(400).json({ success: false, message: 'Error updating accommodation', error: error.message });
//     }
//   },

//   deleteAccommodation: async (req, res) => {
//     const { id } = req.params;
//     try {
//       const accommodation = await Accommodation.findById(id);
//       if (!accommodation) return res.status(404).json({ success: false, message: 'Accommodation not found' });

//       // Delete images from Cloudinary
//       for (const img of accommodation.images) {
//         try { await deleteImageFromCloudinary(img.public_id); } catch (err) { console.error(err); }
//       }

//       await accommodation.deleteOne();
//       res.json({ success: true, message: 'Accommodation deleted' });
//     } catch (error) {
//       res.status(500).json({ success: false, message: 'Error deleting accommodation', error: error.message });
//     }
//   }
// };

// // -------------------- BOOKING CONTROLLER --------------------
// const bookingController = {

//   // createBooking: async (req, res) => {
//   //   const { accommodationId } = req.body;
//   //   if (!mongoose.Types.ObjectId.isValid(accommodationId))
//   //     return res.status(400).json({ success: false, message: 'Invalid accommodation ID' });

//   //   try {
//   //     const accommodation = await Accommodation.findById(accommodationId);
//   //     if (!accommodation) return res.status(404).json({ success: false, message: 'Accommodation not found' });

//   //     // Generate booking reference
//   //     const bookingRef = 'BK-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 5).toUpperCase();
      
//   //     const bookingData = {
//   //       ...req.body,
//   //       bookingReference: bookingRef
//   //     };

//   //     const booking = new Booking(bookingData);
//   //     await booking.save();

//   //     // Send email notifications (don't await to not block response)
//   //     Promise.allSettled([
//   //       emailService.sendBookingConfirmation(booking, accommodation),
//   //       emailService.sendAdminNotification(booking, accommodation)
//   //     ]).then(results => {
//   //       console.log('Email notifications sent:', results.map(r => r.status));
//   //     }).catch(err => {
//   //       console.error('Error sending notification emails:', err);
//   //     });

//   //     res.status(201).json({ 
//   //       success: true, 
//   //       message: 'Booking created successfully', 
//   //       data: booking 
//   //     });
//   //   } catch (error) {
//   //     res.status(400).json({ success: false, message: 'Error creating booking', error: error.message });
//   //   }
//   // },

//   createBooking : async (req, res) => {
//   try {
//     const {
//       accommodation,
//       firstName,
//       lastName,
//       email,
//       phone,
//       nationality,
//       university,
//       course,
//       arrivalDate,
//       departureDate,
//       duration,
//       numberOfOccupants,
//       specialRequirements,
//       emergencyContact,
//       preferredPayment,
//       additionalInfo,
//     } = req.body;

//     // Validate accommodation ID
//     if (!mongoose.Types.ObjectId.isValid(accommodation)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid accommodation ID",
//       });
//     }

//     const accommodationData = await Accommodation.findById(accommodation);

//     if (!accommodationData) {
//       return res.status(404).json({
//         success: false,
//         message: "Accommodation not found",
//       });
//     }

//     // Generate booking reference
//     const bookingReference =
//       "BK-" +
//       Date.now().toString(36).toUpperCase() +
//       Math.random().toString(36).substring(2, 5).toUpperCase();

//     // Create booking
//     const booking = new Booking({
//       accommodation,
//       firstName,
//       lastName,
//       email,
//       phone,
//       nationality,
//       university,
//       course,
//       arrivalDate,
//       departureDate,
//       duration,
//       numberOfOccupants,
//       specialRequirements,
//       emergencyContact,
//       preferredPayment,
//       additionalInfo,
//       bookingReference,
//       status: "Pending",
//     });

//     await booking.save();

//     res.status(201).json({
//       success: true,
//       message: "Booking created successfully",
//       data: booking,
//     });
//   } catch (error) {
//     console.error(error);

//     res.status(400).json({
//       success: false,
//       message: "Error creating booking",
//       error: error.message,
//     });
//   }
// },

//   getAllBookings: async (req, res) => {
//     try {
//       const bookings = await Booking.find().sort({ createdAt: -1 });
//       res.json({ success: true, count: bookings.length, data: bookings });
//     } catch (error) {
//       res.status(500).json({ success: false, message: 'Error fetching bookings', error: error.message });
//     }
//   },

//   getBookingsByEmail: async (req, res) => {
//     const { email } = req.params;
//     try {
//       const bookings = await Booking.find({ "customer.email": email }).sort({ createdAt: -1 });

//       res.status(200).json({
//         success: true,
//         count: bookings.length,
//         data: bookings,
//         message: bookings.length === 0 ? 'No bookings found for this email' : 'Bookings fetched successfully'
//       });
//     } catch (error) {
//       res.status(500).json({ success: false, message: 'Error fetching bookings by email', error: error.message });
//     }
//   },

//   getBooking: async (req, res) => {
//     const { id } = req.params;
//     try {
//       const booking = await Booking.findById(id);
//       if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
//       res.json({ success: true, data: booking });
//     } catch (error) {
//       res.status(500).json({ success: false, message: 'Error fetching booking', error: error.message });
//     }
//   },

//   updateBooking: async (req, res) => {
//     const { id } = req.params;
//     try {
//       const booking = await Booking.findById(id);
//       if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

//       const oldStatus = booking.status;
//       const updatedBooking = await Booking.findByIdAndUpdate(id, req.body, { new: true });

//       // Send status update email if status changed
//       if (req.body.status && oldStatus !== req.body.status) {
//         const accommodation = await Accommodation.findById(updatedBooking.accommodationId);
//         if (accommodation) {
//           Promise.allSettled([
//             emailService.sendStatusUpdate(updatedBooking, oldStatus, req.body.status)
//           ]).catch(err => console.error('Error sending status update email:', err));
//         }
//       }

//       res.json({ success: true, message: 'Booking updated', data: updatedBooking });
//     } catch (error) {
//       res.status(400).json({ success: false, message: 'Error updating booking', error: error.message });
//     }
//   },

//   deleteBooking: async (req, res) => {
//     const { id } = req.params;
//     try {
//       const booking = await Booking.findByIdAndDelete(id);
//       if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
//       res.json({ success: true, message: 'Booking deleted', data: booking });
//     } catch (error) {
//       res.status(500).json({ success: false, message: 'Error deleting booking', error: error.message });
//     }
//   }

// };

// module.exports = { accommodationController, bookingController, emailService };


















// const { Accommodation, Booking } = require('../models/Accommodation');
// const mongoose = require('mongoose');
// const nodemailer = require('nodemailer');
// const { 
//   generateThumbnailUrl, 
//   deleteImageFromCloudinary 
// } = require('../services/accomodationCloudinaryConfig');

// // -------------------- EMAIL TRANSPORTER --------------------
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

// // -------------------- EMAIL SERVICE --------------------
// const emailService = {
//   // Send email helper
//   sendEmail: async (to, subject, html, isAdminNotification = false) => {
//     try {
//       const transporter = createTransporter();
      
//       const info = await transporter.sendMail({
//         from: `"${process.env.COMPANY_NAME || 'REC APPLY'} Accommodation" <${process.env.EMAIL_FROM}>`,
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

//   // Send booking confirmation to customer
//   sendBookingConfirmation: async (booking, accommodation) => {
//     const subject = `Booking Confirmed - ${booking.bookingReference || 'New Booking'}`;
    
//     const html = `
//       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f4f4; padding: 20px;">
//         <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
//           <h1 style="color: white; margin: 0; font-size: 28px;">${process.env.COMPANY_NAME || 'REC APPLY'}</h1>
//           <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Booking Confirmation</p>
//         </div>
        
//         <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
//           <h2 style="color: #333; margin-top: 0; border-bottom: 2px solid #f0f0f0; padding-bottom: 15px;">
//             Thank You for Your Booking! 🎉
//           </h2>
          
//           <p style="font-size: 16px; line-height: 1.6; color: #555;">Dear ${booking.firstName || booking.lastName || booking.customer?.name || 'Customer'},</p>
          
//           <p style="font-size: 16px; line-height: 1.6; color: #555;">Your booking has been confirmed successfully. Here are your booking details:</p>
          
//           <div style="background-color: #f0f7ff; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #667eea;">
//             <h3 style="margin-top: 0; color: #667eea; font-size: 20px;">Booking Reference: ${booking.bookingReference || 'N/A'}</h3>
            
//             <table style="width: 100%; border-collapse: collapse;">
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Accommodation:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${accommodation.name}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Location:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${accommodation.location || 'Not specified'}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Check-in Date:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${booking.arrivalDate ? new Date(booking.arrivalDate).toLocaleDateString() : booking.checkIn ? new Date(booking.checkIn).toLocaleDateString() : 'Not specified'}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Check-out Date:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${booking.departureDate ? new Date(booking.departureDate).toLocaleDateString() : booking.checkOut ? new Date(booking.checkOut).toLocaleDateString() : 'Not specified'}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Number of Guests:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${booking.numberOfOccupants || booking.guests || 1}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Duration:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${booking.duration || 'Not specified'} ${booking.duration ? 'days' : ''}</td>
//               </tr>
//               ${booking.totalPrice || accommodation.price ? `
//                 <tr>
//                   <td style="padding: 8px 0; color: #666;"><strong>Total Price:</strong></td>
//                   <td style="padding: 8px 0; color: #333; font-weight: bold;">$${booking.totalPrice || accommodation.price || '0'}</td>
//                 </tr>
//               ` : ''}
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Status:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">
//                   <span style="background-color: ${booking.status === 'confirmed' ? '#4CAF50' : '#FFC107'}; color: ${booking.status === 'confirmed' ? 'white' : '#333'}; padding: 3px 10px; border-radius: 12px; font-size: 12px;">
//                     ${booking.status || 'Pending'}
//                   </span>
//                 </td>
//               </tr>
//             </table>
            
//             ${booking.specialRequirements || booking.specialRequests ? `
//               <div style="margin-top: 15px;">
//                 <strong style="color: #666;">Special Requests:</strong>
//                 <p style="color: #555; font-style: italic; margin: 5px 0 0 0; background-color: white; padding: 10px; border-radius: 5px;">${booking.specialRequirements || booking.specialRequests}</p>
//               </div>
//             ` : ''}
//           </div>
          
//           <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
//             <h4 style="margin-top: 0; color: #333;">Contact Information</h4>
//             <p style="margin: 5px 0; color: #555;"><strong>Name:</strong> ${booking.firstName} ${booking.lastName || ''} ${booking.customer?.name || ''}</p>
//             <p style="margin: 5px 0; color: #555;"><strong>Email:</strong> ${booking.email || booking.customer?.email}</p>
//             <p style="margin: 5px 0; color: #555;"><strong>Phone:</strong> ${booking.phone || booking.customer?.phone || 'Not provided'}</p>
//             ${booking.university ? `<p style="margin: 5px 0; color: #555;"><strong>University:</strong> ${booking.university}</p>` : ''}
//             ${booking.course ? `<p style="margin: 5px 0; color: #555;"><strong>Course:</strong> ${booking.course}</p>` : ''}
//           </div>
          
//           <hr style="border: none; border-top: 2px solid #f0f0f0; margin: 30px 0;">
          
//           <div style="text-align: center;">
//             <p style="color: #666; font-size: 14px; line-height: 1.6;">
//               Thank you for choosing ${process.env.COMPANY_NAME || 'REC APPLY'}.<br>
//               We look forward to hosting you!
//             </p>
//           </div>
//         </div>
        
//         <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
//           © ${new Date().getFullYear()} ${process.env.COMPANY_NAME || 'REC APPLY'}. All rights reserved.<br>
//           This is an automated message, please do not reply to this email.
//         </div>
//       </div>
//     `;

//     return await this.sendEmail(booking.email || booking.customer?.email, subject, html);
//   },

//   // Send admin notification for new booking
//   sendAdminNotification: async (booking, accommodation) => {
//     const subject = `New Booking Received - ${booking.bookingReference || 'New Booking'}`;
    
//     const html = `
//       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f4f4; padding: 20px;">
//         <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
//           <h1 style="color: white; margin: 0; font-size: 28px;">${process.env.COMPANY_NAME || 'REC APPLY'}</h1>
//           <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Admin Notification - New Booking</p>
//         </div>
        
//         <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
//           <h2 style="color: #333; margin-top: 0; border-bottom: 2px solid #f0f0f0; padding-bottom: 15px;">
//             New Booking Alert! 🏨
//           </h2>
          
//           <p style="font-size: 16px; line-height: 1.6; color: #555;">A new booking has been received. Please review the details below:</p>
          
//           <div style="background-color: #fff3e0; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #f5576c;">
//             <h3 style="margin-top: 0; color: #f5576c; font-size: 20px;">Booking Reference: ${booking.bookingReference || 'N/A'}</h3>
            
//             <table style="width: 100%; border-collapse: collapse;">
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Accommodation:</strong></td>
//                 <td style="padding: 8px 0; color: #333; font-weight: bold;">${accommodation.name}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Location:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${accommodation.location || 'Not specified'}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Check-in Date:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${booking.arrivalDate ? new Date(booking.arrivalDate).toLocaleDateString() : booking.checkIn ? new Date(booking.checkIn).toLocaleDateString() : 'Not specified'}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Check-out Date:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${booking.departureDate ? new Date(booking.departureDate).toLocaleDateString() : booking.checkOut ? new Date(booking.checkOut).toLocaleDateString() : 'Not specified'}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Number of Guests:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${booking.numberOfOccupants || booking.guests || 1}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Duration:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${booking.duration || 'Not specified'} ${booking.duration ? 'days' : ''}</td>
//               </tr>
//               ${booking.totalPrice || accommodation.price ? `
//                 <tr>
//                   <td style="padding: 8px 0; color: #666;"><strong>Total Price:</strong></td>
//                   <td style="padding: 8px 0; color: #333; font-weight: bold; font-size: 18px;">$${booking.totalPrice || accommodation.price || '0'}</td>
//                 </tr>
//               ` : ''}
//             </table>
//           </div>
          
//           <div style="background-color: #f0f7ff; padding: 20px; border-radius: 5px; margin: 20px 0;">
//             <h4 style="margin-top: 0; color: #333;">Customer Information</h4>
//             <table style="width: 100%; border-collapse: collapse;">
//               <tr>
//                 <td style="padding: 5px 0; color: #666;"><strong>Name:</strong></td>
//                 <td style="padding: 5px 0; color: #333;">${booking.firstName} ${booking.lastName || ''} ${booking.customer?.name || ''}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 5px 0; color: #666;"><strong>Email:</strong></td>
//                 <td style="padding: 5px 0; color: #333;">${booking.email || booking.customer?.email}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 5px 0; color: #666;"><strong>Phone:</strong></td>
//                 <td style="padding: 5px 0; color: #333;">${booking.phone || booking.customer?.phone || 'Not provided'}</td>
//               </tr>
//               ${booking.nationality ? `
//                 <tr>
//                   <td style="padding: 5px 0; color: #666;"><strong>Nationality:</strong></td>
//                   <td style="padding: 5px 0; color: #333;">${booking.nationality}</td>
//                 </tr>
//               ` : ''}
//               ${booking.university ? `
//                 <tr>
//                   <td style="padding: 5px 0; color: #666;"><strong>University:</strong></td>
//                   <td style="padding: 5px 0; color: #333;">${booking.university}</td>
//                 </tr>
//               ` : ''}
//               ${booking.course ? `
//                 <tr>
//                   <td style="padding: 5px 0; color: #666;"><strong>Course:</strong></td>
//                   <td style="padding: 5px 0; color: #333;">${booking.course}</td>
//                 </tr>
//               ` : ''}
//             </table>
//           </div>
          
//           ${booking.emergencyContact ? `
//             <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
//               <h4 style="margin-top: 0; color: #333;">Emergency Contact</h4>
//               <table style="width: 100%; border-collapse: collapse;">
//                 <tr>
//                   <td style="padding: 5px 0; color: #666;"><strong>Name:</strong></td>
//                   <td style="padding: 5px 0; color: #333;">${booking.emergencyContact.name}</td>
//                 </tr>
//                 <tr>
//                   <td style="padding: 5px 0; color: #666;"><strong>Phone:</strong></td>
//                   <td style="padding: 5px 0; color: #333;">${booking.emergencyContact.phone}</td>
//                 </tr>
//                 <tr>
//                   <td style="padding: 5px 0; color: #666;"><strong>Relationship:</strong></td>
//                   <td style="padding: 5px 0; color: #333;">${booking.emergencyContact.relationship}</td>
//                 </tr>
//               </table>
//             </div>
//           ` : ''}
          
//           ${booking.specialRequirements || booking.specialRequests ? `
//             <div style="margin-top: 15px; background-color: #fff9e6; padding: 15px; border-radius: 5px;">
//               <strong style="color: #666;">Special Requests:</strong>
//               <p style="color: #555; margin: 5px 0 0 0;">${booking.specialRequirements || booking.specialRequests}</p>
//             </div>
//           ` : ''}
          
//           ${booking.preferredPayment ? `
//             <div style="margin-top: 15px;">
//               <strong style="color: #666;">Preferred Payment:</strong>
//               <p style="color: #555; margin: 5px 0 0 0;">${booking.preferredPayment}</p>
//             </div>
//           ` : ''}
          
//           <hr style="border: none; border-top: 2px solid #f0f0f0; margin: 30px 0;">
          
//           <div style="text-align: center;">
//             <p style="color: #666; font-size: 14px; line-height: 1.6;">
//               Please process this booking and contact the customer if needed.<br>
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

//   // Send booking status update to customer
//   sendStatusUpdate: async (booking, oldStatus, newStatus) => {
//     const subject = `Booking Status Updated - ${booking.bookingReference || 'Booking'}`;
    
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
          
//           <p style="font-size: 16px; line-height: 1.6; color: #555;">Dear ${booking.firstName || booking.lastName || booking.customer?.name || 'Customer'},</p>
          
//           <p style="font-size: 16px; line-height: 1.6; color: #555;">The status of your booking has been updated:</p>
          
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
//             <h4 style="margin-top: 0; color: #333;">Booking Reference: ${booking.bookingReference || 'N/A'}</h4>
//             <p style="margin: 5px 0; color: #555;"><strong>Current Status:</strong> 
//               <span style="background-color: ${newStatus === 'confirmed' ? '#4CAF50' : newStatus === 'cancelled' ? '#f44336' : '#FFC107'}; color: ${newStatus === 'confirmed' ? 'white' : newStatus === 'cancelled' ? 'white' : '#333'}; padding: 3px 10px; border-radius: 12px; font-size: 12px;">
//                 ${newStatus || 'Pending'}
//               </span>
//             </p>
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

//     return await this.sendEmail(booking.email || booking.customer?.email, subject, html);
//   }
// };

// // -------------------- ACCOMMODATION CONTROLLER --------------------
// const accommodationController = {

//   createAccommodation: async (req, res) => {
//     try {
//       const images = [];
//       if (req.files?.length > 0) {
//         for (const file of req.files) {
//           images.push({
//             public_id: file.filename || file.originalname,
//             url: file.path,
//             thumbnailUrl: generateThumbnailUrl(file.path)
//           });
//         }
//       }

//       // Parse JSON fields
//       if (typeof req.body.amenities === 'string') req.body.amenities = JSON.parse(req.body.amenities);
//       if (typeof req.body.features === 'string') req.body.features = JSON.parse(req.body.features);

//       const accommodation = new Accommodation({ ...req.body, images });
//       await accommodation.save();

//       res.status(201).json({ success: true, message: 'Accommodation created', data: accommodation });
//     } catch (error) {
//       res.status(400).json({ success: false, message: 'Error creating accommodation', error: error.message });
//     }
//   },

//   getAllAccommodations: async (req, res) => {
//     try {
//       const accommodations = await Accommodation.find().sort({ createdAt: -1 });
//       res.json({ success: true, count: accommodations.length, data: accommodations });
//     } catch (error) {
//       res.status(500).json({ success: false, message: 'Error fetching accommodations', error: error.message });
//     }
//   },

//   getAccommodation: async (req, res) => {
//     const { id } = req.params;
//     try {
//       const accommodation = await Accommodation.findById(id);
//       if (!accommodation) return res.status(404).json({ success: false, message: 'Accommodation not found' });
//       res.json({ success: true, data: accommodation });
//     } catch (error) {
//       res.status(500).json({ success: false, message: 'Error fetching accommodation', error: error.message });
//     }
//   },

//   getAccommodationByEmail: async (req, res) => {
//     const { email } = req.params;
//     try {
//       const accommodation = await Accommodation.findOne({ email });
//       if (!accommodation) return res.status(404).json({ success: false, message: 'Accommodation not found for this email' });
//       res.json({ success: true, data: accommodation });
//     } catch (error) {
//       res.status(500).json({ success: false, message: 'Error fetching accommodation by email', error: error.message });
//     }
//   },

//   updateAccommodation: async (req, res) => {
//     const { id } = req.params;
//     try {
//       const accommodation = await Accommodation.findById(id);
//       if (!accommodation) return res.status(404).json({ success: false, message: 'Accommodation not found' });

//       if (req.body.amenities && typeof req.body.amenities === 'string') req.body.amenities = JSON.parse(req.body.amenities);
//       if (req.body.features && typeof req.body.features === 'string') req.body.features = JSON.parse(req.body.features);

//       Object.keys(req.body).forEach(key => { if (key !== 'images') accommodation[key] = req.body[key]; });

//       await accommodation.save();
//       res.json({ success: true, message: 'Accommodation updated', data: accommodation });
//     } catch (error) {
//       res.status(400).json({ success: false, message: 'Error updating accommodation', error: error.message });
//     }
//   },

//   deleteAccommodation: async (req, res) => {
//     const { id } = req.params;
//     try {
//       const accommodation = await Accommodation.findById(id);
//       if (!accommodation) return res.status(404).json({ success: false, message: 'Accommodation not found' });

//       // Delete images from Cloudinary
//       for (const img of accommodation.images) {
//         try { await deleteImageFromCloudinary(img.public_id); } catch (err) { console.error(err); }
//       }

//       await accommodation.deleteOne();
//       res.json({ success: true, message: 'Accommodation deleted' });
//     } catch (error) {
//       res.status(500).json({ success: false, message: 'Error deleting accommodation', error: error.message });
//     }
//   }
// };

// // -------------------- BOOKING CONTROLLER --------------------
// const bookingController = {

//   createBooking : async (req, res) => {
//     try {
//       const {
//         accommodation,
//         firstName,
//         lastName,
//         email,
//         phone,
//         nationality,
//         university,
//         course,
//         arrivalDate,
//         departureDate,
//         duration,
//         numberOfOccupants,
//         specialRequirements,
//         emergencyContact,
//         preferredPayment,
//         additionalInfo,
//       } = req.body;

//       // Validate accommodation ID
//       if (!mongoose.Types.ObjectId.isValid(accommodation)) {
//         return res.status(400).json({
//           success: false,
//           message: "Invalid accommodation ID",
//         });
//       }

//       const accommodationData = await Accommodation.findById(accommodation);

//       if (!accommodationData) {
//         return res.status(404).json({
//           success: false,
//           message: "Accommodation not found",
//         });
//       }

//       // Generate booking reference
//       const bookingReference =
//         "BK-" +
//         Date.now().toString(36).toUpperCase() +
//         Math.random().toString(36).substring(2, 5).toUpperCase();

//       // Create booking
//       const booking = new Booking({
//         accommodation,
//         firstName,
//         lastName,
//         email,
//         phone,
//         nationality,
//         university,
//         course,
//         arrivalDate,
//         departureDate,
//         duration,
//         numberOfOccupants,
//         specialRequirements,
//         emergencyContact,
//         preferredPayment,
//         additionalInfo,
//         bookingReference,
//         status: "Pending",
//       });

//       await booking.save();

//       // Send email notifications (don't await to not block response)
//       Promise.allSettled([
//         emailService.sendBookingConfirmation(booking, accommodationData),
//         emailService.sendAdminNotification(booking, accommodationData)
//       ]).then(results => {
//         console.log('Email notifications sent:', results.map(r => r.status));
//       }).catch(err => {
//         console.error('Error sending notification emails:', err);
//       });

//       res.status(201).json({
//         success: true,
//         message: "Booking created successfully",
//         data: booking,
//       });
//     } catch (error) {
//       console.error(error);

//       res.status(400).json({
//         success: false,
//         message: "Error creating booking",
//         error: error.message,
//       });
//     }
//   },

//   getAllBookings: async (req, res) => {
//     try {
//       const bookings = await Booking.find().populate('accommodation').sort({ createdAt: -1 });
//       res.json({ success: true, count: bookings.length, data: bookings });
//     } catch (error) {
//       res.status(500).json({ success: false, message: 'Error fetching bookings', error: error.message });
//     }
//   },

//   getBookingsByEmail: async (req, res) => {
//     const { email } = req.params;
//     try {
//       const bookings = await Booking.find({ email }).populate('accommodation').sort({ createdAt: -1 });

//       res.status(200).json({
//         success: true,
//         count: bookings.length,
//         data: bookings,
//         message: bookings.length === 0 ? 'No bookings found for this email' : 'Bookings fetched successfully'
//       });
//     } catch (error) {
//       res.status(500).json({ success: false, message: 'Error fetching bookings by email', error: error.message });
//     }
//   },

//   getBooking: async (req, res) => {
//     const { id } = req.params;
//     try {
//       const booking = await Booking.findById(id).populate('accommodation');
//       if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
//       res.json({ success: true, data: booking });
//     } catch (error) {
//       res.status(500).json({ success: false, message: 'Error fetching booking', error: error.message });
//     }
//   },

//   updateBooking: async (req, res) => {
//     const { id } = req.params;
//     try {
//       const booking = await Booking.findById(id).populate('accommodation');
//       if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

//       const oldStatus = booking.status;
//       const updatedBooking = await Booking.findByIdAndUpdate(id, req.body, { new: true }).populate('accommodation');

//       // Send status update email if status changed
//       if (req.body.status && oldStatus !== req.body.status) {
//         const accommodation = await Accommodation.findById(updatedBooking.accommodation);
//         if (accommodation) {
//           emailService.sendStatusUpdate(updatedBooking, oldStatus, req.body.status)
//             .catch(err => console.error('Error sending status update email:', err));
//         }
//       }

//       res.json({ success: true, message: 'Booking updated', data: updatedBooking });
//     } catch (error) {
//       res.status(400).json({ success: false, message: 'Error updating booking', error: error.message });
//     }
//   },

//   deleteBooking: async (req, res) => {
//     const { id } = req.params;
//     try {
//       const booking = await Booking.findByIdAndDelete(id);
//       if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
//       res.json({ success: true, message: 'Booking deleted', data: booking });
//     } catch (error) {
//       res.status(500).json({ success: false, message: 'Error deleting booking', error: error.message });
//     }
//   }

// };

// module.exports = { accommodationController, bookingController, emailService };
























const { Accommodation, Booking } = require('../models/Accommodation');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const { 
  generateThumbnailUrl, 
  deleteImageFromCloudinary 
} = require('../services/accomodationCloudinaryConfig');

// -------------------- EMAIL TRANSPORTER --------------------
const createTransporter = () => {
  const smtpPass = process.env.SMTP_PASS
    ? process.env.SMTP_PASS.toString().replace(/\s+/g, "").trim()
    : "";

  const port = parseInt(process.env.SMTP_PORT) || 587;

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: port,
    secure: port === 465,

    pool: true,
    maxConnections: 5,
    maxMessages: 20,

    auth: {
      user: process.env.SMTP_USER,
      pass: smtpPass,
    },

    tls: {
      rejectUnauthorized: false,
    },

    connectionTimeout: 15000,
    socketTimeout: 30000,
  });
};
// -------------------- EMAIL SERVICE --------------------
const emailService = {
  // Send email helper
 sendEmail: async (to, subject, html, isAdminNotification = false) => {
  try {
    console.log("📧 Preparing to send email to:", to);

    const transporter = createTransporter();

    // Verify SMTP connection first (safe check)
    try {
      await transporter.verify();
      console.log("✅ SMTP connection verified");
    } catch (verifyError) {
      console.error("❌ SMTP verification failed:", verifyError.message);
      throw verifyError;
    }

    const info = await transporter.sendMail({
      from: `"${process.env.COMPANY_NAME || "REC APPLY"} Accommodation" <${process.env.EMAIL_FROM || process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });

    console.log(
      "✅ Email sent successfully to:",
      to,
      "Message ID:",
      info.messageId
    );

    return {
      success: true,
      messageId: info.messageId,
    };

  } catch (error) {
    console.error("❌ Email send error:", {
      message: error.message,
      code: error.code,
      command: error.command,
      response: error.response,
    });

    throw error;
  }
},

  // Send booking confirmation to customer
  sendBookingConfirmation: async (booking, accommodation) => {
    const subject = `Booking Confirmed - ${booking.bookingReference || 'New Booking'}`;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f4f4; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">${process.env.COMPANY_NAME || 'REC APPLY'}</h1>
          <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Booking Confirmation</p>
        </div>
        
        <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-top: 0; border-bottom: 2px solid #f0f0f0; padding-bottom: 15px;">
            Thank You for Your Booking! 🎉
          </h2>
          
          <p style="font-size: 16px; line-height: 1.6; color: #555;">Dear ${booking.firstName || booking.lastName || booking.customer?.name || 'Customer'},</p>
          
          <p style="font-size: 16px; line-height: 1.6; color: #555;">Your booking has been confirmed successfully. Here are your booking details:</p>
          
          <div style="background-color: #f0f7ff; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #667eea;">
            <h3 style="margin-top: 0; color: #667eea; font-size: 20px;">Booking Reference: ${booking.bookingReference || 'N/A'}</h3>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Accommodation:</strong></td>
                <td style="padding: 8px 0; color: #333;">${accommodation.name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Location:</strong></td>
                <td style="padding: 8px 0; color: #333;">${accommodation.location || 'Not specified'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Check-in Date:</strong></td>
                <td style="padding: 8px 0; color: #333;">${booking.arrivalDate ? new Date(booking.arrivalDate).toLocaleDateString() : booking.checkIn ? new Date(booking.checkIn).toLocaleDateString() : 'Not specified'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Check-out Date:</strong></td>
                <td style="padding: 8px 0; color: #333;">${booking.departureDate ? new Date(booking.departureDate).toLocaleDateString() : booking.checkOut ? new Date(booking.checkOut).toLocaleDateString() : 'Not specified'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Number of Guests:</strong></td>
                <td style="padding: 8px 0; color: #333;">${booking.numberOfOccupants || booking.guests || 1}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Duration:</strong></td>
                <td style="padding: 8px 0; color: #333;">${booking.duration || 'Not specified'} ${booking.duration ? 'days' : ''}</td>
              </tr>
              ${booking.totalPrice || accommodation.price ? `
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>Total Price:</strong></td>
                  <td style="padding: 8px 0; color: #333; font-weight: bold;">$${booking.totalPrice || accommodation.price || '0'}</td>
                </tr>
              ` : ''}
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Status:</strong></td>
                <td style="padding: 8px 0; color: #333;">
                  <span style="background-color: ${booking.status === 'confirmed' ? '#4CAF50' : '#FFC107'}; color: ${booking.status === 'confirmed' ? 'white' : '#333'}; padding: 3px 10px; border-radius: 12px; font-size: 12px;">
                    ${booking.status || 'Pending'}
                  </span>
                </td>
              </tr>
            </table>
            
            ${booking.specialRequirements || booking.specialRequests ? `
              <div style="margin-top: 15px;">
                <strong style="color: #666;">Special Requests:</strong>
                <p style="color: #555; font-style: italic; margin: 5px 0 0 0; background-color: white; padding: 10px; border-radius: 5px;">${booking.specialRequirements || booking.specialRequests}</p>
              </div>
            ` : ''}
          </div>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h4 style="margin-top: 0; color: #333;">Contact Information</h4>
            <p style="margin: 5px 0; color: #555;"><strong>Name:</strong> ${booking.firstName} ${booking.lastName || ''} ${booking.customer?.name || ''}</p>
            <p style="margin: 5px 0; color: #555;"><strong>Email:</strong> ${booking.email || booking.customer?.email}</p>
            <p style="margin: 5px 0; color: #555;"><strong>Phone:</strong> ${booking.phone || booking.customer?.phone || 'Not provided'}</p>
            ${booking.university ? `<p style="margin: 5px 0; color: #555;"><strong>University:</strong> ${booking.university}</p>` : ''}
            ${booking.course ? `<p style="margin: 5px 0; color: #555;"><strong>Course:</strong> ${booking.course}</p>` : ''}
          </div>
          
          <hr style="border: none; border-top: 2px solid #f0f0f0; margin: 30px 0;">
          
          <div style="text-align: center;">
            <p style="color: #666; font-size: 14px; line-height: 1.6;">
              Thank you for choosing ${process.env.COMPANY_NAME || 'REC APPLY'}.<br>
              We look forward to hosting you!
            </p>
          </div>
        </div>
        
        <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
          © ${new Date().getFullYear()} ${process.env.COMPANY_NAME || 'REC APPLY'}. All rights reserved.<br>
          This is an automated message, please do not reply to this email.
        </div>
      </div>
    `;

    return await this.sendEmail(booking.email || booking.customer?.email, subject, html);
  },

  // Send admin notification for new booking
  sendAdminNotification: async (booking, accommodation) => {
    const subject = `New Booking Received - ${booking.bookingReference || 'New Booking'}`;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f4f4; padding: 20px;">
        <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">${process.env.COMPANY_NAME || 'REC APPLY'}</h1>
          <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Admin Notification - New Booking</p>
        </div>
        
        <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-top: 0; border-bottom: 2px solid #f0f0f0; padding-bottom: 15px;">
            New Booking Alert! 🏨
          </h2>
          
          <p style="font-size: 16px; line-height: 1.6; color: #555;">A new booking has been received. Please review the details below:</p>
          
          <div style="background-color: #fff3e0; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #f5576c;">
            <h3 style="margin-top: 0; color: #f5576c; font-size: 20px;">Booking Reference: ${booking.bookingReference || 'N/A'}</h3>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Accommodation:</strong></td>
                <td style="padding: 8px 0; color: #333; font-weight: bold;">${accommodation.name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Location:</strong></td>
                <td style="padding: 8px 0; color: #333;">${accommodation.location || 'Not specified'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Check-in Date:</strong></td>
                <td style="padding: 8px 0; color: #333;">${booking.arrivalDate ? new Date(booking.arrivalDate).toLocaleDateString() : booking.checkIn ? new Date(booking.checkIn).toLocaleDateString() : 'Not specified'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Check-out Date:</strong></td>
                <td style="padding: 8px 0; color: #333;">${booking.departureDate ? new Date(booking.departureDate).toLocaleDateString() : booking.checkOut ? new Date(booking.checkOut).toLocaleDateString() : 'Not specified'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Number of Guests:</strong></td>
                <td style="padding: 8px 0; color: #333;">${booking.numberOfOccupants || booking.guests || 1}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Duration:</strong></td>
                <td style="padding: 8px 0; color: #333;">${booking.duration || 'Not specified'} ${booking.duration ? 'days' : ''}</td>
              </tr>
              ${booking.totalPrice || accommodation.price ? `
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>Total Price:</strong></td>
                  <td style="padding: 8px 0; color: #333; font-weight: bold; font-size: 18px;">$${booking.totalPrice || accommodation.price || '0'}</td>
                </tr>
              ` : ''}
            </table>
          </div>
          
          <div style="background-color: #f0f7ff; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h4 style="margin-top: 0; color: #333;">Customer Information</h4>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 5px 0; color: #666;"><strong>Name:</strong></td>
                <td style="padding: 5px 0; color: #333;">${booking.firstName} ${booking.lastName || ''} ${booking.customer?.name || ''}</td>
              </tr>
              <tr>
                <td style="padding: 5px 0; color: #666;"><strong>Email:</strong></td>
                <td style="padding: 5px 0; color: #333;">${booking.email || booking.customer?.email}</td>
              </tr>
              <tr>
                <td style="padding: 5px 0; color: #666;"><strong>Phone:</strong></td>
                <td style="padding: 5px 0; color: #333;">${booking.phone || booking.customer?.phone || 'Not provided'}</td>
              </tr>
              ${booking.nationality ? `
                <tr>
                  <td style="padding: 5px 0; color: #666;"><strong>Nationality:</strong></td>
                  <td style="padding: 5px 0; color: #333;">${booking.nationality}</td>
                </tr>
              ` : ''}
              ${booking.university ? `
                <tr>
                  <td style="padding: 5px 0; color: #666;"><strong>University:</strong></td>
                  <td style="padding: 5px 0; color: #333;">${booking.university}</td>
                </tr>
              ` : ''}
              ${booking.course ? `
                <tr>
                  <td style="padding: 5px 0; color: #666;"><strong>Course:</strong></td>
                  <td style="padding: 5px 0; color: #333;">${booking.course}</td>
                </tr>
              ` : ''}
            </table>
          </div>
          
          ${booking.emergencyContact ? `
            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h4 style="margin-top: 0; color: #333;">Emergency Contact</h4>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 5px 0; color: #666;"><strong>Name:</strong></td>
                  <td style="padding: 5px 0; color: #333;">${booking.emergencyContact.name}</td>
                </tr>
                <tr>
                  <td style="padding: 5px 0; color: #666;"><strong>Phone:</strong></td>
                  <td style="padding: 5px 0; color: #333;">${booking.emergencyContact.phone}</td>
                </tr>
                <tr>
                  <td style="padding: 5px 0; color: #666;"><strong>Relationship:</strong></td>
                  <td style="padding: 5px 0; color: #333;">${booking.emergencyContact.relationship}</td>
                </tr>
              </table>
            </div>
          ` : ''}
          
          ${booking.specialRequirements || booking.specialRequests ? `
            <div style="margin-top: 15px; background-color: #fff9e6; padding: 15px; border-radius: 5px;">
              <strong style="color: #666;">Special Requests:</strong>
              <p style="color: #555; margin: 5px 0 0 0;">${booking.specialRequirements || booking.specialRequests}</p>
            </div>
          ` : ''}
          
          ${booking.preferredPayment ? `
            <div style="margin-top: 15px;">
              <strong style="color: #666;">Preferred Payment:</strong>
              <p style="color: #555; margin: 5px 0 0 0;">${booking.preferredPayment}</p>
            </div>
          ` : ''}
          
          <hr style="border: none; border-top: 2px solid #f0f0f0; margin: 30px 0;">
          
          <div style="text-align: center;">
            <p style="color: #666; font-size: 14px; line-height: 1.6;">
              Please process this booking and contact the customer if needed.<br>
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

  // Send booking status update to customer
  sendStatusUpdate: async (booking, oldStatus, newStatus) => {
    const subject = `Booking Status Updated - ${booking.bookingReference || 'Booking'}`;
    
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
          
          <p style="font-size: 16px; line-height: 1.6; color: #555;">Dear ${booking.firstName || booking.lastName || booking.customer?.name || 'Customer'},</p>
          
          <p style="font-size: 16px; line-height: 1.6; color: #555;">The status of your booking has been updated:</p>
          
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
            <h4 style="margin-top: 0; color: #333;">Booking Reference: ${booking.bookingReference || 'N/A'}</h4>
            <p style="margin: 5px 0; color: #555;"><strong>Current Status:</strong> 
              <span style="background-color: ${newStatus === 'confirmed' ? '#4CAF50' : newStatus === 'cancelled' ? '#f44336' : '#FFC107'}; color: ${newStatus === 'confirmed' ? 'white' : newStatus === 'cancelled' ? 'white' : '#333'}; padding: 3px 10px; border-radius: 12px; font-size: 12px;">
                ${newStatus || 'Pending'}
              </span>
            </p>
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

    return await this.sendEmail(booking.email || booking.customer?.email, subject, html);
  }
};

// -------------------- ACCOMMODATION CONTROLLER --------------------
const accommodationController = {

  createAccommodation: async (req, res) => {
    try {
      const images = [];
      if (req.files?.length > 0) {
        for (const file of req.files) {
          images.push({
            public_id: file.filename || file.originalname,
            url: file.path,
            thumbnailUrl: generateThumbnailUrl(file.path)
          });
        }
      }

      // Parse JSON fields
      if (typeof req.body.amenities === 'string') req.body.amenities = JSON.parse(req.body.amenities);
      if (typeof req.body.features === 'string') req.body.features = JSON.parse(req.body.features);

      const accommodation = new Accommodation({ ...req.body, images });
      await accommodation.save();

      res.status(201).json({ success: true, message: 'Accommodation created', data: accommodation });
    } catch (error) {
      res.status(400).json({ success: false, message: 'Error creating accommodation', error: error.message });
    }
  },

  getAllAccommodations: async (req, res) => {
    try {
      const accommodations = await Accommodation.find().sort({ createdAt: -1 });
      res.json({ success: true, count: accommodations.length, data: accommodations });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error fetching accommodations', error: error.message });
    }
  },

  getAccommodation: async (req, res) => {
    const { id } = req.params;
    try {
      const accommodation = await Accommodation.findById(id);
      if (!accommodation) return res.status(404).json({ success: false, message: 'Accommodation not found' });
      res.json({ success: true, data: accommodation });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error fetching accommodation', error: error.message });
    }
  },

  getAccommodationByEmail: async (req, res) => {
    const { email } = req.params;
    try {
      const accommodation = await Accommodation.findOne({ email });
      if (!accommodation) return res.status(404).json({ success: false, message: 'Accommodation not found for this email' });
      res.json({ success: true, data: accommodation });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error fetching accommodation by email', error: error.message });
    }
  },

  updateAccommodation: async (req, res) => {
    const { id } = req.params;
    try {
      const accommodation = await Accommodation.findById(id);
      if (!accommodation) return res.status(404).json({ success: false, message: 'Accommodation not found' });

      if (req.body.amenities && typeof req.body.amenities === 'string') req.body.amenities = JSON.parse(req.body.amenities);
      if (req.body.features && typeof req.body.features === 'string') req.body.features = JSON.parse(req.body.features);

      Object.keys(req.body).forEach(key => { if (key !== 'images') accommodation[key] = req.body[key]; });

      await accommodation.save();
      res.json({ success: true, message: 'Accommodation updated', data: accommodation });
    } catch (error) {
      res.status(400).json({ success: false, message: 'Error updating accommodation', error: error.message });
    }
  },

  deleteAccommodation: async (req, res) => {
    const { id } = req.params;
    try {
      const accommodation = await Accommodation.findById(id);
      if (!accommodation) return res.status(404).json({ success: false, message: 'Accommodation not found' });

      // Delete images from Cloudinary
      for (const img of accommodation.images) {
        try { await deleteImageFromCloudinary(img.public_id); } catch (err) { console.error(err); }
      }

      await accommodation.deleteOne();
      res.json({ success: true, message: 'Accommodation deleted' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error deleting accommodation', error: error.message });
    }
  }
};

// -------------------- BOOKING CONTROLLER --------------------
const bookingController = {

  createBooking : async (req, res) => {
    try {
      const {
        accommodation,
        firstName,
        lastName,
        email,
        phone,
        nationality,
        university,
        course,
        arrivalDate,
        departureDate,
        duration,
        numberOfOccupants,
        specialRequirements,
        emergencyContact,
        preferredPayment,
        additionalInfo,
      } = req.body;

      // Validate accommodation ID
      if (!mongoose.Types.ObjectId.isValid(accommodation)) {
        return res.status(400).json({
          success: false,
          message: "Invalid accommodation ID",
        });
      }

      const accommodationData = await Accommodation.findById(accommodation);

      if (!accommodationData) {
        return res.status(404).json({
          success: false,
          message: "Accommodation not found",
        });
      }

      // Generate booking reference
      const bookingReference =
        "BK-" +
        Date.now().toString(36).toUpperCase() +
        Math.random().toString(36).substring(2, 5).toUpperCase();

      // Create booking
      const booking = new Booking({
        accommodation,
        firstName,
        lastName,
        email,
        phone,
        nationality,
        university,
        course,
        arrivalDate,
        departureDate,
        duration,
        numberOfOccupants,
        specialRequirements,
        emergencyContact,
        preferredPayment,
        additionalInfo,
        bookingReference,
        status: "Pending",
      });

      await booking.save();

      // Send email notifications
      await emailService.sendBookingConfirmation(booking, accommodationData);
      await emailService.sendAdminNotification(booking, accommodationData);

      res.status(201).json({
        success: true,
        message: "Booking created successfully",
        data: booking,
      });
    } catch (error) {
      console.error(error);

      res.status(400).json({
        success: false,
        message: "Error creating booking",
        error: error.message,
      });
    }
  },

  getAllBookings: async (req, res) => {
    try {
      const bookings = await Booking.find().populate('accommodation').sort({ createdAt: -1 });
      res.json({ success: true, count: bookings.length, data: bookings });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error fetching bookings', error: error.message });
    }
  },

  getBookingsByEmail: async (req, res) => {
    const { email } = req.params;
    try {
      const bookings = await Booking.find({ email }).populate('accommodation').sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        count: bookings.length,
        data: bookings,
        message: bookings.length === 0 ? 'No bookings found for this email' : 'Bookings fetched successfully'
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error fetching bookings by email', error: error.message });
    }
  },

  getBooking: async (req, res) => {
    const { id } = req.params;
    try {
      const booking = await Booking.findById(id).populate('accommodation');
      if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
      res.json({ success: true, data: booking });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error fetching booking', error: error.message });
    }
  },

  updateBooking: async (req, res) => {
    const { id } = req.params;
    try {
      const booking = await Booking.findById(id).populate('accommodation');
      if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

      const oldStatus = booking.status;
      const updatedBooking = await Booking.findByIdAndUpdate(id, req.body, { new: true }).populate('accommodation');

      // Send status update email if status changed
      if (req.body.status && oldStatus !== req.body.status) {
        const accommodation = await Accommodation.findById(updatedBooking.accommodation);
        if (accommodation) {
          await emailService.sendStatusUpdate(updatedBooking, oldStatus, req.body.status);
        }
      }

      res.json({ success: true, message: 'Booking updated', data: updatedBooking });
    } catch (error) {
      res.status(400).json({ success: false, message: 'Error updating booking', error: error.message });
    }
  },

  deleteBooking: async (req, res) => {
    const { id } = req.params;
    try {
      const booking = await Booking.findByIdAndDelete(id);
      if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
      res.json({ success: true, message: 'Booking deleted', data: booking });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error deleting booking', error: error.message });
    }
  }

};

module.exports = { accommodationController, bookingController, emailService };