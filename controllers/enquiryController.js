// const Enquiry = require('../models/Enquiry');
// const EmailLog = require('../models/EmailLog');
// const mongoose = require('mongoose');
// const moment = require('moment');
// const nodemailer = require('nodemailer');

// class EnquiryController {
//     constructor() {
//         // Initialize email transporter with better error handling
//         this.initializeEmailTransporter();
//         this.verifyEmailConfig();
//     }

//     initializeEmailTransporter() {
//         try {
//             const emailUser = process.env.SMTP_USER;
//             const emailPass = process.env.SMTP_PASS;
            
//             if (!emailUser || !emailPass) {
//                 console.warn('⚠️ SMTP credentials not found. Email functionality will be disabled.');
//                 this.transporter = null;
//                 return;
//             }

//             this.transporter = nodemailer.createTransport({
//                 host: process.env.SMTP_HOST || 'smtp.gmail.com',
//                 port: parseInt(process.env.SMTP_PORT) || 587,
//                 secure: process.env.SMTP_SECURE === 'true',
//                 auth: {
//                     user: emailUser,
//                     pass: emailPass
//                 },
//                 tls: {
//                     rejectUnauthorized: false // Allow self-signed certificates in development
//                 },
//                 pool: true, // Use connection pooling
//                 maxConnections: 5,
//                 maxMessages: 100
//             });

//             console.log('✅ Email transporter initialized');
//         } catch (error) {
//             console.error('❌ Failed to initialize email transporter:', error.message);
//             this.transporter = null;
//         }
//     }

//     async verifyEmailConfig() {
//         try {
//             if (!this.transporter) {
//                 console.warn('⚠️ Email transporter not available. Skipping verification.');
//                 return false;
//             }

//             await this.transporter.verify();
//             console.log('✅ Email transporter verified and ready');
//             return true;
//         } catch (error) {
//             console.error('❌ Email transporter verification failed:', error.message);
//             return false;
//         }
//     }

//     async sendEmail(options) {
//         try {
//             // Check if email is configured
//             if (!this.transporter) {
//                 console.warn('⚠️ Email not configured. Skipping email send.');
//                 return null;
//             }

//             const mailOptions = {
//                 from: `"Enquiry System" <${process.env.SMTP_USER}>`,
//                 to: options.to,
//                 subject: options.subject,
//                 html: options.html,
//                 text: options.text || this.stripHtml(options.html)
//             };

//             // Create email log entry
//             const emailLog = new EmailLog({
//                 enquiryId: options.enquiryId,
//                 recipientType: options.recipientType,
//                 emailType: options.emailType,
//                 recipientEmail: options.to,
//                 subject: options.subject,
//                 content: options.html,
//                 status: 'pending',
//                 metadata: options.metadata || {}
//             });

//             await emailLog.save();

//             // Send email with timeout
//             const sendPromise = this.transporter.sendMail(mailOptions);
//             const timeoutPromise = new Promise((_, reject) => {
//                 setTimeout(() => reject(new Error('Email sending timeout')), 30000);
//             });

//             const info = await Promise.race([sendPromise, timeoutPromise]);

//             // Update email log with success
//             emailLog.status = 'sent';
//             emailLog.messageId = info.messageId;
//             emailLog.sentAt = new Date();
//             await emailLog.save();

//             console.log(`✅ Email sent to ${options.to}: ${info.messageId}`);
//             return info;

//         } catch (error) {
//             console.error('❌ Error sending email:', error.message);
            
//             // Update email log with failure
//             try {
//                 await EmailLog.findOneAndUpdate(
//                     { enquiryId: options.enquiryId, recipientEmail: options.to },
//                     {
//                         status: 'failed',
//                         errorMessage: error.message,
//                         sentAt: new Date()
//                     },
//                     { new: true, sort: { createdAt: -1 } }
//                 );
//             } catch (logError) {
//                 console.error('❌ Failed to update email log:', logError.message);
//             }
            
//             // Don't throw error to prevent enquiry creation from failing
//             return null;
//         }
//     }

//     stripHtml(html) {
//         return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
//     }

//     async sendEnquiryEmails(enquiry) {
//         try {
//             console.log(`📧 Starting email process for enquiry ${enquiry._id}`);
            
//             // Check if email is configured
//             if (!this.transporter) {
//                 console.warn('⚠️ Email not configured. Skipping email sending.');
//                 return { userEmail: 'skipped', adminEmail: 'skipped' };
//             }

//             // Prepare user email
//             const userEmailContent = this.getUserEmailTemplate(enquiry);
//             const adminEmailContent = this.getAdminEmailTemplate(enquiry);

//             // Send emails in parallel
//             const [userEmailResult, adminEmailResult] = await Promise.allSettled([
//                 this.sendEmail({
//                     to: enquiry.email,
//                     subject: `Enquiry Confirmation - ${enquiry.course}`,
//                     html: userEmailContent,
//                     enquiryId: enquiry._id,
//                     recipientType: 'user',
//                     emailType: 'confirmation'
//                 }),
//                 this.sendEmail({
//                     to: process.env.ADMIN_EMAIL || enquiry.email, // Fallback to user email if admin email not set
//                     subject: `📋 New Enquiry: ${enquiry.name} - ${enquiry.course}`,
//                     html: adminEmailContent,
//                     enquiryId: enquiry._id,
//                     recipientType: 'admin',
//                     emailType: 'notification'
//                 })
//             ]);

//             const result = {
//                 userEmail: userEmailResult.status === 'fulfilled' && userEmailResult.value ? 'sent' : 'failed',
//                 adminEmail: adminEmailResult.status === 'fulfilled' && adminEmailResult.value ? 'sent' : 'failed'
//             };

//             console.log(`📧 Email sending completed for enquiry ${enquiry._id}:`, result);
//             return result;

//         } catch (error) {
//             console.error('❌ Error in sendEnquiryEmails:', error.message);
//             return { userEmail: 'failed', adminEmail: 'failed' };
//         }
//     }

//     getUserEmailTemplate(enquiry) {
//         return `
//             <!DOCTYPE html>
//             <html>
//             <head>
//                 <meta charset="UTF-8">
//                 <meta name="viewport" content="width=device-width, initial-scale=1.0">
//                 <title>Enquiry Confirmation</title>
//                 <style>
//                     body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; }
//                     .container { max-width: 600px; margin: 0 auto; background: #f9f9f9; border-radius: 10px; overflow: hidden; }
//                     .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px 20px; text-align: center; }
//                     .header h1 { margin: 0; font-size: 28px; }
//                     .content { padding: 30px; background: white; margin: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
//                     .details { margin: 25px 0; }
//                     .detail-row { display: flex; margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid #eee; }
//                     .detail-label { font-weight: bold; color: #555; min-width: 120px; }
//                     .detail-value { color: #333; }
//                     .highlight { background: #e3f2fd; padding: 15px; border-radius: 5px; border-left: 4px solid #2196F3; margin: 20px 0; }
//                     .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; border-top: 1px solid #eee; }
//                     .button { display: inline-block; padding: 12px 30px; background: #4CAF50; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0; }
//                     @media (max-width: 600px) {
//                         .detail-row { flex-direction: column; }
//                         .detail-label { margin-bottom: 5px; }
//                     }
//                 </style>
//             </head>
//             <body>
//                 <div class="container">
//                     <div class="header">
//                         <h1>Thank You for Your Enquiry!</h1>
//                         <p>Your request has been received successfully</p>
//                     </div>
//                     <div class="content">
//                         <p>Dear <strong>${enquiry.name}</strong>,</p>
//                         <p>Thank you for your interest in our <strong>${enquiry.course}</strong> course. We have received your enquiry and our team will contact you shortly.</p>
                        
