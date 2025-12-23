const mongoose = require('mongoose');

const viewTrackingSchema = new mongoose.Schema({
  ip: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
viewTrackingSchema.index({ timestamp: -1 });
viewTrackingSchema.index({ ip: 1 });

const ViewTracking = mongoose.model('ViewTracking', viewTrackingSchema);

module.exports = ViewTracking;