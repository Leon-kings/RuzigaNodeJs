
// const User = require('../models/User');
// const jwt = require('jsonwebtoken');
// const { sendEmail } = require('../mails/sendEmail');
// const { validationResult } = require('express-validator');
// const mongoose = require('mongoose');

// // TEMPORARY: Control flag for Gmail daily limits
// const SKIP_EMAIL_ON_LIMIT = false; // Set to false when Gmail resets tomorrow

// // ==================== ACTION COUNTING FUNCTIONS ====================

// // Global counters object to track all actions
// const actionCounters = {
//   // User registration counters
//   registration: {
//     total: 0,
//     success: 0,
//     failed: 0,
//     blocked: 0,
//     development: 0,
//     byRole: {
//       user: 0,
//       admin: 0,
//       superadmin: 0
//     }
//   },
  
//   // Email counters
//   email: {
//     total: 0,
//     sent: 0,
//     failed: 0,
//     skipped: 0,
//     retries: 0,
//     byType: {
//       verification: 0,
//       passwordReset: 0,
//       notification: 0,
//       welcome: 0,
//       systemAlert: 0
//     }
//   },
  
//   // CRUD operation counters
//   crud: {
//     create: {
//       total: 0,
//       single: 0,
//       bulk: 0,
//       success: 0,
//       failed: 0
//     },
//     read: {
//       total: 0,
//       all: 0,
//       byId: 0,
//       byEmail: 0,
//       profile: 0,
//       statistics: 0,
//       search: 0
//     },
//     update: {
//       total: 0,
//       profile: 0,
//       adminUpdate: 0,
//       password: 0,
//       emailVerification: 0,
//       success: 0,
//       failed: 0
//     },
//     delete: {
//       total: 0,
//       self: 0,
//       admin: 0,
//       bulk: 0,
//       success: 0,
//       failed: 0
//     }
//   },
  
//   // Authentication counters
//   auth: {
//     login: {
//       total: 0,
//       success: 0,
//       failed: 0,
//       unverified: 0
//     },
//     logout: {
//       total: 0
//     },
//     tokenRefresh: {
//       total: 0,
//       success: 0,
//       failed: 0
//     }
//   },
  
//   // System health counters
//   system: {
//     healthChecks: 0,
//     emailServiceChecks: 0,
//     databasePings: 0,
//     errors: {
//       total: 0,
//       byType: {}
//     },
//     lastError: null
//   },
  
//   // Rate limiting counters
//   rateLimit: {
//     exceeded: 0,
//     byEndpoint: {}
//   },
  
//   // Performance metrics
//   performance: {
//     responseTimes: [],
//     averageResponseTime: 0,
//     slowestResponse: 0,
//     fastestResponse: Infinity
//   },
  
//   // Timestamps
//   timestamps: {
//     serverStart: new Date(),
//     lastReset: new Date(),
//     lastAction: null
//   }
// };

// // Function to increment counters
// const incrementCounter = (category, subCategory, action, value = 1, details = {}) => {
//   try {
//     // Update timestamp
//     actionCounters.timestamps.lastAction = new Date();
    
//     // Navigate through the nested structure
//     if (category && actionCounters[category]) {
//       if (subCategory && actionCounters[category][subCategory]) {
//         if (action && actionCounters[category][subCategory][action] !== undefined) {
//           actionCounters[category][subCategory][action] += value;
//         } else if (action && typeof actionCounters[category][subCategory] === 'object') {
//           // Handle dynamic properties like byRole, byType
//           if (actionCounters[category][subCategory][action] !== undefined) {
//             actionCounters[category][subCategory][action] += value;
//           } else {
//             // Initialize if not exists
//             actionCounters[category][subCategory][action] = value;
//           }
//         } else {
//           actionCounters[category][subCategory] += value;
//         }
//       } else if (action && actionCounters[category][action] !== undefined) {
//         actionCounters[category][action] += value;
//       } else if (typeof actionCounters[category] === 'number') {
//         actionCounters[category] += value;
//       }
//     }
    
//     // Track errors specifically
//     if (details.error) {
//       actionCounters.system.errors.total += value;
//       const errorType = details.error.name || 'UnknownError';
//       actionCounters.system.errors.byType[errorType] = 
//         (actionCounters.system.errors.byType[errorType] || 0) + value;
//       actionCounters.system.lastError = {
//         type: errorType,
//         message: details.error.message,
//         timestamp: new Date(),
//         endpoint: details.endpoint
//       };
//     }
    
//     // Track response time
//     if (details.responseTime) {
//       actionCounters.performance.responseTimes.push(details.responseTime);
//       // Keep only last 100 response times for calculation
//       if (actionCounters.performance.responseTimes.length > 100) {
//         actionCounters.performance.responseTimes.shift();
//       }
      
//       // Update metrics
//       const times = actionCounters.performance.responseTimes;
//       actionCounters.performance.averageResponseTime = 
//         times.reduce((a, b) => a + b, 0) / times.length;
//       actionCounters.performance.slowestResponse = 
//         Math.max(actionCounters.performance.slowestResponse, details.responseTime);
//       actionCounters.performance.fastestResponse = 
//         Math.min(actionCounters.performance.fastestResponse, details.responseTime);
//     }
    
//   } catch (error) {
//     console.error('Error in incrementCounter:', error);
//   }
// };

// // Function to get action statistics
// exports.getActionStatistics = async (req, res) => {
//   try {
//     incrementCounter('system', null, 'healthChecks');
    
//     const uptime = Date.now() - actionCounters.timestamps.serverStart.getTime();
    
//     const statistics = {
//       ...actionCounters,
//       uptime: {
//         milliseconds: uptime,
//         seconds: Math.floor(uptime / 1000),
//         minutes: Math.floor(uptime / (1000 * 60)),
//         hours: Math.floor(uptime / (1000 * 60 * 60)),
//         days: Math.floor(uptime / (1000 * 60 * 60 * 24))
//       },
//       performance: {
//         ...actionCounters.performance,
//         currentAverage: actionCounters.performance.averageResponseTime.toFixed(2) + 'ms'
//       },
//       summary: {
//         totalActions: 
//           actionCounters.registration.total +
//           actionCounters.email.total +
//           actionCounters.crud.create.total +
//           actionCounters.crud.read.total +
//           actionCounters.crud.update.total +
//           actionCounters.crud.delete.total +
//           actionCounters.auth.login.total +
//           actionCounters.auth.logout.total +
//           actionCounters.auth.tokenRefresh.total,
//         successRate: calculateSuccessRate(),
//         emailSuccessRate: calculateEmailSuccessRate()
//       }
//     };
    
//     res.json({
//       success: true,
//       data: statistics
//     });
//   } catch (error) {
//     console.error('Get action statistics error:', error);
//     res.status(500).json({ 
//       success: false, 
//       message: 'Server error',
//       error: error.message 
//     });
//   }
// };

// // Helper function to calculate success rate
// const calculateSuccessRate = () => {
//   const totalOperations = 
//     actionCounters.registration.total +
//     actionCounters.crud.create.total +
//     actionCounters.crud.update.total +
//     actionCounters.crud.delete.total;
    
//   const successfulOperations = 
//     actionCounters.registration.success +
//     actionCounters.crud.create.success +
//     actionCounters.crud.update.success +
//     actionCounters.crud.delete.success;
    
//   return totalOperations > 0 
//     ? ((successfulOperations / totalOperations) * 100).toFixed(2) + '%'
//     : 'N/A';
// };

// // Helper function to calculate email success rate
// const calculateEmailSuccessRate = () => {
//   const totalEmailAttempts = actionCounters.email.sent + actionCounters.email.failed;
//   return totalEmailAttempts > 0
//     ? ((actionCounters.email.sent / totalEmailAttempts) * 100).toFixed(2) + '%'
//     : 'N/A';
// };

// // Function to reset counters (admin only)
// exports.resetActionCounters = async (req, res) => {
//   try {
//     // Reset all counters but preserve server start time
//     const serverStart = actionCounters.timestamps.serverStart;
    
//     // Reset all counters to zero
//     actionCounters.registration = {
//       total: 0, success: 0, failed: 0, blocked: 0, development: 0,
//       byRole: { user: 0, admin: 0, superadmin: 0 }
//     };
    
//     actionCounters.email = {
//       total: 0, sent: 0, failed: 0, skipped: 0, retries: 0,
//       byType: { verification: 0, passwordReset: 0, notification: 0, welcome: 0, systemAlert: 0 }
//     };
    
//     actionCounters.crud = {
//       create: { total: 0, single: 0, bulk: 0, success: 0, failed: 0 },
//       read: { total: 0, all: 0, byId: 0, byEmail: 0, profile: 0, statistics: 0, search: 0 },
//       update: { total: 0, profile: 0, adminUpdate: 0, password: 0, emailVerification: 0, success: 0, failed: 0 },
//       delete: { total: 0, self: 0, admin: 0, bulk: 0, success: 0, failed: 0 }
//     };
    
//     actionCounters.auth = {
//       login: { total: 0, success: 0, failed: 0, unverified: 0 },
//       logout: { total: 0 },
//       tokenRefresh: { total: 0, success: 0, failed: 0 }
//     };
    
//     actionCounters.system = {
//       healthChecks: 0, emailServiceChecks: 0, databasePings: 0,
//       errors: { total: 0, byType: {} },
//       lastError: null
//     };
    
//     actionCounters.rateLimit = { exceeded: 0, byEndpoint: {} };
//     actionCounters.performance = {
//       responseTimes: [], averageResponseTime: 0, slowestResponse: 0, fastestResponse: Infinity
//     };
    
//     actionCounters.timestamps = {
//       serverStart: serverStart,
//       lastReset: new Date(),
//       lastAction: null
//     };
    
//     res.json({
//       success: true,
//       message: 'Action counters reset successfully',
//       timestamp: new Date()
//     });
//   } catch (error) {
//     console.error('Reset action counters error:', error);
//     res.status(500).json({ 
//       success: false, 
//       message: 'Server error',
//       error: error.message 
//     });
//   }
// };

// // ==================== EXISTING CODE WITH COUNTERS ADDED ====================

// // Generate JWT Token
// const generateToken = (userId) => {
//   return jwt.sign(
//     { userId }, // ✅ payload key
//     process.env.JWT_SECRET,
//     { expiresIn: '1d' }
//   );
// };

// // Helper function to check email service health
// async function checkEmailServiceHealth() {
//   const startTime = Date.now();
//   incrementCounter('system', null, 'emailServiceChecks');
  
//   try {
//     // Check if email configuration is present
//     if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
//       console.error('Email configuration missing');
//       incrementCounter('system', 'errors', 'total', 1, { 
//         error: new Error('Email config missing'),
//         endpoint: 'checkEmailServiceHealth'
//       });
//       return false;
//     }
    
//     // Skip actual check if we're hitting Gmail limits
//     if (SKIP_EMAIL_ON_LIMIT) {
//       console.log('⚠️ Skipping email health check (Gmail limit reached)');
//       incrementCounter('email', null, 'skipped', 1);
//       return false;
//     }
    
//     // Test email service connection
//     try {
//       const testTransporter = require('nodemailer').createTransport({
//         host: process.env.SMTP_HOST,
//         port: process.env.SMTP_PORT || 587,
//         secure: process.env.SMTP_SECURE === 'true',
//         auth: {
//           user: process.env.SMTP_USER,
//           pass: process.env.SMTP_PASS
//         }
//       });
      
//       await testTransporter.verify();
//       console.log('✅ Email service health check passed');
      
//       const responseTime = Date.now() - startTime;
//       incrementCounter('performance', null, null, 1, { responseTime });
      
//       return true;
//     } catch (transporterError) {
//       console.error('Email service health check failed:', transporterError.message);
//       incrementCounter('system', 'errors', 'total', 1, { 
//         error: transporterError,
//         endpoint: 'checkEmailServiceHealth/transporter'
//       });
//       return false;
//     }
//   } catch (error) {
//     console.error('Email service health check error:', error.message);
//     incrementCounter('system', 'errors', 'total', 1, { 
//       error,
//       endpoint: 'checkEmailServiceHealth'
//     });
//     return false;
//   }
// }

// // Helper function to send system down notification
// const sendSystemDownNotification = async (email, name) => {
//   incrementCounter('email', 'total', null, 1);
//   incrementCounter('email', 'byType', 'systemAlert', 1);
  
//   try {
//     // Skip if hitting Gmail limits
//     if (SKIP_EMAIL_ON_LIMIT) {
//       console.log('⚠️ Skipping system notification (Gmail limit)');
//       incrementCounter('email', null, 'skipped', 1);
//       return;
//     }
    
//     const canSendEmail = await checkEmailServiceHealth();
    
//     if (!canSendEmail) {
//       console.log('Cannot send system down notification - email service is down');
//       incrementCounter('email', null, 'failed', 1);
//       return;
//     }

//     await sendEmail({
//       to: process.env.ADMIN_EMAIL || 'admin@example.com',
//       subject: '⚠️ Email Service Down - Registration Blocked',
//       html: `
//         <!DOCTYPE html>
//         <html>
//         <head>
//           <style>
//             body { font-family: Arial, sans-serif; line-height: 1.6; }
//             .container { max-width: 600px; margin: 0 auto; padding: 20px; }
//             .header { background: #dc3545; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
//             .content { background: #f8f9fa; padding: 30px; border: 1px solid #dee2e6; border-top: none; border-radius: 0 0 5px 5px; }
//             .alert-box { background: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 5px; margin: 15px 0; }
//             .user-info { background: white; padding: 15px; border-left: 4px solid #dc3545; margin: 15px 0; }
//           </style>
//         </head>
//         <body>
//           <div class="container">
//             <div class="header">
//               <h2>⚠️ Email Service Down Alert</h2>
//             </div>
//             <div class="content">
//               <div class="alert-box">
//                 <h3>System Alert</h3>
//                 <p>The email service is currently unavailable. User registration is being blocked.</p>
//               </div>
              
