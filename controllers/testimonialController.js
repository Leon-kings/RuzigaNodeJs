
// // controllers/testimonialController.js
// const Testimonial = require('../models/Testimonial');
// const cloudinary = require('../cloudinary/cloudinary');
// const nodemailer = require("nodemailer");

// class TestimonialController {
//   constructor() {
//     // Nodemailer transporter
//     this.mailer = nodemailer.createTransport({
//       host: process.env.SMTP_HOST,
//       port: process.env.SMTP_PORT,
//       secure: false,
//       auth: {
//         user: process.env.SMTP_USER,
//         pass: process.env.SMTP_PASS,
//       },
//     });
    
//     this.companyName = process.env.COMPANY_NAME || "REC APPLY";
//     this.adminEmail = process.env.ADMIN_EMAIL || "r.educationalconsultance@gmail.com";
//     this.frontendUrl = process.env.FRONTEND_URL || "https://rk-services-xi.vercel.app";
//   }

//   // ================== Email Helper with Beautiful Templates ==================
//   sendEmail = async (to, subject, html) => {
//     // Skip emails if configured
//     if (process.env.SKIP_EMAILS === "true") {
//       console.log(`📧 Email would be sent to: ${to}`);
//       console.log(`📋 Subject: ${subject}`);
//       return { success: true, skipped: true };
//     }
    
//     try {
//       await this.mailer.sendMail({
//         from: `"${this.companyName}" <${process.env.SMTP_USER}>`,
//         to,
//         subject,
//         html,
//       });
//       console.log(`✅ Email sent successfully to: ${to}`);
//       return { success: true };
//     } catch (error) {
//       console.error("❌ Email sending failed:", error);
//       return { success: false, error: error.message };
//     }
//   };

//   getUserTestimonialConfirmationEmail = (userName, testimonialData) => {
//     const { university, program, rating, content } = testimonialData;
//     const ratingStars = '★'.repeat(rating) + '☆'.repeat(5 - rating);
    
//     return `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <meta charset="utf-8">
//         <meta name="viewport" content="width=device-width, initial-scale=1.0">
//         <title>Testimonial Submitted</title>
//         <style>
//           .rating-star { color: #FFD700; font-size: 20px; }
//         </style>
//       </head>
//       <body style="font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f8;">
//         <div style="max-width: 600px; margin: 20px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
//           <!-- Header -->
//           <div style="background: linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 100%); padding: 30px 20px; text-align: center;">
//             <h1 style="color: white; margin: 0; font-size: 28px;">${this.companyName}</h1>
//             <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0; font-size: 16px;">Thank You for Sharing Your Experience!</p>
//           </div>
          
//           <!-- Content -->
//           <div style="padding: 30px;">
//             <div style="text-align: center; margin-bottom: 20px;">
//               <span style="background: #28a745; color: white; padding: 8px 20px; border-radius: 20px; font-size: 14px; font-weight: bold;">
//                 🎉 TESTIMONIAL RECEIVED
//               </span>
//             </div>
            
//             <h2 style="color: #333; margin: 0 0 20px;">Hello ${userName},</h2>
//             <p style="color: #666; line-height: 1.6; font-size: 16px;">Thank you for submitting your testimonial! We appreciate you taking the time to share your experience. Your testimonial has been received and is now pending review by our team.</p>
            
//             <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0;">
//               <h3 style="color: #333; margin: 0 0 15px; border-bottom: 1px solid #dee2e6; padding-bottom: 10px;">Your Submission:</h3>
              
//               <table style="width: 100%; border-collapse: collapse;">
//                 <tr>
//                   <td style="padding: 8px 0; color: #555; width: 35%;">University:</td>
//                   <td style="padding: 8px 0; color: #333; font-weight: bold;">${university || 'Not specified'}</td>
//                 </tr>
//                 <tr>
//                   <td style="padding: 8px 0; color: #555;">Program:</td>
//                   <td style="padding: 8px 0; color: #333; font-weight: bold;">${program || 'Not specified'}</td>
//                 </tr>
//                 <tr>
//                   <td style="padding: 8px 0; color: #555;">Rating:</td>
//                   <td style="padding: 8px 0; color: #333; font-weight: bold;">
//                     <span style="color: #FFD700; font-size: 18px;">${ratingStars}</span> (${rating}/5)
//                   </td>
//                 </tr>
//                 <tr>
//                   <td style="padding: 8px 0; color: #555; vertical-align: top;">Your Story:</td>
//                   <td style="padding: 8px 0; color: #333; font-style: italic;">"${content.substring(0, 100)}${content.length > 100 ? '...' : ''}"</td>
//                 </tr>
//                 <tr>
//                   <td style="padding: 8px 0; color: #555;">Status:</td>
//                   <td style="padding: 8px 0;">
//                     <span style="background: #ffc107; color: #333; padding: 4px 12px; border-radius: 20px; font-size: 13px; font-weight: bold;">PENDING REVIEW</span>
//                   </td>
//                 </tr>
//               </table>
//             </div>
            
//             <div style="background: #e3f2fd; border-left: 4px solid #2196f3; padding: 15px; margin: 20px 0;">
//               <p style="color: #0c5460; margin: 0; font-size: 14px;">
//                 <strong>📌 What's Next?</strong> Our team will review your testimonial within 24-48 hours. You'll receive an email once it's approved and published on our website.
//               </p>
//             </div>
            
//             <div style="text-align: center; margin: 30px 0;">
//               <a href="${this.frontendUrl}/testimonials" 
//                  style="background: linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
//                 View All Testimonials
//               </a>
//             </div>
//           </div>
          
//           <!-- Footer -->
//           <div style="background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e9ecef;">
//             <p style="color: #999; margin: 5px 0; font-size: 14px;">Questions? Contact us at <a href="mailto:${this.adminEmail}" style="color: #ff6b6b; text-decoration: none;">${this.adminEmail}</a></p>
//             <p style="color: #999; margin: 5px 0; font-size: 12px;">© ${new Date().getFullYear()} ${this.companyName}. All rights reserved.</p>
//           </div>
//         </div>
//       </body>
//       </html>
//     `;
//   };

//   getAdminNewTestimonialNotification = (userName, userEmail, testimonialData) => {
//     const { university, program, rating, content } = testimonialData;
    
//     return `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <meta charset="utf-8">
//         <title>New Testimonial - Admin Alert</title>
//       </head>
//       <body style="font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f8;">
//         <div style="max-width: 600px; margin: 20px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
//           <!-- Header -->
//           <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 30px 20px; text-align: center;">
//             <h1 style="color: white; margin: 0; font-size: 28px;">Admin Notification</h1>
//             <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0; font-size: 16px;">New Testimonial Pending Review</p>
//           </div>
          
