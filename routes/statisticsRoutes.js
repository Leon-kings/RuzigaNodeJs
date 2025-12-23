const express = require('express');
const router = express.Router();
const statisticsController = require('../controllers/statisticsController');

// Get statistics by period
router.get('/daily', statisticsController.getDailyStatistics);
router.get('/weekly', statisticsController.getWeeklyStatistics);
router.get('/monthly', statisticsController.getMonthlyStatistics);
router.get('/yearly', statisticsController.getYearlyStatistics);
router.get('/five-year', statisticsController.getFiveYearStatistics);
router.get('/summary', statisticsController.getStatisticsSummary);

module.exports = router;