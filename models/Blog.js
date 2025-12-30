const mongoose = require('mongoose');

// Check if models already exist to prevent overwriting
const Blog = mongoose.models.Blog || mongoose.model('Blog', new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  excerpt: {
    type: String,
    required: true,
    maxlength: 200
  },
  content: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['technology', 'business', 'health', 'education', 'lifestyle', 'other']
  },
  tags: [{
    type: String,
    trim: true
  }],
  author: {
    type: String,
    required: true
  },
  readTime: {
    type: Number,
    required: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  image: {
    url: {
      type: String,
      required: true
    },
    public_id: {
      type: String
    },
    alt: {
      type: String,
      default: 'Blog image'
    }
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
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'published'
  }
}, {
  timestamps: true
}));

const Comment = mongoose.models.Comment || mongoose.model('Comment', new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog',
    required: true
  },
  author: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  isApproved: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
}));

const Booking = mongoose.models.Booking || mongoose.model('Booking', new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  service: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  message: {
    type: String
  },
  postTitle: {
    type: String
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog'
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  }
}, {
  timestamps: true
}));

const Statistics = mongoose.models.Statistics || mongoose.model('Statistics', new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['post_view', 'like', 'comment', 'search', 'booking', 'contact']
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog'
  },
  query: String,
  category: String,
  service: String,
  country: String,
  name: String,
  email: String,
  subject: String,
  ip: String,
  userAgent: String,
  browser: String,
  device: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
}));

// Create indexes (only if the model is being created for the first time)
if (!mongoose.models.Blog) {
  Blog.schema.index({ slug: 1 });
  Blog.schema.index({ category: 1, status: 1, createdAt: -1 });
  Blog.schema.index({ views: -1 });
  Blog.schema.index({ featured: 1, status: 1 });
  Comment.schema.index({ post: 1, createdAt: -1 });
  Statistics.schema.index({ type: 1, timestamp: -1 });
}

module.exports = {
  Blog,
  Comment,
  Booking,
  Statistics
};