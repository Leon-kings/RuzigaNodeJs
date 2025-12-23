// const mongoose = require('mongoose');

// const bookingSchema = new mongoose.Schema({
//   bookingReference: {
//     type: String,
//     required: true,
//     unique: true,
//     default: () => `AIR-${Date.now().toString().slice(-6)}`
//   },
//   firstName: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   lastName: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   email: {
//     type: String,
//     required: true,
//     lowercase: true,
//     trim: true
//   },
//   phone: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   nationality: {
//     type: String,
//     required: true
//   },
//   flightNumber: {
//     type: String,
//     required: true
//   },
//   airline: {
//     type: String,
//     required: true
//   },
//   arrivalDate: {
//     type: Date,
//     required: true
//   },
//   arrivalTime: {
//     type: String,
//     required: true
//   },
//   departureDate: {
//     type: Date,
//     required: true
//   },
//   departureTime: {
//     type: String,
//     required: true
//   },
//   airport: {
//     type: String,
//     required: true
//   },
//   terminal: {
//     type: String,
//     required: true
//   },
//   serviceType: {
//     type: String,
//     enum: ['standard', 'vip_service', 'executive', 'family', 'group'],
//     default: 'standard'
//   },
//   numberOfPassengers: {
//     type: Number,
//     required: true,
//     min: 1,
//     max: 50
//   },
//   numberOfBags: {
//     type: Number,
//     default: 0
//   },
//   specialRequirements: {
//     type: String,
//     default: ''
//   },
//   paymentMethod: {
//     type: String,
//     enum: ['credit_card', 'bank_transfer', 'paypal', 'cash'],
//     default: 'credit_card'
//   },
//   emergencyContact: {
//     type: String
//   },
//   additionalInfo: {
//     type: String,
//     default: ''
//   },
//   status: {
//     type: String,
//     enum: ['pending', 'confirmed', 'completed', 'cancelled', 'no_show'],
//     default: 'pending'
//   },
//   totalAmount: {
//     type: Number,
//     required: true
//   },
//   currency: {
//     type: String,
//     default: 'USD'
//   },
//   statistics: {
//     emailsSent: {
//       type: Number,
//       default: 0
//     },
//     statusChanges: {
//       type: Number,
//       default: 0
//     },
//     lastEmailSent: {
//       type: Date
//     },
//     totalRevenue: {
//       type: Number,
//       default: 0
//     }
//   }
// }, {
//   timestamps: true,
//   toJSON: { virtuals: true },
//   toObject: { virtuals: true }
// });

// // Virtual for full name
// bookingSchema.virtual('fullName').get(function() {
//   return `${this.firstName} ${this.lastName}`;
// });

// // Virtual for arrival datetime
// bookingSchema.virtual('arrivalDateTime').get(function() {
//   return `${this.arrivalDate.toISOString().split('T')[0]} ${this.arrivalTime}`;
// });

// // Virtual for departure datetime
// bookingSchema.virtual('departureDateTime').get(function() {
//   return `${this.departureDate.toISOString().split('T')[0]} ${this.departureTime}`;
// });

// // Pre-save middleware to update statistics
// bookingSchema.pre('save', function(next) {
//   if (this.isModified('status')) {
//     this.statistics.statusChanges += 1;
//   }
//   next();
// });

// // Static method for getting statistics
// bookingSchema.statics.getStatistics = async function() {
//   const stats = await this.aggregate([
//     {
//       $group: {
//         _id: null,
//         totalBookings: { $sum: 1 },
//         totalRevenue: { $sum: '$totalAmount' },
//         avgPassengers: { $avg: '$numberOfPassengers' },
//         avgBags: { $avg: '$numberOfBags' },
//         totalEmailsSent: { $sum: '$statistics.emailsSent' }
//       }
//     }
//   ]);

//   const statusStats = await this.aggregate([
//     {
//       $group: {
//         _id: '$status',
//         count: { $sum: 1 },
//         totalAmount: { $sum: '$totalAmount' }
//       }
//     }
//   ]);

//   const serviceTypeStats = await this.aggregate([
//     {
//       $group: {
//         _id: '$serviceType',
//         count: { $sum: 1 },
//         avgAmount: { $avg: '$totalAmount' }
//       }
//     }
//   ]);

//   const recentBookings = await this.find()
//     .sort({ createdAt: -1 })
//     .limit(5)
//     .select('bookingReference firstName lastName status totalAmount createdAt');

//   return {
//     overview: stats[0] || {},
//     byStatus: statusStats,
//     byServiceType: serviceTypeStats,
//     recentBookings
//   };
// };

