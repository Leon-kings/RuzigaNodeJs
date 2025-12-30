const mongoose = require('mongoose');

// Blog Schema
const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true
  },
  excerpt: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  content: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    enum: ['admissions', 'visa', 'accommodation', 'travel', 'culture'],
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  image: {
    url: String,
    publicId: String,
    alt: String
  },
  readTime: {
    type: Number,
    default: 5,
    min: 1
  },
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  comments: {
    type: Number,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'published'
  },
  publishedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Generate slug before saving
blogSchema.pre('save', function(next) {
  if (!this.isModified('title')) return next();
  
  this.slug = this.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  
  next();
});

// Comment Schema
const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog',
    required: true
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    trim: true
  },
  likes: {
    type: Number,
    default: 0
  },
  isApproved: {
    type: Boolean,
    default: true
  },
  parentComment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }
}, {
  timestamps: true
});

// Booking Schema
const bookingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  country: {
    type: String,
    required: true,
    trim: true
  },
  service: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    required: true
  },
  message: String,
  postTitle: String,
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog'
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },
  notes: String
}, {
  timestamps: true
});

// Statistics Schema
const statisticsSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['page_view', 'post_view', 'booking', 'comment', 'like', 'search', 'contact'],
    required: true
  },
  page: String,
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog'
  },
  userAgent: String,
  ip: String,
  country: String,
  device: String,
  browser: String,
  query: String,
  category: String,
  metadata: mongoose.Schema.Types.Mixed
}, {
  timestamps: true
});

// Create models with checks to prevent overwrites
const Blog = mongoose.models.Blog || mongoose.model('Blog', blogSchema);
const Comment = mongoose.models.Comment || mongoose.model('Comment', commentSchema);
const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);
const Statistics = mongoose.models.Statistics || mongoose.model('Statistics', statisticsSchema);

module.exports = {
  Blog,
  Comment,
  Booking,
  Statistics
};