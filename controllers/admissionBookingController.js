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

// Get statistics
exports.getStatistics = async (req, res) => {
  try {
    const statistics = await AdmissionBooking.getStatistics();
    
    // Calculate additional statistics
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfYear = new Date(today.getFullYear(), 0, 1);

    const monthlyStats = await AdmissionBooking.aggregate([
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
          }
        }
      }
    ]);

    const yearlyStats = await AdmissionBooking.aggregate([
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
          }
        }
      }
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
          avgApplicationScore: { $avg: '$statistics.applicationScore' }
        }
      },
      {
        $addFields: {
          acceptanceRate: { $multiply: [{ $divide: ['$accepted', '$total'] }, 100] }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        ...statistics,
        timeframeStats: {
          monthly: monthlyStats[0] || { monthlyApplications: 0, monthlyAccepted: 0 },
          yearly: yearlyStats[0] || { yearlyApplications: 0, yearlyAccepted: 0 }
        },
        counselorStats,
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