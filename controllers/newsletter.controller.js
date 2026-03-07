
// const Newsletter = require('../models/Newsletter');
// const nodemailer = require('nodemailer');

// class NewsletterController {
//   constructor() {
//     this.subscribe = this.subscribe.bind(this);
//     this.getAll = this.getAll.bind(this);
//     this.getStatistics = this.getStatistics.bind(this);
//   }

//   /* =====================================================
//      EMAIL TRANSPORTER
//   ===================================================== */
//   createTransporter() {
//     return nodemailer.createTransport({
//       host: process.env.SMTP_HOST,
//       port: parseInt(process.env.SMTP_PORT),
//       secure: false,
//       auth: {
//         user: process.env.SMTP_USER,
//         pass: process.env.SMTP_PASS,
//       },
//       tls: {
//         rejectUnauthorized: false
//       }
//     });
//   }

//   /* =====================================================
//      EMAIL SERVICE
//   ===================================================== */
//   async sendEmail(to, subject, html, isAdminNotification = false) {
//     // Skip emails if SKIP_EMAILS is true (for development)
//     if (process.env.SKIP_EMAILS === 'true' && !isAdminNotification) {
//       console.log('Email sending skipped (SKIP_EMAILS=true)');
//       return { success: true, skipped: true };
//     }

//     try {
//       const transporter = this.createTransporter();
      
//       const info = await transporter.sendMail({
//         from: `"${process.env.COMPANY_NAME || 'REC APPLY'} Newsletter" <${process.env.EMAIL_FROM}>`,
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
//   }

//   async sendConfirmationEmail(email, name) {
//     const subject = 'Welcome to Our Newsletter! 📧';
    
//     const html = `
//       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f4f4; padding: 20px;">
//         <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
//           <h1 style="color: white; margin: 0; font-size: 28px;">${process.env.COMPANY_NAME || 'REC APPLY'}</h1>
//           <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Newsletter Subscription</p>
//         </div>
        
//         <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
//           <h2 style="color: #333; margin-top: 0; border-bottom: 2px solid #f0f0f0; padding-bottom: 15px;">
//             Welcome to Our Community! 🎉
//           </h2>
          
//           <p style="font-size: 16px; line-height: 1.6; color: #555;">Hello ${name || 'there'}!</p>
          
//           <p style="font-size: 16px; line-height: 1.6; color: #555;">Thank you for subscribing to our newsletter. You're now part of our community and will receive regular updates about:</p>
          
//           <div style="background-color: #f0f7ff; padding: 20px; border-radius: 5px; margin: 20px 0;">
//             <table style="width: 100%; border-collapse: collapse;">
//               <tr>
//                 <td style="padding: 8px 0; color: #666;">🎓</td>
//                 <td style="padding: 8px 0; color: #333;"><strong>Scholarship Opportunities</strong> - Latest scholarships worldwide</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;">🏛️</td>
//                 <td style="padding: 8px 0; color: #333;"><strong>University News</strong> - Updates from top universities</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;">🛂</td>
//                 <td style="padding: 8px 0; color: #333;"><strong>Visa Updates</strong> - Latest visa policies and requirements</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;">📚</td>
//                 <td style="padding: 8px 0; color: #333;"><strong>Study Abroad Tips</strong> - Guides and resources</td>
//               </tr>
//             </table>
//           </div>
          
//           <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
//             <h4 style="margin-top: 0; color: #333;">Your Subscription Details</h4>
//             <p style="margin: 5px 0; color: #555;"><strong>Email:</strong> ${email}</p>
//             <p style="margin: 5px 0; color: #555;"><strong>Subscription Date:</strong> ${new Date().toLocaleDateString()}</p>
//             <p style="margin: 5px 0; color: #555;"><strong>Frequency:</strong> Weekly updates</p>
//           </div>
          
//           <hr style="border: none; border-top: 2px solid #f0f0f0; margin: 30px 0;">
          
//           <div style="text-align: center;">
//             <p style="color: #666; font-size: 14px; line-height: 1.6;">
//               We're excited to have you on board! Stay tuned for valuable content.<br>
//               If you ever wish to unsubscribe, you can do so from any newsletter email.
//             </p>
//           </div>
//         </div>
        
//         <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
//           © ${new Date().getFullYear()} ${process.env.COMPANY_NAME || 'REC APPLY'}. All rights reserved.<br>
//           This is an automated message, please do not reply to this email.
//         </div>
//       </div>
//     `;

//     return await this.sendEmail(email, subject, html);
//   }

//   async sendAdminNotification(subscriber) {
//     const subject = `New Newsletter Subscriber - ${subscriber.email}`;
    
//     const html = `
//       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f4f4; padding: 20px;">
//         <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
//           <h1 style="color: white; margin: 0; font-size: 28px;">${process.env.COMPANY_NAME || 'REC APPLY'}</h1>
//           <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Admin Notification</p>
//         </div>
        
//         <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
//           <h2 style="color: #333; margin-top: 0; border-bottom: 2px solid #f0f0f0; padding-bottom: 15px;">
//             New Newsletter Subscriber! 📧
//           </h2>
          
//           <div style="background-color: #fff3e0; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #f5576c;">
//             <h3 style="margin-top: 0; color: #f5576c; font-size: 20px;">Subscriber Details</h3>
            
//             <table style="width: 100%; border-collapse: collapse;">
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Email:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${subscriber.email}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Name:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${subscriber.name || 'Anonymous'}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Country:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${subscriber.country || 'Not specified'}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Source:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${subscriber.source || 'footer_newsletter'}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Subscription Date:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${new Date(subscriber.subscription_date).toLocaleString()}</td>
//               </tr>
//             </table>
//           </div>
          
//           <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
//             <h4 style="margin-top: 0; color: #333;">Total Subscribers: ${subscriber.totalCount || 'N/A'}</h4>
//           </div>
          
//           <hr style="border: none; border-top: 2px solid #f0f0f0; margin: 30px 0;">
          
//           <div style="text-align: center;">
//             <p style="color: #666; font-size: 14px; line-height: 1.6;">
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
//   }

//   async sendWelcomeBackEmail(email, name) {
//     const subject = 'Welcome Back to Our Newsletter! 👋';
    
//     const html = `
//       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f4f4; padding: 20px;">
//         <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
//           <h1 style="color: white; margin: 0; font-size: 28px;">${process.env.COMPANY_NAME || 'REC APPLY'}</h1>
//           <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Welcome Back</p>
//         </div>
        
//         <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
//           <h2 style="color: #333; margin-top: 0;">Welcome Back! 👋</h2>
          
//           <p style="font-size: 16px; line-height: 1.6; color: #555;">Hello ${name || 'there'}!</p>
          
//           <p style="font-size: 16px; line-height: 1.6; color: #555;">You've successfully re-subscribed to our newsletter. We're happy to have you back in our community!</p>
          
