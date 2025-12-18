const Statistics = require('../models/Statistics');
const User = require('../models/User');

class StatisticsService {
  // Calculate daily statistics
  static async calculateDailyStatistics(startDate, endDate) {
    // Get new users for the day
    const newUsers = await User.countDocuments({
      createdAt: { $gte: startDate, $lte: endDate }
    });

    // Get active users (users who logged in today)
    const activeUsers = await User.countDocuments({
      lastLogin: { $gte: startDate, $lte: endDate }
    });

    // Get total users up to this date
    const totalUsers = await User.countDocuments({
      createdAt: { $lte: endDate }
    });

    // Get user roles distribution
    const userRoles = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);

    // Convert to object
    const rolesObject = {};
    userRoles.forEach(role => {
      rolesObject[role._id] = role.count;
    });

    // Save or update statistics
    await Statistics.findOneAndUpdate(
      { date: startDate, periodType: 'daily' },
      {
        date: startDate,
        periodType: 'daily',
        newUsers,
        activeUsers,
        totalUsers,
        userRoles: rolesObject
      },
      { upsert: true, new: true }
    );

    return {
      date: startDate,
      period: 'daily',
      newUsers,
      activeUsers,
      totalUsers,
      userRoles: rolesObject
    };
  }

  // Calculate weekly statistics
  static async calculateWeeklyStatistics(startDate) {
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 6);

    const stats = await Statistics.aggregate([
      {
        $match: {
          date: { $gte: startDate, $lte: endDate },
          periodType: 'daily'
        }
      },
      {
        $group: {
          _id: null,
          totalNewUsers: { $sum: '$newUsers' },
          maxActiveUsers: { $max: '$activeUsers' },
          avgActiveUsers: { $avg: '$activeUsers' }
        }
      }
    ]);

    const weeklyStats = stats[0] || {
      totalNewUsers: 0,
      maxActiveUsers: 0,
      avgActiveUsers: 0
    };

    // Save weekly statistics
    await Statistics.findOneAndUpdate(
      { date: startDate, periodType: 'weekly' },
      {
        date: startDate,
        periodType: 'weekly',
        newUsers: weeklyStats.totalNewUsers,
        activeUsers: weeklyStats.maxActiveUsers
      },
      { upsert: true, new: true }
    );

    return {
      startDate,
      endDate,
      period: 'weekly',
      ...weeklyStats
    };
  }

  // Calculate monthly statistics
  static async calculateMonthlyStatistics(targetDate) {
    const startDate = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1);
    const endDate = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0);

    const stats = await Statistics.aggregate([
      {
        $match: {
          date: { $gte: startDate, $lte: endDate },
          periodType: 'daily'
        }
      },
      {
        $group: {
          _id: null,
          totalNewUsers: { $sum: '$newUsers' },
          totalActiveUsers: { $sum: '$activeUsers' },
          avgDailyActiveUsers: { $avg: '$activeUsers' },
          peakActiveUsers: { $max: '$activeUsers' }
        }
      }
    ]);

    const monthlyStats = stats[0] || {
      totalNewUsers: 0,
      totalActiveUsers: 0,
      avgDailyActiveUsers: 0,
      peakActiveUsers: 0
    };

    // Save monthly statistics
    await Statistics.findOneAndUpdate(
      { date: startDate, periodType: 'monthly' },
      {
        date: startDate,
        periodType: 'monthly',
        newUsers: monthlyStats.totalNewUsers,
        activeUsers: monthlyStats.peakActiveUsers
      },
      { upsert: true, new: true }
    );

    return {
      month: targetDate.getMonth() + 1,
      year: targetDate.getFullYear(),
      period: 'monthly',
      ...monthlyStats
    };
  }

  // Calculate yearly statistics
  static async calculateYearlyStatistics(year) {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);

    const stats = await Statistics.aggregate([
      {
        $match: {
          date: { $gte: startDate, $lte: endDate },
          periodType: 'monthly'
        }
      },
      {
        $group: {
          _id: null,
          totalNewUsers: { $sum: '$newUsers' },
          avgMonthlyActiveUsers: { $avg: '$activeUsers' },
          peakMonthlyActiveUsers: { $max: '$activeUsers' }
        }
      }
    ]);

    const yearlyStats = stats[0] || {
      totalNewUsers: 0,
      avgMonthlyActiveUsers: 0,
      peakMonthlyActiveUsers: 0
    };

    // Get user growth rate
    const startOfYearUsers = await User.countDocuments({
      createdAt: { $lt: startDate }
    });
    const endOfYearUsers = await User.countDocuments({
      createdAt: { $lte: endDate }
    });

    const growthRate = startOfYearUsers > 0 
      ? ((endOfYearUsers - startOfYearUsers) / startOfYearUsers) * 100 
      : 100;

    // Save yearly statistics
    await Statistics.findOneAndUpdate(
      { date: startDate, periodType: 'yearly' },
      {
        date: startDate,
        periodType: 'yearly',
        newUsers: yearlyStats.totalNewUsers,
        activeUsers: yearlyStats.peakMonthlyActiveUsers
      },
      { upsert: true, new: true }
    );

    return {
      year,
      period: 'yearly',
      ...yearlyStats,
      startOfYearUsers,
      endOfYearUsers,
      growthRate: growthRate.toFixed(2)
    };
  }

  // Calculate 5-year statistics
  static async calculateFiveYearStatistics(startYear, endYear) {
    const years = [];
    const stats = [];

    for (let year = startYear; year <= endYear; year++) {
      const yearStats = await this.calculateYearlyStatistics(year);
      years.push(year);
      stats.push(yearStats);
    }

    // Calculate trends
    const totalGrowth = stats.reduce((sum, stat) => sum + parseFloat(stat.growthRate || 0), 0);
    const avgGrowth = totalGrowth / stats.length;

    return {
      period: '5year',
      startYear,
      endYear,
      years,
      stats,
      averageAnnualGrowth: avgGrowth.toFixed(2),
      totalNewUsers: stats.reduce((sum, stat) => sum + stat.totalNewUsers, 0)
    };
  }

  // Get comprehensive statistics summary
  static async getStatisticsSummary() {
    const now = new Date();
    
    // Today
    const todayStart = new Date(now.setHours(0, 0, 0, 0));
    const todayEnd = new Date(now.setHours(23, 59, 59, 999));
    const dailyStats = await this.calculateDailyStatistics(todayStart, todayEnd);

    // This week
    const weekStart = new Date(now);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const weeklyStats = await this.calculateWeeklyStatistics(weekStart);

    // This month
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthlyStats = await this.calculateMonthlyStatistics(monthStart);

    // This year
    const yearlyStats = await this.calculateYearlyStatistics(now.getFullYear());

    // 5-year overview
    const fiveYearStats = await this.calculateFiveYearStatistics(now.getFullYear() - 4, now.getFullYear());

    return {
      daily: dailyStats,
      weekly: weeklyStats,
      monthly: monthlyStats,
      yearly: yearlyStats,
      fiveYear: fiveYearStats,
      timestamp: new Date()
    };
  }
}

module.exports = StatisticsService;