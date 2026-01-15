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


































// const mongoose = require('mongoose');

// const bookingSchema = new mongoose.Schema(
//   {
//     bookingReference: {
//       type: String,
//       required: true,
//       unique: true,
//       default: () => `AIR-${Date.now().toString().slice(-6)}`
//     },

//     firstName: {
//       type: String,
//       required: true,
//       trim: true
//     },

//     lastName: {
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

//     nationality: {
//       type: String,
//       required: true
//     },

//     flightNumber: {
//       type: String,
//       required: true
//     },

//     airline: {
//       type: String,
//       required: true
//     },

//     // Add this plane field for reference to Plane model
//     plane: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Plane',
//       required: false // Set to false if not all bookings need a plane
//     },

//     arrivalDate: {
//       type: Date,
//       required: true
//     },

//     arrivalTime: {
//       type: String,
//       required: true
//     },

//     departureDate: {
//       type: Date,
//       required: true
//     },

//     departureTime: {
//       type: String,
//       required: true
//     },

//     airport: {
//       type: String,
//       required: true
//     },

//     terminal: {
//       type: String,
//       required: true
//     },

//     serviceType: {
//       type: String,
//       enum: ['standard', 'vip_service', 'executive', 'family', 'group'],
//       default: 'standard'
//     },

//     numberOfPassengers: {
//       type: Number,
//       required: true,
//       min: 1,
//       max: 50
//     },

//     numberOfBags: {
//       type: Number,
//       default: 0
//     },

//     specialRequirements: {
//       type: String,
//       default: ''
//     },

//     paymentMethod: {
//       type: String,
//       enum: ['credit_card', 'bank_transfer', 'paypal', 'cash'],
//       default: 'credit_card'
//     },

//     emergencyContact: {
//       type: String
//     },

//     additionalInfo: {
//       type: String,
//       default: ''
//     },

//     status: {
//       type: String,
//       enum: ['pending', 'confirmed', 'completed', 'cancelled', 'no_show'],
//       default: 'pending'
//     },

//     totalAmount: {
//       type: Number,
//       required: true
//     },

//     currency: {
//       type: String,
//       default: 'USD'
//     },

//     statistics: {
//       emailsSent: {
//         type: Number,
//         default: 0
//       },
//       statusChanges: {
//         type: Number,
//         default: 0
//       },
//       lastEmailSent: {
//         type: Date
//       },
//       totalRevenue: {
//         type: Number,
//         default: 0
//       }
//     }
//   },
//   {
//     timestamps: true,
//     toJSON: { virtuals: true },
//     toObject: { virtuals: true }
//   }
// );

// /* =========================
//    VIRTUALS
// ========================= */

// // Full name
// bookingSchema.virtual('fullName').get(function () {
//   return `${this.firstName} ${this.lastName}`;
// });

// // Arrival datetime
// bookingSchema.virtual('arrivalDateTime').get(function () {
//   return `${this.arrivalDate.toISOString().split('T')[0]} ${this.arrivalTime}`;
// });

// // Departure datetime
// bookingSchema.virtual('departureDateTime').get(function () {
//   return `${this.departureDate.toISOString().split('T')[0]} ${this.departureTime}`;
// });

// /* =========================
//    MIDDLEWARE (FIXED)
// ========================= */

// bookingSchema.pre('save', function () {
//   if (this.isModified('status')) {
//     this.statistics.statusChanges += 1;
//   }
// });

// /* =========================
//    STATIC METHODS
// ========================= */

// bookingSchema.statics.getStatistics = async function () {
//   const overview = await this.aggregate([
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

//   const byStatus = await this.aggregate([
//     {
//       $group: {
//         _id: '$status',
//         count: { $sum: 1 },
//         totalAmount: { $sum: '$totalAmount' }
//       }
//     }
//   ]);

//   const byServiceType = await this.aggregate([
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
//     overview: overview[0] || {},
//     byStatus,
//     byServiceType,
//     recentBookings
//   };
// };

// /* =========================
//    INSTANCE METHODS
// ========================= */