//           <div style="background-color: #e8f5e9; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #4CAF50;">
//             <p style="margin: 5px 0; color: #555; font-size: 16px;">✨ You'll continue receiving updates on:</p>
//             <ul style="color: #555;">
//               <li>Scholarship opportunities</li>
//               <li>University news</li>
//               <li>Visa updates</li>
//               <li>Study abroad tips</li>
//             </ul>
//           </div>
          
//           <hr style="border: none; border-top: 2px solid #f0f0f0; margin: 30px 0;">
          
//           <div style="text-align: center;">
//             <p style="color: #666; font-size: 14px; line-height: 1.6;">
//               Thank you for rejoining our community!
//             </p>
//           </div>
//         </div>
        
//         <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
//           © ${new Date().getFullYear()} ${process.env.COMPANY_NAME || 'REC APPLY'}. All rights reserved.
//         </div>
//       </div>
//     `;

//     return await this.sendEmail(email, subject, html);
//   }

//   // CREATE subscription
//   async subscribe(req, res) {
//     try {
//       const { email, name, country } = req.body;

//       if (!email) {
//         return res.status(400).json({ success: false, message: 'Email is required' });
//       }

//       // Validate email format
//       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//       if (!emailRegex.test(email)) {
//         return res.status(400).json({
//           success: false,
//           message: 'Please provide a valid email address'
//         });
//       }

//       // Check if email already exists
//       const existing = await Newsletter.findOne({ email: email.toLowerCase() });
//       if (existing) {
//         // If exists but is inactive, reactivate
//         if (!existing.isActive) {
//           existing.isActive = true;
//           existing.name = name || existing.name;
//           existing.country = country || existing.country;
//           existing.subscription_date = new Date();
//           await existing.save();

//           // Send welcome back email
//           try {
//             await this.sendWelcomeBackEmail(email, existing.name);
//           } catch (emailErr) {
//             console.error('Error sending welcome back email:', emailErr);
//           }

//           return res.status(200).json({
//             success: true,
//             message: 'Subscription reactivated successfully',
//             data: existing
//           });
//         }

//         return res.status(409).json({ 
//           success: false, 
//           message: 'Email already subscribed' 
//         });
//       }

//       const newsletterData = {
//         email: email.toLowerCase(),
//         name: name || 'Anonymous',
//         country: country || 'Not specified',
//         source: req.body.source || 'footer_newsletter',
//         isActive: true
//       };

//       const newSub = await Newsletter.create(newsletterData);

//       // Get total count for admin notification
//       const totalCount = await Newsletter.countDocuments();

//       // Send emails (fire and forget)
//       Promise.allSettled([
//         this.sendConfirmationEmail(email, newsletterData.name),
//         this.sendAdminNotification({ ...newsletterData, totalCount })
//       ]).then(results => {
//         console.log('Email notifications sent:', results.map(r => r.status));
//       }).catch(err => {
//         console.error('Error sending notification emails:', err);
//       });

//       res.status(201).json({
//         success: true,
//         message: 'Subscribed successfully',
//         data: newSub
//       });
//     } catch (error) {
//       console.error('Newsletter subscription error:', error);
//       res.status(500).json({
//         success: false,
//         message: 'Server error while subscribing'
//       });
//     }
//   }

//   // GET all subscriptions
//   async getAll(req, res) {
//     try {
//       const { status, search, page = 1, limit = 20 } = req.query;

//       // Build query
//       const query = {};
      
//       if (status === 'active') {
//         query.isActive = true;
//       } else if (status === 'inactive') {
//         query.isActive = false;
//       }

//       if (search) {
//         query.$or = [
//           { email: { $regex: search, $options: 'i' } },
//           { name: { $regex: search, $options: 'i' } },
//           { country: { $regex: search, $options: 'i' } }
//         ];
//       }

//       // Pagination
//       const skip = (page - 1) * limit;

//       const [subscriptions, total] = await Promise.all([
//         Newsletter.find(query)
//           .sort({ subscription_date: -1 })
//           .skip(skip)
//           .limit(parseInt(limit))
//           .lean(),
//         Newsletter.countDocuments(query)
//       ]);

//       res.status(200).json({
//         success: true,
//         total,
//         totalPages: Math.ceil(total / limit),
//         currentPage: parseInt(page),
//         data: subscriptions
//       });
//     } catch (error) {
//       console.error('Error fetching newsletter subscriptions:', error);
//       res.status(500).json({
//         success: false,
//         message: 'Server error while fetching subscriptions'
//       });
//     }
//   }

//   async getByEmail(req, res) {
//     try {
//       const { email } = req.params;

//       const subscriptions = await Newsletter.find({ email: email.toLowerCase() })
//         .sort({ subscription_date: -1 })
//         .lean();

//       res.status(200).json({
//         success: true,
//         total: subscriptions.length,
//         data: subscriptions
//       });
//     } catch (error) {
//       console.error('Error fetching newsletter subscription by email:', error);
//       res.status(500).json({
//         success: false,
//         message: 'Server error while fetching subscriptions by email'
//       });
//     }
//   }

//   // Unsubscribe
//   async unsubscribe(req, res) {
//     try {
//       const { email } = req.params;

//       const subscriber = await Newsletter.findOne({ email: email.toLowerCase() });

//       if (!subscriber) {
//         return res.status(404).json({
//           success: false,
//           message: 'Email not found in our subscription list'
//         });
//       }

//       subscriber.isActive = false;
//       await subscriber.save();

//       res.status(200).json({
//         success: true,
//         message: 'Successfully unsubscribed from newsletter'
//       });
//     } catch (error) {
//       console.error('Error unsubscribing:', error);
//       res.status(500).json({
//         success: false,
//         message: 'Server error while unsubscribing'
//       });
//     }
//   }

//   // Reactivate subscription
//   async reactivate(req, res) {
//     try {
//       const { email } = req.params;

//       const subscriber = await Newsletter.findOne({ email: email.toLowerCase() });

//       if (!subscriber) {
//         return res.status(404).json({
//           success: false,
//           message: 'Email not found in our subscription list'
//         });
//       }

//       subscriber.isActive = true;
//       subscriber.subscription_date = new Date();
//       await subscriber.save();

//       // Send welcome back email
//       try {
//         await this.sendWelcomeBackEmail(email, subscriber.name);
//       } catch (emailErr) {
//         console.error('Error sending welcome back email:', emailErr);
//       }

//       res.status(200).json({
//         success: true,
//         message: 'Subscription reactivated successfully',
//         data: subscriber
//       });
//     } catch (error) {
//       console.error('Error reactivating subscription:', error);
//       res.status(500).json({
//         success: false,
//         message: 'Server error while reactivating subscription'
//       });
//     }
//   }

//   // Delete subscription
//   async delete(req, res) {
//     try {
//       const { id } = req.params;

//       const subscriber = await Newsletter.findByIdAndDelete(id);

//       if (!subscriber) {
//         return res.status(404).json({
//           success: false,
//           message: 'Subscription not found'
//         });
//       }

