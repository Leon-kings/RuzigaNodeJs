const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema({
  // Main FAQ fields
  question: {
    type: String,
    required: [true, 'Question is required'],
    trim: true,
    minlength: [10, 'Question must be at least 10 characters'],
    maxlength: [500, 'Question cannot exceed 500 characters']
  },
  
  answer: {
    type: String,
    required: [true, 'Answer is required'],
    trim: true,
    minlength: [20, 'Answer must be at least 20 characters'],
    maxlength: [2000, 'Answer cannot exceed 2000 characters']
  },
  
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'admissions', 
      'visa', 
      'accommodation', 
      'work', 
      'planning', 
      'support', 
      'funding', 
      'health', 
      'culture', 
      'language', 
      'cost', 
      'eligibility', 
      'documents', 
      'family', 
      'academics',
      'user-submitted',
      'pending'
    ],
    default: 'pending'
  },
  
  // Status tracking
  status: {
    type: String,
    enum: ['active', 'pending', 'archived'],
    default: 'active'
  },
  
  // Popularity metrics
  views: {
    type: Number,
    default: 0
  },
  
  helpfulVotes: {
    type: Number,
    default: 0
  },
  
  unhelpfulVotes: {
    type: Number,
    default: 0
  },
  
  // User who submitted (for user questions)
  submittedBy: {
    email: {
      type: String,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
    },
    name: {
      type: String,
      trim: true
    },
    ipAddress: {
      type: String,
      trim: true
    }
  },
  
  // Admin who answered (for pending questions)
  answeredBy: {
    adminEmail: {
      type: String,
      lowercase: true,
      trim: true
    },
    answeredAt: Date
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  },
  
  // For statistics
  lastViewedAt: Date,
  
  // Tags for better search
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for helpful percentage
faqSchema.virtual('helpfulPercentage').get(function() {
  const totalVotes = this.helpfulVotes + this.unhelpfulVotes;
  return totalVotes > 0 ? Math.round((this.helpfulVotes / totalVotes) * 100) : 0;
});

// Indexes for better performance
faqSchema.index({ category: 1, status: 1 });
faqSchema.index({ question: 'text', answer: 'text' });
faqSchema.index({ views: -1 });
faqSchema.index({ createdAt: -1 });
faqSchema.index({ 'submittedBy.email': 1 });

// Pre-save middleware to update updatedAt
faqSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Static method to get statistics
faqSchema.statics.getStatistics = async function() {
  const totalFAQs = await this.countDocuments();
  const activeFAQs = await this.countDocuments({ status: 'active' });
  const pendingQuestions = await this.countDocuments({ status: 'pending' });
  const totalViews = await this.aggregate([
    { $group: { _id: null, totalViews: { $sum: '$views' } } }
  ]);
  
  const categoryStats = await this.aggregate([
    { $group: { 
        _id: '$category', 
        count: { $sum: 1 },
        totalViews: { $sum: '$views' }
      } 
    },
    { $sort: { count: -1 } }
  ]);
  
  const recentQuestions = await this.find({ status: 'pending' })
    .sort({ createdAt: -1 })
    .limit(10)
    .select('question createdAt submittedBy category');
    
  const popularFAQs = await this.find({ status: 'active' })
    .sort({ views: -1 })
    .limit(5)
    .select('question views category helpfulVotes');
  
  return {
    totalFAQs,
    activeFAQs,
    pendingQuestions,
    totalViews: totalViews[0]?.totalViews || 0,
    categoryStats,
    recentQuestions,
    popularFAQs,
    generatedAt: new Date()
  };
};

module.exports = mongoose.model('FAQ', faqSchema);