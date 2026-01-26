// // const express = require('express');
// // const router = express.Router();
// // const {
// //   trackView,
// //   getViewStats,
// //   getRealtimeStats
// // } = require('../controllers/pageViewController');

// // // Public routes
// // router.post('/track', trackView);

// // // Stats routes (add auth if needed)
// // router.get('/stats', getViewStats);
// // router.get('/realtime', getRealtimeStats);

// // module.exports = router;
















// const express = require('express');
// const router = express.Router();

// const {
//   trackView,
//   getViewStats,
//   getRealtimeStats,
//   getAllViews,
//   deleteView,
//   deleteViewsByIp,
//   deleteAllViews
// } = require('../controllers/pageViewController');


// /* =======================
//    PUBLIC ROUTES
// ======================= */
// router.post('/track', trackView);

// /* =======================
//    ADMIN / STATS ROUTES
// ======================= */
// router.get('/stats', getViewStats);
// router.get('/realtime', getRealtimeStats);

// /* =======================
//    VIEW MANAGEMENT
// ======================= */
// // Get all views (pagination, filters)
// router.get('/', getAllViews);

// // Delete single view
// router.delete('/:id', deleteView);

// // Delete all views by IP
// router.delete('/ip/:ip', deleteViewsByIp);

// // Delete all views (danger)
// router.delete('/', deleteAllViews);

// module.exports = router;














// const express = require('express');
// const router = express.Router();

// const {
//   trackView,
//   getAllViews,
//   getViewStats,
//   getRealtimeStats,
//   deleteView,
//   deleteViewsByIp,
//   deleteAllViews
// } = require('../controllers/pageViewController');

// /* =======================
//    PUBLIC
// ======================= */
// router.post('/track', trackView);

// /* =======================
//    ADMIN / STATS
// ======================= */
// router.get('/', getAllViews);
// router.get('/stats', getViewStats);
// router.get('/realtime', getRealtimeStats);

// /* =======================
//    DELETE
// ======================= */
// router.delete('/:id', deleteView);
// router.delete('/ip/:ip', deleteViewsByIp);
// router.delete('/', deleteAllViews);

// module.exports = router;

















const express = require('express');
const router = express.Router();

const {
  trackView,
  getAllViews,
  getViewStats,
  getRealtimeStats,
  deleteView,
  deleteViewsByIp,
  deleteAllViews,
  autoDeleteOldIPs,
  bulkDeleteIPs
} = require('../controllers/pageViewController');

/* =======================
   PUBLIC ROUTES
======================= */
// Track a page view (only records if IP not already recorded)
router.post('/track', trackView);

/* =======================
   ADMIN / STATS ROUTES
======================= */
// Get all views (with optional filters & pagination)
router.get('/', getAllViews);
router.delete('/auto-delete-old', autoDeleteOldIPs);
router.delete('/bulk', bulkDeleteIPs);

// Get overall statistics
router.get('/stats', getViewStats);

// Get realtime statistics
router.get('/realtime', getRealtimeStats);

/* =======================
   DELETE ROUTES
======================= */
// Delete a single view by ID
router.delete('/:id', deleteView);

// Delete all views by IP
router.delete('/ip/:ip', deleteViewsByIp);

// Delete all views
router.delete('/', deleteAllViews);

module.exports = router;
