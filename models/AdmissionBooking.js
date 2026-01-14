

// // module.exports = AdmissionBooking;
// const mongoose = require('mongoose');

// const admissionBookingSchema = new mongoose.Schema(
//   {
//     applicationId: {
//       type: String,
//       required: true,
//       unique: true,
//       default: () =>
//         `APP-${Date.now().toString().slice(-6)}-${Math.random()
//           .toString(36)
//           .substr(2, 3)
//           .toUpperCase()}`
//     },

//     firstName: { type: String, required: true, trim: true },
//     lastName: { type: String, required: true, trim: true },

//     email: {
//       type: String,
//       required: true,
//       lowercase: true,
//       trim: true,
//       unique: true
//     },

//     phone: { type: String, required: true, trim: true },
//     nationality: { type: String, required: true },

//     dateOfBirth: { type: Date, required: true },

//     currentEducation: {
//       type: String,
//       enum: [
//         'High School',
//         'Bachelor Degree',
//         'Master Degree',
//         'PhD',
//         'Diploma',
//         'Other'
//       ],
//       required: true
//     },

//     currentInstitution: { type: String, required: true },
//     graduationYear: Number,

//     gpa: { type: Number, min: 0, max: 4.0, required: true },

//     gpaScale: {
//       type: String,
//       enum: ['4.0', '5.0', '100%', 'Other'],
//       default: '4.0'
//     },

//     targetUniversity: { type: String, required: true },
//     targetCountry: { type: String, required: true },
//     targetProgram: { type: String, required: true },

//     programLevel: {
//       type: String,
//       enum: [
//         'Undergraduate',
//         'Graduate',
//         'PhD',
//         'PostDoc',
//         'Certificate'
//       ],
//       required: true
//     },

//     intakeSeason: {
//       type: String,
//       enum: ['Fall', 'Spring', 'Summer', 'Winter'],
//       required: true
//     },

//     intakeYear: { type: Number, required: true },

//     scholarshipInterest: {
//       type: String,
//       enum: [
//         'Research Scholarship',
//         'Merit Scholarship',
//         'Sports Scholarship',
//         'Need-based Scholarship',
//         'Government Scholarship',
//         'University Scholarship',
//         'None'
//       ],
//       default: 'None'
//     },

//     scholarshipAmount: { type: Number, default: 0 },

//     testScores: {
//       sat: { score: Number, date: Date },
//       gre: {
//         verbal: Number,
//         quant: Number,
//         writing: Number,
//         date: Date
//       },
//       gmat: { score: Number, date: Date },
//       ielts: {
//         overall: Number,
//         listening: Number,
//         reading: Number,
//         writing: Number,
//         speaking: Number,
//         date: Date
//       },
//       toefl: { score: Number, date: Date }
//     },

//     documents: {
//       type: String,
//       enum: ['pending', 'uploaded', 'verified', 'rejected', 'missing'],
//       default: 'pending'
//     },

//     essay: {
//       type: String,
//       enum: [
//         'pending',
//         'submitted',
//         'reviewed',
//         'accepted',
//         'needs_revision'
//       ],
//       default: 'pending'
//     },

//     recommendations: {
//       count: { type: Number, default: 0 },
//       status: {
//         type: String,
//         enum: ['pending', 'submitted', 'verified'],
//         default: 'pending'
//       }
//     },

//     applicationFee: {
//       amount: { type: Number, default: 0 },
//       status: {
//         type: String,
//         enum: ['pending', 'paid', 'waived', 'refunded'],
//         default: 'pending'
//       },
//       paymentMethod: String,
//       transactionId: String
//     },

//     additionalInfo: String,

//     status: {
//       type: String,
//       enum: [
//         'draft',
//         'submitted',
//         'under_review',
//         'interview_scheduled',
//         'accepted',
//         'waitlisted',
//         'rejected',
//         'withdrawn',
//         'deferred'
//       ],
//       default: 'draft'
//     },

//     assignedCounselor: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User'
//     },

//     priority: {
//       type: String,
//       enum: ['low', 'medium', 'high', 'urgent'],
//       default: 'medium'
//     },

//     deadline: Date,

//     documentsSubmitted: [
//       {
//         name: String,
//         type: String,
//         url: String,
//         uploadedAt: Date,
//         verified: { type: Boolean, default: false },
//         verifiedBy: String,
//         verifiedAt: Date
//       }
//     ],

//     notes: [
//       {
//         content: String,
//         createdBy: String,
//         createdAt: { type: Date, default: Date.now },
//         type: {
//           type: String,
//           enum: ['general', 'document', 'interview', 'followup'],
//           default: 'general'
//         }
//       }
//     ],

//     timeline: [
//       {
//         action: String,
//         description: String,
//         date: { type: Date, default: Date.now },
//         performedBy: String
//       }
//     ],

//     statistics: {
//       totalEmailsSent: { type: Number, default: 0 },
//       documentsUploaded: { type: Number, default: 0 },
//       statusChanges: { type: Number, default: 0 },
//       lastActivity: Date,
//       applicationScore: { type: Number, min: 0, max: 100 }
//     },

//     metadata: {
//       ipAddress: String,
//       userAgent: String,
//       source: {
//         type: String,
//         enum: ['website', 'partner', 'referral', 'event', 'social_media'],
//         default: 'website'
//       },
//       campaign: String
//     }
//   },
//   {
//     timestamps: true,
//     toJSON: { virtuals: true },
//     toObject: { virtuals: true }
//   }
// );



// /* =======================
//    VIRTUALS
// ======================= */

// admissionBookingSchema.virtual('fullName').get(function () {
//   return `${this.firstName} ${this.lastName}`;
// });

// admissionBookingSchema.virtual('intake').get(function () {
//   return `${this.intakeSeason} ${this.intakeYear}`;
// });

// admissionBookingSchema.virtual('age').get(function () {
//   if (!this.dateOfBirth) return null;
//   const today = new Date();
//   const birthDate = new Date(this.dateOfBirth);
//   let age = today.getFullYear() - birthDate.getFullYear();
//   const m = today.getMonth() - birthDate.getMonth();
//   if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
//   return age;
// });



// /* =======================
//    INDEXES
// ======================= */

