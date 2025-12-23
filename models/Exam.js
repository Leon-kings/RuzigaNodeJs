const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Exam name is required'],
    trim: true
  },
  type: {
    type: String,
    required: [true, 'Exam type is required'],
    enum: ['General', 'Specialized', 'Certification']
  },
  levels: [{
    type: String,
    enum: ['Undergraduate Level', 'Graduate Level', 'PhD Level']
  }],
  nextExamDate: {
    type: Date,
    required: [true, 'Next exam date is required']
  },
  registrationDeadline: {
    type: Date,
    required: [true, 'Registration deadline is required']
  },
  registrationStatus: {
    type: String,
    enum: ['open', 'closed', 'upcoming', 'full'],
    default: 'open'
  },
  duration: String,
  fee: {
    amount: Number,
    currency: {
      type: String,
      default: 'USD'
    }
  },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
    default: 'Intermediate'
  },
  passingScore: {
    type: Number,
    default: 70
  },
  
  // Cloudinary image storage
  image: String,
  imageInfo: {
    cloudinaryId: String,
    format: String,
    size: Number
  },
  
  featured: {
    type: Boolean,
    default: false
  },
  description: String,
  requirements: [String],
  testCenters: [String],
  preparationTime: String,
  recommendedFor: [String],
  topics: [String],
  
  registrations: [{
    userId: mongoose.Schema.Types.ObjectId,
    userEmail: String,
    userName: String,
    userPhone: String,
    organization: String,
    registrationDate: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'confirmed'
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending'
    }
  }],
  
  statistics: {
    totalRegistrations: {
      type: Number,
      default: 0
    },
    totalPassed: {
      type: Number,
      default: 0
    },
    totalFailed: {
      type: Number,
      default: 0
    },
    averageScore: {
      type: Number,
      default: 0
    },
    passRate: {
      type: Number,
      default: 0
    }
  },
  
  createdBy: String,
  updatedBy: String,
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Exam', examSchema);