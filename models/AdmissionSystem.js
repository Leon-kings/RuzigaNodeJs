// const mongoose = require('mongoose');

// // University Schema
// const universitySchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: [true, 'University name is required'],
//     trim: true
//   },
//   country: {
//     type: String,
//     required: [true, 'Country is required']
//   },
//   city: {
//     type: String,
//     required: [true, 'City is required']
//   },
//   ranking: {
//     type: Number,
//     default: 999
//   },
//   worldRanking: {
//     type: Number,
//     default: 1000
//   },
//   programs: [{
//     type: String,
//     default: []
//   }],
//   tuition: {
//     type: String,
//     default: 'Contact for details'
//   },
//   language: {
//     type: String,
//     default: 'English'
//   },
//   deadline: {
//     type: String,
//     default: 'Rolling admission'
//   },
//   scholarships: [{
//     type: String,
//     default: []
//   }],
//   requirements: [{
//     type: String,
//     default: []
//   }],
//   acceptanceRate: {
//     type: String,
//     default: 'Contact for details'
//   },
//   studentPopulation: {
//     type: String,
//     default: 'N/A'
//   },
//   internationalStudents: {
//     type: String,
//     default: 'N/A'
//   },
//   images: [{
//     public_id: String,
//     url: String
//   }],
//   featured: {
//     type: Boolean,
//     default: false
//   },
//   description: {
//     type: String,
//     default: 'A prestigious university offering quality education.'
//   },
//   availableSlots: [{
//     date: Date,
//     time: String,
//     isBooked: {
//       type: Boolean,
//       default: false
//     }
//   }],
//   bookingPrice: {
//     type: Number,
//     default: 0
//   },
//   consultationDuration: {
//     type: Number,
//     default: 30
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   },
//   updatedAt: {
//     type: Date,
//     default: Date.now
//   }
// }, {
//   timestamps: true
// });

// // Booking Schema
// const bookingSchema = new mongoose.Schema({
//   university: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'University',
//     required: [true, 'University is required']
//   },
//   universityName: {
//     type: String,
//     required: true
//   },
//   student: {
//     fullName: {
//       type: String,
//       required: [true, 'Full name is required']
//     },
//     email: {
//       type: String,
//       required: [true, 'Email is required'],
//       lowercase: true,
//       trim: true
//     },
//     phone: {
//       type: String,
//       required: [true, 'Phone number is required']
//     },
//     country: {
//       type: String,
//       required: [true, 'Country is required']
//     },
//     programInterest: {
//       type: String,
//       required: [true, 'Program interest is required']
//     },
//     intakeYear: {
//       type: String,
//       required: [true, 'Intake year is required']
//     }
//   },
//   bookingDetails: {
//     date: {
//       type: Date,
//       required: [true, 'Booking date is required']
//     },
//     time: {
//       type: String,
//       required: [true, 'Booking time is required']
//     },
//     duration: {
//       type: Number,
//       default: 30
//     },
//     type: {
//       type: String,
//       enum: ['virtual', 'in-person'],
//       default: 'virtual'
//     },
//     meetingLink: String
//   },
//   status: {
//     type: String,
//     enum: ['pending', 'confirmed', 'cancelled', 'completed'],
//     default: 'pending'
//   },
//   payment: {
//     amount: {
//       type: Number,
//       default: 0
//     },
//     currency: {
//       type: String,
//       default: 'USD'
//     },
//     status: {
//       type: String,
//       enum: ['pending', 'paid', 'refunded'],
//       default: 'pending'
//     },
//     transactionId: String
//   },
//   notes: String,
//   emailSent: {
//     type: Boolean,
//     default: false
//   },
//   reminderSent: {
//     type: Boolean,
//     default: false
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   },
//   updatedAt: {
//     type: Date,
//     default: Date.now
//   }
// }, {
//   timestamps: true
// });

// // Middleware
// universitySchema.pre('save', function(next) {
//   this.updatedAt = Date.now();
//   next();
// });

// bookingSchema.pre('save', function(next) {
//   this.updatedAt = Date.now();
//   next();
// });

// // Methods
// universitySchema.methods.formatData = function() {
//   return {
//     id: this._id,
//     name: this.name,
//     country: this.country,
//     city: this.city,
//     ranking: this.ranking,
//     worldRanking: this.worldRanking,
//     programs: this.programs,
//     tuition: this.tuition,
//     language: this.language,
//     deadline: this.deadline,
//     scholarships: this.scholarships,
//     requirements: this.requirements,
//     acceptanceRate: this.acceptanceRate,
//     studentPopulation: this.studentPopulation,
//     internationalStudents: this.internationalStudents,
//     images: this.images,
//     featured: this.featured,
//     description: this.description,
//     availableSlots: this.availableSlots,
//     bookingPrice: this.bookingPrice,
//     consultationDuration: this.consultationDuration
//   };
// };