// admissionBookingSchema.index({ email: 1 });
// admissionBookingSchema.index({ status: 1 });
// admissionBookingSchema.index({ targetUniversity: 1 });
// admissionBookingSchema.index({ intakeYear: 1, intakeSeason: 1 });
// admissionBookingSchema.index({ createdAt: -1 });
// admissionBookingSchema.index({ 'statistics.applicationScore': -1 });



// /* =======================
//    MIDDLEWARE (FIXED)
// ======================= */

// admissionBookingSchema.pre('save', function () {
//   if (this.isModified('status')) {
//     this.statistics.statusChanges += 1;
//   }

//   this.statistics.lastActivity = new Date();

//   if (
//     this.isModified('gpa') ||
//     this.isModified('testScores') ||
//     this.isModified('documents')
//   ) {
//     this.calculateApplicationScore();
//   }
// });



// /* =======================
//    METHODS
// ======================= */

// admissionBookingSchema.methods.calculateApplicationScore = function () {
//   let score = 0;

//   score += (this.gpa / 4.0) * 40;

//   let testScore = 0;

//   if (this.testScores?.gre) {
//     testScore = Math.max(
//       testScore,
//       ((this.testScores.gre.verbal + this.testScores.gre.quant) / 340) * 30
//     );
//   }

//   if (this.testScores?.ielts) {
//     testScore = Math.max(
//       testScore,
//       (this.testScores.ielts.overall / 9) * 30
//     );
//   }

//   score += testScore;

//   if (this.documents === 'verified') score += 15;
//   else if (this.documents === 'uploaded') score += 10;
//   else if (this.documents === 'pending') score += 5;

//   if (this.essay === 'accepted') score += 15;
//   else if (this.essay === 'reviewed') score += 10;
//   else if (this.essay === 'submitted') score += 5;

//   this.statistics.applicationScore = Math.min(100, Math.round(score));
//   return this.statistics.applicationScore;
// };

// admissionBookingSchema.methods.addTimelineEvent = function (
//   action,
//   description,
//   performedBy
// ) {
//   this.timeline.push({ action, description, performedBy });
//   return this.save();
// };

// admissionBookingSchema.methods.addNote = function (
//   content,
//   createdBy,
//   type = 'general'
// ) {
//   this.notes.push({ content, createdBy, type });
//   return this.save();
// };



// /* =======================
//    STATIC METHODS
// ======================= */

// admissionBookingSchema.statics.getStatistics = async function () {
//   const stats = await this.aggregate([
//     {
//       $facet: {
//         overview: [
//           {
//             $group: {
//               _id: null,
//               totalApplications: { $sum: 1 },
//               avgGPA: { $avg: '$gpa' },
//               avgApplicationScore: {
//                 $avg: '$statistics.applicationScore'
//               },
//               totalApplicationFees: {
//                 $sum: '$applicationFee.amount'
//               }
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
//         ]
//       }
//     }
//   ]);

//   return stats[0];
// };

// admissionBookingSchema.statics.getAdmissionRates = async function () {
//   return this.aggregate([
//     {
//       $group: {
//         _id: {
//           university: '$targetUniversity',
//           program: '$targetProgram'
//         },
//         total: { $sum: 1 },
//         accepted: {
//           $sum: {
//             $cond: [{ $eq: ['$status', 'accepted'] }, 1, 0]
//           }
//         },
//         avgGPA: { $avg: '$gpa' },
//         avgScore: { $avg: '$statistics.applicationScore' }
//       }
//     },
//     {
//       $addFields: {
//         acceptanceRate: {
//           $multiply: [{ $divide: ['$accepted', '$total'] }, 100]
//         }
//       }
//     },
//     { $sort: { acceptanceRate: -1 } }
//   ]);
// };



// /* =======================
//    EXPORT
// ======================= */

// const AdmissionBooking = mongoose.model(
//   'AdmissionBooking',
//   admissionBookingSchema
// );

// module.exports = AdmissionBooking;




















// const mongoose = require('mongoose');

// const AdmissionManagementSchema = new mongoose.Schema(
//   {
//     // ====================
//     // IDENTIFICATION
//     // ====================
//     recordType: {
//       type: String,
//       required: true,
//       enum: ['booking', 'university', 'application'],
//       default: 'application'
//     },
    
//     recordId: {
//       type: String,
//       required: true,
//       unique: true,
//       default: function() {
//         const prefix = {
//           'booking': 'BOOK',
//           'university': 'UNI',
//           'application': 'APP'
//         }[this.recordType] || 'ADM';
        
//         return `${prefix}-${Date.now().toString().slice(-6)}-${Math.random()
//           .toString(36)
//           .substr(2, 3)
//           .toUpperCase()}`;
//       }
//     },

//     // ====================
//     // BOOKING INFORMATION
//     // ====================
//     booking: {
//       // Visitor Information
//       visitor: {
//         firstName: { type: String, trim: true },
//         lastName: { type: String, trim: true },
//         email: { 
//           type: String, 
//           lowercase: true, 
//           trim: true,
//           match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
//         },
//         phone: { type: String, trim: true },
//         nationality: { type: String },
//         dateOfBirth: { type: Date },
//         age: { type: Number, min: 0 }
//       },

//       // Booking Details
//       details: {
//         bookingDate: { type: Date },
//         bookingTime: { 
//           type: String,
//           enum: ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00']
//         },
//         bookingType: {
//           type: String,
//           enum: [
//             'campus_tour',
//             'information_session',
//             'admission_interview',
//             'open_house',
//             'virtual_tour',
//             'one_on_one_consultation',
//             'group_session',
//             'admission_workshop'
//           ]
//         },
//         bookingDuration: {
//           type: String,
//           enum: ['30 minutes', '1 hour', '1.5 hours', '2 hours', '3 hours', 'Full day'],
//           default: '1 hour'
//         },
//         numberOfGuests: { type: Number, min: 1, max: 10, default: 1 },
//         preferredLanguage: {
//           type: String,
//           enum: ['English', 'Spanish', 'French', 'German', 'Chinese', 'Arabic', 'Russian', 'Japanese', 'Korean', 'Portuguese'],
//           default: 'English'
//         },
//         meetingLink: String,
//         location: String
//       },

