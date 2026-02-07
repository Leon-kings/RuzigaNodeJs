
// const VisaService = require('../models/Visa');
// const mongoose = require('mongoose');
// const nodemailer = require('nodemailer');
// const cloudinary = require('cloudinary').v2;

// // Configure Cloudinary
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET
// });

// // Email Service Configuration
// const emailTransporter = nodemailer.createTransport({
//   host: process.env.SMTP_HOST || 'smtp.gmail.com',
//   port: process.env.SMTP_PORT || 587,
//   secure: process.env.SMTP_SECURE === 'true',
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASS
//   }
// });

// // Email Templates
// const emailTemplates = {
//   bookingConfirmation: (bookingData) => ({
//     subject: `Booking Confirmation - ${bookingData.serviceId}`,
//     html: `
//       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//         <h2 style="color: #2c3e50;">Visa Consultation Booking Confirmed</h2>
//         <p>Dear ${bookingData.customer.personalInfo.fullName},</p>
//         <p>Your visa consultation booking has been confirmed with the following details:</p>
        
//         <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
//           <h3 style="color: #3498db;">Booking Details</h3>
//           <p><strong>Booking ID:</strong> ${bookingData.serviceId}</p>
//           <p><strong>Appointment Date:</strong> ${new Date(bookingData.bookingDetails.appointment.date).toLocaleDateString()}</p>
//           <p><strong>Time Slot:</strong> ${bookingData.bookingDetails.appointment.timeSlot}</p>
//           <p><strong>Mode:</strong> ${bookingData.bookingDetails.appointment.mode}</p>
//           ${bookingData.bookingDetails.appointment.location ? `<p><strong>Location:</strong> ${bookingData.bookingDetails.appointment.location}</p>` : ''}
//         </div>
        
//         <p>Please make sure to prepare the following for your appointment:</p>
//         <ul>
//           <li>Original Passport</li>
//           <li>Passport-sized photographs</li>
//           <li>Previous visa documents (if any)</li>
//         </ul>
        
//         <p>If you need to reschedule or cancel, please contact us at least 24 hours in advance.</p>
        
//         <hr style="margin: 30px 0;">
//         <p style="color: #7f8c8d; font-size: 12px;">
//           This is an automated email. Please do not reply to this address.
//         </p>
//       </div>
//     `
//   }),

//   applicationSubmitted: (applicationData) => ({
//     subject: `Visa Application Submitted - ${applicationData.trackingNumber}`,
//     html: `
//       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//         <h2 style="color: #2c3e50;">Visa Application Submitted</h2>
//         <p>Dear ${applicationData.customer.personalInfo.fullName},</p>
//         <p>Your visa application has been successfully submitted with the following details:</p>
        
//         <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
//           <h3 style="color: #3498db;">Application Details</h3>
//           <p><strong>Tracking Number:</strong> ${applicationData.trackingNumber}</p>
//           <p><strong>Destination:</strong> ${applicationData.applicationDetails.visaInfo.destinationCountry}</p>
//           <p><strong>Visa Type:</strong> ${applicationData.applicationDetails.visaInfo.visaType}</p>
//           <p><strong>Current Status:</strong> ${applicationData.applicationDetails.applicationStatus.current}</p>
//           <p><strong>Estimated Processing Time:</strong> ${applicationData.applicationDetails.servicePackage.processingTime}</p>
//         </div>
        
//         <p>You can track your application status using your tracking number on our website.</p>
//         <p>We will notify you via email when there are any updates to your application.</p>
        
//         <hr style="margin: 30px 0;">
//         <p style="color: #7f8c8d; font-size: 12px;">
//           This is an automated email. Please do not reply to this address.
//         </p>
//       </div>
//     `
//   }),

//   statusUpdate: (applicationData, newStatus) => ({
//     subject: `Status Update - ${applicationData.trackingNumber}`,
//     html: `
//       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//         <h2 style="color: #2c3e50;">Application Status Update</h2>
//         <p>Dear ${applicationData.customer.personalInfo.fullName},</p>
//         <p>The status of your visa application has been updated:</p>
        
//         <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
//           <h3 style="color: #3498db;">Updated Status</h3>
//           <p><strong>Tracking Number:</strong> ${applicationData.trackingNumber}</p>
//           <p><strong>New Status:</strong> ${newStatus}</p>
//           <p><strong>Updated Date:</strong> ${new Date().toLocaleDateString()}</p>
//         </div>
        
//         <p>Next Steps: ${applicationData.nextActionRequired || 'No action required at this time'}</p>
        
//         <p>If you have any questions, please contact our support team.</p>
        
//         <hr style="margin: 30px 0;">
//         <p style="color: #7f8c8d; font-size: 12px;">
//           This is an automated email. Please do not reply to this address.
//         </p>
//       </div>
//     `
//   }),

//   paymentConfirmation: (applicationData, paymentDetails) => ({
//     subject: `Payment Received - ${applicationData.trackingNumber}`,
//     html: `
//       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//         <h2 style="color: #2c3e50;">Payment Confirmation</h2>
//         <p>Dear ${applicationData.customer.personalInfo.fullName},</p>
//         <p>We have received your payment for visa application services:</p>
        
//         <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
//           <h3 style="color: #3498db;">Payment Details</h3>
//           <p><strong>Transaction ID:</strong> ${paymentDetails.transactionId}</p>
//           <p><strong>Amount Paid:</strong> ${paymentDetails.amount} ${applicationData.applicationDetails.fees.currency}</p>
//           <p><strong>Payment Method:</strong> ${paymentDetails.method}</p>
//           <p><strong>Payment Date:</strong> ${new Date(paymentDetails.date).toLocaleDateString()}</p>
//           <p><strong>Balance Due:</strong> ${applicationData.balanceDue || 0} ${applicationData.applicationDetails.fees.currency}</p>
//         </div>
        
//         <p>Your application will now proceed to the next stage.</p>
        
//         <hr style="margin: 30px 0;">
//         <p style="color: #7f8c8d; font-size: 12px;">
//           This is an automated email. Please do not reply to this address.
//         </p>
//       </div>
//     `
//   }),

//   documentUploadConfirmation: (applicationData, documentType) => ({
//     subject: `Document Received - ${applicationData.trackingNumber}`,
//     html: `
//       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//         <h2 style="color: #2c3e50;">Document Upload Confirmation</h2>
//         <p>Dear ${applicationData.customer.personalInfo.fullName},</p>
//         <p>We have successfully received your ${documentType} for visa application:</p>
        
//         <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
//           <h3 style="color: #3498db;">Upload Details</h3>
//           <p><strong>Tracking Number:</strong> ${applicationData.trackingNumber}</p>
//           <p><strong>Document Type:</strong> ${documentType}</p>
//           <p><strong>Upload Date:</strong> ${new Date().toLocaleDateString()}</p>
//           <p><strong>Documents Uploaded:</strong> ${applicationData.totalDocuments || 0}</p>
//           <p><strong>Documents Verified:</strong> ${applicationData.verifiedDocuments || 0}</p>
//         </div>
        
//         <p>Our team will review your document and update the verification status.</p>
        
//         <hr style="margin: 30px 0;">
//         <p style="color: #7f8c8d; font-size: 12px;">
//           This is an automated email. Please do not reply to this address.
//         </p>
//       </div>
//     `
//   })
// };

// // Helper function to send emails
// const sendEmail = async (to, template, data) => {
//   try {
//     const emailTemplate = emailTemplates[template](data);
//     const mailOptions = {
//       from: process.env.EMAIL_FROM || 'visa-services@example.com',
//       to,
//       subject: emailTemplate.subject,
//       html: emailTemplate.html
//     };

//     await emailTransporter.sendMail(mailOptions);
//     return { success: true, message: 'Email sent successfully' };
//   } catch (error) {
//     console.error('Email sending error:', error);
//     return { success: false, message: 'Failed to send email', error: error.message };
//   }
// };

// // Helper function to upload to Cloudinary
// const uploadToCloudinary = async (file, folder = 'visa_documents') => {
//   try {
//     const result = await cloudinary.uploader.upload(file.path || file.buffer.toString('base64'), {
//       folder: folder,
//       resource_type: 'auto',
//       transformation: [
//         { quality: 'auto:good' },
//         { fetch_format: 'auto' }
//       ]
//     });

//     return {
//       success: true,
//       cloudinaryUrl: result.secure_url,
//       publicId: result.public_id,
//       originalName: file.originalname
//     };
//   } catch (error) {
//     console.error('Cloudinary upload error:', error);
//     return { success: false, message: 'Failed to upload to Cloudinary', error: error.message };
//   }
// };

// // Helper function to delete from Cloudinary
// const deleteFromCloudinary = async (publicId) => {
//   try {
//     await cloudinary.uploader.destroy(publicId);
//     return { success: true, message: 'File deleted from Cloudinary' };
//   } catch (error) {
//     console.error('Cloudinary delete error:', error);
//     return { success: false, message: 'Failed to delete from Cloudinary', error: error.message };
//   }
// };

// // Statistics Helper Functions
// const calculateStatistics = async (filters = {}) => {
//   try {
//     const matchStage = {};
    
//     // Apply filters
//     if (filters.startDate && filters.endDate) {
//       matchStage.createdAt = {
//         $gte: new Date(filters.startDate),
//         $lte: new Date(filters.endDate)
//       };
//     }
    
//     if (filters.agentId) {
//       matchStage['internal.assignedTo.agentId'] = new mongoose.Types.ObjectId(filters.agentId);
//     }
    
//     if (filters.destinationCountry) {
//       matchStage['applicationDetails.visaInfo.destinationCountry'] = filters.destinationCountry;
//     }
    
//     if (filters.visaType) {
//       matchStage['applicationDetails.visaInfo.visaType'] = filters.visaType;
//     }

//     const stats = await VisaService.aggregate([
//       { $match: matchStage },
//       {
//         $facet: {
//           // Overall counts
//           overview: [
//             {
//               $group: {
//                 _id: null,
//                 totalBookings: {
//                   $sum: { $cond: [{ $eq: ['$serviceType', 'booking'] }, 1, 0] }
//                 },
//                 totalApplications: {
//                   $sum: { $cond: [{ $eq: ['$serviceType', 'application'] }, 1, 0] }
//                 },
//                 totalCombined: {
//                   $sum: { $cond: [{ $eq: ['$serviceType', 'combined'] }, 1, 0] }
//                 },
//                 totalRevenue: {
//                   $sum: {
//                     $add: [
//                       '$bookingDetails.bookingAmount',
//                       '$applicationDetails.fees.totalAmount'
//                     ]
//                   }
//                 },
//                 totalPendingPayments: {
//                   $sum: {
//                     $cond: [
//                       {
//                         $in: [
//                           '$applicationDetails.payment.status',
//                           ['pending', 'partial']
//                         ]
//                       },
//                       '$applicationDetails.fees.totalAmount',
//                       0
//                     ]
//                   }
//                 }
//               }
//             }
//           ],

//           // Status breakdown
//           statusBreakdown: [
//             {
//               $group: {
//                 _id: '$applicationDetails.applicationStatus.current',
//                 count: { $sum: 1 },
//                 averageProcessingDays: {
//                   $avg: {
//                     $cond: [
//                       '$applicationDetails.applicationStatus.actualCompletionDate',
//                       {
//                         $divide: [
//                           {
//                             $subtract: [
//                               '$applicationDetails.applicationStatus.actualCompletionDate',
//                               '$applicationDetails.applicationStatus.submittedAt'
//                             ]
//                           },
//                           1000 * 60 * 60 * 24
//                         ]
//                       },
//                       null
//                     ]
//                   }
//                 }
//               }
//             },
//             { $sort: { count: -1 } }
//           ],

//           // Destination country breakdown
//           destinationBreakdown: [
//             {
//               $group: {
//                 _id: '$applicationDetails.visaInfo.destinationCountry',
//                 count: { $sum: 1 },
//                 approved: {
//                   $sum: {
//                     $cond: [
//                       { $eq: ['$applicationDetails.applicationStatus.current', 'approved'] },
//                       1,
//                       0
//                     ]
//                   }
//                 },
//                 rejected: {
//                   $sum: {
//                     $cond: [
//                       { $eq: ['$applicationDetails.applicationStatus.current', 'rejected'] },
//                       1,
//                       0
//                     ]
//                   }
//                 },
//                 avgProcessingTime: {
//                   $avg: {
//                     $cond: [
//                       '$applicationDetails.applicationStatus.actualCompletionDate',
//                       {
//                         $divide: [
//                           {
//                             $subtract: [
//                               '$applicationDetails.applicationStatus.actualCompletionDate',
//                               '$applicationDetails.applicationStatus.submittedAt'
//                             ]
//                           },
//                           1000 * 60 * 60 * 24
//                         ]
//                       },
//                       null
//                     ]
//                   }
//                 }
//               }
//             },
//             { $sort: { count: -1 } },
//             { $limit: 10 }
//           ],

//           // Visa type breakdown
//           visaTypeBreakdown: [
//             {
//               $group: {
//                 _id: '$applicationDetails.visaInfo.visaType',
//                 count: { $sum: 1 },
//                 successRate: {
//                   $avg: {
//                     $cond: [
//                       { $eq: ['$applicationDetails.applicationStatus.current', 'approved'] },
//                       100,
//                       0
//                     ]
//                   }
//                 },
//                 avgFee: { $avg: '$applicationDetails.fees.totalAmount' }
//               }
//             },
//             { $sort: { count: -1 } }
//           ],

//           // Monthly trends
//           monthlyTrends: [
//             {
//               $group: {
//                 _id: {
//                   year: { $year: '$createdAt' },
//                   month: { $month: '$createdAt' }
//                 },
//                 count: { $sum: 1 },
//                 revenue: {
//                   $sum: {
//                     $add: [
//                       '$bookingDetails.bookingAmount',
//                       '$applicationDetails.fees.totalAmount'
//                     ]
//                   }
//                 },
//                 applications: {
//                   $sum: { $cond: [{ $ne: ['$serviceType', 'booking'] }, 1, 0] }
//                 }
//               }
//             },
//             { $sort: { '_id.year': 1, '_id.month': 1 } },
//             { $limit: 12 }
//           ],

//           // Agent performance
//           agentPerformance: [
//             {
//               $match: {
//                 'internal.assignedTo.agentId': { $exists: true, $ne: null }
//               }
//             },
//             {
//               $group: {
//                 _id: '$internal.assignedTo.agentId',
//                 agentName: { $first: '$internal.assignedTo.agentName' },
//                 totalAssigned: { $sum: 1 },
//                 completed: {
//                   $sum: {
//                     $cond: [
//                       {
//                         $in: [
//                           '$applicationDetails.applicationStatus.current',
//                           ['approved', 'visa-printed', 'collected']
//                         ]
//                       },
//                       1,
//                       0
//                     ]
//                   }
//                 },
//                 pending: {
//                   $sum: {
//                     $cond: [
//                       {
//                         $in: [
//                           '$applicationDetails.applicationStatus.current',
//                           ['pending', 'processing']
//                         ]
//                       },
//                       1,
//                       0
//                     ]
//                   }
//                 },
//                 avgCompletionTime: {
//                   $avg: {
//                     $cond: [
//                       '$applicationDetails.applicationStatus.actualCompletionDate',
//                       {
//                         $divide: [
//                           {
//                             $subtract: [
//                               '$applicationDetails.applicationStatus.actualCompletionDate',
//                               '$createdAt'
//                             ]
//                           },
//                           1000 * 60 * 60 * 24
//                         ]
//                       },
//                       null
//                     ]
//                   }
//                 },
//                 totalRevenue: {
//                   $sum: '$applicationDetails.fees.totalAmount'
//                 }
//               }
//             },
//             { $sort: { totalAssigned: -1 } }
//           ],

//           // Payment statistics
//           paymentStats: [
//             {
//               $group: {
//                 _id: '$applicationDetails.payment.status',
//                 count: { $sum: 1 },
//                 totalAmount: { $sum: '$applicationDetails.fees.totalAmount' },
//                 totalCollected: { $sum: '$applicationDetails.payment.amountPaid' },
//                 avgCollectionTime: {
//                   $avg: {
//                     $cond: [
//                       '$applicationDetails.payment.paymentHistory',
//                       {
//                         $divide: [
//                           {
//                             $subtract: [
//                               { $arrayElemAt: ['$applicationDetails.payment.paymentHistory.date', -1] },
//                               '$createdAt'
//                             ]
//                           },
//                           1000 * 60 * 60 * 24
//                         ]
//                       },
//                       null
//                     ]
//                   }
//                 }
//               }
//             }
//           ],

//           // Document statistics
//           documentStats: [
//             {
//               $project: {
//                 totalDocuments: {
//                   $add: [
//                     { $cond: [{ $ifNull: ['$documents.photograph.cloudinaryUrl', false] }, 1, 0] },
//                     { $cond: [{ $ifNull: ['$documents.passportCopy.cloudinaryUrl', false] }, 1, 0] },
//                     { $size: { $ifNull: ['$documents.financialDocuments', []] } },
//                     { $size: { $ifNull: ['$documents.travelDocuments', []] } },
//                     { $size: { $ifNull: ['$documents.supportingDocuments', []] } },
//                     { $size: { $ifNull: ['$documents.otherDocuments', []] } }
//                   ]
//                 },
//                 verifiedDocuments: {
//                   $add: [
//                     { $cond: ['$documents.photograph.verified', 1, 0] },
//                     { $cond: ['$documents.passportCopy.verified', 1, 0] },
//                     {
//                       $size: {
//                         $filter: {
//                           input: { $ifNull: ['$documents.financialDocuments', []] },
//                           as: 'doc',
//                           cond: '$$doc.verified'
//                         }
//                       }
//                     },
//                     {
//                       $size: {
//                         $filter: {
//                           input: { $ifNull: ['$documents.travelDocuments', []] },
//                           as: 'doc',
//                           cond: '$$doc.verified'
//                         }
//                       }
//                     },
//                     {
//                       $size: {
//                         $filter: {
//                           input: { $ifNull: ['$documents.supportingDocuments', []] },
//                           as: 'doc',
//                           cond: '$$doc.verified'
//                         }
//                       }
//                     },
//                     {
//                       $size: {
//                         $filter: {
//                           input: { $ifNull: ['$documents.otherDocuments', []] },
//                           as: 'doc',
//                           cond: '$$doc.verified'
//                         }
//                       }
//                     }
//                   ]
//                 }
//               }
//             },
//             {
//               $group: {
//                 _id: null,
//                 avgDocumentsPerApplication: { $avg: '$totalDocuments' },
//                 avgVerificationRate: {
//                   $avg: {
//                     $cond: [
//                       { $gt: ['$totalDocuments', 0] },
//                       { $divide: ['$verifiedDocuments', '$totalDocuments'] },
//                       0
//                     ]
//                   }
//                 },
//                 applicationsWithAllDocuments: {
//                   $sum: {
//                     $cond: [
//                       { $gte: ['$totalDocuments', 5] },
//                       1,
//                       0
//                     ]
//                   }
//                 }
//               }
//             }
//           ]
//         }
//       }
//     ]);

//     return stats[0]; // Return the first element of the facet result
//   } catch (error) {
//     console.error('Statistics calculation error:', error);
//     throw error;
//   }
// };

// // ========== BOOKING CONTROLLERS ==========

// const BookingController = {
//   // Create a new booking
// // controllers/visaServiceController.js


// createBooking: async (req, res, next) => {
//   try {
//     const {
//       customer,
//       bookingDetails,
//       applicationDetails,
//       internal
//     } = req.body;

//     // Validate request body
//     if (!customer) {
//       return res.status(400).json({
//         success: false,
//         message: 'Customer information is required'
//       });
//     }

//     // Validate required customer fields
//     const requiredCustomerFields = [
//       { path: 'customer.personalInfo.fullName', message: 'Customer full name is required' },
//       { path: 'customer.personalInfo.dateOfBirth', message: 'Customer date of birth is required' },
//       { path: 'customer.personalInfo.nationality', message: 'Customer nationality is required' },
//       { path: 'customer.personalInfo.countryOfResidence', message: 'Customer country of residence is required' },
//       { path: 'customer.contactInfo.email', message: 'Customer email is required' },
//       { path: 'customer.contactInfo.primaryPhone', message: 'Customer primary phone is required' }
//     ];

//     for (const field of requiredCustomerFields) {
//       const value = field.path.split('.').reduce((obj, key) => obj?.[key], req.body);
//       if (!value) {
//         return res.status(400).json({
//           success: false,
//           message: field.message
//         });
//       }
//     }

//     // Validate email format
//     const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
//     if (!emailRegex.test(customer.contactInfo.email)) {
//       return res.status(400).json({
//         success: false,
//         message: 'Please provide a valid email address'
//       });
//     }

//     // Ensure previousVisaDetails is array of objects
//     if (customer?.passportInfo?.previousVisaDetails) {
//       if (!Array.isArray(customer.passportInfo.previousVisaDetails)) {
//         return res.status(400).json({
//           success: false,
//           message: 'previousVisaDetails must be an array of objects'
//         });
//       }
      
//       // Validate each visa detail object
//       for (const visaDetail of customer.passportInfo.previousVisaDetails) {
//         if (!visaDetail.country || !visaDetail.type) {
//           return res.status(400).json({
//             success: false,
//             message: 'Each visa detail must have country and type'
//           });
//         }
//       }
//     }

//     // Validate bookingDetails if provided
//     if (bookingDetails) {
//       if (bookingDetails.bookingAmount && (isNaN(bookingDetails.bookingAmount) || bookingDetails.bookingAmount < 0)) {
//         return res.status(400).json({
//           success: false,
//           message: 'Booking amount must be a positive number'
//         });
//       }

//       // Validate appointment date if provided
//       if (bookingDetails.appointment?.date) {
//         const appointmentDate = new Date(bookingDetails.appointment.date);
//         if (isNaN(appointmentDate.getTime())) {
//           return res.status(400).json({
//             success: false,
//             message: 'Invalid appointment date format'
//           });
//         }
        
//         // Don't allow past dates for appointments
//         const now = new Date();
//         if (appointmentDate < now) {
//           return res.status(400).json({
//             success: false,
//             message: 'Appointment date cannot be in the past'
//           });
//         }
//       }
//     }

//     // Prepare booking data
//     const bookingData = {
//       serviceType: 'booking',
//       serviceStage: 'booking-pending',
//       customer: {
//         personalInfo: {
//           fullName: customer.personalInfo.fullName.trim(),
//           dateOfBirth: new Date(customer.personalInfo.dateOfBirth),
//           gender: customer.personalInfo.gender || 'prefer-not-to-say',
//           nationality: customer.personalInfo.nationality,
//           countryOfResidence: customer.personalInfo.countryOfResidence,
//           maritalStatus: customer.personalInfo.maritalStatus || 'single',
//           occupation: customer.personalInfo.occupation,
//           employer: customer.personalInfo.employer
//         },
//         contactInfo: {
//           email: customer.contactInfo.email.toLowerCase().trim(),
//           primaryPhone: customer.contactInfo.primaryPhone,
//           secondaryPhone: customer.contactInfo.secondaryPhone,
//           whatsappNumber: customer.contactInfo.whatsappNumber,
//           address: customer.contactInfo.address,
//           emergencyContact: customer.contactInfo.emergencyContact
//         },
//         passportInfo: {
//           passportNumber: customer.passportInfo?.passportNumber,
//           issuingCountry: customer.passportInfo?.issuingCountry,
//           issueDate: customer.passportInfo?.issueDate ? new Date(customer.passportInfo.issueDate) : undefined,
//           expiryDate: customer.passportInfo?.expiryDate ? new Date(customer.passportInfo.expiryDate) : undefined,
//           placeOfIssue: customer.passportInfo?.placeOfIssue,
//           hasPreviousVisas: customer.passportInfo?.hasPreviousVisas || false,
//           previousVisaDetails: customer.passportInfo?.previousVisaDetails || []
//         }
//       },
//       bookingDetails: {
//         type: bookingDetails?.type || 'consultation',
//         serviceRequested: bookingDetails?.serviceRequested,
//         appointment: bookingDetails?.appointment ? {
//           date: bookingDetails.appointment.date ? new Date(bookingDetails.appointment.date) : undefined,
//           timeSlot: bookingDetails.appointment.timeSlot,
//           duration: bookingDetails.appointment.duration || 60,
//           mode: bookingDetails.appointment.mode || 'in-person',
//           location: bookingDetails.appointment.location,
//           address: bookingDetails.appointment.address,
//           confirmed: bookingDetails.appointment.confirmed || false,
//           attended: bookingDetails.appointment.attended || false,
//           notes: bookingDetails.appointment.notes
//         } : undefined,
//         bookingStatus: bookingDetails?.bookingStatus || 'pending',
//         bookingAmount: bookingDetails?.bookingAmount || 0,
//         bookingPayment: bookingDetails?.bookingPayment ? {
//           status: bookingDetails.bookingPayment.status || 'pending',
//           method: bookingDetails.bookingPayment.method,
//           transactionId: bookingDetails.bookingPayment.transactionId,
//           paidAt: bookingDetails.bookingPayment.paidAt ? new Date(bookingDetails.bookingPayment.paidAt) : undefined
//         } : undefined
//       },
//       applicationDetails: {
//         visaInfo: {
//           destinationCountry: 'Not Applicable',
//           visaType: 'Tourist',
//           purposeOfTravel: 'Not Applicable'
//         },
//         applicationStatus: {
//           current: 'not-started'
//         },
//         fees: {
//           totalAmount: 0,
//           currency: 'USD'
//         },
//         payment: {
//           status: 'pending',
//           amountPaid: 0
//         }
//       },
//       internal: {
//         assignedTo: internal?.assignedTo ? {
//           agentId: internal.assignedTo.agentId,
//           agentName: internal.assignedTo.agentName,
//           agentEmail: internal.assignedTo.agentEmail,
//           department: internal.assignedTo.department,
//           assignedAt: internal.assignedTo.assignedAt ? new Date(internal.assignedTo.assignedAt) : new Date(),
//           lastContacted: internal.assignedTo.lastContacted ? new Date(internal.assignedTo.lastContacted) : undefined
//         } : undefined,
//         priority: internal?.priority || 'normal',
//         source: internal?.source || 'website',
//         tags: internal?.tags || [],
//         notes: internal?.notes || [],
//         followUp: internal?.followUp
//       }
//     };

//     // If applicationDetails are provided in the request, merge them
//     if (applicationDetails) {
//       bookingData.applicationDetails = {
//         ...bookingData.applicationDetails,
//         servicePackage: applicationDetails.servicePackage,
//         embassyInfo: applicationDetails.embassyInfo,
//         visaIssuance: applicationDetails.visaIssuance
//       };
//     }

//     // Create the booking
//     const newBooking = new VisaService(bookingData);

//     // Save the booking
//     await newBooking.save();

//     // Send confirmation email (optional)
//     if (typeof sendEmail === 'function') {
//       try {
//         await sendEmail(
//           newBooking.customer.contactInfo.email,
//           'bookingConfirmation',
//           newBooking.toObject()
//         );
//       } catch (emailError) {
//         console.warn('Email sending failed, but booking was created:', emailError.message);
//       }
//     }

//     // Prepare response (exclude sensitive/unnecessary data)
//     const responseBooking = newBooking.toObject();
//     delete responseBooking.__v;
//     if (responseBooking.auditLog) delete responseBooking.auditLog;
//     if (responseBooking.communications) delete responseBooking.communications;
//     if (responseBooking.internal?.notes) delete responseBooking.internal.notes;

//     res.status(201).json({
//       success: true,
//       message: 'Booking created successfully',
//       data: {
//         booking: responseBooking,
//         nextSteps: [
//           'Confirm the appointment date and time',
//           'Share appointment details with the customer',
//           'Prepare consultation materials'
//         ],
//         trackingInfo: {
//           serviceId: newBooking.serviceId,
//           nextAction: newBooking.nextActionRequired,
//           status: newBooking.bookingDetails.bookingStatus
//         }
//       }
//     });

//   } catch (error) {
//     console.error('Create booking error:', error);
    
//     // Pass the error to the next middleware (error handler)
//     if (typeof next === 'function') {
//       next(error);
//     } else {
//       // Fallback error handling if next is not available
//       // Handle validation errors
//       if (error.name === 'ValidationError') {
//         const errors = {};
//         Object.keys(error.errors).forEach(key => {
//           errors[key] = error.errors[key].message;
//         });
        
//         return res.status(400).json({
//           success: false,
//           message: 'Validation failed',
//           errors: errors
//         });
//       }
      