//               <div class="user-info">
//                 <h4>Registration Blocked for:</h4>
//                 <p><strong>👤 Name:</strong> ${name}</p>
//                 <p><strong>📧 Email:</strong> ${email}</p>
//                 <p><strong>⏰ Time:</strong> ${new Date().toLocaleString()}</p>
//                 <p><strong>🔧 System:</strong> User Registration System</p>
//               </div>
              
//               <p><strong>Action Required:</strong></p>
//               <ul>
//                 <li>Check email service configuration</li>
//                 <li>Verify SMTP credentials</li>
//                 <li>Restart email service if necessary</li>
//               </ul>
              
//               <p>This is an automated alert from the system monitoring service.</p>
//             </div>
//           </div>
//         </body>
//         </html>
//       `
//     });
    
//     console.log('✅ System down notification sent to admin');
//     incrementCounter('email', null, 'sent', 1);
//   } catch (error) {
//     console.error('Failed to send system down notification:', error.message);
//     incrementCounter('email', null, 'failed', 1);
//     incrementCounter('system', 'errors', 'total', 1, { 
//       error,
//       endpoint: 'sendSystemDownNotification'
//     });
//   }
// };

// // Helper function for email sending with retry
// async function sendEmailWithRetry(emailData, maxRetries = 2) {
//   incrementCounter('email', 'total', null, 1);
  
//   // Skip sending if hitting Gmail limits
//   if (SKIP_EMAIL_ON_LIMIT) {
//     console.log(`⚠️ Would send email to: ${emailData.to}`);
//     console.log(`📧 Subject: ${emailData.subject}`);
//     incrementCounter('email', null, 'skipped', 1);
//     return false; // Trigger development mode
//   }
  
//   for (let attempt = 1; attempt <= maxRetries; attempt++) {
//     const startTime = Date.now();
    
//     try {
//       await sendEmail(emailData);
//       console.log(`✅ Email sent successfully on attempt ${attempt}`);
      
//       const responseTime = Date.now() - startTime;
//       incrementCounter('email', null, 'sent', 1);
//       incrementCounter('performance', null, null, 1, { responseTime });
      
//       return true;
//     } catch (error) {
//       console.error(`❌ Email send attempt ${attempt} failed:`, error.message);
      
//       if (attempt < maxRetries) {
//         const delay = Math.min(1000 * Math.pow(2, attempt), 5000);
//         console.log(`⏳ Waiting ${delay}ms before retry...`);
//         incrementCounter('email', null, 'retries', 1);
//         await new Promise(resolve => setTimeout(resolve, delay));
//         continue;
//       }
      
//       console.error('❌ All email retry attempts failed');
//       incrementCounter('email', null, 'failed', 1);
//       incrementCounter('system', 'errors', 'total', 1, { 
//         error,
//         endpoint: 'sendEmailWithRetry'
//       });
      
//       return false;
//     }
//   }
// }

// // ==================== CREATE OPERATIONS ====================

// // Register new user (CREATE)
// exports.register = async (req, res) => {
//   const startTime = Date.now();
//   incrementCounter('registration', null, 'total', 1);
//   incrementCounter('crud', 'create', 'total', 1);
//   incrementCounter('crud', 'create', 'single', 1);
  
//   try {
//     // Check for validation errors
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       incrementCounter('registration', null, 'failed', 1);
//       incrementCounter('crud', 'create', 'failed', 1);
//       return res.status(400).json({ errors: errors.array() });
//     }

//     const { name, email, password, phone, confirmPassword, role } = req.body;

//     // Validate confirmPassword if provided
//     if (confirmPassword && password !== confirmPassword) {
//       incrementCounter('registration', null, 'failed', 1);
//       incrementCounter('crud', 'create', 'failed', 1);
//       return res.status(400).json({ message: 'Passwords do not match' });
//     }

//     // Check if user already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       incrementCounter('registration', null, 'failed', 1);
//       incrementCounter('crud', 'create', 'failed', 1);
//       return res.status(409).json({ message: 'User already exists' });
//     }

//     // Check email service health before proceeding
//     const isEmailServiceAvailable = await checkEmailServiceHealth();
    
//     if (!isEmailServiceAvailable) {
//       console.log(`❌ Email service down - Registration blocked for ${email}`);
//       incrementCounter('registration', null, 'blocked', 1);
      
//       // Try to send system down notification
//       try {
//         await sendSystemDownNotification(email, name);
//       } catch (notificationError) {
//         console.error('System down notification failed:', notificationError.message);
//       }
      
//       // DEVELOPMENT MODE: Allow registration even when email service is down
//       if (process.env.NODE_ENV === 'development') {
//         console.log('⚠️ Development mode: Allowing registration without email verification');
//         incrementCounter('registration', null, 'development', 1);
        
//         // Create new user anyway
//         const user = new User({
//           name,
//           email: email.toLowerCase(),
//           password,
//           phone,
//           role: role || 'user',
//           isVerified: false
//         });

//         await user.save();
//         console.log(`✅ User created (no email): ${email}`);

//         // Update role counter
//         incrementCounter('registration', 'byRole', user.role || 'user', 1);
//         incrementCounter('registration', null, 'success', 1);
//         incrementCounter('crud', 'create', 'success', 1);

//         // Generate auth token
//         const token = generateToken(user._id);

//         const responseTime = Date.now() - startTime;
//         incrementCounter('performance', null, null, 1, { responseTime });

//         return res.status(201).json({
//           message: 'User registered successfully (email verification skipped in development)',
//           token,
//           user: {
//             id: user._id,
//             name: user.name,
//             email: user.email,
//             phone: user.phone,
//             role: user.role,
//             isVerified: false
//           },
//           warning: 'Email verification was skipped due to Gmail daily limits'
//         });
//       }
      
//       incrementCounter('registration', null, 'failed', 1);
//       incrementCounter('crud', 'create', 'failed', 1);
      
//       return res.status(503).json({ 
//         message: 'Email service is currently unavailable. Please try again later or contact support.' 
//       });
//     }

//     // Create new user
//     const user = new User({
//       name,
//       email: email.toLowerCase(),
//       password,
//       phone,
//       role: role || 'user',
//       isVerified: false
//     });

//     await user.save();
//     console.log(`✅ User created: ${email}`);

//     // Generate verification token
//     const verificationToken = jwt.sign(
//       { userId: user._id },
//       process.env.JWT_SECRET,
//       { expiresIn: '24h' }
//     );

//     // Send verification email with retry logic
//     const verificationUrl = `${process.env.FRONTEND_URL}/auth/verify-email?token=${verificationToken}`;
    
//     incrementCounter('email', 'byType', 'verification', 1);
    
//     const emailSent = await sendEmailWithRetry({
//       to: user.email,
//       subject: 'Verify Your Email',
//       html: `
//         <!DOCTYPE html>
//         <html>
//         <head>
//           <style>
//             body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
//             .container { max-width: 600px; margin: 0 auto; padding: 20px; }
//             .header { background: #4a6fa5; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
//             .content { background: #f9f9f9; padding: 30px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 5px 5px; }
//             .button { 
//               display: inline-block; 
//               background: #4a6fa5; 
//               color: white; 
//               padding: 12px 24px; 
//               text-decoration: none; 
//               border-radius: 5px;
//               margin: 20px 0;
//             }
//             .code-box { 
//               background: #f0f0f0; 
//               padding: 10px; 
//               border-radius: 5px; 
//               font-family: monospace; 
//               margin: 10px 0;
//               word-break: break-all;
//             }
//           </style>
//         </head>
//         <body>
//           <div class="container">
//             <div class="header">
//               <h1>Email Verification</h1>
//               <p>${process.env.COMPANY_NAME || 'Our Service'}</p>
//             </div>
//             <div class="content">
//               <h2>Hello ${user.name},</h2>
//               <p>Thank you for registering with us! Please verify your email address to complete your registration.</p>
              
//               <div style="text-align: center;">
//                 <a href="${verificationUrl}" class="button">Verify Email Address</a>
//               </div>
              
//               <p>Or copy and paste this link in your browser:</p>
//               <div class="code-box">${verificationUrl}</div>
              
//               <p><strong>Important:</strong> This verification link will expire in 24 hours.</p>
              
//               <p>If you didn't create an account with us, please ignore this email.</p>
              
//               <p>Best regards,<br>
//               <strong>${process.env.COMPANY_NAME || 'The Team'}</strong></p>
//             </div>
//           </div>
//         </body>
//         </html>
//       `
//     });

//     if (!emailSent) {
//       // DEVELOPMENT MODE: Don't delete user if email fails
//       if (process.env.NODE_ENV === 'development') {
//         console.log('⚠️ Email sending failed, but keeping user (development mode)');
//         incrementCounter('registration', null, 'development', 1);
        
//         // Generate auth token anyway
//         const token = generateToken(user._id);

//         // Update role counter
//         incrementCounter('registration', 'byRole', user.role || 'user', 1);
//         incrementCounter('registration', null, 'success', 1);
//         incrementCounter('crud', 'create', 'success', 1);

//         const responseTime = Date.now() - startTime;
//         incrementCounter('performance', null, null, 1, { responseTime });

//         return res.status(201).json({
//           message: 'User registered successfully (email verification failed but user created)',
//           token,
//           user: {
//             id: user._id,
//             name: user.name,
//             email: user.email,
//             phone: user.phone,
//             role: user.role,
//             isVerified: false
//           },
//           warning: 'Email verification failed due to Gmail limits. User was still created.'
//         });
//       }
      
//       // PRODUCTION: Delete user if email fails
//       await User.findByIdAndDelete(user._id);
      
//       console.error('❌ Email sending failed for user:', email);
      
//       incrementCounter('registration', null, 'failed', 1);
//       incrementCounter('crud', 'create', 'failed', 1);
      
//       return res.status(500).json({ 
//         message: 'Failed to send verification email. Our system is experiencing issues. Please try again later.'
//       });
//     }

//     console.log(`✅ Verification email sent to ${email}`);

//     // Update counters
//     incrementCounter('registration', 'byRole', user.role || 'user', 1);
//     incrementCounter('registration', null, 'success', 1);
//     incrementCounter('crud', 'create', 'success', 1);

//     // Generate auth token
//     const token = generateToken(user._id);

//     const responseTime = Date.now() - startTime;
//     incrementCounter('performance', null, null, 1, { responseTime });

//     res.status(201).json({
//       message: 'User registered successfully. Please verify your email.',
//       token,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         phone: user.phone,
//         role: user.role,
//         isVerified: false
//       }
//     });
//   } catch (error) {
//     console.error('❌ Registration error:', error);
    
//     incrementCounter('registration', null, 'failed', 1);
//     incrementCounter('crud', 'create', 'failed', 1);
//     incrementCounter('system', 'errors', 'total', 1, { 
//       error,
//       endpoint: 'register'
//     });
    
//     // Check if it's a duplicate key error
//     if (error.code === 11000 || error.message.includes('duplicate key')) {
//       return res.status(409).json({ message: 'User already exists' });
//     }
    
//     // Check if it's a validation error
//     if (error.name === 'ValidationError') {
//       return res.status(400).json({ 
//         message: 'Validation error', 
//         errors: Object.values(error.errors).map(err => err.message) 
//       });
//     }
    
//     res.status(500).json({ 
//       message: 'Server error during registration',
//       error: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   }
// };

// // Create multiple users (Bulk Create)
// exports.createMultipleUsers = async (req, res) => {
//   const startTime = Date.now();
//   incrementCounter('crud', 'create', 'total', 1);
//   incrementCounter('crud', 'create', 'bulk', 1);
  
//   try {
//     const usersData = req.body.users;
    
//     if (!Array.isArray(usersData) || usersData.length === 0) {
//       incrementCounter('crud', 'create', 'failed', 1);
//       return res.status(400).json({ message: 'Please provide an array of users' });
//     }

//     // Check email service health before proceeding
//     const isEmailServiceAvailable = await checkEmailServiceHealth();
    
//     if (!isEmailServiceAvailable) {
//       incrementCounter('crud', 'create', 'failed', 1);
//       return res.status(503).json({ 
//         message: 'Email service is currently unavailable. Bulk user creation is blocked.' 
//       });
//     }

//     // Validate each user
//     const errors = [];
//     const validUsers = [];

//     for (const userData of usersData) {
//       // Check if user already exists
//       const existingUser = await User.findOne({ email: userData.email.toLowerCase() });
//       if (existingUser) {
//         errors.push(`User with email ${userData.email} already exists`);
//       } else {
//         validUsers.push({
//           ...userData,
//           email: userData.email.toLowerCase(),
//           role: userData.role || 'user',
//           isVerified: false
//         });
//       }
//     }

//     if (validUsers.length === 0) {
//       incrementCounter('crud', 'create', 'failed', 1);
//       return res.status(400).json({ 
//         message: 'No valid users to create', 
//         errors 
//       });
//     }

//     // Create users
//     const createdUsers = await User.insertMany(validUsers);
    
//     // Update role counters
//     createdUsers.forEach(user => {
//       incrementCounter('registration', 'byRole', user.role || 'user', 1);
//     });

//     // Send verification emails
//     const emailResults = [];
//     for (const user of createdUsers) {
//       const verificationToken = jwt.sign(
//         { userId: user._id },
//         process.env.JWT_SECRET,
//         { expiresIn: '24h' }
//       );
      
//       const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
      
//       incrementCounter('email', 'byType', 'verification', 1);
      
//       try {
//         await sendEmailWithRetry({
//           to: user.email,
//           subject: 'Verify Your Email',
//           html: `
//             <h1>Email Verification</h1>
//             <p>Please click the link below to verify your email:</p>
//             <a href="${verificationUrl}">Verify Email</a>
//           `
//         });
//         emailResults.push({ email: user.email, status: 'sent' });
//       } catch (emailError) {
//         emailResults.push({ email: user.email, status: 'failed', error: emailError.message });
//       }
//     }

//     incrementCounter('crud', 'create', 'success', 1);
    
//     const responseTime = Date.now() - startTime;
//     incrementCounter('performance', null, null, 1, { responseTime });

