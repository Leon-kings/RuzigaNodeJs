// const mongoose = require('mongoose');

// const viewTrackingSchema = new mongoose.Schema({
//   ip: {
//     type: String,
//     required: true
//   },
//   timestamp: {
//     type: Date,
//     default: Date.now
//   }
// }, {
//   timestamps: true
// });

// // Index for faster queries
// viewTrackingSchema.index({ timestamp: -1 });
// viewTrackingSchema.index({ ip: 1 });

// const ViewTracking = mongoose.model('ViewTracking', viewTrackingSchema);

// module.exports = ViewTracking;























const mongoose = require('mongoose');

const viewTrackingSchema = new mongoose.Schema({
  ip: {
    type: String,
    required: true,
    unique: true, // Prevent duplicate IP entries
    trim: true
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
viewTrackingSchema.index({ ip: 1 }, { unique: true }); // Optional: enforce uniqueness at index level

const ViewTracking = mongoose.model('ViewTracking', viewTrackingSchema);

module.exports = ViewTracking;
