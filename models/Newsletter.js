const mongoose = require('mongoose');

const newsletterSchema = new mongoose.Schema({
  email: { type: String, required: true, trim: true, lowercase: true },
  name: { type: String, default: 'Anonymous', trim: true },
  country: { type: String, default: 'Rwanda', trim: true },
  source: { type: String, default: 'footer_newsletter' },
  subscription_date: { type: Date, default: Date.now },

});

const Newsletter = mongoose.models.Newsletter || mongoose.model('Newsletter', newsletterSchema);

module.exports = Newsletter;
