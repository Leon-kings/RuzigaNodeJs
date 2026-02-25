

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
    enum: ['Fully Funded', 'Partially Funded', 'Self Funded']
  },
  studyLevel: [{
    type: String,
    required: true,
    enum: ['Bachelor', 'Master', 'PhD', 'Diploma', 'Certificate', 'Research', 'Exchange']
  }],
  fundingAmount: {
    type: String,
    default: 'Not specified',
    maxlength: 100
  },
  deadline: {
    type: Date,
    required: [true, 'Please provide an application deadline']
  },
  applicationStatus: {
    type: String,
    enum: ['open', 'closed', 'upcoming'],
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
    required: true,
    maxlength: 1000
  },
  description: {
    type: String,
    maxlength: 5000
  },
  benefits: [{
    type: String,
    maxlength: 200
  }],
  requirements: [{
    type: String,
    maxlength: 200
  }],
  contactEmail: {
    type: String,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
  },
  tags: [{
    type: String,
    maxlength: 50
  }],
  views: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

/* =======================
   VIRTUALS
======================= */
scholarshipSchema.virtual('daysUntilDeadline').get(function () {
  if (!this.deadline) return null;
  const diff = new Date(this.deadline) - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
});

scholarshipSchema.virtual('isExpired').get(function () {
  return this.deadline < new Date();
});

scholarshipSchema.virtual('urgencyLevel').get(function () {
  const days = this.daysUntilDeadline;
  if (days < 0) return 'expired';
  if (days <= 7) return 'urgent';
  if (days <= 30) return 'soon';
  return 'normal';
});

/* =======================
   INDEXES
======================= */
scholarshipSchema.index({ title: 'text', provider: 'text', eligibility: 'text', description: 'text' });
scholarshipSchema.index({ applicationStatus: 1, deadline: 1 });
scholarshipSchema.index({ featured: 1, createdAt: -1 });
scholarshipSchema.index({ country: 1 });
scholarshipSchema.index({ type: 1 });
scholarshipSchema.index({ studyLevel: 1 });
scholarshipSchema.index({ tags: 1 });

/* =======================
   PRE SAVE MIDDLEWARE (FIXED)
======================= */
scholarshipSchema.pre('save', function (next) {
  const now = new Date();

  if (this.deadline && this.deadline < now) {
    this.applicationStatus = 'closed';
  }

  if (this.studyLevel && !Array.isArray(this.studyLevel)) {
    this.studyLevel = [this.studyLevel];
  }

  if (this.benefits && !Array.isArray(this.benefits)) {
    this.benefits = this.benefits.split(',').map(b => b.trim()).filter(Boolean);
  }

  if (this.requirements && !Array.isArray(this.requirements)) {
    this.requirements = this.requirements.split(',').map(r => r.trim()).filter(Boolean);
  }

  if (this.tags && !Array.isArray(this.tags)) {
    this.tags = this.tags.split(',').map(t => t.trim()).filter(Boolean);
  }

  // ✅ SAFE CALL
  if (typeof next === 'function') next();
});

/* =======================
   STATIC PAGINATION
======================= */
scholarshipSchema.statics.paginate = async function (query, options = {}) {
  const page = Number(options.page) || 1;
  const limit = Number(options.limit) || 10;
  const skip = (page - 1) * limit;

  const [results, total] = await Promise.all([
    this.find(query).skip(skip).limit(limit).sort(options.sort || '-createdAt'),
    this.countDocuments(query)
  ]);

  return {
    results,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit)
    }
  };
};

module.exports = mongoose.model('Scholarship', scholarshipSchema);
