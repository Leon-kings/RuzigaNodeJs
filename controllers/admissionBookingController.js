// const AdmissionBooking = require('../models/AdmissionBooking');
// const emailService = require('../mails/sendEmail');
// const documentService = require('../services/documentService');
// const { validationResult } = require('express-validator');

// // Get all admission bookings
// exports.getAllApplications = async (req, res) => {
//   try {
//     const {
//       page = 1,
//       limit = 20,
//       status,
//       targetCountry,
//       targetUniversity,
//       programLevel,
//       intakeSeason,
//       intakeYear,
//       priority,
//       documents,
//       essay,
//       search,
//       sortBy = 'createdAt',
//       sortOrder = 'desc'
//     } = req.query;

//     const query = {};

//     // Filters
//     if (status) query.status = status;
//     if (targetCountry) query.targetCountry = targetCountry;
//     if (targetUniversity) query.targetUniversity = targetUniversity;
//     if (programLevel) query.programLevel = programLevel;
//     if (intakeSeason) query.intakeSeason = intakeSeason;
//     if (intakeYear) query.intakeYear = parseInt(intakeYear);
//     if (priority) query.priority = priority;
//     if (documents) query.documents = documents;
//     if (essay) query.essay = essay;

//     // Search
//     if (search) {
//       query.$or = [
//         { applicationId: { $regex: search, $options: 'i' } },
//         { firstName: { $regex: search, $options: 'i' } },
//         { lastName: { $regex: search, $options: 'i' } },
//         { email: { $regex: search, $options: 'i' } },
//         { targetUniversity: { $regex: search, $options: 'i' } },
//         { targetProgram: { $regex: search, $options: 'i' } }
//       ];
//     }

//     const sortOptions = {};
//     sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

//     const applications = await AdmissionBooking.find(query)
//       .sort(sortOptions)
//       .limit(limit * 1)
//       .skip((page - 1) * limit)
//       .populate('assignedCounselor', 'firstName lastName email')
//       .exec();

//     const total = await AdmissionBooking.countDocuments(query);

//     res.status(200).json({
//       success: true,
//       data: applications,
//       pagination: {
//         currentPage: page * 1,
//         totalPages: Math.ceil(total / limit),
//         totalItems: total,
//         itemsPerPage: limit * 1
//       }
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching applications',
//       error: error.message
//     });
//   }
// };

// // Get single application
// exports.getApplication = async (req, res) => {
//   try {
//     const application = await AdmissionBooking.findById(req.params.id)
//       .populate('assignedCounselor', 'firstName lastName email phone')
//       .populate('notes.createdBy', 'firstName lastName');

//     if (!application) {
//       return res.status(404).json({
//         success: false,
//         message: 'Application not found'
//       });
//     }

//     res.status(200).json({
//       success: true,
//       data: application
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching application',
//       error: error.message
//     });
//   }
// };

// // Create application
// exports.createApplication = async (req, res) => {
//   try {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({
//         success: false,
//         errors: errors.array()
//       });
//     }

//     const applicationData = req.body;
    
//     // Add metadata
//     applicationData.metadata = {
//       ipAddress: req.ip,
//       userAgent: req.get('User-Agent'),
//       source: req.body.source || 'website',
//       campaign: req.body.campaign
//     };

//     const application = new AdmissionBooking(applicationData);
//     await application.save();

//     // Add timeline event
//     await application.addTimelineEvent(
//       'application_created',
//       'Application was created',
//       req.user ? req.user.id : 'system'
//     );

//     // Send confirmation email
//     try {
//       await emailService.sendApplicationConfirmation(application);
//       await application.save();
//     } catch (emailError) {
//       console.error('Email sending failed:', emailError);
//     }

//     res.status(201).json({
//       success: true,
//       message: 'Application created successfully',
//       data: application
//     });
//   } catch (error) {
//     if (error.code === 11000) {
//       return res.status(400).json({
//         success: false,
//         message: 'Email or Application ID already exists'
//       });
//     }
//     res.status(500).json({
//       success: false,
//       message: 'Error creating application',
//       error: error.message
//     });
//   }
// };

// // Update application
// exports.updateApplication = async (req, res) => {
//   try {
//     const application = await AdmissionBooking.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true, runValidators: true }
//     );

//     if (!application) {
//       return res.status(404).json({
//         success: false,
//         message: 'Application not found'
//       });
//     }

//     // Add timeline event
//     await application.addTimelineEvent(
//       'application_updated',
//       'Application information was updated',
//       req.user.id
//     );

//     res.status(200).json({
//       success: true,
//       message: 'Application updated successfully',
//       data: application
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error updating application',
//       error: error.message
//     });
//   }
// };

// // Delete application
// exports.deleteApplication = async (req, res) => {
//   try {
//     const application = await AdmissionBooking.findByIdAndDelete(req.params.id);

//     if (!application) {
//       return res.status(404).json({
//         success: false,
//         message: 'Application not found'
//       });
//     }

//     // Delete associated documents
//     await documentService.deleteApplicationDocuments(application._id);

//     res.status(200).json({
//       success: true,
//       message: 'Application deleted successfully'
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error deleting application',
//       error: error.message
//     });
//   }
// };

// // Submit application
// exports.submitApplication = async (req, res) => {
//   try {
//     const application = await AdmissionBooking.findById(req.params.id);

//     if (!application) {
//       return res.status(404).json({
//         success: false,
//         message: 'Application not found'
//       });
//     }

//     // Check if all required fields are completed
//     const requiredFields = [
//       'firstName', 'lastName', 'email', 'phone', 'nationality',
//       'currentEducation', 'gpa', 'targetUniversity', 'targetCountry',
//       'targetProgram', 'programLevel', 'intakeSeason', 'intakeYear'
//     ];

//     const missingFields = requiredFields.filter(field => !application[field]);

//     if (missingFields.length > 0) {
//       return res.status(400).json({
//         success: false,
//         message: 'Required fields are missing',
//         missingFields
//       });
//     }

//     application.status = 'submitted';
//     application.submittedAt = new Date();
//     await application.save();

//     // Add timeline event
//     await application.addTimelineEvent(
//       'application_submitted',
//       'Application was officially submitted',
//       req.user ? req.user.id : 'system'
//     );

//     // Send submission confirmation
//     try {
//       await emailService.sendApplicationSubmissionConfirmation(application);
//     } catch (emailError) {
//       console.error('Email sending failed:', emailError);
//     }

//     res.status(200).json({
//       success: true,
//       message: 'Application submitted successfully',
//       data: application
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error submitting application',
//       error: error.message
//     });
//   }
// };

// // Update application status
// exports.updateStatus = async (req, res) => {
//   try {
//     const { status, notes } = req.body;

//     const application = await AdmissionBooking.findById(req.params.id);

//     if (!application) {
//       return res.status(404).json({
//         success: false,
//         message: 'Application not found'
//       });
//     }

//     const oldStatus = application.status;
//     application.status = status;

//     if (notes) {
//       await application.addNote(
//         `Status changed from ${oldStatus} to ${status}. ${notes}`,
//         req.user.id,
//         'general'
//       );
//     }

//     await application.save();

//     // Add timeline event
//     await application.addTimelineEvent(
//       'status_changed',
//       `Status changed from ${oldStatus} to ${status}`,
//       req.user.id
//     );

//     // Send status update email
//     try {
//       await emailService.sendStatusUpdateEmail(application, status, oldStatus);
//     } catch (emailError) {
//       console.error('Email sending failed:', emailError);
//     }

//     res.status(200).json({
//       success: true,
//       message: 'Application status updated successfully',
//       data: application
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error updating application status',
//       error: error.message
//     });
//   }
// };

// // Upload document
// exports.uploadDocument = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { documentType } = req.body;

//     if (!req.file) {
//       return res.status(400).json({
//         success: false,
//         message: 'No file uploaded'
//       });
//     }

//     const application = await AdmissionBooking.findById(id);

//     if (!application) {
//       return res.status(404).json({
//         success: false,
//         message: 'Application not found'
//       });
//     }

//     // Upload document to storage
//     const documentUrl = await documentService.uploadDocument(
//       req.file,
//       application.applicationId,
//       documentType
//     );

//     // Add to documents array
//     application.documentsSubmitted.push({
//       name: req.file.originalname,
//       type: documentType,
//       url: documentUrl,
//       uploadedAt: new Date()
//     });

//     // Update documents status
//     application.documents = 'uploaded';
//     application.statistics.documentsUploaded = application.documentsSubmitted.length;
//     await application.save();

//     // Add timeline event
//     await application.addTimelineEvent(
//       'document_uploaded',
//       `${documentType} document uploaded: ${req.file.originalname}`,
//       req.user ? req.user.id : 'system'
//     );

//     res.status(200).json({
//       success: true,
//       message: 'Document uploaded successfully',
//       data: {
//         documentUrl,
//         documentsCount: application.documentsSubmitted.length
//       }
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error uploading document',
//       error: error.message
//     });
//   }
// };

// // Verify document
// exports.verifyDocument = async (req, res) => {
//   try {
//     const { id, docId } = req.params;
//     const { verified, comments } = req.body;

//     const application = await AdmissionBooking.findById(id);

//     if (!application) {
//       return res.status(404).json({
//         success: false,
//         message: 'Application not found'
//       });
//     }

//     const document = application.documentsSubmitted.id(docId);

//     if (!document) {
//       return res.status(404).json({
//         success: false,
//         message: 'Document not found'
//       });
//     }

//     document.verified = verified;
//     document.verifiedBy = req.user.id;
//     document.verifiedAt = new Date();

//     // Add note about verification
//     if (comments) {
//       await application.addNote(
//         `Document ${document.name} ${verified ? 'verified' : 'rejected'}: ${comments}`,
//         req.user.id,
//         'document'
//       );
//     }

