// controllers/testimonialController.js

const Testimonial = require('../models/Testimonial');
const cloudinary = require('../cloudinary/cloudinary');

// Get all testimonials
exports.getAllTestimonials = async (req, res) => {
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
    console.error('Get testimonials error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching testimonials'
    });
  }
};

// Create testimonial
exports.createTestimonial = async (req, res) => {
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
    
    console.log('✅ Testimonial created:', testimonial);

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
exports.updateTestimonial = async (req, res) => {
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

    // Handle image upload if new image provided
    if (req.file) {
      // First, get the current testimonial to delete old image
      const testimonial = await Testimonial.findById(id);
      
      if (testimonial.image.public_id) {
        await cloudinary.uploader.destroy(testimonial.image.public_id);
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
    console.error('Update testimonial error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Delete testimonial
exports.deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;

    const testimonial = await Testimonial.findById(id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }

    // Delete image from Cloudinary
    if (testimonial.image.public_id) {
      await cloudinary.uploader.destroy(testimonial.image.public_id);
    }

    await testimonial.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Testimonial deleted successfully'
    });
  } catch (error) {
    console.error('Delete testimonial error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Approve testimonial
exports.approveTestimonial = async (req, res) => {
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

    res.status(200).json({
      success: true,
      data: testimonial
    });
  } catch (error) {
    console.error('Approve testimonial error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get single testimonial
exports.getTestimonial = async (req, res) => {
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
    console.error('Get testimonial error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Overall statistics
exports.getTestimonialStats = async (req, res) => {
  try {
    const total = await Testimonial.countDocuments();
    const approved = await Testimonial.countDocuments({ status: 'approved' });
    const pending = await Testimonial.countDocuments({ status: 'pending' });
    const rejected = await Testimonial.countDocuments({ status: 'rejected' });

    const avgRating = await Testimonial.aggregate([
      { $match: { status: 'approved' } },
      { $group: { _id: null, average: { $avg: '$rating' } } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        total,
        approved,
        pending,
        rejected,
        averageRating: avgRating[0]?.average || 0,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Statistics by country
exports.getStatsByCountry = async (req, res) => {
  try {
    const stats = await Testimonial.aggregate([
      { $match: { status: 'approved' } },
      {
        $group: {
          _id: '$country',
          count: { $sum: 1 },
          averageRating: { $avg: '$rating' },
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Statistics by university
exports.getStatsByUniversity = async (req, res) => {
  try {
    const stats = await Testimonial.aggregate([
      { $match: { status: 'approved' } },
      {
        $group: {
          _id: '$university',
          count: { $sum: 1 },
          averageRating: { $avg: '$rating' },
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
