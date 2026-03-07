
// const ScholarshipApplication = require('../models/ScholarshipApplication');
// const nodemailer = require('nodemailer');
// const cloudinary = require('../cloudinary/cloudinary');
// const { v4: uuidv4 } = require('uuid');
// const fs = require('fs');
// const path = require('path');

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
//     if (process.env.SKIP_EMAILS === 'true' && !isAdminNotification) {
//       console.log('Email sending skipped (SKIP_EMAILS=true)');
//       return { success: true, skipped: true };
//     }

//     try {
//       const transporter = createTransporter();
      
//       const info = await transporter.sendMail({
//         from: `"${process.env.COMPANY_NAME || 'REC APPLY'} Scholarships" <${process.env.EMAIL_FROM}>`,
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

//   // Send application confirmation to applicant
//   sendApplicationConfirmation: async (application) => {
//     const subject = `Scholarship Application Received - ${application.applicationId}`;
    
//     const html = `
//       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f4f4; padding: 20px;">
//         <div style="background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
//           <h1 style="color: white; margin: 0; font-size: 28px;">${process.env.COMPANY_NAME || 'REC APPLY'}</h1>
//           <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Scholarship Application</p>
//         </div>
        
//         <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
//           <h2 style="color: #333; margin-top: 0; border-bottom: 2px solid #f0f0f0; padding-bottom: 15px;">
//             Thank You for Your Scholarship Application! 🎓
//           </h2>
          
//           <p style="font-size: 16px; line-height: 1.6; color: #555;">Dear ${application.firstName} ${application.lastName},</p>
          
//           <p style="font-size: 16px; line-height: 1.6; color: #555;">Your scholarship application has been received and is now being processed. Here are your application details:</p>
          
//           <div style="background-color: #e8f4fc; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #2a5298;">
//             <h3 style="margin-top: 0; color: #2a5298; font-size: 20px;">Application ID: ${application.applicationId}</h3>
            
//             <table style="width: 100%; border-collapse: collapse;">
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Full Name:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${application.firstName} ${application.lastName}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Email:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${application.email}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Target University:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${application.targetUniversity}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Target Program:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${application.targetProgram}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Scholarship Type:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${application.scholarshipType}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Submission Date:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${new Date(application.createdAt).toLocaleDateString()}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Current Status:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">
//                   <span style="background-color: ${getStatusColor(application.status)}; color: white; padding: 3px 10px; border-radius: 12px; font-size: 12px;">
//                     ${application.status || 'Submitted'}
//                   </span>
//                 </td>
//               </tr>
//             </table>
//           </div>
          
//           <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
//             <h4 style="margin-top: 0; color: #333;">What Happens Next?</h4>
//             <ol style="margin: 5px 0 0 0; color: #555;">
//               <li style="margin: 5px 0;">Your application will be reviewed within 2-3 weeks</li>
//               <li style="margin: 5px 0;">You may be contacted for additional information or an interview</li>
//               <li style="margin: 5px 0;">You'll receive email updates as your application progresses</li>
//               <li style="margin: 5px 0;">Final decisions will be communicated via email</li>
//             </ol>
//           </div>
          
//           <hr style="border: none; border-top: 2px solid #f0f0f0; margin: 30px 0;">
          
//           <div style="text-align: center;">
//             <p style="color: #666; font-size: 14px; line-height: 1.6;">
//               We wish you the best of luck with your scholarship application!<br>
//               If you have any questions, please contact our scholarship office.
//             </p>
//           </div>
//         </div>
        
//         <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
//           © ${new Date().getFullYear()} ${process.env.COMPANY_NAME || 'REC APPLY'}. All rights reserved.<br>
//           This is an automated message, please do not reply to this email.
//         </div>
//       </div>
//     `;

//     return await this.sendEmail(application.email, subject, html);
//   },

//   // Send admin notification for new application
//   sendAdminNotification: async (application) => {
//     const subject = `New Scholarship Application Received - ${application.applicationId}`;
    
//     const html = `
//       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f4f4; padding: 20px;">
//         <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
//           <h1 style="color: white; margin: 0; font-size: 28px;">${process.env.COMPANY_NAME || 'REC APPLY'}</h1>
//           <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Admin Notification - New Application</p>
//         </div>
        
//         <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
//           <h2 style="color: #333; margin-top: 0; border-bottom: 2px solid #f0f0f0; padding-bottom: 15px;">
//             New Scholarship Application Alert! 📋
//           </h2>
          
//           <div style="background-color: #fff3e0; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #f5576c;">
//             <h3 style="margin-top: 0; color: #f5576c; font-size: 20px;">Application ID: ${application.applicationId}</h3>
            
//             <table style="width: 100%; border-collapse: collapse;">
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Applicant Name:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${application.firstName} ${application.lastName}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Email:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${application.email}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Phone:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${application.phone || 'Not provided'}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Nationality:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${application.nationality || 'Not provided'}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Target University:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${application.targetUniversity}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Target Program:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${application.targetProgram}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Scholarship Type:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${application.scholarshipType}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Intake Year:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${application.intakeYear || 'Not specified'}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Application Date:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${new Date(application.createdAt).toLocaleString()}</td>
//               </tr>
//             </table>
            
//             ${application.academicBackground ? `
//               <div style="margin-top: 15px;">
//                 <strong style="color: #666;">Academic Background:</strong>
//                 <p style="color: #555; margin: 5px 0 0 0;">${application.academicBackground}</p>
//               </div>
//             ` : ''}
//           </div>
          
//           <hr style="border: none; border-top: 2px solid #f0f0f0; margin: 30px 0;">
          
//           <div style="text-align: center;">
//             <p style="color: #666; font-size: 14px; line-height: 1.6;">
//               Please review this application and assign it to a reviewer.<br>
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
//   },

//   // Send status update notification to applicant
//   sendStatusUpdateNotification: async (application, oldStatus, newStatus) => {
//     const subject = `Scholarship Application Status Update - ${application.applicationId}`;
    
//     const statusColors = {
//       'Submitted': '#3498db',
//       'Under Review': '#f39c12',
//       'Shortlisted': '#9b59b6',
//       'Interview Scheduled': '#1abc9c',
//       'Interview Completed': '#16a085',
//       'Approved': '#27ae60',
//       'Conditionally Approved': '#2ecc71',
//       'Rejected': '#e74c3c',
//       'Waitlisted': '#7f8c8d',
//       'Withdrawn': '#34495e'
//     };

//     const oldColor = statusColors[oldStatus] || '#95a5a6';
//     const newColor = statusColors[newStatus] || '#95a5a6';
    
//     const html = `
//       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f4f4; padding: 20px;">
//         <div style="background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
//           <h1 style="color: white; margin: 0; font-size: 28px;">${process.env.COMPANY_NAME || 'REC APPLY'}</h1>
//           <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Application Status Update</p>
//         </div>
        
//         <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
//           <h2 style="color: #333; margin-top: 0; border-bottom: 2px solid #f0f0f0; padding-bottom: 15px;">
//             Your Application Status Has Been Updated
//           </h2>
          
//           <p style="font-size: 16px; line-height: 1.6; color: #555;">Dear ${application.firstName} ${application.lastName},</p>
          
//           <p style="font-size: 16px; line-height: 1.6; color: #555;">The status of your scholarship application has been updated:</p>
          
//           <div style="background-color: #f9f9f9; padding: 30px; text-align: center; border-radius: 5px; margin: 20px 0;">
//             <div style="display: inline-block; background-color: ${oldColor}20; padding: 15px 30px; border-radius: 5px; margin-right: 10px;">
//               <span style="color: ${oldColor}; font-weight: bold;">${oldStatus || 'Submitted'}</span>
//             </div>
//             <span style="font-size: 24px; color: #999; margin: 0 15px;">→</span>
//             <div style="display: inline-block; background-color: ${newColor}20; padding: 15px 30px; border-radius: 5px;">
//               <span style="color: ${newColor}; font-weight: bold;">${newStatus}</span>
//             </div>
//           </div>
          
//           <div style="background-color: #e8f4fc; padding: 20px; border-radius: 5px; margin: 20px 0;">
//             <h4 style="margin-top: 0; color: #333;">Application Details</h4>
//             <p style="margin: 5px 0; color: #555;"><strong>Application ID:</strong> ${application.applicationId}</p>
//             <p style="margin: 5px 0; color: #555;"><strong>University:</strong> ${application.targetUniversity}</p>
//             <p style="margin: 5px 0; color: #555;"><strong>Program:</strong> ${application.targetProgram}</p>
//             <p style="margin: 5px 0; color: #555;"><strong>Current Status:</strong> 
//               <span style="background-color: ${newColor}; color: white; padding: 3px 10px; border-radius: 12px; font-size: 12px;">
//                 ${newStatus}
//               </span>
//             </p>
//             <p style="margin: 5px 0; color: #555;"><strong>Updated on:</strong> ${new Date().toLocaleDateString()}</p>
//           </div>
          
//           <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
//             <h4 style="margin-top: 0; color: #333;">Next Steps</h4>
//             <p style="margin: 5px 0; color: #555;">
//               ${newStatus === 'Approved' ? 'Congratulations! Your application has been approved. You will receive further instructions shortly.' : 
//                 newStatus === 'Rejected' ? 'We regret to inform you that your application was not successful. You may reapply in the future.' :
//                 newStatus === 'Interview Scheduled' ? 'Please check your email for interview details and preparation materials.' :
//                 'Continue to monitor your email for further updates on your application.'}
//             </p>
//           </div>
          
//           <hr style="border: none; border-top: 2px solid #f0f0f0; margin: 30px 0;">
          
//           <div style="text-align: center;">
//             <p style="color: #666; font-size: 14px; line-height: 1.6;">
//               If you have any questions, please contact our scholarship office.<br>
//               Thank you for applying with ${process.env.COMPANY_NAME || 'REC APPLY'}.
//             </p>
//           </div>
//         </div>
        
//         <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
//           © ${new Date().getFullYear()} ${process.env.COMPANY_NAME || 'REC APPLY'}. All rights reserved.
//         </div>
//       </div>
//     `;

//     return await this.sendEmail(application.email, subject, html);
//   },

//   // Send decision notification
//   sendDecisionNotification: async (application, decision) => {
//     const subject = `Scholarship Application Decision - ${application.applicationId}`;
    
//     const isApproved = decision === 'Approved' || decision === 'Conditionally Approved';
//     const bgColor = isApproved ? '#d5f4e6' : '#ffcccc';
//     const textColor = isApproved ? '#27ae60' : '#e74c3c';
//     const icon = isApproved ? '🎉' : '📋';
    
//     const html = `
//       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f4f4; padding: 20px;">
//         <div style="background: linear-gradient(135deg, ${isApproved ? '#27ae60' : '#e74c3c'} 0%, ${isApproved ? '#2ecc71' : '#c0392b'} 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
//           <h1 style="color: white; margin: 0; font-size: 28px;">${process.env.COMPANY_NAME || 'REC APPLY'}</h1>
//           <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Scholarship Decision</p>
//         </div>
        
//         <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
//           <h2 style="color: #333; margin-top: 0; border-bottom: 2px solid #f0f0f0; padding-bottom: 15px;">
//             ${icon} Scholarship Application ${isApproved ? 'Approved' : 'Outcome'}
//           </h2>
          
//           <p style="font-size: 16px; line-height: 1.6; color: #555;">Dear ${application.firstName} ${application.lastName},</p>
          
//           <div style="background-color: ${bgColor}; padding: 30px; text-align: center; border-radius: 8px; margin: 20px 0;">
//             <h3 style="color: ${textColor}; margin-top: 0; font-size: 24px;">
//               ${decision === 'Approved' ? 'Congratulations! 🎉' : 
//                 decision === 'Conditionally Approved' ? 'Conditional Approval' : 
//                 'Application Decision'}
//             </h3>
//             <p style="font-size: 20px; font-weight: bold; color: ${textColor};">${decision}</p>
//           </div>
          
//           <div style="background-color: #e8f4fc; padding: 20px; border-radius: 5px; margin: 20px 0;">
//             <h4 style="margin-top: 0; color: #333;">Application Summary</h4>
//             <table style="width: 100%; border-collapse: collapse;">
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Application ID:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${application.applicationId}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>University:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${application.targetUniversity}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Program:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${application.targetProgram}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Decision Date:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${new Date().toLocaleDateString()}</td>
//               </tr>
//             </table>
//           </div>
          
//           <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
//             <h4 style="margin-top: 0; color: #333;">What Happens Next?</h4>
//             <p style="margin: 5px 0; color: #555;">
//               ${decision === 'Approved' ? 'You will receive detailed information about your scholarship award and next steps within 3-5 business days.' : 
//                 decision === 'Conditionally Approved' ? 'Please check your email for conditions that need to be fulfilled to finalize your award.' :
//                 'We encourage you to explore other scholarship opportunities and consider reapplying in the future.'}
//             </p>
//           </div>
          
//           <hr style="border: none; border-top: 2px solid #f0f0f0; margin: 30px 0;">
          
//           <div style="text-align: center;">
//             <p style="color: #666; font-size: 14px; line-height: 1.6;">
//               If you have any questions, please contact our scholarship office.<br>
//               Thank you for applying with ${process.env.COMPANY_NAME || 'REC APPLY'}.
//             </p>
//           </div>
//         </div>
        
//         <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
//           © ${new Date().getFullYear()} ${process.env.COMPANY_NAME || 'REC APPLY'}. All rights reserved.
//         </div>
//       </div>
//     `;

//     return await this.sendEmail(application.email, subject, html);
//   },

//   // Send assignment notification to reviewer
//   sendAssignmentNotification: async (application, reviewerId) => {
//     const subject = `New Application Assigned for Review - ${application.applicationId}`;
    
//     const html = `
//       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f4f4; padding: 20px;">
//         <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
//           <h1 style="color: white; margin: 0; font-size: 28px;">${process.env.COMPANY_NAME || 'REC APPLY'}</h1>
//           <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Reviewer Notification</p>
//         </div>
        
//         <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
//           <h2 style="color: #333; margin-top: 0; border-bottom: 2px solid #f0f0f0; padding-bottom: 15px;">
//             New Application Assigned for Review
//           </h2>
          
//           <div style="background-color: #e8f4fc; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #667eea;">
//             <h3 style="margin-top: 0; color: #667eea; font-size: 20px;">Application Details</h3>
            
//             <table style="width: 100%; border-collapse: collapse;">
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Application ID:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${application.applicationId}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Applicant:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${application.firstName} ${application.lastName}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Email:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${application.email}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>University:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${application.targetUniversity}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Program:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${application.targetProgram}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Scholarship Type:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${application.scholarshipType}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Assigned Date:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${new Date().toLocaleDateString()}</td>
//               </tr>
//             </table>
//           </div>
          
