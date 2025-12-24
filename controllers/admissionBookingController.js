const AdmissionBooking = require('../models/AdmissionBooking');
const emailService = require('../mails/sendEmail');
const documentService = require('../services/documentService');
const { validationResult } = require('express-validator');

// Get all admission bookings
exports.getAllApplications = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      targetCountry,
      targetUniversity,
      programLevel,
      intakeSeason,
      intakeYear,
      priority,
      documents,
      essay,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const query = {};

    // Filters
    if (status) query.status = status;
    if (targetCountry) query.targetCountry = targetCountry;
    if (targetUniversity) query.targetUniversity = targetUniversity;
    if (programLevel) query.programLevel = programLevel;
    if (intakeSeason) query.intakeSeason = intakeSeason;
    if (intakeYear) query.intakeYear = parseInt(intakeYear);
    if (priority) query.priority = priority;
    if (documents) query.documents = documents;
    if (essay) query.essay = essay;

    // Search
    if (search) {
      query.$or = [
        { applicationId: { $regex: search, $options: 'i' } },
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { targetUniversity: { $regex: search, $options: 'i' } },
        { targetProgram: { $regex: search, $options: 'i' } }
      ];
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const applications = await AdmissionBooking.find(query)
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('assignedCounselor', 'firstName lastName email')
      .exec();

    const total = await AdmissionBooking.countDocuments(query);

    res.status(200).json({
      success: true,
      data: applications,
      pagination: {
        currentPage: page * 1,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit * 1
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching applications',
      error: error.message
    });
  }
};

// Get single application
exports.getApplication = async (req, res) => {
  try {
    const application = await AdmissionBooking.findById(req.params.id)
      .populate('assignedCounselor', 'firstName lastName email phone')
      .populate('notes.createdBy', 'firstName lastName');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    res.status(200).json({
      success: true,
      data: application
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching application',
      error: error.message
    });
  }
};

// Create application
exports.createApplication = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const applicationData = req.body;
    
    // Add metadata
    applicationData.metadata = {
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      source: req.body.source || 'website',
      campaign: req.body.campaign
    };

    const application = new AdmissionBooking(applicationData);
    await application.save();

    // Add timeline event
    await application.addTimelineEvent(
      'application_created',
      'Application was created',
      req.user ? req.user.id : 'system'
    );

    // Send confirmation email
    try {
      await emailService.sendApplicationConfirmation(application);
      await application.save();
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
    }

    res.status(201).json({
      success: true,
      message: 'Application created successfully',
      data: application
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Email or Application ID already exists'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error creating application',
      error: error.message
    });
  }
};

// Update application
exports.updateApplication = async (req, res) => {
  try {
    const application = await AdmissionBooking.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Add timeline event
    await application.addTimelineEvent(
      'application_updated',
      'Application information was updated',
      req.user.id
    );

    res.status(200).json({
      success: true,
      message: 'Application updated successfully',
      data: application
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating application',
      error: error.message
    });
  }
};

// Delete application
exports.deleteApplication = async (req, res) => {
  try {
    const application = await AdmissionBooking.findByIdAndDelete(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Delete associated documents
    await documentService.deleteApplicationDocuments(application._id);

    res.status(200).json({
      success: true,
      message: 'Application deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting application',
      error: error.message
    });
  }
};

// Submit application
exports.submitApplication = async (req, res) => {
  try {
    const application = await AdmissionBooking.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check if all required fields are completed
    const requiredFields = [
      'firstName', 'lastName', 'email', 'phone', 'nationality',
      'currentEducation', 'gpa', 'targetUniversity', 'targetCountry',
      'targetProgram', 'programLevel', 'intakeSeason', 'intakeYear'
    ];

    const missingFields = requiredFields.filter(field => !application[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Required fields are missing',
        missingFields
      });
    }

    application.status = 'submitted';
    application.submittedAt = new Date();
    await application.save();

    // Add timeline event
    await application.addTimelineEvent(
      'application_submitted',
      'Application was officially submitted',
      req.user ? req.user.id : 'system'
    );

    // Send submission confirmation
    try {
      await emailService.sendApplicationSubmissionConfirmation(application);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
    }

    res.status(200).json({
      success: true,
      message: 'Application submitted successfully',
      data: application
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error submitting application',
      error: error.message
    });
  }
};

