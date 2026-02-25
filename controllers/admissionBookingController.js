

// const mongoose = require("mongoose");
// const nodemailer = require("nodemailer");
// const AdmissionManagement = require("../models/AdmissionBooking");

// // ====================
// // EMAIL TRANSPORT
// // ====================
// const transporter = nodemailer.createTransport({
//   host: process.env.SMTP_HOST,
//   port: process.env.SMTP_PORT,
//   secure: false,
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASS,
//   },
// });

// // ====================
// // HELPERS
// // ====================
// const safeBody = (value) => {
//   if (!value) return value;
//   if (typeof value === "string") {
//     try {
//       return JSON.parse(value);
//     } catch {
//       return value;
//     }
//   }
//   return value;
// };

// // ====================
// // CONTROLLER
// // ====================
// class AdmissionController {
//   constructor() {}

//   // ====================
//   // CREATE METHODS
//   // ====================
//   async createBooking(req, res) {
//     try {
//       const booking = safeBody(req.body.booking);

//       const record = await AdmissionManagement.create({
//         recordType: "booking",
//         booking,
//         createdBy: req.user?._id || null,
//       });

//       res.status(201).json({
//         success: true,
//         message: "Booking created successfully",
//         data: record,
//       });
//     } catch (error) {
//       console.error("Create booking error:", error);
//       res.status(500).json({
//         success: false,
//         message: "Failed to create booking",
//         error: error.message,
//       });
//     }
//   }

//   async createUniversity(req, res) {
//     try {
//       const university = safeBody(req.body.university);

//       const record = await AdmissionManagement.create({
//         recordType: "university",
//         university,
//         createdBy: req.user?._id || null,
//       });

//       res.status(201).json({
//         success: true,
//         message: "University created successfully",
//         data: record,
//       });
//     } catch (error) {
//       console.error("Create university error:", error);
//       res.status(500).json({
//         success: false,
//         message: "Failed to create university",
//         error: error.message,
//       });
//     }
//   }

//   async createApplication(req, res) {
//     try {
//       const application = safeBody(req.body.application);

//       if (req.files?.length) {
//         application.documents = req.files.map((f) => f.path);
//       }

//       const record = await AdmissionManagement.create({
//         recordType: "application",
//         application,
//         createdBy: req.user?._id || null,
//       });

//       res.status(201).json({
//         success: true,
//         message: "Application created successfully",
//         data: record,
//       });
//     } catch (error) {
//       console.error("Create application error:", error);
//       res.status(500).json({
//         success: false,
//         message: "Failed to create application",
//         error: error.message,
//       });
//     }
//   }

//   // ====================
//   // READ METHODS
//   // ====================
//   async getRecords(req, res) {
//     try {
//       const { recordType } = req.params;

//       const records = await AdmissionManagement.find(
//         recordType ? { recordType } : {}
//       ).sort({ createdAt: -1 });

//       res.json({
//         success: true,
//         data: records,
//       });
//     } catch (error) {
//       console.error("Get records error:", error);
//       res.status(500).json({
//         success: false,
//         message: "Failed to fetch records",
//         error: error.message,
//       });
//     }
//   }

//   async getUserRecords(req, res) {
//     try {
//       const { recordType } = req.params;

//       const records = await AdmissionManagement.find({
//         recordType,
//         createdBy: req.user?._id,
//       }).sort({ createdAt: -1 });

//       res.json({
//         success: true,
//         data: records,
//       });
//     } catch (error) {
//       console.error("Get user records error:", error);
//       res.status(500).json({
//         success: false,
//         message: "Failed to fetch user records",
//         error: error.message,
//       });
//     }
//   }

//   async getRecord(req, res) {
//     try {
//       const record = await AdmissionManagement.findById(req.params.id);

//       if (!record) {
//         return res.status(404).json({
//           success: false,
//           message: "Record not found",
//         });
//       }

