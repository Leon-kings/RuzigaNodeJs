module.exports = {
  // University Types
  UNIVERSITY_TYPES: ['public', 'private', 'community', 'technical', 'research'],
  
  // Booking Types
  BOOKING_TYPES: ['campus_tour', 'admission_interview', 'consultation', 'virtual_tour'],
  
  // Application Status
  APPLICATION_STATUS: ['draft', 'submitted', 'under_review', 'accepted', 'rejected'],
  
  // Booking Status
  BOOKING_STATUS: ['pending', 'confirmed', 'completed', 'cancelled'],
  
  // Payment Status
  PAYMENT_STATUS: ['pending', 'paid', 'refunded'],
  
  // University Status
  UNIVERSITY_STATUS: ['active', 'inactive', 'suspended'],
  
  // Document Status
  DOCUMENT_STATUS: ['pending', 'uploaded', 'verified'],
  
  // Default Image
  DEFAULT_UNIVERSITY_IMAGE: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80',
  
  // Pagination
  DEFAULT_PAGE_LIMIT: 10,
  MAX_PAGE_LIMIT: 100,
  
  // Email Templates
  EMAIL_TEMPLATES: {
    UNIVERSITY_CREATED: 'university_created',
    BOOKING_CONFIRMED: 'booking_confirmed',
    APPLICATION_SUBMITTED: 'application_submitted',
    STATUS_UPDATED: 'status_updated'
  }
};