//     // Check if all documents are verified
//     const allVerified = application.documentsSubmitted.every(doc => doc.verified);
//     if (allVerified) {
//       application.documents = 'verified';
//     }

//     await application.save();

//     res.status(200).json({
//       success: true,
//       message: `Document ${verified ? 'verified' : 'rejected'} successfully`,
//       data: document
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error verifying document',
//       error: error.message
//     });
//   }
// };

// // Add note to application
// exports.addNote = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { content, type } = req.body;

//     const application = await AdmissionBooking.findById(id);

//     if (!application) {
//       return res.status(404).json({
//         success: false,
//         message: 'Application not found'
//       });
//     }

//     await application.addNote(content, req.user.id, type);

//     res.status(200).json({
//       success: true,
//       message: 'Note added successfully',
//       data: application.notes[application.notes.length - 1]
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error adding note',
//       error: error.message
//     });
//   }
// };

// // Get enhanced statistics with timeline
// exports.getStatistics = async (req, res) => {
//   try {
//     // Get date filters from query params
//     const { 
//       startDate, 
//       endDate, 
//       interval = 'day', // day, week, month, year
//       groupBy = 'status' // status, country, university, programLevel, etc.
//     } = req.query;

//     // Base statistics
//     const statistics = await AdmissionBooking.getStatistics();
    
//     // Calculate date ranges
//     const today = new Date();
//     const startOfWeek = new Date(today);
//     startOfWeek.setDate(today.getDate() - today.getDay());
//     startOfWeek.setHours(0, 0, 0, 0);
    
//     const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
//     const startOfYear = new Date(today.getFullYear(), 0, 1);

//     // Time-based statistics
//     const [monthlyStats, yearlyStats, weeklyStats] = await Promise.all([
//       // Monthly stats
//       AdmissionBooking.aggregate([
//         {
//           $match: {
//             createdAt: { $gte: startOfMonth }
//           }
//         },
//         {
//           $group: {
//             _id: null,
//             monthlyApplications: { $sum: 1 },
//             monthlyAccepted: {
//               $sum: { $cond: [{ $eq: ['$status', 'accepted'] }, 1, 0] }
//             },
//             monthlyPending: {
//               $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
//             },
//             monthlyRevenue: { $sum: '$statistics.applicationScore' }
//           }
//         }
//       ]),

//       // Yearly stats
//       AdmissionBooking.aggregate([
//         {
//           $match: {
//             createdAt: { $gte: startOfYear }
//           }
//         },
//         {
//           $group: {
//             _id: null,
//             yearlyApplications: { $sum: 1 },
//             yearlyAccepted: {
//               $sum: { $cond: [{ $eq: ['$status', 'accepted'] }, 1, 0] }
//             },
//             yearlyRevenue: { $sum: '$statistics.applicationScore' }
//           }
//         }
//       ]),

//       // Weekly stats
//       AdmissionBooking.aggregate([
//         {
//           $match: {
//             createdAt: { $gte: startOfWeek }
//           }
//         },
//         {
//           $group: {
//             _id: null,
//             weeklyApplications: { $sum: 1 },
//             weeklyAccepted: {
//               $sum: { $cond: [{ $eq: ['$status', 'accepted'] }, 1, 0] }
//             }
//           }
//         }
//       ])
//     ]);

//     // Timeline statistics - applications over time
//     let dateFormat;
//     switch(interval) {
//       case 'hour':
//         dateFormat = { 
//           year: { $year: '$createdAt' },
//           month: { $month: '$createdAt' },
//           day: { $dayOfMonth: '$createdAt' },
//           hour: { $hour: '$createdAt' }
//         };
//         break;
//       case 'week':
//         dateFormat = { 
//           year: { $year: '$createdAt' },
//           week: { $week: '$createdAt' }
//         };
//         break;
//       case 'month':
//         dateFormat = { 
//           year: { $year: '$createdAt' },
//           month: { $month: '$createdAt' }
//         };
//         break;
//       case 'year':
//         dateFormat = { year: { $year: '$createdAt' } };
//         break;
//       default: // day
//         dateFormat = { 
//           year: { $year: '$createdAt' },
//           month: { $month: '$createdAt' },
//           day: { $dayOfMonth: '$createdAt' }
//         };
//     }

//     // Build match stage for timeline
//     let matchStage = {};
//     if (startDate || endDate) {
//       matchStage.createdAt = {};
//       if (startDate) matchStage.createdAt.$gte = new Date(startDate);
//       if (endDate) matchStage.createdAt.$lte = new Date(endDate);
//     }

//     // Timeline aggregation
//     const timelineStats = await AdmissionBooking.aggregate([
//       { $match: matchStage },
//       {
//         $group: {
//           _id: dateFormat,
//           count: { $sum: 1 },
//           accepted: {
//             $sum: { $cond: [{ $eq: ['$status', 'accepted'] }, 1, 0] }
//           },
//           pending: {
//             $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
//           },
//           rejected: {
//             $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0] }
//           },
//           avgScore: { $avg: '$statistics.applicationScore' },
//           totalRevenue: { $sum: '$statistics.applicationScore' }
//         }
//       },
//       {
//         $addFields: {
//           acceptanceRate: {
//             $cond: [
//               { $gt: ['$count', 0] },
//               { $multiply: [{ $divide: ['$accepted', '$count'] }, 100] },
//               0
//             ]
//           }
//         }
//       },
//       { $sort: { '_id': 1 } }
//     ]);

//     // Group by different categories
//     let groupByField;
//     switch(groupBy) {
//       case 'country':
//         groupByField = '$targetCountry';
//         break;
//       case 'university':
//         groupByField = '$targetUniversity';
//         break;
//       case 'programLevel':
//         groupByField = '$programLevel';
//         break;
//       case 'intakeSeason':
//         groupByField = '$intakeSeason';
//         break;
//       default:
//         groupByField = '$status';
//     }

//     const groupedStats = await AdmissionBooking.aggregate([
//       { $match: matchStage },
//       {
//         $group: {
//           _id: groupByField,
//           count: { $sum: 1 },
//           accepted: {
//             $sum: { $cond: [{ $eq: ['$status', 'accepted'] }, 1, 0] }
//           },
//           avgScore: { $avg: '$statistics.applicationScore' },
//           avgProcessingTime: { $avg: '$statistics.processingTime' }
//         }
//       },
//       {
//         $addFields: {
//           acceptanceRate: {
//             $cond: [
//               { $gt: ['$count', 0] },
//               { $multiply: [{ $divide: ['$accepted', '$count'] }, 100] },
//               0
//             ]
//           }
//         }
//       },
//       { $sort: { count: -1 } }
//     ]);

//     // Get counselor performance
//     const counselorStats = await AdmissionBooking.aggregate([
//       {
//         $match: {
//           assignedCounselor: { $ne: null },
//           status: { $in: ['accepted', 'rejected', 'waitlisted'] }
//         }
//       },
//       {
//         $group: {
//           _id: '$assignedCounselor',
//           total: { $sum: 1 },
//           accepted: {
//             $sum: { $cond: [{ $eq: ['$status', 'accepted'] }, 1, 0] }
//           },
//           avgApplicationScore: { $avg: '$statistics.applicationScore' },
//           avgProcessingTime: { $avg: '$statistics.processingTime' }
//         }
//       },
//       {
//         $addFields: {
//           acceptanceRate: { 
//             $cond: [
//               { $gt: ['$total', 0] },
//               { $multiply: [{ $divide: ['$accepted', '$total'] }, 100] },
//               0
//             ]
//           },
//           efficiencyScore: {
//             $cond: [
//               { $gt: ['$avgProcessingTime', 0] },
//               { $divide: ['$accepted', '$avgProcessingTime'] },
//               0
//             ]
//           }
//         }
//       },
//       { $sort: { acceptanceRate: -1 } }
//     ]);

//     // Get conversion funnel
//     const conversionFunnel = await AdmissionBooking.aggregate([
//       {
//         $group: {
//           _id: null,
//           totalApplications: { $sum: 1 },
//           submitted: {
//             $sum: { $cond: [{ $eq: ['$status', 'submitted'] }, 1, 0] }
//           },
//           underReview: {
//             $sum: { $cond: [{ $eq: ['$status', 'under_review'] }, 1, 0] }
//           },
//           interview: {
//             $sum: { $cond: [{ $eq: ['$status', 'interview'] }, 1, 0] }
//           },
//           accepted: {
//             $sum: { $cond: [{ $eq: ['$status', 'accepted'] }, 1, 0] }
//           },
//           enrolled: {
//             $sum: { $cond: [{ $eq: ['$status', 'enrolled'] }, 1, 0] }
//           }
//         }
//       }
//     ]);

//     // Performance metrics over time (last 30 days)
//     const last30Days = new Date();
//     last30Days.setDate(last30Days.getDate() - 30);

//     const performanceMetrics = await AdmissionBooking.aggregate([
//       {
//         $match: {
//           createdAt: { $gte: last30Days }
//         }
//       },
//       {
//         $group: {
//           _id: {
//             year: { $year: '$createdAt' },
//             month: { $month: '$createdAt' },
//             day: { $dayOfMonth: '$createdAt' }
//           },
//           applications: { $sum: 1 },
//           accepted: {
//             $sum: { $cond: [{ $eq: ['$status', 'accepted'] }, 1, 0] }
//           },
//           avgScore: { $avg: '$statistics.applicationScore' },
//           avgResponseTime: { $avg: '$statistics.processingTime' }
//         }
//       },
//       {
//         $addFields: {
//           acceptanceRate: {
//             $cond: [
//               { $gt: ['$applications', 0] },
//               { $multiply: [{ $divide: ['$accepted', '$applications'] }, 100] },
//               0
//             ]
//           },
//           date: {
//             $dateFromParts: {
//               year: '$_id.year',
//               month: '$_id.month',
//               day: '$_id.day'
//             }
//           }
//         }
//       },
//       { $sort: { '_id': 1 } }
//     ]);

