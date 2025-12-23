const Exam = require('../models/Exam');
const nodemailer = require('nodemailer');
const cloudinary = require('../cloudinary/cloudinary');
const { v4: uuidv4 } = require('uuid');

// Email configuration
const emailTransporter = nodemailer.createTransport({
  service: process.env.SMTP_SERVICE || 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// ======================================
// CLOUDINARY HELPER FUNCTIONS
// ======================================

// Upload image from URL to Cloudinary
const uploadImageFromUrl = async (imageUrl, folder = 'csce-exams') => {
  try {
    const result = await cloudinary.uploader.upload(imageUrl, {
      folder: folder,
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp']
    });
    
    return {
      url: result.secure_url,
      public_id: result.public_id,
      format: result.format,
      bytes: result.bytes
    };
  } catch (error) {
    console.error('Cloudinary upload from URL error:', error);
    return null;
  }
};

// Delete image from Cloudinary
const deleteCloudinaryImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Error deleting Cloudinary image:', error);
    return false;
  }
};

// Extract public ID from Cloudinary URL
const extractPublicIdFromUrl = (url) => {
  try {
    if (!url || !url.includes('cloudinary.com')) return null;
    
    const urlParts = url.split('/');
    const uploadIndex = urlParts.indexOf('upload');
    if (uploadIndex !== -1 && uploadIndex + 1 < urlParts.length) {
      const publicIdWithVersion = urlParts[uploadIndex + 1];
      const parts = publicIdWithVersion.split('/');
      if (parts.length > 1) {
        return parts.slice(1).join('/').split('.')[0];
      }
    }
    return null;
  } catch (error) {
    console.error('Error extracting public ID from URL:', error);
    return null;
  }
};

// Generate optimized URL for Cloudinary images
const generateOptimizedUrl = (originalUrl, width, height) => {
  if (!originalUrl || !originalUrl.includes('cloudinary.com')) {
    return originalUrl;
  }

  try {
    const urlParts = originalUrl.split('/');
    const uploadIndex = urlParts.indexOf('upload');
    
    if (uploadIndex !== -1) {
      // Insert transformation parameters
      urlParts.splice(uploadIndex + 1, 0, `w_${width},h_${height},c_fill`);
      return urlParts.join('/');
    }
    
    return originalUrl;
  } catch (error) {
    console.error('Error generating optimized URL:', error);
    return originalUrl;
  }
};

// ======================================
// CRUD OPERATIONS
// ======================================

