

// const Enquiry = require("../models/Enquiry");
// const EmailLog = require("../models/EmailLog");
// const mongoose = require("mongoose");
// const moment = require("moment");
// const nodemailer = require("nodemailer");

// class EnquiryController {
//   constructor() {
//     this.initEmailTransporter();
//     this.verifyEmailTransporter();
//   }

//   // ======================
//   // EMAIL TRANSPORTER
//   // ======================
//   initEmailTransporter() {
//     const emailUser = process.env.SMTP_USER;
//     const emailPass = process.env.SMTP_PASS;

//     if (!emailUser || !emailPass) {
//       console.warn("⚠️ SMTP credentials missing. Emails will be disabled.");
//       this.transporter = null;
//       return;
//     }

//     this.transporter = nodemailer.createTransport({
//       host: process.env.SMTP_HOST,
//       port: parseInt(process.env.SMTP_PORT),
//       secure: false,
//       auth: { user: emailUser, pass: emailPass },
//       tls: { rejectUnauthorized: false },
//       pool: true,
//       maxConnections: 5,
//       maxMessages: 100,
//     });

//     console.log("✅ Email transporter initialized");
//   }

//   async verifyEmailTransporter() {
//     if (!this.transporter) return false;
//     try {
//       await this.transporter.verify();
//       console.log("✅ Email transporter verified");
//       return true;
//     } catch (error) {
//       console.error("❌ Email verification failed:", error.message);
//       return false;
//     }
//   }

//   async sendEmail(options) {
//     if (!this.transporter) return null;

//     const mailOptions = {
//       from: `"${process.env.COMPANY_NAME || 'REC APPLY'} Enquiries" <${process.env.EMAIL_FROM}>`,
//       to: options.to,
//       subject: options.subject,
//       html: options.html,
//       text: options.text || this.stripHtml(options.html),
//     };

//     const emailLog = new EmailLog({
//       enquiryId: options.enquiryId,
//       recipientType: options.recipientType,
//       emailType: options.emailType,
//       recipientEmail: options.to,
//       subject: options.subject,
//       content: options.html,
//       status: "pending",
//       metadata: options.metadata || {},
//     });

//     try {
//       await emailLog.save();

//       const sendPromise = this.transporter.sendMail(mailOptions);
//       const timeoutPromise = new Promise((_, reject) =>
//         setTimeout(() => reject(new Error("Email timeout")), 30000)
//       );

//       const info = await Promise.race([sendPromise, timeoutPromise]);

//       emailLog.status = "sent";
//       emailLog.messageId = info.messageId;
//       emailLog.sentAt = new Date();
//       await emailLog.save();

//       console.log(`✅ Email sent: ${options.to}`);
//       return info;
//     } catch (error) {
//       console.error("❌ Email send error:", error.message);
//       await EmailLog.findOneAndUpdate(
//         { enquiryId: options.enquiryId, recipientEmail: options.to },
//         { status: "failed", errorMessage: error.message, sentAt: new Date() },
//         { new: true, sort: { createdAt: -1 } }
//       );
//       return null;
//     }
//   }

//   stripHtml(html) {
//     return html
//       .replace(/<[^>]*>/g, "")
//       .replace(/\s+/g, " ")
//       .trim();
//   }

//   async sendEnquiryEmails(enquiry) {
//     if (!this.transporter)
//       return { userEmail: "skipped", adminEmail: "skipped" };

//     const userEmail = this.sendEmail({
//       to: enquiry.email,
//       subject: `Enquiry Confirmation - ${enquiry.course}`,
//       html: this.getUserEmailTemplate(enquiry),
//       enquiryId: enquiry._id,
//       recipientType: "user",
//       emailType: "confirmation",
//     });

//     const adminEmail = this.sendEmail({
//       to: process.env.ADMIN_EMAIL,
//       subject: `📋 New Enquiry: ${enquiry.name} - ${enquiry.course}`,
//       html: this.getAdminEmailTemplate(enquiry),
//       enquiryId: enquiry._id,
//       recipientType: "admin",
//       emailType: "notification",
//     });

//     const [userResult, adminResult] = await Promise.allSettled([
//       userEmail,
//       adminEmail,
//     ]);

//     return {
//       userEmail:
//         userResult.status === "fulfilled" && userResult.value
//           ? "sent"
//           : "failed",
//       adminEmail:
//         adminResult.status === "fulfilled" && adminResult.value
//           ? "sent"
//           : "failed",
//     };
//   }

//   // ======================
//   // EMAIL TEMPLATES
//   // ======================
//   getUserEmailTemplate(enquiry) {
//     return `
//       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f4f4; padding: 20px;">
//         <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
//           <h1 style="color: white; margin: 0; font-size: 28px;">${process.env.COMPANY_NAME || 'REC APPLY'}</h1>
//           <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Enquiry Confirmation</p>
//         </div>
        
//         <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
//           <h2 style="color: #333; margin-top: 0; border-bottom: 2px solid #f0f0f0; padding-bottom: 15px;">
//             Thank You for Your Enquiry! 📋
//           </h2>
          
//           <p style="font-size: 16px; line-height: 1.6; color: #555;">Dear ${enquiry.name},</p>
          
//           <p style="font-size: 16px; line-height: 1.6; color: #555;">Thank you for your enquiry. We have received your request and one of our advisors will contact you shortly. Here are the details you submitted:</p>
          
//           <div style="background-color: #f0f7ff; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #667eea;">
//             <h3 style="margin-top: 0; color: #667eea; font-size: 20px;">Enquiry Reference: ENQ-${enquiry._id.toString().slice(-8).toUpperCase()}</h3>
            
//             <table style="width: 100%; border-collapse: collapse;">
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Name:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${enquiry.name}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Email:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${enquiry.email}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Phone:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${enquiry.phone}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Country:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${enquiry.country}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Course of Interest:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${enquiry.course}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Enquiry Date:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${moment(enquiry.createdAt).format('MMMM Do YYYY, h:mm a')}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Status:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">
//                   <span style="background-color: #FFC107; color: #333; padding: 3px 10px; border-radius: 12px; font-size: 12px;">
//                     ${enquiry.status || 'New'}
//                   </span>
//                 </td>
//               </tr>
//             </table>
            