//           <!-- Content -->
//           <div style="padding: 30px;">
//             <div style="text-align: center; margin-bottom: 25px;">
//               <span style="background: #dc3545; color: white; padding: 8px 20px; border-radius: 20px; font-size: 14px; font-weight: bold;">
//                 🔔 ACTION REQUIRED: REVIEW NEEDED
//               </span>
//             </div>
            
//             <h2 style="color: #333; margin: 0 0 20px;">New Testimonial Details</h2>
            
//             <div style="background: #f8f9fa; border-radius: 8px; padding: 20px;">
//               <table style="width: 100%; border-collapse: collapse;">
//                 <tr>
//                   <td style="padding: 10px 0; color: #555; width: 40%;">👤 User:</td>
//                   <td style="padding: 10px 0; color: #333; font-weight: bold;">${userName}</td>
//                 </tr>
//                 <tr>
//                   <td style="padding: 10px 0; color: #555;">📧 Email:</td>
//                   <td style="padding: 10px 0; color: #333; font-weight: bold;">${userEmail}</td>
//                 </tr>
//                 <tr>
//                   <td style="padding: 10px 0; color: #555;">🏛️ University:</td>
//                   <td style="padding: 10px 0; color: #333; font-weight: bold;">${university || 'Not specified'}</td>
//                 </tr>
//                 <tr>
//                   <td style="padding: 10px 0; color: #555;">📚 Program:</td>
//                   <td style="padding: 10px 0; color: #333; font-weight: bold;">${program || 'Not specified'}</td>
//                 </tr>
//                 <tr>
//                   <td style="padding: 10px 0; color: #555;">⭐ Rating:</td>
//                   <td style="padding: 10px 0; color: #333; font-weight: bold;">${rating}/5</td>
//                 </tr>
//                 <tr>
//                   <td style="padding: 10px 0; color: #555;">📝 Content:</td>
//                   <td style="padding: 10px 0; color: #333;">"${content}"</td>
//                 </tr>
//                 <tr>
//                   <td style="padding: 10px 0; color: #555;">📅 Submitted:</td>
//                   <td style="padding: 10px 0; color: #333; font-weight: bold;">${new Date().toLocaleString()}</td>
//                 </tr>
//               </table>
//             </div>
            
//             <div style="display: flex; gap: 10px; margin-top: 30px; justify-content: center;">
//               <a href="${this.frontendUrl}/admin/testimonials/${testimonialData._id}/approve" 
//                  style="background: #28a745; color: white; padding: 12px 25px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block; margin-right: 10px;">
//                 ✅ Approve
//               </a>
//               <a href="${this.frontendUrl}/admin/testimonials/${testimonialData._id}/reject" 
//                  style="background: #dc3545; color: white; padding: 12px 25px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
//                 ❌ Reject
//               </a>
//             </div>
            
//             <div style="text-align: center; margin-top: 20px;">
//               <a href="${this.frontendUrl}/admin/testimonials" 
//                  style="background: #6c757d; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-size: 14px;">
//                 Go to Admin Dashboard
//               </a>
//             </div>
//           </div>
          
//           <!-- Footer -->
//           <div style="background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e9ecef;">
//             <p style="color: #999; margin: 5px 0; font-size: 12px;">This is an automated notification from ${this.companyName}</p>
//           </div>
//         </div>
//       </body>
//       </html>
//     `;
//   };

//   getTestimonialStatusUpdateEmail = (userName, status, testimonialData) => {
//     const statusColors = {
//       approved: "#28a745",
//       rejected: "#dc3545",
//       pending: "#ffc107"
//     };
    
//     const statusMessages = {
//       approved: "Congratulations! Your testimonial has been approved and is now live on our website.",
//       rejected: "We regret to inform you that your testimonial has not been approved at this time.",
//       pending: "Your testimonial status has been updated to pending review."
//     };
    
//     const color = statusColors[status] || "#6c757d";
//     const message = statusMessages[status] || `Your testimonial status has been updated to ${status}.`;
    
//     return `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <meta charset="utf-8">
//         <title>Testimonial Status Update</title>
//       </head>
//       <body style="font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f8;">
//         <div style="max-width: 600px; margin: 20px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
//           <!-- Header -->
//           <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px 20px; text-align: center;">
//             <h1 style="color: white; margin: 0; font-size: 28px;">${this.companyName}</h1>
//           </div>
          
//           <!-- Content -->
//           <div style="padding: 30px;">
//             <h2 style="color: #333; margin: 0 0 20px;">Testimonial Status Update</h2>
//             <p style="color: #666; line-height: 1.6;">Hello <strong>${userName}</strong>,</p>
//             <p style="color: #666; line-height: 1.6;">${message}</p>
            
//             <div style="text-align: center; margin: 30px 0;">
//               <span style="background: ${color}; color: white; padding: 12px 30px; border-radius: 25px; font-size: 18px; font-weight: bold; display: inline-block;">
//                 ${status.toUpperCase()}
//               </span>
//             </div>
            
//             <div style="background: #f8f9fa; border-radius: 8px; padding: 20px;">
//               <h3 style="color: #333; margin: 0 0 15px;">Testimonial Summary:</h3>
//               <p style="color: #555;"><strong>University:</strong> ${testimonialData.university || 'Not specified'}</p>
//               <p style="color: #555;"><strong>Program:</strong> ${testimonialData.program || 'Not specified'}</p>
//               <p style="color: #555;"><strong>Rating:</strong> ${testimonialData.rating}/5</p>
//             </div>
            
//             <div style="text-align: center; margin-top: 30px;">
//               <a href="${this.frontendUrl}/testimonials" 
//                  style="background: ${color}; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
//                 View Testimonials
//               </a>
//             </div>
//           </div>
//         </div>
//       </body>
//       </html>
//     `;
//   };

//   // ================== Testimonial CRUD Operations ==================

//   // Get all testimonials with filtering and pagination
//   getAllTestimonials = async (req, res) => {
//     try {
//       const {
//         status,
//         search,
//         sort,
//         page = 1,
//         limit = 20
//       } = req.query;

//       // Build query
//       let query = {};

//       // Status filter
//       if (status && status !== 'all') {
//         query.status = status;
//       }

//       // Search filter
//       if (search) {
//         query.$or = [
//           { name: { $regex: search, $options: 'i' } },
//           { university: { $regex: search, $options: 'i' } },
//           { program: { $regex: search, $options: 'i' } },
//           { country: { $regex: search, $options: 'i' } },
//           { content: { $regex: search, $options: 'i' } }
//         ];
//       }

//       // Build sort
//       let sortOption = { createdAt: -1 }; // Default: newest first
      
//       if (sort === 'oldest') {
//         sortOption = { createdAt: 1 };
//       } else if (sort === 'highest-rating') {
//         sortOption = { rating: -1 };
//       } else if (sort === 'lowest-rating') {
//         sortOption = { rating: 1 };
//       }