//     res.status(201).json({
//       message: `${createdUsers.length} users created successfully`,
//       created: createdUsers.length,
//       failed: errors.length,
//       emailResults: emailResults,
//       errors: errors.length > 0 ? errors : undefined,
//       users: createdUsers.map(user => ({
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         phone: user.phone,
//         role: user.role
//       }))
//     });
//   } catch (error) {
//     console.error('Bulk create error:', error);
    
//     incrementCounter('crud', 'create', 'failed', 1);
//     incrementCounter('system', 'errors', 'total', 1, { 
//       error,
//       endpoint: 'createMultipleUsers'
//     });
    
//     res.status(500).json({ 
//       message: 'Server error',
//       error: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   }
// };

// // ==================== READ OPERATIONS ====================

// // Get all users (READ)
// exports.getAllUsers = async (req, res) => {
//   const startTime = Date.now();
//   incrementCounter('crud', 'read', 'total', 1);
//   incrementCounter('crud', 'read', 'all', 1);
  
//   try {
//     const { 
//       page = 1, 
//       limit = 10, 
//       sortBy = 'createdAt', 
//       sortOrder = 'desc',
//       search = '',
//       role = '',
//       verified = ''
//     } = req.query;

//     // Build query
//     const query = {};
    
//     if (search) {
//       query.$or = [
//         { name: { $regex: search, $options: 'i' } },
//         { email: { $regex: search, $options: 'i' } },
//         { phone: { $regex: search, $options: 'i' } }
//       ];
//     }
    
//     if (role) {
//       query.role = role;
//     }
    
//     if (verified !== '') {
//       query.isVerified = verified === 'true';
//     }

//     // Calculate pagination
//     const skip = (page - 1) * limit;
//     const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

//     // Get users with pagination
//     const users = await User.find(query)
//       .select('-password')
//       .sort(sort)
//       .skip(skip)
//       .limit(parseInt(limit));

//     // Get total count
//     const totalUsers = await User.countDocuments(query);
//     const totalPages = Math.ceil(totalUsers / limit);

//     const responseTime = Date.now() - startTime;
//     incrementCounter('performance', null, null, 1, { responseTime });

//     res.json({
//       users,
//       pagination: {
//         total: totalUsers,
//         page: parseInt(page),
//         limit: parseInt(limit),
//         totalPages,
//         hasNextPage: page < totalPages,
//         hasPrevPage: page > 1
//       }
//     });
//   } catch (error) {
//     console.error('Get all users error:', error);
    
//     incrementCounter('system', 'errors', 'total', 1, { 
//       error,
//       endpoint: 'getAllUsers'
//     });
    
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// // Get user by ID (READ)
// exports.getUserById = async (req, res) => {
//   const startTime = Date.now();
//   incrementCounter('crud', 'read', 'total', 1);
//   incrementCounter('crud', 'read', 'byId', 1);
  
//   try {
//     const { id } = req.params;
    
//     const user = await User.findById(id).select('-password');
    
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     const responseTime = Date.now() - startTime;
//     incrementCounter('performance', null, null, 1, { responseTime });

//     res.json(user);
//   } catch (error) {
//     console.error('Get user by ID error:', error);
    
//     incrementCounter('system', 'errors', 'total', 1, { 
//       error,
//       endpoint: 'getUserById'
//     });
    
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// exports.getUserByEmail = async (req, res) => {
//   const startTime = Date.now();
//   incrementCounter('crud', 'read', 'total', 1);
//   incrementCounter('crud', 'read', 'byEmail', 1);
  
//   try {
//     const { email } = req.params;

//     if (!email) {
//       return res.status(400).json({ success: false, message: 'Email is required' });
//     }

//     const user = await User.findOne({ email: email.toLowerCase() }).select('-password');

//     if (!user) {
//       return res.status(404).json({ success: false, message: 'User not found' });
//     }

//     const responseTime = Date.now() - startTime;
//     incrementCounter('performance', null, null, 1, { responseTime });

//     res.json({
//       success: true,
//       data: user
//     });
//   } catch (error) {
//     console.error('Get user by email error:', error);
    
//     incrementCounter('system', 'errors', 'total', 1, { 
//       error,
//       endpoint: 'getUserByEmail'
//     });
    
//     res.status(500).json({
//       success: false,
//       message: 'Server error fetching user by email',
//       error: error.message
//     });
//   }
// };

// // Get current user profile (READ)
// exports.getCurrentUser = async (req, res) => {
//   const startTime = Date.now();
//   incrementCounter('crud', 'read', 'total', 1);
//   incrementCounter('crud', 'read', 'profile', 1);
  
//   try {
//     const user = await User.findById(req.userId).select('-password');
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     const responseTime = Date.now() - startTime;
//     incrementCounter('performance', null, null, 1, { responseTime });

//     res.json(user);
//   } catch (error) {
//     console.error('Get current user error:', error);
    
//     incrementCounter('system', 'errors', 'total', 1, { 
//       error,
//       endpoint: 'getCurrentUser'
//     });
    
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// // Get user statistics (READ)
// exports.getUserStatistics = async (req, res) => {
//   const startTime = Date.now();
//   incrementCounter('crud', 'read', 'total', 1);
//   incrementCounter('crud', 'read', 'statistics', 1);
  
//   try {
//     const totalUsers = await User.countDocuments();
//     const verifiedUsers = await User.countDocuments({ isVerified: true });
//     const adminUsers = await User.countDocuments({ role: 'admin' });
//     const regularUsers = await User.countDocuments({ role: 'user' });
    
//     // Get today's new users
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//     const newUsersToday = await User.countDocuments({ 
//       createdAt: { $gte: today } 
//     });

//     // Get active users (logged in last 7 days)
//     const weekAgo = new Date();
//     weekAgo.setDate(weekAgo.getDate() - 7);
//     const activeUsers = await User.countDocuments({ 
//       lastLogin: { $gte: weekAgo } 
//     });

//     const responseTime = Date.now() - startTime;
//     incrementCounter('performance', null, null, 1, { responseTime });

//     res.json({
//       totalUsers,
//       verifiedUsers,
//       adminUsers,
//       regularUsers,
//       newUsersToday,
//       activeUsers,
//       verificationRate: totalUsers > 0 ? (verifiedUsers / totalUsers * 100).toFixed(2) : 0
//     });
//   } catch (error) {
//     console.error('Get user statistics error:', error);
    
//     incrementCounter('system', 'errors', 'total', 1, { 
//       error,
//       endpoint: 'getUserStatistics'
//     });
    
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// // Search users (READ)
// exports.searchUsers = async (req, res) => {
//   const startTime = Date.now();
//   incrementCounter('crud', 'read', 'total', 1);
//   incrementCounter('crud', 'read', 'search', 1);
  
//   try {
//     const { query } = req.query;
    
//     if (!query || query.length < 2) {
//       return res.status(400).json({ message: 'Search query must be at least 2 characters' });
//     }

//     const users = await User.find({
//       $or: [
//         { name: { $regex: query, $options: 'i' } },
//         { email: { $regex: query, $options: 'i' } },
//         { phone: { $regex: query, $options: 'i' } }
//       ]
//     }).select('-password').limit(20);

//     const responseTime = Date.now() - startTime;
//     incrementCounter('performance', null, null, 1, { responseTime });

//     res.json(users);
//   } catch (error) {
//     console.error('Search users error:', error);
    
//     incrementCounter('system', 'errors', 'total', 1, { 
//       error,
//       endpoint: 'searchUsers'
//     });
    
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// // ==================== UPDATE OPERATIONS ====================

// // Update user profile (UPDATE)
// exports.updateProfile = async (req, res) => {
//   const startTime = Date.now();
//   incrementCounter('crud', 'update', 'total', 1);
//   incrementCounter('crud', 'update', 'profile', 1);
  
//   try {
//     const { name, phone } = req.body;
//     const userId = req.userId;

//     const user = await User.findById(userId);
//     if (!user) {
//       incrementCounter('crud', 'update', 'failed', 1);
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Update fields
//     if (name) user.name = name;
//     if (phone) user.phone = phone;

//     await user.save();

//     incrementCounter('crud', 'update', 'success', 1);
    
//     const responseTime = Date.now() - startTime;
//     incrementCounter('performance', null, null, 1, { responseTime });

//     res.json({
//       message: 'Profile updated successfully',
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         phone: user.phone,
//         role: user.role,
//         isVerified: user.isVerified
//       }
//     });
//   } catch (error) {
//     console.error('Update profile error:', error);
    
//     incrementCounter('crud', 'update', 'failed', 1);
//     incrementCounter('system', 'errors', 'total', 1, { 
//       error,
//       endpoint: 'updateProfile'
//     });
    
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// // Update user by ID (Admin only) (UPDATE)
// exports.updateUserById = async (req, res) => {
//   const startTime = Date.now();
//   incrementCounter('crud', 'update', 'total', 1);
//   incrementCounter('crud', 'update', 'adminUpdate', 1);
  
//   try {
//     const { id } = req.params;
//     const { name, email, phone, role, isVerified } = req.body;

//     // Check if user exists
//     const user = await User.findById(id);
//     if (!user) {
//       incrementCounter('crud', 'update', 'failed', 1);
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Check if email is being changed and if it's already taken
//     if (email && email !== user.email) {
//       const existingUser = await User.findOne({ email: email.toLowerCase() });
//       if (existingUser) {
//         incrementCounter('crud', 'update', 'failed', 1);
//         return res.status(400).json({ message: 'Email already in use' });
//       }
//       user.email = email.toLowerCase();
      
//       // If email changed, unverify the account
//       user.isVerified = false;
      
//       // Send new verification email if service is available
//       const isEmailServiceAvailable = await checkEmailServiceHealth();
//       if (isEmailServiceAvailable) {
//         const verificationToken = jwt.sign(
//           { userId: user._id },
//           process.env.JWT_SECRET,
//           { expiresIn: '24h' }
//         );

//         const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
        
//         incrementCounter('email', 'byType', 'verification', 1);
        
//         await sendEmailWithRetry({
//           to: user.email,
//           subject: 'Verify Your Updated Email',
//           html: `
//             <h1>Email Verification Required</h1>
//             <p>Your email has been updated. Please verify your new email address:</p>
//             <a href="${verificationUrl}">Verify Email</a>
//           `
//         });
//       }
//     }

//     // Update other fields
//     if (name) user.name = name;
//     if (phone) user.phone = phone;
//     if (role) user.role = role;
//     if (isVerified !== undefined) user.isVerified = isVerified;

//     await user.save();

//     incrementCounter('crud', 'update', 'success', 1);
    
//     const responseTime = Date.now() - startTime;
//     incrementCounter('performance', null, null, 1, { responseTime });

//     res.json({
//       message: 'User updated successfully',
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         phone: user.phone,
//         role: user.role,
//         isVerified: user.isVerified,
//         createdAt: user.createdAt
//       }
//     });
//   } catch (error) {
//     console.error('Update user by ID error:', error);
    
//     incrementCounter('crud', 'update', 'failed', 1);
//     incrementCounter('system', 'errors', 'total', 1, { 
//       error,
//       endpoint: 'updateUserById'
//     });
    
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// // Change password (UPDATE)
// exports.changePassword = async (req, res) => {
//   const startTime = Date.now();
//   incrementCounter('crud', 'update', 'total', 1);
//   incrementCounter('crud', 'update', 'password', 1);
  
//   try {
//     const { currentPassword, newPassword } = req.body;
//     const userId = req.userId;

//     const user = await User.findById(userId);
//     if (!user) {
//       incrementCounter('crud', 'update', 'failed', 1);
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Verify current password
//     const isMatch = await user.comparePassword(currentPassword);
//     if (!isMatch) {
//       incrementCounter('crud', 'update', 'failed', 1);
//       return res.status(400).json({ message: 'Current password is incorrect' });
//     }

//     // Update password
//     user.password = newPassword;
//     await user.save();

//     // Send password change notification email if service is available
//     const isEmailServiceAvailable = await checkEmailServiceHealth();
//     if (isEmailServiceAvailable) {
//       incrementCounter('email', 'byType', 'notification', 1);
//       await sendEmailWithRetry({
//         to: user.email,
//         subject: 'Password Changed Successfully',
//         html: `
//           <h1>Password Updated</h1>
//           <p>Your password was successfully changed.</p>
//           <p>If you didn't make this change, please contact support immediately.</p>
//         `
//       });
//     }

//     incrementCounter('crud', 'update', 'success', 1);
    
//     const responseTime = Date.now() - startTime;
//     incrementCounter('performance', null, null, 1, { responseTime });

//     res.json({ message: 'Password changed successfully' });
//   } catch (error) {
//     console.error('Change password error:', error);
    
//     incrementCounter('crud', 'update', 'failed', 1);
//     incrementCounter('system', 'errors', 'total', 1, { 
//       error,
//       endpoint: 'changePassword'
//     });
    
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// // Reset password (UPDATE)
// exports.resetPassword = async (req, res) => {
//   const startTime = Date.now();
//   incrementCounter('crud', 'update', 'total', 1);
//   incrementCounter('crud', 'update', 'password', 1);
  
//   try {
//     const { token, newPassword } = req.body;

//     // Verify token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
//     const user = await User.findById(decoded.userId);
//     if (!user) {
//       incrementCounter('crud', 'update', 'failed', 1);
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Update password
//     user.password = newPassword;
//     await user.save();

//     // Send confirmation email if service is available
//     const isEmailServiceAvailable = await checkEmailServiceHealth();
//     if (isEmailServiceAvailable) {
//       incrementCounter('email', 'byType', 'notification', 1);
//       await sendEmailWithRetry({
//         to: user.email,
//         subject: 'Password Reset Successful',
//         html: `
//           <h1>Password Reset Successful</h1>
//           <p>Your password has been reset successfully.</p>
//         `
//       });
//     }

//     incrementCounter('crud', 'update', 'success', 1);
    
//     const responseTime = Date.now() - startTime;
//     incrementCounter('performance', null, null, 1, { responseTime });

//     res.json({ message: 'Password reset successful' });
//   } catch (error) {
//     console.error('Reset password error:', error);
    
//     incrementCounter('crud', 'update', 'failed', 1);
//     incrementCounter('system', 'errors', 'total', 1, { 
//       error,
//       endpoint: 'resetPassword'
//     });
    