//       // Contact & Requirements
//       contact: {
//         emergencyContact: { type: String, trim: true },
//         emergencyPhone: { type: String, trim: true },
//         specialRequirements: { type: String },
//         dietaryRestrictions: { type: String },
//         referralSource: { type: String },
//         notes: { type: String }
//       },

//       // Status & Tracking
//       status: {
//         type: String,
//         enum: ['pending', 'confirmed', 'completed', 'cancelled', 'no_show', 'rescheduled'],
//         default: 'pending'
//       },
//       confirmationSent: { type: Boolean, default: false },
//       reminderSent: { type: Boolean, default: false },
//       visitedBefore: { type: Boolean, default: false },
//       paymentStatus: {
//         type: String,
//         enum: ['pending', 'paid', 'refunded', 'cancelled'],
//         default: 'pending'
//       },
//       paymentAmount: { type: Number, default: 0 },
      
//       // Communication Log
//       communicationLog: [{
//         type: { type: String, enum: ['email', 'sms', 'call', 'whatsapp', 'notification'] },
//         content: String,
//         sentAt: { type: Date, default: Date.now },
//         status: { type: String, enum: ['sent', 'delivered', 'read', 'failed'] },
//         recipient: String
//       }]
//     },

//     // ====================
//     // UNIVERSITY INFORMATION
//     // ====================
//     university: {
//       // Basic Information
//       basic: {
//         universityName: { 
//           type: String, 
//           required: function() { return this.recordType === 'university'; },
//           trim: true,
//           unique: true
//         },
//         description: { type: String },
//         establishedYear: { type: Number },
//         motto: String,
//         type: {
//           type: String,
//           enum: ['public', 'private', 'community', 'technical', 'research']
//         }
//       },

//       // Location
//       location: {
//         country: { 
//           type: String, 
//           required: function() { return this.recordType === 'university'; },
//           trim: true 
//         },
//         state: { type: String, trim: true },
//         city: { 
//           type: String, 
//           required: function() { return this.recordType === 'university'; },
//           trim: true 
//         },
//         campusLocation: { type: String, trim: true },
//         address: {
//           street: String,
//           postalCode: String,
//           coordinates: {
//             lat: { type: Number, min: -90, max: 90 },
//             lng: { type: Number, min: -180, max: 180 }
//           }
//         },
//         timezone: { type: String },
//         campusSize: Number // in acres
//       },

//       // Contact Information
//       contact: {
//         contactPerson: { type: String, trim: true },
//         contactEmail: { 
//           type: String, 
//           lowercase: true, 
//           trim: true,
//           match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
//         },
//         contactPhone: { type: String, trim: true },
//         admissionEmail: String,
//         admissionPhone: String
//       },

//       // Admission Requirements
//       requirements: {
//         applicationDeadline: { type: Date },
//         applicationFee: { type: Number, min: 0, default: 0 },
//         minimumGPA: { type: Number, min: 0, max: 4.0, default: 2.5 },
//         englishProficiency: { 
//           type: String, 
//           default: 'IELTS 6.5 or TOEFL 80' 
//         },
//         standardizedTests: [{
//           name: String,
//           minimumScore: Number,
//           required: { type: Boolean, default: false }
//         }],
//         documentsRequired: [{
//           name: String,
//           description: String,
//           mandatory: { type: Boolean, default: true }
//         }],
//         prerequisites: [String]
//       },

//       // Programs Offered
//       programs: [{
//         programId: { type: String },
//         name: { type: String, required: true },
//         code: String,
//         level: {
//           type: String,
//           enum: ['Undergraduate', 'Graduate', 'PhD', 'PostDoc', 'Certificate', 'Diploma', 'Associate'],
//           required: true
//         },
//         department: String,
//         duration: String,
//         creditsRequired: Number,
//         tuition: {
//           local: { type: Number, min: 0 },
//           international: { type: Number, min: 0 },
//           currency: { type: String, default: 'USD' },
//           perSemester: Boolean
//         },
//         seatsAvailable: { type: Number, min: 0 },
//         applicationDeadline: Date,
//         startDate: Date,
//         endDate: Date,
//         requirements: [String],
//         description: String,
//         curriculum: [{
//           semester: Number,
//           courses: [String],
//           credits: Number
//         }],
//         careerOpportunities: [String],
//         accreditation: [String]
//       }],

//       // Processing Details
//       processing: {
//         processingTime: { type: String, default: '4-6 weeks' },
//         interviewRequired: { type: Boolean, default: false },
//         interviewProcess: String,
//         depositRequired: { type: Boolean, default: false },
//         depositAmount: { type: Number, default: 0 },
//         depositDeadline: Date,
//         visaSupport: { type: Boolean, default: false },
//         accommodationSupport: { type: Boolean, default: false },
//         airportPickup: Boolean,
//         orientationProgram: Boolean
//       },

//       // Status & Ranking
//       statusInfo: {
//         status: {
//           type: String,
//           enum: ['active', 'inactive', 'suspended', 'under_review', 'partnership_ended'],
//           default: 'active'
//         },
//         ranking: {
//           national: Number,
//           global: Number,
//           source: String,
//           year: Number
//         },
//         accreditation: [{
//           body: String,
//           status: String,
//           validUntil: Date
//         }],
//         qsRanking: Number,
//         timesRanking: Number,
//         usNewsRanking: Number
//       },




//       // Statistics
//       statistics: {
//         totalApplications: { type: Number, default: 0 },
//         acceptedApplications: { type: Number, default: 0 },
//         pendingApplications: { type: Number, default: 0 },
//         averageProcessingTime: { type: Number, default: 0 },
//         successRate: { type: Number, default: 0 },
//         lastApplicationDate: { type: Date },
//         activeStudents: { type: Number, default: 0 },
//         internationalStudents: { type: Number, default: 0 }
//       }
//     },