// Update application status
exports.updateStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;

    const application = await AdmissionBooking.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    const oldStatus = application.status;
    application.status = status;

    if (notes) {
      await application.addNote(
        `Status changed from ${oldStatus} to ${status}. ${notes}`,
        req.user.id,
        'general'
      );
    }

    await application.save();

    // Add timeline event
    await application.addTimelineEvent(
      'status_changed',
      `Status changed from ${oldStatus} to ${status}`,
      req.user.id
    );

    // Send status update email
    try {
      await emailService.sendStatusUpdateEmail(application, status, oldStatus);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
    }

    res.status(200).json({
      success: true,
      message: 'Application status updated successfully',
      data: application
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating application status',
      error: error.message
    });
  }
};

// Upload document
exports.uploadDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const { documentType } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const application = await AdmissionBooking.findById(id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Upload document to storage
    const documentUrl = await documentService.uploadDocument(
      req.file,
      application.applicationId,
      documentType
    );

    // Add to documents array
    application.documentsSubmitted.push({
      name: req.file.originalname,
      type: documentType,
      url: documentUrl,
      uploadedAt: new Date()
    });

    // Update documents status
    application.documents = 'uploaded';
    application.statistics.documentsUploaded = application.documentsSubmitted.length;
    await application.save();

    // Add timeline event
    await application.addTimelineEvent(
      'document_uploaded',
      `${documentType} document uploaded: ${req.file.originalname}`,
      req.user ? req.user.id : 'system'
    );

    res.status(200).json({
      success: true,
      message: 'Document uploaded successfully',
      data: {
        documentUrl,
        documentsCount: application.documentsSubmitted.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error uploading document',
      error: error.message
    });
  }
};

// Verify document
exports.verifyDocument = async (req, res) => {
  try {
    const { id, docId } = req.params;
    const { verified, comments } = req.body;

    const application = await AdmissionBooking.findById(id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    const document = application.documentsSubmitted.id(docId);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    document.verified = verified;
    document.verifiedBy = req.user.id;
    document.verifiedAt = new Date();

    // Add note about verification
    if (comments) {
      await application.addNote(
        `Document ${document.name} ${verified ? 'verified' : 'rejected'}: ${comments}`,
        req.user.id,
        'document'
      );
    }

    // Check if all documents are verified
    const allVerified = application.documentsSubmitted.every(doc => doc.verified);
    if (allVerified) {
      application.documents = 'verified';
    }

    await application.save();

    res.status(200).json({
      success: true,
      message: `Document ${verified ? 'verified' : 'rejected'} successfully`,
      data: document
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error verifying document',
      error: error.message
    });
  }
};

// Add note to application
exports.addNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { content, type } = req.body;

    const application = await AdmissionBooking.findById(id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    await application.addNote(content, req.user.id, type);

    res.status(200).json({
      success: true,
      message: 'Note added successfully',
      data: application.notes[application.notes.length - 1]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding note',
      error: error.message
    });
  }
};

