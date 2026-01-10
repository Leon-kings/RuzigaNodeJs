const VisaService = require('../models/Visa');
const { StatisticsService, InventoryService } = require('./visaController');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

class AnalyticsController {
  // Get overview analytics
  async getOverview(req, res, next) {
    try {
      const statisticsService = new StatisticsService();
      const overview = await statisticsService.getOverallStatistics();
      
      res.json({
        success: true,
        data: overview
      });
    } catch (err) {
      next(err);
    }
  }

  // Get revenue analytics
  async getRevenueAnalytics(req, res, next) {
    try {
      const statisticsService = new StatisticsService();
      const revenue = await statisticsService.getRevenueStatistics();
      
      // Get daily revenue for last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const dailyRevenue = await VisaService.aggregate([
        {
          $match: {
            createdAt: { $gte: thirtyDaysAgo },
            'applicationDetails.payment.amountPaid': { $gt: 0 }
          }
        },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
            },
            revenue: { $sum: '$applicationDetails.payment.amountPaid' },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]);

      res.json({
        success: true,
        data: {
          summary: revenue,
          dailyRevenue,
          trends: await this.getRevenueTrends()
        }
      });
    } catch (err) {
      next(err);
    }
  }

  // Get performance metrics
  async getPerformanceMetrics(req, res, next) {
    try {
      const statisticsService = new StatisticsService();
      const agentPerformance = await statisticsService.getAgentPerformance();
      
      // Calculate processing time metrics
      const processingMetrics = await VisaService.aggregate([
        {
          $match: {
            serviceStage: 'completed',
            'applicationDetails.applicationStatus.actualCompletionDate': { $exists: true }
          }
        },
        {
          $project: {
            processingTime: {
              $divide: [
                { $subtract: ['$applicationDetails.applicationStatus.actualCompletionDate', '$createdAt'] },
                1000 * 60 * 60 * 24 // Convert to days
              ]
            },
            visaType: '$applicationDetails.visaInfo.visaType',
            country: '$applicationDetails.visaInfo.destinationCountry'
          }
        },
        {
          $group: {
            _id: null,
            avgProcessingTime: { $avg: '$processingTime' },
            minProcessingTime: { $min: '$processingTime' },
            maxProcessingTime: { $max: '$processingTime' },
            byVisaType: {
              $push: {
                visaType: '$visaType',
                processingTime: '$processingTime'
              }
            },
            byCountry: {
              $push: {
                country: '$country',
                processingTime: '$processingTime'
              }
            }
          }
        }
      ]);

      res.json({
        success: true,
        data: {
          agentPerformance,
          processingMetrics: processingMetrics[0] || {},
          conversionRates: await this.getConversionRates()
        }
      });
    } catch (err) {
      next(err);
    }
  }

  // Get daily report
  async getDailyReport(req, res, next) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const report = await VisaService.aggregate([
        {
          $match: {
            createdAt: { $gte: today, $lt: tomorrow }
          }
        },
        {
          $facet: {
            summary: [
              {
                $group: {
                  _id: null,
                  total: { $sum: 1 },
                  newBookings: {
                    $sum: { $cond: [{ $eq: ['$serviceType', 'booking'] }, 1, 0] }
                  },
                  newApplications: {
                    $sum: { $cond: [{ $in: ['$serviceType', ['application', 'combined']] }, 1, 0] }
                  },
                  revenue: { $sum: '$applicationDetails.payment.amountPaid' },
                  completed: {
                    $sum: { $cond: [{ $eq: ['$serviceStage', 'completed'] }, 1, 0] }
                  }
                }
              }
            ],
            byStage: [
              {
                $group: {
                  _id: '$serviceStage',
                  count: { $sum: 1 }
                }
              }
            ],
            byAgent: [
              {
                $match: { 'internal.assignedTo.agentId': { $exists: true } }
              },
              {
                $group: {
                  _id: '$internal.assignedTo.agentId',
                  agentName: { $first: '$internal.assignedTo.agentName' },
                  count: { $sum: 1 }
                }
              }
            ],
            recentActivities: [
              { $sort: { createdAt: -1 } },
              { $limit: 10 },
              {
                $project: {
                  serviceId: 1,
                  customer: '$customer.personalInfo.fullName',
                  serviceStage: 1,
                  createdAt: 1
                }
              }
            ]
          }
        }
      ]);

      res.json({
        success: true,
        data: report[0] || {},
        date: today.toISOString().split('T')[0]
      });
    } catch (err) {
      next(err);
    }
  }

  // Get monthly report
  async getMonthlyReport(req, res, next) {
    try {
      const { year, month } = req.query;
      const targetYear = parseInt(year) || new Date().getFullYear();
      const targetMonth = parseInt(month) || new Date().getMonth() + 1;

      const startDate = new Date(targetYear, targetMonth - 1, 1);
      const endDate = new Date(targetYear, targetMonth, 1);

      const report = await VisaService.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate, $lt: endDate }
          }
        },
        {
          $facet: {
            summary: [
              {
                $group: {
                  _id: null,
                  total: { $sum: 1 },
                  totalRevenue: { $sum: '$applicationDetails.fees.totalAmount' },
                  collectedRevenue: { $sum: '$applicationDetails.payment.amountPaid' },
                  completed: {
                    $sum: { $cond: [{ $eq: ['$serviceStage', 'completed'] }, 1, 0] }
                  },
                  cancelled: {
                    $sum: { $cond: [{ $eq: ['$serviceStage', 'cancelled'] }, 1, 0] }
                  }
                }
              }
            ],
            dailyBreakdown: [
              {
                $group: {
                  _id: { $dayOfMonth: '$createdAt' },
                  count: { $sum: 1 },
                  revenue: { $sum: '$applicationDetails.payment.amountPaid' }
                }
              },
              { $sort: { _id: 1 } }
            ],
            visaTypeBreakdown: [
              {
                $group: {
                  _id: '$applicationDetails.visaInfo.visaType',
                  count: { $sum: 1 },
                  revenue: { $sum: '$applicationDetails.fees.totalAmount' }
                }
              },
              { $sort: { count: -1 } }
            ],
            countryBreakdown: [
              {
                $group: {
                  _id: '$applicationDetails.visaInfo.destinationCountry',
                  count: { $sum: 1 }
                }
              },
              { $sort: { count: -1 } },
              { $limit: 10 }
            ],
            agentPerformance: [
              {
                $match: { 'internal.assignedTo.agentId': { $exists: true } }
              },
              {
                $group: {
                  _id: '$internal.assignedTo.agentId',
                  agentName: { $first: '$internal.assignedTo.agentName' },
                  assigned: { $sum: 1 },
                  completed: {
                    $sum: { $cond: [{ $eq: ['$serviceStage', 'completed'] }, 1, 0] }
                  },
                  revenue: { $sum: '$applicationDetails.fees.totalAmount' }
                }
              },
              { $sort: { completed: -1 } }
            ]
          }
        }
      ]);

      res.json({
        success: true,
        data: report[0] || {},
        period: {
          year: targetYear,
          month: targetMonth,
          monthName: new Date(targetYear, targetMonth - 1).toLocaleString('default', { month: 'long' })
        }
      });
    } catch (err) {
      next(err);
    }
  }

  // Get agent performance report
  async getAgentPerformanceReport(req, res, next) {
    try {
      const { startDate, endDate } = req.query;
      
      const matchStage = {};
      if (startDate || endDate) {
        matchStage.createdAt = {};
        if (startDate) matchStage.createdAt.$gte = new Date(startDate);
        if (endDate) matchStage.createdAt.$lte = new Date(endDate);
      }

      const performance = await VisaService.aggregate([
        { $match: matchStage },
        {
          $match: { 'internal.assignedTo.agentId': { $exists: true } }
        },
        {
          $group: {
            _id: '$internal.assignedTo.agentId',
            agentName: { $first: '$internal.assignedTo.agentName' },
            totalAssigned: { $sum: 1 },
            completed: {
              $sum: { $cond: [{ $eq: ['$serviceStage', 'completed'] }, 1, 0] }
            },
            inProgress: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      { $ne: ['$serviceStage', 'completed'] },
                      { $ne: ['$serviceStage', 'cancelled'] }
                    ]
                  },
                  1,
                  0
                ]
              }
            },
            cancelled: {
              $sum: { $cond: [{ $eq: ['$serviceStage', 'cancelled'] }, 1, 0] }
            },
            totalRevenue: { $sum: '$applicationDetails.fees.totalAmount' },
            collectedRevenue: { $sum: '$applicationDetails.payment.amountPaid' },
            avgProcessingTime: {
              $avg: {
                $cond: [
                  { $eq: ['$serviceStage', 'completed'] },
                  { $subtract: ['$updatedAt', '$createdAt'] },
                  null
                ]
              }
            },
            servicesByType: {
              $push: {
                serviceId: '$serviceId',
                type: '$applicationDetails.visaInfo.visaType',
                stage: '$serviceStage',
                revenue: '$applicationDetails.fees.totalAmount'
              }
            }
          }
        },
        {
          $project: {
            agentName: 1,
            totalAssigned: 1,
            completed: 1,
            inProgress: 1,
            cancelled: 1,
            completionRate: {
              $cond: [
                { $gt: ['$totalAssigned', 0] },
                { $multiply: [{ $divide: ['$completed', '$totalAssigned'] }, 100] },
                0
              ]
            },
            totalRevenue: 1,
            collectedRevenue: 1,
            pendingRevenue: { $subtract: ['$totalRevenue', '$collectedRevenue'] },
            avgProcessingTime: {
              $divide: ['$avgProcessingTime', 1000 * 60 * 60 * 24] // Convert to days
            },
            servicesByType: { $slice: ['$servicesByType', 10] } // Limit to last 10
          }
        },
        { $sort: { completionRate: -1 } }
      ]);

      res.json({
        success: true,
        data: performance
      });
    } catch (err) {
      next(err);
    }
  }

  // Get country-wise report
  async getCountryWiseReport(req, res, next) {
    try {
      const report = await VisaService.aggregate([
        {
          $match: {
            'applicationDetails.visaInfo.destinationCountry': { $exists: true }
          }
        },
        {
          $group: {
            _id: '$applicationDetails.visaInfo.destinationCountry',
            total: { $sum: 1 },
            completed: {
              $sum: { $cond: [{ $eq: ['$serviceStage', 'completed'] }, 1, 0] }
            },
            approved: {
              $sum: {
                $cond: [
                  { $eq: ['$applicationDetails.applicationStatus.current', 'approved'] },
                  1,
                  0
                ]
              }
            },
            rejected: {
              $sum: {
                $cond: [
                  { $eq: ['$applicationDetails.applicationStatus.current', 'rejected'] },
                  1,
                  0
                ]
              }
            },
            avgProcessingTime: {
              $avg: {
                $cond: [
                  { $eq: ['$serviceStage', 'completed'] },
                  { $subtract: ['$updatedAt', '$createdAt'] },
                  null
                ]
              }
            },
            totalRevenue: { $sum: '$applicationDetails.fees.totalAmount' },
            byVisaType: {
              $push: {
                type: '$applicationDetails.visaInfo.visaType',
                status: '$applicationDetails.applicationStatus.current'
              }
            }
          }
        },
        {
          $project: {
            country: '$_id',
            total: 1,
            completed: 1,
            approvalRate: {
              $cond: [
                { $gt: ['$total', 0] },
                { $multiply: [{ $divide: ['$approved', '$total'] }, 100] },
                0
              ]
            },
            completionRate: {
              $cond: [
                { $gt: ['$total', 0] },
                { $multiply: [{ $divide: ['$completed', '$total'] }, 100] },
                0
              ]
            },
            avgProcessingTime: {
              $divide: ['$avgProcessingTime', 1000 * 60 * 60 * 24] // Convert to days
            },
            totalRevenue: 1,
            visaTypeDistribution: {
              $reduce: {
                input: '$byVisaType',
                initialValue: {},
                in: {
                  $mergeObjects: [
                    '$$value',
                    {
                      $let: {
                        vars: {
                          type: '$$this.type'
                        },
                        in: {
                          $arrayToObject: [
                            [
                              {
                                k: '$$type',
                                v: {
                                  $add: [
                                    { $ifNull: [{ $arrayElemAt: [{ $objectToArray: '$$value' }, 0] }, {}] },
                                    1
                                  ]
                                }
                              }
                            ]
                          ]
                        }
                      }
                    }
                  ]
                }
              }
            }
          }
        },
        { $sort: { total: -1 } },
        { $limit: 20 }
      ]);

      res.json({
        success: true,
        data: report
      });
    } catch (err) {
      next(err);
    }
  }

  // Get audit logs
  async getAuditLogs(req, res, next) {
    try {
      const { page = 1, limit = 50, action, userId, startDate, endDate } = req.query;

      const matchStage = {};
      if (action) matchStage['auditLog.action'] = action;
      if (userId) matchStage['auditLog.performedBy'] = userId;
      
      if (startDate || endDate) {
        matchStage['auditLog.performedAt'] = {};
        if (startDate) matchStage['auditLog.performedAt'].$gte = new Date(startDate);
        if (endDate) matchStage['auditLog.performedAt'].$lte = new Date(endDate);
      }

      const logs = await VisaService.aggregate([
        { $unwind: '$auditLog' },
        { $match: matchStage },
        { $sort: { 'auditLog.performedAt': -1 } },
        { $skip: (page - 1) * limit },
        { $limit: parseInt(limit) },
        {
          $project: {
            _id: 0,
            serviceId: 1,
            action: '$auditLog.action',
            performedBy: '$auditLog.performedBy',
            performedAt: '$auditLog.performedAt',
            details: '$auditLog.details',
            ipAddress: '$auditLog.ipAddress',
            userAgent: '$auditLog.userAgent'
          }
        }
      ]);

      const total = await VisaService.aggregate([
        { $unwind: '$auditLog' },
        { $match: matchStage },
        { $count: 'total' }
      ]);

      res.json({
        success: true,
        data: logs,
        pagination: {
          total: total[0]?.total || 0,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil((total[0]?.total || 0) / limit)
        }
      });
    } catch (err) {
      next(err);
    }
  }

  // Get system statistics
  async getSystemStatistics(req, res, next) {
    try {
      const stats = await VisaService.aggregate([
        {
          $facet: {
            totalServices: [{ $count: 'count' }],
            activeServices: [
              {
                $match: {
                  serviceStage: {
                    $nin: ['completed', 'cancelled']
                  }
                }
              },
              { $count: 'count' }
            ],
            documentsCount: [
              {
                $project: {
                  docCount: {
                    $add: [
                      { $cond: [{ $ifNull: ['$documents.passportCopy', false] }, 1, 0] },
                      { $cond: [{ $ifNull: ['$documents.photograph', false] }, 1, 0] },
                      { $size: { $ifNull: ['$documents.financialDocuments', []] } },
                      { $size: { $ifNull: ['$documents.travelDocuments', []] } },
                      { $size: { $ifNull: ['$documents.supportingDocuments', []] } },
                      { $size: { $ifNull: ['$documents.otherDocuments', []] } }
                    ]
                  }
                }
              },
              {
                $group: {
                  _id: null,
                  total: { $sum: '$docCount' },
                  avgPerService: { $avg: '$docCount' }
                }
              }
            ],
            storageStats: [
              {
                $group: {
                  _id: null,
                  totalServicesSize: { $sum: { $bsonSize: '$$ROOT' } }
                }
              }
            ],
            recentGrowth: [
              {
                $group: {
                  _id: {
                    $dateToString: { format: '%Y-%m', date: '$createdAt' }
                  },
                  count: { $sum: 1 }
                }
              },
              { $sort: { _id: -1 } },
              { $limit: 6 }
            ]
          }
        }
      ]);

      res.json({
        success: true,
        data: stats[0] || {}
      });
    } catch (err) {
      next(err);
    }
  }

  // Generate and upload report to Cloudinary
  async generateReport(req, res, next) {
    try {
      const { reportType, startDate, endDate } = req.body;
      
      // Generate report data based on type
      let reportData;
      switch (reportType) {
        case 'monthly':
          reportData = await this.generateMonthlyReportData(startDate, endDate);
          break;
        case 'agent_performance':
          reportData = await this.generateAgentPerformanceReportData(startDate, endDate);
          break;
        case 'country_wise':
          reportData = await this.generateCountryWiseReportData();
          break;
        default:
          throw new Error('Invalid report type');
      }

      // Convert report data to JSON buffer
      const reportBuffer = Buffer.from(JSON.stringify(reportData, null, 2));
      
      // Upload to Cloudinary
      const cloudinaryResult = await this.uploadReportToCloudinary(
        reportBuffer, 
        `${reportType}_report_${Date.now()}.json`,
        'visa-analytics/reports'
      );

      // Create audit log entry
      await this.logReportGeneration(req.user.id, reportType, cloudinaryResult);

      res.json({
        success: true,
        data: {
          reportUrl: cloudinaryResult.secure_url,
          publicId: cloudinaryResult.public_id,
          format: cloudinaryResult.format,
          generatedAt: new Date()
        }
      });
    } catch (err) {
      next(err);
    }
  }

  // Upload chart visualization to Cloudinary
  async uploadChartVisualization(chartBuffer, reportName, options = {}) {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'visa-analytics/charts',
          resource_type: 'image',
          public_id: `${reportName}_${Date.now()}`,
          transformation: [
            { quality: 'auto' },
            { fetch_format: 'auto' },
            ...(options.transformations || [])
          ],
          ...options
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      
      streamifier.createReadStream(chartBuffer).pipe(uploadStream);
    });
  }

  // Upload report document to Cloudinary
  async uploadReportToCloudinary(buffer, filename, folder = 'visa-analytics/reports') {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folder,
          resource_type: 'raw',
          public_id: filename,
          format: 'json'
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      
      streamifier.createReadStream(buffer).pipe(uploadStream);
    });
  }

  // Upload PDF report
  async uploadPDFReport(buffer, filename, folder = 'visa-analytics/pdf-reports') {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folder,
          resource_type: 'raw',
          public_id: filename,
          format: 'pdf'
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      
      streamifier.createReadStream(buffer).pipe(uploadStream);
    });
  }

  // Generate optimized image URL for dashboard
  getOptimizedChartUrl(publicId, width = 1200, quality = 'auto') {
    return cloudinary.url(publicId, {
      width: width,
      quality: quality,
      fetch_format: 'auto'
    });
  }

  // Delete report from Cloudinary
  async deleteReport(publicId) {
    return cloudinary.uploader.destroy(publicId);
  }

  // Helper methods
  async getRevenueTrends() {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    return VisaService.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          revenue: { $sum: '$applicationDetails.fees.totalAmount' },
          collected: { $sum: '$applicationDetails.payment.amountPaid' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);
  }

  async getConversionRates() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return VisaService.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $facet: {
          bookings: [
            { $match: { serviceType: 'booking' } },
            { $count: 'total' }
          ],
          converted: [
            {
              $match: {
                serviceType: 'booking',
                'applicationDetails': { $exists: true }
              }
            },
            { $count: 'total' }
          ],
          applications: [
            { $match: { serviceType: { $in: ['application', 'combined'] } } },
            { $count: 'total' }
          ],
          completed: [
            { $match: { serviceStage: 'completed' } },
            { $count: 'total' }
          ]
        }
      }
    ]);
  }

  // Private helper methods for report generation
  async generateMonthlyReportData(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    return VisaService.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lt: end }
        }
      },
      {
        $group: {
          _id: null,
          totalServices: { $sum: 1 },
          totalRevenue: { $sum: '$applicationDetails.fees.totalAmount' },
          collectedRevenue: { $sum: '$applicationDetails.payment.amountPaid' },
          completedServices: {
            $sum: { $cond: [{ $eq: ['$serviceStage', 'completed'] }, 1, 0] }
          },
          avgProcessingTime: {
            $avg: {
              $cond: [
                { $eq: ['$serviceStage', 'completed'] },
                { $subtract: ['$updatedAt', '$createdAt'] },
                null
              ]
            }
          },
          byCountry: {
            $push: {
              country: '$applicationDetails.visaInfo.destinationCountry',
              revenue: '$applicationDetails.fees.totalAmount'
            }
          }
        }
      }
    ]);
  }

  async generateAgentPerformanceReportData(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    return VisaService.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lt: end },
          'internal.assignedTo.agentId': { $exists: true }
        }
      },
      {
        $group: {
          _id: '$internal.assignedTo.agentId',
          agentName: { $first: '$internal.assignedTo.agentName' },
          assignedServices: { $sum: 1 },
          completedServices: {
            $sum: { $cond: [{ $eq: ['$serviceStage', 'completed'] }, 1, 0] }
          },
          totalRevenue: { $sum: '$applicationDetails.fees.totalAmount' },
          performanceScore: {
            $avg: {
              $cond: [
                { $eq: ['$serviceStage', 'completed'] },
                { $divide: [
                  { $subtract: ['$updatedAt', '$createdAt'] },
                  1000 * 60 * 60 * 24
                ]},
                0
              ]
            }
          }
        }
      }
    ]);
  }

  async generateCountryWiseReportData() {
    return VisaService.aggregate([
      {
        $group: {
          _id: '$applicationDetails.visaInfo.destinationCountry',
          totalApplications: { $sum: 1 },
          approved: {
            $sum: {
              $cond: [
                { $eq: ['$applicationDetails.applicationStatus.current', 'approved'] },
                1,
                0
              ]
            }
          },
          pending: {
            $sum: {
              $cond: [
                { $eq: ['$applicationDetails.applicationStatus.current', 'pending'] },
                1,
                0
              ]
            }
          },
          totalRevenue: { $sum: '$applicationDetails.fees.totalAmount' },
          avgProcessingTime: {
            $avg: {
              $cond: [
                { $eq: ['$serviceStage', 'completed'] },
                { $divide: [
                  { $subtract: ['$updatedAt', '$createdAt'] },
                  1000 * 60 * 60 * 24
                ]},
                null
              ]
            }
          }
        }
      }
    ]);
  }

  async logReportGeneration(userId, reportType, cloudinaryResult) {
    // Implement audit logging for report generation
    // This could be stored in a separate audit collection
    const auditLog = {
      action: 'report_generated',
      performedBy: userId,
      performedAt: new Date(),
      details: {
        reportType,
        cloudinaryPublicId: cloudinaryResult.public_id,
        reportUrl: cloudinaryResult.secure_url,
        size: cloudinaryResult.bytes
      },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    };

    // Store in your preferred audit log system
    // await AuditLog.create(auditLog);
  }
}

