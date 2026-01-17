const AssistanceRequest = require('../models/AssistanceRequest');
const emailService = require('../mails/sendEmail');

class AssistanceController {
  // ========== CREATE ==========
  async createRequest(req, res) {
    try {
      const {
        name,
        email,
        issueType = "technical",
        message,
        pageUrl
      } = req.body;

      // Validate required fields
      const errors = [];
      if (!name?.trim()) errors.push('Name is required');
      if (!email?.trim()) errors.push('Email is required');
      if (!message?.trim()) errors.push('Message is required');
      if (!pageUrl?.trim()) errors.push('Page URL is required');
      
      if (errors.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors
        });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid email address'
        });
      }

      // Determine priority
      const priority = this.determinePriority(issueType, message);

      // Create request
      const request = new AssistanceRequest({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        issueType,
        message: message.trim(),
        pageUrl: pageUrl.trim(),
        ip: req.ip,
        userAgent: req.headers['user-agent'],
        priority
      });

      await request.save();

      // Send emails (fire and forget)
      this.sendInitialEmails(request);

      res.status(201).json({
        success: true,
        message: 'Assistance request created successfully',
        data: this.formatResponse(request)
      });

    } catch (error) {
      console.error('Create request error:', error);
      
      if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map(err => err.message);
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to create assistance request',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // ========== READ (Multiple) ==========
  async getRequests(req, res) {
    try {
      const {
        status,
        issueType,
        priority,
        email,
        assignedTo,
        startDate,
        endDate,
        search,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        page = 1,
        limit = 20
      } = req.query;

      // Build query
      const query = {};

      if (status) query.status = status;
      if (issueType) query.issueType = issueType;
      if (priority) query.priority = priority;
      if (email) query.email = email.toLowerCase();
      if (assignedTo) query.assignedTo = assignedTo;

      // Date range
      if (startDate || endDate) {
        query.createdAt = {};
        if (startDate) query.createdAt.$gte = new Date(startDate);
        if (endDate) query.createdAt.$lte = new Date(endDate);
      }

      // Search
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { message: { $regex: search, $options: 'i' } },
          { notes: { $regex: search, $options: 'i' } }
        ];
      }

      // Calculate pagination
      const skip = (page - 1) * limit;
      const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

      // Execute query with pagination
      const [requests, total] = await Promise.all([
        AssistanceRequest.find(query)
          .sort(sort)
          .skip(skip)
          .limit(parseInt(limit))
          .select('-__v'),
        AssistanceRequest.countDocuments(query)
      ]);

      res.json({
        success: true,
        data: requests.map(req => this.formatResponse(req)),
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / limit),
          hasNext: page * limit < total,
          hasPrev: page > 1
        }
      });

    } catch (error) {
      console.error('Get requests error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch assistance requests'
      });
    }
  }