//       // Calculate pagination
//       const skip = (page - 1) * limit;

//       // Execute query
//       const testimonials = await Testimonial.find(query)
//         .sort(sortOption)
//         .skip(skip)
//         .limit(parseInt(limit));

//       // Get total count for pagination
//       const total = await Testimonial.countDocuments(query);

//       res.status(200).json({
//         success: true,
//         count: testimonials.length,
//         total,
//         pages: Math.ceil(total / limit),
//         currentPage: parseInt(page),
//         data: testimonials
//       });
//     } catch (error) {
//       console.error('Get testimonials error:', error);
//       res.status(500).json({
//         success: false,
//         message: 'Server error while fetching testimonials'
//       });
//     }
//   };

//   // Get testimonials by email
//   getTestimonialsByEmail = async (req, res) => {
//     try {
//       const { email } = req.params;
//       const {
//         status,
//         search,
//         sort,
//         page = 1,
//         limit = 20
//       } = req.query;

//       // Build query
//       let query = { email: email.toLowerCase() };

//       // Status filter
//       if (status && status !== 'all') {
//         query.status = status;
//       }

//       // Search filter
//       if (search) {
//         query.$or = [
//           { name: { $regex: search, $options: 'i' } },
//           { university: { $regex: search, $options: 'i' } },
//           { program: { $regex: search, $options: 'i' } },
//           { country: { $regex: search, $options: 'i' } },
//           { content: { $regex: search, $options: 'i' } }
//         ];
//       }

//       // Build sort
//       let sortOption = { createdAt: -1 }; // Default: newest first
//       if (sort === 'oldest') sortOption = { createdAt: 1 };
//       else if (sort === 'highest-rating') sortOption = { rating: -1 };
//       else if (sort === 'lowest-rating') sortOption = { rating: 1 };

//       // Pagination
//       const skip = (page - 1) * limit;

//       // Execute query
//       const testimonials = await Testimonial.find(query)
//         .sort(sortOption)
//         .skip(skip)
//         .limit(parseInt(limit));

//       // Total count for pagination
//       const total = await Testimonial.countDocuments(query);

//       res.status(200).json({
//         success: true,
//         count: testimonials.length,
//         total,
//         pages: Math.ceil(total / limit),
//         currentPage: parseInt(page),
//         data: testimonials
//       });
//     } catch (error) {
//       console.error('Get testimonials by email error:', error);
//       res.status(500).json({
//         success: false,
//         message: 'Server error while fetching testimonials by email'
//       });
//     }
//   };

//   // Create testimonial
//   createTestimonial = async (req, res) => {
//     try {
//       console.log('📝 Creating testimonial...');
//       console.log('📤 Request body:', req.body);
//       console.log('🖼️ File:', req.file);

//       if (!req.file) {
//         return res.status(400).json({
//           success: false,
//           message: 'Image is required',
//         });
//       }

//       // Upload image to Cloudinary
//       const result = await cloudinary.uploader.upload(req.file.path, {
//         folder: 'testimonials',
//         width: 500,
//         height: 500,
//         crop: 'fill'
//       });

//       console.log('☁️ Cloudinary upload result:', result);

//       const testimonialData = {
//         name: req.body.name,
//         country: req.body.country,
//         university: req.body.university,
//         program: req.body.program,
//         rating: parseFloat(req.body.rating) || 5,
//         duration: req.body.duration,
//         content: req.body.content,
//         email: req.body.email,
//         verified: req.body.verified === 'true' || req.body.verified === true,
//         status: req.body.status || 'pending',
//         image: {
//           public_id: result.public_id,
//           url: result.secure_url,
//         },
//       };

//       console.log('📋 Testimonial data to save:', testimonialData);

//       const testimonial = await Testimonial.create(testimonialData);
      
//       console.log('✅ Testimonial created:', testimonial);

//       // Send confirmation email to user
//       if (testimonial.email) {
//         const userHtml = this.getUserTestimonialConfirmationEmail(
//           testimonial.name,
//           testimonial
//         );
        
//         await this.sendEmail(
//           testimonial.email,
//           `✨ Thank You for Your Testimonial - ${this.companyName}`,
//           userHtml
//         );
//       }

//       // Send notification to admin
//       const adminHtml = this.getAdminNewTestimonialNotification(
//         testimonial.name,
//         testimonial.email,
//         testimonial
//       );
      
//       await this.sendEmail(
//         this.adminEmail,
//         `🔔 New Testimonial Pending Review: ${testimonial.name}`,
//         adminHtml
//       );

//       res.status(201).json({
//         success: true,
//         data: testimonial,
//       });
//     } catch (error) {
//       console.error('❌ Create testimonial error:', error);
//       res.status(400).json({
//         success: false,
//         message: error.message,
//       });
//     }
//   };

//   // Update testimonial
//   updateTestimonial = async (req, res) => {
//     try {
//       const { id } = req.params;
//       const updateData = { ...req.body };

//       // Handle rating conversion
//       if (updateData.rating) {
//         updateData.rating = parseFloat(updateData.rating);
//       }

//       // Handle verified conversion
//       if (updateData.verified !== undefined) {
//         updateData.verified = updateData.verified === 'true' || updateData.verified === true;
//       }

//       // Get the current testimonial before update to check status change
//       const currentTestimonial = await Testimonial.findById(id);
//       if (!currentTestimonial) {
//         return res.status(404).json({
//           success: false,
//           message: 'Testimonial not found'
//         });
//       }

//       // Handle image upload if new image provided
//       if (req.file) {
//         // Delete old image
//         if (currentTestimonial.image?.public_id) {
//           await cloudinary.uploader.destroy(currentTestimonial.image.public_id);
//         }

//         // Upload new image
//         const result = await cloudinary.uploader.upload(req.file.path, {
//           folder: 'testimonials',
//           width: 500,
//           height: 500,
//           crop: 'fill'
//         });

//         updateData.image = {
//           public_id: result.public_id,
//           url: result.secure_url,
//         };
//       }

//       const testimonial = await Testimonial.findByIdAndUpdate(
//         id,
//         updateData,
//         { new: true, runValidators: true }
//       );

//       // Send status update email if status changed
//       if (currentTestimonial.status !== testimonial.status && testimonial.email) {
//         const userHtml = this.getTestimonialStatusUpdateEmail(
//           testimonial.name,
//           testimonial.status,
//           testimonial
//         );
        
//         const statusEmoji = {
//           approved: "✅",
//           rejected: "❌",
//           pending: "⏳"
//         };
        
//         await this.sendEmail(
//           testimonial.email,
//           `${statusEmoji[testimonial.status] || '📋'} Testimonial ${testimonial.status.charAt(0).toUpperCase() + testimonial.status.slice(1)} - ${this.companyName}`,
//           userHtml
//         );

