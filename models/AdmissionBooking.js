// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');

// const admissionBookingSchema = new mongoose.Schema({
//   applicationId: {
//     type: String,
//     required: true,
//     unique: true,
//     default: () => `APP-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substr(2, 3).toUpperCase()}`
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
//     trim: true,
//     unique: true
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
//   dateOfBirth: {
//     type: Date,
//     required: true
//   },
//   currentEducation: {
//     type: String,
//     enum: ['High School', 'Bachelor Degree', 'Master Degree', 'PhD', 'Diploma', 'Other'],
//     required: true
//   },
//   currentInstitution: {
//     type: String,
//     required: true
//   },
//   graduationYear: {
//     type: Number
//   },
//   gpa: {
//     type: Number,
//     min: 0,
//     max: 4.0,
//     required: true
//   },
//   gpaScale: {
//     type: String,
//     enum: ['4.0', '5.0', '100%', 'Other'],
//     default: '4.0'
//   },
//   targetUniversity: {
//     type: String,
//     required: true
//   },
//   targetCountry: {
//     type: String,
//     required: true
//   },
//   targetProgram: {
//     type: String,
//     required: true
//   },
//   programLevel: {
//     type: String,
//     enum: ['Undergraduate', 'Graduate', 'PhD', 'PostDoc', 'Certificate'],
//     required: true
//   },
//   intakeSeason: {
//     type: String,
//     enum: ['Fall', 'Spring', 'Summer', 'Winter'],
//     required: true
//   },
//   intakeYear: {
//     type: Number,
//     required: true
//   },
//   scholarshipInterest: {
//     type: String,
//     enum: ['Research Scholarship', 'Merit Scholarship', 'Sports Scholarship', 'Need-based Scholarship', 'Government Scholarship', 'University Scholarship', 'None'],
//     default: 'None'
//   },
//   scholarshipAmount: {
//     type: Number,
//     default: 0
//   },
//   testScores: {
//     sat: {
//       score: Number,
//       date: Date
//     },
//     gre: {
//       verbal: Number,
//       quant: Number,
//       writing: Number,
//       date: Date
//     },
//     gmat: {
//       score: Number,
//       date: Date
//     },
//     ielts: {
//       overall: Number,
//       listening: Number,
//       reading: Number,
//       writing: Number,
//       speaking: Number,
//       date: Date
//     },
//     toefl: {
//       score: Number,
//       date: Date
//     }
//   },
//   documents: {
//     type: String,
//     enum: ['pending', 'uploaded', 'verified', 'rejected', 'missing'],
//     default: 'pending'
//   },
//   essay: {
//     type: String,
//     enum: ['pending', 'submitted', 'reviewed', 'accepted', 'needs_revision'],
//     default: 'pending'
//   },
//   recommendations: {
//     count: {
//       type: Number,
//       default: 0
//     },
//     status: {
//       type: String,
//       enum: ['pending', 'submitted', 'verified'],
//       default: 'pending'
//     }
//   },
//   applicationFee: {
//     amount: {
//       type: Number,
//       default: 0
//     },
//     status: {
//       type: String,
//       enum: ['pending', 'paid', 'waived', 'refunded'],
//       default: 'pending'
//     },
//     paymentMethod: String,
//     transactionId: String
//   },
//   additionalInfo: String,
//   status: {
//     type: String,
//     enum: ['draft', 'submitted', 'under_review', 'interview_scheduled', 'accepted', 'waitlisted', 'rejected', 'withdrawn', 'deferred'],
//     default: 'draft'
//   },
//   assignedCounselor: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User'
//   },
//   priority: {
//     type: String,
//     enum: ['low', 'medium', 'high', 'urgent'],
//     default: 'medium'
//   },
//   deadline: {
//     type: Date
//   },
//   documentsSubmitted: [{
//     name: String,
//     type: String,
//     url: String,
//     uploadedAt: Date,
//     verified: {
//       type: Boolean,
//       default: false
//     },
//     verifiedBy: String,
//     verifiedAt: Date
//   }],
//   notes: [{
//     content: String,
//     createdBy: String,
//     createdAt: {
//       type: Date,
//       default: Date.now
//     },
//     type: {
//       type: String,
//       enum: ['general', 'document', 'interview', 'followup'],
//       default: 'general'
//     }
//   }],
//   timeline: [{
//     action: String,
//     description: String,
//     date: {
//       type: Date,
//       default: Date.now
//     },
//     performedBy: String
//   }],
//   statistics: {
//     totalEmailsSent: {
//       type: Number,
//       default: 0
//     },
//     documentsUploaded: {
//       type: Number,
//       default: 0
//     },
//     statusChanges: {
//       type: Number,
//       default: 0
//     },
//     lastActivity: Date,
//     applicationScore: {
//       type: Number,
//       min: 0,
//       max: 100
//     }
//   },
//   metadata: {
//     ipAddress: String,
//     userAgent: String,
//     source: {
//       type: String,
//       enum: ['website', 'partner', 'referral', 'event', 'social_media'],
//       default: 'website'
//     },
//     campaign: String
//   }
// }, {
//   timestamps: true,
//   toJSON: { virtuals: true },
//   toObject: { virtuals: true }
// });