//           <hr style="border: none; border-top: 2px solid #f0f0f0; margin: 30px 0;">
          
//           <div style="text-align: center;">
//             <p style="color: #666; font-size: 14px; line-height: 1.6;">
//               Please review this application and provide your assessment.<br>
//               This is an automated notification from the scholarship system.
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

//   // Send bulk email to applicants
//   sendBulkEmail: async (applicants, subject, message) => {
//     const results = {
//       successCount: 0,
//       failedCount: 0,
//       failedEmails: []
//     };

//     for (const applicant of applicants) {
//       const html = `
//         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f4f4; padding: 20px;">
//           <div style="background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
//             <h1 style="color: white; margin: 0; font-size: 28px;">${process.env.COMPANY_NAME || 'REC APPLY'}</h1>
//           </div>
          
//           <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
//             <h2 style="color: #333; margin-top: 0;">${subject}</h2>
            
//             <p style="font-size: 16px; line-height: 1.6; color: #555;">Dear ${applicant.firstName} ${applicant.lastName},</p>
            
//             <p style="font-size: 14px; color: #666;"><strong>Application ID:</strong> ${applicant.applicationId}</p>
            
//             <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            
//             <div style="line-height: 1.6; color: #555;">
//               ${message}
//             </div>
            
//             <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            
//             <p style="color: #666; font-size: 12px;">
//               This message was sent to all applicants matching the specified criteria.
//             </p>
//           </div>
          
//           <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
//             © ${new Date().getFullYear()} ${process.env.COMPANY_NAME || 'REC APPLY'}. All rights reserved.
//           </div>
//         </div>
//       `;

//       try {
//         await this.sendEmail(applicant.email, subject, html);
//         results.successCount++;
//       } catch (error) {
//         console.error(`Error sending email to ${applicant.email}:`, error);
//         results.failedCount++;
//         results.failedEmails.push(applicant.email);
//       }
//     }

//     return results;
//   }
// };

// // ======================================
// // HELPER FUNCTIONS
// // ======================================

// // Format application response
// function formatApplicationResponse(application) {
//   const appObj = application.toObject ? application.toObject() : application;
  
//   return {
//     ...appObj,
//     fullName: `${appObj.firstName} ${appObj.lastName}`,
//     statusColor: getStatusColor(appObj.status)
//   };
// }

// // Get color for status
// function getStatusColor(status) {
//   const colors = {
//     'Draft': '#95a5a6',
//     'Submitted': '#3498db',
//     'Under Review': '#f39c12',
//     'Shortlisted': '#9b59b6',
//     'Interview Scheduled': '#1abc9c',
//     'Interview Completed': '#16a085',
//     'Approved': '#27ae60',
//     'Conditionally Approved': '#2ecc71',
//     'Rejected': '#e74c3c',
//     'Waitlisted': '#7f8c8d',
//     'Withdrawn': '#34495e'
//   };
  
//   return colors[status] || '#95a5a6';
// }

// // Upload document to Cloudinary
// const uploadDocumentToCloudinary = async (filePath, folder = 'scholarship-documents', options = {}) => {
//   try {
//     const uploadOptions = {
//       folder: folder,
//       resource_type: 'auto',
//       allowed_formats: ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx'],
//       public_id: `doc-${uuidv4()}`,
//       ...options
//     };

//     const result = await cloudinary.uploader.upload(filePath, uploadOptions);
//     return {
//       url: result.secure_url,
//       public_id: result.public_id,
//       format: result.format,
//       bytes: result.bytes,
//       resource_type: result.resource_type
//     };
//   } catch (error) {
//     console.error('Cloudinary upload error:', error);
//     throw new Error('Failed to upload document to Cloudinary');
//   }
// };

// // Delete document from Cloudinary
// const deleteCloudinaryDocument = async (publicId) => {
//   try {
//     const result = await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
//     return result;
//   } catch (error) {
//     console.error('Error deleting Cloudinary document:', error);
//     return false;
//   }
// };

// // ======================================
// // CRUD OPERATIONS
// // ======================================

// // Create a new scholarship application
// exports.createScholarshipApplication = async (req, res) => {
//   try {
//     const applicationData = {
//       ...req.body
//     };

//     // Generate application ID if not provided
//     if (!applicationData.applicationId) {
//       const year = new Date().getFullYear();
//       const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
//       applicationData.applicationId = `SCH-${year}-${random}`;
//     }

//     // Handle document uploads if provided
//     if (req.files) {
//       // Process uploaded files
//       const documentPromises = [];
      
//       if (req.files.transcripts) {
//         documentPromises.push(
//           uploadDocumentToCloudinary(req.files.transcripts[0].path, 'scholarship/transcripts')
//             .then(result => {
//               applicationData.documents = applicationData.documents || {};
//               applicationData.documents.transcripts = {
//                 url: result.url,
//                 cloudinaryId: result.public_id,
//                 uploadedAt: new Date()
//               };
//             })
//         );
//       }
      
//       if (req.files.passportCopy) {
//         documentPromises.push(
//           uploadDocumentToCloudinary(req.files.passportCopy[0].path, 'scholarship/passports')
//             .then(result => {
//               applicationData.documents = applicationData.documents || {};
//               applicationData.documents.passportCopy = {
//                 url: result.url,
//                 cloudinaryId: result.public_id
//               };
//             })
//         );
//       }
      
//       if (req.files.cvResume) {
//         documentPromises.push(
//           uploadDocumentToCloudinary(req.files.cvResume[0].path, 'scholarship/cv')
//             .then(result => {
//               applicationData.documents = applicationData.documents || {};
//               applicationData.documents.cvResume = {
//                 url: result.url,
//                 cloudinaryId: result.public_id
//               };
//             })
//         );
//       }
      
//       if (req.files.statementOfPurpose) {
//         documentPromises.push(
//           uploadDocumentToCloudinary(req.files.statementOfPurpose[0].path, 'scholarship/sop')
//             .then(result => {
//               applicationData.documents = applicationData.documents || {};
//               applicationData.documents.statementOfPurpose = {
//                 url: result.url,
//                 cloudinaryId: result.public_id
//               };
//             })
//         );
//       }
      
//       // Wait for all uploads to complete
//       await Promise.all(documentPromises);
//     }

//     const application = await ScholarshipApplication.create(applicationData);

//     // Send email notifications (fire and forget)
//     Promise.allSettled([
//       emailService.sendApplicationConfirmation(application),
//       emailService.sendAdminNotification(application)
//     ]).then(results => {
//       console.log('Email notifications sent:', results.map(r => r.status));
//     }).catch(err => {
//       console.error('Error sending notification emails:', err);
//     });

//     res.status(201).json({
//       success: true,
//       message: 'Scholarship application created successfully',
//       data: formatApplicationResponse(application)
//     });
//   } catch (error) {
//     console.error('Create scholarship application error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error creating scholarship application',
//       error: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   }
// };

// // Get all scholarship applications with filters
// exports.getAllApplications = async (req, res) => {
//   try {
//     const {
//       status,
//       scholarshipType,
//       targetCountry,
//       targetUniversity,
//       intakeYear,
//       nationality,
//       search,
//       page = 1,
//       limit = 10,
//       sortBy = 'createdAt',
//       order = 'desc'
//     } = req.query;

//     // Build query
//     let query = { isActive: true };
    
//     if (status) query.status = status;
//     if (scholarshipType) query.scholarshipType = scholarshipType;
//     if (targetCountry) query.targetCountry = targetCountry;
//     if (targetUniversity) query.targetUniversity = targetUniversity;
//     if (intakeYear) query.intakeYear = intakeYear;
//     if (nationality) query.nationality = nationality;
//     if (search) {
//       query.$or = [
//         { firstName: { $regex: search, $options: 'i' } },
//         { lastName: { $regex: search, $options: 'i' } },
//         { email: { $regex: search, $options: 'i' } },
//         { applicationId: { $regex: search, $options: 'i' } }
//       ];
//     }

//     // Build sort
//     const sort = {};
//     sort[sortBy] = order === 'desc' ? -1 : 1;

//     // Execute query with pagination
//     const skip = (page - 1) * limit;
    
//     const [applications, total] = await Promise.all([
//       ScholarshipApplication.find(query)
//         .sort(sort)
//         .skip(skip)
//         .limit(parseInt(limit))
//         .select('-documents -reviewerComments -statusHistory'),
//       ScholarshipApplication.countDocuments(query)
//     ]);

//     res.status(200).json({
//       success: true,
//       count: applications.length,
//       total,
//       totalPages: Math.ceil(total / limit),
//       currentPage: parseInt(page),
//       data: applications.map(formatApplicationResponse)
//     });
//   } catch (error) {
//     console.error('Get all applications error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching scholarship applications'
//     });
//   }
// };

// // Get all scholarship applications by email
// exports.getApplicationsByEmail = async (req, res) => {
//   try {
//     const { email } = req.params;
//     const {
//       status,
//       scholarshipType,
//       targetCountry,
//       targetUniversity,
//       intakeYear,
//       nationality,
//       search,
//       page = 1,
//       limit = 10,
//       sortBy = 'createdAt',
//       order = 'desc'
//     } = req.query;

//     // Build query
//     let query = {
//       isActive: true,
//       email: email.toLowerCase()
//     };

//     if (status) query.status = status;
//     if (scholarshipType) query.scholarshipType = scholarshipType;
//     if (targetCountry) query.targetCountry = targetCountry;
//     if (targetUniversity) query.targetUniversity = targetUniversity;
//     if (intakeYear) query.intakeYear = intakeYear;
//     if (nationality) query.nationality = nationality;

//     if (search) {
//       query.$or = [
//         { firstName: { $regex: search, $options: 'i' } },
//         { lastName: { $regex: search, $options: 'i' } },
//         { applicationId: { $regex: search, $options: 'i' } }
//       ];
//     }

//     // Build sort
//     const sort = {};
//     sort[sortBy] = order === 'desc' ? -1 : 1;

//     // Execute query with pagination
//     const skip = (page - 1) * limit;

//     const [applications, total] = await Promise.all([
//       ScholarshipApplication.find(query)
//         .sort(sort)
//         .skip(skip)
//         .limit(parseInt(limit))
//         .select('-documents -reviewerComments -statusHistory'),
//       ScholarshipApplication.countDocuments(query)
//     ]);

//     res.status(200).json({
//       success: true,
//       count: applications.length,
//       total,
//       totalPages: Math.ceil(total / limit),
//       currentPage: parseInt(page),
//       data: applications.map(formatApplicationResponse)
//     });
//   } catch (error) {
//     console.error('Get applications by email error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching scholarship applications by email'
//     });
//   }
// };

// // Get single application by ID
// exports.getApplicationById = async (req, res) => {
//   try {
//     const application = await ScholarshipApplication.findById(req.params.id);

//     if (!application) {
//       return res.status(404).json({
//         success: false,
//         message: 'Scholarship application not found'
//       });
//     }

//     res.status(200).json({
//       success: true,
//       data: formatApplicationResponse(application)
//     });
//   } catch (error) {
//     console.error('Get application by ID error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching scholarship application'
//     });
//   }
// };

// // Update application
// exports.updateApplication = async (req, res) => {
//   try {
//     let application = await ScholarshipApplication.findById(req.params.id);

//     if (!application) {
//       return res.status(404).json({
//         success: false,
//         message: 'Scholarship application not found'
//       });
//     }

//     // Handle status changes
//     const oldStatus = application.status;
//     const newStatus = req.body.status;

//     // Update application
//     application = await ScholarshipApplication.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       {
//         new: true,
//         runValidators: true
//       }
//     );

//     // Send status update email if status changed
//     if (newStatus && newStatus !== oldStatus) {
//       emailService.sendStatusUpdateNotification(application, oldStatus, newStatus)
//         .catch(err => console.error('Error sending status update email:', err));
//     }

//     res.status(200).json({
//       success: true,
//       message: 'Application updated successfully',
//       data: formatApplicationResponse(application)
//     });
//   } catch (error) {
//     console.error('Update application error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error updating application',
//       error: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   }
// };

// // Delete application (soft delete)
// exports.deleteApplication = async (req, res) => {
//   try {
//     const application = await ScholarshipApplication.findById(req.params.id);

//     if (!application) {
//       return res.status(404).json({
//         success: false,
//         message: 'Scholarship application not found'
//       });
//     }

//     // Soft delete
//     application.isActive = false;
//     await application.save();

//     res.status(200).json({
//       success: true,
//       message: 'Application deleted successfully'
//     });
//   } catch (error) {
//     console.error('Delete application error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error deleting application'
//     });
//   }
// };

// // ======================================
// // DOCUMENT MANAGEMENT OPERATIONS
// // ======================================

// // Upload document to application
// exports.uploadDocument = async (req, res) => {
//   try {
//     const { documentType } = req.params;
//     const application = await ScholarshipApplication.findById(req.params.id);

//     if (!application) {
//       return res.status(404).json({
//         success: false,
//         message: 'Scholarship application not found'
//       });
//     }

//     if (!req.file) {
//       return res.status(400).json({
//         success: false,
//         message: 'No file uploaded'
//       });
//     }

//     // Define allowed document types
//     const allowedTypes = [
//       'transcripts',
//       'passportCopy',
//       'cvResume',
//       'statementOfPurpose',
//       'recommendationLetter',
//       'languageCertificate',
//       'researchProposal',
//       'portfolio',
//       'other'
//     ];

//     if (!allowedTypes.includes(documentType)) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid document type'
//       });
//     }

//     // Upload to Cloudinary
//     const folder = `scholarship/${documentType}`;
//     const result = await uploadDocumentToCloudinary(req.file.path, folder);

//     // Update application with document URL
//     application.documents = application.documents || {};
    
//     if (documentType === 'recommendationLetter') {
//       application.documents.recommendationLetters = application.documents.recommendationLetters || [];
//       application.documents.recommendationLetters.push({
//         url: result.url,
//         cloudinaryId: result.public_id,
//         uploadedAt: new Date()
//       });
//     } else if (documentType === 'other') {
//       application.documents.otherDocuments = application.documents.otherDocuments || [];
//       application.documents.otherDocuments.push({
//         name: req.file.originalname,
//         url: result.url,
//         cloudinaryId: result.public_id
//       });
//     } else {
//       application.documents[documentType] = {
//         url: result.url,
//         cloudinaryId: result.public_id,
//         uploadedAt: new Date()
//       };
//     }

//     await application.save();

//     // Clean up temporary file
//     fs.unlinkSync(req.file.path);

