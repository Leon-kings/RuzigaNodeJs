

// const Exam = require('../models/CSCEBook').Exam;
// const nodemailer = require('nodemailer');
// const cloudinary = require('../cloudinary/cloudinary');

// class CSEController {
//   constructor() {
//     // Auto-bind all methods
//     [
//       'createExam',
//       'getAllExams',
//       'getSingleExam',
//       'updateExam',
//       'deleteExam',
//       'registerForExam',
//       'getExamRegistrations',
//       'updateRegistrationStatus',
//       'getAllRegistrations',
//       'getAllBookings',
//       'getBookingsByEmail',
//       'getDashboardStats'
//     ].forEach(method => this[method] && (this[method] = this[method].bind(this)));

//     // Email transporter
//     this.mailer = nodemailer.createTransport({
//       host: process.env.SMTP_HOST,
//       port: process.env.SMTP_PORT,
//       secure: false,
//       auth: {
//         user: process.env.SMTP_USER,
//         pass: process.env.SMTP_PASS
//       }
//     });
//   }

//   // =========================
//   // Email helper
//   async sendEmail(to, subject, html) {
//     await this.mailer.sendMail({
//       from: `"CSCCE Exams" <${process.env.SMTP_USER}>`,
//       to,
//       subject,
//       html
//     });
//   }

//   // =========================
//   // Cloudinary upload helper
//   async uploadImage(file) {
//     if (!file) return null;
//     try {
//       const result = await cloudinary.uploader.upload(file, {
//         folder: 'exams',
//         allowed_formats: ['jpg', 'jpeg', 'png', 'webp']
//       });
//       return result.secure_url;
//     } catch (err) {
//       console.error('Cloudinary upload failed:', err);
//       return null;
//     }
//   }

//   // =========================
//   // Create Exam
//   async createExam(req, res) {
//     try {
//       const examData = {
//         ...req.body,
//         createdBy: req.user._id
//       };

//       // Upload image if provided
//       if (req.body.image) {
//         const cloudUrl = await this.uploadImage(req.body.image);
//         if (cloudUrl) examData.image = cloudUrl;
//       }

//       const exam = await Exam.create(examData);

//       await this.sendEmail(
//         process.env.ADMIN_EMAIL,
//         'New Exam Created',
//         `<p>New exam <b>${exam.name}</b> has been created.</p>`
//       );

//       res.status(201).json({ success: true, data: exam });
//     } catch (error) {
//       res.status(400).json({ success: false, message: error.message });
//     }
//   }

//   // =========================
//   // Get All Exams
//   async getAllExams(req, res) {
//     try {
//       const exams = await Exam.find({ isActive: true }).sort({ createdAt: -1 });
//       res.json({ success: true, data: exams });
//     } catch (error) {
//       res.status(500).json({ success: false, message: error.message });
//     }
//   }

//   // =========================
//   // Get Single Exam
//   async getSingleExam(req, res) {
//     try {
//       const exam = await Exam.findById(req.params.id);
//       if (!exam) return res.status(404).json({ success: false, message: 'Exam not found' });
//       res.json({ success: true, data: exam });
//     } catch (error) {
//       res.status(500).json({ success: false, message: error.message });
//     }
//   }

//   // =========================
//   // Update Exam
//   async updateExam(req, res) {
//     try {
//       const exam = await Exam.findById(req.params.id);
//       if (!exam) return res.status(404).json({ success: false, message: 'Exam not found' });

//       // Update image if provided
//       if (req.body.image && req.body.image !== exam.image) {
//         const cloudUrl = await this.uploadImage(req.body.image);
//         if (cloudUrl) req.body.image = cloudUrl;
//       }

//       const updatedExam = await Exam.findByIdAndUpdate(
//         req.params.id,
//         { ...req.body, updatedBy: req.user._id },
//         { new: true }
//       );

//       res.json({ success: true, data: updatedExam });
//     } catch (error) {
//       res.status(400).json({ success: false, message: error.message });
//     }
//   }

//   // =========================
//   // Soft Delete Exam
//   async deleteExam(req, res) {
//     try {
//       const exam = await Exam.findById(req.params.id);
//       if (!exam) return res.status(404).json({ success: false, message: 'Exam not found' });

//       exam.isActive = false;
//       await exam.save();

//       res.json({ success: true, message: 'Exam deleted (soft)' });
//     } catch (error) {
//       res.status(500).json({ success: false, message: error.message });
//     }
//   }

