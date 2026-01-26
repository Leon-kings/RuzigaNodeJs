// const mongoose = require('mongoose');

// /* ======================================================
//    ACCOMMODATION SCHEMA
// ====================================================== */

// const accommodationSchema = new mongoose.Schema({
//   name: { type: String, required: true, trim: true },
//   country: { type: String, required: true },
//   city: { type: String, required: true },
//   university: { type: String, required: true },
//   type: {
//     type: String,
//     enum: ['Shared Apartment', 'Private Apartment', 'Dormitory', 'Homestay', 'Studio'],
//     required: true
//   },
//   price: { type: String, required: true },
//   distance: {
//     type: String,
//     enum: [
//       'Walking Distance',
//       'Short Commute (<30 min)',
//       'Medium Commute (30-60 min)',
//       'Long Commute (>60 min)'
//     ]
//   },
//   rating: { type: Number, min: 0, max: 5, default: 0 },
//   bedrooms: { type: String, required: true },
//   bathrooms: { type: String, required: true },
//   amenities: [String],
//   description: String,
//   features: [String],
//   images: [
//     {
//       public_id: { type: String, required: true },
//       url: { type: String, required: true },
//       thumbnailUrl: String
//     }
//   ],
//   featured: { type: Boolean, default: false },
//   availability: {
//     type: String,
//     enum: ['Available', 'Limited', 'Booked', 'Coming Soon'],
//     default: 'Available'
//   },
//   contractLength: String,
//   deposit: String,
//   utilitiesIncluded: String,
//   minimumStay: String,
//   contact: String,
//   createdAt: { type: Date, default: Date.now },
//   updatedAt: { type: Date, default: Date.now }
// });

// accommodationSchema.pre('save', function (next) {
//   this.updatedAt = Date.now();
//   next();
// });

// /* ======================================================
//    BOOKING SCHEMA
// ====================================================== */

// const bookingSchema = new mongoose.Schema({
//   accommodationId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Accommodation',
//     required: true
//   },
//   firstName: { type: String, required: true, trim: true },
//   lastName: { type: String, required: true, trim: true },
//   email: { type: String, required: true, lowercase: true },
//   phone: { type: String, required: true },
//   nationality: { type: String, required: true },
//   university: { type: String, required: true },
//   course: { type: String, required: true },
//   arrivalDate: { type: Date, required: true },
//   departureDate: { type: Date, required: true },
//   duration: { type: String, required: true },
//   numberOfOccupants: { type: Number, min: 1, default: 1 },
//   specialRequirements: String,
//   emergencyContact: { type: String, required: true },
//   preferredPayment: {
//     type: String,
//     enum: ['Credit Card', 'Bank Transfer', 'PayPal', 'Cash'],
//     required: true
//   },
//   additionalInfo: String,
//   status: {
//     type: String,
//     enum: ['Pending', 'Confirmed', 'Cancelled', 'Completed'],
//     default: 'Pending'
//   },
//   bookingReference: { type: String, unique: true },
//   createdAt: { type: Date, default: Date.now },
//   updatedAt: { type: Date, default: Date.now }
// });

// bookingSchema.pre('save', function (next) {
//   if (!this.bookingReference) {
//     const timestamp = Date.now().toString().slice(-6);
//     const random = Math.floor(Math.random() * 1000)
//       .toString()
//       .padStart(3, '0');
//     this.bookingReference = `BOOK-${timestamp}-${random}`;
//   }
//   this.updatedAt = Date.now();
//   next();
// });

// /* ======================================================
//    SAFE MODEL EXPORTS (NO OVERWRITE)
// ====================================================== */

// const Accommodation =
//   mongoose.models.Accommodation ||
//   mongoose.model('Accommodation', accommodationSchema);

// const Booking =
//   mongoose.models.Booking ||
//   mongoose.model('Booking', bookingSchema);

// module.exports = { Accommodation, Booking };





// const mongoose = require('mongoose');