async getRequestsByEmail(req, res) {
  try {
    const {
      issueType,
      priority,
      status,
      assignedTo,
      startDate,
      endDate,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 20
    } = req.query;

    const { email } = req.params;

    // Build query
    const query = {
      email: email.toLowerCase()
    };

    if (status) query.status = status;
    if (issueType) query.issueType = issueType;
    if (priority) query.priority = priority;
    if (assignedTo) query.assignedTo = assignedTo;

    // Date range
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    // Search
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } },
        { notes: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    const [requests, total] = await Promise.all([
      AssistanceRequest.find(query)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .select('-__v'),
      AssistanceRequest.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: requests.map(req => this.formatResponse(req)),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Get requests by email error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch assistance requests by email'
    });
  }
}

  // ========== READ (Single) ==========
  async getRequest(req, res) {
    try {
      const { id } = req.params;

      const request = await AssistanceRequest.findById(id).select('-__v');

      if (!request) {
        return res.status(404).json({
          success: false,
          message: 'Assistance request not found'
        });
      }

      res.json({
        success: true,
        data: this.formatResponse(request)
      });

    } catch (error) {
      console.error('Get request error:', error);
      
      if (error.name === 'CastError') {
        return res.status(400).json({
          success: false,
          message: 'Invalid request ID'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to fetch assistance request'
      });
    }
  }

  // ========== UPDATE ==========
  async updateRequest(req, res) {
    try {
      const { id } = req.params;
      const {
        status,
        priority,
        assignedTo,
        notes,
        resolutionNotes
      } = req.body;

      const request = await AssistanceRequest.findById(id);

      if (!request) {
        return res.status(404).json({
          success: false,
          message: 'Assistance request not found'
        });
      }

      // Store old status for email notification
      const oldStatus = request.status;

      // Update fields
      const updates = {};
      if (status && request.status !== status) {
        updates.status = status;
        if (status === 'resolved' && !request.resolvedAt) {
          updates.resolvedAt = new Date();
        }
      }
      if (priority) updates.priority = priority;
      if (assignedTo !== undefined) updates.assignedTo = assignedTo;
      if (notes !== undefined) updates.notes = notes;
      if (resolutionNotes !== undefined) updates.resolutionNotes = resolutionNotes;

      // Apply updates
      Object.assign(request, updates);
      await request.save();

      // Send status update email if status changed
      if (status && status !== oldStatus) {
        emailService.sendStatusUpdate(request, oldStatus).catch(console.error);
      }

      res.json({
        success: true,
        message: 'Assistance request updated successfully',
        data: this.formatResponse(request)
      });

    } catch (error) {
      console.error('Update request error:', error);
      
      if (error.name === 'CastError') {
        return res.status(400).json({
          success: false,
          message: 'Invalid request ID'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to update assistance request'
      });
    }
  }

  // ========== DELETE ==========
  async deleteRequest(req, res) {
    try {
      const { id } = req.params;

      const request = await AssistanceRequest.findByIdAndDelete(id);

      if (!request) {
        return res.status(404).json({
          success: false,
          message: 'Assistance request not found'
        });
      }

      res.json({
        success: true,
        message: 'Assistance request deleted successfully',
        data: { id: request._id }
      });

    } catch (error) {
      console.error('Delete request error:', error);
      
      if (error.name === 'CastError') {
        return res.status(400).json({
          success: false,
          message: 'Invalid request ID'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to delete assistance request'
      });
    }
  }

  // ========== STATISTICS ==========
  async getStatistics(req, res) {
    try {
      const { startDate, endDate } = req.query;

      const matchStage = {};
      if (startDate || endDate) {
        matchStage.createdAt = {};
        if (startDate) matchStage.createdAt.$gte = new Date(startDate);
        if (endDate) matchStage.createdAt.$lte = new Date(endDate);
      }

      const stats = await AssistanceRequest.aggregate([
        { $match: matchStage },
        {
          $facet: {
            // Overview stats
            overview: [
              {
                $group: {
                  _id: null,
                  total: { $sum: 1 },
                  pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
                  inProgress: { $sum: { $cond: [{ $eq: ['$status', 'in_progress'] }, 1, 0] } },
                  resolved: { $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] } },
                  closed: { $sum: { $cond: [{ $eq: ['$status', 'closed'] }, 1, 0] } },
                  avgResponseTime: {
                    $avg: {
                      $cond: [
                        { $ne: ['$resolvedAt', null] },
                        { $subtract: ['$resolvedAt', '$createdAt'] },
                        null
                      ]
                    }
                  }
                }
              }
            ],

            // By status
            byStatus: [
              {
                $group: {
                  _id: '$status',
                  count: { $sum: 1 },
                  avgAge: {
                    $avg: {
                      $subtract: [new Date(), '$createdAt']
                    }
                  }
                }
              },
              { $sort: { count: -1 } }
            ],

            // By issue type
            byIssueType: [
              {
                $group: {
                  _id: '$issueType',
                  count: { $sum: 1 },
                  avgResolutionTime: {
                    $avg: {
                      $cond: [
                        { $ne: ['$resolvedAt', null] },
                        { $subtract: ['$resolvedAt', '$createdAt'] },
                        null
                      ]
                    }
                  }
                }
              },
              { $sort: { count: -1 } }
            ],

            // By priority
            byPriority: [
              {
                $group: {
                  _id: '$priority',
                  count: { $sum: 1 }
                }
              },
              { $sort: { count: -1 } }
            ],

            // Daily requests (last 30 days)
            dailyRequests: [
              {
                $match: {
                  createdAt: {
                    $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                  }
                }
              },
              {
                $group: {
                  _id: {
                    $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
                  },
                  count: { $sum: 1 },
                  pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
                  resolved: { $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] } }
                }
              },
              { $sort: { _id: 1 } }
            ],

            // Hourly distribution
            hourlyDistribution: [
              {
                $group: {
                  _id: { $hour: '$createdAt' },
                  count: { $sum: 1 }
                }
              },
              { $sort: { _id: 1 } }
            ],

            // Top pages with issues
            topPages: [
              {
                $group: {
                  _id: '$pageUrl',
                  count: { $sum: 1 },
                  issues: { $addToSet: '$issueType' }
                }
              },
              { $sort: { count: -1 } },
              { $limit: 10 }
            ],

            // Recent activity
            recentActivity: [
              { $sort: { updatedAt: -1 } },
              { $limit: 10 },
              {
                $project: {
                  _id: 1,
                  name: 1,
                  email: 1,
                  status: 1,
                  issueType: 1,
                  priority: 1,
                  updatedAt: 1,
                  timeSinceUpdate: {
                    $subtract: [new Date(), '$updatedAt']
                  }
                }
              }
            ]
          }
        }
      ]);

      const overview = stats[0].overview[0] || {};

      res.json({
        success: true,
        data: {
          overview: {
            total: overview.total || 0,
            pending: overview.pending || 0,
            inProgress: overview.inProgress || 0,
            resolved: overview.resolved || 0,
            closed: overview.closed || 0,
            completionRate: overview.total ? 
              ((overview.resolved + overview.closed) / overview.total * 100).toFixed(2) : 0,
            avgResponseTime: overview.avgResponseTime || 0
          },
          byStatus: stats[0].byStatus,
          byIssueType: stats[0].byIssueType,
          byPriority: stats[0].byPriority,
          dailyRequests: stats[0].dailyRequests,
          hourlyDistribution: stats[0].hourlyDistribution,
          topPages: stats[0].topPages,
          recentActivity: stats[0].recentActivity
        },
        timeframe: {
          startDate: startDate || 'beginning',
          endDate: endDate || 'now'
        }
      });

    } catch (error) {
      console.error('Get statistics error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch statistics'
      });
    }
  }

  // ========== HELPER METHODS ==========
  determinePriority(issueType, message) {
    const messageLower = message.toLowerCase();
    
    const urgentKeywords = ['urgent', 'emergency', 'critical', 'broken', 'not working', 'down', 'crash', 'error'];
    const highKeywords = ['important', 'blocking', 'cannot', 'unable', 'failed', 'issue', 'problem'];
    
    if (urgentKeywords.some(keyword => messageLower.includes(keyword)) || issueType === 'bug') {
      return 'urgent';
    } else if (highKeywords.some(keyword => messageLower.includes(keyword)) || issueType === 'technical') {
      return 'high';
    } else if (issueType === 'billing') {
      return 'medium';
    } else {
      return 'low';
    }
  }

  async sendInitialEmails(request) {
    try {
      // Send confirmation to user
      await emailService.sendConfirmation(request);
      
      // Send notification to support team
      await emailService.sendSupportNotification(request);
      
    } catch (error) {
      console.error('Error sending initial emails:', error);
      // Don't throw - email failures shouldn't break the request
    }
  }

  formatResponse(request) {
    const obj = request.toObject ? request.toObject() : request;
    
    return {
      id: obj._id,
      name: obj.name,
      email: obj.email,
      issueType: obj.issueType,
      message: obj.message,
      pageUrl: obj.pageUrl,
      status: obj.status,
      priority: obj.priority,
      assignedTo: obj.assignedTo,
      notes: obj.notes,
      resolutionNotes: obj.resolutionNotes,
      ip: obj.ip,
      userAgent: obj.userAgent,
      createdAt: obj.createdAt,
      updatedAt: obj.updatedAt,
      resolvedAt: obj.resolvedAt,
      // Calculate age in hours
      ageInHours: obj.createdAt ? 
        Math.floor((new Date() - new Date(obj.createdAt)) / (1000 * 60 * 60)) : 0
    };
  }
}

module.exports = new AssistanceController();