//             ${enquiry.message ? `
//               <div style="margin-top: 15px;">
//                 <strong style="color: #666;">Your Message:</strong>
//                 <p style="color: #555; font-style: italic; margin: 5px 0 0 0; background-color: white; padding: 10px; border-radius: 5px;">${enquiry.message}</p>
//               </div>
//             ` : ''}
//           </div>
          
//           <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
//             <h4 style="margin-top: 0; color: #333;">What Happens Next?</h4>
//             <ol style="margin: 5px 0 0 0; color: #555;">
//               <li style="margin: 5px 0;">Our education advisor will review your enquiry within 24 hours</li>
//               <li style="margin: 5px 0;">You'll receive a response via email or phone call</li>
//               <li style="margin: 5px 0;">We'll provide detailed information about your chosen course</li>
//               <li style="margin: 5px 0;">We can schedule a consultation to discuss your study plans</li>
//             </ol>
//           </div>
          
//           <hr style="border: none; border-top: 2px solid #f0f0f0; margin: 30px 0;">
          
//           <div style="text-align: center;">
//             <p style="color: #666; font-size: 14px; line-height: 1.6;">
//               We look forward to helping you achieve your educational goals!<br>
//               If you have any questions, please don't hesitate to contact us.
//             </p>
//           </div>
//         </div>
        
//         <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
//           © ${new Date().getFullYear()} ${process.env.COMPANY_NAME || 'REC APPLY'}. All rights reserved.<br>
//           This is an automated message, please do not reply to this email.
//         </div>
//       </div>
//     `;
//   }

//   getAdminEmailTemplate(enquiry) {
//     return `
//       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f4f4; padding: 20px;">
//         <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
//           <h1 style="color: white; margin: 0; font-size: 28px;">${process.env.COMPANY_NAME || 'REC APPLY'}</h1>
//           <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Admin Notification - New Enquiry</p>
//         </div>
        
//         <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
//           <h2 style="color: #333; margin-top: 0; border-bottom: 2px solid #f0f0f0; padding-bottom: 15px;">
//             New Enquiry Alert! 📋
//           </h2>
          
//           <div style="background-color: #fff3e0; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #f5576c;">
//             <h3 style="margin-top: 0; color: #f5576c; font-size: 20px;">Enquiry Reference: ENQ-${enquiry._id.toString().slice(-8).toUpperCase()}</h3>
            
//             <table style="width: 100%; border-collapse: collapse;">
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Name:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${enquiry.name}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Email:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${enquiry.email}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Phone:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${enquiry.phone}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Country:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${enquiry.country}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Course of Interest:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${enquiry.course}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Status:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">
//                   <span style="background-color: #FFC107; color: #333; padding: 3px 10px; border-radius: 12px; font-size: 12px;">
//                     ${enquiry.status || 'New'}
//                   </span>
//                 </td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Received on:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${moment(enquiry.createdAt).format('MMMM Do YYYY, h:mm a')}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Source:</strong></td>
//                 <td style="padding: 8px 0; color: #333; word-break: break-all;">${enquiry.source || 'Website'}</td>
//               </tr>
//             </table>
            
//             ${enquiry.message ? `
//               <div style="margin-top: 15px; background-color: #fff9e6; padding: 15px; border-radius: 5px;">
//                 <strong style="color: #666;">Message:</strong>
//                 <p style="color: #555; margin: 5px 0 0 0;">${enquiry.message}</p>
//               </div>
//             ` : ''}
//           </div>
          
//           <hr style="border: none; border-top: 2px solid #f0f0f0; margin: 30px 0;">
          
//           <div style="text-align: center;">
//             <p style="color: #666; font-size: 14px; line-height: 1.6;">
//               Please review this enquiry and respond within 24 hours.<br>
//               This is an automated admin notification from ${process.env.COMPANY_NAME || 'REC APPLY'}.
//             </p>
//           </div>
//         </div>
        
//         <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
//           © ${new Date().getFullYear()} ${process.env.COMPANY_NAME || 'REC APPLY'}. All rights reserved.
//         </div>
//       </div>
//     `;
//   }

//   getFollowupEmailTemplate(enquiry, message) {
//     return `
//       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f4f4; padding: 20px;">
//         <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
//           <h1 style="color: white; margin: 0; font-size: 28px;">${process.env.COMPANY_NAME || 'REC APPLY'}</h1>
//           <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Follow-up Regarding Your Enquiry</p>
//         </div>
        
//         <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
//           <h2 style="color: #333; margin-top: 0; border-bottom: 2px solid #f0f0f0; padding-bottom: 15px;">
//             Follow-up on Your Enquiry
//           </h2>
          
//           <p style="font-size: 16px; line-height: 1.6; color: #555;">Dear ${enquiry.name},</p>
          
//           <div style="background-color: #f0f7ff; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #667eea;">
//             <h3 style="margin-top: 0; color: #667eea; font-size: 18px;">Enquiry Reference: ENQ-${enquiry._id.toString().slice(-8).toUpperCase()}</h3>
            
//             <p style="color: #555; line-height: 1.6;">${message}</p>
//           </div>
          
//           <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
//             <h4 style="margin-top: 0; color: #333;">Original Enquiry Summary</h4>
//             <p style="margin: 5px 0; color: #555;"><strong>Course:</strong> ${enquiry.course}</p>
//             <p style="margin: 5px 0; color: #555;"><strong>Submitted on:</strong> ${moment(enquiry.createdAt).format('MMMM Do YYYY')}</p>
//           </div>
          
//           <hr style="border: none; border-top: 2px solid #f0f0f0; margin: 30px 0;">
          