//     // ====================
//     // APPLICATION INFORMATION
//     // ====================
//     application: {
//       // Applicant Information
//       applicant: {
//         firstName: { 
//           type: String, 
//           required: function() { return this.recordType === 'application'; },
//           trim: true 
//         },
//         lastName: { 
//           type: String, 
//           required: function() { return this.recordType === 'application'; },
//           trim: true 
//         },
//         email: { 
//           type: String, 
//           required: function() { return this.recordType === 'application'; },
//           lowercase: true,
//           trim: true,
//           match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
//         },
//         phone: { 
//           type: String, 
//           required: function() { return this.recordType === 'application'; },
//           trim: true 
//         },
//         nationality: { 
//           type: String, 
//           required: function() { return this.recordType === 'application'; }
//         },
//         dateOfBirth: { 
//           type: Date, 
//           required: function() { return this.recordType === 'application'; }
//         },
//         gender: {
//           type: String,
//           enum: ['male', 'female', 'other', 'prefer_not_to_say']
//         },
//         maritalStatus: {
//           type: String,
//           enum: ['single', 'married', 'divorced', 'widowed']
//         },
//         passportNumber: String,
//         passportExpiry: Date,
//         currentAddress: {
//           street: String,
//           city: String,
//           state: String,
//           country: String,
//           postalCode: String
//         },
//         permanentAddress: {
//           street: String,
//           city: String,
//           state: String,
//           country: String,
//           postalCode: String
//         }
//       },

//       // Academic Information
//       academic: {
//         currentEducation: {
//           type: String,
//           enum: ['High School', 'Bachelor Degree', 'Master Degree', 'PhD', 'Diploma', 'Other'],
//           required: function() { return this.recordType === 'application'; }
//         },
//         currentInstitution: { 
//           type: String, 
//           required: function() { return this.recordType === 'application'; }
//         },
//         graduationYear: { 
//           type: Number, 
//           required: function() { return this.recordType === 'application'; }
//         },
//         gpa: { 
//           type: Number, 
//           min: 0, 
//           max: 4.0, 
//           required: function() { return this.recordType === 'application'; }
//         },
//         gpaScale: {
//           type: String,
//           enum: ['4.0', '5.0', '100%', 'Other'],
//           default: '4.0'
//         },
//         previousEducation: [{
//           institution: String,
//           degree: String,
//           field: String,
//           year: Number,
//           gpa: Number,
//           country: String
//         }],
//         achievements: [String],
//         extracurricular: [String],
//         workExperience: [{
//           company: String,
//           position: String,
//           duration: String,
//           description: String
//         }]
//       },

//       // Target Information
//       target: {
//         universityId: { type: mongoose.Schema.Types.ObjectId, ref: 'AdmissionManagement' },
//         universityName: { 
//           type: String, 
//           required: function() { return this.recordType === 'application'; }
//         },
//         country: { 
//           type: String, 
//           required: function() { return this.recordType === 'application'; }
//         },
//         program: { 
//           type: String, 
//           required: function() { return this.recordType === 'application'; }
//         },
//         programLevel: {
//           type: String,
//           enum: ['Undergraduate', 'Graduate', 'PhD', 'PostDoc', 'Certificate'],
//           required: function() { return this.recordType === 'application'; }
//         },
//         intakeSeason: {
//           type: String,
//           enum: ['Fall', 'Spring', 'Summer', 'Winter'],
//           required: function() { return this.recordType === 'application'; }
//         },
//         intakeYear: { 
//           type: Number, 
//           required: function() { return this.recordType === 'application'; }
//         },
//         preferredStartDate: Date,
//         studyMode: {
//           type: String,
//           enum: ['full_time', 'part_time', 'online', 'hybrid']
//         },
//         specialization: String
//       },

//       // Test Scores
//       testScores: {
//         sat: { 
//           score: Number, 
//           date: Date,
//           breakdown: {
//             math: Number,
//             reading: Number,
//             writing: Number
//           }
//         },
//         gre: {
//           verbal: Number,
//           quant: Number,
//           writing: Number,
//           date: Date
//         },
//         gmat: { score: Number, date: Date },
//         ielts: {
//           overall: Number,
//           listening: Number,
//           reading: Number,
//           writing: Number,
//           speaking: Number,
//           date: Date
//         },
//         toefl: { 
//           score: Number, 
//           date: Date,
//           breakdown: {
//             reading: Number,
//             listening: Number,
//             speaking: Number,
//             writing: Number
//           }
//         },
//         otherTests: [{
//           name: String,
//           score: Number,
//           date: Date,
//           description: String
//         }]
//       },

 
//       // Documents
//       documents: {
//         status: {
//           type: String,
//           enum: ['pending', 'uploaded', 'verified', 'rejected', 'missing'],
//           default: 'pending'
//         },
//         submitted: [{
//           name: String,
//           type: String,
//           url: String,
//           publicId: String,
//           uploadedAt: { type: Date, default: Date.now },
//           verified: { type: Boolean, default: false },
//           verifiedBy: String,
//           verifiedAt: Date,
//           size: Number,
//           mimeType: String,
//           notes: String
//         }],
//         required: [{
//           name: String,
//           mandatory: { type: Boolean, default: true },
//           uploaded: { type: Boolean, default: false },
//           verified: { type: Boolean, default: false }
//         }]
//       },

//       recommendations: {
//         count: { type: Number, default: 0 },
//         required: { type: Number, default: 2 },
//         submitted: [{
//           recommenderName: String,
//           recommenderEmail: String,
//           recommenderPhone: String,
//           institution: String,
//           position: String,
//           relationship: String,
//           status: {
//             type: String,
//             enum: ['pending', 'requested', 'submitted', 'verified', 'rejected']
//           },
//           submittedAt: Date,
//           letterUrl: String,
//           publicId: String
//         }]
//       },

//       // Application Fee
//       applicationFee: {
//         amount: { type: Number, default: 0 },
//         status: {
//           type: String,
//           enum: ['pending', 'paid', 'waived', 'refunded', 'partially_paid'],
//           default: 'pending'
//         },
//         paymentMethod: {
//           type: String,
//           enum: ['credit_card', 'debit_card', 'bank_transfer', 'online_payment', 'cash']
//         },
//         transactionId: String,
//         paidAt: Date,
//         receiptUrl: String,
//         paymentDetails: mongoose.Schema.Types.Mixed
//       },

