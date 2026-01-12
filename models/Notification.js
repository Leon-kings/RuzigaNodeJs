// const mongoose = require('mongoose');

// const notificationSchema = new mongoose.Schema(
//   {
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User',
//       required: true
//     },

//     title: String,
//     message: String,

//     type: {
//       type: String,
//       enum: ['exam', 'book'],
//       required: true
//     },

//     exam: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Exam'
//     },

//     csceBook: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'CSCEBook'
//     },

//     isRead: {
//       type: Boolean,
//       default: false
//     }
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model('Notification', notificationSchema);











// const mongoose = require('mongoose');

// const notificationSchema = new mongoose.Schema(
//   {
//     // 🔗 User receiving the notification
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User',
//       required: true,
//       index: true
//     },

//     // 📝 Notification content
//     title: {
//       type: String,
//       required: true,
//       trim: true
//     },

//     message: {
//       type: String,
//       required: true,
//       trim: true
//     },

//     // 📌 Notification type
//     type: {
//       type: String,
//       enum: ['exam', 'book'],
//       required: true
//     },

//     // 📚 Exam reference (optional)
//     exam: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Exam',
//       default: null
//     },

//     // 📘 CSCE Book reference (optional)
//     csceBook: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'CSCEBook',
//       default: null
//     },

//     // 👁 Read status
//     isRead: {
//       type: Boolean,
//       default: false
//     }
//   },
//   {
//     timestamps: true,
//     versionKey: false
//   }
// );

// // ⚡ Index for faster queries
// notificationSchema.index({ userId: 1, createdAt: -1 });

// module.exports = mongoose.model('Notification', notificationSchema);



















const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    // 👤 User receiving the notification
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },

    // 📝 Content
    title: {
      type: String,
      required: true,
      trim: true
    },

    message: {
      type: String,
      required: true,
      trim: true
    },

    // 🔔 Type
    type: {
      type: String,
      enum: ['exam', 'book'],
      required: true,
      index: true
    },

    // 📚 Optional relations
    exam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exam',
      default: null
    },

    csceBook: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CSCEBook',
      default: null
    },

    // 👁 Read status
    isRead: {
      type: Boolean,
      default: false,
      index: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

// ⚡ Compound indexes for fast filtering
notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, isRead: 1 });

module.exports = mongoose.model('Notification', notificationSchema);