//     res.status(200).json({
//       success: true,
//       message: 'Document uploaded successfully',
//       data: {
//         documentType,
//         url: result.url,
//         publicId: result.public_id,
//         size: result.bytes
//       }
//     });
//   } catch (error) {
//     console.error('Upload document error:', error);
//     // Clean up temporary file if exists
//     if (req.file && req.file.path) {
//       fs.unlinkSync(req.file.path);
//     }
//     res.status(500).json({
//       success: false,
//       message: 'Error uploading document'
//     });
//   }
// };

// // Delete document from application
// exports.deleteDocument = async (req, res) => {
//   try {
//     const { id, documentType, documentId } = req.params;
//     const application = await ScholarshipApplication.findById(id);

//     if (!application) {
//       return res.status(404).json({
//         success: false,
//         message: 'Scholarship application not found'
//       });
//     }

//     let publicId = null;

//     if (documentType === 'recommendationLetter') {
//       // Find and remove recommendation letter
//       const letterIndex = application.documents.recommendationLetters?.findIndex(
//         letter => letter._id.toString() === documentId
//       );
      
//       if (letterIndex > -1) {
//         publicId = application.documents.recommendationLetters[letterIndex].cloudinaryId;
//         application.documents.recommendationLetters.splice(letterIndex, 1);
//       }
//     } else if (documentType === 'other') {
//       // Find and remove other document
//       const docIndex = application.documents.otherDocuments?.findIndex(
//         doc => doc._id.toString() === documentId
//       );
      
//       if (docIndex > -1) {
//         publicId = application.documents.otherDocuments[docIndex].cloudinaryId;
//         application.documents.otherDocuments.splice(docIndex, 1);
//       }
//     } else {
//       // Remove single document
//       publicId = application.documents?.[documentType]?.cloudinaryId;
//       application.documents[documentType] = null;
//     }

//     // Delete from Cloudinary
//     if (publicId) {
//       await deleteCloudinaryDocument(publicId);
//     }

//     await application.save();

//     res.status(200).json({
//       success: true,
//       message: 'Document deleted successfully'
//     });
//   } catch (error) {
//     console.error('Delete document error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error deleting document'
//     });
//   }
// };

// // ======================================
// // STATUS & REVIEW OPERATIONS
// // ======================================

// // Update application status
// exports.updateStatus = async (req, res) => {
//   try {
//     const { status, notes } = req.body;
//     const application = await ScholarshipApplication.findById(req.params.id);

//     if (!application) {
//       return res.status(404).json({
//         success: false,
//         message: 'Scholarship application not found'
//       });
//     }

//     const oldStatus = application.status;
//     application.status = status;
    
//     // Add to status history
//     application.statusHistory = application.statusHistory || [];
//     application.statusHistory.push({
//       status: status,
//       changedBy: 'system',
//       notes: notes || 'Status updated',
//       changedAt: new Date()
//     });
    
//     await application.save();

//     // Send notification email
//     emailService.sendStatusUpdateNotification(application, oldStatus, status)
//       .catch(err => console.error('Error sending status update email:', err));

//     res.status(200).json({
//       success: true,
//       message: 'Application status updated successfully',
//       data: {
//         oldStatus,
//         newStatus: status,
//         applicationId: application.applicationId
//       }
//     });
//   } catch (error) {
//     console.error('Update status error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error updating application status'
//     });
//   }
// };

// // Assign application to reviewer
// exports.assignToReviewer = async (req, res) => {
//   try {
//     const { reviewerId } = req.body;
//     const application = await ScholarshipApplication.findById(req.params.id);

//     if (!application) {
//       return res.status(404).json({
//         success: false,
//         message: 'Scholarship application not found'
//       });
//     }

//     application.assignedTo = reviewerId;
//     await application.save();

//     // Send assignment notification
//     emailService.sendAssignmentNotification(application, reviewerId)
//       .catch(err => console.error('Error sending assignment notification:', err));

//     res.status(200).json({
//       success: true,
//       message: 'Application assigned to reviewer successfully',
//       data: {
//         applicationId: application.applicationId,
//         assignedTo: reviewerId
//       }
//     });
//   } catch (error) {
//     console.error('Assign to reviewer error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error assigning application to reviewer'
//     });
//   }
// };

// // Add review comments
// exports.addReviewComment = async (req, res) => {
//   try {
//     const { section, comment, score } = req.body;
//     const application = await ScholarshipApplication.findById(req.params.id);

//     if (!application) {
//       return res.status(404).json({
//         success: false,
//         message: 'Scholarship application not found'
//       });
//     }

//     application.reviewerComments = application.reviewerComments || [];
//     application.reviewerComments.push({
//       reviewer: 'system',
//       section,
//       comment,
//       score: score || 0,
//       createdAt: new Date()
//     });
    
//     await application.save();

//     res.status(200).json({
//       success: true,
//       message: 'Review comment added successfully'
//     });
//   } catch (error) {
//     console.error('Add review comment error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error adding review comment'
//     });
//   }
// };

// // Update review scores
// exports.updateReviewScores = async (req, res) => {
//   try {
//     const { academic, financial, essay, overall } = req.body;
//     const application = await ScholarshipApplication.findById(req.params.id);

//     if (!application) {
//       return res.status(404).json({
//         success: false,
//         message: 'Scholarship application not found'
//       });
//     }

//     application.reviewScore = {
//       academic: academic || 0,
//       financial: financial || 0,
//       essay: essay || 0,
//       overall: overall || 0
//     };
    
//     await application.save();

//     res.status(200).json({
//       success: true,
//       message: 'Review scores updated successfully',
//       data: application.reviewScore
//     });
//   } catch (error) {
//     console.error('Update review scores error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error updating review scores'
//     });
//   }
// };

// // Make final decision
// exports.makeDecision = async (req, res) => {
//   try {
//     const { decision, notes, fundingAmount, currency, conditions } = req.body;
//     const application = await ScholarshipApplication.findById(req.params.id);

//     if (!application) {
//       return res.status(404).json({
//         success: false,
//         message: 'Scholarship application not found'
//       });
//     }

//     // Update status based on decision
//     const newStatus = decision === 'Approved' ? 'Approved' : 
//                      decision === 'Conditionally Approved' ? 'Conditionally Approved' : 'Rejected';
    
//     const oldStatus = application.status;
//     application.status = newStatus;
//     application.decision = {
//       madeBy: 'system',
//       madeAt: new Date(),
//       notes,
//       fundingAwarded: fundingAmount ? {
//         amount: fundingAmount,
//         currency: currency || 'USD',
//         conditions: conditions || []
//       } : null
//     };
    
//     application.statusHistory = application.statusHistory || [];
//     application.statusHistory.push({
//       status: newStatus,
//       changedBy: 'system',
//       notes: `Decision: ${decision} - ${notes || ''}`,
//       changedAt: new Date()
//     });
    
//     await application.save();

//     // Send decision notification
//     emailService.sendDecisionNotification(application, decision)
//       .catch(err => console.error('Error sending decision notification:', err));

//     res.status(200).json({
//       success: true,
//       message: `Application ${decision.toLowerCase()} successfully`,
//       data: {
//         decision,
//         status: newStatus,
//         applicationId: application.applicationId
//       }
//     });
//   } catch (error) {
//     console.error('Make decision error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error making decision'
//     });
//   }
// };

// // ======================================
// // STATISTICS OPERATIONS
// // ======================================

// // Get application statistics
// exports.getApplicationStatistics = async (req, res) => {
//   try {
//     const application = await ScholarshipApplication.findById(req.params.id)
//       .select('status statusHistory reviewScore documents essay');

//     if (!application) {
//       return res.status(404).json({
//         success: false,
//         message: 'Scholarship application not found'
//       });
//     }

//     const stats = {
//       statusTimeline: application.statusHistory || [],
//       reviewScores: application.reviewScore || {},
//       documentStatus: {
//         transcripts: !!application.documents?.transcripts?.url,
//         passport: !!application.documents?.passportCopy?.url,
//         cv: !!application.documents?.cvResume?.url,
//         essay: application.essay?.status || 'Pending',
//         recommendationLetters: application.documents?.recommendationLetters?.length || 0
//       }
//     };

//     res.status(200).json({
//       success: true,
//       data: stats
//     });
//   } catch (error) {
//     console.error('Get application statistics error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching application statistics'
//     });
//   }
// };

// // Get system-wide statistics
// exports.getSystemStatistics = async (req, res) => {
//   try {
//     const [
//       totalApplications,
//       applicationsByStatus,
//       applicationsByCountry
//     ] = await Promise.all([
//       ScholarshipApplication.countDocuments({ isActive: true }),
//       ScholarshipApplication.aggregate([
//         { $match: { isActive: true } },
//         { $group: { _id: '$status', count: { $sum: 1 } } }
//       ]),
//       ScholarshipApplication.aggregate([
//         { $match: { isActive: true } },
//         { $group: { _id: '$targetCountry', count: { $sum: 1 } } },
//         { $sort: { count: -1 } },
//         { $limit: 10 }
//       ])
//     ]);

//     const stats = {
//       overview: {
//         totalApplications,
//         activeApplications: applicationsByStatus.reduce((sum, item) => 
//           ['Submitted', 'Under Review', 'Shortlisted', 'Interview Scheduled'].includes(item._id) 
//             ? sum + item.count 
//             : sum, 0
//         ),
//         approvedApplications: applicationsByStatus.find(item => item._id === 'Approved')?.count || 0,
//         rejectedApplications: applicationsByStatus.find(item => item._id === 'Rejected')?.count || 0
//       },
//       distribution: {
//         byStatus: applicationsByStatus.reduce((acc, curr) => {
//           acc[curr._id] = curr.count;
//           return acc;
//         }, {}),
//         byCountry: applicationsByCountry.reduce((acc, curr) => {
//           acc[curr._id] = curr.count;
//           return acc;
//         }, {})
//       }
//     };

//     res.status(200).json({
//       success: true,
//       data: stats
//     });
//   } catch (error) {
//     console.error('Get system statistics error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching system statistics'
//     });
//   }
// };

// // Send bulk email to applicants
// exports.sendBulkEmailToApplicants = async (req, res) => {
//   try {
//     const { subject, message, statusFilter, scholarshipTypeFilter } = req.body;
    
//     // Build query based on filters
//     let query = { isActive: true };
//     if (statusFilter) query.status = statusFilter;
//     if (scholarshipTypeFilter) query.scholarshipType = scholarshipTypeFilter;
    
//     const applications = await ScholarshipApplication.find(query)
//       .select('firstName lastName email applicationId');
    
//     if (applications.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: 'No applicants found matching the criteria'
//       });
//     }
    
//     const results = await emailService.sendBulkEmail(applications, subject, message);
    
//     res.status(200).json({
//       success: true,
//       message: `Email sent to ${results.successCount} applicants`,
//       data: results
//     });
//   } catch (error) {
//     console.error('Bulk email error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error sending bulk email'
//     });
//   }
// };


















// const ScholarshipApplication = require('../models/ScholarshipApplication');
// const nodemailer = require('nodemailer');
// const cloudinary = require('../cloudinary/cloudinary');
// const { v4: uuidv4 } = require('uuid');
// const fs = require('fs');
// const path = require('path');

// /* =====================================================
//    EMAIL TRANSPORTER
// ===================================================== */
// const createTransporter = () => {
//   return nodemailer.createTransport({
//     host: process.env.SMTP_HOST,
//     port: 465,
//     secure: true,
//     auth: {
//       user: process.env.SMTP_USER,
//       pass: process.env.SMTP_PASS,
//     }
//   });
// };

// /* =====================================================
//    EMAIL SERVICE
// ===================================================== */
// const emailService = {
//   sendEmail: async (to, subject, html, isAdminNotification = false) => {
//     try {
//       const transporter = createTransporter();
      
//       const info = await transporter.sendMail({
//         from: `"${process.env.COMPANY_NAME || 'REC APPLY'} Scholarships" <${process.env.EMAIL_FROM}>`,
//         to,
//         subject,
//         html
//       });
      
//       console.log('Email sent successfully to:', to, 'Message ID:', info.messageId);
//       return { success: true, messageId: info.messageId };
//     } catch (error) {
//       console.error('Email sending error:', error);
//       return { success: false, error: error.message };
//     }
//   },

//   // Send application confirmation to applicant
//   sendApplicationConfirmation: async (application) => {
//     const subject = `Scholarship Application Received - ${application.applicationId}`;
    
//     const html = `
//       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f4f4; padding: 20px;">
//         <div style="background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
//           <h1 style="color: white; margin: 0; font-size: 28px;">${process.env.COMPANY_NAME || 'REC APPLY'}</h1>
//           <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Scholarship Application</p>
//         </div>
        
//         <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
//           <h2 style="color: #333; margin-top: 0; border-bottom: 2px solid #f0f0f0; padding-bottom: 15px;">
//             Thank You for Your Scholarship Application! 🎓
//           </h2>
          
//           <p style="font-size: 16px; line-height: 1.6; color: #555;">Dear ${application.firstName} ${application.lastName},</p>
          
//           <p style="font-size: 16px; line-height: 1.6; color: #555;">Your scholarship application has been received and is now being processed. Here are your application details:</p>
          
//           <div style="background-color: #e8f4fc; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #2a5298;">
//             <h3 style="margin-top: 0; color: #2a5298; font-size: 20px;">Application ID: ${application.applicationId}</h3>
            
//             <table style="width: 100%; border-collapse: collapse;">
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Full Name:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${application.firstName} ${application.lastName}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Email:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${application.email}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Target University:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${application.targetUniversity}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Target Program:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${application.targetProgram}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Scholarship Type:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${application.scholarshipType}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Submission Date:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${new Date(application.createdAt).toLocaleDateString()}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Current Status:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">
//                   <span style="background-color: ${getStatusColor(application.status)}; color: white; padding: 3px 10px; border-radius: 12px; font-size: 12px;">
//                     ${application.status || 'Submitted'}
//                   </span>
//                 </td>
//               </tr>
//             </table>
//           </div>
          
//           <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
//             <h4 style="margin-top: 0; color: #333;">What Happens Next?</h4>
//             <ol style="margin: 5px 0 0 0; color: #555;">
//               <li style="margin: 5px 0;">Your application will be reviewed within 2-3 weeks</li>
//               <li style="margin: 5px 0;">You may be contacted for additional information or an interview</li>
//               <li style="margin: 5px 0;">You'll receive email updates as your application progresses</li>
//               <li style="margin: 5px 0;">Final decisions will be communicated via email</li>
//             </ol>
//           </div>
          
//           <hr style="border: none; border-top: 2px solid #f0f0f0; margin: 30px 0;">
          