//       // Status & Tracking
//       status: {
//         type: String,
//         enum: [
//           'draft',
//           'submitted',
//           'under_review',
//           'document_verification',
//           'interview_scheduled',
//           'interview_completed',
//           'accepted',
//           'conditionally_accepted',
//           'waitlisted',
//           'rejected',
//           'withdrawn',
//           'deferred',
//           'enrolled'
//         ],
//         default: 'draft'
//       },

//       priority: {
//         type: String,
//         enum: ['low', 'medium', 'high', 'urgent'],
//         default: 'medium'
//       },

//       assignedCounselor: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User'
//       },

//       deadline: Date,

//       // Timeline & Communication
//       timeline: [{
//         action: String,
//         description: String,
//         date: { type: Date, default: Date.now },
//         performedBy: String,
//         category: {
//           type: String,
//           enum: ['application', 'document', 'payment', 'communication', 'status_change', 'interview', 'review']
//         },
//         metadata: mongoose.Schema.Types.Mixed
//       }],

//       notes: [{
//         content: String,
//         createdBy: String,
//         createdAt: { type: Date, default: Date.now },
//         type: {
//           type: String,
//           enum: ['general', 'document', 'interview', 'followup', 'internal', 'counselor']
//         },
//         attachments: [{
//           url: String,
//           name: String,
//           type: String
//         }],
//         priority: {
//           type: String,
//           enum: ['low', 'medium', 'high'],
//           default: 'medium'
//         }
//       }],

//       communication: [{
//         type: { type: String, enum: ['email', 'sms', 'call', 'meeting', 'whatsapp'] },
//         subject: String,
//         content: String,
//         sentAt: { type: Date, default: Date.now },
//         sentBy: String,
//         to: [String],
//         cc: [String],
//         bcc: [String],
//         status: { type: String, enum: ['sent', 'delivered', 'read', 'failed', 'opened'] },
//         attachments: [String],
//         templateId: String,
//         response: String
//       }],



//       // Statistics
//       statistics: {
//         totalEmailsSent: { type: Number, default: 0 },
//         documentsUploaded: { type: Number, default: 0 },
//         statusChanges: { type: Number, default: 0 },
//         lastActivity: { type: Date, default: Date.now },
//         applicationScore: { type: Number, min: 0, max: 100, default: 0 },
//         processingTime: Number,
//         reviewCount: { type: Number, default: 0 },
//         interviewScore: Number,
//         documentScore: Number
//       },

//       // Additional Information
//       additionalInfo: String,
//       whyThisUniversity: String,
//       careerGoals: String,
//       researchInterests: String,

//     },

//     // ====================
//     // COMMON FIELDS
//     // ====================
//     // System Fields
//     isActive: {
//       type: Boolean,
//       default: true
//     },

//     tags: [{
//       type: String,
//       lowercase: true,
//       trim: true
//     }],

//     // Relationships
//     createdBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User'
//     },

//     updatedBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User'
//     },

//     // Soft Delete
//     deletedAt: Date,
//     deletedBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User'
//     },

//     // Versioning
//     version: {
//       type: Number,
//       default: 1
//     }
//   },
//   {
//     timestamps: true,
//     toJSON: { 
//       virtuals: true,
//       transform: function(doc, ret) {
//         delete ret.__v;
//         return ret;
//       }
//     },
//     toObject: { virtuals: true }
//   }
// );

// /* ====================
//    VIRTUALS
// ==================== */

// // Age calculation
// AdmissionManagementSchema.virtual('applicantAge').get(function() {
//   if (this.recordType === 'application' && this.application.applicant.dateOfBirth) {
//     const today = new Date();
//     const birthDate = new Date(this.application.applicant.dateOfBirth);
//     let age = today.getFullYear() - birthDate.getFullYear();
//     const monthDiff = today.getMonth() - birthDate.getMonth();
//     if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
//       age--;
//     }
//     return age;
//   }
//   return null;
// });

// // Full name
// AdmissionManagementSchema.virtual('fullName').get(function() {
//   if (this.recordType === 'application' && this.application.applicant) {
//     return `${this.application.applicant.firstName || ''} ${this.application.applicant.lastName || ''}`.trim();
//   } else if (this.recordType === 'booking' && this.booking.visitor) {
//     return `${this.booking.visitor.firstName || ''} ${this.booking.visitor.lastName || ''}`.trim();
//   }
//   return '';
// });

// // Intake display
// AdmissionManagementSchema.virtual('intakeDisplay').get(function() {
//   if (this.recordType === 'application' && this.application.target) {
//     return `${this.application.target.intakeSeason || ''} ${this.application.target.intakeYear || ''}`.trim();
//   }
//   return '';
// });

// // University full address
// AdmissionManagementSchema.virtual('universityAddress').get(function() {
//   if (this.recordType === 'university' && this.university.location) {
//     const loc = this.university.location;
//     const parts = [];
//     if (loc.address?.street) parts.push(loc.address.street);
//     if (loc.city) parts.push(loc.city);
//     if (loc.state) parts.push(loc.state);
//     if (loc.country) parts.push(loc.country);
//     if (loc.address?.postalCode) parts.push(loc.address.postalCode);
//     return parts.join(', ');
//   }
//   return '';
// });

// // Application progress percentage
// AdmissionManagementSchema.virtual('applicationProgress').get(function() {
//   if (this.recordType !== 'application') return 0;
  
//   let progress = 0;
//   const app = this.application;
  
//   // Basic info (20%)
//   if (app.applicant.firstName && app.applicant.lastName && app.applicant.email && app.applicant.phone) {
//     progress += 20;
//   }
  
//   // Academic info (20%)
//   if (app.academic.currentEducation && app.academic.currentInstitution && app.academic.graduationYear && app.academic.gpa) {
//     progress += 20;
//   }
  
//   // Target info (20%)
//   if (app.target.universityName && app.target.program && app.target.programLevel && app.target.intakeSeason && app.target.intakeYear) {
//     progress += 20;
//   }
  
//   // Documents (20%)
//   const docCount = app.documents.submitted?.length || 0;
//   const requiredCount = app.documents.required?.filter(d => d.mandatory).length || 3;
//   progress += Math.min(20, (docCount / requiredCount) * 20);
  
//   // Essay (10%)
//   if (app.essay.status !== 'pending') progress += 10;
  