// bookingSchema.methods.incrementEmailCount = async function () {
//   this.statistics.emailsSent += 1;
//   this.statistics.lastEmailSent = new Date();
//   return this.save();
// };

// bookingSchema.methods.calculateDuration = function () {
//   const arrival = new Date(this.arrivalDate);
//   const departure = new Date(this.departureDate);
//   const diffTime = Math.abs(departure - arrival);
//   return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
// };

// /* =========================
//    MODEL EXPORT
// ========================= */

// const AirportBooking = mongoose.model('AirportBooking', bookingSchema);

// module.exports = AirportBooking;



















// // models/planeModel.js
// const mongoose = require('mongoose');

// const planeSchema = new mongoose.Schema(
//   {
//     registrationNumber: {
//       type: String,
//       required: true,
//       unique: true,
//       uppercase: true,
//       trim: true
//     },

//     model: {
//       type: String,
//       required: true,
//       trim: true
//     },

//     airline: {
//       type: String,
//       required: true,
//       trim: true
//     },

//     manufacturer: {
//       type: String,
//       required: true,
//       trim: true
//     },

//     yearOfManufacture: {
//       type: Number,
//       required: true,
//       min: 1950,
//       max: new Date().getFullYear()
//     },

//     // Cloudinary Image fields
//     images: [{
//       url: {
//         type: String,
//         required: true
//       },
//       publicId: {
//         type: String,
//         required: true
//       },
//       caption: {
//         type: String,
//         default: ''
//       },
//       isPrimary: {
//         type: Boolean,
//         default: false
//       },
//       uploadedAt: {
//         type: Date,
//         default: Date.now
//       }
//     }],

//     capacity: {
//       economy: {
//         type: Number,
//         default: 0,
//         min: 0
//       },
//       business: {
//         type: Number,
//         default: 0,
//         min: 0
//       },
//       firstClass: {
//         type: Number,
//         default: 0,
//         min: 0
//       },
//       total: {
//         type: Number,
//         default: 0,
//         min: 0
//       }
//     },

//     status: {
//       type: String,
//       enum: ['active', 'maintenance', 'retired', 'grounded'],
//       default: 'active'
//     },

//     lastMaintenanceDate: {
//       type: Date
//     },

//     nextMaintenanceDate: {
//       type: Date
//     },

//     homeAirport: {
//       type: String,
//       trim: true
//     },

//     specifications: {
//       rangeKm: {
//         type: Number,
//         min: 0
//       },
//       maxSpeedKnots: {
//         type: Number,
//         min: 0
//       },
//       fuelCapacityLiters: {
//         type: Number,
//         min: 0
//       },
//       lengthMeters: {
//         type: Number,
//         min: 0
//       },
//       wingspanMeters: {
//         type: Number,
//         min: 0
//       }
//     },

//     features: [{
//       type: String,
//       enum: ['wifi', 'entertainment', 'power_ports', 'lie_flat', 'shower', 'bar', 'suite']
//     }],

//     currentLocation: {
//       airport: String,
//       gate: String,
//       lastUpdated: Date
//     },

//     schedule: [{
//       flightNumber: String,
//       departure: {
//         airport: String,
//         time: Date
//       },
//       arrival: {
//         airport: String,
//         time: Date
//       },
//       status: {
//         type: String,
//         enum: ['scheduled', 'boarding', 'in_air', 'landed', 'delayed', 'cancelled']
//       }
//     }],

//     crew: {
//       captain: String,
//       firstOfficer: String,
//       cabinCrew: [String]
//     },

//     maintenanceLogs: [{
//       date: Date,
//       type: String,
//       description: String,
//       cost: Number,
//       technician: String,
//       nextDue: Date
//     }],

//     flightHours: {
//       total: {
//         type: Number,
//         default: 0,
//         min: 0
//       },
//       sinceLastMaintenance: {
//         type: Number,
//         default: 0,
//         min: 0
//       }
//     },