//       // Handle duplicate key errors
//       if (error.code === 11000) {
//         const field = Object.keys(error.keyPattern)[0];
//         return res.status(400).json({
//           success: false,
//           message: `Duplicate value for ${field}`,
//           field: field,
//           value: error.keyValue[field]
//         });
//       }
      
//       // Generic error
//       res.status(500).json({
//         success: false,
//         message: 'Failed to create booking',
//         error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
//       });
//     }
//   }
// },

//   // Update booking
//   updateBooking: async (req, res) => {
//     try {
//       const { bookingId } = req.params;
//       const updateData = req.body;

//       const booking = await VisaService.findOne({ serviceId: bookingId, serviceType: { $in: ['booking', 'combined'] } });

//       if (!booking) {
//         return res.status(404).json({
//           success: false,
//           message: 'Booking not found'
//         });
//       }

//       // Update booking
//       Object.keys(updateData).forEach(key => {
//         if (key !== 'serviceId' && key !== 'trackingNumber') {
//           booking[key] = updateData[key];
//         }
//       });

//       await booking.save();

//       res.json({
//         success: true,
//         message: 'Booking updated successfully',
//         data: booking
//       });
//     } catch (error) {
//       console.error('Update booking error:', error);
//       res.status(500).json({
//         success: false,
//         message: 'Failed to update booking',
//         error: error.message
//       });
//     }
//   },

//   // Schedule appointment
//   scheduleAppointment: async (req, res) => {
//     try {
//       const { bookingId } = req.params;
//       const { appointmentData } = req.body;

//       const booking = await VisaService.findOne({ serviceId: bookingId, serviceType: { $in: ['booking', 'combined'] } });

//       if (!booking) {
//         return res.status(404).json({
//           success: false,
//           message: 'Booking not found'
//         });
//       }

//       // Schedule appointment using instance method
//       await booking.scheduleAppointment(appointmentData);

//       // Send confirmation email
//       await sendEmail(
//         booking.customer.contactInfo.email,
//         'bookingConfirmation',
//         booking
//       );

//       res.json({
//         success: true,
//         message: 'Appointment scheduled successfully',
//         data: {
//           appointmentDate: booking.bookingDetails.appointment.date,
//           timeSlot: booking.bookingDetails.appointment.timeSlot,
//           status: booking.bookingDetails.bookingStatus
//         }
//       });
//     } catch (error) {
//       console.error('Schedule appointment error:', error);
//       res.status(500).json({
//         success: false,
//         message: 'Failed to schedule appointment',
//         error: error.message
//       });
//     }
//   },

//   // Convert booking to application
//   convertToApplication: async (req, res) => {
//     try {
//       const { bookingId } = req.params;
//       const { applicationDetails } = req.body;

//       const booking = await VisaService.findOne({ serviceId: bookingId });

//       if (!booking) {
//         return res.status(404).json({
//           success: false,
//           message: 'Booking not found'
//         });
//       }

//       // Update application details if provided
//       if (applicationDetails) {
//         booking.applicationDetails = { ...booking.applicationDetails, ...applicationDetails };
//       }

//       // Convert to application using instance method
//       await booking.convertToApplication();

//       // Send application submitted email
//       await sendEmail(
//         booking.customer.contactInfo.email,
//         'applicationSubmitted',
//         booking
//       );

//       res.json({
//         success: true,
//         message: 'Booking converted to application successfully',
//         data: {
//           trackingNumber: booking.trackingNumber,
//           applicationStatus: booking.applicationDetails.applicationStatus.current,
//           nextAction: booking.nextActionRequired
//         }
//       });
//     } catch (error) {
//       console.error('Convert to application error:', error);
//       res.status(500).json({
//         success: false,
//         message: 'Failed to convert booking to application',
//         error: error.message
//       });
//     }
//   },

//   // Get all bookings with advanced filtering
//   getAllBookings: async (req, res) => {
//     try {
//       const {
//         page = 1,
//         limit = 20,
//         sortBy = 'createdAt',
//         sortOrder = 'desc',
//         status,
//         bookingType,
//         dateFrom,
//         dateTo,
//         customerName,
//         email,
//         agentId,
//         source,
//         hasAppointment,
//         confirmedOnly = false,
//         serviceType = 'booking'
//       } = req.query;

//       const skip = (parseInt(page) - 1) * parseInt(limit);
      
//       // Build query for bookings only
//       const query = { serviceType: serviceType };
      
//       // Apply filters
//       if (status) {
//         query['bookingDetails.bookingStatus'] = status;
//       }
      
//       if (bookingType) {
//         query['bookingDetails.type'] = bookingType;
//       }
      
//       if (dateFrom || dateTo) {
//         query.createdAt = {};
//         if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
//         if (dateTo) query.createdAt.$lte = new Date(dateTo);
//       }
      
//       if (customerName) {
//         query['customer.personalInfo.fullName'] = { 
//           $regex: customerName, 
//           $options: 'i' 
//         };
//       }
      
//       if (email) {
//         query['customer.contactInfo.email'] = { 
//           $regex: email, 
//           $options: 'i' 
//         };
//       }
      
//       if (agentId) {
//         query['internal.assignedTo.agentId'] = new mongoose.Types.ObjectId(agentId);
//       }
      
//       if (source) {
//         query['internal.source'] = source;
//       }
      
//       if (hasAppointment === 'true') {
//         query['bookingDetails.appointment.date'] = { $exists: true, $ne: null };
//       } else if (hasAppointment === 'false') {
//         query['bookingDetails.appointment.date'] = null;
//       }
      
//       if (confirmedOnly === 'true') {
//         query['bookingDetails.bookingStatus'] = 'confirmed';
//         query['bookingDetails.appointment.confirmed'] = true;
//       }

//       // Determine sort order
//       const sort = {};
//       sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

//       // Get bookings with pagination
//       const [bookings, total] = await Promise.all([
//         VisaService.find(query)
//           .sort(sort)
//           .skip(skip)
//           .limit(parseInt(limit))
//           .select('-documents -communications -statusHistory -auditLog')
//           .lean(),
//         VisaService.countDocuments(query)
//       ]);

//       // Calculate additional statistics for the current result set
//       const upcomingAppointments = bookings.filter(booking => 
//         booking.bookingDetails?.appointment?.date && 
//         new Date(booking.bookingDetails.appointment.date) > new Date()
//       ).length;

//       const confirmedAppointments = bookings.filter(booking => 
//         booking.bookingDetails?.appointment?.confirmed === true
//       ).length;

//       const totalRevenue = bookings.reduce((sum, booking) => 
//         sum + (booking.bookingDetails?.bookingAmount || 0), 0
//       );

//       res.json({
//         success: true,
//         data: {
//           bookings,
//           pagination: {
//             page: parseInt(page),
//             limit: parseInt(limit),
//             total,
//             totalPages: Math.ceil(total / parseInt(limit)),
//             hasNextPage: (page * limit) < total,
//             hasPrevPage: page > 1
//           },
//           statistics: {
//             totalBookings: total,
//             upcomingAppointments,
//             confirmedAppointments,
//             pendingConfirmations: bookings.filter(b => b.bookingDetails?.bookingStatus === 'pending').length,
//             completedBookings: bookings.filter(b => b.bookingDetails?.bookingStatus === 'completed').length,
//             cancelledBookings: bookings.filter(b => b.bookingDetails?.bookingStatus === 'cancelled').length,
//             totalRevenue
//           },
//           filtersApplied: Object.keys(req.query).filter(key => 
//             !['page', 'limit', 'sortBy', 'sortOrder'].includes(key)
//           )
//         }
//       });
//     } catch (error) {
//       console.error('Get all bookings error:', error);
//       res.status(500).json({
//         success: false,
//         message: 'Failed to retrieve bookings',
//         error: error.message
//       });
//     }
//   },

//   // Get booking by ID
//   getBookingById: async (req, res) => {
//     try {
//       const { bookingId } = req.params;
      
//       const booking = await VisaService.findOne({ 
//         serviceId: bookingId,
//         serviceType: { $in: ['booking', 'combined'] }
//       });

//       if (!booking) {
//         return res.status(404).json({
//           success: false,
//           message: 'Booking not found'
//         });
//       }

//       res.json({
//         success: true,
//         data: booking
//       });
//     } catch (error) {
//       console.error('Get booking by ID error:', error);
//       res.status(500).json({
//         success: false,
//         message: 'Failed to retrieve booking',
//         error: error.message
//       });
//     }
//   },

//   // Get bookings by customer email
//   getBookingsByCustomerEmail: async (req, res) => {
//     try {
//       const { email } = req.params;
//       const { includeApplications = 'false' } = req.query;
      
//       const query = { 'customer.contactInfo.email': email.toLowerCase() };
      
//       if (includeApplications === 'false') {
//         query.serviceType = 'booking';
//       }

//       const bookings = await VisaService.find(query)
//         .sort({ createdAt: -1 })
//         .select('serviceId serviceType bookingDetails serviceStage createdAt')
//         .lean();

//       // Group bookings by status
//       const groupedByStatus = bookings.reduce((acc, booking) => {
//         const status = booking.bookingDetails?.bookingStatus || 'unknown';
//         if (!acc[status]) acc[status] = [];
//         acc[status].push(booking);
//         return acc;
//       }, {});

//       res.json({
//         success: true,
//         data: {
//           bookings,
//           customerEmail: email,
//           totalBookings: bookings.length,
//           groupedByStatus,
//           recentBookings: bookings.slice(0, 5),
//           upcomingAppointments: bookings.filter(b => 
//             b.bookingDetails?.appointment?.date && 
//             new Date(b.bookingDetails.appointment.date) > new Date()
//           )
//         }
//       });
//     } catch (error) {
//       console.error('Get bookings by email error:', error);
//       res.status(500).json({
//         success: false,
//         message: 'Failed to retrieve bookings',
//         error: error.message
//       });
//     }
//   },

//   // Get upcoming appointments
//   getUpcomingAppointments: async (req, res) => {
//     try {
//       const { 
//         daysAhead = 30,
//         includePast = 'false',
//         agentId 
//       } = req.query;

//       const now = new Date();
//       const futureDate = new Date();
//       futureDate.setDate(now.getDate() + parseInt(daysAhead));

//       const query = {
//         'bookingDetails.appointment.date': { 
//           $exists: true,
//           $ne: null
//         },
//         'bookingDetails.bookingStatus': { $in: ['pending', 'confirmed'] }
//       };

//       if (includePast === 'false') {
//         query['bookingDetails.appointment.date'] = { $gte: now };
//       }
      
//       query['bookingDetails.appointment.date'].$lte = futureDate;

//       if (agentId) {
//         query['internal.assignedTo.agentId'] = new mongoose.Types.ObjectId(agentId);
//       }

//       const appointments = await VisaService.find(query)
//         .sort({ 'bookingDetails.appointment.date': 1, 'bookingDetails.appointment.timeSlot': 1 })
//         .select('serviceId customer.personalInfo.fullName customer.contactInfo.email bookingDetails.appointment serviceStage internal.assignedTo')
//         .lean();

//       // Group by date
//       const appointmentsByDate = appointments.reduce((acc, appointment) => {
//         if (!appointment.bookingDetails?.appointment?.date) return acc;
//         const date = new Date(appointment.bookingDetails.appointment.date).toDateString();
//         if (!acc[date]) acc[date] = [];
//         acc[date].push(appointment);
//         return acc;
//       }, {});

//       // Get statistics
//       const today = new Date().toDateString();
//       const todaysAppointments = appointments.filter(a => 
//         a.bookingDetails?.appointment?.date && 
//         new Date(a.bookingDetails.appointment.date).toDateString() === today
//       );

//       res.json({
//         success: true,
//         data: {
//           appointments,
//           appointmentsByDate,
//           statistics: {
//             total: appointments.length,
//             today: todaysAppointments.length,
//             confirmed: appointments.filter(a => a.bookingDetails?.appointment?.confirmed).length,
//             pendingConfirmation: appointments.filter(a => !a.bookingDetails?.appointment?.confirmed).length,
//             byMode: appointments.reduce((acc, a) => {
//               const mode = a.bookingDetails?.appointment?.mode || 'unknown';
//               acc[mode] = (acc[mode] || 0) + 1;
//               return acc;
//             }, {})
//           },
//           timeframe: {
//             from: now.toISOString(),
//             to: futureDate.toISOString(),
//             days: parseInt(daysAhead)
//           }
//         }
//       });
//     } catch (error) {
//       console.error('Get upcoming appointments error:', error);
//       res.status(500).json({
//         success: false,
//         message: 'Failed to retrieve appointments',
//         error: error.message
//       });
//     }
//   },

//   // Cancel booking
//   cancelBooking: async (req, res) => {
//     try {
//       const { bookingId } = req.params;
//       const { reason, cancelledBy } = req.body;

//       const booking = await VisaService.findOne({ 
//         serviceId: bookingId,
//         serviceType: { $in: ['booking', 'combined'] }
//       });

//       if (!booking) {
//         return res.status(404).json({
//           success: false,
//           message: 'Booking not found'
//         });
//       }

//       // Update booking status
//       booking.bookingDetails.bookingStatus = 'cancelled';
//       booking.serviceStage = 'cancelled';
      
//       // Add to notes
//       booking.internal.notes.push({
//         note: `Booking cancelled. Reason: ${reason}`,
//         addedBy: cancelledBy || 'system',
//         addedAt: new Date(),
//         category: 'status',
//         priority: 'high'
//       });

//       // Add to audit log
//       booking.auditLog.push({
//         action: 'booking_cancelled',
//         performedBy: cancelledBy || 'system',
//         details: { reason },
//         ipAddress: req.ip,
//         userAgent: req.headers['user-agent']
//       });

//       await booking.save();

//       // Send cancellation email
//       await sendEmail(
//         booking.customer.contactInfo.email,
//         'statusUpdate',
//         { 
//           ...booking.toObject(), 
//           newStatus: 'Booking Cancelled'
//         }
//       );

//       res.json({
//         success: true,
//         message: 'Booking cancelled successfully',
//         data: {
//           bookingId: booking.serviceId,
//           status: booking.bookingDetails.bookingStatus,
//           cancellationReason: reason
//         }
//       });
//     } catch (error) {
//       console.error('Cancel booking error:', error);
//       res.status(500).json({
//         success: false,
//         message: 'Failed to cancel booking',
//         error: error.message
//       });
//     }
//   },

//   // Get booking statistics
//   getBookingStatistics: async (req, res) => {
//     try {
//       const { startDate, endDate } = req.query;

//       const matchStage = {
//         serviceType: { $in: ['booking', 'combined'] }
//       };

//       if (startDate || endDate) {
//         matchStage.createdAt = {};
//         if (startDate) matchStage.createdAt.$gte = new Date(startDate);
//         if (endDate) matchStage.createdAt.$lte = new Date(endDate);
//       }

//       const statistics = await VisaService.aggregate([
//         { $match: matchStage },
//         {
//           $facet: {
//             // Overall booking statistics
//             overview: [
//               {
//                 $group: {
//                   _id: null,
//                   totalBookings: { $sum: 1 },
//                   totalRevenue: { $sum: '$bookingDetails.bookingAmount' },
//                   avgBookingValue: { $avg: '$bookingDetails.bookingAmount' },
//                   conversionRate: {
//                     $avg: {
//                       $cond: [
//                         { $eq: ['$serviceType', 'combined'] },
//                         100,
//                         0
//                       ]
//                     }
//                   }
//                 }
//               }
//             ],

//             // Status breakdown
//             statusBreakdown: [
//               {
//                 $group: {
//                   _id: '$bookingDetails.bookingStatus',
//                   count: { $sum: 1 },
//                   totalRevenue: { $sum: '$bookingDetails.bookingAmount' },
//                   avgProcessingTime: {
//                     $avg: {
//                       $cond: [
//                         '$updatedAt',
//                         {
//                           $divide: [
//                             { $subtract: ['$updatedAt', '$createdAt'] },
//                             1000 * 60 * 60 * 24
//                           ]
//                         },
//                         null
//                       ]
//                     }
//                   }
//                 }
//               },
//               { $sort: { count: -1 } }
//             ],

//             // Source breakdown
//             sourceBreakdown: [
//               {
//                 $group: {
//                   _id: '$internal.source',
//                   count: { $sum: 1 },
//                   conversionRate: {
//                     $avg: {
//                       $cond: [
//                         { $eq: ['$serviceType', 'combined'] },
//                         100,
//                         0
//                       ]
//                     }
//                   }
//                 }
//               },
//               { $sort: { count: -1 } }
//             ],

//             // Monthly trends
//             monthlyTrends: [
//               {
//                 $group: {
//                   _id: {
//                     year: { $year: '$createdAt' },
//                     month: { $month: '$createdAt' }
//                   },
//                   count: { $sum: 1 },
//                   revenue: { $sum: '$bookingDetails.bookingAmount' },
//                   conversions: {
//                     $sum: {
//                       $cond: [
//                         { $eq: ['$serviceType', 'combined'] },
//                         1,
//                         0
//                       ]
//                     }
//                   }
//                 }
//               },
//               { $sort: { '_id.year': 1, '_id.month': 1 } },
//               { $limit: 12 }
//             ],

//             // Time slot popularity
//             timeSlotPopularity: [
//               {
//                 $match: {
//                   'bookingDetails.appointment.timeSlot': { $exists: true, $ne: null }
//                 }
//               },
//               {
//                 $group: {
//                   _id: '$bookingDetails.appointment.timeSlot',
//                   count: { $sum: 1 },
//                   confirmedRate: {
//                     $avg: {
//                       $cond: [
//                         { $eq: ['$bookingDetails.appointment.confirmed', true] },
//                         100,
//                         0
//                       ]
//                     }
//                   }
//                 }
//               },
//               { $sort: { count: -1 } },
//               { $limit: 10 }
//             ],

//             // Agent performance for bookings
//             agentPerformance: [
//               {
//                 $match: {
//                   'internal.assignedTo.agentId': { $exists: true, $ne: null }
//                 }
//               },
//               {
//                 $group: {
//                   _id: '$internal.assignedTo.agentId',
//                   agentName: { $first: '$internal.assignedTo.agentName' },
//                   totalBookings: { $sum: 1 },
//                   confirmedBookings: {
//                     $sum: {
//                       $cond: [
//                         { $eq: ['$bookingDetails.bookingStatus', 'confirmed'] },
//                         1,
//                         0
//                       ]
//                     }
//                   },
//                   conversionRate: {
//                     $avg: {
//                       $cond: [
//                         { $eq: ['$serviceType', 'combined'] },
//                         100,
//                         0
//                       ]
//                     }
//                   },
//                   totalRevenue: { $sum: '$bookingDetails.bookingAmount' }
//                 }
//               },
//               { $sort: { totalBookings: -1 } }
//             ]
//           }
//         }
//       ]);

//       res.json({
//         success: true,
//         data: statistics[0]
//       });
//     } catch (error) {
//       console.error('Get booking statistics error:', error);
//       res.status(500).json({
//         success: false,
//         message: 'Failed to retrieve booking statistics',
//         error: error.message
//       });
//     }
//   }
// };

// // ========== VISA APPLICATION CONTROLLERS ==========

// const ApplicationController = {
//   // Create new visa application (without booking)
//   // createApplication: async (req, res) => {
//   //   try {
//   //     const {
//   //       customer,
//   //       applicationDetails,
//   //       internal
//   //     } = req.body;

//   //     // Validate required fields
//   //     if (!customer?.personalInfo?.fullName || !customer?.contactInfo?.email) {
//   //       return res.status(400).json({
//   //         success: false,
//   //         message: 'Full name and email are required'
//   //       });
//   //     }

//   //     if (!applicationDetails?.visaInfo?.destinationCountry || !applicationDetails?.visaInfo?.visaType) {
//   //       return res.status(400).json({
//   //         success: false,
//   //         message: 'Destination country and visa type are required'
//   //       });
//   //     }

//   //     // Create application
//   //     const application = new VisaService({
//   //       serviceType: 'application',
//   //       serviceStage: 'application-initiated',
//   //       customer,
//   //       applicationDetails,
//   //       internal
//   //     });

//   //     await application.save();

//   //     // Send confirmation email
//   //     await sendEmail(
//   //       customer.contactInfo.email,
//   //       'applicationSubmitted',
//   //       application
//   //     );

//   //     res.status(201).json({
//   //       success: true,
//   //       message: 'Visa application created successfully',
//   //       data: {
//   //         trackingNumber: application.trackingNumber,
//   //         serviceId: application.serviceId,
//   //         applicationStatus: application.applicationDetails.applicationStatus.current
//   //       }
//   //     });
//   //   } catch (error) {
//   //     console.error('Create application error:', error);
//   //     res.status(500).json({
//   //       success: false,
//   //       message: 'Failed to create visa application',
//   //       error: error.message
//   //     });
//   //   }
//   // },

//   createApplication: async (req, res) => {
//   try {
//     const {
//       customer,
//       applicationDetails,
//       internal,
//       serviceType = 'application'
//     } = req.body;

//     // Validate required customer fields
//     if (!customer?.personalInfo?.fullName) {
//       return res.status(400).json({
//         success: false,
//         message: 'Customer full name is required'
//       });
//     }

//     if (!customer?.contactInfo?.email) {
//       return res.status(400).json({
//         success: false,
//         message: 'Customer email is required'
//       });
//     }

//     // Validate application fields
//     if (!applicationDetails?.visaInfo?.destinationCountry) {
//       return res.status(400).json({
//         success: false,
//         message: 'Destination country is required for visa application'
//       });
//     }

//     if (!applicationDetails?.visaInfo?.visaType) {
//       return res.status(400).json({
//         success: false,
//         message: 'Visa type is required'
//       });
//     }

//     if (!applicationDetails?.visaInfo?.purposeOfTravel) {
//       return res.status(400).json({
//         success: false,
//         message: 'Purpose of travel is required'
//       });
//     }

//     // Prepare application data
//     const applicationData = {
//       serviceType: serviceType,
//       serviceStage: serviceType === 'combined' ? 'application-initiated' : 'booking-pending',
//       customer: {
//         personalInfo: {
//           fullName: customer.personalInfo.fullName.trim(),
//           dateOfBirth: customer.personalInfo.dateOfBirth ? new Date(customer.personalInfo.dateOfBirth) : undefined,
//           gender: customer.personalInfo.gender || 'prefer-not-to-say',
//           nationality: customer.personalInfo.nationality,
//           countryOfResidence: customer.personalInfo.countryOfResidence,
//           maritalStatus: customer.personalInfo.maritalStatus || 'single',
//           occupation: customer.personalInfo.occupation,
//           employer: customer.personalInfo.employer
//         },
//         contactInfo: {
//           email: customer.contactInfo.email.toLowerCase().trim(),
//           primaryPhone: customer.contactInfo.primaryPhone,
//           secondaryPhone: customer.contactInfo.secondaryPhone,
//           whatsappNumber: customer.contactInfo.whatsappNumber,
//           address: customer.contactInfo.address,
//           emergencyContact: customer.contactInfo.emergencyContact
//         },
//         passportInfo: {
//           passportNumber: customer.passportInfo?.passportNumber,
//           issuingCountry: customer.passportInfo?.issuingCountry,
//           issueDate: customer.passportInfo?.issueDate ? new Date(customer.passportInfo.issueDate) : undefined,
//           expiryDate: customer.passportInfo?.expiryDate ? new Date(customer.passportInfo.expiryDate) : undefined,
//           placeOfIssue: customer.passportInfo?.placeOfIssue,
//           hasPreviousVisas: customer.passportInfo?.hasPreviousVisas || false,
//           previousVisaDetails: customer.passportInfo?.previousVisaDetails || []
//         }
//       },
//       applicationDetails: {
//         visaInfo: {
//           destinationCountry: applicationDetails.visaInfo.destinationCountry,
//           visaType: applicationDetails.visaInfo.visaType,
//           category: applicationDetails.visaInfo.category || 'short-term',
//           purposeOfTravel: applicationDetails.visaInfo.purposeOfTravel,
//           travelDates: applicationDetails.visaInfo.travelDates ? {
//             intendedEntry: applicationDetails.visaInfo.travelDates.intendedEntry ? 
//               new Date(applicationDetails.visaInfo.travelDates.intendedEntry) : undefined,
//             intendedExit: applicationDetails.visaInfo.travelDates.intendedExit ? 
//               new Date(applicationDetails.visaInfo.travelDates.intendedExit) : undefined,
//             flexibleDates: applicationDetails.visaInfo.travelDates.flexibleDates || false
//           } : undefined,
//           durationOfStay: applicationDetails.visaInfo.durationOfStay,
//           entriesRequested: applicationDetails.visaInfo.entriesRequested || 'Single',
//           travelCompanions: applicationDetails.visaInfo.travelCompanions || []
//         },
//         servicePackage: applicationDetails.servicePackage || {
//           name: 'standard',
//           processingTime: '15-20 business days',
//           inclusions: []
//         },
//         fees: {
//           consultationFee: applicationDetails.fees?.consultationFee || 0,
//           serviceFee: applicationDetails.fees?.serviceFee || 0,
//           embassyFee: applicationDetails.fees?.embassyFee || 0,
//           additionalFees: applicationDetails.fees?.additionalFees || 0,
//           discount: applicationDetails.fees?.discount || 0,
//           totalAmount: applicationDetails.fees?.totalAmount || 0,
//           currency: applicationDetails.fees?.currency || 'USD'
//         },
//         payment: {
//           status: applicationDetails.payment?.status || 'pending',
//           amountPaid: applicationDetails.payment?.amountPaid || 0,
//           paymentMethod: applicationDetails.payment?.paymentMethod,
//           dueDate: applicationDetails.payment?.dueDate ? new Date(applicationDetails.payment.dueDate) : undefined,
//           paymentHistory: applicationDetails.payment?.paymentHistory || []
//         },
//         applicationStatus: {
//           current: applicationDetails.applicationStatus?.current || 'not-started',
//           submittedAt: applicationDetails.applicationStatus?.submittedAt ? 
//             new Date(applicationDetails.applicationStatus.submittedAt) : undefined,
//           processingStartedAt: applicationDetails.applicationStatus?.processingStartedAt ? 
//             new Date(applicationDetails.applicationStatus.processingStartedAt) : undefined
//         },
//         embassyInfo: applicationDetails.embassyInfo,
//         visaIssuance: applicationDetails.visaIssuance
//       },
//       bookingDetails: applicationDetails.bookingDetails || {},
//       internal: {
//         assignedTo: internal?.assignedTo ? {
//           agentId: internal.assignedTo.agentId,
//           agentName: internal.assignedTo.agentName,
//           agentEmail: internal.assignedTo.agentEmail,
//           department: internal.assignedTo.department,
//           assignedAt: internal.assignedTo.assignedAt ? new Date(internal.assignedTo.assignedAt) : new Date(),
//           lastContacted: internal.assignedTo.lastContacted ? new Date(internal.assignedTo.lastContacted) : undefined
//         } : undefined,
//         priority: internal?.priority || 'normal',
//         source: internal?.source || 'website',
//         tags: internal?.tags || [],
//         notes: internal?.notes || [],
//         followUp: internal?.followUp
//       }
//     };

//     // Create the application
//     const newApplication = new VisaService(applicationData);

//     // Save the application
//     await newApplication.save();

//     // Send confirmation email
//     try {
//       await sendEmail(
//         newApplication.customer.contactInfo.email,
//         serviceType === 'combined' ? 'applicationSubmitted' : 'bookingConfirmation',
//         newApplication.toObject()
//       );
//     } catch (emailError) {
//       console.warn('Email sending failed, but application was created:', emailError.message);
//     }

//     // Prepare response
//     const responseApplication = newApplication.toObject();
//     delete responseApplication.__v;
//     delete responseApplication.auditLog;
//     delete responseApplication.communications;
//     delete responseApplication.internal?.notes;
//     delete responseApplication.documents?.financialDocuments?.cloudinaryUrl;
//     delete responseApplication.documents?.travelDocuments?.cloudinaryUrl;
//     delete responseApplication.documents?.supportingDocuments?.cloudinaryUrl;

//     res.status(201).json({
//       success: true,
//       message: serviceType === 'combined' ? 
//         'Booking converted to application successfully' : 
//         'Visa application created successfully',
//       data: {
//         application: responseApplication,
//         trackingInfo: {
//           serviceId: newApplication.serviceId,
//           trackingNumber: newApplication.trackingNumber,
//           nextAction: newApplication.nextActionRequired,
//           status: newApplication.applicationDetails.applicationStatus.current
//         }
//       }
//     });

//   } catch (error) {
//     console.error('Create application error:', error);
    
//     if (error.name === 'ValidationError') {
//       const errors = {};
//       Object.keys(error.errors).forEach(key => {
//         errors[key] = error.errors[key].message;
//       });
      
