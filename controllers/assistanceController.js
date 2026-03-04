
// const AssistanceRequest = require('../models/AssistanceRequest');
// const nodemailer = require('nodemailer');

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
//       pass: process.env.SMTP_PASS,
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
//     if (process.env.SKIP_EMAILS === 'false' && !isAdminNotification) {
//       console.log('Email sending skipped');
//       return { success: true, skipped: true };
//     }

//     try {
//       const transporter = createTransporter();
      
//       const info = await transporter.sendMail({
//         from: `"${process.env.COMPANY_NAME || 'REC APPLY'} Support" <${process.env.EMAIL_FROM}>`,
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

//   sendConfirmation: async (request) => {
//     const subject = `Support Request Received - #${request._id.toString().slice(-6).toUpperCase()}`;
    
//     const priorityColors = {
//       urgent: '#f44336',
//       high: '#ff9800',
//       medium: '#2196f3',
//       low: '#4caf50'
//     };

//     const priorityColor = priorityColors[request.priority] || '#666';
    
//     const html = `
//       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f4f4; padding: 20px;">
//         <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
//           <h1 style="color: white; margin: 0; font-size: 28px;">${process.env.COMPANY_NAME || 'REC APPLY'}</h1>
//           <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Support Request Confirmation</p>
//         </div>
        
//         <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
//           <h2 style="color: #333; margin-top: 0; border-bottom: 2px solid #f0f0f0; padding-bottom: 15px;">
//             Thank You for Contacting Us! 🎫
//           </h2>
          
//           <p style="font-size: 16px; line-height: 1.6; color: #555;">Dear ${request.name},</p>
          
//           <p style="font-size: 16px; line-height: 1.6; color: #555;">We have received your support request and our team will get back to you as soon as possible. Here are the details of your request:</p>
          
//           <div style="background-color: #f0f7ff; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #667eea;">
//             <h3 style="margin-top: 0; color: #667eea; font-size: 20px;">Request Reference: #${request._id.toString().slice(-6).toUpperCase()}</h3>
            
//             <table style="width: 100%; border-collapse: collapse;">
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Issue Type:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">
//                   <span style="background-color: #e3f2fd; color: #1976d2; padding: 3px 10px; border-radius: 12px; font-size: 12px;">
//                     ${request.issueType || 'General'}
//                   </span>
//                 </td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Priority:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">
//                   <span style="background-color: ${priorityColor}; color: white; padding: 3px 10px; border-radius: 12px; font-size: 12px;">
//                     ${request.priority || 'normal'}
//                   </span>
//                 </td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Status:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">
//                   <span style="background-color: #FFC107; color: #333; padding: 3px 10px; border-radius: 12px; font-size: 12px;">
//                     ${request.status || 'pending'}
//                   </span>
//                 </td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Page URL:</strong></td>
//                 <td style="padding: 8px 0; color: #333; word-break: break-all;">${request.pageUrl || 'N/A'}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Submitted on:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${new Date(request.createdAt).toLocaleString()}</td>
//               </tr>
//             </table>
            
//             <div style="margin-top: 15px;">
//               <strong style="color: #666;">Your Message:</strong>
//               <p style="color: #555; margin: 5px 0 0 0; background-color: white; padding: 15px; border-radius: 5px; font-style: italic;">${request.message}</p>
//             </div>
//           </div>
          
//           <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
//             <h4 style="margin-top: 0; color: #333;">What Happens Next?</h4>
//             <ul style="margin: 5px 0 0 0; color: #555; padding-left: 20px;">
//               <li style="margin: 5px 0;">Our support team will review your request</li>
//               <li style="margin: 5px 0;">We'll investigate the issue you reported</li>
//               <li style="margin: 5px 0;">You'll receive updates via email as we make progress</li>
//             </ul>
//           </div>
          
//           <hr style="border: none; border-top: 2px solid #f0f0f0; margin: 30px 0;">
          
//           <div style="text-align: center;">
//             <p style="color: #666; font-size: 14px; line-height: 1.6;">
//               We appreciate your patience and will respond shortly.<br>
//               Thank you for helping us improve your experience!
//             </p>
//           </div>
//         </div>
        
//         <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
//           © ${new Date().getFullYear()} ${process.env.COMPANY_NAME || 'REC APPLY'}. All rights reserved.<br>
//           This is an automated message, please do not reply to this email.
//         </div>
//       </div>
//     `;

//     return await this.sendEmail(request.email, subject, html);
//   },

//   sendSupportNotification: async (request) => {
//     const subject = `New Support Request: ${request.issueType} - #${request._id.toString().slice(-6).toUpperCase()}`;
    
//     const priorityColors = {
//       urgent: '#f44336',
//       high: '#ff9800',
//       medium: '#2196f3',
//       low: '#4caf50'
//     };

//     const priorityColor = priorityColors[request.priority] || '#666';
    
//     const html = `
//       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f4f4; padding: 20px;">
//         <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
//           <h1 style="color: white; margin: 0; font-size: 28px;">${process.env.COMPANY_NAME || 'REC APPLY'}</h1>
//           <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Support Team Notification</p>
//         </div>
        
//         <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
//           <h2 style="color: #333; margin-top: 0; border-bottom: 2px solid #f0f0f0; padding-bottom: 15px;">
//             New Support Request Received 🔔
//           </h2>
          
//           <div style="background-color: #fff3e0; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #f5576c;">
//             <h3 style="margin-top: 0; color: #f5576c; font-size: 20px;">Request Reference: #${request._id.toString().slice(-6).toUpperCase()}</h3>
            
//             <table style="width: 100%; border-collapse: collapse;">
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Customer Name:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${request.name}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Customer Email:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${request.email}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Issue Type:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">
//                   <span style="background-color: #e3f2fd; color: #1976d2; padding: 3px 10px; border-radius: 12px; font-size: 12px;">
//                     ${request.issueType || 'General'}
//                   </span>
//                 </td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Priority:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">
//                   <span style="background-color: ${priorityColor}; color: white; padding: 3px 10px; border-radius: 12px; font-size: 12px;">
//                     ${request.priority || 'normal'}
//                   </span>
//                 </td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Page URL:</strong></td>
//                 <td style="padding: 8px 0; color: #333; word-break: break-all;">${request.pageUrl || 'N/A'}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>IP Address:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${request.ip || 'Not available'}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>User Agent:</strong></td>
//                 <td style="padding: 8px 0; color: #333; font-size: 12px;">${request.userAgent || 'Not available'}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Received on:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${new Date(request.createdAt).toLocaleString()}</td>
//               </tr>
//             </table>
            
