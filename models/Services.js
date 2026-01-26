const mongoose = require('mongoose');

// const bookingSchema = new mongoose.Schema({
//   service: {
//     name: { type: String, required: true },
//     category: { 
//       type: String, 
//       required: true,
//       enum: ['admissions', 'scholarship', 'visa', 'support']
//     },
//     priceUSD: { type: String, required: true },
//     priceRWF: { type: String, required: true }
//   },
  
//   customer: {
//     fullName: { type: String, required: true },
//     email: { type: String, required: true },
//     phone: { type: String, required: true },
//     targetCountry: { 
//       type: String, 
//       required: true,
//       enum: ['China', 'Canada', 'Germany', 'USA', 'UK', 'Australia', 'Poland', 'Turkey', 'Other']
//     },
//     program: { type: String, required: true },
//     startDate: { type: Date, required: true },
//     educationLevel: { 
//       type: String, 
//       enum: ['highschool', 'bachelor', 'master', 'phd', ''],
//       default: ''
//     },
//     budget: { 
//       type: String, 
//       enum: ['low', 'medium', 'high', 'premium', ''],
//       default: ''
//     },
//     requirements: { type: String, default: '' }
//   },
  
//   status: {
//     type: String,
//     enum: ['pending', 'contacted', 'in_progress', 'completed', 'cancelled'],
//     default: 'pending'
//   },
  
//   notes: [{
//     content: String,
//     addedBy: { type: String, default: 'system' },
//     addedAt: { type: Date, default: Date.now }
//   }],
  
//   ipAddress: String,
//   userAgent: String,
  
//   bookingDate: { type: Date, default: Date.now },
//   createdAt: { type: Date, default: Date.now },
//   updatedAt: { type: Date, default: Date.now }
// });

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
        addedAt: { type: Date, default: Date.now }
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

// Indexes for performance
bookingSchema.index({ 'customer.email': 1 });
bookingSchema.index({ 'service.category': 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ bookingDate: -1 });
bookingSchema.index({ 
  'customer.fullName': 'text', 
  'customer.email': 'text', 
  'service.name': 'text' 
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;