//       return res.status(400).json({
//         success: false,
//         message: 'Validation failed',
//         errors: errors
//       });
//     }
    
//     if (error.code === 11000) {
//       const field = Object.keys(error.keyPattern)[0];
//       return res.status(400).json({
//         success: false,
//         message: `Duplicate value for ${field}`,
//         field: field,
//         value: error.keyValue[field]
//       });
//     }
    
//     res.status(500).json({
//       success: false,
//       message: 'Failed to create application',
//       error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
//     });
//   }
// },

//   // Upload document
//   uploadDocument: async (req, res) => {
//     try {
//       const { trackingNumber } = req.params;
//       const { category, documentType } = req.body;
//       const file = req.file;

//       if (!file) {
//         return res.status(400).json({
//           success: false,
//           message: 'No file uploaded'
//         });
//       }

//       const application = await VisaService.findOne({ trackingNumber });

//       if (!application) {
//         return res.status(404).json({
//           success: false,
//           message: 'Application not found'
//         });
//       }

//       // Upload to Cloudinary
//       const uploadResult = await uploadToCloudinary(file, `visa_applications/${trackingNumber}/${category}`);

//       if (!uploadResult.success) {
//         return res.status(500).json(uploadResult);
//       }

//       // Prepare document data
//       const documentData = {
//         documentType: documentType || category,
//         cloudinaryUrl: uploadResult.cloudinaryUrl,
//         publicId: uploadResult.publicId,
//         originalName: uploadResult.originalName,
//         uploadedAt: new Date(),
//         verified: false
//       };

//       // Add document using instance method
//       await application.addDocument(category, documentData);

//       // Send document upload confirmation email
//       await sendEmail(
//         application.customer.contactInfo.email,
//         'documentUploadConfirmation',
//         { ...application.toObject(), documentType: documentType || category }
//       );

//       res.json({
//         success: true,
//         message: 'Document uploaded successfully',
//         data: {
//           documentUrl: uploadResult.cloudinaryUrl,
//           totalDocuments: application.totalDocuments,
//           verifiedDocuments: application.verifiedDocuments
//         }
//       });
//     } catch (error) {
//       console.error('Upload document error:', error);
//       res.status(500).json({
//         success: false,
//         message: 'Failed to upload document',
//         error: error.message
//       });
//     }
//   },

//   // Verify document
//   verifyDocument: async (req, res) => {
//     try {
//       const { trackingNumber } = req.params;
//       const { documentId, category, verifiedBy } = req.body;

//       const application = await VisaService.findOne({ trackingNumber });

//       if (!application) {
//         return res.status(404).json({
//           success: false,
//           message: 'Application not found'
//         });
//       }

//       // Verify document using instance method
//       await application.verifyDocument(documentId, verifiedBy, category);

//       res.json({
//         success: true,
//         message: 'Document verified successfully',
//         data: {
//           verifiedDocuments: application.verifiedDocuments,
//           totalDocuments: application.totalDocuments,
//           nextAction: application.nextActionRequired
//         }
//       });
//     } catch (error) {
//       console.error('Verify document error:', error);
//       res.status(500).json({
//         success: false,
//         message: 'Failed to verify document',
//         error: error.message
//       });
//     }
//   },

//   // Update payment
//   updatePayment: async (req, res) => {
//     try {
//       const { trackingNumber } = req.params;
//       const { amount, method, transactionId, notes } = req.body;

//       const application = await VisaService.findOne({ trackingNumber });

//       if (!application) {
//         return res.status(404).json({
//           success: false,
//           message: 'Application not found'
//         });
//       }

//       // Update payment using instance method
//       await application.updatePayment(amount, method, transactionId, notes);

//       // Send payment confirmation email
//       const paymentDetails = {
//         amount,
//         method,
//         transactionId,
//         date: new Date()
//       };
      
//       await sendEmail(
//         application.customer.contactInfo.email,
//         'paymentConfirmation',
//         { ...application.toObject(), paymentDetails }
//       );

//       res.json({
//         success: true,
//         message: 'Payment updated successfully',
//         data: {
//           amountPaid: application.applicationDetails.payment.amountPaid,
//           balanceDue: application.balanceDue,
//           paymentStatus: application.applicationDetails.payment.status
//         }
//       });
//     } catch (error) {
//       console.error('Update payment error:', error);
//       res.status(500).json({
//         success: false,
//         message: 'Failed to update payment',
//         error: error.message
//       });
//     }
//   },

//   // Update application status
//   updateStatus: async (req, res) => {
//     try {
//       const { trackingNumber } = req.params;
//       const { status, remarks, changedBy } = req.body;

//       const application = await VisaService.findOne({ trackingNumber });

//       if (!application) {
//         return res.status(404).json({
//           success: false,
//           message: 'Application not found'
//         });
//       }

//       // Update status
//       application.applicationDetails.applicationStatus.current = status;
      
//       // Record in history
//       application.statusHistory.push({
//         stage: application.serviceStage,
//         status: status,
//         changedAt: new Date(),
//         changedBy: changedBy || 'system',
//         remarks: remarks
//       });

//       await application.save();

//       // Send status update email
//       await sendEmail(
//         application.customer.contactInfo.email,
//         'statusUpdate',
//         { ...application.toObject(), newStatus: status }
//       );

//       res.json({
//         success: true,
//         message: 'Status updated successfully',
//         data: {
//           currentStatus: status,
//           previousStatus: application.statusHistory.slice(-2, -1)[0]?.status,
//           nextAction: application.nextActionRequired
//         }
//       });
//     } catch (error) {
//       console.error('Update status error:', error);
//       res.status(500).json({
//         success: false,
//         message: 'Failed to update status',
//         error: error.message
//       });
//     }
//   },

//   // Get all applications with advanced filtering
//   getAllApplications: async (req, res) => {
//     try {
//       const {
//         page = 1,
//         limit = 20,
//         sortBy = 'createdAt',
//         sortOrder = 'desc',
//         status,
//         destinationCountry,
//         visaType,
//         dateFrom,
//         dateTo,
//         customerName,
//         email,
//         passportNumber,
//         agentId,
//         priority,
//         paymentStatus,
//         hasDocuments,
//         overdueOnly = false,
//         includeBookings = 'false',
//         serviceStage
//       } = req.query;

//       const skip = (parseInt(page) - 1) * parseInt(limit);
      
//       // Build query for applications
//       const query = { 
//         serviceType: { 
//           $in: includeBookings === 'true' ? ['application', 'combined'] : ['application'] 
//         } 
//       };
      
//       // Apply filters
//       if (status) {
//         query['applicationDetails.applicationStatus.current'] = status;
//       }
      
//       if (serviceStage) {
//         query.serviceStage = serviceStage;
//       }
      
//       if (destinationCountry) {
//         query['applicationDetails.visaInfo.destinationCountry'] = destinationCountry;
//       }
      
//       if (visaType) {
//         query['applicationDetails.visaInfo.visaType'] = visaType;
//       }
      
//       if (dateFrom || dateTo) {
//         query.createdAt = {};
//         if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
//         if (dateTo) query.createdAt.$lte = new Date(dateTo);
//       }
      
//       if (customerName) {
//         query['customer.personalInfo.fullName'] = { 
//           $regex: customerName, 
//           $options: 'i' 
//         };
//       }
      
//       if (email) {
//         query['customer.contactInfo.email'] = { 
//           $regex: email, 
//           $options: 'i' 
//         };
//       }
      
//       if (passportNumber) {
//         query['customer.passportInfo.passportNumber'] = passportNumber;
//       }
      
//       if (agentId) {
//         query['internal.assignedTo.agentId'] = new mongoose.Types.ObjectId(agentId);
//       }
      
//       if (priority) {
//         query['internal.priority'] = priority;
//       }
      
//       if (paymentStatus) {
//         query['applicationDetails.payment.status'] = paymentStatus;
//       }
      
//       if (hasDocuments === 'true') {
//         query.$or = [
//           { 'documents.photograph.cloudinaryUrl': { $exists: true } },
//           { 'documents.passportCopy.cloudinaryUrl': { $exists: true } },
//           { 'documents.financialDocuments.0': { $exists: true } },
//           { 'documents.travelDocuments.0': { $exists: true } }
//         ];
//       } else if (hasDocuments === 'false') {
//         query.$and = [
//           { 'documents.photograph.cloudinaryUrl': { $exists: false } },
//           { 'documents.passportCopy.cloudinaryUrl': { $exists: false } },
//           { 'documents.financialDocuments.0': { $exists: false } },
//           { 'documents.travelDocuments.0': { $exists: false } }
//         ];
//       }
      
//       if (overdueOnly === 'true') {
//         query['applicationDetails.payment.dueDate'] = { $lt: new Date() };
//         query['applicationDetails.payment.status'] = { $in: ['pending', 'partial'] };
//       }

//       // Determine sort order
//       const sort = {};
//       sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

//       // Get applications with pagination
//       const [applications, total] = await Promise.all([
//         VisaService.find(query)
//           .sort(sort)
//           .skip(skip)
//           .limit(parseInt(limit))
//           .select('-documents.financialDocuments.cloudinaryUrl -documents.travelDocuments.cloudinaryUrl -documents.supportingDocuments.cloudinaryUrl -communications -auditLog')
//           .lean(),
//         VisaService.countDocuments(query)
//       ]);

//       // Calculate statistics for the current result set
//       const stats = {
//         totalApplications: total,
//         byStatus: applications.reduce((acc, app) => {
//           const status = app.applicationDetails?.applicationStatus?.current || 'unknown';
//           acc[status] = (acc[status] || 0) + 1;
//           return acc;
//         }, {}),
//         byDestination: applications.reduce((acc, app) => {
//           const country = app.applicationDetails?.visaInfo?.destinationCountry || 'unknown';
//           acc[country] = (acc[country] || 0) + 1;
//           return acc;
//         }, {}),
//         byVisaType: applications.reduce((acc, app) => {
//           const type = app.applicationDetails?.visaInfo?.visaType || 'unknown';
//           acc[type] = (acc[type] || 0) + 1;
//           return acc;
//         }, {}),
//         totalRevenue: applications.reduce((sum, app) => 
//           sum + (app.applicationDetails?.fees?.totalAmount || 0), 0
//         ),
//         totalPaid: applications.reduce((sum, app) => 
//           sum + (app.applicationDetails?.payment?.amountPaid || 0), 0
//         ),
//         pendingPayments: applications.filter(app => 
//           ['pending', 'partial'].includes(app.applicationDetails?.payment?.status)
//         ).length,
//         totalDocuments: applications.reduce((sum, app) => 
//           sum + (app.totalDocuments || 0), 0
//         ),
//         averageProcessingTime: applications.reduce((sum, app) => {
//           if (app.applicationDetails?.applicationStatus?.actualCompletionDate && 
//               app.applicationDetails?.applicationStatus?.submittedAt) {
//             const days = (new Date(app.applicationDetails.applicationStatus.actualCompletionDate) - 
//                          new Date(app.applicationDetails.applicationStatus.submittedAt)) / (1000 * 60 * 60 * 24);
//             return sum + days;
//           }
//           return sum;
//         }, 0) / (applications.filter(app => app.applicationDetails?.applicationStatus?.actualCompletionDate).length || 1)
//       };

//       res.json({
//         success: true,
//         data: {
//           applications,
//           pagination: {
//             page: parseInt(page),
//             limit: parseInt(limit),
//             total,
//             totalPages: Math.ceil(total / parseInt(limit)),
//             hasNextPage: (page * limit) < total,
//             hasPrevPage: page > 1
//           },
//           statistics: stats,
//           filtersApplied: Object.keys(req.query).filter(key => 
//             !['page', 'limit', 'sortBy', 'sortOrder'].includes(key)
//           ),
//           summary: {
//             // Quick summary for dashboard
//             pending: stats.byStatus.pending || 0,
//             processing: (stats.byStatus.processing || 0) + (stats.byStatus['document-review'] || 0),
//             approved: stats.byStatus.approved || 0,
//             rejected: stats.byStatus.rejected || 0,
//             urgent: applications.filter(app => app.internal?.priority === 'urgent').length
//           }
//         }
//       });
//     } catch (error) {
//       console.error('Get all applications error:', error);
//       res.status(500).json({
//         success: false,
//         message: 'Failed to retrieve applications',
//         error: error.message
//       });
//     }
//   },

//   // Get application by tracking number
//   getApplicationByTrackingNumber: async (req, res) => {
//     try {
//       const { trackingNumber } = req.params;
//       const { includeDocuments = 'true' } = req.query;

//       const selectFields = includeDocuments === 'true' 
//         ? '' 
//         : '-documents.financialDocuments.cloudinaryUrl -documents.travelDocuments.cloudinaryUrl -documents.supportingDocuments.cloudinaryUrl -documents.otherDocuments.cloudinaryUrl';

//       const application = await VisaService.findOne({ trackingNumber })
//         .select(selectFields);

//       if (!application) {
//         return res.status(404).json({
//           success: false,
//           message: 'Application not found'
//         });
//       }

//       // Get related applications for the same customer
//       const relatedApplications = await VisaService.find({
//         'customer.contactInfo.email': application.customer.contactInfo.email,
//         trackingNumber: { $ne: trackingNumber }
//       })
//       .sort({ createdAt: -1 })
//       .select('trackingNumber serviceId applicationDetails.visaInfo.destinationCountry applicationDetails.visaInfo.visaType applicationDetails.applicationStatus.current createdAt')
//       .limit(5);

//       res.json({
//         success: true,
//         data: {
//           application,
//           customerHistory: {
//             totalApplications: relatedApplications.length + 1,
//             previousApplications: relatedApplications,
//             email: application.customer.contactInfo.email,
//             customerSince: relatedApplications.length > 0 ? 
//               relatedApplications[relatedApplications.length - 1].createdAt : 
//               application.createdAt
//           }
//         }
//       });
//     } catch (error) {
//       console.error('Get application error:', error);
//       res.status(500).json({
//         success: false,
//         message: 'Failed to get application',
//         error: error.message
//       });
//     }
//   },

//   // Get applications by status
//   getApplicationsByStatus: async (req, res) => {
//     try {
//       const { status } = req.params;
//       const { limit = 20, page = 1, priority } = req.query;

//       const skip = (page - 1) * limit;

//       const query = { 
//         'applicationDetails.applicationStatus.current': status,
//         serviceType: { $in: ['application', 'combined'] }
//       };

//       if (priority) {
//         query['internal.priority'] = priority;
//       }

//       const [applications, total] = await Promise.all([
//         VisaService.find(query)
//           .sort({ updatedAt: -1 })
//           .skip(skip)
//           .limit(parseInt(limit))
//           .select('trackingNumber serviceId customer.personalInfo.fullName customer.contactInfo.email applicationDetails.visaInfo.destinationCountry applicationDetails.visaInfo.visaType applicationDetails.fees.totalAmount applicationDetails.payment.status internal.assignedTo internal.priority createdAt')
//           .lean(),
//         VisaService.countDocuments(query)
//       ]);

//       // Calculate summary statistics
//       const summary = {
//         totalAmount: applications.reduce((sum, app) => sum + (app.applicationDetails?.fees?.totalAmount || 0), 0),
//         totalPaid: applications.reduce((sum, app) => sum + (app.applicationDetails?.payment?.amountPaid || 0), 0),
//         byPriority: applications.reduce((acc, app) => {
//           const priority = app.internal?.priority || 'normal';
//           acc[priority] = (acc[priority] || 0) + 1;
//           return acc;
//         }, {}),
//         byAgent: applications.reduce((acc, app) => {
//           const agent = app.internal?.assignedTo?.agentName || 'Unassigned';
//           acc[agent] = (acc[agent] || 0) + 1;
//           return acc;
//         }, {})
//       };

//       res.json({
//         success: true,
//         data: applications,
//         pagination: {
//           page: parseInt(page),
//           limit: parseInt(limit),
//           total,
//           pages: Math.ceil(total / limit)
//         },
//         summary
//       });
//     } catch (error) {
//       console.error('Get applications by status error:', error);
//       res.status(500).json({
//         success: false,
//         message: 'Failed to get applications by status',
//         error: error.message
//       });
//     }
//   },

//   // Get applications by email
//   getApplicationsByEmail: async (req, res) => {
//     try {
//       const { email } = req.params;
//       const { includeBookings = 'false' } = req.query;

//       const query = { 'customer.contactInfo.email': email.toLowerCase() };
      
//       if (includeBookings === 'false') {
//         query.serviceType = { $in: ['application', 'combined'] };
//       }

//       const applications = await VisaService.find(query)
//         .sort({ createdAt: -1 })
//         .select('serviceId trackingNumber serviceType serviceStage applicationDetails.visaInfo.destinationCountry applicationDetails.visaInfo.visaType applicationDetails.applicationStatus.current applicationDetails.fees.totalAmount applicationDetails.payment.status bookingDetails.bookingStatus createdAt updatedAt')
//         .lean();

//       // Calculate statistics
//       const stats = {
//         total: applications.length,
//         byStatus: applications.reduce((acc, app) => {
//           const status = app.applicationDetails?.applicationStatus?.current || 
//                         app.bookingDetails?.bookingStatus || 
//                         app.serviceStage || 
//                         'unknown';
//           acc[status] = (acc[status] || 0) + 1;
//           return acc;
//         }, {}),
//         byType: applications.reduce((acc, app) => {
//           const type = app.serviceType || 'unknown';
//           acc[type] = (acc[type] || 0) + 1;
//           return acc;
//         }, {}),
//         totalSpent: applications.reduce((sum, app) => 
//           sum + (app.applicationDetails?.fees?.totalAmount || 0) + (app.bookingDetails?.bookingAmount || 0), 0
//         ),
//         successRate: applications.filter(app => 
//           app.applicationDetails?.applicationStatus?.current === 'approved' ||
//           app.bookingDetails?.bookingStatus === 'completed'
//         ).length / (applications.length || 1) * 100
//       };

//       res.json({
//         success: true,
//         data: {
//           applications,
//           customerEmail: email,
//           statistics: stats,
//           recentActivity: applications.slice(0, 5),
//           activeApplications: applications.filter(app => 
//             !['completed', 'cancelled', 'rejected'].includes(
//               app.applicationDetails?.applicationStatus?.current || ''
//             ) && app.serviceType !== 'booking'
//           )
//         }
//       });
//     } catch (error) {
//       console.error('Get applications by email error:', error);
//       res.status(500).json({
//         success: false,
//         message: 'Failed to get applications by email',
//         error: error.message
//       });
//     }
//   },

//   // Get application statistics
//   getApplicationStatistics: async (req, res) => {
//     try {
//       const { startDate, endDate } = req.query;

//       const matchStage = {
//         serviceType: { $in: ['application', 'combined'] }
//       };

//       if (startDate || endDate) {
//         matchStage.createdAt = {};
//         if (startDate) matchStage.createdAt.$gte = new Date(startDate);
//         if (endDate) matchStage.createdAt.$lte = new Date(endDate);
//       }

//       const statistics = await VisaService.aggregate([
//         { $match: matchStage },
//         {
//           $facet: {
//             // Overall application statistics
//             overview: [
//               {
//                 $group: {
//                   _id: null,
//                   totalApplications: { $sum: 1 },
//                   totalRevenue: { $sum: '$applicationDetails.fees.totalAmount' },
//                   avgApplicationValue: { $avg: '$applicationDetails.fees.totalAmount' },
//                   successRate: {
//                     $avg: {
//                       $cond: [
//                         { $eq: ['$applicationDetails.applicationStatus.current', 'approved'] },
//                         100,
//                         0
//                       ]
//                     }
//                   },
//                   avgProcessingDays: {
//                     $avg: {
//                       $cond: [
//                         '$applicationDetails.applicationStatus.actualCompletionDate',
//                         {
//                           $divide: [
//                             {
//                               $subtract: [
//                                 '$applicationDetails.applicationStatus.actualCompletionDate',
//                                 '$applicationDetails.applicationStatus.submittedAt'
//                               ]
//                             },
//                             1000 * 60 * 60 * 24
//                           ]
//                         },
//                         null
//                       ]
//                     }
//                   }
//                 }
//               }
//             ],

//             // Status breakdown
//             statusBreakdown: [
//               {
//                 $group: {
//                   _id: '$applicationDetails.applicationStatus.current',
//                   count: { $sum: 1 },
//                   totalRevenue: { $sum: '$applicationDetails.fees.totalAmount' },
//                   avgProcessingDays: {
//                     $avg: {
//                       $cond: [
//                         '$applicationDetails.applicationStatus.actualCompletionDate',
//                         {
//                           $divide: [
//                             {
//                               $subtract: [
//                                 '$applicationDetails.applicationStatus.actualCompletionDate',
//                                 '$applicationDetails.applicationStatus.submittedAt'
//                               ]
//                             },
//                             1000 * 60 * 60 * 24
//                           ]
//                         },
//                         null
//                       ]
//                     }
//                   }
//                 }
//               },
//               { $sort: { count: -1 } }
//             ],

//             // Visa type breakdown
//             visaTypeBreakdown: [
//               {
//                 $group: {
//                   _id: '$applicationDetails.visaInfo.visaType',
//                   count: { $sum: 1 },
//                   successRate: {
//                     $avg: {
//                       $cond: [
//                         { $eq: ['$applicationDetails.applicationStatus.current', 'approved'] },
//                         100,
//                         0
//                       ]
//                     }
//                   },
//                   avgFee: { $avg: '$applicationDetails.fees.totalAmount' },
//                   avgProcessingDays: {
//                     $avg: {
//                       $cond: [
//                         '$applicationDetails.applicationStatus.actualCompletionDate',
//                         {
//                           $divide: [
//                             {
//                               $subtract: [
//                                 '$applicationDetails.applicationStatus.actualCompletionDate',
//                                 '$applicationDetails.applicationStatus.submittedAt'
//                               ]
//                             },
//                             1000 * 60 * 60 * 24
//                           ]
//                         },
//                         null
//                       ]
//                     }
//                   }
//                 }
//               },
//               { $sort: { count: -1 } }
//             ],

//             // Destination country breakdown
//             destinationBreakdown: [
//               {
//                 $group: {
//                   _id: '$applicationDetails.visaInfo.destinationCountry',
//                   count: { $sum: 1 },
//                   successRate: {
//                     $avg: {
//                       $cond: [
//                         { $eq: ['$applicationDetails.applicationStatus.current', 'approved'] },
//                         100,
//                         0
//                       ]
//                     }
//                   },
//                   avgFee: { $avg: '$applicationDetails.fees.totalAmount' },
//                   avgProcessingDays: {
//                     $avg: {
//                       $cond: [
//                         '$applicationDetails.applicationStatus.actualCompletionDate',
//                         {
//                           $divide: [
//                             {
//                               $subtract: [
//                                 '$applicationDetails.applicationStatus.actualCompletionDate',
//                                 '$applicationDetails.applicationStatus.submittedAt'
//                               ]
//                             },
//                             1000 * 60 * 60 * 24
//                           ]
//                         },
//                         null
//                       ]
//                     }
//                   }
//                 }
//               },
//               { $sort: { count: -1 } },
//               { $limit: 10 }
//             ],

//             // Payment statistics
//             paymentStats: [
//               {
//                 $group: {
//                   _id: '$applicationDetails.payment.status',
//                   count: { $sum: 1 },
//                   totalAmount: { $sum: '$applicationDetails.fees.totalAmount' },
//                   totalCollected: { $sum: '$applicationDetails.payment.amountPaid' },
//                   avgCollectionDays: {
//                     $avg: {
//                       $cond: [
//                         '$applicationDetails.payment.paymentHistory',
//                         {
//                           $divide: [
//                             {
//                               $subtract: [
//                                 { $arrayElemAt: ['$applicationDetails.payment.paymentHistory.date', -1] },
//                                 '$createdAt'
//                               ]
//                             },
//                             1000 * 60 * 60 * 24
//                           ]
//                         },
//                         null
//                       ]
//                     }
//                   }
//                 }
//               }
//             ],

//             // Monthly application trends
//             monthlyTrends: [
//               {
//                 $group: {
//                   _id: {
//                     year: { $year: '$createdAt' },
//                     month: { $month: '$createdAt' }
//                   },
//                   count: { $sum: 1 },
//                   revenue: { $sum: '$applicationDetails.fees.totalAmount' },
//                   approved: {
//                     $sum: {
//                       $cond: [
//                         { $eq: ['$applicationDetails.applicationStatus.current', 'approved'] },
//                         1,
//                         0
//                       ]
//                     }
//                   },
//                   avgProcessingDays: {
//                     $avg: {
//                       $cond: [
//                         '$applicationDetails.applicationStatus.actualCompletionDate',
//                         {
//                           $divide: [
//                             {
//                               $subtract: [
//                                 '$applicationDetails.applicationStatus.actualCompletionDate',
//                                 '$applicationDetails.applicationStatus.submittedAt'
//                               ]
//                             },
//                             1000 * 60 * 60 * 24
//                           ]
//                         },
//                         null
//                       ]
//                     }
//                   }
//                 }
//               },
//               { $sort: { '_id.year': 1, '_id.month': 1 } },
//               { $limit: 12 }
//             ],

//             // Document statistics
//             documentStats: [
//               {
//                 $group: {
//                   _id: null,
//                   avgDocumentsPerApp: {
//                     $avg: {
//                       $add: [
//                         { $cond: [{ $ifNull: ['$documents.photograph.cloudinaryUrl', false] }, 1, 0] },
//                         { $cond: [{ $ifNull: ['$documents.passportCopy.cloudinaryUrl', false] }, 1, 0] },
//                         { $size: { $ifNull: ['$documents.financialDocuments', []] } },
//                         { $size: { $ifNull: ['$documents.travelDocuments', []] } }
//                       ]
//                     }
//                   },
//                   verificationRate: {
//                     $avg: {
//                       $cond: [
//                         { $gt: ['$totalDocuments', 0] },
//                         { $divide: ['$verifiedDocuments', '$totalDocuments'] },
//                         0
//                       ]
//                     }
//                   }
//                 }
//               }
//             ]
//           }
//         }
//       ]);

//       res.json({
//         success: true,
//         data: statistics[0]
//       });
//     } catch (error) {
//       console.error('Get application statistics error:', error);
//       res.status(500).json({
//         success: false,
//         message: 'Failed to retrieve application statistics',
//         error: error.message
//       });
//     }
//   },

//   // Get pending documents applications
//   getPendingDocumentsApplications: async (req, res) => {
//     try {
//       const { limit = 20 } = req.query;

//       const applications = await VisaService.find({
//         serviceType: { $in: ['application', 'combined'] },
//         'applicationDetails.applicationStatus.current': 'document-collection',
//         $or: [
//           { 'documents.photograph.cloudinaryUrl': { $exists: false } },
//           { 'documents.passportCopy.cloudinaryUrl': { $exists: false } },
//           { 'documents.financialDocuments': { $size: 0 } }
//         ]
//       })
//       .sort({ updatedAt: -1 })
//       .limit(parseInt(limit))
//       .select('trackingNumber serviceId customer.personalInfo.fullName customer.contactInfo.email applicationDetails.visaInfo.destinationCountry internal.assignedTo totalDocuments verifiedDocuments createdAt')
//       .lean();

//       // Calculate missing documents
//       const applicationsWithMissingDocs = applications.map(app => ({
//         ...app,
//         missingDocuments: {
//           photograph: !app.documents?.photograph?.cloudinaryUrl,
//           passportCopy: !app.documents?.passportCopy?.cloudinaryUrl,
//           financialDocuments: !app.documents?.financialDocuments || app.documents.financialDocuments.length === 0,
//           travelDocuments: !app.documents?.travelDocuments || app.documents.travelDocuments.length === 0
//         }
//       }));

//       res.json({
//         success: true,
//         data: applicationsWithMissingDocs,
//         statistics: {
//           total: applications.length,
//           missingPhotograph: applications.filter(app => !app.documents?.photograph?.cloudinaryUrl).length,
//           missingPassport: applications.filter(app => !app.documents?.passportCopy?.cloudinaryUrl).length,
//           missingFinancial: applications.filter(app => !app.documents?.financialDocuments || app.documents.financialDocuments.length === 0).length,
//           avgDocuments: applications.reduce((sum, app) => sum + (app.totalDocuments || 0), 0) / (applications.length || 1)
//         }
//       });
//     } catch (error) {
//       console.error('Get pending documents applications error:', error);
//       res.status(500).json({
//         success: false,
//         message: 'Failed to retrieve pending documents applications',
//         error: error.message
//       });
//     }
//   }
// };

// // ========== STATISTICS CONTROLLERS ==========