// // Method to increment email count
// bookingSchema.methods.incrementEmailCount = function() {
//   this.statistics.emailsSent += 1;
//   this.statistics.lastEmailSent = new Date();
//   return this.save();
// };

// // Method to calculate duration
// bookingSchema.methods.calculateDuration = function() {
//   const arrival = new Date(this.arrivalDate);
//   const departure = new Date(this.departureDate);
//   const diffTime = Math.abs(departure - arrival);
//   const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//   return diffDays;
// };

// const AirportBooking = mongoose.model('AirportBooking', bookingSchema);

// module.exports = AirportBooking;

const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    bookingReference: {
      type: String,
      required: true,
      unique: true,
      default: () => `AIR-${Date.now().toString().slice(-6)}`
    },

    firstName: {
      type: String,
      required: true,
      trim: true
    },

    lastName: {
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

    nationality: {
      type: String,
      required: true
    },

    flightNumber: {
      type: String,
      required: true
    },

    airline: {
      type: String,
      required: true
    },

    arrivalDate: {
      type: Date,
      required: true
    },

    arrivalTime: {
      type: String,
      required: true
    },

    departureDate: {
      type: Date,
      required: true
    },

    departureTime: {
      type: String,
      required: true
    },

    airport: {
      type: String,
      required: true
    },

    terminal: {
      type: String,
      required: true
    },

    serviceType: {
      type: String,
      enum: ['standard', 'vip_service', 'executive', 'family', 'group'],
      default: 'standard'
    },

    numberOfPassengers: {
      type: Number,
      required: true,
      min: 1,
      max: 50
    },

    numberOfBags: {
      type: Number,
      default: 0
    },

    specialRequirements: {
      type: String,
      default: ''
    },

    paymentMethod: {
      type: String,
      enum: ['credit_card', 'bank_transfer', 'paypal', 'cash'],
      default: 'credit_card'
    },

    emergencyContact: {
      type: String
    },

    additionalInfo: {
      type: String,
      default: ''
    },

    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled', 'no_show'],
      default: 'pending'
    },

    totalAmount: {
      type: Number,
      required: true
    },

    currency: {
      type: String,
      default: 'USD'
    },

    statistics: {
      emailsSent: {
        type: Number,
        default: 0
      },
      statusChanges: {
        type: Number,
        default: 0
      },
      lastEmailSent: {
        type: Date
      },
      totalRevenue: {
        type: Number,
        default: 0
      }
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

/* =========================
   VIRTUALS
========================= */

// Full name
bookingSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Arrival datetime
bookingSchema.virtual('arrivalDateTime').get(function () {
  return `${this.arrivalDate.toISOString().split('T')[0]} ${this.arrivalTime}`;
});

// Departure datetime
bookingSchema.virtual('departureDateTime').get(function () {
  return `${this.departureDate.toISOString().split('T')[0]} ${this.departureTime}`;
});

/* =========================
   MIDDLEWARE (FIXED)
========================= */

// ❌ NO next()
// ✅ Compatible with Mongoose v7
bookingSchema.pre('save', function () {
  if (this.isModified('status')) {
    this.statistics.statusChanges += 1;
  }
});

/* =========================
   STATIC METHODS
========================= */

bookingSchema.statics.getStatistics = async function () {
  const overview = await this.aggregate([
    {
      $group: {
        _id: null,
        totalBookings: { $sum: 1 },
        totalRevenue: { $sum: '$totalAmount' },
        avgPassengers: { $avg: '$numberOfPassengers' },
        avgBags: { $avg: '$numberOfBags' },
        totalEmailsSent: { $sum: '$statistics.emailsSent' }
      }
    }
  ]);

  const byStatus = await this.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalAmount: { $sum: '$totalAmount' }
      }
    }
  ]);

  const byServiceType = await this.aggregate([
    {
      $group: {
        _id: '$serviceType',
        count: { $sum: 1 },
        avgAmount: { $avg: '$totalAmount' }
      }
    }
  ]);

  const recentBookings = await this.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .select('bookingReference firstName lastName status totalAmount createdAt');

  return {
    overview: overview[0] || {},
    byStatus,
    byServiceType,
    recentBookings
  };
};

/* =========================
   INSTANCE METHODS
========================= */

bookingSchema.methods.incrementEmailCount = async function () {
  this.statistics.emailsSent += 1;
  this.statistics.lastEmailSent = new Date();
  return this.save();
};

bookingSchema.methods.calculateDuration = function () {
  const arrival = new Date(this.arrivalDate);
  const departure = new Date(this.departureDate);
  const diffTime = Math.abs(departure - arrival);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/* =========================
   MODEL EXPORT
========================= */

const AirportBooking = mongoose.model('AirportBooking', bookingSchema);

module.exports = AirportBooking;