// /* ================= ACCOMMODATION SCHEMA ================== */
// const accommodationSchema = new mongoose.Schema({
//   name: { type: String, required: true, trim: true },
//   country: { type: String, required: true },
//   city: { type: String, required: true },
//   university: { type: String, required: true },
//   type: {
//     type: String,
//     enum: ['Shared Apartment', 'Private Apartment', 'Dormitory', 'Homestay', 'Studio'],
//     required: true
//   },
//   price: { type: String, required: true },
//   distance: {
//     type: String,
//     enum: [
//       'Walking Distance',
//       'Short Commute (<30 min)',
//       'Medium Commute (30-60 min)',
//       'Long Commute (>60 min)'
//     ]
//   },
//   rating: { type: Number, min: 0, max: 5, default: 0 },
//   bedrooms: { type: String, required: true },
//   bathrooms: { type: String, required: true },
//   amenities: [String],
//   features: [String],
//   description: String,
//   images: [
//     {
//       public_id: { type: String, required: true },
//       url: { type: String, required: true },
//       thumbnailUrl: String
//     }
//   ],
//   featured: { type: Boolean, default: false },
//   availability: {
//     type: String,
//     enum: ['Available', 'Limited', 'Booked', 'Coming Soon'],
//     default: 'Available'
//   },
//   contractLength: String,
//   deposit: String,
//   utilitiesIncluded: String,
//   minimumStay: String,
//   contact: String,
//   createdAt: { type: Date, default: Date.now },
//   updatedAt: { type: Date, default: Date.now }
// });

// accommodationSchema.pre('save', function (next) {
//   this.updatedAt = Date.now();
//   next();
// });

// /* ================= BOOKING SCHEMA ================== */
// const bookingSchema = new mongoose.Schema({
//   accommodationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Accommodation', required: true },
//   firstName: { type: String, required: true, trim: true },
//   lastName: { type: String, required: true, trim: true },
//   email: { type: String, required: true, lowercase: true },
//   phone: { type: String, required: true },
//   nationality: { type: String, required: true },
//   university: { type: String, required: true },
//   course: { type: String, required: true },
//   arrivalDate: { type: Date, required: true },
//   departureDate: { type: Date, required: true },
//   duration: { type: String, required: true },
//   numberOfOccupants: { type: Number, min: 1, default: 1 },
//   specialRequirements: String,
//   emergencyContact: { type: String, required: true },
//   preferredPayment: { type: String, enum: ['Credit Card', 'Bank Transfer', 'PayPal', 'Cash'], required: true },
//   additionalInfo: String,
//   status: { type: String, enum: ['Pending', 'Confirmed', 'Cancelled', 'Completed'], default: 'Pending' },
//   bookingReference: { type: String, unique: true },
//   createdAt: { type: Date, default: Date.now },
//   updatedAt: { type: Date, default: Date.now }
// });

// bookingSchema.pre('save', function (next) {
//   if (!this.bookingReference) {
//     const timestamp = Date.now().toString().slice(-6);
//     const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
//     this.bookingReference = `BOOK-${timestamp}-${random}`;
//   }
//   this.updatedAt = Date.now();
//   next();
// });

// /* ================= SAFE EXPORTS ================== */
// const Accommodation = mongoose.models.Accommodation || mongoose.model('Accommodation', accommodationSchema);
// const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);

// module.exports = { Accommodation, Booking };

















// const mongoose = require('mongoose');

// /* ======================================
//    ACCOMMODATION SCHEMA
// ====================================== */
// const accommodationSchema = new mongoose.Schema({
//   name: { type: String, required: true, trim: true },
//   country: { type: String, required: true },
//   city: { type: String, required: true },
//   university: { type: String, required: true },
//   type: {
//     type: String,
//     enum: ['Shared Apartment', 'Private Apartment', 'Dormitory', 'Homestay', 'Studio'],
//     required: true
//   },
//   price: { type: String, required: true },
//   distance: {
//     type: String,
//     enum: [
//       'Walking Distance',
//       'Short Commute (<30 min)',
//       'Medium Commute (30-60 min)',
//       'Long Commute (>60 min)'
//     ]
//   },
//   rating: { type: Number, min: 0, max: 5, default: 0 },
//   bedrooms: { type: String, required: true },
//   bathrooms: { type: String, required: true },
//   amenities: [String],
//   features: [String],
//   description: String,
//   images: [
//     {
//       public_id: String,
//       url: String,
//       thumbnailUrl: String
//     }
//   ],
//   featured: { type: Boolean, default: false },
//   availability: {
//     type: String,
//     enum: ['Available', 'Limited', 'Booked', 'Coming Soon'],
//     default: 'Available'
//   },
//   contact: String,
//   createdAt: { type: Date, default: Date.now },
//   updatedAt: { type: Date, default: Date.now }
// });

// // accommodationSchema.pre('save', function(next) {
// //   this.updatedAt = Date.now();
// //   next();
// // });
// accommodationSchema.pre('save', function () {
//   this.updatedAt = Date.now();
// });