// const StatisticsController = {
//   // Get overall statistics
//   getOverview: async (req, res) => {
//     try {
//       const filters = req.query;
//       const stats = await calculateStatistics(filters);

//       res.json({
//         success: true,
//         data: stats
//       });
//     } catch (error) {
//       console.error('Get overview error:', error);
//       res.status(500).json({
//         success: false,
//         message: 'Failed to get statistics',
//         error: error.message
//       });
//     }
//   },

//   // Get dashboard statistics
//   getDashboardStats: async (req, res) => {
//     try {
//       const thirtyDaysAgo = new Date();
//       thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

//       const [
//         totalApplications,
//         pendingPayments,
//         upcomingAppointments,
//         recentActivities,
//         monthlyRevenue,
//         statusDistribution
//       ] = await Promise.all([
//         // Total applications
//         VisaService.countDocuments({
//           serviceType: { $ne: 'booking' },
//           createdAt: { $gte: thirtyDaysAgo }
//         }),

//         // Pending payments
//         VisaService.aggregate([
//           {
//             $match: {
//               'applicationDetails.payment.status': { $in: ['pending', 'partial'] },
//               'applicationDetails.fees.totalAmount': { $gt: 0 }
//             }
//           },
//           {
//             $group: {
//               _id: null,
//               totalAmount: { $sum: '$applicationDetails.fees.totalAmount' },
//               totalCollected: { $sum: '$applicationDetails.payment.amountPaid' },
//               count: { $sum: 1 }
//             }
//           }
//         ]),

//         // Upcoming appointments
//         VisaService.find({
//           'bookingDetails.appointment.date': { $gte: new Date() },
//           'bookingDetails.bookingStatus': { $in: ['confirmed', 'pending'] }
//         })
//           .sort({ 'bookingDetails.appointment.date': 1 })
//           .limit(10)
//           .select('serviceId customer.personalInfo.fullName bookingDetails.appointment.date bookingDetails.appointment.timeSlot'),

//         // Recent activities
//         VisaService.find()
//           .sort({ updatedAt: -1 })
//           .limit(10)
//           .select('serviceId trackingNumber serviceStage applicationDetails.applicationStatus.current updatedAt'),

//         // Monthly revenue
//         VisaService.aggregate([
//           {
//             $match: {
//               createdAt: { $gte: thirtyDaysAgo }
//             }
//           },
//           {
//             $group: {
//               _id: {
//                 year: { $year: '$createdAt' },
//                 month: { $month: '$createdAt' },
//                 day: { $dayOfMonth: '$createdAt' }
//               },
//               revenue: {
//                 $sum: {
//                   $add: [
//                     '$bookingDetails.bookingAmount',
//                     '$applicationDetails.fees.totalAmount'
//                   ]
//                 }
//               },
//               applications: { $sum: 1 }
//             }
//           },
//           { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
//         ]),

//         // Status distribution
//         VisaService.aggregate([
//           {
//             $group: {
//               _id: '$applicationDetails.applicationStatus.current',
//               count: { $sum: 1 }
//             }
//           },
//           { $sort: { count: -1 } }
//         ])
//       ]);

//       res.json({
//         success: true,
//         data: {
//           totalApplications,
//           pendingPayments: pendingPayments[0] || { totalAmount: 0, totalCollected: 0, count: 0 },
//           upcomingAppointments,
//           recentActivities,
//           monthlyRevenue,
//           statusDistribution
//         }
//       });
//     } catch (error) {
//       console.error('Get dashboard stats error:', error);
//       res.status(500).json({
//         success: false,
//         message: 'Failed to get dashboard statistics',
//         error: error.message
//       });
//     }
//   },

//   // Get agent performance statistics
//   getAgentPerformance: async (req, res) => {
//     try {
//       const { startDate, endDate } = req.query;

//       const matchStage = {};
//       if (startDate && endDate) {
//         matchStage.createdAt = {
//           $gte: new Date(startDate),
//           $lte: new Date(endDate)
//         };
//       }

//       const agentStats = await VisaService.aggregate([
//         { $match: matchStage },
//         {
//           $group: {
//             _id: '$internal.assignedTo.agentId',
//             agentName: { $first: '$internal.assignedTo.agentName' },
//             totalApplications: { $sum: 1 },
//             completedApplications: {
//               $sum: {
//                 $cond: [
//                   {
//                     $in: [
//                       '$applicationDetails.applicationStatus.current',
//                       ['approved', 'visa-printed', 'collected']
//                     ]
//                   },
//                   1,
//                   0
//                 ]
//               }
//             },
//             pendingApplications: {
//               $sum: {
//                 $cond: [
//                   {
//                     $in: [
//                       '$applicationDetails.applicationStatus.current',
//                       ['pending', 'processing', 'document-review']
//                     ]
//                   },
//                   1,
//                   0
//                 ]
//               }
//             },
//             totalRevenue: { $sum: '$applicationDetails.fees.totalAmount' },
//             avgProcessingTime: {
//               $avg: {
//                 $cond: [
//                   '$applicationDetails.applicationStatus.actualCompletionDate',
//                   {
//                     $divide: [
//                       {
//                         $subtract: [
//                           '$applicationDetails.applicationStatus.actualCompletionDate',
//                           '$applicationDetails.applicationStatus.submittedAt'
//                         ]
//                       },
//                       1000 * 60 * 60 * 24
//                     ]
//                   },
//                   null
//                 ]
//               }
//             }
//           }
//         },
//         { $sort: { totalApplications: -1 } }
//       ]);

//       res.json({
//         success: true,
//         data: agentStats
//       });
//     } catch (error) {
//       console.error('Get agent performance error:', error);
//       res.status(500).json({
//         success: false,
//         message: 'Failed to get agent performance statistics',
//         error: error.message
//       });
//     }
//   },

//   // Get revenue statistics
//   getRevenueStats: async (req, res) => {
//     try {
//       const { period = 'monthly' } = req.query;

//       let groupFormat;
//       switch (period) {
//         case 'daily':
//           groupFormat = {
//             year: { $year: '$createdAt' },
//             month: { $month: '$createdAt' },
//             day: { $dayOfMonth: '$createdAt' }
//           };
//           break;
//         case 'weekly':
//           groupFormat = {
//             year: { $year: '$createdAt' },
//             week: { $week: '$createdAt' }
//           };
//           break;
//         case 'monthly':
//         default:
//           groupFormat = {
//             year: { $year: '$createdAt' },
//             month: { $month: '$createdAt' }
//           };
//       }

//       const revenueStats = await VisaService.aggregate([
//         {
//           $group: {
//             _id: groupFormat,
//             totalRevenue: {
//               $sum: {
//                 $add: [
//                   '$bookingDetails.bookingAmount',
//                   '$applicationDetails.fees.totalAmount'
//                 ]
//               }
//             },
//             bookingRevenue: { $sum: '$bookingDetails.bookingAmount' },
//             applicationRevenue: { $sum: '$applicationDetails.fees.totalAmount' },
//             applicationCount: {
//               $sum: { $cond: [{ $ne: ['$serviceType', 'booking'] }, 1, 0] }
//             },
//             bookingCount: {
//               $sum: { $cond: [{ $eq: ['$serviceType', 'booking'] }, 1, 0] }
//             },
//             avgApplicationValue: { $avg: '$applicationDetails.fees.totalAmount' }
//           }
//         },
//         { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1, '_id.week': 1 } }
//       ]);

//       res.json({
//         success: true,
//         data: revenueStats
//       });
//     } catch (error) {
//       console.error('Get revenue stats error:', error);
//       res.status(500).json({
//         success: false,
//         message: 'Failed to get revenue statistics',
//         error: error.message
//       });
//     }
//   }
// };

// // ========== SEARCH & QUERY CONTROLLERS ==========

// const QueryController = {
//   // Search applications
//   searchApplications: async (req, res) => {
//     try {
//       const {
//         trackingNumber,
//         email,
//         fullName,
//         passportNumber,
//         destinationCountry,
//         visaType,
//         status,
//         startDate,
//         endDate,
//         serviceType
//       } = req.query;

//       const query = {};

//       if (serviceType) {
//         query.serviceType = serviceType;
//       } else {
//         query.serviceType = { $ne: 'booking' };
//       }

//       if (trackingNumber) query.trackingNumber = trackingNumber;
//       if (email) query['customer.contactInfo.email'] = { $regex: email, $options: 'i' };
//       if (fullName) query['customer.personalInfo.fullName'] = { $regex: fullName, $options: 'i' };
//       if (passportNumber) query['customer.passportInfo.passportNumber'] = passportNumber;
//       if (destinationCountry) query['applicationDetails.visaInfo.destinationCountry'] = destinationCountry;
//       if (visaType) query['applicationDetails.visaInfo.visaType'] = visaType;
//       if (status) query['applicationDetails.applicationStatus.current'] = status;
      
//       if (startDate || endDate) {
//         query.createdAt = {};
//         if (startDate) query.createdAt.$gte = new Date(startDate);
//         if (endDate) query.createdAt.$lte = new Date(endDate);
//       }

//       const applications = await VisaService.find(query)
//         .sort({ createdAt: -1 })
//         .limit(50)
//         .select('serviceId trackingNumber serviceType customer.personalInfo.fullName customer.contactInfo.email applicationDetails.visaInfo.destinationCountry applicationDetails.visaInfo.visaType applicationDetails.applicationStatus.current applicationDetails.fees.totalAmount applicationDetails.payment.status createdAt')
//         .lean();

//       res.json({
//         success: true,
//         data: applications,
//         count: applications.length
//       });
//     } catch (error) {
//       console.error('Search applications error:', error);
//       res.status(500).json({
//         success: false,
//         message: 'Failed to search applications',
//         error: error.message
//       });
//     }
//   },

//   // Get application by tracking number
//   getApplicationByTrackingNumber: async (req, res) => {
//     try {
//       const { trackingNumber } = req.params;

//       const application = await VisaService.findOne({ trackingNumber })
//         .select('-documents.financialDocuments.cloudinaryUrl -documents.travelDocuments.cloudinaryUrl -documents.supportingDocuments.cloudinaryUrl');

//       if (!application) {
//         return res.status(404).json({
//           success: false,
//           message: 'Application not found'
//         });
//       }

//       res.json({
//         success: true,
//         data: application
//       });
//     } catch (error) {
//       console.error('Get application error:', error);
//       res.status(500).json({
//         success: false,
//         message: 'Failed to get application',
//         error: error.message
//       });
//     }
//   },

//   // Get applications by status
//   getApplicationsByStatus: async (req, res) => {
//     try {
//       const { status } = req.params;
//       const { limit = 20, page = 1 } = req.query;

//       const skip = (page - 1) * limit;

//       const [applications, total] = await Promise.all([
//         VisaService.find({ 'applicationDetails.applicationStatus.current': status })
//           .sort({ updatedAt: -1 })
//           .skip(skip)
//           .limit(parseInt(limit))
//           .select('trackingNumber serviceId customer.personalInfo.fullName customer.contactInfo.email applicationDetails.visaInfo.destinationCountry applicationDetails.visaInfo.visaType applicationDetails.fees.totalAmount applicationDetails.payment.status internal.assignedTo createdAt'),
//         VisaService.countDocuments({ 'applicationDetails.applicationStatus.current': status })
//       ]);

//       res.json({
//         success: true,
//         data: applications,
//         pagination: {
//           page: parseInt(page),
//           limit: parseInt(limit),
//           total,
//           pages: Math.ceil(total / limit)
//         }
//       });
//     } catch (error) {
//       console.error('Get applications by status error:', error);
//       res.status(500).json({
//         success: false,
//         message: 'Failed to get applications by status',
//         error: error.message
//       });
//     }
//   },

//   // Get applications by email
//   getApplicationsByEmail: async (req, res) => {
//     try {
//       const { email } = req.params;

//       const applications = await VisaService.find({ 'customer.contactInfo.email': email.toLowerCase() })
//         .sort({ createdAt: -1 })
//         .select('serviceId trackingNumber serviceType serviceStage applicationDetails.visaInfo.destinationCountry applicationDetails.visaInfo.visaType applicationDetails.applicationStatus.current applicationDetails.fees.totalAmount applicationDetails.payment.status bookingDetails.bookingStatus createdAt');

//       res.json({
//         success: true,
//         data: applications,
//         count: applications.length
//       });
//     } catch (error) {
//       console.error('Get applications by email error:', error);
//       res.status(500).json({
//         success: false,
//         message: 'Failed to get applications by email',
//         error: error.message
//       });
//     }
//   },

//   // Get all services (both bookings and applications)
//   getAllServices: async (req, res) => {
//     try {
//       const {
//         page = 1,
//         limit = 20,
//         sortBy = 'createdAt',
//         sortOrder = 'desc',
//         serviceType,
//         dateFrom,
//         dateTo,
//         search
//       } = req.query;

//       const skip = (parseInt(page) - 1) * parseInt(limit);
      
//       // Build query
//       const query = {};
      
//       if (serviceType) {
//         query.serviceType = serviceType;
//       }
      
//       if (dateFrom || dateTo) {
//         query.createdAt = {};
//         if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
//         if (dateTo) query.createdAt.$lte = new Date(dateTo);
//       }
      
//       if (search) {
//         query.$or = [
//           { serviceId: { $regex: search, $options: 'i' } },
//           { trackingNumber: { $regex: search, $options: 'i' } },
//           { 'customer.personalInfo.fullName': { $regex: search, $options: 'i' } },
//           { 'customer.contactInfo.email': { $regex: search, $options: 'i' } },
//           { 'customer.passportInfo.passportNumber': { $regex: search, $options: 'i' } }
//         ];
//       }

//       // Determine sort order
//       const sort = {};
//       sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

//       // Get services with pagination
//       const [services, total] = await Promise.all([
//         VisaService.find(query)
//           .sort(sort)
//           .skip(skip)
//           .limit(parseInt(limit))
//           .select('serviceId trackingNumber serviceType serviceStage customer.personalInfo.fullName customer.contactInfo.email bookingDetails.bookingStatus applicationDetails.visaInfo.destinationCountry applicationDetails.visaInfo.visaType applicationDetails.applicationStatus.current applicationDetails.fees.totalAmount applicationDetails.payment.status internal.assignedTo internal.priority createdAt updatedAt')
//           .lean(),
//         VisaService.countDocuments(query)
//       ]);

//       // Calculate statistics
//       const stats = {
//         total: total,
//         byType: services.reduce((acc, service) => {
//           const type = service.serviceType || 'unknown';
//           acc[type] = (acc[type] || 0) + 1;
//           return acc;
//         }, {}),
//         byStatus: services.reduce((acc, service) => {
//           let status;
//           if (service.serviceType === 'booking') {
//             status = service.bookingDetails?.bookingStatus || 'unknown';
//           } else {
//             status = service.applicationDetails?.applicationStatus?.current || 'unknown';
//           }
//           acc[status] = (acc[status] || 0) + 1;
//           return acc;
//         }, {}),
//         totalRevenue: services.reduce((sum, service) => 
//           sum + (service.applicationDetails?.fees?.totalAmount || 0) + (service.bookingDetails?.bookingAmount || 0), 0
//         )
//       };

//       res.json({
//         success: true,
//         data: {
//           services,
//           pagination: {
//             page: parseInt(page),
//             limit: parseInt(limit),
//             total,
//             totalPages: Math.ceil(total / parseInt(limit)),
//             hasNextPage: (page * limit) < total,
//             hasPrevPage: page > 1
//           },
//           statistics: stats
//         }
//       });
//     } catch (error) {
//       console.error('Get all services error:', error);
//       res.status(500).json({
//         success: false,
//         message: 'Failed to retrieve services',
//         error: error.message
//       });
//     }
//   }
// };

// // Export all controllers
// module.exports = {
//   BookingController,
//   ApplicationController,
//   StatisticsController,
//   QueryController,
  
//   // Utility functions for direct use if needed
//   sendEmail,
//   uploadToCloudinary,
//   deleteFromCloudinary
// };

















































// const VisaService = require('../models/Visa');
// const mongoose = require('mongoose');
// const nodemailer = require('nodemailer');
// const cloudinary = require('cloudinary').v2;
// const { v4: uuidv4 } = require('uuid');

// // Configure Cloudinary
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET
// });

// // Email Service Configuration
// const emailTransporter = nodemailer.createTransport({
//   host: process.env.SMTP_HOST || 'smtp.gmail.com',
//   port: process.env.SMTP_PORT || 587,
//   secure: process.env.SMTP_SECURE === 'true',
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASS
//   }
// });

// // Email Templates
// const emailTemplates = {
//   bookingConfirmation: (bookingData) => ({
//     subject: `Booking Confirmation - ${bookingData.serviceId}`,
//     html: `
//       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//         <h2 style="color: #2c3e50;">Visa Consultation Booking Confirmed</h2>
//         <p>Dear ${bookingData.customer.personalInfo.fullName},</p>
//         <p>Your visa consultation booking has been confirmed with the following details:</p>
        
//         <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
//           <h3 style="color: #3498db;">Booking Details</h3>
//           <p><strong>Booking ID:</strong> ${bookingData.serviceId}</p>
//           <p><strong>Appointment Date:</strong> ${new Date(bookingData.bookingDetails.appointment.date).toLocaleDateString()}</p>
//           <p><strong>Time Slot:</strong> ${bookingData.bookingDetails.appointment.timeSlot}</p>
//           <p><strong>Mode:</strong> ${bookingData.bookingDetails.appointment.mode}</p>
//           ${bookingData.bookingDetails.appointment.location ? `<p><strong>Location:</strong> ${bookingData.bookingDetails.appointment.location}</p>` : ''}
//         </div>
        
//         <p>Please make sure to prepare the following for your appointment:</p>
//         <ul>
//           <li>Original Passport</li>
//           <li>Passport-sized photographs</li>
//           <li>Previous visa documents (if any)</li>
//         </ul>
        
//         <p>If you need to reschedule or cancel, please contact us at least 24 hours in advance.</p>
        
//         <hr style="margin: 30px 0;">
//         <p style="color: #7f8c8d; font-size: 12px;">
//           This is an automated email. Please do not reply to this address.
//         </p>
//       </div>
//     `
//   }),

//   applicationSubmitted: (applicationData) => ({
//     subject: `Visa Application Submitted - ${applicationData.trackingNumber}`,
//     html: `
//       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//         <h2 style="color: #2c3e50;">Visa Application Submitted</h2>
//         <p>Dear ${applicationData.customer.personalInfo.fullName},</p>
//         <p>Your visa application has been successfully submitted with the following details:</p>
        
//         <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
//           <h3 style="color: #3498db;">Application Details</h3>
//           <p><strong>Tracking Number:</strong> ${applicationData.trackingNumber}</p>
//           <p><strong>Destination:</strong> ${applicationData.applicationDetails.visaInfo.destinationCountry}</p>
//           <p><strong>Visa Type:</strong> ${applicationData.applicationDetails.visaInfo.visaType}</p>
//           <p><strong>Current Status:</strong> ${applicationData.applicationDetails.applicationStatus.current}</p>
//           <p><strong>Estimated Processing Time:</strong> ${applicationData.applicationDetails.servicePackage.processingTime}</p>
//         </div>
        
//         <p>You can track your application status using your tracking number on our website.</p>
//         <p>We will notify you via email when there are any updates to your application.</p>
        
//         <hr style="margin: 30px 0;">
//         <p style="color: #7f8c8d; font-size: 12px;">
//           This is an automated email. Please do not reply to this address.
//         </p>
//       </div>
//     `
//   }),

//   statusUpdate: (applicationData, newStatus) => ({
//     subject: `Status Update - ${applicationData.trackingNumber}`,
//     html: `
//       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//         <h2 style="color: #2c3e50;">Application Status Update</h2>
//         <p>Dear ${applicationData.customer.personalInfo.fullName},</p>
//         <p>The status of your visa application has been updated:</p>
        
//         <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
//           <h3 style="color: #3498db;">Updated Status</h3>
//           <p><strong>Tracking Number:</strong> ${applicationData.trackingNumber}</p>
//           <p><strong>New Status:</strong> ${newStatus}</p>
//           <p><strong>Updated Date:</strong> ${new Date().toLocaleDateString()}</p>
//         </div>
        
//         <p>Next Steps: No action required at this time</p>
        
//         <p>If you have any questions, please contact our support team.</p>
        
//         <hr style="margin: 30px 0;">
//         <p style="color: #7f8c8d; font-size: 12px;">
//           This is an automated email. Please do not reply to this address.
//         </p>
//       </div>
//     `
//   }),

//   paymentConfirmation: (applicationData, paymentDetails) => ({
//     subject: `Payment Received - ${applicationData.trackingNumber}`,
//     html: `
//       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//         <h2 style="color: #2c3e50;">Payment Confirmation</h2>
//         <p>Dear ${applicationData.customer.personalInfo.fullName},</p>
//         <p>We have received your payment for visa application services:</p>
        
//         <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
//           <h3 style="color: #3498db;">Payment Details</h3>
//           <p><strong>Transaction ID:</strong> ${paymentDetails.transactionId}</p>
//           <p><strong>Amount Paid:</strong> ${paymentDetails.amount} ${applicationData.applicationDetails.fees.currency}</p>
//           <p><strong>Payment Method:</strong> ${paymentDetails.method}</p>
//           <p><strong>Payment Date:</strong> ${new Date(paymentDetails.date).toLocaleDateString()}</p>
//           <p><strong>Balance Due:</strong> ${applicationData.balanceDue || 0} ${applicationData.applicationDetails.fees.currency}</p>
//         </div>
        
//         <p>Your application will now proceed to the next stage.</p>
        
//         <hr style="margin: 30px 0;">
//         <p style="color: #7f8c8d; font-size: 12px;">
//           This is an automated email. Please do not reply to this address.
//         </p>
//       </div>
//     `
//   }),

//   documentUploadConfirmation: (applicationData, documentType) => ({
//     subject: `Document Received - ${applicationData.trackingNumber}`,
//     html: `
//       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//         <h2 style="color: #2c3e50;">Document Upload Confirmation</h2>
//         <p>Dear ${applicationData.customer.personalInfo.fullName},</p>
//         <p>We have successfully received your ${documentType} for visa application:</p>
        
//         <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
//           <h3 style="color: #3498db;">Upload Details</h3>
//           <p><strong>Tracking Number:</strong> ${applicationData.trackingNumber}</p>
//           <p><strong>Document Type:</strong> ${documentType}</p>
//           <p><strong>Upload Date:</strong> ${new Date().toLocaleDateString()}</p>
//           <p><strong>Documents Uploaded:</strong> ${applicationData.totalDocuments || 0}</p>
//           <p><strong>Documents Verified:</strong> ${applicationData.verifiedDocuments || 0}</p>
//         </div>
        
//         <p>Our team will review your document and update the verification status.</p>
        
//         <hr style="margin: 30px 0;">
//         <p style="color: #7f8c8d; font-size: 12px;">
//           This is an automated email. Please do not reply to this address.
//         </p>
//       </div>
//     `
//   })
// };

// // Helper function to send emails
// const sendEmail = async (to, template, data) => {
//   try {
//     const emailTemplate = emailTemplates[template](data);
//     const mailOptions = {
//       from: process.env.EMAIL_FROM || 'visa-services@example.com',
//       to,
//       subject: emailTemplate.subject,
//       html: emailTemplate.html
//     };

//     await emailTransporter.sendMail(mailOptions);
//     return { success: true, message: 'Email sent successfully' };
//   } catch (error) {
//     console.error('Email sending error:', error);
//     return { success: false, message: 'Failed to send email', error: error.message };
//   }
// };

// // Helper function to upload to Cloudinary
// const uploadToCloudinary = async (file, folder = 'visa_documents') => {
//   try {
//     const result = await cloudinary.uploader.upload(file.path || file.buffer.toString('base64'), {
//       folder: folder,
//       resource_type: 'auto',
//       transformation: [
//         { quality: 'auto:good' },
//         { fetch_format: 'auto' }
//       ]
//     });

//     return {
//       success: true,
//       cloudinaryUrl: result.secure_url,
//       publicId: result.public_id,
//       originalName: file.originalname
//     };
//   } catch (error) {
//     console.error('Cloudinary upload error:', error);
//     return { success: false, message: 'Failed to upload to Cloudinary', error: error.message };
//   }
// };

// // Helper function to delete from Cloudinary
// const deleteFromCloudinary = async (publicId) => {
//   try {
//     await cloudinary.uploader.destroy(publicId);
//     return { success: true, message: 'File deleted from Cloudinary' };
//   } catch (error) {
//     console.error('Cloudinary delete error:', error);
//     return { success: false, message: 'Failed to delete from Cloudinary', error: error.message };
//   }
// };

// // Helper function to calculate verified documents
// const calculateVerifiedDocuments = function(documents) {
//   let count = 0;
//   if (documents?.photograph?.verified) count++;
//   if (documents?.passportCopy?.verified) count++;
//   count += documents?.financialDocuments?.filter(doc => doc.verified)?.length || 0;
//   count += documents?.travelDocuments?.filter(doc => doc.verified)?.length || 0;
//   count += documents?.supportingDocuments?.filter(doc => doc.verified)?.length || 0;
//   count += documents?.otherDocuments?.filter(doc => doc.verified)?.length || 0;
//   return count;
// };

// // ========== BOOKING CONTROLLERS ==========

// const BookingController = {
//   // Create a new booking
//   createBooking: async (req, res) => {
//     try {
//       const {
//         customer,
//         bookingDetails,
//         internal
//       } = req.body;

//       // Validate required fields based on model
//       const requiredFields = [
//         { field: customer?.personalInfo?.fullName, message: 'Customer full name is required' },
//         { field: customer?.personalInfo?.dateOfBirth, message: 'Customer date of birth is required' },
//         { field: customer?.personalInfo?.nationality, message: 'Customer nationality is required' },
//         { field: customer?.personalInfo?.countryOfResidence, message: 'Customer country of residence is required' },
//         { field: customer?.contactInfo?.email, message: 'Customer email is required' },
//         { field: customer?.contactInfo?.primaryPhone, message: 'Customer primary phone is required' }
//       ];

//       for (const { field, message } of requiredFields) {
//         if (!field) {
//           return res.status(400).json({
//             success: false,
//             message
//           });
//         }
//       }

//       // Validate email format
//       const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
//       if (!emailRegex.test(customer.contactInfo.email)) {
//         return res.status(400).json({
//           success: false,
//           message: 'Please provide a valid email address'
//         });
//       }