//             <div style="margin-top: 15px; background-color: #fff9e6; padding: 15px; border-radius: 5px;">
//               <strong style="color: #666;">Customer Message:</strong>
//               <p style="color: #555; margin: 5px 0 0 0;">${request.message}</p>
//             </div>
//           </div>
          
//           <hr style="border: none; border-top: 2px solid #f0f0f0; margin: 30px 0;">
          
//           <div style="text-align: center;">
//             <p style="color: #666; font-size: 14px; line-height: 1.6;">
//               Please review and respond to this support request promptly.<br>
//               This is an automated notification from the support system.
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

//   sendStatusUpdate: async (request, oldStatus) => {
//     const subject = `Support Request Update - #${request._id.toString().slice(-6).toUpperCase()}`;
    
//     const statusColors = {
//       pending: '#FFC107',
//       in_progress: '#2196f3',
//       resolved: '#4caf50',
//       closed: '#9e9e9e'
//     };

//     const newStatusColor = statusColors[request.status] || '#666';
//     const oldStatusColor = statusColors[oldStatus] || '#666';
    
//     const html = `
//       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f4f4; padding: 20px;">
//         <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
//           <h1 style="color: white; margin: 0; font-size: 28px;">${process.env.COMPANY_NAME || 'REC APPLY'}</h1>
//           <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Support Request Update</p>
//         </div>
        
//         <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
//           <h2 style="color: #333; margin-top: 0; border-bottom: 2px solid #f0f0f0; padding-bottom: 15px;">
//             Your Support Request Has Been Updated
//           </h2>
          
//           <p style="font-size: 16px; line-height: 1.6; color: #555;">Dear ${request.name},</p>
          
//           <p style="font-size: 16px; line-height: 1.6; color: #555;">The status of your support request has been updated:</p>
          
//           <div style="background-color: #f9f9f9; padding: 30px; text-align: center; border-radius: 5px; margin: 20px 0;">
//             <div style="display: inline-block; background-color: ${oldStatusColor}20; padding: 15px 30px; border-radius: 5px; margin-right: 10px;">
//               <span style="color: ${oldStatusColor}; font-weight: bold;">${oldStatus || 'Pending'}</span>
//             </div>
//             <span style="font-size: 24px; color: #999; margin: 0 15px;">→</span>
//             <div style="display: inline-block; background-color: ${newStatusColor}20; padding: 15px 30px; border-radius: 5px;">
//               <span style="color: ${newStatusColor}; font-weight: bold;">${request.status || 'Current'}</span>
//             </div>
//           </div>
          
//           <div style="background-color: #f0f7ff; padding: 20px; border-radius: 5px; margin: 20px 0;">
//             <h4 style="margin-top: 0; color: #333;">Request Reference: #${request._id.toString().slice(-6).toUpperCase()}</h4>
//             <p style="margin: 5px 0; color: #555;"><strong>Issue Type:</strong> ${request.issueType || 'General'}</p>
//             <p style="margin: 5px 0; color: #555;"><strong>Current Status:</strong> 
//               <span style="background-color: ${newStatusColor}; color: white; padding: 3px 10px; border-radius: 12px; font-size: 12px;">
//                 ${request.status || 'Pending'}
//               </span>
//             </p>
//             ${request.resolutionNotes ? `
//               <div style="margin-top: 15px;">
//                 <strong style="color: #666;">Resolution Notes:</strong>
//                 <p style="color: #555; margin: 5px 0 0 0; background-color: white; padding: 10px; border-radius: 5px;">${request.resolutionNotes}</p>
//               </div>
//             ` : ''}
//           </div>
          
//           <hr style="border: none; border-top: 2px solid #f0f0f0; margin: 30px 0;">
          
//           <div style="text-align: center;">
//             <p style="color: #666; font-size: 14px; line-height: 1.6;">
//               If you have any questions, please don't hesitate to respond to this email.<br>
//               Thank you for your patience!
//             </p>
//           </div>
//         </div>
        
//         <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
//           © ${new Date().getFullYear()} ${process.env.COMPANY_NAME || 'REC APPLY'}. All rights reserved.
//         </div>
//       </div>
//     `;

//     return await this.sendEmail(request.email, subject, html);
//   }
// };

// class AssistanceController {
//   // ========== CREATE ==========
//   async createRequest(req, res) {
//     try {
//       const {
//         name,
//         email,
//         issueType = "technical",
//         message,
//         pageUrl
//       } = req.body;

//       // Validate required fields
//       const errors = [];
//       if (!name?.trim()) errors.push('Name is required');
//       if (!email?.trim()) errors.push('Email is required');
//       if (!message?.trim()) errors.push('Message is required');
//       if (!pageUrl?.trim()) errors.push('Page URL is required');
      
//       if (errors.length > 0) {
//         return res.status(400).json({
//           success: false,
//           message: 'Validation failed',
//           errors
//         });
//       }

//       // Validate email format
//       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//       if (!emailRegex.test(email)) {
//         return res.status(400).json({
//           success: false,
//           message: 'Please provide a valid email address'
//         });
//       }

//       // Determine priority
//       const priority = this.determinePriority(issueType, message);

//       // Create request
//       const request = new AssistanceRequest({
//         name: name.trim(),
//         email: email.trim().toLowerCase(),
//         issueType,
//         message: message.trim(),
//         pageUrl: pageUrl.trim(),
//         ip: req.ip || req.connection.remoteAddress,
//         userAgent: req.headers['user-agent'],
//         priority
//       });

//       await request.save();

//       // Send emails (fire and forget)
//       this.sendInitialEmails(request);

//       res.status(201).json({
//         success: true,
//         message: 'Assistance request created successfully',
//         data: this.formatResponse(request)
//       });

//     } catch (error) {
//       console.error('Create request error:', error);
      
//       if (error.name === 'ValidationError') {
//         const errors = Object.values(error.errors).map(err => err.message);
//         return res.status(400).json({
//           success: false,
//           message: 'Validation failed',
//           errors
//         });
//       }