//     res.status(200).json({
//       success: true,
//       data: {
//         ...statistics,
//         timeframeStats: {
//           weekly: weeklyStats[0] || { weeklyApplications: 0, weeklyAccepted: 0 },
//           monthly: monthlyStats[0] || { monthlyApplications: 0, monthlyAccepted: 0, monthlyPending: 0, monthlyRevenue: 0 },
//           yearly: yearlyStats[0] || { yearlyApplications: 0, yearlyAccepted: 0, yearlyRevenue: 0 }
//         },
//         timelineStats: {
//           interval,
//           data: timelineStats,
//           timeRange: {
//             startDate: startDate || 'all',
//             endDate: endDate || 'now'
//           }
//         },
//         groupedStats: {
//           by: groupBy,
//           data: groupedStats
//         },
//         counselorStats,
//         conversionFunnel: conversionFunnel[0] || {
//           totalApplications: 0,
//           submitted: 0,
//           underReview: 0,
//           interview: 0,
//           accepted: 0,
//           enrolled: 0
//         },
//         performanceMetrics,
//         calculatedAt: new Date()
//       }
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching statistics',
//       error: error.message
//     });
//   }
// };

// // Get admission rates
// exports.getAdmissionRates = async (req, res) => {
//   try {
//     const admissionRates = await AdmissionBooking.getAdmissionRates();

//     res.status(200).json({
//       success: true,
//       data: admissionRates
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching admission rates',
//       error: error.message
//     });
//   }
// };

// // Get timeline statistics for dashboard
// exports.getTimelineStatistics = async (req, res) => {
//   try {
//     const { 
//       timeframe = '30d', // 7d, 30d, 90d, 1y, all
//       type = 'applications' // applications, conversions, revenue
//     } = req.query;

//     let startDate;
//     const endDate = new Date();

//     switch(timeframe) {
//       case '7d':
//         startDate = new Date();
//         startDate.setDate(startDate.getDate() - 7);
//         break;
//       case '30d':
//         startDate = new Date();
//         startDate.setDate(startDate.getDate() - 30);
//         break;
//       case '90d':
//         startDate = new Date();
//         startDate.setDate(startDate.getDate() - 90);
//         break;
//       case '1y':
//         startDate = new Date();
//         startDate.setFullYear(startDate.getFullYear() - 1);
//         break;
//       default:
//         startDate = null;
//     }

//     const matchStage = startDate ? { createdAt: { $gte: startDate, $lte: endDate } } : {};

//     let pipeline = [];
    
//     if (type === 'conversions') {
//       // Conversion rate over time
//       pipeline = [
//         { $match: matchStage },
//         {
//           $group: {
//             _id: {
//               year: { $year: '$createdAt' },
//               month: { $month: '$createdAt' },
//               day: { $dayOfMonth: '$createdAt' }
//             },
//             total: { $sum: 1 },
//             converted: {
//               $sum: {
//                 $cond: [
//                   { $in: ['$status', ['accepted', 'enrolled']] },
//                   1,
//                   0
//                 ]
//               }
//             }
//           }
//         },
//         {
//           $addFields: {
//             conversionRate: {
//               $cond: [
//                 { $gt: ['$total', 0] },
//                 { $multiply: [{ $divide: ['$converted', '$total'] }, 100] },
//                 0
//               ]
//             },
//             date: {
//               $dateFromParts: {
//                 year: '$_id.year',
//                 month: '$_id.month',
//                 day: '$_id.day'
//               }
//             }
//           }
//         },
//         { $sort: { '_id': 1 } },
//         { $project: { _id: 0, date: 1, conversionRate: 1, total: 1, converted: 1 } }
//       ];
//     } else if (type === 'revenue') {
//       // Revenue over time (using applicationScore as proxy for revenue)
//       pipeline = [
//         { $match: matchStage },
//         {
//           $group: {
//             _id: {
//               year: { $year: '$createdAt' },
//               month: { $month: '$createdAt' },
//               day: { $dayOfMonth: '$createdAt' }
//             },
//             totalRevenue: { $sum: '$statistics.applicationScore' },
//             count: { $sum: 1 },
//             avgRevenue: { $avg: '$statistics.applicationScore' }
//           }
//         },
//         {
//           $addFields: {
//             date: {
//               $dateFromParts: {
//                 year: '$_id.year',
//                 month: '$_id.month',
//                 day: '$_id.day'
//               }
//             }
//           }
//         },
//         { $sort: { '_id': 1 } },
//         { $project: { _id: 0, date: 1, totalRevenue: 1, count: 1, avgRevenue: 1 } }
//       ];
//     } else {
//       // Applications over time (default)
//       pipeline = [
//         { $match: matchStage },
//         {
//           $group: {
//             _id: {
//               year: { $year: '$createdAt' },
//               month: { $month: '$createdAt' },
//               day: { $dayOfMonth: '$createdAt' }
//             },
//             applications: { $sum: 1 },
//             accepted: {
//               $sum: { $cond: [{ $eq: ['$status', 'accepted'] }, 1, 0] }
//             },
//             pending: {
//               $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
//             }
//           }
//         },
//         {
//           $addFields: {
//             date: {
//               $dateFromParts: {
//                 year: '$_id.year',
//                 month: '$_id.month',
//                 day: '$_id.day'
//               }
//             }
//           }
//         },
//         { $sort: { '_id': 1 } },
//         { $project: { _id: 0, date: 1, applications: 1, accepted: 1, pending: 1 } }
//       ];
//     }

//     const timelineData = await AdmissionBooking.aggregate(pipeline);

//     // Calculate summary
//     let summary = {};
//     if (timelineData.length > 0) {
//       if (type === 'conversions') {
//         const total = timelineData.reduce((sum, day) => sum + day.total, 0);
//         const converted = timelineData.reduce((sum, day) => sum + day.converted, 0);
//         summary = {
//           total,
//           converted,
//           overallConversionRate: total > 0 ? (converted / total) * 100 : 0
//         };
//       } else if (type === 'revenue') {
//         const totalRevenue = timelineData.reduce((sum, day) => sum + day.totalRevenue, 0);
//         const totalCount = timelineData.reduce((sum, day) => sum + day.count, 0);
//         summary = {
//           totalRevenue,
//           totalCount,
//           averageRevenue: totalCount > 0 ? totalRevenue / totalCount : 0
//         };
//       } else {
//         const totalApplications = timelineData.reduce((sum, day) => sum + day.applications, 0);
//         const totalAccepted = timelineData.reduce((sum, day) => sum + day.accepted, 0);
//         summary = {
//           totalApplications,
//           totalAccepted,
//           acceptanceRate: totalApplications > 0 ? (totalAccepted / totalApplications) * 100 : 0
//         };
//       }
//     }

//     res.status(200).json({
//       success: true,
//       data: {
//         timeframe,
//         type,
//         timeline: timelineData,
//         summary,
//         dateRange: {
//           start: startDate,
//           end: endDate
//         }
//       }
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching timeline statistics',
//       error: error.message
//     });
//   }
// };

// // Send email
// exports.sendEmail = async (req, res) => {
//   try {
//     const { applicationId, emailType, subject, message, attachments } = req.body;

//     const application = await AdmissionBooking.findById(applicationId);

//     if (!application) {
//       return res.status(404).json({
//         success: false,
//         message: 'Application not found'
//       });
//     }

//     let emailResult;

//     switch (emailType) {
//       case 'welcome':
//         emailResult = await emailService.sendWelcomeEmail(application);
//         break;
//       case 'document_request':
//         emailResult = await emailService.sendDocumentRequestEmail(application, subject, message);
//         break;
//       case 'interview_invitation':
//         emailResult = await emailService.sendInterviewInvitation(application, subject, message);
//         break;
//       case 'decision':
//         emailResult = await emailService.sendDecisionEmail(application, subject, message);
//         break;
//       case 'custom':
//         emailResult = await emailService.sendCustomEmail(application, subject, message, attachments);
//         break;
//       default:
//         return res.status(400).json({
//           success: false,
//           message: 'Invalid email type'
//         });
//     }

//     // Update email statistics
//     application.statistics.totalEmailsSent += 1;
//     await application.save();

//     // Add timeline event
//     await application.addTimelineEvent(
//       'email_sent',
//       `${emailType} email sent to applicant`,
//       req.user.id
//     );

//     res.status(200).json({
//       success: true,
//       message: 'Email sent successfully',
//       data: {
//         emailResult,
//         totalEmailsSent: application.statistics.totalEmailsSent
//       }
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error sending email',
//       error: error.message
//     });
//   }
// };

// // Bulk update applications
// exports.bulkUpdate = async (req, res) => {
//   try {
//     const { ids, updates } = req.body;

//     if (!ids || !Array.isArray(ids) || ids.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid IDs array'
//       });
//     }

//     const result = await AdmissionBooking.updateMany(
//       { _id: { $in: ids } },
//       updates,
//       { runValidators: true }
//     );

//     // Add timeline events for each updated application
//     for (const id of ids) {
//       const application = await AdmissionBooking.findById(id);
//       if (application) {
//         await application.addTimelineEvent(
//           'bulk_update',
//           `Application updated in bulk operation: ${JSON.stringify(updates)}`,
//           req.user.id
//         );
//       }
//     }

//     res.status(200).json({
//       success: true,
//       message: 'Bulk update completed',
//       data: {
//         matched: result.matchedCount,
//         modified: result.modifiedCount
//       }
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error in bulk update',
//       error: error.message
//     });
//   }
// };

// // Export applications to Excel
// exports.exportApplications = async (req, res) => {
//   try {
//     const { format = 'excel', filters = {} } = req.query;

