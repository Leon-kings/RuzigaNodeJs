
// const VisaService = require("../models/Visa");
// const cloudinary = require("cloudinary").v2;
// const multer = require("multer");
// const streamifier = require("streamifier");

// /* =====================================================
//    MULTER MEMORY STORAGE
// ===================================================== */
// const upload = multer({
//   storage: multer.memoryStorage(),
//   limits: { fileSize: 1 * 1024 * 1024 }, // 5MB max
// });
// exports.upload = upload;

// /* =====================================================
//    CLOUDINARY UPLOAD HELPER
// ===================================================== */
// const uploadToCloudinary = async (file, folder = "visa_documents") => {
//   if (!file) return null;

//   return new Promise((resolve, reject) => {
//     const stream = cloudinary.uploader.upload_stream(
//       { folder, resource_type: "auto" },
//       (error, result) => {
//         if (error) return reject(error);

//         resolve({
//           cloudinaryUrl: result.secure_url,
//           publicId: result.public_id,
//           size: file.size,
//         });
//       }
//     );
//     streamifier.createReadStream(file.buffer).pipe(stream);
//   });
// };

// /* =====================================================
//    VISA CATALOG CRUD
// ===================================================== */

// exports.createVisaCatalog = async (req, res) => {
//   try {
//     const { country, visaType, description, processingTime, price, isActive } =
//       req.body;

//     if (!country || !visaType) {
//       return res
//         .status(400)
//         .json({ success: false, message: "country and visaType are required" });
//     }

//     const coverImage = req.file
//       ? await uploadToCloudinary(req.file, "visa_catalog")
//       : null;

//     const visa = await VisaService.create({
//       recordType: "visa-catalog",
//       visaCatalog: {
//         country,
//         visaType,
//         description,
//         processingTime,
//         price,
//         isActive,
//         coverImage,
//       },
//     });

//     res.status(201).json({ success: true, data: visa });
//   } catch (err) {
//     res.status(400).json({ success: false, message: err.message });
//   }
// };

// exports.getVisaCatalogs = async (req, res) => {
//   try {
//     const visas = await VisaService.find({
//       recordType: "visa-catalog",
//       "visaCatalog.isActive": true,
//     });
//     res.json({ success: true, count: visas.length, data: visas });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// exports.getVisaCatalogById = async (req, res) => {
//   try {
//     const visa = await VisaService.findById(req.params.id);
//     if (!visa)
//       return res.status(404).json({ success: false, message: "Catalog not found" });

//     res.json({ success: true, data: visa });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// exports.updateVisaCatalog = async (req, res) => {
//   try {
//     const visa = await VisaService.findById(req.params.id);
//     if (!visa)
//       return res.status(404).json({ success: false, message: "Catalog not found" });

//     if (req.file && visa.visaCatalog.coverImage?.publicId) {
//       await cloudinary.uploader.destroy(visa.visaCatalog.coverImage.publicId);
//       visa.visaCatalog.coverImage = await uploadToCloudinary(
//         req.file,
//         "visa_catalog"
//       );
//     }

//     Object.assign(visa.visaCatalog, req.body);
//     await visa.save();

//     res.json({ success: true, data: visa });
//   } catch (err) {
//     res.status(400).json({ success: false, message: err.message });
//   }
// };

// exports.deleteVisaCatalog = async (req, res) => {
//   try {
//     const visa = await VisaService.findById(req.params.id);
//     if (!visa)
//       return res.status(404).json({ success: false, message: "Catalog not found" });

//     visa.visaCatalog.isActive = false;
//     await visa.save();

//     res.json({ success: true, message: "Visa catalog deactivated" });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// /* =====================================================
//    VISA BOOKINGS CRUD
// ===================================================== */


// exports.createBooking = async (req, res) => {
//   try {
//     const booking = await VisaService.create({
//       recordType: "visa-booking",
//       booking: {
//         bookingType: req.body.bookingType,
//         serviceRef: req.body.serviceRef,
//         status: req.body.status,
//         customer: {
//           fullName: req.body.customer?.fullName,
//           email: req.body.customer?.email,
//           phone: req.body.customer?.phone,
//           nationality: req.body.customer?.nationality,
//           passportNumber: req.body.customer?.passportNumber,
//         },
//         documents: req.body.documents || {},
//       },
//     });