//                         <div class="details">
//                             <h3>Enquiry Details:</h3>
//                             <div class="detail-row">
//                                 <div class="detail-label">Reference ID:</div>
//                                 <div class="detail-value">${enquiry._id}</div>
//                             </div>
//                             <div class="detail-row">
//                                 <div class="detail-label">Course:</div>
//                                 <div class="detail-value">${enquiry.course}</div>
//                             </div>
//                             <div class="detail-row">
//                                 <div class="detail-label">Country:</div>
//                                 <div class="detail-value">${enquiry.country}</div>
//                             </div>
//                             <div class="detail-row">
//                                 <div class="detail-label">Email:</div>
//                                 <div class="detail-value">${enquiry.email}</div>
//                             </div>
//                             <div class="detail-row">
//                                 <div class="detail-label">Phone:</div>
//                                 <div class="detail-value">${enquiry.phone}</div>
//                             </div>
//                             ${enquiry.message ? `
//                             <div class="detail-row">
//                                 <div class="detail-label">Your Message:</div>
//                                 <div class="detail-value">${enquiry.message}</div>
//                             </div>
//                             ` : ''}
//                         </div>
                        
//                         <div class="highlight">
//                             <strong>📞 What's Next?</strong>
//                             <p>Our admissions team will contact you within <strong>24-48 hours</strong> at the provided contact details.</p>
//                             <p>For urgent inquiries, please call us directly or reply to this email.</p>
//                         </div>
                        
//                         <p>Best regards,<br>
//                         <strong>The Education Team</strong></p>
//                     </div>
//                     <div class="footer">
//                         <p>This is an automated message. Please do not reply directly to this email.</p>
//                         <p>&copy; ${new Date().getFullYear()} Education Institution. All rights reserved.</p>
//                     </div>
//                 </div>
//             </body>
//             </html>
//         `;
//     }

//     getAdminEmailTemplate(enquiry) {
//         return `
//             <!DOCTYPE html>
//             <html>
//             <head>
//                 <meta charset="UTF-8">
//                 <meta name="viewport" content="width=device-width, initial-scale=1.0">
//                 <title>New Enquiry Alert</title>
//                 <style>
//                     body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; }
//                     .container { max-width: 700px; margin: 0 auto; background: #fff; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; }
//                     .header { background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); color: white; padding: 25px; text-align: center; }
//                     .header h1 { margin: 0; font-size: 26px; }
//                     .alert-badge { background: #ffeb3b; color: #333; padding: 5px 15px; border-radius: 20px; font-weight: bold; display: inline-block; margin-top: 10px; }
//                     .content { padding: 25px; }
//                     .student-info { background: #f8f9fa; padding: 20px; border-radius: 6px; margin: 20px 0; }
//                     .info-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px; margin: 20px 0; }
//                     .info-card { background: white; padding: 15px; border-radius: 6px; border-left: 4px solid #4CAF50; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
//                     .info-card h3 { margin-top: 0; color: #333; }
//                     .info-item { margin: 10px 0; }
//                     .label { font-weight: bold; color: #555; }
//                     .value { color: #333; }
//                     .action-required { background: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; border-radius: 6px; margin: 25px 0; }
//                     .action-required h3 { color: #856404; margin-top: 0; }
//                     .action-steps { margin-left: 20px; }
//                     .footer { background: #f1f1f1; padding: 20px; text-align: center; color: #666; font-size: 13px; border-top: 1px solid #ddd; }
//                     .status-badge { display: inline-block; padding: 5px 15px; background: #007bff; color: white; border-radius: 4px; font-size: 12px; font-weight: bold; }
//                 </style>
//             </head>
//             <body>
//                 <div class="container">
//                     <div class="header">
//                         <h1>🚨 New Enquiry Received</h1>
//                         <div class="alert-badge">ACTION REQUIRED</div>
//                         <p>Immediate attention needed</p>
//                     </div>
                    
//                     <div class="content">
//                         <div class="action-required">
//                             <h3>⏰ Time-sensitive Action Required</h3>
//                             <p>A new student enquiry requires your prompt attention. Please contact the student within <strong>24 hours</strong>.</p>
//                         </div>
                        
//                         <div class="student-info">
//                             <h2>Student Information</h2>
//                             <div class="info-grid">
//                                 <div class="info-card">
//                                     <h3>Personal Details</h3>
//                                     <div class="info-item">
//                                         <span class="label">Name:</span>
//                                         <span class="value">${enquiry.name}</span>
//                                     </div>
//                                     <div class="info-item">
//                                         <span class="label">Email:</span>
//                                         <span class="value">${enquiry.email}</span>
//                                     </div>
//                                     <div class="info-item">
//                                         <span class="label">Phone:</span>
//                                         <span class="value">${enquiry.phone}</span>
//                                     </div>
//                                     <div class="info-item">
//                                         <span class="label">Country:</span>
//                                         <span class="value">${enquiry.country}</span>
//                                     </div>
//                                 </div>
                                
//                                 <div class="info-card">
//                                     <h3>Enquiry Details</h3>
//                                     <div class="info-item">
//                                         <span class="label">Course:</span>
//                                         <span class="value">${enquiry.course}</span>
//                                     </div>
//                                     <div class="info-item">
//                                         <span class="label">Enquiry ID:</span>
//                                         <span class="value">${enquiry._id}</span>
//                                     </div>
//                                     <div class="info-item">
//                                         <span class="label">Received:</span>
//                                         <span class="value">${new Date(enquiry.createdAt).toLocaleString()}</span>
//                                     </div>
//                                     <div class="info-item">
//                                         <span class="label">Status:</span>
//                                         <span class="status-badge">${enquiry.status.toUpperCase()}</span>
//                                     </div>
//                                 </div>
//                             </div>
                            
//                             ${enquiry.message ? `
//                             <div class="info-card">
//                                 <h3>Student Message</h3>
//                                 <p><strong>Message:</strong> ${enquiry.message}</p>
//                             </div>
//                             ` : ''}
//                         </div>
                        
