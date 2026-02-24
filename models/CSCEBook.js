
const mongoose = require("mongoose");

/* ===============================
   REGISTRATION SUB-SCHEMA
================================ */
const registrationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    userEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email"],
    },

    userName: {
      type: String,
      required: true,
      trim: true,
    },

    userPhone: {
      type: String,
      required: true,
      trim: true,
    },

    organization: String,

    registrationDate: {
      type: Date,
      default: Date.now,
    },

    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "attended"],
      default: "pending",
    },

    examSession: {
      date: Date,
      center: String,
      seatNumber: String,
      room: String,
    },

    notes: String,

    attachments: [
      {
        name: String,
        url: String,
        type: String,
      },
    ],
  },
  { timestamps: true }
);

/* ===============================
   EXAM SCHEMA
================================ */
const examSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      enum: ["TOEFL", "IELTS", "CSCA", "Duolingo", "Other"],
      unique: true,
      trim: true,
    },

    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    type: {
      type: String,
      required: true,
      enum: ["Language", "National", "International"],
      trim: true,
    },

    levels: [
      {
        type: String,
        enum: ["Secondary", "Undergraduate", "Graduate", "All Levels"],
        trim: true,
      },
    ],

    nextExamDate: {
      type: Date,
      required: true,
    },

    registrationDeadline: {
      type: Date,
      required: true,
    },

    registrationStatus: {
      type: String,
      enum: ["open", "closed", "upcoming", "full"],
      default: "open",
    },

    duration: {
      value: Number,
      unit: {
        type: String,
        enum: ["minutes", "hours"],
        default: "hours",
      },
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    requirements: [String],

    testCenters: [
      {
        name: String,
        address: String,
        city: String,
        capacity: Number,
        contact: String,
        email: String,
      },
    ],

    schedule: [
      {
        date: Date,
        time: String,
        center: String,
        availableSeats: Number,
        totalSeats: Number,
      },
    ],

    // ✅ FIXED: default empty array
    registrations: {
      type: [registrationSchema],
      default: [],
    },

    maxRegistrations: {
      type: Number,
      default: 100,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    tags: [String],

    metadata: {
      lastUpdated: {
        type: Date,
        default: Date.now,
      },
      version: {
        type: Number,
        default: 1,
      },
    },
  },
  { timestamps: true }
);

const Exam = mongoose.models.Exam || mongoose.model("Exam", examSchema);

module.exports = Exam;