// // Virtuals
// admissionBookingSchema.virtual('fullName').get(function() {
//   return `${this.firstName} ${this.lastName}`;
// });

// admissionBookingSchema.virtual('intake').get(function() {
//   return `${this.intakeSeason} ${this.intakeYear}`;
// });

// admissionBookingSchema.virtual('age').get(function() {
//   if (!this.dateOfBirth) return null;
//   const today = new Date();
//   const birthDate = new Date(this.dateOfBirth);
//   let age = today.getFullYear() - birthDate.getFullYear();
//   const monthDiff = today.getMonth() - birthDate.getMonth();
//   if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
//     age--;
//   }
//   return age;
// });

// // Indexes
// admissionBookingSchema.index({ email: 1 });
// admissionBookingSchema.index({ status: 1 });
// admissionBookingSchema.index({ targetUniversity: 1 });
// admissionBookingSchema.index({ intakeYear: 1, intakeSeason: 1 });
// admissionBookingSchema.index({ createdAt: -1 });
// admissionBookingSchema.index({ 'statistics.applicationScore': -1 });

// // Pre-save middleware
// admissionBookingSchema.pre('save', function(next) {
//   if (this.isModified('status')) {
//     this.statistics.statusChanges += 1;
//   }
//   this.statistics.lastActivity = new Date();
  
//   // Calculate application score
//   if (this.isModified('gpa') || this.isModified('testScores') || this.isModified('documents')) {
//     this.calculateApplicationScore();
//   }
  
//   next();
// });

// // Methods
// admissionBookingSchema.methods.calculateApplicationScore = function() {
//   let score = 0;
  
//   // GPA contribution (40%)
//   const gpaScore = (this.gpa / 4.0) * 40;
//   score += gpaScore;
  
//   // Test scores contribution (30%)
//   let testScore = 0;
//   if (this.testScores.gre) {
//     const greScore = ((this.testScores.gre.verbal + this.testScores.gre.quant) / 340) * 30;
//     testScore = Math.max(testScore, greScore);
//   }
//   if (this.testScores.ielts) {
//     const ieltsScore = (this.testScores.ielts.overall / 9) * 30;
//     testScore = Math.max(testScore, ieltsScore);
//   }
//   score += testScore;
  
//   // Documents status (15%)
//   if (this.documents === 'verified') score += 15;
//   else if (this.documents === 'uploaded') score += 10;
//   else if (this.documents === 'pending') score += 5;
  
//   // Essay status (15%)
//   if (this.essay === 'accepted') score += 15;
//   else if (this.essay === 'reviewed') score += 10;
//   else if (this.essay === 'submitted') score += 5;
  
//   this.statistics.applicationScore = Math.min(100, Math.round(score));
//   return this.statistics.applicationScore;
// };