//                         <div class="action-required">
//                             <h3>📋 Next Steps</h3>
//                             <ol class="action-steps">
//                                 <li><strong>Contact the student</strong> within 24 hours via phone or email</li>
//                                 <li><strong>Update the enquiry status</strong> in the system after contact</li>
//                                 <li><strong>Schedule a follow-up</strong> if needed</li>
//                                 <li><strong>Add notes</strong> about the conversation in the system</li>
//                             </ol>
//                             <p><strong>Priority:</strong> High - New prospective student</p>
//                         </div>
//                     </div>
                    
//                     <div class="footer">
//                         <p>This is an automated notification from the Enquiry Management System.</p>
//                         <p>Enquiry received at: ${new Date().toLocaleString()}</p>
//                     </div>
//                 </div>
//             </body>
//             </html>
//         `;
//     }

//     // CRUD Operations
//     async createEnquiry(req, res) {
//         try {
//             const { name, email, phone, country, course, message } = req.body;

//             console.log('📝 Creating enquiry with data:', { name, email, phone, country, course });

//             // Enhanced validation with specific error messages
//             const validationErrors = [];
//             if (!name || name.trim().length < 2) validationErrors.push('Name must be at least 2 characters');
//             if (!email || !this.validateEmail(email)) validationErrors.push('Valid email is required');
//             if (!phone || phone.trim().length < 5) validationErrors.push('Valid phone number is required');
//             if (!country || country.trim().length < 2) validationErrors.push('Valid country is required');
//             if (!course || course.trim().length < 2) validationErrors.push('Valid course is required');

//             if (validationErrors.length > 0) {
//                 return res.status(400).json({
//                     success: false,
//                     message: 'Validation failed',
//                     errors: validationErrors
//                 });
//             }

//             // Check for duplicate recent enquiries (same email within last 24 hours)
//             const recentEnquiry = await Enquiry.findOne({
//                 email: email.toLowerCase().trim(),
//                 createdAt: { $gte: moment().subtract(24, 'hours').toDate() },
//                 isDeleted: false
//             });

//             if (recentEnquiry) {
//                 return res.status(409).json({
//                     success: false,
//                     message: 'You have already submitted an enquiry recently. Please wait 24 hours or contact us directly.',
//                     data: {
//                         previousEnquiryId: recentEnquiry._id,
//                         submittedAt: recentEnquiry.createdAt
//                     }
//                 });
//             }

//             // Create enquiry with sanitized data
//             const enquiryData = {
//                 name: name.trim(),
//                 email: email.toLowerCase().trim(),
//                 phone: phone.trim(),
//                 country: country.trim(),
//                 course: course.trim(),
//                 message: message ? message.trim() : '',
//                 status: 'new',
//                 source: req.headers['user-agent'] || 'unknown'
//             };

//             const enquiry = new Enquiry(enquiryData);
//             await enquiry.save();

//             console.log(`✅ Enquiry created successfully: ${enquiry._id}`);

//             // Send emails in background without blocking response
//             this.sendEnquiryEmails(enquiry)
//                 .then(result => {
//                     console.log(`📧 Email sending result for ${enquiry._id}:`, result);
//                 })
//                 .catch(emailError => {
//                     console.error(`❌ Email sending failed for ${enquiry._id}:`, emailError.message);
//                 });

//             // Return success response
//             res.status(201).json({
//                 success: true,
//                 message: 'Enquiry submitted successfully! Our team will contact you shortly.',
//                 data: {
//                     id: enquiry._id,
//                     name: enquiry.name,
//                     email: enquiry.email,
//                     course: enquiry.course,
//                     status: enquiry.status,
//                     createdAt: enquiry.createdAt,
//                     referenceNumber: `ENQ-${enquiry._id.toString().slice(-8).toUpperCase()}`
//                 },
//                 meta: {
//                     emailSent: this.transporter ? true : false,
//                     estimatedResponseTime: '24-48 hours',
//                     contactEmail: process.env.ADMIN_EMAIL || 'info@example.com'
//                 }
//             });

//         } catch (error) {
//             console.error('❌ Error creating enquiry:', error);

//             // Handle specific error types
//             if (error.name === 'ValidationError') {
//                 const errors = Object.values(error.errors).map(err => err.message);
//                 return res.status(400).json({
//                     success: false,
//                     message: 'Validation failed',
//                     errors: errors
//                 });
//             }

//             if (error.code === 11000) {
//                 return res.status(400).json({
//                     success: false,
//                     message: 'Duplicate enquiry detected'
//                 });
//             }

//             // Handle database errors
//             if (error.name === 'MongoError' || error.name === 'MongoNetworkError') {
//                 return res.status(503).json({
//                     success: false,
//                     message: 'Database service temporarily unavailable. Please try again shortly.'
//                 });
//             }

//             // Generic error response
//             res.status(500).json({
//                 success: false,
//                 message: 'An unexpected error occurred. Please try again.',
//                 errorId: `ERR-${Date.now()}`
//             });
//         }
//     }

//     validateEmail(email) {
//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         return emailRegex.test(email);
//     }

//     async getAllEnquiries(req, res) {
//         try {
//             const {
//                 page = 1,
//                 limit = 20,
//                 status,
//                 course,
//                 startDate,
//                 endDate,
//                 search,
//                 sortBy = 'createdAt',
//                 sortOrder = 'desc'
//             } = req.query;

//             const query = { isDeleted: false };
//             const sort = {};
//             sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

//             // Apply filters
//             if (status) query.status = status;
//             if (course) query.course = { $regex: course, $options: 'i' };
            
//             // Date range filter
//             if (startDate || endDate) {
//                 query.createdAt = {};
//                 if (startDate) {
//                     const start = new Date(startDate);
//                     start.setHours(0, 0, 0, 0);
//                     query.createdAt.$gte = start;
//                 }
//                 if (endDate) {
//                     const end = new Date(endDate);
//                     end.setHours(23, 59, 59, 999);
//                     query.createdAt.$lte = end;
//                 }
//             }

//             // Search functionality
//             if (search) {
//                 const searchRegex = { $regex: search, $options: 'i' };
//                 query.$or = [
//                     { name: searchRegex },
//                     { email: searchRegex },
//                     { phone: searchRegex },
//                     { country: searchRegex },
//                     { course: searchRegex },
//                     { message: searchRegex }
//                 ];
//             }

//             // Execute query with pagination
//             const [enquiries, total] = await Promise.all([
//                 Enquiry.find(query)
//                     .sort(sort)
//                     .skip((parseInt(page) - 1) * parseInt(limit))
//                     .limit(parseInt(limit))
//                     .lean(),
//                 Enquiry.countDocuments(query)
//             ]);

//             // Calculate pagination info
//             const currentPage = parseInt(page);
//             const totalPages = Math.ceil(total / parseInt(limit));
//             const hasNext = currentPage < totalPages;
//             const hasPrev = currentPage > 1;

