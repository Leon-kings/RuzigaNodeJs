// const mongoose = require('mongoose');


// const bookingSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//       trim: true
//     },

//     email: {
//       type: String,
//       required: true,
//       lowercase: true,
//       trim: true
//     },

//     phone: {
//       type: String,
//       required: true,
//       trim: true
//     },

//     country: {
//       type: String,
//       required: true,
//       trim: true
//     },

//     service: {
//       type: String,
//       required: true,
//       trim: true
//     },

//     serviceCategory: {
//       type: String,
//       enum: ["admissions", "scholarship", "visa", "support"],
//       default: "scholarship"
//     },

//     date: {
//       type: Date,
//       required: true
//     },

//     educationLevel: {
//       type: String,
//       enum: ["highschool", "bachelor", "master", "phd", ""],
//       default: ""
//     },

//     program: {
//       type: String,
//       default: ""
//     },

//     budget: {
//       type: String,
//       enum: ["low", "medium", "high", "premium", ""],
//       default: ""
//     },

//     startDate: {
//       type: Date,
//       required: true
//     },

//     message: {
//       type: String,
//       default: ""
//     },

//     notes: [
//       {
//         content: String,
//         addedAt: { type: Date, default: Date.now }
//       }
//     ],

//     status: {
//       type: String,
//       enum: ["pending", "contacted", "in_progress", "completed", "cancelled"],
//       default: "pending"
//     },

//     ipAddress: String,
//     userAgent: String
//   },
//   {
//     timestamps: true
//   }
// );

// // Indexes for performance
// bookingSchema.index({ 'customer.email': 1 });
// bookingSchema.index({ 'service.category': 1 });
// bookingSchema.index({ status: 1 });
// bookingSchema.index({ bookingDate: -1 });
// bookingSchema.index({ 
//   'customer.fullName': 'text', 
//   'customer.email': 'text', 
//   'service.name': 'text' 
// });

// const Booking = mongoose.model('Booking', bookingSchema);

// module.exports = Booking;





















const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
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

    serviceCategory: {
      type: String,
      enum: ["admissions", "scholarship", "visa", "support"],
      default: "scholarship"
    },

    date: {
      type: Date,
      required: true
    },

    educationLevel: {
      type: String,
      enum: ["highschool", "bachelor", "master", "phd", ""],
      default: ""
    },

    program: {
      type: String,
      default: ""
    },

    budget: {
      type: String,
      enum: ["low", "medium", "high", "premium", ""],
      default: ""
    },

    startDate: {
      type: Date,
      required: true
    },

    message: {
      type: String,
      default: ""
    },

    notes: [
      {
        content: String,
        addedAt: {
          type: Date,
          default: Date.now
        }
      }
    ],

    status: {
      type: String,
      enum: ["pending", "contacted", "in_progress", "completed", "cancelled"],
      default: "pending"
    },

    ipAddress: String,
    userAgent: String
  },
  {
    timestamps: true
  }
);

/* ================= INDEXES (FIXED) ================= */

// email search (getBookingsByEmail)
bookingSchema.index({ email: 1 });

// admin filters
bookingSchema.index({ service: 1 });
bookingSchema.index({ serviceCategory: 1 });
bookingSchema.index({ country: 1 });
bookingSchema.index({ status: 1 });

// date filtering & stats
bookingSchema.index({ createdAt: -1 });
bookingSchema.index({ date: -1 });

// text search (admin search box)
bookingSchema.index({
  name: 'text',
  email: 'text',
  phone: 'text',
  service: 'text',
  program: 'text'
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
