// const express = require('express');
// const router = express.Router();

// const {
//   getMyNotifications,
//   markNotificationAsRead,
//   markAllNotificationsAsRead
// } = require('../controllers/notificationController');

// // 🔔 Get logged-in user's notifications
// router.get('/', getMyNotifications);

// // ✅ Mark single notification as read
// router.patch('/:id/read', markNotificationAsRead);

// // ✅ Mark all notifications as read
// router.patch('/read/all', markAllNotificationsAsRead);

// module.exports = router;






















const express = require('express');
const router = express.Router();
const protect = require('../middlewares/auth');
const notificationCtrl = require('../controllers/notificationController');

router.get('/', protect, notificationCtrl.getMyNotifications);
router.get('/unread-count', protect, notificationCtrl.getUnreadCount);
router.patch('/:id/read', protect, notificationCtrl.markNotificationAsRead);
router.patch('/read-all', protect, notificationCtrl.markAllNotificationsAsRead);
router.delete('/:id', protect, notificationCtrl.deleteNotification);

// Admin / cron
router.delete('/cleanup/old', notificationCtrl.clearOldNotifications);

module.exports = router;
