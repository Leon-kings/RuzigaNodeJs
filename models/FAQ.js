const mongoose = require('mongoose');

// Check if models are already compiled
const FAQ = mongoose.models.FAQ || mongoose.model('FAQ', new mongoose.Schema({
  question: String,
  answer: String,
  category: { type: String, default: 'general' },
  views: { type: Number, default: 0 },
  isPublished: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
}));

const Question = mongoose.models.Question || mongoose.model('Question', new mongoose.Schema({
  question: String,
  email: String,
  name: { type: String, default: 'User' },
  status: { type: String, default: 'pending' },
  answer: String,
  source: { type: String, default: 'faq-page' },
  timestamp: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
}));

const Statistics = mongoose.models.Statistics || mongoose.model('Statistics', new mongoose.Schema({
  date: { type: Date, required: true, unique: true },
  totalFAQs: { type: Number, default: 0 },
  totalQuestions: { type: Number, default: 0 },
  pendingQuestions: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
}));

module.exports = { FAQ, Question, Statistics };