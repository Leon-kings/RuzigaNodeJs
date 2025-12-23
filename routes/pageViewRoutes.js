const express = require('express');
const router = express.Router();
const {
  trackView,
  getViewStats,
  getRealtimeStats
} = require('../controllers/pageViewController');

// Public routes
router.post('/track', trackView);

// Stats routes (add auth if needed)
router.get('/stats', getViewStats);
router.get('/realtime', getRealtimeStats);

module.exports = router;