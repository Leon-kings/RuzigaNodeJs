const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide student name'],
    trim: true,
  },
  country: {
    type: String,
    required: [true, 'Please provide country'],
  },
  university: {
    type: String,
    required: [true, 'Please provide university name'],
  },
  program: {
    type: String,
    required: [true, 'Please provide program name'],
  },
  rating: {
    type: Number,
    required: [true, 'Please provide rating'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot be more than 5'],
  },
  date: {
    type: Date,
    default: Date.now,
  },
  duration: {
    type: String,
    required: [true, 'Please provide duration'],
  },
  content: {
    type: String,
    required: [true, 'Please provide testimonial content'],
    minlength: [50, 'Content must be at least 50 characters'],
  },
  image: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  verified: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  email: {
    type: String,
    required: [true, 'Please provide email'],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email',
    ],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Virtual for formatted date
testimonialSchema.virtual('formattedDate').get(function() {
  return this.date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
});

// Ensure virtuals are included in JSON
testimonialSchema.set('toJSON', { virtuals: true });
testimonialSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Testimonial', testimonialSchema);