//       res.json({
//         success: true,
//         data: record,
//       });
//     } catch (error) {
//       console.error("Get record error:", error);
//       res.status(500).json({
//         success: false,
//         message: "Failed to fetch record",
//         error: error.message,
//       });
//     }
//   }

//   // ====================
//   // UPDATE / DELETE
//   // ====================
//   async updateRecord(req, res) {
//     try {
//       const record = await AdmissionManagement.findByIdAndUpdate(
//         req.params.id,
//         req.body,
//         { new: true }
//       );

//       res.json({
//         success: true,
//         message: "Record updated successfully",
//         data: record,
//       });
//     } catch (error) {
//       console.error("Update record error:", error);
//       res.status(500).json({
//         success: false,
//         message: "Failed to update record",
//         error: error.message,
//       });
//     }
//   }

//   async deleteRecord(req, res) {
//     try {
//       await AdmissionManagement.findByIdAndDelete(req.params.id);

//       res.json({
//         success: true,
//         message: "Record deleted successfully",
//       });
//     } catch (error) {
//       console.error("Delete record error:", error);
//       res.status(500).json({
//         success: false,
//         message: "Failed to delete record",
//         error: error.message,
//       });
//     }
//   }

//   // ====================
//   // STATISTICS
//   // ====================
//   async getStatistics(req, res) {
//     try {
//       const { recordType } = req.params;
//       const count = await AdmissionManagement.countDocuments({ recordType });

//       res.json({
//         success: true,
//         count,
//       });
//     } catch (error) {
//       console.error("Get statistics error:", error);
//       res.status(500).json({
//         success: false,
//         message: "Failed to get statistics",
//         error: error.message,
//       });
//     }
//   }

//   async getDashboardStatistics(req, res) {
//     try {
//       res.json({ success: true, data: {} });
//     } catch (error) {
//       console.error("Get dashboard statistics error:", error);
//       res.status(500).json({
//         success: false,
//         message: "Failed to get dashboard statistics",
//         error: error.message,
//       });
//     }
//   }

//   async getAnalytics(req, res) {
//     try {
//       const { type } = req.params;
//       const {
//         startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
//         endDate = new Date().toISOString(),
//       } = req.query;

//       let result;

//       switch (type) {
//         case "application":
//         case "booking":
//           result = await AdmissionManagement.find({
//             recordType: type,
//             createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
//           });
//           break;
//         case "university":
//           result = await AdmissionManagement.find({ recordType: "university" });
//           break;
//         default:
//           return res.status(400).json({
//             success: false,
//             message: "Invalid analytics type",
//           });
//       }

//       res.json({
//         success: true,
//         data: result,
//       });
//     } catch (error) {
//       console.error("Get analytics error:", error);
//       res.status(500).json({
//         success: false,
//         message: "Failed to get analytics",
//         error: error.message,
//       });
//     }
//   }

//   // ====================
//   // BOOKING REMINDERS
//   // ====================
//   async sendBookingReminders(req, res) {
//     try {
//       const tomorrow = new Date();
//       tomorrow.setDate(tomorrow.getDate() + 1);

//       const bookings = await AdmissionManagement.find({
//         recordType: "booking",
//         isActive: true,
//         "booking.status": { $in: ["confirmed", "pending"] },
//         "booking.details.bookingDate": {
//           $gte: new Date(tomorrow.setHours(0, 0, 0, 0)),
//           $lt: new Date(tomorrow.setHours(23, 59, 59, 999)),
//         },
//         "booking.reminderSent": false,
//       });

//       const results = [];

//       for (const booking of bookings) {
//         try {
//           await this.sendEmail(
//             booking.booking.visitor.email,
//             "Booking Reminder",
//             "booking_reminder",
//             booking.booking
//           );

//           booking.booking.reminderSent = true;
//           await booking.save();

//           results.push({ bookingId: booking.recordId, success: true });
//         } catch (err) {
//           results.push({
//             bookingId: booking.recordId,
//             success: false,
//             error: err.message,
//           });
//         }
//       }