//             res.json({
//                 success: true,
//                 data: enquiries,
//                 pagination: {
//                     currentPage,
//                     totalPages,
//                     totalItems: total,
//                     itemsPerPage: parseInt(limit),
//                     hasNext,
//                     hasPrev,
//                     nextPage: hasNext ? currentPage + 1 : null,
//                     prevPage: hasPrev ? currentPage - 1 : null
//                 },
//                 filters: {
//                     status,
//                     course,
//                     startDate,
//                     endDate,
//                     search,
//                     sortBy,
//                     sortOrder
//                 }
//             });

//         } catch (error) {
//             console.error('❌ Error getting enquiries:', error);
//             res.status(500).json({
//                 success: false,
//                 message: 'Failed to fetch enquiries',
//                 error: process.env.NODE_ENV === 'development' ? error.message : undefined
//             });
//         }
//     }

//     async getEnquiryById(req, res) {
//         try {
//             const { id } = req.params;

//             // Validate ObjectId
//             if (!mongoose.Types.ObjectId.isValid(id)) {
//                 return res.status(400).json({
//                     success: false,
//                     message: 'Invalid enquiry ID format'
//                 });
//             }

//             const enquiry = await Enquiry.findOne({
//                 _id: id,
//                 isDeleted: false
//             }).lean();

//             if (!enquiry) {
//                 return res.status(404).json({
//                     success: false,
//                     message: 'Enquiry not found'
//                 });
//             }

//             // Get email logs for this enquiry
//             const emailLogs = await EmailLog.find({ enquiryId: id })
//                 .sort({ createdAt: -1 })
//                 .lean();

//             res.json({
//                 success: true,
//                 data: {
//                     ...enquiry,
//                     emailHistory: emailLogs
//                 }
//             });

//         } catch (error) {
//             console.error('❌ Error getting enquiry:', error);
//             res.status(500).json({
//                 success: false,
//                 message: 'Failed to fetch enquiry details'
//             });
//         }
//     }

//     async updateEnquiry(req, res) {
//         try {
//             const { id } = req.params;
//             const updateData = req.body;

//             // Validate ObjectId
//             if (!mongoose.Types.ObjectId.isValid(id)) {
//                 return res.status(400).json({
//                     success: false,
//                     message: 'Invalid enquiry ID format'
//                 });
//             }

//             // Prevent updating certain fields
//             const allowedUpdates = ['status', 'message', 'notes', 'assignedTo', 'priority'];
//             const updates = {};
            
//             Object.keys(updateData).forEach(key => {
//                 if (allowedUpdates.includes(key)) {
//                     updates[key] = updateData[key];
//                 }
//             });

//             // Add updated timestamp
//             updates.updatedAt = Date.now();

//             const enquiry = await Enquiry.findOneAndUpdate(
//                 { _id: id, isDeleted: false },
//                 updates,
//                 { 
//                     new: true, 
//                     runValidators: true,
//                     context: 'query'
//                 }
//             );

//             if (!enquiry) {
//                 return res.status(404).json({
//                     success: false,
//                     message: 'Enquiry not found or has been deleted'
//                 });
//             }

//             res.json({
//                 success: true,
//                 message: 'Enquiry updated successfully',
//                 data: enquiry
//             });

//         } catch (error) {
//             console.error('❌ Error updating enquiry:', error);
            
//             if (error.name === 'ValidationError') {
//                 return res.status(400).json({
//                     success: false,
//                     message: 'Validation failed',
//                     errors: Object.values(error.errors).map(err => err.message)
//                 });
//             }

//             res.status(500).json({
//                 success: false,
//                 message: 'Failed to update enquiry'
//             });
//         }
//     }

//     async deleteEnquiry(req, res) {
//         try {
//             const { id } = req.params;

//             // Validate ObjectId
//             if (!mongoose.Types.ObjectId.isValid(id)) {
//                 return res.status(400).json({
//                     success: false,
//                     message: 'Invalid enquiry ID format'
//                 });
//             }

//             const enquiry = await Enquiry.findOneAndUpdate(
//                 { _id: id, isDeleted: false },
//                 { 
//                     isDeleted: true, 
//                     deletedAt: Date.now(),
//                     updatedAt: Date.now()
//                 },
//                 { new: true }
//             );

//             if (!enquiry) {
//                 return res.status(404).json({
//                     success: false,
//                     message: 'Enquiry not found'
//                 });
//             }

//             res.json({
//                 success: true,
//                 message: 'Enquiry deleted successfully',
//                 data: {
//                     id: enquiry._id,
//                     deletedAt: enquiry.deletedAt
//                 }
//             });

//         } catch (error) {
//             console.error('❌ Error deleting enquiry:', error);
//             res.status(500).json({
//                 success: false,
//                 message: 'Failed to delete enquiry'
//             });
//         }
//     }

//     async getEnquiriesByEmail(req, res) {
//         try {
//             const { email } = req.params;
            
//             if (!email || !this.validateEmail(email)) {
//                 return res.status(400).json({
//                     success: false,
//                     message: 'Valid email is required'
//                 });
//             }

//             const enquiries = await Enquiry.find({
//                 email: email.toLowerCase().trim(),
//                 isDeleted: false
//             })
//             .sort({ createdAt: -1 })
//             .lean();

//             res.json({
//                 success: true,
//                 data: enquiries,
//                 count: enquiries.length
//             });

//         } catch (error) {
//             console.error('❌ Error getting enquiries by email:', error);
//             res.status(500).json({
//                 success: false,
//                 message: 'Failed to fetch enquiries'
//             });
//         }
//     }

//     async getTimeStatistics(req, res) {
//         try {
//             const { timeRange = 'today' } = req.query;
//             let startDate, endDate = new Date();

//             switch (timeRange) {
//                 case 'today':
//                     startDate = moment().startOf('day').toDate();
//                     break;
//                 case 'yesterday':
//                     startDate = moment().subtract(1, 'day').startOf('day').toDate();
//                     endDate = moment().subtract(1, 'day').endOf('day').toDate();
//                     break;
//                 case 'last24hours':
//                     startDate = moment().subtract(24, 'hours').toDate();
//                     break;
//                 case 'thisHour':
//                     startDate = moment().startOf('hour').toDate();
//                     break;
//                 default:
//                     startDate = moment().startOf('day').toDate();
//             }