//       res.status(500).json({
//         success: false,
//         message: 'Failed to create assistance request',
//         error: process.env.NODE_ENV === 'development' ? error.message : undefined
//       });
//     }
//   }

//   // ========== READ (Multiple) ==========
//   async getRequests(req, res) {
//     try {
//       const {
//         status,
//         issueType,
//         priority,
//         email,
//         assignedTo,
//         startDate,
//         endDate,
//         search,
//         sortBy = 'createdAt',
//         sortOrder = 'desc',
//         page = 1,
//         limit = 20
//       } = req.query;

//       // Build query
//       const query = {};

//       if (status) query.status = status;
//       if (issueType) query.issueType = issueType;
//       if (priority) query.priority = priority;
//       if (email) query.email = email.toLowerCase();
//       if (assignedTo) query.assignedTo = assignedTo;

//       // Date range
//       if (startDate || endDate) {
//         query.createdAt = {};
//         if (startDate) query.createdAt.$gte = new Date(startDate);
//         if (endDate) query.createdAt.$lte = new Date(endDate);
//       }

//       // Search
//       if (search) {
//         query.$or = [
//           { name: { $regex: search, $options: 'i' } },
//           { email: { $regex: search, $options: 'i' } },
//           { message: { $regex: search, $options: 'i' } },
//           { notes: { $regex: search, $options: 'i' } }
//         ];
//       }

//       // Calculate pagination
//       const skip = (page - 1) * limit;
//       const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

//       // Execute query with pagination
//       const [requests, total] = await Promise.all([
//         AssistanceRequest.find(query)
//           .sort(sort)
//           .skip(skip)
//           .limit(parseInt(limit))
//           .select('-__v'),
//         AssistanceRequest.countDocuments(query)
//       ]);

//       res.json({
//         success: true,
//         data: requests.map(req => this.formatResponse(req)),
//         pagination: {
//           page: parseInt(page),
//           limit: parseInt(limit),
//           total,
//           totalPages: Math.ceil(total / limit),
//           hasNext: page * limit < total,
//           hasPrev: page > 1
//         }
//       });

//     } catch (error) {
//       console.error('Get requests error:', error);
//       res.status(500).json({
//         success: false,
//         message: 'Failed to fetch assistance requests'
//       });
//     }
//   }

//   async getRequestsByEmail(req, res) {
//     try {
//       const {
//         issueType,
//         priority,
//         status,
//         assignedTo,
//         startDate,
//         endDate,
//         search,
//         sortBy = 'createdAt',
//         sortOrder = 'desc',
//         page = 1,
//         limit = 20
//       } = req.query;

//       const { email } = req.params;

//       // Build query
//       const query = {
//         email: email.toLowerCase()
//       };

//       if (status) query.status = status;
//       if (issueType) query.issueType = issueType;
//       if (priority) query.priority = priority;
//       if (assignedTo) query.assignedTo = assignedTo;

//       // Date range
//       if (startDate || endDate) {
//         query.createdAt = {};
//         if (startDate) query.createdAt.$gte = new Date(startDate);
//         if (endDate) query.createdAt.$lte = new Date(endDate);
//       }

//       // Search
//       if (search) {
//         query.$or = [
//           { name: { $regex: search, $options: 'i' } },
//           { message: { $regex: search, $options: 'i' } },
//           { notes: { $regex: search, $options: 'i' } }
//         ];
//       }

//       const skip = (page - 1) * limit;
//       const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

//       const [requests, total] = await Promise.all([
//         AssistanceRequest.find(query)
//           .sort(sort)
//           .skip(skip)
//           .limit(parseInt(limit))
//           .select('-__v'),
//         AssistanceRequest.countDocuments(query)
//       ]);

//       res.json({
//         success: true,
//         data: requests.map(req => this.formatResponse(req)),
//         pagination: {
//           page: parseInt(page),
//           limit: parseInt(limit),
//           total,
//           totalPages: Math.ceil(total / limit),
//           hasNext: page * limit < total,
//           hasPrev: page > 1
//         }
//       });

//     } catch (error) {
//       console.error('Get requests by email error:', error);
//       res.status(500).json({
//         success: false,
//         message: 'Failed to fetch assistance requests by email'
//       });
//     }
//   }

//   // ========== READ (Single) ==========
//   async getRequest(req, res) {
//     try {
//       const { id } = req.params;

//       const request = await AssistanceRequest.findById(id).select('-__v');

//       if (!request) {
//         return res.status(404).json({
//           success: false,
//           message: 'Assistance request not found'
//         });
//       }

//       res.json({
//         success: true,
//         data: this.formatResponse(request)
//       });

//     } catch (error) {
//       console.error('Get request error:', error);
      
//       if (error.name === 'CastError') {
//         return res.status(400).json({
//           success: false,
//           message: 'Invalid request ID'
//         });
//       }

//       res.status(500).json({
//         success: false,
//         message: 'Failed to fetch assistance request'
//       });
//     }
//   }

//   // ========== UPDATE ==========
//   async updateRequest(req, res) {
//     try {
//       const { id } = req.params;
//       const {
//         status,
//         priority,
//         assignedTo,
//         notes,
//         resolutionNotes
//       } = req.body;

//       const request = await AssistanceRequest.findById(id);

//       if (!request) {
//         return res.status(404).json({
//           success: false,
//           message: 'Assistance request not found'
//         });
//       }

//       // Store old status for email notification
//       const oldStatus = request.status;

//       // Update fields
//       const updates = {};
//       if (status && request.status !== status) {
//         updates.status = status;
//         if (status === 'resolved' && !request.resolvedAt) {
//           updates.resolvedAt = new Date();
//         }
//       }
//       if (priority) updates.priority = priority;
//       if (assignedTo !== undefined) updates.assignedTo = assignedTo;
//       if (notes !== undefined) updates.notes = notes;
//       if (resolutionNotes !== undefined) updates.resolutionNotes = resolutionNotes;

//       // Apply updates
//       Object.assign(request, updates);
//       await request.save();

//       // Send status update email if status changed
//       if (status && status !== oldStatus) {
//         emailService.sendStatusUpdate(request, oldStatus).catch(console.error);
//       }

//       res.json({
//         success: true,
//         message: 'Assistance request updated successfully',
//         data: this.formatResponse(request)
//       });

