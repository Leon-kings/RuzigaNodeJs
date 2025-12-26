const mongoose = require('mongoose');

const formDataSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  targetCountry: {
    type: String,
    required: [true, 'Target country is required'],
    trim: true
  },
  program: {
    type: String,
    required: [true, 'Program is required'],
    trim: true
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  educationLevel: {
    type: String,
    required: [true, 'Education level is required'],
    trim: true
  },
  budget: {
    type: String,
    required: [true, 'Budget is required'],
    trim: true
  },
  requirements: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'contacted', 'approved', 'rejected'],
    default: 'pending'
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for better query performance
formDataSchema.index({ email: 1 });
formDataSchema.index({ status: 1 });
formDataSchema.index({ submittedAt: -1 });

module.exports = mongoose.model('FormData', formDataSchema);