//   // Recommendations (10%)
//   const recCount = app.recommendations.submitted?.filter(r => r.status === 'submitted' || r.status === 'verified').length || 0;
//   progress += Math.min(10, (recCount / app.recommendations.required) * 10);
  
//   return Math.min(100, Math.round(progress));
// });

// /* ====================
//    INDEXES
// ==================== */

// // Record type indexes
// AdmissionManagementSchema.index({ recordType: 1 });
// AdmissionManagementSchema.index({ recordType: 1, createdAt: -1 });
// AdmissionManagementSchema.index({ recordType: 1, updatedAt: -1 });
// AdmissionManagementSchema.index({ recordType: 1, isActive: 1 });

// // Application indexes
// AdmissionManagementSchema.index({ recordType: 1, 'application.applicant.email': 1 });
// AdmissionManagementSchema.index({ recordType: 1, 'application.status': 1 });
// AdmissionManagementSchema.index({ recordType: 1, 'application.target.universityName': 1 });
// AdmissionManagementSchema.index({ recordType: 1, 'application.target.program': 1 });
// AdmissionManagementSchema.index({ recordType: 1, 'application.statistics.applicationScore': -1 });
// AdmissionManagementSchema.index({ recordType: 1, 'application.applicant.nationality': 1 });

// // Booking indexes
// AdmissionManagementSchema.index({ recordType: 1, 'booking.visitor.email': 1 });
// AdmissionManagementSchema.index({ recordType: 1, 'booking.status': 1 });
// AdmissionManagementSchema.index({ recordType: 1, 'booking.details.bookingDate': 1 });

// // University indexes
// AdmissionManagementSchema.index({ recordType: 1, 'university.basic.universityName': 1 });
// AdmissionManagementSchema.index({ recordType: 1, 'university.location.country': 1 });
// AdmissionManagementSchema.index({ recordType: 1, 'university.statusInfo.status': 1 });

// // Common indexes
// AdmissionManagementSchema.index({ isActive: 1 });
// AdmissionManagementSchema.index({ tags: 1 });
// AdmissionManagementSchema.index({ createdBy: 1 });

// /* ====================
//    MIDDLEWARE
// ==================== */

// // Pre-save middleware
// AdmissionManagementSchema.pre('save', function(next) {
//   const now = new Date();
  
//   // Calculate applicant age
//   if (this.recordType === 'application' && this.application.applicant?.dateOfBirth) {
//     const age = this.applicantAge;
//     // We calculate it in virtual, but you can store if needed
//   }
  
//   // Calculate application score
//   if (this.recordType === 'application') {
//     this.calculateApplicationScore();
    
//     // Update statistics
//     if (this.isModified('application.status')) {
//       this.application.statistics.statusChanges += 1;
//     }
    
//     this.application.statistics.lastActivity = now;
//   }
  
//   // Update university statistics
//   if (this.recordType === 'university') {
//     if (this.university.programs?.length > 0) {
//       const tuitions = this.university.programs
//         .map(p => p.tuition?.international || 0)
//         .filter(t => t > 0);
      
//       if (tuitions.length > 0) {
//         this.university.financial.tuitionRange.min = Math.min(...tuitions);
//         this.university.financial.tuitionRange.max = Math.max(...tuitions);
//       }
//     }
    
//     // Calculate success rate
//     if (this.university.statistics.totalApplications > 0) {
//       this.university.statistics.successRate = 
//         (this.university.statistics.acceptedApplications / this.university.statistics.totalApplications) * 100;
//     }
//   }
  
//   // Update version
//   if (this.isModified()) {
//     this.version += 1;
//   }
  
//   next();
// });

// /* ====================
//    METHODS
// ==================== */

// // Calculate application score
// AdmissionManagementSchema.methods.calculateApplicationScore = function() {
//   if (this.recordType !== 'application') return 0;
  
//   let score = 0;
//   const app = this.application;
  
//   // GPA Contribution (30%)
//   if (app.academic?.gpa) {
//     score += (app.academic.gpa / 4.0) * 30;
//   }
  
//   // Test Scores Contribution (25%)
//   let testScore = 0;
//   if (app.testScores?.gre) {
//     const greScore = ((app.testScores.gre.verbal + app.testScores.gre.quant) / 340) * 25;
//     testScore = Math.max(testScore, greScore);
//   }
//   if (app.testScores?.ielts) {
//     const ieltsScore = (app.testScores.ielts.overall / 9) * 25;
//     testScore = Math.max(testScore, ieltsScore);
//   }
//   if (app.testScores?.toefl) {
//     const toeflScore = (app.testScores.toefl.score / 120) * 25;
//     testScore = Math.max(testScore, toeflScore);
//   }
//   score += testScore;
  
//   // Documents Status (20%)
//   const docStatus = app.documents?.status;
//   if (docStatus === 'verified') score += 20;
//   else if (docStatus === 'uploaded') score += 15;
//   else if (docStatus === 'pending') score += 5;
  
//   // Essay Status (15%)
//   const essayStatus = app.essay?.status;
//   if (essayStatus === 'accepted') score += 15;
//   else if (essayStatus === 'reviewed') score += 12;
//   else if (essayStatus === 'submitted') score += 8;
//   else if (essayStatus === 'needs_revision') score += 5;
  
//   // Recommendations (10%)
//   const submittedRecs = app.recommendations.submitted?.filter(r => 
//     r.status === 'submitted' || r.status === 'verified'
//   ).length || 0;
//   const requiredRecs = app.recommendations.required || 2;
//   score += Math.min(10, (submittedRecs / requiredRecs) * 10);
  
//   // Cap at 100
//   app.statistics.applicationScore = Math.min(100, Math.round(score));
//   return app.statistics.applicationScore;
// };

// // Add timeline event
// AdmissionManagementSchema.methods.addTimelineEvent = function(action, description, performedBy, category = 'application', metadata = {}) {
//   if (this.recordType !== 'application') return this;
  
//   this.application.timeline.push({
//     action,
//     description,
//     performedBy,
//     category,
//     metadata,
//     date: new Date()
//   });
  
//   return this;
// };