//         // Also notify admin of status change
//         const adminHtml = `
//           <div style="padding: 20px; font-family: Arial, sans-serif;">
//             <h2 style="color: #333;">Testimonial Status Updated</h2>
//             <p><strong>User:</strong> ${testimonial.name}</p>
//             <p><strong>Email:</strong> ${testimonial.email}</p>
//             <p><strong>Old Status:</strong> <span style="color: #999;">${currentTestimonial.status}</span></p>
//             <p><strong>New Status:</strong> <span style="color: ${testimonial.status === 'approved' ? '#28a745' : testimonial.status === 'rejected' ? '#dc3545' : '#ffc107'}; font-weight: bold;">${testimonial.status}</span></p>
//             <a href="${this.frontendUrl}/admin/testimonials/${testimonial._id}" style="background: #667eea; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Testimonial</a>
//           </div>
//         `;
        
//         await this.sendEmail(
//           this.adminEmail,
//           `🔄 Testimonial Status Updated: ${testimonial.name}`,
//           adminHtml
//         );
//       }

//       res.status(200).json({
//         success: true,
//         data: testimonial
//       });
//     } catch (error) {
//       console.error('Update testimonial error:', error);
//       res.status(400).json({
//         success: false,
//         message: error.message
//       });
//     }
//   };

//   // Delete testimonial
//   deleteTestimonial = async (req, res) => {
//     try {
//       const { id } = req.params;

//       const testimonial = await Testimonial.findById(id);

//       if (!testimonial) {
//         return res.status(404).json({
//           success: false,
//           message: 'Testimonial not found'
//         });
//       }

//       // Notify user about deletion
//       if (testimonial.email && !process.env.SKIP_EMAILS) {
//         const deletionHtml = `
//           <div style="padding: 20px; font-family: Arial, sans-serif;">
//             <h2 style="color: #dc3545;">Testimonial Removed</h2>
//             <p>Hello ${testimonial.name},</p>
//             <p>Your testimonial for <strong>${testimonial.university || 'your university'}</strong> has been removed from our platform.</p>
//             <p>If you have any questions, please contact our support team.</p>
//             <hr>
//             <p style="color: #666;">Thank you for understanding.</p>
//           </div>
//         `;
        
//         await this.sendEmail(
//           testimonial.email,
//           `❌ Testimonial Removed - ${this.companyName}`,
//           deletionHtml
//         );
//       }

//       // Delete image from Cloudinary
//       if (testimonial.image?.public_id) {
//         await cloudinary.uploader.destroy(testimonial.image.public_id);
//       }

//       await testimonial.deleteOne();

//       res.status(200).json({
//         success: true,
//         message: 'Testimonial deleted successfully'
//       });
//     } catch (error) {
//       console.error('Delete testimonial error:', error);
//       res.status(500).json({
//         success: false,
//         message: 'Server error'
//       });
//     }
//   };

//   // Approve testimonial
//   approveTestimonial = async (req, res) => {
//     try {
//       const { id } = req.params;

//       const testimonial = await Testimonial.findByIdAndUpdate(
//         id,
//         { status: 'approved' },
//         { new: true }
//       );

//       if (!testimonial) {
//         return res.status(404).json({
//           success: false,
//           message: 'Testimonial not found'
//         });
//       }

//       // Send approval email to user
//       if (testimonial.email) {
//         const userHtml = this.getTestimonialStatusUpdateEmail(
//           testimonial.name,
//           'approved',
//           testimonial
//         );
        
//         await this.sendEmail(
//           testimonial.email,
//           `✅ Your Testimonial Has Been Approved - ${this.companyName}`,
//           userHtml
//         );
//       }

//       // Notify admin of approval
//       const adminHtml = `
//         <div style="padding: 20px; font-family: Arial, sans-serif;">
//           <h2 style="color: #28a745;">Testimonial Approved</h2>
//           <p><strong>User:</strong> ${testimonial.name}</p>
//           <p><strong>Email:</strong> ${testimonial.email}</p>
//           <p><strong>University:</strong> ${testimonial.university || 'Not specified'}</p>
//           <p>The testimonial has been approved and is now live on the website.</p>
//         </div>
//       `;
      
//       await this.sendEmail(
//         this.adminEmail,
//         `✅ Testimonial Approved: ${testimonial.name}`,
//         adminHtml
//       );

//       res.status(200).json({
//         success: true,
//         data: testimonial
//       });
//     } catch (error) {
//       console.error('Approve testimonial error:', error);
//       res.status(400).json({
//         success: false,
//         message: error.message
//       });
//     }
//   };

//   // Get single testimonial
//   getTestimonial = async (req, res) => {
//     try {
//       const testimonial = await Testimonial.findById(req.params.id);

//       if (!testimonial) {
//         return res.status(404).json({
//           success: false,
//           message: 'Testimonial not found'
//         });
//       }

//       res.status(200).json({
//         success: true,
//         data: testimonial
//       });
//     } catch (error) {
//       console.error('Get testimonial error:', error);
//       res.status(500).json({
//         success: false,
//         message: 'Server error'
//       });
//     }
//   };

//   // Overall statistics
//   getTestimonialStats = async (req, res) => {
//     try {
//       const total = await Testimonial.countDocuments();
//       const approved = await Testimonial.countDocuments({ status: 'approved' });
//       const pending = await Testimonial.countDocuments({ status: 'pending' });
//       const rejected = await Testimonial.countDocuments({ status: 'rejected' });

//       const avgRating = await Testimonial.aggregate([
//         { $match: { status: 'approved' } },
//         { $group: { _id: null, average: { $avg: '$rating' } } },
//       ]);

//       // Get monthly submission stats
//       const monthlyStats = await Testimonial.aggregate([
//         {
//           $group: {
//             _id: {
//               year: { $year: '$createdAt' },
//               month: { $month: '$createdAt' }
//             },
//             count: { $sum: 1 }
//           }
//         },
//         { $sort: { '_id.year': -1, '_id.month': -1 } },
//         { $limit: 12 }
//       ]);

//       res.status(200).json({
//         success: true,
//         data: {
//           total,
//           approved,
//           pending,
//           rejected,
//           averageRating: avgRating[0]?.average || 0,
//           monthlyStats: monthlyStats.map(stat => ({
//             month: `${stat._id.year}-${String(stat._id.month).padStart(2, '0')}`,
//             count: stat.count
//           }))
//         },
//       });
//     } catch (error) {
//       res.status(500).json({
//         success: false,
//         message: error.message,
//       });
//     }
//   };

//   // Statistics by country
//   getStatsByCountry = async (req, res) => {
//     try {
//       const stats = await Testimonial.aggregate([
//         { $match: { status: 'approved' } },
//         {
//           $group: {
//             _id: '$country',
//             count: { $sum: 1 },
//             averageRating: { $avg: '$rating' },
//             totalTestimonials: { $sum: 1 }
//           },
//         },
//         { $sort: { count: -1 } },
//       ]);

