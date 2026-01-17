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
const notificationCtrl = require('../controllers/notificationController');

router.get('/', notificationCtrl.getMyNotifications);
router.get('/:email', notificationCtrl.getNotificationsByEmail);
router.get('/unread-count', notificationCtrl.getUnreadCount);
router.patch('/:id/read', notificationCtrl.markNotificationAsRead);
router.patch('/read-all', notificationCtrl.markAllNotificationsAsRead);
router.delete('/:id', notificationCtrl.deleteNotification);

// Admin / cron
router.delete('/cleanup/old', notificationCtrl.clearOldNotifications);

module.exports = router;
