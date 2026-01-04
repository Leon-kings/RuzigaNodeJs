const mongoose = require('mongoose');

const scholarshipSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a scholarship title'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters'],
    minlength: [10, 'Title must be at least 10 characters']
  },
  provider: {
    type: String,
    required: [true, 'Please provide a scholarship provider'],
    trim: true,
    maxlength: [100, 'Provider name cannot exceed 100 characters']
  },
  country: {
    type: String,
    required: [true, 'Please provide a country'],
    trim: true
  },
  type: {
    type: String,
    required: [true, 'Please provide a scholarship type'],
    enum: {
      values: ['Fully Funded', 'Partially Funded', 'Self Funded'],
      message: '{VALUE} is not a valid scholarship type'
    }
  },
  studyLevel: [{
    type: String,
    required: [true, 'Please provide at least one study level'],
    enum: {
      values: ['Bachelor', 'Master', 'PhD', 'Diploma', 'Certificate', 'Research', 'Exchange'],
      message: '{VALUE} is not a valid study level'
    }
  }],
  fundingAmount: {
    type: String,
    default: 'Not specified',
    maxlength: [100, 'Funding amount description cannot exceed 100 characters']
  },
  deadline: {
    type: Date,
    required: [true, 'Please provide an application deadline']
  },
  applicationStatus: {
    type: String,
    enum: {
      values: ['open', 'closed', 'upcoming'],
      message: '{VALUE} is not a valid application status'
    },
    default: 'open'
  },
  image: {
    type: String,
    default: ''
  },
  imagePublicId: {
    type: String,
    default: ''
  },
  featured: {
    type: Boolean,
    default: false
  },
  eligibility: {
    type: String,
    required: [true, 'Please provide eligibility criteria'],
    maxlength: [1000, 'Eligibility cannot exceed 1000 characters']
  },
  description: {
    type: String,
    maxlength: [5000, 'Description cannot exceed 5000 characters']
  },
  benefits: [{
    type: String,
    maxlength: [200, 'Benefit cannot exceed 200 characters']
  }],
  requirements: [{
    type: String,
    maxlength: [200, 'Requirement cannot exceed 200 characters']
  }],
  applicationLink: {
    type: String,
    match: [/^https?:\/\/.+/, 'Please provide a valid URL starting with http:// or https://']
  },
  contactEmail: {
    type: String,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
  },
  tags: [{
    type: String,
    maxlength: [50, 'Tag cannot exceed 50 characters']
  }],
  views: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Optional, if you have user authentication
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual fields
scholarshipSchema.virtual('daysUntilDeadline').get(function() {
  if (!this.deadline) return null;
  const now = new Date();
  const deadline = new Date(this.deadline);
  const diffTime = deadline - now;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

scholarshipSchema.virtual('isExpired').get(function() {
  if (!this.deadline) return false;
  const now = new Date();
  return this.deadline < now;
});

scholarshipSchema.virtual('urgencyLevel').get(function() {
  const days = this.daysUntilDeadline;
  if (days < 0) return 'expired';
  if (days <= 7) return 'urgent';
  if (days <= 30) return 'soon';
  return 'normal';
});

// Indexes for optimized queries
scholarshipSchema.index({ title: 'text', provider: 'text', eligibility: 'text', description: 'text' });
scholarshipSchema.index({ applicationStatus: 1, deadline: 1 });
scholarshipSchema.index({ featured: 1, createdAt: -1 });
scholarshipSchema.index({ country: 1 });
scholarshipSchema.index({ type: 1 });
scholarshipSchema.index({ studyLevel: 1 });
scholarshipSchema.index({ tags: 1 });
scholarshipSchema.index({ createdAt: -1 });

// Middleware to update status based on deadline
scholarshipSchema.pre('save', function(next) {
  const now = new Date();
  
  if (this.deadline && this.deadline < now) {
    this.applicationStatus = 'closed';
  }
  
  // Ensure arrays are properly formatted
  if (this.studyLevel && !Array.isArray(this.studyLevel)) {
    this.studyLevel = [this.studyLevel];
  }
  
  if (this.benefits && !Array.isArray(this.benefits)) {
    this.benefits = this.benefits.split(',').map(b => b.trim()).filter(b => b);
  }
  
  if (this.requirements && !Array.isArray(this.requirements)) {
    this.requirements = this.requirements.split(',').map(r => r.trim()).filter(r => r);
  }
  
  if (this.tags && !Array.isArray(this.tags)) {
    this.tags = this.tags.split(',').map(t => t.trim()).filter(t => t);
  }
  
  next();
});

// Static method for pagination
scholarshipSchema.statics.paginate = async function(query, options) {
  const { page = 1, limit = 10, sort = '-createdAt' } = options;
  const skip = (page - 1) * limit;
  
  const [results, total] = await Promise.all([
    this.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
    this.countDocuments(query)
  ]);
  
  const totalPages = Math.ceil(total / limit);
  const hasNext = page < totalPages;
  const hasPrev = page > 1;
  
  return {
    results,
    pagination: {
      total,
      totalPages,
      currentPage: page,
      pageSize: limit,
      hasNext,
      hasPrev,
      nextPage: hasNext ? page + 1 : null,
      prevPage: hasPrev ? page - 1 : null
    }
  };
};

// Query middleware for filtering
scholarshipSchema.query.applyFilters = function(filters) {
  let query = this;
  
  // Filter by application status
  if (filters.status) {
    query = query.where('applicationStatus', filters.status);
  }
  
  // Filter by country
  if (filters.country) {
    query = query.where('country', new RegExp(filters.country, 'i'));
  }
  
  // Filter by type
  if (filters.type) {
    query = query.where('type', filters.type);
  }
  
  // Filter by study level
  if (filters.studyLevel) {
    query = query.where('studyLevel').in(filters.studyLevel.split(','));
  }
  
  // Filter by featured status
  if (filters.featured !== undefined) {
    query = query.where('featured', filters.featured === 'true');
  }
  
  // Filter by tags
  if (filters.tags) {
    query = query.where('tags').in(filters.tags.split(','));
  }
  
  // Date range filters
  if (filters.deadlineFrom) {
    query = query.where('deadline').gte(new Date(filters.deadlineFrom));
  }
  
  if (filters.deadlineTo) {
    query = query.where('deadline').lte(new Date(filters.deadlineTo));
  }
  
  if (filters.createdAfter) {
    query = query.where('createdAt').gte(new Date(filters.createdAfter));
  }
  
  // Search by keyword
  if (filters.search) {
    query = query.or([
      { title: new RegExp(filters.search, 'i') },
      { provider: new RegExp(filters.search, 'i') },
      { description: new RegExp(filters.search, 'i') },
      { eligibility: new RegExp(filters.search, 'i') }
    ]);
  }
  
  return query;
};

module.exports = mongoose.model('Scholarship', scholarshipSchema);