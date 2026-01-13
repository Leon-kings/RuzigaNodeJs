// const mongoose = require('mongoose');
// const nodemailer = require('nodemailer');
// const ExcelJS = require('exceljs');
// const PDFDocument = require('pdfkit');
// const Exam = require('../models/Exam');
// const User = require('../models/User');
// const Notification = require('../models/Notification');

// // Email Service Setup
// const emailTransporter = nodemailer.createTransport({
//   host: process.env.SMTP_HOST || 'smtp.gmail.com',
//   port: process.env.SMTP_PORT || 587,
//   secure: process.env.SMTP_SECURE === 'false',
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASS
//   }
// });

// class CSEController {
//   // ===================== EXAM MANAGEMENT =====================
  
//   // Get all exams
//   async getAllExams(req, res) {
//     try {
//       const {
//         page = 1,
//         limit = 10,
//         search,
//         type,
//         status,
//         difficulty,
//         sortBy = 'createdAt',
//         sortOrder = 'desc'
//       } = req.query;

//       const query = { isActive: true };
      
//       // Search filter
//       if (search) {
//         query.$or = [
//           { name: { $regex: search, $options: 'i' } },
//           { description: { $regex: search, $options: 'i' } },
//           { code: { $regex: search, $options: 'i' } }
//         ];
//       }
      
//       // Type filter
//       if (type && type !== 'all') {
//         query.type = type;
//       }
      
//       // Status filter
//       if (status && status !== 'all') {
//         query.registrationStatus = status;
//       }
      
//       // Difficulty filter
//       if (difficulty && difficulty !== 'all') {
//         query.difficulty = difficulty;
//       }

//       const sort = {};
//       sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

//       const exams = await Exam.find(query)
//         .sort(sort)
//         .limit(limit * 1)
//         .skip((page - 1) * limit)
//         .populate('createdBy', 'name email')
//         .select('-registrations');

//       const total = await Exam.countDocuments(query);

//       res.json({
//         success: true,
//         data: exams,
//         pagination: {
//           total,
//           page: parseInt(page),
//           limit: parseInt(limit),
//           pages: Math.ceil(total / limit)
//         }
//       });
//     } catch (error) {
//       console.error('Get exams error:', error);
//       res.status(500).json({
//         success: false,
//         message: 'Error fetching exams',
//         error: error.message
//       });
//     }
//   }

//   // Get single exam
//   async getExam(req, res) {
//     try {
//       const { id } = req.params;
//       const exam = await Exam.findById(id)
//         .populate('createdBy', 'name email')
//         .populate('registrations.userId', 'name email');

//       if (!exam) {
//         return res.status(404).json({
//           success: false,
//           message: 'Exam not found'
//         });
//       }

//       res.json({
//         success: true,
//         data: exam
//       });
//     } catch (error) {
//       console.error('Get exam error:', error);
//       res.status(500).json({
//         success: false,
//         message: 'Error fetching exam',
//         error: error.message
//       });
//     }
//   }

//   // Create exam


// async createExam(req, res) {
//   try {
//     const examData = {
//       ...req.body,
//       createdBy: req.user._id,
//       code: await this.generateExamCode(req.body.type)
//     };

//     const exam = new Exam(examData);
//     await exam.save();

//     // ✅ Existing admin notification (AS-IS)
//     await this.sendAdminNotification({
//       type: 'exam_created',
//       exam: exam.name,
//       createdBy: req.user.name
//     });

//     // 🔔 ADD NOTIFICATION (NEW – does NOT break anything)
//     await Notification.create({
//       userId: req.user._id,
//       title: 'Exam Created',
//       message: `You created a new exam: ${exam.name}`,
//       type: 'exam',
//       exam: exam._id
//     });

//     res.status(201).json({
//       success: true,
//       data: exam,
//       message: 'Exam created successfully'
//     });

//   } catch (error) {
//     console.error('Create exam error:', error);
//     res.status(400).json({
//       success: false,
//       message: 'Error creating exam',
//       error: error.message
//     });
//   }
// }

//   // Update exam
//   async updateExam(req, res) {
//     try {
//       const { id } = req.params;
//       const updateData = {
//         ...req.body,
//         updatedBy: req.user._id,
//         'metadata.lastUpdated': new Date(),
//         'metadata.version': { $inc: 1 }
//       };

//       const exam = await Exam.findByIdAndUpdate(
//         id,
//         updateData,
//         { new: true, runValidators: true }
//       );

//       if (!exam) {
//         return res.status(404).json({
//           success: false,
//           message: 'Exam not found'
//         });
//       }

//       res.json({
//         success: true,
//         data: exam,
//         message: 'Exam updated successfully'
//       });
//     } catch (error) {
//       console.error('Update exam error:', error);
//       res.status(400).json({
//         success: false,
//         message: 'Error updating exam',
//         error: error.message
//       });
//     }
//   }

//   // Delete exam
//   async deleteExam(req, res) {
//     try {
//       const { id } = req.params;
      
//       // Soft delete
//       const exam = await Exam.findByIdAndUpdate(
//         id,
//         { 
//           isActive: false,
//           updatedBy: req.user._id
//         },
//         { new: true }
//       );

//       if (!exam) {
//         return res.status(404).json({
//           success: false,
//           message: 'Exam not found'
//         });
//       }

//       res.json({
//         success: true,
//         message: 'Exam deleted successfully'
//       });
//     } catch (error) {
//       console.error('Delete exam error:', error);
//       res.status(500).json({
//         success: false,
//         message: 'Error deleting exam',
//         error: error.message
//       });
//     }
//   }

//   // ===================== REGISTRATION MANAGEMENT =====================
  
//   // Register for exam
//   async registerForExam(req, res) {
//     try {
//       const { examId } = req.params;
//       const registrationData = {
//         ...req.body,
//         userId: req.user._id,
//         status: 'pending',
//         paymentStatus: 'pending'
//       };

//       const exam = await Exam.findById(examId);
      
//       if (!exam) {
//         return res.status(404).json({
//           success: false,
//           message: 'Exam not found'
//         });
//       }

//       // Check if registration is open
//       if (exam.registrationStatus !== 'open') {
//         return res.status(400).json({
//           success: false,
//           message: 'Registration is closed for this exam'
//         });
//       }

//       // Check if maximum registrations reached
//       if (exam.registrations.length >= exam.maxRegistrations) {
//         return res.status(400).json({
//           success: false,
//           message: 'Maximum registrations reached'
//         });
//       }

//       // Check if user already registered
//       const existingRegistration = exam.registrations.find(
//         reg => reg.userEmail === registrationData.userEmail
//       );

//       if (existingRegistration) {
//         return res.status(400).json({
//           success: false,
//           message: 'You are already registered for this exam'
//         });
//       }

//       // Add registration
//       exam.registrations.push(registrationData);
//       await exam.save();

//       // Send confirmation email
//       await this.sendRegistrationConfirmation(
//         registrationData,
//         exam,
//         exam.registrations[exam.registrations.length - 1]._id
//       );

