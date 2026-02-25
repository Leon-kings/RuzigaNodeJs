
// const { Plane, AirportBooking } = require("../models/AirportBooking");
// const cloudinary = require("../cloudinary/cloudinary");
// const nodemailer = require("nodemailer");
// const multer = require("multer");
// const streamifier = require("streamifier");

// /* =====================================================
//    MULTER (INLINE)
// ===================================================== */
// const upload = multer({
//   storage: multer.memoryStorage(),
//   limits: { fileSize: 1 * 1024 * 1024 },
// });
// exports.upload = upload;

// /* =====================================================
//    EMAIL TRANSPORTER
// ===================================================== */
// const transporter = nodemailer.createTransport({
//   host: process.env.SMTP_HOST || "smtp.gmail.com",
//   port: process.env.SMTP_PORT || 587,
//   secure: process.env.EMAIL_SECURE === "true",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// /* =====================================================
//    CLOUDINARY UPLOAD
// ===================================================== */
// const uploadImagesToCloudinary = async (files, folder = "planes") => {
//   if (!files || files.length === 0) return [];

//   return Promise.all(
//     files.map((file, index) => {
//       return new Promise((resolve, reject) => {
//         const stream = cloudinary.uploader.upload_stream(
//           { folder },
//           (error, result) => {
//             if (error) return reject(error);

//             resolve({
//               url: result.secure_url,
//               publicId: result.public_id,
//               isPrimary: index === 0,
//             });
//           }
//         );

//         streamifier.createReadStream(file.buffer).pipe(stream);
//       });
//     })
//   );
// };

// /* =====================================================
//    PLANES
// ===================================================== */

// exports.createPlane = async (req, res) => {
//   try {
//     const images = await uploadImagesToCloudinary(req.files);
//     const plane = await Plane.create({ ...req.body, images });
//     res.status(201).json({ success: true, data: plane });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// exports.getPlanes = async (req, res) => {
//   const planes = await Plane.find().sort({ createdAt: -1 });
//   res.json({ success: true, data: planes });
// };

// exports.getPlane = async (req, res) => {
//   const plane = await Plane.findById(req.params.id);
//   if (!plane) {
//     return res.status(404).json({ success: false, message: "Plane not found" });
//   }
//   res.json({ success: true, data: plane });
// };

// exports.updatePlane = async (req, res) => {
//   const plane = await Plane.findById(req.params.id);
//   if (!plane) {
//     return res.status(404).json({ success: false, message: "Plane not found" });
//   }

//   const newImages = await uploadImagesToCloudinary(req.files);
//   plane.images.push(...newImages);

//   Object.assign(plane, req.body);
//   await plane.save();

//   res.json({ success: true, data: plane });
// };

// exports.deletePlane = async (req, res) => {
//   const plane = await Plane.findById(req.params.id);
//   if (!plane) {
//     return res.status(404).json({ success: false, message: "Plane not found" });
//   }

//   for (const img of plane.images) {
//     await cloudinary.uploader.destroy(img.publicId);
//   }

//   await plane.deleteOne();
//   res.json({ success: true, message: "Plane deleted" });
// };

// /* =====================================================
//    BOOKINGS
// ===================================================== */

// exports.createBooking = async (req, res) => {
//   try {
//     const booking = await AirportBooking.create(req.body);

//     await transporter.sendMail({
//       from: `"Airport Services" <${process.env.EMAIL_USER}>`,
//       to: booking.email,
//       subject: "Booking Confirmation",
//       html: `
//         <h3>Booking Confirmed</h3>
//         <p>Reference: <b>${booking.bookingReference}</b></p>
//         <p>Status: ${booking.status}</p>
//       `,
//     });

//     booking.statistics.emailSentCount += 1;
//     await booking.save();

//     res.status(201).json({ success: true, data: booking });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// exports.getBookings = async (req, res) => {
//   const bookings = await AirportBooking.find()
//     .populate("plane", "registrationNumber model manufacturer")
//     .sort({ createdAt: -1 });

//   res.json({ success: true, data: bookings });
// };

// exports.getBooking = async (req, res) => {
//   const booking = await AirportBooking.findById(req.params.id)
//     .populate("plane", "registrationNumber model manufacturer");

//   if (!booking) {
//     return res.status(404).json({ success: false, message: "Booking not found" });
//   }

//   res.json({ success: true, data: booking });
// };

// exports.getBookingsByEmail = async (req, res) => {
//   const bookings = await AirportBooking.find({ email: req.params.email })
//     .populate("plane", "registrationNumber model manufacturer")
//     .sort({ createdAt: -1 });