// // Indexes
// bookingSchema.index({ university: 1, status: 1 });
// bookingSchema.index({ 'student.email': 1 });
// bookingSchema.index({ 'bookingDetails.date': 1 });

// // Check if models already exist before creating them
// const University = mongoose.models.University || mongoose.model('University', universitySchema);
// const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);

// module.exports = {
//   University,
//   Booking
// };













const mongoose = require('mongoose'); 

// University Schema
const universitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'University name is required'],
    trim: true
  },
  country: {
    type: String,
    required: [true, 'Country is required']
  },
  city: {
    type: String,
    required: [true, 'City is required']
  },
  ranking: {
    type: Number,
    default: 999
  },
  worldRanking: {
    type: Number,
    default: 1000
  },
  programs: [{
    type: String,
    default: []
  }],
  tuition: {
    type: String,
    default: 'Contact for details'
  },
  language: {
    type: String,
    default: 'English'
  },
  deadline: {
    type: String,
    default: 'Rolling admission'
  },
  scholarships: [{
    type: String,
    default: []
  }],
  requirements: [{
    type: String,
    default: []
  }],
  acceptanceRate: {
    type: String,
    default: 'Contact for details'
  },
  studentPopulation: {
    type: String,
    default: 'N/A'
  },
  internationalStudents: {
    type: String,
    default: 'N/A'
  },
  images: [{
    public_id: String,
    url: String
  }],
  featured: {
    type: Boolean,
    default: false
  },
  description: {
    type: String,
    default: 'A prestigious university offering quality education.'
  },
  availableSlots: [{
    date: Date,
    time: String,
    isBooked: {
      type: Boolean,
      default: false
    }
  }],
  bookingPrice: {
    type: Number,
    default: 0
  },
  consultationDuration: {
    type: Number,
    default: 30
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Booking Schema
const bookingSchema = new mongoose.Schema({
  university: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'University',
    required: [true, 'University is required']
  },
  universityName: {
    type: String,
    required: true
  },
  student: {
    fullName: {
      type: String,
      required: [true, 'Full name is required']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required']
    },
    country: {
      type: String,
      required: [true, 'Country is required']
    },
    programInterest: {
      type: String,
      required: [true, 'Program interest is required']
    },
    intakeYear: {
      type: String,
      required: [true, 'Intake year is required']
    }
  },
  bookingDetails: {
    date: {
      type: Date,
      required: [true, 'Booking date is required']
    },
    time: {
      type: String,
      required: [true, 'Booking time is required']
    },
    duration: {
      type: Number,
      default: 30
    },
    type: {
      type: String,
      enum: ['virtual', 'in-person'],
      default: 'virtual'
    },
    meetingLink: String
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  payment: {
    amount: {
      type: Number,
      default: 0
    },
    currency: {
      type: String,
      default: 'USD'
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'refunded'],
      default: 'pending'
    },
    transactionId: String
  },
  notes: String,
  emailSent: {
    type: Boolean,
    default: false
  },
  reminderSent: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Middleware (without next)
universitySchema.pre('save', function() {
  this.updatedAt = Date.now();
});

bookingSchema.pre('save', function() {
  this.updatedAt = Date.now();
});

// Methods
universitySchema.methods.formatData = function() {
  return {
    id: this._id,
    name: this.name,
    country: this.country,
    city: this.city,
    ranking: this.ranking,
    worldRanking: this.worldRanking,
    programs: this.programs,
    tuition: this.tuition,
    language: this.language,
    deadline: this.deadline,
    scholarships: this.scholarships,
    requirements: this.requirements,
    acceptanceRate: this.acceptanceRate,
    studentPopulation: this.studentPopulation,
    internationalStudents: this.internationalStudents,
    images: this.images,
    featured: this.featured,
    description: this.description,
    availableSlots: this.availableSlots,
    bookingPrice: this.bookingPrice,
    consultationDuration: this.consultationDuration
  };
};

// Indexes
bookingSchema.index({ university: 1, status: 1 });
bookingSchema.index({ 'student.email': 1 });
bookingSchema.index({ 'bookingDetails.date': 1 });

// Check if models already exist before creating them
const University = mongoose.models.University || mongoose.model('University', universitySchema);
const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);

module.exports = {
  University,
  Booking
};