//     if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
//       return res.status(400).json({ message: 'Invalid or expired token' });
//     }
    
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// // Verify email (UPDATE)
// exports.verifyEmail = async (req, res) => {
//   const startTime = Date.now();
//   incrementCounter('crud', 'update', 'total', 1);
//   incrementCounter('crud', 'update', 'emailVerification', 1);
  
//   try {
//     const { token } = req.query;

//     // Verify token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
//     const user = await User.findById(decoded.userId);
//     if (!user) {
//       incrementCounter('crud', 'update', 'failed', 1);
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Check if already verified
//     if (user.isVerified) {
//       incrementCounter('crud', 'update', 'failed', 1);
//       return res.status(400).json({ message: 'Email already verified' });
//     }

//     // Update verification status
//     user.isVerified = true;
//     await user.save();

//     // Send welcome email if service is available
//     const isEmailServiceAvailable = await checkEmailServiceHealth();
//     if (isEmailServiceAvailable) {
//       incrementCounter('email', 'byType', 'welcome', 1);
//       await sendEmailWithRetry({
//         to: user.email,
//         subject: 'Welcome! Email Verified Successfully',
//         html: `
//           <h1>Welcome to Our Platform!</h1>
//           <p>Your email has been successfully verified.</p>
//           <p>You can now enjoy all features of our platform.</p>
//         `
//       });
//     }

//     incrementCounter('crud', 'update', 'success', 1);
    
//     const responseTime = Date.now() - startTime;
//     incrementCounter('performance', null, null, 1, { responseTime });

//     res.json({ message: 'Email verified successfully' });
//   } catch (error) {
//     console.error('Verify email error:', error);
    
//     incrementCounter('crud', 'update', 'failed', 1);
//     incrementCounter('system', 'errors', 'total', 1, { 
//       error,
//       endpoint: 'verifyEmail'
//     });
    
//     if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
//       return res.status(400).json({ message: 'Invalid or expired token' });
//     }
    
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// // Request password reset (UPDATE - First step)
// exports.requestPasswordReset = async (req, res) => {
//   const startTime = Date.now();
//   incrementCounter('crud', 'update', 'total', 1);
//   incrementCounter('crud', 'update', 'password', 1);
  
//   try {
//     const { email } = req.body;

//     // Check email service health
//     const isEmailServiceAvailable = await checkEmailServiceHealth();
//     if (!isEmailServiceAvailable) {
//       incrementCounter('crud', 'update', 'failed', 1);
//       return res.status(503).json({ 
//         message: 'Email service is currently unavailable. Please try again later.' 
//       });
//     }

//     const user = await User.findOne({ email: email.toLowerCase() });
//     if (!user) {
//       // Don't reveal that user doesn't exist for security
//       // But still count this as a request
//       const responseTime = Date.now() - startTime;
//       incrementCounter('performance', null, null, 1, { responseTime });
      
//       return res.json({ message: 'If an account exists with this email, a reset link has been sent' });
//     }

//     // Generate reset token
//     const resetToken = jwt.sign(
//       { userId: user._id },
//       process.env.JWT_SECRET,
//       { expiresIn: '1h' }
//     );

//     // Send reset email with retry
//     const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    
//     incrementCounter('email', 'byType', 'passwordReset', 1);
    
//     const emailSent = await sendEmailWithRetry({
//       to: user.email,
//       subject: 'Password Reset Request',
//       html: `
//         <h1>Password Reset</h1>
//         <p>You requested to reset your password.</p>
//         <p>Click the link below to reset your password:</p>
//         <a href="${resetUrl}">Reset Password</a>
//         <p>This link will expire in 1 hour.</p>
//         <p>If you didn't request this, please ignore this email.</p>
//       `
//     });

//     if (!emailSent) {
//       incrementCounter('crud', 'update', 'failed', 1);
//       return res.status(500).json({ 
//         message: 'Failed to send password reset email. Please try again later.' 
//       });
//     }

//     incrementCounter('crud', 'update', 'success', 1);
    
//     const responseTime = Date.now() - startTime;
//     incrementCounter('performance', null, null, 1, { responseTime });

//     res.json({ message: 'Password reset email sent' });
//   } catch (error) {
//     console.error('Request password reset error:', error);
    
//     incrementCounter('crud', 'update', 'failed', 1);
//     incrementCounter('system', 'errors', 'total', 1, { 
//       error,
//       endpoint: 'requestPasswordReset'
//     });
    
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// // ==================== DELETE OPERATIONS ====================

// // Delete user account (DELETE)
// exports.deleteAccount = async (req, res) => {
//   const startTime = Date.now();
//   incrementCounter('crud', 'delete', 'total', 1);
//   incrementCounter('crud', 'delete', 'self', 1);
  
//   try {
//     const userId = req.userId;

//     const user = await User.findById(userId);
//     if (!user) {
//       incrementCounter('crud', 'delete', 'failed', 1);
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Send deletion notification email if service is available
//     const isEmailServiceAvailable = await checkEmailServiceHealth();
//     if (isEmailServiceAvailable) {
//       incrementCounter('email', 'byType', 'notification', 1);
//       await sendEmailWithRetry({
//         to: user.email,
//         subject: 'Account Deletion Confirmation',
//         html: `
//           <h1>Account Deleted</h1>
//           <p>Your account has been successfully deleted.</p>
//           <p>We're sorry to see you go. You can always create a new account if you change your mind.</p>
//         `
//       });
//     }

//     // Delete user
//     await user.deleteOne();

//     incrementCounter('crud', 'delete', 'success', 1);
    
//     const responseTime = Date.now() - startTime;
//     incrementCounter('performance', null, null, 1, { responseTime });

//     res.json({ message: 'Account deleted successfully' });
//   } catch (error) {
//     console.error('Delete account error:', error);
    
//     incrementCounter('crud', 'delete', 'failed', 1);
//     incrementCounter('system', 'errors', 'total', 1, { 
//       error,
//       endpoint: 'deleteAccount'
//     });
    
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// // Delete user by ID (Admin only) (DELETE)
// exports.deleteUserById = async (req, res) => {
//   const startTime = Date.now();
//   incrementCounter('crud', 'delete', 'total', 1);
//   incrementCounter('crud', 'delete', 'admin', 1);
  
//   try {
//     const { id } = req.params;

//     // Check if user exists
//     const user = await User.findById(id);
//     if (!user) {
//       incrementCounter('crud', 'delete', 'failed', 1);
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Prevent deleting yourself if you're an admin
//     if (id === req.userId) {
//       incrementCounter('crud', 'delete', 'failed', 1);
//       return res.status(400).json({ message: 'You cannot delete your own account from admin panel' });
//     }

//     // Send deletion notification email if service is available
//     const isEmailServiceAvailable = await checkEmailServiceHealth();
//     if (isEmailServiceAvailable) {
//       incrementCounter('email', 'byType', 'notification', 1);
//       await sendEmailWithRetry({
//         to: user.email,
//         subject: 'Account Deleted by Administrator',
//         html: `
//           <h1>Account Deleted</h1>
//           <p>Your account has been deleted by an administrator.</p>
//           <p>If you believe this was a mistake, please contact support.</p>
//         `
//       });
//     }

//     // Delete user
//     await user.deleteOne();

//     incrementCounter('crud', 'delete', 'success', 1);
    
//     const responseTime = Date.now() - startTime;
//     incrementCounter('performance', null, null, 1, { responseTime });

//     res.json({ 
//       message: 'User deleted successfully',
//       deletedUser: {
//         id: user._id,
//         name: user.name,
//         email: user.email
//       }
//     });
//   } catch (error) {
//     console.error('Delete user by ID error:', error);
    
//     incrementCounter('crud', 'delete', 'failed', 1);
//     incrementCounter('system', 'errors', 'total', 1, { 
//       error,
//       endpoint: 'deleteUserById'
//     });
    
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// // Delete multiple users (Admin only) (DELETE)
// exports.deleteMultipleUsers = async (req, res) => {
//   const startTime = Date.now();
//   incrementCounter('crud', 'delete', 'total', 1);
//   incrementCounter('crud', 'delete', 'bulk', 1);
  
//   try {
//     const { userIds } = req.body;

//     if (!Array.isArray(userIds) || userIds.length === 0) {
//       incrementCounter('crud', 'delete', 'failed', 1);
//       return res.status(400).json({ message: 'Please provide an array of user IDs' });
//     }

//     // Prevent deleting yourself
//     if (userIds.includes(req.userId)) {
//       incrementCounter('crud', 'delete', 'failed', 1);
//       return res.status(400).json({ message: 'You cannot delete your own account' });
//     }

//     // Find users
//     const users = await User.find({ _id: { $in: userIds } });
//     const foundIds = users.map(user => user._id.toString());

//     // Find users that don't exist
//     const notFound = userIds.filter(id => !foundIds.includes(id));

//     // Send deletion emails if service is available
//     const isEmailServiceAvailable = await checkEmailServiceHealth();
//     if (isEmailServiceAvailable) {
//       for (const user of users) {
//         incrementCounter('email', 'byType', 'notification', 1);
//         await sendEmailWithRetry({
//           to: user.email,
//           subject: 'Account Deleted by Administrator',
//           html: `
//             <h1>Account Deleted</h1>
//             <p>Your account has been deleted by an administrator.</p>
//             <p>If you believe this was a mistake, please contact support.</p>
//           `
//         });
//       }
//     }

//     // Delete users
//     await User.deleteMany({ _id: { $in: foundIds } });

//     incrementCounter('crud', 'delete', 'success', 1);
    
//     const responseTime = Date.now() - startTime;
//     incrementCounter('performance', null, null, 1, { responseTime });

//     res.json({
//       message: `${users.length} users deleted successfully`,
//       deletedCount: users.length,
//       notFound: notFound.length > 0 ? notFound : undefined
//     });
//   } catch (error) {
//     console.error('Delete multiple users error:', error);
    
//     incrementCounter('crud', 'delete', 'failed', 1);
//     incrementCounter('system', 'errors', 'total', 1, { 
//       error,
//       endpoint: 'deleteMultipleUsers'
//     });
    
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// // ==================== AUTHENTICATION OPERATIONS ====================

// // Login user
// exports.login = async (req, res) => {
//   const startTime = Date.now();
//   incrementCounter('auth', 'login', 'total', 1);
  
//   try {
//     const { email, password } = req.body;

//     // Find user
//     const user = await User.findOne({ email: email.toLowerCase() });
//     if (!user) {
//       incrementCounter('auth', 'login', 'failed', 1);
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }

//     // Check password
//     const isMatch = await user.comparePassword(password);
//     if (!isMatch) {
//       incrementCounter('auth', 'login', 'failed', 1);
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }

//     // Check if email is verified (optional - you can comment this out)
//     if (!user.isVerified) {
//       incrementCounter('auth', 'login', 'unverified', 1);
//       // Still allow login but track unverified logins
//     }

//     // Update last login
//     user.lastLogin = new Date();
//     await user.save();

//     // Generate token
//     const token = generateToken(user._id);

//     incrementCounter('auth', 'login', 'success', 1);
    
//     const responseTime = Date.now() - startTime;
//     incrementCounter('performance', null, null, 1, { responseTime });

//     res.json({
//       message: 'Login successful',
//       token,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         phone: user.phone,
//         role: user.role,
//         isVerified: user.isVerified
//       }
//     });
//   } catch (error) {
//     console.error('Login error:', error);
    
//     incrementCounter('auth', 'login', 'failed', 1);
//     incrementCounter('system', 'errors', 'total', 1, { 
//       error,
//       endpoint: 'login'
//     });
    
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// // Logout
// exports.logout = async (req, res) => {
//   const startTime = Date.now();
//   incrementCounter('auth', 'logout', 'total', 1);
  
//   try {
//     const responseTime = Date.now() - startTime;
//     incrementCounter('performance', null, null, 1, { responseTime });
    
//     res.json({ message: 'Logged out successfully' });
//   } catch (error) {
//     console.error('Logout error:', error);
    
//     incrementCounter('system', 'errors', 'total', 1, { 
//       error,
//       endpoint: 'logout'
//     });
    
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// // Refresh token
// exports.refreshToken = async (req, res) => {
//   const startTime = Date.now();
//   incrementCounter('auth', 'tokenRefresh', 'total', 1);
  
//   try {
//     const userId = req.userId;
    
//     // Generate new token
//     const token = generateToken(userId);

//     incrementCounter('auth', 'tokenRefresh', 'success', 1);
    
//     const responseTime = Date.now() - startTime;
//     incrementCounter('performance', null, null, 1, { responseTime });

//     res.json({
//       message: 'Token refreshed successfully',
//       token
//     });
//   } catch (error) {
//     console.error('Refresh token error:', error);
    
//     incrementCounter('auth', 'tokenRefresh', 'failed', 1);
//     incrementCounter('system', 'errors', 'total', 1, { 
//       error,
//       endpoint: 'refreshToken'
//     });
    
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// // Check system health
// exports.checkSystemHealth = async (req, res) => {
//   const startTime = Date.now();
//   incrementCounter('system', null, 'healthChecks', 1);
  
//   try {
//     const health = {
//       status: 'healthy',
//       timestamp: new Date(),
//       services: {
//         database: 'unhealthy',
//         email: 'unhealthy',
//         api: 'healthy'
//       },
//       environment: process.env.NODE_ENV || 'development',
//       mongooseVersion: mongoose.version,
//       nodeVersion: process.version,
//       actionCounters: {
//         totalRegistrations: actionCounters.registration.total,
//         totalEmails: actionCounters.email.total,
//         totalCRUD: actionCounters.crud.create.total + 
//                    actionCounters.crud.read.total + 
//                    actionCounters.crud.update.total + 
//                    actionCounters.crud.delete.total,
//         totalLogins: actionCounters.auth.login.total
//       }
//     };