//       res.json({ success: true, results });
//     } catch (error) {
//       console.error("Send booking reminders error:", error);
//       res.status(500).json({
//         success: false,
//         message: "Failed to send booking reminders",
//         error: error.message,
//       });
//     }
//   }

//   // ====================
//   // HELPERS
//   // ====================
//   async sendEmail(to, subject, template, data) {
//     await transporter.sendMail({
//       from: process.env.SMTP_FROM,
//       to,
//       subject,
//       html: `<pre>${JSON.stringify(data, null, 2)}</pre>`,
//     });

//     return { success: true };
//   }

//   getNextStepsForStatus(status) {
//     const steps = {
//       submitted: "Awaiting review",
//       accepted: "Proceed with enrollment",
//       rejected: "Application rejected",
//     };
//     return steps[status] || "Check portal for updates";
//   }
// }

// // ====================
// // EXPORT
// // ====================
// module.exports = new AdmissionController();


















const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const AdmissionManagement = require("../models/AdmissionBooking");

// ====================
// EMAIL TRANSPORT
// ====================
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

// ====================
// EMAIL SERVICE
// ====================
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
        from: `"${process.env.COMPANY_NAME || 'REC APPLY'} Admissions" <${process.env.EMAIL_FROM}>`,
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

  sendBookingConfirmation: async (bookingData, userEmail, userName) => {
    const subject = `Booking Confirmation - ${bookingData.bookingReference || 'New Booking'}`;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f4f4; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">${process.env.COMPANY_NAME || 'REC APPLY'}</h1>
          <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Admission Booking Confirmation</p>
        </div>
        
        <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-top: 0; border-bottom: 2px solid #f0f0f0; padding-bottom: 15px;">
            Thank You for Your Booking! 🎓
          </h2>
          
          <p style="font-size: 16px; line-height: 1.6; color: #555;">Dear ${userName || 'Student'},</p>
          
          <p style="font-size: 16px; line-height: 1.6; color: #555;">Your admission consultation booking has been confirmed. Here are your booking details:</p>
          
          <div style="background-color: #f0f7ff; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #667eea;">
            <h3 style="margin-top: 0; color: #667eea; font-size: 20px;">Booking Reference: ${bookingData.bookingReference || 'N/A'}</h3>
            
            <table style="width: 100%; border-collapse: collapse;">
              ${bookingData.university ? `
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>University:</strong></td>
                  <td style="padding: 8px 0; color: #333;">${bookingData.university}</td>
                </tr>
              ` : ''}
              ${bookingData.program ? `
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>Program:</strong></td>
                  <td style="padding: 8px 0; color: #333;">${bookingData.program}</td>
                </tr>
              ` : ''}
              ${bookingData.details?.bookingDate ? `
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>Consultation Date:</strong></td>
                  <td style="padding: 8px 0; color: #333;">${new Date(bookingData.details.bookingDate).toLocaleDateString()}</td>
                </tr>
              ` : ''}
              ${bookingData.details?.timeSlot ? `
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>Time Slot:</strong></td>
                  <td style="padding: 8px 0; color: #333;">${bookingData.details.timeSlot}</td>
                </tr>
              ` : ''}
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Status:</strong></td>
                <td style="padding: 8px 0; color: #333;">
                  <span style="background-color: #4CAF50; color: white; padding: 3px 10px; border-radius: 12px; font-size: 12px;">
                    ${bookingData.status || 'Confirmed'}
                  </span>
                </td>
              </tr>
            </table>
            
            ${bookingData.visitor?.message || bookingData.message ? `
              <div style="margin-top: 15px;">
                <strong style="color: #666;">Your Message:</strong>
                <p style="color: #555; font-style: italic; margin: 5px 0 0 0; background-color: white; padding: 10px; border-radius: 5px;">${bookingData.visitor?.message || bookingData.message}</p>
              </div>
            ` : ''}
          </div>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h4 style="margin-top: 0; color: #333;">Next Steps</h4>
            <p style="margin: 5px 0; color: #555;">${this.getNextStepsForStatus(bookingData.status)}</p>
          </div>
          
          <hr style="border: none; border-top: 2px solid #f0f0f0; margin: 30px 0;">
          
          <div style="text-align: center;">
            <p style="color: #666; font-size: 14px; line-height: 1.6;">
              Thank you for choosing ${process.env.COMPANY_NAME || 'REC APPLY'} for your admission journey.<br>
              We'll be in touch with you shortly.
            </p>
          </div>
        </div>
        
        <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
          © ${new Date().getFullYear()} ${process.env.COMPANY_NAME || 'REC APPLY'}. All rights reserved.<br>
          This is an automated message, please do not reply to this email.
        </div>
      </div>
    `;

    return await this.sendEmail(userEmail, subject, html);
  },

  sendApplicationConfirmation: async (applicationData, userEmail, userName) => {
    const subject = `Application Received - ${applicationData.applicationReference || 'New Application'}`;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f4f4; padding: 20px;">
        <div style="background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">${process.env.COMPANY_NAME || 'REC APPLY'}</h1>
          <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Application Received</p>
        </div>
        
        <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-top: 0; border-bottom: 2px solid #f0f0f0; padding-bottom: 15px;">
            Application Successfully Submitted! 📝
          </h2>
          
          <p style="font-size: 16px; line-height: 1.6; color: #555;">Dear ${userName || 'Applicant'},</p>
          
          <p style="font-size: 16px; line-height: 1.6; color: #555;">Thank you for submitting your application. We have received it and it's now being processed.</p>
          
          <div style="background-color: #e8f5e9; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #11998e;">
            <h3 style="margin-top: 0; color: #11998e; font-size: 20px;">Application Reference: ${applicationData.applicationReference || 'N/A'}</h3>
            
            <table style="width: 100%; border-collapse: collapse;">
              ${applicationData.university ? `
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>University:</strong></td>
                  <td style="padding: 8px 0; color: #333;">${applicationData.university}</td>
                </tr>
              ` : ''}
              ${applicationData.program ? `
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>Program:</strong></td>
                  <td style="padding: 8px 0; color: #333;">${applicationData.program}</td>
                </tr>
              ` : ''}
              ${applicationData.intake ? `
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>Intake:</strong></td>
                  <td style="padding: 8px 0; color: #333;">${applicationData.intake}</td>
                </tr>
              ` : ''}
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Submitted on:</strong></td>
                <td style="padding: 8px 0; color: #333;">${new Date().toLocaleDateString()}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Status:</strong></td>
                <td style="padding: 8px 0; color: #333;">
                  <span style="background-color: #FFC107; color: #333; padding: 3px 10px; border-radius: 12px; font-size: 12px;">
                    ${applicationData.status || 'Under Review'}
                  </span>
                </td>
              </tr>
            </table>
            
            ${applicationData.documents && applicationData.documents.length > 0 ? `
              <div style="margin-top: 15px;">
                <strong style="color: #666;">Documents Submitted:</strong>
                <ul style="margin: 5px 0 0 0; color: #555;">
                  ${applicationData.documents.map(doc => `<li style="padding: 2px 0;">${doc.split('/').pop()}</li>`).join('')}
                </ul>
              </div>
            ` : ''}
          </div>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h4 style="margin-top: 0; color: #333;">What Happens Next?</h4>
            <p style="margin: 5px 0; color: #555;">Our admissions team will review your application and contact you within 2-3 business days.</p>
          </div>
          
          <hr style="border: none; border-top: 2px solid #f0f0f0; margin: 30px 0;">
          
          <div style="text-align: center;">
            <p style="color: #666; font-size: 14px; line-height: 1.6;">
              We wish you the best of luck with your application!<br>
              ${process.env.COMPANY_NAME || 'REC APPLY'} Team
            </p>
          </div>
        </div>
        
        <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
          © ${new Date().getFullYear()} ${process.env.COMPANY_NAME || 'REC APPLY'}. All rights reserved.
        </div>
      </div>
    `;

    return await this.sendEmail(userEmail, subject, html);
  },

  sendAdminNotification: async (recordType, data, userEmail, userName) => {
    const subject = `New ${recordType.charAt(0).toUpperCase() + recordType.slice(1)} Received`;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f4f4; padding: 20px;">
        <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">${process.env.COMPANY_NAME || 'REC APPLY'}</h1>
          <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Admin Notification</p>
        </div>
        
        <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-top: 0; border-bottom: 2px solid #f0f0f0; padding-bottom: 15px;">
            New ${recordType.charAt(0).toUpperCase() + recordType.slice(1)} Alert! 🔔
          </h2>
          
          <div style="background-color: #fff3e0; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #f5576c;">
            <h3 style="margin-top: 0; color: #f5576c; font-size: 20px;">${recordType === 'booking' ? 'Booking' : recordType === 'application' ? 'Application' : 'University'} Details</h3>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Reference:</strong></td>
                <td style="padding: 8px 0; color: #333;">${data.bookingReference || data.applicationReference || 'N/A'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Submitted by:</strong></td>
                <td style="padding: 8px 0; color: #333;">${userName || 'Not provided'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Email:</strong></td>
                <td style="padding: 8px 0; color: #333;">${userEmail || 'Not provided'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Date:</strong></td>
                <td style="padding: 8px 0; color: #333;">${new Date().toLocaleString()}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Status:</strong></td>
                <td style="padding: 8px 0; color: #333;">
                  <span style="background-color: ${data.status === 'confirmed' || data.status === 'submitted' ? '#4CAF50' : '#FFC107'}; color: ${data.status === 'submitted' ? '#333' : 'white'}; padding: 3px 10px; border-radius: 12px; font-size: 12px;">
                    ${data.status || 'Pending'}
                  </span>
                </td>
              </tr>
            </table>
            
            ${recordType === 'application' && data.documents && data.documents.length > 0 ? `
              <div style="margin-top: 15px;">
                <strong style="color: #666;">Documents:</strong>
                <ul style="margin: 5px 0 0 0; color: #555;">
                  ${data.documents.map(doc => `<li style="padding: 2px 0;">${doc.split('/').pop()}</li>`).join('')}
                </ul>
              </div>
            ` : ''}
            
            ${data.visitor?.message || data.message ? `
              <div style="margin-top: 15px; background-color: #fff9e6; padding: 15px; border-radius: 5px;">
                <strong style="color: #666;">Message:</strong>
                <p style="color: #555; margin: 5px 0 0 0;">${data.visitor?.message || data.message}</p>
              </div>
            ` : ''}
          </div>
          
          <hr style="border: none; border-top: 2px solid #f0f0f0; margin: 30px 0;">
          
          <div style="text-align: center;">
            <p style="color: #666; font-size: 14px; line-height: 1.6;">
              Please review this ${recordType} and take appropriate action.<br>
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

  sendStatusUpdate: async (recordType, data, userEmail, userName, oldStatus, newStatus) => {
    const subject = `Your ${recordType} Status Has Been Updated`;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f4f4; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">${process.env.COMPANY_NAME || 'REC APPLY'}</h1>
          <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Status Update</p>
        </div>
        
        <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-top: 0; border-bottom: 2px solid #f0f0f0; padding-bottom: 15px;">
            Your ${recordType} Status Has Been Updated
          </h2>
          
          <p style="font-size: 16px; line-height: 1.6; color: #555;">Dear ${userName || 'Student'},</p>
          
          <p style="font-size: 16px; line-height: 1.6; color: #555;">The status of your ${recordType} has been updated:</p>
          
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
            <h4 style="margin-top: 0; color: #333;">Reference: ${data.bookingReference || data.applicationReference || 'N/A'}</h4>
            <p style="margin: 5px 0; color: #555;"><strong>Current Status:</strong> 
              <span style="background-color: ${newStatus === 'confirmed' || newStatus === 'accepted' ? '#4CAF50' : newStatus === 'rejected' ? '#f44336' : '#FFC107'}; color: ${newStatus === 'submitted' ? '#333' : 'white'}; padding: 3px 10px; border-radius: 12px; font-size: 12px;">
                ${newStatus || 'Pending'}
              </span>
            </p>
            <p style="margin: 5px 0; color: #555;"><strong>Next Steps:</strong> ${this.getNextStepsForStatus(newStatus)}</p>
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

    return await this.sendEmail(userEmail, subject, html);
  },

  getNextStepsForStatus(status) {
    const steps = {
      submitted: "Your application is being reviewed by our admissions team",
      pending: "Awaiting further processing",
      confirmed: "Your booking is confirmed. Please check your email for further instructions",
      accepted: "Congratulations! Proceed with enrollment steps",
      rejected: "We regret to inform you that your application was not successful",
      under_review: "Your documents are being verified",
      approved: "Your application has been approved",
      completed: "Process completed successfully"
    };
    return steps[status] || "Please check your portal for updates";
  }
};

// ====================
// HELPERS
// ====================
const safeBody = (value) => {
  if (!value) return value;
  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }
  return value;
};

// ====================
// CONTROLLER
// ====================
class AdmissionController {
  constructor() {}

  // ====================
  // CREATE METHODS
  // ====================
  async createBooking(req, res) {
    try {
      const booking = safeBody(req.body.booking);
      
      // Generate booking reference
      const bookingRef = 'ADM-BK-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 5).toUpperCase();
      
      const enrichedBooking = {
        ...booking,
        bookingReference: bookingRef,
        status: booking.status || 'confirmed'
      };

      const record = await AdmissionManagement.create({
        recordType: "booking",
        booking: enrichedBooking,
        createdBy: req.user?._id || null,
      });

      // Send email notifications
      const userEmail = booking.visitor?.email || booking.email;
      const userName = booking.visitor?.name || booking.name || 'Student';

      if (userEmail) {
        Promise.allSettled([
          emailService.sendBookingConfirmation(enrichedBooking, userEmail, userName),
          emailService.sendAdminNotification('booking', enrichedBooking, userEmail, userName)
        ]).then(results => {
          console.log('Email notifications sent:', results.map(r => r.status));
        }).catch(err => {
          console.error('Error sending notification emails:', err);
        });
      }

      res.status(201).json({
        success: true,
        message: "Booking created successfully",
        data: record,
      });
    } catch (error) {
      console.error("Create booking error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create booking",
        error: error.message,
      });
    }
  }

  async createUniversity(req, res) {
    try {
      const university = safeBody(req.body.university);

      const record = await AdmissionManagement.create({
        recordType: "university",
        university,
        createdBy: req.user?._id || null,
      });

      res.status(201).json({
        success: true,
        message: "University created successfully",
        data: record,
      });
    } catch (error) {
      console.error("Create university error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create university",
        error: error.message,
      });
    }
  }

  async createApplication(req, res) {
    try {
      const application = safeBody(req.body.application);
      
      // Generate application reference
      const appRef = 'ADM-APP-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 5).toUpperCase();

      if (req.files?.length) {
        application.documents = req.files.map((f) => f.path);
      }

      const enrichedApplication = {
        ...application,
        applicationReference: appRef,
        status: application.status || 'submitted'
      };

      const record = await AdmissionManagement.create({
        recordType: "application",
        application: enrichedApplication,
        createdBy: req.user?._id || null,
      });

      // Send email notifications
      const userEmail = application.visitor?.email || application.email;
      const userName = application.visitor?.name || application.name || 'Applicant';

      if (userEmail) {
        Promise.allSettled([
          emailService.sendApplicationConfirmation(enrichedApplication, userEmail, userName),
          emailService.sendAdminNotification('application', enrichedApplication, userEmail, userName)
        ]).then(results => {
          console.log('Email notifications sent:', results.map(r => r.status));
        }).catch(err => {
          console.error('Error sending notification emails:', err);
        });
      }

      res.status(201).json({
        success: true,
        message: "Application created successfully",
        data: record,
      });
    } catch (error) {
      console.error("Create application error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create application",
        error: error.message,
      });
    }
  }

  // ====================
  // READ METHODS
  // ====================
  async getRecords(req, res) {
    try {
      const { recordType } = req.params;

      const records = await AdmissionManagement.find(
        recordType ? { recordType } : {}
      ).sort({ createdAt: -1 });

      res.json({
        success: true,
        data: records,
      });
    } catch (error) {
      console.error("Get records error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch records",
        error: error.message,
      });
    }
  }

  async getUserRecords(req, res) {
    try {
      const { recordType } = req.params;

      const records = await AdmissionManagement.find({
        recordType,
        createdBy: req.user?._id,
      }).sort({ createdAt: -1 });

      res.json({
        success: true,
        data: records,
      });
    } catch (error) {
      console.error("Get user records error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch user records",
        error: error.message,
      });
    }
  }

  async getRecord(req, res) {
    try {
      const record = await AdmissionManagement.findById(req.params.id);

      if (!record) {
        return res.status(404).json({
          success: false,
          message: "Record not found",
        });
      }

      res.json({
        success: true,
        data: record,
      });
    } catch (error) {
      console.error("Get record error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch record",
        error: error.message,
      });
    }
  }

  // ====================
  // UPDATE / DELETE
  // ====================
  async updateRecord(req, res) {
    try {
      const oldRecord = await AdmissionManagement.findById(req.params.id);
      if (!oldRecord) {
        return res.status(404).json({
          success: false,
          message: "Record not found",
        });
      }

      const oldStatus = oldRecord.recordType === 'booking' 
        ? oldRecord.booking?.status 
        : oldRecord.application?.status;

      const record = await AdmissionManagement.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

      const newStatus = record.recordType === 'booking' 
        ? record.booking?.status 
        : record.application?.status;

      // Send status update email if status changed
      if (oldStatus && newStatus && oldStatus !== newStatus) {
        const userData = record.recordType === 'booking' 
          ? record.booking 
          : record.application;
        const userEmail = userData?.visitor?.email || userData?.email;
        const userName = userData?.visitor?.name || userData?.name || 'User';

        if (userEmail) {
          emailService.sendStatusUpdate(
            record.recordType,
            userData,
            userEmail,
            userName,
            oldStatus,
            newStatus
          ).catch(err => console.error('Error sending status update email:', err));
        }
      }

      res.json({
        success: true,
        message: "Record updated successfully",
        data: record,
      });
    } catch (error) {
      console.error("Update record error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update record",
        error: error.message,
      });
    }
  }

  async deleteRecord(req, res) {
    try {
      await AdmissionManagement.findByIdAndDelete(req.params.id);

      res.json({
        success: true,
        message: "Record deleted successfully",
      });
    } catch (error) {
      console.error("Delete record error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to delete record",
        error: error.message,
      });
    }
  }

  // ====================
  // STATISTICS
  // ====================
  async getStatistics(req, res) {
    try {
      const { recordType } = req.params;
      const count = await AdmissionManagement.countDocuments({ recordType });

      res.json({
        success: true,
        count,
      });
    } catch (error) {
      console.error("Get statistics error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to get statistics",
        error: error.message,
      });
    }
  }

  async getDashboardStatistics(req, res) {
    try {
      const bookings = await AdmissionManagement.countDocuments({ recordType: "booking" });
      const applications = await AdmissionManagement.countDocuments({ recordType: "application" });
      const universities = await AdmissionManagement.countDocuments({ recordType: "university" });
      
      const recentActivity = await AdmissionManagement.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .select('recordType createdAt');

      res.json({ 
        success: true, 
        data: {
          totalBookings: bookings,
          totalApplications: applications,
          totalUniversities: universities,
          totalRecords: bookings + applications + universities,
          recentActivity
        } 
      });
    } catch (error) {
      console.error("Get dashboard statistics error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to get dashboard statistics",
        error: error.message,
      });
    }
  }

  async getAnalytics(req, res) {
    try {
      const { type } = req.params;
      const {
        startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        endDate = new Date().toISOString(),
      } = req.query;

      let result;

      switch (type) {
        case "application":
        case "booking":
          result = await AdmissionManagement.find({
            recordType: type,
            createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
          });
          break;
        case "university":
          result = await AdmissionManagement.find({ recordType: "university" });
          break;
        default:
          return res.status(400).json({
            success: false,
            message: "Invalid analytics type",
          });
      }

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error("Get analytics error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to get analytics",
        error: error.message,
      });
    }
  }

  // ====================
  // BOOKING REMINDERS
  // ====================
  async sendBookingReminders(req, res) {
    try {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      const bookings = await AdmissionManagement.find({
        recordType: "booking",
        isActive: true,
        "booking.status": { $in: ["confirmed", "pending"] },
        "booking.details.bookingDate": {
          $gte: new Date(tomorrow.setHours(0, 0, 0, 0)),
          $lt: new Date(tomorrow.setHours(23, 59, 59, 999)),
        },
        "booking.reminderSent": false,
      });

      const results = [];

      for (const booking of bookings) {
        try {
          const userEmail = booking.booking?.visitor?.email || booking.booking?.email;
          const userName = booking.booking?.visitor?.name || booking.booking?.name || 'Student';

          if (userEmail) {
            const subject = `Reminder: Your Consultation Tomorrow - ${booking.booking.bookingReference}`;
            const html = `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f4f4; padding: 20px;">
                <div style="background: linear-gradient(135deg, #FF8008 0%, #FFA03A 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                  <h1 style="color: white; margin: 0; font-size: 28px;">${process.env.COMPANY_NAME || 'REC APPLY'}</h1>
                  <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Booking Reminder</p>
                </div>
                
                <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                  <h2 style="color: #333; margin-top: 0;">Your Consultation is Tomorrow! ⏰</h2>
                  
                  <p style="font-size: 16px; line-height: 1.6; color: #555;">Dear ${userName},</p>
                  
                  <p style="font-size: 16px; line-height: 1.6; color: #555;">This is a friendly reminder that your admission consultation is scheduled for tomorrow:</p>
                  
                  <div style="background-color: #fff3e0; padding: 20px; border-radius: 5px; margin: 20px 0;">
                    <p style="margin: 5px 0;"><strong>Date:</strong> ${new Date(booking.booking.details.bookingDate).toLocaleDateString()}</p>
                    <p style="margin: 5px 0;"><strong>Time:</strong> ${booking.booking.details.timeSlot || 'To be confirmed'}</p>
                    <p style="margin: 5px 0;"><strong>Reference:</strong> ${booking.booking.bookingReference}</p>
                  </div>
                  
                  <p style="color: #666; font-size: 14px;">Please be prepared with your documents and any questions you may have.</p>
                  
                  <hr style="border: none; border-top: 2px solid #f0f0f0; margin: 30px 0;">
                  
                  <div style="text-align: center;">
                    <p style="color: #666; font-size: 14px;">We look forward to speaking with you!</p>
                  </div>
                </div>
              </div>
            `;

            await emailService.sendEmail(userEmail, subject, html);
          }

          booking.booking.reminderSent = true;
          await booking.save();

          results.push({ bookingId: booking._id, success: true });
        } catch (err) {
          results.push({
            bookingId: booking._id,
            success: false,
            error: err.message,
          });
        }
      }

      res.json({ success: true, results });
    } catch (error) {
      console.error("Send booking reminders error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to send booking reminders",
        error: error.message,
      });
    }
  }
}

// ====================
// EXPORT
// ====================
module.exports = new AdmissionController();