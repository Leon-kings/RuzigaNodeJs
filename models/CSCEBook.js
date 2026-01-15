// const mongoose = require('mongoose');

// const registrationSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   userEmail: {
//     type: String,
//     required: [true, 'Email is required'],
//     match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email']
//   },
//   userName: {
//     type: String,
//     required: [true, 'Name is required']
//   },
//   userPhone: {
//     type: String,
//     required: [true, 'Phone number is required']
//   },
//   organization: String,
//   registrationDate: {
//     type: Date,
//     default: Date.now
//   },
//   status: {
//     type: String,
//     enum: ['pending', 'confirmed', 'cancelled', 'attended', 'passed', 'failed'],
//     default: 'pending'
//   },
//   paymentStatus: {
//     type: String,
//     enum: ['pending', 'paid', 'failed', 'refunded'],
//     default: 'pending'
//   },
//   paymentMethod: {
//     type: String,
//     enum: ['card', 'cash', 'bank_transfer'],
//     default: 'card'
//   },
//   paymentDetails: {
//     transactionId: String,
//     amount: Number,
//     currency: {
//       type: String,
//       default: 'USD'
//     },
//     paymentDate: Date,
//     receiptUrl: String
//   },
//   examSession: {
//     date: Date,
//     center: String,
//     seatNumber: String,
//     room: String
//   },
//   score: {
//     type: Number,
//     min: 0,
//     max: 100
//   },
//   grade: String,
//   notes: String,
//   attachments: [{
//     name: String,
//     url: String,
//     type: String
//   }],
//   createdAt: {
//     type: Date,
//     default: Date.now
//   },
//   updatedAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// const examSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: [true, 'Exam name is required'],
//     trim: true,
//     unique: true
//   },
//   type: {
//     type: String,
//     required: [true, 'Exam type is required'],
//     enum: ['General', 'Specialized', 'Certification', 'Entrance', 'Language', 'Professional']
//   },
//   code: {
//     type: String,
//     unique: true,
//     uppercase: true,
//     required: true
//   },
//   levels: [{
//     type: String,
//     enum: ['Undergraduate Level', 'Graduate Level', 'PhD Level', 'All Levels']
//   }],
//   nextExamDate: {
//     type: Date,
//     required: [true, 'Next exam date is required']
//   },
//   registrationDeadline: {
//     type: Date,
//     required: [true, 'Registration deadline is required']
//   },
//   registrationStatus: {
//     type: String,
//     enum: ['open', 'closed', 'upcoming', 'full'],
//     default: 'open'
//   },
//   duration: {
//     value: {
//       type: Number,
//       required: true
//     },
//     unit: {
//       type: String,
//       enum: ['minutes', 'hours'],
//       default: 'minutes'
//     }
//   },
//   fee: {
//     amount: {
//       type: Number,
//       required: [true, 'Fee amount is required'],
//       min: [0, 'Fee cannot be negative']
//     },
//     currency: {
//       type: String,
//       enum: ['USD', 'EUR', 'GBP', 'RWF'],
//       default: 'USD'
//     },
//     earlyBirdDiscount: {
//       amount: Number,
//       deadline: Date
//     }
//   },
//   difficulty: {
//     type: String,
//     enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
//     default: 'Intermediate'
//   },
//   passingScore: {
//     type: Number,
//     min: 0,
//     max: 100,
//     default: 70
//   },
//   image: {
//     url: String,
//     publicId: String
//   },
//   featured: {
//     type: Boolean,
//     default: false
//   },
//   description: {
//     type: String,
//     required: [true, 'Description is required']
//   },
//   requirements: [String],
//   testCenters: [{
//     name: String,
//     address: String,
//     city: String,
//     capacity: Number,
//     contact: String,
//     email: String
//   }],
//   preparationTime: String,
//   recommendedFor: [String],
//   topics: [{
//     name: String,
//     weightage: {
//       type: Number,
//       min: 0,
//       max: 100
//     }
//   }],
//   syllabus: [{
//     topic: String,
//     subtopics: [String]
//   }],
//   registrations: [registrationSchema],
//   statistics: {
//     totalRegistrations: {
//       type: Number,
//       default: 0
//     },
//     totalAttended: {
//       type: Number,
//       default: 0
//     },
//     totalPassed: {
//       type: Number,
//       default: 0
//     },
//     totalFailed: {
//       type: Number,
//       default: 0
//     },
//     averageScore: {
//       type: Number,
//       default: 0
//     },
//     passRate: {
//       type: Number,
//       default: 0
//     },
//     revenue: {
//       type: Number,
//       default: 0
//     }
//   },
//   schedule: [{
//     date: Date,
//     time: String,
//     center: String,
//     availableSeats: Number,
//     totalSeats: Number
//   }],
//   maxRegistrations: {
//     type: Number,
//     default: 100
//   },
//   createdBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   updatedBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User'
//   },
//   isActive: {
//     type: Boolean,
//     default: true
//   },
//   tags: [String],
//   metadata: {
//     lastUpdated: {
//       type: Date,
//       default: Date.now
//     },
//     version: {
//       type: Number,
//       default: 1
//     }
//   }
// }, {
//   timestamps: true,
//   toJSON: { virtuals: true },
//   toObject: { virtuals: true }
// });