// admissionBookingSchema.methods.addTimelineEvent = function(action, description, performedBy) {
//   this.timeline.push({
//     action,
//     description,
//     performedBy
//   });
//   return this.save();
// };

// admissionBookingSchema.methods.addNote = function(content, createdBy, type = 'general') {
//   this.notes.push({
//     content,
//     createdBy,
//     type
//   });
//   return this.save();
// };

// // Static methods
// admissionBookingSchema.statics.getStatistics = async function() {
//   const stats = await this.aggregate([
//     {
//       $facet: {
//         overview: [
//           {
//             $group: {
//               _id: null,
//               totalApplications: { $sum: 1 },
//               avgGPA: { $avg: '$gpa' },
//               avgApplicationScore: { $avg: '$statistics.applicationScore' },
//               totalApplicationFees: { $sum: '$applicationFee.amount' }
//             }
//           }
//         ],
//         byStatus: [
//           {
//             $group: {
//               _id: '$status',
//               count: { $sum: 1 },
//               avgGPA: { $avg: '$gpa' }
//             }
//           }
//         ],
//         byCountry: [
//           {
//             $group: {
//               _id: '$targetCountry',
//               count: { $sum: 1 }
//             }
//           },
//           { $sort: { count: -1 } },
//           { $limit: 10 }
//         ],
//         byUniversity: [
//           {
//             $group: {
//               _id: '$targetUniversity',
//               count: { $sum: 1 },
//               acceptanceRate: {
//                 $avg: {
//                   $cond: [{ $eq: ['$status', 'accepted'] }, 1, 0]
//                 }
//               }
//             }
//           },
//           { $sort: { count: -1 } },
//           { $limit: 10 }
//         ],
//         byProgram: [
//           {
//             $group: {
//               _id: '$targetProgram',
//               count: { $sum: 1 }
//             }
//           },
//           { $sort: { count: -1 } },
//           { $limit: 10 }
//         ],
//         timeline: [
//           {
//             $group: {
//               _id: {
//                 year: { $year: '$createdAt' },
//                 month: { $month: '$createdAt' }
//               },
//               count: { $sum: 1 }
//             }
//           },
//           { $sort: { '_id.year': -1, '_id.month': -1 } },
//           { $limit: 12 }
//         ]
//       }
//     }
//   ]);

//   return stats[0];
// };

// admissionBookingSchema.statics.getAdmissionRates = async function() {
//   return await this.aggregate([
//     {
//       $group: {
//         _id: {
//           university: '$targetUniversity',
//           program: '$targetProgram'
//         },
//         total: { $sum: 1 },
//         accepted: {
//           $sum: { $cond: [{ $eq: ['$status', 'accepted'] }, 1, 0] }
//         },
//         avgGPA: { $avg: '$gpa' },
//         avgScore: { $avg: '$statistics.applicationScore' }
//       }
//     },
//     {
//       $addFields: {
//         acceptanceRate: { $multiply: [{ $divide: ['$accepted', '$total'] }, 100] }
//       }
//     },
//     { $sort: { acceptanceRate: -1 } }
//   ]);
// };

// const AdmissionBooking = mongoose.model('AdmissionBooking', admissionBookingSchema);

// module.exports = AdmissionBooking;
const mongoose = require('mongoose');