//       // Send admin notification
//       await this.sendAdminNotification({
//         type: 'new_registration',
//         exam: exam.name,
//         user: registrationData.userName,
//         email: registrationData.userEmail
//       });

//       res.status(201).json({
//         success: true,
//         data: exam.registrations[exam.registrations.length - 1],
//         message: 'Registration successful'
//       });
//     } catch (error) {
//       console.error('Registration error:', error);
//       res.status(400).json({
//         success: false,
//         message: 'Error registering for exam',
//         error: error.message
//       });
//     }
//   }

//   // Get exam registrations
//   async getExamRegistrations(req, res) {
//     try {
//       const { examId } = req.params;
//       const { status, paymentStatus, page = 1, limit = 20 } = req.query;

//       const exam = await Exam.findById(examId).select('registrations');
      
//       if (!exam) {
//         return res.status(404).json({
//           success: false,
//           message: 'Exam not found'
//         });
//       }

//       let registrations = exam.registrations;

//       // Apply filters
//       if (status && status !== 'all') {
//         registrations = registrations.filter(reg => reg.status === status);
//       }
      
//       if (paymentStatus && paymentStatus !== 'all') {
//         registrations = registrations.filter(reg => reg.paymentStatus === paymentStatus);
//       }

//       // Pagination
//       const startIndex = (page - 1) * limit;
//       const endIndex = page * limit;
//       const paginatedRegistrations = registrations.slice(startIndex, endIndex);

//       res.json({
//         success: true,
//         data: paginatedRegistrations,
//         pagination: {
//           total: registrations.length,
//           page: parseInt(page),
//           limit: parseInt(limit),
//           pages: Math.ceil(registrations.length / limit)
//         }
//       });
//     } catch (error) {
//       console.error('Get registrations error:', error);
//       res.status(500).json({
//         success: false,
//         message: 'Error fetching registrations',
//         error: error.message
//       });
//     }
//   }

//   // Update registration status
//   async updateRegistrationStatus(req, res) {
//     try {
//       const { examId, registrationId } = req.params;
//       const { status, paymentStatus, notes } = req.body;

//       const exam = await Exam.findById(examId);
      
//       if (!exam) {
//         return res.status(404).json({
//           success: false,
//           message: 'Exam not found'
//         });
//       }

//       const registration = exam.registrations.id(registrationId);
      
//       if (!registration) {
//         return res.status(404).json({
//           success: false,
//           message: 'Registration not found'
//         });
//       }

//       // Update registration
//       if (status) registration.status = status;
//       if (paymentStatus) registration.paymentStatus = paymentStatus;
//       if (notes) registration.notes = notes;
      
//       if (paymentStatus === 'paid') {
//         registration.paymentDetails = {
//           ...registration.paymentDetails,
//           paymentDate: new Date(),
//           transactionId: `TXN-${Date.now()}`
//         };
//       }

//       await exam.save();

//       // Send status update email
//       if (status || paymentStatus) {
//         await this.sendStatusUpdate(registration, exam, { status, paymentStatus });
//       }

//       res.json({
//         success: true,
//         data: registration,
//         message: 'Registration updated successfully'
//       });
//     } catch (error) {
//       console.error('Update registration error:', error);
//       res.status(400).json({
//         success: false,
//         message: 'Error updating registration',
//         error: error.message
//       });
//     }
//   }

//   // ===================== DASHBOARD STATISTICS =====================
  
//   // Get dashboard statistics
//   async getDashboardStats(req, res) {
//     try {
//       const [
//         totalExams,
//         activeExams,
//         totalRegistrations,
//         totalRevenue,
//         upcomingExams,
//         recentRegistrations,
//         revenueByMonth,
//         examTypeStats,
//         registrationTrends
//       ] = await Promise.all([
//         // Total exams
//         Exam.countDocuments({ isActive: true }),
        
//         // Active exams (open for registration)
//         Exam.countDocuments({ 
//           isActive: true, 
//           registrationStatus: 'open',
//           nextExamDate: { $gt: new Date() }
//         }),
        
//         // Total registrations
//         Exam.aggregate([
//           { $match: { isActive: true } },
//           { $project: { registrationCount: { $size: '$registrations' } } },
//           { $group: { _id: null, total: { $sum: '$registrationCount' } } }
//         ]),
        
//         // Total revenue
//         Exam.aggregate([
//           { $match: { isActive: true } },
//           { $unwind: '$registrations' },
//           { $match: { 'registrations.paymentStatus': 'paid' } },
//           { $group: { 
//             _id: null, 
//             total: { $sum: '$fee.amount' },
//             count: { $sum: 1 }
//           }}
//         ]),
        
//         // Upcoming exams
//         Exam.find({
//           isActive: true,
//           nextExamDate: { $gt: new Date() }
//         })
//         .sort({ nextExamDate: 1 })
//         .limit(5)
//         .select('name code nextExamDate registrationStatus'),
        
//         // Recent registrations
//         Exam.aggregate([
//           { $match: { isActive: true } },
//           { $unwind: '$registrations' },
//           { $sort: { 'registrations.createdAt': -1 } },
//           { $limit: 8 },
//           { $project: {
//             examName: '$name',
//             examCode: '$code',
//             userName: '$registrations.userName',
//             userEmail: '$registrations.userEmail',
//             registrationDate: '$registrations.createdAt',
//             status: '$registrations.status',
//             paymentStatus: '$registrations.paymentStatus'
//           }}
//         ]),
        
//         // Revenue by month (last 6 months)
//         this.getRevenueByMonth(),
        
//         // Exam type statistics
//         Exam.aggregate([
//           { $match: { isActive: true } },
//           { $group: {
//             _id: '$type',
//             count: { $sum: 1 },
//             registrations: { $sum: { $size: '$registrations' } },
//             revenue: {
//               $sum: {
//                 $multiply: [
//                   { $size: { $filter: {
//                     input: '$registrations',
//                     as: 'reg',
//                     cond: { $eq: ['$$reg.paymentStatus', 'paid'] }
//                   }}},
//                   '$fee.amount'
//                 ]
//               }
//             }
//           }},
//           { $sort: { count: -1 } }
//         ]),
        
//         // Registration trends (last 7 days)
//         this.getRegistrationTrends()
//       ]);

//       const stats = {
//         overview: {
//           totalExams,
//           activeExams,
//           totalRegistrations: totalRegistrations[0]?.total || 0,
//           totalRevenue: totalRevenue[0]?.total || 0,
//           paidRegistrations: totalRevenue[0]?.count || 0,
//           upcomingExams: upcomingExams.length
//         },
//         charts: {
//           revenueByMonth,
//           examTypeStats,
//           registrationTrends
//         },
//         recent: {
//           upcomingExams,
//           recentRegistrations
//         },
//         performance: {
//           registrationRate: await this.calculateRegistrationRate(),
//           passRate: await this.calculateAveragePassRate(),
//           revenueGrowth: await this.calculateRevenueGrowth()
//         }
//       };