//     isAvailable: {
//       type: Boolean,
//       default: true
//     }
//   },
//   {
//     timestamps: true,
//     toJSON: { virtuals: true },
//     toObject: { virtuals: true }
//   }
// );

// /* =========================
//    VIRTUALS
// ========================= */

// planeSchema.virtual('fullModel').get(function() {
//   return `${this.manufacturer} ${this.model} (${this.registrationNumber})`;
// });

// planeSchema.virtual('primaryImage').get(function() {
//   const primary = this.images.find(img => img.isPrimary);
//   return primary ? primary.url : (this.images.length > 0 ? this.images[0].url : null);
// });

// planeSchema.virtual('age').get(function() {
//   return new Date().getFullYear() - this.yearOfManufacture;
// });

// planeSchema.virtual('maintenanceDue').get(function() {
//   if (!this.nextMaintenanceDate) return false;
//   const today = new Date();
//   const dueDate = new Date(this.nextMaintenanceDate);
//   const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
//   return daysUntilDue <= 30;
// });

// /* =========================
//    MIDDLEWARE
// ========================= */

// planeSchema.pre('save', function(next) {
//   // Auto-calculate total capacity
//   this.capacity.total = this.capacity.economy + this.capacity.business + this.capacity.firstClass;
//   next();
// });

// /* =========================
//    INSTANCE METHODS
// ========================= */

// planeSchema.methods.getMaintenanceStatus = function() {
//   const now = new Date();
//   const lastMaintenance = this.lastMaintenanceDate ? new Date(this.lastMaintenanceDate) : null;
//   const nextMaintenance = this.nextMaintenanceDate ? new Date(this.nextMaintenanceDate) : null;

//   let status = 'OK';
//   let message = '';

//   if (nextMaintenance && nextMaintenance < now) {
//     status = 'OVERDUE';
//     message = 'Maintenance overdue';
//   } else if (nextMaintenance && nextMaintenance < new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)) {
//     status = 'SOON';
//     message = 'Maintenance due soon';
//   }

//   return { status, message };
// };

// planeSchema.methods.getAvailableSeats = function(flightClass = 'all') {
//   // This is a simplified version - in reality, you'd need to check bookings
//   switch(flightClass) {
//     case 'economy': return this.capacity.economy;
//     case 'business': return this.capacity.business;
//     case 'firstClass': return this.capacity.firstClass;
//     default: return this.capacity.total;
//   }
// };

// /* =========================
//    MODEL EXPORT
// ========================= */

// const Plane = mongoose.model('Plane', planeSchema);

// // =========================
// // BOOKING MODEL (NO IMAGES)
// // =========================

// const bookingSchema = new mongoose.Schema(
//   {
//     bookingReference: {
//       type: String,
//       required: true,
//       unique: true,
//       default: () => `AIR-${Date.now().toString().slice(-6)}${Math.random().toString(36).substr(2, 3).toUpperCase()}`
//     },

//     firstName: {
//       type: String,
//       required: true,
//       trim: true
//     },

//     lastName: {
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

//     nationality: {
//       type: String,
//       required: true
//     },

//     flightNumber: {
//       type: String,
//       required: true
//     },

//     airline: {
//       type: String,
//       required: true
//     },

//     // Reference to Plane model
//     plane: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Plane',
//       required: false
//     },

//     arrivalDate: {
//       type: Date,
//       required: true
//     },

//     arrivalTime: {
//       type: String,
//       required: true
//     },

//     departureDate: {
//       type: Date,
//       required: true
//     },

//     departureTime: {
//       type: String,
//       required: true
//     },

//     airport: {
//       type: String,
//       required: true
//     },

//     terminal: {
//       type: String,
//       required: true
//     },

//     serviceType: {
//       type: String,
//       enum: ['standard', 'vip_service', 'executive', 'family', 'group'],
//       default: 'standard'
//     },

//     numberOfPassengers: {
//       type: Number,
//       required: true,
//       min: 1,
//       max: 50
//     },

//     numberOfBags: {
//       type: Number,
//       default: 0
//     },