//       res.status(200).json({
//         success: true,
//         data: stats,
//       });
//     } catch (error) {
//       res.status(500).json({
//         success: false,
//         message: error.message,
//       });
//     }
//   };

//   // Statistics by university
//   getStatsByUniversity = async (req, res) => {
//     try {
//       const stats = await Testimonial.aggregate([
//         { $match: { status: 'approved', university: { $ne: null, $ne: '' } } },
//         {
//           $group: {
//             _id: '$university',
//             count: { $sum: 1 },
//             averageRating: { $avg: '$rating' },
//             countries: { $addToSet: '$country' }
//           },
//         },
//         { $sort: { count: -1 } },
//         { $limit: 20 }
//       ]);

//       res.status(200).json({
//         success: true,
//         data: stats,
//       });
//     } catch (error) {
//       res.status(500).json({
//         success: false,
//         message: error.message,
//       });
//     }
//   };

//   // Get featured testimonials for homepage
//   getFeaturedTestimonials = async (req, res) => {
//     try {
//       const { limit = 6 } = req.query;
      
//       const testimonials = await Testimonial.find({ 
//         status: 'approved',
//         featured: true 
//       })
//       .sort({ createdAt: -1 })
//       .limit(parseInt(limit));

//       // If not enough featured, get highest rated
//       if (testimonials.length < limit) {
//         const remaining = limit - testimonials.length;
//         const additional = await Testimonial.find({ 
//           status: 'approved',
//           featured: { $ne: true }
//         })
//         .sort({ rating: -1, createdAt: -1 })
//         .limit(remaining);
        
//         testimonials.push(...additional);
//       }

//       res.status(200).json({
//         success: true,
//         data: testimonials
//       });
//     } catch (error) {
//       console.error('Get featured testimonials error:', error);
//       res.status(500).json({
//         success: false,
//         message: 'Server error'
//       });
//     }
//   };
// }

// module.exports = new TestimonialController();


















// controllers/testimonialController.js
const Testimonial = require('../models/Testimonial');
const cloudinary = require('../cloudinary/cloudinary');
const nodemailer = require("nodemailer");