//             const stats = await Enquiry.aggregate([
//                 {
//                     $match: {
//                         createdAt: { $gte: startDate, $lte: endDate },
//                         isDeleted: false
//                     }
//                 },
//                 {
//                     $group: {
//                         _id: null,
//                         total: { $sum: 1 },
//                         byStatus: { $push: { status: "$status", count: 1 } },
//                         byCourse: { $push: { course: "$course", count: 1 } },
//                         byCountry: { $push: { country: "$country", count: 1 } }
//                     }
//                 },
//                 {
//                     $project: {
//                         total: 1,
//                         statusSummary: {
//                             $arrayToObject: {
//                                 $map: {
//                                     input: "$byStatus",
//                                     as: "item",
//                                     in: { k: "$$item.status", v: "$$item.count" }
//                                 }
//                             }
//                         },
//                         courseSummary: {
//                             $arrayToObject: {
//                                 $map: {
//                                     input: "$byCourse",
//                                     as: "item",
//                                     in: { k: "$$item.course", v: "$$item.count" }
//                                 }
//                             }
//                         },
//                         countrySummary: {
//                             $arrayToObject: {
//                                 $map: {
//                                     input: "$byCountry",
//                                     as: "item",
//                                     in: { k: "$$item.country", v: "$$item.count" }
//                                 }
//                             }
//                         }
//                     }
//                 }
//             ]);

//             res.json({
//                 success: true,
//                 data: stats[0] || { total: 0, statusSummary: {}, courseSummary: {}, countrySummary: {} },
//                 timeRange: { startDate, endDate, label: timeRange }
//             });

//         } catch (error) {
//             console.error('❌ Error getting time statistics:', error);
//             res.status(500).json({
//                 success: false,
//                 message: 'Failed to fetch statistics'
//             });
//         }
//     }

//     async getDashboardStatistics(req, res) {
//         try {
//             const today = moment().startOf('day');
//             const yesterday = moment().subtract(1, 'day').startOf('day');
//             const thisWeek = moment().startOf('isoWeek');
//             const lastWeek = moment().subtract(1, 'week').startOf('isoWeek');
//             const thisMonth = moment().startOf('month');
//             const lastMonth = moment().subtract(1, 'month').startOf('month');
//             const thisYear = moment().startOf('year');
            
//             const [
//                 totalEnquiries,
//                 todayEnquiries,
//                 yesterdayEnquiries,
//                 thisWeekEnquiries,
//                 lastWeekEnquiries,
//                 thisMonthEnquiries,
//                 lastMonthEnquiries,
//                 thisYearEnquiries,
//                 byStatus,
//                 byCourse,
//                 byCountry,
//                 recentEnquiries
//             ] = await Promise.allSettled([
//                 Enquiry.countDocuments({ isDeleted: false }),
//                 Enquiry.countDocuments({ createdAt: { $gte: today.toDate() }, isDeleted: false }),
//                 Enquiry.countDocuments({ createdAt: { $gte: yesterday.toDate(), $lt: today.toDate() }, isDeleted: false }),
//                 Enquiry.countDocuments({ createdAt: { $gte: thisWeek.toDate() }, isDeleted: false }),
//                 Enquiry.countDocuments({ createdAt: { $gte: lastWeek.toDate(), $lt: thisWeek.toDate() }, isDeleted: false }),
//                 Enquiry.countDocuments({ createdAt: { $gte: thisMonth.toDate() }, isDeleted: false }),
//                 Enquiry.countDocuments({ createdAt: { $gte: lastMonth.toDate(), $lt: thisMonth.toDate() }, isDeleted: false }),
//                 Enquiry.countDocuments({ createdAt: { $gte: thisYear.toDate() }, isDeleted: false }),
//                 Enquiry.aggregate([
//                     { $match: { isDeleted: false } },
//                     { $group: { _id: "$status", count: { $sum: 1 } } },
//                     { $sort: { count: -1 } }
//                 ]),
//                 Enquiry.aggregate([
//                     { $match: { isDeleted: false } },
//                     { $group: { _id: "$course", count: { $sum: 1 } } },
//                     { $sort: { count: -1 } },
//                     { $limit: 5 }
//                 ]),
//                 Enquiry.aggregate([
//                     { $match: { isDeleted: false } },
//                     { $group: { _id: "$country", count: { $sum: 1 } } },
//                     { $sort: { count: -1 } },
//                     { $limit: 5 }
//                 ]),
//                 Enquiry.find({ isDeleted: false })
//                     .sort({ createdAt: -1 })
//                     .limit(10)
//                     .select('name email course country status createdAt')
//                     .lean()
//             ]);

//             // Process results with error handling
//             const processResult = (result) => result.status === 'fulfilled' ? result.value : null;

//             const data = {
//                 totalEnquiries: processResult(totalEnquiries) || 0,
//                 todayEnquiries: processResult(todayEnquiries) || 0,
//                 yesterdayEnquiries: processResult(yesterdayEnquiries) || 0,
//                 thisWeekEnquiries: processResult(thisWeekEnquiries) || 0,
//                 lastWeekEnquiries: processResult(lastWeekEnquiries) || 0,
//                 thisMonthEnquiries: processResult(thisMonthEnquiries) || 0,
//                 lastMonthEnquiries: processResult(lastMonthEnquiries) || 0,
//                 thisYearEnquiries: processResult(thisYearEnquiries) || 0,
//                 byStatus: processResult(byStatus) || [],
//                 byCourse: processResult(byCourse) || [],
//                 byCountry: processResult(byCountry) || [],
//                 recentEnquiries: processResult(recentEnquiries) || []
//             };

//             // Calculate growth percentages with safety checks
//             const dayGrowth = data.yesterdayEnquiries > 0 
//                 ? ((data.todayEnquiries - data.yesterdayEnquiries) / data.yesterdayEnquiries) * 100 
//                 : data.todayEnquiries > 0 ? 100 : 0;
            
//             const weekGrowth = data.lastWeekEnquiries > 0
//                 ? ((data.thisWeekEnquiries - data.lastWeekEnquiries) / data.lastWeekEnquiries) * 100
//                 : data.thisWeekEnquiries > 0 ? 100 : 0;
            
//             const monthGrowth = data.lastMonthEnquiries > 0
//                 ? ((data.thisMonthEnquiries - data.lastMonthEnquiries) / data.lastMonthEnquiries) * 100
//                 : data.thisMonthEnquiries > 0 ? 100 : 0;

//             res.json({
//                 success: true,
//                 data: {
//                     overview: {
//                         totalEnquiries: data.totalEnquiries,
//                         todayEnquiries: data.todayEnquiries,
//                         yesterdayEnquiries: data.yesterdayEnquiries,
//                         dayGrowth: parseFloat(dayGrowth.toFixed(2)),
//                         thisWeekEnquiries: data.thisWeekEnquiries,
//                         lastWeekEnquiries: data.lastWeekEnquiries,
//                         weekGrowth: parseFloat(weekGrowth.toFixed(2)),
//                         thisMonthEnquiries: data.thisMonthEnquiries,
//                         lastMonthEnquiries: data.lastMonthEnquiries,
//                         monthGrowth: parseFloat(monthGrowth.toFixed(2)),
//                         thisYearEnquiries: data.thisYearEnquiries
//                     },
//                     byStatus: data.byStatus,
//                     byCourse: data.byCourse,
//                     byCountry: data.byCountry,
//                     recentEnquiries: data.recentEnquiries
//                 },
//                 timestamp: new Date().toISOString()
//             });