//     const applications = await AdmissionBooking.find(filters)
//       .select('-documentsSubmitted -notes -timeline -metadata')
//       .populate('assignedCounselor', 'firstName lastName email')
//       .exec();

//     let exportData;
    
//     if (format === 'excel') {
//       exportData = await documentService.exportToExcel(applications);
//       res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
//       res.setHeader('Content-Disposition', `attachment; filename=applications_${Date.now()}.xlsx`);
//     } else if (format === 'csv') {
//       exportData = await documentService.exportToCSV(applications);
//       res.setHeader('Content-Type', 'text/csv');
//       res.setHeader('Content-Disposition', `attachment; filename=applications_${Date.now()}.csv`);
//     } else if (format === 'pdf') {
//       exportData = await documentService.exportToPDF(applications);
//       res.setHeader('Content-Type', 'application/pdf');
//       res.setHeader('Content-Disposition', `attachment; filename=applications_${Date.now()}.pdf`);
//     } else {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid export format'
//       });
//     }

//     res.send(exportData);
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error exporting applications',
//       error: error.message
//     });
//   }
// };

// // Search applications with advanced filters
// exports.searchApplications = async (req, res) => {
//   try {
//     const { query, field } = req.query;

//     if (!query) {
//       return res.status(400).json({
//         success: false,
//         message: 'Search query is required'
//       });
//     }

//     let searchQuery = {};
    
//     if (field) {
//       // Search in specific field
//       searchQuery[field] = { $regex: query, $options: 'i' };
//     } else {
//       // Search in multiple fields
//       searchQuery.$or = [
//         { applicationId: { $regex: query, $options: 'i' } },
//         { firstName: { $regex: query, $options: 'i' } },
//         { lastName: { $regex: query, $options: 'i' } },
//         { email: { $regex: query, $options: 'i' } },
//         { targetUniversity: { $regex: query, $options: 'i' } },
//         { targetProgram: { $regex: query, $options: 'i' } },
//         { 'notes.content': { $regex: query, $options: 'i' } }
//       ];
//     }

//     const applications = await AdmissionBooking.find(searchQuery)
//       .select('applicationId firstName lastName email status targetUniversity targetProgram createdAt')
//       .limit(50)
//       .exec();

//     res.status(200).json({
//       success: true,
//       data: applications,
//       count: applications.length
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error searching applications',
//       error: error.message
//     });
//   }
// }



const AdmissionManagement = require('../models/AdmissionBooking');
const cloudinary = require('cloudinary').v2;
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Email Configuration
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

class AdmissionController {
  
  // ====================
  // VALIDATION HELPERS
  // ====================
  
  validateBooking(data) {
    const errors = [];
    
    if (!data.visitor?.firstName) errors.push('First name is required');
    if (!data.visitor?.lastName) errors.push('Last name is required');
    if (!data.visitor?.email) errors.push('Email is required');
    if (!data.visitor?.phone) errors.push('Phone number is required');
    if (!data.details?.bookingDate) errors.push('Booking date is required');
    if (!data.details?.bookingTime) errors.push('Booking time is required');
    if (!data.details?.bookingType) errors.push('Booking type is required');
    
    // Email validation
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (data.visitor?.email && !emailRegex.test(data.visitor.email)) {
      errors.push('Invalid email format');
    }
    
    return errors;
  }
  
  validateUniversity(data) {
    const errors = [];
    
    if (!data.basic?.universityName) errors.push('University name is required');
    if (!data.basic?.universityCode) errors.push('University code is required');
    if (!data.location?.country) errors.push('Country is required');
    if (!data.location?.city) errors.push('City is required');
    if (!data.contact?.contactEmail) errors.push('Contact email is required');
    if (!data.contact?.contactPhone) errors.push('Contact phone is required');
    
    // Email validation
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (data.contact?.contactEmail && !emailRegex.test(data.contact.contactEmail)) {
      errors.push('Invalid contact email format');
    }
    

    
    return errors;
  }
  
  validateApplication(data) {
    const errors = [];
    
    // Applicant validation
    if (!data.applicant?.firstName) errors.push('First name is required');
    if (!data.applicant?.lastName) errors.push('Last name is required');
    if (!data.applicant?.email) errors.push('Email is required');
    if (!data.applicant?.phone) errors.push('Phone number is required');
    if (!data.applicant?.nationality) errors.push('Nationality is required');
    if (!data.applicant?.dateOfBirth) errors.push('Date of birth is required');
    
    // Academic validation
    if (!data.academic?.currentEducation) errors.push('Current education is required');
    if (!data.academic?.currentInstitution) errors.push('Current institution is required');
    if (!data.academic?.graduationYear) errors.push('Graduation year is required');
    if (!data.academic?.gpa && data.academic?.gpa !== 0) errors.push('GPA is required');
    
    // Target validation
    if (!data.target?.universityName) errors.push('University name is required');
    if (!data.target?.country) errors.push('Country is required');
    if (!data.target?.program) errors.push('Program is required');
    if (!data.target?.programLevel) errors.push('Program level is required');
    if (!data.target?.intakeSeason) errors.push('Intake season is required');
    if (!data.target?.intakeYear) errors.push('Intake year is required');
    
    // Email validation
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (data.applicant?.email && !emailRegex.test(data.applicant.email)) {
      errors.push('Invalid email format');
    }
    
    // GPA validation
    if (data.academic?.gpa && (data.academic.gpa < 0 || data.academic.gpa > 4.0)) {
      errors.push('GPA must be between 0 and 4.0');
    }
    
    // Intake year validation
    if (data.target?.intakeYear) {
      const currentYear = new Date().getFullYear();
      if (data.target.intakeYear < currentYear || data.target.intakeYear > currentYear + 5) {
        errors.push(`Intake year must be between ${currentYear} and ${currentYear + 5}`);
      }
    }
    
    return errors;
  }
  
  // ====================
  // EMAIL SERVICE
  // ====================
  
