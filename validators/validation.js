const Joi = require('joi');

const contactValidation = {
  // Create contact validation
  createContact: Joi.object({
    name: Joi.string()
      .min(2)
      .max(100)
      .required()
      .pattern(/^[a-zA-Z\s\-'.]+$/)
      .messages({
        'string.pattern.base': 'Name can only contain letters, spaces, hyphens, apostrophes, and periods',
        'string.min': 'Name must be at least 2 characters long',
        'string.max': 'Name cannot exceed 100 characters',
        'any.required': 'Name is required'
      }),

    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required'
      }),

    subject: Joi.string()
      .min(5)
      .max(200)
      .required()
      .messages({
        'string.min': 'Subject must be at least 5 characters long',
        'string.max': 'Subject cannot exceed 200 characters',
        'any.required': 'Subject is required'
      }),

    message: Joi.string()
      .min(10)
      .max(5000)
      .required()
      .messages({
        'string.min': 'Message must be at least 10 characters long',
        'string.max': 'Message cannot exceed 5000 characters',
        'any.required': 'Message is required'
      })
  }),

  // Update contact validation
  updateContact: Joi.object({
    name: Joi.string()
      .min(2)
      .max(100)
      .pattern(/^[a-zA-Z\s\-'.]+$/),
    
    email: Joi.string().email(),
    
    subject: Joi.string()
      .min(5)
      .max(200),
    
    message: Joi.string()
      .min(10)
      .max(5000),
    
    status: Joi.string()
      .valid('pending', 'read', 'replied', 'archived'),
    
    replyMessage: Joi.string()
      .min(10)
      .max(5000)
  }).min(1),

  // Reply validation
  replyContact: Joi.object({
    replyMessage: Joi.string()
      .min(10)
      .max(5000)
      .required()
      .messages({
        'string.min': 'Reply message must be at least 10 characters long',
        'string.max': 'Reply message cannot exceed 5000 characters',
        'any.required': 'Reply message is required'
      })
  }),

  // Status update validation
  updateStatus: Joi.object({
    status: Joi.string()
      .valid('pending', 'read', 'replied', 'archived')
      .required()
  }),

  // Bulk operations validation
  bulkUpdate: Joi.object({
    ids: Joi.array()
      .items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/))
      .min(1)
      .required(),
    updateData: Joi.object({
      status: Joi.string().valid('pending', 'read', 'replied', 'archived'),
      replied: Joi.boolean()
    }).required()
  }),

  bulkDelete: Joi.object({
    ids: Joi.array()
      .items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/))
      .min(1)
      .required()
  }),

  // Get contacts with filters validation
  getContacts: Joi.object({
    page: Joi.number().min(1).default(1),
    limit: Joi.number().min(1).max(100).default(10),
    status: Joi.string().valid('pending', 'read', 'replied', 'archived', 'all'),
    search: Joi.string().allow('').max(100),
    startDate: Joi.date().iso(),
    endDate: Joi.date().iso().min(Joi.ref('startDate')),
    sortBy: Joi.string().valid('createdAt', 'updatedAt', 'name', 'email', 'status'),
    sortOrder: Joi.string().valid('asc', 'desc')
  }),

  // Analytics validation
  getAnalytics: Joi.object({
    startDate: Joi.date().iso(),
    endDate: Joi.date().iso().min(Joi.ref('startDate')),
    groupBy: Joi.string().valid('hour', 'day', 'week', 'month')
  }),

  // Export validation
  exportContacts: Joi.object({
    format: Joi.string().valid('json', 'csv'),
    startDate: Joi.date().iso(),
    endDate: Joi.date().iso()
  })
};

const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error } = schema.validate(req[property], { 
      abortEarly: false,
      allowUnknown: property === 'query' // Allow additional query params
    });
    
    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));
      
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }
    next();
  };
};

module.exports = { contactValidation, validate };