//           <div style="text-align: center;">
//             <p style="color: #666; font-size: 14px; line-height: 1.6;">
//               We wish you the best of luck with your scholarship application!<br>
//               If you have any questions, please contact our scholarship office.
//             </p>
//           </div>
//         </div>
        
//         <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
//           © ${new Date().getFullYear()} ${process.env.COMPANY_NAME || 'REC APPLY'}. All rights reserved.<br>
//           This is an automated message, please do not reply to this email.
//         </div>
//       </div>
//     `;

//     return await this.sendEmail(application.email, subject, html);
//   },

//   // Send admin notification for new application
//   sendAdminNotification: async (application) => {
//     const subject = `New Scholarship Application Received - ${application.applicationId}`;
    
//     const html = `
//       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f4f4; padding: 20px;">
//         <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
//           <h1 style="color: white; margin: 0; font-size: 28px;">${process.env.COMPANY_NAME || 'REC APPLY'}</h1>
//           <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Admin Notification - New Application</p>
//         </div>
        
//         <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
//           <h2 style="color: #333; margin-top: 0; border-bottom: 2px solid #f0f0f0; padding-bottom: 15px;">
//             New Scholarship Application Alert! 📋
//           </h2>
          
//           <div style="background-color: #fff3e0; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #f5576c;">
//             <h3 style="margin-top: 0; color: #f5576c; font-size: 20px;">Application ID: ${application.applicationId}</h3>
            
//             <table style="width: 100%; border-collapse: collapse;">
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Applicant Name:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${application.firstName} ${application.lastName}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Email:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${application.email}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Phone:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${application.phone || 'Not provided'}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Nationality:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${application.nationality || 'Not provided'}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Target University:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${application.targetUniversity}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Target Program:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${application.targetProgram}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Scholarship Type:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${application.scholarshipType}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Intake Year:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${application.intakeYear || 'Not specified'}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Application Date:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${new Date(application.createdAt).toLocaleString()}</td>
//               </tr>
//             </table>
            
//             ${application.academicBackground ? `
//               <div style="margin-top: 15px;">
//                 <strong style="color: #666;">Academic Background:</strong>
//                 <p style="color: #555; margin: 5px 0 0 0;">${application.academicBackground}</p>
//               </div>
//             ` : ''}
//           </div>
          
//           <hr style="border: none; border-top: 2px solid #f0f0f0; margin: 30px 0;">
          
//           <div style="text-align: center;">
//             <p style="color: #666; font-size: 14px; line-height: 1.6;">
//               Please review this application and assign it to a reviewer.<br>
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
//   },

//   // Send status update notification to applicant
//   sendStatusUpdateNotification: async (application, oldStatus, newStatus) => {
//     const subject = `Scholarship Application Status Update - ${application.applicationId}`;
    
//     const statusColors = {
//       'Submitted': '#3498db',
//       'Under Review': '#f39c12',
//       'Shortlisted': '#9b59b6',
//       'Interview Scheduled': '#1abc9c',
//       'Interview Completed': '#16a085',
//       'Approved': '#27ae60',
//       'Conditionally Approved': '#2ecc71',
//       'Rejected': '#e74c3c',
//       'Waitlisted': '#7f8c8d',
//       'Withdrawn': '#34495e'
//     };

//     const oldColor = statusColors[oldStatus] || '#95a5a6';
//     const newColor = statusColors[newStatus] || '#95a5a6';
    
//     const html = `
//       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f4f4; padding: 20px;">
//         <div style="background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
//           <h1 style="color: white; margin: 0; font-size: 28px;">${process.env.COMPANY_NAME || 'REC APPLY'}</h1>
//           <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Application Status Update</p>
//         </div>
        
//         <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
//           <h2 style="color: #333; margin-top: 0; border-bottom: 2px solid #f0f0f0; padding-bottom: 15px;">
//             Your Application Status Has Been Updated
//           </h2>
          
//           <p style="font-size: 16px; line-height: 1.6; color: #555;">Dear ${application.firstName} ${application.lastName},</p>
          
//           <p style="font-size: 16px; line-height: 1.6; color: #555;">The status of your scholarship application has been updated:</p>
          
//           <div style="background-color: #f9f9f9; padding: 30px; text-align: center; border-radius: 5px; margin: 20px 0;">
//             <div style="display: inline-block; background-color: ${oldColor}20; padding: 15px 30px; border-radius: 5px; margin-right: 10px;">
//               <span style="color: ${oldColor}; font-weight: bold;">${oldStatus || 'Submitted'}</span>
//             </div>
//             <span style="font-size: 24px; color: #999; margin: 0 15px;">→</span>
//             <div style="display: inline-block; background-color: ${newColor}20; padding: 15px 30px; border-radius: 5px;">
//               <span style="color: ${newColor}; font-weight: bold;">${newStatus}</span>
//             </div>
//           </div>
          
//           <div style="background-color: #e8f4fc; padding: 20px; border-radius: 5px; margin: 20px 0;">
//             <h4 style="margin-top: 0; color: #333;">Application Details</h4>
//             <p style="margin: 5px 0; color: #555;"><strong>Application ID:</strong> ${application.applicationId}</p>
//             <p style="margin: 5px 0; color: #555;"><strong>University:</strong> ${application.targetUniversity}</p>
//             <p style="margin: 5px 0; color: #555;"><strong>Program:</strong> ${application.targetProgram}</p>
//             <p style="margin: 5px 0; color: #555;"><strong>Current Status:</strong> 
//               <span style="background-color: ${newColor}; color: white; padding: 3px 10px; border-radius: 12px; font-size: 12px;">
//                 ${newStatus}
//               </span>
//             </p>
//             <p style="margin: 5px 0; color: #555;"><strong>Updated on:</strong> ${new Date().toLocaleDateString()}</p>
//           </div>
          
//           <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
//             <h4 style="margin-top: 0; color: #333;">Next Steps</h4>
//             <p style="margin: 5px 0; color: #555;">
//               ${newStatus === 'Approved' ? 'Congratulations! Your application has been approved. You will receive further instructions shortly.' : 
//                 newStatus === 'Rejected' ? 'We regret to inform you that your application was not successful. You may reapply in the future.' :
//                 newStatus === 'Interview Scheduled' ? 'Please check your email for interview details and preparation materials.' :
//                 'Continue to monitor your email for further updates on your application.'}
//             </p>
//           </div>
          
//           <hr style="border: none; border-top: 2px solid #f0f0f0; margin: 30px 0;">
          
//           <div style="text-align: center;">
//             <p style="color: #666; font-size: 14px; line-height: 1.6;">
//               If you have any questions, please contact our scholarship office.<br>
//               Thank you for applying with ${process.env.COMPANY_NAME || 'REC APPLY'}.
//             </p>
//           </div>
//         </div>
        
//         <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
//           © ${new Date().getFullYear()} ${process.env.COMPANY_NAME || 'REC APPLY'}. All rights reserved.
//         </div>
//       </div>
//     `;

//     return await this.sendEmail(application.email, subject, html);
//   },

//   // Send decision notification
//   sendDecisionNotification: async (application, decision) => {
//     const subject = `Scholarship Application Decision - ${application.applicationId}`;
    
//     const isApproved = decision === 'Approved' || decision === 'Conditionally Approved';
//     const bgColor = isApproved ? '#d5f4e6' : '#ffcccc';
//     const textColor = isApproved ? '#27ae60' : '#e74c3c';
//     const icon = isApproved ? '🎉' : '📋';
    
//     const html = `
//       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f4f4; padding: 20px;">
//         <div style="background: linear-gradient(135deg, ${isApproved ? '#27ae60' : '#e74c3c'} 0%, ${isApproved ? '#2ecc71' : '#c0392b'} 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
//           <h1 style="color: white; margin: 0; font-size: 28px;">${process.env.COMPANY_NAME || 'REC APPLY'}</h1>
//           <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Scholarship Decision</p>
//         </div>
        
//         <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
//           <h2 style="color: #333; margin-top: 0; border-bottom: 2px solid #f0f0f0; padding-bottom: 15px;">
//             ${icon} Scholarship Application ${isApproved ? 'Approved' : 'Outcome'}
//           </h2>
          
//           <p style="font-size: 16px; line-height: 1.6; color: #555;">Dear ${application.firstName} ${application.lastName},</p>
          
//           <div style="background-color: ${bgColor}; padding: 30px; text-align: center; border-radius: 8px; margin: 20px 0;">
//             <h3 style="color: ${textColor}; margin-top: 0; font-size: 24px;">
//               ${decision === 'Approved' ? 'Congratulations! 🎉' : 
//                 decision === 'Conditionally Approved' ? 'Conditional Approval' : 
//                 'Application Decision'}
//             </h3>
//             <p style="font-size: 20px; font-weight: bold; color: ${textColor};">${decision}</p>
//           </div>
          
//           <div style="background-color: #e8f4fc; padding: 20px; border-radius: 5px; margin: 20px 0;">
//             <h4 style="margin-top: 0; color: #333;">Application Summary</h4>
//             <table style="width: 100%; border-collapse: collapse;">
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Application ID:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${application.applicationId}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>University:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${application.targetUniversity}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Program:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${application.targetProgram}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Decision Date:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${new Date().toLocaleDateString()}</td>
//               </tr>
//             </table>
//           </div>
          
//           <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
//             <h4 style="margin-top: 0; color: #333;">What Happens Next?</h4>
//             <p style="margin: 5px 0; color: #555;">
//               ${decision === 'Approved' ? 'You will receive detailed information about your scholarship award and next steps within 3-5 business days.' : 
//                 decision === 'Conditionally Approved' ? 'Please check your email for conditions that need to be fulfilled to finalize your award.' :
//                 'We encourage you to explore other scholarship opportunities and consider reapplying in the future.'}
//             </p>
//           </div>
          
//           <hr style="border: none; border-top: 2px solid #f0f0f0; margin: 30px 0;">
          
//           <div style="text-align: center;">
//             <p style="color: #666; font-size: 14px; line-height: 1.6;">
//               If you have any questions, please contact our scholarship office.<br>
//               Thank you for applying with ${process.env.COMPANY_NAME || 'REC APPLY'}.
//             </p>
//           </div>
//         </div>
        
//         <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
//           © ${new Date().getFullYear()} ${process.env.COMPANY_NAME || 'REC APPLY'}. All rights reserved.
//         </div>
//       </div>
//     `;

//     return await this.sendEmail(application.email, subject, html);
//   },

//   // Send assignment notification to reviewer
//   sendAssignmentNotification: async (application, reviewerId) => {
//     const subject = `New Application Assigned for Review - ${application.applicationId}`;
    
//     const html = `
//       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f4f4; padding: 20px;">
//         <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
//           <h1 style="color: white; margin: 0; font-size: 28px;">${process.env.COMPANY_NAME || 'REC APPLY'}</h1>
//           <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Reviewer Notification</p>
//         </div>
        
//         <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
//           <h2 style="color: #333; margin-top: 0; border-bottom: 2px solid #f0f0f0; padding-bottom: 15px;">
//             New Application Assigned for Review
//           </h2>
          
//           <div style="background-color: #e8f4fc; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #667eea;">
//             <h3 style="margin-top: 0; color: #667eea; font-size: 20px;">Application Details</h3>
            
//             <table style="width: 100%; border-collapse: collapse;">
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Application ID:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${application.applicationId}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Applicant:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${application.firstName} ${application.lastName}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Email:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${application.email}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>University:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${application.targetUniversity}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Program:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${application.targetProgram}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Scholarship Type:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${application.scholarshipType}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px 0; color: #666;"><strong>Assigned Date:</strong></td>
//                 <td style="padding: 8px 0; color: #333;">${new Date().toLocaleDateString()}</td>
//               </tr>
//             </table>
//           </div>
          
//           <hr style="border: none; border-top: 2px solid #f0f0f0; margin: 30px 0;">
          
//           <div style="text-align: center;">
//             <p style="color: #666; font-size: 14px; line-height: 1.6;">
//               Please review this application and provide your assessment.<br>
//               This is an automated notification from the scholarship system.
//             </p>
//           </div>
//         </div>
        
//         <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
//           © ${new Date().getFullYear()} ${process.env.COMPANY_NAME || 'REC APPLY'}. All rights reserved.
//         </div>
//       </div>
//     `;

//     return await this.sendEmail(process.env.ADMIN_EMAIL, subject, html);
//   },

//   // Send bulk email to applicants
//   sendBulkEmail: async (applicants, subject, message) => {
//     const results = {
//       successCount: 0,
//       failedCount: 0,
//       failedEmails: []
//     };

//     for (const applicant of applicants) {
//       const html = `
//         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f4f4; padding: 20px;">
//           <div style="background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
//             <h1 style="color: white; margin: 0; font-size: 28px;">${process.env.COMPANY_NAME || 'REC APPLY'}</h1>
//           </div>
          
//           <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
//             <h2 style="color: #333; margin-top: 0;">${subject}</h2>
            
//             <p style="font-size: 16px; line-height: 1.6; color: #555;">Dear ${applicant.firstName} ${applicant.lastName},</p>
            
//             <p style="font-size: 14px; color: #666;"><strong>Application ID:</strong> ${applicant.applicationId}</p>
            
//             <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            
//             <div style="line-height: 1.6; color: #555;">
//               ${message}
//             </div>
            
//             <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            
//             <p style="color: #666; font-size: 12px;">
//               This message was sent to all applicants matching the specified criteria.
//             </p>
//           </div>
          
//           <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
//             © ${new Date().getFullYear()} ${process.env.COMPANY_NAME || 'REC APPLY'}. All rights reserved.
//           </div>
//         </div>
//       `;

//       try {
//         await this.sendEmail(applicant.email, subject, html);
//         results.successCount++;
//       } catch (error) {
//         console.error(`Error sending email to ${applicant.email}:`, error);
//         results.failedCount++;
//         results.failedEmails.push(applicant.email);
//       }
//     }

//     return results;
//   }
// };

// // ======================================
// // HELPER FUNCTIONS
// // ======================================

// // Format application response
// function formatApplicationResponse(application) {
//   const appObj = application.toObject ? application.toObject() : application;
  
//   return {
//     ...appObj,
//     fullName: `${appObj.firstName} ${appObj.lastName}`,
//     statusColor: getStatusColor(appObj.status)
//   };
// }

// // Get color for status
// function getStatusColor(status) {
//   const colors = {
//     'Draft': '#95a5a6',
//     'Submitted': '#3498db',
//     'Under Review': '#f39c12',
//     'Shortlisted': '#9b59b6',
//     'Interview Scheduled': '#1abc9c',
//     'Interview Completed': '#16a085',
//     'Approved': '#27ae60',
//     'Conditionally Approved': '#2ecc71',
//     'Rejected': '#e74c3c',
//     'Waitlisted': '#7f8c8d',
//     'Withdrawn': '#34495e'
//   };
  