// Create a new CSCE exam
exports.createExam = async (req, res) => {
  try {
    const examData = {
      ...req.body,
      createdBy: req.user?.id || 'system',
      updatedBy: req.user?.id || 'system'
    };

    // Handle image
    let imageInfo = null;
    
    if (req.body.image && req.body.image.startsWith('http')) {
      // Upload image from URL
      imageInfo = await uploadImageFromUrl(req.body.image);
    }
    
    // Set image URL
    if (imageInfo) {
      examData.image = imageInfo.url;
      examData.imageInfo = {
        cloudinaryId: imageInfo.public_id,
        format: imageInfo.format,
        size: imageInfo.bytes
      };
    } else if (!req.body.image) {
      // Set default image
      const defaultImageInfo = await uploadImageFromUrl(
        'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80'
      );
      if (defaultImageInfo) {
        examData.image = defaultImageInfo.url;
        examData.imageInfo = {
          cloudinaryId: defaultImageInfo.public_id,
          format: defaultImageInfo.format,
          size: defaultImageInfo.bytes
        };
      }
    }

    // Format fee if provided as string
    if (typeof examData.fee === 'string') {
      const feeAmount = parseFloat(examData.fee.replace(/[^0-9.-]+/g, ''));
      examData.fee = {
        amount: feeAmount,
        currency: examData.fee.includes('$') ? 'USD' : 'RWF'
      };
    }

    const exam = await Exam.create(examData);

    res.status(201).json({
      success: true,
      message: 'CSCE exam created successfully',
      data: formatExamResponse(exam)
    });
  } catch (error) {
    console.error('Create exam error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating exam',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get all CSCE exams
exports.getAllExams = async (req, res) => {
  try {
    const {
      type,
      difficulty,
      registrationStatus,
      featured,
      search,
      page = 1,
      limit = 10,
      sortBy = 'nextExamDate',
      order = 'asc'
    } = req.query;

    // Build query
    let query = { isActive: true };
    
    if (type) query.type = type;
    if (difficulty) query.difficulty = difficulty;
    if (registrationStatus) query.registrationStatus = registrationStatus;
    if (featured !== undefined) query.featured = featured === 'true';
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort
    const sort = {};
    sort[sortBy] = order === 'desc' ? -1 : 1;

    // Execute query with pagination
    const skip = (page - 1) * limit;
    
    const [exams, total] = await Promise.all([
      Exam.find(query)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .select('-registrations -__v'),
      Exam.countDocuments(query)
    ]);

    // Optimize images
    const optimizedExams = exams.map(exam => {
      const examObj = formatExamResponse(exam);
      
      // Generate optimized image URLs
      if (examObj.image) {
        examObj.optimizedImages = {
          thumbnail: generateOptimizedUrl(examObj.image, 300, 200),
          medium: generateOptimizedUrl(examObj.image, 600, 400),
          large: generateOptimizedUrl(examObj.image, 1200, 800)
        };
      }
      
      return examObj;
    });

    res.status(200).json({
      success: true,
      count: exams.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      data: optimizedExams
    });
  } catch (error) {
    console.error('Get all exams error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching exams'
    });
  }
};

// Get single exam by ID
exports.getExamById = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'Exam not found'
      });
    }

    const examData = formatExamResponse(exam);
    
    // Generate optimized image URLs
    if (examData.image) {
      examData.optimizedImages = {
        thumbnail: generateOptimizedUrl(examData.image, 300, 200),
        medium: generateOptimizedUrl(examData.image, 600, 400),
        large: generateOptimizedUrl(examData.image, 1200, 800),
        original: examData.image
      };
    }

    res.status(200).json({
      success: true,
      data: examData
    });
  } catch (error) {
    console.error('Get exam by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching exam'
    });
  }
};

// Update exam
exports.updateExam = async (req, res) => {
  try {
    let exam = await Exam.findById(req.params.id);

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'Exam not found'
      });
    }

    // Store old image for cleanup
    const oldImageUrl = exam.image;
    let newImageUrl = null;
    let newImageInfo = null;

    // Handle image update
    if (req.body.image && req.body.image.startsWith('http') && req.body.image !== oldImageUrl) {
      // Upload new image from URL
      const uploadedImage = await uploadImageFromUrl(req.body.image);
      if (uploadedImage) {
        newImageUrl = uploadedImage.url;
        newImageInfo = {
          cloudinaryId: uploadedImage.public_id,
          format: uploadedImage.format,
          size: uploadedImage.bytes
        };
      }
    }

    // Prepare update data
    const updateData = {
      ...req.body,
      updatedBy: req.user?.id || 'system'
    };

    // Add image data if new image was uploaded
    if (newImageUrl) {
      updateData.image = newImageUrl;
      updateData.imageInfo = newImageInfo;
    }

    // Update exam
    exam = await Exam.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    );

    // Delete old image from Cloudinary if new image was uploaded
    if (newImageUrl && oldImageUrl && oldImageUrl !== newImageUrl) {
      const publicId = extractPublicIdFromUrl(oldImageUrl);
      if (publicId) {
        await deleteCloudinaryImage(publicId);
      }
    }

    res.status(200).json({
      success: true,
      message: 'Exam updated successfully',
      data: formatExamResponse(exam)
    });
  } catch (error) {
    console.error('Update exam error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating exam',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Delete exam
exports.deleteExam = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'Exam not found'
      });
    }

    // Delete image from Cloudinary
    if (exam.image) {
      const publicId = extractPublicIdFromUrl(exam.image);
      if (publicId) {
        await deleteCloudinaryImage(publicId);
      }
    }

    // Soft delete
    exam.isActive = false;
    exam.updatedBy = req.user?.id || 'system';
    await exam.save();

    res.status(200).json({
      success: true,
      message: 'Exam deleted successfully'
    });
  } catch (error) {
    console.error('Delete exam error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting exam'
    });
  }
};