//       res.status(200).json({
//         success: true,
//         message: 'Subscription deleted successfully'
//       });
//     } catch (error) {
//       console.error('Error deleting subscription:', error);
//       res.status(500).json({
//         success: false,
//         message: 'Server error while deleting subscription'
//       });
//     }
//   }

//   // =========================
//   // NEWSLETTER STATISTICS
//   // =========================
//   async getStatistics(req, res) {
//     try {
//       const today = new Date();
//       today.setHours(0, 0, 0, 0);

//       const startOfWeek = new Date(today);
//       startOfWeek.setDate(today.getDate() - today.getDay());

//       const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      
//       const startOfYear = new Date(today.getFullYear(), 0, 1);

//       const [
//         totalSubscribers,
//         activeSubscribers,
//         todaySubscribers,
//         weekSubscribers,
//         monthSubscribers,
//         yearSubscribers,
//         subscribersByCountry,
//         subscribersBySource,
//         monthlyTrend
//       ] = await Promise.all([
//         Newsletter.countDocuments(),
//         Newsletter.countDocuments({ isActive: true }),
//         Newsletter.countDocuments({
//           subscription_date: { $gte: today },
//           isActive: true
//         }),
//         Newsletter.countDocuments({
//           subscription_date: { $gte: startOfWeek },
//           isActive: true
//         }),
//         Newsletter.countDocuments({
//           subscription_date: { $gte: startOfMonth },
//           isActive: true
//         }),
//         Newsletter.countDocuments({
//           subscription_date: { $gte: startOfYear },
//           isActive: true
//         }),
//         Newsletter.aggregate([
//           { $match: { isActive: true } },
//           {
//             $group: {
//               _id: "$country",
//               count: { $sum: 1 }
//             }
//           },
//           { $sort: { count: -1 } },
//           { $limit: 10 }
//         ]),
//         Newsletter.aggregate([
//           { $match: { isActive: true } },
//           {
//             $group: {
//               _id: "$source",
//               count: { $sum: 1 }
//             }
//           },
//           { $sort: { count: -1 } }
//         ]),
//         Newsletter.aggregate([
//           {
//             $match: {
//               subscription_date: { $gte: startOfYear },
//               isActive: true
//             }
//           },
//           {
//             $group: {
//               _id: {
//                 year: { $year: "$subscription_date" },
//                 month: { $month: "$subscription_date" }
//               },
//               count: { $sum: 1 }
//             }
//           },
//           { $sort: { "_id.year": 1, "_id.month": 1 } }
//         ])
//       ]);

//       // Calculate growth rate
//       const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
//       const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
      
//       const lastMonthCount = await Newsletter.countDocuments({
//         subscription_date: { $gte: lastMonthStart, $lte: lastMonthEnd },
//         isActive: true
//       });

//       const growthRate = lastMonthCount > 0 
//         ? ((monthSubscribers - lastMonthCount) / lastMonthCount * 100).toFixed(2)
//         : monthSubscribers > 0 ? 100 : 0;

//       res.status(200).json({
//         success: true,
//         data: {
//           overview: {
//             totalSubscribers,
//             activeSubscribers,
//             inactiveSubscribers: totalSubscribers - activeSubscribers,
//             engagementRate: totalSubscribers > 0 
//               ? ((activeSubscribers / totalSubscribers) * 100).toFixed(2) 
//               : 0
//           },
//           growth: {
//             today: todaySubscribers,
//             thisWeek: weekSubscribers,
//             thisMonth: monthSubscribers,
//             thisYear: yearSubscribers,
//             monthlyGrowthRate: growthRate
//           },
//           subscribersByCountry,
//           subscribersBySource,
//           monthlyTrend
//         }
//       });
//     } catch (error) {
//       console.error('Newsletter statistics error:', error);
//       res.status(500).json({
//         success: false,
//         message: 'Server error while fetching statistics'
//       });
//     }
//   }
// }

// module.exports = new NewsletterController();
















// const Newsletter = require('../models/Newsletter');
// const nodemailer = require('nodemailer');

// class NewsletterController {
//   constructor() {
//     this.subscribe = this.subscribe.bind(this);
//     this.getAll = this.getAll.bind(this);
//     this.getStatistics = this.getStatistics.bind(this);
//   }

//   /* =====================================================
//      EMAIL TRANSPORTER - ALWAYS INITIALIZE
//   ===================================================== */
//   createTransporter() {
//     return nodemailer.createTransport({
//       host: process.env.SMTP_HOST || 'smtp.gmail.com',
//       port: parseInt(process.env.SMTP_PORT) || 587,
//       secure: false,
//       auth: {
//         user: process.env.SMTP_USER,
//         pass: process.env.SMTP_PASS,
//       },
//       tls: {
//         rejectUnauthorized: false
//       },
//       pool: true,
//       maxConnections: 5,
//       maxMessages: 100
//     });
//   }

//   /* =====================================================
//      EMAIL SERVICE - ALWAYS SEND EMAILS
//   ===================================================== */
//   async sendEmail(to, subject, html) {
//     try {
//       const transporter = this.createTransporter();
      
//       console.log(`📧 Attempting to send email to: ${to} - Subject: ${subject}`);
      
//       const info = await transporter.sendMail({
//         from: `"${process.env.COMPANY_NAME || 'REC APPLY'} Newsletter" <${process.env.EMAIL_FROM || process.env.SMTP_USER}>`,
//         to,
//         subject,
//         html
//       });
      
//       console.log(`✅ Email sent successfully to: ${to} - Message ID: ${info.messageId}`);
//       return { success: true, messageId: info.messageId };
//     } catch (error) {
//       console.error(`❌ Email sending error to ${to}:`, error.message);
      
//       // Don't throw - log and return failure but don't crash
//       return { success: false, error: error.message };
//     }
//   }

//   async sendConfirmationEmail(email, name) {
//     const subject = 'Welcome to Our Newsletter! 📧';
    
//     const html = `
//       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f4f4; padding: 20px;">
//         <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
//           <h1 style="color: white; margin: 0; font-size: 28px;">${process.env.COMPANY_NAME || 'REC APPLY'}</h1>
//           <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Newsletter Subscription</p>
//         </div>
        
//         <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
//           <h2 style="color: #333; margin-top: 0; border-bottom: 2px solid #f0f0f0; padding-bottom: 15px;">
//             Welcome to Our Community! 🎉
//           </h2>
          
//           <p style="font-size: 16px; line-height: 1.6; color: #555;">Hello ${name || 'there'}!</p>
          
//           <p style="font-size: 16px; line-height: 1.6; color: #555;">Thank you for subscribing to our newsletter. You're now part of our community and will receive regular updates about:</p>
          
//           <div style="background-color: #f0f7ff; padding: 20px; border-radius: 5px; margin: 20px 0;">
//             <table style="width: 100%; border-collapse: collapse;">
//               <tr>
//                 <td style="padding: 8px 0; color: #666;">🎓</td>
//                 <td style="padding: 8px 0; color: #333;"><strong>Scholarship Opportunities</strong> - Latest scholarships worldwide</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;">🏛️</td>
//                 <td style="padding: 8px 0; color: #333;"><strong>University News</strong> - Updates from top universities</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;">🛂</td>
//                 <td style="padding: 8px 0; color: #333;"><strong>Visa Updates</strong> - Latest visa policies and requirements</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;">📚</td>
//                 <td style="padding: 8px 0; color: #333;"><strong>Study Abroad Tips</strong> - Guides and resources</td>
//               </tr>
//             </table>
//           </div>
          