// Get enhanced statistics with timeline
exports.getStatistics = async (req, res) => {
  try {
    // Get date filters from query params
    const { 
      startDate, 
      endDate, 
      interval = 'day', // day, week, month, year
      groupBy = 'status' // status, country, university, programLevel, etc.
    } = req.query;

    // Base statistics
    const statistics = await AdmissionBooking.getStatistics();
    
    // Calculate date ranges
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfYear = new Date(today.getFullYear(), 0, 1);

    // Time-based statistics
    const [monthlyStats, yearlyStats, weeklyStats] = await Promise.all([
      // Monthly stats
      AdmissionBooking.aggregate([
        {
          $match: {
            createdAt: { $gte: startOfMonth }
          }
        },
        {
          $group: {
            _id: null,
            monthlyApplications: { $sum: 1 },
            monthlyAccepted: {
              $sum: { $cond: [{ $eq: ['$status', 'accepted'] }, 1, 0] }
            },
            monthlyPending: {
              $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
            },
            monthlyRevenue: { $sum: '$statistics.applicationScore' }
          }
        }
      ]),

      // Yearly stats
      AdmissionBooking.aggregate([
        {
          $match: {
            createdAt: { $gte: startOfYear }
          }
        },
        {
          $group: {
            _id: null,
            yearlyApplications: { $sum: 1 },
            yearlyAccepted: {
              $sum: { $cond: [{ $eq: ['$status', 'accepted'] }, 1, 0] }
            },
            yearlyRevenue: { $sum: '$statistics.applicationScore' }
          }
        }
      ]),

      // Weekly stats
      AdmissionBooking.aggregate([
        {
          $match: {
            createdAt: { $gte: startOfWeek }
          }
        },
        {
          $group: {
            _id: null,
            weeklyApplications: { $sum: 1 },
            weeklyAccepted: {
              $sum: { $cond: [{ $eq: ['$status', 'accepted'] }, 1, 0] }
            }
          }
        }
      ])
    ]);

    // Timeline statistics - applications over time
    let dateFormat;
    switch(interval) {
      case 'hour':
        dateFormat = { 
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' },
          hour: { $hour: '$createdAt' }
        };
        break;
      case 'week':
        dateFormat = { 
          year: { $year: '$createdAt' },
          week: { $week: '$createdAt' }
        };
        break;
      case 'month':
        dateFormat = { 
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        };
        break;
      case 'year':
        dateFormat = { year: { $year: '$createdAt' } };
        break;
      default: // day
        dateFormat = { 
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' }
        };
    }

    // Build match stage for timeline
    let matchStage = {};
    if (startDate || endDate) {
      matchStage.createdAt = {};
      if (startDate) matchStage.createdAt.$gte = new Date(startDate);
      if (endDate) matchStage.createdAt.$lte = new Date(endDate);
    }

    // Timeline aggregation
    const timelineStats = await AdmissionBooking.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: dateFormat,
          count: { $sum: 1 },
          accepted: {
            $sum: { $cond: [{ $eq: ['$status', 'accepted'] }, 1, 0] }
          },
          pending: {
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
          },
          rejected: {
            $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0] }
          },
          avgScore: { $avg: '$statistics.applicationScore' },
          totalRevenue: { $sum: '$statistics.applicationScore' }
        }
      },
      {
        $addFields: {
          acceptanceRate: {
            $cond: [
              { $gt: ['$count', 0] },
              { $multiply: [{ $divide: ['$accepted', '$count'] }, 100] },
              0
            ]
          }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    // Group by different categories
    let groupByField;
    switch(groupBy) {
      case 'country':
        groupByField = '$targetCountry';
        break;
      case 'university':
        groupByField = '$targetUniversity';
        break;
      case 'programLevel':
        groupByField = '$programLevel';
        break;
      case 'intakeSeason':
        groupByField = '$intakeSeason';
        break;
      default:
        groupByField = '$status';
    }

    const groupedStats = await AdmissionBooking.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: groupByField,
          count: { $sum: 1 },
          accepted: {
            $sum: { $cond: [{ $eq: ['$status', 'accepted'] }, 1, 0] }
          },
          avgScore: { $avg: '$statistics.applicationScore' },
          avgProcessingTime: { $avg: '$statistics.processingTime' }
        }
      },
      {
        $addFields: {
          acceptanceRate: {
            $cond: [
              { $gt: ['$count', 0] },
              { $multiply: [{ $divide: ['$accepted', '$count'] }, 100] },
              0
            ]
          }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Get counselor performance
    const counselorStats = await AdmissionBooking.aggregate([
      {
        $match: {
          assignedCounselor: { $ne: null },
          status: { $in: ['accepted', 'rejected', 'waitlisted'] }
        }
      },
      {
        $group: {
          _id: '$assignedCounselor',
          total: { $sum: 1 },
          accepted: {
            $sum: { $cond: [{ $eq: ['$status', 'accepted'] }, 1, 0] }
          },
          avgApplicationScore: { $avg: '$statistics.applicationScore' },
          avgProcessingTime: { $avg: '$statistics.processingTime' }
        }
      },
      {
        $addFields: {
          acceptanceRate: { 
            $cond: [
              { $gt: ['$total', 0] },
              { $multiply: [{ $divide: ['$accepted', '$total'] }, 100] },
              0
            ]
          },
          efficiencyScore: {
            $cond: [
              { $gt: ['$avgProcessingTime', 0] },
              { $divide: ['$accepted', '$avgProcessingTime'] },
              0
            ]
          }
        }
      },
      { $sort: { acceptanceRate: -1 } }
    ]);

    // Get conversion funnel
    const conversionFunnel = await AdmissionBooking.aggregate([
      {
        $group: {
          _id: null,
          totalApplications: { $sum: 1 },
          submitted: {
            $sum: { $cond: [{ $eq: ['$status', 'submitted'] }, 1, 0] }
          },
          underReview: {
            $sum: { $cond: [{ $eq: ['$status', 'under_review'] }, 1, 0] }
          },
          interview: {
            $sum: { $cond: [{ $eq: ['$status', 'interview'] }, 1, 0] }
          },
          accepted: {
            $sum: { $cond: [{ $eq: ['$status', 'accepted'] }, 1, 0] }
          },
          enrolled: {
            $sum: { $cond: [{ $eq: ['$status', 'enrolled'] }, 1, 0] }
          }
        }
      }
    ]);

    // Performance metrics over time (last 30 days)
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);

    const performanceMetrics = await AdmissionBooking.aggregate([
      {
        $match: {
          createdAt: { $gte: last30Days }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          applications: { $sum: 1 },
          accepted: {
            $sum: { $cond: [{ $eq: ['$status', 'accepted'] }, 1, 0] }
          },
          avgScore: { $avg: '$statistics.applicationScore' },
          avgResponseTime: { $avg: '$statistics.processingTime' }
        }
      },
      {
        $addFields: {
          acceptanceRate: {
            $cond: [
              { $gt: ['$applications', 0] },
              { $multiply: [{ $divide: ['$accepted', '$applications'] }, 100] },
              0
            ]
          },
          date: {
            $dateFromParts: {
              year: '$_id.year',
              month: '$_id.month',
              day: '$_id.day'
            }
          }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        ...statistics,
        timeframeStats: {
          weekly: weeklyStats[0] || { weeklyApplications: 0, weeklyAccepted: 0 },
          monthly: monthlyStats[0] || { monthlyApplications: 0, monthlyAccepted: 0, monthlyPending: 0, monthlyRevenue: 0 },
          yearly: yearlyStats[0] || { yearlyApplications: 0, yearlyAccepted: 0, yearlyRevenue: 0 }
        },
        timelineStats: {
          interval,
          data: timelineStats,
          timeRange: {
            startDate: startDate || 'all',
            endDate: endDate || 'now'
          }
        },
        groupedStats: {
          by: groupBy,
          data: groupedStats
        },
        counselorStats,
        conversionFunnel: conversionFunnel[0] || {
          totalApplications: 0,
          submitted: 0,
          underReview: 0,
          interview: 0,
          accepted: 0,
          enrolled: 0
        },
        performanceMetrics,
        calculatedAt: new Date()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message
    });
  }
};

// Get admission rates
exports.getAdmissionRates = async (req, res) => {
  try {
    const admissionRates = await AdmissionBooking.getAdmissionRates();

    res.status(200).json({
      success: true,
      data: admissionRates
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching admission rates',
      error: error.message
    });
  }
};

// Get timeline statistics for dashboard
exports.getTimelineStatistics = async (req, res) => {
  try {
    const { 
      timeframe = '30d', // 7d, 30d, 90d, 1y, all
      type = 'applications' // applications, conversions, revenue
    } = req.query;

    let startDate;
    const endDate = new Date();

    switch(timeframe) {
      case '7d':
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 7);
        break;
      case '30d':
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 30);
        break;
      case '90d':
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 90);
        break;
      case '1y':
        startDate = new Date();
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate = null;
    }

    const matchStage = startDate ? { createdAt: { $gte: startDate, $lte: endDate } } : {};

    let pipeline = [];
    
    if (type === 'conversions') {
      // Conversion rate over time
      pipeline = [
        { $match: matchStage },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
              day: { $dayOfMonth: '$createdAt' }
            },
            total: { $sum: 1 },
            converted: {
              $sum: {
                $cond: [
                  { $in: ['$status', ['accepted', 'enrolled']] },
                  1,
                  0
                ]
              }
            }
          }
        },
        {
          $addFields: {
            conversionRate: {
              $cond: [
                { $gt: ['$total', 0] },
                { $multiply: [{ $divide: ['$converted', '$total'] }, 100] },
                0
              ]
            },
            date: {
              $dateFromParts: {
                year: '$_id.year',
                month: '$_id.month',
                day: '$_id.day'
              }
            }
          }
        },
        { $sort: { '_id': 1 } },
        { $project: { _id: 0, date: 1, conversionRate: 1, total: 1, converted: 1 } }
      ];
    } else if (type === 'revenue') {
      // Revenue over time (using applicationScore as proxy for revenue)
      pipeline = [
        { $match: matchStage },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
              day: { $dayOfMonth: '$createdAt' }
            },
            totalRevenue: { $sum: '$statistics.applicationScore' },
            count: { $sum: 1 },
            avgRevenue: { $avg: '$statistics.applicationScore' }
          }
        },
        {
          $addFields: {
            date: {
              $dateFromParts: {
                year: '$_id.year',
                month: '$_id.month',
                day: '$_id.day'
              }
            }
          }
        },
        { $sort: { '_id': 1 } },
        { $project: { _id: 0, date: 1, totalRevenue: 1, count: 1, avgRevenue: 1 } }
      ];
    } else {
      // Applications over time (default)
      pipeline = [
        { $match: matchStage },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
              day: { $dayOfMonth: '$createdAt' }
            },
            applications: { $sum: 1 },
            accepted: {
              $sum: { $cond: [{ $eq: ['$status', 'accepted'] }, 1, 0] }
            },
            pending: {
              $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
            }
          }
        },
        {
          $addFields: {
            date: {
              $dateFromParts: {
                year: '$_id.year',
                month: '$_id.month',
                day: '$_id.day'
              }
            }
          }
        },
        { $sort: { '_id': 1 } },
        { $project: { _id: 0, date: 1, applications: 1, accepted: 1, pending: 1 } }
      ];
    }

    const timelineData = await AdmissionBooking.aggregate(pipeline);

    // Calculate summary
    let summary = {};
    if (timelineData.length > 0) {
      if (type === 'conversions') {
        const total = timelineData.reduce((sum, day) => sum + day.total, 0);
        const converted = timelineData.reduce((sum, day) => sum + day.converted, 0);
        summary = {
          total,
          converted,
          overallConversionRate: total > 0 ? (converted / total) * 100 : 0
        };
      } else if (type === 'revenue') {
        const totalRevenue = timelineData.reduce((sum, day) => sum + day.totalRevenue, 0);
        const totalCount = timelineData.reduce((sum, day) => sum + day.count, 0);
        summary = {
          totalRevenue,
          totalCount,
          averageRevenue: totalCount > 0 ? totalRevenue / totalCount : 0
        };
      } else {
        const totalApplications = timelineData.reduce((sum, day) => sum + day.applications, 0);
        const totalAccepted = timelineData.reduce((sum, day) => sum + day.accepted, 0);
        summary = {
          totalApplications,
          totalAccepted,
          acceptanceRate: totalApplications > 0 ? (totalAccepted / totalApplications) * 100 : 0
        };
      }
    }

    res.status(200).json({
      success: true,
      data: {
        timeframe,
        type,
        timeline: timelineData,
        summary,
        dateRange: {
          start: startDate,
          end: endDate
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching timeline statistics',
      error: error.message
    });
  }
};

