const PageView = require('../models/PageView');

// Track page view
exports.trackPageView = async (req, res) => {
  try {
    const {
      ip,
      page,
      route,
      routeName,
      routeType,
      timestamp,
    } = req.body;

    const pageView = new PageView({
      ip,
      page,
      route,
      routeName,
      routeType,
      timestamp: timestamp ? new Date(timestamp) : new Date(),
    });

    await pageView.save();

    res.status(201).json({
      success: true,
      message: 'Page view tracked successfully',
    });
  } catch (error) {
    console.error('Error tracking page view:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to track page view',
    });
  }
};

// Get all page views
exports.getPageViews = async (req, res) => {
  try {
    const { startDate, endDate, route, routeType, page = 1, limit = 50 } = req.query;
    
    const query = {};
    
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }
    
    if (route) query.route = route;
    if (routeType) query.routeType = routeType;
    
    const skip = (page - 1) * limit;
    
    const pageViews = await PageView.find(query)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await PageView.countDocuments(query);
    
    res.json({
      success: true,
      data: pageViews,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching page views:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch page views',
    });
  }
};

// Get statistics
exports.getStatistics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const matchStage = {};
    
    if (startDate || endDate) {
      matchStage.timestamp = {};
      if (startDate) matchStage.timestamp.$gte = new Date(startDate);
      if (endDate) matchStage.timestamp.$lte = new Date(endDate);
    }
    
    const stats = await PageView.aggregate([
      { $match: matchStage },
      {
        $facet: {
          totalViews: [{ $count: 'count' }],
          
          uniqueVisitors: [
            { $group: { _id: '$ip' } },
            { $count: 'count' }
          ],
          
          viewsByRoute: [
            { $group: { _id: '$route', count: { $sum: 1 }, routeName: { $first: '$routeName' } } },
            { $sort: { count: -1 } },
          ],
          
          viewsByRouteType: [
            { $group: { _id: '$routeType', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
          ],
          
          hourlyDistribution: [
            {
              $group: {
                _id: { $hour: '$timestamp' },
                count: { $sum: 1 }
              }
            },
            { $sort: { _id: 1 } }
          ],
        }
      }
    ]);
    
    res.json({
      success: true,
      data: {
        totalViews: stats[0].totalViews[0]?.count || 0,
        uniqueVisitors: stats[0].uniqueVisitors[0]?.count || 0,
        viewsByRoute: stats[0].viewsByRoute,
        viewsByRouteType: stats[0].viewsByRouteType,
        hourlyDistribution: stats[0].hourlyDistribution,
      },
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
    });
  }
};

// Get real-time statistics
exports.getRealTimeStats = async (req, res) => {
  try {
    const { hours = 24 } = req.query;
    const hoursAgo = new Date(Date.now() - hours * 60 * 60 * 1000);
    
    const recentStats = await PageView.aggregate([
      {
        $match: {
          timestamp: { $gte: hoursAgo }
        }
      },
      {
        $facet: {
          totalViews: [{ $count: 'count' }],
          topPages: [
            { $group: { _id: '$route', count: { $sum: 1 }, routeName: { $first: '$routeName' } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
          ],
        }
      }
    ]);
    
    const activeUsers = await PageView.distinct('ip', {
      timestamp: { $gte: new Date(Date.now() - 15 * 60 * 1000) }
    });
    
    res.json({
      success: true,
      data: {
        timeRange: `${hours} hours`,
        totalViews: recentStats[0].totalViews[0]?.count || 0,
        topPages: recentStats[0].topPages,
        activeUsers: activeUsers.length,
      },
    });
  } catch (error) {
    console.error('Error fetching real-time stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch real-time statistics',
    });
  }
};

// Get route statistics
exports.getRouteStats = async (req, res) => {
  try {
    const { route } = req.params;
    
    const stats = await PageView.aggregate([
      { $match: { route } },
      {
        $group: {
          _id: '$route',
          totalViews: { $sum: 1 },
          routeName: { $first: '$routeName' },
          firstView: { $min: '$timestamp' },
          lastView: { $max: '$timestamp' }
        }
      }
    ]);
    
    const routeData = stats[0] || {};
    
    res.json({
      success: true,
      data: {
        route: routeData._id || route,
        routeName: routeData.routeName || 'Unknown',
        totalViews: routeData.totalViews || 0,
        firstView: routeData.firstView,
        lastView: routeData.lastView,
      },
    });
  } catch (error) {
    console.error('Error fetching route statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch route statistics',
    });
  }
};