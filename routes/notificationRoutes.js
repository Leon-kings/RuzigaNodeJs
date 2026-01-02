const express = require('express');
const router = express.Router();

const {
  getMyNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead
} = require('../controllers/notificationController');

// 🔔 Get logged-in user's notifications
router.get('/', getMyNotifications);

// ✅ Mark single notification as read
router.patch('/:id/read', markNotificationAsRead);

// ✅ Mark all notifications as read
router.patch('/read/all', markAllNotificationsAsRead);

module.exports = router;