// Send email
exports.sendEmail = async (req, res) => {
  try {
    const { applicationId, emailType, subject, message, attachments } = req.body;

    const application = await AdmissionBooking.findById(applicationId);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    let emailResult;

    switch (emailType) {
      case 'welcome':
        emailResult = await emailService.sendWelcomeEmail(application);
        break;
      case 'document_request':
        emailResult = await emailService.sendDocumentRequestEmail(application, subject, message);
        break;
      case 'interview_invitation':
        emailResult = await emailService.sendInterviewInvitation(application, subject, message);
        break;
      case 'decision':
        emailResult = await emailService.sendDecisionEmail(application, subject, message);
        break;
      case 'custom':
        emailResult = await emailService.sendCustomEmail(application, subject, message, attachments);
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid email type'
        });
    }

    // Update email statistics
    application.statistics.totalEmailsSent += 1;
    await application.save();

    // Add timeline event
    await application.addTimelineEvent(
      'email_sent',
      `${emailType} email sent to applicant`,
      req.user.id
    );

    res.status(200).json({
      success: true,
      message: 'Email sent successfully',
      data: {
        emailResult,
        totalEmailsSent: application.statistics.totalEmailsSent
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error sending email',
      error: error.message
    });
  }
};

// Bulk update applications
exports.bulkUpdate = async (req, res) => {
  try {
    const { ids, updates } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid IDs array'
      });
    }

    const result = await AdmissionBooking.updateMany(
      { _id: { $in: ids } },
      updates,
      { runValidators: true }
    );

    // Add timeline events for each updated application
    for (const id of ids) {
      const application = await AdmissionBooking.findById(id);
      if (application) {
        await application.addTimelineEvent(
          'bulk_update',
          `Application updated in bulk operation: ${JSON.stringify(updates)}`,
          req.user.id
        );
      }
    }

    res.status(200).json({
      success: true,
      message: 'Bulk update completed',
      data: {
        matched: result.matchedCount,
        modified: result.modifiedCount
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error in bulk update',
      error: error.message
    });
  }
};