// // Virtuals
// examSchema.virtual('durationFormatted').get(function() {
//   return `${this.duration.value} ${this.duration.unit}`;
// });

// examSchema.virtual('registrationCount').get(function() {
//   return this.registrations.length;
// });

// examSchema.virtual('availableSeats').get(function() {
//   return this.maxRegistrations - this.registrations.length;
// });

// examSchema.virtual('isUpcoming').get(function() {
//   return new Date(this.nextExamDate) > new Date();
// });

// examSchema.virtual('registrationOpen').get(function() {
//   const now = new Date();
//   return now <= new Date(this.registrationDeadline) && this.registrationStatus === 'open';
// });

// // Indexes
// examSchema.index({ name: 1 });
// examSchema.index({ type: 1 });
// examSchema.index({ registrationStatus: 1 });
// examSchema.index({ nextExamDate: 1 });
// examSchema.index({ featured: 1 });
// examSchema.index({ isActive: 1 });
// examSchema.index({ code: 1 }, { unique: true });
// examSchema.index({ 'registrations.userEmail': 1 });
// examSchema.index({ 'registrations.status': 1 });
// examSchema.index({ 'registrations.paymentStatus': 1 });

// // Middleware
// examSchema.pre('save', function(next) {
//   // Update statistics
//   this.statistics.totalRegistrations = this.registrations.length;
  
//   const attended = this.registrations.filter(r => r.status === 'attended').length;
//   const passed = this.registrations.filter(r => r.status === 'passed').length;
//   const paid = this.registrations.filter(r => r.paymentStatus === 'paid').length;
  
//   this.statistics.totalAttended = attended;
//   this.statistics.totalPassed = passed;
//   this.statistics.passRate = attended > 0 ? (passed / attended) * 100 : 0;
//   this.statistics.revenue = paid * this.fee.amount;
  
//   // Update registration status if full
//   if (this.registrations.length >= this.maxRegistrations) {
//     this.registrationStatus = 'full';
//   }
  
//   this.metadata.lastUpdated = new Date();
//   next();
// });

// // Methods
// examSchema.methods.addRegistration = async function(registrationData) {
//   if (this.registrationStatus !== 'open') {
//     throw new Error('Registration is closed for this exam');
//   }
  
//   if (this.registrations.length >= this.maxRegistrations) {
//     throw new Error('Maximum registrations reached');
//   }
  
//   const existing = this.registrations.find(
//     reg => reg.userEmail === registrationData.userEmail
//   );
  
//   if (existing) {
//     throw new Error('User already registered for this exam');
//   }
  
//   this.registrations.push(registrationData);
//   return this.save();
// };

// // Statics
// examSchema.statics.getActiveExams = function() {
//   return this.find({ 
//     isActive: true,
//     registrationStatus: 'open',
//     nextExamDate: { $gt: new Date() }
//   });
// };

// examSchema.statics.getFeaturedExams = function() {
//   return this.find({ 
//     isActive: true,
//     featured: true,
//     registrationStatus: 'open'
//   }).limit(6);
// };

// module.exports = mongoose.model('Exam', examSchema);













// const mongoose = require('mongoose');