// /* ======================================
//    BOOKING SCHEMA
// ====================================== */
// const bookingSchema = new mongoose.Schema({

//   firstName: { type: String, required: true, trim: true },
//   lastName: { type: String, required: true, trim: true },
//   email: { type: String, required: true, lowercase: true },
//   phone: { type: String, required: true },
//   nationality: { type: String, required: true },
//   university: { type: String, required: true },
//   course: { type: String, required: true },
//   arrivalDate: { type: Date, required: true },
//   departureDate: { type: Date, required: true },
//   duration: { type: String, required: true },
//   numberOfOccupants: { type: Number, min: 1, default: 1 },
//   specialRequirements: String,
//   emergencyContact: { type: String, required: true },
//   preferredPayment: {
//     type: String,
//     enum: ['Credit Card', 'Bank Transfer', 'PayPal', 'Cash'],
//     required: true
//   },
//   additionalInfo: String,
//   status: {
//     type: String,
//     enum: ['Pending', 'Confirmed', 'Cancelled', 'Completed'],
//     default: 'Pending'
//   },
//   bookingReference: { type: String, unique: true },
//   createdAt: { type: Date, default: Date.now },
//   updatedAt: { type: Date, default: Date.now }
// });

// bookingSchema.pre('save', function(next) {
//   if (!this.bookingReference) {
//     const timestamp = Date.now().toString().slice(-6);
//     const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
//     this.bookingReference = `BOOK-${timestamp}-${random}`;
//   }
//   this.updatedAt = Date.now();
//   next();
// });

// const Accommodation = mongoose.models.Accommodation || mongoose.model('Accommodation', accommodationSchema);
// const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);

// module.exports = { Accommodation, Booking };























const mongoose = require('mongoose');

/* ======================================
   ACCOMMODATION SCHEMA
====================================== */
const accommodationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    country: { type: String, required: true },
    city: { type: String, required: true },
    university: { type: String, required: true },

    type: {
      type: String,
      enum: [
        'Shared Apartment',
        'Private Apartment',
        'Dormitory',
        'Homestay',
        'Studio'
      ],
      required: true
    },

    price: { type: Number, required: true },

    distance: {
      type: String,
      enum: [
        'Walking Distance',
        'Short Commute (<30 min)',
        'Medium Commute (30-60 min)',
        'Long Commute (>60 min)'
      ]
    },

    rating: { type: Number, min: 0, max: 5, default: 0 },
    bedrooms: { type: String, required: true },
    bathrooms: { type: String, required: true },

    amenities: [{ type: String }],
    features: [{ type: String }],

    description: { type: String },

    images: [
      {
        public_id: String,
        url: String,
        thumbnailUrl: String
      }
    ],

    featured: { type: Boolean, default: false },

    availability: {
      type: String,
      enum: ['Available', 'Limited', 'Booked', 'Coming Soon'],
      default: 'Available'
    },

    contact: { type: String }
  },
  { timestamps: true } // 👈 handles createdAt & updatedAt automatically
);

/* ======================================
   BOOKING SCHEMA
====================================== */
const bookingSchema = new mongoose.Schema(
  {
    accommodation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Accommodation',
      required: true
    },

    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true },

    nationality: { type: String, required: true },
    university: { type: String, required: true },
    course: { type: String, required: true },

    arrivalDate: { type: Date, required: true },
    departureDate: { type: Date, required: true },
    duration: { type: String, required: true },

    numberOfOccupants: { type: Number, min: 1, default: 1 },
    specialRequirements: { type: String },

    emergencyContact: { type: String, required: true },

    preferredPayment: {
      type: String,
      enum: ['Credit Card', 'Bank Transfer', 'PayPal', 'Cash'],
      required: true
    },

    additionalInfo: { type: String },

    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Cancelled', 'Completed'],
      default: 'Pending'
    },

    bookingReference: {
      type: String,
      unique: true,
      index: true
    }
  },
  { timestamps: true }
);

/* ======================================
   BOOKING PRE-SAVE HOOK
====================================== */
bookingSchema.pre('save', function () {
  if (!this.bookingReference) {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, '0');

    this.bookingReference = `BOOK-${timestamp}-${random}`;
  }
});

/* ======================================
   MODELS
====================================== */
const Accommodation =
  mongoose.models.Accommodation ||
  mongoose.model('Accommodation', accommodationSchema);

const Booking =
  mongoose.models.Booking ||
  mongoose.model('Booking', bookingSchema);

module.exports = {
  Accommodation,
  Booking
};
