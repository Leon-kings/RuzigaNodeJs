const mongoose = require('mongoose');

const scholarshipApplicationSchema = new mongoose.Schema({
  // Personal Information
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  dateOfBirth: {
    type: Date
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other', 'Prefer not to say']
  },
  nationality: {
    type: String,
    required: [true, 'Nationality is required']
  },
  currentAddress: {
    street: String,
    city: String,
    state: String,
    country: String,
    postalCode: String
  },
  permanentAddress: {
    street: String,
    city: String,
    state: String,
    country: String,
    postalCode: String
  },
  
  // Educational Background
  currentEducation: {
    type: String,
    required: [true, 'Current education level is required'],
    enum: ['High School', 'Undergraduate', 'Graduate', 'PhD', 'Other']
  },
  currentInstitution: {
    type: String,
    required: [true, 'Current institution is required']
  },
  currentMajor: String,
  gpa: {
    type: Number,
    min: 0,
    max: 4.0
  },
  graduationDate: Date,
  academicAchievements: [String],
  
  // Target Study Details
  targetUniversity: {
    type: String,
    required: [true, 'Target university is required']
  },
  targetCountry: {
    type: String,
    required: [true, 'Target country is required']
  },
  targetProgram: {
    type: String,
    required: [true, 'Target program is required']
  },
  programLevel: {
    type: String,
    enum: ['Undergraduate', 'Graduate', 'PhD', 'Postdoctoral']
  },
  intakeYear: {
    type: Number,
    required: [true, 'Intake year is required']
  },
  intakeSemester: {
    type: String,
    enum: ['Fall', 'Spring', 'Summer', 'Winter']
  },
  duration: String,
  
  // Scholarship Information
  scholarshipType: {
    type: String,
    required: [true, 'Scholarship type is required'],
    enum: ['Merit-based', 'Need-based', 'Athletic', 'Research', 'Government', 'University', 'External']
  },
  scholarshipInterest: {
    type: String,
    required: [true, 'Scholarship interest is required']
  },
  fundingAmount: {
    requested: Number,
    currency: {
      type: String,
      default: 'USD'
    }
  },
  fundingCoverage: [{
    type: String,
    enum: ['Tuition', 'Accommodation', 'Books', 'Travel', 'Living Expenses', 'Health Insurance', 'Research Costs']
  }],
  
  // Documents and Materials
  documents: {
    transcripts: {
      url: String,
      cloudinaryId: String,
      uploadedAt: Date
    },
    recommendationLetters: [{
      url: String,
      cloudinaryId: String,
      writerName: String,
      writerPosition: String
    }],
    passportCopy: {
      url: String,
      cloudinaryId: String
    },
    languageTest: {
      type: {
        type: String,
        enum: ['IELTS', 'TOEFL', 'PTE', 'Duolingo', 'Other']
      },
      score: Number,
      certificateUrl: String,
      cloudinaryId: String
    },
    statementOfPurpose: {
      url: String,
      cloudinaryId: String,
      wordCount: Number
    },
    researchProposal: {
      url: String,
      cloudinaryId: String
    },
    cvResume: {
      url: String,
      cloudinaryId: String
    },
    portfolio: {
      url: String,
      cloudinaryId: String
    },
    otherDocuments: [{
      name: String,
      url: String,
      cloudinaryId: String
    }]
  },
  
  // Essays and Statements
  essay: {
    status: {
      type: String,
      enum: ['Pending', 'Submitted', 'Under Review', 'Approved', 'Rejected'],
      default: 'Pending'
    },
    content: String,
    wordCount: Number,
    topics: [String],
    submissionDate: Date
  },
  
  // Additional Information
  workExperience: [{
    company: String,
    position: String,
    duration: String,
    description: String
  }],
  volunteerExperience: [{
    organization: String,
    role: String,
    duration: String,
    description: String
  }],
  extracurricularActivities: [String],
  skills: [String],
  awards: [{
    name: String,
    year: Number,
    issuer: String
  }],
  publications: [{
    title: String,
    year: Number,
    journal: String
  }],
  references: [{
    name: String,
    position: String,
    institution: String,
    email: String,
    phone: String
  }],
  additionalInfo: String,
  
  // Application Status
  status: {
    type: String,
    enum: [
      'Draft',
      'Submitted',
      'Under Review',
      'Shortlisted',
      'Interview Scheduled',
      'Interview Completed',
      'Approved',
      'Conditionally Approved',
      'Rejected',
      'Waitlisted',
      'Withdrawn'
    ],
    default: 'Draft'
  },
  statusHistory: [{
    status: String,
    changedBy: mongoose.Schema.Types.ObjectId,
    changedAt: {
      type: Date,
      default: Date.now
    },
    notes: String
  }],
  
  // Review Information
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewScore: {
    academic: { type: Number, min: 0, max: 10 },
    financial: { type: Number, min: 0, max: 10 },
    essay: { type: Number, min: 0, max: 10 },
    overall: { type: Number, min: 0, max: 10 }
  },
  reviewerComments: [{
    reviewer: mongoose.Schema.Types.ObjectId,
    section: String,
    comment: String,
    score: Number,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  decision: {
    madeBy: mongoose.Schema.Types.ObjectId,
    madeAt: Date,
    notes: String,
    fundingAwarded: {
      amount: Number,
      currency: String,
      conditions: [String]
    }
  },
  
  // Timeline
  submissionDate: Date,
  reviewDeadline: Date,
  decisionDate: Date,
  
  // Metadata
  applicationId: {
    type: String,
    unique: true,
    default: function() {
      return `SCH-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    }
  },
  source: {
    type: String,
    enum: ['Website', 'Partner', 'Referral', 'Event', 'Other'],
    default: 'Website'
  },
  tags: [String],
  notes: String,
  
  // Tracking
  createdBy: mongoose.Schema.Types.ObjectId,
  updatedBy: mongoose.Schema.Types.ObjectId,
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes
scholarshipApplicationSchema.index({ email: 1 });
scholarshipApplicationSchema.index({ status: 1 });
scholarshipApplicationSchema.index({ targetCountry: 1 });
scholarshipApplicationSchema.index({ scholarshipType: 1 });
scholarshipApplicationSchema.index({ intakeYear: 1 });
scholarshipApplicationSchema.index({ applicationId: 1 }, { unique: true });
scholarshipApplicationSchema.index({ createdAt: -1 });

// Virtual for full name
scholarshipApplicationSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for age
scholarshipApplicationSchema.virtual('age').get(function() {
  if (!this.dateOfBirth) return null;
  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
});

// Virtual for days since submission
scholarshipApplicationSchema.virtual('daysSinceSubmission').get(function() {
  if (!this.submissionDate) return null;
  const today = new Date();
  const submission = new Date(this.submissionDate);
  const diffTime = Math.abs(today - submission);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Virtual for application completeness percentage
scholarshipApplicationSchema.virtual('completeness').get(function() {
  let completed = 0;
  let total = 0;
  
  // Personal info
  total += 5;
  if (this.firstName) completed++;
  if (this.lastName) completed++;
  if (this.email) completed++;
  if (this.phone) completed++;
  if (this.nationality) completed++;
  
  // Educational info
  total += 4;
  if (this.currentEducation) completed++;
  if (this.currentInstitution) completed++;
  if (this.gpa) completed++;
  if (this.academicAchievements?.length > 0) completed++;
  
  // Target study
  total += 4;
  if (this.targetUniversity) completed++;
  if (this.targetCountry) completed++;
  if (this.targetProgram) completed++;
  if (this.intakeYear) completed++;
  
  // Scholarship info
  total += 2;
  if (this.scholarshipType) completed++;
  if (this.scholarshipInterest) completed++;
  
  // Documents
  total += 3;
  if (this.documents?.transcripts?.url) completed++;
  if (this.essay?.content) completed++;
  if (this.documents?.cvResume?.url) completed++;
  
  return total > 0 ? Math.round((completed / total) * 100) : 0;
});

// Middleware to update status history
scholarshipApplicationSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    if (!this.statusHistory) {
      this.statusHistory = [];
    }
    this.statusHistory.push({
      status: this.status,
      changedBy: this.updatedBy || this.createdBy,
      notes: 'Status updated'
    });
  }
  next();
});

// Method to generate optimized document URLs
scholarshipApplicationSchema.methods.generateOptimizedUrl = function(url, width = null, height = null) {
  if (!url || !url.includes('cloudinary.com')) {
    return url;
  }

  try {
    const urlParts = url.split('/');
    const uploadIndex = urlParts.indexOf('upload');
    
    if (uploadIndex !== -1 && width && height) {
      urlParts.splice(uploadIndex + 1, 0, `w_${width},h_${height},c_fill`);
      return urlParts.join('/');
    }
    
    return url;
  } catch (error) {
    return url;
  }
};

const ScholarshipApplication = mongoose.model('ScholarshipApplication', scholarshipApplicationSchema);

module.exports = ScholarshipApplication;