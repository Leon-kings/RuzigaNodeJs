const mongoose = require("mongoose");

/* ===================== UNIVERSITY ===================== */
const universitySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    country: { type: String, required: true },
    city: { type: String, required: true },

    ranking: { type: Number, default: 999 },
    worldRanking: { type: Number, default: 1000 },

    programs: { type: [String], default: [] },
    tuition: { type: String, default: "Contact for details" },
    language: { type: String, default: "English" },
    deadline: { type: String, default: "Rolling admission" },

    scholarships: { type: [String], default: [] },
    requirements: { type: [String], default: [] },

    acceptanceRate: { type: String, default: "Contact for details" },
    studentPopulation: { type: String, default: "N/A" },
    internationalStudents: { type: String, default: "N/A" },

    images: {
      type: [{ public_id: String, url: String }],
      default: [],
    },

    featured: { type: Boolean, default: false },
    description: {
      type: String,
      default: "A prestigious university offering quality education.",
    },

    availableSlots: { type: [String], default: [] },
    consultationDuration: { type: Number, default: 30 },
    bookingPrice: { type: Number, default: 0 },
  },
  { timestamps: true }
);

/* ===================== BOOKING ===================== */
// const bookingSchema = new mongoose.Schema(
//   {
//     booking: {
//       university: { type: mongoose.Schema.Types.ObjectId, ref: "University", required: true },
//       student: {
//         fullName: { type: String, required: true },
//         email: { type: String, required: true },
//         phone: { type: String, required: true },
//         targetCountry: { type: String, required: true },
//       },
//       bookingDetails: {
//         date: { type: Date, required: true },
//         time: { type: String, required: true },
//         type: {
//           type: String,
//           enum: ["virtual", "in-person"],
//           default: "virtual",
//         },
//       },
//       status: {
//         type: String,
//         enum: ["pending", "confirmed", "cancelled", "completed"],
//         default: "pending",
//       },
//       payment: {
//         method: { type: String, default: "payed" },
//         amount: { type: Number, default: 0 },
//         paid: { type: Boolean, default: false },
//       },
//       notes: {
//         text: { type: String },
//         author: { type: String },
//         date: { type: Date, default: Date.now },
//       },
//     },

//     university: {
//       name: { type: String },
//       country: { type: String },
//       city: { type: String },
//       ranking: { type: Number, default: 999 },
//       worldRanking: { type: Number, default: 1000 },
//       programs: { type: [String], default: [] },
//       tuition: { type: String, default: "Contact for details" },
//       language: { type: String, default: "English" },
//       deadline: { type: String, default: "Rolling admission" },
//       scholarships: { type: [String], default: [] },
//       requirements: { type: [String], default: [] },
//       acceptanceRate: { type: String, default: "Contact for details" },
//       studentPopulation: { type: String, default: "N/A" },
//       internationalStudents: { type: String, default: "N/A" },
//       images: { type: [{ public_id: String, url: String }], default: [] },
//       featured: { type: Boolean, default: false },
//       description: {
//         type: String,
//         default: "A prestigious university offering quality education.",
//       },
//       availableSlots: { type: [String], default: [] },
//       consultationDuration: { type: Number, default: 30 },
//       bookingPrice: { type: Number, default: 0 },
//     },
//   },
//   { timestamps: true }
// );

const bookingSchema = new mongoose.Schema(
  {
    university: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "University",
      required: true,
    },

    customer: {
      fullName: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      targetCountry: { type: String, required: true },

      program: { type: String },
      educationLevel: { type: String },
      budget: { type: String },
      priceUSD: { type: String },
      startDate: { type: Date },
      requirements: { type: String },
    },

    service: {
      name: { type: String, required: true },
      id: { type: String },
      category: { type: String },
    },

    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },

    notes: [
      {
        text: String,
        author: String,
        date: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

/* ===================== EXPORT MODELS ===================== */
const University =
  mongoose.models.University || mongoose.model("University", universitySchema);

const Booking =
  mongoose.models.Booking || mongoose.model("Booking", bookingSchema);

module.exports = { University, Booking };