//     } catch (error) {
//       console.error('Update request error:', error);
      
//       if (error.name === 'CastError') {
//         return res.status(400).json({
//           success: false,
//           message: 'Invalid request ID'
//         });
//       }

//       res.status(500).json({
//         success: false,
//         message: 'Failed to update assistance request'
//       });
//     }
//   }

//   // ========== DELETE ==========
//   async deleteRequest(req, res) {
//     try {
//       const { id } = req.params;

//       const request = await AssistanceRequest.findByIdAndDelete(id);

//       if (!request) {
//         return res.status(404).json({
//           success: false,
//           message: 'Assistance request not found'
//         });
//       }

//       res.json({
//         success: true,
//         message: 'Assistance request deleted successfully',
//         data: { id: request._id }
//       });

//     } catch (error) {
//       console.error('Delete request error:', error);
      
//       if (error.name === 'CastError') {
//         return res.status(400).json({
//           success: false,
//           message: 'Invalid request ID'
//         });
//       }

//       res.status(500).json({
//         success: false,
//         message: 'Failed to delete assistance request'
//       });
//     }
//   }

//   // ========== STATISTICS ==========
//   async getStatistics(req, res) {
//     try {
//       const { startDate, endDate } = req.query;

//       const matchStage = {};
//       if (startDate || endDate) {
//         matchStage.createdAt = {};
//         if (startDate) matchStage.createdAt.$gte = new Date(startDate);
//         if (endDate) matchStage.createdAt.$lte = new Date(endDate);
//       }

//       const stats = await AssistanceRequest.aggregate([
//         { $match: matchStage },
//         {
//           $facet: {
//             // Overview stats
//             overview: [
//               {
//                 $group: {
//                   _id: null,
//                   total: { $sum: 1 },
//                   pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
//                   inProgress: { $sum: { $cond: [{ $eq: ['$status', 'in_progress'] }, 1, 0] } },
//                   resolved: { $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] } },
//                   closed: { $sum: { $cond: [{ $eq: ['$status', 'closed'] }, 1, 0] } },
//                   avgResponseTime: {
//                     $avg: {
//                       $cond: [
//                         { $ne: ['$resolvedAt', null] },
//                         { $subtract: ['$resolvedAt', '$createdAt'] },
//                         null
//                       ]
//                     }
//                   }
//                 }
//               }
//             ],

//             // By status
//             byStatus: [
//               {
//                 $group: {
//                   _id: '$status',
//                   count: { $sum: 1 },
//                   avgAge: {
//                     $avg: {
//                       $subtract: [new Date(), '$createdAt']
//                     }
//                   }
//                 }
//               },
//               { $sort: { count: -1 } }
//             ],

//             // By issue type
//             byIssueType: [
//               {
//                 $group: {
//                   _id: '$issueType',
//                   count: { $sum: 1 },
//                   avgResolutionTime: {
//                     $avg: {
//                       $cond: [
//                         { $ne: ['$resolvedAt', null] },
//                         { $subtract: ['$resolvedAt', '$createdAt'] },
//                         null
//                       ]
//                     }
//                   }
//                 }
//               },
//               { $sort: { count: -1 } }
//             ],

//             // By priority
//             byPriority: [
//               {
//                 $group: {
//                   _id: '$priority',
//                   count: { $sum: 1 }
//                 }
//               },
//               { $sort: { count: -1 } }
//             ],

//             // Daily requests (last 30 days)
//             dailyRequests: [
//               {
//                 $match: {
//                   createdAt: {
//                     $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
//                   }
//                 }
//               },
//               {
//                 $group: {
//                   _id: {
//                     $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
//                   },
//                   count: { $sum: 1 },
//                   pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
//                   resolved: { $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] } }
//                 }
//               },
//               { $sort: { _id: 1 } }
//             ],

//             // Hourly distribution
//             hourlyDistribution: [
//               {
//                 $group: {
//                   _id: { $hour: '$createdAt' },
//                   count: { $sum: 1 }
//                 }
//               },
//               { $sort: { _id: 1 } }
//             ],

//             // Top pages with issues
//             topPages: [
//               {
//                 $group: {
//                   _id: '$pageUrl',
//                   count: { $sum: 1 },
//                   issues: { $addToSet: '$issueType' }
//                 }
//               },
//               { $sort: { count: -1 } },
//               { $limit: 10 }
//             ],

//             // Recent activity
//             recentActivity: [
//               { $sort: { updatedAt: -1 } },
//               { $limit: 10 },
//               {
//                 $project: {
//                   _id: 1,
//                   name: 1,
//                   email: 1,
//                   status: 1,
//                   issueType: 1,
//                   priority: 1,
//                   updatedAt: 1,
//                   timeSinceUpdate: {
//                     $subtract: [new Date(), '$updatedAt']
//                   }
//                 }
//               }
//             ]
//           }
//         }
//       ]);

//       const overview = stats[0].overview[0] || {};

//       res.json({
//         success: true,
//         data: {
//           overview: {
//             total: overview.total || 0,
//             pending: overview.pending || 0,
//             inProgress: overview.inProgress || 0,
//             resolved: overview.resolved || 0,
//             closed: overview.closed || 0,
//             completionRate: overview.total ? 
//               ((overview.resolved + overview.closed) / overview.total * 100).toFixed(2) : 0,
//             avgResponseTime: overview.avgResponseTime || 0
//           },
//           byStatus: stats[0].byStatus,
//           byIssueType: stats[0].byIssueType,
//           byPriority: stats[0].byPriority,
//           dailyRequests: stats[0].dailyRequests,
//           hourlyDistribution: stats[0].hourlyDistribution,
//           topPages: stats[0].topPages,
//           recentActivity: stats[0].recentActivity
//         },
//         timeframe: {
//           startDate: startDate || 'beginning',
//           endDate: endDate || 'now'
//         }
//       });

//     } catch (error) {
//       console.error('Get statistics error:', error);
//       res.status(500).json({
//         success: false,
//         message: 'Failed to fetch statistics'
//       });
//     }
//   }

//   // ========== HELPER METHODS ==========
//   determinePriority(issueType, message) {
//     const messageLower = message.toLowerCase();
    