//           <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
//             <h4 style="margin-top: 0; color: #333;">Your Subscription Details</h4>
//             <p style="margin: 5px 0; color: #555;"><strong>Email:</strong> ${email}</p>
//             <p style="margin: 5px 0; color: #555;"><strong>Subscription Date:</strong> ${new Date().toLocaleDateString()}</p>
//             <p style="margin: 5px 0; color: #555;"><strong>Frequency:</strong> Weekly updates</p>
//           </div>
          
//           <hr style="border: none; border-top: 2px solid #f0f0f0; margin: 30px 0;">
          
//           <div style="text-align: center;">
//             <p style="color: #666; font-size: 14px; line-height: 1.6;">
//               We're excited to have you on board! Stay tuned for valuable content.<br>
//               If you ever wish to unsubscribe, you can do so from any newsletter email.
//             </p>
//           </div>
//         </div>
        
//         <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
//           © ${new Date().getFullYear()} ${process.env.COMPANY_NAME || 'REC APPLY'}. All rights reserved.<br>
//           This is an automated message, please do not reply to this email.
//         </div>
//       </div>
//     `;

//     return await this.sendEmail(email, subject, html);
//   }

//   async sendAdminNotification(subscriber) {
//     if (!process.env.ADMIN_EMAIL) {
//       console.log('⚠️ ADMIN_EMAIL not configured - skipping admin notification');
//       return { success: false, skipped: true };
//     }
    
//     const subject = `New Newsletter Subscriber - ${subscriber.email}`;
    
//     const html = `
//       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f4f4; padding: 20px;">
//         <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
//           <h1 style="color: white; margin: 0; font-size: 28px;">${process.env.COMPANY_NAME || 'REC APPLY'}</h1>
//           <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Admin Notification</p>
//         </div>
        
//         <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
//           <h2 style="color: #333; margin-top: 0; border-bottom: 2px solid #f0f0f0; padding-bottom: 15px;">
//             New Newsletter Subscriber! 📧
//           </h2>
          
//           <div style="background-color: #fff3e0; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #f5576c;">
//             <h3 style="margin-top: 0; color: #f5576c; font-size: 20px;">Subscriber Details</h3>
            
//             <table style="width: 100%; border-collapse: collapse;">
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Email:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${subscriber.email}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Name:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${subscriber.name || 'Anonymous'}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Country:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${subscriber.country || 'Not specified'}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Source:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${subscriber.source || 'footer_newsletter'}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Subscription Date:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${new Date(subscriber.subscription_date).toLocaleString()}</td>
//               </tr>
//             </table>
//           </div>
          
//           <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
//             <h4 style="margin-top: 0; color: #333;">Total Subscribers: ${subscriber.totalCount || 'N/A'}</h4>
//           </div>
          
//           <hr style="border: none; border-top: 2px solid #f0f0f0; margin: 30px 0;">
          
//           <div style="text-align: center;">
//             <p style="color: #666; font-size: 14px; line-height: 1.6;">
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
//   }

//   async sendWelcomeBackEmail(email, name) {
//     const subject = 'Welcome Back to Our Newsletter! 👋';
    
//     const html = `
//       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f4f4; padding: 20px;">
//         <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
//           <h1 style="color: white; margin: 0; font-size: 28px;">${process.env.COMPANY_NAME || 'REC APPLY'}</h1>
//           <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Welcome Back</p>
//         </div>
        
//         <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
//           <h2 style="color: #333; margin-top: 0;">Welcome Back! 👋</h2>
          
//           <p style="font-size: 16px; line-height: 1.6; color: #555;">Hello ${name || 'there'}!</p>
          
//           <p style="font-size: 16px; line-height: 1.6; color: #555;">You've successfully re-subscribed to our newsletter. We're happy to have you back in our community!</p>
          
//           <div style="background-color: #e8f5e9; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #4CAF50;">
//             <p style="margin: 5px 0; color: #555; font-size: 16px;">✨ You'll continue receiving updates on:</p>
//             <ul style="color: #555;">
//               <li>Scholarship opportunities</li>
//               <li>University news</li>
//               <li>Visa updates</li>
//               <li>Study abroad tips</li>
//             </ul>
//           </div>
          
//           <hr style="border: none; border-top: 2px solid #f0f0f0; margin: 30px 0;">
          
//           <div style="text-align: center;">
//             <p style="color: #666; font-size: 14px; line-height: 1.6;">
//               Thank you for rejoining our community!
//             </p>
//           </div>
//         </div>
        
//         <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
//           © ${new Date().getFullYear()} ${process.env.COMPANY_NAME || 'REC APPLY'}. All rights reserved.
//         </div>
//       </div>
//     `;

//     return await this.sendEmail(email, subject, html);
//   }

//   // CREATE subscription
//   async subscribe(req, res) {
//     try {
//       const { email, name, country } = req.body;

//       if (!email) {
//         return res.status(400).json({ success: false, message: 'Email is required' });
//       }

//       // Validate email format
//       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//       if (!emailRegex.test(email)) {
//         return res.status(400).json({
//           success: false,
//           message: 'Please provide a valid email address'
//         });
//       }

//       // Check if email already exists
//       const existing = await Newsletter.findOne({ email: email.toLowerCase() });
//       if (existing) {
//         // If exists but is inactive, reactivate
//         if (!existing.isActive) {
//           existing.isActive = true;
//           existing.name = name || existing.name;
//           existing.country = country || existing.country;
//           existing.subscription_date = new Date();
//           await existing.save();

//           // Send welcome back email (fire and forget)
//           this.sendWelcomeBackEmail(email, existing.name)
//             .then(result => console.log(`📧 Welcome back email ${result.success ? 'sent' : 'failed'} to ${email}`))
//             .catch(err => console.error('Error sending welcome back email:', err));

//           return res.status(200).json({
//             success: true,
//             message: 'Subscription reactivated successfully',
//             data: existing
//           });
//         }

//         return res.status(409).json({ 
//           success: false, 
//           message: 'Email already subscribed' 
//         });
//       }

//       const newsletterData = {
//         email: email.toLowerCase(),
//         name: name || 'Anonymous',
//         country: country || 'Not specified',
//         source: req.body.source || 'footer_newsletter',
//         isActive: true
//       };

//       const newSub = await Newsletter.create(newsletterData);

//       // Get total count for admin notification
//       const totalCount = await Newsletter.countDocuments();