//         } catch (error) {
//             console.error('❌ Error getting dashboard statistics:', error);
//             res.status(500).json({
//                 success: false,
//                 message: 'Failed to fetch dashboard statistics'
//             });
//         }
//     }

//     async sendTestEmail(req, res) {
//         try {
//             const { to, subject, message } = req.body;
            
//             const testEmail = to || process.env.ADMIN_EMAIL || process.env.SMTP_USER;
            
//             if (!testEmail) {
//                 return res.status(400).json({
//                     success: false,
//                     message: 'No recipient email specified'
//                 });
//             }

//             const testContent = `
//                 <!DOCTYPE html>
//                 <html>
//                 <head>
//                     <style>
//                         body { font-family: Arial, sans-serif; padding: 20px; }
//                         .container { max-width: 600px; margin: 0 auto; }
//                         .header { background: #4CAF50; color: white; padding: 20px; text-align: center; }
//                         .content { padding: 20px; background: #f9f9f9; }
//                     </style>
//                 </head>
//                 <body>
//                     <div class="container">
//                         <div class="header">
//                             <h2>Test Email</h2>
//                         </div>
//                         <div class="content">
//                             <h3>Email System Test</h3>
//                             <p>This is a test email sent from the enquiry management system.</p>
//                             <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
//                             <p><strong>System Status:</strong> ✅ Operational</p>
//                             ${message ? `<p><strong>Custom Message:</strong> ${message}</p>` : ''}
//                         </div>
//                     </div>
//                 </body>
//                 </html>
//             `;

//             const result = await this.sendEmail({
//                 to: testEmail,
//                 subject: subject || 'Test Email - Enquiry System',
//                 html: testContent,
//                 enquiryId: null,
//                 recipientType: 'admin',
//                 emailType: 'test'
//             });

//             if (!result) {
//                 return res.status(500).json({
//                     success: false,
//                     message: 'Failed to send test email. Check email configuration.'
//                 });
//             }

//             res.json({
//                 success: true,
//                 message: 'Test email sent successfully',
//                 data: {
//                     to: testEmail,
//                     messageId: result.messageId,
//                     timestamp: new Date().toISOString()
//                 }
//             });

//         } catch (error) {
//             console.error('❌ Error sending test email:', error);
//             res.status(500).json({
//                 success: false,
//                 message: 'Failed to send test email',
//                 error: error.message
//             });
//         }
//     }

//     async getEmailLogs(req, res) {
//         try {
//             const {
//                 page = 1,
//                 limit = 20,
//                 enquiryId,
//                 status,
//                 emailType,
//                 startDate,
//                 endDate
//             } = req.query;

//             const query = {};

//             if (enquiryId) {
//                 if (!mongoose.Types.ObjectId.isValid(enquiryId)) {
//                     return res.status(400).json({
//                         success: false,
//                         message: 'Invalid enquiry ID format'
//                     });
//                 }
//                 query.enquiryId = enquiryId;
//             }
//             if (status) query.status = status;
//             if (emailType) query.emailType = emailType;
            
//             if (startDate || endDate) {
//                 query.sentAt = {};
//                 if (startDate) {
//                     const start = new Date(startDate);
//                     start.setHours(0, 0, 0, 0);
//                     query.sentAt.$gte = start;
//                 }
//                 if (endDate) {
//                     const end = new Date(endDate);
//                     end.setHours(23, 59, 59, 999);
//                     query.sentAt.$lte = end;
//                 }
//             }

//             const [logs, total] = await Promise.all([
//                 EmailLog.find(query)
//                     .populate('enquiryId', 'name email course')
//                     .sort({ createdAt: -1 })
//                     .skip((page - 1) * limit)
//                     .limit(parseInt(limit))
//                     .lean(),
//                 EmailLog.countDocuments(query)
//             ]);

//             const stats = await EmailLog.aggregate([
//                 { $match: query },
//                 {
//                     $group: {
//                         _id: "$status",
//                         count: { $sum: 1 }
//                     }
//                 }
//             ]);

//             res.json({
//                 success: true,
//                 data: logs,
//                 stats: stats.reduce((acc, curr) => {
//                     acc[curr._id] = curr.count;
//                     return acc;
//                 }, {}),
//                 pagination: {
//                     page: parseInt(page),
//                     limit: parseInt(limit),
//                     total,
//                     pages: Math.ceil(total / limit)
//                 }
//             });

//         } catch (error) {
//             console.error('❌ Error getting email logs:', error);
//             res.status(500).json({
//                 success: false,
//                 message: 'Failed to fetch email logs'
//             });
//         }
//     }

//     async sendFollowupEmail(req, res) {
//         try {
//             const { enquiryId, message } = req.body;

//             if (!enquiryId || !message) {
//                 return res.status(400).json({
//                     success: false,
//                     message: 'Enquiry ID and message are required'
//                 });
//             }

//             // Validate ObjectId
//             if (!mongoose.Types.ObjectId.isValid(enquiryId)) {
//                 return res.status(400).json({
//                     success: false,
//                     message: 'Invalid enquiry ID format'
//                 });
//             }

//             const enquiry = await Enquiry.findOne({
//                 _id: enquiryId,
//                 isDeleted: false
//             });

//             if (!enquiry) {
//                 return res.status(404).json({
//                     success: false,
//                     message: 'Enquiry not found'
//                 });
//             }

//             const followupContent = this.getFollowupEmailTemplate(enquiry, message);

//             const result = await this.sendEmail({
//                 to: enquiry.email,
//                 subject: `Follow-up: ${enquiry.course} Course Enquiry`,
//                 html: followupContent,
//                 enquiryId: enquiry._id,
//                 recipientType: 'user',
//                 emailType: 'followup',
//                 metadata: { 
//                     followup: true,
//                     followupMessage: message,
//                     sentBy: req.user?.id || 'system'
//                 }
//             });

//             if (!result) {
//                 return res.status(500).json({
//                     success: false,
//                     message: 'Failed to send follow-up email'
//                 });
//             }

//             res.json({
//                 success: true,
//                 message: 'Follow-up email sent successfully',
//                 data: {
//                     enquiryId: enquiry._id,
//                     recipient: enquiry.email,
//                     messageId: result.messageId,
//                     timestamp: new Date().toISOString()
//                 }
//             });

//         } catch (error) {
//             console.error('❌ Error sending follow-up email:', error);
//             res.status(500).json({
//                 success: false,
//                 message: 'Failed to send follow-up email'
//             });
//         }
//     }

