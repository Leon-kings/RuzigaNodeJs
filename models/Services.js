// const mongoose = require('mongoose');

// const bookingSchema = new mongoose.Schema({
//   service: {
//     id: { type: Number, required: true },
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
    service: {
      id: {
        type: mongoose.Schema.Types.Mixed, // allows "1" or 1
        default: '1'
      },
      name: {
        type: String,
        required: true,
        trim: true
      },
      category: {
        type: String,
        default: 'general'
      }
    },

    customer: {
      fullName: {
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
      targetCountry: {
        type: String,
        required: true
      },
      program: {
        type: String,
        default: ''
      },
      educationLevel: {
        type: String,
        default: ''
      },
      budget: {
        type: String,
        default: ''
      },
      priceUSD: {
        type: String,
        default: '500'
      },
      startDate: {
        type: Date,
        default: Date.now
      },
      requirements: {
        type: String,
        default: ''
      }
    },

    status: {
      type: String,
      enum: ['pending', 'contacted', 'in_progress', 'completed', 'cancelled'],
      default: 'pending'
    },

    notes: [
      {
        content: String,
        addedBy: { type: String, default: 'system' },
        addedAt: { type: Date, default: Date.now }
      }
    ],

    ipAddress: String,
    userAgent: String
  },
  { timestamps: true }
);

// Indexes
bookingSchema.index({ 'customer.email': 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ createdAt: -1 });
bookingSchema.index({
  'customer.fullName': 'text',
  'customer.email': 'text',
  'service.name': 'text'
});

module.exports = mongoose.model('Booking', bookingSchema);
