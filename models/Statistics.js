const mongoose = require('mongoose');

const statisticsSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    index: true
  },
  periodType: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'yearly', '5year'],
    required: true
  },
  newUsers: {
    type: Number,
    default: 0
  },
  activeUsers: {
    type: Number,
    default: 0
  },
  totalUsers: {
    type: Number,
    default: 0
  },
  logins: {
    type: Number,
    default: 0
  },
  userRoles: {
    user: { type: Number, default: 0 },
    admin: { type: Number, default: 0 }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index for efficient queries
statisticsSchema.index({ date: 1, periodType: 1 }, { unique: true });

module.exports = mongoose.model('Statistics', statisticsSchema);