// // Add note
// AdmissionManagementSchema.methods.addNote = function(content, createdBy, type = 'general', attachments = [], priority = 'medium') {
//   if (this.recordType !== 'application') return this;
  
//   this.application.notes.push({
//     content,
//     createdBy,
//     type,
//     attachments,
//     priority,
//     createdAt: new Date()
//   });
  
//   return this;
// };

// // Update status
// AdmissionManagementSchema.methods.updateStatus = function(newStatus, performedBy, notes = '') {
//   if (this.recordType !== 'application') return this;
  
//   const oldStatus = this.application.status;
//   this.application.status = newStatus;
  
//   this.addTimelineEvent(
//     'Status Changed',
//     `Status changed from ${oldStatus} to ${newStatus}. ${notes}`,
//     performedBy,
//     'status_change',
//     { oldStatus, newStatus }
//   );
  
//   return this;
// };

// // Add communication log
// AdmissionManagementSchema.methods.addCommunication = function(type, subject, content, sentBy, recipients, status = 'sent', attachments = [], templateId = null) {
//   if (this.recordType !== 'application') return this;
  
//   this.application.communication.push({
//     type,
//     subject,
//     content,
//     sentBy,
//     to: Array.isArray(recipients) ? recipients : [recipients],
//     status,
//     attachments,
//     templateId,
//     sentAt: new Date()
//   });
  
//   this.application.statistics.totalEmailsSent += type === 'email' ? 1 : 0;
  
//   return this;
// };

// /* ====================
//    STATIC METHODS
// ==================== */

// // Get statistics by record type
// AdmissionManagementSchema.statics.getStatistics = async function(recordType, filters = {}) {
//   const matchStage = { recordType, isActive: true, ...filters };
  
//   if (recordType === 'application') {
//     return this.aggregate([
//       { $match: matchStage },
//       {
//         $facet: {
//           overview: [
//             {
//               $group: {
//                 _id: null,
//                 total: { $sum: 1 },
//                 avgGPA: { $avg: '$application.academic.gpa' },
//                 avgScore: { $avg: '$application.statistics.applicationScore' },
//                 totalFees: { $sum: '$application.applicationFee.amount' }
//               }
//             }
//           ],
//           byStatus: [
//             {
//               $group: {
//                 _id: '$application.status',
//                 count: { $sum: 1 },
//                 avgGPA: { $avg: '$application.academic.gpa' },
//                 avgScore: { $avg: '$application.statistics.applicationScore' }
//               }
//             }
//           ],
//           byUniversity: [
//             {
//               $group: {
//                 _id: '$application.target.universityName',
//                 count: { $sum: 1 },
//                 accepted: {
//                   $sum: { $cond: [{ $in: ['$application.status', ['accepted', 'conditionally_accepted']] }, 1, 0] }
//                 },
//                 avgScore: { $avg: '$application.statistics.applicationScore' }
//               }
//             },
//             {
//               $addFields: {
//                 acceptanceRate: {
//                   $multiply: [{ $divide: ['$accepted', '$count'] }, 100]
//                 }
//               }
//             },
//             { $sort: { count: -1 } },
//             { $limit: 10 }
//           ],
//           byProgram: [
//             {
//               $group: {
//                 _id: '$application.target.program',
//                 count: { $sum: 1 },
//                 accepted: {
//                   $sum: { $cond: [{ $in: ['$application.status', ['accepted', 'conditionally_accepted']] }, 1, 0] }
//                 }
//               }
//             },
//             {
//               $addFields: {
//                 acceptanceRate: {
//                   $multiply: [{ $divide: ['$accepted', '$count'] }, 100]
//                 }
//               }
//             },
//             { $sort: { count: -1 } },
//             { $limit: 10 }
//           ],
//           monthlyTrend: [
//             {
//               $group: {
//                 _id: {
//                   year: { $year: '$createdAt' },
//                   month: { $month: '$createdAt' }
//                 },
//                 count: { $sum: 1 },
//                 accepted: {
//                   $sum: { $cond: [{ $in: ['$application.status', ['accepted', 'conditionally_accepted']] }, 1, 0] }
//                 }
//               }
//             },
//             {
//               $addFields: {
//                 acceptanceRate: {
//                   $multiply: [{ $divide: ['$accepted', '$count'] }, 100]
//                 }
//               }
//             },
//             { $sort: { '_id.year': 1, '_id.month': 1 } }
//           ]
//         }
//       }
//     ]);
//   } else if (recordType === 'booking') {
//     return this.aggregate([
//       { $match: matchStage },
//       {
//         $facet: {
//           overview: [
//             {
//               $group: {
//                 _id: null,
//                 total: { $sum: 1 },
//                 upcoming: {
//                   $sum: {
//                     $cond: [
//                       { 
//                         $and: [
//                           { $gte: ['$booking.details.bookingDate', new Date()] },
//                           { $ne: ['$booking.status', 'cancelled'] }
//                         ]
//                       },
//                       1,
//                       0
//                     ]
//                   }
//                 },
//                 completed: {
//                   $sum: { $cond: [{ $eq: ['$booking.status', 'completed'] }, 1, 0] }
//                 },
//                 avgGuests: { $avg: '$booking.details.numberOfGuests' }
//               }
//             }
//           ],
//           byStatus: [
//             {
//               $group: {
//                 _id: '$booking.status',
//                 count: { $sum: 1 },
//                 avgGuests: { $avg: '$booking.details.numberOfGuests' }
//               }
//             }
//           ],
//           byType: [
//             {
//               $group: {
//                 _id: '$booking.details.bookingType',
//                 count: { $sum: 1 },
//                 completed: {
//                   $sum: { $cond: [{ $eq: ['$booking.status', 'completed'] }, 1, 0] }
//                 }
//               }
//             }
//           ]
//         }
//       }
//     ]);
//   } else if (recordType === 'university') {
//     return this.aggregate([
//       { $match: matchStage },
//       {
//         $facet: {
//           overview: [
//             {
//               $group: {
//                 _id: null,
//                 total: { $sum: 1 },
//                 active: {
//                   $sum: { $cond: [{ $eq: ['$university.statusInfo.status', 'active'] }, 1, 0] }
//                 },
//                 avgSuccessRate: { $avg: '$university.statistics.successRate' },
//                 totalApplications: { $sum: '$university.statistics.totalApplications' }
//               }
//             }
//           ],
//           byCountry: [
//             {
//               $group: {
//                 _id: '$university.location.country',
//                 count: { $sum: 1 },
//                 active: {
//                   $sum: { $cond: [{ $eq: ['$university.statusInfo.status', 'active'] }, 1, 0] }
//                 },
//                 avgSuccessRate: { $avg: '$university.statistics.successRate' }
//               }
//             },
//             { $sort: { count: -1 } }
//           ],
//           byPartnership: [
//             {
//               $group: {
//                 _id: '$university.partnership.partnershipType',
//                 count: { $sum: 1 },
//                 active: {
//                   $sum: { $cond: [{ $eq: ['$university.statusInfo.status', 'active'] }, 1, 0] }
//                 }
//               }
//             }
//           ]
//         }
//       }
//     ]);
//   }
  