//           <div style="text-align: center;">
//             <p style="color: #666; font-size: 14px; line-height: 1.6;">
//               Feel free to reply to this email if you have any questions.<br>
//               We're here to help!
//             </p>
//           </div>
//         </div>
        
//         <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
//           © ${new Date().getFullYear()} ${process.env.COMPANY_NAME || 'REC APPLY'}. All rights reserved.
//         </div>
//       </div>
//     `;
//   }

//   // ======================
//   // CRUD OPERATIONS
//   // ======================
//   async createEnquiry(req, res) {
//     try {
//       const { name, email, phone, country, course, message } = req.body;

//       const errors = [];
//       if (!name || name.trim().length < 2) errors.push("Name too short");
//       if (!email || !this.validateEmail(email)) errors.push("Invalid email");
//       if (!phone || phone.trim().length < 5) errors.push("Invalid phone");
//       if (!country || country.trim().length < 2) errors.push("Invalid country");
//       if (!course || course.trim().length < 2) errors.push("Invalid course");
      
//       if (errors.length) {
//         return res.status(400).json({ success: false, errors });
//       }

//       // Check for duplicate in last 24 hours
//       const recent = await Enquiry.findOne({
//         email: email.toLowerCase(),
//         createdAt: { $gte: moment().subtract(24, "hours").toDate() },
//         isDeleted: false,
//       });
      
//       if (recent) {
//         return res.status(409).json({
//           success: false,
//           message: "Duplicate enquiry recently submitted"
//         });
//       }

//       const enquiry = new Enquiry({
//         name: name.trim(),
//         email: email.toLowerCase().trim(),
//         phone: phone.trim(),
//         country: country.trim(),
//         course: course.trim(),
//         message: message?.trim() || "",
//         status: "new",
//         source: req.headers['user-agent'] || req.headers['origin'] || "website",
//         ip: req.ip || req.connection.remoteAddress
//       });
      
//       await enquiry.save();

//       // Send emails (fire and forget)
//       this.sendEnquiryEmails(enquiry).then(r =>
//         console.log("Email results:", r)
//       );

//       res.status(201).json({
//         success: true,
//         message: "Enquiry submitted successfully",
//         data: {
//           id: enquiry._id,
//           name: enquiry.name,
//           email: enquiry.email,
//           course: enquiry.course,
//           status: enquiry.status,
//           createdAt: enquiry.createdAt,
//           referenceNumber: `ENQ-${enquiry._id.toString().slice(-8).toUpperCase()}`,
//         },
//       });
//     } catch (error) {
//       console.error("❌ Create enquiry error:", error);
//       res.status(500).json({ success: false, message: "Failed to create enquiry" });
//     }
//   }

//   async getAllEnquiries(req, res) {
//     try {
//       const {
//         page = 1,
//         limit = 20,
//         status,
//         course,
//         startDate,
//         endDate,
//         search,
//         sortBy = "createdAt",
//         sortOrder = "desc",
//       } = req.query;
      
//       const query = { isDeleted: false };
      
//       if (status) query.status = status;
//       if (course) query.course = { $regex: course, $options: "i" };
      
//       if (startDate || endDate) {
//         query.createdAt = {};
//         if (startDate) query.createdAt.$gte = new Date(startDate);
//         if (endDate) query.createdAt.$lte = new Date(endDate);
//       }
      
//       if (search) {
//         query.$or = [
//           "name",
//           "email",
//           "phone",
//           "country",
//           "course",
//           "message",
//         ].map((f) => ({ [f]: { $regex: search, $options: "i" } }));
//       }

//       const [enquiries, total] = await Promise.all([
//         Enquiry.find(query)
//           .sort({ [sortBy]: sortOrder === "desc" ? -1 : 1 })
//           .skip((parseInt(page) - 1) * parseInt(limit))
//           .limit(parseInt(limit))
//           .lean(),
//         Enquiry.countDocuments(query),
//       ]);

//       res.json({
//         success: true,
//         data: enquiries,
//         pagination: { 
//           total, 
//           page: parseInt(page), 
//           limit: parseInt(limit),
//           totalPages: Math.ceil(total / parseInt(limit))
//         },
//       });
//     } catch (error) {
//       console.error("❌ Get all enquiries error:", error);
//       res.status(500).json({ success: false, message: "Failed to fetch enquiries" });
//     }
//   }

//   async getEnquiriesByEmail(req, res) {
//     try {
//       const { email } = req.params;
//       const {
//         page = 1,
//         limit = 20,
//         status,
//         course,
//         startDate,
//         endDate,
//         search,
//         sortBy = "createdAt",
//         sortOrder = "desc",
//       } = req.query;

//       const query = {
//         isDeleted: false,
//         email: email.toLowerCase(),
//       };

//       if (status) query.status = status;
//       if (course) query.course = { $regex: course, $options: "i" };
      
//       if (startDate || endDate) {
//         query.createdAt = {};
//         if (startDate) query.createdAt.$gte = new Date(startDate);
//         if (endDate) query.createdAt.$lte = new Date(endDate);
//       }

//       if (search) {
//         query.$or = ["name", "phone", "country", "course", "message"].map(
//           (f) => ({ [f]: { $regex: search, $options: "i" } })
//         );
//       }

//       const [enquiries, total] = await Promise.all([
//         Enquiry.find(query)
//           .sort({ [sortBy]: sortOrder === "desc" ? -1 : 1 })
//           .skip((parseInt(page) - 1) * parseInt(limit))
//           .limit(parseInt(limit))
//           .lean(),
//         Enquiry.countDocuments(query),
//       ]);

//       res.json({
//         success: true,
//         data: enquiries,
//         pagination: { 
//           total, 
//           page: parseInt(page), 
//           limit: parseInt(limit),
//           totalPages: Math.ceil(total / parseInt(limit))
//         },
//       });
//     } catch (error) {
//       console.error("❌ Get enquiries by email error:", error);
//       res.status(500).json({
//         success: false,
//         message: "Failed to fetch enquiries by email",
//       });
//     }
//   }