//       res.json({
//         success: true,
//         data: stats,
//         message: 'Dashboard statistics retrieved successfully'
//       });
//     } catch (error) {
//       console.error('Dashboard stats error:', error);
//       res.status(500).json({
//         success: false,
//         message: 'Error fetching dashboard statistics',
//         error: error.message
//       });
//     }
//   }

//   // Get exam statistics
//   async getExamStatistics(req, res) {
//     try {
//       const { examId } = req.params;
      
//       const exam = await Exam.findById(examId);
      
//       if (!exam) {
//         return res.status(404).json({
//           success: false,
//           message: 'Exam not found'
//         });
//       }

//       const stats = {
//         basicInfo: {
//           name: exam.name,
//           code: exam.code,
//           type: exam.type,
//           totalRegistrations: exam.registrations.length,
//           availableSeats: exam.maxRegistrations - exam.registrations.length
//         },
//         registrationAnalysis: {
//           byStatus: {
//             pending: exam.registrations.filter(r => r.status === 'pending').length,
//             confirmed: exam.registrations.filter(r => r.status === 'confirmed').length,
//             attended: exam.registrations.filter(r => r.status === 'attended').length,
//             cancelled: exam.registrations.filter(r => r.status === 'cancelled').length
//           },
//           byPayment: {
//             paid: exam.registrations.filter(r => r.paymentStatus === 'paid').length,
//             pending: exam.registrations.filter(r => r.paymentStatus === 'pending').length,
//             failed: exam.registrations.filter(r => r.paymentStatus === 'failed').length
//           },
//           byDay: await this.getRegistrationsByDay(examId),
//           byCenter: await this.getRegistrationsByCenter(examId)
//         },
//         financials: {
//           totalRevenue: exam.statistics.revenue || 0,
//           byPaymentMethod: {
//             card: exam.registrations.filter(r => r.paymentMethod === 'card' && r.paymentStatus === 'paid').length * exam.fee.amount,
//             cash: exam.registrations.filter(r => r.paymentMethod === 'cash' && r.paymentStatus === 'paid').length * exam.fee.amount,
//             bank_transfer: exam.registrations.filter(r => r.paymentMethod === 'bank_transfer' && r.paymentStatus === 'paid').length * exam.fee.amount
//           },
//           pendingPayments: exam.registrations.filter(r => r.paymentStatus === 'pending').length * exam.fee.amount
//         },
//         performance: {
//           passRate: exam.statistics.passRate || 0,
//           averageScore: exam.statistics.averageScore || 0,
//           attendanceRate: exam.statistics.totalAttended > 0 
//             ? (exam.statistics.totalAttended / exam.registrations.length) * 100 
//             : 0
//         },
//         demographics: await this.getRegistrationDemographics(examId)
//       };

//       res.json({
//         success: true,
//         data: stats,
//         message: 'Exam statistics retrieved successfully'
//       });
//     } catch (error) {
//       console.error('Exam stats error:', error);
//       res.status(500).json({
//         success: false,
//         message: 'Error fetching exam statistics',
//         error: error.message
//       });
//     }
//   }

//   // ===================== EXPORT FUNCTIONS =====================
  
//   // Export registrations to Excel
//   async exportRegistrations(req, res) {
//     try {
//       const { examId } = req.params;
      
//       const exam = await Exam.findById(examId);
      
//       if (!exam) {
//         return res.status(404).json({
//           success: false,
//           message: 'Exam not found'
//         });
//       }

//       const workbook = new ExcelJS.Workbook();
//       const worksheet = workbook.addWorksheet('Registrations');

//       // Add headers
//       worksheet.columns = [
//         { header: 'Registration ID', key: 'id', width: 20 },
//         { header: 'Name', key: 'name', width: 25 },
//         { header: 'Email', key: 'email', width: 30 },
//         { header: 'Phone', key: 'phone', width: 15 },
//         { header: 'Organization', key: 'organization', width: 25 },
//         { header: 'Registration Date', key: 'date', width: 20 },
//         { header: 'Status', key: 'status', width: 15 },
//         { header: 'Payment Status', key: 'paymentStatus', width: 15 },
//         { header: 'Payment Method', key: 'paymentMethod', width: 15 },
//         { header: 'Amount', key: 'amount', width: 15 }
//       ];

//       // Add data
//       exam.registrations.forEach(registration => {
//         worksheet.addRow({
//           id: registration._id,
//           name: registration.userName,
//           email: registration.userEmail,
//           phone: registration.userPhone,
//           organization: registration.organization || 'N/A',
//           date: registration.registrationDate.toLocaleDateString(),
//           status: registration.status,
//           paymentStatus: registration.paymentStatus,
//           paymentMethod: registration.paymentMethod,
//           amount: exam.fee.amount
//         });
//       });

//       // Style headers
//       worksheet.getRow(1).eachCell((cell) => {
//         cell.font = { bold: true };
//         cell.fill = {
//           type: 'pattern',
//           pattern: 'solid',
//           fgColor: { argb: 'FFE0E0E0' }
//         };
//         cell.border = {
//           top: { style: 'thin' },
//           left: { style: 'thin' },
//           bottom: { style: 'thin' },
//           right: { style: 'thin' }
//         };
//       });

//       // Set response headers
//       res.setHeader(
//         'Content-Type',
//         'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
//       );
//       res.setHeader(
//         'Content-Disposition',
//         `attachment; filename=registrations-${exam.code}-${Date.now()}.xlsx`
//       );

//       await workbook.xlsx.write(res);
//       res.end();
//     } catch (error) {
//       console.error('Export error:', error);
//       res.status(500).json({
//         success: false,
//         message: 'Error exporting registrations',
//         error: error.message
//       });
//     }
//   }

//   // Export exam report to PDF
//   async exportExamReport(req, res) {
//     try {
//       const { examId } = req.params;
      
//       const exam = await Exam.findById(examId);
      
//       if (!exam) {
//         return res.status(404).json({
//           success: false,
//           message: 'Exam not found'
//         });
//       }

//       const doc = new PDFDocument();
      
//       // Set response headers
//       res.setHeader('Content-Type', 'application/pdf');
//       res.setHeader(
//         'Content-Disposition',
//         `attachment; filename=exam-report-${exam.code}-${Date.now()}.pdf`
//       );

//       // Pipe PDF to response
//       doc.pipe(res);

//       // Add content
//       doc.fontSize(20).text('CSCE Exam Report', { align: 'center' });
//       doc.moveDown();
      
//       doc.fontSize(14).text(`Exam: ${exam.name} (${exam.code})`);
//       doc.fontSize(12).text(`Type: ${exam.type}`);
//       doc.text(`Date: ${exam.nextExamDate.toLocaleDateString()}`);
//       doc.text(`Duration: ${exam.duration.value} ${exam.duration.unit}`);
//       doc.text(`Fee: ${exam.fee.amount} ${exam.fee.currency}`);
//       doc.moveDown();
      