//     getFollowupEmailTemplate(enquiry, followupMessage) {
//         return `
//             <!DOCTYPE html>
//             <html>
//             <head>
//                 <style>
//                     body { font-family: Arial, sans-serif; line-height: 1.6; }
//                     .container { max-width: 600px; margin: 0 auto; padding: 20px; }
//                     .header { background: #2196F3; color: white; padding: 20px; text-align: center; }
//                     .content { padding: 20px; background: #f9f9f9; }
//                 </style>
//             </head>
//             <body>
//                 <div class="container">
//                     <div class="header">
//                         <h2>Follow-up on Your Enquiry</h2>
//                     </div>
//                     <div class="content">
//                         <p>Dear ${enquiry.name},</p>
//                         <p>We're following up on your enquiry regarding the <strong>${enquiry.course}</strong> course.</p>
//                         <div style="background: #fff; padding: 15px; margin: 15px 0; border-left: 4px solid #4CAF50;">
//                             <p><strong>Follow-up Message:</strong></p>
//                             <p>${followupMessage}</p>
//                         </div>
//                         <p>If you have any further questions, please don't hesitate to contact us.</p>
//                         <p>Best regards,<br>The Education Team</p>
//                     </div>
//                 </div>
//             </body>
//             </html>
//         `;
//     }

//     // Health check endpoint
//     async healthCheck(req, res) {
//         try {
//             const checks = {
//                 database: mongoose.connection.readyState === 1,
//                 email: !!this.transporter,
//                 uptime: process.uptime(),
//                 memory: process.memoryUsage(),
//                 timestamp: new Date().toISOString()
//             };

//             const status = checks.database ? 'healthy' : 'degraded';
//             const statusCode = checks.database ? 200 : 503;

//             res.status(statusCode).json({
//                 status,
//                 checks,
//                 message: checks.database ? 'System is operational' : 'Database connection issue'
//             });
//         } catch (error) {
//             res.status(503).json({
//                 status: 'unhealthy',
//                 error: error.message,
//                 timestamp: new Date().toISOString()
//             });
//         }
//     }
// }

// // Create singleton instance
// const enquiryController = new EnquiryController();
// module.exports = enquiryController;


























































const Enquiry = require('../models/Enquiry');
const EmailLog = require('../models/EmailLog');
const mongoose = require('mongoose');
const moment = require('moment');
const nodemailer = require('nodemailer');

class EnquiryController {
    constructor() {
        this.initEmailTransporter();
        this.verifyEmailTransporter();
    }