//   res.json({ success: true, data: bookings });
// };

// exports.updateBooking = async (req, res) => {
//   const booking = await AirportBooking.findByIdAndUpdate(
//     req.params.id,
//     req.body,
//     { new: true }
//   );

//   if (!booking) {
//     return res.status(404).json({ success: false, message: "Booking not found" });
//   }

//   res.json({ success: true, data: booking });
// };

// exports.updateBookingStatus = async (req, res) => {
//   const booking = await AirportBooking.findById(req.params.id);
//   if (!booking) {
//     return res.status(404).json({ success: false, message: "Booking not found" });
//   }

//   booking.status = req.body.status;
//   await booking.save();

//   await transporter.sendMail({
//     to: booking.email,
//     subject: "Booking Status Updated",
//     html: `<h3>Status updated to: ${booking.status}</h3>`,
//   });

//   booking.statistics.emailSentCount += 1;
//   await booking.save();

//   res.json({ success: true, data: booking });
// };

// exports.deleteBooking = async (req, res) => {
//   const booking = await AirportBooking.findByIdAndDelete(req.params.id);
//   if (!booking) {
//     return res.status(404).json({ success: false, message: "Booking not found" });
//   }

//   res.json({ success: true, message: "Booking cancelled" });
// };























const { Plane, AirportBooking } = require("../models/AirportBooking");
const cloudinary = require("../cloudinary/cloudinary");
const nodemailer = require("nodemailer");
const multer = require("multer");
const streamifier = require("streamifier");

