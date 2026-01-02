// const mongoose = require('mongoose');

// const visaSchema = new mongoose.Schema({
//   id: {
//     type: String,
//     required: true,
//     unique: true
//   },
//   applicant: {
//     type: String,
//     required: true
//   },
//   country: {
//     type: String,
//     required: true
//   },
//   type: {
//     type: String,
//     enum: ['Tourist', 'Business', 'Student', 'Work', 'Transit'],
//     required: true
//   },
//   status: {
//     type: String,
//     enum: ['pending', 'approved', 'rejected', 'in-review'],
//     default: 'pending'
//   },
//   date: {
//     type: Date,
//     required: true
//   },
//   duration: {
//     type: String,
//     required: true
//   },
//   priority: {
//     type: String,
//     enum: ['Normal', 'Express', 'Urgent'],
//     default: 'Normal'
//   },
//   amount: {
//     type: String,
//     required: true
//   },
//   documents: {
//     type: Number,
//     default: 0
//   },
//   email: {
//     type: String,
//     required: true
//   },
//   phone: {
//     type: String,
//     required: true
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   },
//   updatedAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// // Update the updatedAt field before saving
// visaSchema.pre('save', function(next) {
//   this.updatedAt = Date.now();
//   next();
// });

// module.exports = mongoose.model('Visa', visaSchema);








const mongoose = require('mongoose');

const visaSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    applicant: {
      type: String,
      required: true,
      trim: true
    },
    country: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      enum: ['Tourist', 'Business', 'Student', 'Work', 'Transit'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'in-review'],
      default: 'pending'
    },
    date: {
      type: Date,
      required: true
    },
    duration: {
      type: String,
      required: true
    },
    priority: {
      type: String,
      enum: ['Normal', 'Express', 'Urgent'],
      default: 'Normal'
    },
    amount: {
      type: String,
      required: true
    },
    documents: {
      type: Number,
      default: 0,
      min: 0
    },
    email: {
      type: String,
      required: true,
      lowercase: true
    },
    phone: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true // ✅ auto handles createdAt & updatedAt
  }
);

// OPTIONAL: pre-save hook (safe)
visaSchema.pre('save', function () {
  // do NOT use next unless async work is needed
  this.updatedAt = Date.now();
});

module.exports = mongoose.model('Visa', visaSchema);