//       // Send emails (fire and forget - don't await)
//       Promise.allSettled([
//         this.sendConfirmationEmail(email, newsletterData.name),
//         this.sendAdminNotification({ ...newsletterData, totalCount })
//       ]).then(results => {
//         console.log(`📧 Newsletter emails sent: User: ${results[0].status}, Admin: ${results[1].status}`);
//         if (results[0].status === 'fulfilled' && results[0].value?.success) {
//           console.log(`✅ Confirmation email sent to ${email}`);
//         }
//         if (results[1].status === 'fulfilled' && results[1].value?.success) {
//           console.log(`✅ Admin notification sent for ${email}`);
//         }
//       }).catch(err => {
//         console.error('❌ Error sending newsletter notification emails:', err);
//       });

//       res.status(201).json({
//         success: true,
//         message: 'Subscribed successfully',
//         data: {
//           id: newSub._id,
//           email: newSub.email,
//           name: newSub.name,
//           country: newSub.country,
//           subscription_date: newSub.subscription_date,
//           isActive: newSub.isActive
//         }
//       });
//     } catch (error) {
//       console.error('❌ Newsletter subscription error:', error);
//       res.status(500).json({
//         success: false,
//         message: 'Server error while subscribing'
//       });
//     }
//   }

//   // GET all subscriptions
//   async getAll(req, res) {
//     try {
//       const { status, search, page = 1, limit = 20 } = req.query;

//       // Build query
//       const query = {};
      
//       if (status === 'active') {
//         query.isActive = true;
//       } else if (status === 'inactive') {
//         query.isActive = false;
//       }

//       if (search) {
//         query.$or = [
//           { email: { $regex: search, $options: 'i' } },
//           { name: { $regex: search, $options: 'i' } },
//           { country: { $regex: search, $options: 'i' } }
//         ];
//       }

//       // Pagination
//       const skip = (page - 1) * limit;

//       const [subscriptions, total] = await Promise.all([
//         Newsletter.find(query)
//           .sort({ subscription_date: -1 })
//           .skip(skip)
//           .limit(parseInt(limit))
//           .lean(),
//         Newsletter.countDocuments(query)
//       ]);

//       res.status(200).json({
//         success: true,
//         total,
//         totalPages: Math.ceil(total / limit),
//         currentPage: parseInt(page),
//         data: subscriptions
//       });
//     } catch (error) {
//       console.error('❌ Error fetching newsletter subscriptions:', error);
//       res.status(500).json({
//         success: false,
//         message: 'Server error while fetching subscriptions'
//       });
//     }
//   }

//   async getByEmail(req, res) {
//     try {
//       const { email } = req.params;

//       const subscriptions = await Newsletter.find({ email: email.toLowerCase() })
//         .sort({ subscription_date: -1 })
//         .lean();

//       res.status(200).json({
//         success: true,
//         total: subscriptions.length,
//         data: subscriptions
//       });
//     } catch (error) {
//       console.error('❌ Error fetching newsletter subscription by email:', error);
//       res.status(500).json({
//         success: false,
//         message: 'Server error while fetching subscriptions by email'
//       });
//     }
//   }

//   // Unsubscribe
//   async unsubscribe(req, res) {
//     try {
//       const { email } = req.params;

//       const subscriber = await Newsletter.findOne({ email: email.toLowerCase() });

//       if (!subscriber) {
//         return res.status(404).json({
//           success: false,
//           message: 'Email not found in our subscription list'
//         });
//       }

//       subscriber.isActive = false;
//       await subscriber.save();

//       console.log(`📧 User unsubscribed: ${email}`);

//       res.status(200).json({
//         success: true,
//         message: 'Successfully unsubscribed from newsletter'
//       });
//     } catch (error) {
//       console.error('❌ Error unsubscribing:', error);
//       res.status(500).json({
//         success: false,
//         message: 'Server error while unsubscribing'
//       });
//     }
//   }

//   // Reactivate subscription
//   async reactivate(req, res) {
//     try {
//       const { email } = req.params;

//       const subscriber = await Newsletter.findOne({ email: email.toLowerCase() });

//       if (!subscriber) {
//         return res.status(404).json({
//           success: false,
//           message: 'Email not found in our subscription list'
//         });
//       }

//       subscriber.isActive = true;
//       subscriber.subscription_date = new Date();
//       await subscriber.save();

//       // Send welcome back email (fire and forget)
//       this.sendWelcomeBackEmail(email, subscriber.name)
//         .then(result => console.log(`📧 Welcome back email ${result.success ? 'sent' : 'failed'} to ${email}`))
//         .catch(err => console.error('Error sending welcome back email:', err));

//       res.status(200).json({
//         success: true,
//         message: 'Subscription reactivated successfully',
//         data: {
//           id: subscriber._id,
//           email: subscriber.email,
//           name: subscriber.name,
//           country: subscriber.country,
//           subscription_date: subscriber.subscription_date,
//           isActive: subscriber.isActive
//         }
//       });
//     } catch (error) {
//       console.error('❌ Error reactivating subscription:', error);
//       res.status(500).json({
//         success: false,
//         message: 'Server error while reactivating subscription'
//       });
//     }
//   }

//   // Delete subscription
//   async delete(req, res) {
//     try {
//       const { id } = req.params;

//       const subscriber = await Newsletter.findByIdAndDelete(id);

//       if (!subscriber) {
//         return res.status(404).json({
//           success: false,
//           message: 'Subscription not found'
//         });
//       }

//       console.log(`📧 Subscription deleted: ${subscriber.email}`);

//       res.status(200).json({
//         success: true,
//         message: 'Subscription deleted successfully'
//       });
//     } catch (error) {
//       console.error('❌ Error deleting subscription:', error);
//       res.status(500).json({
//         success: false,
//         message: 'Server error while deleting subscription'
//       });
//     }
//   }

//   // =========================
//   // NEWSLETTER STATISTICS
//   // =========================
//   async getStatistics(req, res) {
//     try {
//       const today = new Date();
//       today.setHours(0, 0, 0, 0);

//       const startOfWeek = new Date(today);
//       startOfWeek.setDate(today.getDate() - today.getDay());

//       const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      
//       const startOfYear = new Date(today.getFullYear(), 0, 1);

//       const [
//         totalSubscribers,
//         activeSubscribers,
//         todaySubscribers,
//         weekSubscribers,
//         monthSubscribers,
//         yearSubscribers,
//         subscribersByCountry,
//         subscribersBySource,
//         monthlyTrend
//       ] = await Promise.all([
//         Newsletter.countDocuments(),
//         Newsletter.countDocuments({ isActive: true }),
//         Newsletter.countDocuments({
//           subscription_date: { $gte: today },
//           isActive: true
//         }),
//         Newsletter.countDocuments({
//           subscription_date: { $gte: startOfWeek },
//           isActive: true
//         }),
//         Newsletter.countDocuments({
//           subscription_date: { $gte: startOfMonth },
//           isActive: true
//         }),
//         Newsletter.countDocuments({
//           subscription_date: { $gte: startOfYear },
//           isActive: true
//         }),
//         Newsletter.aggregate([
//           { $match: { isActive: true } },
//           {
//             $group: {
//               _id: "$country",
//               count: { $sum: 1 }
//             }
//           },
//           { $sort: { count: -1 } },
//           { $limit: 10 }
//         ]),
//         Newsletter.aggregate([
//           { $match: { isActive: true } },
//           {
//             $group: {
//               _id: "$source",
//               count: { $sum: 1 }
//             }
//           },
//           { $sort: { count: -1 } }
//         ]),
//         Newsletter.aggregate([
//           {
//             $match: {
//               subscription_date: { $gte: startOfYear },
//               isActive: true
//             }
//           },
//           {
//             $group: {
//               _id: {
//                 year: { $year: "$subscription_date" },
//                 month: { $month: "$subscription_date" }
//               },
//               count: { $sum: 1 }
//             }
//           },
//           { $sort: { "_id.year": 1, "_id.month": 1 } }
//         ])
//       ]);