const admissionBookingSchema = new mongoose.Schema(
  {
    applicationId: {
      type: String,
      required: true,
      unique: true,
      default: () =>
        `APP-${Date.now().toString().slice(-6)}-${Math.random()
          .toString(36)
          .substr(2, 3)
          .toUpperCase()}`
    },

    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true
    },

    phone: { type: String, required: true, trim: true },
    nationality: { type: String, required: true },

    dateOfBirth: { type: Date, required: true },

    currentEducation: {
      type: String,
      enum: [
        'High School',
        'Bachelor Degree',
        'Master Degree',
        'PhD',
        'Diploma',
        'Other'
      ],
      required: true
    },

    currentInstitution: { type: String, required: true },
    graduationYear: Number,

    gpa: { type: Number, min: 0, max: 4.0, required: true },

    gpaScale: {
      type: String,
      enum: ['4.0', '5.0', '100%', 'Other'],
      default: '4.0'
    },

    targetUniversity: { type: String, required: true },
    targetCountry: { type: String, required: true },
    targetProgram: { type: String, required: true },

    programLevel: {
      type: String,
      enum: [
        'Undergraduate',
        'Graduate',
        'PhD',
        'PostDoc',
        'Certificate'
      ],
      required: true
    },

    intakeSeason: {
      type: String,
      enum: ['Fall', 'Spring', 'Summer', 'Winter'],
      required: true
    },

    intakeYear: { type: Number, required: true },

    scholarshipInterest: {
      type: String,
      enum: [
        'Research Scholarship',
        'Merit Scholarship',
        'Sports Scholarship',
        'Need-based Scholarship',
        'Government Scholarship',
        'University Scholarship',
        'None'
      ],
      default: 'None'
    },

    scholarshipAmount: { type: Number, default: 0 },

    testScores: {
      sat: { score: Number, date: Date },
      gre: {
        verbal: Number,
        quant: Number,
        writing: Number,
        date: Date
      },
      gmat: { score: Number, date: Date },
      ielts: {
        overall: Number,
        listening: Number,
        reading: Number,
        writing: Number,
        speaking: Number,
        date: Date
      },
      toefl: { score: Number, date: Date }
    },

    documents: {
      type: String,
      enum: ['pending', 'uploaded', 'verified', 'rejected', 'missing'],
      default: 'pending'
    },

    essay: {
      type: String,
      enum: [
        'pending',
        'submitted',
        'reviewed',
        'accepted',
        'needs_revision'
      ],
      default: 'pending'
    },

    recommendations: {
      count: { type: Number, default: 0 },
      status: {
        type: String,
        enum: ['pending', 'submitted', 'verified'],
        default: 'pending'
      }
    },

    applicationFee: {
      amount: { type: Number, default: 0 },
      status: {
        type: String,
        enum: ['pending', 'paid', 'waived', 'refunded'],
        default: 'pending'
      },
      paymentMethod: String,
      transactionId: String
    },

    additionalInfo: String,

    status: {
      type: String,
      enum: [
        'draft',
        'submitted',
        'under_review',
        'interview_scheduled',
        'accepted',
        'waitlisted',
        'rejected',
        'withdrawn',
        'deferred'
      ],
      default: 'draft'
    },

    assignedCounselor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },

    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium'
    },

    deadline: Date,

    documentsSubmitted: [
      {
        name: String,
        type: String,
        url: String,
        uploadedAt: Date,
        verified: { type: Boolean, default: false },
        verifiedBy: String,
        verifiedAt: Date
      }
    ],

    notes: [
      {
        content: String,
        createdBy: String,
        createdAt: { type: Date, default: Date.now },
        type: {
          type: String,
          enum: ['general', 'document', 'interview', 'followup'],
          default: 'general'
        }
      }
    ],

    timeline: [
      {
        action: String,
        description: String,
        date: { type: Date, default: Date.now },
        performedBy: String
      }
    ],

    statistics: {
      totalEmailsSent: { type: Number, default: 0 },
      documentsUploaded: { type: Number, default: 0 },
      statusChanges: { type: Number, default: 0 },
      lastActivity: Date,
      applicationScore: { type: Number, min: 0, max: 100 }
    },

    metadata: {
      ipAddress: String,
      userAgent: String,
      source: {
        type: String,
        enum: ['website', 'partner', 'referral', 'event', 'social_media'],
        default: 'website'
      },
      campaign: String
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);



/* =======================
   VIRTUALS
======================= */

admissionBookingSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

admissionBookingSchema.virtual('intake').get(function () {
  return `${this.intakeSeason} ${this.intakeYear}`;
});