//   return colors[status] || '#95a5a6';
// }

// // Upload document to Cloudinary
// const uploadDocumentToCloudinary = async (filePath, folder = 'scholarship-documents', options = {}) => {
//   try {
//     const uploadOptions = {
//       folder: folder,
//       resource_type: 'auto',
//       allowed_formats: ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx'],
//       public_id: `doc-${uuidv4()}`,
//       ...options
//     };

//     const result = await cloudinary.uploader.upload(filePath, uploadOptions);
//     return {
//       url: result.secure_url,
//       public_id: result.public_id,
//       format: result.format,
//       bytes: result.bytes,
//       resource_type: result.resource_type
//     };
//   } catch (error) {
//     console.error('Cloudinary upload error:', error);
//     throw new Error('Failed to upload document to Cloudinary');
//   }
// };

// // Delete document from Cloudinary
// const deleteCloudinaryDocument = async (publicId) => {
//   try {
//     const result = await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
//     return result;
//   } catch (error) {
//     console.error('Error deleting Cloudinary document:', error);
//     return false;
//   }
// };

// // ======================================
// // CRUD OPERATIONS
// // ======================================

// // Create a new scholarship application
// exports.createScholarshipApplication = async (req, res) => {
//   try {
//     const applicationData = {
//       ...req.body
//     };

//     // Generate application ID if not provided
//     if (!applicationData.applicationId) {
//       const year = new Date().getFullYear();
//       const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
//       applicationData.applicationId = `SCH-${year}-${random}`;
//     }

//     // Handle document uploads if provided
//     if (req.files) {
//       // Process uploaded files
//       const documentPromises = [];
      
//       if (req.files.transcripts) {
//         documentPromises.push(
//           uploadDocumentToCloudinary(req.files.transcripts[0].path, 'scholarship/transcripts')
//             .then(result => {
//               applicationData.documents = applicationData.documents || {};
//               applicationData.documents.transcripts = {
//                 url: result.url,
//                 cloudinaryId: result.public_id,
//                 uploadedAt: new Date()
//               };
//             })
//         );
//       }
      
//       if (req.files.passportCopy) {
//         documentPromises.push(
//           uploadDocumentToCloudinary(req.files.passportCopy[0].path, 'scholarship/passports')
//             .then(result => {
//               applicationData.documents = applicationData.documents || {};
//               applicationData.documents.passportCopy = {
//                 url: result.url,
//                 cloudinaryId: result.public_id
//               };
//             })
//         );
//       }
      
//       if (req.files.cvResume) {
//         documentPromises.push(
//           uploadDocumentToCloudinary(req.files.cvResume[0].path, 'scholarship/cv')
//             .then(result => {
//               applicationData.documents = applicationData.documents || {};
//               applicationData.documents.cvResume = {
//                 url: result.url,
//                 cloudinaryId: result.public_id
//               };
//             })
//         );
//       }
      
//       if (req.files.statementOfPurpose) {
//         documentPromises.push(
//           uploadDocumentToCloudinary(req.files.statementOfPurpose[0].path, 'scholarship/sop')
//             .then(result => {
//               applicationData.documents = applicationData.documents || {};
//               applicationData.documents.statementOfPurpose = {
//                 url: result.url,
//                 cloudinaryId: result.public_id
//               };
//             })
//         );
//       }
      
//       // Wait for all uploads to complete
//       await Promise.all(documentPromises);
//     }

//     const application = await ScholarshipApplication.create(applicationData);

//     // Send email notifications (fire and forget)
//     Promise.allSettled([
//       emailService.sendApplicationConfirmation(application),
//       emailService.sendAdminNotification(application)
//     ]).then(results => {
//       console.log('Email notifications sent:', results.map(r => r.status));
//     }).catch(err => {
//       console.error('Error sending notification emails:', err);
//     });

//     res.status(201).json({
//       success: true,
//       message: 'Scholarship application created successfully',
//       data: formatApplicationResponse(application)
//     });
//   } catch (error) {
//     console.error('Create scholarship application error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error creating scholarship application',
//       error: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   }
// };

// // Get all scholarship applications with filters
// exports.getAllApplications = async (req, res) => {
//   try {
//     const {
//       status,
//       scholarshipType,
//       targetCountry,
//       targetUniversity,
//       intakeYear,
//       nationality,
//       search,
//       page = 1,
//       limit = 10,
//       sortBy = 'createdAt',
//       order = 'desc'
//     } = req.query;

//     // Build query
//     let query = { isActive: true };
    
//     if (status) query.status = status;
//     if (scholarshipType) query.scholarshipType = scholarshipType;
//     if (targetCountry) query.targetCountry = targetCountry;
//     if (targetUniversity) query.targetUniversity = targetUniversity;
//     if (intakeYear) query.intakeYear = intakeYear;
//     if (nationality) query.nationality = nationality;
//     if (search) {
//       query.$or = [
//         { firstName: { $regex: search, $options: 'i' } },
//         { lastName: { $regex: search, $options: 'i' } },
//         { email: { $regex: search, $options: 'i' } },
//         { applicationId: { $regex: search, $options: 'i' } }
//       ];
//     }

//     // Build sort
//     const sort = {};
//     sort[sortBy] = order === 'desc' ? -1 : 1;

//     // Execute query with pagination
//     const skip = (page - 1) * limit;
    
//     const [applications, total] = await Promise.all([
//       ScholarshipApplication.find(query)
//         .sort(sort)
//         .skip(skip)
//         .limit(parseInt(limit))
//         .select('-documents -reviewerComments -statusHistory'),
//       ScholarshipApplication.countDocuments(query)
//     ]);

//     res.status(200).json({
//       success: true,
//       count: applications.length,
//       total,
//       totalPages: Math.ceil(total / limit),
//       currentPage: parseInt(page),
//       data: applications.map(formatApplicationResponse)
//     });
//   } catch (error) {
//     console.error('Get all applications error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching scholarship applications'
//     });
//   }
// };

// // Get all scholarship applications by email
// exports.getApplicationsByEmail = async (req, res) => {
//   try {
//     const { email } = req.params;
//     const {
//       status,
//       scholarshipType,
//       targetCountry,
//       targetUniversity,
//       intakeYear,
//       nationality,
//       search,
//       page = 1,
//       limit = 10,
//       sortBy = 'createdAt',
//       order = 'desc'
//     } = req.query;

//     // Build query
//     let query = {
//       isActive: true,
//       email: email.toLowerCase()
//     };

//     if (status) query.status = status;
//     if (scholarshipType) query.scholarshipType = scholarshipType;
//     if (targetCountry) query.targetCountry = targetCountry;
//     if (targetUniversity) query.targetUniversity = targetUniversity;
//     if (intakeYear) query.intakeYear = intakeYear;
//     if (nationality) query.nationality = nationality;

//     if (search) {
//       query.$or = [
//         { firstName: { $regex: search, $options: 'i' } },
//         { lastName: { $regex: search, $options: 'i' } },
//         { applicationId: { $regex: search, $options: 'i' } }
//       ];
//     }

//     // Build sort
//     const sort = {};
//     sort[sortBy] = order === 'desc' ? -1 : 1;

//     // Execute query with pagination
//     const skip = (page - 1) * limit;

//     const [applications, total] = await Promise.all([
//       ScholarshipApplication.find(query)
//         .sort(sort)
//         .skip(skip)
//         .limit(parseInt(limit))
//         .select('-documents -reviewerComments -statusHistory'),
//       ScholarshipApplication.countDocuments(query)
//     ]);

//     res.status(200).json({
//       success: true,
//       count: applications.length,
//       total,
//       totalPages: Math.ceil(total / limit),
//       currentPage: parseInt(page),
//       data: applications.map(formatApplicationResponse)
//     });
//   } catch (error) {
//     console.error('Get applications by email error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching scholarship applications by email'
//     });
//   }
// };

// // Get single application by ID
// exports.getApplicationById = async (req, res) => {
//   try {
//     const application = await ScholarshipApplication.findById(req.params.id);

//     if (!application) {
//       return res.status(404).json({
//         success: false,
//         message: 'Scholarship application not found'
//       });
//     }

//     res.status(200).json({
//       success: true,
//       data: formatApplicationResponse(application)
//     });
//   } catch (error) {
//     console.error('Get application by ID error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching scholarship application'
//     });
//   }
// };

// // Update application
// exports.updateApplication = async (req, res) => {
//   try {
//     let application = await ScholarshipApplication.findById(req.params.id);

//     if (!application) {
//       return res.status(404).json({
//         success: false,
//         message: 'Scholarship application not found'
//       });
//     }

//     // Handle status changes
//     const oldStatus = application.status;
//     const newStatus = req.body.status;

//     // Update application
//     application = await ScholarshipApplication.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       {
//         new: true,
//         runValidators: true
//       }
//     );

//     // Send status update email if status changed
//     if (newStatus && newStatus !== oldStatus) {
//       emailService.sendStatusUpdateNotification(application, oldStatus, newStatus)
//         .catch(err => console.error('Error sending status update email:', err));
//     }

//     res.status(200).json({
//       success: true,
//       message: 'Application updated successfully',
//       data: formatApplicationResponse(application)
//     });
//   } catch (error) {
//     console.error('Update application error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error updating application',
//       error: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   }
// };

// // Delete application (soft delete)
// exports.deleteApplication = async (req, res) => {
//   try {
//     const application = await ScholarshipApplication.findById(req.params.id);

//     if (!application) {
//       return res.status(404).json({
//         success: false,
//         message: 'Scholarship application not found'
//       });
//     }

//     // Soft delete
//     application.isActive = false;
//     await application.save();

//     res.status(200).json({
//       success: true,
//       message: 'Application deleted successfully'
//     });
//   } catch (error) {
//     console.error('Delete application error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error deleting application'
//     });
//   }
// };

// // ======================================
// // DOCUMENT MANAGEMENT OPERATIONS
// // ======================================

// // Upload document to application
// exports.uploadDocument = async (req, res) => {
//   try {
//     const { documentType } = req.params;
//     const application = await ScholarshipApplication.findById(req.params.id);

//     if (!application) {
//       return res.status(404).json({
//         success: false,
//         message: 'Scholarship application not found'
//       });
//     }

//     if (!req.file) {
//       return res.status(400).json({
//         success: false,
//         message: 'No file uploaded'
//       });
//     }

//     // Define allowed document types
//     const allowedTypes = [
//       'transcripts',
//       'passportCopy',
//       'cvResume',
//       'statementOfPurpose',
//       'recommendationLetter',
//       'languageCertificate',
//       'researchProposal',
//       'portfolio',
//       'other'
//     ];

//     if (!allowedTypes.includes(documentType)) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid document type'
//       });
//     }

//     // Upload to Cloudinary
//     const folder = `scholarship/${documentType}`;
//     const result = await uploadDocumentToCloudinary(req.file.path, folder);

//     // Update application with document URL
//     application.documents = application.documents || {};
    
//     if (documentType === 'recommendationLetter') {
//       application.documents.recommendationLetters = application.documents.recommendationLetters || [];
//       application.documents.recommendationLetters.push({
//         url: result.url,
//         cloudinaryId: result.public_id,
//         uploadedAt: new Date()
//       });
//     } else if (documentType === 'other') {
//       application.documents.otherDocuments = application.documents.otherDocuments || [];
//       application.documents.otherDocuments.push({
//         name: req.file.originalname,
//         url: result.url,
//         cloudinaryId: result.public_id
//       });
//     } else {
//       application.documents[documentType] = {
//         url: result.url,
//         cloudinaryId: result.public_id,
//         uploadedAt: new Date()
//       };
//     }

//     await application.save();

//     // Clean up temporary file
//     fs.unlinkSync(req.file.path);

//     res.status(200).json({
//       success: true,
//       message: 'Document uploaded successfully',
//       data: {
//         documentType,
//         url: result.url,
//         publicId: result.public_id,
//         size: result.bytes
//       }
//     });
//   } catch (error) {
//     console.error('Upload document error:', error);
//     // Clean up temporary file if exists
//     if (req.file && req.file.path) {
//       fs.unlinkSync(req.file.path);
//     }
//     res.status(500).json({
//       success: false,
//       message: 'Error uploading document'
//     });
//   }
// };

// // Delete document from application
// exports.deleteDocument = async (req, res) => {
//   try {
//     const { id, documentType, documentId } = req.params;
//     const application = await ScholarshipApplication.findById(id);

//     if (!application) {
//       return res.status(404).json({
//         success: false,
//         message: 'Scholarship application not found'
//       });
//     }

//     let publicId = null;

//     if (documentType === 'recommendationLetter') {
//       // Find and remove recommendation letter
//       const letterIndex = application.documents.recommendationLetters?.findIndex(
//         letter => letter._id.toString() === documentId
//       );
      
//       if (letterIndex > -1) {
//         publicId = application.documents.recommendationLetters[letterIndex].cloudinaryId;
//         application.documents.recommendationLetters.splice(letterIndex, 1);
//       }
//     } else if (documentType === 'other') {
//       // Find and remove other document
//       const docIndex = application.documents.otherDocuments?.findIndex(
//         doc => doc._id.toString() === documentId
//       );
      
//       if (docIndex > -1) {
//         publicId = application.documents.otherDocuments[docIndex].cloudinaryId;
//         application.documents.otherDocuments.splice(docIndex, 1);
//       }
//     } else {
//       // Remove single document
//       publicId = application.documents?.[documentType]?.cloudinaryId;
//       application.documents[documentType] = null;
//     }

//     // Delete from Cloudinary
//     if (publicId) {
//       await deleteCloudinaryDocument(publicId);
//     }

//     await application.save();

//     res.status(200).json({
//       success: true,
//       message: 'Document deleted successfully'
//     });
//   } catch (error) {
//     console.error('Delete document error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error deleting document'
//     });
//   }
// };

// // ======================================
// // STATUS & REVIEW OPERATIONS
// // ======================================

// // Update application status
// exports.updateStatus = async (req, res) => {
//   try {
//     const { status, notes } = req.body;
//     const application = await ScholarshipApplication.findById(req.params.id);

//     if (!application) {
//       return res.status(404).json({
//         success: false,
//         message: 'Scholarship application not found'
//       });
//     }

//     const oldStatus = application.status;
//     application.status = status;
    
//     // Add to status history
//     application.statusHistory = application.statusHistory || [];
//     application.statusHistory.push({
//       status: status,
//       changedBy: 'system',
//       notes: notes || 'Status updated',
//       changedAt: new Date()
//     });
    
