const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/pageViewController');

// Track page view
router.post('/', analyticsController.trackPageView);

// Get all page views
router.get('/', analyticsController.getPageViews);

// Get statistics
router.get('/stats', analyticsController.getStatistics);
router.get('/stats/realtime', analyticsController.getRealTimeStats);
router.get('/stats/:route', analyticsController.getRouteStats);

module.exports = router;