admissionBookingSchema.virtual('age').get(function () {
  if (!this.dateOfBirth) return null;
  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
  return age;
});



/* =======================
   INDEXES
======================= */

admissionBookingSchema.index({ email: 1 });
admissionBookingSchema.index({ status: 1 });
admissionBookingSchema.index({ targetUniversity: 1 });
admissionBookingSchema.index({ intakeYear: 1, intakeSeason: 1 });
admissionBookingSchema.index({ createdAt: -1 });
admissionBookingSchema.index({ 'statistics.applicationScore': -1 });



/* =======================
   MIDDLEWARE (FIXED)
======================= */

admissionBookingSchema.pre('save', function () {
  if (this.isModified('status')) {
    this.statistics.statusChanges += 1;
  }

  this.statistics.lastActivity = new Date();

  if (
    this.isModified('gpa') ||
    this.isModified('testScores') ||
    this.isModified('documents')
  ) {
    this.calculateApplicationScore();
  }
});



/* =======================
   METHODS
======================= */

admissionBookingSchema.methods.calculateApplicationScore = function () {
  let score = 0;

  score += (this.gpa / 4.0) * 40;

  let testScore = 0;

  if (this.testScores?.gre) {
    testScore = Math.max(
      testScore,
      ((this.testScores.gre.verbal + this.testScores.gre.quant) / 340) * 30
    );
  }

  if (this.testScores?.ielts) {
    testScore = Math.max(
      testScore,
      (this.testScores.ielts.overall / 9) * 30
    );
  }

  score += testScore;

  if (this.documents === 'verified') score += 15;
  else if (this.documents === 'uploaded') score += 10;
  else if (this.documents === 'pending') score += 5;

  if (this.essay === 'accepted') score += 15;
  else if (this.essay === 'reviewed') score += 10;
  else if (this.essay === 'submitted') score += 5;

  this.statistics.applicationScore = Math.min(100, Math.round(score));
  return this.statistics.applicationScore;
};

admissionBookingSchema.methods.addTimelineEvent = function (
  action,
  description,
  performedBy
) {
  this.timeline.push({ action, description, performedBy });
  return this.save();
};

admissionBookingSchema.methods.addNote = function (
  content,
  createdBy,
  type = 'general'
) {
  this.notes.push({ content, createdBy, type });
  return this.save();
};



/* =======================
   STATIC METHODS
======================= */

admissionBookingSchema.statics.getStatistics = async function () {
  const stats = await this.aggregate([
    {
      $facet: {
        overview: [
          {
            $group: {
              _id: null,
              totalApplications: { $sum: 1 },
              avgGPA: { $avg: '$gpa' },
              avgApplicationScore: {
                $avg: '$statistics.applicationScore'
              },
              totalApplicationFees: {
                $sum: '$applicationFee.amount'
              }
            }
          }
        ],
        byStatus: [
          {
            $group: {
              _id: '$status',
              count: { $sum: 1 },
              avgGPA: { $avg: '$gpa' }
            }
          }
        ]
      }
    }
  ]);

  return stats[0];
};

admissionBookingSchema.statics.getAdmissionRates = async function () {
  return this.aggregate([
    {
      $group: {
        _id: {
          university: '$targetUniversity',
          program: '$targetProgram'
        },
        total: { $sum: 1 },
        accepted: {
          $sum: {
            $cond: [{ $eq: ['$status', 'accepted'] }, 1, 0]
          }
        },
        avgGPA: { $avg: '$gpa' },
        avgScore: { $avg: '$statistics.applicationScore' }
      }
    },
    {
      $addFields: {
        acceptanceRate: {
          $multiply: [{ $divide: ['$accepted', '$total'] }, 100]
        }
      }
    },
    { $sort: { acceptanceRate: -1 } }
  ]);
};



/* =======================
   EXPORT
======================= */

const AdmissionBooking = mongoose.model(
  'AdmissionBooking',
  admissionBookingSchema
);

module.exports = AdmissionBooking;
