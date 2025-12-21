const Testimonial = require('../models/Testimonial');
const cloudinary = require('../cloudinary/cloudinary');
const { sendEmail, emailTemplates } = require('../mails/sendEmail');
const testimonialValidation = require('../validators/testimonyValidation');

// @desc    Get all testimonials
// @route   GET /api/testimonials
// @access  Public
exports.getTestimonials = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      status = 'approved',
      verified,
      sort = 'newest',
      search = '' 
    } = req.query;

    // Validate query
    const { error } = testimonialValidation.queryValidation.validate(req.query);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    // Build query
    let query = {};
    
    // Status filter
    if (status !== 'all') {
      query.status = status;
    }
    
    // Verified filter
    if (verified !== undefined) {
      query.verified = verified === 'true';
    }
    
    // Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { university: { $regex: search, $options: 'i' } },
        { program: { $regex: search, $options: 'i' } },
        { country: { $regex: search, $options: 'i' } },
      ];
    }

    // Sort options
    let sortOption = {};
    switch (sort) {
      case 'newest':
        sortOption.createdAt = -1;
        break;
      case 'oldest':
        sortOption.createdAt = 1;
        break;
      case 'highest-rating':
        sortOption.rating = -1;
        break;
      case 'lowest-rating':
        sortOption.rating = 1;
        break;
      default:
        sortOption.createdAt = -1;
    }

    // Execute query
    const testimonials = await Testimonial.find(query)
      .sort(sortOption)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Get total count
    const total = await Testimonial.countDocuments(query);

    res.status(200).json({
      success: true,
      count: testimonials.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: testimonials,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// @desc    Get single testimonial
// @route   GET /api/testimonials/:id
// @access  Public
exports.getTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found',
      });
    }

    res.status(200).json({
      success: true,
      data: testimonial,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// @desc    Create new testimonial
// @route   POST /api/testimonials
// @access  Public
// Create new testimonial
const handleCreate = async () => {
  try {
    // Validate required fields
    const requiredFields = ['name', 'email', 'country', 'university', 'program', 'duration', 'content'];
    const missingFields = requiredFields.filter(field => !newTestimonial[field] || newTestimonial[field].trim() === '');
    
    if (missingFields.length > 0) {
      showModal('error', 'Validation Error', `Missing required fields: ${missingFields.join(', ')}`);
      return;
    }

    // Validate content length
    if (newTestimonial.content.length < 50) {
      showModal('error', 'Validation Error', 'Content must be at least 50 characters long');
      return;
    }

    // Validate image
    if (!imageFile) {
      showModal('error', 'Image Required', 'Please upload a profile image');
      return;
    }

    // Validate image type and size
    const validImageTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
    if (!validImageTypes.includes(imageFile.type)) {
      showModal('error', 'Invalid Image', 'Please upload a valid image (JPEG, PNG, JPG, GIF)');
      return;
    }

    if (imageFile.size > 5 * 1024 * 1024) { // 5MB limit
      showModal('error', 'Image Too Large', 'Image size should be less than 5MB');
      return;
    }

    const formData = new FormData();
    
    // Add all fields to formData
    Object.keys(newTestimonial).forEach(key => {
      if (key !== 'image') {
        formData.append(key, newTestimonial[key]);
      }
    });

    // Add image - CRITICAL: Must be 'image' field (matches multer config)
    formData.append('image', imageFile);

    console.log('Creating testimonial with:', {
      name: newTestimonial.name,
      email: newTestimonial.email,
      hasImage: !!imageFile,
      imageName: imageFile.name,
      imageSize: imageFile.size
    });

    const response = await axios.post(
      `${API_URL}/testimonials`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    if (response.data.success) {
      showModal('success', 'Create Successful', 'Testimonial has been created successfully!');
      fetchTestimonials();
      setIsAddModalOpen(false);
      resetNewTestimonialForm();
      setImageFile(null);
      setImagePreview('');
    }
  } catch (err) {
    console.error('Create error details:', {
      message: err.message,
      response: err.response?.data,
      status: err.response?.status
    });
    
    if (err.response?.status === 400 && err.response?.data?.message === 'Please upload an image') {
      showModal('error', 'Image Required', 'Please select a profile image to upload');
    } else if (err.response?.data?.message) {
      showModal('error', 'Create Failed', err.response.data.message);
    } else {
      showModal('error', 'Server Error', 'Failed to connect to server. Please try again.');
    }
  }
};

// @desc    Update testimonial
// @route   PUT /api/testimonials/:id
// @access  Private/Admin
exports.updateTestimonial = async (req, res) => {
  try {
    // Validate input
    const { error } = testimonialValidation.updateTestimonial.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    let testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found',
      });
    }

    // Check if new image is uploaded
    if (req.file) {
      // Delete old image from Cloudinary
      await cloudinary.uploader.destroy(testimonial.image.public_id);

      // Update with new image
      testimonial.image = {
        public_id: req.file.public_id,
        url: req.file.path,
      };
    }

    // Update other fields
    Object.keys(req.body).forEach(key => {
      testimonial[key] = req.body[key];
    });

    await testimonial.save();

    // Send approval email if status changed to approved
    if (req.body.status === 'approved' && testimonial.status !== 'approved') {
      await sendEmail({
        email: testimonial.email,
        subject: 'Your Testimonial Has Been Approved!',
        html: emailTemplates.testimonialApproved(testimonial.name),
      });
    }

    res.status(200).json({
      success: true,
      message: 'Testimonial updated successfully',
      data: testimonial,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// @desc    Delete testimonial
// @route   DELETE /api/testimonials/:id
// @access  Private/Admin
exports.deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found',
      });
    }

    // Delete image from Cloudinary
    await cloudinary.uploader.destroy(testimonial.image.public_id);

    // Delete from database
    await testimonial.remove();

    res.status(200).json({
      success: true,
      message: 'Testimonial deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// @desc    Approve testimonial
// @route   PUT /api/testimonials/:id/approve
// @access  Private/Admin
exports.approveTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found',
      });
    }

    testimonial.status = 'approved';
    testimonial.verified = true;
    await testimonial.save();

    // Send approval email
    await sendEmail({
      email: testimonial.email,
      subject: 'Your Testimonial Has Been Approved!',
      html: emailTemplates.testimonialApproved(testimonial.name),
    });

    res.status(200).json({
      success: true,
      message: 'Testimonial approved successfully',
      data: testimonial,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// @desc    Get statistics
// @route   GET /api/testimonials/stats
// @access  Private/Admin
exports.getStatistics = async (req, res) => {
  try {
    const total = await Testimonial.countDocuments();
    const approved = await Testimonial.countDocuments({ status: 'approved' });
    const pending = await Testimonial.countDocuments({ status: 'pending' });
    const rejected = await Testimonial.countDocuments({ status: 'rejected' });
    
    const avgRating = await Testimonial.aggregate([
      { $match: { status: 'approved' } },
      { $group: { _id: null, avgRating: { $avg: '$rating' } } }
    ]);

    const byCountry = await Testimonial.aggregate([
      { $match: { status: 'approved' } },
      { $group: { _id: '$country', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    res.status(200).json({
      success: true,
      data: {
        total,
        approved,
        pending,
        rejected,
        avgRating: avgRating[0]?.avgRating || 0,
        topCountries: byCountry,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};