//     // Check database connection
//     try {
//       // Check if mongoose is connected
//       if (mongoose.connection.readyState === 1) {
//         incrementCounter('system', null, 'databasePings', 1);
//         // Try to ping the database
//         await mongoose.connection.db.admin().ping();
//         health.services.database = 'healthy';
//         health.databaseInfo = {
//           name: mongoose.connection.db.databaseName,
//           host: mongoose.connection.host,
//           port: mongoose.connection.port,
//           state: mongoose.connection.readyState
//         };
//       } else {
//         health.services.database = 'unhealthy';
//         health.status = 'degraded';
//         health.databaseState = mongoose.connection.readyState;
//         health.databaseStates = {
//           0: 'disconnected',
//           1: 'connected',
//           2: 'connecting',
//           3: 'disconnecting'
//         };
//       }
//     } catch (dbError) {
//       health.services.database = 'unhealthy';
//       health.status = 'degraded';
//       health.databaseError = dbError.message;
//       health.databaseMessage = 'Database connection failed. Check if MongoDB is running.';
      
//       incrementCounter('system', 'errors', 'total', 1, { 
//         error: dbError,
//         endpoint: 'checkSystemHealth/database'
//       });
//     }

//     // Check email service
//     try {
//       const isEmailHealthy = await checkEmailServiceHealth();
//       health.services.email = isEmailHealthy ? 'healthy' : 'unhealthy';
      
//       if (!isEmailHealthy) {
//         health.status = 'degraded';
//         health.emailMessage = 'Email service is unavailable. User registration may be affected.';
        
//         // Check specific email issues
//         if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
//           health.emailDetails = 'Email configuration missing in .env file';
//         } else if (SKIP_EMAIL_ON_LIMIT) {
//           health.emailDetails = 'Email sending skipped due to Gmail daily limits';
//         } else {
//           health.emailDetails = 'Email service configuration issue';
//         }
//       } else {
//         health.emailDetails = 'Email service configured and ready';
//       }
//     } catch (emailError) {
//       health.services.email = 'unhealthy';
//       health.status = 'degraded';
//       health.emailError = emailError.message;
      
//       incrementCounter('system', 'errors', 'total', 1, { 
//         error: emailError,
//         endpoint: 'checkSystemHealth/email'
//       });
//     }

//     // Check if we're in development mode with database disabled
//     if (health.services.database === 'unhealthy' && 
//         (process.env.NODE_ENV === 'development' || process.env.SKIP_DB === 'true')) {
//       health.developmentMode = true;
//       health.message = 'Running in development mode without database';
//       health.registrationStatus = 'Registration will work (development mode)';
//     } else if (health.services.database === 'unhealthy') {
//       health.registrationStatus = 'Registration blocked - Database unavailable';
//     } else if (health.services.email === 'unhealthy') {
//       health.registrationStatus = 'Registration works but emails will be skipped';
//     } else {
//       health.registrationStatus = 'All systems operational';
//     }

//     // Set appropriate HTTP status code
//     let statusCode = 200;
//     if (health.status === 'degraded') statusCode = 503;
//     if (health.status === 'unhealthy') statusCode = 503;

//     const responseTime = Date.now() - startTime;
//     incrementCounter('performance', null, null, 1, { responseTime });

//     res.status(statusCode).json(health);
//   } catch (error) {
//     console.error('Health check error:', error);
    
//     incrementCounter('system', 'errors', 'total', 1, { 
//       error,
//       endpoint: 'checkSystemHealth'
//     });
    
//     res.status(500).json({ 
//       status: 'unhealthy',
//       message: 'System health check failed',
//       error: process.env.NODE_ENV === 'development' ? error.message : undefined,
//       timestamp: new Date()
//     });
//   }
// };

// // Test endpoint to verify everything works
// exports.testSystem = async (req, res) => {
//   const startTime = Date.now();
  
//   try {
//     // Test database connection
//     const dbPing = await User.db.command({ ping: 1 });
//     incrementCounter('system', null, 'databasePings', 1);
    
//     // Test user count
//     const userCount = await User.countDocuments();
    
//     // Test JWT
//     const testToken = jwt.sign({ test: true }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
//     // Test email config (without sending)
//     const hasEmailConfig = !!(process.env.SMTP_HOST && process.env.SMTP_USER);

//     const responseTime = Date.now() - startTime;
//     incrementCounter('performance', null, null, 1, { responseTime });
    
//     // Add action counters to test response
//     const counterSummary = {
//       totalRegistrations: actionCounters.registration.total,
//       successfulRegistrations: actionCounters.registration.success,
//       failedRegistrations: actionCounters.registration.failed,
//       emailsSent: actionCounters.email.sent,
//       emailsFailed: actionCounters.email.failed,
//       logins: actionCounters.auth.login.total,
//       totalCRUD: actionCounters.crud.create.total + 
//                  actionCounters.crud.read.total + 
//                  actionCounters.crud.update.total + 
//                  actionCounters.crud.delete.total
//     };
    
//     res.json({
//       status: '✅ SYSTEM IS WORKING',
//       timestamp: new Date(),
//       database: dbPing.ok === 1 ? '✅ Connected' : '❌ Disconnected',
//       users: userCount,
//       jwt: '✅ Working',
//       email: hasEmailConfig ? '✅ Configured (Gmail limit hit)' : '❌ Not configured',
//       skipEmailFlag: SKIP_EMAIL_ON_LIMIT ? '✅ Active (skipping emails)' : '❌ Inactive',
//       message: 'Your system is working! The email error is just Gmail limits.',
//       actionCounters: counterSummary,
//       nextSteps: [
//         'Continue testing other endpoints',
//         'Test login with created users',
//         'Test profile updates',
//         'Test password changes',
//         'Set SKIP_EMAIL_ON_LIMIT = false tomorrow when Gmail resets',
//         'Check action statistics at /api/users/action-statistics',
//         'Reset counters at /api/users/reset-counters (admin only)'
//       ]
//     });
//   } catch (error) {
//     incrementCounter('system', 'errors', 'total', 1, { 
//       error,
//       endpoint: 'testSystem'
//     });
    
//     res.status(500).json({ error: error.message });
//   }
// };















const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { sendEmail } = require('../mails/sendEmail');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

// ==================== ACTION COUNTING FUNCTIONS ====================

// Global counters object to track all actions
const actionCounters = {
  // User registration counters
  registration: {
    total: 0,
    success: 0,
    failed: 0,
    blocked: 0,
    development: 0,
    byRole: {
      user: 0,
      admin: 0,
      superadmin: 0
    }
  },
  
  // Email counters
  email: {
    total: 0,
    sent: 0,
    failed: 0,
    skipped: 0,
    retries: 0,
    byType: {
      verification: 0,
      passwordReset: 0,
      notification: 0,
      welcome: 0,
      systemAlert: 0
    }
  },
  
  // CRUD operation counters
  crud: {
    create: {
      total: 0,
      single: 0,
      bulk: 0,
      success: 0,
      failed: 0
    },
    read: {
      total: 0,
      all: 0,
      byId: 0,
      byEmail: 0,
      profile: 0,
      statistics: 0,
      search: 0
    },
    update: {
      total: 0,
      profile: 0,
      adminUpdate: 0,
      password: 0,
      emailVerification: 0,
      success: 0,
      failed: 0
    },
    delete: {
      total: 0,
      self: 0,
      admin: 0,
      bulk: 0,
      success: 0,
      failed: 0
    }
  },
  
  // Authentication counters
  auth: {
    login: {
      total: 0,
      success: 0,
      failed: 0,
      unverified: 0
    },
    logout: {
      total: 0
    },
    tokenRefresh: {
      total: 0,
      success: 0,
      failed: 0
    }
  },
  
  // System health counters
  system: {
    healthChecks: 0,
    emailServiceChecks: 0,
    databasePings: 0,
    errors: {
      total: 0,
      byType: {}
    },
    lastError: null
  },
  
  // Rate limiting counters
  rateLimit: {
    exceeded: 0,
    byEndpoint: {}
  },
  
  // Performance metrics
  performance: {
    responseTimes: [],
    averageResponseTime: 0,
    slowestResponse: 0,
    fastestResponse: Infinity
  },
  
  // Timestamps
  timestamps: {
    serverStart: new Date(),
    lastReset: new Date(),
    lastAction: null
  }
};

// Function to increment counters
const incrementCounter = (category, subCategory, action, value = 1, details = {}) => {
  try {
    // Update timestamp
    actionCounters.timestamps.lastAction = new Date();
    
    // Navigate through the nested structure
    if (category && actionCounters[category]) {
      if (subCategory && actionCounters[category][subCategory]) {
        if (action && actionCounters[category][subCategory][action] !== undefined) {
          actionCounters[category][subCategory][action] += value;
        } else if (action && typeof actionCounters[category][subCategory] === 'object') {
          // Handle dynamic properties like byRole, byType
          if (actionCounters[category][subCategory][action] !== undefined) {
            actionCounters[category][subCategory][action] += value;
          } else {
            // Initialize if not exists
            actionCounters[category][subCategory][action] = value;
          }
        } else {
          actionCounters[category][subCategory] += value;
        }
      } else if (action && actionCounters[category][action] !== undefined) {
        actionCounters[category][action] += value;
      } else if (typeof actionCounters[category] === 'number') {
        actionCounters[category] += value;
      }
    }
    
    // Track errors specifically
    if (details.error) {
      actionCounters.system.errors.total += value;
      const errorType = details.error.name || 'UnknownError';
      actionCounters.system.errors.byType[errorType] = 
        (actionCounters.system.errors.byType[errorType] || 0) + value;
      actionCounters.system.lastError = {
        type: errorType,
        message: details.error.message,
        timestamp: new Date(),
        endpoint: details.endpoint
      };
    }
    
    // Track response time
    if (details.responseTime) {
      actionCounters.performance.responseTimes.push(details.responseTime);
      // Keep only last 100 response times for calculation
      if (actionCounters.performance.responseTimes.length > 100) {
        actionCounters.performance.responseTimes.shift();
      }
      
      // Update metrics
      const times = actionCounters.performance.responseTimes;
      actionCounters.performance.averageResponseTime = 
        times.reduce((a, b) => a + b, 0) / times.length;
      actionCounters.performance.slowestResponse = 
        Math.max(actionCounters.performance.slowestResponse, details.responseTime);
      actionCounters.performance.fastestResponse = 
        Math.min(actionCounters.performance.fastestResponse, details.responseTime);
    }
    
  } catch (error) {
    console.error('Error in incrementCounter:', error);
  }
};