//     res.status(201).json({ success: true, data: booking });
//   } catch (err) {
//     res.status(400).json({ success: false, message: err.message });
//   }
// };


// // exports.getAllBookings = async (req, res) => {
// //   try {
// //     const bookings = await VisaService.find({ recordType: "visa-booking" });
// //     res.json({ success: true, count: bookings.length, data: bookings });
// //   } catch (err) {
// //     res.status(500).json({ success: false, message: err.message });
// //   }
// // };
// exports.getAllBookings = async (req, res) => {
//   try {
//     const bookings = await VisaService.find({
//       recordType: "visa-booking",
//     });

//     res.status(200).json({
//       success: true,
//       count: bookings.length,
//       data: bookings,
//     });
//   } catch (err) {
//     res.status(500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };


// // exports.getBookingsByEmail = async (req, res) => {
// //   try {
// //     const { email } = req.query;

// //     if (!email) {
// //       return res.status(400).json({
// //         success: false,
// //         message: "Email query is required",
// //       });
// //     }

// //     const bookings = await VisaService.find({
// //       recordType: "visa-booking",
// //       email,
// //     }).sort({ createdAt: -1 });

// //     res.status(200).json({
// //       success: true,
// //       count: bookings.length,
// //       data: bookings,
// //     });
// //   } catch (err) {
// //     res.status(500).json({
// //       success: false,
// //       message: err.message,
// //     });
// //   }
// // };

// exports.getBookingsByEmail = async (req, res) => {
//   try {
//     const { email } = req.params;

//     if (!email) {
//       return res.status(400).json({
//         success: false,
//         message: "Email parameter is required",
//       });
//     }

//     const bookings = await VisaService.find({
//       recordType: "visa-booking",
//       "booking.customer.email": email,
//     });

//     res.status(200).json({
//       success: true,
//       count: bookings.length,
//       data: bookings,
//     });
//   } catch (err) {
//     res.status(500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };



// exports.getBookingById = async (req, res) => {
//   try {
//     const booking = await VisaService.findById(req.params.id);
//     if (!booking)
//       return res.status(404).json({ success: false, message: "Booking not found" });

//     res.json({ success: true, data: booking });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// exports.updateBooking = async (req, res) => {
//   try {
//     const booking = await VisaService.findById(req.params.id);
//     if (!booking)
//       return res.status(404).json({ success: false, message: "Booking not found" });

//     Object.assign(booking.booking, req.body.booking || {});
//     Object.assign(booking.customer, req.body.customer || {});
//     await booking.save();

//     res.json({ success: true, data: booking });
//   } catch (err) {
//     res.status(400).json({ success: false, message: err.message });
//   }
// };

// exports.deleteBooking = async (req, res) => {
//   try {
//     await VisaService.findByIdAndDelete(req.params.id);
//     res.json({ success: true, message: "Booking deleted" });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// /* =====================================================
//    DOCUMENTS CRUD
// ===================================================== */

// exports.uploadDocument = async (req, res) => {
//   try {
//     const { id, category } = req.params;
//     const booking = await VisaService.findById(id);

//     if (!booking)
//       return res.status(404).json({ success: false, message: "Booking not found" });

//     const doc = await uploadToCloudinary(req.file, "visa_documents");

//     if (!booking.booking.documents) booking.booking.documents = {};

//     if (Array.isArray(booking.booking.documents[category])) {
//       booking.booking.documents[category].push(doc);
//     } else {
//       booking.booking.documents[category] = [doc];
//     }

//     await booking.save();
//     res.json({ success: true, data: doc });
//   } catch (err) {
//     res.status(400).json({ success: false, message: err.message });
//   }
// };

// exports.deleteDocument = async (req, res) => {
//   try {
//     const { id, publicId, category } = req.params;
//     const booking = await VisaService.findById(id);

//     if (!booking)
//       return res.status(404).json({ success: false, message: "Booking not found" });

//     await cloudinary.uploader.destroy(publicId);

//     if (Array.isArray(booking.booking.documents[category])) {
//       booking.booking.documents[category] =
//         booking.booking.documents[category].filter((d) => d.publicId !== publicId);
//     }