//       // Calculate growth rate
//       const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
//       const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
      
//       const lastMonthCount = await Newsletter.countDocuments({
//         subscription_date: { $gte: lastMonthStart, $lte: lastMonthEnd },
//         isActive: true
//       });

//       const growthRate = lastMonthCount > 0 
//         ? ((monthSubscribers - lastMonthCount) / lastMonthCount * 100).toFixed(2)
//         : monthSubscribers > 0 ? 100 : 0;

//       // Get email stats for the last 30 days
//       const emailStats = {
//         sent: 0,
//         failed: 0
//       };

//       res.status(200).json({
//         success: true,
//         data: {
//           overview: {
//             totalSubscribers,
//             activeSubscribers,
//             inactiveSubscribers: totalSubscribers - activeSubscribers,
//             engagementRate: totalSubscribers > 0 
//               ? ((activeSubscribers / totalSubscribers) * 100).toFixed(2) 
//               : 0
//           },
//           growth: {
//             today: todaySubscribers,
//             thisWeek: weekSubscribers,
//             thisMonth: monthSubscribers,
//             thisYear: yearSubscribers,
//             monthlyGrowthRate: growthRate
//           },
//           subscribersByCountry,
//           subscribersBySource,
//           monthlyTrend,
//           emailStats
//         }
//       });
//     } catch (error) {
//       console.error('❌ Newsletter statistics error:', error);
//       res.status(500).json({
//         success: false,
//         message: 'Server error while fetching statistics'
//       });
//     }
//   }

//   // Health check endpoint
//   async healthCheck(req, res) {
//     try {
//       const checks = {
//         database: await Newsletter.db.admin().ping() ? true : false,
//         emailConfigured: !!(process.env.SMTP_USER && process.env.SMTP_PASS),
//         uptime: process.uptime(),
//         timestamp: new Date().toISOString()
//       };
      
//       // Get total subscribers
//       const totalSubscribers = await Newsletter.countDocuments();
      
//       res.status(checks.database ? 200 : 503).json({ 
//         status: checks.database ? "healthy" : "degraded", 
//         checks,
//         totalSubscribers
//       });
//     } catch (error) {
//       console.error('❌ Health check error:', error);
//       res.status(503).json({ 
//         status: "unhealthy", 
//         error: error.message 
//       });
//     }
//   }
// }

// module.exports = new NewsletterController();


















const Newsletter = require('../models/Newsletter');
const nodemailer = require('nodemailer');

class NewsletterController {
  constructor() {
    this.subscribe = this.subscribe.bind(this);
    this.getAll = this.getAll.bind(this);
    this.getStatistics = this.getStatistics.bind(this);
  }