//     await application.save();

//     // Send notification email
//     emailService.sendStatusUpdateNotification(application, oldStatus, status)
//       .catch(err => console.error('Error sending status update email:', err));

//     res.status(200).json({
//       success: true,
//       message: 'Application status updated successfully',
//       data: {
//         oldStatus,
//         newStatus: status,
//         applicationId: application.applicationId
//       }
//     });
//   } catch (error) {
//     console.error('Update status error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error updating application status'
//     });
//   }
// };

// // Assign application to reviewer
// exports.assignToReviewer = async (req, res) => {
//   try {
//     const { reviewerId } = req.body;
//     const application = await ScholarshipApplication.findById(req.params.id);

//     if (!application) {
//       return res.status(404).json({
//         success: false,
//         message: 'Scholarship application not found'
//       });
//     }

//     application.assignedTo = reviewerId;
//     await application.save();

//     // Send assignment notification
//     emailService.sendAssignmentNotification(application, reviewerId)
//       .catch(err => console.error('Error sending assignment notification:', err));

//     res.status(200).json({
//       success: true,
//       message: 'Application assigned to reviewer successfully',
//       data: {
//         applicationId: application.applicationId,
//         assignedTo: reviewerId
//       }
//     });
//   } catch (error) {
//     console.error('Assign to reviewer error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error assigning application to reviewer'
//     });
//   }
// };

// // Add review comments
// exports.addReviewComment = async (req, res) => {
//   try {
//     const { section, comment, score } = req.body;
//     const application = await ScholarshipApplication.findById(req.params.id);

//     if (!application) {
//       return res.status(404).json({
//         success: false,
//         message: 'Scholarship application not found'
//       });
//     }

//     application.reviewerComments = application.reviewerComments || [];
//     application.reviewerComments.push({
//       reviewer: 'system',
//       section,
//       comment,
//       score: score || 0,
//       createdAt: new Date()
//     });
    
//     await application.save();

//     res.status(200).json({
//       success: true,
//       message: 'Review comment added successfully'
//     });
//   } catch (error) {
//     console.error('Add review comment error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error adding review comment'
//     });
//   }
// };

// // Update review scores
// exports.updateReviewScores = async (req, res) => {
//   try {
//     const { academic, financial, essay, overall } = req.body;
//     const application = await ScholarshipApplication.findById(req.params.id);

//     if (!application) {
//       return res.status(404).json({
//         success: false,
//         message: 'Scholarship application not found'
//       });
//     }

//     application.reviewScore = {
//       academic: academic || 0,
//       financial: financial || 0,
//       essay: essay || 0,
//       overall: overall || 0
//     };
    
//     await application.save();

//     res.status(200).json({
//       success: true,
//       message: 'Review scores updated successfully',
//       data: application.reviewScore
//     });
//   } catch (error) {
//     console.error('Update review scores error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error updating review scores'
//     });
//   }
// };

// // Make final decision
// exports.makeDecision = async (req, res) => {
//   try {
//     const { decision, notes, fundingAmount, currency, conditions } = req.body;
//     const application = await ScholarshipApplication.findById(req.params.id);

//     if (!application) {
//       return res.status(404).json({
//         success: false,
//         message: 'Scholarship application not found'
//       });
//     }

//     // Update status based on decision
//     const newStatus = decision === 'Approved' ? 'Approved' : 
//                      decision === 'Conditionally Approved' ? 'Conditionally Approved' : 'Rejected';
    
//     const oldStatus = application.status;
//     application.status = newStatus;
//     application.decision = {
//       madeBy: 'system',
//       madeAt: new Date(),
//       notes,
//       fundingAwarded: fundingAmount ? {
//         amount: fundingAmount,
//         currency: currency || 'USD',
//         conditions: conditions || []
//       } : null
//     };
    
//     application.statusHistory = application.statusHistory || [];
//     application.statusHistory.push({
//       status: newStatus,
//       changedBy: 'system',
//       notes: `Decision: ${decision} - ${notes || ''}`,
//       changedAt: new Date()
//     });
    
//     await application.save();

//     // Send decision notification
//     emailService.sendDecisionNotification(application, decision)
//       .catch(err => console.error('Error sending decision notification:', err));

//     res.status(200).json({
//       success: true,
//       message: `Application ${decision.toLowerCase()} successfully`,
//       data: {
//         decision,
//         status: newStatus,
//         applicationId: application.applicationId
//       }
//     });
//   } catch (error) {
//     console.error('Make decision error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error making decision'
//     });
//   }
// };

// // ======================================
// // STATISTICS OPERATIONS
// // ======================================

// // Get application statistics
// exports.getApplicationStatistics = async (req, res) => {
//   try {
//     const application = await ScholarshipApplication.findById(req.params.id)
//       .select('status statusHistory reviewScore documents essay');

//     if (!application) {
//       return res.status(404).json({
//         success: false,
//         message: 'Scholarship application not found'
//       });
//     }

//     const stats = {
//       statusTimeline: application.statusHistory || [],
//       reviewScores: application.reviewScore || {},
//       documentStatus: {
//         transcripts: !!application.documents?.transcripts?.url,
//         passport: !!application.documents?.passportCopy?.url,
//         cv: !!application.documents?.cvResume?.url,
//         essay: application.essay?.status || 'Pending',
//         recommendationLetters: application.documents?.recommendationLetters?.length || 0
//       }
//     };

//     res.status(200).json({
//       success: true,
//       data: stats
//     });
//   } catch (error) {
//     console.error('Get application statistics error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching application statistics'
//     });
//   }
// };

// // Get system-wide statistics
// exports.getSystemStatistics = async (req, res) => {
//   try {
//     const [
//       totalApplications,
//       applicationsByStatus,
//       applicationsByCountry
//     ] = await Promise.all([
//       ScholarshipApplication.countDocuments({ isActive: true }),
//       ScholarshipApplication.aggregate([
//         { $match: { isActive: true } },
//         { $group: { _id: '$status', count: { $sum: 1 } } }
//       ]),
//       ScholarshipApplication.aggregate([
//         { $match: { isActive: true } },
//         { $group: { _id: '$targetCountry', count: { $sum: 1 } } },
//         { $sort: { count: -1 } },
//         { $limit: 10 }
//       ])
//     ]);

//     const stats = {
//       overview: {
//         totalApplications,
//         activeApplications: applicationsByStatus.reduce((sum, item) => 
//           ['Submitted', 'Under Review', 'Shortlisted', 'Interview Scheduled'].includes(item._id) 
//             ? sum + item.count 
//             : sum, 0
//         ),
//         approvedApplications: applicationsByStatus.find(item => item._id === 'Approved')?.count || 0,
//         rejectedApplications: applicationsByStatus.find(item => item._id === 'Rejected')?.count || 0
//       },
//       distribution: {
//         byStatus: applicationsByStatus.reduce((acc, curr) => {
//           acc[curr._id] = curr.count;
//           return acc;
//         }, {}),
//         byCountry: applicationsByCountry.reduce((acc, curr) => {
//           acc[curr._id] = curr.count;
//           return acc;
//         }, {})
//       }
//     };

//     res.status(200).json({
//       success: true,
//       data: stats
//     });
//   } catch (error) {
//     console.error('Get system statistics error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching system statistics'
//     });
//   }
// };

// // Send bulk email to applicants
// exports.sendBulkEmailToApplicants = async (req, res) => {
//   try {
//     const { subject, message, statusFilter, scholarshipTypeFilter } = req.body;
    
//     // Build query based on filters
//     let query = { isActive: true };
//     if (statusFilter) query.status = statusFilter;
//     if (scholarshipTypeFilter) query.scholarshipType = scholarshipTypeFilter;
    
//     const applications = await ScholarshipApplication.find(query)
//       .select('firstName lastName email applicationId');
    
//     if (applications.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: 'No applicants found matching the criteria'
//       });
//     }
    
//     const results = await emailService.sendBulkEmail(applications, subject, message);
    
//     res.status(200).json({
//       success: true,
//       message: `Email sent to ${results.successCount} applicants`,
//       data: results
//     });
//   } catch (error) {
//     console.error('Bulk email error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error sending bulk email'
//     });
//   }
// };














const ScholarshipApplication = require('../models/ScholarshipApplication');
const nodemailer = require('nodemailer');
const cloudinary = require('../cloudinary/cloudinary');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

/* =====================================================
   EMAIL TRANSPORTER
===================================================== */
// const createTransporter = () => {
//   return nodemailer.createTransport({
//     host: process.env.SMTP_HOST,
//     port: 465,
//     secure: true,
//     auth: {
//       user: process.env.SMTP_USER,
//       pass: process.env.SMTP_PASS,
//     }
//   });
// };


const createTransporter = () => {
  const smtpPass = process.env.SMTP_PASS
    ? process.env.SMTP_PASS.toString().trim()
    : "";

  const port = parseInt(process.env.SMTP_PORT) || 587;

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: port,
    secure: false,

    pool: true,
    maxConnections: 5,
    maxMessages: 10,

    auth: {
      user: process.env.SMTP_USER,
      pass: smtpPass,
    },

    tls: {
      rejectUnauthorized: false,
    },

    connectionTimeout: 20000,
    socketTimeout: 30000,
    greetingTimeout: 20000,
  });
};