// // ----------------- Registration Schema -----------------
// const registrationSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   userEmail: {
//     type: String,
//     required: [true, 'Email is required'],
//     match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email']
//   },
//   userName: {
//     type: String,
//     required: [true, 'Name is required']
//   },
//   userPhone: {
//     type: String,
//     required: [true, 'Phone number is required']
//   },
//   organization: String,
//   registrationDate: {
//     type: Date,
//     default: Date.now
//   },
//   status: {
//     type: String,
//     enum: ['pending', 'confirmed', 'cancelled', 'attended', 'passed', 'failed'],
//     default: 'pending'
//   },
//   paymentStatus: {
//     type: String,
//     enum: ['pending', 'paid', 'failed', 'refunded'],
//     default: 'pending'
//   },
//   paymentMethod: {
//     type: String,
//     enum: ['card', 'cash', 'bank_transfer'],
//     default: 'card'
//   },
//   paymentDetails: {
//     transactionId: String,
//     amount: Number,
//     currency: {
//       type: String,
//       default: 'USD'
//     },
//     paymentDate: Date,
//     receiptUrl: String
//   },
//   examSession: {
//     date: Date,
//     center: String,
//     seatNumber: String,
//     room: String
//   },
//   score: {
//     type: Number,
//     min: 0,
//     max: 100
//   },
//   grade: String,
//   notes: String,
//   attachments: [{
//     name: String,
//     url: String,
//     type: String
//   }],
//   createdAt: {
//     type: Date,
//     default: Date.now
//   },
//   updatedAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// // ----------------- Exam Schema -----------------
// const examSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: [true, 'Exam name is required'],
//     trim: true,
//     unique: true
//   },
//   type: {
//     type: String,
//     required: [true, 'Exam type is required'],
//     enum: ['General', 'Specialized', 'Certification', 'Entrance', 'Language', 'Professional']
//   },
//   code: {
//     type: String,
//     unique: true,
//     uppercase: true,
//     required: true
//   },
//   levels: [{
//     type: String,
//     enum: ['Undergraduate Level', 'Graduate Level', 'PhD Level', 'All Levels']
//   }],
//   nextExamDate: {
//     type: Date,
//     required: [true, 'Next exam date is required']
//   },
//   registrationDeadline: {
//     type: Date,
//     required: [true, 'Registration deadline is required']
//   },
//   registrationStatus: {
//     type: String,
//     enum: ['open', 'closed', 'upcoming', 'full'],
//     default: 'open'
//   },
//   duration: {
//     value: {
//       type: Number,
//       required: true
//     },
//     unit: {
//       type: String,
//       enum: ['minutes', 'hours'],
//       default: 'minutes'
//     }
//   },
//   fee: {
//     amount: {
//       type: Number,
//       required: [true, 'Fee amount is required'],
//       min: [0, 'Fee cannot be negative']
//     },
//     currency: {
//       type: String,
//       enum: ['USD', 'EUR', 'GBP', 'RWF'],
//       default: 'USD'
//     },
//     earlyBirdDiscount: {
//       amount: Number,
//       deadline: Date
//     }
//   },
//   difficulty: {
//     type: String,
//     enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
//     default: 'Intermediate'
//   },
//   passingScore: {
//     type: Number,
//     min: 0,
//     max: 100,
//     default: 70
//   },
//   image: {
//     url: String,
//     publicId: String
//   },
//   featured: {
//     type: Boolean,
//     default: false
//   },
//   description: {
//     type: String,
//     required: [true, 'Description is required']
//   },
//   requirements: [String],
//   testCenters: [{
//     name: String,
//     address: String,
//     city: String,
//     capacity: Number,
//     contact: String,
//     email: String
//   }],
//   preparationTime: String,
//   recommendedFor: [String],
//   topics: [{
//     name: String,
//     weightage: {
//       type: Number,
//       min: 0,
//       max: 100
//     }
//   }],
//   syllabus: [{
//     topic: String,
//     subtopics: [String]
//   }],
//   registrations: [registrationSchema],
//   bookings: [{
//     examId: String,
//     examName: String,
//     studentName: String,
//     studentEmail: String,
//     studentPhone: String,
//     studentId: String,
//     registrationDate: {
//       type: Date,
//       default: Date.now
//     },
//     status: {
//       type: String,
//       enum: ['pending', 'confirmed', 'cancelled', 'attended', 'passed', 'failed'],
//       default: 'pending'
//     },
//     paymentStatus: {
//       type: String,
//       enum: ['pending', 'paid', 'failed', 'refunded'],
//       default: 'pending'
//     },
//     paymentMethod: {
//       type: String,
//       enum: ['card', 'cash', 'bank_transfer'],
//       default: 'cash'
//     },
//     paymentDetails: {
//       transactionId: String,
//       amount: Number,
//       currency: { type: String, default: 'USD' },
//       paymentDate: Date,
//       receiptUrl: String
//     },
//     examSession: {
//       date: Date,
//       center: String,
//       seatNumber: String,
//       room: String
//     },
//     score: { type: Number, min: 0, max: 100 },
//     grade: String,
//     notes: String
//   }],
//   statistics: {
//     totalRegistrations: { type: Number, default: 0 },
//     totalAttended: { type: Number, default: 0 },
//     totalPassed: { type: Number, default: 0 },
//     totalFailed: { type: Number, default: 0 },
//     averageScore: { type: Number, default: 0 },
//     passRate: { type: Number, default: 0 },
//     revenue: { type: Number, default: 0 }
//   },
//   schedule: [{
//     date: Date,
//     time: String,
//     center: String,
//     availableSeats: Number,
//     totalSeats: Number
//   }],
//   maxRegistrations: {
//     type: Number,
//     default: 100
//   },
//   createdBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   updatedBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User'
//   },
//   isActive: {
//     type: Boolean,
//     default: true
//   },
//   tags: [String],
//   metadata: {
//     lastUpdated: {
//       type: Date,
//       default: Date.now
//     },
//     version: {
//       type: Number,
//       default: 1
//     }
//   }
// }, {
//   timestamps: true,
//   toJSON: { virtuals: true },
//   toObject: { virtuals: true }
// });