//     await booking.save();
//     res.json({ success: true, message: "Document removed" });
//   } catch (err) {
//     res.status(400).json({ success: false, message: err.message });
//   }
// };

// /* =====================================================
//    DASHBOARD STATISTICS
// ===================================================== */

// exports.getDashboardStats = async (req, res) => {
//   try {
//     const totalVisas = await VisaService.countDocuments({ recordType: "visa-catalog" });
//     const totalBookings = await VisaService.countDocuments({ recordType: "visa-booking" });

//     const bookingStatus = await VisaService.aggregate([
//       { $match: { recordType: "visa-booking" } },
//       { $group: { _id: "$booking.status", count: { $sum: 1 } } },
//     ]);

//     res.json({
//       success: true,
//       data: { totalVisas, totalBookings, bookingStatus },
//     });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };























const VisaService = require("../models/Visa");
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const streamifier = require("streamifier");
const nodemailer = require("nodemailer");

/* =====================================================
   EMAIL TRANSPORTER
===================================================== */
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

/* =====================================================
   EMAIL SERVICE
===================================================== */
const emailService = {
  sendEmail: async (to, subject, html, isAdminNotification = false) => {
    // Skip emails if SKIP_EMAILS is true (for development)
    if (process.env.SKIP_EMAILS === 'true' && !isAdminNotification) {
      console.log('Email sending skipped (SKIP_EMAILS=true)');
      return { success: true, skipped: true };
    }

    try {
      const transporter = createTransporter();
      
      const info = await transporter.sendMail({
        from: `"${process.env.COMPANY_NAME || 'REC APPLY'} Visa Services" <${process.env.EMAIL_FROM}>`,
        to,
        subject,
        html
      });
      
      console.log('Email sent successfully to:', to, 'Message ID:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Email sending error:', error);
      
      if (process.env.NODE_ENV === 'development') {
        console.log('Email failed but continuing in development mode');
        return { success: false, error: error.message, skipped: true };
      }
      
      return { success: false, error: error.message };
    }
  },

  // Send booking confirmation to customer
  sendBookingConfirmation: async (booking, visaCatalog = null) => {
    const bookingRef = booking.booking?.bookingReference || 
                      `VISA-${Date.now().toString(36).toUpperCase()}`;
    
    // Store booking reference if not exists
    if (!booking.booking.bookingReference) {
      booking.booking.bookingReference = bookingRef;
      await booking.save();
    }

    const subject = `Visa Application Confirmed - ${bookingRef}`;
    
    const visaType = booking.booking?.bookingType || 'Visa Application';
    const country = visaCatalog?.visaCatalog?.country || booking.booking?.serviceRef || 'Not specified';
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f4f4; padding: 20px;">
        <div style="background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">${process.env.COMPANY_NAME || 'REC APPLY'}</h1>
          <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Visa Application Confirmation</p>
        </div>
        
        <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-top: 0; border-bottom: 2px solid #f0f0f0; padding-bottom: 15px;">
            Thank You for Your Visa Application! 🛂
          </h2>
          
          <p style="font-size: 16px; line-height: 1.6; color: #555;">Dear ${booking.booking?.customer?.fullName || booking.booking?.customer?.name || 'Applicant'},</p>
          
          <p style="font-size: 16px; line-height: 1.6; color: #555;">Your visa application has been received and is now being processed. Here are your application details:</p>
          
          <div style="background-color: #e8f4fc; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #2a5298;">
            <h3 style="margin-top: 0; color: #2a5298; font-size: 20px;">Application Reference: ${bookingRef}</h3>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Full Name:</strong></td>
                <td style="padding: 8px 0; color: #333;">${booking.booking?.customer?.fullName || 'Not provided'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Email:</strong></td>
                <td style="padding: 8px 0; color: #333;">${booking.booking?.customer?.email}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Phone:</strong></td>
                <td style="padding: 8px 0; color: #333;">${booking.booking?.customer?.phone || 'Not provided'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Visa Type:</strong></td>
                <td style="padding: 8px 0; color: #333;">${visaType}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Country:</strong></td>
                <td style="padding: 8px 0; color: #333;">${country}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Nationality:</strong></td>
                <td style="padding: 8px 0; color: #333;">${booking.booking?.customer?.nationality || 'Not provided'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Passport Number:</strong></td>
                <td style="padding: 8px 0; color: #333;">${booking.booking?.customer?.passportNumber ? '****' + booking.booking?.customer?.passportNumber.slice(-4) : 'Not provided'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Application Date:</strong></td>
                <td style="padding: 8px 0; color: #333;">${new Date(booking.createdAt).toLocaleDateString()}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Status:</strong></td>
                <td style="padding: 8px 0; color: #333;">
                  <span style="background-color: ${booking.booking?.status === 'confirmed' ? '#4CAF50' : '#FFC107'}; color: ${booking.booking?.status === 'confirmed' ? 'white' : '#333'}; padding: 3px 10px; border-radius: 12px; font-size: 12px;">
                    ${booking.booking?.status || 'Pending'}
                  </span>
                </td>
              </tr>
            </table>
          </div>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h4 style="margin-top: 0; color: #333;">What Happens Next?</h4>
            <ol style="margin: 5px 0 0 0; color: #555;">
              <li style="margin: 5px 0;">Our visa specialists will review your application within 2-3 business days</li>
              <li style="margin: 5px 0;">You may be contacted for additional documents or information</li>
              <li style="margin: 5px 0;">You'll receive email updates as your application progresses</li>
              <li style="margin: 5px 0;">Once processed, you'll be notified of the decision</li>
            </ol>
          </div>
          
          ${booking.booking?.documents && Object.keys(booking.booking.documents).length > 0 ? `
            <div style="background-color: #e8f5e9; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h4 style="margin-top: 0; color: #333;">Documents Uploaded</h4>
              <ul style="margin: 5px 0 0 0; color: #555;">
                ${Object.entries(booking.booking.documents).map(([category, docs]) => {
                  const docCount = Array.isArray(docs) ? docs.length : (docs ? 1 : 0);
                  return docCount > 0 ? `<li style="margin: 3px 0;">${category}: ${docCount} document(s)</li>` : '';
                }).join('')}
              </ul>
            </div>
          ` : ''}
          
          <hr style="border: none; border-top: 2px solid #f0f0f0; margin: 30px 0;">
          
          <div style="text-align: center;">
            <p style="color: #666; font-size: 14px; line-height: 1.6;">
              Thank you for choosing ${process.env.COMPANY_NAME || 'REC APPLY'} for your visa needs.<br>
              We wish you a smooth application process!
            </p>
          </div>
        </div>
        
        <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
          © ${new Date().getFullYear()} ${process.env.COMPANY_NAME || 'REC APPLY'}. All rights reserved.<br>
          This is an automated message, please do not reply to this email.
        </div>
      </div>
    `;

    return await this.sendEmail(booking.booking?.customer?.email, subject, html);
  },

  // Send admin notification for new booking
  sendAdminNotification: async (booking, visaCatalog = null) => {
    const bookingRef = booking.booking?.bookingReference || 
                      `VISA-${Date.now().toString(36).toUpperCase()}`;
    
    const subject = `New Visa Application Received - ${bookingRef}`;
    
    const visaType = booking.booking?.bookingType || 'Visa Application';
    const country = visaCatalog?.visaCatalog?.country || booking.booking?.serviceRef || 'Not specified';
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f4f4; padding: 20px;">
        <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">${process.env.COMPANY_NAME || 'REC APPLY'}</h1>
          <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Admin Notification - New Visa Application</p>
        </div>
        
        <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-top: 0; border-bottom: 2px solid #f0f0f0; padding-bottom: 15px;">
            New Visa Application Alert! 🛂
          </h2>
          
          <div style="background-color: #fff3e0; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #f5576c;">
            <h3 style="margin-top: 0; color: #f5576c; font-size: 20px;">Application Reference: ${bookingRef}</h3>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Applicant Name:</strong></td>
                <td style="padding: 8px 0; color: #333;">${booking.booking?.customer?.fullName || 'Not provided'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Email:</strong></td>
                <td style="padding: 8px 0; color: #333;">${booking.booking?.customer?.email}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Phone:</strong></td>
                <td style="padding: 8px 0; color: #333;">${booking.booking?.customer?.phone || 'Not provided'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Visa Type:</strong></td>
                <td style="padding: 8px 0; color: #333;">${visaType}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Country:</strong></td>
                <td style="padding: 8px 0; color: #333;">${country}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Nationality:</strong></td>
                <td style="padding: 8px 0; color: #333;">${booking.booking?.customer?.nationality || 'Not provided'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Passport Number:</strong></td>
                <td style="padding: 8px 0; color: #333;">${booking.booking?.customer?.passportNumber || 'Not provided'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Application Date:</strong></td>
                <td style="padding: 8px 0; color: #333;">${new Date(booking.createdAt).toLocaleString()}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Status:</strong></td>
                <td style="padding: 8px 0; color: #333;">
                  <span style="background-color: ${booking.booking?.status === 'confirmed' ? '#4CAF50' : '#FFC107'}; color: ${booking.booking?.status === 'confirmed' ? 'white' : '#333'}; padding: 3px 10px; border-radius: 12px; font-size: 12px;">
                    ${booking.booking?.status || 'Pending'}
                  </span>
                </td>
              </tr>
            </table>
            
            ${booking.booking?.documents && Object.keys(booking.booking.documents).length > 0 ? `
              <div style="margin-top: 15px;">
                <strong style="color: #666;">Documents Uploaded:</strong>
                <ul style="margin: 5px 0 0 0; color: #555;">
                  ${Object.entries(booking.booking.documents).map(([category, docs]) => {
                    const docCount = Array.isArray(docs) ? docs.length : (docs ? 1 : 0);
                    return docCount > 0 ? `<li style="margin: 3px 0;">${category}: ${docCount} document(s)</li>` : '';
                  }).join('')}
                </ul>
              </div>
            ` : ''}
          </div>
          
          <hr style="border: none; border-top: 2px solid #f0f0f0; margin: 30px 0;">
          
          <div style="text-align: center;">
            <p style="color: #666; font-size: 14px; line-height: 1.6;">
              Please review this visa application and process accordingly.<br>
              This is an automated admin notification from ${process.env.COMPANY_NAME || 'REC APPLY'}.
            </p>
          </div>
        </div>
        
        <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
          © ${new Date().getFullYear()} ${process.env.COMPANY_NAME || 'REC APPLY'}. All rights reserved.
        </div>
      </div>
    `;

    return await this.sendEmail(process.env.ADMIN_EMAIL, subject, html, true);
  },

  // Send status update notification
  sendStatusUpdate: async (booking, oldStatus, newStatus) => {
    const bookingRef = booking.booking?.bookingReference || 'N/A';
    
    const subject = `Visa Application Status Update - ${bookingRef}`;
    
    const statusColors = {
      'pending': '#FFC107',
      'confirmed': '#4CAF50',
      'processing': '#2196f3',
      'documents_received': '#9c27b0',
      'under_review': '#ff9800',
      'approved': '#4CAF50',
      'rejected': '#f44336',
      'cancelled': '#9e9e9e',
      'completed': '#4CAF50'
    };

    const oldColor = statusColors[oldStatus] || '#95a5a6';
    const newColor = statusColors[newStatus] || '#95a5a6';
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f4f4; padding: 20px;">
        <div style="background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">${process.env.COMPANY_NAME || 'REC APPLY'}</h1>
          <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Visa Application Update</p>
        </div>
        
        <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-top: 0; border-bottom: 2px solid #f0f0f0; padding-bottom: 15px;">
            Your Visa Application Status Has Been Updated
          </h2>
          
          <p style="font-size: 16px; line-height: 1.6; color: #555;">Dear ${booking.booking?.customer?.fullName || booking.booking?.customer?.name || 'Applicant'},</p>
          
          <p style="font-size: 16px; line-height: 1.6; color: #555;">The status of your visa application has been updated:</p>
          
          <div style="background-color: #f9f9f9; padding: 30px; text-align: center; border-radius: 5px; margin: 20px 0;">
            <div style="display: inline-block; background-color: ${oldColor}20; padding: 15px 30px; border-radius: 5px; margin-right: 10px;">
              <span style="color: ${oldColor}; font-weight: bold;">${oldStatus || 'Pending'}</span>
            </div>
            <span style="font-size: 24px; color: #999; margin: 0 15px;">→</span>
            <div style="display: inline-block; background-color: ${newColor}20; padding: 15px 30px; border-radius: 5px;">
              <span style="color: ${newColor}; font-weight: bold;">${newStatus}</span>
            </div>
          </div>
          
          <div style="background-color: #e8f4fc; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h4 style="margin-top: 0; color: #333;">Application Details</h4>
            <p style="margin: 5px 0; color: #555;"><strong>Application Reference:</strong> ${bookingRef}</p>
            <p style="margin: 5px 0; color: #555;"><strong>Visa Type:</strong> ${booking.booking?.bookingType || 'Visa Application'}</p>
            <p style="margin: 5px 0; color: #555;"><strong>Current Status:</strong> 
              <span style="background-color: ${newColor}; color: white; padding: 3px 10px; border-radius: 12px; font-size: 12px;">
                ${newStatus}
              </span>
            </p>
            <p style="margin: 5px 0; color: #555;"><strong>Updated on:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h4 style="margin-top: 0; color: #333;">What This Means</h4>
            <p style="margin: 5px 0; color: #555;">
              ${newStatus === 'approved' ? 'Congratulations! Your visa has been approved. You will receive further instructions shortly.' : 
                newStatus === 'rejected' ? 'We regret to inform you that your visa application was not successful. You may reapply in the future.' :
                newStatus === 'processing' ? 'Your application is being processed by our team.' :
                newStatus === 'documents_received' ? 'All required documents have been received.' :
                newStatus === 'under_review' ? 'Your application is under review by the authorities.' :
                'Continue to monitor your email for further updates on your application.'}
            </p>
          </div>
          
          <hr style="border: none; border-top: 2px solid #f0f0f0; margin: 30px 0;">
          
          <div style="text-align: center;">
            <p style="color: #666; font-size: 14px; line-height: 1.6;">
              If you have any questions, please contact our visa support team.<br>
              Thank you for choosing ${process.env.COMPANY_NAME || 'REC APPLY'}.
            </p>
          </div>
        </div>
        
        <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
          © ${new Date().getFullYear()} ${process.env.COMPANY_NAME || 'REC APPLY'}. All rights reserved.
        </div>
      </div>
    `;

    return await this.sendEmail(booking.booking?.customer?.email, subject, html);
  },

  // Send document upload confirmation
  sendDocumentUploadConfirmation: async (booking, category, document) => {
    const bookingRef = booking.booking?.bookingReference || 'N/A';
    
    const subject = `Document Uploaded - ${bookingRef}`;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f4f4; padding: 20px;">
        <div style="background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">${process.env.COMPANY_NAME || 'REC APPLY'}</h1>
          <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Document Upload Confirmation</p>
        </div>
        
        <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-top: 0; border-bottom: 2px solid #f0f0f0; padding-bottom: 15px;">
            Document Successfully Uploaded 📎
          </h2>
          
          <p style="font-size: 16px; line-height: 1.6; color: #555;">Dear ${booking.booking?.customer?.fullName || booking.booking?.customer?.name || 'Applicant'},</p>
          
          <p style="font-size: 16px; line-height: 1.6; color: #555;">A document has been successfully uploaded to your visa application:</p>
          
          <div style="background-color: #e8f5e9; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #4CAF50;">
            <h3 style="margin-top: 0; color: #4CAF50; font-size: 18px;">Document Details</h3>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Category:</strong></td>
                <td style="padding: 8px 0; color: #333;">${category}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>File Size:</strong></td>
                <td style="padding: 8px 0; color: #333;">${document.size ? Math.round(document.size / 1024) + ' KB' : 'N/A'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Upload Date:</strong></td>
                <td style="padding: 8px 0; color: #333;">${new Date().toLocaleString()}</td>
              </tr>
            </table>
          </div>
          
          <div style="background-color: #f0f7ff; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 5px 0; color: #555;"><strong>Application Reference:</strong> ${bookingRef}</p>
            <p style="margin: 5px 0; color: #555;"><strong>Status:</strong> 
              <span style="background-color: ${booking.booking?.status === 'confirmed' ? '#4CAF50' : '#FFC107'}; color: ${booking.booking?.status === 'confirmed' ? 'white' : '#333'}; padding: 3px 10px; border-radius: 12px; font-size: 12px;">
                ${booking.booking?.status || 'Pending'}
              </span>
            </p>
          </div>
          
          <hr style="border: none; border-top: 2px solid #f0f0f0; margin: 30px 0;">
          
          <div style="text-align: center;">
            <p style="color: #666; font-size: 14px; line-height: 1.6;">
              Thank you for providing the required documentation.<br>
              Our team will review your documents shortly.
            </p>
          </div>
        </div>
        
        <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
          © ${new Date().getFullYear()} ${process.env.COMPANY_NAME || 'REC APPLY'}. All rights reserved.
        </div>
      </div>
    `;

    return await this.sendEmail(booking.booking?.customer?.email, subject, html);
  }
};

/* =====================================================
   MULTER MEMORY STORAGE
===================================================== */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 }, // Use env or default 5MB
});
exports.upload = upload;

/* =====================================================
   CLOUDINARY UPLOAD HELPER
===================================================== */
const uploadToCloudinary = async (file, folder = "visa_documents") => {
  if (!file) return null;

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "auto" },
      (error, result) => {
        if (error) return reject(error);

        resolve({
          cloudinaryUrl: result.secure_url,
          publicId: result.public_id,
          size: file.size,
          uploadedAt: new Date()
        });
      }
    );
    streamifier.createReadStream(file.buffer).pipe(stream);
  });
};