//     const urgentKeywords = ['urgent', 'emergency', 'critical', 'broken', 'not working', 'down', 'crash', 'error'];
//     const highKeywords = ['important', 'blocking', 'cannot', 'unable', 'failed', 'issue', 'problem'];
    
//     if (urgentKeywords.some(keyword => messageLower.includes(keyword)) || issueType === 'bug') {
//       return 'urgent';
//     } else if (highKeywords.some(keyword => messageLower.includes(keyword)) || issueType === 'technical') {
//       return 'high';
//     } else if (issueType === 'billing') {
//       return 'medium';
//     } else {
//       return 'low';
//     }
//   }

//   async sendInitialEmails(request) {
//     try {
//       // Send confirmation to user
//       await emailService.sendConfirmation(request);
      
//       // Send notification to support team
//       await emailService.sendSupportNotification(request);
      
//     } catch (error) {
//       console.error('Error sending initial emails:', error);
//       // Don't throw - email failures shouldn't break the request
//     }
//   }

//   formatResponse(request) {
//     const obj = request.toObject ? request.toObject() : request;
    
//     return {
//       id: obj._id,
//       name: obj.name,
//       email: obj.email,
//       issueType: obj.issueType,
//       message: obj.message,
//       pageUrl: obj.pageUrl,
//       status: obj.status,
//       priority: obj.priority,
//       assignedTo: obj.assignedTo,
//       notes: obj.notes,
//       resolutionNotes: obj.resolutionNotes,
//       ip: obj.ip,
//       userAgent: obj.userAgent,
//       createdAt: obj.createdAt,
//       updatedAt: obj.updatedAt,
//       resolvedAt: obj.resolvedAt,
//       // Calculate age in hours
//       ageInHours: obj.createdAt ? 
//         Math.floor((new Date() - new Date(obj.createdAt)) / (1000 * 60 * 60)) : 0
//     };
//   }
// }

// module.exports = new AssistanceController();









const AssistanceRequest = require('../models/AssistanceRequest');
const nodemailer = require('nodemailer');

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
   EMAIL SERVICE - ALWAYS SEND EMAILS (NO SKIP)