//   // =========================
//   // Register for Exam
//   async registerForExam(req, res) {
//     try {
//       const exam = await Exam.findById(req.params.examId);
//       if (!exam) return res.status(404).json({ success: false, message: 'Exam not found' });

//       const exists = exam.registrations.find(r => r.userEmail === req.body.userEmail);
//       if (exists) return res.status(400).json({ success: false, message: 'Already registered' });

//       exam.registrations.push({
//         ...req.body,
//         userId: req.user._id,
//         status: 'pending'
//       });

//       await exam.save();

//       await this.sendEmail(
//         req.body.userEmail,
//         'Exam Registration Successful',
//         `<p>Hello ${req.body.userName},<br/>You have successfully registered for <b>${exam.name}</b>.</p>`
//       );

//       res.json({ success: true, message: 'Registration submitted' });
//     } catch (error) {
//       res.status(400).json({ success: false, message: error.message });
//     }
//   }

//   // =========================
//   // Get Exam Registrations
//   async getExamRegistrations(req, res) {
//     try {
//       const exam = await Exam.findById(req.params.examId).select('registrations');
//       if (!exam) return res.status(404).json({ success: false, message: 'Exam not found' });

//       res.json({ success: true, data: exam.registrations });
//     } catch (error) {
//       res.status(500).json({ success: false, message: error.message });
//     }
//   }

//   // =========================
//   // Update Registration Status
//   async updateRegistrationStatus(req, res) {
//     try {
//       const { examId, registrationId } = req.params;
//       const { status } = req.body;

//       const exam = await Exam.findById(examId);
//       if (!exam) return res.status(404).json({ success: false, message: 'Exam not found' });

//       const registration = exam.registrations.id(registrationId);
//       if (!registration) return res.status(404).json({ success: false, message: 'Registration not found' });

//       registration.status = status || registration.status;
//       await exam.save();

//       await this.sendEmail(
//         registration.userEmail,
//         'Registration Status Updated',
//         `<p>Your registration for <b>${exam.name}</b> has been updated.</p>`
//       );

//       res.json({ success: true, message: 'Registration updated' });
//     } catch (error) {
//       res.status(400).json({ success: false, message: error.message });
//     }
//   }

//   // =========================
//   // Get All Registrations
//   async getAllRegistrations(req, res) {
//     try {
//       const exams = await Exam.find().select('name code registrations');

//       const allRegistrations = exams.flatMap(exam =>
//         exam.registrations.map(reg => ({
//           examId: exam._id,
//           examName: exam.name,
//           examCode: exam.code,
//           registrationId: reg._id,
//           studentName: reg.userName,
//           studentEmail: reg.userEmail,
//           studentPhone: reg.userPhone,
//           organization: reg.organization,
//           registrationDate: reg.registrationDate,
//           status: reg.status,
//           examSession: reg.examSession,
//           notes: reg.notes,
//           attachments: reg.attachments || []
//         }))
//       );

//       res.json({ success: true, total: allRegistrations.length, data: allRegistrations });
//     } catch (error) {
//       res.status(500).json({ success: false, message: error.message });
//     }
//   }

//   // =========================
//   // Get All Bookings (same as registrations)
//   async getAllBookings(req, res) {
//     return this.getAllRegistrations(req, res);
//   }

//   // =========================
//   // Get Bookings by Email
//   async getBookingsByEmail(req, res) {
//     try {
//       const { email } = req.params;
//       const exams = await Exam.find().select('name code registrations').lean();

//       const filteredBookings = exams.flatMap(exam =>
//         (exam.registrations || [])
//           .filter(r => r.userEmail.toLowerCase() === email.toLowerCase())
//           .map(reg => ({
//             examId: exam._id,
//             examName: exam.name,
//             examCode: exam.code,
//             registrationId: reg._id,
//             studentName: reg.userName,
//             studentEmail: reg.userEmail,
//             studentPhone: reg.userPhone,
//             organization: reg.organization,
//             registrationDate: reg.registrationDate,
//             status: reg.status,
//             examSession: reg.examSession,
//             notes: reg.notes,
//             attachments: reg.attachments || []
//           }))
//       );

//       res.json({ success: true, total: filteredBookings.length, data: filteredBookings });
//     } catch (error) {
//       res.status(500).json({ success: false, message: error.message });
//     }
//   }