/* =====================================================
   VISA CATALOG CRUD
===================================================== */

exports.createVisaCatalog = async (req, res) => {
  try {
    const { country, visaType, description, processingTime, price, isActive } =
      req.body;

    if (!country || !visaType) {
      return res
        .status(400)
        .json({ success: false, message: "country and visaType are required" });
    }

    const coverImage = req.file
      ? await uploadToCloudinary(req.file, "visa_catalog")
      : null;

    const visa = await VisaService.create({
      recordType: "visa-catalog",
      visaCatalog: {
        country,
        visaType,
        description,
        processingTime,
        price,
        isActive: isActive !== undefined ? isActive : true,
        coverImage,
      },
    });

    res.status(201).json({ success: true, data: visa });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.getVisaCatalogs = async (req, res) => {
  try {
    const visas = await VisaService.find({
      recordType: "visa-catalog",
      "visaCatalog.isActive": true,
    }).sort({ createdAt: -1 });
    res.json({ success: true, count: visas.length, data: visas });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getVisaCatalogById = async (req, res) => {
  try {
    const visa = await VisaService.findById(req.params.id);
    if (!visa || visa.recordType !== "visa-catalog")
      return res.status(404).json({ success: false, message: "Catalog not found" });

    res.json({ success: true, data: visa });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateVisaCatalog = async (req, res) => {
  try {
    const visa = await VisaService.findById(req.params.id);
    if (!visa || visa.recordType !== "visa-catalog")
      return res.status(404).json({ success: false, message: "Catalog not found" });

    if (req.file && visa.visaCatalog.coverImage?.publicId) {
      await cloudinary.uploader.destroy(visa.visaCatalog.coverImage.publicId);
      visa.visaCatalog.coverImage = await uploadToCloudinary(
        req.file,
        "visa_catalog"
      );
    }

    Object.assign(visa.visaCatalog, req.body);
    await visa.save();

    res.json({ success: true, data: visa });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.deleteVisaCatalog = async (req, res) => {
  try {
    const visa = await VisaService.findById(req.params.id);
    if (!visa || visa.recordType !== "visa-catalog")
      return res.status(404).json({ success: false, message: "Catalog not found" });

    // Soft delete
    visa.visaCatalog.isActive = false;
    await visa.save();

    res.json({ success: true, message: "Visa catalog deactivated" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* =====================================================
   VISA BOOKINGS CRUD
===================================================== */

exports.createBooking = async (req, res) => {
  try {
    // Generate booking reference
    const bookingRef = 'VISA-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 5).toUpperCase();
    
    // Get visa catalog if serviceRef is provided
    let visaCatalog = null;
    if (req.body.serviceRef) {
      visaCatalog = await VisaService.findOne({
        recordType: "visa-catalog",
        _id: req.body.serviceRef,
        "visaCatalog.isActive": true
      });
    }

    const bookingData = {
      bookingType: req.body.bookingType || 'visa_application',
      serviceRef: req.body.serviceRef,
      status: req.body.status || 'pending',
      bookingReference: bookingRef,
      customer: {
        fullName: req.body.customer?.fullName,
        email: req.body.customer?.email,
        phone: req.body.customer?.phone,
        nationality: req.body.customer?.nationality,
        passportNumber: req.body.customer?.passportNumber,
      },
      documents: req.body.documents || {},
    };

    const booking = await VisaService.create({
      recordType: "visa-booking",
      booking: bookingData,
    });

    // Send email notifications (fire and forget)
    Promise.allSettled([
      emailService.sendBookingConfirmation(booking, visaCatalog),
      emailService.sendAdminNotification(booking, visaCatalog)
    ]).then(results => {
      console.log('Email notifications sent:', results.map(r => r.status));
    }).catch(err => {
      console.error('Error sending notification emails:', err);
    });

    res.status(201).json({ success: true, data: booking });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await VisaService.find({
      recordType: "visa-booking",
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getBookingsByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email parameter is required",
      });
    }

    const bookings = await VisaService.find({
      recordType: "visa-booking",
      "booking.customer.email": email,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getBookingById = async (req, res) => {
  try {
    const booking = await VisaService.findById(req.params.id);
    if (!booking || booking.recordType !== "visa-booking")
      return res.status(404).json({ success: false, message: "Booking not found" });

    res.json({ success: true, data: booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateBooking = async (req, res) => {
  try {
    const booking = await VisaService.findById(req.params.id);
    if (!booking || booking.recordType !== "visa-booking")
      return res.status(404).json({ success: false, message: "Booking not found" });

    const oldStatus = booking.booking?.status;

    // Update booking fields
    if (req.body.booking) {
      Object.assign(booking.booking, req.body.booking);
    }
    
    await booking.save();

    // Send status update email if status changed
    const newStatus = booking.booking?.status;
    if (newStatus && oldStatus && newStatus !== oldStatus) {
      emailService.sendStatusUpdate(booking, oldStatus, newStatus)
        .catch(err => console.error('Error sending status update email:', err));
    }

    res.json({ success: true, data: booking });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.deleteBooking = async (req, res) => {
  try {
    await VisaService.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Booking deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* =====================================================
   DOCUMENTS CRUD
===================================================== */

exports.uploadDocument = async (req, res) => {
  try {
    const { id, category } = req.params;
    const booking = await VisaService.findById(id);

    if (!booking || booking.recordType !== "visa-booking")
      return res.status(404).json({ success: false, message: "Booking not found" });

    const doc = await uploadToCloudinary(req.file, "visa_documents");

    if (!booking.booking.documents) booking.booking.documents = {};

    if (Array.isArray(booking.booking.documents[category])) {
      booking.booking.documents[category].push(doc);
    } else {
      booking.booking.documents[category] = [doc];
    }

    await booking.save();

    // Send document upload confirmation
    emailService.sendDocumentUploadConfirmation(booking, category, doc)
      .catch(err => console.error('Error sending document upload confirmation:', err));

    res.json({ success: true, data: doc });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.deleteDocument = async (req, res) => {
  try {
    const { id, publicId, category } = req.params;
    const booking = await VisaService.findById(id);

    if (!booking || booking.recordType !== "visa-booking")
      return res.status(404).json({ success: false, message: "Booking not found" });

    await cloudinary.uploader.destroy(publicId);

    if (Array.isArray(booking.booking.documents[category])) {
      booking.booking.documents[category] =
        booking.booking.documents[category].filter((d) => d.publicId !== publicId);
    }

    await booking.save();
    res.json({ success: true, message: "Document removed" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

/* =====================================================
   DASHBOARD STATISTICS
===================================================== */

exports.getDashboardStats = async (req, res) => {
  try {
    const totalVisas = await VisaService.countDocuments({ recordType: "visa-catalog", "visaCatalog.isActive": true });
    const totalBookings = await VisaService.countDocuments({ recordType: "visa-booking" });

    const bookingStatus = await VisaService.aggregate([
      { $match: { recordType: "visa-booking" } },
      { $group: { _id: "$booking.status", count: { $sum: 1 } } },
    ]);

    const recentBookings = await VisaService.find({ recordType: "visa-booking" })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('booking.customer.fullName booking.customer.email booking.bookingReference booking.status createdAt');

    res.json({
      success: true,
      data: { 
        totalVisas, 
        totalBookings, 
        bookingStatus,
        recentBookings
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};