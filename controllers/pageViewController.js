const ViewTracking = require('../models/PageView');

// Helper function to get client IP
const getClientIp = (req) => {
  const ip = req.ip || 
             req.headers['x-forwarded-for']?.split(',')[0] || 
             req.headers['x-real-ip'] ||
             req.connection.remoteAddress ||
             req.socket.remoteAddress;
  
  return ip ? ip.replace(/^::ffff:/, '').trim() : 'unknown';
};

// @desc    Track a page view
// @route   POST /api/views/track
// @access  Public
exports.trackView = async (req, res) => {
  try {
    const clientIp = getClientIp(req);

    // Create simple view tracking record
    const view = await ViewTracking.create({
      ip: clientIp,
      timestamp: new Date()
    });

    res.status(201).json({
      success: true,
      message: 'View tracked successfully',
      data: {
        id: view._id,
        ip: clientIp,
        timestamp: view.timestamp
      }
    });
  } catch (error) {
    console.error('View tracking error:', error);
    res.status(500).json({
      success: false,
      message: 'Error tracking view'
    });
  }
};

// @desc    Get view statistics
// @route   GET /api/views/stats
// @access  Private/Admin
exports.getViewStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let matchStage = {};
    
    // Date filtering
    if (startDate || endDate) {
      matchStage.timestamp = {};
      if (startDate) matchStage.timestamp.$gte = new Date(startDate);
      if (endDate) matchStage.timestamp.$lte = new Date(endDate);
    }

    // Get total views
    const totalViews = await ViewTracking.countDocuments(matchStage);
    
    // Get unique IPs
    const uniqueIps = await ViewTracking.aggregate([
      { $match: matchStage },
      { $group: { _id: '$ip' } },
      { $count: 'uniqueIps' }
    ]);

    // Get views by day
    const viewsByDay = await ViewTracking.aggregate([
      { $match: matchStage },
      { 
        $group: {
          _id: {
            year: { $year: '$timestamp' },
            month: { $month: '$timestamp' },
            day: { $dayOfMonth: '$timestamp' }
          },
          count: { $sum: 1 },
          uniqueIps: { $addToSet: '$ip' }
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
          },
          uniqueIpCount: { $size: '$uniqueIps' }
        }
      },
      { $sort: { '_id': 1 } },
      { $project: { uniqueIps: 0 } }
    ]);

    // Get top IPs (for monitoring)
    const topIps = await ViewTracking.aggregate([
      { $match: matchStage },
      { $group: { 
        _id: '$ip', 
        count: { $sum: 1 },
        firstSeen: { $min: '$timestamp' },
        lastSeen: { $max: '$timestamp' }
      }},
      { $sort: { count: -1 } },
      { $limit: 20 }
    ]);

    res.status(200).json({
      success: true,
      data: {
        summary: {
          totalViews,
          uniqueVisitors: uniqueIps[0]?.uniqueIps || 0
        },
        viewsByDay,
        topIps,
        timeRange: {
          startDate: startDate || 'beginning',
          endDate: endDate || 'now'
        }
      }
    });
  } catch (error) {
    console.error('Get view stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching view statistics'
    });
  }
};

// @desc    Get real-time view count
// @route   GET /api/views/realtime
// @access  Private/Admin
exports.getRealtimeStats = async (req, res) => {
  try {
    const now = new Date();
    const lastHour = new Date(now.getTime() - 60 * 60 * 1000);
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // Get counts for different time periods
    const [lastHourViews, last24HourViews, currentMonthViews] = await Promise.all([
      ViewTracking.countDocuments({ timestamp: { $gte: lastHour } }),
      ViewTracking.countDocuments({ timestamp: { $gte: last24Hours } }),
      ViewTracking.countDocuments({ 
        timestamp: { 
          $gte: new Date(now.getFullYear(), now.getMonth(), 1)
        }
      })
    ]);

    // Get unique visitors in last 24 hours
    const uniqueLast24Hours = await ViewTracking.aggregate([
      { $match: { timestamp: { $gte: last24Hours } } },
      { $group: { _id: '$ip' } },
      { $count: 'uniqueIps' }
    ]);

    res.status(200).json({
      success: true,
      data: {
        lastHour: lastHourViews,
        last24Hours: last24HourViews,
        currentMonth: currentMonthViews,
        uniqueVisitors24h: uniqueLast24Hours[0]?.uniqueIps || 0,
        serverTime: now
      }
    });
  } catch (error) {
    console.error('Get realtime stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching real-time statistics'
    });
  }
};