// ======================================
// STATISTICS OPERATIONS
// ======================================

// Get exam statistics
exports.getExamStatistics = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id).select('statistics registrations name image');

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'Exam not found'
      });
    }

    const registrations = exam.registrations || [];
    const stats = exam.statistics || {};

    const registrationStats = {
      total: registrations.length,
      confirmed: registrations.filter(r => r.status === 'confirmed').length,
      pending: registrations.filter(r => r.status === 'pending').length,
      cancelled: registrations.filter(r => r.status === 'cancelled').length,
      paid: registrations.filter(r => r.paymentStatus === 'paid').length
    };

    res.status(200).json({
      success: true,
      data: {
        examName: exam.name,
        examImage: exam.image ? {
          url: exam.image,
          optimized: generateOptimizedUrl(exam.image, 400, 300)
        } : null,
        overview: {
          totalRegistrations: registrationStats.total,
          passRate: stats.passRate || 0,
          averageScore: stats.averageScore || 0,
          totalPassed: stats.totalPassed || 0,
          totalFailed: stats.totalFailed || 0
        },
        registrationStats
      }
    });
  } catch (error) {
    console.error('Get exam statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching exam statistics'
    });
  }
};

// Get system statistics
exports.getSystemStatistics = async (req, res) => {
  try {
    const [
      totalExams,
      activeExams,
      totalRegistrations,
      upcomingExams
    ] = await Promise.all([
      Exam.countDocuments(),
      Exam.countDocuments({ isActive: true }),
      Exam.aggregate([
        { $group: { _id: null, total: { $sum: '$statistics.totalRegistrations' } } }
      ]),
      Exam.countDocuments({ 
        nextExamDate: { $gte: new Date() },
        isActive: true 
      })
    ]);

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalExams,
          activeExams,
          totalRegistrations: totalRegistrations[0]?.total || 0,
          upcomingExams,
          inactiveExams: totalExams - activeExams
        }
      }
    });
  } catch (error) {
    console.error('Get system statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching system statistics'
    });
  }
};

// ======================================
// EMAIL OPERATIONS
// ======================================

// Register for exam
exports.registerForExam = async (req, res) => {
  try {
    const { name, email, phone, organization } = req.body;
    const exam = await Exam.findById(req.params.id);

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'Exam not found'
      });
    }

    if (exam.registrationStatus !== 'open') {
      return res.status(400).json({
        success: false,
        message: `Registration is ${exam.registrationStatus} for this exam`
      });
    }

    // Check if email already registered
    const existingRegistration = exam.registrations.find(
      r => r.userEmail === email
    );

    if (existingRegistration) {
      return res.status(400).json({
        success: false,
        message: 'This email is already registered for this exam'
      });
    }

    // Add registration
    exam.registrations.push({
      userId: req.user?.id || null,
      userEmail: email,
      userName: name,
      userPhone: phone,
      organization,
      registrationDate: new Date(),
      status: 'confirmed',
      paymentStatus: 'pending'
    });

    // Update registration count
    exam.statistics.totalRegistrations = exam.registrations.length;
    await exam.save();

    // Send registration confirmation email
    await sendRegistrationConfirmation(email, name, exam);

    res.status(200).json({
      success: true,
      message: 'Successfully registered for exam',
      registrationId: exam.registrations[exam.registrations.length - 1]._id,
      data: {
        examName: exam.name,
        examDate: exam.nextExamDate,
        registrationDeadline: exam.registrationDeadline,
        examImage: exam.image ? generateOptimizedUrl(exam.image, 400, 300) : null
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Error registering for exam'
    });
  }
};