//       doc.fontSize(16).text('Statistics');
//       doc.fontSize(12);
//       doc.text(`Total Registrations: ${exam.registrations.length}`);
//       doc.text(`Paid Registrations: ${exam.registrations.filter(r => r.paymentStatus === 'paid').length}`);
//       doc.text(`Total Revenue: ${exam.statistics.revenue || 0} ${exam.fee.currency}`);
//       doc.text(`Pass Rate: ${exam.statistics.passRate || 0}%`);
//       doc.moveDown();
      
//       doc.fontSize(16).text('Recent Registrations');
//       doc.fontSize(10);
      
//       // Add table headers
//       const startY = doc.y;
//       let x = 50;
      
//       doc.text('Name', x, startY);
//       doc.text('Email', x + 150, startY);
//       doc.text('Date', x + 300, startY);
//       doc.text('Status', x + 400, startY);
      
//       // Add registration data
//       let y = startY + 20;
//       exam.registrations.slice(0, 20).forEach(registration => {
//         if (y > 700) { // New page if near bottom
//           doc.addPage();
//           y = 50;
//         }
        
//         doc.text(registration.userName.substring(0, 20), x, y);
//         doc.text(registration.userEmail.substring(0, 25), x + 150, y);
//         doc.text(registration.registrationDate.toLocaleDateString(), x + 300, y);
//         doc.text(registration.status, x + 400, y);
        
//         y += 20;
//       });

//       doc.end();
//     } catch (error) {
//       console.error('PDF export error:', error);
//       res.status(500).json({
//         success: false,
//         message: 'Error generating PDF report',
//         error: error.message
//       });
//     }
//   }

//   // ===================== EMAIL SERVICES =====================
  
//   // Send registration confirmation email
//   async sendRegistrationConfirmation(registration, exam, registrationId) {
//     try {
//       const mailOptions = {
//         from: {
//           name: 'CSCE Examinations',
//           address: process.env.EMAIL_FROM || 'noreply@csce.edu'
//         },
//         to: registration.userEmail,
//         subject: `CSCE Registration Confirmation - ${exam.code}`,
//         html: `
//           <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//             <h2 style="color: #2563eb;">CSCE Examination Registration Confirmation</h2>
//             <p>Dear ${registration.userName},</p>
//             <p>Your registration for the following exam has been received:</p>
            
//             <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
//               <h3 style="margin-top: 0;">Exam Details</h3>
//               <p><strong>Exam:</strong> ${exam.name} (${exam.code})</p>
//               <p><strong>Date:</strong> ${exam.nextExamDate.toLocaleDateString()}</p>
//               <p><strong>Duration:</strong> ${exam.duration.value} ${exam.duration.unit}</p>
//               <p><strong>Fee:</strong> ${exam.fee.amount} ${exam.fee.currency}</p>
//               <p><strong>Registration ID:</strong> ${registrationId}</p>
//             </div>
            
//             <div style="background: #dbeafe; padding: 15px; border-radius: 8px; margin: 20px 0;">
//               <h4 style="margin-top: 0;">Important Information:</h4>
//               <ul>
//                 <li>Please complete your payment within 7 days to confirm your registration</li>
//                 <li>Bring your ID and this confirmation email to the test center</li>
//                 <li>Arrive at least 30 minutes before the exam starts</li>
//                 <li>Check your email for further updates</li>
//               </ul>
//             </div>
            
//             <p>If you have any questions, please contact us at support@csce.edu</p>
            
//             <p>Best regards,<br>CSCE Examination Board</p>
//           </div>
//         `
//       };

//       await emailTransporter.sendMail(mailOptions);
//       console.log(`Registration confirmation sent to ${registration.userEmail}`);
//     } catch (error) {
//       console.error('Email sending error:', error);
//     }
//   }

//   // Send payment confirmation email
//   async sendPaymentConfirmation(registration, exam) {
//     try {
//       const mailOptions = {
//         from: {
//           name: 'CSCE Examinations',
//           address: process.env.EMAIL_FROM || 'noreply@csce.edu'
//         },
//         to: registration.userEmail,
//         subject: `Payment Confirmed - ${exam.code}`,
//         html: `
//           <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//             <h2 style="color: #10b981;">Payment Confirmation</h2>
//             <p>Dear ${registration.userName},</p>
//             <p>Your payment for the following exam has been confirmed:</p>
            
//             <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
//               <h3 style="margin-top: 0;">Payment Details</h3>
//               <p><strong>Exam:</strong> ${exam.name} (${exam.code})</p>
//               <p><strong>Amount Paid:</strong> ${exam.fee.amount} ${exam.fee.currency}</p>
//               <p><strong>Payment Date:</strong> ${new Date().toLocaleDateString()}</p>
//               <p><strong>Transaction ID:</strong> ${registration.paymentDetails?.transactionId || 'N/A'}</p>
//             </div>
            
//             <p>Your registration is now complete. You will receive exam hall details one week before the exam date.</p>
            
//             <p>Best regards,<br>CSCE Examination Board</p>
//           </div>
//         `
//       };

//       await emailTransporter.sendMail(mailOptions);
//       console.log(`Payment confirmation sent to ${registration.userEmail}`);
//     } catch (error) {
//       console.error('Payment email error:', error);
//     }
//   }

//   // Send exam reminder email
//   async sendExamReminder(exam, daysBefore = 1) {
//     try {
//       const upcomingRegistrations = exam.registrations.filter(
//         reg => reg.status === 'confirmed' || reg.paymentStatus === 'paid'
//       );

//       for (const registration of upcomingRegistrations) {
//         const mailOptions = {
//           from: {
//             name: 'CSCE Examinations',
//             address: process.env.EMAIL_FROM || 'noreply@csce.edu'
//           },
//           to: registration.userEmail,
//           subject: `Exam Reminder - ${exam.code} (${daysBefore} day${daysBefore > 1 ? 's' : ''} to go)`,
//           html: `
//             <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//               <h2 style="color: #f59e0b;">Exam Reminder</h2>
//               <p>Dear ${registration.userName},</p>
//               <p>This is a reminder for your upcoming exam:</p>
              
//               <div style="background: #fffbeb; padding: 20px; border-radius: 8px; margin: 20px 0;">
//                 <h3 style="margin-top: 0;">Exam Details</h3>
//                 <p><strong>Exam:</strong> ${exam.name} (${exam.code})</p>
//                 <p><strong>Date:</strong> ${exam.nextExamDate.toLocaleDateString()}</p>
//                 <p><strong>Time:</strong> ${exam.schedule?.[0]?.time || '09:00 AM'}</p>
//                 <p><strong>Duration:</strong> ${exam.duration.value} ${exam.duration.unit}</p>
//                 ${exam.testCenters?.[0] ? `
//                   <p><strong>Test Center:</strong> ${exam.testCenters[0].name}</p>
//                   <p><strong>Address:</strong> ${exam.testCenters[0].address}</p>
//                 ` : ''}
//               </div>
              
//               <div style="background: #eff6ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
//                 <h4 style="margin-top: 0;">What to Bring:</h4>
//                 <ul>
//                   <li>Valid ID (Passport/National ID/Driver's License)</li>
//                   <li>Printout of this email or registration confirmation</li>
//                   <li>Black/blue pens and pencils</li>
//                   <li>Calculator (if permitted)</li>
//                 </ul>
//               </div>
              