// Function to get action statistics
exports.getActionStatistics = async (req, res) => {
  try {
    incrementCounter('system', null, 'healthChecks');
    
    const uptime = Date.now() - actionCounters.timestamps.serverStart.getTime();
    
    const statistics = {
      ...actionCounters,
      uptime: {
        milliseconds: uptime,
        seconds: Math.floor(uptime / 1000),
        minutes: Math.floor(uptime / (1000 * 60)),
        hours: Math.floor(uptime / (1000 * 60 * 60)),
        days: Math.floor(uptime / (1000 * 60 * 60 * 24))
      },
      performance: {
        ...actionCounters.performance,
        currentAverage: actionCounters.performance.averageResponseTime.toFixed(2) + 'ms'
      },
      summary: {
        totalActions: 
          actionCounters.registration.total +
          actionCounters.email.total +
          actionCounters.crud.create.total +
          actionCounters.crud.read.total +
          actionCounters.crud.update.total +
          actionCounters.crud.delete.total +
          actionCounters.auth.login.total +
          actionCounters.auth.logout.total +
          actionCounters.auth.tokenRefresh.total,
        successRate: calculateSuccessRate(),
        emailSuccessRate: calculateEmailSuccessRate()
      }
    };
    
    res.json({
      success: true,
      data: statistics
    });
  } catch (error) {
    console.error('Get action statistics error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
};

// Helper function to calculate success rate
const calculateSuccessRate = () => {
  const totalOperations = 
    actionCounters.registration.total +
    actionCounters.crud.create.total +
    actionCounters.crud.update.total +
    actionCounters.crud.delete.total;
    
  const successfulOperations = 
    actionCounters.registration.success +
    actionCounters.crud.create.success +
    actionCounters.crud.update.success +
    actionCounters.crud.delete.success;
    
  return totalOperations > 0 
    ? ((successfulOperations / totalOperations) * 100).toFixed(2) + '%'
    : 'N/A';
};

// Helper function to calculate email success rate
const calculateEmailSuccessRate = () => {
  const totalEmailAttempts = actionCounters.email.sent + actionCounters.email.failed;
  return totalEmailAttempts > 0
    ? ((actionCounters.email.sent / totalEmailAttempts) * 100).toFixed(2) + '%'
    : 'N/A';
};

// Function to reset counters (admin only)
exports.resetActionCounters = async (req, res) => {
  try {
    // Reset all counters but preserve server start time
    const serverStart = actionCounters.timestamps.serverStart;
    
    // Reset all counters to zero
    actionCounters.registration = {
      total: 0, success: 0, failed: 0, blocked: 0, development: 0,
      byRole: { user: 0, admin: 0, superadmin: 0 }
    };
    
    actionCounters.email = {
      total: 0, sent: 0, failed: 0, skipped: 0, retries: 0,
      byType: { verification: 0, passwordReset: 0, notification: 0, welcome: 0, systemAlert: 0 }
    };
    
    actionCounters.crud = {
      create: { total: 0, single: 0, bulk: 0, success: 0, failed: 0 },
      read: { total: 0, all: 0, byId: 0, byEmail: 0, profile: 0, statistics: 0, search: 0 },
      update: { total: 0, profile: 0, adminUpdate: 0, password: 0, emailVerification: 0, success: 0, failed: 0 },
      delete: { total: 0, self: 0, admin: 0, bulk: 0, success: 0, failed: 0 }
    };
    
    actionCounters.auth = {
      login: { total: 0, success: 0, failed: 0, unverified: 0 },
      logout: { total: 0 },
      tokenRefresh: { total: 0, success: 0, failed: 0 }
    };
    
    actionCounters.system = {
      healthChecks: 0, emailServiceChecks: 0, databasePings: 0,
      errors: { total: 0, byType: {} },
      lastError: null
    };
    
    actionCounters.rateLimit = { exceeded: 0, byEndpoint: {} };
    actionCounters.performance = {
      responseTimes: [], averageResponseTime: 0, slowestResponse: 0, fastestResponse: Infinity
    };
    
    actionCounters.timestamps = {
      serverStart: serverStart,
      lastReset: new Date(),
      lastAction: null
    };
    
    res.json({
      success: true,
      message: 'Action counters reset successfully',
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Reset action counters error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
};

// ==================== EXISTING CODE WITH COUNTERS ADDED ====================

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign(
    { userId }, // ✅ payload key
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
};

// Helper function to check email service health
async function checkEmailServiceHealth() {
  const startTime = Date.now();
  incrementCounter('system', null, 'emailServiceChecks');
  
  try {
    // Check if email configuration is present
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.error('Email configuration missing');
      incrementCounter('system', 'errors', 'total', 1, { 
        error: new Error('Email config missing'),
        endpoint: 'checkEmailServiceHealth'
      });
      return false;
    }
    
    // Test email service connection
try {
  const nodemailer = require("nodemailer");

  const port = parseInt(process.env.SMTP_PORT) || 587;

  const testTransporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: port,
    secure: port === 465, // automatically correct for Gmail
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
      
      await testTransporter.verify();
      console.log('✅ Email service health check passed');
      
      const responseTime = Date.now() - startTime;
      incrementCounter('performance', null, null, 1, { responseTime });
      
      return true;
    } catch (transporterError) {
      console.error('Email service health check failed:', transporterError.message);
      incrementCounter('system', 'errors', 'total', 1, { 
        error: transporterError,
        endpoint: 'checkEmailServiceHealth/transporter'
      });
      return false;
    }
  } catch (error) {
    console.error('Email service health check error:', error.message);
    incrementCounter('system', 'errors', 'total', 1, { 
      error,
      endpoint: 'checkEmailServiceHealth'
    });
    return false;
  }
}

// Helper function to send system down notification
const sendSystemDownNotification = async (email, name) => {
  incrementCounter('email', 'total', null, 1);
  incrementCounter('email', 'byType', 'systemAlert', 1);
  
  try {
    const canSendEmail = await checkEmailServiceHealth();
    
    if (!canSendEmail) {
      console.log('Cannot send system down notification - email service is down');
      incrementCounter('email', null, 'failed', 1);
      return;
    }

    await sendEmail({
      to: process.env.ADMIN_EMAIL || 'admin@example.com',
      subject: '⚠️ Email Service Down - Registration Blocked',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #dc3545; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border: 1px solid #dee2e6; border-top: none; border-radius: 0 0 5px 5px; }
            .alert-box { background: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 5px; margin: 15px 0; }
            .user-info { background: white; padding: 15px; border-left: 4px solid #dc3545; margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>⚠️ Email Service Down Alert</h2>
            </div>
            <div class="content">
              <div class="alert-box">
                <h3>System Alert</h3>
                <p>The email service is currently unavailable. User registration is being blocked.</p>
              </div>
              
              <div class="user-info">
                <h4>Registration Blocked for:</h4>
                <p><strong>👤 Name:</strong> ${name}</p>
                <p><strong>📧 Email:</strong> ${email}</p>
                <p><strong>⏰ Time:</strong> ${new Date().toLocaleString()}</p>
                <p><strong>🔧 System:</strong> User Registration System</p>
              </div>
              
              <p><strong>Action Required:</strong></p>
              <ul>
                <li>Check email service configuration</li>
                <li>Verify SMTP credentials</li>
                <li>Restart email service if necessary</li>
              </ul>
              
              <p>This is an automated alert from the system monitoring service.</p>
            </div>
          </div>
        </body>
        </html>
      `
    });
    
    console.log('✅ System down notification sent to admin');
    incrementCounter('email', null, 'sent', 1);
  } catch (error) {
    console.error('Failed to send system down notification:', error.message);
    incrementCounter('email', null, 'failed', 1);
    incrementCounter('system', 'errors', 'total', 1, { 
      error,
      endpoint: 'sendSystemDownNotification'
    });
  }
};

// Helper function for email sending with retry
async function sendEmailWithRetry(emailData, maxRetries = 2) {
  incrementCounter('email', 'total', null, 1);
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const startTime = Date.now();
    
    try {
      await sendEmail(emailData);
      console.log(`✅ Email sent successfully on attempt ${attempt}`);
      
      const responseTime = Date.now() - startTime;
      incrementCounter('email', null, 'sent', 1);
      incrementCounter('performance', null, null, 1, { responseTime });
      
      return true;
    } catch (error) {
      console.error(`❌ Email send attempt ${attempt} failed:`, error.message);
      
      if (attempt < maxRetries) {
        const delay = Math.min(1000 * Math.pow(2, attempt), 5000);
        console.log(`⏳ Waiting ${delay}ms before retry...`);
        incrementCounter('email', null, 'retries', 1);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      
      console.error('❌ All email retry attempts failed');
      incrementCounter('email', null, 'failed', 1);
      incrementCounter('system', 'errors', 'total', 1, { 
        error,
        endpoint: 'sendEmailWithRetry'
      });
      
      return false;
    }
  }
}

// ==================== CREATE OPERATIONS ====================

// Register new user (CREATE)
exports.register = async (req, res) => {
  const startTime = Date.now();
  incrementCounter('registration', null, 'total', 1);
  incrementCounter('crud', 'create', 'total', 1);
  incrementCounter('crud', 'create', 'single', 1);
  
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      incrementCounter('registration', null, 'failed', 1);
      incrementCounter('crud', 'create', 'failed', 1);
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, phone, confirmPassword, role } = req.body;

    // Validate confirmPassword if provided
    if (confirmPassword && password !== confirmPassword) {
      incrementCounter('registration', null, 'failed', 1);
      incrementCounter('crud', 'create', 'failed', 1);
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      incrementCounter('registration', null, 'failed', 1);
      incrementCounter('crud', 'create', 'failed', 1);
      return res.status(409).json({ message: 'User already exists' });
    }

    // Check email service health before proceeding
    const isEmailServiceAvailable = await checkEmailServiceHealth();
    
    if (!isEmailServiceAvailable) {
      console.log(`❌ Email service down - Registration blocked for ${email}`);
      incrementCounter('registration', null, 'blocked', 1);
      
      // Try to send system down notification
      try {
        await sendSystemDownNotification(email, name);
      } catch (notificationError) {
        console.error('System down notification failed:', notificationError.message);
      }
      
      // DEVELOPMENT MODE: Allow registration even when email service is down
      if (process.env.NODE_ENV === 'development') {
        console.log('⚠️ Development mode: Allowing registration without email verification');
        incrementCounter('registration', null, 'development', 1);
        
        // Create new user anyway
        const user = new User({
          name,
          email: email.toLowerCase(),
          password,
          phone,
          role: role || 'user',
          isVerified: false
        });

        await user.save();
        console.log(`✅ User created (no email): ${email}`);

        // Update role counter
        incrementCounter('registration', 'byRole', user.role || 'user', 1);
        incrementCounter('registration', null, 'success', 1);
        incrementCounter('crud', 'create', 'success', 1);

        // Generate auth token
        const token = generateToken(user._id);

        const responseTime = Date.now() - startTime;
        incrementCounter('performance', null, null, 1, { responseTime });

        return res.status(201).json({
          message: 'User registered successfully (email verification skipped in development)',
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            isVerified: false
          },
          warning: 'Email verification was skipped due to Gmail daily limits'
        });
      }
      
      incrementCounter('registration', null, 'failed', 1);
      incrementCounter('crud', 'create', 'failed', 1);
      
      return res.status(503).json({ 
        message: 'Email service is currently unavailable. Please try again later or contact support.' 
      });
    }

    // Create new user
    const user = new User({
      name,
      email: email.toLowerCase(),
      password,
      phone,
      role: role || 'user',
      isVerified: false
    });

    await user.save();
    console.log(`✅ User created: ${email}`);

    // Generate verification token
    const verificationToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Send verification email with retry logic
    const verificationUrl = `${process.env.FRONTEND_URL}/auth/verify-email?token=${verificationToken}`;
    
    incrementCounter('email', 'byType', 'verification', 1);
    
    const emailSent = await sendEmailWithRetry({
      to: user.email,
      subject: 'Verify Your Email',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #4a6fa5; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 5px 5px; }
            .button { 
              display: inline-block; 
              background: #4a6fa5; 
              color: white; 
              padding: 12px 24px; 
              text-decoration: none; 
              border-radius: 5px;
              margin: 20px 0;
            }
            .code-box { 
              background: #f0f0f0; 
              padding: 10px; 
              border-radius: 5px; 
              font-family: monospace; 
              margin: 10px 0;
              word-break: break-all;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Email Verification</h1>
              <p>${process.env.COMPANY_NAME || 'Our Service'}</p>
            </div>
            <div class="content">
              <h2>Hello ${user.name},</h2>
              <p>Thank you for registering with us! Please verify your email address to complete your registration.</p>
              
              <div style="text-align: center;">
                <a href="${verificationUrl}" class="button">Verify Email Address</a>
              </div>
              
              <p>Or copy and paste this link in your browser:</p>
              <div class="code-box">${verificationUrl}</div>
              
              <p><strong>Important:</strong> This verification link will expire in 24 hours.</p>
              
              <p>If you didn't create an account with us, please ignore this email.</p>
              
              <p>Best regards,<br>
              <strong>${process.env.COMPANY_NAME || 'The Team'}</strong></p>
            </div>
          </div>
        </body>
        </html>
      `
    });

    if (!emailSent) {
      // DEVELOPMENT MODE: Don't delete user if email fails
      if (process.env.NODE_ENV === 'development') {
        console.log('⚠️ Email sending failed, but keeping user (development mode)');
        incrementCounter('registration', null, 'development', 1);
        
        // Generate auth token anyway
        const token = generateToken(user._id);

        // Update role counter
        incrementCounter('registration', 'byRole', user.role || 'user', 1);
        incrementCounter('registration', null, 'success', 1);
        incrementCounter('crud', 'create', 'success', 1);

        const responseTime = Date.now() - startTime;
        incrementCounter('performance', null, null, 1, { responseTime });

        return res.status(201).json({
          message: 'User registered successfully (email verification failed but user created)',
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            isVerified: false
          },
          warning: 'Email verification failed due to Gmail limits. User was still created.'
        });
      }
      
      // PRODUCTION: Delete user if email fails
      await User.findByIdAndDelete(user._id);
      
      console.error('❌ Email sending failed for user:', email);
      
      incrementCounter('registration', null, 'failed', 1);
      incrementCounter('crud', 'create', 'failed', 1);
      
      return res.status(500).json({ 
        message: 'Failed to send verification email. Our system is experiencing issues. Please try again later.'
      });
    }

    console.log(`✅ Verification email sent to ${email}`);

    // Update counters
    incrementCounter('registration', 'byRole', user.role || 'user', 1);
    incrementCounter('registration', null, 'success', 1);
    incrementCounter('crud', 'create', 'success', 1);

    // Generate auth token
    const token = generateToken(user._id);

    const responseTime = Date.now() - startTime;
    incrementCounter('performance', null, null, 1, { responseTime });

    res.status(201).json({
      message: 'User registered successfully. Please verify your email.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isVerified: false
      }
    });
  } catch (error) {
    console.error('❌ Registration error:', error);
    
    incrementCounter('registration', null, 'failed', 1);
    incrementCounter('crud', 'create', 'failed', 1);
    incrementCounter('system', 'errors', 'total', 1, { 
      error,
      endpoint: 'register'
    });
    
    // Check if it's a duplicate key error
    if (error.code === 11000 || error.message.includes('duplicate key')) {
      return res.status(409).json({ message: 'User already exists' });
    }
    
    // Check if it's a validation error
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: Object.values(error.errors).map(err => err.message) 
      });
    }
    
    res.status(500).json({ 
      message: 'Server error during registration',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Create multiple users (Bulk Create)
exports.createMultipleUsers = async (req, res) => {
  const startTime = Date.now();
  incrementCounter('crud', 'create', 'total', 1);
  incrementCounter('crud', 'create', 'bulk', 1);
  
  try {
    const usersData = req.body.users;
    
    if (!Array.isArray(usersData) || usersData.length === 0) {
      incrementCounter('crud', 'create', 'failed', 1);
      return res.status(400).json({ message: 'Please provide an array of users' });
    }

    // Check email service health before proceeding
    const isEmailServiceAvailable = await checkEmailServiceHealth();
    
    if (!isEmailServiceAvailable) {
      incrementCounter('crud', 'create', 'failed', 1);
      return res.status(503).json({ 
        message: 'Email service is currently unavailable. Bulk user creation is blocked.' 
      });
    }

    // Validate each user
    const errors = [];
    const validUsers = [];

    for (const userData of usersData) {
      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email.toLowerCase() });
      if (existingUser) {
        errors.push(`User with email ${userData.email} already exists`);
      } else {
        validUsers.push({
          ...userData,
          email: userData.email.toLowerCase(),
          role: userData.role || 'user',
          isVerified: false
        });
      }
    }

    if (validUsers.length === 0) {
      incrementCounter('crud', 'create', 'failed', 1);
      return res.status(400).json({ 
        message: 'No valid users to create', 
        errors 
      });
    }

    // Create users
    const createdUsers = await User.insertMany(validUsers);
    
    // Update role counters
    createdUsers.forEach(user => {
      incrementCounter('registration', 'byRole', user.role || 'user', 1);
    });

    // Send verification emails
    const emailResults = [];
    for (const user of createdUsers) {
      const verificationToken = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
      
      incrementCounter('email', 'byType', 'verification', 1);
      
      try {
        await sendEmailWithRetry({
          to: user.email,
          subject: 'Verify Your Email',
          html: `
            <h1>Email Verification</h1>
            <p>Please click the link below to verify your email:</p>
            <a href="${verificationUrl}">Verify Email</a>
          `
        });
        emailResults.push({ email: user.email, status: 'sent' });
      } catch (emailError) {
        emailResults.push({ email: user.email, status: 'failed', error: emailError.message });
      }
    }

    incrementCounter('crud', 'create', 'success', 1);
    
    const responseTime = Date.now() - startTime;
    incrementCounter('performance', null, null, 1, { responseTime });

    res.status(201).json({
      message: `${createdUsers.length} users created successfully`,
      created: createdUsers.length,
      failed: errors.length,
      emailResults: emailResults,
      errors: errors.length > 0 ? errors : undefined,
      users: createdUsers.map(user => ({
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }))
    });
  } catch (error) {
    console.error('Bulk create error:', error);
    
    incrementCounter('crud', 'create', 'failed', 1);
    incrementCounter('system', 'errors', 'total', 1, { 
      error,
      endpoint: 'createMultipleUsers'
    });
    
    res.status(500).json({ 
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// ==================== READ OPERATIONS ====================

// Get all users (READ)
exports.getAllUsers = async (req, res) => {
  const startTime = Date.now();
  incrementCounter('crud', 'read', 'total', 1);
  incrementCounter('crud', 'read', 'all', 1);
  
  try {
    const { 
      page = 1, 
      limit = 10, 
      sortBy = 'createdAt', 
      sortOrder = 'desc',
      search = '',
      role = '',
      verified = ''
    } = req.query;

    // Build query
    const query = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (role) {
      query.role = role;
    }
    
    if (verified !== '') {
      query.isVerified = verified === 'true';
    }

    // Calculate pagination
    const skip = (page - 1) * limit;
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    // Get users with pagination
    const users = await User.find(query)
      .select('-password')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count
    const totalUsers = await User.countDocuments(query);
    const totalPages = Math.ceil(totalUsers / limit);

    const responseTime = Date.now() - startTime;
    incrementCounter('performance', null, null, 1, { responseTime });

    res.json({
      users,
      pagination: {
        total: totalUsers,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Get all users error:', error);
    
    incrementCounter('system', 'errors', 'total', 1, { 
      error,
      endpoint: 'getAllUsers'
    });
    
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user by ID (READ)
exports.getUserById = async (req, res) => {
  const startTime = Date.now();
  incrementCounter('crud', 'read', 'total', 1);
  incrementCounter('crud', 'read', 'byId', 1);
  
  try {
    const { id } = req.params;
    
    const user = await User.findById(id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const responseTime = Date.now() - startTime;
    incrementCounter('performance', null, null, 1, { responseTime });

    res.json(user);
  } catch (error) {
    console.error('Get user by ID error:', error);
    
    incrementCounter('system', 'errors', 'total', 1, { 
      error,
      endpoint: 'getUserById'
    });
    
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUserByEmail = async (req, res) => {
  const startTime = Date.now();
  incrementCounter('crud', 'read', 'total', 1);
  incrementCounter('crud', 'read', 'byEmail', 1);
  
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const responseTime = Date.now() - startTime;
    incrementCounter('performance', null, null, 1, { responseTime });

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get user by email error:', error);
    
    incrementCounter('system', 'errors', 'total', 1, { 
      error,
      endpoint: 'getUserByEmail'
    });
    
    res.status(500).json({
      success: false,
      message: 'Server error fetching user by email',
      error: error.message
    });
  }
};

// Get current user profile (READ)
exports.getCurrentUser = async (req, res) => {
  const startTime = Date.now();
  incrementCounter('crud', 'read', 'total', 1);
  incrementCounter('crud', 'read', 'profile', 1);
  
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const responseTime = Date.now() - startTime;
    incrementCounter('performance', null, null, 1, { responseTime });

    res.json(user);
  } catch (error) {
    console.error('Get current user error:', error);
    
    incrementCounter('system', 'errors', 'total', 1, { 
      error,
      endpoint: 'getCurrentUser'
    });
    
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user statistics (READ)
exports.getUserStatistics = async (req, res) => {
  const startTime = Date.now();
  incrementCounter('crud', 'read', 'total', 1);
  incrementCounter('crud', 'read', 'statistics', 1);
  
  try {
    const totalUsers = await User.countDocuments();
    const verifiedUsers = await User.countDocuments({ isVerified: true });
    const adminUsers = await User.countDocuments({ role: 'admin' });
    const regularUsers = await User.countDocuments({ role: 'user' });
    
    // Get today's new users
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const newUsersToday = await User.countDocuments({ 
      createdAt: { $gte: today } 
    });

    // Get active users (logged in last 7 days)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const activeUsers = await User.countDocuments({ 
      lastLogin: { $gte: weekAgo } 
    });

    const responseTime = Date.now() - startTime;
    incrementCounter('performance', null, null, 1, { responseTime });

    res.json({
      totalUsers,
      verifiedUsers,
      adminUsers,
      regularUsers,
      newUsersToday,
      activeUsers,
      verificationRate: totalUsers > 0 ? (verifiedUsers / totalUsers * 100).toFixed(2) : 0
    });
  } catch (error) {
    console.error('Get user statistics error:', error);
    
    incrementCounter('system', 'errors', 'total', 1, { 
      error,
      endpoint: 'getUserStatistics'
    });
    
    res.status(500).json({ message: 'Server error' });
  }
};

// Search users (READ)
exports.searchUsers = async (req, res) => {
  const startTime = Date.now();
  incrementCounter('crud', 'read', 'total', 1);
  incrementCounter('crud', 'read', 'search', 1);
  
  try {
    const { query } = req.query;
    
    if (!query || query.length < 2) {
      return res.status(400).json({ message: 'Search query must be at least 2 characters' });
    }

    const users = await User.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
        { phone: { $regex: query, $options: 'i' } }
      ]
    }).select('-password').limit(20);

    const responseTime = Date.now() - startTime;
    incrementCounter('performance', null, null, 1, { responseTime });

    res.json(users);
  } catch (error) {
    console.error('Search users error:', error);
    
    incrementCounter('system', 'errors', 'total', 1, { 
      error,
      endpoint: 'searchUsers'
    });
    
    res.status(500).json({ message: 'Server error' });
  }
};

// ==================== UPDATE OPERATIONS ====================

// Update user profile (UPDATE)
exports.updateProfile = async (req, res) => {
  const startTime = Date.now();
  incrementCounter('crud', 'update', 'total', 1);
  incrementCounter('crud', 'update', 'profile', 1);
  
  try {
    const { name, phone } = req.body;
    const userId = req.userId;

    const user = await User.findById(userId);
    if (!user) {
      incrementCounter('crud', 'update', 'failed', 1);
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields
    if (name) user.name = name;
    if (phone) user.phone = phone;

    await user.save();

    incrementCounter('crud', 'update', 'success', 1);
    
    const responseTime = Date.now() - startTime;
    incrementCounter('performance', null, null, 1, { responseTime });

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    
    incrementCounter('crud', 'update', 'failed', 1);
    incrementCounter('system', 'errors', 'total', 1, { 
      error,
      endpoint: 'updateProfile'
    });
    
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user by ID (Admin only) (UPDATE)
exports.updateUserById = async (req, res) => {
  const startTime = Date.now();
  incrementCounter('crud', 'update', 'total', 1);
  incrementCounter('crud', 'update', 'adminUpdate', 1);
  
  try {
    const { id } = req.params;
    const { name, email, phone, role, isVerified } = req.body;

    // Check if user exists
    const user = await User.findById(id);
    if (!user) {
      incrementCounter('crud', 'update', 'failed', 1);
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if email is being changed and if it's already taken
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        incrementCounter('crud', 'update', 'failed', 1);
        return res.status(400).json({ message: 'Email already in use' });
      }
      user.email = email.toLowerCase();
      
      // If email changed, unverify the account
      user.isVerified = false;
      
      // Send new verification email if service is available
      const isEmailServiceAvailable = await checkEmailServiceHealth();
      if (isEmailServiceAvailable) {
        const verificationToken = jwt.sign(
          { userId: user._id },
          process.env.JWT_SECRET,
          { expiresIn: '24h' }
        );

        const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
        
        incrementCounter('email', 'byType', 'verification', 1);
        
        await sendEmailWithRetry({
          to: user.email,
          subject: 'Verify Your Updated Email',
          html: `
            <h1>Email Verification Required</h1>
            <p>Your email has been updated. Please verify your new email address:</p>
            <a href="${verificationUrl}">Verify Email</a>
          `
        });
      }
    }

    // Update other fields
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (role) user.role = role;
    if (isVerified !== undefined) user.isVerified = isVerified;

    await user.save();

    incrementCounter('crud', 'update', 'success', 1);
    
    const responseTime = Date.now() - startTime;
    incrementCounter('performance', null, null, 1, { responseTime });

    res.json({
      message: 'User updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isVerified: user.isVerified,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Update user by ID error:', error);
    
    incrementCounter('crud', 'update', 'failed', 1);
    incrementCounter('system', 'errors', 'total', 1, { 
      error,
      endpoint: 'updateUserById'
    });
    
    res.status(500).json({ message: 'Server error' });
  }
};

// Change password (UPDATE)
exports.changePassword = async (req, res) => {
  const startTime = Date.now();
  incrementCounter('crud', 'update', 'total', 1);
  incrementCounter('crud', 'update', 'password', 1);
  
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.userId;

    const user = await User.findById(userId);
    if (!user) {
      incrementCounter('crud', 'update', 'failed', 1);
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      incrementCounter('crud', 'update', 'failed', 1);
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    // Send password change notification email if service is available
    const isEmailServiceAvailable = await checkEmailServiceHealth();
    if (isEmailServiceAvailable) {
      incrementCounter('email', 'byType', 'notification', 1);
      await sendEmailWithRetry({
        to: user.email,
        subject: 'Password Changed Successfully',
        html: `
          <h1>Password Updated</h1>
          <p>Your password was successfully changed.</p>
          <p>If you didn't make this change, please contact support immediately.</p>
        `
      });
    }

    incrementCounter('crud', 'update', 'success', 1);
    
    const responseTime = Date.now() - startTime;
    incrementCounter('performance', null, null, 1, { responseTime });

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    
    incrementCounter('crud', 'update', 'failed', 1);
    incrementCounter('system', 'errors', 'total', 1, { 
      error,
      endpoint: 'changePassword'
    });
    
    res.status(500).json({ message: 'Server error' });
  }
};

// Reset password (UPDATE)
exports.resetPassword = async (req, res) => {
  const startTime = Date.now();
  incrementCounter('crud', 'update', 'total', 1);
  incrementCounter('crud', 'update', 'password', 1);
  
  try {
    const { token, newPassword } = req.body;

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await User.findById(decoded.userId);
    if (!user) {
      incrementCounter('crud', 'update', 'failed', 1);
      return res.status(404).json({ message: 'User not found' });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    // Send confirmation email if service is available
    const isEmailServiceAvailable = await checkEmailServiceHealth();
    if (isEmailServiceAvailable) {
      incrementCounter('email', 'byType', 'notification', 1);
      await sendEmailWithRetry({
        to: user.email,
        subject: 'Password Reset Successful',
        html: `
          <h1>Password Reset Successful</h1>
          <p>Your password has been reset successfully.</p>
        `
      });
    }

    incrementCounter('crud', 'update', 'success', 1);
    
    const responseTime = Date.now() - startTime;
    incrementCounter('performance', null, null, 1, { responseTime });

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Reset password error:', error);
    
    incrementCounter('crud', 'update', 'failed', 1);
    incrementCounter('system', 'errors', 'total', 1, { 
      error,
      endpoint: 'resetPassword'
    });
    
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
};

// Verify email (UPDATE)
exports.verifyEmail = async (req, res) => {
  const startTime = Date.now();
  incrementCounter('crud', 'update', 'total', 1);
  incrementCounter('crud', 'update', 'emailVerification', 1);
  
  try {
    const { token } = req.query;

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await User.findById(decoded.userId);
    if (!user) {
      incrementCounter('crud', 'update', 'failed', 1);
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if already verified
    if (user.isVerified) {
      incrementCounter('crud', 'update', 'failed', 1);
      return res.status(400).json({ message: 'Email already verified' });
    }

    // Update verification status
    user.isVerified = true;
    await user.save();

    // Send welcome email if service is available
    const isEmailServiceAvailable = await checkEmailServiceHealth();
    if (isEmailServiceAvailable) {
      incrementCounter('email', 'byType', 'welcome', 1);
      await sendEmailWithRetry({
        to: user.email,
        subject: 'Welcome! Email Verified Successfully',
        html: `
          <h1>Welcome to Our Platform!</h1>
          <p>Your email has been successfully verified.</p>
          <p>You can now enjoy all features of our platform.</p>
        `
      });
    }

    incrementCounter('crud', 'update', 'success', 1);
    
    const responseTime = Date.now() - startTime;
    incrementCounter('performance', null, null, 1, { responseTime });

    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Verify email error:', error);
    
    incrementCounter('crud', 'update', 'failed', 1);
    incrementCounter('system', 'errors', 'total', 1, { 
      error,
      endpoint: 'verifyEmail'
    });
    
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
};

// Request password reset (UPDATE - First step)
exports.requestPasswordReset = async (req, res) => {
  const startTime = Date.now();
  incrementCounter('crud', 'update', 'total', 1);
  incrementCounter('crud', 'update', 'password', 1);
  
  try {
    const { email } = req.body;

    // Check email service health
    const isEmailServiceAvailable = await checkEmailServiceHealth();
    if (!isEmailServiceAvailable) {
      incrementCounter('crud', 'update', 'failed', 1);
      return res.status(503).json({ 
        message: 'Email service is currently unavailable. Please try again later.' 
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      // Don't reveal that user doesn't exist for security
      // But still count this as a request
      const responseTime = Date.now() - startTime;
      incrementCounter('performance', null, null, 1, { responseTime });
      
      return res.json({ message: 'If an account exists with this email, a reset link has been sent' });
    }

    // Generate reset token
    const resetToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Send reset email with retry
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    
    incrementCounter('email', 'byType', 'passwordReset', 1);
    
    const emailSent = await sendEmailWithRetry({
      to: user.email,
      subject: 'Password Reset Request',
      html: `
        <h1>Password Reset</h1>
        <p>You requested to reset your password.</p>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `
    });

    if (!emailSent) {
      incrementCounter('crud', 'update', 'failed', 1);
      return res.status(500).json({ 
        message: 'Failed to send password reset email. Please try again later.' 
      });
    }

    incrementCounter('crud', 'update', 'success', 1);
    
    const responseTime = Date.now() - startTime;
    incrementCounter('performance', null, null, 1, { responseTime });

    res.json({ message: 'Password reset email sent' });
  } catch (error) {
    console.error('Request password reset error:', error);
    
    incrementCounter('crud', 'update', 'failed', 1);
    incrementCounter('system', 'errors', 'total', 1, { 
      error,
      endpoint: 'requestPasswordReset'
    });
    
    res.status(500).json({ message: 'Server error' });
  }
};

// ==================== DELETE OPERATIONS ====================

// Delete user account (DELETE)
exports.deleteAccount = async (req, res) => {
  const startTime = Date.now();
  incrementCounter('crud', 'delete', 'total', 1);
  incrementCounter('crud', 'delete', 'self', 1);
  
  try {
    const userId = req.userId;

    const user = await User.findById(userId);
    if (!user) {
      incrementCounter('crud', 'delete', 'failed', 1);
      return res.status(404).json({ message: 'User not found' });
    }

    // Send deletion notification email if service is available
    const isEmailServiceAvailable = await checkEmailServiceHealth();
    if (isEmailServiceAvailable) {
      incrementCounter('email', 'byType', 'notification', 1);
      await sendEmailWithRetry({
        to: user.email,
        subject: 'Account Deletion Confirmation',
        html: `
          <h1>Account Deleted</h1>
          <p>Your account has been successfully deleted.</p>
          <p>We're sorry to see you go. You can always create a new account if you change your mind.</p>
        `
      });
    }

    // Delete user
    await user.deleteOne();

    incrementCounter('crud', 'delete', 'success', 1);
    
    const responseTime = Date.now() - startTime;
    incrementCounter('performance', null, null, 1, { responseTime });

    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Delete account error:', error);
    
    incrementCounter('crud', 'delete', 'failed', 1);
    incrementCounter('system', 'errors', 'total', 1, { 
      error,
      endpoint: 'deleteAccount'
    });
    
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete user by ID (Admin only) (DELETE)
exports.deleteUserById = async (req, res) => {
  const startTime = Date.now();
  incrementCounter('crud', 'delete', 'total', 1);
  incrementCounter('crud', 'delete', 'admin', 1);
  
  try {
    const { id } = req.params;

    // Check if user exists
    const user = await User.findById(id);
    if (!user) {
      incrementCounter('crud', 'delete', 'failed', 1);
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent deleting yourself if you're an admin
    if (id === req.userId) {
      incrementCounter('crud', 'delete', 'failed', 1);
      return res.status(400).json({ message: 'You cannot delete your own account from admin panel' });
    }

    // Send deletion notification email if service is available
    const isEmailServiceAvailable = await checkEmailServiceHealth();
    if (isEmailServiceAvailable) {
      incrementCounter('email', 'byType', 'notification', 1);
      await sendEmailWithRetry({
        to: user.email,
        subject: 'Account Deleted by Administrator',
        html: `
          <h1>Account Deleted</h1>
          <p>Your account has been deleted by an administrator.</p>
          <p>If you believe this was a mistake, please contact support.</p>
        `
      });
    }

    // Delete user
    await user.deleteOne();

    incrementCounter('crud', 'delete', 'success', 1);
    
    const responseTime = Date.now() - startTime;
    incrementCounter('performance', null, null, 1, { responseTime });

    res.json({ 
      message: 'User deleted successfully',
      deletedUser: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Delete user by ID error:', error);
    
    incrementCounter('crud', 'delete', 'failed', 1);
    incrementCounter('system', 'errors', 'total', 1, { 
      error,
      endpoint: 'deleteUserById'
    });
    
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete multiple users (Admin only) (DELETE)
exports.deleteMultipleUsers = async (req, res) => {
  const startTime = Date.now();
  incrementCounter('crud', 'delete', 'total', 1);
  incrementCounter('crud', 'delete', 'bulk', 1);
  
  try {
    const { userIds } = req.body;

    if (!Array.isArray(userIds) || userIds.length === 0) {
      incrementCounter('crud', 'delete', 'failed', 1);
      return res.status(400).json({ message: 'Please provide an array of user IDs' });
    }

    // Prevent deleting yourself
    if (userIds.includes(req.userId)) {
      incrementCounter('crud', 'delete', 'failed', 1);
      return res.status(400).json({ message: 'You cannot delete your own account' });
    }

    // Find users
    const users = await User.find({ _id: { $in: userIds } });
    const foundIds = users.map(user => user._id.toString());

    // Find users that don't exist
    const notFound = userIds.filter(id => !foundIds.includes(id));

    // Send deletion emails if service is available
    const isEmailServiceAvailable = await checkEmailServiceHealth();
    if (isEmailServiceAvailable) {
      for (const user of users) {
        incrementCounter('email', 'byType', 'notification', 1);
        await sendEmailWithRetry({
          to: user.email,
          subject: 'Account Deleted by Administrator',
          html: `
            <h1>Account Deleted</h1>
            <p>Your account has been deleted by an administrator.</p>
            <p>If you believe this was a mistake, please contact support.</p>
          `
        });
      }
    }

    // Delete users
    await User.deleteMany({ _id: { $in: foundIds } });

    incrementCounter('crud', 'delete', 'success', 1);
    
    const responseTime = Date.now() - startTime;
    incrementCounter('performance', null, null, 1, { responseTime });

    res.json({
      message: `${users.length} users deleted successfully`,
      deletedCount: users.length,
      notFound: notFound.length > 0 ? notFound : undefined
    });
  } catch (error) {
    console.error('Delete multiple users error:', error);
    
    incrementCounter('crud', 'delete', 'failed', 1);
    incrementCounter('system', 'errors', 'total', 1, { 
      error,
      endpoint: 'deleteMultipleUsers'
    });
    
    res.status(500).json({ message: 'Server error' });
  }
};

// ==================== AUTHENTICATION OPERATIONS ====================

// Login user
exports.login = async (req, res) => {
  const startTime = Date.now();
  incrementCounter('auth', 'login', 'total', 1);
  
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      incrementCounter('auth', 'login', 'failed', 1);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      incrementCounter('auth', 'login', 'failed', 1);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if email is verified (optional - you can comment this out)
    if (!user.isVerified) {
      incrementCounter('auth', 'login', 'unverified', 1);
      // Still allow login but track unverified logins
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    incrementCounter('auth', 'login', 'success', 1);
    
    const responseTime = Date.now() - startTime;
    incrementCounter('performance', null, null, 1, { responseTime });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    
    incrementCounter('auth', 'login', 'failed', 1);
    incrementCounter('system', 'errors', 'total', 1, { 
      error,
      endpoint: 'login'
    });
    
    res.status(500).json({ message: 'Server error' });
  }
};

// Logout
exports.logout = async (req, res) => {
  const startTime = Date.now();
  incrementCounter('auth', 'logout', 'total', 1);
  
  try {
    const responseTime = Date.now() - startTime;
    incrementCounter('performance', null, null, 1, { responseTime });
    
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    
    incrementCounter('system', 'errors', 'total', 1, { 
      error,
      endpoint: 'logout'
    });
    
    res.status(500).json({ message: 'Server error' });
  }
};

// Refresh token
exports.refreshToken = async (req, res) => {
  const startTime = Date.now();
  incrementCounter('auth', 'tokenRefresh', 'total', 1);
  
  try {
    const userId = req.userId;
    
    // Generate new token
    const token = generateToken(userId);

    incrementCounter('auth', 'tokenRefresh', 'success', 1);
    
    const responseTime = Date.now() - startTime;
    incrementCounter('performance', null, null, 1, { responseTime });

    res.json({
      message: 'Token refreshed successfully',
      token
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    
    incrementCounter('auth', 'tokenRefresh', 'failed', 1);
    incrementCounter('system', 'errors', 'total', 1, { 
      error,
      endpoint: 'refreshToken'
    });
    
    res.status(500).json({ message: 'Server error' });
  }
};

// Check system health
exports.checkSystemHealth = async (req, res) => {
  const startTime = Date.now();
  incrementCounter('system', null, 'healthChecks', 1);
  
  try {
    const health = {
      status: 'healthy',
      timestamp: new Date(),
      services: {
        database: 'unhealthy',
        email: 'unhealthy',
        api: 'healthy'
      },
      environment: process.env.NODE_ENV || 'development',
      mongooseVersion: mongoose.version,
      nodeVersion: process.version,
      actionCounters: {
        totalRegistrations: actionCounters.registration.total,
        totalEmails: actionCounters.email.total,
        totalCRUD: actionCounters.crud.create.total + 
                   actionCounters.crud.read.total + 
                   actionCounters.crud.update.total + 
                   actionCounters.crud.delete.total,
        totalLogins: actionCounters.auth.login.total
      }
    };

    // Check database connection
    try {
      // Check if mongoose is connected
      if (mongoose.connection.readyState === 1) {
        incrementCounter('system', null, 'databasePings', 1);
        // Try to ping the database
        await mongoose.connection.db.admin().ping();
        health.services.database = 'healthy';
        health.databaseInfo = {
          name: mongoose.connection.db.databaseName,
          host: mongoose.connection.host,
          port: mongoose.connection.port,
          state: mongoose.connection.readyState
        };
      } else {
        health.services.database = 'unhealthy';
        health.status = 'degraded';
        health.databaseState = mongoose.connection.readyState;
        health.databaseStates = {
          0: 'disconnected',
          1: 'connected',
          2: 'connecting',
          3: 'disconnecting'
        };
      }
    } catch (dbError) {
      health.services.database = 'unhealthy';
      health.status = 'degraded';
      health.databaseError = dbError.message;
      health.databaseMessage = 'Database connection failed. Check if MongoDB is running.';
      
      incrementCounter('system', 'errors', 'total', 1, { 
        error: dbError,
        endpoint: 'checkSystemHealth/database'
      });
    }

    // Check email service
    try {
      const isEmailHealthy = await checkEmailServiceHealth();
      health.services.email = isEmailHealthy ? 'healthy' : 'unhealthy';
      
      if (!isEmailHealthy) {
        health.status = 'degraded';
        health.emailMessage = 'Email service is unavailable. User registration may be affected.';
        
        // Check specific email issues
        if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
          health.emailDetails = 'Email configuration missing in .env file';
        } else {
          health.emailDetails = 'Email service configuration issue';
        }
      } else {
        health.emailDetails = 'Email service configured and ready';
      }
    } catch (emailError) {
      health.services.email = 'unhealthy';
      health.status = 'degraded';
      health.emailError = emailError.message;
      
      incrementCounter('system', 'errors', 'total', 1, { 
        error: emailError,
        endpoint: 'checkSystemHealth/email'
      });
    }

    // Check if we're in development mode with database disabled
    if (health.services.database === 'unhealthy' && 
        (process.env.NODE_ENV === 'development' || process.env.SKIP_DB === 'true')) {
      health.developmentMode = true;
      health.message = 'Running in development mode without database';
      health.registrationStatus = 'Registration will work (development mode)';
    } else if (health.services.database === 'unhealthy') {
      health.registrationStatus = 'Registration blocked - Database unavailable';
    } else if (health.services.email === 'unhealthy') {
      health.registrationStatus = 'Registration works but emails will be skipped';
    } else {
      health.registrationStatus = 'All systems operational';
    }

    // Set appropriate HTTP status code
    let statusCode = 200;
    if (health.status === 'degraded') statusCode = 503;
    if (health.status === 'unhealthy') statusCode = 503;

    const responseTime = Date.now() - startTime;
    incrementCounter('performance', null, null, 1, { responseTime });

    res.status(statusCode).json(health);
  } catch (error) {
    console.error('Health check error:', error);
    
    incrementCounter('system', 'errors', 'total', 1, { 
      error,
      endpoint: 'checkSystemHealth'
    });
    
    res.status(500).json({ 
      status: 'unhealthy',
      message: 'System health check failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      timestamp: new Date()
    });
  }
};

// Test endpoint to verify everything works
exports.testSystem = async (req, res) => {
  const startTime = Date.now();
  
  try {
    // Test database connection
    const dbPing = await User.db.command({ ping: 1 });
    incrementCounter('system', null, 'databasePings', 1);
    
    // Test user count
    const userCount = await User.countDocuments();
    
    // Test JWT
    const testToken = jwt.sign({ test: true }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    // Test email config (without sending)
    const hasEmailConfig = !!(process.env.SMTP_HOST && process.env.SMTP_USER);

    const responseTime = Date.now() - startTime;
    incrementCounter('performance', null, null, 1, { responseTime });
    
    // Add action counters to test response
    const counterSummary = {
      totalRegistrations: actionCounters.registration.total,
      successfulRegistrations: actionCounters.registration.success,
      failedRegistrations: actionCounters.registration.failed,
      emailsSent: actionCounters.email.sent,
      emailsFailed: actionCounters.email.failed,
      logins: actionCounters.auth.login.total,
      totalCRUD: actionCounters.crud.create.total + 
                 actionCounters.crud.read.total + 
                 actionCounters.crud.update.total + 
                 actionCounters.crud.delete.total
    };
    
    res.json({
      status: '✅ SYSTEM IS WORKING',
      timestamp: new Date(),
      database: dbPing.ok === 1 ? '✅ Connected' : '❌ Disconnected',
      users: userCount,
      jwt: '✅ Working',
      email: hasEmailConfig ? '✅ Configured' : '❌ Not configured',
      message: 'Your system is working!',
      actionCounters: counterSummary,
      nextSteps: [
        'Continue testing other endpoints',
        'Test login with created users',
        'Test profile updates',
        'Test password changes',
        'Check action statistics at /api/users/action-statistics',
        'Reset counters at /api/users/reset-counters (admin only)'
      ]
    });
  } catch (error) {
    incrementCounter('system', 'errors', 'total', 1, { 
      error,
      endpoint: 'testSystem'
    });
    
    res.status(500).json({ error: error.message });
  }
};