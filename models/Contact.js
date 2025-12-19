const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email'
      ]
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
      minlength: [5, 'Subject must be at least 5 characters'],
      maxlength: [200, 'Subject cannot exceed 200 characters']
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
      minlength: [10, 'Message must be at least 10 characters'],
      maxlength: [5000, 'Message cannot exceed 5000 characters']
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'read', 'replied', 'archived'],
        message: '{VALUE} is not a valid status'
      },
      default: 'pending',
      index: true
    },
    replied: {
      type: Boolean,
      default: false
    },
    replyMessage: {
      type: String,
      default: '',
      maxlength: [5000, 'Reply message cannot exceed 5000 characters']
    },
    repliedAt: {
      type: Date,
      index: true
    },
    ipAddress: {
      type: String,
      index: true
    },
    userAgent: {
      type: String
    },
    tags: [
      {
        type: String,
        trim: true
      }
    ],
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    notes: [
      {
        content: String,
        createdBy: String,
        createdAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    attachments: [
      {
        filename: String,
        path: String,
        size: Number,
        mimetype: String,
        uploadedAt: {
          type: Date,
          default: Date.now
        }
      }
    ]
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

//
// ─────────────────────────────────────────────────────────────
// Virtuals
// ─────────────────────────────────────────────────────────────
//

// Response time in hours
contactSchema.virtual('responseTimeHours').get(function () {
  if (this.replied && this.repliedAt && this.createdAt) {
    const diffMs = this.repliedAt - this.createdAt;
    return diffMs / (1000 * 60 * 60);
  }
  return null;
});

// Days open
contactSchema.virtual('daysOpen').get(function () {
  if (this.status !== 'replied' && this.createdAt) {
    const diffMs = new Date() - this.createdAt;
    return Math.floor(diffMs / (1000 * 60 * 60 * 24));
  }
  return 0;
});

//
// ─────────────────────────────────────────────────────────────
// Indexes
// ─────────────────────────────────────────────────────────────
//

contactSchema.index({ email: 1, createdAt: -1 });
contactSchema.index({ status: 1, createdAt: -1 });
contactSchema.index({ createdAt: -1 });
contactSchema.index({ priority: 1, createdAt: -1 });
contactSchema.index({ replied: 1, repliedAt: -1 });

//
// ─────────────────────────────────────────────────────────────
// FIXED PRE-SAVE MIDDLEWARE
// (NO next() → fixes "next is not a function")
// ─────────────────────────────────────────────────────────────
//

contactSchema.pre('save', function () {
  if (this.isModified('replyMessage') && this.replyMessage && !this.repliedAt) {
    this.repliedAt = new Date();
    this.replied = true;
    this.status = 'replied';
  }
});

//
// ─────────────────────────────────────────────────────────────
// Static methods
// ─────────────────────────────────────────────────────────────
//

contactSchema.statics.findByStatus = function (status) {
  return this.find({ status }).sort({ createdAt: -1 });
};

contactSchema.statics.getWithResponseTime = function () {
  return this.aggregate([
    {
      $match: {
        replied: true,
        repliedAt: { $exists: true }
      }
    },
    {
      $addFields: {
        responseTimeHours: {
          $divide: [
            { $subtract: ['$repliedAt', '$createdAt'] },
            1000 * 60 * 60
          ]
        }
      }
    }
  ]);
};

//
// ─────────────────────────────────────────────────────────────
// Instance methods
// ─────────────────────────────────────────────────────────────
//

contactSchema.methods.markAsReplied = async function (replyMessage) {
  this.replyMessage = replyMessage;
  this.replied = true;
  this.status = 'replied';
  this.repliedAt = new Date();
  return this.save();
};

contactSchema.methods.addNote = async function (content, createdBy) {
  this.notes.push({ content, createdBy });
  return this.save();
};

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;
