const Contact = require('../models/Contact');
const emailService = require('../mails/sendEmail');
const User = require('../models/User');
const Notification = require('../models/Notification');
const mongoose = require('mongoose');

class ContactController {
  // ========== CRUD OPERATIONS ==========
  
// CREATE - Create new contact submission
async createContact(req, res) {
  try {
    const { name, email, subject, message } = req.body;

    // Check for duplicate recent submissions
    const recentSubmission = await Contact.findOne({
      email,
      subject,
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Last 24 hours
    });

    if (recentSubmission) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted a similar message recently.'
      });
    }

    // Create contact record
    const contact = await Contact.create({
      name,
      email,
      subject,
      message,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    // ✅ Existing email notification to admin (AS-IS)
    await emailService.sendContactNotification({
      name,
      email,
      subject,
      message
    });

    // ✅ Existing auto-acknowledgement (AS-IS)
    await emailService.sendAutoAcknowledgement(email, name);

    // 🔔 ADD NOTIFICATIONS FOR ADMINS (NEW)
    const admins = await User.find({ role: 'admin' }).select('_id');

    if (admins.length > 0) {
      await Notification.insertMany(
        admins.map(admin => ({
          userId: admin._id,
          title: 'New Contact Message',
          message: `New message from ${name}: ${subject}`,
          type: 'system',
          relatedModel: 'Contact',
          relatedId: contact._id
        }))
      );
    }

    res.status(201).json({
      success: true,
      message: 'Thank you for contacting us! We will get back to you soon.',
      data: {
        id: contact._id,
        name: contact.name,
        email: contact.email,
        subject: contact.subject,
        createdAt: contact.createdAt
      }
    });

  } catch (error) {
    console.error('Create contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit contact form',
      error: process.env.NODE_ENV === 'development'
        ? error.message
        : undefined
    });
  }
}


  // READ - Get all contacts (with filters, search, and pagination)
  async getAllContacts(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        status = 'all',
        search = '',
        startDate,
        endDate,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = req.query;

      const query = {};

      // Status filter
      if (status !== 'all') {
        query.status = status;
      }

      // Search filter
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { subject: { $regex: search, $options: 'i' } },
          { message: { $regex: search, $options: 'i' } }
        ];
      }

      // Date range filter
      if (startDate || endDate) {
        query.createdAt = {};
        if (startDate) query.createdAt.$gte = new Date(startDate);
        if (endDate) query.createdAt.$lte = new Date(endDate);
      }

      // Sort configuration
      const sort = {};
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

      // Pagination
      const skip = (parseInt(page) - 1) * parseInt(limit);

      const [contacts, total] = await Promise.all([
        Contact.find(query)
          .sort(sort)
          .skip(skip)
          .limit(parseInt(limit))
          .select('-__v'),
        Contact.countDocuments(query)
      ]);

      res.status(200).json({
        success: true,
        data: contacts,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit)),
          hasNext: (parseInt(page) * parseInt(limit)) < total,
          hasPrev: parseInt(page) > 1
        }
      });
    } catch (error) {
      console.error('Get contacts error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch contacts'
      });
    }
  }

  // READ - Get single contact by ID
  async getContactById(req, res) {
    try {
      const { id } = req.params;
      
      // Validate ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid contact ID format'
        });
      }

      const contact = await Contact.findById(id);

      if (!contact) {
        return res.status(404).json({
          success: false,
          message: 'Contact not found'
        });
      }

      // Mark as read if currently pending
      if (contact.status === 'pending') {
        contact.status = 'read';
        await contact.save();
      }

      res.status(200).json({
        success: true,
        data: contact
      });
    } catch (error) {
      console.error('Get contact error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch contact'
      });
    }
  }

  // READ - Get contacts by email
  async getContactsByEmail(req, res) {
    try {
      const { email } = req.params;
      const { page = 1, limit = 10 } = req.query;

      const skip = (parseInt(page) - 1) * parseInt(limit);

      const [contacts, total] = await Promise.all([
        Contact.find({ email })
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(parseInt(limit))
          .select('-__v'),
        Contact.countDocuments({ email })
      ]);

      res.status(200).json({
        success: true,
        data: contacts,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      });
    } catch (error) {
      console.error('Get contacts by email error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch contacts by email'
      });
    }
  }

  // UPDATE - Update contact (partial update)
  async updateContact(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // Validate ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid contact ID format'
        });
      }

      // Remove fields that shouldn't be updated
      delete updateData._id;
      delete updateData.createdAt;
      delete updateData.updatedAt;
      delete updateData.ipAddress;
      delete updateData.userAgent;

      const contact = await Contact.findByIdAndUpdate(
        id,
        updateData,
        { 
          new: true, 
          runValidators: true,
          context: 'query'
        }
      ).select('-__v');

      if (!contact) {
        return res.status(404).json({
          success: false,
          message: 'Contact not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Contact updated successfully',
        data: contact
      });
    } catch (error) {
      console.error('Update contact error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update contact',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // UPDATE - Bulk update contacts
  async bulkUpdateContacts(req, res) {
    try {
      const { ids, updateData } = req.body;

      // Validate IDs
      const validIds = ids.filter(id => mongoose.Types.ObjectId.isValid(id));
      
      if (validIds.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No valid contact IDs provided'
        });
      }

      // Remove restricted fields
      delete updateData._id;
      delete updateData.createdAt;
      delete updateData.updatedAt;

      const result = await Contact.updateMany(
        { _id: { $in: validIds } },
        updateData,
        { runValidators: true }
      );

      res.status(200).json({
        success: true,
        message: `Successfully updated ${result.modifiedCount} contacts`,
        data: {
          matchedCount: result.matchedCount,
          modifiedCount: result.modifiedCount
        }
      });
    } catch (error) {
      console.error('Bulk update error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to bulk update contacts'
      });
    }
  }

  // UPDATE - Reply to contact
  async replyToContact(req, res) {
    try {
      const { id } = req.params;
      const { replyMessage } = req.body;

      // Validate ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid contact ID format'
        });
      }

      const contact = await Contact.findById(id);

      if (!contact) {
        return res.status(404).json({
          success: false,
          message: 'Contact not found'
        });
      }

      // Send reply email
      await emailService.sendReplyToContact(
        contact.email,
        contact.name,
        replyMessage
      );

      // Update contact record
      contact.status = 'replied';
      contact.replied = true;
      contact.replyMessage = replyMessage;
      contact.repliedAt = new Date();
      await contact.save();

      res.status(200).json({
        success: true,
        message: 'Reply sent successfully',
        data: {
          id: contact._id,
          repliedAt: contact.repliedAt,
          email: contact.email
        }
      });
    } catch (error) {
      console.error('Reply to contact error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to send reply',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // UPDATE - Update contact status
  async updateContactStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      // Validate ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid contact ID format'
        });
      }

      const contact = await Contact.findByIdAndUpdate(
        id,
        { status },
        { new: true, runValidators: true }
      ).select('_id name email status updatedAt');

      if (!contact) {
        return res.status(404).json({
          success: false,
          message: 'Contact not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Status updated successfully',
        data: contact
      });
    } catch (error) {
      console.error('Update status error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update status'
      });
    }
  }

  // DELETE - Delete single contact
  async deleteContact(req, res) {
    try {
      const { id } = req.params;

      // Validate ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid contact ID format'
        });
      }

      const contact = await Contact.findByIdAndDelete(id);

      if (!contact) {
        return res.status(404).json({
          success: false,
          message: 'Contact not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Contact deleted successfully',
        data: {
          id: contact._id,
          name: contact.name,
          email: contact.email
        }
      });
    } catch (error) {
      console.error('Delete contact error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete contact'
      });
    }
  }

  // DELETE - Bulk delete contacts
  async bulkDeleteContacts(req, res) {
    try {
      const { ids } = req.body;

      // Validate IDs
      const validIds = ids.filter(id => mongoose.Types.ObjectId.isValid(id));
      
      if (validIds.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No valid contact IDs provided'
        });
      }

      const result = await Contact.deleteMany({ _id: { $in: validIds } });

      res.status(200).json({
        success: true,
        message: `Successfully deleted ${result.deletedCount} contacts`,
        data: {
          deletedCount: result.deletedCount
        }
      });
    } catch (error) {
      console.error('Bulk delete error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to bulk delete contacts'
      });
    }
  }

  // ========== STATISTICS FUNCTIONS ==========

  // Get comprehensive dashboard statistics
  async getDashboardStats(req, res) {
    try {
      const [
        totalContacts,
        pendingContacts,
        readContacts,
        repliedContacts,
        archivedContacts,
        todayContacts,
        thisWeekContacts,
        thisMonthContacts,
        contactsByDay,
        contactsByStatus,
        contactsByHour,
        avgResponseTime,
        recentContacts,
        topSubjects
      ] = await Promise.all([
        // Total contacts
        Contact.countDocuments(),
        
        // Status counts
        Contact.countDocuments({ status: 'pending' }),
        Contact.countDocuments({ status: 'read' }),
        Contact.countDocuments({ status: 'replied' }),
        Contact.countDocuments({ status: 'archived' }),
        
        // Time-based counts
        this.getTodayContactsCount(),
        this.getThisWeekContactsCount(),
        this.getThisMonthContactsCount(),
        
        // Analytics
        this.getContactsByDay(7),
        this.getContactsByStatus(),
        this.getContactsByHour(),
        this.calculateAverageResponseTime(),
        
        // Recent activity
        this.getRecentContacts(10),
        this.getTopSubjects(5)
      ]);

      // Calculate percentages
      const responseRate = totalContacts > 0 ? (repliedContacts / totalContacts * 100).toFixed(1) : 0;
      const pendingRate = totalContacts > 0 ? (pendingContacts / totalContacts * 100).toFixed(1) : 0;

      res.status(200).json({
        success: true,
        data: {
          summary: {
            totalContacts,
            pendingContacts,
            readContacts,
            repliedContacts,
            archivedContacts,
            todayContacts,
            thisWeekContacts,
            thisMonthContacts,
            responseRate: parseFloat(responseRate),
            pendingRate: parseFloat(pendingRate),
            avgResponseTime: avgResponseTime ? parseFloat(avgResponseTime.toFixed(2)) : 0
          },
          analytics: {
            dailyTrend: contactsByDay,
            statusDistribution: contactsByStatus,
            hourlyDistribution: contactsByHour
          },
          recentActivity: {
            recentContacts,
            topSubjects
          }
        }
      });
    } catch (error) {
      console.error('Get dashboard stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch dashboard statistics'
      });
    }
  }

  // Get contact analytics with filters
  async getContactAnalytics(req, res) {
    try {
      const { startDate, endDate, groupBy = 'day' } = req.query;

      const matchStage = {};
      
      // Date range filter
      if (startDate || endDate) {
        matchStage.createdAt = {};
        if (startDate) matchStage.createdAt.$gte = new Date(startDate);
        if (endDate) matchStage.createdAt.$lte = new Date(endDate);
      }

      let groupStage;
      switch (groupBy) {
        case 'hour':
          groupStage = {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
              day: { $dayOfMonth: '$createdAt' },
              hour: { $hour: '$createdAt' }
            }
          };
          break;
        case 'week':
          groupStage = {
            _id: {
              year: { $year: '$createdAt' },
              week: { $week: '$createdAt' }
            }
          };
          break;
        case 'month':
          groupStage = {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' }
            }
          };
          break;
        default: // day
          groupStage = {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
              day: { $dayOfMonth: '$createdAt' }
            }
          };
      }

      const analytics = await Contact.aggregate([
        { $match: matchStage },
        {
          $group: {
            ...groupStage,
            total: { $sum: 1 },
            pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
            read: { $sum: { $cond: [{ $eq: ['$status', 'read'] }, 1, 0] } },
            replied: { $sum: { $cond: [{ $eq: ['$status', 'replied'] }, 1, 0] } },
            archived: { $sum: { $cond: [{ $eq: ['$status', 'archived'] }, 1, 0] } }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1, '_id.hour': 1 } }
      ]);

      res.status(200).json({
        success: true,
        data: analytics.map(item => ({
          period: groupBy === 'hour' 
            ? `${item._id.year}-${item._id.month}-${item._id.day} ${item._id.hour}:00`
            : groupBy === 'week'
            ? `Week ${item._id.week}, ${item._id.year}`
            : groupBy === 'month'
            ? `${item._id.year}-${item._id.month}`
            : `${item._id.year}-${item._id.month}-${item._id.day}`,
          ...item
        }))
      });
    } catch (error) {
      console.error('Get analytics error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch contact analytics'
      });
    }
  }

  // Get performance metrics
  async getPerformanceMetrics(req, res) {
    try {
      const [responseTimeStats, dailyVolume, statusChanges] = await Promise.all([
        this.getResponseTimeStats(),
        this.getDailyContactVolume(30),
        this.getStatusChangeMetrics()
      ]);

      res.status(200).json({
        success: true,
        data: {
          responseTime: responseTimeStats,
          dailyVolume,
          statusChanges
        }
      });
    } catch (error) {
      console.error('Get performance metrics error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch performance metrics'
      });
    }
  }

  // ========== HELPER METHODS FOR STATISTICS ==========

  async getTodayContactsCount() {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    return Contact.countDocuments({
      createdAt: { $gte: startOfDay, $lte: endOfDay }
    });
  }

  async getThisWeekContactsCount() {
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    return Contact.countDocuments({
      createdAt: { $gte: startOfWeek }
    });
  }

  async getThisMonthContactsCount() {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    return Contact.countDocuments({
      createdAt: { $gte: startOfMonth }
    });
  }

  async getContactsByDay(days = 7) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const result = await Contact.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
      },
      {
        $project: {
          date: {
            $dateFromParts: {
              year: '$_id.year',
              month: '$_id.month',
              day: '$_id.day'
            }
          },
          count: 1,
          _id: 0
        }
      }
    ]);

    return result;
  }

  async getContactsByStatus() {
    const result = await Contact.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          status: '$_id',
          count: 1,
          _id: 0
        }
      }
    ]);

    return result;
  }

  async getContactsByHour() {
    const result = await Contact.aggregate([
      {
        $group: {
          _id: { $hour: '$createdAt' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id': 1 }
      },
      {
        $project: {
          hour: '$_id',
          count: 1,
          _id: 0
        }
      }
    ]);

    return result;
  }

  async calculateAverageResponseTime() {
    const result = await Contact.aggregate([
      {
        $match: {
          replied: true,
          repliedAt: { $exists: true },
          createdAt: { $exists: true }
        }
      },
      {
        $project: {
          responseTime: {
            $divide: [
              { $subtract: ['$repliedAt', '$createdAt'] },
              1000 * 60 * 60 // Convert to hours
            ]
          }
        }
      },
      {
        $group: {
          _id: null,
          avgResponseTime: { $avg: '$responseTime' },
          minResponseTime: { $min: '$responseTime' },
          maxResponseTime: { $max: '$responseTime' },
          medianResponseTime: { 
            $avg: {
              $percentile: {
                input: '$responseTime',
                p: [0.5]
              }
            }
          }
        }
      }
    ]);

    return result[0] || null;
  }

  async getRecentContacts(limit = 10) {
    return Contact.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('name email subject status createdAt repliedAt');
  }

  async getTopSubjects(limit = 5) {
    const result = await Contact.aggregate([
      {
        $group: {
          _id: '$subject',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: limit
      },
      {
        $project: {
          subject: '$_id',
          count: 1,
          _id: 0
        }
      }
    ]);

    return result;
  }

  async getResponseTimeStats() {
    const result = await Contact.aggregate([
      {
        $match: {
          replied: true,
          repliedAt: { $exists: true }
        }
      },
      {
        $project: {
          responseTimeHours: {
            $divide: [
              { $subtract: ['$repliedAt', '$createdAt'] },
              1000 * 60 * 60
            ]
          }
        }
      },
      {
        $group: {
          _id: null,
          avg: { $avg: '$responseTimeHours' },
          min: { $min: '$responseTimeHours' },
          max: { $max: '$responseTimeHours' },
          p95: {
            $avg: {
              $percentile: {
                input: '$responseTimeHours',
                p: [0.95]
              }
            }
          }
        }
      }
    ]);

    return result[0] || {};
  }

  async getDailyContactVolume(days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const result = await Contact.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$createdAt'
            }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id': 1 }
      }
    ]);

    return result;
  }

  async getStatusChangeMetrics() {
    const result = await Contact.aggregate([
      {
        $group: {
          _id: {
            initial: '$status',
            $cond: [
              { $eq: ['$replied', true] },
              'replied',
              '$status'
            ]
          },
          count: { $sum: 1 },
          avgTimeToReply: {
            $avg: {
              $cond: [
                { $eq: ['$replied', true] },
                { $divide: [
                  { $subtract: ['$repliedAt', '$createdAt'] },
                  1000 * 60 * 60
                ]},
                null
              ]
            }
          }
        }
      }
    ]);

    return result;
  }

  // Export contacts to CSV/JSON
  async exportContacts(req, res) {
    try {
      const { format = 'json', startDate, endDate } = req.query;

      const query = {};
      if (startDate || endDate) {
        query.createdAt = {};
        if (startDate) query.createdAt.$gte = new Date(startDate);
        if (endDate) query.createdAt.$lte = new Date(endDate);
      }

      const contacts = await Contact.find(query)
        .sort({ createdAt: -1 })
        .select('-__v');

      if (format === 'csv') {
        // Convert to CSV
        const headers = ['ID', 'Name', 'Email', 'Subject', 'Message', 'Status', 'Created At', 'Replied', 'Replied At'];
        const csvRows = contacts.map(contact => [
          contact._id,
          `"${contact.name.replace(/"/g, '""')}"`,
          contact.email,
          `"${contact.subject.replace(/"/g, '""')}"`,
          `"${contact.message.replace(/"/g, '""')}"`,
          contact.status,
          contact.createdAt.toISOString(),
          contact.replied,
          contact.repliedAt ? contact.repliedAt.toISOString() : ''
        ]);

        const csv = [headers, ...csvRows].map(row => row.join(',')).join('\n');
        
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=contacts_${Date.now()}.csv`);
        return res.send(csv);
      }

      // Default to JSON
      res.status(200).json({
        success: true,
        data: contacts,
        metadata: {
          total: contacts.length,
          exportedAt: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Export contacts error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to export contacts'
      });
    }
  }
}

module.exports = new ContactController();