/* =====================================================
   EMAIL SERVICE
===================================================== */
const emailService = {
 sendEmail : async (to, subject, html, isAdminNotification = false, retries = 3) => {
  try {
    console.log("📧 Sending email to:", to);

    const transporter = createTransporter();

    // Verify SMTP connection (non-blocking safety check)
    try {
      await transporter.verify();
      console.log("✅ SMTP connection verified");
    } catch (verifyError) {
      console.log("⚠ SMTP verify warning:", verifyError.message);
    }

    const info = await transporter.sendMail({
      from: `"${process.env.COMPANY_NAME || 'REC APPLY'} Scholarship Services" <${process.env.EMAIL_FROM}>`,
      to,
      subject,
      html
    });

    console.log("✅ Email sent successfully to:", to, "Message ID:", info.messageId);

    return {
      success: true,
      messageId: info.messageId
    };

  } catch (error) {
    console.error("❌ Email send error:", error.message);

    // ⭐ Retry logic for network failures
    if (retries > 0) {
      console.log(`🔁 Retrying email... Attempts left: ${retries}`);

      await new Promise(res => setTimeout(res, 4000));

      return sendEmail(to, subject, html, isAdminNotification, retries - 1);
    }

    throw error;
  }
},

  // Send application confirmation to applicant
  sendApplicationConfirmation: async (application) => {
    const subject = `Scholarship Application Received - ${application.applicationId}`;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f4f4; padding: 20px;">
        <div style="background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">${process.env.COMPANY_NAME || 'REC APPLY'}</h1>
          <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Scholarship Application</p>
        </div>
        
        <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-top: 0; border-bottom: 2px solid #f0f0f0; padding-bottom: 15px;">
            Thank You for Your Scholarship Application! 🎓
          </h2>
          
          <p style="font-size: 16px; line-height: 1.6; color: #555;">Dear ${application.firstName} ${application.lastName},</p>
          
          <p style="font-size: 16px; line-height: 1.6; color: #555;">Your scholarship application has been received and is now being processed. Here are your application details:</p>
          
          <div style="background-color: #e8f4fc; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #2a5298;">
            <h3 style="margin-top: 0; color: #2a5298; font-size: 20px;">Application ID: ${application.applicationId}</h3>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Full Name:</strong></td>
                <td style="padding: 8px 0; color: #333;">${application.firstName} ${application.lastName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Email:</strong></td>
                <td style="padding: 8px 0; color: #333;">${application.email}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Target University:</strong></td>
                <td style="padding: 8px 0; color: #333;">${application.targetUniversity}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Target Program:</strong></td>
                <td style="padding: 8px 0; color: #333;">${application.targetProgram}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Scholarship Type:</strong></td>
                <td style="padding: 8px 0; color: #333;">${application.scholarshipType}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Submission Date:</strong></td>
                <td style="padding: 8px 0; color: #333;">${new Date(application.createdAt).toLocaleDateString()}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Current Status:</strong></td>
                <td style="padding: 8px 0; color: #333;">
                  <span style="background-color: ${getStatusColor(application.status)}; color: white; padding: 3px 10px; border-radius: 12px; font-size: 12px;">
                    ${application.status || 'Submitted'}
                  </span>
                </td>
              </tr>
            </table>
          </div>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h4 style="margin-top: 0; color: #333;">What Happens Next?</h4>
            <ol style="margin: 5px 0 0 0; color: #555;">
              <li style="margin: 5px 0;">Your application will be reviewed within 2-3 weeks</li>
              <li style="margin: 5px 0;">You may be contacted for additional information or an interview</li>
              <li style="margin: 5px 0;">You'll receive email updates as your application progresses</li>
              <li style="margin: 5px 0;">Final decisions will be communicated via email</li>
            </ol>
          </div>
          
          <hr style="border: none; border-top: 2px solid #f0f0f0; margin: 30px 0;">
          
          <div style="text-align: center;">
            <p style="color: #666; font-size: 14px; line-height: 1.6;">
              We wish you the best of luck with your scholarship application!<br>
              If you have any questions, please contact our scholarship office.
            </p>
          </div>
        </div>
        
        <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
          © ${new Date().getFullYear()} ${process.env.COMPANY_NAME || 'REC APPLY'}. All rights reserved.<br>
          This is an automated message, please do not reply to this email.
        </div>
      </div>
    `;

    return await this.sendEmail(application.email, subject, html);
  },

  // Send admin notification for new application
  sendAdminNotification: async (application) => {
    const subject = `New Scholarship Application Received - ${application.applicationId}`;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f4f4; padding: 20px;">
        <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">${process.env.COMPANY_NAME || 'REC APPLY'}</h1>
          <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Admin Notification - New Application</p>
        </div>
        
        <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-top: 0; border-bottom: 2px solid #f0f0f0; padding-bottom: 15px;">
            New Scholarship Application Alert! 📋
          </h2>
          
          <div style="background-color: #fff3e0; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #f5576c;">
            <h3 style="margin-top: 0; color: #f5576c; font-size: 20px;">Application ID: ${application.applicationId}</h3>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Applicant Name:</strong></td>
                <td style="padding: 8px 0; color: #333;">${application.firstName} ${application.lastName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Email:</strong></td>
                <td style="padding: 8px 0; color: #333;">${application.email}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Phone:</strong></td>
                <td style="padding: 8px 0; color: #333;">${application.phone || 'Not provided'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Nationality:</strong></td>
                <td style="padding: 8px 0; color: #333;">${application.nationality || 'Not provided'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Target University:</strong></td>
                <td style="padding: 8px 0; color: #333;">${application.targetUniversity}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Target Program:</strong></td>
                <td style="padding: 8px 0; color: #333;">${application.targetProgram}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Scholarship Type:</strong></td>
                <td style="padding: 8px 0; color: #333;">${application.scholarshipType}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Intake Year:</strong></td>
                <td style="padding: 8px 0; color: #333;">${application.intakeYear || 'Not specified'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Application Date:</strong></td>
                <td style="padding: 8px 0; color: #333;">${new Date(application.createdAt).toLocaleString()}</td>
              </tr>
            </table>
            
            ${application.academicBackground ? `
              <div style="margin-top: 15px;">
                <strong style="color: #666;">Academic Background:</strong>
                <p style="color: #555; margin: 5px 0 0 0;">${application.academicBackground}</p>
              </div>
            ` : ''}
          </div>
          
          <hr style="border: none; border-top: 2px solid #f0f0f0; margin: 30px 0;">
          
          <div style="text-align: center;">
            <p style="color: #666; font-size: 14px; line-height: 1.6;">
              Please review this application and assign it to a reviewer.<br>
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
  },

  // Send status update notification to applicant
  sendStatusUpdateNotification: async (application, oldStatus, newStatus) => {
    const subject = `Scholarship Application Status Update - ${application.applicationId}`;
    
    const statusColors = {
      'Submitted': '#3498db',
      'Under Review': '#f39c12',
      'Shortlisted': '#9b59b6',
      'Interview Scheduled': '#1abc9c',
      'Interview Completed': '#16a085',
      'Approved': '#27ae60',
      'Conditionally Approved': '#2ecc71',
      'Rejected': '#e74c3c',
      'Waitlisted': '#7f8c8d',
      'Withdrawn': '#34495e'
    };

    const oldColor = statusColors[oldStatus] || '#95a5a6';
    const newColor = statusColors[newStatus] || '#95a5a6';
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f4f4; padding: 20px;">
        <div style="background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">${process.env.COMPANY_NAME || 'REC APPLY'}</h1>
          <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Application Status Update</p>
        </div>
        
        <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-top: 0; border-bottom: 2px solid #f0f0f0; padding-bottom: 15px;">
            Your Application Status Has Been Updated
          </h2>
          
          <p style="font-size: 16px; line-height: 1.6; color: #555;">Dear ${application.firstName} ${application.lastName},</p>
          
          <p style="font-size: 16px; line-height: 1.6; color: #555;">The status of your scholarship application has been updated:</p>
          
          <div style="background-color: #f9f9f9; padding: 30px; text-align: center; border-radius: 5px; margin: 20px 0;">
            <div style="display: inline-block; background-color: ${oldColor}20; padding: 15px 30px; border-radius: 5px; margin-right: 10px;">
              <span style="color: ${oldColor}; font-weight: bold;">${oldStatus || 'Submitted'}</span>
            </div>
            <span style="font-size: 24px; color: #999; margin: 0 15px;">→</span>
            <div style="display: inline-block; background-color: ${newColor}20; padding: 15px 30px; border-radius: 5px;">
              <span style="color: ${newColor}; font-weight: bold;">${newStatus}</span>
            </div>
          </div>
          
          <div style="background-color: #e8f4fc; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h4 style="margin-top: 0; color: #333;">Application Details</h4>
            <p style="margin: 5px 0; color: #555;"><strong>Application ID:</strong> ${application.applicationId}</p>
            <p style="margin: 5px 0; color: #555;"><strong>University:</strong> ${application.targetUniversity}</p>
            <p style="margin: 5px 0; color: #555;"><strong>Program:</strong> ${application.targetProgram}</p>
            <p style="margin: 5px 0; color: #555;"><strong>Current Status:</strong> 
              <span style="background-color: ${newColor}; color: white; padding: 3px 10px; border-radius: 12px; font-size: 12px;">
                ${newStatus}
              </span>
            </p>
            <p style="margin: 5px 0; color: #555;"><strong>Updated on:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h4 style="margin-top: 0; color: #333;">Next Steps</h4>
            <p style="margin: 5px 0; color: #555;">
              ${newStatus === 'Approved' ? 'Congratulations! Your application has been approved. You will receive further instructions shortly.' : 
                newStatus === 'Rejected' ? 'We regret to inform you that your application was not successful. You may reapply in the future.' :
                newStatus === 'Interview Scheduled' ? 'Please check your email for interview details and preparation materials.' :
                'Continue to monitor your email for further updates on your application.'}
            </p>
          </div>
          
          <hr style="border: none; border-top: 2px solid #f0f0f0; margin: 30px 0;">
          
          <div style="text-align: center;">
            <p style="color: #666; font-size: 14px; line-height: 1.6;">
              If you have any questions, please contact our scholarship office.<br>
              Thank you for applying with ${process.env.COMPANY_NAME || 'REC APPLY'}.
            </p>
          </div>
        </div>
        
        <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
          © ${new Date().getFullYear()} ${process.env.COMPANY_NAME || 'REC APPLY'}. All rights reserved.
        </div>
      </div>
    `;

    return await this.sendEmail(application.email, subject, html);
  },

  // Send decision notification
  sendDecisionNotification: async (application, decision) => {
    const subject = `Scholarship Application Decision - ${application.applicationId}`;
    
    const isApproved = decision === 'Approved' || decision === 'Conditionally Approved';
    const bgColor = isApproved ? '#d5f4e6' : '#ffcccc';
    const textColor = isApproved ? '#27ae60' : '#e74c3c';
    const icon = isApproved ? '🎉' : '📋';
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f4f4; padding: 20px;">
        <div style="background: linear-gradient(135deg, ${isApproved ? '#27ae60' : '#e74c3c'} 0%, ${isApproved ? '#2ecc71' : '#c0392b'} 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">${process.env.COMPANY_NAME || 'REC APPLY'}</h1>
          <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Scholarship Decision</p>
        </div>
        
        <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-top: 0; border-bottom: 2px solid #f0f0f0; padding-bottom: 15px;">
            ${icon} Scholarship Application ${isApproved ? 'Approved' : 'Outcome'}
          </h2>
          
          <p style="font-size: 16px; line-height: 1.6; color: #555;">Dear ${application.firstName} ${application.lastName},</p>
          
          <div style="background-color: ${bgColor}; padding: 30px; text-align: center; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: ${textColor}; margin-top: 0; font-size: 24px;">
              ${decision === 'Approved' ? 'Congratulations! 🎉' : 
                decision === 'Conditionally Approved' ? 'Conditional Approval' : 
                'Application Decision'}
            </h3>
            <p style="font-size: 20px; font-weight: bold; color: ${textColor};">${decision}</p>
          </div>
          
          <div style="background-color: #e8f4fc; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h4 style="margin-top: 0; color: #333;">Application Summary</h4>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Application ID:</strong></td>
                <td style="padding: 8px 0; color: #333;">${application.applicationId}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>University:</strong></td>
                <td style="padding: 8px 0; color: #333;">${application.targetUniversity}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Program:</strong></td>
                <td style="padding: 8px 0; color: #333;">${application.targetProgram}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Decision Date:</strong></td>
                <td style="padding: 8px 0; color: #333;">${new Date().toLocaleDateString()}</td>
              </tr>
            </table>
          </div>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h4 style="margin-top: 0; color: #333;">What Happens Next?</h4>
            <p style="margin: 5px 0; color: #555;">
              ${decision === 'Approved' ? 'You will receive detailed information about your scholarship award and next steps within 3-5 business days.' : 
                decision === 'Conditionally Approved' ? 'Please check your email for conditions that need to be fulfilled to finalize your award.' :
                'We encourage you to explore other scholarship opportunities and consider reapplying in the future.'}
            </p>
          </div>
          
          <hr style="border: none; border-top: 2px solid #f0f0f0; margin: 30px 0;">
          
          <div style="text-align: center;">
            <p style="color: #666; font-size: 14px; line-height: 1.6;">
              If you have any questions, please contact our scholarship office.<br>
              Thank you for applying with ${process.env.COMPANY_NAME || 'REC APPLY'}.
            </p>
          </div>
        </div>
        
        <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
          © ${new Date().getFullYear()} ${process.env.COMPANY_NAME || 'REC APPLY'}. All rights reserved.
        </div>
      </div>
    `;

    return await this.sendEmail(application.email, subject, html);
  },

  // Send assignment notification to reviewer
  sendAssignmentNotification: async (application, reviewerId) => {
    const subject = `New Application Assigned for Review - ${application.applicationId}`;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f4f4; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">${process.env.COMPANY_NAME || 'REC APPLY'}</h1>
          <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Reviewer Notification</p>
        </div>
        
        <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-top: 0; border-bottom: 2px solid #f0f0f0; padding-bottom: 15px;">
            New Application Assigned for Review
          </h2>
          
          <div style="background-color: #e8f4fc; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #667eea;">
            <h3 style="margin-top: 0; color: #667eea; font-size: 20px;">Application Details</h3>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Application ID:</strong></td>
                <td style="padding: 8px 0; color: #333;">${application.applicationId}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Applicant:</strong></td>
                <td style="padding: 8px 0; color: #333;">${application.firstName} ${application.lastName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Email:</strong></td>
                <td style="padding: 8px 0; color: #333;">${application.email}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>University:</strong></td>
                <td style="padding: 8px 0; color: #333;">${application.targetUniversity}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Program:</strong></td>
                <td style="padding: 8px 0; color: #333;">${application.targetProgram}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Scholarship Type:</strong></td>
                <td style="padding: 8px 0; color: #333;">${application.scholarshipType}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Assigned Date:</strong></td>
                <td style="padding: 8px 0; color: #333;">${new Date().toLocaleDateString()}</td>
              </tr>
            </table>
          </div>
          
          <hr style="border: none; border-top: 2px solid #f0f0f0; margin: 30px 0;">
          
          <div style="text-align: center;">
            <p style="color: #666; font-size: 14px; line-height: 1.6;">
              Please review this application and provide your assessment.<br>
              This is an automated notification from the scholarship system.
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

  // Send bulk email to applicants
  sendBulkEmail: async (applicants, subject, message) => {
    const results = {
      successCount: 0,
      failedCount: 0,
      failedEmails: []
    };

    for (const applicant of applicants) {
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f4f4; padding: 20px;">
          <div style="background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">${process.env.COMPANY_NAME || 'REC APPLY'}</h1>
          </div>
          
          <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-top: 0;">${subject}</h2>
            
            <p style="font-size: 16px; line-height: 1.6; color: #555;">Dear ${applicant.firstName} ${applicant.lastName},</p>
            
            <p style="font-size: 14px; color: #666;"><strong>Application ID:</strong> ${applicant.applicationId}</p>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            
            <div style="line-height: 1.6; color: #555;">
              ${message}
            </div>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            
            <p style="color: #666; font-size: 12px;">
              This message was sent to all applicants matching the specified criteria.
            </p>
          </div>
          
          <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
            © ${new Date().getFullYear()} ${process.env.COMPANY_NAME || 'REC APPLY'}. All rights reserved.
          </div>
        </div>
      `;

      try {
        await this.sendEmail(applicant.email, subject, html);
        results.successCount++;
      } catch (error) {
        console.error(`Error sending email to ${applicant.email}:`, error);
        results.failedCount++;
        results.failedEmails.push(applicant.email);
      }
    }

    return results;
  }
};

// ======================================
// HELPER FUNCTIONS
// ======================================

// Format application response
function formatApplicationResponse(application) {
  const appObj = application.toObject ? application.toObject() : application;
  
  return {
    ...appObj,
    fullName: `${appObj.firstName} ${appObj.lastName}`,
    statusColor: getStatusColor(appObj.status)
  };
}

// Get color for status
function getStatusColor(status) {
  const colors = {
    'Draft': '#95a5a6',
    'Submitted': '#3498db',
    'Under Review': '#f39c12',
    'Shortlisted': '#9b59b6',
    'Interview Scheduled': '#1abc9c',
    'Interview Completed': '#16a085',
    'Approved': '#27ae60',
    'Conditionally Approved': '#2ecc71',
    'Rejected': '#e74c3c',
    'Waitlisted': '#7f8c8d',
    'Withdrawn': '#34495e'
  };
  
  return colors[status] || '#95a5a6';
}

// Upload document to Cloudinary
const uploadDocumentToCloudinary = async (filePath, folder = 'scholarship-documents', options = {}) => {
  try {
    const uploadOptions = {
      folder: folder,
      resource_type: 'auto',
      allowed_formats: ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx'],
      public_id: `doc-${uuidv4()}`,
      ...options
    };

    const result = await cloudinary.uploader.upload(filePath, uploadOptions);
    return {
      url: result.secure_url,
      public_id: result.public_id,
      format: result.format,
      bytes: result.bytes,
      resource_type: result.resource_type
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload document to Cloudinary');
  }
};

// Delete document from Cloudinary
const deleteCloudinaryDocument = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
    return result;
  } catch (error) {
    console.error('Error deleting Cloudinary document:', error);
    return false;
  }
};

// ======================================
// CRUD OPERATIONS
// ======================================

