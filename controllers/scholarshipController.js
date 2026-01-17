const ScholarshipApplication = require('../models/ScholarshipApplication');
const nodemailer = require('nodemailer');
const cloudinary = require('../cloudinary/cloudinary');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

// Email configuration
const emailTransporter = nodemailer.createTransport({
  service: process.env.SMTP_SERVICE || 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// ======================================
// HELPER FUNCTIONS (ADDED)
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

// Send application confirmation email
async function sendApplicationConfirmation(application) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'CSCE Scholarships <scholarships@csce.org>',
      to: application.email,
      subject: `Scholarship Application Received - ${application.applicationId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2c3e50;">Scholarship Application Received</h2>
          <p>Dear ${application.firstName} ${application.lastName},</p>
          
          <div style="background-color: #d5f4e6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #27ae60; margin-top: 0;">Application Confirmed</h3>
            <p>Your scholarship application has been received and is now being processed.</p>
            <p><strong>Application ID:</strong> ${application.applicationId}</p>
            <p><strong>Submission Date:</strong> ${new Date(application.createdAt).toLocaleDateString()}</p>
          </div>
          
          <h3 style="color: #3498db;">Application Summary</h3>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Target University:</strong></td>
              <td style="padding: 10px; border-bottom: 1px solid #eee;">${application.targetUniversity}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Target Program:</strong></td>
              <td style="padding: 10px; border-bottom: 1px solid #eee;">${application.targetProgram}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Scholarship Type:</strong></td>
              <td style="padding: 10px; border-bottom: 1px solid #eee;">${application.scholarshipType}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Current Status:</strong></td>
              <td style="padding: 10px; border-bottom: 1px solid #eee;">
                <span style="background-color: #3498db; color: white; padding: 4px 8px; border-radius: 4px;">
                  ${application.status}
                </span>
              </td>
            </tr>
          </table>
          
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h4 style="color: #2c3e50; margin-top: 0;">Next Steps</h4>
            <ol>
              <li>Your application will be reviewed within 2-3 weeks</li>
              <li>You may be contacted for additional information or interview</li>
              <li>Check your application status regularly in your account</li>
            </ol>
          </div>
          
          <p>If you have any questions, please contact our scholarship office at scholarships@csce.org</p>
          
          <p>Best regards,<br><strong>CSCE Scholarship Committee</strong></p>
        </div>
      `
    };

    await emailTransporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending application confirmation:', error);
    return false;
  }
}

// Send status update notification
async function sendStatusUpdateNotification(application, oldStatus, newStatus) {
  try {
    const statusColors = {
      'Submitted': '#3498db',
      'Under Review': '#f39c12',
      'Shortlisted': '#9b59b6',
      'Interview Scheduled': '#1abc9c',
      'Approved': '#27ae60',
      'Rejected': '#e74c3c',
      'Waitlisted': '#95a5a6'
    };

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'CSCE Scholarships <scholarships@csce.org>',
      to: application.email,
      subject: `Application Status Update - ${application.applicationId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2c3e50;">Application Status Updated</h2>
          <p>Dear ${application.firstName} ${application.lastName},</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <div style="display: inline-block; margin: 0 10px;">
              <div style="background-color: ${statusColors[oldStatus] || '#95a5a6'}; color: white; padding: 10px 20px; border-radius: 5px; margin-bottom: 5px;">
                ${oldStatus}
              </div>
              <div style="font-size: 12px; color: #666;">Previous Status</div>
            </div>
            <div style="display: inline-block; font-size: 24px; color: #3498db; vertical-align: middle;">
              →
            </div>
            <div style="display: inline-block; margin: 0 10px;">
              <div style="background-color: ${statusColors[newStatus] || '#95a5a6'}; color: white; padding: 10px 20px; border-radius: 5px; margin-bottom: 5px;">
                ${newStatus}
              </div>
              <div style="font-size: 12px; color: #666;">New Status</div>
            </div>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #3498db; margin-top: 0;">Application Details</h3>
            <p><strong>Application ID:</strong> ${application.applicationId}</p>
            <p><strong>University:</strong> ${application.targetUniversity}</p>
            <p><strong>Program:</strong> ${application.targetProgram}</p>
            <p><strong>Status Updated:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
          
          <p>Best regards,<br><strong>CSCE Scholarship Committee</strong></p>
        </div>
      `
    };

    await emailTransporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending status update notification:', error);
    return false;
  }
}