//   async getEnquiryById(req, res) {
//     try {
//       const { id } = req.params;
//       if (!mongoose.Types.ObjectId.isValid(id)) {
//         return res.status(400).json({ success: false, message: "Invalid ID" });
//       }

//       const enquiry = await Enquiry.findOne({
//         _id: id,
//         isDeleted: false,
//       }).lean();
      
//       if (!enquiry) {
//         return res.status(404).json({ success: false, message: "Enquiry not found" });
//       }

//       const emailLogs = await EmailLog.find({ enquiryId: id })
//         .sort({ createdAt: -1 })
//         .lean();
        
//       res.json({
//         success: true,
//         data: { ...enquiry, emailHistory: emailLogs },
//       });
//     } catch (error) {
//       console.error("❌ Get enquiry by ID error:", error);
//       res.status(500).json({ success: false, message: "Failed to fetch enquiry" });
//     }
//   }

//   async updateEnquiry(req, res) {
//     try {
//       const { id } = req.params;
//       const updateData = req.body;
      
//       if (!mongoose.Types.ObjectId.isValid(id)) {
//         return res.status(400).json({ success: false, message: "Invalid ID" });
//       }

//       const allowed = ["status", "message", "notes", "assignedTo", "priority"];
//       const updates = Object.keys(updateData).reduce(
//         (acc, key) =>
//           allowed.includes(key) ? ((acc[key] = updateData[key]), acc) : acc,
//         {}
//       );
//       updates.updatedAt = Date.now();

//       const enquiry = await Enquiry.findOneAndUpdate(
//         { _id: id, isDeleted: false },
//         updates,
//         { new: true, runValidators: true }
//       );
      
//       if (!enquiry) {
//         return res.status(404).json({ success: false, message: "Enquiry not found" });
//       }

//       res.json({ success: true, message: "Enquiry updated", data: enquiry });
//     } catch (error) {
//       console.error("❌ Update enquiry error:", error);
//       res.status(500).json({ success: false, message: "Failed to update enquiry" });
//     }
//   }

//   async deleteEnquiry(req, res) {
//     try {
//       const { id } = req.params;
//       if (!mongoose.Types.ObjectId.isValid(id)) {
//         return res.status(400).json({ success: false, message: "Invalid ID" });
//       }

//       const enquiry = await Enquiry.findOneAndUpdate(
//         { _id: id, isDeleted: false },
//         { isDeleted: true, deletedAt: Date.now(), updatedAt: Date.now() },
//         { new: true }
//       );

//       if (!enquiry) {
//         return res.status(404).json({ success: false, message: "Enquiry not found" });
//       }

//       res.json({
//         success: true,
//         message: "Enquiry deleted",
//         data: { id: enquiry._id, deletedAt: enquiry.deletedAt },
//       });
//     } catch (error) {
//       console.error("❌ Delete enquiry error:", error);
//       res.status(500).json({ success: false, message: "Failed to delete enquiry" });
//     }
//   }

//   // ======================
//   // EMAIL UTILITIES
//   // ======================
//   validateEmail(email) {
//     return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
//   }

//   async sendFollowupEmail(req, res) {
//     try {
//       const { enquiryId, message } = req.body;
      
//       if (!enquiryId || !message) {
//         return res.status(400).json({ success: false, message: "ID & message required" });
//       }
      
//       if (!mongoose.Types.ObjectId.isValid(enquiryId)) {
//         return res.status(400).json({ success: false, message: "Invalid ID" });
//       }

//       const enquiry = await Enquiry.findOne({
//         _id: enquiryId,
//         isDeleted: false,
//       });
      
//       if (!enquiry) {
//         return res.status(404).json({ success: false, message: "Enquiry not found" });
//       }

//       const result = await this.sendEmail({
//         to: enquiry.email,
//         subject: `Follow-up regarding your enquiry: ${enquiry.course}`,
//         html: this.getFollowupEmailTemplate(enquiry, message),
//         enquiryId: enquiry._id,
//         recipientType: "user",
//         emailType: "followup",
//         metadata: { followup: true, followupMessage: message },
//       });

//       if (!result) {
//         return res.status(500).json({ success: false, message: "Failed to send follow-up" });
//       }

//       res.json({
//         success: true,
//         message: "Follow-up sent successfully",
//         data: { enquiryId: enquiry._id, recipient: enquiry.email },
//       });
//     } catch (error) {
//       console.error("❌ Follow-up email error:", error);
//       res.status(500).json({ success: false, message: "Failed to send follow-up" });
//     }
//   }

//   // ======================
//   // DASHBOARD & STATS
//   // ======================
//   async getDashboardStatistics(req, res) {
//     try {
//       const today = moment().startOf('day');
//       const startOfWeek = moment().startOf('week');
//       const startOfMonth = moment().startOf('month');

//       const [
//         totalEnquiries,
//         todayEnquiries,
//         weekEnquiries,
//         monthEnquiries,
//         pendingEnquiries,
//         inProgressEnquiries,
//         resolvedEnquiries,
//         enquiriesByStatus,
//         enquiriesByCourse
//       ] = await Promise.all([
//         Enquiry.countDocuments({ isDeleted: false }),
//         Enquiry.countDocuments({ 
//           isDeleted: false,
//           createdAt: { $gte: today.toDate() }
//         }),
//         Enquiry.countDocuments({ 
//           isDeleted: false,
//           createdAt: { $gte: startOfWeek.toDate() }
//         }),
//         Enquiry.countDocuments({ 
//           isDeleted: false,
//           createdAt: { $gte: startOfMonth.toDate() }
//         }),
//         Enquiry.countDocuments({ isDeleted: false, status: 'pending' }),
//         Enquiry.countDocuments({ isDeleted: false, status: 'in-progress' }),
//         Enquiry.countDocuments({ isDeleted: false, status: 'resolved' }),
//         Enquiry.aggregate([
//           { $match: { isDeleted: false } },
//           { $group: { _id: '$status', count: { $sum: 1 } } }
//         ]),
//         Enquiry.aggregate([
//           { $match: { isDeleted: false } },
//           { $group: { _id: '$course', count: { $sum: 1 } } },
//           { $sort: { count: -1 } },
//           { $limit: 10 }
//         ])
//       ]);