//               <p>Please arrive at least 30 minutes before the exam starts.</p>
              
//               <p>Best regards,<br>CSCE Examination Board</p>
//             </div>
//           `
//         };

//         await emailTransporter.sendMail(mailOptions);
//         console.log(`Reminder sent to ${registration.userEmail}`);
//       }
//     } catch (error) {
//       console.error('Reminder email error:', error);
//     }
//   }

//   // Send admin notification
//   async sendAdminNotification(notification) {
//     try {
//       const adminEmail = process.env.ADMIN_EMAIL || 'admin@csce.edu';
      
//       let subject = '';
//       let html = '';
      
//       switch (notification.type) {
//         case 'exam_created':
//           subject = 'New Exam Created';
//           html = `
//             <h3>New Exam Created</h3>
//             <p><strong>Exam:</strong> ${notification.exam}</p>
//             <p><strong>Created By:</strong> ${notification.createdBy}</p>
//             <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
//           `;
//           break;
          
//         case 'new_registration':
//           subject = 'New Exam Registration';
//           html = `
//             <h3>New Registration Received</h3>
//             <p><strong>Exam:</strong> ${notification.exam}</p>
//             <p><strong>Candidate:</strong> ${notification.user}</p>
//             <p><strong>Email:</strong> ${notification.email}</p>
//             <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
//           `;
//           break;
          
//         case 'payment_received':
//           subject = 'Payment Received';
//           html = `
//             <h3>Payment Received</h3>
//             <p><strong>Exam:</strong> ${notification.exam}</p>
//             <p><strong>Candidate:</strong> ${notification.user}</p>
//             <p><strong>Amount:</strong> ${notification.amount} ${notification.currency}</p>
//             <p><strong>Transaction ID:</strong> ${notification.transactionId}</p>
//           `;
//           break;
//       }
      
//       const mailOptions = {
//         from: {
//           name: 'CSCE System Notification',
//           address: process.env.EMAIL_FROM || 'noreply@csce.edu'
//         },
//         to: adminEmail,
//         subject,
//         html: `
//           <div style="font-family: Arial, sans-serif;">
//             ${html}
//             <p>---<br>CSCE Examination System</p>
//           </div>
//         `
//       };
      
//       await emailTransporter.sendMail(mailOptions);
//       console.log(`Admin notification sent: ${notification.type}`);
//     } catch (error) {
//       console.error('Admin notification error:', error);
//     }
//   }

//   // Send status update email
//   async sendStatusUpdate(registration, exam, updates) {
//     try {
//       const mailOptions = {
//         from: {
//           name: 'CSCE Examinations',
//           address: process.env.EMAIL_FROM || 'noreply@csce.edu'
//         },
//         to: registration.userEmail,
//         subject: `Registration Status Update - ${exam.code}`,
//         html: `
//           <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//             <h2 style="color: #6366f1;">Registration Status Update</h2>
//             <p>Dear ${registration.userName},</p>
//             <p>Your registration status has been updated:</p>
            
//             <div style="background: #f5f3ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
//               <h3 style="margin-top: 0;">Updated Information</h3>
//               <p><strong>Exam:</strong> ${exam.name} (${exam.code})</p>
//               ${updates.status ? `<p><strong>Status:</strong> ${updates.status}</p>` : ''}
//               ${updates.paymentStatus ? `<p><strong>Payment Status:</strong> ${updates.paymentStatus}</p>` : ''}
//               ${registration.notes ? `<p><strong>Notes:</strong> ${registration.notes}</p>` : ''}
//             </div>
            
//             <p>If you have any questions about these updates, please contact support.</p>
            
//             <p>Best regards,<br>CSCE Examination Board</p>
//           </div>
//         `
//       };

//       await emailTransporter.sendMail(mailOptions);
//       console.log(`Status update sent to ${registration.userEmail}`);
//     } catch (error) {
//       console.error('Status email error:', error);
//     }
//   }

//   // ===================== HELPER FUNCTIONS =====================
  
//   // Generate unique exam code
//   async generateExamCode(type) {
//     const prefix = type.substring(0, 3).toUpperCase();
//     let code;
//     let exists = true;
    
//     while (exists) {
//       const randomNum = Math.floor(1000 + Math.random() * 9000);
//       code = `${prefix}-${randomNum}`;
//       const exam = await Exam.findOne({ code });
//       exists = !!exam;
//     }
    
//     return code;
//   }

//   // Get revenue by month
//   async getRevenueByMonth(months = 6) {
//     const results = await Exam.aggregate([
//       { $match: { isActive: true } },
//       { $unwind: '$registrations' },
//       { $match: { 'registrations.paymentStatus': 'paid' } },
//       { $group: {
//         _id: {
//           year: { $year: '$registrations.paymentDetails.paymentDate' },
//           month: { $month: '$registrations.paymentDetails.paymentDate' }
//         },
//         revenue: { $sum: '$fee.amount' },
//         count: { $sum: 1 }
//       }},
//       { $sort: { '_id.year': -1, '_id.month': -1 } },
//       { $limit: months }
//     ]);

//     const monthsArray = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
//     return results.map(item => ({
//       month: monthsArray[item._id.month - 1],
//       year: item._id.year,
//       revenue: item.revenue,
//       registrations: item.count
//     })).reverse();
//   }

//   // Get registration trends
//   async getRegistrationTrends(days = 7) {
//     const date = new Date();
//     date.setDate(date.getDate() - days);
    
//     const results = await Exam.aggregate([
//       { $match: { isActive: true } },
//       { $unwind: '$registrations' },
//       { $match: { 'registrations.createdAt': { $gte: date } } },
//       { $group: {
//         _id: { $dateToString: { format: '%Y-%m-%d', date: '$registrations.createdAt' } },
//         count: { $sum: 1 }
//       }},
//       { $sort: { '_id': 1 } }
//     ]);

//     // Fill in missing days
//     const trends = [];
//     for (let i = days - 1; i >= 0; i--) {
//       const d = new Date();
//       d.setDate(d.getDate() - i);
//       const dateStr = d.toISOString().split('T')[0];
//       const data = results.find(r => r._id === dateStr);
      
//       trends.push({
//         date: dateStr,
//         count: data ? data.count : 0
//       });
//     }
    
//     return trends;
//   }

//   // Calculate registration rate
//   async calculateRegistrationRate() {
//     const now = new Date();
//     const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    
//     const [currentMonth, previousMonth] = await Promise.all([
//       Exam.aggregate([
//         { $match: { isActive: true } },
//         { $unwind: '$registrations' },
//         { $match: { 
//           'registrations.createdAt': { 
//             $gte: new Date(now.getFullYear(), now.getMonth(), 1)
//           }
//         }},
//         { $group: { _id: null, count: { $sum: 1 } } }
//       ]),
//       Exam.aggregate([
//         { $match: { isActive: true } },
//         { $unwind: '$registrations' },
//         { $match: { 
//           'registrations.createdAt': { 
//             $gte: lastMonth,
//             $lt: new Date(now.getFullYear(), now.getMonth(), 1)
//           }
//         }},
//         { $group: { _id: null, count: { $sum: 1 } } }
//       ])
//     ]);
    