//     specialRequirements: {
//       type: String,
//       default: ''
//     },

//     paymentMethod: {
//       type: String,
//       enum: ['credit_card', 'bank_transfer', 'paypal', 'cash'],
//       default: 'credit_card'
//     },

//     emergencyContact: {
//       type: String
//     },

//     additionalInfo: {
//       type: String,
//       default: ''
//     },

//     status: {
//       type: String,
//       enum: ['pending', 'confirmed', 'completed', 'cancelled', 'no_show'],
//       default: 'pending'
//     },

//     totalAmount: {
//       type: Number,
//       required: true
//     },

//     currency: {
//       type: String,
//       default: 'USD'
//     },

//     statistics: {
//       emailsSent: {
//         type: Number,
//         default: 0
//       },
//       statusChanges: {
//         type: Number,
//         default: 0
//       },
//       lastEmailSent: {
//         type: Date
//       },
//       totalRevenue: {
//         type: Number,
//         default: 0
//       }
//     }
//   },
//   {
//     timestamps: true,
//     toJSON: { virtuals: true },
//     toObject: { virtuals: true }
//   }
// );

// /* =========================
//    VIRTUALS
// ========================= */

// bookingSchema.virtual('fullName').get(function () {
//   return `${this.firstName} ${this.lastName}`;
// });

// bookingSchema.virtual('arrivalDateTime').get(function () {
//   return `${this.arrivalDate.toISOString().split('T')[0]} ${this.arrivalTime}`;
// });

// bookingSchema.virtual('departureDateTime').get(function () {
//   return `${this.departureDate.toISOString().split('T')[0]} ${this.departureTime}`;
// });

// /* =========================
//    MIDDLEWARE
// ========================= */

// bookingSchema.pre('save', function() {
//   if (this.isModified('status')) {
//     this.statistics.statusChanges += 1;
//   }
// });

// /* =========================
//    STATIC METHODS
// ========================= */

// bookingSchema.statics.getStatistics = async function () {
//   const overview = await this.aggregate([
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

//   const byStatus = await this.aggregate([
//     {
//       $group: {
//         _id: '$status',
//         count: { $sum: 1 },
//         totalAmount: { $sum: '$totalAmount' }
//       }
//     }
//   ]);

//   const byServiceType = await this.aggregate([
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
//     .select('bookingReference firstName lastName status totalAmount createdAt')
//     .populate('plane', 'registrationNumber model airline images');

//   return {
//     overview: overview[0] || {},
//     byStatus,
//     byServiceType,
//     recentBookings
//   };
// };

// /* =========================
//    INSTANCE METHODS
// ========================= */

// bookingSchema.methods.incrementEmailCount = async function () {
//   this.statistics.emailsSent += 1;
//   this.statistics.lastEmailSent = new Date();
//   return this.save();
// };

// bookingSchema.methods.calculateDuration = function () {
//   const arrival = new Date(this.arrivalDate);
//   const departure = new Date(this.departureDate);
//   const diffTime = Math.abs(departure - arrival);
//   return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
// };

// /* =========================
//    MODEL EXPORTS
// ========================= */

// const AirportBooking = mongoose.model('AirportBooking', bookingSchema);

// module.exports = {
//   Plane,
//   AirportBooking
// };































// // models/planeModel.js
// const mongoose = require('mongoose');

// /* =========================
//    PLANE MODEL
// ========================= */

// // const planeSchema = new mongoose.Schema(
// //   {
// //     registrationNumber: {
// //       type: String,
// //       required: true,
// //       unique: true,
// //       uppercase: true,
// //       trim: true
// //     },
// //     name: {
// //       type: String,
// //       required: true,
// //       trim: true
// //     },
// //     airline: {
// //       type: String,
// //       required: true,
// //       trim: true
// //     },
// //     flightPlan: {
// //       type: String,
// //       required: true,
// //       trim: true
// //     },
// //     capacity: {
// //       total: { type: Number, required: true, min: 1 }
// //     },
// //     images: [
// //       {
// //         url: { type: String, required: true },
// //         publicId: { type: String, required: true },
// //         isPrimary: { type: Boolean, default: false },
// //       }
// //     ],
// //     isAvailable: { type: Boolean, default: true }
// //   },
// //   { timestamps: true }
// // );


