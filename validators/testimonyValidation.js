const Joi = require('joi');

const testimonialValidation = {
  // Create testimonial validation
  createTestimonial: Joi.object({
    name: Joi.string().min(3).max(100).required(),
    country: Joi.string().min(2).max(100).required(),
    university: Joi.string().min(5).max(200).required(),
    program: Joi.string().min(3).max(100).required(),
    rating: Joi.number().min(1).max(5).required(),
    duration: Joi.string().min(3).max(50).required(),
    content: Joi.string().min(50).max(2000).required(),
    email: Joi.string().email().required(),
    verified: Joi.boolean(),
  }),

  // Update testimonial validation
  updateTestimonial: Joi.object({
    name: Joi.string().min(3).max(100),
    country: Joi.string().min(2).max(100),
    university: Joi.string().min(5).max(200),
    program: Joi.string().min(3).max(100),
    rating: Joi.number().min(1).max(5),
    duration: Joi.string().min(3).max(50),
    content: Joi.string().min(50).max(2000),
    email: Joi.string().email(),
    verified: Joi.boolean(),
    status: Joi.string().valid('pending', 'approved', 'rejected'),
  }),

  // Query validation
  queryValidation: Joi.object({
    page: Joi.number().min(1).default(1),
    limit: Joi.number().min(1).max(100).default(10),
    status: Joi.string().valid('pending', 'approved', 'rejected', 'all'),
    verified: Joi.boolean(),
    sort: Joi.string().valid('newest', 'oldest', 'highest-rating', 'lowest-rating'),
    search: Joi.string().allow(''),
  }),
};

module.exports = testimonialValidation;