const mongoose = require('mongoose');

// Check if model already exists before defining it
if (mongoose.models.AssistanceRequest) {
  module.exports = mongoose.model('AssistanceRequest');
} else {
  const assistanceRequestSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
    },
    issueType: {
      type: String,
      required: [true, 'Issue type is required'],
      enum: ['technical', 'billing', 'general', 'bug', 'feature', 'other'],
      default: 'general'
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
      minlength: [10, 'Message must be at least 10 characters']
    },
    pageUrl: {
      type: String,
      required: [true, 'Page URL is required'],
      trim: true
    },
    ip: {
      type: String,
      trim: true
    },
    userAgent: {
      type: String,
      trim: true
    },
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'resolved', 'closed'],
      default: 'pending'
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium'
    },
    assignedTo: {
      type: String,
      trim: true
    },
    notes: {
      type: String,
      trim: true
    },
    resolutionNotes: {
      type: String,
      trim: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    },
    resolvedAt: {
      type: Date
    }
  }, {
    timestamps: true
  });

  // Create indexes
  assistanceRequestSchema.index({ status: 1, createdAt: -1 });
  assistanceRequestSchema.index({ email: 1, createdAt: -1 });
  assistanceRequestSchema.index({ issueType: 1, createdAt: -1 });
  assistanceRequestSchema.index({ priority: 1 });

  module.exports = mongoose.model('AssistanceRequest', assistanceRequestSchema);
}