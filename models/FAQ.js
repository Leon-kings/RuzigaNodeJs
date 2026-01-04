  // const mongoose = require('mongoose');

  // // Check if models are already compiled
  // const FAQ = mongoose.models.FAQ || mongoose.model('FAQ', new mongoose.Schema({
  //   question: String,
  //   answer: String,
  //   category: { type: String, default: 'general' },
  //   views: { type: Number, default: 0 },
  //   isPublished: { type: Boolean, default: true },
  //   createdAt: { type: Date, default: Date.now }
  // }));

  // const Question = mongoose.models.Question || mongoose.model('Question', new mongoose.Schema({
  //   question: { 
  //     type: String, 
  //     required: true,
  //     trim: true
  //   },
  //   email: { 
  //     type: String, 
  //     required: true,
  //     trim: true,
  //     lowercase: true
  //   },
  //   name: { 
  //     type: String, 
  //     default: 'User',
  //     trim: true
  //   },
  //   status: { 
  //     type: String, 
  //     default: 'pending',
  //     enum: ['pending', 'answered', 'archived']
  //   },
  //   answer: { 
  //     type: String,
  //     default: ''
  //   },
  //   category: {
  //     type: String,
  //     default: 'general'
  //   },
  //   source: { 
  //     type: String, 
  //     default: 'faq-page' 
  //   },
  //   metadata: {
  //     ipAddress: String,
  //     userAgent: String,
  //     referrer: String
  //   },
  //   timestamp: { 
  //     type: Date, 
  //     default: Date.now 
  //   },
  //   createdAt: { 
  //     type: Date, 
  //     default: Date.now 
  //   },
  //   answeredAt: {
  //     type: Date
  //   },
  //   isRead: {
  //     type: Boolean,
  //     default: false
  //   }
  // }));

  // const Statistics = mongoose.models.Statistics || mongoose.model('Statistics', new mongoose.Schema({
  //   date: { 
  //     type: Date, 
  //     required: true, 
  //     unique: true 
  //   },
  //   totalFAQs: { 
  //     type: Number, 
  //     default: 0 
  //   },
  //   totalQuestions: { 
  //     type: Number, 
  //     default: 0 
  //   },
  //   pendingQuestions: { 
  //     type: Number, 
  //     default: 0 
  //   },
  //   answeredQuestions: {
  //     type: Number,
  //     default: 0
  //   },
  //   newFAQs: {
  //     type: Number,
  //     default: 0
  //   },
  //   newQuestions: {
  //     type: Number,
  //     default: 0
  //   },
  //   faqViews: {
  //     type: Number,
  //     default: 0
  //   },
  //   emailStats: {
  //     sent: { type: Number, default: 0 },
  //     failed: { type: Number, default: 0 }
  //   },
  //   faqStats: {
  //     totalFAQs: { type: Number, default: 0 },
  //     publishedFAQs: { type: Number, default: 0 },
  //     newFAQs: { type: Number, default: 0 },
  //     updatedFAQs: { type: Number, default: 0 },
  //     faqViews: { type: Number, default: 0 }
  //   },
  //   questionStats: {
  //     totalQuestions: { type: Number, default: 0 },
  //     pendingQuestions: { type: Number, default: 0 },
  //     answeredQuestions: { type: Number, default: 0 },
  //     newQuestions: { type: Number, default: 0 },
  //     avgResponseTime: { type: Number, default: 0 }
  //   },
  //   categoryStats: {
  //     faqCategories: [{
  //       category: String,
  //       count: Number
  //     }],
  //     questionCategories: [{
  //       category: String,
  //       count: Number
  //     }]
  //   },
  //   createdAt: { 
  //     type: Date, 
  //     default: Date.now 
  //   }
  // }));

  // module.exports = { FAQ, Question, Statistics };


 const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema(
  {
    question: String,
    answer: String,
    category: { type: String, default: 'general' },
    views: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: true }
  },
  { timestamps: true }
);

faqSchema.index({
  question: 'text',
  answer: 'text',
  category: 'text'
});

const questionSchema = new mongoose.Schema(
  {
    question: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true },
    name: { type: String, default: 'User' },
    status: { type: String, enum: ['pending', 'answered', 'archived'], default: 'pending' },
    answer: { type: String, default: '' },
    category: { type: String, default: 'general' },
    source: { type: String, default: 'faq-page' },
    metadata: {
      ipAddress: String,
      userAgent: String,
      referrer: String
    },
    answeredAt: Date,
    isRead: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const statisticsSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true, unique: true },
    faqStats: Object,
    questionStats: Object,
    categoryStats: Object,
    emailStats: Object
  },
  { timestamps: true }
);

module.exports = {
  FAQ: mongoose.models.FAQ || mongoose.model('FAQ', faqSchema),
  Question: mongoose.models.Question || mongoose.model('Question', questionSchema),
  Statistics: mongoose.models.Statistics || mongoose.model('Statistics', statisticsSchema)
};