//     const current = currentMonth[0]?.count || 0;
//     const previous = previousMonth[0]?.count || 0;
    
//     return previous > 0 ? ((current - previous) / previous) * 100 : 100;
//   }

//   // Calculate average pass rate
//   async calculateAveragePassRate() {
//     const result = await Exam.aggregate([
//       { $match: { isActive: true, 'statistics.passRate': { $gt: 0 } } },
//       { $group: {
//         _id: null,
//         averagePassRate: { $avg: '$statistics.passRate' },
//         count: { $sum: 1 }
//       }}
//     ]);
    
//     return result[0]?.averagePassRate || 0;
//   }

//   // Calculate revenue growth
//   async calculateRevenueGrowth() {
//     const now = new Date();
    
//     const [currentMonth, previousMonth] = await Promise.all([
//       Exam.aggregate([
//         { $match: { isActive: true } },
//         { $unwind: '$registrations' },
//         { $match: { 
//           'registrations.paymentStatus': 'paid',
//           'registrations.paymentDetails.paymentDate': {
//             $gte: new Date(now.getFullYear(), now.getMonth(), 1),
//             $lt: new Date(now.getFullYear(), now.getMonth() + 1, 1)
//           }
//         }},
//         { $group: {
//           _id: null,
//           revenue: { $sum: '$fee.amount' }
//         }}
//       ]),
//       Exam.aggregate([
//         { $match: { isActive: true } },
//         { $unwind: '$registrations' },
//         { $match: { 
//           'registrations.paymentStatus': 'paid',
//           'registrations.paymentDetails.paymentDate': {
//             $gte: new Date(now.getFullYear(), now.getMonth() - 1, 1),
//             $lt: new Date(now.getFullYear(), now.getMonth(), 1)
//           }
//         }},
//         { $group: {
//           _id: null,
//           revenue: { $sum: '$fee.amount' }
//         }}
//       ])
//     ]);
    
//     const current = currentMonth[0]?.revenue || 0;
//     const previous = previousMonth[0]?.revenue || 0;
    
//     return previous > 0 ? ((current - previous) / previous) * 100 : 100;
//   }

//   // Get registrations by day
//   async getRegistrationsByDay(examId) {
//     const result = await Exam.aggregate([
//       { $match: { _id: new mongoose.Types.ObjectId(examId) } },
//       { $unwind: '$registrations' },
//       { $group: {
//         _id: { $dateToString: { format: '%Y-%m-%d', date: '$registrations.createdAt' } },
//         count: { $sum: 1 }
//       }},
//       { $sort: { '_id': 1 } },
//       { $limit: 30 }
//     ]);
    
//     return result;
//   }

//   // Get registrations by center
//   async getRegistrationsByCenter(examId) {
//     const result = await Exam.aggregate([
//       { $match: { _id: new mongoose.Types.ObjectId(examId) } },
//       { $unwind: '$registrations' },
//       { $group: {
//         _id: '$registrations.examSession.center',
//         count: { $sum: 1 },
//         attended: { $sum: { $cond: [{ $eq: ['$registrations.status', 'attended'] }, 1, 0] } }
//       }},
//       { $sort: { count: -1 } }
//     ]);
    
//     return result;
//   }

//   // Get registration demographics
//   async getRegistrationDemographics(examId) {
//     const result = await Exam.aggregate([
//       { $match: { _id: new mongoose.Types.ObjectId(examId) } },
//       { $unwind: '$registrations' },
//       { $group: {
//         _id: {
//           organization: '$registrations.organization',
//           paymentMethod: '$registrations.paymentMethod'
//         },
//         count: { $sum: 1 }
//       }},
//       { $sort: { count: -1 } }
//     ]);
    
//     return result;
//   }
// }

// module.exports = new CSEController();


























// const mongoose = require('mongoose');
// const nodemailer = require('nodemailer');
// const Exam = require('../models/Exam');

// class CSEController {
//   constructor() {
//     // ✅ SAFE AUTO-BIND (PREVENTS bind() CRASH)
//     const methods = [
//       'getDashboardStats',
//       'getRevenueByMonth',
//       'getRegistrationTrends',
//       'getRegistrationsByDay',
//       'getExamTypeStats',
//       'calculateRegistrationRate',
//       'calculateAveragePassRate',
//       'calculateRevenueGrowth',

//       'createExam',
//       'getAllExams',
//       'getSingleExam',
//       'registerForExam',
//       'getExamRegistrations',
//       'updateRegistrationStatus'
//     ];

//     methods.forEach((method) => {
//       if (typeof this[method] === 'function') {
//         this[method] = this[method].bind(this);
//       }
//     });

//     // ✅ EMAIL TRANSPORTER
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

//   // ==================================================
//   // 📧 EMAIL HELPER
//   // ==================================================
//   async sendEmail(to, subject, html) {
//     await this.mailer.sendMail({
//       from: `"CSCCE Exams" <${process.env.SMTP_USER}>`,
//       to,
//       subject,
//       html
//     });
//   }

//   // ==================================================
//   // 📝 CREATE EXAM (BOOKING)
//   // ==================================================
//   async createExam(req, res) {
//     try {
//       const exam = await Exam.create({
//         ...req.body,
//         createdBy: req.user._id
//       });

//       // 📧 ADMIN EMAIL
//       await this.sendEmail(
//         process.env.ADMIN_EMAIL,
//         'New CSCCE Exam Created',
//         `<p>New exam <b>${exam.name}</b> has been created.</p>`
//       );

//       res.status(201).json({
//         success: true,
//         message: 'Exam created successfully',
//         data: exam
//       });
//     } catch (error) {
//       res.status(400).json({
//         success: false,
//         message: error.message
//       });
//     }
//   }

//   // ==================================================
//   // 📚 GET ALL EXAMS
//   // ==================================================
//   async getAllExams(req, res) {
//     try {
//       const exams = await Exam.find({ isActive: true }).sort({ createdAt: -1 });
//       res.json({ success: true, data: exams });
//     } catch (error) {
//       res.status(500).json({ success: false, message: error.message });
//     }
//   }

//   // ==================================================
//   // 📄 GET SINGLE EXAM
//   // ==================================================
//   async getSingleExam(req, res) {
//     try {
//       const exam = await Exam.findById(req.params.id);
//       if (!exam) {
//         return res.status(404).json({ success: false, message: 'Exam not found' });
//       }
//       res.json({ success: true, data: exam });
//     } catch (error) {
//       res.status(500).json({ success: false, message: error.message });
//     }
//   }

//   // ==================================================
//   // 🧾 REGISTER FOR EXAM
//   // ==================================================
//   async registerForExam(req, res) {
//     try {
//       const { examId } = req.params;
//       const exam = await Exam.findById(examId);

//       if (!exam) {
//         return res.status(404).json({ success: false, message: 'Exam not found' });
//       }