// const planeSchema = new mongoose.Schema(
//   {
//     registrationNumber: {
//       type: String,
//       required: true,
//       unique: true,
//       uppercase: true,
//       trim: true
//     },
//     name: {
//       type: String,
//       required: true,
//       trim: true
//     },
//     model: {                    // Add this
//       type: String,
//       required: true,
//       trim: true
//     },
//     manufacturer: {             // Add this
//       type: String,
//       required: true,
//       trim: true
//     },
//     yearOfManufacture: {        // Add this
//       type: Number,
//       required: true,
//       min: 1900,
//       max: new Date().getFullYear()
//     },
//     airline: {
//       type: String,
//       required: true,
//       trim: true
//     },
//     flightPlan: {
//       type: String,
//       required: true,
//       trim: true
//     },
//     capacity: {
//       total: { type: Number, required: true, min: 1 }
//     },
//     images: [
//       {
//         url: { type: String, required: true },
//         publicId: { type: String, required: true },
//         isPrimary: { type: Boolean, default: false },
//       }
//     ],
//     isAvailable: { type: Boolean, default: true }
//   },
//   { timestamps: true }
// );




// /* =========================
//    VIRTUALS
// ========================= */

// planeSchema.virtual('primaryImage').get(function () {
//   const primary = this.images.find(img => img.isPrimary);
//   return primary ? primary.url : (this.images.length > 0 ? this.images[0].url : null);
// });

// /* =========================
//    MIDDLEWARE
// ========================= */

// planeSchema.pre('save', function (next) {
//   if (!this.capacity.total) this.capacity.total = 0;
//   next();
// });

// const Plane = mongoose.model('Plane', planeSchema);

// /* =========================
//    BOOKING MODEL
// ========================= */

// const bookingSchema = new mongoose.Schema(
//   {
//     bookingReference: {
//       type: String,
//       required: true,
//       unique: true,
//       default: () =>
//         `AIR-${Date.now().toString().slice(-6)}${Math.random().toString(36).substr(2, 3).toUpperCase()}`
//     },
//     passengerName: { type: String, required: true, trim: true },
//     email: { type: String, required: true, lowercase: true, trim: true },
//     phone: { type: String, required: true, trim: true },
//     numberOfPassengers: { type: Number, required: true, min: 1 },
//     plane: { type: mongoose.Schema.Types.ObjectId, ref: 'Plane', required: true },
//     departureDate: { type: Date, required: true },
//     arrivalDate: { type: Date, required: true },
//     departureAirport: { type: String, required: true },
//     arrivalAirport: { type: String, required: true },
//     status: {
//       type: String,
//       enum: ['pending', 'confirmed', 'completed', 'cancelled'],
//       default: 'pending'
//     }
//   },
//   { timestamps: true }
// );

// /* =========================
//    VIRTUALS
// ========================= */

// bookingSchema.virtual('durationDays').get(function () {
//   const diff = Math.abs(this.arrivalDate - this.departureDate);
//   return Math.ceil(diff / (1000 * 60 * 60 * 24));
// });

// const PlaneBooking = mongoose.model('PlaneBooking', bookingSchema);

// module.exports = {
//   Plane,
//   PlaneBooking
// };






























// const mongoose = require('mongoose');

// /* =========================
//    PLANE MODEL
// ========================= */

// const planeSchema = new mongoose.Schema(
//   {
//     registrationNumber: {
//       type: String,
//       required: true,
//       unique: true,
//       uppercase: true,
//       trim: true
//     },
//     name: {
//       type: String,
//       required: true,
//       trim: true
//     },
//     airline: {
//       type: String,
//       required: true,
//       trim: true
//     },
//     flightPlan: {
//       type: String,
//       required: true,
//       trim: true
//     },
//     capacity: {
//       total: {
//         type: Number,
//         required: true,
//         min: 1
//       }
//     },
//     images: [
//       {
//         url: { type: String, required: true },
//         publicId: { type: String, required: true },
//         isPrimary: { type: Boolean, default: false }
//       }
//     ],
//     isAvailable: {
//       type: Boolean,
//       default: true
//     }
//   },
//   { timestamps: true }
// );

