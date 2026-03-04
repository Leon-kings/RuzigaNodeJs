

const ViewTracking = require('../models/PageView');

/* =====================================================
   HELPER FUNCTION TO GET REAL CLIENT IP
   Handles proxies, ::ffff: prefix, and real IPv4
===================================================== */
const getClientIp = (req) => {
  const forwarded = req.headers['x-forwarded-for'];
  let ip =
    forwarded?.split(',')[0] || 
    req.headers['x-real-ip'] ||
    req.socket.remoteAddress ||
    req.connection?.remoteAddress ||
    req.ip;

  // Convert IPv6-mapped IPv4 (::ffff:192.168.1.1)
  if (ip?.startsWith('::ffff:')) ip = ip.replace('::ffff:', '');

  return ip ? ip.trim() : 'unknown';
};

/* =====================================================
   TRACK VIEW
   Only records if IP does not exist
===================================================== */
// @route   POST /api/views/track
exports.trackView = async (req, res) => {
  try {
    const ip = getClientIp(req);

    if (!ip || ip === 'unknown') {
      return res.status(400).json({
        success: false,
        message: 'Unable to detect IP address'
      });
    }

    // Check if this IP is already recorded
    const existingView = await ViewTracking.findOne({ ip });
    if (existingView) {
      return res.status(200).json({
        success: true,
        message: 'View already recorded for this IP',
        data: existingView
      });
    }

    // Record new view
    const view = await ViewTracking.create({
      ip,
      timestamp: new Date()
    });

    res.status(201).json({
      success: true,
      data: view
    });
  } catch (error) {
    console.error('Track view error:', error);
    res.status(500).json({
      success: false,
      message: 'Error tracking view'
    });
  }
};

/* =====================================================
   GET ALL VIEWS
===================================================== */
// @route   GET /api/views
// exports.getAllViews = async (req, res) => {
//   try {
//     const { page = 1, limit = 20, ip, startDate, endDate } = req.query;

//     const query = {};

//     if (ip) query.ip = ip;
//     if (startDate || endDate) {
//       query.timestamp = {};
//       if (startDate) query.timestamp.$gte = new Date(startDate);
//       if (endDate) query.timestamp.$lte = new Date(endDate);
//     }

//     const views = await ViewTracking.find(query)
//       .sort({ timestamp: -1 })
//       .skip((page - 1) * limit)
//       .limit(Number(limit));

//     const total = await ViewTracking.countDocuments(query);

//     res.status(200).json({
//       success: true,
//       data: views,
//       pagination: {
//         total,
//         page: Number(page),
//         pages: Math.ceil(total / limit)
//       }
//     });
//   } catch (error) {
//     console.error('Get all views error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching views'
//     });
//   }
// };
exports.getAllViews = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      ip, 
      startDate, 
      endDate,
      showOnlyLastWeek = false // New parameter
    } = req.query;

    const query = {};

    // IP filter
    if (ip) query.ip = ip;
    
    // Date range filter
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }
    
    // Show only last 7 days filter
    if (showOnlyLastWeek === 'true' || showOnlyLastWeek === true) {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      
      if (query.timestamp) {
        query.timestamp.$gte = new Date(Math.max(
          query.timestamp.$gte ? query.timestamp.$gte.getTime() : 0,
          oneWeekAgo.getTime()
        ));
      } else {
        query.timestamp = { $gte: oneWeekAgo };
      }
    }

    const views = await ViewTracking.find(query)
      .sort({ timestamp: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await ViewTracking.countDocuments(query);

    res.status(200).json({
      success: true,
      data: views,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get all views error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching views'
    });
  }
};


// Auto-delete IPs older than 7 days
exports.autoDeleteOldIPs = async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const result = await ViewTracking.deleteMany({
      timestamp: { $lt: sevenDaysAgo }
    });
    
    res.status(200).json({
      success: true,
      message: `Successfully deleted ${result.deletedCount} IPs older than 7 days`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Auto delete old IPs error:', error);
    res.status(500).json({
      success: false,
      message: 'Error auto-deleting old IPs'
    });
  }
};

// Bulk delete with filters
exports.bulkDeleteIPs = async (req, res) => {
  try {
    const { ip, startDate, endDate, olderThan7Days } = req.query;
    
    const query = {};
    
    // IP filter
    if (ip) query.ip = ip;
    
    // Date range filter
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }
    
    // Delete IPs older than 7 days if specified
    if (olderThan7Days === 'true' || olderThan7Days === true) {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      query.timestamp = { ...query.timestamp, $lt: sevenDaysAgo };
    }
    
    const result = await ViewTracking.deleteMany(query);
    
    res.status(200).json({
      success: true,
      message: `Successfully deleted ${result.deletedCount} IP addresses`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Bulk delete IPs error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting IPs in bulk'
    });
  }
};


/* =====================================================
   VIEW STATISTICS
===================================================== */
// @route   GET /api/views/stats
exports.getViewStats = async (req, res) => {
  try {
    const totalViews = await ViewTracking.countDocuments();

    const uniqueVisitors = await ViewTracking.aggregate([
      { $group: { _id: '$ip' } },
      { $count: 'count' }
    ]);

    const viewsByDay = await ViewTracking.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$timestamp' }
          },
          views: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalViews,
        uniqueVisitors: uniqueVisitors[0]?.count || 0,
        viewsByDay
      }
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics'
    });
  }
};

/* =====================================================
   REALTIME STATS
===================================================== */
// @route   GET /api/views/realtime
exports.getRealtimeStats = async (req, res) => {
  try {
    const now = new Date();
    const lastHour = new Date(now.getTime() - 60 * 60 * 1000);
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const [lastHourViews, last24hViews] = await Promise.all([
      ViewTracking.countDocuments({ timestamp: { $gte: lastHour } }),
      ViewTracking.countDocuments({ timestamp: { $gte: last24Hours } })
    ]);

    res.status(200).json({
      success: true,
      data: {
        lastHour: lastHourViews,
        last24Hours: last24hViews,
        serverTime: now
      }
    });
  } catch (error) {
    console.error('Realtime stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching realtime stats'
    });
  }
};

/* =====================================================
   DELETE SINGLE VIEW
===================================================== */
// @route   DELETE /api/views/:id
exports.deleteView = async (req, res) => {
  try {
    const view = await ViewTracking.findByIdAndDelete(req.params.id);

    if (!view) {
      return res.status(404).json({
        success: false,
        message: 'View not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'View deleted'
    });
  } catch (error) {
    console.error('Delete view error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting view'
    });
  }
};

/* =====================================================
   DELETE BY IP
===================================================== */
// @route   DELETE /api/views/ip/:ip
exports.deleteViewsByIp = async (req, res) => {
  try {
    const result = await ViewTracking.deleteMany({ ip: req.params.ip });

    res.status(200).json({
      success: true,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Delete by IP error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting views'
    });
  }
};

/* =====================================================
   DELETE ALL VIEWS
===================================================== */
// @route   DELETE /api/views
exports.deleteAllViews = async (req, res) => {
  try {
    const result = await ViewTracking.deleteMany({});

    res.status(200).json({
      success: true,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Delete all views error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting all views'
    });
  }
};