// Send decision notification
async function sendDecisionNotification(application, decision) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'CSCE Scholarships <scholarships@csce.org>',
      to: application.email,
      subject: `Scholarship Decision - ${application.applicationId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2c3e50;">Scholarship Application Decision</h2>
          <p>Dear ${application.firstName} ${application.lastName},</p>
          
          <div style="background-color: ${decision === 'Approved' ? '#d5f4e6' : decision === 'Conditionally Approved' ? '#ffeaa7' : '#ffcccc'}; padding: 30px; border-radius: 8px; margin: 20px 0; text-align: center;">
            <h3 style="color: ${decision === 'Approved' ? '#27ae60' : decision === 'Conditionally Approved' ? '#f39c12' : '#e74c3c'}; margin-top: 0;">
              ${decision === 'Approved' ? '🎉 Congratulations!' : decision === 'Conditionally Approved' ? 'Conditional Approval' : 'Application Outcome'}
            </h3>
            <p style="font-size: 18px; font-weight: bold;">${decision}</p>
          </div>
          
          <h3 style="color: #3498db;">Application Summary</h3>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Application ID:</strong></td>
              <td style="padding: 10px; border-bottom: 1px solid #eee;">${application.applicationId}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>University:</strong></td>
              <td style="padding: 10px; border-bottom: 1px solid #eee;">${application.targetUniversity}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Program:</strong></td>
              <td style="padding: 10px; border-bottom: 1px solid #eee;">${application.targetProgram}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Decision Date:</strong></td>
              <td style="padding: 10px; border-bottom: 1px solid #eee;">${new Date().toLocaleDateString()}</td>
            </tr>
          </table>
          
          <p>Best regards,<br><strong>CSCE Scholarship Committee</strong></p>
        </div>
      `
    };

    await emailTransporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending decision notification:', error);
    return false;
  }
}

// Send assignment notification
async function sendAssignmentNotification(application, reviewerId) {
  try {
    const reviewerEmail = 'reviewer@example.com';
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'CSCE Scholarships <scholarships@csce.org>',
      to: reviewerEmail,
      subject: `New Application Assigned - ${application.applicationId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2c3e50;">New Application Assigned</h2>
          
          <div style="background-color: #e8f4fc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #3498db; margin-top: 0;">Application Details</h3>
            <p><strong>Application ID:</strong> ${application.applicationId}</p>
            <p><strong>Applicant:</strong> ${application.firstName} ${application.lastName}</p>
            <p><strong>Email:</strong> ${application.email}</p>
            <p><strong>University:</strong> ${application.targetUniversity}</p>
            <p><strong>Program:</strong> ${application.targetProgram}</p>
            <p><strong>Assigned Date:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
          
          <p>Best regards,<br><strong>CSCE Scholarship Committee</strong></p>
        </div>
      `
    };

    await emailTransporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending assignment notification:', error);
    return false;
  }
}

// ======================================
// CRUD OPERATIONS
// ======================================

// Create a new scholarship application
exports.createScholarshipApplication = async (req, res) => {
  try {
    const applicationData = {
      ...req.body
    };

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
      
      // Wait for all uploads to complete
      await Promise.all(documentPromises);
    }

    const application = await ScholarshipApplication.create(applicationData);

    // Send confirmation email
    await sendApplicationConfirmation(application);

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
      await sendStatusUpdateNotification(application, oldStatus, newStatus);
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
      notes: notes || 'Status updated'
    });
    
    await application.save();

    // Send notification email
    await sendStatusUpdateNotification(application, oldStatus, status);

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
    await sendAssignmentNotification(application, reviewerId);

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
      score: score || 0
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
      notes: `Decision: ${decision} - ${notes || ''}`
    });
    
    await application.save();

    // Send decision notification
    await sendDecisionNotification(application, decision);

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
    
    const results = {
      successCount: 0,
      failedCount: 0,
      failedEmails: []
    };
    
    for (const application of applications) {
      const mailOptions = {
        from: process.env.EMAIL_FROM || 'CSCE Scholarships <scholarships@csce.org>',
        to: application.email,
        subject: subject,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2c3e50;">${subject}</h2>
            <p>Dear ${application.firstName} ${application.lastName},</p>
            <p><strong>Application ID:</strong> ${application.applicationId}</p>
            <hr>
            <div style="line-height: 1.6;">
              ${message}
            </div>
            <hr>
            <p style="color: #666; font-size: 12px;">
              This message was sent to all applicants matching the specified criteria.
            </p>
          </div>
        `
      };
      
      try {
        await emailTransporter.sendMail(mailOptions);
        results.successCount++;
      } catch (error) {
        console.error(`Error sending email to ${application.email}:`, error);
        results.failedCount++;
        results.failedEmails.push(application.email);
      }
    }
    
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