===================================================== */
const emailService = {
  sendEmail: async (to, subject, html) => {
    try {
      const transporter = createTransporter();
      
      const info = await transporter.sendMail({
        from: `"${process.env.COMPANY_NAME || 'REC APPLY'} Support" <${process.env.EMAIL_FROM}>`,
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
        return { success: false, error: error.message };
      }
      
      return { success: false, error: error.message };
    }
  },

  sendConfirmation: async (request) => {
    const subject = `Support Request Received - #${request._id.toString().slice(-6).toUpperCase()}`;
    
    const priorityColors = {
      urgent: '#f44336',
      high: '#ff9800',
      medium: '#2196f3',
      low: '#4caf50'
    };

    const priorityColor = priorityColors[request.priority] || '#666';
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f4f4; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">${process.env.COMPANY_NAME || 'REC APPLY'}</h1>
          <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Support Request Confirmation</p>
        </div>
        
        <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-top: 0; border-bottom: 2px solid #f0f0f0; padding-bottom: 15px;">
            Thank You for Contacting Us! 🎫
          </h2>
          
          <p style="font-size: 16px; line-height: 1.6; color: #555;">Dear ${request.name},</p>
          
          <p style="font-size: 16px; line-height: 1.6; color: #555;">We have received your support request and our team will get back to you as soon as possible. Here are the details of your request:</p>
          
          <div style="background-color: #f0f7ff; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #667eea;">
            <h3 style="margin-top: 0; color: #667eea; font-size: 20px;">Request Reference: #${request._id.toString().slice(-6).toUpperCase()}</h3>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Issue Type:</strong></td>
                <td style="padding: 8px 0; color: #333;">
                  <span style="background-color: #e3f2fd; color: #1976d2; padding: 3px 10px; border-radius: 12px; font-size: 12px;">
                    ${request.issueType || 'General'}
                  </span>
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Priority:</strong></td>
                <td style="padding: 8px 0; color: #333;">
                  <span style="background-color: ${priorityColor}; color: white; padding: 3px 10px; border-radius: 12px; font-size: 12px;">
                    ${request.priority || 'normal'}
                  </span>
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Status:</strong></td>
                <td style="padding: 8px 0; color: #333;">
                  <span style="background-color: #FFC107; color: #333; padding: 3px 10px; border-radius: 12px; font-size: 12px;">
                    ${request.status || 'pending'}
                  </span>
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Page URL:</strong></td>
                <td style="padding: 8px 0; color: #333; word-break: break-all;">${request.pageUrl || 'N/A'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Submitted on:</strong></td>
                <td style="padding: 8px 0; color: #333;">${new Date(request.createdAt).toLocaleString()}</td>
              </tr>
            </table>
            
            <div style="margin-top: 15px;">
              <strong style="color: #666;">Your Message:</strong>
              <p style="color: #555; margin: 5px 0 0 0; background-color: white; padding: 15px; border-radius: 5px; font-style: italic;">${request.message}</p>
            </div>
          </div>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h4 style="margin-top: 0; color: #333;">What Happens Next?</h4>
            <ul style="margin: 5px 0 0 0; color: #555; padding-left: 20px;">
              <li style="margin: 5px 0;">Our support team will review your request</li>
              <li style="margin: 5px 0;">We'll investigate the issue you reported</li>
              <li style="margin: 5px 0;">You'll receive updates via email as we make progress</li>
            </ul>
          </div>
          
          <hr style="border: none; border-top: 2px solid #f0f0f0; margin: 30px 0;">
          
          <div style="text-align: center;">
            <p style="color: #666; font-size: 14px; line-height: 1.6;">
              We appreciate your patience and will respond shortly.<br>
              Thank you for helping us improve your experience!
            </p>
          </div>
        </div>
        
        <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
          © ${new Date().getFullYear()} ${process.env.COMPANY_NAME || 'REC APPLY'}. All rights reserved.<br>
          This is an automated message, please do not reply to this email.
        </div>
      </div>
    `;

    return await this.sendEmail(request.email, subject, html);
  },

  sendSupportNotification: async (request) => {
    const subject = `New Support Request: ${request.issueType} - #${request._id.toString().slice(-6).toUpperCase()}`;
    
    const priorityColors = {
      urgent: '#f44336',
      high: '#ff9800',
      medium: '#2196f3',
      low: '#4caf50'
    };

    const priorityColor = priorityColors[request.priority] || '#666';
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f4f4; padding: 20px;">
        <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">${process.env.COMPANY_NAME || 'REC APPLY'}</h1>
          <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Support Team Notification</p>
        </div>
        
        <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-top: 0; border-bottom: 2px solid #f0f0f0; padding-bottom: 15px;">
            New Support Request Received 🔔
          </h2>
          
          <div style="background-color: #fff3e0; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #f5576c;">
            <h3 style="margin-top: 0; color: #f5576c; font-size: 20px;">Request Reference: #${request._id.toString().slice(-6).toUpperCase()}</h3>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Customer Name:</strong></td>
                <td style="padding: 8px 0; color: #333;">${request.name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Customer Email:</strong></td>
                <td style="padding: 8px 0; color: #333;">${request.email}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Issue Type:</strong></td>
                <td style="padding: 8px 0; color: #333;">
                  <span style="background-color: #e3f2fd; color: #1976d2; padding: 3px 10px; border-radius: 12px; font-size: 12px;">
                    ${request.issueType || 'General'}
                  </span>
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Priority:</strong></td>
                <td style="padding: 8px 0; color: #333;">
                  <span style="background-color: ${priorityColor}; color: white; padding: 3px 10px; border-radius: 12px; font-size: 12px;">
                    ${request.priority || 'normal'}
                  </span>
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Page URL:</strong></td>
                <td style="padding: 8px 0; color: #333; word-break: break-all;">${request.pageUrl || 'N/A'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>IP Address:</strong></td>
                <td style="padding: 8px 0; color: #333;">${request.ip || 'Not available'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>User Agent:</strong></td>
                <td style="padding: 8px 0; color: #333; font-size: 12px;">${request.userAgent || 'Not available'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Received on:</strong></td>
                <td style="padding: 8px 0; color: #333;">${new Date(request.createdAt).toLocaleString()}</td>
              </tr>
            </table>
            
            <div style="margin-top: 15px; background-color: #fff9e6; padding: 15px; border-radius: 5px;">
              <strong style="color: #666;">Customer Message:</strong>
              <p style="color: #555; margin: 5px 0 0 0;">${request.message}</p>
            </div>
          </div>
          
          <hr style="border: none; border-top: 2px solid #f0f0f0; margin: 30px 0;">
          
          <div style="text-align: center;">
            <p style="color: #666; font-size: 14px; line-height: 1.6;">
              Please review and respond to this support request promptly.<br>
              This is an automated notification from the support system.
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

  sendStatusUpdate: async (request, oldStatus) => {
    const subject = `Support Request Update - #${request._id.toString().slice(-6).toUpperCase()}`;
    
    const statusColors = {
      pending: '#FFC107',
      in_progress: '#2196f3',
      resolved: '#4caf50',
      closed: '#9e9e9e'
    };

    const newStatusColor = statusColors[request.status] || '#666';
    const oldStatusColor = statusColors[oldStatus] || '#666';
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f4f4; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">${process.env.COMPANY_NAME || 'REC APPLY'}</h1>
          <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Support Request Update</p>
        </div>
        
        <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-top: 0; border-bottom: 2px solid #f0f0f0; padding-bottom: 15px;">
            Your Support Request Has Been Updated
          </h2>
          
          <p style="font-size: 16px; line-height: 1.6; color: #555;">Dear ${request.name},</p>
          
          <p style="font-size: 16px; line-height: 1.6; color: #555;">The status of your support request has been updated:</p>
          
          <div style="background-color: #f9f9f9; padding: 30px; text-align: center; border-radius: 5px; margin: 20px 0;">
            <div style="display: inline-block; background-color: ${oldStatusColor}20; padding: 15px 30px; border-radius: 5px; margin-right: 10px;">
              <span style="color: ${oldStatusColor}; font-weight: bold;">${oldStatus || 'Pending'}</span>
            </div>
            <span style="font-size: 24px; color: #999; margin: 0 15px;">→</span>
            <div style="display: inline-block; background-color: ${newStatusColor}20; padding: 15px 30px; border-radius: 5px;">
              <span style="color: ${newStatusColor}; font-weight: bold;">${request.status || 'Current'}</span>
            </div>
          </div>
          
          <div style="background-color: #f0f7ff; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h4 style="margin-top: 0; color: #333;">Request Reference: #${request._id.toString().slice(-6).toUpperCase()}</h4>
            <p style="margin: 5px 0; color: #555;"><strong>Issue Type:</strong> ${request.issueType || 'General'}</p>
            <p style="margin: 5px 0; color: #555;"><strong>Current Status:</strong> 
              <span style="background-color: ${newStatusColor}; color: white; padding: 3px 10px; border-radius: 12px; font-size: 12px;">
                ${request.status || 'Pending'}
              </span>
            </p>
            ${request.resolutionNotes ? `
              <div style="margin-top: 15px;">
                <strong style="color: #666;">Resolution Notes:</strong>
                <p style="color: #555; margin: 5px 0 0 0; background-color: white; padding: 10px; border-radius: 5px;">${request.resolutionNotes}</p>
              </div>
            ` : ''}
          </div>
          
          <hr style="border: none; border-top: 2px solid #f0f0f0; margin: 30px 0;">
          
          <div style="text-align: center;">
            <p style="color: #666; font-size: 14px; line-height: 1.6;">
              If you have any questions, please don't hesitate to respond to this email.<br>
              Thank you for your patience!
            </p>
          </div>
        </div>
        
        <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
          © ${new Date().getFullYear()} ${process.env.COMPANY_NAME || 'REC APPLY'}. All rights reserved.
        </div>
      </div>
    `;

    return await this.sendEmail(request.email, subject, html);
  }
};

class AssistanceController {
  // ========== CREATE ==========
  async createRequest(req, res) {
    try {
      const {
        name,
        email,
        issueType = "technical",
        message,
        pageUrl
      } = req.body;

      // Validate required fields
      const errors = [];
      if (!name?.trim()) errors.push('Name is required');
      if (!email?.trim()) errors.push('Email is required');
      if (!message?.trim()) errors.push('Message is required');
      if (!pageUrl?.trim()) errors.push('Page URL is required');
      
      if (errors.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors
        });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid email address'
        });
      }

      // Determine priority
      const priority = this.determinePriority(issueType, message);

      // Create request
      const request = new AssistanceRequest({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        issueType,
        message: message.trim(),
        pageUrl: pageUrl.trim(),
        ip: req.ip || req.connection.remoteAddress,
        userAgent: req.headers['user-agent'],
        priority
      });

      await request.save();

      // Send emails (fire and forget)
      this.sendInitialEmails(request);

      res.status(201).json({
        success: true,
        message: 'Assistance request created successfully',
        data: this.formatResponse(request)
      });

    } catch (error) {
      console.error('Create request error:', error);
      
      if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map(err => err.message);
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to create assistance request',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // ========== READ (Multiple) ==========
  async getRequests(req, res) {
    try {
      const {
        status,
        issueType,
        priority,
        email,
        assignedTo,
        startDate,
        endDate,
        search,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        page = 1,
        limit = 20
      } = req.query;

      // Build query
      const query = {};

      if (status) query.status = status;
      if (issueType) query.issueType = issueType;
      if (priority) query.priority = priority;
      if (email) query.email = email.toLowerCase();
      if (assignedTo) query.assignedTo = assignedTo;

      // Date range
      if (startDate || endDate) {
        query.createdAt = {};
        if (startDate) query.createdAt.$gte = new Date(startDate);
        if (endDate) query.createdAt.$lte = new Date(endDate);
      }

      // Search
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { message: { $regex: search, $options: 'i' } },
          { notes: { $regex: search, $options: 'i' } }
        ];
      }

      // Calculate pagination
      const skip = (page - 1) * limit;
      const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

      // Execute query with pagination
      const [requests, total] = await Promise.all([
        AssistanceRequest.find(query)
          .sort(sort)
          .skip(skip)
          .limit(parseInt(limit))
          .select('-__v'),
        AssistanceRequest.countDocuments(query)
      ]);

      res.json({
        success: true,
        data: requests.map(req => this.formatResponse(req)),
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / limit),
          hasNext: page * limit < total,
          hasPrev: page > 1
        }
      });

    } catch (error) {
      console.error('Get requests error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch assistance requests'
      });
    }
  }

  async getRequestsByEmail(req, res) {
    try {
      const {
        issueType,
        priority,
        status,
        assignedTo,
        startDate,
        endDate,
        search,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        page = 1,
        limit = 20
      } = req.query;

      const { email } = req.params;

      // Build query
      const query = {
        email: email.toLowerCase()
      };

      if (status) query.status = status;
      if (issueType) query.issueType = issueType;
      if (priority) query.priority = priority;
      if (assignedTo) query.assignedTo = assignedTo;

      // Date range
      if (startDate || endDate) {
        query.createdAt = {};
        if (startDate) query.createdAt.$gte = new Date(startDate);
        if (endDate) query.createdAt.$lte = new Date(endDate);
      }

      // Search
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { message: { $regex: search, $options: 'i' } },
          { notes: { $regex: search, $options: 'i' } }
        ];
      }

      const skip = (page - 1) * limit;
      const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

      const [requests, total] = await Promise.all([
        AssistanceRequest.find(query)
          .sort(sort)
          .skip(skip)
          .limit(parseInt(limit))
          .select('-__v'),
        AssistanceRequest.countDocuments(query)
      ]);

      res.json({
        success: true,
        data: requests.map(req => this.formatResponse(req)),
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / limit),
          hasNext: page * limit < total,
          hasPrev: page > 1
        }
      });

    } catch (error) {
      console.error('Get requests by email error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch assistance requests by email'
      });
    }
  }

  // ========== READ (Single) ==========
  async getRequest(req, res) {
    try {
      const { id } = req.params;

      const request = await AssistanceRequest.findById(id).select('-__v');

      if (!request) {
        return res.status(404).json({
          success: false,
          message: 'Assistance request not found'
        });
      }

      res.json({
        success: true,
        data: this.formatResponse(request)
      });

    } catch (error) {
      console.error('Get request error:', error);
      
      if (error.name === 'CastError') {
        return res.status(400).json({
          success: false,
          message: 'Invalid request ID'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to fetch assistance request'
      });
    }
  }

  // ========== UPDATE ==========
  async updateRequest(req, res) {
    try {
      const { id } = req.params;
      const {
        status,
        priority,
        assignedTo,
        notes,
        resolutionNotes
      } = req.body;

      const request = await AssistanceRequest.findById(id);

      if (!request) {
        return res.status(404).json({
          success: false,
          message: 'Assistance request not found'
        });
      }

      // Store old status for email notification
      const oldStatus = request.status;

      // Update fields
      const updates = {};
      if (status && request.status !== status) {
        updates.status = status;
        if (status === 'resolved' && !request.resolvedAt) {
          updates.resolvedAt = new Date();
        }
      }
      if (priority) updates.priority = priority;
      if (assignedTo !== undefined) updates.assignedTo = assignedTo;
      if (notes !== undefined) updates.notes = notes;
      if (resolutionNotes !== undefined) updates.resolutionNotes = resolutionNotes;

      // Apply updates
      Object.assign(request, updates);
      await request.save();

      // Send status update email if status changed
      if (status && status !== oldStatus) {
        emailService.sendStatusUpdate(request, oldStatus).catch(console.error);
      }

      res.json({
        success: true,
        message: 'Assistance request updated successfully',
        data: this.formatResponse(request)
      });

    } catch (error) {
      console.error('Update request error:', error);
      
      if (error.name === 'CastError') {
        return res.status(400).json({
          success: false,
          message: 'Invalid request ID'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to update assistance request'
      });
    }
  }

  // ========== DELETE ==========
  async deleteRequest(req, res) {
    try {
      const { id } = req.params;

      const request = await AssistanceRequest.findByIdAndDelete(id);

      if (!request) {
        return res.status(404).json({
          success: false,
          message: 'Assistance request not found'
        });
      }

      res.json({
        success: true,
        message: 'Assistance request deleted successfully',
        data: { id: request._id }
      });

    } catch (error) {
      console.error('Delete request error:', error);
      
      if (error.name === 'CastError') {
        return res.status(400).json({
          success: false,
          message: 'Invalid request ID'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to delete assistance request'
      });
    }
  }

  // ========== STATISTICS ==========
  async getStatistics(req, res) {
    try {
      const { startDate, endDate } = req.query;

      const matchStage = {};
      if (startDate || endDate) {
        matchStage.createdAt = {};
        if (startDate) matchStage.createdAt.$gte = new Date(startDate);
        if (endDate) matchStage.createdAt.$lte = new Date(endDate);
      }

      const stats = await AssistanceRequest.aggregate([
        { $match: matchStage },
        {
          $facet: {
            // Overview stats
            overview: [
              {
                $group: {
                  _id: null,
                  total: { $sum: 1 },
                  pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
                  inProgress: { $sum: { $cond: [{ $eq: ['$status', 'in_progress'] }, 1, 0] } },
                  resolved: { $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] } },
                  closed: { $sum: { $cond: [{ $eq: ['$status', 'closed'] }, 1, 0] } },
                  avgResponseTime: {
                    $avg: {
                      $cond: [
                        { $ne: ['$resolvedAt', null] },
                        { $subtract: ['$resolvedAt', '$createdAt'] },
                        null
                      ]
                    }
                  }
                }
              }
            ],

            // By status
            byStatus: [
              {
                $group: {
                  _id: '$status',
                  count: { $sum: 1 },
                  avgAge: {
                    $avg: {
                      $subtract: [new Date(), '$createdAt']
                    }
                  }
                }
              },
              { $sort: { count: -1 } }
            ],

            // By issue type
            byIssueType: [
              {
                $group: {
                  _id: '$issueType',
                  count: { $sum: 1 },
                  avgResolutionTime: {
                    $avg: {
                      $cond: [
                        { $ne: ['$resolvedAt', null] },
                        { $subtract: ['$resolvedAt', '$createdAt'] },
                        null
                      ]
                    }
                  }
                }
              },
              { $sort: { count: -1 } }
            ],

            // By priority
            byPriority: [
              {
                $group: {
                  _id: '$priority',
                  count: { $sum: 1 }
                }
              },
              { $sort: { count: -1 } }
            ],

            // Daily requests (last 30 days)
            dailyRequests: [
              {
                $match: {
                  createdAt: {
                    $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                  }
                }
              },
              {
                $group: {
                  _id: {
                    $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
                  },
                  count: { $sum: 1 },
                  pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
                  resolved: { $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] } }
                }
              },
              { $sort: { _id: 1 } }
            ],

            // Hourly distribution
            hourlyDistribution: [
              {
                $group: {
                  _id: { $hour: '$createdAt' },
                  count: { $sum: 1 }
                }
              },
              { $sort: { _id: 1 } }
            ],

            // Top pages with issues
            topPages: [
              {
                $group: {
                  _id: '$pageUrl',
                  count: { $sum: 1 },
                  issues: { $addToSet: '$issueType' }
                }
              },
              { $sort: { count: -1 } },
              { $limit: 10 }
            ],

            // Recent activity
            recentActivity: [
              { $sort: { updatedAt: -1 } },
              { $limit: 10 },
              {
                $project: {
                  _id: 1,
                  name: 1,
                  email: 1,
                  status: 1,
                  issueType: 1,
                  priority: 1,
                  updatedAt: 1,
                  timeSinceUpdate: {
                    $subtract: [new Date(), '$updatedAt']
                  }
                }
              }
            ]
          }
        }
      ]);

      const overview = stats[0].overview[0] || {};

      res.json({
        success: true,
        data: {
          overview: {
            total: overview.total || 0,
            pending: overview.pending || 0,
            inProgress: overview.inProgress || 0,
            resolved: overview.resolved || 0,
            closed: overview.closed || 0,
            completionRate: overview.total ? 
              ((overview.resolved + overview.closed) / overview.total * 100).toFixed(2) : 0,
            avgResponseTime: overview.avgResponseTime || 0
          },
          byStatus: stats[0].byStatus,
          byIssueType: stats[0].byIssueType,
          byPriority: stats[0].byPriority,
          dailyRequests: stats[0].dailyRequests,
          hourlyDistribution: stats[0].hourlyDistribution,
          topPages: stats[0].topPages,
          recentActivity: stats[0].recentActivity
        },
        timeframe: {
          startDate: startDate || 'beginning',
          endDate: endDate || 'now'
        }
      });

    } catch (error) {
      console.error('Get statistics error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch statistics'
      });
    }
  }

  // ========== HELPER METHODS ==========
  determinePriority(issueType, message) {
    const messageLower = message.toLowerCase();
    
    const urgentKeywords = ['urgent', 'emergency', 'critical', 'broken', 'not working', 'down', 'crash', 'error'];
    const highKeywords = ['important', 'blocking', 'cannot', 'unable', 'failed', 'issue', 'problem'];
    
    if (urgentKeywords.some(keyword => messageLower.includes(keyword)) || issueType === 'bug') {
      return 'urgent';
    } else if (highKeywords.some(keyword => messageLower.includes(keyword)) || issueType === 'technical') {
      return 'high';
    } else if (issueType === 'billing') {
      return 'medium';
    } else {
      return 'low';
    }
  }

  async sendInitialEmails(request) {
    try {
      // Send confirmation to user
      await emailService.sendConfirmation(request);
      
      // Send notification to support team
      await emailService.sendSupportNotification(request);
      
    } catch (error) {
      console.error('Error sending initial emails:', error);
      // Don't throw - email failures shouldn't break the request
    }
  }

  formatResponse(request) {
    const obj = request.toObject ? request.toObject() : request;
    
    return {
      id: obj._id,
      name: obj.name,
      email: obj.email,
      issueType: obj.issueType,
      message: obj.message,
      pageUrl: obj.pageUrl,
      status: obj.status,
      priority: obj.priority,
      assignedTo: obj.assignedTo,
      notes: obj.notes,
      resolutionNotes: obj.resolutionNotes,
      ip: obj.ip,
      userAgent: obj.userAgent,
      createdAt: obj.createdAt,
      updatedAt: obj.updatedAt,
      resolvedAt: obj.resolvedAt,
      // Calculate age in hours
      ageInHours: obj.createdAt ? 
        Math.floor((new Date() - new Date(obj.createdAt)) / (1000 * 60 * 60)) : 0
    };
  }
}

module.exports = new AssistanceController();