//       // Prepare booking data according to model schema
//       const bookingData = {
//         serviceType: 'booking',
//         serviceStage: 'booking-pending',
//         customer: {
//           personalInfo: {
//             fullName: customer.personalInfo.fullName.trim(),
//             dateOfBirth: new Date(customer.personalInfo.dateOfBirth),
//             gender: customer.personalInfo.gender || 'prefer-not-to-say',
//             nationality: customer.personalInfo.nationality,
//             countryOfResidence: customer.personalInfo.countryOfResidence,
//             maritalStatus: customer.personalInfo.maritalStatus || 'single',
//             occupation: customer.personalInfo.occupation,
//             employer: customer.personalInfo.employer
//           },
//           contactInfo: {
//             email: customer.contactInfo.email.toLowerCase().trim(),
//             primaryPhone: customer.contactInfo.primaryPhone,
//             secondaryPhone: customer.contactInfo.secondaryPhone,
//             whatsappNumber: customer.contactInfo.whatsappNumber,
//             address: customer.contactInfo.address || {},
//             emergencyContact: customer.contactInfo.emergencyContact || {}
//           },
//           passportInfo: {
//             passportNumber: customer.passportInfo?.passportNumber,
//             issuingCountry: customer.passportInfo?.issuingCountry,
//             issueDate: customer.passportInfo?.issueDate ? new Date(customer.passportInfo.issueDate) : undefined,
//             expiryDate: customer.passportInfo?.expiryDate ? new Date(customer.passportInfo.expiryDate) : undefined,
//             placeOfIssue: customer.passportInfo?.placeOfIssue,
//             hasPreviousVisas: customer.passportInfo?.hasPreviousVisas || false,
//             previousVisaDetails: customer.passportInfo?.previousVisaDetails || []
//           }
//         },
//         bookingDetails: {
//           type: bookingDetails?.type || 'consultation',
//           serviceRequested: bookingDetails?.serviceRequested,
//           appointment: bookingDetails?.appointment ? {
//             date: bookingDetails.appointment.date ? new Date(bookingDetails.appointment.date) : undefined,
//             timeSlot: bookingDetails.appointment.timeSlot,
//             duration: bookingDetails.appointment.duration || 60,
//             mode: bookingDetails.appointment.mode || 'in-person',
//             location: bookingDetails.appointment.location,
//             address: bookingDetails.appointment.address,
//             confirmed: bookingDetails.appointment.confirmed || false,
//             attended: bookingDetails.appointment.attended || false,
//             notes: bookingDetails.appointment.notes
//           } : undefined,
//           bookingStatus: bookingDetails?.bookingStatus || 'pending',
//           bookingAmount: bookingDetails?.bookingAmount || 0,
//           bookingPayment: bookingDetails?.bookingPayment ? {
//             status: bookingDetails.bookingPayment.status || 'pending',
//             method: bookingDetails.bookingPayment.method,
//             transactionId: bookingDetails.bookingPayment.transactionId,
//             paidAt: bookingDetails.bookingPayment.paidAt ? new Date(bookingDetails.bookingPayment.paidAt) : undefined
//           } : undefined
//         },
//         applicationDetails: {
//           visaInfo: {
//             destinationCountry: '',
//             appliedCountries: [],
//             visaType: 'Tourist',
//             category: 'short-term',
//             purposeOfTravel: '',
//             travelDates: {},
//             entriesRequested: 'Single',
//             travelCompanions: []
//           },
//           servicePackage: {
//             name: 'standard',
//             description: '',
//             processingTime: '15-20 business days',
//             inclusions: [],
//             exclusions: []
//           },
//           fees: {
//             consultationFee: 0,
//             serviceFee: 0,
//             embassyFee: 0,
//             additionalFees: 0,
//             discount: 0,
//             totalAmount: 0,
//             currency: 'USD'
//           },
//           payment: {
//             status: 'pending',
//             amountPaid: 0,
//             paymentMethod: undefined,
//             dueDate: undefined,
//             paymentHistory: []
//           },
//           applicationStatus: {
//             current: 'not-started',
//             submittedAt: undefined,
//             processingStartedAt: undefined,
//             expectedCompletionDate: undefined,
//             actualCompletionDate: undefined,
//             embassySubmissionDate: undefined,
//             decisionDate: undefined,
//             collectionDate: undefined
//           },
//           embassyInfo: {},
//           visaIssuance: {}
//         },
//         internal: {
//           assignedTo: internal?.assignedTo ? {
//             agentId: internal.assignedTo.agentId ? new mongoose.Types.ObjectId(internal.assignedTo.agentId) : undefined,
//             agentName: internal.assignedTo.agentName,
//             agentEmail: internal.assignedTo.agentEmail,
//             department: internal.assignedTo.department,
//             assignedAt: internal.assignedTo.assignedAt ? new Date(internal.assignedTo.assignedAt) : new Date(),
//             lastContacted: internal.assignedTo.lastContacted ? new Date(internal.assignedTo.lastContacted) : undefined
//           } : undefined,
//           priority: internal?.priority || 'normal',
//           source: internal?.source || 'website',
//           notes: internal?.notes || []
//         }
//       };

//       // Create the booking
//       const newBooking = new VisaService(bookingData);
//       await newBooking.save();

//       // Send confirmation email
//       try {
//         await sendEmail(
//           newBooking.customer.contactInfo.email,
//           'bookingConfirmation',
//           newBooking.toObject()
//         );
//       } catch (emailError) {
//         console.warn('Email sending failed, but booking was created:', emailError.message);
//       }

//       res.status(201).json({
//         success: true,
//         message: 'Booking created successfully',
//         data: {
//           serviceId: newBooking.serviceId,
//           serviceType: newBooking.serviceType,
//           serviceStage: newBooking.serviceStage,
//           customer: {
//             fullName: newBooking.customer.personalInfo.fullName,
//             email: newBooking.customer.contactInfo.email
//           },
//           bookingDetails: {
//             type: newBooking.bookingDetails.type,
//             status: newBooking.bookingDetails.bookingStatus,
//             amount: newBooking.bookingDetails.bookingAmount
//           },
//           createdAt: newBooking.createdAt
//         }
//       });

//     } catch (error) {
//       console.error('Create booking error:', error);
      
//       if (error.name === 'ValidationError') {
//         const errors = {};
//         Object.keys(error.errors).forEach(key => {
//           errors[key] = error.errors[key].message;
//         });
        
//         return res.status(400).json({
//           success: false,
//           message: 'Validation failed',
//           errors: errors
//         });
//       }
      
//       if (error.code === 11000) {
//         const field = Object.keys(error.keyPattern)[0];
//         return res.status(400).json({
//           success: false,
//           message: `Duplicate value for ${field}`,
//           field: field,
//           value: error.keyValue[field]
//         });
//       }
      
//       res.status(500).json({
//         success: false,
//         message: 'Failed to create booking',
//         error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
//       });
//     }
//   },

//   // Get booking by ID
//   getBookingById: async (req, res) => {
//     try {
//       const { bookingId } = req.params;
      
//       const booking = await VisaService.findOne({ 
//         serviceId: bookingId,
//         serviceType: { $in: ['booking', 'combined'] }
//       });

//       if (!booking) {
//         return res.status(404).json({
//           success: false,
//           message: 'Booking not found'
//         });
//       }

//       res.json({
//         success: true,
//         data: booking
//       });
//     } catch (error) {
//       console.error('Get booking by ID error:', error);
//       res.status(500).json({
//         success: false,
//         message: 'Failed to retrieve booking',
//         error: error.message
//       });
//     }
//   },

//   // Update booking
//   updateBooking: async (req, res) => {
//     try {
//       const { bookingId } = req.params;
//       const updateData = req.body;

//       const booking = await VisaService.findOne({ 
//         serviceId: bookingId, 
//         serviceType: { $in: ['booking', 'combined'] } 
//       });

//       if (!booking) {
//         return res.status(404).json({
//           success: false,
//           message: 'Booking not found'
//         });
//       }

//       // Prevent updating serviceId and trackingNumber
//       delete updateData.serviceId;
//       delete updateData.trackingNumber;

//       // Update fields
//       Object.keys(updateData).forEach(key => {
//         if (key === 'customer' || key === 'bookingDetails' || key === 'internal') {
//           // Deep merge for nested objects
//           booking[key] = { ...booking[key], ...updateData[key] };
//         } else {
//           booking[key] = updateData[key];
//         }
//       });

//       await booking.save();

//       res.json({
//         success: true,
//         message: 'Booking updated successfully',
//         data: booking
//       });
//     } catch (error) {
//       console.error('Update booking error:', error);
//       res.status(500).json({
//         success: false,
//         message: 'Failed to update booking',
//         error: error.message
//       });
//     }
//   },

//   // Confirm appointment
//   confirmAppointment: async (req, res) => {
//     try {
//       const { bookingId } = req.params;
//       const { confirmedBy } = req.body;

//       const booking = await VisaService.findOne({ 
//         serviceId: bookingId,
//         serviceType: { $in: ['booking', 'combined'] }
//       });

//       if (!booking) {
//         return res.status(404).json({
//           success: false,
//           message: 'Booking not found'
//         });
//       }

//       if (!booking.bookingDetails.appointment || !booking.bookingDetails.appointment.date) {
//         return res.status(400).json({
//           success: false,
//           message: 'No appointment scheduled for this booking'
//         });
//       }

//       // Confirm appointment
//       booking.bookingDetails.appointment.confirmed = true;
//       booking.bookingDetails.bookingStatus = 'confirmed';
//       booking.serviceStage = 'booking-confirmed';

//       // Add note
//       booking.internal.notes.push({
//         note: `Appointment confirmed by ${confirmedBy || 'system'}`,
//         addedBy: confirmedBy || 'system',
//         addedAt: new Date(),
//         category: 'appointment',
//         priority: 'normal'
//       });

//       await booking.save();

//       // Send confirmation email
//       await sendEmail(
//         booking.customer.contactInfo.email,
//         'bookingConfirmation',
//         booking.toObject()
//       );

//       res.json({
//         success: true,
//         message: 'Appointment confirmed successfully',
//         data: {
//           serviceId: booking.serviceId,
//           appointmentDate: booking.bookingDetails.appointment.date,
//           timeSlot: booking.bookingDetails.appointment.timeSlot,
//           status: booking.bookingDetails.bookingStatus,
//           serviceStage: booking.serviceStage
//         }
//       });
//     } catch (error) {
//       console.error('Confirm appointment error:', error);
//       res.status(500).json({
//         success: false,
//         message: 'Failed to confirm appointment',
//         error: error.message
//       });
//     }
//   },

//   // Mark consultation as completed
//   markConsultationCompleted: async (req, res) => {
//     try {
//       const { bookingId } = req.params;
//       const { attendedBy, notes } = req.body;

//       const booking = await VisaService.findOne({ 
//         serviceId: bookingId,
//         serviceType: { $in: ['booking', 'combined'] }
//       });

//       if (!booking) {
//         return res.status(404).json({
//           success: false,
//           message: 'Booking not found'
//         });
//       }

//       if (!booking.bookingDetails.appointment) {
//         return res.status(400).json({
//           success: false,
//           message: 'No appointment scheduled for this booking'
//         });
//       }

//       // Mark as attended and completed
//       booking.bookingDetails.appointment.attended = true;
//       booking.bookingDetails.appointment.notes = notes || booking.bookingDetails.appointment.notes;
//       booking.bookingDetails.bookingStatus = 'completed';
//       booking.serviceStage = 'consultation-completed';

//       // Add note
//       booking.internal.notes.push({
//         note: `Consultation marked as completed by ${attendedBy || 'system'}. ${notes || ''}`,
//         addedBy: attendedBy || 'system',
//         addedAt: new Date(),
//         category: 'consultation',
//         priority: 'normal'
//       });

//       await booking.save();

//       res.json({
//         success: true,
//         message: 'Consultation marked as completed',
//         data: {
//           serviceId: booking.serviceId,
//           attended: booking.bookingDetails.appointment.attended,
//           status: booking.bookingDetails.bookingStatus,
//           serviceStage: booking.serviceStage
//         }
//       });
//     } catch (error) {
//       console.error('Mark consultation completed error:', error);
//       res.status(500).json({
//         success: false,
//         message: 'Failed to mark consultation as completed',
//         error: error.message
//       });
//     }
//   },

//   // Convert booking to application
//   convertToApplication: async (req, res) => {
//     try {
//       const { bookingId } = req.params;
//       const { applicationDetails } = req.body;

//       const booking = await VisaService.findOne({ 
//         serviceId: bookingId,
//         serviceType: { $in: ['booking', 'combined'] }
//       });

//       if (!booking) {
//         return res.status(404).json({
//           success: false,
//           message: 'Booking not found'
//         });
//       }

//       // Validate application details
//       if (!applicationDetails?.visaInfo?.destinationCountry) {
//         return res.status(400).json({
//           success: false,
//           message: 'Destination country is required for application'
//         });
//       }

//       if (!applicationDetails?.visaInfo?.visaType) {
//         return res.status(400).json({
//           success: false,
//           message: 'Visa type is required for application'
//         });
//       }

//       // Convert to combined service
//       booking.serviceType = 'combined';
//       booking.serviceStage = 'application-initiated';
      
//       // Update application details
//       booking.applicationDetails = {
//         ...booking.applicationDetails,
//         visaInfo: {
//           ...booking.applicationDetails.visaInfo,
//           destinationCountry: applicationDetails.visaInfo.destinationCountry,
//           visaType: applicationDetails.visaInfo.visaType,
//           category: applicationDetails.visaInfo.category || 'short-term',
//           purposeOfTravel: applicationDetails.visaInfo.purposeOfTravel || '',
//           travelDates: applicationDetails.visaInfo.travelDates || {},
//           entriesRequested: applicationDetails.visaInfo.entriesRequested || 'Single',
//           travelCompanions: applicationDetails.visaInfo.travelCompanions || []
//         },
//         servicePackage: {
//           ...booking.applicationDetails.servicePackage,
//           ...applicationDetails.servicePackage
//         },
//         fees: {
//           ...booking.applicationDetails.fees,
//           ...applicationDetails.fees
//         },
//         payment: {
//           ...booking.applicationDetails.payment,
//           ...applicationDetails.payment
//         },
//         applicationStatus: {
//           ...booking.applicationDetails.applicationStatus,
//           current: 'draft'
//         }
//       };

//       // Generate tracking number
//       const timestamp = Date.now();
//       const random = Math.floor(Math.random() * 1000);
//       booking.trackingNumber = `VISA-${timestamp}-${random}`;

//       // Add note
//       booking.internal.notes.push({
//         note: 'Booking converted to visa application',
//         addedBy: 'system',
//         addedAt: new Date(),
//         category: 'conversion',
//         priority: 'normal'
//       });

//       await booking.save();

//       // Send application submitted email
//       await sendEmail(
//         booking.customer.contactInfo.email,
//         'applicationSubmitted',
//         booking.toObject()
//       );

//       res.json({
//         success: true,
//         message: 'Booking converted to application successfully',
//         data: {
//           serviceId: booking.serviceId,
//           trackingNumber: booking.trackingNumber,
//           serviceType: booking.serviceType,
//           serviceStage: booking.serviceStage,
//           applicationStatus: booking.applicationDetails.applicationStatus.current
//         }
//       });
//     } catch (error) {
//       console.error('Convert to application error:', error);
//       res.status(500).json({
//         success: false,
//         message: 'Failed to convert booking to application',
//         error: error.message
//       });
//     }
//   },

//   // Get all bookings
//   getAllBookings: async (req, res) => {
//     try {
//       const {
//         page = 1,
//         limit = 20,
//         sortBy = 'createdAt',
//         sortOrder = 'desc',
//         status,
//         type,
//         dateFrom,
//         dateTo,
//         customerName,
//         email,
//         agentId
//       } = req.query;

//       const skip = (parseInt(page) - 1) * parseInt(limit);
      
//       // Build query for bookings
//       const query = { serviceType: { $in: ['booking', 'combined'] } };
      
//       // Apply filters
//       if (status) {
//         query['bookingDetails.bookingStatus'] = status;
//       }
      
//       if (type) {
//         query['bookingDetails.type'] = type;
//       }
      
//       if (dateFrom || dateTo) {
//         query.createdAt = {};
//         if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
//         if (dateTo) query.createdAt.$lte = new Date(dateTo);
//       }
      
//       if (customerName) {
//         query['customer.personalInfo.fullName'] = { 
//           $regex: customerName, 
//           $options: 'i' 
//         };
//       }
      
//       if (email) {
//         query['customer.contactInfo.email'] = { 
//           $regex: email, 
//           $options: 'i' 
//         };
//       }
      
//       if (agentId && mongoose.Types.ObjectId.isValid(agentId)) {
//         query['internal.assignedTo.agentId'] = new mongoose.Types.ObjectId(agentId);
//       }

//       // Determine sort order
//       const sort = {};
//       sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

//       // Get bookings with pagination
//       const [bookings, total] = await Promise.all([
//         VisaService.find(query)
//           .sort(sort)
//           .skip(skip)
//           .limit(parseInt(limit))
//           .select('-documents -communications -statusHistory -auditLog -__v')
//           .lean(),
//         VisaService.countDocuments(query)
//       ]);

//       // Calculate statistics
//       const stats = {
//         totalBookings: total,
//         byStatus: bookings.reduce((acc, booking) => {
//           const status = booking.bookingDetails?.bookingStatus || 'unknown';
//           acc[status] = (acc[status] || 0) + 1;
//           return acc;
//         }, {}),
//         byType: bookings.reduce((acc, booking) => {
//           const type = booking.bookingDetails?.type || 'unknown';
//           acc[type] = (acc[type] || 0) + 1;
//           return acc;
//         }, {}),
//         totalRevenue: bookings.reduce((sum, booking) => 
//           sum + (booking.bookingDetails?.bookingAmount || 0), 0
//         ),
//         upcomingAppointments: bookings.filter(booking => 
//           booking.bookingDetails?.appointment?.date && 
//           new Date(booking.bookingDetails.appointment.date) > new Date()
//         ).length,
//         confirmedAppointments: bookings.filter(booking => 
//           booking.bookingDetails?.appointment?.confirmed === true
//         ).length
//       };

//       res.json({
//         success: true,
//         data: {
//           bookings,
//           pagination: {
//             page: parseInt(page),
//             limit: parseInt(limit),
//             total,
//             totalPages: Math.ceil(total / parseInt(limit)),
//             hasNextPage: (parseInt(page) * parseInt(limit)) < total,
//             hasPrevPage: parseInt(page) > 1
//           },
//           statistics: stats
//         }
//       });
//     } catch (error) {
//       console.error('Get all bookings error:', error);
//       res.status(500).json({
//         success: false,
//         message: 'Failed to retrieve bookings',
//         error: error.message
//       });
//     }
//   },
// getBookingsByEmail: async (req, res) => {
//     try {
//       const { email } = req.params;
//       const {
//         page = 1,
//         limit = 20,
//         sortBy = 'createdAt',
//         sortOrder = 'desc',
//         status,
//         type,
//         dateFrom,
//         dateTo,
//         customerName,
//         agentId
//       } = req.query;

//       const skip = (parseInt(page) - 1) * parseInt(limit);

//       // Build query for bookings by email
//       const query = {
//         serviceType: { $in: ['booking', 'combined'] },
//         'customer.contactInfo.email': email.toLowerCase()
//       };

//       // Apply other filters
//       if (status) query['bookingDetails.bookingStatus'] = status;
//       if (type) query['bookingDetails.type'] = type;
//       if (dateFrom || dateTo) {
//         query.createdAt = {};
//         if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
//         if (dateTo) query.createdAt.$lte = new Date(dateTo);
//       }
//       if (customerName) {
//         query['customer.personalInfo.fullName'] = { $regex: customerName, $options: 'i' };
//       }
//       if (agentId && mongoose.Types.ObjectId.isValid(agentId)) {
//         query['internal.assignedTo.agentId'] = new mongoose.Types.ObjectId(agentId);
//       }

//       // Sort
//       const sort = {};
//       sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

//       // Fetch bookings
//       const [bookings, total] = await Promise.all([
//         VisaService.find(query)
//           .sort(sort)
//           .skip(skip)
//           .limit(parseInt(limit))
//           .select('-documents -communications -statusHistory -auditLog -__v')
//           .lean(),
//         VisaService.countDocuments(query)
//       ]);

//       // Calculate statistics
//       const stats = {
//         totalBookings: total,
//         byStatus: bookings.reduce((acc, booking) => {
//           const status = booking.bookingDetails?.bookingStatus || 'unknown';
//           acc[status] = (acc[status] || 0) + 1;
//           return acc;
//         }, {}),
//         byType: bookings.reduce((acc, booking) => {
//           const type = booking.bookingDetails?.type || 'unknown';
//           acc[type] = (acc[type] || 0) + 1;
//           return acc;
//         }, {}),
//         totalRevenue: bookings.reduce((sum, booking) => 
//           sum + (booking.bookingDetails?.bookingAmount || 0), 0
//         ),
//         upcomingAppointments: bookings.filter(booking => 
//           booking.bookingDetails?.appointment?.date && 
//           new Date(booking.bookingDetails.appointment.date) > new Date()
//         ).length,
//         confirmedAppointments: bookings.filter(booking => 
//           booking.bookingDetails?.appointment?.confirmed === true
//         ).length
//       };

//       res.json({
//         success: true,
//         data: {
//           bookings,
//           pagination: {
//             page: parseInt(page),
//             limit: parseInt(limit),
//             total,
//             totalPages: Math.ceil(total / parseInt(limit)),
//             hasNextPage: (parseInt(page) * parseInt(limit)) < total,
//             hasPrevPage: parseInt(page) > 1
//           },
//           statistics: stats
//         }
//       });
//     } catch (error) {
//       console.error('Get bookings by email error:', error);
//       res.status(500).json({
//         success: false,
//         message: 'Failed to retrieve bookings by email',
//         error: error.message
//       });
//     }
//   },


//   // Cancel booking
//   cancelBooking: async (req, res) => {
//     try {
//       const { bookingId } = req.params;
//       const { reason, cancelledBy } = req.body;

//       const booking = await VisaService.findOne({ 
//         serviceId: bookingId,
//         serviceType: { $in: ['booking', 'combined'] }
//       });

//       if (!booking) {
//         return res.status(404).json({
//           success: false,
//           message: 'Booking not found'
//         });
//       }

//       // Update booking status
//       booking.bookingDetails.bookingStatus = 'cancelled';
//       booking.serviceStage = 'cancelled';
      
//       // Add note
//       booking.internal.notes.push({
//         note: `Booking cancelled. Reason: ${reason}`,
//         addedBy: cancelledBy || 'system',
//         addedAt: new Date(),
//         category: 'cancellation',
//         priority: 'high'
//       });

//       await booking.save();

//       // Send cancellation email
//       await sendEmail(
//         booking.customer.contactInfo.email,
//         'statusUpdate',
//         { 
//           ...booking.toObject(), 
//           newStatus: 'Booking Cancelled' 
//         }
//       );

//       res.json({
//         success: true,
//         message: 'Booking cancelled successfully',
//         data: {
//           serviceId: booking.serviceId,
//           status: booking.bookingDetails.bookingStatus,
//           serviceStage: booking.serviceStage
//         }
//       });
//     } catch (error) {
//       console.error('Cancel booking error:', error);
//       res.status(500).json({
//         success: false,
//         message: 'Failed to cancel booking',
//         error: error.message
//       });
//     }
//   },

//   // Get upcoming appointments
//   getUpcomingAppointments: async (req, res) => {
//     try {
//       const { daysAhead = 7, includePast = false } = req.query;

//       const now = new Date();
//       const futureDate = new Date();
//       futureDate.setDate(now.getDate() + parseInt(daysAhead));

//       const query = {
//         serviceType: { $in: ['booking', 'combined'] },
//         'bookingDetails.appointment.date': { 
//           $exists: true,
//           $ne: null
//         },
//         'bookingDetails.bookingStatus': { $in: ['pending', 'confirmed'] }
//       };

//       if (!includePast) {
//         query['bookingDetails.appointment.date'].$gte = now;
//       }
//       query['bookingDetails.appointment.date'].$lte = futureDate;

//       const appointments = await VisaService.find(query)
//         .sort({ 'bookingDetails.appointment.date': 1 })
//         .select('serviceId customer.personalInfo.fullName customer.contactInfo.email customer.contactInfo.primaryPhone bookingDetails.appointment bookingDetails.bookingStatus internal.assignedTo')
//         .lean();

//       // Group by date
//       const appointmentsByDate = {};
//       appointments.forEach(appointment => {
//         if (appointment.bookingDetails?.appointment?.date) {
//           const dateStr = new Date(appointment.bookingDetails.appointment.date).toDateString();
//           if (!appointmentsByDate[dateStr]) {
//             appointmentsByDate[dateStr] = [];
//           }
//           appointmentsByDate[dateStr].push(appointment);
//         }
//       });

//       res.json({
//         success: true,
//         data: {
//           appointments,
//           appointmentsByDate,
//           statistics: {
//             total: appointments.length,
//             confirmed: appointments.filter(a => a.bookingDetails?.bookingStatus === 'confirmed').length,
//             pending: appointments.filter(a => a.bookingDetails?.bookingStatus === 'pending').length,
//             today: appointments.filter(a => {
//               if (!a.bookingDetails?.appointment?.date) return false;
//               const appointmentDate = new Date(a.bookingDetails.appointment.date);
//               return appointmentDate.toDateString() === now.toDateString();
//             }).length
//           },
//           timeframe: {
//             from: now.toISOString(),
//             to: futureDate.toISOString(),
//             days: parseInt(daysAhead)
//           }
//         }
//       });
//     } catch (error) {
//       console.error('Get upcoming appointments error:', error);
//       res.status(500).json({
//         success: false,
//         message: 'Failed to retrieve upcoming appointments',
//         error: error.message
//       });
//     }
//   }
// };

// // ========== APPLICATION CONTROLLERS ==========

// const ApplicationController = {
//   // Create new visa application (without booking)
//   // createApplication: async (req, res) => {
//   //   try {
//   //     const {
//   //       customer,
//   //       applicationDetails,
//   //       internal
//   //     } = req.body;

//   //     // Validate required fields based on model
//   //     const requiredFields = [
//   //       { field: customer?.personalInfo?.fullName, message: 'Customer full name is required' },
//   //       { field: customer?.personalInfo?.dateOfBirth, message: 'Customer date of birth is required' },
//   //       { field: customer?.personalInfo?.nationality, message: 'Customer nationality is required' },
//   //       { field: customer?.personalInfo?.countryOfResidence, message: 'Customer country of residence is required' },
//   //       { field: customer?.contactInfo?.email, message: 'Customer email is required' },
//   //       { field: customer?.contactInfo?.primaryPhone, message: 'Customer primary phone is required' },
//   //       { field: applicationDetails?.visaInfo?.destinationCountry, message: 'Destination country is required' },
//   //       { field: applicationDetails?.visaInfo?.visaType, message: 'Visa type is required' }
//   //     ];

//   //     for (const { field, message } of requiredFields) {
//   //       if (!field) {
//   //         return res.status(400).json({
//   //           success: false,
//   //           message
//   //         });
//   //       }
//   //     }

//   //     // Validate email format
//   //     const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
//   //     if (!emailRegex.test(customer.contactInfo.email)) {
//   //       return res.status(400).json({
//   //         success: false,
//   //         message: 'Please provide a valid email address'
//   //       });
//   //     }

//   //     // Prepare application data according to model schema
//   //     const applicationData = {
//   //       serviceType: 'application',
//   //       serviceStage: 'application-initiated',
//   //       customer: {
//   //         personalInfo: {
//   //           fullName: customer.personalInfo.fullName.trim(),
//   //           dateOfBirth: new Date(customer.personalInfo.dateOfBirth),
//   //           gender: customer.personalInfo.gender || 'prefer-not-to-say',
//   //           nationality: customer.personalInfo.nationality,
//   //           countryOfResidence: customer.personalInfo.countryOfResidence,
//   //           maritalStatus: customer.personalInfo.maritalStatus || 'single',
//   //           occupation: customer.personalInfo.occupation,
//   //           employer: customer.personalInfo.employer
//   //         },
//   //         contactInfo: {
//   //           email: customer.contactInfo.email.toLowerCase().trim(),
//   //           primaryPhone: customer.contactInfo.primaryPhone,
//   //           secondaryPhone: customer.contactInfo.secondaryPhone,
//   //           whatsappNumber: customer.contactInfo.whatsappNumber,
//   //           address: customer.contactInfo.address || {},
//   //           emergencyContact: customer.contactInfo.emergencyContact || {}
//   //         },
//   //         passportInfo: {
//   //           passportNumber: customer.passportInfo?.passportNumber,
//   //           issuingCountry: customer.passportInfo?.issuingCountry,
//   //           issueDate: customer.passportInfo?.issueDate ? new Date(customer.passportInfo.issueDate) : undefined,
//   //           expiryDate: customer.passportInfo?.expiryDate ? new Date(customer.passportInfo.expiryDate) : undefined,
//   //           placeOfIssue: customer.passportInfo?.placeOfIssue,
//   //           hasPreviousVisas: customer.passportInfo?.hasPreviousVisas || false,
//   //           previousVisaDetails: customer.passportInfo?.previousVisaDetails || []
//   //         }
//   //       },
//   //       applicationDetails: {
//   //         visaInfo: {
//   //           destinationCountry: applicationDetails.visaInfo.destinationCountry,
//   //           appliedCountries: applicationDetails.visaInfo.appliedCountries || [],
//   //           visaType: applicationDetails.visaInfo.visaType,
//   //           category: applicationDetails.visaInfo.category || 'short-term',
//   //           purposeOfTravel: applicationDetails.visaInfo.purposeOfTravel || '',
//   //           travelDates: applicationDetails.visaInfo.travelDates || {},
//   //           entriesRequested: applicationDetails.visaInfo.entriesRequested || 'Single',
//   //           travelCompanions: applicationDetails.visaInfo.travelCompanions || []
//   //         },
//   //         servicePackage: {
//   //           name: applicationDetails.servicePackage?.name || 'standard',
//   //           description: applicationDetails.servicePackage?.description || '',
//   //           processingTime: applicationDetails.servicePackage?.processingTime || '15-20 business days',
//   //           inclusions: applicationDetails.servicePackage?.inclusions || [],
//   //           exclusions: applicationDetails.servicePackage?.exclusions || []
//   //         },
//   //         fees: {
//   //           consultationFee: applicationDetails.fees?.consultationFee || 0,
//   //           serviceFee: applicationDetails.fees?.serviceFee || 0,
//   //           embassyFee: applicationDetails.fees?.embassyFee || 0,
//   //           additionalFees: applicationDetails.fees?.additionalFees || 0,
//   //           discount: applicationDetails.fees?.discount || 0,
//   //           totalAmount: applicationDetails.fees?.totalAmount || 0,
//   //           currency: applicationDetails.fees?.currency || 'USD'
//   //         },
//   //         payment: {
//   //           status: applicationDetails.payment?.status || 'pending',
//   //           amountPaid: applicationDetails.payment?.amountPaid || 0,
//   //           paymentMethod: applicationDetails.payment?.paymentMethod,
//   //           dueDate: applicationDetails.payment?.dueDate ? new Date(applicationDetails.payment.dueDate) : undefined,
//   //           paymentHistory: applicationDetails.payment?.paymentHistory || []
//   //         },
//   //         applicationStatus: {
//   //           current: applicationDetails.applicationStatus?.current || 'draft',
//   //           submittedAt: applicationDetails.applicationStatus?.submittedAt ? new Date(applicationDetails.applicationStatus.submittedAt) : undefined,
//   //           processingStartedAt: applicationDetails.applicationStatus?.processingStartedAt ? new Date(applicationDetails.applicationStatus.processingStartedAt) : undefined,
//   //           expectedCompletionDate: applicationDetails.applicationStatus?.expectedCompletionDate ? new Date(applicationDetails.applicationStatus.expectedCompletionDate) : undefined,
//   //           actualCompletionDate: applicationDetails.applicationStatus?.actualCompletionDate ? new Date(applicationDetails.applicationStatus.actualCompletionDate) : undefined,
//   //           embassySubmissionDate: applicationDetails.applicationStatus?.embassySubmissionDate ? new Date(applicationDetails.applicationStatus.embassySubmissionDate) : undefined,
//   //           decisionDate: applicationDetails.applicationStatus?.decisionDate ? new Date(applicationDetails.applicationStatus.decisionDate) : undefined,
//   //           collectionDate: applicationDetails.applicationStatus?.collectionDate ? new Date(applicationDetails.applicationStatus.collectionDate) : undefined
//   //         },
//   //         embassyInfo: applicationDetails.embassyInfo || {},
//   //         visaIssuance: applicationDetails.visaIssuance || {}
//   //       },
//   //       internal: {
//   //         assignedTo: internal?.assignedTo ? {
//   //           agentId: internal.assignedTo.agentId ? new mongoose.Types.ObjectId(internal.assignedTo.agentId) : undefined,
//   //           agentName: internal.assignedTo.agentName,
//   //           agentEmail: internal.assignedTo.agentEmail,
//   //           department: internal.assignedTo.department,
//   //           assignedAt: internal.assignedTo.assignedAt ? new Date(internal.assignedTo.assignedAt) : new Date(),
//   //           lastContacted: internal.assignedTo.lastContacted ? new Date(internal.assignedTo.lastContacted) : undefined
//   //         } : undefined,
//   //         priority: internal?.priority || 'normal',
//   //         source: internal?.source || 'website',
//   //         notes: internal?.notes || []
//   //       }
//   //     };