//   // =========================
//   // Dashboard stats
//   async getDashboardStats(req, res) {
//     try {
//       const totalExams = await Exam.countDocuments({ isActive: true });
//       const registrations = await Exam.aggregate([
//         { $project: { count: { $size: '$registrations' } } },
//         { $group: { _id: null, total: { $sum: '$count' } } }
//       ]);

//       res.json({
//         success: true,
//         data: {
//           totalExams,
//           totalRegistrations: registrations[0]?.total || 0
//         }
//       });
//     } catch (error) {
//       res.status(500).json({ success: false, message: error.message });
//     }
//   }
// }

// module.exports = new CSEController();

























const Exam = require('../models/CSCEBook').Exam;
const nodemailer = require('nodemailer');
const cloudinary = require('../cloudinary/cloudinary');

class CSEController {
  constructor() {
    // Auto-bind all methods
    [
      'createExam',
      'getAllExams',
      'getSingleExam',
      'updateExam',
      'deleteExam',
      'registerForExam',
      'getExamRegistrations',
      'updateRegistrationStatus',
      'getAllRegistrations',
      'getAllBookings',
      'getBookingsByEmail',
      'getDashboardStats'
    ].forEach(method => this[method] && (this[method] = this[method].bind(this)));

    // Email transporter
    this.mailer = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      },
      tls: {
        rejectUnauthorized: false
      }
    });
  }

  // =========================
  // Email helper - ALWAYS SEND EMAILS
  async sendEmail(to, subject, html) {
    try {
      const info = await this.mailer.sendMail({
        from: `"CSCCE Exams" <${process.env.SMTP_USER}>`,
        to,
        subject,
        html
      });
      console.log(`✅ Email sent successfully to ${to}: ${subject}`);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error(`❌ Email sending failed to ${to}:`, error.message);
      
      // In development, log but don't throw
      if (process.env.NODE_ENV === 'development') {
        console.log('⚠️ Email failed in development mode but continuing');
        return { success: false, error: error.message };
      }
      
      throw error;
    }
  }

  // =========================
  // Cloudinary upload helper
  async uploadImage(file) {
    if (!file) return null;
    try {
      const result = await cloudinary.uploader.upload(file, {
        folder: 'exams',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp']
      });
      console.log(`✅ Image uploaded to Cloudinary: ${result.secure_url}`);
      return result.secure_url;
    } catch (err) {
      console.error('❌ Cloudinary upload failed:', err);
      return null;
    }
  }

  // =========================
  // Create Exam
  async createExam(req, res) {
    try {
      const examData = {
        ...req.body,
        createdBy: req.user._id
      };

      // Upload image if provided
      if (req.body.image) {
        const cloudUrl = await this.uploadImage(req.body.image);
        if (cloudUrl) examData.image = cloudUrl;
      }

      const exam = await Exam.create(examData);

      // Send notification to admin (fire and forget)
      this.sendEmail(
        process.env.ADMIN_EMAIL,
        'New Exam Created',
        `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f4f4f4;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <h2 style="color: white; margin: 0;">New Exam Created</h2>
          </div>
          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px;">
            <p><strong>Exam Name:</strong> ${exam.name}</p>
            <p><strong>Exam Code:</strong> ${exam.code}</p>
            <p><strong>Duration:</strong> ${exam.duration} minutes</p>
            <p><strong>Created By:</strong> ${req.user.email}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
          </div>
        </div>
        `
      ).catch(error => console.error('Admin notification email failed:', error));

      res.status(201).json({ success: true, data: exam });
    } catch (error) {
      console.error('❌ Create exam error:', error);
      res.status(400).json({ success: false, message: error.message });
    }
  }

  // =========================
  // Get All Exams
  async getAllExams(req, res) {
    try {
      const exams = await Exam.find({ isActive: true }).sort({ createdAt: -1 });
      res.json({ success: true, data: exams });
    } catch (error) {
      console.error('❌ Get all exams error:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // =========================
  // Get Single Exam
  async getSingleExam(req, res) {
    try {
      const exam = await Exam.findById(req.params.id);
      if (!exam) return res.status(404).json({ success: false, message: 'Exam not found' });
      res.json({ success: true, data: exam });
    } catch (error) {
      console.error('❌ Get single exam error:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // =========================
  // Update Exam
  async updateExam(req, res) {
    try {
      const exam = await Exam.findById(req.params.id);
      if (!exam) return res.status(404).json({ success: false, message: 'Exam not found' });

      // Update image if provided
      if (req.body.image && req.body.image !== exam.image) {
        const cloudUrl = await this.uploadImage(req.body.image);
        if (cloudUrl) req.body.image = cloudUrl;
      }

      const updatedExam = await Exam.findByIdAndUpdate(
        req.params.id,
        { ...req.body, updatedBy: req.user._id },
        { new: true }
      );

      res.json({ success: true, data: updatedExam });
    } catch (error) {
      console.error('❌ Update exam error:', error);
      res.status(400).json({ success: false, message: error.message });
    }
  }

  // =========================
  // Soft Delete Exam
  async deleteExam(req, res) {
    try {
      const exam = await Exam.findById(req.params.id);
      if (!exam) return res.status(404).json({ success: false, message: 'Exam not found' });

      exam.isActive = false;
      await exam.save();

      res.json({ success: true, message: 'Exam deleted (soft)' });
    } catch (error) {
      console.error('❌ Delete exam error:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // =========================
  // Register for Exam
  async registerForExam(req, res) {
    try {
      const exam = await Exam.findById(req.params.examId);
      if (!exam) return res.status(404).json({ success: false, message: 'Exam not found' });

      const exists = exam.registrations.find(r => r.userEmail === req.body.userEmail);
      if (exists) return res.status(400).json({ success: false, message: 'Already registered' });

      const registration = {
        ...req.body,
        userId: req.user._id,
        status: 'pending',
        registrationDate: new Date()
      };

      exam.registrations.push(registration);
      await exam.save();

      // Send confirmation email to user (fire and forget)
      this.sendEmail(
        req.body.userEmail,
        'Exam Registration Successful',
        `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f4f4f4;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <h2 style="color: white; margin: 0;">Registration Confirmed!</h2>
          </div>
          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px;">
            <p>Hello <strong>${req.body.userName}</strong>,</p>
            <p>You have successfully registered for:</p>
            <div style="background: #f0f7ff; padding: 20px; border-radius: 5px; margin: 20px 0;">
              <h3 style="margin: 0 0 10px 0; color: #333;">${exam.name}</h3>
              <p><strong>Exam Code:</strong> ${exam.code}</p>
              <p><strong>Duration:</strong> ${exam.duration} minutes</p>
              <p><strong>Status:</strong> <span style="background: #FFC107; padding: 3px 10px; border-radius: 12px;">Pending Review</span></p>
            </div>
            <p>We will review your registration and send you a confirmation email with further instructions.</p>
            <p>Best regards,<br><strong>CSCCE Exams Team</strong></p>
          </div>
        </div>
        `
      ).catch(error => console.error('Registration confirmation email failed:', error));

      // Send notification to admin (fire and forget)
      this.sendEmail(
        process.env.ADMIN_EMAIL,
        `New Registration: ${exam.name}`,
        `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f4f4f4;">
          <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <h2 style="color: white; margin: 0;">New Registration Received</h2>
          </div>
          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px;">
            <p><strong>Exam:</strong> ${exam.name}</p>
            <p><strong>Student Name:</strong> ${req.body.userName}</p>
            <p><strong>Student Email:</strong> ${req.body.userEmail}</p>
            <p><strong>Student Phone:</strong> ${req.body.userPhone}</p>
            <p><strong>Organization:</strong> ${req.body.organization || 'N/A'}</p>
            <p><strong>Registration Date:</strong> ${new Date().toLocaleString()}</p>
          </div>
        </div>
        `
      ).catch(error => console.error('Admin notification email failed:', error));

      res.json({ success: true, message: 'Registration submitted successfully' });
    } catch (error) {
      console.error('❌ Register for exam error:', error);
      res.status(400).json({ success: false, message: error.message });
    }
  }

  // =========================
  // Get Exam Registrations
  async getExamRegistrations(req, res) {
    try {
      const exam = await Exam.findById(req.params.examId).select('registrations');
      if (!exam) return res.status(404).json({ success: false, message: 'Exam not found' });

      res.json({ success: true, data: exam.registrations });
    } catch (error) {
      console.error('❌ Get exam registrations error:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // =========================
  // Update Registration Status
  async updateRegistrationStatus(req, res) {
    try {
      const { examId, registrationId } = req.params;
      const { status, notes } = req.body;

      const exam = await Exam.findById(examId);
      if (!exam) return res.status(404).json({ success: false, message: 'Exam not found' });

      const registration = exam.registrations.id(registrationId);
      if (!registration) return res.status(404).json({ success: false, message: 'Registration not found' });

      const oldStatus = registration.status;
      registration.status = status || registration.status;
      if (notes) registration.notes = notes;
      
      await exam.save();

      // Send status update email to student (fire and forget)
      const statusColors = {
        confirmed: '#4caf50',
        pending: '#FFC107',
        cancelled: '#f44336',
        completed: '#2196f3'
      };
      
      const statusColor = statusColors[registration.status] || '#666';
      
      this.sendEmail(
        registration.userEmail,
        `Registration Status Updated: ${exam.name}`,
        `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f4f4f4;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <h2 style="color: white; margin: 0;">Registration Status Updated</h2>
          </div>
          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px;">
            <p>Hello <strong>${registration.userName}</strong>,</p>
            <p>Your registration status for <strong>${exam.name}</strong> has been updated:</p>
            
            <div style="background: #f9f9f9; padding: 20px; text-align: center; border-radius: 5px; margin: 20px 0;">
              <div style="display: inline-block; background: ${statusColor}20; padding: 15px 30px; border-radius: 5px;">
                <span style="color: ${statusColor}; font-weight: bold; font-size: 18px;">${registration.status.toUpperCase()}</span>
              </div>
            </div>
            
            ${notes ? `<p><strong>Notes:</strong> ${notes}</p>` : ''}
            
            <p>Best regards,<br><strong>CSCCE Exams Team</strong></p>
          </div>
        </div>
        `
      ).catch(error => console.error('Status update email failed:', error));

      res.json({ success: true, message: 'Registration updated successfully' });
    } catch (error) {
      console.error('❌ Update registration status error:', error);
      res.status(400).json({ success: false, message: error.message });
    }
  }

  // =========================
  // Get All Registrations
  async getAllRegistrations(req, res) {
    try {
      const exams = await Exam.find().select('name code registrations');

      const allRegistrations = exams.flatMap(exam =>
        exam.registrations.map(reg => ({
          examId: exam._id,
          examName: exam.name,
          examCode: exam.code,
          registrationId: reg._id,
          studentName: reg.userName,
          studentEmail: reg.userEmail,
          studentPhone: reg.userPhone,
          organization: reg.organization,
          registrationDate: reg.registrationDate,
          status: reg.status,
          examSession: reg.examSession,
          notes: reg.notes,
          attachments: reg.attachments || []
        }))
      );

      res.json({ success: true, total: allRegistrations.length, data: allRegistrations });
    } catch (error) {
      console.error('❌ Get all registrations error:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // =========================
  // Get All Bookings (same as registrations)
  async getAllBookings(req, res) {
    return this.getAllRegistrations(req, res);
  }

  // =========================
  // Get Bookings by Email
  async getBookingsByEmail(req, res) {
    try {
      const { email } = req.params;
      const exams = await Exam.find().select('name code registrations').lean();

      const filteredBookings = exams.flatMap(exam =>
        (exam.registrations || [])
          .filter(r => r.userEmail.toLowerCase() === email.toLowerCase())
          .map(reg => ({
            examId: exam._id,
            examName: exam.name,
            examCode: exam.code,
            registrationId: reg._id,
            studentName: reg.userName,
            studentEmail: reg.userEmail,
            studentPhone: reg.userPhone,
            organization: reg.organization,
            registrationDate: reg.registrationDate,
            status: reg.status,
            examSession: reg.examSession,
            notes: reg.notes,
            attachments: reg.attachments || []
          }))
      );

      res.json({ success: true, total: filteredBookings.length, data: filteredBookings });
    } catch (error) {
      console.error('❌ Get bookings by email error:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // =========================
  // Dashboard stats
  async getDashboardStats(req, res) {
    try {
      const totalExams = await Exam.countDocuments({ isActive: true });
      const registrations = await Exam.aggregate([
        { $project: { count: { $size: '$registrations' } } },
        { $group: { _id: null, total: { $sum: '$count' } } }
      ]);

      // Get status breakdown
      const statusBreakdown = await Exam.aggregate([
        { $unwind: '$registrations' },
        { $group: { _id: '$registrations.status', count: { $sum: 1 } } }
      ]);

      res.json({
        success: true,
        data: {
          totalExams,
          totalRegistrations: registrations[0]?.total || 0,
          statusBreakdown: statusBreakdown.reduce((acc, curr) => {
            acc[curr._id] = curr.count;
            return acc;
          }, {})
        }
      });
    } catch (error) {
      console.error('❌ Get dashboard stats error:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = new CSEController();