/* =====================================================
   MULTER (INLINE)
===================================================== */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE) || 1 * 1024 * 1024 },
});
exports.upload = upload;

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
        from: `"${process.env.COMPANY_NAME || 'REC APPLY'} Airport Services" <${process.env.EMAIL_FROM}>`,
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

  sendBookingConfirmation: async (booking, plane) => {
    const subject = `Booking Confirmed - ${booking.bookingReference || 'New Booking'}`;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f4f4; padding: 20px;">
        <div style="background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">${process.env.COMPANY_NAME || 'REC APPLY'}</h1>
          <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Airport Services - Booking Confirmation</p>
        </div>
        
        <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-top: 0; border-bottom: 2px solid #f0f0f0; padding-bottom: 15px;">
            Thank You for Your Booking! ✈️
          </h2>
          
          <p style="font-size: 16px; line-height: 1.6; color: #555;">Dear ${booking.passengerName || booking.name || 'Passenger'},</p>
          
          <p style="font-size: 16px; line-height: 1.6; color: #555;">Your airport service booking has been confirmed. Here are your booking details:</p>
          
          <div style="background-color: #e3f2fd; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #1e3c72;">
            <h3 style="margin-top: 0; color: #1e3c72; font-size: 20px;">Booking Reference: ${booking.bookingReference || 'N/A'}</h3>
            
            <table style="width: 100%; border-collapse: collapse;">
              ${plane ? `
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>Aircraft:</strong></td>
                  <td style="padding: 8px 0; color: #333;">${plane.manufacturer || ''} ${plane.model || ''} (${plane.registrationNumber || 'N/A'})</td>
                </tr>
              ` : ''}
              ${booking.flightNumber ? `
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>Flight Number:</strong></td>
                  <td style="padding: 8px 0; color: #333;">${booking.flightNumber}</td>
                </tr>
              ` : ''}
              ${booking.departureAirport ? `
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>Departure:</strong></td>
                  <td style="padding: 8px 0; color: #333;">${booking.departureAirport}</td>
                </tr>
              ` : ''}
              ${booking.arrivalAirport ? `
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>Arrival:</strong></td>
                  <td style="padding: 8px 0; color: #333;">${booking.arrivalAirport}</td>
                </tr>
              ` : ''}
              ${booking.departureDate ? `
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>Departure Date:</strong></td>
                  <td style="padding: 8px 0; color: #333;">${new Date(booking.departureDate).toLocaleDateString()}</td>
                </tr>
              ` : ''}
              ${booking.returnDate ? `
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>Return Date:</strong></td>
                  <td style="padding: 8px 0; color: #333;">${new Date(booking.returnDate).toLocaleDateString()}</td>
                </tr>
              ` : ''}
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Passengers:</strong></td>
                <td style="padding: 8px 0; color: #333;">${booking.passengerCount || booking.passengers || 1}</td>
              </tr>
              ${booking.serviceType ? `
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>Service Type:</strong></td>
                  <td style="padding: 8px 0; color: #333;">${booking.serviceType}</td>
                </tr>
              ` : ''}
              ${booking.totalPrice ? `
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>Total Price:</strong></td>
                  <td style="padding: 8px 0; color: #333; font-weight: bold;">$${booking.totalPrice}</td>
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
            
            ${booking.specialRequests ? `
              <div style="margin-top: 15px;">
                <strong style="color: #666;">Special Requests:</strong>
                <p style="color: #555; font-style: italic; margin: 5px 0 0 0; background-color: white; padding: 10px; border-radius: 5px;">${booking.specialRequests}</p>
              </div>
            ` : ''}
          </div>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h4 style="margin-top: 0; color: #333;">Passenger Information</h4>
            <p style="margin: 5px 0; color: #555;"><strong>Name:</strong> ${booking.passengerName || booking.name || 'Not provided'}</p>
            <p style="margin: 5px 0; color: #555;"><strong>Email:</strong> ${booking.email}</p>
            <p style="margin: 5px 0; color: #555;"><strong>Phone:</strong> ${booking.phone || booking.passengerPhone || 'Not provided'}</p>
          </div>
          
          <hr style="border: none; border-top: 2px solid #f0f0f0; margin: 30px 0;">
          
          <div style="text-align: center;">
            <p style="color: #666; font-size: 14px; line-height: 1.6;">
              Thank you for choosing ${process.env.COMPANY_NAME || 'REC APPLY'} Airport Services.<br>
              We wish you a pleasant journey!
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

  sendAdminNotification: async (booking, plane) => {
    const subject = `New Airport Booking Received - ${booking.bookingReference || 'New Booking'}`;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f4f4; padding: 20px;">
        <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">${process.env.COMPANY_NAME || 'REC APPLY'}</h1>
          <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Admin Notification - New Airport Booking</p>
        </div>
        
        <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-top: 0; border-bottom: 2px solid #f0f0f0; padding-bottom: 15px;">
            New Airport Booking Alert! ✈️
          </h2>
          
          <div style="background-color: #fff3e0; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #f5576c;">
            <h3 style="margin-top: 0; color: #f5576c; font-size: 20px;">Booking Reference: ${booking.bookingReference || 'N/A'}</h3>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Passenger Name:</strong></td>
                <td style="padding: 8px 0; color: #333;">${booking.passengerName || booking.name || 'Not provided'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Passenger Email:</strong></td>
                <td style="padding: 8px 0; color: #333;">${booking.email}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Passenger Phone:</strong></td>
                <td style="padding: 8px 0; color: #333;">${booking.phone || booking.passengerPhone || 'Not provided'}</td>
              </tr>
              ${plane ? `
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>Aircraft:</strong></td>
                  <td style="padding: 8px 0; color: #333;">${plane.manufacturer || ''} ${plane.model || ''} (${plane.registrationNumber || 'N/A'})</td>
                </tr>
              ` : ''}
              ${booking.flightNumber ? `
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>Flight Number:</strong></td>
                  <td style="padding: 8px 0; color: #333;">${booking.flightNumber}</td>
                </tr>
              ` : ''}
              ${booking.departureAirport ? `
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>Departure:</strong></td>
                  <td style="padding: 8px 0; color: #333;">${booking.departureAirport}</td>
                </tr>
              ` : ''}
              ${booking.arrivalAirport ? `
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>Arrival:</strong></td>
                  <td style="padding: 8px 0; color: #333;">${booking.arrivalAirport}</td>
                </tr>
              ` : ''}
              ${booking.departureDate ? `
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>Departure Date:</strong></td>
                  <td style="padding: 8px 0; color: #333;">${new Date(booking.departureDate).toLocaleDateString()}</td>
                </tr>
              ` : ''}
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Passengers:</strong></td>
                <td style="padding: 8px 0; color: #333;">${booking.passengerCount || booking.passengers || 1}</td>
              </tr>
              ${booking.serviceType ? `
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>Service Type:</strong></td>
                  <td style="padding: 8px 0; color: #333;">${booking.serviceType}</td>
                </tr>
              ` : ''}
              ${booking.totalPrice ? `
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>Total Price:</strong></td>
                  <td style="padding: 8px 0; color: #333; font-weight: bold;">$${booking.totalPrice}</td>
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
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Booking Date:</strong></td>
                <td style="padding: 8px 0; color: #333;">${new Date(booking.createdAt || Date.now()).toLocaleString()}</td>
              </tr>
            </table>
            
            ${booking.specialRequests ? `
              <div style="margin-top: 15px; background-color: #fff9e6; padding: 15px; border-radius: 5px;">
                <strong style="color: #666;">Special Requests:</strong>
                <p style="color: #555; margin: 5px 0 0 0;">${booking.specialRequests}</p>
              </div>
            ` : ''}
          </div>
          
          <hr style="border: none; border-top: 2px solid #f0f0f0; margin: 30px 0;">
          
          <div style="text-align: center;">
            <p style="color: #666; font-size: 14px; line-height: 1.6;">
              Please process this booking and confirm with the passenger.<br>
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

  sendStatusUpdate: async (booking, oldStatus, newStatus) => {
    const subject = `Your Booking Status Has Been Updated - ${booking.bookingReference}`;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f4f4; padding: 20px;">
        <div style="background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">${process.env.COMPANY_NAME || 'REC APPLY'}</h1>
          <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Booking Status Update</p>
        </div>
        
        <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-top: 0; border-bottom: 2px solid #f0f0f0; padding-bottom: 15px;">
            Your Booking Status Has Been Updated
          </h2>
          
          <p style="font-size: 16px; line-height: 1.6; color: #555;">Dear ${booking.passengerName || booking.name || 'Passenger'},</p>
          
          <p style="font-size: 16px; line-height: 1.6; color: #555;">The status of your airport service booking has been updated:</p>
          
          <div style="background-color: #f9f9f9; padding: 30px; text-align: center; border-radius: 5px; margin: 20px 0;">
            <div style="display: inline-block; background-color: #ffebee; padding: 15px 30px; border-radius: 5px; margin-right: 10px;">
              <span style="color: #f44336; font-weight: bold;">${oldStatus || 'Previous'}</span>
            </div>
            <span style="font-size: 24px; color: #999; margin: 0 15px;">→</span>
            <div style="display: inline-block; background-color: #e8f5e8; padding: 15px 30px; border-radius: 5px;">
              <span style="color: #4CAF50; font-weight: bold;">${newStatus || 'Current'}</span>
            </div>
          </div>
          
          <div style="background-color: #e3f2fd; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h4 style="margin-top: 0; color: #333;">Booking Reference: ${booking.bookingReference || 'N/A'}</h4>
            <p style="margin: 5px 0; color: #555;"><strong>Current Status:</strong> 
              <span style="background-color: ${newStatus === 'confirmed' ? '#4CAF50' : newStatus === 'cancelled' ? '#f44336' : '#FFC107'}; color: ${newStatus === 'pending' ? '#333' : 'white'}; padding: 3px 10px; border-radius: 12px; font-size: 12px;">
                ${newStatus || 'Pending'}
              </span>
            </p>
            ${booking.flightNumber ? `<p style="margin: 5px 0; color: #555;"><strong>Flight:</strong> ${booking.flightNumber}</p>` : ''}
            ${booking.departureDate ? `<p style="margin: 5px 0; color: #555;"><strong>Date:</strong> ${new Date(booking.departureDate).toLocaleDateString()}</p>` : ''}
          </div>
          
          <hr style="border: none; border-top: 2px solid #f0f0f0; margin: 30px 0;">
          
          <div style="text-align: center;">
            <p style="color: #666; font-size: 14px; line-height: 1.6;">
              If you have any questions, please don't hesitate to contact us.<br>
              Thank you for choosing ${process.env.COMPANY_NAME || 'REC APPLY'} Airport Services.
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

/* =====================================================
   CLOUDINARY UPLOAD
===================================================== */
const uploadImagesToCloudinary = async (files, folder = "planes") => {
  if (!files || files.length === 0) return [];

  return Promise.all(
    files.map((file, index) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder },
          (error, result) => {
            if (error) return reject(error);

            resolve({
              url: result.secure_url,
              publicId: result.public_id,
              isPrimary: index === 0,
            });
          }
        );

        streamifier.createReadStream(file.buffer).pipe(stream);
      });
    })
  );
};