//   //     // Create the application
//   //     const newApplication = new VisaService(applicationData);
//   //     await newApplication.save();

//   //     // Send confirmation email
//   //     try {
//   //       await sendEmail(
//   //         newApplication.customer.contactInfo.email,
//   //         'applicationSubmitted',
//   //         newApplication.toObject()
//   //       );
//   //     } catch (emailError) {
//   //       console.warn('Email sending failed, but application was created:', emailError.message);
//   //     }

//   //     res.status(201).json({
//   //       success: true,
//   //       message: 'Visa application created successfully',
//   //       data: {
//   //         trackingNumber: newApplication.trackingNumber,
//   //         serviceId: newApplication.serviceId,
//   //         serviceType: newApplication.serviceType,
//   //         serviceStage: newApplication.serviceStage,
//   //         applicationStatus: newApplication.applicationDetails.applicationStatus.current,
//   //         customer: {
//   //           fullName: newApplication.customer.personalInfo.fullName,
//   //           email: newApplication.customer.contactInfo.email
//   //         },
//   //         visaInfo: {
//   //           destinationCountry: newApplication.applicationDetails.visaInfo.destinationCountry,
//   //           visaType: newApplication.applicationDetails.visaInfo.visaType
//   //         }
//   //       }
//   //     });

//   //   } catch (error) {
//   //     console.error('Create application error:', error);
      
//   //     if (error.name === 'ValidationError') {
//   //       const errors = {};
//   //       Object.keys(error.errors).forEach(key => {
//   //         errors[key] = error.errors[key].message;
//   //       });
        
//   //       return res.status(400).json({
//   //         success: false,
//   //         message: 'Validation failed',
//   //         errors: errors
//   //       });
//   //     }
      
//   //     if (error.code === 11000) {
//   //       const field = Object.keys(error.keyPattern)[0];
//   //       return res.status(400).json({
//   //         success: false,
//   //         message: `Duplicate value for ${field}`,
//   //         field: field,
//   //         value: error.keyValue[field]
//   //       });
//   //     }
      
//   //     res.status(500).json({
//   //       success: false,
//   //       message: 'Failed to create application',
//   //       error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
//   //     });
//   //   }
//   // },


// createApplication: async (req, res) => {
//   try {
//     const { customer, applicationDetails, internal } = req.body;

//     // Validate required fields
//     const requiredFields = [
//       { field: customer?.personalInfo?.fullName, message: 'Customer full name is required' },
//       { field: customer?.personalInfo?.dateOfBirth, message: 'Customer date of birth is required' },
//       { field: customer?.personalInfo?.nationality, message: 'Customer nationality is required' },
//       { field: customer?.personalInfo?.countryOfResidence, message: 'Customer country of residence is required' },
//       { field: customer?.contactInfo?.email, message: 'Customer email is required' },
//       { field: customer?.contactInfo?.primaryPhone, message: 'Customer primary phone is required' },
//       { field: applicationDetails?.visaInfo?.destinationCountry, message: 'Destination country is required' },
//       { field: applicationDetails?.visaInfo?.visaType, message: 'Visa type is required' }
//     ];

//     for (const { field, message } of requiredFields) {
//       if (!field) return res.status(400).json({ success: false, message });
//     }

//     // Validate email format
//     const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
//     if (!emailRegex.test(customer.contactInfo.email)) {
//       return res.status(400).json({ success: false, message: 'Please provide a valid email address' });
//     }

//     // Prepare application data with auto-generated trackingNumber
//     const applicationData = {
//       serviceType: 'application',
//       serviceStage: 'application-initiated',
//       trackingNumber: `TRK-${Date.now()}-${Math.floor(Math.random() * 10000)}`, // auto-generate
//       serviceId: uuidv4(), // unique service ID
//       customer: {
//         personalInfo: {
//           fullName: customer.personalInfo.fullName.trim(),
//           dateOfBirth: new Date(customer.personalInfo.dateOfBirth),
//           gender: customer.personalInfo.gender || 'prefer-not-to-say',
//           nationality: customer.personalInfo.nationality,
//           countryOfResidence: customer.personalInfo.countryOfResidence,
//           maritalStatus: customer.personalInfo.maritalStatus || 'single',
//           occupation: customer.personalInfo.occupation,
//           employer: customer.personalInfo.employer
//         },
//         contactInfo: {
//           email: customer.contactInfo.email.toLowerCase().trim(),
//           primaryPhone: customer.contactInfo.primaryPhone,
//           secondaryPhone: customer.contactInfo.secondaryPhone,
//           whatsappNumber: customer.contactInfo.whatsappNumber,
//           address: customer.contactInfo.address || {},
//           emergencyContact: customer.contactInfo.emergencyContact || {}
//         },
//         passportInfo: {
//           passportNumber: customer.passportInfo?.passportNumber,
//           issuingCountry: customer.passportInfo?.issuingCountry,
//           issueDate: customer.passportInfo?.issueDate ? new Date(customer.passportInfo.issueDate) : undefined,
//           expiryDate: customer.passportInfo?.expiryDate ? new Date(customer.passportInfo.expiryDate) : undefined,
//           placeOfIssue: customer.passportInfo?.placeOfIssue,
//           hasPreviousVisas: customer.passportInfo?.hasPreviousVisas || false,
//           previousVisaDetails: customer.passportInfo?.previousVisaDetails || []
//         }
//       },
//       applicationDetails: {
//         visaInfo: {
//           destinationCountry: applicationDetails.visaInfo.destinationCountry,
//           appliedCountries: applicationDetails.visaInfo.appliedCountries || [],
//           visaType: applicationDetails.visaInfo.visaType,
//           category: applicationDetails.visaInfo.category || 'short-term',
//           purposeOfTravel: applicationDetails.visaInfo.purposeOfTravel || '',
//           travelDates: applicationDetails.visaInfo.travelDates || {},
//           entriesRequested: applicationDetails.visaInfo.entriesRequested || 'Single',
//           travelCompanions: applicationDetails.visaInfo.travelCompanions || []
//         },
//         servicePackage: {
//           name: applicationDetails.servicePackage?.name || 'standard',
//           description: applicationDetails.servicePackage?.description || '',
//           processingTime: applicationDetails.servicePackage?.processingTime || '15-20 business days',
//           inclusions: applicationDetails.servicePackage?.inclusions || [],
//           exclusions: applicationDetails.servicePackage?.exclusions || []
//         }
//       },
//       internal: {
//         assignedTo: internal?.assignedTo ? {
//           agentId: internal.assignedTo.agentId ? new mongoose.Types.ObjectId(internal.assignedTo.agentId) : undefined,
//           agentName: internal.assignedTo.agentName,
//           agentEmail: internal.assignedTo.agentEmail,
//           department: internal.assignedTo.department,
//           assignedAt: internal.assignedTo.assignedAt ? new Date(internal.assignedTo.assignedAt) : new Date(),
//           lastContacted: internal.assignedTo.lastContacted ? new Date(internal.assignedTo.lastContacted) : undefined
//         } : undefined,
//         priority: internal?.priority || 'normal',
//         source: internal?.source || 'website',
//         notes: internal?.notes || []
//       }
//     };

//     // Save application
//     const newApplication = new VisaService(applicationData);
//     await newApplication.save();

//     // Send confirmation email (optional)
//     try {
//       await sendEmail(
//         newApplication.customer.contactInfo.email,
//         'applicationSubmitted',
//         newApplication.toObject()
//       );
//     } catch (emailError) {
//       console.warn('Email sending failed:', emailError.message);
//     }

//     // Respond with created application info
//     res.status(201).json({
//       success: true,
//       message: 'Visa application created successfully',
//       data: {
//         trackingNumber: newApplication.trackingNumber,
//         serviceId: newApplication.serviceId,
//         serviceType: newApplication.serviceType,
//         serviceStage: newApplication.serviceStage,
//         applicationStatus: newApplication.applicationDetails.applicationStatus?.current || 'draft',
//         customer: {
//           fullName: newApplication.customer.personalInfo.fullName,
//           email: newApplication.customer.contactInfo.email
//         },
//         visaInfo: {
//           destinationCountry: newApplication.applicationDetails.visaInfo.destinationCountry,
//           visaType: newApplication.applicationDetails.visaInfo.visaType
//         }
//       }
//     });

//   } catch (error) {
//     console.error('Create application error:', error);

//     // Mongoose validation errors
//     if (error.name === 'ValidationError') {
//       const errors = {};
//       Object.keys(error.errors).forEach(key => errors[key] = error.errors[key].message);
//       return res.status(400).json({ success: false, message: 'Validation failed', errors });
//     }

//     // Generic server error
//     res.status(500).json({
//       success: false,
//       message: 'Failed to create application',
//       error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
//     });
//   }
// },

//   // Get application by tracking number
//   getApplicationByTrackingNumber: async (req, res) => {
//     try {
//       const { trackingNumber } = req.params;

//       const application = await VisaService.findOne({ 
//         trackingNumber,
//         serviceType: { $in: ['application', 'combined'] }
//       });

//       if (!application) {
//         return res.status(404).json({
//           success: false,
//           message: 'Application not found'
//         });
//       }

//       // Add virtuals to response
//       const applicationData = application.toObject();
//       applicationData.totalDocuments = application.totalDocuments;
//       applicationData.balanceDue = application.balanceDue;
//       applicationData.verifiedDocuments = calculateVerifiedDocuments(application.documents);

//       res.json({
//         success: true,
//         data: applicationData
//       });
//     } catch (error) {
//       console.error('Get application error:', error);
//       res.status(500).json({
//         success: false,
//         message: 'Failed to get application',
//         error: error.message
//       });
//     }
//   },

//   // Update application
//   updateApplication: async (req, res) => {
//     try {
//       const { trackingNumber } = req.params;
//       const updateData = req.body;

//       const application = await VisaService.findOne({ 
//         trackingNumber,
//         serviceType: { $in: ['application', 'combined'] }
//       });

//       if (!application) {
//         return res.status(404).json({
//           success: false,
//           message: 'Application not found'
//         });
//       }

//       // Prevent updating trackingNumber and serviceId
//       delete updateData.trackingNumber;
//       delete updateData.serviceId;

//       // Update fields
//       Object.keys(updateData).forEach(key => {
//         if (key === 'customer' || key === 'applicationDetails' || key === 'internal') {
//           // Deep merge for nested objects
//           application[key] = { ...application[key], ...updateData[key] };
//         } else if (key === 'serviceStage') {
//           application[key] = updateData[key];
//         }
//       });

//       await application.save();

//       res.json({
//         success: true,
//         message: 'Application updated successfully',
//         data: application
//       });
//     } catch (error) {
//       console.error('Update application error:', error);
//       res.status(500).json({
//         success: false,
//         message: 'Failed to update application',
//         error: error.message
//       });
//     }
//   },

//   // Update application status
//   updateApplicationStatus: async (req, res) => {
//     try {
//       const { trackingNumber } = req.params;
//       const { 
//         status, 
//         remarks, 
//         changedBy,
//         submittedAt,
//         processingStartedAt,
//         expectedCompletionDate,
//         actualCompletionDate,
//         embassySubmissionDate,
//         decisionDate,
//         collectionDate
//       } = req.body;

//       const application = await VisaService.findOne({ 
//         trackingNumber,
//         serviceType: { $in: ['application', 'combined'] }
//       });

//       if (!application) {
//         return res.status(404).json({
//           success: false,
//           message: 'Application not found'
//         });
//       }

//       // Update status
//       const oldStatus = application.applicationDetails.applicationStatus.current;
//       application.applicationDetails.applicationStatus.current = status;
      
//       // Update dates if provided
//       if (submittedAt) application.applicationDetails.applicationStatus.submittedAt = new Date(submittedAt);
//       if (processingStartedAt) application.applicationDetails.applicationStatus.processingStartedAt = new Date(processingStartedAt);
//       if (expectedCompletionDate) application.applicationDetails.applicationStatus.expectedCompletionDate = new Date(expectedCompletionDate);
//       if (actualCompletionDate) application.applicationDetails.applicationStatus.actualCompletionDate = new Date(actualCompletionDate);
//       if (embassySubmissionDate) application.applicationDetails.applicationStatus.embassySubmissionDate = new Date(embassySubmissionDate);
//       if (decisionDate) application.applicationDetails.applicationStatus.decisionDate = new Date(decisionDate);
//       if (collectionDate) application.applicationDetails.applicationStatus.collectionDate = new Date(collectionDate);

//       // Update service stage based on status
//       const statusToStageMap = {
//         'submitted-to-embassy': 'application-submitted',
//         'embassy-processing': 'embassy-processing',
//         'approved': 'visa-approved',
//         'visa-printed': 'visa-issued',
//         'collected': 'completed',
//         'cancelled': 'cancelled'
//       };

//       if (statusToStageMap[status]) {
//         application.serviceStage = statusToStageMap[status];
//       }

//       // Add to status history
//       if (!application.statusHistory) {
//         application.statusHistory = [];
//       }
      
//       application.statusHistory.push({
//         stage: application.serviceStage,
//         status: status,
//         changedAt: new Date(),
//         changedBy: changedBy || 'system',
//         remarks: remarks,
//         oldStatus: oldStatus
//       });

//       // Add note
//       application.internal.notes.push({
//         note: `Status changed from ${oldStatus} to ${status}. ${remarks || ''}`,
//         addedBy: changedBy || 'system',
//         addedAt: new Date(),
//         category: 'status',
//         priority: 'normal'
//       });

//       await application.save();

//       // Send status update email
//       await sendEmail(
//         application.customer.contactInfo.email,
//         'statusUpdate',
//         { 
//           ...application.toObject(), 
//           newStatus: status 
//         }
//       );

//       res.json({
//         success: true,
//         message: 'Application status updated successfully',
//         data: {
//           trackingNumber: application.trackingNumber,
//           oldStatus: oldStatus,
//           newStatus: status,
//           serviceStage: application.serviceStage,
//           updatedAt: application.updatedAt
//         }
//       });
//     } catch (error) {
//       console.error('Update application status error:', error);
//       res.status(500).json({
//         success: false,
//         message: 'Failed to update application status',
//         error: error.message
//       });
//     }
//   },

//   // Upload document using model's addDocument method
//   uploadDocument: async (req, res) => {
//     try {
//       const { trackingNumber } = req.params;
//       const { category, documentType } = req.body;
//       const file = req.file;

//       if (!file) {
//         return res.status(400).json({
//           success: false,
//           message: 'No file uploaded'
//         });
//       }

//       const application = await VisaService.findOne({ 
//         trackingNumber,
//         serviceType: { $in: ['application', 'combined'] }
//       });

//       if (!application) {
//         return res.status(404).json({
//           success: false,
//           message: 'Application not found'
//         });
//       }

//       // Upload to Cloudinary
//       const uploadResult = await uploadToCloudinary(file, `visa_applications/${trackingNumber}/${category}`);

//       if (!uploadResult.success) {
//         return res.status(500).json(uploadResult);
//       }

//       // Prepare document data
//       const documentData = {
//         documentType: documentType || category,
//         cloudinaryUrl: uploadResult.cloudinaryUrl,
//         publicId: uploadResult.publicId,
//         originalName: uploadResult.originalName,
//         uploadedAt: new Date(),
//         verified: false
//       };

//       // Use model's addDocument method
//       application.addDocument(category, documentData);

//       // Update status if needed
//       if (application.applicationDetails.applicationStatus.current === 'draft') {
//         application.applicationDetails.applicationStatus.current = 'document-collection';
//       }

//       await application.save();

//       // Send document upload confirmation email
//       await sendEmail(
//         application.customer.contactInfo.email,
//         'documentUploadConfirmation',
//         { 
//           ...application.toObject(), 
//           documentType: documentType || category 
//         }
//       );

//       res.json({
//         success: true,
//         message: 'Document uploaded successfully',
//         data: {
//           documentUrl: uploadResult.cloudinaryUrl,
//           category: category,
//           documentType: documentType || category,
//           totalDocuments: application.totalDocuments,
//           verifiedDocuments: calculateVerifiedDocuments(application.documents)
//         }
//       });
//     } catch (error) {
//       console.error('Upload document error:', error);
//       res.status(500).json({
//         success: false,
//         message: 'Failed to upload document',
//         error: error.message
//       });
//     }
//   },

//   // Verify document
//   verifyDocument: async (req, res) => {
//     try {
//       const { trackingNumber } = req.params;
//       const { category, index, verifiedBy } = req.body;

//       const application = await VisaService.findOne({ 
//         trackingNumber,
//         serviceType: { $in: ['application', 'combined'] }
//       });

//       if (!application) {
//         return res.status(404).json({
//           success: false,
//           message: 'Application not found'
//         });
//       }

//       // Verify document based on category
//       let verified = false;
//       let documentInfo = {};

//       switch(category.toLowerCase()) {
//         case 'photograph':
//           if (application.documents.photograph) {
//             application.documents.photograph.verified = true;
//             verified = true;
//             documentInfo = { type: 'photograph' };
//           }
//           break;
//         case 'passportcopy':
//           if (application.documents.passportCopy) {
//             application.documents.passportCopy.verified = true;
//             verified = true;
//             documentInfo = { type: 'passport copy' };
//           }
//           break;
//         case 'financial':
//           if (application.documents.financialDocuments && application.documents.financialDocuments[index]) {
//             application.documents.financialDocuments[index].verified = true;
//             verified = true;
//             documentInfo = {
//               type: 'financial document',
//               index: index,
//               documentType: application.documents.financialDocuments[index].documentType
//             };
//           }
//           break;
//         case 'travel':
//           if (application.documents.travelDocuments && application.documents.travelDocuments[index]) {
//             application.documents.travelDocuments[index].verified = true;
//             verified = true;
//             documentInfo = {
//               type: 'travel document',
//               index: index,
//               documentType: application.documents.travelDocuments[index].documentType
//             };
//           }
//           break;
//         case 'supporting':
//           if (application.documents.supportingDocuments && application.documents.supportingDocuments[index]) {
//             application.documents.supportingDocuments[index].verified = true;
//             verified = true;
//             documentInfo = {
//               type: 'supporting document',
//               index: index,
//               documentType: application.documents.supportingDocuments[index].documentType
//             };
//           }
//           break;
//         default:
//           if (application.documents.otherDocuments && application.documents.otherDocuments[index]) {
//             application.documents.otherDocuments[index].verified = true;
//             verified = true;
//             documentInfo = {
//               type: 'other document',
//               index: index,
//               description: application.documents.otherDocuments[index].description
//             };
//           }
//       }

//       if (!verified) {
//         return res.status(400).json({
//           success: false,
//           message: 'Document not found for verification'
//         });
//       }

//       // Add note
//       application.internal.notes.push({
//         note: `Document verified: ${documentInfo.type || category} (${documentInfo.documentType || ''}) by ${verifiedBy || 'system'}`,
//         addedBy: verifiedBy || 'system',
//         addedAt: new Date(),
//         category: 'verification',
//         priority: 'normal'
//       });

//       await application.save();

//       res.json({
//         success: true,
//         message: 'Document verified successfully',
//         data: {
//           verifiedDocuments: calculateVerifiedDocuments(application.documents),
//           totalDocuments: application.totalDocuments,
//           document: documentInfo
//         }
//       });
//     } catch (error) {
//       console.error('Verify document error:', error);
//       res.status(500).json({
//         success: false,
//         message: 'Failed to verify document',
//         error: error.message
//       });
//     }
//   },

//   // Update payment
//   updatePayment: async (req, res) => {
//     try {
//       const { trackingNumber } = req.params;
//       const { amount, method, transactionId, reference, notes } = req.body;

//       const application = await VisaService.findOne({ 
//         trackingNumber,
//         serviceType: { $in: ['application', 'combined'] }
//       });

//       if (!application) {
//         return res.status(404).json({
//           success: false,
//           message: 'Application not found'
//         });
//       }

//       // Update payment details
//       const paymentAmount = parseFloat(amount) || 0;
//       application.applicationDetails.payment.amountPaid += paymentAmount;
      
//       // Update payment status
//       const totalAmount = application.applicationDetails.fees.totalAmount || 0;
//       const amountPaid = application.applicationDetails.payment.amountPaid;
      
//       if (amountPaid >= totalAmount) {
//         application.applicationDetails.payment.status = 'paid';
//       } else if (amountPaid > 0) {
//         application.applicationDetails.payment.status = 'partial';
//       } else {
//         application.applicationDetails.payment.status = 'pending';
//       }

//       // Add to payment history
//       if (!application.applicationDetails.payment.paymentHistory) {
//         application.applicationDetails.payment.paymentHistory = [];
//       }

//       application.applicationDetails.payment.paymentHistory.push({
//         amount: paymentAmount,
//         date: new Date(),
//         method: method,
//         transactionId: transactionId,
//         reference: reference,
//         notes: notes
//       });

//       // Update payment method if not set
//       if (!application.applicationDetails.payment.paymentMethod && method) {
//         application.applicationDetails.payment.paymentMethod = method;
//       }

//       // Update status if needed
//       if (application.applicationDetails.applicationStatus.current === 'payment-pending' && 
//           application.applicationDetails.payment.status === 'paid') {
//         application.applicationDetails.applicationStatus.current = 'submitted-to-embassy';
//       }

//       await application.save();

//       // Send payment confirmation email
//       const paymentDetails = {
//         amount: paymentAmount,
//         method: method,
//         transactionId: transactionId,
//         date: new Date()
//       };
      
//       await sendEmail(
//         application.customer.contactInfo.email,
//         'paymentConfirmation',
//         { 
//           ...application.toObject(), 
//           paymentDetails 
//         }
//       );

//       res.json({
//         success: true,
//         message: 'Payment updated successfully',
//         data: {
//           amountPaid: application.applicationDetails.payment.amountPaid,
//           balanceDue: application.balanceDue,
//           paymentStatus: application.applicationDetails.payment.status,
//           totalAmount: application.applicationDetails.fees.totalAmount
//         }
//       });
//     } catch (error) {
//       console.error('Update payment error:', error);
//       res.status(500).json({
//         success: false,
//         message: 'Failed to update payment',
//         error: error.message
//       });
//     }
//   },

//   // Add applied country using model's addAppliedCountry method
//   addAppliedCountry: async (req, res) => {
//     try {
//       const { trackingNumber } = req.params;
//       const { country } = req.body;

//       const application = await VisaService.findOne({ 
//         trackingNumber,
//         serviceType: { $in: ['application', 'combined'] }
//       });

//       if (!application) {
//         return res.status(404).json({
//           success: false,
//           message: 'Application not found'
//         });
//       }

//       // Use model's addAppliedCountry method
//       application.addAppliedCountry(country);
//       await application.save();

//       res.json({
//         success: true,
//         message: 'Applied country added successfully',
//         data: {
//           appliedCountries: application.applicationDetails.visaInfo.appliedCountries
//         }
//       });
//     } catch (error) {
//       console.error('Add applied country error:', error);
//       res.status(500).json({
//         success: false,
//         message: 'Failed to add applied country',
//         error: error.message
//       });
//     }
//   },

//   // Get all applications
//   getAllApplications: async (req, res) => {
//     try {
//       const {
//         page = 1,
//         limit = 20,
//         sortBy = 'createdAt',
//         sortOrder = 'desc',
//         status,
//         destinationCountry,
//         visaType,
//         dateFrom,
//         dateTo,
//         customerName,
//         email,
//         agentId
//       } = req.query;

//       const skip = (parseInt(page) - 1) * parseInt(limit);
      
//       // Build query for applications
//       const query = { serviceType: { $in: ['application', 'combined'] } };
      
//       // Apply filters
//       if (status) {
//         query['applicationDetails.applicationStatus.current'] = status;
//       }
      
//       if (destinationCountry) {
//         query['applicationDetails.visaInfo.destinationCountry'] = destinationCountry;
//       }
      
//       if (visaType) {
//         query['applicationDetails.visaInfo.visaType'] = visaType;
//       }
      
//       if (dateFrom || dateTo) {
//         query.createdAt = {};
//         if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
//         if (dateTo) query.createdAt.$lte = new Date(dateTo);
//       }
      
//       if (customerName) {
//         query['customer.personalInfo.fullName'] = { 
//           $regex: customerName, 
//           $options: 'i' 
//         };
//       }
      
//       if (email) {
//         query['customer.contactInfo.email'] = { 
//           $regex: email, 
//           $options: 'i' 
//         };
//       }
      
//       if (agentId && mongoose.Types.ObjectId.isValid(agentId)) {
//         query['internal.assignedTo.agentId'] = new mongoose.Types.ObjectId(agentId);
//       }

//       // Determine sort order
//       const sort = {};
//       sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

//       // Get applications with pagination
//       const [applications, total] = await Promise.all([
//         VisaService.find(query)
//           .sort(sort)
//           .skip(skip)
//           .limit(parseInt(limit))
//           .select('-documents -communications -statusHistory -auditLog -__v')
//           .lean(),
//         VisaService.countDocuments(query)
//       ]);

//       // Calculate statistics
//       const stats = {
//         totalApplications: total,
//         byStatus: applications.reduce((acc, app) => {
//           const status = app.applicationDetails?.applicationStatus?.current || 'unknown';
//           acc[status] = (acc[status] || 0) + 1;
//           return acc;
//         }, {}),
//         byDestination: applications.reduce((acc, app) => {
//           const country = app.applicationDetails?.visaInfo?.destinationCountry || 'unknown';
//           acc[country] = (acc[country] || 0) + 1;
//           return acc;
//         }, {}),
//         byVisaType: applications.reduce((acc, app) => {
//           const type = app.applicationDetails?.visaInfo?.visaType || 'unknown';
//           acc[type] = (acc[type] || 0) + 1;
//           return acc;
//         }, {}),
//         totalRevenue: applications.reduce((sum, app) => 
//           sum + (app.applicationDetails?.fees?.totalAmount || 0), 0
//         ),
//         totalPaid: applications.reduce((sum, app) => 
//           sum + (app.applicationDetails?.payment?.amountPaid || 0), 0
//         ),
//         pendingPayments: applications.filter(app => 
//           ['pending', 'partial'].includes(app.applicationDetails?.payment?.status)
//         ).length,
//         overduePayments: applications.filter(app => 
//           app.applicationDetails?.payment?.dueDate && 
//           new Date(app.applicationDetails.payment.dueDate) < new Date() &&
//           ['pending', 'partial'].includes(app.applicationDetails?.payment?.status)
//         ).length
//       };