// /* =========================
//    VIRTUALS
// ========================= */

// planeSchema.virtual('primaryImage').get(function () {
//   const primary = this.images.find(i => i.isPrimary);
//   return primary ? primary.url : this.images[0]?.url || null;
// });

// /* =========================
//    SAFE MIDDLEWARE
// ========================= */

// planeSchema.pre('save', function (next) {
//   if (!this.capacity?.total || this.capacity.total < 1) {
//     this.capacity.total = 1;
//   }
//   next();
// });

// const Plane = mongoose.model('Plane', planeSchema);

// /* =========================
//    BOOKING MODEL
// ========================= */

// const bookingSchema = new mongoose.Schema(
//   {
//     bookingReference: {
//       type: String,
//       unique: true,
//       default: () =>
//         `AIR-${Date.now().toString().slice(-6)}`
//     },
//     passengerName: {
//       type: String,
//       required: true,
//       trim: true
//     },
//     email: {
//       type: String,
//       required: true,
//       trim: true,
//       lowercase: true
//     },
//     phone: {
//       type: String,
//       required: true
//     },
//     numberOfPassengers: {
//       type: Number,
//       required: true,
//       min: 1
//     },
//     plane: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Plane',
//       required: true
//     },
//     departureDate: {
//       type: Date,
//       required: true
//     },
//     arrivalDate: {
//       type: Date,
//       required: true
//     },
//     status: {
//       type: String,
//       enum: ['pending', 'confirmed', 'cancelled'],
//       default: 'pending'
//     }
//   },
//   { timestamps: true }
// );

// const PlaneBooking = mongoose.model('PlaneBooking', bookingSchema);

// module.exports = { Plane, PlaneBooking };



























const mongoose = require("mongoose");

/* =========================
   PLANE MODEL
========================= */
const planeSchema = new mongoose.Schema(
  {
    registrationNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    name: { type: String, trim: true },
    model: { type: String, required: true, trim: true },
    manufacturer: { type: String, required: true, trim: true },
    yearOfManufacture: {
      type: Number,
      required: true,
      min: 1950,
      max: new Date().getFullYear(),
    },
    airline: { type: String, trim: true },
    flightPlan: { type: String, trim: true },
    capacity: {
      total: { type: Number, default: 0 },
    },
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String, required: true },
        isPrimary: { type: Boolean, default: false },
      },
    ],
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Plane = mongoose.model("Plane", planeSchema);

/* =========================
   AIRPORT BOOKING MODEL
========================= */
const airportBookingSchema = new mongoose.Schema(
  {
    bookingReference: {
      type: String,
      unique: true,
      default: () =>
        `AIR-${Date.now().toString().slice(-6)}${Math.random()
          .toString(36)
          .substring(2, 5)
          .toUpperCase()}`,
    },

    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,

    serviceType: {
      type: String,
      enum: ["standard", "vip_service", "executive", "family", "group"],
      required: true,
    },

    numberOfPassengers: { type: Number, required: true, min: 1 },
    numberOfBags: { type: Number, default: 0 },

    flightNumber: String,
    airline: String,

    plane: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plane",
    },

    departureAirport: String,
    arrivalAirport: String,

    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
    },

    totalAmount: { type: Number, default: 0 },

    statistics: {
      emailSentCount: { type: Number, default: 0 },
      totalRevenue: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

/* =========================
   METHODS
========================= */
airportBookingSchema.methods.incrementEmailCount = async function () {
  this.statistics.emailSentCount += 1;
  await this.save();
};

const AirportBooking = mongoose.model(
  "AirportBooking",
  airportBookingSchema
);

module.exports = { Plane, AirportBooking };