/* =====================================================
   PLANES
===================================================== */

exports.createPlane = async (req, res) => {
  try {
    const images = await uploadImagesToCloudinary(req.files);
    const plane = await Plane.create({ ...req.body, images });
    res.status(201).json({ success: true, data: plane });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getPlanes = async (req, res) => {
  const planes = await Plane.find().sort({ createdAt: -1 });
  res.json({ success: true, data: planes });
};

exports.getPlane = async (req, res) => {
  const plane = await Plane.findById(req.params.id);
  if (!plane) {
    return res.status(404).json({ success: false, message: "Plane not found" });
  }
  res.json({ success: true, data: plane });
};

exports.updatePlane = async (req, res) => {
  const plane = await Plane.findById(req.params.id);
  if (!plane) {
    return res.status(404).json({ success: false, message: "Plane not found" });
  }

  const newImages = await uploadImagesToCloudinary(req.files);
  plane.images.push(...newImages);

  Object.assign(plane, req.body);
  await plane.save();

  res.json({ success: true, data: plane });
};

exports.deletePlane = async (req, res) => {
  const plane = await Plane.findById(req.params.id);
  if (!plane) {
    return res.status(404).json({ success: false, message: "Plane not found" });
  }

  for (const img of plane.images) {
    await cloudinary.uploader.destroy(img.publicId);
  }

  await plane.deleteOne();
  res.json({ success: true, message: "Plane deleted" });
};

/* =====================================================
   BOOKINGS
===================================================== */

exports.createBooking = async (req, res) => {
  try {
    // Generate booking reference
    const bookingRef = 'AIR-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 5).toUpperCase();
    
    const bookingData = {
      ...req.body,
      bookingReference: bookingRef,
      statistics: { emailSentCount: 0 }
    };

    const booking = await AirportBooking.create(bookingData);
    
    // Get plane details if plane ID is provided
    let plane = null;
    if (booking.plane) {
      plane = await Plane.findById(booking.plane);
    }

    // Send email notifications
    Promise.allSettled([
      emailService.sendBookingConfirmation(booking, plane),
      emailService.sendAdminNotification(booking, plane)
    ]).then(results => {
      console.log('Email notifications sent:', results.map(r => r.status));
      
      // Update email sent count if successful
      if (results[0]?.value?.success) {
        booking.statistics.emailSentCount += 1;
        booking.save().catch(err => console.error('Error saving email count:', err));
      }
    }).catch(err => {
      console.error('Error sending notification emails:', err);
    });

    res.status(201).json({ success: true, data: booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getBookings = async (req, res) => {
  const bookings = await AirportBooking.find()
    .populate("plane", "registrationNumber model manufacturer")
    .sort({ createdAt: -1 });

  res.json({ success: true, data: bookings });
};

exports.getBooking = async (req, res) => {
  const booking = await AirportBooking.findById(req.params.id)
    .populate("plane", "registrationNumber model manufacturer");

  if (!booking) {
    return res.status(404).json({ success: false, message: "Booking not found" });
  }

  res.json({ success: true, data: booking });
};

exports.getBookingsByEmail = async (req, res) => {
  const bookings = await AirportBooking.find({ email: req.params.email })
    .populate("plane", "registrationNumber model manufacturer")
    .sort({ createdAt: -1 });

  res.json({ success: true, data: bookings });
};

exports.updateBooking = async (req, res) => {
  const booking = await AirportBooking.findById(req.params.id);
  if (!booking) {
    return res.status(404).json({ success: false, message: "Booking not found" });
  }

  const oldStatus = booking.status;
  
  Object.assign(booking, req.body);
  await booking.save();

  // Send status update email if status changed
  if (req.body.status && oldStatus !== req.body.status) {
    emailService.sendStatusUpdate(booking, oldStatus, req.body.status)
      .then(() => {
        booking.statistics.emailSentCount += 1;
        booking.save().catch(err => console.error('Error saving email count:', err));
      })
      .catch(err => console.error('Error sending status update email:', err));
  }

  res.json({ success: true, data: booking });
};

exports.updateBookingStatus = async (req, res) => {
  const booking = await AirportBooking.findById(req.params.id);
  if (!booking) {
    return res.status(404).json({ success: false, message: "Booking not found" });
  }

  const oldStatus = booking.status;
  booking.status = req.body.status;
  await booking.save();

  // Send status update email
  emailService.sendStatusUpdate(booking, oldStatus, req.body.status)
    .then(() => {
      booking.statistics.emailSentCount += 1;
      booking.save().catch(err => console.error('Error saving email count:', err));
    })
    .catch(err => console.error('Error sending status update email:', err));

  res.json({ success: true, data: booking });
};

exports.deleteBooking = async (req, res) => {
  const booking = await AirportBooking.findByIdAndDelete(req.params.id);
  if (!booking) {
    return res.status(404).json({ success: false, message: "Booking not found" });
  }

  res.json({ success: true, message: "Booking cancelled" });
};