//       res.json({
//         success: true,
//         data: {
//           overview: {
//             totalEnquiries,
//             todayEnquiries,
//             weekEnquiries,
//             monthEnquiries
//           },
//           statusCounts: {
//             pending: pendingEnquiries,
//             inProgress: inProgressEnquiries,
//             resolved: resolvedEnquiries
//           },
//           enquiriesByStatus,
//           enquiriesByCourse,
//           responseRate: totalEnquiries > 0 
//             ? ((resolvedEnquiries / totalEnquiries) * 100).toFixed(2)
//             : 0
//         }
//       });
//     } catch (error) {
//       console.error("❌ Dashboard error:", error);
//       res.status(500).json({ success: false, message: "Failed to fetch dashboard stats" });
//     }
//   }

//   async healthCheck(req, res) {
//     try {
//       const checks = {
//         database: mongoose.connection.readyState === 1,
//         email: !!this.transporter,
//         uptime: process.uptime(),
//         timestamp: new Date().toISOString()
//       };
      
//       res.status(checks.database ? 200 : 503).json({ 
//         status: checks.database ? "healthy" : "degraded", 
//         checks 
//       });
//     } catch (error) {
//       res.status(503).json({ status: "unhealthy", error: error.message });
//     }
//   }
// }

// const enquiryController = new EnquiryController();
// module.exports = enquiryController;




















const Enquiry = require("../models/Enquiry");
const EmailLog = require("../models/EmailLog");
const mongoose = require("mongoose");
const moment = require("moment");
const nodemailer = require("nodemailer");

class EnquiryController {
  constructor() {
    this.initEmailTransporter();
  }

  // ======================
  // EMAIL TRANSPORTER
  // ======================
  // initEmailTransporter() {
  //   const emailUser = process.env.SMTP_USER;
  //   const emailPass = process.env.SMTP_PASS;

  //   if (!emailUser || !emailPass) {
  //     throw new Error("❌ SMTP credentials missing. Email service cannot start.");
  //   }

  //   this.transporter = nodemailer.createTransport({
  //     host: process.env.SMTP_HOST,
  //     port: parseInt(process.env.SMTP_PORT),
  //     secure: false,
  //     auth: { user: emailUser, pass: emailPass },
  //     tls: { rejectUnauthorized: false },
  //     pool: true,
  //     maxConnections: 5,
  //     maxMessages: 100,
  //   });

