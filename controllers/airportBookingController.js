const AirportBooking = require('../models/AirportBooking');
const emailService = require('../mails/sendEmail');
const { validationResult } = require('express-validator');

// Get all bookings
exports.getAllBookings = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      status, 
      serviceType,
      startDate,
      endDate,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const query = {};
    
    if (status) query.status = status;
    if (serviceType) query.serviceType = serviceType;
    
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const bookings = await AirportBooking.find(query)
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await AirportBooking.countDocuments(query);

    res.status(200).json({
      success: true,
      data: bookings,
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
      message: 'Error fetching bookings',
      error: error.message
    });
  }
};

// Get single booking
exports.getBooking = async (req, res) => {
  try {
    const booking = await AirportBooking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching booking',
      error: error.message
    });
  }
};

// Create booking
exports.createBooking = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const booking = new AirportBooking(req.body);
    
    // Calculate total amount based on service type and passengers
    const basePrices = {
      standard: 50,
      vip_service: 150,
      executive: 100,
      family: 75,
      group: 40
    };

    const basePrice = basePrices[booking.serviceType] || 50;
    booking.totalAmount = basePrice * booking.numberOfPassengers;
    booking.statistics.totalRevenue = booking.totalAmount;

    await booking.save();

    // Send confirmation email
    try {
      await emailService.sendBookingConfirmation(booking);
      await booking.incrementEmailCount();
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
    }

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating booking',
      error: error.message
    });
  }
};

// Update booking
exports.updateBooking = async (req, res) => {
  try {
    const booking = await AirportBooking.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Booking updated successfully',
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating booking',
      error: error.message
    });
  }
};

// Delete booking
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await AirportBooking.findByIdAndDelete(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Booking deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting booking',
      error: error.message
    });
  }
};

// Get statistics
exports.getStatistics = async (req, res) => {
  try {
    const statistics = await AirportBooking.getStatistics();
    
    // Calculate additional statistics
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));

    const monthlyStats = await AirportBooking.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfMonth }
        }
      },
      {
        $group: {
          _id: null,
          monthlyBookings: { $sum: 1 },
          monthlyRevenue: { $sum: '$totalAmount' }
        }
      }
    ]);

    const weeklyStats = await AirportBooking.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfWeek }
        }
      },
      {
        $group: {
          _id: null,
          weeklyBookings: { $sum: 1 },
          weeklyRevenue: { $sum: '$totalAmount' }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        ...statistics,
        timeframeStats: {
          monthly: monthlyStats[0] || { monthlyBookings: 0, monthlyRevenue: 0 },
          weekly: weeklyStats[0] || { weeklyBookings: 0, weeklyRevenue: 0 }
        },
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

// Send email
exports.sendEmail = async (req, res) => {
  try {
    const { bookingId, emailType, customMessage } = req.body;

    const booking = await AirportBooking.findById(bookingId);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    let emailResult;
    
    switch (emailType) {
      case 'confirmation':
        emailResult = await emailService.sendBookingConfirmation(booking, customMessage);
        break;
      case 'reminder':
        emailResult = await emailService.sendReminderEmail(booking, customMessage);
        break;
      case 'cancellation':
        emailResult = await emailService.sendCancellationEmail(booking, customMessage);
        break;
      case 'update':
        emailResult = await emailService.sendUpdateEmail(booking, customMessage);
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid email type'
        });
    }

    // Increment email count
    await booking.incrementEmailCount();

    res.status(200).json({
      success: true,
      message: 'Email sent successfully',
      data: {
        emailResult,
        emailCount: booking.statistics.emailsSent
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

// Update booking status
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const booking = await AirportBooking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Send status update email
    try {
      await emailService.sendStatusUpdateEmail(booking, status);
      await booking.incrementEmailCount();
    } catch (emailError) {
      console.error('Status email failed:', emailError);
    }

    res.status(200).json({
      success: true,
      message: 'Status updated successfully',
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating status',
      error: error.message
    });
  }
};

// Search bookings
exports.searchBookings = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const bookings = await AirportBooking.find({
      $or: [
        { bookingReference: { $regex: query, $options: 'i' } },
        { firstName: { $regex: query, $options: 'i' } },
        { lastName: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
        { flightNumber: { $regex: query, $options: 'i' } }
      ]
    }).limit(20);

    res.status(200).json({
      success: true,
      data: bookings,
      count: bookings.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error searching bookings',
      error: error.message
    });
  }
};

// Bulk operations
exports.bulkUpdate = async (req, res) => {
  try {
    const { ids, updates } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid IDs array'
      });
    }

    const result = await AirportBooking.updateMany(
      { _id: { $in: ids } },
      updates,
      { runValidators: true }
    );

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