class TestimonialController {
  constructor() {
    // Nodemailer transporter - ALWAYS INITIALIZE
    this.mailer = nodemailer.createTransport({
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
    
    this.companyName = process.env.COMPANY_NAME || "REC APPLY";
    this.adminEmail = process.env.ADMIN_EMAIL || "r.educationalconsultance@gmail.com";
    this.frontendUrl = process.env.FRONTEND_URL || "https://rk-services-xi.vercel.app";
    
    console.log('📧 Testimonial email service initialized');
  }

  // ================== Email Helper with Beautiful Templates ==================
  sendEmail = async (to, subject, html) => {
    try {
      console.log(`📧 Attempting to send email to: ${to} - Subject: ${subject}`);
      
      await this.mailer.sendMail({
        from: `"${this.companyName}" <${process.env.EMAIL_FROM || process.env.SMTP_USER}>`,
        to,
        subject,
        html,
      });
      
      console.log(`✅ Email sent successfully to: ${to}`);
      return { success: true };
    } catch (error) {
      console.error(`❌ Email sending failed to ${to}:`, error.message);
      // Return failure but don't throw - emails are non-blocking
      return { success: false, error: error.message };
    }
  };

  getUserTestimonialConfirmationEmail = (userName, testimonialData) => {
    const { university, program, rating, content } = testimonialData;
    const ratingStars = '★'.repeat(rating) + '☆'.repeat(5 - rating);
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Testimonial Submitted</title>
        <style>
          .rating-star { color: #FFD700; font-size: 20px; }
        </style>
      </head>
      <body style="font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f8;">
        <div style="max-width: 600px; margin: 20px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 100%); padding: 30px 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">${this.companyName}</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0; font-size: 16px;">Thank You for Sharing Your Experience!</p>
          </div>
          
          <!-- Content -->
          <div style="padding: 30px;">
            <div style="text-align: center; margin-bottom: 20px;">
              <span style="background: #28a745; color: white; padding: 8px 20px; border-radius: 20px; font-size: 14px; font-weight: bold;">
                🎉 TESTIMONIAL RECEIVED
              </span>
            </div>
            
            <h2 style="color: #333; margin: 0 0 20px;">Hello ${userName},</h2>
            <p style="color: #666; line-height: 1.6; font-size: 16px;">Thank you for submitting your testimonial! We appreciate you taking the time to share your experience. Your testimonial has been received and is now pending review by our team.</p>
            
            <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <h3 style="color: #333; margin: 0 0 15px; border-bottom: 1px solid #dee2e6; padding-bottom: 10px;">Your Submission:</h3>
              
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #555; width: 35%;">University:</td>
                  <td style="padding: 8px 0; color: #333; font-weight: bold;">${university || 'Not specified'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #555;">Program:</td>
                  <td style="padding: 8px 0; color: #333; font-weight: bold;">${program || 'Not specified'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #555;">Rating:</td>
                  <td style="padding: 8px 0; color: #333; font-weight: bold;">
                    <span style="color: #FFD700; font-size: 18px;">${ratingStars}</span> (${rating}/5)
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #555; vertical-align: top;">Your Story:</td>
                  <td style="padding: 8px 0; color: #333; font-style: italic;">"${content.substring(0, 100)}${content.length > 100 ? '...' : ''}"</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #555;">Status:</td>
                  <td style="padding: 8px 0;">
                    <span style="background: #ffc107; color: #333; padding: 4px 12px; border-radius: 20px; font-size: 13px; font-weight: bold;">PENDING REVIEW</span>
                  </td>
                </tr>
              </table>
            </div>
            
            <div style="background: #e3f2fd; border-left: 4px solid #2196f3; padding: 15px; margin: 20px 0;">
              <p style="color: #0c5460; margin: 0; font-size: 14px;">
                <strong>📌 What's Next?</strong> Our team will review your testimonial within 24-48 hours. You'll receive an email once it's approved and published on our website.
              </p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${this.frontendUrl}/testimonials" 
                 style="background: linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
                View All Testimonials
              </a>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e9ecef;">
            <p style="color: #999; margin: 5px 0; font-size: 14px;">Questions? Contact us at <a href="mailto:${this.adminEmail}" style="color: #ff6b6b; text-decoration: none;">${this.adminEmail}</a></p>
            <p style="color: #999; margin: 5px 0; font-size: 12px;">© ${new Date().getFullYear()} ${this.companyName}. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  };

  getAdminNewTestimonialNotification = (userName, userEmail, testimonialData) => {
    const { university, program, rating, content } = testimonialData;
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>New Testimonial - Admin Alert</title>
      </head>
      <body style="font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f8;">
        <div style="max-width: 600px; margin: 20px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 30px 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Admin Notification</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0; font-size: 16px;">New Testimonial Pending Review</p>
          </div>
          
          <!-- Content -->
          <div style="padding: 30px;">
            <div style="text-align: center; margin-bottom: 25px;">
              <span style="background: #dc3545; color: white; padding: 8px 20px; border-radius: 20px; font-size: 14px; font-weight: bold;">
                🔔 ACTION REQUIRED: REVIEW NEEDED
              </span>
            </div>
            
            <h2 style="color: #333; margin: 0 0 20px;">New Testimonial Details</h2>
            
            <div style="background: #f8f9fa; border-radius: 8px; padding: 20px;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px 0; color: #555; width: 40%;">👤 User:</td>
                  <td style="padding: 10px 0; color: #333; font-weight: bold;">${userName}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #555;">📧 Email:</td>
                  <td style="padding: 10px 0; color: #333; font-weight: bold;">${userEmail}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #555;">🏛️ University:</td>
                  <td style="padding: 10px 0; color: #333; font-weight: bold;">${university || 'Not specified'}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #555;">📚 Program:</td>
                  <td style="padding: 10px 0; color: #333; font-weight: bold;">${program || 'Not specified'}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #555;">⭐ Rating:</td>
                  <td style="padding: 10px 0; color: #333; font-weight: bold;">${rating}/5</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #555;">📝 Content:</td>
                  <td style="padding: 10px 0; color: #333;">"${content}"</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #555;">📅 Submitted:</td>
                  <td style="padding: 10px 0; color: #333; font-weight: bold;">${new Date().toLocaleString()}</td>
                </tr>
              </table>
            </div>
            
            <div style="display: flex; gap: 10px; margin-top: 30px; justify-content: center;">
              <a href="${this.frontendUrl}/admin/testimonials/${testimonialData._id}/approve" 
                 style="background: #28a745; color: white; padding: 12px 25px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block; margin-right: 10px;">
                ✅ Approve
              </a>
              <a href="${this.frontendUrl}/admin/testimonials/${testimonialData._id}/reject" 
                 style="background: #dc3545; color: white; padding: 12px 25px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
                ❌ Reject
              </a>
            </div>
            
            <div style="text-align: center; margin-top: 20px;">
              <a href="${this.frontendUrl}/admin/testimonials" 
                 style="background: #6c757d; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-size: 14px;">
                Go to Admin Dashboard
              </a>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e9ecef;">
            <p style="color: #999; margin: 5px 0; font-size: 12px;">This is an automated notification from ${this.companyName}</p>
          </div>
        </div>
      </body>
      </html>
    `;
  };

  getTestimonialStatusUpdateEmail = (userName, status, testimonialData) => {
    const statusColors = {
      approved: "#28a745",
      rejected: "#dc3545",
      pending: "#ffc107"
    };
    
    const statusMessages = {
      approved: "Congratulations! Your testimonial has been approved and is now live on our website.",
      rejected: "We regret to inform you that your testimonial has not been approved at this time.",
      pending: "Your testimonial status has been updated to pending review."
    };
    
    const color = statusColors[status] || "#6c757d";
    const message = statusMessages[status] || `Your testimonial status has been updated to ${status}.`;
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Testimonial Status Update</title>
      </head>
      <body style="font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f8;">
        <div style="max-width: 600px; margin: 20px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">${this.companyName}</h1>
          </div>
          
          <!-- Content -->
          <div style="padding: 30px;">
            <h2 style="color: #333; margin: 0 0 20px;">Testimonial Status Update</h2>
            <p style="color: #666; line-height: 1.6;">Hello <strong>${userName}</strong>,</p>
            <p style="color: #666; line-height: 1.6;">${message}</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <span style="background: ${color}; color: white; padding: 12px 30px; border-radius: 25px; font-size: 18px; font-weight: bold; display: inline-block;">
                ${status.toUpperCase()}
              </span>
            </div>
            
            <div style="background: #f8f9fa; border-radius: 8px; padding: 20px;">
              <h3 style="color: #333; margin: 0 0 15px;">Testimonial Summary:</h3>
              <p style="color: #555;"><strong>University:</strong> ${testimonialData.university || 'Not specified'}</p>
              <p style="color: #555;"><strong>Program:</strong> ${testimonialData.program || 'Not specified'}</p>
              <p style="color: #555;"><strong>Rating:</strong> ${testimonialData.rating}/5</p>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="${this.frontendUrl}/testimonials" 
                 style="background: ${color}; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
                View Testimonials
              </a>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  };

  // ================== Testimonial CRUD Operations ==================

  // Get all testimonials with filtering and pagination
  getAllTestimonials = async (req, res) => {
    try {
      const {
        status,
        search,
        sort,
        page = 1,
        limit = 20
      } = req.query;

      // Build query
      let query = {};

      // Status filter
      if (status && status !== 'all') {
        query.status = status;
      }

      // Search filter
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { university: { $regex: search, $options: 'i' } },
          { program: { $regex: search, $options: 'i' } },
          { country: { $regex: search, $options: 'i' } },
          { content: { $regex: search, $options: 'i' } }
        ];
      }

      // Build sort
      let sortOption = { createdAt: -1 }; // Default: newest first
      
      if (sort === 'oldest') {
        sortOption = { createdAt: 1 };
      } else if (sort === 'highest-rating') {
        sortOption = { rating: -1 };
      } else if (sort === 'lowest-rating') {
        sortOption = { rating: 1 };
      }

      // Calculate pagination
      const skip = (page - 1) * limit;

      // Execute query
      const testimonials = await Testimonial.find(query)
        .sort(sortOption)
        .skip(skip)
        .limit(parseInt(limit));

      // Get total count for pagination
      const total = await Testimonial.countDocuments(query);

      res.status(200).json({
        success: true,
        count: testimonials.length,
        total,
        pages: Math.ceil(total / limit),
        currentPage: parseInt(page),
        data: testimonials
      });
    } catch (error) {
      console.error('❌ Get testimonials error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error while fetching testimonials'
      });
    }
  };

  // Get testimonials by email
  getTestimonialsByEmail = async (req, res) => {
    try {
      const { email } = req.params;
      const {
        status,
        search,
        sort,
        page = 1,
        limit = 20
      } = req.query;

      // Build query
      let query = { email: email.toLowerCase() };

      // Status filter
      if (status && status !== 'all') {
        query.status = status;
      }

      // Search filter
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { university: { $regex: search, $options: 'i' } },
          { program: { $regex: search, $options: 'i' } },
          { country: { $regex: search, $options: 'i' } },
          { content: { $regex: search, $options: 'i' } }
        ];
      }

      // Build sort
      let sortOption = { createdAt: -1 }; // Default: newest first
      if (sort === 'oldest') sortOption = { createdAt: 1 };
      else if (sort === 'highest-rating') sortOption = { rating: -1 };
      else if (sort === 'lowest-rating') sortOption = { rating: 1 };

      // Pagination
      const skip = (page - 1) * limit;

      // Execute query
      const testimonials = await Testimonial.find(query)
        .sort(sortOption)
        .skip(skip)
        .limit(parseInt(limit));

      // Total count for pagination
      const total = await Testimonial.countDocuments(query);

      res.status(200).json({
        success: true,
        count: testimonials.length,
        total,
        pages: Math.ceil(total / limit),
        currentPage: parseInt(page),
        data: testimonials
      });
    } catch (error) {
      console.error('❌ Get testimonials by email error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error while fetching testimonials by email'
      });
    }
  };

  // Create testimonial
  createTestimonial = async (req, res) => {
    try {
      console.log('📝 Creating testimonial...');
      console.log('📤 Request body:', req.body);
      console.log('🖼️ File:', req.file);

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'Image is required',
        });
      }

      // Upload image to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'testimonials',
        width: 500,
        height: 500,
        crop: 'fill'
      });

      console.log('☁️ Cloudinary upload result:', result);

      const testimonialData = {
        name: req.body.name,
        country: req.body.country,
        university: req.body.university,
        program: req.body.program,
        rating: parseFloat(req.body.rating) || 5,
        duration: req.body.duration,
        content: req.body.content,
        email: req.body.email,
        verified: req.body.verified === 'true' || req.body.verified === true,
        status: req.body.status || 'pending',
        image: {
          public_id: result.public_id,
          url: result.secure_url,
        },
      };

      console.log('📋 Testimonial data to save:', testimonialData);

      const testimonial = await Testimonial.create(testimonialData);
      
      console.log('✅ Testimonial created:', testimonial._id);

      // Send emails (fire and forget - don't await)
      if (testimonial.email) {
        const userHtml = this.getUserTestimonialConfirmationEmail(
          testimonial.name,
          testimonial
        );
        
        this.sendEmail(
          testimonial.email,
          `✨ Thank You for Your Testimonial - ${this.companyName}`,
          userHtml
        ).then(result => {
          console.log(`📧 Confirmation email ${result.success ? 'sent' : 'failed'} to ${testimonial.email}`);
        }).catch(err => console.error('Confirmation email error:', err));
      }

      // Send notification to admin
      const adminHtml = this.getAdminNewTestimonialNotification(
        testimonial.name,
        testimonial.email,
        testimonial
      );
      
      this.sendEmail(
        this.adminEmail,
        `🔔 New Testimonial Pending Review: ${testimonial.name}`,
        adminHtml
      ).then(result => {
        console.log(`📧 Admin notification ${result.success ? 'sent' : 'failed'}`);
      }).catch(err => console.error('Admin notification error:', err));

      res.status(201).json({
        success: true,
        data: testimonial,
      });
    } catch (error) {
      console.error('❌ Create testimonial error:', error);
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

  // Update testimonial
  updateTestimonial = async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = { ...req.body };

      // Handle rating conversion
      if (updateData.rating) {
        updateData.rating = parseFloat(updateData.rating);
      }

      // Handle verified conversion
      if (updateData.verified !== undefined) {
        updateData.verified = updateData.verified === 'true' || updateData.verified === true;
      }

      // Get the current testimonial before update to check status change
      const currentTestimonial = await Testimonial.findById(id);
      if (!currentTestimonial) {
        return res.status(404).json({
          success: false,
          message: 'Testimonial not found'
        });
      }

      // Handle image upload if new image provided
      if (req.file) {
        // Delete old image
        if (currentTestimonial.image?.public_id) {
          await cloudinary.uploader.destroy(currentTestimonial.image.public_id);
        }

        // Upload new image
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'testimonials',
          width: 500,
          height: 500,
          crop: 'fill'
        });

        updateData.image = {
          public_id: result.public_id,
          url: result.secure_url,
        };
      }

      const testimonial = await Testimonial.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );

      // Send status update email if status changed (fire and forget)
      if (currentTestimonial.status !== testimonial.status && testimonial.email) {
        const userHtml = this.getTestimonialStatusUpdateEmail(
          testimonial.name,
          testimonial.status,
          testimonial
        );
        
        const statusEmoji = {
          approved: "✅",
          rejected: "❌",
          pending: "⏳"
        };
        
        this.sendEmail(
          testimonial.email,
          `${statusEmoji[testimonial.status] || '📋'} Testimonial ${testimonial.status.charAt(0).toUpperCase() + testimonial.status.slice(1)} - ${this.companyName}`,
          userHtml
        ).then(result => {
          console.log(`📧 Status update email ${result.success ? 'sent' : 'failed'} to ${testimonial.email}`);
        }).catch(err => console.error('Status update email error:', err));

        // Also notify admin of status change
        const adminHtml = `
          <div style="padding: 20px; font-family: Arial, sans-serif;">
            <h2 style="color: #333;">Testimonial Status Updated</h2>
            <p><strong>User:</strong> ${testimonial.name}</p>
            <p><strong>Email:</strong> ${testimonial.email}</p>
            <p><strong>Old Status:</strong> <span style="color: #999;">${currentTestimonial.status}</span></p>
            <p><strong>New Status:</strong> <span style="color: ${testimonial.status === 'approved' ? '#28a745' : testimonial.status === 'rejected' ? '#dc3545' : '#ffc107'}; font-weight: bold;">${testimonial.status}</span></p>
            <a href="${this.frontendUrl}/admin/testimonials/${testimonial._id}" style="background: #667eea; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Testimonial</a>
          </div>
        `;
        
        this.sendEmail(
          this.adminEmail,
          `🔄 Testimonial Status Updated: ${testimonial.name}`,
          adminHtml
        ).then(result => {
          console.log(`📧 Admin status update email ${result.success ? 'sent' : 'failed'}`);
        }).catch(err => console.error('Admin status update email error:', err));
      }

      res.status(200).json({
        success: true,
        data: testimonial
      });
    } catch (error) {
      console.error('❌ Update testimonial error:', error);
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  };

  // Delete testimonial
  deleteTestimonial = async (req, res) => {
    try {
      const { id } = req.params;

      const testimonial = await Testimonial.findById(id);

      if (!testimonial) {
        return res.status(404).json({
          success: false,
          message: 'Testimonial not found'
        });
      }

      // Notify user about deletion (fire and forget)
      if (testimonial.email) {
        const deletionHtml = `
          <div style="padding: 20px; font-family: Arial, sans-serif;">
            <h2 style="color: #dc3545;">Testimonial Removed</h2>
            <p>Hello ${testimonial.name},</p>
            <p>Your testimonial for <strong>${testimonial.university || 'your university'}</strong> has been removed from our platform.</p>
            <p>If you have any questions, please contact our support team.</p>
            <hr>
            <p style="color: #666;">Thank you for understanding.</p>
          </div>
        `;
        
        this.sendEmail(
          testimonial.email,
          `❌ Testimonial Removed - ${this.companyName}`,
          deletionHtml
        ).then(result => {
          console.log(`📧 Deletion notification email ${result.success ? 'sent' : 'failed'} to ${testimonial.email}`);
        }).catch(err => console.error('Deletion notification email error:', err));
      }

      // Delete image from Cloudinary
      if (testimonial.image?.public_id) {
        await cloudinary.uploader.destroy(testimonial.image.public_id);
      }

      await testimonial.deleteOne();

      res.status(200).json({
        success: true,
        message: 'Testimonial deleted successfully'
      });
    } catch (error) {
      console.error('❌ Delete testimonial error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  };

  // Approve testimonial
  approveTestimonial = async (req, res) => {
    try {
      const { id } = req.params;

      const testimonial = await Testimonial.findByIdAndUpdate(
        id,
        { status: 'approved' },
        { new: true }
      );

      if (!testimonial) {
        return res.status(404).json({
          success: false,
          message: 'Testimonial not found'
        });
      }

      // Send approval email to user (fire and forget)
      if (testimonial.email) {
        const userHtml = this.getTestimonialStatusUpdateEmail(
          testimonial.name,
          'approved',
          testimonial
        );
        
        this.sendEmail(
          testimonial.email,
          `✅ Your Testimonial Has Been Approved - ${this.companyName}`,
          userHtml
        ).then(result => {
          console.log(`📧 Approval email ${result.success ? 'sent' : 'failed'} to ${testimonial.email}`);
        }).catch(err => console.error('Approval email error:', err));
      }

      // Notify admin of approval
      const adminHtml = `
        <div style="padding: 20px; font-family: Arial, sans-serif;">
          <h2 style="color: #28a745;">Testimonial Approved</h2>
          <p><strong>User:</strong> ${testimonial.name}</p>
          <p><strong>Email:</strong> ${testimonial.email}</p>
          <p><strong>University:</strong> ${testimonial.university || 'Not specified'}</p>
          <p>The testimonial has been approved and is now live on the website.</p>
        </div>
      `;
      
      this.sendEmail(
        this.adminEmail,
        `✅ Testimonial Approved: ${testimonial.name}`,
        adminHtml
      ).then(result => {
        console.log(`📧 Admin approval notification ${result.success ? 'sent' : 'failed'}`);
      }).catch(err => console.error('Admin approval notification error:', err));

      res.status(200).json({
        success: true,
        data: testimonial
      });
    } catch (error) {
      console.error('❌ Approve testimonial error:', error);
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  };

  // Get single testimonial
  getTestimonial = async (req, res) => {
    try {
      const testimonial = await Testimonial.findById(req.params.id);

      if (!testimonial) {
        return res.status(404).json({
          success: false,
          message: 'Testimonial not found'
        });
      }

      res.status(200).json({
        success: true,
        data: testimonial
      });
    } catch (error) {
      console.error('❌ Get testimonial error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  };

  // Overall statistics
  getTestimonialStats = async (req, res) => {
    try {
      const total = await Testimonial.countDocuments();
      const approved = await Testimonial.countDocuments({ status: 'approved' });
      const pending = await Testimonial.countDocuments({ status: 'pending' });
      const rejected = await Testimonial.countDocuments({ status: 'rejected' });

      const avgRating = await Testimonial.aggregate([
        { $match: { status: 'approved' } },
        { $group: { _id: null, average: { $avg: '$rating' } } },
      ]);

      // Get monthly submission stats
      const monthlyStats = await Testimonial.aggregate([
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': -1, '_id.month': -1 } },
        { $limit: 12 }
      ]);

      res.status(200).json({
        success: true,
        data: {
          total,
          approved,
          pending,
          rejected,
          averageRating: avgRating[0]?.average || 0,
          monthlyStats: monthlyStats.map(stat => ({
            month: `${stat._id.year}-${String(stat._id.month).padStart(2, '0')}`,
            count: stat.count
          }))
        },
      });
    } catch (error) {
      console.error('❌ Get testimonial stats error:', error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  // Statistics by country
  getStatsByCountry = async (req, res) => {
    try {
      const stats = await Testimonial.aggregate([
        { $match: { status: 'approved' } },
        {
          $group: {
            _id: '$country',
            count: { $sum: 1 },
            averageRating: { $avg: '$rating' },
            totalTestimonials: { $sum: 1 }
          },
        },
        { $sort: { count: -1 } },
      ]);

      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      console.error('❌ Get stats by country error:', error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  // Statistics by university
  getStatsByUniversity = async (req, res) => {
    try {
      const stats = await Testimonial.aggregate([
        { $match: { status: 'approved', university: { $ne: null, $ne: '' } } },
        {
          $group: {
            _id: '$university',
            count: { $sum: 1 },
            averageRating: { $avg: '$rating' },
            countries: { $addToSet: '$country' }
          },
        },
        { $sort: { count: -1 } },
        { $limit: 20 }
      ]);

      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      console.error('❌ Get stats by university error:', error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  // Get featured testimonials for homepage
  getFeaturedTestimonials = async (req, res) => {
    try {
      const { limit = 6 } = req.query;
      
      const testimonials = await Testimonial.find({ 
        status: 'approved',
        featured: true 
      })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

      // If not enough featured, get highest rated
      if (testimonials.length < limit) {
        const remaining = limit - testimonials.length;
        const additional = await Testimonial.find({ 
          status: 'approved',
          featured: { $ne: true }
        })
        .sort({ rating: -1, createdAt: -1 })
        .limit(remaining);
        
        testimonials.push(...additional);
      }

      res.status(200).json({
        success: true,
        data: testimonials
      });
    } catch (error) {
      console.error('❌ Get featured testimonials error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  };

  // Email health check
  emailHealthCheck = async (req, res) => {
    try {
      // Try to verify transporter connection
      let verified = false;
      try {
        await this.mailer.verify();
        verified = true;
      } catch (err) {
        console.error('Email verification failed:', err.message);
      }

      res.status(200).json({
        success: true,
        data: {
          transporterInitialized: true,
          verified,
          smtpConfigured: !!(process.env.SMTP_USER && process.env.SMTP_PASS),
          smtpHost: process.env.SMTP_HOST || 'smtp.gmail.com',
          smtpPort: process.env.SMTP_PORT || 587,
          companyName: this.companyName,
          adminEmail: this.adminEmail,
          frontendUrl: this.frontendUrl
        }
      });
    } catch (error) {
      console.error('❌ Email health check error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to check email health',
        error: error.message
      });
    }
  };
}

module.exports = new TestimonialController();