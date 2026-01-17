// const Notification = require('../models/Notification');

// // GET my notifications
// exports.getMyNotifications = async (req, res) => {
//   try {
//     const notifications = await Notification.find({ userId: req.user.id })
//       .populate('exam', 'name nextExamDate')
//       .populate('csceBook')
//       .sort({ createdAt: -1 });

//     res.status(200).json({
//       success: true,
//       count: notifications.length,
//       data: notifications
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch notifications'
//     });
//   }
// };

// // MARK one as read
// exports.markNotificationAsRead = async (req, res) => {
//   try {
//     const notification = await Notification.findOneAndUpdate(
//       { _id: req.params.id, userId: req.user.id },
//       { isRead: true },
//       { new: true }
//     );

//     if (!notification) {
//       return res.status(404).json({
//         success: false,
//         message: 'Notification not found'
//       });
//     }

//     res.status(200).json({
//       success: true,
//       data: notification
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Failed to update notification'
//     });
//   }
// };

// // MARK all as read
// exports.markAllNotificationsAsRead = async (req, res) => {
//   try {
//     await Notification.updateMany(
//       { userId: req.user.id, isRead: false },
//       { isRead: true }
//     );

//     res.status(200).json({
//       success: true,
//       message: 'All notifications marked as read'
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Failed to update notifications'
//     });
//   }
// };























const mongoose = require('mongoose');
const Notification = require('../models/Notification');

/**
 * 🔔 GET MY NOTIFICATIONS
 * Query params:
 *  - range: daily | weekly | monthly | quarterly | yearly | all
 *  - unread: true | false
 */
exports.getMyNotifications = async (req, res) => {
  try {
    const { range = 'all', unread } = req.query;
    const userId = req.user.id;
    const now = new Date();

    const query = { userId };

    // 📅 Time range filter
    let startDate;

    switch (range) {
      case 'daily':
        startDate = new Date(now.setHours(0, 0, 0, 0));
        break;

      case 'weekly':
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 7);
        break;

      case 'monthly':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;

      case 'quarterly':
        const quarter = Math.floor(now.getMonth() / 3);
        startDate = new Date(now.getFullYear(), quarter * 3, 1);
        break;

      case 'yearly':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
    }

    if (startDate) {
      query.createdAt = { $gte: startDate };
    }

    // 👁 Unread filter
    if (unread === 'true') query.isRead = false;
    if (unread === 'false') query.isRead = true;

    const notifications = await Notification.find(query)
      .populate('exam', 'name nextExamDate')
      .populate('csceBook')
      .sort({ createdAt: -1 });

    const unreadCount = await Notification.countDocuments({
      userId,
      isRead: false
    });

    res.status(200).json({
      success: true,
      range,
      total: notifications.length,
      unreadCount,
      data: notifications
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notifications'
    });
  }
};

exports.getNotificationsByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const { range = 'all', unread } = req.query;
    const now = new Date();

    const query = { userEmail: email.toLowerCase() };

    // 📅 Time range filter
    let startDate;

    switch (range) {
      case 'daily':
        startDate = new Date(now.setHours(0, 0, 0, 0));
        break;

      case 'weekly':
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 7);
        break;

      case 'monthly':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;

      case 'quarterly':
        const quarter = Math.floor(now.getMonth() / 3);
        startDate = new Date(now.getFullYear(), quarter * 3, 1);
        break;

      case 'yearly':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
    }

    if (startDate) {
      query.createdAt = { $gte: startDate };
    }

    // 👁 Unread filter
    if (unread === 'true') query.isRead = false;
    if (unread === 'false') query.isRead = true;

    const notifications = await Notification.find(query)
      .populate('exam', 'name nextExamDate')
      .populate('csceBook')
      .sort({ createdAt: -1 });

    const unreadCount = await Notification.countDocuments({
      userEmail: email.toLowerCase(),
      isRead: false
    });

    res.status(200).json({
      success: true,
      range,
      total: notifications.length,
      unreadCount,
      data: notifications
    });
  } catch (error) {
    console.error('Get notifications by email error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notifications by email'
    });
  }
};


/**
 * 🔢 GET UNREAD COUNT ONLY
 */
exports.getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      userId: req.user.id,
      isRead: false
    });

    res.status(200).json({
      success: true,
      unreadCount: count
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch unread count'
    });
  }
};

/**
 * ✅ MARK ONE NOTIFICATION AS READ
 */
exports.markNotificationAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    res.status(200).json({
      success: true,
      data: notification
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update notification'
    });
  }
};

/**
 * ✅ MARK ALL NOTIFICATIONS AS READ
 */
exports.markAllNotificationsAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.user.id, isRead: false },
      { isRead: true }
    );

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update notifications'
    });
  }
};

/**
 * ❌ DELETE ONE NOTIFICATION
 */
exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Notification deleted'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete notification'
    });
  }
};

/**
 * 🧹 CLEAR OLD NOTIFICATIONS (admin / cron job)
 * Deletes notifications older than X days (default: 365)
 */
exports.clearOldNotifications = async (req, res) => {
  try {
    const { days = 365 } = req.query;

    const cutoffDate = new Date(
      Date.now() - Number(days) * 24 * 60 * 60 * 1000
    );

    const result = await Notification.deleteMany({
      createdAt: { $lt: cutoffDate }
    });

    res.status(200).json({
      success: true,
      deleted: result.deletedCount
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to clear notifications'
    });
  }
};
