const mongoose = require('mongoose');

const newsletterSchema = new mongoose.Schema({
  email: { type: String, required: true, trim: true, lowercase: true },
  name: { type: String, default: 'Anonymous', trim: true },
  country: { type: String, default: 'Not specified', trim: true },
  source: { type: String, default: 'footer_newsletter' },
  subscription_date: { type: Date, default: Date.now },
  preferences: {
    updates: { type: Boolean, default: true },
    scholarships: { type: Boolean, default: true },
    university_news: { type: Boolean, default: true },
    visa_updates: { type: Boolean, default: true }
  }
});

const Newsletter = mongoose.models.Newsletter || mongoose.model('Newsletter', newsletterSchema);

module.exports = Newsletter;