// // ----------------- INITIAL BOOKING FORM -----------------
// const INITIAL_BOOKING_FORM = {
//   examId: "",
//   examName: "",
//   studentName: "",
//   studentEmail: "",
//   studentPhone: "",
//   studentId: "",
//   registrationDate: new Date().toISOString().split('T')[0],
//   status: "pending",
//   paymentStatus: "pending",
//   paymentMethod: "cash",
//   paymentDetails: {
//     amount: "",
//     currency: "USD",
//     paymentDate: "",
//   },
//   examSession: {
//     date: "",
//     center: "",
//   },

//   notes: ""
// };

// module.exports = mongoose.model('Exam', examSchema);
// module.exports.INITIAL_BOOKING_FORM = INITIAL_BOOKING_FORM;













const mongoose = require('mongoose');

// ----------------- Registration Schema -----------------
const registrationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  userEmail: {
    type: String,
    required: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email']
  },

  userName: {
    type: String,
    required: true
  },

  userPhone: {
    type: String,
    required: true
  },

  organization: String,

  registrationDate: {
    type: Date,
    default: Date.now
  },

  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'attended'],
    default: 'pending'
  },

  examSession: {
    date: Date,
    center: String,
    seatNumber: String,
    room: String
  },

  notes: String,

  attachments: [{
    name: String,
    url: String,
    type: String
  }]
}, { timestamps: true });


// ----------------- Exam Schema -----------------
const examSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: ['TOEFL', 'IELTS', 'CSCE', 'Duolingo', 'Other'],
    unique: true
  },

  code: {
    type: String,
    uppercase: true,
    unique: true,
    required: true
  },

  type: {
    type: String,
    enum: ['Language', 'National', 'International'],
    required: true
  },

  levels: [{
    type: String,
    enum: ['Secondary', 'Undergraduate', 'Graduate', 'All Levels']
  }],

  nextExamDate: {
    type: Date,
    required: true
  },

  registrationDeadline: {
    type: Date,
    required: true
  },

  registrationStatus: {
    type: String,
    enum: ['open', 'closed', 'upcoming', 'full'],
    default: 'open'
  },

  duration: {
    value: Number,
    unit: {
      type: String,
      enum: ['minutes', 'hours'],
      default: 'hours'
    }
  },

  description: {
    type: String,
    required: true
  },

  requirements: [String],

  testCenters: [{
    name: String,
    address: String,
    city: String,
    capacity: Number,
    contact: String,
    email: String
  }],

  schedule: [{
    date: Date,
    time: String,
    center: String,
    availableSeats: Number,
    totalSeats: Number
  }],

  registrations: [registrationSchema],

  maxRegistrations: {
    type: Number,
    default: 100
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  isActive: {
    type: Boolean,
    default: true
  },

  tags: [String],

  metadata: {
    lastUpdated: {
      type: Date,
      default: Date.now
    },
    version: {
      type: Number,
      default: 1
    }
  }
}, {
  timestamps: true
});


// ----------------- INITIAL REGISTRATION FORM -----------------
const INITIAL_BOOKING_FORM = {
  examId: "",
  examName: "",
  studentName: "",
  studentEmail: "",
  studentPhone: "",
  registrationDate: new Date().toISOString().split('T')[0],
  status: "pending",
  examSession: {
    date: "",
    center: ""
  },
  notes: ""
};

module.exports = mongoose.model('Exam', examSchema);
module.exports.INITIAL_BOOKING_FORM = INITIAL_BOOKING_FORM;