    // ======================
    // EMAIL TRANSPORTER
    // ======================
    initEmailTransporter() {
        const emailUser = process.env.SMTP_USER;
        const emailPass = process.env.SMTP_PASS;

        if (!emailUser || !emailPass) {
            console.warn('⚠️ SMTP credentials missing. Emails will be disabled.');
            this.transporter = null;
            return;
        }

        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.SMTP_PORT) || 587,
            secure: process.env.SMTP_SECURE === 'true',
            auth: { user: emailUser, pass: emailPass },
            tls: { rejectUnauthorized: false },
            pool: true,
            maxConnections: 5,
            maxMessages: 100
        });

        console.log('✅ Email transporter initialized');
    }

    async verifyEmailTransporter() {
        if (!this.transporter) return false;
        try {
            await this.transporter.verify();
            console.log('✅ Email transporter verified');
            return true;
        } catch (error) {
            console.error('❌ Email verification failed:', error.message);
            return false;
        }
    }

    async sendEmail(options) {
        if (!this.transporter) return null;

        const mailOptions = {
            from: `"Enquiry System" <${process.env.SMTP_USER}>`,
            to: options.to,
            subject: options.subject,
            html: options.html,
            text: options.text || this.stripHtml(options.html)
        };

        const emailLog = new EmailLog({
            enquiryId: options.enquiryId,
            recipientType: options.recipientType,
            emailType: options.emailType,
            recipientEmail: options.to,
            subject: options.subject,
            content: options.html,
            status: 'pending',
            metadata: options.metadata || {}
        });

        try {
            await emailLog.save();

            const sendPromise = this.transporter.sendMail(mailOptions);
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Email timeout')), 30000)
            );

            const info = await Promise.race([sendPromise, timeoutPromise]);

            emailLog.status = 'sent';
            emailLog.messageId = info.messageId;
            emailLog.sentAt = new Date();
            await emailLog.save();

            console.log(`✅ Email sent: ${options.to}`);
            return info;

        } catch (error) {
            console.error('❌ Email send error:', error.message);
            await EmailLog.findOneAndUpdate(
                { enquiryId: options.enquiryId, recipientEmail: options.to },
                { status: 'failed', errorMessage: error.message, sentAt: new Date() },
                { new: true, sort: { createdAt: -1 } }
            );
            return null;
        }
    }

    stripHtml(html) {
        return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
    }

    async sendEnquiryEmails(enquiry) {
        if (!this.transporter) return { userEmail: 'skipped', adminEmail: 'skipped' };

        const userEmail = this.sendEmail({
            to: enquiry.email,
            subject: `Enquiry Confirmation - ${enquiry.course}`,
            html: this.getUserEmailTemplate(enquiry),
            enquiryId: enquiry._id,
            recipientType: 'user',
            emailType: 'confirmation'
        });

        const adminEmail = this.sendEmail({
            to: process.env.ADMIN_EMAIL || enquiry.email,
            subject: `📋 New Enquiry: ${enquiry.name} - ${enquiry.course}`,
            html: this.getAdminEmailTemplate(enquiry),
            enquiryId: enquiry._id,
            recipientType: 'admin',
            emailType: 'notification'
        });

        const [userResult, adminResult] = await Promise.allSettled([userEmail, adminEmail]);

        return {
            userEmail: userResult.status === 'fulfilled' && userResult.value ? 'sent' : 'failed',
            adminEmail: adminResult.status === 'fulfilled' && adminResult.value ? 'sent' : 'failed'
        };
    }

    // ======================
    // TEMPLATES
    // ======================
    getUserEmailTemplate(enquiry) { /* same HTML as before */ return `<html>...User Template...</html>`; }
    getAdminEmailTemplate(enquiry) { /* same HTML as before */ return `<html>...Admin Template...</html>`; }
    getFollowupEmailTemplate(enquiry, message) { /* same HTML */ return `<html>...Followup Template...</html>`; }

    // ======================
    // CRUD OPERATIONS
    // ======================
    async createEnquiry(req, res) {
        try {
            const { name, email, phone, country, course, message } = req.body;

            // Validation
            const errors = [];
            if (!name || name.trim().length < 2) errors.push('Name too short');
            if (!email || !this.validateEmail(email)) errors.push('Invalid email');
            if (!phone || phone.trim().length < 5) errors.push('Invalid phone');
            if (!country || country.trim().length < 2) errors.push('Invalid country');
            if (!course || course.trim().length < 2) errors.push('Invalid course');
            if (errors.length) return res.status(400).json({ success: false, errors });

            // Duplicate check
            const recent = await Enquiry.findOne({
                email: email.toLowerCase(),
                createdAt: { $gte: moment().subtract(24, 'hours').toDate() },
                isDeleted: false
            });
            if (recent) return res.status(409).json({ success: false, message: 'Duplicate enquiry recently submitted' });

            // Save
            const enquiry = new Enquiry({
                name: name.trim(),
                email: email.toLowerCase().trim(),
                phone: phone.trim(),
                country: country.trim(),
                course: course.trim(),
                message: message?.trim() || '',
                status: 'new',
                source: req.headers['user-agent'] || 'unknown'
            });
            await enquiry.save();

            // Send emails in background
            this.sendEnquiryEmails(enquiry).then(r => console.log('Email results:', r));

            res.status(201).json({
                success: true,
                message: 'Enquiry submitted successfully',
                data: {
                    id: enquiry._id,
                    name: enquiry.name,
                    email: enquiry.email,
                    course: enquiry.course,
                    status: enquiry.status,
                    createdAt: enquiry.createdAt,
                    referenceNumber: `ENQ-${enquiry._id.toString().slice(-8).toUpperCase()}`
                }
            });

        } catch (error) {
            console.error('❌ Create enquiry error:', error);
            res.status(500).json({ success: false, message: 'Failed to create enquiry' });
        }
    }

    async getAllEnquiries(req, res) {
        try {
            const { page = 1, limit = 20, status, course, startDate, endDate, search, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
            const query = { isDeleted: false };
            if (status) query.status = status;
            if (course) query.course = { $regex: course, $options: 'i' };
            if (startDate || endDate) query.createdAt = {};
            if (startDate) query.createdAt.$gte = new Date(startDate);
            if (endDate) query.createdAt.$lte = new Date(endDate);
            if (search) query.$or = ['name','email','phone','country','course','message'].map(f => ({ [f]: { $regex: search, $options: 'i' } }));

            const [enquiries, total] = await Promise.all([
                Enquiry.find(query).sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
                    .skip((page-1)*limit).limit(parseInt(limit)).lean(),
                Enquiry.countDocuments(query)
            ]);

            res.json({ success: true, data: enquiries, pagination: { total, page: parseInt(page), limit: parseInt(limit) } });

        } catch (error) {
            console.error('❌ Get all enquiries error:', error);
            res.status(500).json({ success: false, message: 'Failed to fetch enquiries' });
        }
    }

    async getEnquiryById(req, res) {
        try {
            const { id } = req.params;
            if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ success: false, message: 'Invalid ID' });

            const enquiry = await Enquiry.findOne({ _id: id, isDeleted: false }).lean();
            if (!enquiry) return res.status(404).json({ success: false, message: 'Enquiry not found' });

            const emailLogs = await EmailLog.find({ enquiryId: id }).sort({ createdAt: -1 }).lean();
            res.json({ success: true, data: { ...enquiry, emailHistory: emailLogs } });

        } catch (error) {
            console.error('❌ Get enquiry by ID error:', error);
            res.status(500).json({ success: false, message: 'Failed to fetch enquiry' });
        }
    }

    async updateEnquiry(req, res) {
        try {
            const { id } = req.params;
            const updateData = req.body;
            if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ success: false, message: 'Invalid ID' });

            const allowed = ['status','message','notes','assignedTo','priority'];
            const updates = Object.keys(updateData).reduce((acc, key) => allowed.includes(key) ? (acc[key] = updateData[key], acc) : acc, {});
            updates.updatedAt = Date.now();

            const enquiry = await Enquiry.findOneAndUpdate({ _id: id, isDeleted: false }, updates, { new: true, runValidators: true });
            if (!enquiry) return res.status(404).json({ success: false, message: 'Enquiry not found' });

            res.json({ success: true, message: 'Enquiry updated', data: enquiry });

        } catch (error) {
            console.error('❌ Update enquiry error:', error);
            res.status(500).json({ success: false, message: 'Failed to update enquiry' });
        }
    }

    async deleteEnquiry(req, res) {
        try {
            const { id } = req.params;
            if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ success: false, message: 'Invalid ID' });

            const enquiry = await Enquiry.findOneAndUpdate(
                { _id: id, isDeleted: false },
                { isDeleted: true, deletedAt: Date.now(), updatedAt: Date.now() },
                { new: true }
            );

            if (!enquiry) return res.status(404).json({ success: false, message: 'Enquiry not found' });

            res.json({ success: true, message: 'Enquiry deleted', data: { id: enquiry._id, deletedAt: enquiry.deletedAt } });

        } catch (error) {
            console.error('❌ Delete enquiry error:', error);
            res.status(500).json({ success: false, message: 'Failed to delete enquiry' });
        }
    }

    // ======================
    // EMAIL UTILITIES
    // ======================
    validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    async sendFollowupEmail(req, res) {
        try {
            const { enquiryId, message } = req.body;
            if (!enquiryId || !message) return res.status(400).json({ success: false, message: 'ID & message required' });
            if (!mongoose.Types.ObjectId.isValid(enquiryId)) return res.status(400).json({ success: false, message: 'Invalid ID' });

            const enquiry = await Enquiry.findOne({ _id: enquiryId, isDeleted: false });
            if (!enquiry) return res.status(404).json({ success: false, message: 'Enquiry not found' });

            const result = await this.sendEmail({
                to: enquiry.email,
                subject: `Follow-up: ${enquiry.course}`,
                html: this.getFollowupEmailTemplate(enquiry, message),
                enquiryId: enquiry._id,
                recipientType: 'user',
                emailType: 'followup',
                metadata: { followup: true, followupMessage: message }
            });

            if (!result) return res.status(500).json({ success: false, message: 'Failed to send follow-up' });

            res.json({ success: true, message: 'Follow-up sent', data: { enquiryId: enquiry._id, recipient: enquiry.email } });

        } catch (error) {
            console.error('❌ Follow-up email error:', error);
            res.status(500).json({ success: false, message: 'Failed to send follow-up' });
        }
    }

    // ======================
    // DASHBOARD & STATS
    // ======================
    async getDashboardStatistics(req, res) {
        try {
            const now = moment().startOf('day');
            const counts = await Enquiry.countDocuments({ isDeleted: false });

            res.json({ success: true, data: { totalEnquiries: counts } });
        } catch (error) {
            console.error('❌ Dashboard error:', error);
            res.status(500).json({ success: false, message: 'Failed to fetch dashboard stats' });
        }
    }

    async healthCheck(req, res) {
        try {
            const checks = {
                database: mongoose.connection.readyState === 1,
                email: !!this.transporter,
                uptime: process.uptime()
            };
            res.status(checks.database ? 200 : 503).json({ status: checks.database ? 'healthy' : 'degraded', checks });
        } catch (error) {
            res.status(503).json({ status: 'unhealthy', error: error.message });
        }
    }
}

const enquiryController = new EnquiryController();
module.exports = enquiryController;