// Export applications to Excel
exports.exportApplications = async (req, res) => {
  try {
    const { format = 'excel', filters = {} } = req.query;

    const applications = await AdmissionBooking.find(filters)
      .select('-documentsSubmitted -notes -timeline -metadata')
      .populate('assignedCounselor', 'firstName lastName email')
      .exec();

    let exportData;
    
    if (format === 'excel') {
      exportData = await documentService.exportToExcel(applications);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename=applications_${Date.now()}.xlsx`);
    } else if (format === 'csv') {
      exportData = await documentService.exportToCSV(applications);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=applications_${Date.now()}.csv`);
    } else if (format === 'pdf') {
      exportData = await documentService.exportToPDF(applications);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=applications_${Date.now()}.pdf`);
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid export format'
      });
    }

    res.send(exportData);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error exporting applications',
      error: error.message
    });
  }
};

// Search applications with advanced filters
exports.searchApplications = async (req, res) => {
  try {
    const { query, field } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    let searchQuery = {};
    
    if (field) {
      // Search in specific field
      searchQuery[field] = { $regex: query, $options: 'i' };
    } else {
      // Search in multiple fields
      searchQuery.$or = [
        { applicationId: { $regex: query, $options: 'i' } },
        { firstName: { $regex: query, $options: 'i' } },
        { lastName: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
        { targetUniversity: { $regex: query, $options: 'i' } },
        { targetProgram: { $regex: query, $options: 'i' } },
        { 'notes.content': { $regex: query, $options: 'i' } }
      ];
    }

    const applications = await AdmissionBooking.find(searchQuery)
      .select('applicationId firstName lastName email status targetUniversity targetProgram createdAt')
      .limit(50)
      .exec();

    res.status(200).json({
      success: true,
      data: applications,
      count: applications.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error searching applications',
      error: error.message
    });
  }
}