//       res.json({
//         success: true,
//         data: {
//           applications,
//           pagination: {
//             page: parseInt(page),
//             limit: parseInt(limit),
//             total,
//             totalPages: Math.ceil(total / parseInt(limit)),
//             hasNextPage: (parseInt(page) * parseInt(limit)) < total,
//             hasPrevPage: parseInt(page) > 1
//           },
//           statistics: stats
//         }
//       });
//     } catch (error) {
//       console.error('Get all applications error:', error);
//       res.status(500).json({
//         success: false,
//         message: 'Failed to retrieve applications',
//         error: error.message
//       });
//     }
//   },

//   // Search applications
//   searchApplications: async (req, res) => {
//     try {
//       const {
//         trackingNumber,
//         serviceId,
//         email,
//         fullName,
//         passportNumber,
//         destinationCountry,
//         visaType,
//         limit = 50
//       } = req.query;

//       const query = { serviceType: { $in: ['application', 'combined'] } };

//       if (trackingNumber) query.trackingNumber = trackingNumber;
//       if (serviceId) query.serviceId = serviceId;
//       if (email) query['customer.contactInfo.email'] = { $regex: email, $options: 'i' };
//       if (fullName) query['customer.personalInfo.fullName'] = { $regex: fullName, $options: 'i' };
//       if (passportNumber) query['customer.passportInfo.passportNumber'] = passportNumber;
//       if (destinationCountry) query['applicationDetails.visaInfo.destinationCountry'] = destinationCountry;
//       if (visaType) query['applicationDetails.visaInfo.visaType'] = visaType;

//       const applications = await VisaService.find(query)
//         .sort({ createdAt: -1 })
//         .limit(parseInt(limit))
//         .select('trackingNumber serviceId customer.personalInfo.fullName customer.contactInfo.email applicationDetails.visaInfo.destinationCountry applicationDetails.visaInfo.visaType applicationDetails.applicationStatus.current applicationDetails.fees.totalAmount applicationDetails.payment.status createdAt')
//         .lean();

//       res.json({
//         success: true,
//         data: applications,
//         count: applications.length
//       });
//     } catch (error) {
//       console.error('Search applications error:', error);
//       res.status(500).json({
//         success: false,
//         message: 'Failed to search applications',
//         error: error.message
//       });
//     }
//   },

//   // Get applications by customer email
//   getApplicationsByCustomerEmail: async (req, res) => {
//     try {
//       const { email } = req.params;

//       const applications = await VisaService.find({ 
//         'customer.contactInfo.email': email.toLowerCase(),
//         serviceType: { $in: ['application', 'combined'] }
//       })
//         .sort({ createdAt: -1 })
//         .select('trackingNumber serviceId serviceType serviceStage applicationDetails.visaInfo.destinationCountry applicationDetails.visaInfo.visaType applicationDetails.applicationStatus.current applicationDetails.fees.totalAmount applicationDetails.payment.status createdAt')
//         .lean();

//       // Calculate customer statistics
//       const stats = {
//         totalApplications: applications.length,
//         byStatus: applications.reduce((acc, app) => {
//           const status = app.applicationDetails?.applicationStatus?.current || 'unknown';
//           acc[status] = (acc[status] || 0) + 1;
//           return acc;
//         }, {}),
//         byDestination: applications.reduce((acc, app) => {
//           const country = app.applicationDetails?.visaInfo?.destinationCountry || 'unknown';
//           acc[country] = (acc[country] || 0) + 1;
//           return acc;
//         }, {}),
//         totalSpent: applications.reduce((sum, app) => 
//           sum + (app.applicationDetails?.fees?.totalAmount || 0), 0
//         ),
//         successRate: applications.length > 0 ? 
//           (applications.filter(app => app.applicationDetails?.applicationStatus?.current === 'approved').length / applications.length * 100).toFixed(2) + '%' : '0%'
//       };

//       res.json({
//         success: true,
//         data: {
//           applications,
//           customerEmail: email,
//           statistics: stats
//         }
//       });
//     } catch (error) {
//       console.error('Get applications by email error:', error);
//       res.status(500).json({
//         success: false,
//         message: 'Failed to get applications by email',
//         error: error.message
//       });
//     }
//   }
// };

// // ========== DOCUMENT CONTROLLERS ==========

// const DocumentController = {
//   // Get all documents for an application
//   getApplicationDocuments: async (req, res) => {
//     try {
//       const { trackingNumber } = req.params;

//       const application = await VisaService.findOne({ 
//         trackingNumber,
//         serviceType: { $in: ['application', 'combined'] }
//       }).select('documents');

//       if (!application) {
//         return res.status(404).json({
//           success: false,
//           message: 'Application not found'
//         });
//       }

//       // Format documents response
//       const documents = {
//         photograph: application.documents.photograph || {},
//         passportCopy: application.documents.passportCopy || {},
//         financialDocuments: application.documents.financialDocuments || [],
//         travelDocuments: application.documents.travelDocuments || [],
//         supportingDocuments: application.documents.supportingDocuments || [],
//         otherDocuments: application.documents.otherDocuments || [],
//         statistics: {
//           totalDocuments: application.totalDocuments,
//           verifiedDocuments: calculateVerifiedDocuments(application.documents),
//           verificationRate: application.totalDocuments > 0 ? 
//             (calculateVerifiedDocuments(application.documents) / application.totalDocuments * 100).toFixed(2) + '%' : '0%'
//         }
//       };

//       res.json({
//         success: true,
//         data: documents
//       });
//     } catch (error) {
//       console.error('Get application documents error:', error);
//       res.status(500).json({
//         success: false,
//         message: 'Failed to get application documents',
//         error: error.message
//       });
//     }
//   },

//   // Delete document
//   deleteDocument: async (req, res) => {
//     try {
//       const { trackingNumber } = req.params;
//       const { category, index, publicId } = req.body;

//       const application = await VisaService.findOne({ 
//         trackingNumber,
//         serviceType: { $in: ['application', 'combined'] }
//       });

//       if (!application) {
//         return res.status(404).json({
//           success: false,
//           message: 'Application not found'
//         });
//       }

//       // Delete from Cloudinary if publicId provided
//       if (publicId) {
//         await deleteFromCloudinary(publicId);
//       }

//       // Delete from application based on category
//       let deleted = false;
//       let documentInfo = {};

//       switch(category.toLowerCase()) {
//         case 'photograph':
//           if (application.documents.photograph) {
//             documentInfo = { ...application.documents.photograph };
//             application.documents.photograph = {};
//             deleted = true;
//           }
//           break;
//         case 'passportcopy':
//           if (application.documents.passportCopy) {
//             documentInfo = { ...application.documents.passportCopy };
//             application.documents.passportCopy = {};
//             deleted = true;
//           }
//           break;
//         case 'financial':
//           if (application.documents.financialDocuments && application.documents.financialDocuments[index]) {
//             documentInfo = { ...application.documents.financialDocuments[index] };
//             application.documents.financialDocuments.splice(index, 1);
//             deleted = true;
//           }
//           break;
//         case 'travel':
//           if (application.documents.travelDocuments && application.documents.travelDocuments[index]) {
//             documentInfo = { ...application.documents.travelDocuments[index] };
//             application.documents.travelDocuments.splice(index, 1);
//             deleted = true;
//           }
//           break;
//         case 'supporting':
//           if (application.documents.supportingDocuments && application.documents.supportingDocuments[index]) {
//             documentInfo = { ...application.documents.supportingDocuments[index] };
//             application.documents.supportingDocuments.splice(index, 1);
//             deleted = true;
//           }
//           break;
//         default:
//           if (application.documents.otherDocuments && application.documents.otherDocuments[index]) {
//             documentInfo = { ...application.documents.otherDocuments[index] };
//             application.documents.otherDocuments.splice(index, 1);
//             deleted = true;
//           }
//       }

//       if (!deleted) {
//         return res.status(400).json({
//           success: false,
//           message: 'Document not found for deletion'
//         });
//       }

//       await application.save();

//       res.json({
//         success: true,
//         message: 'Document deleted successfully',
//         data: {
//           deletedDocument: documentInfo,
//           totalDocuments: application.totalDocuments,
//           verifiedDocuments: calculateVerifiedDocuments(application.documents)
//         }
//       });
//     } catch (error) {
//       console.error('Delete document error:', error);
//       res.status(500).json({
//         success: false,
//         message: 'Failed to delete document',
//         error: error.message
//       });
//     }
//   }
// };

// // ========== STATISTICS CONTROLLERS ==========

// const StatisticsController = {
//   // Get dashboard statistics
//   getDashboardStats: async (req, res) => {
//     try {
//       const thirtyDaysAgo = new Date();
//       thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

//       const [
//         totalBookings,
//         totalApplications,
//         pendingPayments,
//         upcomingAppointments,
//         recentActivities,
//         statusDistribution,
//         revenueStats
//       ] = await Promise.all([
//         // Total bookings (last 30 days)
//         VisaService.countDocuments({
//           serviceType: { $in: ['booking', 'combined'] },
//           createdAt: { $gte: thirtyDaysAgo }
//         }),

//         // Total applications (last 30 days)
//         VisaService.countDocuments({
//           serviceType: { $in: ['application', 'combined'] },
//           createdAt: { $gte: thirtyDaysAgo }
//         }),

//         // Pending payments
//         VisaService.aggregate([
//           {
//             $match: {
//               serviceType: { $in: ['application', 'combined'] },
//               'applicationDetails.payment.status': { $in: ['pending', 'partial'] }
//             }
//           },
//           {
//             $group: {
//               _id: null,
//               totalAmount: { $sum: '$applicationDetails.fees.totalAmount' },
//               totalPaid: { $sum: '$applicationDetails.payment.amountPaid' },
//               count: { $sum: 1 }
//             }
//           }
//         ]),

//         // Upcoming appointments
//         VisaService.find({
//           'bookingDetails.appointment.date': { $gte: new Date() },
//           'bookingDetails.bookingStatus': { $in: ['pending', 'confirmed'] },
//           serviceType: { $in: ['booking', 'combined'] }
//         })
//           .sort({ 'bookingDetails.appointment.date': 1 })
//           .limit(10)
//           .select('serviceId customer.personalInfo.fullName bookingDetails.appointment.date bookingDetails.appointment.timeSlot bookingDetails.bookingStatus'),

//         // Recent activities
//         VisaService.find()
//           .sort({ updatedAt: -1 })
//           .limit(10)
//           .select('serviceId trackingNumber serviceType serviceStage applicationDetails.applicationStatus.current bookingDetails.bookingStatus updatedAt'),

//         // Status distribution
//         VisaService.aggregate([
//           {
//             $match: {
//               serviceType: { $in: ['application', 'combined'] }
//             }
//           },
//           {
//             $group: {
//               _id: '$applicationDetails.applicationStatus.current',
//               count: { $sum: 1 }
//             }
//           },
//           { $sort: { count: -1 } }
//         ]),

//         // Revenue statistics
//         VisaService.aggregate([
//           {
//             $match: {
//               createdAt: { $gte: thirtyDaysAgo }
//             }
//           },
//           {
//             $group: {
//               _id: {
//                 year: { $year: '$createdAt' },
//                 month: { $month: '$createdAt' },
//                 day: { $dayOfMonth: '$createdAt' }
//               },
//               revenue: {
//                 $sum: {
//                   $add: [
//                     '$bookingDetails.bookingAmount',
//                     '$applicationDetails.fees.totalAmount'
//                   ]
//                 }
//               },
//               bookings: {
//                 $sum: { $cond: [{ $in: ['$serviceType', ['booking', 'combined']] }, 1, 0] }
//               },
//               applications: {
//                 $sum: { $cond: [{ $in: ['$serviceType', ['application', 'combined']] }, 1, 0] }
//               }
//             }
//           },
//           { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
//         ])
//       ]);

//       res.json({
//         success: true,
//         data: {
//           totalBookings,
//           totalApplications,
//           pendingPayments: pendingPayments[0] || { totalAmount: 0, totalPaid: 0, count: 0 },
//           upcomingAppointments,
//           recentActivities,
//           statusDistribution,
//           revenueStats,
//           summary: {
//             totalServices: totalBookings + totalApplications,
//             pendingDocuments: statusDistribution.find(s => s._id === 'document-collection')?.count || 0,
//             pendingVerification: statusDistribution.find(s => s._id === 'document-review')?.count || 0,
//             inProcessing: statusDistribution.find(s => s._id === 'embassy-processing')?.count || 0
//           }
//         }
//       });
//     } catch (error) {
//       console.error('Get dashboard stats error:', error);
//       res.status(500).json({
//         success: false,
//         message: 'Failed to get dashboard statistics',
//         error: error.message
//       });
//     }
//   }
// };

// // ========== EXPORT ALL CONTROLLERS ==========

// module.exports = {
//   BookingController,
//   ApplicationController,
//   DocumentController,
//   StatisticsController,
  
//   // Utility functions
//   sendEmail,
//   uploadToCloudinary,
//   deleteFromCloudinary,
//   calculateVerifiedDocuments
// };


















// const VisaService = require('../models/Visa');
// const cloudinary = require('cloudinary').v2;
// const fs = require('fs');

// /* =====================================================
//    HELPERS
// ===================================================== */
// const uploadToCloudinary = async (file, folder) => {
//   if (!file) return null;

//   if (file.size > 5 * 1024 * 1024) {
//     throw new Error('File exceeds 5MB limit');
//   }

//   const result = await cloudinary.uploader.upload(file.path, {
//     folder,
//     resource_type: 'auto'
//   });

//   fs.unlinkSync(file.path);

//   return {
//     cloudinaryUrl: result.secure_url,
//     publicId: result.public_id,
//     size: file.size
//   };
// };

// /* =====================================================
//    VISA CATALOG CRUD
// ===================================================== */

// // CREATE
// exports.createVisaCatalog = async (req, res) => {
//   try {
//     const coverImage = await uploadToCloudinary(req.file, 'visa_catalog');

//     const visa = await VisaService.create({
//       recordType: 'visa-catalog',
//       visaCatalog: {
//         ...req.body,
//         coverImage
//       }
//     });

//     res.status(201).json({ success: true, data: visa });
//   } catch (e) {
//     res.status(400).json({ success: false, message: e.message });
//   }
// };

// // READ ALL
// exports.getVisaCatalogs = async (req, res) => {
//   const visas = await VisaService.find({
//     recordType: 'visa-catalog',
//     'visaCatalog.isActive': true
//   });
//   res.json({ success: true, count: visas.length, data: visas });
// };

// // READ ONE
// exports.getVisaCatalogById = async (req, res) => {
//   const visa = await VisaService.findById(req.params.id);
//   if (!visa) return res.status(404).json({ success: false });
//   res.json({ success: true, data: visa });
// };

// // UPDATE
// exports.updateVisaCatalog = async (req, res) => {
//   const visa = await VisaService.findById(req.params.id);
//   if (!visa) return res.status(404).json({ success: false });

//   if (req.file) {
//     if (visa.visaCatalog.coverImage?.publicId) {
//       await cloudinary.uploader.destroy(visa.visaCatalog.coverImage.publicId);
//     }
//     visa.visaCatalog.coverImage = await uploadToCloudinary(req.file, 'visa_catalog');
//   }

//   Object.assign(visa.visaCatalog, req.body);
//   await visa.save();

//   res.json({ success: true, data: visa });
// };

// // DELETE (SOFT)
// exports.deleteVisaCatalog = async (req, res) => {
//   const visa = await VisaService.findById(req.params.id);
//   if (!visa) return res.status(404).json({ success: false });

//   visa.visaCatalog.isActive = false;
//   await visa.save();

//   res.json({ success: true, message: 'Visa catalog deactivated' });
// };

// /* =====================================================
//    BOOKING CRUD
// ===================================================== */

// // CREATE
// exports.createBooking = async (req, res) => {
//   const booking = await VisaService.create({
//     recordType: 'visa-booking',
//     booking: req.body.booking,
//     customer: req.body.customer
//   });

//   res.status(201).json({ success: true, data: booking });
// };

// // READ ALL
// exports.getAllBookings = async (req, res) => {
//   const bookings = await VisaService.find({ recordType: 'visa-booking' });
//   res.json({ success: true, count: bookings.length, data: bookings });
// };

// // READ ONE
// exports.getBookingById = async (req, res) => {
//   const booking = await VisaService.findById(req.params.id);
//   if (!booking) return res.status(404).json({ success: false });
//   res.json({ success: true, data: booking });
// };

// // UPDATE
// exports.updateBooking = async (req, res) => {
//   const booking = await VisaService.findById(req.params.id);
//   if (!booking) return res.status(404).json({ success: false });

//   Object.assign(booking.booking, req.body.booking);
//   Object.assign(booking.customer, req.body.customer);

//   await booking.save();
//   res.json({ success: true, data: booking });
// };

// // DELETE
// exports.deleteBooking = async (req, res) => {
//   await VisaService.findByIdAndDelete(req.params.id);
//   res.json({ success: true, message: 'Booking deleted' });
// };

// /* =====================================================
//    DOCUMENT CRUD
// ===================================================== */
// exports.uploadDocument = async (req, res) => {
//   const { id, category } = req.params;

//   const booking = await VisaService.findById(id);
//   if (!booking) return res.status(404).json({ success: false });

//   const doc = await uploadToCloudinary(req.file, 'visa_documents');

//   if (Array.isArray(booking.documents[category])) {
//     booking.documents[category].push(doc);
//   } else {
//     booking.documents[category] = doc;
//   }

//   await booking.save();
//   res.json({ success: true, data: doc });
// };

// exports.deleteDocument = async (req, res) => {
//   const { id, publicId, category } = req.params;

//   const booking = await VisaService.findById(id);
//   if (!booking) return res.status(404).json({ success: false });

//   await cloudinary.uploader.destroy(publicId);

//   booking.documents[category] = booking.documents[category].filter(
//     d => d.publicId !== publicId
//   );

//   await booking.save();
//   res.json({ success: true, message: 'Document removed' });
// };

// /* =====================================================
//    DASHBOARD STATISTICS
// ===================================================== */
// exports.getDashboardStats = async (req, res) => {
//   const totalVisas = await VisaService.countDocuments({ recordType: 'visa-catalog' });
//   const totalBookings = await VisaService.countDocuments({ recordType: 'visa-booking' });

//   const bookingStatus = await VisaService.aggregate([
//     { $match: { recordType: 'visa-booking' } },
//     { $group: { _id: '$booking.status', count: { $sum: 1 } } }
//   ]);

//   res.json({
//     success: true,
//     data: {
//       totalVisas,
//       totalBookings,
//       bookingStatus
//     }
//   });
// };










// const VisaService = require('../models/Visa');
// const cloudinary = require('cloudinary').v2;
// const fs = require('fs');

// /* =====================================================
//    HELPERS
// ===================================================== */
// const uploadToCloudinary = async (file, folder) => {
//   if (!file) return null;

//   if (file.size > 5 * 1024 * 1024) {
//     throw new Error('File exceeds 5MB limit');
//   }

//   const result = await cloudinary.uploader.upload(file.path, {
//     folder,
//     resource_type: 'auto'
//   });

//   fs.unlinkSync(file.path); // remove local file after upload

//   return {
//     cloudinaryUrl: result.secure_url,
//     publicId: result.public_id,
//     size: file.size
//   };
// };

// /* =====================================================
//    VISA CATALOG CRUD
// ===================================================== */

// // CREATE CATALOG
// // exports.createVisaCatalog = async (req, res) => {
// //   try {
// //     const coverImage = await uploadToCloudinary(req.file, 'visa_catalog');

// //     const visa = await VisaService.create({
// //       recordType: 'visa-catalog',
// //       visaCatalog: {
// //         ...req.body,
// //         coverImage
// //       }
// //     });

// //     res.status(201).json({ success: true, data: visa });
// //   } catch (e) {
// //     console.error('CREATE CATALOG ERROR:', e);
// //     res.status(400).json({ success: false, message: e.message });
// //   }
// // };

// exports.createVisaCatalog = async (req, res) => {
//   try {
//     const {
//       country,
//       visaType,
//       description,
//       processingTime,
//       price,
//       isActive
//     } = req.body;

//     // ✅ Required field validation
//     if (!country || !visaType) {
//       return res.status(400).json({
//         success: false,
//         message: 'country and visaType are required'
//       });
//     }

//     // ✅ Upload image only if exists
//     let coverImage = null;
//     if (req.file) {
//       coverImage = await uploadToCloudinary(req.file, 'visa_catalog');
//     }

//     const visa = await VisaService.create({
//       recordType: 'visa-catalog',
//       visaCatalog: {
//         country,
//         visaType,
//         description,
//         processingTime,
//         price,
//         isActive,
//         coverImage
//       }
//     });

//     res.status(201).json({
//       success: true,
//       data: visa
//     });

//   } catch (e) {
//     console.error('CREATE CATALOG ERROR:', e);
//     res.status(400).json({
//       success: false,
//       message: e.message
//     });
//   }
// };

// // READ ALL CATALOGS
// // exports.getVisaCatalogs = async (req, res) => {
// //   try {
// //     const visas = await VisaService.find({
// //       recordType: 'visa-catalog',
// //       'visaCatalog.isActive': true
// //     });
// //     res.json({ success: true, count: visas.length, data: visas });
// //   } catch (e) {
// //     res.status(500).json({ success: false, message: e.message });
// //   }
// // };
// exports.getVisaCatalogs = async (req, res) => {
//   try {
//     const visas = await VisaService.find({
//       recordType: 'visa-catalog',
//       'visaCatalog.isActive': true
//     });

//     const formatted = visas.map(v => ({
//       id: v._id,
//       country: v.visaCatalog.country,
//       visaType: v.visaCatalog.visaType,
//       description: v.visaCatalog.description,
//       processingTime: v.visaCatalog.processingTime,
//       price: v.visaCatalog.price,
//       imageUrl: v.visaCatalog.coverImage?.cloudinaryUrl || null,
//       createdAt: v.createdAt
//     }));

//     res.json({
//       success: true,
//       count: formatted.length,
//       data: formatted
//     });
//   } catch (e) {
//     res.status(500).json({ success: false, message: e.message });
//   }
// };


// // READ SINGLE CATALOG
// exports.getVisaCatalogById = async (req, res) => {
//   try {
//     const visa = await VisaService.findById(req.params.id);
//     if (!visa) return res.status(404).json({ success: false, message: 'Catalog not found' });
//     res.json({ success: true, data: visa });
//   } catch (e) {
//     res.status(500).json({ success: false, message: e.message });
//   }
// };

// // UPDATE CATALOG
// exports.updateVisaCatalog = async (req, res) => {
//   try {
//     const visa = await VisaService.findById(req.params.id);
//     if (!visa) return res.status(404).json({ success: false, message: 'Catalog not found' });

//     if (req.file) {
//       if (visa.visaCatalog.coverImage?.publicId) {
//         await cloudinary.uploader.destroy(visa.visaCatalog.coverImage.publicId);
//       }
//       visa.visaCatalog.coverImage = await uploadToCloudinary(req.file, 'visa_catalog');
//     }

//     Object.assign(visa.visaCatalog, req.body);
//     await visa.save();

//     res.json({ success: true, data: visa });
//   } catch (e) {
//     res.status(400).json({ success: false, message: e.message });
//   }
// };

// // DELETE CATALOG (SOFT DELETE)
// exports.deleteVisaCatalog = async (req, res) => {
//   try {
//     const visa = await VisaService.findById(req.params.id);
//     if (!visa) return res.status(404).json({ success: false, message: 'Catalog not found' });

//     visa.visaCatalog.isActive = false;
//     await visa.save();

//     res.json({ success: true, message: 'Visa catalog deactivated' });
//   } catch (e) {
//     res.status(500).json({ success: false, message: e.message });
//   }
// };

// /* =====================================================
//    BOOKING CRUD
// ===================================================== */

// // CREATE BOOKING
// exports.createBooking = async (req, res) => {
//   try {
//     const booking = await VisaService.create({
//       recordType: 'visa-booking',
//       booking: req.body.booking,
//       customer: req.body.customer
//     });
//     res.status(201).json({ success: true, data: booking });
//   } catch (e) {
//     res.status(400).json({ success: false, message: e.message });
//   }
// };

// // READ ALL BOOKINGS
// exports.getAllBookings = async (req, res) => {
//   try {
//     const bookings = await VisaService.find({ recordType: 'visa-booking' });
//     res.json({ success: true, count: bookings.length, data: bookings });
//   } catch (e) {
//     res.status(500).json({ success: false, message: e.message });
//   }
// };

// // READ SINGLE BOOKING
// exports.getBookingById = async (req, res) => {
//   try {
//     const booking = await VisaService.findById(req.params.id);
//     if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
//     res.json({ success: true, data: booking });
//   } catch (e) {
//     res.status(500).json({ success: false, message: e.message });
//   }
// };

// // UPDATE BOOKING
// exports.updateBooking = async (req, res) => {
//   try {
//     const booking = await VisaService.findById(req.params.id);
//     if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

//     Object.assign(booking.booking, req.body.booking || {});
//     Object.assign(booking.customer, req.body.customer || {});

//     await booking.save();
//     res.json({ success: true, data: booking });
//   } catch (e) {
//     res.status(400).json({ success: false, message: e.message });
//   }
// };

// // DELETE BOOKING
// exports.deleteBooking = async (req, res) => {
//   try {
//     await VisaService.findByIdAndDelete(req.params.id);
//     res.json({ success: true, message: 'Booking deleted' });
//   } catch (e) {
//     res.status(500).json({ success: false, message: e.message });
//   }
// };

// /* =====================================================
//    DOCUMENT CRUD
// ===================================================== */

// exports.uploadDocument = async (req, res) => {
//   try {
//     const { id, category } = req.params;
//     const booking = await VisaService.findById(id);
//     if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

//     const doc = await uploadToCloudinary(req.file, 'visa_documents');

//     if (!booking.booking.documents) booking.booking.documents = {};
//     if (Array.isArray(booking.booking.documents[category])) {
//       booking.booking.documents[category].push(doc);
//     } else {
//       booking.booking.documents[category] = doc;
//     }

//     await booking.save();
//     res.json({ success: true, data: doc });
//   } catch (e) {
//     res.status(400).json({ success: false, message: e.message });
//   }
// };

// exports.deleteDocument = async (req, res) => {
//   try {
//     const { id, publicId, category } = req.params;
//     const booking = await VisaService.findById(id);
//     if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

//     await cloudinary.uploader.destroy(publicId);

//     if (Array.isArray(booking.booking.documents[category])) {
//       booking.booking.documents[category] = booking.booking.documents[category].filter(
//         d => d.publicId !== publicId
//       );
//     }

//     await booking.save();
//     res.json({ success: true, message: 'Document removed' });
//   } catch (e) {
//     res.status(400).json({ success: false, message: e.message });
//   }
// };

// /* =====================================================
//    DASHBOARD STATISTICS
// ===================================================== */
// exports.getDashboardStats = async (req, res) => {
//   try {
//     const totalVisas = await VisaService.countDocuments({ recordType: 'visa-catalog' });
//     const totalBookings = await VisaService.countDocuments({ recordType: 'visa-booking' });

//     const bookingStatus = await VisaService.aggregate([
//       { $match: { recordType: 'visa-booking' } },
//       { $group: { _id: '$booking.status', count: { $sum: 1 } } }
//     ]);

//     res.json({
//       success: true,
//       data: { totalVisas, totalBookings, bookingStatus }
//     });
//   } catch (e) {
//     res.status(500).json({ success: false, message: e.message });
//   }
// };

































// const VisaService = require('../models/Visa');
// const cloudinary = require('cloudinary').v2;
// const fs = require('fs');

// /* =========================
//    HELPER: UPLOAD TO CLOUDINARY
// ========================= */
// const uploadToCloudinary = async (file, folder) => {
//   if (!file) return null;
//   if (file.size > 5 * 1024 * 1024) throw new Error('File exceeds 5MB limit');

//   const result = await cloudinary.uploader.upload(file.path, {
//     folder,
//     resource_type: 'auto'
//   });

