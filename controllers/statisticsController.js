const Statistics = require('../models/Statistics');
const User = require('../models/User');
const StatisticsService = require('../services/statisticsService');

// Get daily statistics
exports.getDailyStatistics = async (req, res) => {
  try {
    const { date } = req.query;
    const targetDate = date ? new Date(date) : new Date();
    
    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

    const stats = await StatisticsService.calculateDailyStatistics(startOfDay, endOfDay);
    
    res.json(stats);
  } catch (error) {
    console.error('Daily stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get weekly statistics
exports.getWeeklyStatistics = async (req, res) => {
  try {
    const { startDate } = req.query;
    const start = startDate ? new Date(startDate) : new Date();
    start.setDate(start.getDate() - start.getDay()); // Start of week (Sunday)

    const stats = await StatisticsService.calculateWeeklyStatistics(start);
    
    res.json(stats);
  } catch (error) {
    console.error('Weekly stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get monthly statistics
exports.getMonthlyStatistics = async (req, res) => {
  try {
    const { year, month } = req.query;
    const targetDate = new Date(year || new Date().getFullYear(), month ? month - 1 : new Date().getMonth(), 1);
    
    const stats = await StatisticsService.calculateMonthlyStatistics(targetDate);
    
    res.json(stats);
  } catch (error) {
    console.error('Monthly stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get yearly statistics
exports.getYearlyStatistics = async (req, res) => {
  try {
    const { year } = req.query;
    const targetYear = year || new Date().getFullYear();
    
    const stats = await StatisticsService.calculateYearlyStatistics(targetYear);
    
    res.json(stats);
  } catch (error) {
    console.error('Yearly stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get 5-year statistics
exports.getFiveYearStatistics = async (req, res) => {
  try {
    const { endYear } = req.query;
    const currentYear = new Date().getFullYear();
    const end = endYear ? parseInt(endYear) : currentYear;
    const start = end - 4;
    
    const stats = await StatisticsService.calculateFiveYearStatistics(start, end);
    
    res.json(stats);
  } catch (error) {
    console.error('5-year stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get statistics summary
exports.getStatisticsSummary = async (req, res) => {
  try {
    const summary = await StatisticsService.getStatisticsSummary();
    res.json(summary);
  } catch (error) {
    console.error('Summary stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};