  async sendEmail(to, subject, template, data = {}) {
    try {
      let html = '';
      
      // Template selection
      switch(template) {
        case 'booking_confirmation':
          html = this.generateBookingConfirmationEmail(data);
          break;
        case 'booking_reminder':
          html = this.generateBookingReminderEmail(data);
          break;
        case 'application_submission':
          html = this.generateApplicationSubmissionEmail(data);
          break;
        case 'application_status_update':
          html = this.generateApplicationStatusUpdateEmail(data);
          break;
        case 'university_created':
          html = this.generateUniversityCreatedEmail(data);
          break;
        default:
          html = `<p>${data.message || 'No content'}</p>`;
      }
      
      const mailOptions = {
        from: `"Admission Management System" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
        to: Array.isArray(to) ? to.join(', ') : to,
        subject,
        html,
        attachments: data.attachments || []
      };
      
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent:', info.messageId);
      
      return {
        success: true,
        messageId: info.messageId,
        response: info.response
      };
    } catch (error) {
      console.error('Email sending error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  generateBookingConfirmationEmail(data) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #4F46E5; color: white; padding: 20px; text-align: center; }
          .content { background: #f9f9f9; padding: 20px; border-radius: 5px; }
          .details { margin: 20px 0; }
          .detail-row { margin: 10px 0; }
          .label { font-weight: bold; color: #555; }
          .footer { text-align: center; margin-top: 20px; color: #777; font-size: 12px; }
          .button { 
            display: inline-block; 
            padding: 12px 24px; 
            background: #4F46E5; 
            color: white; 
            text-decoration: none; 
            border-radius: 5px; 
            margin: 10px 0; 
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Booking Confirmation</h1>
          </div>
          <div class="content">
            <p>Dear ${data.visitor?.firstName || 'Guest'},</p>
            <p>Your booking has been confirmed. Here are the details:</p>
            
            <div class="details">
              <div class="detail-row">
                <span class="label">Booking ID:</span> ${data.bookingId || 'N/A'}
              </div>
              <div class="detail-row">
                <span class="label">Date:</span> ${data.date || 'N/A'}
              </div>
              <div class="detail-row">
                <span class="label">Time:</span> ${data.time || 'N/A'}
              </div>
              <div class="detail-row">
                <span class="label">Type:</span> ${data.type || 'N/A'}
              </div>
              <div class="detail-row">
                <span class="label">Duration:</span> ${data.duration || 'N/A'}
              </div>
              ${data.meetingLink ? `
              <div class="detail-row">
                <span class="label">Meeting Link:</span> 
                <a href="${data.meetingLink}" class="button">Join Meeting</a>
              </div>
              ` : ''}
            </div>
            
            <p>Please arrive 15 minutes before your scheduled time.</p>
            <p>If you need to reschedule or cancel, please contact us at least 24 hours in advance.</p>
            
            <p>Best regards,<br>Admission Team</p>
          </div>
          <div class="footer">
            <p>This is an automated email. Please do not reply to this message.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
  
  generateApplicationSubmissionEmail(data) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #10B981; color: white; padding: 20px; text-align: center; }
          .content { background: #f9f9f9; padding: 20px; border-radius: 5px; }
          .details { margin: 20px 0; }
          .detail-row { margin: 10px 0; }
          .label { font-weight: bold; color: #555; }
          .status-badge { 
            display: inline-block; 
            padding: 5px 10px; 
            background: #10B981; 
            color: white; 
            border-radius: 20px; 
            font-size: 12px; 
          }
          .footer { text-align: center; margin-top: 20px; color: #777; font-size: 12px; }
          .button { 
            display: inline-block; 
            padding: 12px 24px; 
            background: #10B981; 
            color: white; 
            text-decoration: none; 
            border-radius: 5px; 
            margin: 10px 0; 
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Application Submitted Successfully</h1>
          </div>
          <div class="content">
            <p>Dear ${data.applicant?.firstName || 'Applicant'},</p>
            <p>Your application has been submitted successfully. Here are the details:</p>
            
            <div class="details">
              <div class="detail-row">
                <span class="label">Application ID:</span> ${data.applicationId || 'N/A'}
              </div>
              <div class="detail-row">
                <span class="label">Status:</span> 
                <span class="status-badge">${data.status || 'Submitted'}</span>
              </div>
              <div class="detail-row">
                <span class="label">University:</span> ${data.university || 'N/A'}
              </div>
              <div class="detail-row">
                <span class="label">Program:</span> ${data.program || 'N/A'}
              </div>
              <div class="detail-row">
                <span class="label">Intake:</span> ${data.intake || 'N/A'}
              </div>
            </div>
            
            <p><strong>Next Steps:</strong></p>
            <ol>
              <li>Complete document uploads (if any pending)</li>
              <li>Monitor your application status in the portal</li>
              <li>Prepare for potential interviews</li>
              <li>Check your email regularly for updates</li>
            </ol>
            
            <p>You can track your application status by logging into your account.</p>
            
            <p>Best regards,<br>Admission Team</p>
          </div>
          <div class="footer">
            <p>This is an automated email. Please do not reply to this message.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
  
  generateApplicationStatusUpdateEmail(data) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { 
            background: ${data.status === 'accepted' ? '#10B981' : data.status === 'rejected' ? '#EF4444' : '#F59E0B'}; 
            color: white; 
            padding: 20px; 
            text-align: center; 
          }
          .content { background: #f9f9f9; padding: 20px; border-radius: 5px; }
          .details { margin: 20px 0; }
          .detail-row { margin: 10px 0; }
          .label { font-weight: bold; color: #555; }
          .status-badge { 
            display: inline-block; 
            padding: 5px 10px; 
            background: ${data.status === 'accepted' ? '#10B981' : data.status === 'rejected' ? '#EF4444' : '#F59E0B'}; 
            color: white; 
            border-radius: 20px; 
            font-size: 12px; 
          }
          .footer { text-align: center; margin-top: 20px; color: #777; font-size: 12px; }
          .button { 
            display: inline-block; 
            padding: 12px 24px; 
            background: #4F46E5; 
            color: white; 
            text-decoration: none; 
            border-radius: 5px; 
            margin: 10px 0; 
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Application Status Update</h1>
          </div>
          <div class="content">
            <p>Dear ${data.applicant?.firstName || 'Applicant'},</p>
            
            ${data.status === 'accepted' ? `
            <p><strong>Congratulations! Your application has been accepted!</strong></p>
            <p>We are pleased to inform you that your application has been accepted for admission.</p>
            ` : data.status === 'rejected' ? `
            <p>We regret to inform you that your application has not been successful at this time.</p>
            <p>We encourage you to apply again in the future or consider other programs.</p>
            ` : `
            <p>Your application status has been updated.</p>
            `}
            
            <div class="details">
              <div class="detail-row">
                <span class="label">Application ID:</span> ${data.applicationId || 'N/A'}
              </div>
              <div class="detail-row">
                <span class="label">New Status:</span> 
                <span class="status-badge">${data.status || 'Updated'}</span>
              </div>
              <div class="detail-row">
                <span class="label">University:</span> ${data.university || 'N/A'}
              </div>
              <div class="detail-row">
                <span class="label">Program:</span> ${data.program || 'N/A'}
              </div>
            </div>
            
            ${data.nextSteps ? `
            <p><strong>Next Steps:</strong></p>
            <p>${data.nextSteps}</p>
            ` : ''}
            
            ${data.deadline ? `
            <p><strong>Deadline for next steps:</strong> ${data.deadline}</p>
            ` : ''}
            
            ${data.contactInfo ? `
            <p><strong>For questions, contact:</strong> ${data.contactInfo}</p>
            ` : ''}
            
            <p>Best regards,<br>Admission Team</p>
          </div>
          <div class="footer">
            <p>This is an automated email. Please do not reply to this message.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
  
  generateUniversityCreatedEmail(data) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #8B5CF6; color: white; padding: 20px; text-align: center; }
          .content { background: #f9f9f9; padding: 20px; border-radius: 5px; }
          .details { margin: 20px 0; }
          .detail-row { margin: 10px 0; }
          .label { font-weight: bold; color: #555; }
          .footer { text-align: center; margin-top: 20px; color: #777; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New University Added</h1>
          </div>
          <div class="content">
            <p>Dear Admin,</p>
            <p>A new university has been added to the admission management system:</p>
            
            <div class="details">
              <div class="detail-row">
                <span class="label">University Name:</span> ${data.universityName || 'N/A'}
              </div>
              <div class="detail-row">
                <span class="label">University Code:</span> ${data.universityCode || 'N/A'}
              </div>
              <div class="detail-row">
                <span class="label">Location:</span> ${data.location || 'N/A'}
              </div>
              <div class="detail-row">
                <span class="label">Contact Person:</span> ${data.contactPerson || 'N/A'}
              </div>
              <div class="detail-row">
                <span class="label">Contact Email:</span> ${data.contactEmail || 'N/A'}
              </div>
              <div class="detail-row">
                <span class="label">Status:</span> ${data.status || 'Active'}
              </div>
            </div>
            
            <p>You can view and manage this university in the admin panel.</p>
            
            <p>Best regards,<br>Admission Management System</p>
          </div>
          <div class="footer">
            <p>This is an automated email. Please do not reply to this message.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
  
  generateBookingReminderEmail(data) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #F59E0B; color: white; padding: 20px; text-align: center; }
          .content { background: #f9f9f9; padding: 20px; border-radius: 5px; }
          .details { margin: 20px 0; }
          .detail-row { margin: 10px 0; }
          .label { font-weight: bold; color: #555; }
          .footer { text-align: center; margin-top: 20px; color: #777; font-size: 12px; }
          .button { 
            display: inline-block; 
            padding: 12px 24px; 
            background: #F59E0B; 
            color: white; 
            text-decoration: none; 
            border-radius: 5px; 
            margin: 10px 0; 
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Booking Reminder</h1>
          </div>
          <div class="content">
            <p>Dear ${data.visitor?.firstName || 'Guest'},</p>
            <p>This is a reminder for your upcoming booking:</p>
            
            <div class="details">
              <div class="detail-row">
                <span class="label">Booking ID:</span> ${data.bookingId || 'N/A'}
              </div>
              <div class="detail-row">
                <span class="label">Date:</span> ${data.date || 'N/A'}
              </div>
              <div class="detail-row">
                <span class="label">Time:</span> ${data.time || 'N/A'}
              </div>
              <div class="detail-row">
                <span class="label">Type:</span> ${data.type || 'N/A'}
              </div>
              ${data.meetingLink ? `
              <div class="detail-row">
                <span class="label">Meeting Link:</span> 
                <a href="${data.meetingLink}" class="button">Join Meeting</a>
              </div>
              ` : ''}
              ${data.location ? `
              <div class="detail-row">
                <span class="label">Location:</span> ${data.location}
              </div>
              ` : ''}
            </div>
            
            <p><strong>Important Notes:</strong></p>
            <ul>
              <li>Please arrive 15 minutes before your scheduled time</li>
              <li>Bring any required documents or identification</li>
              <li>If you need to reschedule or cancel, please do so at least 2 hours in advance</li>
            </ul>
            
            <p>We look forward to seeing you!</p>
            
            <p>Best regards,<br>Admission Team</p>
          </div>
          <div class="footer">
            <p>This is an automated email. Please do not reply to this message.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
  
  // ====================
  // CLOUDINARY SERVICE
  // ====================
  
  async uploadToCloudinary(file, folder = 'admissions') {
    try {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: `${folder}/${Date.now()}`,
        resource_type: 'auto',
        transformation: [
          { quality: 'auto:good' },
          { fetch_format: 'auto' }
        ]
      });
      
      // Delete the temporary file
      fs.unlinkSync(file.path);
      
      return {
        success: true,
        url: result.secure_url,
        publicId: result.public_id,
        format: result.format,
        size: result.bytes,
        width: result.width,
        height: result.height
      };
    } catch (error) {
      // Delete the temporary file if it exists
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
      
      console.error('Cloudinary upload error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  async uploadMultipleToCloudinary(files, folder = 'admissions') {
    const uploads = files.map(file => this.uploadToCloudinary(file, folder));
    const results = await Promise.all(uploads);
    
    return {
      success: results.every(r => r.success),
      results: results.map(r => ({
        success: r.success,
        url: r.url,
        publicId: r.publicId,
        error: r.error
      }))
    };
  }
  
  async deleteFromCloudinary(publicId) {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return {
        success: result.result === 'ok',
        result: result.result
      };
    } catch (error) {
      console.error('Cloudinary delete error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  async uploadUniversityLogo(file, universityId) {
    return this.uploadToCloudinary(file, `universities/${universityId}/logo`);
  }
  
  async uploadUniversityImages(files, universityId) {
    return this.uploadMultipleToCloudinary(files, `universities/${universityId}/images`);
  }
  
  async uploadApplicationDocument(file, applicationId, documentType) {
    return this.uploadToCloudinary(file, `applications/${applicationId}/${documentType}`);
  }
  
  // ====================
  // STATISTICS SERVICE
  // ====================
  
  async getStatisticsService(recordType, filters = {}) {
    try {
      const stats = await AdmissionManagement.getStatistics(recordType, filters);
      return {
        success: true,
        data: stats[0] || {},
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Statistics error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  async getDashboardStatsService() {
    try {
      const stats = await AdmissionManagement.getDashboardStats();
      return {
        success: true,
        data: stats,
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Dashboard stats error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  async getApplicationAnalytics(startDate, endDate) {
    try {
      const matchStage = {
        recordType: 'application',
        isActive: true,
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      };
      
      const analytics = await AdmissionManagement.aggregate([
        { $match: matchStage },
        {
          $facet: {
            dailyCounts: [
              {
                $group: {
                  _id: {
                    year: { $year: '$createdAt' },
                    month: { $month: '$createdAt' },
                    day: { $dayOfMonth: '$createdAt' }
                  },
                  count: { $sum: 1 },
                  accepted: {
                    $sum: { $cond: [{ $in: ['$application.status', ['accepted', 'conditionally_accepted']] }, 1, 0] }
                  }
                }
              },
              { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
            ],
            sourceAnalysis: [
              {
                $group: {
                  _id: '$application.metadata.source',
                  count: { $sum: 1 },
                  acceptanceRate: {
                    $avg: {
                      $cond: [
                        { $in: ['$application.status', ['accepted', 'conditionally_accepted']] },
                        100,
                        0
                      ]
                    }
                  }
                }
              }
            ],
            countryAnalysis: [
              {
                $group: {
                  _id: '$application.applicant.nationality',
                  count: { $sum: 1 },
                  accepted: {
                    $sum: { $cond: [{ $in: ['$application.status', ['accepted', 'conditionally_accepted']] }, 1, 0] }
                  }
                }
              },
              { $sort: { count: -1 } },
              { $limit: 15 }
            ],
            programAnalysis: [
              {
                $group: {
                  _id: '$application.target.program',
                  count: { $sum: 1 },
                  accepted: {
                    $sum: { $cond: [{ $in: ['$application.status', ['accepted', 'conditionally_accepted']] }, 1, 0] }
                  },
                  avgScore: { $avg: '$application.statistics.applicationScore' }
                }
              },
              { $sort: { count: -1 } },
              { $limit: 10 }
            ]
          }
        }
      ]);
      
      return {
        success: true,
        data: analytics[0] || {},
        period: { startDate, endDate }
      };
    } catch (error) {
      console.error('Analytics error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  async getBookingAnalytics(startDate, endDate) {
    try {
      const matchStage = {
        recordType: 'booking',
        isActive: true,
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      };
      
      const analytics = await AdmissionManagement.aggregate([
        { $match: matchStage },
        {
          $facet: {
            typeAnalysis: [
              {
                $group: {
                  _id: '$booking.details.bookingType',
                  count: { $sum: 1 },
                  completed: {
                    $sum: { $cond: [{ $eq: ['$booking.status', 'completed'] }, 1, 0] }
                  },
                  cancelled: {
                    $sum: { $cond: [{ $eq: ['$booking.status', 'cancelled'] }, 1, 0] }
                  }
                }
              }
            ],
            statusAnalysis: [
              {
                $group: {
                  _id: '$booking.status',
                  count: { $sum: 1 },
                  avgGuests: { $avg: '$booking.details.numberOfGuests' }
                }
              }
            ],
            conversionAnalysis: [
              {
                $lookup: {
                  from: 'admissionmanagements',
                  let: { bookingEmail: '$booking.visitor.email' },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $and: [
                            { $eq: ['$recordType', 'application'] },
                            { $eq: ['$application.applicant.email', '$$bookingEmail'] }
                          ]
                        }
                      }
                    }
                  ],
                  as: 'applications'
                }
              },
              {
                $group: {
                  _id: '$booking.details.bookingType',
                  totalBookings: { $sum: 1 },
                  convertedToApplications: {
                    $sum: {
                      $cond: [{ $gt: [{ $size: '$applications' }, 0] }, 1, 0]
                    }
                  }
                }
              },
              {
                $addFields: {
                  conversionRate: {
                    $multiply: [{ $divide: ['$convertedToApplications', '$totalBookings'] }, 100]
                  }
                }
              }
            ]
          }
        }
      ]);
      
      return {
        success: true,
        data: analytics[0] || {},
        period: { startDate, endDate }
      };
    } catch (error) {
      console.error('Booking analytics error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  async getUniversityAnalytics() {
    try {
      const analytics = await AdmissionManagement.aggregate([
        { $match: { recordType: 'university', isActive: true } },
        {
          $facet: {
            countryDistribution: [
              {
                $group: {
                  _id: '$university.location.country',
                  count: { $sum: 1 },
                  active: {
                    $sum: { $cond: [{ $eq: ['$university.statusInfo.status', 'active'] }, 1, 0] }
                  },
                  avgSuccessRate: { $avg: '$university.statistics.successRate' },
                  totalPrograms: { $sum: { $size: '$university.programs' } }
                }
              },
              { $sort: { count: -1 } }
            ],
            partnershipAnalysis: [
              {
                $group: {
                  _id: '$university.partnership.partnershipType',
                  count: { $sum: 1 },
                  active: {
                    $sum: { $cond: [{ $eq: ['$university.statusInfo.status', 'active'] }, 1, 0] }
                  },
                  avgCommission: { $avg: '$university.partnership.commissionRate' }
                }
              }
            ],
            programAnalysis: [
              { $unwind: '$university.programs' },
              {
                $group: {
                  _id: {
                    level: '$university.programs.level',
                    country: '$university.location.country'
                  },
                  count: { $sum: 1 },
                  avgTuition: { $avg: '$university.programs.tuition.international' },
                  minTuition: { $min: '$university.programs.tuition.international' },
                  maxTuition: { $max: '$university.programs.tuition.international' }
                }
              },
              { $sort: { count: -1 } },
              { $limit: 20 }
            ],
            topUniversities: [
              {
                $match: {
                  'university.statistics.totalApplications': { $gt: 0 }
                }
              },
              {
                $project: {
                  universityName: '$university.basic.universityName',
                  country: '$university.location.country',
                  successRate: '$university.statistics.successRate',
                  totalApplications: '$university.statistics.totalApplications',
                  acceptedApplications: '$university.statistics.acceptedApplications',
                  programsCount: { $size: '$university.programs' }
                }
              },
              { $sort: { successRate: -1 } },
              { $limit: 10 }
            ]
          }
        }
      ]);
      
      return {
        success: true,
        data: analytics[0] || {}
      };
    } catch (error) {
      console.error('University analytics error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  // ====================
  // CONTROLLER METHODS
  // ====================
  
  // Create Booking
  async createBooking(req, res) {
    try {
      const { booking } = req.body;
      
      // Validation
      const errors = this.validateBooking(booking);
      if (errors.length > 0) {
        return res.status(400).json({
          success: false,
          errors
        });
      }
      
      // Create booking
      const admission = new AdmissionManagement({
        recordType: 'booking',
        booking
      });
      
      await admission.save();
      
      // Send confirmation email
      await this.sendEmail(
        booking.visitor.email,
        'Booking Confirmation',
        'booking_confirmation',
        {
          visitor: booking.visitor,
          bookingId: admission.recordId,
          date: new Date(booking.details.bookingDate).toLocaleDateString(),
          time: booking.details.bookingTime,
          type: booking.details.bookingType,
          duration: booking.details.bookingDuration,
          meetingLink: booking.details.meetingLink,
          location: booking.details.location
        }
      );
      
      // Add to communication log
      admission.booking.communicationLog.push({
        type: 'email',
        content: 'Booking confirmation sent',
        recipient: booking.visitor.email,
        status: 'sent'
      });
      
      await admission.save();
      
      res.status(201).json({
        success: true,
        message: 'Booking created successfully',
        data: admission,
        emailSent: true
      });
    } catch (error) {
      console.error('Create booking error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create booking',
        error: error.message
      });
    }
  }
  
  // Create University
  async createUniversity(req, res) {
    try {
      const { university } = req.body;
      const files = req.files || {};
      
      // Validation
      const errors = this.validateUniversity(university);
      if (errors.length > 0) {
        return res.status(400).json({
          success: false,
          errors
        });
      }
      
      // Handle logo upload
      if (files.logo) {
        const uploadResult = await this.uploadUniversityLogo(files.logo[0]);
        if (uploadResult.success) {
          university.basic.universityLogo = uploadResult.url;
        }
      }
      
      // Handle images upload
      if (files.images) {
        const uploadResults = await this.uploadUniversityImages(files.images);
        if (uploadResults.success) {
          university.basic.universityImages = uploadResults.results
            .filter(r => r.success)
            .map(r => ({
              url: r.url,
              publicId: r.publicId
            }));
        }
      }
      
      // Create university
      const admission = new AdmissionManagement({
        recordType: 'university',
        university,
        createdBy: req.user?.id
      });
      
      await admission.save();
      
      // Send notification email to admin
      const adminEmails = process.env.ADMIN_EMAILS ? 
        process.env.ADMIN_EMAILS.split(',') : 
        [process.env.EMAIL_FROM || process.env.EMAIL_USER];
      
      await this.sendEmail(
        adminEmails,
        'New University Added',
        'university_created',
        {
          universityName: university.basic.universityName,
          universityCode: university.basic.universityCode,
          location: `${university.location.city}, ${university.location.country}`,
          contactPerson: university.contact.contactPerson,
          contactEmail: university.contact.contactEmail,
          status: university.statusInfo?.status || 'active'
        }
      );
      
      res.status(201).json({
        success: true,
        message: 'University created successfully',
        data: admission,
        emailSent: true
      });
    } catch (error) {
      console.error('Create university error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create university',
        error: error.message
      });
    }
  }
  
  // Create Application
  async createApplication(req, res) {
    try {
      const { application } = req.body;
      const files = req.files || {};
      
      // Validation
      const errors = this.validateApplication(application);
      if (errors.length > 0) {
        return res.status(400).json({
          success: false,
          errors
        });
      }
      
      // Handle document uploads
      if (files.documents) {
        const uploadPromises = files.documents.map(async (file, index) => {
          const uploadResult = await this.uploadApplicationDocument(
            file,
            `temp-${Date.now()}`,
            file.originalname.split('.')[0]
          );
          
          if (uploadResult.success) {
            return {
              name: file.originalname,
              type: file.mimetype,
              url: uploadResult.url,
              publicId: uploadResult.publicId,
              size: file.size,
              mimeType: file.mimetype
            };
          }
          return null;
        });
        
        const uploadedDocuments = (await Promise.all(uploadPromises)).filter(doc => doc !== null);
        
        if (!application.documents) {
          application.documents = {};
        }
        if (!application.documents.submitted) {
          application.documents.submitted = [];
        }
        
        application.documents.submitted.push(...uploadedDocuments);
        
        // Update documents status
        if (uploadedDocuments.length > 0) {
          application.documents.status = 'uploaded';
        }
      }
      
      // Create application
      const admission = new AdmissionManagement({
        recordType: 'application',
        application,
        createdBy: req.user?.id
      });
      
      await admission.save();
      
      // Send submission email
      await this.sendEmail(
        application.applicant.email,
        'Application Submitted Successfully',
        'application_submission',
        {
          applicant: application.applicant,
          applicationId: admission.recordId,
          status: application.status || 'submitted',
          university: application.target.universityName,
          program: application.target.program,
          intake: `${application.target.intakeSeason} ${application.target.intakeYear}`
        }
      );
      
      // Add to communication log
      admission.addCommunication(
        'email',
        'Application Submitted Successfully',
        'Your application has been submitted successfully.',
        'system',
        application.applicant.email,
        'sent',
        [],
        'application_submission'
      );
      
      await admission.save();
      
      res.status(201).json({
        success: true,
        message: 'Application created successfully',
        data: admission,
        emailSent: true
      });
    } catch (error) {
      console.error('Create application error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create application',
        error: error.message
      });
    }
  }
  
  // Get all records by type
  async getRecords(req, res) {
    try {
      const { recordType } = req.params;
      const { 
        page = 1, 
        limit = 10, 
        sortBy = 'createdAt', 
        sortOrder = 'desc',
        status,
        search,
        startDate,
        endDate 
      } = req.query;
      
      // Build query
      const query = { 
        recordType, 
        isActive: true 
      };
      
      // Add status filter
      if (status) {
        if (recordType === 'application') {
          query['application.status'] = status;
        } else if (recordType === 'booking') {
          query['booking.status'] = status;
        } else if (recordType === 'university') {
          query['university.statusInfo.status'] = status;
        }
      }
      
      // Add date range filter
      if (startDate || endDate) {
        query.createdAt = {};
        if (startDate) query.createdAt.$gte = new Date(startDate);
        if (endDate) query.createdAt.$lte = new Date(endDate);
      }
      
      // Add search filter
      if (search) {
        if (recordType === 'application') {
          query.$or = [
            { 'application.applicant.firstName': { $regex: search, $options: 'i' } },
            { 'application.applicant.lastName': { $regex: search, $options: 'i' } },
            { 'application.applicant.email': { $regex: search, $options: 'i' } },
            { 'application.target.universityName': { $regex: search, $options: 'i' } },
            { 'application.target.program': { $regex: search, $options: 'i' } }
          ];
        } else if (recordType === 'booking') {
          query.$or = [
            { 'booking.visitor.firstName': { $regex: search, $options: 'i' } },
            { 'booking.visitor.lastName': { $regex: search, $options: 'i' } },
            { 'booking.visitor.email': { $regex: search, $options: 'i' } }
          ];
        } else if (recordType === 'university') {
          query.$or = [
            { 'university.basic.universityName': { $regex: search, $options: 'i' } },
            { 'university.location.country': { $regex: search, $options: 'i' } },
            { 'university.location.city': { $regex: search, $options: 'i' } }
          ];
        }
      }
      
      // Calculate pagination
      const skip = (parseInt(page) - 1) * parseInt(limit);
      
      // Build sort object
      const sort = {};
      if (recordType === 'application') {
        sort[`application.${sortBy}`] = sortOrder === 'desc' ? -1 : 1;
      } else if (recordType === 'booking') {
        sort[`booking.${sortBy}`] = sortOrder === 'desc' ? -1 : 1;
      } else if (recordType === 'university') {
        sort[`university.${sortBy}`] = sortOrder === 'desc' ? -1 : 1;
      } else {
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
      }
      
      // Execute query
      const [records, total] = await Promise.all([
        AdmissionManagement.find(query)
          .sort(sort)
          .skip(skip)
          .limit(parseInt(limit))
          .populate('createdBy', 'name email')
          .populate('updatedBy', 'name email'),
        AdmissionManagement.countDocuments(query)
      ]);
      
      res.json({
        success: true,
        data: records,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        },
        filters: {
          recordType,
          status,
          search,
          startDate,
          endDate
        }
      });
    } catch (error) {
      console.error('Get records error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch records',
        error: error.message
      });
    }
  }
  
  // Get single record
  async getRecord(req, res) {
    try {
      const { id } = req.params;
      
      const record = await AdmissionManagement.findOne({
        _id: id,
        isActive: true
      })
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email')
      .populate('application.assignedCounselor', 'name email phone');
      
      if (!record) {
        return res.status(404).json({
          success: false,
          message: 'Record not found'
        });
      }
      
      res.json({
        success: true,
        data: record
      });
    } catch (error) {
      console.error('Get record error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch record',
        error: error.message
      });
    }
  }
  
  // Update record
  async updateRecord(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;
      const files = req.files || {};
      
      // Find record
      const record = await AdmissionManagement.findOne({
        _id: id,
        isActive: true
      });
      
      if (!record) {
        return res.status(404).json({
          success: false,
          message: 'Record not found'
        });
      }
      
      // Handle file uploads for universities
      if (record.recordType === 'university' && files.logo) {
        const uploadResult = await this.uploadUniversityLogo(files.logo[0], record._id);
        if (uploadResult.success) {
          updates.university = updates.university || {};
          updates.university.basic = updates.university.basic || {};
          updates.university.basic.universityLogo = uploadResult.url;
        }
      }
      
      if (record.recordType === 'university' && files.images) {
        const uploadResults = await this.uploadUniversityImages(files.images, record._id);
        if (uploadResults.success) {
          updates.university = updates.university || {};
          updates.university.basic = updates.university.basic || {};
          updates.university.basic.universityImages = [
            ...(record.university.basic.universityImages || []),
            ...uploadResults.results
              .filter(r => r.success)
              .map(r => ({
                url: r.url,
                publicId: r.publicId,
                uploadedAt: new Date()
              }))
          ];
        }
      }
      
      // Handle document uploads for applications
      if (record.recordType === 'application' && files.documents) {
        const uploadPromises = files.documents.map(async (file) => {
          const uploadResult = await this.uploadApplicationDocument(
            file,
            record._id,
            file.originalname.split('.')[0]
          );
          
          if (uploadResult.success) {
            return {
              name: file.originalname,
              type: file.mimetype,
              url: uploadResult.url,
              publicId: uploadResult.publicId,
              size: file.size,
              mimeType: file.mimetype,
              uploadedAt: new Date()
            };
          }
          return null;
        });
        
        const uploadedDocuments = (await Promise.all(uploadPromises)).filter(doc => doc !== null);
        
        updates.application = updates.application || {};
        updates.application.documents = updates.application.documents || {};
        updates.application.documents.submitted = [
          ...(record.application.documents.submitted || []),
          ...uploadedDocuments
        ];
        
        if (uploadedDocuments.length > 0) {
          updates.application.documents.status = 'uploaded';
        }
      }
      
      // Check if application status is changing
      let statusChanged = false;
      let oldStatus = null;
      let newStatus = null;
      
      if (record.recordType === 'application' && 
          updates.application?.status && 
          updates.application.status !== record.application.status) {
        statusChanged = true;
        oldStatus = record.application.status;
        newStatus = updates.application.status;
      }
      
      // Update record
      Object.keys(updates).forEach(key => {
        if (key === 'application' || key === 'booking' || key === 'university') {
          record[key] = { ...record[key], ...updates[key] };
        } else {
          record[key] = updates[key];
        }
      });
      
      record.updatedBy = req.user?.id;
      await record.save();
      
      // Send status update email if status changed
      if (statusChanged && record.recordType === 'application') {
        await this.sendEmail(
          record.application.applicant.email,
          'Application Status Update',
          'application_status_update',
          {
            applicant: record.application.applicant,
            applicationId: record.recordId,
            status: newStatus,
            oldStatus,
            university: record.application.target.universityName,
            program: record.application.target.program,
            nextSteps: this.getNextStepsForStatus(newStatus)
          }
        );
        
        // Add to communication log
        record.addCommunication(
          'email',
          'Application Status Update',
          `Application status changed from ${oldStatus} to ${newStatus}`,
          req.user?.id || 'system',
          record.application.applicant.email,
          'sent',
          [],
          'application_status_update'
        );
        
        await record.save();
      }
      
      res.json({
        success: true,
        message: 'Record updated successfully',
        data: record,
        statusChanged,
        emailSent: statusChanged
      });
    } catch (error) {
      console.error('Update record error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update record',
        error: error.message
      });
    }
  }
  
  // Delete record (soft delete)
  async deleteRecord(req, res) {
    try {
      const { id } = req.params;
      
      const record = await AdmissionManagement.findOne({
        _id: id,
        isActive: true
      });
      
      if (!record) {
        return res.status(404).json({
          success: false,
          message: 'Record not found'
        });
      }
      
      // Soft delete
      record.isActive = false;
      record.deletedAt = new Date();
      record.deletedBy = req.user?.id;
      
      await record.save();
      
      res.json({
        success: true,
        message: 'Record deleted successfully'
      });
    } catch (error) {
      console.error('Delete record error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete record',
        error: error.message
      });
    }
  }
  
  // Upload documents to application
  async uploadDocuments(req, res) {
    try {
      const { id } = req.params;
      const files = req.files;
      
      if (!files || files.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No files uploaded'
        });
      }
      
      const record = await AdmissionManagement.findOne({
        _id: id,
        recordType: 'application',
        isActive: true
      });
      
      if (!record) {
        return res.status(404).json({
          success: false,
          message: 'Application not found'
        });
      }
      
      // Upload files to Cloudinary
      const uploadPromises = files.map(async (file) => {
        const uploadResult = await this.uploadApplicationDocument(
          file,
          record._id,
          file.originalname.split('.')[0]
        );
        
        if (uploadResult.success) {
          return {
            name: file.originalname,
            type: file.mimetype,
            url: uploadResult.url,
            publicId: uploadResult.publicId,
            size: file.size,
            mimeType: file.mimetype,
            uploadedAt: new Date(),
            verified: false
          };
        }
        return null;
      });
      
      const uploadedDocuments = (await Promise.all(uploadPromises)).filter(doc => doc !== null);
      
      // Add to application
      if (!record.application.documents) {
        record.application.documents = {};
      }
      if (!record.application.documents.submitted) {
        record.application.documents.submitted = [];
      }
      
      record.application.documents.submitted.push(...uploadedDocuments);
      record.application.documents.status = 'uploaded';
      record.application.statistics.documentsUploaded += uploadedDocuments.length;
      
      // Add to timeline
      record.addTimelineEvent(
        'Documents Uploaded',
        `${uploadedDocuments.length} document(s) uploaded`,
        req.user?.id || 'applicant',
        'document',
        { count: uploadedDocuments.length, documents: uploadedDocuments.map(d => d.name) }
      );
      
      await record.save();
      
      // Send notification email
      await this.sendEmail(
        record.application.applicant.email,
        'Documents Uploaded Successfully',
        'application_status_update',
        {
          applicant: record.application.applicant,
          applicationId: record.recordId,
          status: 'document_verification',
          message: `${uploadedDocuments.length} document(s) have been uploaded successfully. They are now pending verification.`,
          university: record.application.target.universityName,
          program: record.application.target.program
        }
      );
      
      res.json({
        success: true,
        message: 'Documents uploaded successfully',
        data: {
          documents: uploadedDocuments,
          totalDocuments: record.application.documents.submitted.length
        },
        emailSent: true
      });
    } catch (error) {
      console.error('Upload documents error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to upload documents',
        error: error.message
      });
    }
  }
  
  // Update application status
  async updateApplicationStatus(req, res) {
    try {
      const { id } = req.params;
      const { status, notes } = req.body;
      
      const record = await AdmissionManagement.findOne({
        _id: id,
        recordType: 'application',
        isActive: true
      });
      
      if (!record) {
        return res.status(404).json({
          success: false,
          message: 'Application not found'
        });
      }
      
      const oldStatus = record.application.status;
      record.updateStatus(status, req.user?.id || 'system', notes);
      
      await record.save();
      
      // Send status update email
      await this.sendEmail(
        record.application.applicant.email,
        'Application Status Update',
        'application_status_update',
        {
          applicant: record.application.applicant,
          applicationId: record.recordId,
          status,
          oldStatus,
          university: record.application.target.universityName,
          program: record.application.target.program,
          nextSteps: this.getNextStepsForStatus(status),
          notes
        }
      );
      
      res.json({
        success: true,
        message: 'Application status updated successfully',
        data: record,
        oldStatus,
        newStatus: status,
        emailSent: true
      });
    } catch (error) {
      console.error('Update application status error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update application status',
        error: error.message
      });
    }
  }
  
  // Schedule interview
  async scheduleInterview(req, res) {
    try {
      const { id } = req.params;
      const { interview } = req.body;
      
      const record = await AdmissionManagement.findOne({
        _id: id,
        recordType: 'application',
        isActive: true
      });
      
      if (!record) {
        return res.status(404).json({
          success: false,
          message: 'Application not found'
        });
      }
      
      // Update interview details
      record.application.interview = {
        ...record.application.interview,
        ...interview,
        status: 'scheduled'
      };
      
      // Update application status
      record.updateStatus('interview_scheduled', req.user?.id || 'system', 'Interview scheduled');
      
      // Add to timeline
      record.addTimelineEvent(
        'Interview Scheduled',
        `Interview scheduled for ${new Date(interview.scheduledDate).toLocaleDateString()} at ${interview.scheduledTime}`,
        req.user?.id || 'system',
        'interview',
        interview
      );
      
      await record.save();
      
      // Send interview invitation email
      await this.sendEmail(
        record.application.applicant.email,
        'Interview Scheduled',
        'booking_confirmation',
        {
          visitor: record.application.applicant,
          bookingId: record.recordId,
          date: new Date(interview.scheduledDate).toLocaleDateString(),
          time: interview.scheduledTime,
          type: 'Admission Interview',
          duration: interview.duration || '1 hour',
          meetingLink: interview.meetingLink,
          location: interview.type === 'in_person' ? interview.location : 'Virtual'
        }
      );
      
      res.json({
        success: true,
        message: 'Interview scheduled successfully',
        data: record.application.interview,
        emailSent: true
      });
    } catch (error) {
      console.error('Schedule interview error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to schedule interview',
        error: error.message
      });
    }
  }
  
  // Get statistics
  async getStatistics(req, res) {
    try {
      const { recordType } = req.params;
      const { startDate, endDate } = req.query;
      
      const filters = {};
      if (startDate || endDate) {
        filters.createdAt = {};
        if (startDate) filters.createdAt.$gte = new Date(startDate);
        if (endDate) filters.createdAt.$lte = new Date(endDate);
      }
      
      const result = await this.getStatisticsService(recordType, filters);
      
      if (!result.success) {
        return res.status(500).json(result);
      }
      
      res.json(result);
    } catch (error) {
      console.error('Get statistics error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get statistics',
        error: error.message
      });
    }
  }
  
  // Get dashboard statistics
  async getDashboardStatistics(req, res) {
    try {
      const result = await this.getDashboardStatsService();
      
      if (!result.success) {
        return res.status(500).json(result);
      }
      
      res.json(result);
    } catch (error) {
      console.error('Get dashboard statistics error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get dashboard statistics',
        error: error.message
      });
    }
  }
  
  // Get analytics
  async getAnalytics(req, res) {
    try {
      const { type } = req.params;
      const { startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), 
              endDate = new Date().toISOString() } = req.query;
      
      let result;
      
      switch(type) {
        case 'application':
          result = await this.getApplicationAnalytics(startDate, endDate);
          break;
        case 'booking':
          result = await this.getBookingAnalytics(startDate, endDate);
          break;
        case 'university':
          result = await this.getUniversityAnalytics();
          break;
        default:
          return res.status(400).json({
            success: false,
            message: 'Invalid analytics type'
          });
      }
      
      if (!result.success) {
        return res.status(500).json(result);
      }
      
      res.json(result);
    } catch (error) {
      console.error('Get analytics error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get analytics',
        error: error.message
      });
    }
  }
  
  // Send booking reminders
  async sendBookingReminders(req, res) {
    try {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const bookings = await AdmissionManagement.find({
        recordType: 'booking',
        isActive: true,
        'booking.status': { $in: ['confirmed', 'pending'] },
        'booking.details.bookingDate': {
          $gte: new Date(tomorrow.setHours(0, 0, 0, 0)),
          $lt: new Date(tomorrow.setHours(23, 59, 59, 999))
        },
        'booking.reminderSent': false
      });
      
      const results = [];
      
      for (const booking of bookings) {
        try {
          await this.sendEmail(
            booking.booking.visitor.email,
            'Booking Reminder',
            'booking_reminder',
            {
              visitor: booking.booking.visitor,
              bookingId: booking.recordId,
              date: new Date(booking.booking.details.bookingDate).toLocaleDateString(),
              time: booking.booking.details.bookingTime,
              type: booking.booking.details.bookingType,
              duration: booking.booking.details.bookingDuration,
              meetingLink: booking.booking.details.meetingLink,
              location: booking.booking.details.location
            }
          );
          
          booking.booking.reminderSent = true;
          booking.booking.communicationLog.push({
            type: 'email',
            content: 'Booking reminder sent',
            recipient: booking.booking.visitor.email,
            status: 'sent'
          });
          
          await booking.save();
          
          results.push({
            bookingId: booking.recordId,
            email: booking.booking.visitor.email,
            success: true
          });
        } catch (error) {
          results.push({
            bookingId: booking.recordId,
            email: booking.booking.visitor.email,
            success: false,
            error: error.message
          });
        }
      }
      
      res.json({
        success: true,
        message: `Reminders sent for ${results.filter(r => r.success).length} bookings`,
        results
      });
    } catch (error) {
      console.error('Send booking reminders error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to send booking reminders',
        error: error.message
      });
    }
  }
  
  // Helper method for next steps
  getNextStepsForStatus(status) {
    const nextSteps = {
      'submitted': 'Your application has been submitted and is awaiting review. Please ensure all required documents are uploaded.',
      'under_review': 'Your application is currently under review by our admissions committee.',
      'document_verification': 'Your documents are being verified. Please ensure all documents are clear and legible.',
      'interview_scheduled': 'An interview has been scheduled. Please check your email for details and prepare accordingly.',
      'interview_completed': 'Your interview has been completed. The committee will review your interview performance.',
      'accepted': 'Congratulations! Your application has been accepted. Please check your email for next steps including enrollment procedures.',
      'conditionally_accepted': 'Your application has been conditionally accepted. Please fulfill the conditions mentioned in your acceptance letter.',
      'waitlisted': 'Your application has been waitlisted. We will contact you if a spot becomes available.',
      'rejected': 'We regret to inform you that your application was not successful. We encourage you to apply again in the future.',
      'enrolled': 'Congratulations on your enrollment! Welcome to our institution.'
    };
    
    return nextSteps[status] || 'Please check your application portal for updates.';
  }
}

module.exports = new AdmissionController();