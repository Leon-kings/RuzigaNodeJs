const mongoose = require("mongoose");

/* ======================================================
   SCHOLARSHIP APPLICATION SCHEMA
====================================================== */
const scholarshipApplicationSchema = new mongoose.Schema(
  {
    /* =====================
       PERSONAL INFORMATION
    ====================== */
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },
    phone: { type: String, required: true, trim: true },
    dateOfBirth: Date,
    gender: { type: String, enum: ["Male", "Female", "Other", "Prefer not to say"] },
    nationality: { type: String, required: true },
    currentAddress: { street: String, city: String, state: String, country: String, postalCode: String },
    permanentAddress: { street: String, city: String, state: String, country: String, postalCode: String },

    /* =====================
       EDUCATIONAL BACKGROUND
    ====================== */
    currentEducation: {
      type: String,
      enum: ["High School", "Undergraduate", "Graduate", "PhD", "Other"],
      required: true,
    },
    currentInstitution: { type: String, required: true },
    currentMajor: String,
    gpa: { type: Number, min: 0, max: 4 },
    graduationDate: Date,
    academicAchievements: [String],

    /* =====================
       TARGET STUDY DETAILS
    ====================== */
    targetUniversity: { type: String, required: true },
    targetCountry: { type: String, required: true },
    targetProgram: { type: String, required: true },
    programLevel: { type: String, enum: ["Undergraduate", "Graduate", "PhD", "Postdoctoral"] },
    intakeYear: { type: Number, required: true },
    intakeSemester: { type: String, enum: ["Fall", "Spring", "Summer", "Winter"] },
    duration: String,

    /* =====================
       SCHOLARSHIP INFO
    ====================== */
    scholarshipType: {
      type: String,
      enum: ["Merit-based", "Need-based", "Athletic", "Research", "Government", "University", "External"],
      required: true,
    },
    scholarshipInterest: { type: String, required: true },
    fundingAmount: {
      requested: Number,
      currency: { type: String, default: "USD" },
    },
    fundingCoverage: [
      {
        type: String,
        enum: ["Tuition", "Accommodation", "Books", "Travel", "Living Expenses", "Health Insurance", "Research Costs"],
      },
    ],

    /* =====================
       DOCUMENTS
    ====================== */
    documents: {
      transcripts: { url: String, cloudinaryId: String, uploadedAt: Date },
      recommendationLetters: [{ url: String, cloudinaryId: String, writerName: String, writerPosition: String }],
      passportCopy: { url: String, cloudinaryId: String },
      languageTest: { type: { type: String, enum: ["IELTS", "TOEFL", "PTE", "Duolingo", "Other"] }, score: Number, certificateUrl: String, cloudinaryId: String },
      statementOfPurpose: { url: String, cloudinaryId: String, wordCount: Number },
      researchProposal: { url: String, cloudinaryId: String },
      cvResume: { url: String, cloudinaryId: String },
      portfolio: { url: String, cloudinaryId: String },
    },

    /* =====================
       ESSAY
    ====================== */
    essay: {
      status: { type: String, enum: ["Pending", "Submitted", "Under Review", "Approved", "Rejected"], default: "Pending" },
      content: String,
      wordCount: Number,
      submissionDate: Date,
    },

    /* =====================
       EXPERIENCE
    ====================== */
    workExperience: [{ company: String, position: String, duration: String, description: String }],
    volunteerExperience: [{ organization: String, role: String, duration: String, description: String }],
    skills: [String],
    awards: [{ name: String, year: Number, issuer: String }],

    /* =====================
       APPLICATION STATUS
    ====================== */
    status: {
      type: String,
      enum: ["Draft", "Submitted", "Under Review", "Approved", "Rejected", "Withdrawn"],
      default: "Draft",
    },
    statusHistory: [
      { status: String, changedAt: { type: Date, default: Date.now }, notes: String },
    ],

    /* =====================
       METADATA
    ====================== */
    applicationId: {
      type: String,
      unique: true,
      default: () =>
        `SCH-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
    },
    source: { type: String, default: "Website" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

/* ======================================================
   INDEXES
====================================================== */
scholarshipApplicationSchema.index({ email: 1 });
scholarshipApplicationSchema.index({ status: 1 });
scholarshipApplicationSchema.index({ targetCountry: 1 });
scholarshipApplicationSchema.index({ intakeYear: 1 });
scholarshipApplicationSchema.index({ applicationId: 1 }, { unique: true });

/* ======================================================
   VIRTUALS
====================================================== */
scholarshipApplicationSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

/* ======================================================
   MIDDLEWARE (ASYNC/SAFE VERSION)
====================================================== */

// Pre-save hook to track status changes
scholarshipApplicationSchema.pre("save", async function () {
  // Track status changes in history
  if (this.isModified("status")) {
    this.statusHistory.push({
      status: this.status,
      notes: "Status updated",
    });
  }

  // Ensure applicationId exists (extra safety)
  if (!this.applicationId) {
    this.applicationId = `SCH-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  }
});

// You can add more async hooks safely here (pre-validate, pre-remove, etc.)

/* ======================================================
   MODEL EXPORT
====================================================== */
module.exports = mongoose.model("ScholarshipApplication", scholarshipApplicationSchema);