  /* =====================================================
     EMAIL TRANSPORTER - ALWAYS INITIALIZE
  ===================================================== */
  createTransporter() {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false
      },
      pool: true,
      maxConnections: 5,
      maxMessages: 100
    });
  }

  /* =====================================================
     EMAIL SERVICE - ALWAYS SEND EMAILS
  ===================================================== */
  async sendEmail(to, subject, html) {
    try {
      const transporter = this.createTransporter();
      
      console.log(`📧 Attempting to send email to: ${to} - Subject: ${subject}`);
      
      const info = await transporter.sendMail({
        from: `"${process.env.COMPANY_NAME || 'REC APPLY'} Newsletter" <${process.env.EMAIL_FROM || process.env.SMTP_USER}>`,
        to,
        subject,
        html
      });
      
      console.log(`✅ Email sent successfully to: ${to} - Message ID: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error(`❌ Email sending error to ${to}:`, error.message);
      
      // Don't throw - log and return failure but don't crash
      return { success: false, error: error.message };
    }
  }

  async sendConfirmationEmail(email, name) {
    const subject = 'Welcome to Our Newsletter! 📧';
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f4f4; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">${process.env.COMPANY_NAME || 'REC APPLY'}</h1>
          <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Newsletter Subscription</p>
        </div>
        
        <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-top: 0; border-bottom: 2px solid #f0f0f0; padding-bottom: 15px;">
            Welcome to Our Community! 🎉
          </h2>
          
          <p style="font-size: 16px; line-height: 1.6; color: #555;">Hello ${name || 'there'}!</p>
          
          <p style="font-size: 16px; line-height: 1.6; color: #555;">Thank you for subscribing to our newsletter. You're now part of our community and will receive regular updates about:</p>
          
          <div style="background-color: #f0f7ff; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #666;">🎓</td>
                <td style="padding: 8px 0; color: #333;"><strong>Scholarship Opportunities</strong> - Latest scholarships worldwide</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;">🏛️</td>
                <td style="padding: 8px 0; color: #333;"><strong>University News</strong> - Updates from top universities</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;">🛂</td>
                <td style="padding: 8px 0; color: #333;"><strong>Visa Updates</strong> - Latest visa policies and requirements</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;">📚</td>
                <td style="padding: 8px 0; color: #333;"><strong>Study Abroad Tips</strong> - Guides and resources</td>
              </tr>
            </table>
          </div>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h4 style="margin-top: 0; color: #333;">Your Subscription Details</h4>
            <p style="margin: 5px 0; color: #555;"><strong>Email:</strong> ${email}</p>
            <p style="margin: 5px 0; color: #555;"><strong>Subscription Date:</strong> ${new Date().toLocaleDateString()}</p>
            <p style="margin: 5px 0; color: #555;"><strong>Frequency:</strong> Weekly updates</p>
          </div>
          
          <hr style="border: none; border-top: 2px solid #f0f0f0; margin: 30px 0;">
          
          <div style="text-align: center;">
            <p style="color: #666; font-size: 14px; line-height: 1.6;">
              We're excited to have you on board! Stay tuned for valuable content.<br>
              If you ever wish to unsubscribe, you can do so from any newsletter email.
            </p>
          </div>
        </div>
        
        <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
          © ${new Date().getFullYear()} ${process.env.COMPANY_NAME || 'REC APPLY'}. All rights reserved.<br>
          This is an automated message, please do not reply to this email.
        </div>
      </div>
    `;

    return await this.sendEmail(email, subject, html);
  }

  async sendAdminNotification(subscriber) {
    if (!process.env.ADMIN_EMAIL) {
      console.log('⚠️ ADMIN_EMAIL not configured - cannot send admin notification');
      return { success: false, error: 'ADMIN_EMAIL not configured' };
    }
    
    const subject = `New Newsletter Subscriber - ${subscriber.email}`;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f4f4; padding: 20px;">
        <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">${process.env.COMPANY_NAME || 'REC APPLY'}</h1>
          <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Admin Notification</p>
        </div>
        
        <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-top: 0; border-bottom: 2px solid #f0f0f0; padding-bottom: 15px;">
            New Newsletter Subscriber! 📧
          </h2>
          
          <div style="background-color: #fff3e0; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #f5576c;">
            <h3 style="margin-top: 0; color: #f5576c; font-size: 20px;">Subscriber Details</h3>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Email:</strong></td>
                <td style="padding: 8px 0; color: #333;">${subscriber.email}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Name:</strong></td>
                <td style="padding: 8px 0; color: #333;">${subscriber.name || 'Anonymous'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Country:</strong></td>
                <td style="padding: 8px 0; color: #333;">${subscriber.country || 'Not specified'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Source:</strong></td>
                <td style="padding: 8px 0; color: #333;">${subscriber.source || 'footer_newsletter'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Subscription Date:</strong></td>
                <td style="padding: 8px 0; color: #333;">${new Date(subscriber.subscription_date).toLocaleString()}</td>
              </tr>
            </table>
          </div>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h4 style="margin-top: 0; color: #333;">Total Subscribers: ${subscriber.totalCount || 'N/A'}</h4>
          </div>
          
          <hr style="border: none; border-top: 2px solid #f0f0f0; margin: 30px 0;">
          
          <div style="text-align: center;">
            <p style="color: #666; font-size: 14px; line-height: 1.6;">
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
  }

  async sendWelcomeBackEmail(email, name) {
    const subject = 'Welcome Back to Our Newsletter! 👋';
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f4f4; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">${process.env.COMPANY_NAME || 'REC APPLY'}</h1>
          <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Welcome Back</p>
        </div>
        
        <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-top: 0;">Welcome Back! 👋</h2>
          
          <p style="font-size: 16px; line-height: 1.6; color: #555;">Hello ${name || 'there'}!</p>
          
          <p style="font-size: 16px; line-height: 1.6; color: #555;">You've successfully re-subscribed to our newsletter. We're happy to have you back in our community!</p>
          
          <div style="background-color: #e8f5e9; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #4CAF50;">
            <p style="margin: 5px 0; color: #555; font-size: 16px;">✨ You'll continue receiving updates on:</p>
            <ul style="color: #555;">
              <li>Scholarship opportunities</li>
              <li>University news</li>
              <li>Visa updates</li>
              <li>Study abroad tips</li>
            </ul>
          </div>
          
          <hr style="border: none; border-top: 2px solid #f0f0f0; margin: 30px 0;">
          
          <div style="text-align: center;">
            <p style="color: #666; font-size: 14px; line-height: 1.6;">
              Thank you for rejoining our community!
            </p>
          </div>
        </div>
        
        <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
          © ${new Date().getFullYear()} ${process.env.COMPANY_NAME || 'REC APPLY'}. All rights reserved.
        </div>
      </div>
    `;

    return await this.sendEmail(email, subject, html);
  }

  // CREATE subscription
  async subscribe(req, res) {
    try {
      const { email, name, country } = req.body;

      if (!email) {
        return res.status(400).json({ success: false, message: 'Email is required' });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid email address'
        });
      }

      // Check if email already exists
      const existing = await Newsletter.findOne({ email: email.toLowerCase() });
      if (existing) {
        // If exists but is inactive, reactivate
        if (!existing.isActive) {
          existing.isActive = true;
          existing.name = name || existing.name;
          existing.country = country || existing.country;
          existing.subscription_date = new Date();
          await existing.save();

          // Send welcome back email (fire and forget)
          const emailResult = await this.sendWelcomeBackEmail(email, existing.name);
          
          console.log(`📧 Welcome back email ${emailResult.success ? 'sent' : 'failed'} to ${email} - ${emailResult.error || ''}`);

          return res.status(200).json({
            success: true,
            message: 'Subscription reactivated successfully',
            emailSent: emailResult.success,
            emailError: emailResult.error || null,
            data: existing
          });
        }

        return res.status(409).json({ 
          success: false, 
          message: 'Email already subscribed' 
        });
      }

      const newsletterData = {
        email: email.toLowerCase(),
        name: name || 'Anonymous',
        country: country || 'Not specified',
        source: req.body.source || 'footer_newsletter',
        isActive: true
      };

      const newSub = await Newsletter.create(newsletterData);

      // Get total count for admin notification
      const totalCount = await Newsletter.countDocuments();

      // Send emails and wait for results
      const emailResults = await Promise.allSettled([
        this.sendConfirmationEmail(email, newsletterData.name),
        this.sendAdminNotification({ ...newsletterData, totalCount })
      ]);

      const confirmationResult = emailResults[0].status === 'fulfilled' ? emailResults[0].value : { success: false, error: emailResults[0].reason?.message };
      const adminResult = emailResults[1].status === 'fulfilled' ? emailResults[1].value : { success: false, error: emailResults[1].reason?.message };

      console.log(`📧 Newsletter emails: User: ${confirmationResult.success ? 'sent' : 'failed'}, Admin: ${adminResult.success ? 'sent' : 'failed'}`);

      res.status(201).json({
        success: true,
        message: 'Subscribed successfully',
        emails: {
          confirmation: {
            sent: confirmationResult.success,
            error: confirmationResult.error || null
          },
          admin: {
            sent: adminResult.success,
            error: adminResult.error || null
          }
        },
        data: {
          id: newSub._id,
          email: newSub.email,
          name: newSub.name,
          country: newSub.country,
          subscription_date: newSub.subscription_date,
          isActive: newSub.isActive
        }
      });
    } catch (error) {
      console.error('❌ Newsletter subscription error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error while subscribing'
      });
    }
  }

  // GET all subscriptions
  async getAll(req, res) {
    try {
      const { status, search, page = 1, limit = 20 } = req.query;

      // Build query
      const query = {};
      
      if (status === 'active') {
        query.isActive = true;
      } else if (status === 'inactive') {
        query.isActive = false;
      }

      if (search) {
        query.$or = [
          { email: { $regex: search, $options: 'i' } },
          { name: { $regex: search, $options: 'i' } },
          { country: { $regex: search, $options: 'i' } }
        ];
      }

      // Pagination
      const skip = (page - 1) * limit;

      const [subscriptions, total] = await Promise.all([
        Newsletter.find(query)
          .sort({ subscription_date: -1 })
          .skip(skip)
          .limit(parseInt(limit))
          .lean(),
        Newsletter.countDocuments(query)
      ]);

      res.status(200).json({
        success: true,
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: parseInt(page),
        data: subscriptions
      });
    } catch (error) {
      console.error('❌ Error fetching newsletter subscriptions:', error);
      res.status(500).json({
        success: false,
        message: 'Server error while fetching subscriptions'
      });
    }
  }

  async getByEmail(req, res) {
    try {
      const { email } = req.params;

      const subscriptions = await Newsletter.find({ email: email.toLowerCase() })
        .sort({ subscription_date: -1 })
        .lean();

      res.status(200).json({
        success: true,
        total: subscriptions.length,
        data: subscriptions
      });
    } catch (error) {
      console.error('❌ Error fetching newsletter subscription by email:', error);
      res.status(500).json({
        success: false,
        message: 'Server error while fetching subscriptions by email'
      });
    }
  }

  // Unsubscribe
  async unsubscribe(req, res) {
    try {
      const { email } = req.params;

      const subscriber = await Newsletter.findOne({ email: email.toLowerCase() });

      if (!subscriber) {
        return res.status(404).json({
          success: false,
          message: 'Email not found in our subscription list'
        });
      }

      subscriber.isActive = false;
      await subscriber.save();

      console.log(`📧 User unsubscribed: ${email}`);

      res.status(200).json({
        success: true,
        message: 'Successfully unsubscribed from newsletter'
      });
    } catch (error) {
      console.error('❌ Error unsubscribing:', error);
      res.status(500).json({
        success: false,
        message: 'Server error while unsubscribing'
      });
    }
  }

  // Reactivate subscription
  async reactivate(req, res) {
    try {
      const { email } = req.params;

      const subscriber = await Newsletter.findOne({ email: email.toLowerCase() });

      if (!subscriber) {
        return res.status(404).json({
          success: false,
          message: 'Email not found in our subscription list'
        });
      }

      subscriber.isActive = true;
      subscriber.subscription_date = new Date();
      await subscriber.save();

      // Send welcome back email and wait for result
      const emailResult = await this.sendWelcomeBackEmail(email, subscriber.name);
      
      console.log(`📧 Welcome back email ${emailResult.success ? 'sent' : 'failed'} to ${email} - ${emailResult.error || ''}`);

      res.status(200).json({
        success: true,
        message: 'Subscription reactivated successfully',
        emailSent: emailResult.success,
        emailError: emailResult.error || null,
        data: {
          id: subscriber._id,
          email: subscriber.email,
          name: subscriber.name,
          country: subscriber.country,
          subscription_date: subscriber.subscription_date,
          isActive: subscriber.isActive
        }
      });
    } catch (error) {
      console.error('❌ Error reactivating subscription:', error);
      res.status(500).json({
        success: false,
        message: 'Server error while reactivating subscription'
      });
    }
  }

  // Delete subscription
  async delete(req, res) {
    try {
      const { id } = req.params;

      const subscriber = await Newsletter.findByIdAndDelete(id);

      if (!subscriber) {
        return res.status(404).json({
          success: false,
          message: 'Subscription not found'
        });
      }

      console.log(`📧 Subscription deleted: ${subscriber.email}`);

      res.status(200).json({
        success: true,
        message: 'Subscription deleted successfully'
      });
    } catch (error) {
      console.error('❌ Error deleting subscription:', error);
      res.status(500).json({
        success: false,
        message: 'Server error while deleting subscription'
      });
    }
  }

  // =========================
  // NEWSLETTER STATISTICS
  // =========================
  async getStatistics(req, res) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());

      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      
      const startOfYear = new Date(today.getFullYear(), 0, 1);

      const [
        totalSubscribers,
        activeSubscribers,
        todaySubscribers,
        weekSubscribers,
        monthSubscribers,
        yearSubscribers,
        subscribersByCountry,
        subscribersBySource,
        monthlyTrend
      ] = await Promise.all([
        Newsletter.countDocuments(),
        Newsletter.countDocuments({ isActive: true }),
        Newsletter.countDocuments({
          subscription_date: { $gte: today },
          isActive: true
        }),
        Newsletter.countDocuments({
          subscription_date: { $gte: startOfWeek },
          isActive: true
        }),
        Newsletter.countDocuments({
          subscription_date: { $gte: startOfMonth },
          isActive: true
        }),
        Newsletter.countDocuments({
          subscription_date: { $gte: startOfYear },
          isActive: true
        }),
        Newsletter.aggregate([
          { $match: { isActive: true } },
          {
            $group: {
              _id: "$country",
              count: { $sum: 1 }
            }
          },
          { $sort: { count: -1 } },
          { $limit: 10 }
        ]),
        Newsletter.aggregate([
          { $match: { isActive: true } },
          {
            $group: {
              _id: "$source",
              count: { $sum: 1 }
            }
          },
          { $sort: { count: -1 } }
        ]),
        Newsletter.aggregate([
          {
            $match: {
              subscription_date: { $gte: startOfYear },
              isActive: true
            }
          },
          {
            $group: {
              _id: {
                year: { $year: "$subscription_date" },
                month: { $month: "$subscription_date" }
              },
              count: { $sum: 1 }
            }
          },
          { $sort: { "_id.year": 1, "_id.month": 1 } }
        ])
      ]);

      // Calculate growth rate
      const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
      
      const lastMonthCount = await Newsletter.countDocuments({
        subscription_date: { $gte: lastMonthStart, $lte: lastMonthEnd },
        isActive: true
      });

      const growthRate = lastMonthCount > 0 
        ? ((monthSubscribers - lastMonthCount) / lastMonthCount * 100).toFixed(2)
        : monthSubscribers > 0 ? 100 : 0;

      // Get email stats for the last 30 days
      const emailStats = {
        sent: 0,
        failed: 0
      };

      res.status(200).json({
        success: true,
        data: {
          overview: {
            totalSubscribers,
            activeSubscribers,
            inactiveSubscribers: totalSubscribers - activeSubscribers,
            engagementRate: totalSubscribers > 0 
              ? ((activeSubscribers / totalSubscribers) * 100).toFixed(2) 
              : 0
          },
          growth: {
            today: todaySubscribers,
            thisWeek: weekSubscribers,
            thisMonth: monthSubscribers,
            thisYear: yearSubscribers,
            monthlyGrowthRate: growthRate
          },
          subscribersByCountry,
          subscribersBySource,
          monthlyTrend,
          emailStats
        }
      });
    } catch (error) {
      console.error('❌ Newsletter statistics error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error while fetching statistics'
      });
    }
  }

  // Health check endpoint
  async healthCheck(req, res) {
    try {
      const checks = {
        database: await Newsletter.db.admin().ping() ? true : false,
        emailConfigured: !!(process.env.SMTP_USER && process.env.SMTP_PASS),
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
      };
      
      // Get total subscribers
      const totalSubscribers = await Newsletter.countDocuments();
      
      res.status(checks.database ? 200 : 503).json({ 
        status: checks.database ? "healthy" : "degraded", 
        checks,
        totalSubscribers
      });
    } catch (error) {
      console.error('❌ Health check error:', error);
      res.status(503).json({ 
        status: "unhealthy", 
        error: error.message 
      });
    }
  }
}

module.exports = new NewsletterController();