  //   console.log("✅ Email transporter initialized");
  // }


constructor() {
  this.initEmailTransporter();
}

initEmailTransporter() {
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (!smtpUser || !smtpPass) {
    throw new Error("❌ SMTP credentials missing. Email service cannot start.");
  }

  this.transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_PORT == 465, // true only for port 465
    auth: {
      user: smtpUser,
      pass: smtpPass
    },
    tls: {
      rejectUnauthorized: false
    },
    connectionTimeout: 20000,
    socketTimeout: 30000
  });

  console.log("✅ SMTP Email transporter initialized");
}

  async sendEmail(options) {
    if (!this.transporter) {
      throw new Error("Email transporter not initialized");
    }

    const mailOptions = {
      from: `"${process.env.COMPANY_NAME || 'REC APPLY'} Enquiries" <${process.env.EMAIL_FROM}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text || this.stripHtml(options.html),
    };

    const emailLog = new EmailLog({
      enquiryId: options.enquiryId,
      recipientType: options.recipientType,
      emailType: options.emailType,
      recipientEmail: options.to,
      subject: options.subject,
      content: options.html,
      status: "pending",
      metadata: options.metadata || {},
    });

    await emailLog.save();

    const info = await this.transporter.sendMail(mailOptions);

    emailLog.status = "sent";
    emailLog.messageId = info.messageId;
    emailLog.sentAt = new Date();
    await emailLog.save();

    console.log(`✅ Email sent: ${options.to}`);
    return info;
  }

  stripHtml(html) {
    return html
      .replace(/<[^>]*>/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  async sendEnquiryEmails(enquiry) {
    const userEmail = await this.sendEmail({
      to: enquiry.email,
      subject: `Enquiry Confirmation - ${enquiry.course}`,
      html: this.getUserEmailTemplate(enquiry),
      enquiryId: enquiry._id,
      recipientType: "user",
      emailType: "confirmation",
    });

    const adminEmail = await this.sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: `📋 New Enquiry: ${enquiry.name} - ${enquiry.course}`,
      html: this.getAdminEmailTemplate(enquiry),
      enquiryId: enquiry._id,
      recipientType: "admin",
      emailType: "notification",
    });

    return {
      userEmail: userEmail ? "sent" : "failed",
      adminEmail: adminEmail ? "sent" : "failed",
    };
  }

  // ======================
  // EMAIL TEMPLATES
  // ======================
  getUserEmailTemplate(enquiry) {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f4f4; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">${process.env.COMPANY_NAME || 'REC APPLY'}</h1>
          <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Enquiry Confirmation</p>
        </div>
        
        <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-top: 0; border-bottom: 2px solid #f0f0f0; padding-bottom: 15px;">
            Thank You for Your Enquiry! 📋
          </h2>
          
          <p style="font-size: 16px; line-height: 1.6; color: #555;">Dear ${enquiry.name},</p>
          
          <p style="font-size: 16px; line-height: 1.6; color: #555;">Thank you for your enquiry. We have received your request and one of our advisors will contact you shortly. Here are the details you submitted:</p>
          
          <div style="background-color: #f0f7ff; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #667eea;">
            <h3 style="margin-top: 0; color: #667eea; font-size: 20px;">Enquiry Reference: ENQ-${enquiry._id.toString().slice(-8).toUpperCase()}</h3>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Name:</strong></td>
                <td style="padding: 8px 0; color: #333;">${enquiry.name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Email:</strong></td>
                <td style="padding: 8px 0; color: #333;">${enquiry.email}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Phone:</strong></td>
                <td style="padding: 8px 0; color: #333;">${enquiry.phone}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Country:</strong></td>
                <td style="padding: 8px 0; color: #333;">${enquiry.country}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Course of Interest:</strong></td>
                <td style="padding: 8px 0; color: #333;">${enquiry.course}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Enquiry Date:</strong></td>
                <td style="padding: 8px 0; color: #333;">${moment(enquiry.createdAt).format('MMMM Do YYYY, h:mm a')}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Status:</strong></td>
                <td style="padding: 8px 0; color: #333;">
                  <span style="background-color: #FFC107; color: #333; padding: 3px 10px; border-radius: 12px; font-size: 12px;">
                    ${enquiry.status || 'New'}
                  </span>
                </td>
              </tr>
            </table>
            
            ${enquiry.message ? `
              <div style="margin-top: 15px;">
                <strong style="color: #666;">Your Message:</strong>
                <p style="color: #555; font-style: italic; margin: 5px 0 0 0; background-color: white; padding: 10px; border-radius: 5px;">${enquiry.message}</p>
              </div>
            ` : ''}
          </div>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h4 style="margin-top: 0; color: #333;">What Happens Next?</h4>
            <ol style="margin: 5px 0 0 0; color: #555;">
              <li style="margin: 5px 0;">Our education advisor will review your enquiry within 24 hours</li>
              <li style="margin: 5px 0;">You'll receive a response via email or phone call</li>
              <li style="margin: 5px 0;">We'll provide detailed information about your chosen course</li>
              <li style="margin: 5px 0;">We can schedule a consultation to discuss your study plans</li>
            </ol>
          </div>
          
          <hr style="border: none; border-top: 2px solid #f0f0f0; margin: 30px 0;">
          
          <div style="text-align: center;">
            <p style="color: #666; font-size: 14px; line-height: 1.6;">
              We look forward to helping you achieve your educational goals!<br>
              If you have any questions, please don't hesitate to contact us.
            </p>
          </div>
        </div>
        
        <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
          © ${new Date().getFullYear()} ${process.env.COMPANY_NAME || 'REC APPLY'}. All rights reserved.<br>
          This is an automated message, please do not reply to this email.
        </div>
      </div>
    `;
  }

  getAdminEmailTemplate(enquiry) {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f4f4; padding: 20px;">
        <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">${process.env.COMPANY_NAME || 'REC APPLY'}</h1>
          <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Admin Notification - New Enquiry</p>
        </div>
        
        <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-top: 0; border-bottom: 2px solid #f0f0f0; padding-bottom: 15px;">
            New Enquiry Alert! 📋
          </h2>
          
          <div style="background-color: #fff3e0; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #f5576c;">
            <h3 style="margin-top: 0; color: #f5576c; font-size: 20px;">Enquiry Reference: ENQ-${enquiry._id.toString().slice(-8).toUpperCase()}</h3>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Name:</strong></td>
                <td style="padding: 8px 0; color: #333;">${enquiry.name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Email:</strong></td>
                <td style="padding: 8px 0; color: #333;">${enquiry.email}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Phone:</strong></td>
                <td style="padding: 8px 0; color: #333;">${enquiry.phone}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Country:</strong></td>
                <td style="padding: 8px 0; color: #333;">${enquiry.country}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Course of Interest:</strong></td>
                <td style="padding: 8px 0; color: #333;">${enquiry.course}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Status:</strong></td>
                <td style="padding: 8px 0; color: #333;">
                  <span style="background-color: #FFC107; color: #333; padding: 3px 10px; border-radius: 12px; font-size: 12px;">
                    ${enquiry.status || 'New'}
                  </span>
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Received on:</strong></td>
                <td style="padding: 8px 0; color: #333;">${moment(enquiry.createdAt).format('MMMM Do YYYY, h:mm a')}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Source:</strong></td>
                <td style="padding: 8px 0; color: #333; word-break: break-all;">${enquiry.source || 'Website'}</td>
              </tr>
            </table>
            
            ${enquiry.message ? `
              <div style="margin-top: 15px; background-color: #fff9e6; padding: 15px; border-radius: 5px;">
                <strong style="color: #666;">Message:</strong>
                <p style="color: #555; margin: 5px 0 0 0;">${enquiry.message}</p>
              </div>
            ` : ''}
          </div>
          
          <hr style="border: none; border-top: 2px solid #f0f0f0; margin: 30px 0;">
          
          <div style="text-align: center;">
            <p style="color: #666; font-size: 14px; line-height: 1.6;">
              Please review this enquiry and respond within 24 hours.<br>
              This is an automated admin notification from ${process.env.COMPANY_NAME || 'REC APPLY'}.
            </p>
          </div>
        </div>
        
        <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
          © ${new Date().getFullYear()} ${process.env.COMPANY_NAME || 'REC APPLY'}. All rights reserved.
        </div>
      </div>
    `;
  }

  getFollowupEmailTemplate(enquiry, message) {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f4f4; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">${process.env.COMPANY_NAME || 'REC APPLY'}</h1>
          <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Follow-up Regarding Your Enquiry</p>
        </div>
        
        <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-top: 0; border-bottom: 2px solid #f0f0f0; padding-bottom: 15px;">
            Follow-up on Your Enquiry
          </h2>
          
          <p style="font-size: 16px; line-height: 1.6; color: #555;">Dear ${enquiry.name},</p>
          
          <div style="background-color: #f0f7ff; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #667eea;">
            <h3 style="margin-top: 0; color: #667eea; font-size: 18px;">Enquiry Reference: ENQ-${enquiry._id.toString().slice(-8).toUpperCase()}</h3>
            
            <p style="color: #555; line-height: 1.6;">${message}</p>
          </div>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h4 style="margin-top: 0; color: #333;">Original Enquiry Summary</h4>
            <p style="margin: 5px 0; color: #555;"><strong>Course:</strong> ${enquiry.course}</p>
            <p style="margin: 5px 0; color: #555;"><strong>Submitted on:</strong> ${moment(enquiry.createdAt).format('MMMM Do YYYY')}</p>
          </div>
          
          <hr style="border: none; border-top: 2px solid #f0f0f0; margin: 30px 0;">
          
          <div style="text-align: center;">
            <p style="color: #666; font-size: 14px; line-height: 1.6;">
              Feel free to reply to this email if you have any questions.<br>
              We're here to help!
            </p>
          </div>
        </div>
        
        <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
          © ${new Date().getFullYear()} ${process.env.COMPANY_NAME || 'REC APPLY'}. All rights reserved.
        </div>
      </div>
    `;
  }

  // ======================
  // CRUD OPERATIONS
  // ======================
  async createEnquiry(req, res) {
    try {
      const { name, email, phone, country, course, message } = req.body;

      const errors = [];
      if (!name || name.trim().length < 2) errors.push("Name too short");
      if (!email || !this.validateEmail(email)) errors.push("Invalid email");
      if (!phone || phone.trim().length < 5) errors.push("Invalid phone");
      if (!country || country.trim().length < 2) errors.push("Invalid country");
      if (!course || course.trim().length < 2) errors.push("Invalid course");
      
      if (errors.length) {
        return res.status(400).json({ success: false, errors });
      }

      // Check for duplicate in last 24 hours
      const recent = await Enquiry.findOne({
        email: email.toLowerCase(),
        createdAt: { $gte: moment().subtract(24, "hours").toDate() },
        isDeleted: false,
      });
      
      if (recent) {
        return res.status(409).json({
          success: false,
          message: "Duplicate enquiry recently submitted"
        });
      }

      const enquiry = new Enquiry({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        phone: phone.trim(),
        country: country.trim(),
        course: course.trim(),
        message: message?.trim() || "",
        status: "new",
        source: req.headers['user-agent'] || req.headers['origin'] || "website",
        ip: req.ip || req.connection.remoteAddress
      });
      
      await enquiry.save();

      // Send emails
      await this.sendEnquiryEmails(enquiry);

      res.status(201).json({
        success: true,
        message: "Enquiry submitted successfully",
        data: {
          id: enquiry._id,
          name: enquiry.name,
          email: enquiry.email,
          course: enquiry.course,
          status: enquiry.status,
          createdAt: enquiry.createdAt,
          referenceNumber: `ENQ-${enquiry._id.toString().slice(-8).toUpperCase()}`,
        },
      });
    } catch (error) {
      console.error("❌ Create enquiry error:", error);
      res.status(500).json({ success: false, message: "Failed to create enquiry" });
    }
  }

  async getAllEnquiries(req, res) {
    try {
      const {
        page = 1,
        limit = 20,
        status,
        course,
        startDate,
        endDate,
        search,
        sortBy = "createdAt",
        sortOrder = "desc",
      } = req.query;
      
      const query = { isDeleted: false };
      
      if (status) query.status = status;
      if (course) query.course = { $regex: course, $options: "i" };
      
      if (startDate || endDate) {
        query.createdAt = {};
        if (startDate) query.createdAt.$gte = new Date(startDate);
        if (endDate) query.createdAt.$lte = new Date(endDate);
      }
      
      if (search) {
        query.$or = [
          "name",
          "email",
          "phone",
          "country",
          "course",
          "message",
        ].map((f) => ({ [f]: { $regex: search, $options: "i" } }));
      }

      const [enquiries, total] = await Promise.all([
        Enquiry.find(query)
          .sort({ [sortBy]: sortOrder === "desc" ? -1 : 1 })
          .skip((parseInt(page) - 1) * parseInt(limit))
          .limit(parseInt(limit))
          .lean(),
        Enquiry.countDocuments(query),
      ]);

      res.json({
        success: true,
        data: enquiries,
        pagination: { 
          total, 
          page: parseInt(page), 
          limit: parseInt(limit),
          totalPages: Math.ceil(total / parseInt(limit))
        },
      });
    } catch (error) {
      console.error("❌ Get all enquiries error:", error);
      res.status(500).json({ success: false, message: "Failed to fetch enquiries" });
    }
  }

  async getEnquiriesByEmail(req, res) {
    try {
      const { email } = req.params;
      const {
        page = 1,
        limit = 20,
        status,
        course,
        startDate,
        endDate,
        search,
        sortBy = "createdAt",
        sortOrder = "desc",
      } = req.query;

      const query = {
        isDeleted: false,
        email: email.toLowerCase(),
      };

      if (status) query.status = status;
      if (course) query.course = { $regex: course, $options: "i" };
      
      if (startDate || endDate) {
        query.createdAt = {};
        if (startDate) query.createdAt.$gte = new Date(startDate);
        if (endDate) query.createdAt.$lte = new Date(endDate);
      }

      if (search) {
        query.$or = ["name", "phone", "country", "course", "message"].map(
          (f) => ({ [f]: { $regex: search, $options: "i" } })
        );
      }

      const [enquiries, total] = await Promise.all([
        Enquiry.find(query)
          .sort({ [sortBy]: sortOrder === "desc" ? -1 : 1 })
          .skip((parseInt(page) - 1) * parseInt(limit))
          .limit(parseInt(limit))
          .lean(),
        Enquiry.countDocuments(query),
      ]);

      res.json({
        success: true,
        data: enquiries,
        pagination: { 
          total, 
          page: parseInt(page), 
          limit: parseInt(limit),
          totalPages: Math.ceil(total / parseInt(limit))
        },
      });
    } catch (error) {
      console.error("❌ Get enquiries by email error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch enquiries by email",
      });
    }
  }

  async getEnquiryById(req, res) {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: "Invalid ID" });
      }

      const enquiry = await Enquiry.findOne({
        _id: id,
        isDeleted: false,
      }).lean();
      
      if (!enquiry) {
        return res.status(404).json({ success: false, message: "Enquiry not found" });
      }

      const emailLogs = await EmailLog.find({ enquiryId: id })
        .sort({ createdAt: -1 })
        .lean();
        
      res.json({
        success: true,
        data: { ...enquiry, emailHistory: emailLogs },
      });
    } catch (error) {
      console.error("❌ Get enquiry by ID error:", error);
      res.status(500).json({ success: false, message: "Failed to fetch enquiry" });
    }
  }

  async updateEnquiry(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: "Invalid ID" });
      }

      const allowed = ["status", "message", "notes", "assignedTo", "priority"];
      const updates = Object.keys(updateData).reduce(
        (acc, key) =>
          allowed.includes(key) ? ((acc[key] = updateData[key]), acc) : acc,
        {}
      );
      updates.updatedAt = Date.now();

      const enquiry = await Enquiry.findOneAndUpdate(
        { _id: id, isDeleted: false },
        updates,
        { new: true, runValidators: true }
      );
      
      if (!enquiry) {
        return res.status(404).json({ success: false, message: "Enquiry not found" });
      }

      res.json({ success: true, message: "Enquiry updated", data: enquiry });
    } catch (error) {
      console.error("❌ Update enquiry error:", error);
      res.status(500).json({ success: false, message: "Failed to update enquiry" });
    }
  }

  async deleteEnquiry(req, res) {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: "Invalid ID" });
      }

      const enquiry = await Enquiry.findOneAndUpdate(
        { _id: id, isDeleted: false },
        { isDeleted: true, deletedAt: Date.now(), updatedAt: Date.now() },
        { new: true }
      );

      if (!enquiry) {
        return res.status(404).json({ success: false, message: "Enquiry not found" });
      }

      res.json({
        success: true,
        message: "Enquiry deleted",
        data: { id: enquiry._id, deletedAt: enquiry.deletedAt },
      });
    } catch (error) {
      console.error("❌ Delete enquiry error:", error);
      res.status(500).json({ success: false, message: "Failed to delete enquiry" });
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
      
      if (!enquiryId || !message) {
        return res.status(400).json({ success: false, message: "ID & message required" });
      }
      
      if (!mongoose.Types.ObjectId.isValid(enquiryId)) {
        return res.status(400).json({ success: false, message: "Invalid ID" });
      }

      const enquiry = await Enquiry.findOne({
        _id: enquiryId,
        isDeleted: false,
      });
      
      if (!enquiry) {
        return res.status(404).json({ success: false, message: "Enquiry not found" });
      }

      const result = await this.sendEmail({
        to: enquiry.email,
        subject: `Follow-up regarding your enquiry: ${enquiry.course}`,
        html: this.getFollowupEmailTemplate(enquiry, message),
        enquiryId: enquiry._id,
        recipientType: "user",
        emailType: "followup",
        metadata: { followup: true, followupMessage: message },
      });

      res.json({
        success: true,
        message: "Follow-up sent successfully",
        data: { enquiryId: enquiry._id, recipient: enquiry.email },
      });
    } catch (error) {
      console.error("❌ Follow-up email error:", error);
      res.status(500).json({ success: false, message: "Failed to send follow-up" });
    }
  }

  // ======================
  // DASHBOARD & STATS
  // ======================
  async getDashboardStatistics(req, res) {
    try {
      const today = moment().startOf('day');
      const startOfWeek = moment().startOf('week');
      const startOfMonth = moment().startOf('month');

      const [
        totalEnquiries,
        todayEnquiries,
        weekEnquiries,
        monthEnquiries,
        pendingEnquiries,
        inProgressEnquiries,
        resolvedEnquiries,
        enquiriesByStatus,
        enquiriesByCourse
      ] = await Promise.all([
        Enquiry.countDocuments({ isDeleted: false }),
        Enquiry.countDocuments({ 
          isDeleted: false,
          createdAt: { $gte: today.toDate() }
        }),
        Enquiry.countDocuments({ 
          isDeleted: false,
          createdAt: { $gte: startOfWeek.toDate() }
        }),
        Enquiry.countDocuments({ 
          isDeleted: false,
          createdAt: { $gte: startOfMonth.toDate() }
        }),
        Enquiry.countDocuments({ isDeleted: false, status: 'pending' }),
        Enquiry.countDocuments({ isDeleted: false, status: 'in-progress' }),
        Enquiry.countDocuments({ isDeleted: false, status: 'resolved' }),
        Enquiry.aggregate([
          { $match: { isDeleted: false } },
          { $group: { _id: '$status', count: { $sum: 1 } } }
        ]),
        Enquiry.aggregate([
          { $match: { isDeleted: false } },
          { $group: { _id: '$course', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 10 }
        ])
      ]);

      res.json({
        success: true,
        data: {
          overview: {
            totalEnquiries,
            todayEnquiries,
            weekEnquiries,
            monthEnquiries
          },
          statusCounts: {
            pending: pendingEnquiries,
            inProgress: inProgressEnquiries,
            resolved: resolvedEnquiries
          },
          enquiriesByStatus,
          enquiriesByCourse,
          responseRate: totalEnquiries > 0 
            ? ((resolvedEnquiries / totalEnquiries) * 100).toFixed(2)
            : 0
        }
      });
    } catch (error) {
      console.error("❌ Dashboard error:", error);
      res.status(500).json({ success: false, message: "Failed to fetch dashboard stats" });
    }
  }

  async healthCheck(req, res) {
    try {
      const checks = {
        database: mongoose.connection.readyState === 1,
        email: !!this.transporter,
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
      };
      
      res.status(checks.database ? 200 : 503).json({ 
        status: checks.database ? "healthy" : "degraded", 
        checks 
      });
    } catch (error) {
      res.status(503).json({ status: "unhealthy", error: error.message });
    }
  }
}

const enquiryController = new EnquiryController();
module.exports = enquiryController;