// Send bulk email
exports.sendBulkEmail = async (req, res) => {
  try {
    const { subject, message } = req.body;
    const exam = await Exam.findById(req.params.id);

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'Exam not found'
      });
    }

    const registrants = exam.registrations
      .filter(r => r.status === 'confirmed' && r.userEmail)
      .map(r => r.userEmail);

    if (registrants.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No confirmed registrants found for this exam'
      });
    }

    // Send bulk email
    const result = await sendBulkEmailToRegistrants(registrants, subject, message, exam);

    res.status(200).json({
      success: true,
      message: `Email sent to ${result.successCount} recipients`,
      data: result
    });
  } catch (error) {
    console.error('Bulk email error:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending bulk email'
    });
  }
};

// ======================================
// HELPER FUNCTIONS
// ======================================

// Format exam response
function formatExamResponse(exam) {
  const examObj = exam.toObject ? exam.toObject() : exam;
  
  // Calculate days until deadline
  const today = new Date();
  const deadline = new Date(examObj.registrationDeadline);
  const daysUntilDeadline = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
  
  // Format registration status text
  let registrationStatusText = examObj.registrationStatus;
  if (examObj.registrationStatus === 'open') {
    registrationStatusText = daysUntilDeadline > 0 
      ? `Open (Closes in ${daysUntilDeadline} days)` 
      : 'Closes today';
  }

  return {
    ...examObj,
    formattedFee: examObj.fee?.amount ? `$${examObj.fee.amount}` : 'Free',
    daysUntilDeadline: daysUntilDeadline > 0 ? daysUntilDeadline : 0,
    registrationStatusText,
    isUpcoming: new Date(examObj.nextExamDate) > new Date(),
    totalRegistrations: examObj.statistics?.totalRegistrations || 0,
    imageInfo: examObj.imageInfo || null
  };
}

// Send registration confirmation email
async function sendRegistrationConfirmation(email, name, exam) {
  const examImage = exam.image ? generateOptimizedUrl(exam.image, 400, 300) : null;
  
  const mailOptions = {
    from: process.env.EMAIL_FROM || 'CSCE Exams <no-reply@csce.org>',
    to: email,
    subject: `CSCE Exam Registration Confirmation - ${exam.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2c3e50;">CSCE Exam Registration Confirmed</h2>
        <p>Dear ${name},</p>
        
        <p>Your registration for the <strong>${exam.name}</strong> has been confirmed.</p>
        
        ${examImage ? `
          <div style="text-align: center; margin: 20px 0;">
            <img src="${examImage}" alt="${exam.name}" style="max-width: 400px; height: auto; border-radius: 8px;" />
          </div>
        ` : ''}
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #3498db; margin-top: 0;">Exam Details:</h3>
          <ul style="list-style: none; padding: 0;">
            <li style="margin-bottom: 10px;"><strong>📅 Exam Date:</strong> ${new Date(exam.nextExamDate).toLocaleDateString()}</li>
            <li style="margin-bottom: 10px;"><strong>⏱️ Duration:</strong> ${exam.duration}</li>
            <li style="margin-bottom: 10px;"><strong>💰 Fee:</strong> ${exam.fee?.amount ? `$${exam.fee.amount}` : 'Free'}</li>
          </ul>
        </div>
        
        <p>Best regards,<br><strong>CSCE Examination Board</strong></p>
      </div>
    `
  };

  try {
    await emailTransporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending registration confirmation:', error);
    return false;
  }
}

// Send bulk email to registrants
async function sendBulkEmailToRegistrants(emails, subject, message, exam) {
  const results = {
    successCount: 0,
    failedCount: 0,
    failedEmails: []
  };

  for (const email of emails) {
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'CSCE Exams <no-reply@csce.org>',
      to: email,
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2c3e50;">${subject}</h2>
          <p><strong>Regarding:</strong> ${exam.name}</p>
          <hr>
          <div style="line-height: 1.6;">
            ${message}
          </div>
          <hr>
          <p style="color: #666; font-size: 12px;">
            This message was sent to all registered participants of ${exam.name}.
          </p>
        </div>
      `
    };

    try {
      await emailTransporter.sendMail(mailOptions);
      results.successCount++;
    } catch (error) {
      console.error(`Error sending email to ${email}:`, error);
      results.failedCount++;
      results.failedEmails.push(email);
    }
  }

  return results;
}