module.exports = {
  AnalyticsController: new AnalyticsController(),
  uploadToCloudinary: {
    // Upload from buffer
    uploadFromBuffer: (buffer, folder = 'visa-documents', options = {}) => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: folder,
            resource_type: 'auto',
            ...options
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        
        streamifier.createReadStream(buffer).pipe(uploadStream);
      });
    },

    // Upload from file path
    uploadFromPath: (filePath, folder = 'visa-documents', options = {}) => {
      return cloudinary.uploader.upload(filePath, {
        folder: folder,
        resource_type: 'auto',
        ...options
      });
    },

    // Delete file from Cloudinary
    deleteFile: (publicId) => {
      return cloudinary.uploader.destroy(publicId);
    },

    // Generate optimized image URL
    getOptimizedUrl: (publicId, width = 800, quality = 'auto') => {
      return cloudinary.url(publicId, {
        width: width,
        quality: quality,
        fetch_format: 'auto'
      });
    },

    // Upload applicant's photograph with face detection
    uploadApplicantPhoto: async (buffer, applicantId) => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: `visa-applicants/${applicantId}`,
            resource_type: 'image',
            transformation: [
              { width: 500, height: 500, crop: 'fill', gravity: 'face' },
              { quality: 'auto' },
              { fetch_format: 'auto' }
            ]
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        
        streamifier.createReadStream(buffer).pipe(uploadStream);
      });
    },

    // Upload PDF document
    uploadPDF: async (buffer, filename, folder = 'visa-documents/generated') => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: folder,
            resource_type: 'raw',
            public_id: filename,
            format: 'pdf'
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        
        streamifier.createReadStream(buffer).pipe(uploadStream);
      });
    }
  }
};