//       await exam.addRegistration({
//         ...req.body,
//         userId: req.user._id
//       });

//       // 📧 USER EMAIL
//       await this.sendEmail(
//         req.body.userEmail,
//         'CSCCE Exam Registration Successful',
//         `<p>Hello ${req.body.userName},<br/>You have successfully registered for <b>${exam.name}</b>.</p>`
//       );

//       res.status(201).json({
//         success: true,
//         message: 'Registration successful'
//       });
//     } catch (error) {
//       res.status(400).json({ success: false, message: error.message });
//     }
//   }

//   // ==================================================
//   // 📋 GET EXAM REGISTRATIONS
//   // ==================================================
//   async getExamRegistrations(req, res) {
//     try {
//       const exam = await Exam.findById(req.params.examId).select('registrations');
//       if (!exam) {
//         return res.status(404).json({ success: false, message: 'Exam not found' });
//       }

//       res.json({
//         success: true,
//         data: exam.registrations
//       });
//     } catch (error) {
//       res.status(500).json({ success: false, message: error.message });
//     }
//   }

// // Get all registrations across all exams
// async getAllRegistrations(req, res) {
//   try {
//     // Find all exams and only select their registrations
//     const exams = await Exam.find().select('name code registrations');

//     // Flatten all registrations into a single array with exam info
//     const allRegistrations = exams.flatMap(exam =>
//       exam.registrations.map(reg => ({
//         examId: exam._id,
//         examName: exam.name,
//         examCode: exam.code,
//         registrationId: reg._id,
//         userName: reg.userName,
//         userEmail: reg.userEmail,
//         userPhone: reg.userPhone,
//         organization: reg.organization,
//         registrationDate: reg.registrationDate,
//         status: reg.status,
//         paymentStatus: reg.paymentStatus,
//         paymentMethod: reg.paymentMethod,
//         examSession: reg.examSession,
//         score: reg.score,
//         grade: reg.grade,
//         notes: reg.notes,
//         attachments: reg.attachments
//       }))
//     );

//     res.json({
//       success: true,
//       total: allRegistrations.length,
//       data: allRegistrations
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// }


//   // ==================================================
//   // 🔄 UPDATE REGISTRATION STATUS
//   // ==================================================
//   async updateRegistrationStatus(req, res) {
//     try {
//       const { examId, registrationId } = req.params;
//       const { status, paymentStatus } = req.body;

//       const exam = await Exam.findById(examId);
//       if (!exam) {
//         return res.status(404).json({ success: false, message: 'Exam not found' });
//       }

//       const registration = exam.registrations.id(registrationId);
//       if (!registration) {
//         return res.status(404).json({ success: false, message: 'Registration not found' });
//       }

//       if (status) registration.status = status;
//       if (paymentStatus) registration.paymentStatus = paymentStatus;

//       await exam.save();

//       // 📧 STATUS EMAIL
//       await this.sendEmail(
//         registration.userEmail,
//         'CSCCE Registration Update',
//         `<p>Your registration status for <b>${exam.name}</b> has been updated.</p>`
//       );

//       res.json({
//         success: true,
//         message: 'Registration updated'
//       });
//     } catch (error) {
//       res.status(400).json({ success: false, message: error.message });
//     }
//   }

//   // ==================================================
//   // 📊 DASHBOARD ANALYTICS
//   // ==================================================
//   async getDashboardStats(req, res) {
//     try {
//       const [
//         totalExams,
//         totalRegistrations,
//         revenue
//       ] = await Promise.all([
//         Exam.countDocuments({ isActive: true }),
//         Exam.aggregate([
//           { $project: { count: { $size: '$registrations' } } },
//           { $group: { _id: null, total: { $sum: '$count' } } }
//         ]),
//         Exam.aggregate([
//           { $unwind: '$registrations' },
//           { $match: { 'registrations.paymentStatus': 'paid' } },
//           { $group: { _id: null, total: { $sum: '$fee.amount' } } }
//         ])
//       ]);

//       res.json({
//         success: true,
//         data: {
//           totalExams,
//           totalRegistrations: totalRegistrations[0]?.total || 0,
//           totalRevenue: revenue[0]?.total || 0
//         }
//       });
//     } catch (error) {
//       res.status(500).json({ success: false, message: error.message });
//     }
//   }

//   // ==================================================
//   // 📈 HELPERS (SAFE)
//   // ==================================================
//   async getRevenueByMonth() { return []; }
//   async getRegistrationTrends() { return []; }
//   async getRegistrationsByDay() { return []; }
//   async getExamTypeStats() { return []; }
//   async calculateRegistrationRate() { return 0; }
//   async calculateAveragePassRate() { return 0; }
//   async calculateRevenueGrowth() { return 0; }
// }

// // ✅ SINGLE INSTANCE EXPORT (IMPORTANT)
// module.exports = new CSEController();

























const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const Exam = require('../models/Exam');