// Create a new scholarship application
exports.createScholarshipApplication = async (req, res) => {
  try {
    const applicationData = {
      ...req.body
    };

    // Generate application ID if not provided
    if (!applicationData.applicationId) {
      const year = new Date().getFullYear();
      const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
      applicationData.applicationId = `SCH-${year}-${random}`;
    }

    // Handle document uploads if provided
    if (req.files) {
      // Process uploaded files
      const documentPromises = [];
      
      if (req.files.transcripts) {
        documentPromises.push(
          uploadDocumentToCloudinary(req.files.transcripts[0].path, 'scholarship/transcripts')
            .then(result => {
              applicationData.documents = applicationData.documents || {};
              applicationData.documents.transcripts = {
                url: result.url,
                cloudinaryId: result.public_id,
                uploadedAt: new Date()
              };
            })
        );
      }
      
      if (req.files.passportCopy) {
        documentPromises.push(
          uploadDocumentToCloudinary(req.files.passportCopy[0].path, 'scholarship/passports')
            .then(result => {
              applicationData.documents = applicationData.documents || {};
              applicationData.documents.passportCopy = {
                url: result.url,
                cloudinaryId: result.public_id
              };
            })
        );
      }
      
      if (req.files.cvResume) {
        documentPromises.push(
          uploadDocumentToCloudinary(req.files.cvResume[0].path, 'scholarship/cv')
            .then(result => {
              applicationData.documents = applicationData.documents || {};
              applicationData.documents.cvResume = {
                url: result.url,
                cloudinaryId: result.public_id
              };
            })
        );
      }
      
      if (req.files.statementOfPurpose) {
        documentPromises.push(
          uploadDocumentToCloudinary(req.files.statementOfPurpose[0].path, 'scholarship/sop')
            .then(result => {
              applicationData.documents = applicationData.documents || {};
              applicationData.documents.statementOfPurpose = {
                url: result.url,
                cloudinaryId: result.public_id
              };
            })
        );
      }
      
      // Wait for all uploads to complete
      await Promise.all(documentPromises);
    }

    const application = await ScholarshipApplication.create(applicationData);

    // Send email notifications
    await emailService.sendApplicationConfirmation(application);
    await emailService.sendAdminNotification(application);

    res.status(201).json({
      success: true,
      message: 'Scholarship application created successfully',
      data: formatApplicationResponse(application)
    });
  } catch (error) {
    console.error('Create scholarship application error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating scholarship application',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get all scholarship applications with filters
exports.getAllApplications = async (req, res) => {
  try {
    const {
      status,
      scholarshipType,
      targetCountry,
      targetUniversity,
      intakeYear,
      nationality,
      search,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      order = 'desc'
    } = req.query;

    // Build query
    let query = { isActive: true };
    
    if (status) query.status = status;
    if (scholarshipType) query.scholarshipType = scholarshipType;
    if (targetCountry) query.targetCountry = targetCountry;
    if (targetUniversity) query.targetUniversity = targetUniversity;
    if (intakeYear) query.intakeYear = intakeYear;
    if (nationality) query.nationality = nationality;
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { applicationId: { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort
    const sort = {};
    sort[sortBy] = order === 'desc' ? -1 : 1;

    // Execute query with pagination
    const skip = (page - 1) * limit;
    
    const [applications, total] = await Promise.all([
      ScholarshipApplication.find(query)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .select('-documents -reviewerComments -statusHistory'),
      ScholarshipApplication.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      count: applications.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      data: applications.map(formatApplicationResponse)
    });
  } catch (error) {
    console.error('Get all applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching scholarship applications'
    });
  }
};

// Get all scholarship applications by email
exports.getApplicationsByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const {
      status,
      scholarshipType,
      targetCountry,
      targetUniversity,
      intakeYear,
      nationality,
      search,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      order = 'desc'
    } = req.query;

    // Build query
    let query = {
      isActive: true,
      email: email.toLowerCase()
    };

    if (status) query.status = status;
    if (scholarshipType) query.scholarshipType = scholarshipType;
    if (targetCountry) query.targetCountry = targetCountry;
    if (targetUniversity) query.targetUniversity = targetUniversity;
    if (intakeYear) query.intakeYear = intakeYear;
    if (nationality) query.nationality = nationality;

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { applicationId: { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort
    const sort = {};
    sort[sortBy] = order === 'desc' ? -1 : 1;

    // Execute query with pagination
    const skip = (page - 1) * limit;

    const [applications, total] = await Promise.all([
      ScholarshipApplication.find(query)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .select('-documents -reviewerComments -statusHistory'),
      ScholarshipApplication.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      count: applications.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      data: applications.map(formatApplicationResponse)
    });
  } catch (error) {
    console.error('Get applications by email error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching scholarship applications by email'
    });
  }
};

// Get single application by ID
exports.getApplicationById = async (req, res) => {
  try {
    const application = await ScholarshipApplication.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Scholarship application not found'
      });
    }

    res.status(200).json({
      success: true,
      data: formatApplicationResponse(application)
    });
  } catch (error) {
    console.error('Get application by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching scholarship application'
    });
  }
};

// Update application
exports.updateApplication = async (req, res) => {
  try {
    let application = await ScholarshipApplication.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Scholarship application not found'
      });
    }

    // Handle status changes
    const oldStatus = application.status;
    const newStatus = req.body.status;

    // Update application
    application = await ScholarshipApplication.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    // Send status update email if status changed
    if (newStatus && newStatus !== oldStatus) {
      await emailService.sendStatusUpdateNotification(application, oldStatus, newStatus);
    }

    res.status(200).json({
      success: true,
      message: 'Application updated successfully',
      data: formatApplicationResponse(application)
    });
  } catch (error) {
    console.error('Update application error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating application',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Delete application (soft delete)
exports.deleteApplication = async (req, res) => {
  try {
    const application = await ScholarshipApplication.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Scholarship application not found'
      });
    }

    // Soft delete
    application.isActive = false;
    await application.save();

    res.status(200).json({
      success: true,
      message: 'Application deleted successfully'
    });
  } catch (error) {
    console.error('Delete application error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting application'
    });
  }
};

// ======================================
// DOCUMENT MANAGEMENT OPERATIONS
// ======================================

// Upload document to application
exports.uploadDocument = async (req, res) => {
  try {
    const { documentType } = req.params;
    const application = await ScholarshipApplication.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Scholarship application not found'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // Define allowed document types
    const allowedTypes = [
      'transcripts',
      'passportCopy',
      'cvResume',
      'statementOfPurpose',
      'recommendationLetter',
      'languageCertificate',
      'researchProposal',
      'portfolio',
      'other'
    ];

    if (!allowedTypes.includes(documentType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid document type'
      });
    }

    // Upload to Cloudinary
    const folder = `scholarship/${documentType}`;
    const result = await uploadDocumentToCloudinary(req.file.path, folder);

    // Update application with document URL
    application.documents = application.documents || {};
    
    if (documentType === 'recommendationLetter') {
      application.documents.recommendationLetters = application.documents.recommendationLetters || [];
      application.documents.recommendationLetters.push({
        url: result.url,
        cloudinaryId: result.public_id,
        uploadedAt: new Date()
      });
    } else if (documentType === 'other') {
      application.documents.otherDocuments = application.documents.otherDocuments || [];
      application.documents.otherDocuments.push({
        name: req.file.originalname,
        url: result.url,
        cloudinaryId: result.public_id
      });
    } else {
      application.documents[documentType] = {
        url: result.url,
        cloudinaryId: result.public_id,
        uploadedAt: new Date()
      };
    }

    await application.save();

    // Clean up temporary file
    fs.unlinkSync(req.file.path);

    res.status(200).json({
      success: true,
      message: 'Document uploaded successfully',
      data: {
        documentType,
        url: result.url,
        publicId: result.public_id,
        size: result.bytes
      }
    });
  } catch (error) {
    console.error('Upload document error:', error);
    // Clean up temporary file if exists
    if (req.file && req.file.path) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({
      success: false,
      message: 'Error uploading document'
    });
  }
};

// Delete document from application
exports.deleteDocument = async (req, res) => {
  try {
    const { id, documentType, documentId } = req.params;
    const application = await ScholarshipApplication.findById(id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Scholarship application not found'
      });
    }

    let publicId = null;

    if (documentType === 'recommendationLetter') {
      // Find and remove recommendation letter
      const letterIndex = application.documents.recommendationLetters?.findIndex(
        letter => letter._id.toString() === documentId
      );
      
      if (letterIndex > -1) {
        publicId = application.documents.recommendationLetters[letterIndex].cloudinaryId;
        application.documents.recommendationLetters.splice(letterIndex, 1);
      }
    } else if (documentType === 'other') {
      // Find and remove other document
      const docIndex = application.documents.otherDocuments?.findIndex(
        doc => doc._id.toString() === documentId
      );
      
      if (docIndex > -1) {
        publicId = application.documents.otherDocuments[docIndex].cloudinaryId;
        application.documents.otherDocuments.splice(docIndex, 1);
      }
    } else {
      // Remove single document
      publicId = application.documents?.[documentType]?.cloudinaryId;
      application.documents[documentType] = null;
    }

    // Delete from Cloudinary
    if (publicId) {
      await deleteCloudinaryDocument(publicId);
    }

    await application.save();

    res.status(200).json({
      success: true,
      message: 'Document deleted successfully'
    });
  } catch (error) {
    console.error('Delete document error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting document'
    });
  }
};

// ======================================
// STATUS & REVIEW OPERATIONS
// ======================================

// Update application status
exports.updateStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;
    const application = await ScholarshipApplication.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Scholarship application not found'
      });
    }

    const oldStatus = application.status;
    application.status = status;
    
    // Add to status history
    application.statusHistory = application.statusHistory || [];
    application.statusHistory.push({
      status: status,
      changedBy: 'system',
      notes: notes || 'Status updated',
      changedAt: new Date()
    });
    
    await application.save();

    // Send notification email
    await emailService.sendStatusUpdateNotification(application, oldStatus, status);

    res.status(200).json({
      success: true,
      message: 'Application status updated successfully',
      data: {
        oldStatus,
        newStatus: status,
        applicationId: application.applicationId
      }
    });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating application status'
    });
  }
};

// Assign application to reviewer
exports.assignToReviewer = async (req, res) => {
  try {
    const { reviewerId } = req.body;
    const application = await ScholarshipApplication.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Scholarship application not found'
      });
    }

    application.assignedTo = reviewerId;
    await application.save();

    // Send assignment notification
    await emailService.sendAssignmentNotification(application, reviewerId);

    res.status(200).json({
      success: true,
      message: 'Application assigned to reviewer successfully',
      data: {
        applicationId: application.applicationId,
        assignedTo: reviewerId
      }
    });
  } catch (error) {
    console.error('Assign to reviewer error:', error);
    res.status(500).json({
      success: false,
      message: 'Error assigning application to reviewer'
    });
  }
};

// Add review comments
exports.addReviewComment = async (req, res) => {
  try {
    const { section, comment, score } = req.body;
    const application = await ScholarshipApplication.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Scholarship application not found'
      });
    }

    application.reviewerComments = application.reviewerComments || [];
    application.reviewerComments.push({
      reviewer: 'system',
      section,
      comment,
      score: score || 0,
      createdAt: new Date()
    });
    
    await application.save();

    res.status(200).json({
      success: true,
      message: 'Review comment added successfully'
    });
  } catch (error) {
    console.error('Add review comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding review comment'
    });
  }
};

// Update review scores
exports.updateReviewScores = async (req, res) => {
  try {
    const { academic, financial, essay, overall } = req.body;
    const application = await ScholarshipApplication.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Scholarship application not found'
      });
    }

    application.reviewScore = {
      academic: academic || 0,
      financial: financial || 0,
      essay: essay || 0,
      overall: overall || 0
    };
    
    await application.save();

    res.status(200).json({
      success: true,
      message: 'Review scores updated successfully',
      data: application.reviewScore
    });
  } catch (error) {
    console.error('Update review scores error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating review scores'
    });
  }
};

// Make final decision
exports.makeDecision = async (req, res) => {
  try {
    const { decision, notes, fundingAmount, currency, conditions } = req.body;
    const application = await ScholarshipApplication.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Scholarship application not found'
      });
    }

    // Update status based on decision
    const newStatus = decision === 'Approved' ? 'Approved' : 
                     decision === 'Conditionally Approved' ? 'Conditionally Approved' : 'Rejected';
    
    const oldStatus = application.status;
    application.status = newStatus;
    application.decision = {
      madeBy: 'system',
      madeAt: new Date(),
      notes,
      fundingAwarded: fundingAmount ? {
        amount: fundingAmount,
        currency: currency || 'USD',
        conditions: conditions || []
      } : null
    };
    
    application.statusHistory = application.statusHistory || [];
    application.statusHistory.push({
      status: newStatus,
      changedBy: 'system',
      notes: `Decision: ${decision} - ${notes || ''}`,
      changedAt: new Date()
    });
    
    await application.save();

    // Send decision notification
    await emailService.sendDecisionNotification(application, decision);

    res.status(200).json({
      success: true,
      message: `Application ${decision.toLowerCase()} successfully`,
      data: {
        decision,
        status: newStatus,
        applicationId: application.applicationId
      }
    });
  } catch (error) {
    console.error('Make decision error:', error);
    res.status(500).json({
      success: false,
      message: 'Error making decision'
    });
  }
};

// ======================================
// STATISTICS OPERATIONS
// ======================================

// Get application statistics
exports.getApplicationStatistics = async (req, res) => {
  try {
    const application = await ScholarshipApplication.findById(req.params.id)
      .select('status statusHistory reviewScore documents essay');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Scholarship application not found'
      });
    }

    const stats = {
      statusTimeline: application.statusHistory || [],
      reviewScores: application.reviewScore || {},
      documentStatus: {
        transcripts: !!application.documents?.transcripts?.url,
        passport: !!application.documents?.passportCopy?.url,
        cv: !!application.documents?.cvResume?.url,
        essay: application.essay?.status || 'Pending',
        recommendationLetters: application.documents?.recommendationLetters?.length || 0
      }
    };

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get application statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching application statistics'
    });
  }
};

// Get system-wide statistics
exports.getSystemStatistics = async (req, res) => {
  try {
    const [
      totalApplications,
      applicationsByStatus,
      applicationsByCountry
    ] = await Promise.all([
      ScholarshipApplication.countDocuments({ isActive: true }),
      ScholarshipApplication.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      ScholarshipApplication.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$targetCountry', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ])
    ]);

    const stats = {
      overview: {
        totalApplications,
        activeApplications: applicationsByStatus.reduce((sum, item) => 
          ['Submitted', 'Under Review', 'Shortlisted', 'Interview Scheduled'].includes(item._id) 
            ? sum + item.count 
            : sum, 0
        ),
        approvedApplications: applicationsByStatus.find(item => item._id === 'Approved')?.count || 0,
        rejectedApplications: applicationsByStatus.find(item => item._id === 'Rejected')?.count || 0
      },
      distribution: {
        byStatus: applicationsByStatus.reduce((acc, curr) => {
          acc[curr._id] = curr.count;
          return acc;
        }, {}),
        byCountry: applicationsByCountry.reduce((acc, curr) => {
          acc[curr._id] = curr.count;
          return acc;
        }, {})
      }
    };

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get system statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching system statistics'
    });
  }
};

// Send bulk email to applicants
exports.sendBulkEmailToApplicants = async (req, res) => {
  try {
    const { subject, message, statusFilter, scholarshipTypeFilter } = req.body;
    
    // Build query based on filters
    let query = { isActive: true };
    if (statusFilter) query.status = statusFilter;
    if (scholarshipTypeFilter) query.scholarshipType = scholarshipTypeFilter;
    
    const applications = await ScholarshipApplication.find(query)
      .select('firstName lastName email applicationId');
    
    if (applications.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No applicants found matching the criteria'
      });
    }
    
    const results = await emailService.sendBulkEmail(applications, subject, message);
    
    res.status(200).json({
      success: true,
      message: `Email sent to ${results.successCount} applicants`,
      data: results
    });
  } catch (error) {
    console.error('Bulk email error:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending bulk email'
    });
  }
};