//   return [];
// };

// // Get dashboard statistics
// AdmissionManagementSchema.statics.getDashboardStats = async function() {
//   const [applications, bookings, universities] = await Promise.all([
//     this.getStatistics('application'),
//     this.getStatistics('booking'),
//     this.getStatistics('university')
//   ]);
  
//   return {
//     applications: applications[0] || {},
//     bookings: bookings[0] || {},
//     universities: universities[0] || {},
//     timestamp: new Date()
//   };
// };

// const AdmissionManagement = mongoose.model('AdmissionManagement', AdmissionManagementSchema);

// module.exports = AdmissionManagement;

































const mongoose = require('mongoose');

/* =====================================================
   MAIN SCHEMA
===================================================== */

const AdmissionSystemSchema = new mongoose.Schema(
  {
    /* =====================================================
       UNIVERSITY SECTION
    ===================================================== */
    university: {
      isUniversity: { type: Boolean, default: false },

      universityId: {
        type: String,
        unique: true,
        sparse: true,
        default: () => `UNI-${Date.now()}`
      },

      basic: {
        universityName: { type: String, unique: true, sparse: true },
        description: String,
        establishedYear: Number,
        motto: String,
        type: {
          type: String,
          enum: ['public', 'private', 'community', 'technical', 'research']
        }
      },

      location: {
        country: String,
        state: String,
        city: String,
        campusLocation: String,
        address: {
          street: String,
          postalCode: String,
          coordinates: {
            lat: Number,
            lng: Number
          }
        }
      },

      contact: {
        contactPerson: String,
        contactEmail: String,
        contactPhone: String,
        admissionEmail: String,
        admissionPhone: String
      },

      programs: [{
        programId: String,
        name: String,
        level: String,
        duration: String,
        tuition: {
          local: Number,
          international: Number,
          currency: { type: String, default: 'USD' }
        },
        seatsAvailable: Number,
        applicationDeadline: Date
      }],

      statistics: {
        totalApplications: { type: Number, default: 0 },
        acceptedApplications: { type: Number, default: 0 },
        successRate: { type: Number, default: 0 }
      },

      status: {
        type: String,
        enum: ['active', 'inactive', 'suspended'],
        default: 'active'
      }
    },

    /* =====================================================
       UNIVERSITY BOOKING SECTION
    ===================================================== */
    booking: {
      isBooking: { type: Boolean, default: false },

      bookingId: {
        type: String,
        unique: true,
        sparse: true,
        default: () => `BOOK-${Date.now()}`
      },

      universityId: {
        type: String, // links to university.universityId
        index: true
      },

      visitor: {
        firstName: String,
        lastName: String,
        email: String,
        phone: String,
        nationality: String,
        dateOfBirth: Date
      },

      details: {
        bookingDate: Date,
        bookingTime: String,
        bookingType: {
          type: String,
          enum: [
            'campus_tour',
            'admission_interview',
            'consultation',
            'virtual_tour'
          ]
        },
        numberOfGuests: { type: Number, default: 1 },
        preferredLanguage: { type: String, default: 'English' },
        meetingLink: String,
        location: String
      },

      status: {
        type: String,
        enum: ['pending', 'confirmed', 'completed', 'cancelled'],
        default: 'pending'
      },

      payment: {
        status: {
          type: String,
          enum: ['pending', 'paid', 'refunded'],
          default: 'pending'
        },
        amount: { type: Number, default: 0 }
      }
    },

    /* =====================================================
       ADMISSION APPLICATION SECTION
    ===================================================== */
    application: {
      isApplication: { type: Boolean, default: false },

      applicationId: {
        type: String,
        unique: true,
        sparse: true,
        default: () => `APP-${Date.now()}`
      },

      universityId: {
        type: String, // links to university.universityId
        index: true
      },

      applicant: {
        firstName: String,
        lastName: String,
        email: String,
        phone: String,
        nationality: String,
        dateOfBirth: Date
      },

      academic: {
        currentEducation: String,
        institution: String,
        graduationYear: Number,
        gpa: Number
      },

      target: {
        program: String,
        level: String,
        intakeSeason: String,
        intakeYear: Number
      },

      documents: {
        status: {
          type: String,
          enum: ['pending', 'uploaded', 'verified'],
          default: 'pending'
        }
      },

      applicationFee: {
        amount: { type: Number, default: 0 },
        status: {
          type: String,
          enum: ['pending', 'paid', 'waived'],
          default: 'pending'
        }
      },

      status: {
        type: String,
        enum: [
          'draft',
          'submitted',
          'under_review',
          'accepted',
          'rejected'
        ],
        default: 'draft'
      }
    },

    /* =====================================================
       COMMON SYSTEM FIELDS
    ===================================================== */
    isActive: { type: Boolean, default: true },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
);

/* =====================================================
   INDEXES
===================================================== */
AdmissionSystemSchema.index({ 'university.universityId': 1 });
AdmissionSystemSchema.index({ 'booking.bookingId': 1 });
AdmissionSystemSchema.index({ 'application.applicationId': 1 });
AdmissionSystemSchema.index({ 'booking.universityId': 1 });
AdmissionSystemSchema.index({ 'application.universityId': 1 });

module.exports = mongoose.model('AdmissionSystem', AdmissionSystemSchema);