//   try { fs.unlinkSync(file.path); } catch (err) { console.warn('Temp file cleanup failed', err.message); }

//   return {
//     cloudinaryUrl: result.secure_url,
//     publicId: result.public_id,
//     size: file.size
//   };
// };

// /* =========================
//    CATALOG CRUD
// ========================= */

// // CREATE CATALOG
// exports.createVisaCatalog = async (req, res) => {
//   try {
//     const { country, visaType, description, processingTime, price, isActive } = req.body;

//     if (!country || !visaType)
//       return res.status(400).json({ success: false, message: 'country and visaType are required' });

//     let coverImage = null;
//     if (req.file) coverImage = await uploadToCloudinary(req.file, 'visa_catalog');

//     const visa = await VisaService.create({
//       recordType: 'visa-catalog',
//       visaCatalog: { country, visaType, description, processingTime, price, isActive, coverImage }
//     });

//     res.status(201).json({ success: true, data: visa });
//   } catch (e) {
//     res.status(400).json({ success: false, message: e.message });
//   }
// };

// // GET ALL CATALOGS
// exports.getVisaCatalogs = async (req, res) => {
//   try {
//     const visas = await VisaService.find({ recordType: 'visa-catalog', 'visaCatalog.isActive': true });
//     const formatted = visas.map(v => ({
//       id: v._id,
//       country: v.visaCatalog.country,
//       visaType: v.visaCatalog.visaType,
//       description: v.visaCatalog.description,
//       processingTime: v.visaCatalog.processingTime,
//       price: v.visaCatalog.price,
//       imageUrl: v.visaCatalog.coverImage?.cloudinaryUrl || null,
//       createdAt: v.createdAt
//     }));
//     res.json({ success: true, count: formatted.length, data: formatted });
//   } catch (e) {
//     res.status(500).json({ success: false, message: e.message });
//   }
// };

// // GET CATALOG BY ID
// exports.getVisaCatalogById = async (req, res) => {
//   try {
//     const visa = await VisaService.findById(req.params.id);
//     if (!visa || visa.recordType !== 'visa-catalog')
//       return res.status(404).json({ success: false, message: 'Catalog not found' });
//     res.json({ success: true, data: visa });
//   } catch (e) {
//     res.status(500).json({ success: false, message: e.message });
//   }
// };

// // UPDATE CATALOG
// exports.updateVisaCatalog = async (req, res) => {
//   try {
//     const visa = await VisaService.findById(req.params.id);
//     if (!visa || visa.recordType !== 'visa-catalog')
//       return res.status(404).json({ success: false, message: 'Catalog not found' });

//     if (req.file) {
//       if (visa.visaCatalog.coverImage?.publicId) await cloudinary.uploader.destroy(visa.visaCatalog.coverImage.publicId);
//       visa.visaCatalog.coverImage = await uploadToCloudinary(req.file, 'visa_catalog');
//     }

//     const allowedFields = ['country','visaType','description','processingTime','price','isActive'];
//     allowedFields.forEach(f => { if (req.body[f] !== undefined) visa.visaCatalog[f] = req.body[f]; });

//     await visa.save();
//     res.json({ success: true, data: visa });
//   } catch (e) {
//     res.status(400).json({ success: false, message: e.message });
//   }
// };

// // SOFT DELETE
// exports.deleteVisaCatalog = async (req, res) => {
//   try {
//     const visa = await VisaService.findById(req.params.id);
//     if (!visa || visa.recordType !== 'visa-catalog')
//       return res.status(404).json({ success: false, message: 'Catalog not found' });

//     visa.visaCatalog.isActive = false;
//     await visa.save();
//     res.json({ success: true, message: 'Visa catalog deactivated' });
//   } catch (e) {
//     res.status(500).json({ success: false, message: e.message });
//   }
// };

// /* =========================
//    BOOKING CRUD
// ========================= */

// // CREATE BOOKING
// exports.createBooking = async (req, res) => {
//   try {
//     // ✅ Validate serviceRef
//     const catalog = await VisaService.findOne({ _id: req.body.booking.serviceRef, recordType: 'visa-catalog' });
//     if (!catalog) return res.status(400).json({ success: false, message: 'Invalid visa catalog reference' });

//     const booking = await VisaService.create({ recordType: 'visa-booking', booking: req.body.booking });
//     res.status(201).json({ success: true, data: booking });
//   } catch (e) {
//     res.status(400).json({ success: false, message: e.message });
//   }
// };

// // READ ALL BOOKINGS
// exports.getAllBookings = async (req, res) => {
//   try {
//     const bookings = await VisaService.find({ recordType: 'visa-booking' });
//     res.json({ success: true, count: bookings.length, data: bookings });
//   } catch (e) {
//     res.status(500).json({ success: false, message: e.message });
//   }
// };

// // GET BOOKING BY ID
// exports.getBookingById = async (req, res) => {
//   try {
//     const booking = await VisaService.findById(req.params.id);
//     if (!booking || booking.recordType !== 'visa-booking')
//       return res.status(404).json({ success: false, message: 'Booking not found' });
//     res.json({ success: true, data: booking });
//   } catch (e) {
//     res.status(500).json({ success: false, message: e.message });
//   }
// };

// // UPDATE BOOKING
// exports.updateBooking = async (req, res) => {
//   try {
//     const booking = await VisaService.findById(req.params.id);
//     if (!booking || booking.recordType !== 'visa-booking')
//       return res.status(404).json({ success: false, message: 'Booking not found' });

//     Object.assign(booking.booking, req.body.booking || {});
//     await booking.save();
//     res.json({ success: true, data: booking });
//   } catch (e) {
//     res.status(400).json({ success: false, message: e.message });
//   }
// };

// // DELETE BOOKING
// exports.deleteBooking = async (req, res) => {
//   try {
//     const booking = await VisaService.findById(req.params.id);
//     if (!booking || booking.recordType !== 'visa-booking')
//       return res.status(404).json({ success: false, message: 'Booking not found' });

//     await booking.remove();
//     res.json({ success: true, message: 'Booking deleted' });
//   } catch (e) {
//     res.status(500).json({ success: false, message: e.message });
//   }
// };

// /* =========================
//    DOCUMENT CRUD
// ========================= */
// const allowedCategories = ['photograph','passportCopy','financialDocuments','travelDocuments','supportingDocuments'];

// exports.uploadDocument = async (req, res) => {
//   try {
//     const { id, category } = req.params;
//     if (!allowedCategories.includes(category))
//       return res.status(400).json({ success: false, message: 'Invalid document category' });

//     const booking = await VisaService.findById(id);
//     if (!booking || booking.recordType !== 'visa-booking')
//       return res.status(404).json({ success: false, message: 'Booking not found' });

//     const doc = await uploadToCloudinary(req.file, 'visa_documents');

//     if (!booking.booking.documents) booking.booking.documents = {};
//     if (Array.isArray(booking.booking.documents[category])) booking.booking.documents[category].push(doc);
//     else booking.booking.documents[category] = doc;

//     await booking.save();
//     res.json({ success: true, data: doc });
//   } catch (e) {
//     res.status(400).json({ success: false, message: e.message });
//   }
// };

// exports.deleteDocument = async (req, res) => {
//   try {
//     const { id, category, publicId } = req.params;
//     if (!allowedCategories.includes(category))
//       return res.status(400).json({ success: false, message: 'Invalid document category' });

//     const booking = await VisaService.findById(id);
//     if (!booking || booking.recordType !== 'visa-booking')
//       return res.status(404).json({ success: false, message: 'Booking not found' });

//     await cloudinary.uploader.destroy(publicId);

//     if (Array.isArray(booking.booking.documents[category])) {
//       booking.booking.documents[category] = booking.booking.documents[category].filter(d => d.publicId !== publicId);
//     }

//     await booking.save();
//     res.json({ success: true, message: 'Document removed' });
//   } catch (e) {
//     res.status(400).json({ success: false, message: e.message });
//   }
// };

// /* =========================
//    DASHBOARD STATS
// ========================= */
// exports.getDashboardStats = async (req, res) => {
//   try {
//     const totalVisas = await VisaService.countDocuments({ recordType: 'visa-catalog' });
//     const totalBookings = await VisaService.countDocuments({ recordType: 'visa-booking' });

//     const bookingStatus = await VisaService.aggregate([
//       { $match: { recordType: 'visa-booking' } },
//       { $group: { _id: '$booking.status', count: { $sum: 1 } } }
//     ]);

//     res.json({ success: true, data: { totalVisas, totalBookings, bookingStatus } });
//   } catch (e) {
//     res.status(500).json({ success: false, message: e.message });
//   }
// };




























// const VisaService = require('../models/Visa');
// const cloudinary = require('cloudinary').v2;
// const fs = require('fs');

// /* =========================
//    HELPER: CLOUDINARY UPLOAD
// ========================= */
// const uploadToCloudinary = async (file, folder) => {
//   if (!file) return null;
//   if (file.size > 5*1024*1024) throw new Error('File exceeds 5MB limit');

//   const result = await cloudinary.uploader.upload(file.path, { folder, resource_type: 'auto' });

//   try { fs.unlinkSync(file.path); } catch(err) { console.warn('File cleanup failed', err.message); }

//   return { cloudinaryUrl: result.secure_url, publicId: result.public_id, size: file.size };
// };

// /* =========================
//    VISA CATALOG CRUD
// ========================= */
// exports.createVisaCatalog = async (req, res, next) => {
//   try {
//     const { country, visaType, description, processingTime, price, isActive } = req.body;
//     if (!country || !visaType) return res.status(400).json({ success: false, message: 'country and visaType are required' });

//     const coverImage = req.file ? await uploadToCloudinary(req.file, 'visa_catalog') : null;

//     const visa = await VisaService.create({
//       recordType: 'visa-catalog',
//       visaCatalog: { country, visaType, description, processingTime, price, isActive, coverImage }
//     });

//     res.status(201).json({ success: true, data: visa });
//   } catch(e) { next(e); }
// };

// exports.getVisaCatalogs = async (req, res, next) => {
//   try {
//     const visas = await VisaService.find({ recordType:'visa-catalog', 'visaCatalog.isActive':true });
//     res.json({ success:true, count: visas.length, data: visas });
//   } catch(e) { next(e); }
// };

// exports.getVisaCatalogById = async (req, res, next) => {
//   try {
//     const visa = await VisaService.findById(req.params.id);
//     if (!visa) return res.status(404).json({ success:false, message:'Catalog not found' });
//     res.json({ success:true, data: visa });
//   } catch(e) { next(e); }
// };

// exports.updateVisaCatalog = async (req, res, next) => {
//   try {
//     const visa = await VisaService.findById(req.params.id);
//     if (!visa) return res.status(404).json({ success:false, message:'Catalog not found' });

//     if (req.file && visa.visaCatalog.coverImage?.publicId) {
//       await cloudinary.uploader.destroy(visa.visaCatalog.coverImage.publicId);
//       visa.visaCatalog.coverImage = await uploadToCloudinary(req.file, 'visa_catalog');
//     }

//     Object.assign(visa.visaCatalog, req.body);
//     await visa.save();

//     res.json({ success:true, data: visa });
//   } catch(e) { next(e); }
// };

// exports.deleteVisaCatalog = async (req, res, next) => {
//   try {
//     const visa = await VisaService.findById(req.params.id);
//     if (!visa) return res.status(404).json({ success:false, message:'Catalog not found' });

//     visa.visaCatalog.isActive = false;
//     await visa.save();

//     res.json({ success:true, message:'Visa catalog deactivated' });
//   } catch(e) { next(e); }
// };

// /* =========================
//    VISA BOOKING CRUD
// ========================= */
// exports.createBooking = async (req, res, next) => {
//   try {
//     const { serviceRef, bookingType, customer } = req.body;
//     if (!serviceRef || !customer?.fullName || !customer?.email)
//       return res.status(400).json({ success:false, message:'serviceRef and customer info required' });

//     const booking = await VisaService.create({ recordType:'visa-booking', booking:{serviceRef, bookingType}, customer });
//     res.status(201).json({ success:true, data: booking });
//   } catch(e) { next(e); }
// };

// exports.getAllBookings = async (req, res, next) => {
//   try {
//     const bookings = await VisaService.find({ recordType:'visa-booking' }).populate('booking.serviceRef', 'visaCatalog');
//     res.json({ success:true, count: bookings.length, data: bookings });
//   } catch(e) { next(e); }
// };

// exports.getBookingById = async (req, res, next) => {
//   try {
//     const booking = await VisaService.findById(req.params.id).populate('booking.serviceRef', 'visaCatalog');
//     if (!booking) return res.status(404).json({ success:false, message:'Booking not found' });
//     res.json({ success:true, data: booking });
//   } catch(e) { next(e); }
// };

// exports.updateBooking = async (req, res, next) => {
//   try {
//     const booking = await VisaService.findById(req.params.id);
//     if (!booking) return res.status(404).json({ success:false, message:'Booking not found' });

//     Object.assign(booking.booking, req.body.booking || {});
//     Object.assign(booking.customer, req.body.customer || {});

//     await booking.save();
//     res.json({ success:true, data: booking });
//   } catch(e) { next(e); }
// };

// exports.deleteBooking = async (req, res, next) => {
//   try {
//     await VisaService.findByIdAndDelete(req.params.id);
//     res.json({ success:true, message:'Booking deleted' });
//   } catch(e) { next(e); }
// };

// /* =========================
//    DOCUMENT CRUD
// ========================= */
// exports.uploadDocument = async (req, res, next) => {
//   try {
//     const { id, category } = req.params;
//     const booking = await VisaService.findById(id);
//     if (!booking) return res.status(404).json({ success:false, message:'Booking not found' });

//     const doc = await booking.uploadDocument(category, req.file);
//     await booking.save();

//     res.json({ success:true, data: doc });
//   } catch(e) { next(e); }
// };

// exports.deleteDocument = async (req, res, next) => {
//   try {
//     const { id, publicId, category } = req.params;
//     const booking = await VisaService.findById(id);
//     if (!booking) return res.status(404).json({ success:false, message:'Booking not found' });

//     await cloudinary.uploader.destroy(publicId);
//     if (Array.isArray(booking.booking.documents[category])) {
//       booking.booking.documents[category] = booking.booking.documents[category].filter(d => d.publicId !== publicId);
//     }

//     await booking.save();
//     res.json({ success:true, message:'Document removed' });
//   } catch(e) { next(e); }
// };

// /* =========================
//    DASHBOARD STATS
// ========================= */
// exports.getDashboardStats = async (req, res, next) => {
//   try {
//     const totalVisas = await VisaService.countDocuments({ recordType:'visa-catalog' });
//     const totalBookings = await VisaService.countDocuments({ recordType:'visa-booking' });
//     const bookingStatus = await VisaService.aggregate([
//       { $match: { recordType:'visa-booking' } },
//       { $group: { _id:'$booking.status', count:{ $sum:1 } } }
//     ]);

//     res.json({ success:true, data:{ totalVisas, totalBookings, bookingStatus } });
//   } catch(e) { next(e); }
// };


























// const VisaService = require('../models/Visa');
// const cloudinary = require('cloudinary').v2;
// const fs = require('fs');

// /* =========================
//    CLOUDINARY UPLOAD HELPER
// ========================= */
// const uploadToCloudinary = async (file, folder) => {
//   if (!file) return null;

//   if (file.size > 5 * 1024 * 1024) {
//     throw new Error('File exceeds 5MB limit');
//   }

//   const result = await cloudinary.uploader.upload(file.path, {
//     folder,
//     resource_type: 'auto'
//   });

//   try { fs.unlinkSync(file.path); } catch (err) { console.warn('File cleanup failed', err.message); }

//   return {
//     cloudinaryUrl: result.secure_url,
//     publicId: result.public_id,
//     size: file.size
//   };
// };

// /* =========================
//    VISA CATALOG CRUD
// ========================= */
// exports.createVisaCatalog = async (req, res) => {
//   try {
//     const { country, visaType, description, processingTime, price, isActive } = req.body;

//     if (!country || !visaType) {
//       return res.status(400).json({ success: false, message: 'country and visaType are required' });
//     }

//     let coverImage = null;
//     if (req.file) {
//       coverImage = await uploadToCloudinary(req.file, 'visa_catalog');
//     }

//     const visa = await VisaService.create({
//       recordType: 'visa-catalog',
//       visaCatalog: { country, visaType, description, processingTime, price, isActive, coverImage }
//     });

//     res.status(201).json({ success: true, data: visa });
//   } catch (e) {
//     res.status(400).json({ success: false, message: e.message });
//   }
// };

// exports.getVisaCatalogs = async (req, res) => {
//   try {
//     const visas = await VisaService.find({ recordType: 'visa-catalog', 'visaCatalog.isActive': true });
//     res.json({ success: true, count: visas.length, data: visas });
//   } catch (e) {
//     res.status(500).json({ success: false, message: e.message });
//   }
// };

// exports.getVisaCatalogById = async (req, res) => {
//   try {
//     const visa = await VisaService.findById(req.params.id);
//     if (!visa) return res.status(404).json({ success: false, message: 'Catalog not found' });
//     res.json({ success: true, data: visa });
//   } catch (e) {
//     res.status(500).json({ success: false, message: e.message });
//   }
// };

// exports.updateVisaCatalog = async (req, res) => {
//   try {
//     const visa = await VisaService.findById(req.params.id);
//     if (!visa) return res.status(404).json({ success: false, message: 'Catalog not found' });

//     if (req.file && visa.visaCatalog.coverImage?.publicId) {
//       await cloudinary.uploader.destroy(visa.visaCatalog.coverImage.publicId);
//       visa.visaCatalog.coverImage = await uploadToCloudinary(req.file, 'visa_catalog');
//     }

//     Object.assign(visa.visaCatalog, req.body);
//     await visa.save();

//     res.json({ success: true, data: visa });
//   } catch (e) {
//     res.status(400).json({ success: false, message: e.message });
//   }
// };

// exports.deleteVisaCatalog = async (req, res) => {
//   try {
//     const visa = await VisaService.findById(req.params.id);
//     if (!visa) return res.status(404).json({ success: false, message: 'Catalog not found' });

//     visa.visaCatalog.isActive = false;
//     await visa.save();

//     res.json({ success: true, message: 'Visa catalog deactivated' });
//   } catch (e) {
//     res.status(500).json({ success: false, message: e.message });
//   }
// };

// /* =========================
//    BOOKINGS CRUD
// ========================= */
// exports.createBooking = async (req, res) => {
//   try {
//     const booking = await VisaService.create({
//       recordType: 'visa-booking',
//       booking: req.body.booking,
//       customer: req.body.customer
//     });

//     res.status(201).json({ success: true, data: booking });
//   } catch (e) {
//     res.status(400).json({ success: false, message: e.message });
//   }
// };

// exports.getAllBookings = async (req, res) => {
//   try {
//     const bookings = await VisaService.find({ recordType: 'visa-booking' });
//     res.json({ success: true, count: bookings.length, data: bookings });
//   } catch (e) {
//     res.status(500).json({ success: false, message: e.message });
//   }
// };

// exports.getBookingById = async (req, res) => {
//   try {
//     const booking = await VisaService.findById(req.params.id);
//     if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
//     res.json({ success: true, data: booking });
//   } catch (e) {
//     res.status(500).json({ success: false, message: e.message });
//   }
// };

// exports.updateBooking = async (req, res) => {
//   try {
//     const booking = await VisaService.findById(req.params.id);
//     if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

//     Object.assign(booking.booking, req.body.booking || {});
//     Object.assign(booking.customer, req.body.customer || {});

//     await booking.save();
//     res.json({ success: true, data: booking });
//   } catch (e) {
//     res.status(400).json({ success: false, message: e.message });
//   }
// };

// exports.deleteBooking = async (req, res) => {
//   try {
//     await VisaService.findByIdAndDelete(req.params.id);
//     res.json({ success: true, message: 'Booking deleted' });
//   } catch (e) {
//     res.status(500).json({ success: false, message: e.message });
//   }
// };

// /* =========================
//    DOCUMENTS CRUD
// ========================= */
// exports.uploadDocument = async (req, res) => {
//   try {
//     const { id, category } = req.params;
//     const booking = await VisaService.findById(id);
//     if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

//     const doc = await uploadToCloudinary(req.file, 'visa_documents');

//     if (!booking.booking.documents) booking.booking.documents = {};
//     if (Array.isArray(booking.booking.documents[category])) {
//       booking.booking.documents[category].push(doc);
//     } else {
//       booking.booking.documents[category] = doc;
//     }

//     await booking.save();
//     res.json({ success: true, data: doc });
//   } catch (e) {
//     res.status(400).json({ success: false, message: e.message });
//   }
// };

// exports.deleteDocument = async (req, res) => {
//   try {
//     const { id, publicId, category } = req.params;
//     const booking = await VisaService.findById(id);
//     if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

//     await cloudinary.uploader.destroy(publicId);

//     if (Array.isArray(booking.booking.documents[category])) {
//       booking.booking.documents[category] = booking.booking.documents[category].filter(
//         d => d.publicId !== publicId
//       );
//     }

//     await booking.save();
//     res.json({ success: true, message: 'Document removed' });
//   } catch (e) {
//     res.status(400).json({ success: false, message: e.message });
//   }
// };

// /* =========================
//    DASHBOARD STATISTICS
// ========================= */
// exports.getDashboardStats = async (req, res) => {
//   try {
//     const totalVisas = await VisaService.countDocuments({ recordType: 'visa-catalog' });
//     const totalBookings = await VisaService.countDocuments({ recordType: 'visa-booking' });

//     const bookingStatus = await VisaService.aggregate([
//       { $match: { recordType: 'visa-booking' } },
//       { $group: { _id: '$booking.status', count: { $sum: 1 } } }
//     ]);

//     res.json({
//       success: true,
//       data: { totalVisas, totalBookings, bookingStatus }
//     });
//   } catch (e) {
//     res.status(500).json({ success: false, message: e.message });
//   }
// };














const VisaService = require("../models/Visa");
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const streamifier = require("streamifier");

/* =====================================================
   MULTER MEMORY STORAGE
===================================================== */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
});
exports.upload = upload;

/* =====================================================
   CLOUDINARY UPLOAD HELPER
===================================================== */
const uploadToCloudinary = async (file, folder = "visa_documents") => {
  if (!file) return null;

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "auto" },
      (error, result) => {
        if (error) return reject(error);

        resolve({
          cloudinaryUrl: result.secure_url,
          publicId: result.public_id,
          size: file.size,
        });
      }
    );
    streamifier.createReadStream(file.buffer).pipe(stream);
  });
};

/* =====================================================
   VISA CATALOG CRUD
===================================================== */

exports.createVisaCatalog = async (req, res) => {
  try {
    const { country, visaType, description, processingTime, price, isActive } =
      req.body;

    if (!country || !visaType) {
      return res
        .status(400)
        .json({ success: false, message: "country and visaType are required" });
    }

    const coverImage = req.file
      ? await uploadToCloudinary(req.file, "visa_catalog")
      : null;

    const visa = await VisaService.create({
      recordType: "visa-catalog",
      visaCatalog: {
        country,
        visaType,
        description,
        processingTime,
        price,
        isActive,
        coverImage,
      },
    });

    res.status(201).json({ success: true, data: visa });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.getVisaCatalogs = async (req, res) => {
  try {
    const visas = await VisaService.find({
      recordType: "visa-catalog",
      "visaCatalog.isActive": true,
    });
    res.json({ success: true, count: visas.length, data: visas });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getVisaCatalogById = async (req, res) => {
  try {
    const visa = await VisaService.findById(req.params.id);
    if (!visa)
      return res.status(404).json({ success: false, message: "Catalog not found" });

    res.json({ success: true, data: visa });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateVisaCatalog = async (req, res) => {
  try {
    const visa = await VisaService.findById(req.params.id);
    if (!visa)
      return res.status(404).json({ success: false, message: "Catalog not found" });

    if (req.file && visa.visaCatalog.coverImage?.publicId) {
      await cloudinary.uploader.destroy(visa.visaCatalog.coverImage.publicId);
      visa.visaCatalog.coverImage = await uploadToCloudinary(
        req.file,
        "visa_catalog"
      );
    }

    Object.assign(visa.visaCatalog, req.body);
    await visa.save();

    res.json({ success: true, data: visa });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.deleteVisaCatalog = async (req, res) => {
  try {
    const visa = await VisaService.findById(req.params.id);
    if (!visa)
      return res.status(404).json({ success: false, message: "Catalog not found" });

    visa.visaCatalog.isActive = false;
    await visa.save();

    res.json({ success: true, message: "Visa catalog deactivated" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* =====================================================
   VISA BOOKINGS CRUD
===================================================== */

// exports.createBooking = async (req, res) => {
//   try {
//     const booking = await VisaService.create({
//       recordType: "visa-booking",
//       booking: req.body.booking,
//       customer: req.body.customer,
//     });

//     res.status(201).json({ success: true, data: booking });
//   } catch (err) {
//     res.status(400).json({ success: false, message: err.message });
//   }
// };

exports.createBooking = async (req, res) => {
  try {
    const booking = await VisaService.create({
      recordType: "visa-booking",

      booking: {
        bookingType: req.body.bookingType,
        serviceRef: req.body.serviceRef,
        status: req.body.status,
      },

      customer: req.body.customer,
    });

    res.status(201).json({ success: true, data: booking });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};


// exports.getAllBookings = async (req, res) => {
//   try {
//     const bookings = await VisaService.find({ recordType: "visa-booking" });
//     res.json({ success: true, count: bookings.length, data: bookings });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await VisaService.find({
      recordType: "visa-booking",
    });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


// exports.getBookingsByEmail = async (req, res) => {
//   try {
//     const { email } = req.query;

//     if (!email) {
//       return res.status(400).json({
//         success: false,
//         message: "Email query is required",
//       });
//     }

//     const bookings = await VisaService.find({
//       recordType: "visa-booking",
//       email,
//     }).sort({ createdAt: -1 });

//     res.status(200).json({
//       success: true,
//       count: bookings.length,
//       data: bookings,
//     });
//   } catch (err) {
//     res.status(500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };

exports.getBookingsByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email parameter is required",
      });
    }

    const bookings = await VisaService.find({
      recordType: "visa-booking",
      "booking.customer.email": email,
    });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};



exports.getBookingById = async (req, res) => {
  try {
    const booking = await VisaService.findById(req.params.id);
    if (!booking)
      return res.status(404).json({ success: false, message: "Booking not found" });

    res.json({ success: true, data: booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateBooking = async (req, res) => {
  try {
    const booking = await VisaService.findById(req.params.id);
    if (!booking)
      return res.status(404).json({ success: false, message: "Booking not found" });

    Object.assign(booking.booking, req.body.booking || {});
    Object.assign(booking.customer, req.body.customer || {});
    await booking.save();

    res.json({ success: true, data: booking });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.deleteBooking = async (req, res) => {
  try {
    await VisaService.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Booking deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* =====================================================
   DOCUMENTS CRUD
===================================================== */

exports.uploadDocument = async (req, res) => {
  try {
    const { id, category } = req.params;
    const booking = await VisaService.findById(id);

    if (!booking)
      return res.status(404).json({ success: false, message: "Booking not found" });

    const doc = await uploadToCloudinary(req.file, "visa_documents");

    if (!booking.booking.documents) booking.booking.documents = {};

    if (Array.isArray(booking.booking.documents[category])) {
      booking.booking.documents[category].push(doc);
    } else {
      booking.booking.documents[category] = [doc];
    }

    await booking.save();
    res.json({ success: true, data: doc });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.deleteDocument = async (req, res) => {
  try {
    const { id, publicId, category } = req.params;
    const booking = await VisaService.findById(id);

    if (!booking)
      return res.status(404).json({ success: false, message: "Booking not found" });

    await cloudinary.uploader.destroy(publicId);

    if (Array.isArray(booking.booking.documents[category])) {
      booking.booking.documents[category] =
        booking.booking.documents[category].filter((d) => d.publicId !== publicId);
    }

    await booking.save();
    res.json({ success: true, message: "Document removed" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

/* =====================================================
   DASHBOARD STATISTICS
===================================================== */

exports.getDashboardStats = async (req, res) => {
  try {
    const totalVisas = await VisaService.countDocuments({ recordType: "visa-catalog" });
    const totalBookings = await VisaService.countDocuments({ recordType: "visa-booking" });

    const bookingStatus = await VisaService.aggregate([
      { $match: { recordType: "visa-booking" } },
      { $group: { _id: "$booking.status", count: { $sum: 1 } } },
    ]);

    res.json({
      success: true,
      data: { totalVisas, totalBookings, bookingStatus },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
