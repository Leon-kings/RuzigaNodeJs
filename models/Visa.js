const mongoose = require('mongoose');

const visaSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  applicant: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['Tourist', 'Business', 'Student', 'Work', 'Transit'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'in-review'],
    default: 'pending'
  },
  date: {
    type: Date,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  priority: {
    type: String,
    enum: ['Normal', 'Express', 'Urgent'],
    default: 'Normal'
  },
  amount: {
    type: String,
    required: true
  },
  documents: {
    type: Number,
    default: 0
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
visaSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Visa', visaSchema);