class CSEController {
  constructor() {
    // ✅ SAFE AUTO-BIND (PREVENTS bind() CRASH)
    const methods = [
      'getDashboardStats',
      'getRevenueByMonth',
      'getRegistrationTrends',
      'getRegistrationsByDay',
      'getExamTypeStats',
      'calculateRegistrationRate',
      'calculateAveragePassRate',
      'calculateRevenueGrowth',

      'createExam',
      'getAllExams',
      'getSingleExam',
      'registerForExam',
      'getExamRegistrations',
      'updateRegistrationStatus',

      // Booking CRUD
      'createBooking',
      'getExamBookings',
      'updateBookingStatus',
      'deleteBooking',
      'getAllBookings'
    ];

    methods.forEach((method) => {
      if (typeof this[method] === 'function') {
        this[method] = this[method].bind(this);
      }
    });

    // ✅ EMAIL TRANSPORTER
    this.mailer = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  // ==================================================
  // 📧 EMAIL HELPER
  // ==================================================
  async sendEmail(to, subject, html) {
    await this.mailer.sendMail({
      from: `"CSCCE Exams" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html
    });
  }

  // ==================================================
  // 📝 CREATE EXAM
  // ==================================================
  async createExam(req, res) {
    try {
      const exam = await Exam.create({
        ...req.body,
        createdBy: req.user._id
      });

      await this.sendEmail(
        process.env.ADMIN_EMAIL,
        'New CSCCE Exam Created',
        `<p>New exam <b>${exam.name}</b> has been created.</p>`
      );

      res.status(201).json({
        success: true,
        message: 'Exam created successfully',
        data: exam
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // ==================================================
  // 📚 GET ALL EXAMS
  // ==================================================
  async getAllExams(req, res) {
    try {
      const exams = await Exam.find({ isActive: true }).sort({ createdAt: -1 });
      res.json({ success: true, data: exams });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // ==================================================
  // 📄 GET SINGLE EXAM
  // ==================================================
  async getSingleExam(req, res) {
    try {
      const exam = await Exam.findById(req.params.id);
      if (!exam) return res.status(404).json({ success: false, message: 'Exam not found' });
      res.json({ success: true, data: exam });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // ==================================================
  // 🧾 REGISTER FOR EXAM
  // ==================================================
  async registerForExam(req, res) {
    try {
      const { examId } = req.params;
      const exam = await Exam.findById(examId);

      if (!exam) return res.status(404).json({ success: false, message: 'Exam not found' });

      await exam.addRegistration({
        ...req.body,
        userId: req.user._id
      });

      await this.sendEmail(
        req.body.userEmail,
        'CSCCE Exam Registration Successful',
        `<p>Hello ${req.body.userName},<br/>You have successfully registered for <b>${exam.name}</b>.</p>`
      );

      res.status(201).json({ success: true, message: 'Registration successful' });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  // ==================================================
  // 📋 GET EXAM REGISTRATIONS
  // ==================================================
  async getExamRegistrations(req, res) {
    try {
      const exam = await Exam.findById(req.params.examId).select('registrations');
      if (!exam) return res.status(404).json({ success: false, message: 'Exam not found' });

      res.json({ success: true, data: exam.registrations });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // ==================================================
  // Get all registrations across exams
  // ==================================================
  async getAllRegistrations(req, res) {
    try {
      const exams = await Exam.find().select('name code registrations');
      const allRegistrations = exams.flatMap(exam =>
        exam.registrations.map(reg => ({
          examId: exam._id,
          examName: exam.name,
          examCode: exam.code,
          registrationId: reg._id,
          userName: reg.userName,
          userEmail: reg.userEmail,
          userPhone: reg.userPhone,
          organization: reg.organization,
          registrationDate: reg.registrationDate,
          status: reg.status,
          paymentStatus: reg.paymentStatus,
          paymentMethod: reg.paymentMethod,
          examSession: reg.examSession,
          score: reg.score,
          grade: reg.grade,
          notes: reg.notes,
          attachments: reg.attachments
        }))
      );

      res.json({ success: true, total: allRegistrations.length, data: allRegistrations });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // ==================================================
  // 🔄 UPDATE REGISTRATION STATUS
  // ==================================================
  async updateRegistrationStatus(req, res) {
    try {
      const { examId, registrationId } = req.params;
      const { status, paymentStatus } = req.body;

      const exam = await Exam.findById(examId);
      if (!exam) return res.status(404).json({ success: false, message: 'Exam not found' });

      const registration = exam.registrations.id(registrationId);
      if (!registration) return res.status(404).json({ success: false, message: 'Registration not found' });

      if (status) registration.status = status;
      if (paymentStatus) registration.paymentStatus = paymentStatus;

      await exam.save();

      await this.sendEmail(
        registration.userEmail,
        'CSCCE Registration Update',
        `<p>Your registration status for <b>${exam.name}</b> has been updated.</p>`
      );

      res.json({ success: true, message: 'Registration updated' });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  // ==================================================
  // 📊 DASHBOARD ANALYTICS
  // ==================================================
  async getDashboardStats(req, res) {
    try {
      const [
        totalExams,
        totalRegistrations,
        revenue
      ] = await Promise.all([
        Exam.countDocuments({ isActive: true }),
        Exam.aggregate([
          { $project: { count: { $size: '$registrations' } } },
          { $group: { _id: null, total: { $sum: '$count' } } }
        ]),
        Exam.aggregate([
          { $unwind: '$registrations' },
          { $match: { 'registrations.paymentStatus': 'paid' } },
          { $group: { _id: null, total: { $sum: '$fee.amount' } } }
        ])
      ]);

      res.json({
        success: true,
        data: {
          totalExams,
          totalRegistrations: totalRegistrations[0]?.total || 0,
          totalRevenue: revenue[0]?.total || 0
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // ==================================================
  // 📌 BOOKING CRUD METHODS
  // ==================================================

  // Create Booking
  async createBooking(req, res) {
    try {
      const exam = await Exam.findById(req.params.examId);
      if (!exam) return res.status(404).json({ success: false, message: 'Exam not found' });

      exam.bookings.push({ ...req.body });
      await exam.save();

      await this.sendEmail(
        req.body.studentEmail,
        'CSCCE Exam Booking Confirmed',
        `<p>Hello ${req.body.studentName},<br/>Your booking for <b>${exam.name}</b> has been created.</p>`
      );

      res.status(201).json({ success: true, message: 'Booking created', data: req.body });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  // Get Bookings for a single exam
  async getExamBookings(req, res) {
    try {
      const exam = await Exam.findById(req.params.examId).select('bookings');
      if (!exam) return res.status(404).json({ success: false, message: 'Exam not found' });

      res.json({ success: true, data: exam.bookings });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Update Booking
  async updateBookingStatus(req, res) {
    try {
      const { examId, bookingId } = req.params;
      const { status, paymentStatus } = req.body;

      const exam = await Exam.findById(examId);
      if (!exam) return res.status(404).json({ success: false, message: 'Exam not found' });

      const booking = exam.bookings.id(bookingId);
      if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

      if (status) booking.status = status;
      if (paymentStatus) booking.paymentStatus = paymentStatus;

      await exam.save();

      await this.sendEmail(
        booking.studentEmail,
        'CSCCE Booking Update',
        `<p>Your booking status for <b>${exam.name}</b> has been updated.</p>`
      );

      res.json({ success: true, message: 'Booking updated' });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  // Delete Booking
  async deleteBooking(req, res) {
    try {
      const { examId, bookingId } = req.params;

      const exam = await Exam.findById(examId);
      if (!exam) return res.status(404).json({ success: false, message: 'Exam not found' });

      const booking = exam.bookings.id(bookingId);
      if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

      booking.remove();
      await exam.save();

      res.json({ success: true, message: 'Booking deleted' });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  // Get all bookings across exams
  async getAllBookings(req, res) {
    try {
      const exams = await Exam.find().select('name code bookings');

      const allBookings = exams.flatMap(exam =>
        exam.bookings.map(booking => ({
          examId: exam._id,
          examName: exam.name,
          examCode: exam.code,
          bookingId: booking._id,
          studentName: booking.studentName,
          studentEmail: booking.studentEmail,
          studentPhone: booking.studentPhone,
          studentId: booking.studentId,
          registrationDate: booking.registrationDate,
          status: booking.status,
          paymentStatus: booking.paymentStatus,
          paymentMethod: booking.paymentMethod,
          examSession: booking.examSession,
          score: booking.score,
          grade: booking.grade,
          notes: booking.notes,
          paymentDetails: booking.paymentDetails
        }))
      );

      res.json({ success: true, total: allBookings.length, data: allBookings });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // ==================================================
  // 📈 HELPERS (SAFE)
  // ==================================================
  async getRevenueByMonth() { return []; }
  async getRegistrationTrends() { return []; }
  async getRegistrationsByDay() { return []; }
  async getExamTypeStats() { return []; }
  async calculateRegistrationRate() { return 0; }
  async calculateAveragePassRate() { return 0; }
  async calculateRevenueGrowth() { return 0; }
}

// ✅ SINGLE INSTANCE EXPORT (IMPORTANT)
module.exports = new CSEController();
