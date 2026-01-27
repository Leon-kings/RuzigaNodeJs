// // const mongoose = require('mongoose');

// // const visaSchema = new mongoose.Schema({
// //   id: {
// //     type: String,
// //     required: true,
// //     unique: true
// //   },
// //   applicant: {
// //     type: String,
// //     required: true
// //   },
// //   country: {
// //     type: String,
// //     required: true
// //   },
// //   type: {
// //     type: String,
// //     enum: ['Tourist', 'Business', 'Student', 'Work', 'Transit'],
// //     required: true
// //   },
// //   status: {
// //     type: String,
// //     enum: ['pending', 'approved', 'rejected', 'in-review'],
// //     default: 'pending'
// //   },
// //   date: {
// //     type: Date,
// //     required: true
// //   },
// //   duration: {
// //     type: String,
// //     required: true
// //   },
// //   priority: {
// //     type: String,
// //     enum: ['Normal', 'Express', 'Urgent'],
// //     default: 'Normal'
// //   },
// //   amount: {
// //     type: String,
// //     required: true
// //   },
// //   documents: {
// //     type: Number,
// //     default: 0
// //   },
// //   email: {
// //     type: String,
// //     required: true
// //   },
// //   phone: {
// //     type: String,
// //     required: true
// //   },
// //   createdAt: {
// //     type: Date,
// //     default: Date.now
// //   },
// //   updatedAt: {
// //     type: Date,
// //     default: Date.now
// //   }
// // });

// // // Update the updatedAt field before saving
// // visaSchema.pre('save', function(next) {
// //   this.updatedAt = Date.now();
// //   next();
// // });

// // module.exports = mongoose.model('Visa', visaSchema);








// const mongoose = require('mongoose');

// const visaSchema = new mongoose.Schema(
//   {
//     id: {
//       type: String,
//       required: true,
//       unique: true,
//       index: true
//     },
//     applicant: {
//       type: String,
//       required: true,
//       trim: true
//     },
//     country: {
//       type: String,
//       required: true,
//       trim: true
//     },
//     type: {
//       type: String,
//       enum: ['Tourist', 'Business', 'Student', 'Work', 'Transit'],
//       required: true
//     },
//     status: {
//       type: String,
//       enum: ['pending', 'approved', 'rejected', 'in-review'],
//       default: 'pending'
//     },
//     date: {
//       type: Date,
//       required: true
//     },
//     duration: {
//       type: String,
//       required: true
//     },
//     priority: {
//       type: String,
//       enum: ['Normal', 'Express', 'Urgent'],
//       default: 'Normal'
//     },
//     amount: {
//       type: String,
//       required: true
//     },
//     documents: {
//       type: Number,
//       default: 0,
//       min: 0
//     },
//     email: {
//       type: String,
//       required: true,
//       lowercase: true
//     },
//     phone: {
//       type: String,
//       required: true
//     }
//   },
//   {
//     timestamps: true // ✅ auto handles createdAt & updatedAt
//   }
// );

// // OPTIONAL: pre-save hook (safe)
// visaSchema.pre('save', function () {
//   // do NOT use next unless async work is needed
//   this.updatedAt = Date.now();
// });

// module.exports = mongoose.model('Visa', visaSchema);












// // models/VisaService.js
// const mongoose = require('mongoose');

// const visaServiceSchema = new mongoose.Schema(
//   {
//     // Primary Identifiers
//     serviceId: {
//       type: String,
//       required: true,
//       unique: true,
//       index: true
//     },
//     trackingNumber: {
//       type: String,
//       unique: true,
//       index: true
//     },
    
//     // Service Type & Stage (Booking or Application)
//     serviceType: {
//       type: String,
//       enum: ['booking', 'application', 'combined'],
//       required: true,
//       default: 'booking'
//     },
//     serviceStage: {
//       type: String,
//       enum: [
//         'booking-pending',
//         'booking-confirmed',
//         'consultation-completed',
//         'application-initiated',
//         'application-submitted',
//         'document-verification',
//         'payment-processing',
//         'embassy-processing',
//         'visa-approved',
//         'visa-issued',
//         'completed',
//         'cancelled'
//       ],
//       default: 'booking-pending'
//     },
    
//     // Customer/Applicant Information
//     customer: {
//       // Personal Details
//       personalInfo: {
//         fullName: {
//           type: String,
//           required: true,
//           trim: true
//         },
//         dateOfBirth: {
//           type: Date,
//           required: true
//         },
//         gender: {
//           type: String,
//           enum: ['male', 'female', 'other', 'prefer-not-to-say']
//         },
//         nationality: {
//           type: String,
//           required: true
//         },
//         countryOfResidence: {
//           type: String,
//           required: true
//         },
//         maritalStatus: {
//           type: String,
//           enum: ['single', 'married', 'divorced', 'widowed', 'separated']
//         },
//         occupation: String,
//         employer: String
//       },
      
//       // Contact Information
//       contactInfo: {
//         email: {
//           type: String,
//           required: true,
//           lowercase: true,
//           match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
//         },
//         primaryPhone: {
//           type: String,
//           required: true
//         },
//         secondaryPhone: String,
//         whatsappNumber: String,
//         address: {
//           street: String,
//           city: String,
//           state: String,
//           country: String,
//           postalCode: String
//         },
//         emergencyContact: {
//           name: String,
//           relationship: String,
//           phone: String,
//           email: String
//         }
//       },
      
//       // Passport Details
//       passportInfo: {
//         passportNumber: {
//           type: String
//         },
//         issuingCountry: String,
//         issueDate: Date,
//         expiryDate: Date,
//         placeOfIssue: String,
//         hasPreviousVisas: {
//           type: Boolean,
//           default: false
//         },
//         previousVisaDetails: [{
//           country: String,
//           type: String,
//           issueDate: Date,
//           expiryDate: Date
//         }]
//       }
//     },
    
//     // Booking Details (Initial Consultation/Appointment)
//     bookingDetails: {
//       type: {
//         type: String,
//         enum: ['consultation', 'document-submission', 'appointment', 'online-help', 'walk-in'],
//         default: 'consultation'
//       },
//       serviceRequested: {
//         type: String,
//         enum: [
//           'tourist-visa',
//           'business-visa',
//           'student-visa',
//           'work-visa',
//           'family-visa',
//           'transit-visa',
//           'visa-renewal',
//           'visa-extension',
//           'express-service',
//           'premium-service',
//           'general-consultation'
//         ]
//       },
//       appointment: {
//         date: Date,
//         timeSlot: String,
//         duration: Number, // in minutes
//         mode: {
//           type: String,
//           enum: ['in-person', 'online', 'phone'],
//           default: 'in-person'
//         },
//         location: String,
//         address: String,
//         confirmed: {
//           type: Boolean,
//           default: false
//         },
//         attended: {
//           type: Boolean,
//           default: false
//         },
//         notes: String
//       },
//       bookingStatus: {
//         type: String,
//         enum: ['pending', 'confirmed', 'completed', 'cancelled', 'no-show', 'rescheduled'],
//         default: 'pending'
//       },
//       bookingAmount: {
//         type: Number,
//         default: 0
//       },
//       bookingPayment: {
//         status: {
//           type: String,
//           enum: ['pending', 'paid', 'refunded'],
//           default: 'pending'
//         },
//         method: String,
//         transactionId: String,
//         paidAt: Date
//       }
//     },
    
//     // Visa Application Details
//     applicationDetails: {
//       // Visa Requirements
//       visaInfo: {
//         destinationCountry: {
//           type: String,
//           required: true
//         },
//         visaType: {
//           type: String,
//           enum: ['Tourist', 'Business', 'Student', 'Work', 'Transit', 'Family', 'Medical', 'Diplomatic'],
//           required: true
//         },
//         category: {
//           type: String,
//           enum: ['short-term', 'long-term', 'single-entry', 'multiple-entry', 'transit'],
//           default: 'short-term'
//         },
//         purposeOfTravel: {
//           type: String,
//           required: true
//         },
//         travelDates: {
//           intendedEntry: Date,
//           intendedExit: Date,
//           flexibleDates: {
//             type: Boolean,
//             default: false
//           }
//         },
//         durationOfStay: String,
//         entriesRequested: {
//           type: String,
//           enum: ['Single', 'Double', 'Multiple'],
//           default: 'Single'
//         },
//         travelCompanions: [{
//           name: String,
//           relationship: String,
//           age: Number
//         }]
//       },
      
//       // Service Package
//       servicePackage: {
//         name: {
//           type: String,
//           enum: ['basic', 'standard', 'express', 'premium', 'custom'],
//           default: 'standard'
//         },
//         description: String,
//         processingTime: {
//           type: String,
//           default: '15-20 business days'
//         },
//         inclusions: [String],
//         exclusions: [String]
//       },
      
//       // Fees Breakdown
//       fees: {
//         consultationFee: {
//           type: Number,
//           default: 0
//         },
//         serviceFee: {
//           type: Number,
//           default: 0
//         },
//         embassyFee: {
//           type: Number,
//           default: 0
//         },
//         additionalFees: {
//           type: Number,
//           default: 0
//         },
//         discount: {
//           type: Number,
//           default: 0
//         },
//         totalAmount: {
//           type: Number,
//           default: 0
//         },
//         currency: {
//           type: String,
//           default: 'USD'
//         }
//       },
      
//       // Payment Information
//       payment: {
//         status: {
//           type: String,
//           enum: ['pending', 'partial', 'paid', 'overdue', 'refunded', 'cancelled'],
//           default: 'pending'
//         },
//         amountPaid: {
//           type: Number,
//           default: 0
//         },
//         paymentMethod: {
//           type: String,
//           enum: ['credit-card', 'debit-card', 'bank-transfer', 'cash', 'online-payment', 'installment']
//         },
//         dueDate: Date,
//         paymentHistory: [{
//           amount: Number,
//           date: Date,
//           method: String,
//           transactionId: String,
//           reference: String,
//           notes: String
//         }]
//       },
      
//       // Application Status
//       applicationStatus: {
//         current: {
//           type: String,
//           enum: [
//             'not-started',
//             'draft',
//             'document-collection',
//             'document-review',
//             'application-filling',
//             'payment-pending',
//             'submitted-to-embassy',
//             'embassy-processing',
//             'interview-scheduled',
//             'decision-pending',
//             'additional-documents-requested',
//             'approved',
//             'rejected',
//             'visa-printed',
//             'ready-for-collection',
//             'collected',
//             'cancelled'
//           ],
//           default: 'not-started'
//         },
//         submittedAt: Date,
//         processingStartedAt: Date,
//         expectedCompletionDate: Date,
//         actualCompletionDate: Date,
//         embassySubmissionDate: Date,
//         decisionDate: Date,
//         collectionDate: Date
//       },
      
//       // Embassy/Consulate Details
//       embassyInfo: {
//         embassyName: String,
//         location: String,
//         applicationNumber: String,
//         referenceNumber: String,
//         trackingNumber: String,
//         submissionMethod: {
//           type: String,
//           enum: ['in-person', 'courier', 'online', 'agent']
//         },
//         submissionDate: Date,
//         appointmentDate: Date,
//         interviewDate: Date,
//         collectionMethod: {
//           type: String,
//           enum: ['in-person', 'courier', 'representative']
//         },
//         collectionDate: Date,
//         trackingUrl: String
//       },
      
//       // Visa Issuance Details
//       visaIssuance: {
//         visaNumber: String,
//         issueDate: Date,
//         expiryDate: Date,
//         validityStart: Date,
//         validityEnd: Date,
//         durationOfStay: String,
//         entriesAllowed: String,
//         remarks: String,
//         issuedAt: String,
//         issuingOfficer: String,
//         visaStickerNumber: String
//       }
//     },
    
//     // Documents & Files (Cloudinary Integration)
//     documents: {
//       // Applicant Photograph
//       photograph: {
//         cloudinaryUrl: String,
//         publicId: String,
//         uploadedAt: Date,
//         meetsRequirements: {
//           type: Boolean,
//           default: false
//         },
//         verifiedBy: String,
//         verifiedAt: Date
//       },
      
//       // Document Categories
//       passportCopy: {
//         cloudinaryUrl: String,
//         publicId: String,
//         uploadedAt: Date,
//         verified: {
//           type: Boolean,
//           default: false
//         }
//       },
      
//       financialDocuments: [{
//         documentType: {
//           type: String,
//           enum: ['bank-statement', 'salary-slip', 'tax-return', 'sponsor-letter', 'proof-of-funds']
//         },
//         cloudinaryUrl: String,
//         publicId: String,
//         originalName: String,
//         uploadedAt: Date,
//         verified: {
//           type: Boolean,
//           default: false
//         }
//       }],
      
//       travelDocuments: [{
//         documentType: {
//           type: String,
//           enum: ['flight-ticket', 'hotel-booking', 'travel-insurance', 'itinerary']
//         },
//         cloudinaryUrl: String,
//         publicId: String,
//         originalName: String,
//         uploadedAt: Date,
//         verified: {
//           type: Boolean,
//           default: false
//         }
//       }],
      
//       supportingDocuments: [{
//         documentType: {
//           type: String,
//           enum: [
//             'invitation-letter',
//             'employment-letter',
//             'enrollment-letter',
//             'business-registration',
//             'marriage-certificate',
//             'birth-certificate',
//             'police-clearance',
//             'medical-certificate'
//           ]
//         },
//         cloudinaryUrl: String,
//         publicId: String,
//         originalName: String,
//         uploadedAt: Date,
//         verified: {
//           type: Boolean,
//           default: false
//         }
//       }],
      
//       otherDocuments: [{
//         description: String,
//         cloudinaryUrl: String,
//         publicId: String,
//         originalName: String,
//         uploadedAt: Date,
//         verified: {
//           type: Boolean,
//           default: false
//         }
//       }],
      
//       generatedDocuments: [{
//         documentType: {
//           type: String,
//           enum: ['application-form', 'cover-letter', 'checklist', 'invoice', 'receipt']
//         },
//         cloudinaryUrl: String,
//         publicId: String,
//         generatedAt: Date,
//         generatedBy: String
//       }]
//     },
    
//     // Internal Management
//     internal: {
//       assignedTo: {
//         agentId: mongoose.Schema.Types.ObjectId,
//         agentName: String,
//         agentEmail: String,
//         department: {
//           type: String,
//           enum: ['sales', 'consultation', 'processing', 'verification', 'customer-service']
//         },
//         assignedAt: Date,
//         lastContacted: Date
//       },
      
//       priority: {
//         type: String,
//         enum: ['low', 'normal', 'high', 'urgent'],
//         default: 'normal'
//       },
      
//       source: {
//         type: String,
//         enum: ['website', 'walk-in', 'referral', 'partner', 'social-media', 'repeat-customer'],
//         default: 'website'
//       },
      
//       tags: [String],
      
//       notes: [{
//         note: String,
//         addedBy: String,
//         addedAt: {
//           type: Date,
//           default: Date.now
//         },
//         category: {
//           type: String,
//           enum: ['general', 'document', 'payment', 'status', 'customer', 'internal']
//         },
//         priority: {
//           type: String,
//           enum: ['low', 'medium', 'high']
//         }
//       }],
      
//       followUp: {
//         required: {
//           type: Boolean,
//           default: false
//         },
//         scheduledDate: Date,
//         completed: {
//           type: Boolean,
//           default: false
//         },
//         completedAt: Date,
//         notes: String
//       }
//     },
    
//     // Communication Log
//     communications: [{
//       type: {
//         type: String,
//         enum: ['email', 'sms', 'phone-call', 'whatsapp', 'in-person', 'chat']
//       },
//       direction: {
//         type: String,
//         enum: ['incoming', 'outgoing']
//       },
//       subject: String,
//       content: String,
//       sentAt: Date,
//       sentBy: String,
//       recipients: [String],
//       attachments: [{
//         name: String,
//         url: String
//       }],
//       status: {
//         type: String,
//         enum: ['sent', 'delivered', 'read', 'failed']
//       }
//     }],
    
//     // Status History Timeline
//     statusHistory: [{
//       stage: String,
//       status: String,
//       changedAt: {
//         type: Date,
//         default: Date.now
//       },
//       changedBy: String,
//       remarks: String,
//       metadata: mongoose.Schema.Types.Mixed
//     }],
    
//     // Audit Log
//     auditLog: [{
//       action: String,
//       performedBy: String,
//       performedAt: {
//         type: Date,
//         default: Date.now
//       },
//       details: mongoose.Schema.Types.Mixed,
//       ipAddress: String,
//       userAgent: String
//     }]
//   },
//   {
//     timestamps: true
//   }
// );

// // ========== VIRTUAL PROPERTIES ==========
// visaServiceSchema.virtual('totalDocuments').get(function() {
//   let count = 0;
//   if (this.documents.photograph?.cloudinaryUrl) count++;
//   if (this.documents.passportCopy?.cloudinaryUrl) count++;
//   count += this.documents.financialDocuments?.length || 0;
//   count += this.documents.travelDocuments?.length || 0;
//   count += this.documents.supportingDocuments?.length || 0;
//   count += this.documents.otherDocuments?.length || 0;
//   return count;
// });

// visaServiceSchema.virtual('verifiedDocuments').get(function() {
//   let count = 0;
//   if (this.documents.photograph?.verified) count++;
//   if (this.documents.passportCopy?.verified) count++;
  
//   const countVerified = (docs) => docs?.filter(doc => doc.verified).length || 0;
//   count += countVerified(this.documents.financialDocuments);
//   count += countVerified(this.documents.travelDocuments);
//   count += countVerified(this.documents.supportingDocuments);
//   count += countVerified(this.documents.otherDocuments);
  
//   return count;
// });

// visaServiceSchema.virtual('balanceDue').get(function() {
//   const total = this.applicationDetails.fees?.totalAmount || 0;
//   const paid = this.applicationDetails.payment?.amountPaid || 0;
//   return Math.max(0, total - paid);
// });

// visaServiceSchema.virtual('isOverdue').get(function() {
//   if (!this.applicationDetails.payment?.dueDate) return false;
//   const dueDate = new Date(this.applicationDetails.payment.dueDate);
//   const today = new Date();
//   return today > dueDate && this.balanceDue > 0;
// });

// visaServiceSchema.virtual('nextActionRequired').get(function() {
//   const stage = this.serviceStage;
//   const status = this.applicationDetails.applicationStatus?.current;
  
//   if (stage === 'booking-pending') return 'Confirm appointment';
//   if (stage === 'booking-confirmed') return 'Attend consultation';
//   if (stage === 'consultation-completed') return 'Submit documents';
//   if (status === 'document-collection') return 'Upload required documents';
//   if (status === 'payment-pending') return 'Make payment';
//   if (status === 'interview-scheduled') return 'Attend interview';
//   if (status === 'ready-for-collection') return 'Collect visa';
  
//   return 'No action required';
// });

// // ========== PRE-SAVE HOOKS ==========
// visaServiceSchema.pre('save', function(next) {
//   // Generate IDs if not present
//   if (!this.serviceId) {
//     const timestamp = Date.now();
//     const random = Math.floor(Math.random() * 1000);
//     this.serviceId = `VS-${timestamp}-${random}`;
//   }
  
//   if (!this.trackingNumber && this.serviceType !== 'booking') {
//     const date = new Date().toISOString().slice(2, 10).replace(/-/g, '');
//     const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
//     this.trackingNumber = `TRK${date}${random}`;
//   }
  
//   // Calculate total fees
//   if (this.isModified('applicationDetails.fees')) {
//     const fees = this.applicationDetails.fees;
//     if (fees) {
//       const consultation = fees.consultationFee || 0;
//       const service = fees.serviceFee || 0;
//       const embassy = fees.embassyFee || 0;
//       const additional = fees.additionalFees || 0;
//       const discount = fees.discount || 0;
      
//       fees.totalAmount = consultation + service + embassy + additional - discount;
//     }
//   }
  
//   // Update payment status based on amount paid
//   if (this.isModified('applicationDetails.payment.amountPaid')) {
//     const payment = this.applicationDetails.payment;
//     const total = this.applicationDetails.fees?.totalAmount || 0;
    
//     if (payment.amountPaid >= total) {
//       payment.status = 'paid';
//     } else if (payment.amountPaid > 0) {
//       payment.status = 'partial';
//     } else {
//       payment.status = 'pending';
//     }
//   }
  
//   // Record status changes in history
//   if (this.isModified('serviceStage') || this.isModified('applicationDetails.applicationStatus.current')) {
//     this.statusHistory.push({
//       stage: this.serviceStage,
//       status: this.applicationDetails.applicationStatus?.current || 'N/A',
//       changedBy: 'system',
//       remarks: 'Status updated',
//       metadata: {
//         previousStage: this._original?.serviceStage,
//         previousStatus: this._original?.applicationDetails?.applicationStatus?.current
//       }
//     });
//   }
  
//   // Set timestamps based on status
//   if (this.isModified('serviceStage')) {
//     const now = new Date();
//     switch (this.serviceStage) {
//       case 'application-initiated':
//         if (!this.applicationDetails.applicationStatus.submittedAt) {
//           this.applicationDetails.applicationStatus.submittedAt = now;
//         }
//         break;
//       case 'embassy-processing':
//         if (!this.applicationDetails.embassyInfo.submissionDate) {
//           this.applicationDetails.embassyInfo.submissionDate = now;
//         }
//         break;
//       case 'visa-approved':
//         if (!this.applicationDetails.applicationStatus.decisionDate) {
//           this.applicationDetails.applicationStatus.decisionDate = now;
//         }
//         break;
//     }
//   }
  
//   next();
// });

// // ========== INSTANCE METHODS ==========
// visaServiceSchema.methods.convertToApplication = function() {
//   this.serviceType = 'combined';
//   this.serviceStage = 'application-initiated';
//   this.applicationDetails.applicationStatus.current = 'document-collection';
  
//   // Copy booking fee to application fees if applicable
//   if (this.bookingDetails.bookingAmount > 0) {
//     this.applicationDetails.fees.consultationFee = this.bookingDetails.bookingAmount;
//     this.applicationDetails.payment.amountPaid = this.bookingDetails.bookingAmount;
//   }
  
//   return this.save();
// };

// visaServiceSchema.methods.updatePayment = function(amount, method, transactionId, notes = '') {
//   const paymentRecord = {
//     amount: amount,
//     date: new Date(),
//     method: method,
//     transactionId: transactionId,
//     reference: `PAY-${Date.now()}`,
//     notes: notes
//   };
  
//   this.applicationDetails.payment.paymentHistory.push(paymentRecord);
//   this.applicationDetails.payment.amountPaid += amount;
//   this.applicationDetails.payment.paymentMethod = method;
  
//   // Update payment status
//   const total = this.applicationDetails.fees.totalAmount || 0;
//   if (this.applicationDetails.payment.amountPaid >= total) {
//     this.applicationDetails.payment.status = 'paid';
//   } else if (this.applicationDetails.payment.amountPaid > 0) {
//     this.applicationDetails.payment.status = 'partial';
//   }
  
//   // Record in audit log
//   this.auditLog.push({
//     action: 'payment_received',
//     performedBy: 'system',
//     details: paymentRecord
//   });
  
//   return this.save();
// };

// visaServiceSchema.methods.addDocument = function(category, documentData) {
//   switch(category) {
//     case 'photograph':
//       this.documents.photograph = documentData;
//       break;
//     case 'passport':
//       this.documents.passportCopy = documentData;
//       break;
//     case 'financial':
//       this.documents.financialDocuments.push(documentData);
//       break;
//     case 'travel':
//       this.documents.travelDocuments.push(documentData);
//       break;
//     case 'supporting':
//       this.documents.supportingDocuments.push(documentData);
//       break;
//     default:
//       this.documents.otherDocuments.push(documentData);
//   }
  
//   // Update status if this is first document
//   if (this.serviceStage === 'application-initiated' && this.totalDocuments > 0) {
//     this.serviceStage = 'document-verification';
//   }
  
//   return this.save();
// };

// visaServiceSchema.methods.verifyDocument = function(documentId, verifiedBy, category = null) {
//   // Implementation for document verification
//   // This would search through document arrays and update verification status
//   // For simplicity, marking photograph as verified
//   if (category === 'photograph') {
//     this.documents.photograph.verified = true;
//     this.documents.photograph.verifiedBy = verifiedBy;
//     this.documents.photograph.verifiedAt = new Date();
//   }
  
//   // Check if all required documents are verified
//   const allVerified = this.verifiedDocuments === this.totalDocuments;
//   if (allVerified && this.serviceStage === 'document-verification') {
//     this.serviceStage = 'payment-processing';
//     this.applicationDetails.applicationStatus.current = 'payment-pending';
//   }
  
//   return this.save();
// };

// visaServiceSchema.methods.scheduleAppointment = function(appointmentData) {
//   this.bookingDetails.appointment = {
//     ...this.bookingDetails.appointment,
//     ...appointmentData,
//     confirmed: true
//   };
//   this.bookingDetails.bookingStatus = 'confirmed';
//   this.serviceStage = 'booking-confirmed';
  
//   this.communications.push({
//     type: 'email',
//     direction: 'outgoing',
//     subject: 'Appointment Confirmed',
//     content: `Your visa consultation appointment is confirmed for ${appointmentData.date}`,
//     sentAt: new Date(),
//     sentBy: 'system',
//     recipients: [this.customer.contactInfo.email]
//   });
  
//   return this.save();
// };

// // ========== STATIC METHODS ==========
// visaServiceSchema.statics.findByStatus = function(status) {
//   return this.find({ 'applicationDetails.applicationStatus.current': status });
// };

// visaServiceSchema.statics.findByEmail = function(email) {
//   return this.find({ 'customer.contactInfo.email': email });
// };

// visaServiceSchema.statics.findUpcomingAppointments = function() {
//   return this.find({
//     'bookingDetails.appointment.date': { $gte: new Date() },
//     'bookingDetails.bookingStatus': { $in: ['pending', 'confirmed'] }
//   }).sort({ 'bookingDetails.appointment.date': 1 });
// };

// visaServiceSchema.statics.findPendingPayments = function() {
//   return this.find({
//     'applicationDetails.payment.status': { $in: ['pending', 'partial'] },
//     'serviceStage': { $gte: 'application-initiated' }
//   });
// };

// visaServiceSchema.statics.findOverdueApplications = function() {
//   return this.find({
//     'applicationDetails.payment.dueDate': { $lt: new Date() },
//     'applicationDetails.payment.status': { $in: ['pending', 'partial'] }
//   });
// };

// visaServiceSchema.statics.findByAgent = function(agentId) {
//   return this.find({ 'internal.assignedTo.agentId': agentId });
// };

// // ========== INDEXES ==========
// visaServiceSchema.index({ serviceId: 1 });
// visaServiceSchema.index({ trackingNumber: 1 });
// visaServiceSchema.index({ 'customer.contactInfo.email': 1 });
// visaServiceSchema.index({ 'customer.personalInfo.fullName': 1 });
// visaServiceSchema.index({ 'customer.passportInfo.passportNumber': 1 });
// visaServiceSchema.index({ serviceStage: 1 });
// visaServiceSchema.index({ 'applicationDetails.applicationStatus.current': 1 });
// visaServiceSchema.index({ 'applicationDetails.visaInfo.destinationCountry': 1 });
// visaServiceSchema.index({ 'applicationDetails.visaInfo.visaType': 1 });
// visaServiceSchema.index({ 'internal.assignedTo.agentId': 1 });
// visaServiceSchema.index({ createdAt: -1 });
// visaServiceSchema.index({ 
//   'bookingDetails.appointment.date': 1,
//   'bookingDetails.appointment.timeSlot': 1 
// });
// visaServiceSchema.index({ 
//   'applicationDetails.embassyInfo.applicationNumber': 1 
// }, { sparse: true });

// module.exports = mongoose.model('VisaService', visaServiceSchema);































// const mongoose = require('mongoose');

// const visaServiceSchema = new mongoose.Schema(
//   {
//     serviceId: {
//       type: String,
//       required: true,
//       unique: true,
//       index: true
//     },
//     trackingNumber: {
//       type: String,
//       unique: true,
//       index: true
//     },
//     serviceType: {
//       type: String,
//       enum: ['booking', 'application', 'combined'],
//       required: true,
//       default: 'booking'
//     },
//     serviceStage: {
//       type: String,
//       enum: [
//         'booking-pending',
//         'booking-confirmed',
//         'consultation-completed',
//         'application-initiated',
//         'application-submitted',
//         'document-verification',
//         'payment-processing',
//         'embassy-processing',
//         'visa-approved',
//         'visa-issued',
//         'completed',
//         'cancelled'
//       ],
//       default: 'booking-pending'
//     },
//     customer: {
//       personalInfo: {
//         fullName: { type: String, required: true, trim: true },
//         dateOfBirth: { type: Date, required: true },
//         gender: { type: String, enum: ['male', 'female', 'other', 'prefer-not-to-say'] },
//         nationality: { type: String, required: true },
//         countryOfResidence: { type: String, required: true },
//         maritalStatus: { type: String, enum: ['single', 'married', 'divorced', 'widowed', 'separated'] },
//         occupation: String,
//         employer: String
//       },
//       contactInfo: {
//         email: { type: String, required: true, lowercase: true },
//         primaryPhone: { type: String, required: true },
//         secondaryPhone: String,
//         whatsappNumber: String,
//         address: {
//           street: String,
//           city: String,
//           state: String,
//           country: String,
//           postalCode: String
//         },
//         emergencyContact: {
//           name: String,
//           relationship: String,
//           phone: String,
//           email: String
//         }
//       },
//       passportInfo: {
//         passportNumber: String,
//         issuingCountry: String,
//         issueDate: Date,
//         expiryDate: Date,
//         placeOfIssue: String,
//         hasPreviousVisas: { type: Boolean, default: false },
//         previousVisaDetails: [
//           {
//             country: { type: String },
//             type: { type: String },
//             issueDate: { type: Date },
//             expiryDate: { type: Date }
//           }
//         ]
//       }
//     },
//     bookingDetails: {
//       type: { type: String, enum: ['consultation', 'document-submission', 'appointment', 'online-help', 'walk-in'], default: 'consultation' },
//       serviceRequested: {
//         type: String,
//         enum: ['tourist-visa', 'business-visa', 'student-visa', 'work-visa', 'family-visa', 'transit-visa', 'visa-renewal', 'visa-extension', 'express-service', 'premium-service', 'general-consultation']
//       },
//       appointment: {
//         date: Date,
//         timeSlot: String,
//         duration: Number,
//         mode: { type: String, enum: ['in-person', 'online', 'phone'], default: 'in-person' },
//         location: String,
//         address: String,
//         confirmed: { type: Boolean, default: false },
//         attended: { type: Boolean, default: false },
//         notes: String
//       },
//       bookingStatus: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled', 'no-show', 'rescheduled'], default: 'pending' },
//       bookingAmount: { type: Number, default: 0 },
//       bookingPayment: {
//         status: { type: String, enum: ['pending', 'paid', 'refunded'], default: 'pending' },
//         method: String,
//         transactionId: String,
//         paidAt: Date
//       }
//     },
//     applicationDetails: {
//       visaInfo: {
//         destinationCountry: { type: String, required: true },
//         visaType: { type: String, enum: ['Tourist', 'Business', 'Student', 'Work', 'Transit', 'Family', 'Medical', 'Diplomatic'], required: true },
//         category: { type: String, enum: ['short-term', 'long-term', 'single-entry', 'multiple-entry', 'transit'], default: 'short-term' },
//         purposeOfTravel: { type: String, required: true },
//         travelDates: { intendedEntry: Date, intendedExit: Date, flexibleDates: { type: Boolean, default: false } },
//         durationOfStay: String,
//         entriesRequested: { type: String, enum: ['Single', 'Double', 'Multiple'], default: 'Single' },
//         travelCompanions: [{ name: String, relationship: String, age: Number }]
//       },
//       fees: {
//         consultationFee: { type: Number, default: 0 },
//         serviceFee: { type: Number, default: 0 },
//         embassyFee: { type: Number, default: 0 },
//         additionalFees: { type: Number, default: 0 },
//         discount: { type: Number, default: 0 },
//         totalAmount: { type: Number, default: 0 },
//         currency: { type: String, default: 'USD' }
//       },
//       payment: {
//         status: { type: String, enum: ['pending', 'partial', 'paid', 'overdue', 'refunded', 'cancelled'], default: 'pending' },
//         amountPaid: { type: Number, default: 0 },
//         paymentMethod: { type: String, enum: ['credit-card', 'debit-card', 'bank-transfer', 'cash', 'online-payment', 'installment'] },
//         dueDate: Date,
//         paymentHistory: [{ amount: Number, date: Date, method: String, transactionId: String, reference: String, notes: String }]
//       },
//       applicationStatus: {
//         current: { type: String, enum: ['not-started','draft','document-collection','document-review','application-filling','payment-pending','submitted-to-embassy','embassy-processing','interview-scheduled','decision-pending','additional-documents-requested','approved','rejected','visa-printed','ready-for-collection','collected','cancelled'], default: 'not-started' }
//       }
//     }
//   },
//   { timestamps: true }
// );

// // Pre-save hook to generate serviceId
// visaServiceSchema.pre('save', function(next) {
//   if (!this.serviceId) {
//     const timestamp = Date.now();
//     const random = Math.floor(Math.random() * 1000);
//     this.serviceId = `VS-${timestamp}-${random}`;
//   }
//   next();
// });

// module.exports = mongoose.model('VisaService', visaServiceSchema);

















// const mongoose = require('mongoose');

// const visaServiceSchema = new mongoose.Schema(
//   {
//     // Primary Identifiers
//     serviceId: {
//       type: String,
//       required: true,
//       unique: true,
//       index: true,
//       default: function() {
//         const timestamp = Date.now();
//         const random = Math.floor(Math.random() * 1000);
//         return `VS-${timestamp}-${random}`;
//       }
//     },
    
//     trackingNumber: {
//       type: String,
//       unique: true,
//       index: true,
//       sparse: true // Allows null for bookings
//     },
    
//     // Service Type & Stage
//     serviceType: {
//       type: String,
//       enum: ['booking', 'application', 'combined'],
//       required: true,
//       default: 'booking'
//     },
    
//     serviceStage: {
//       type: String,
//       enum: [
//         'booking-pending',
//         'booking-confirmed',
//         'consultation-completed',
//         'application-initiated',
//         'application-submitted',
//         'document-verification',
//         'payment-processing',
//         'embassy-processing',
//         'visa-approved',
//         'visa-issued',
//         'completed',
//         'cancelled'
//       ],
//       default: 'booking-pending'
//     },
    
//     // Customer Information
//     customer: {
//       personalInfo: {
//         fullName: {
//           type: String,
//           required: true,
//           trim: true
//         },
//         dateOfBirth: {
//           type: Date,
//           required: true
//         },
//         gender: {
//           type: String,
//           enum: ['male', 'female', 'other', 'prefer-not-to-say'],
//           default: 'prefer-not-to-say'
//         },
//         nationality: {
//           type: String,
//           required: true
//         },
//         countryOfResidence: {
//           type: String,
//           required: true
//         },
//         maritalStatus: {
//           type: String,
//           enum: ['single', 'married', 'divorced', 'widowed', 'separated'],
//           default: 'single'
//         },
//         occupation: String,
//         employer: String
//       },
      
//       contactInfo: {
//         email: {
//           type: String,
//           required: true,
//           lowercase: true,
//           match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
//         },
//         primaryPhone: {
//           type: String,
//           required: true
//         },
//         secondaryPhone: String,
//         whatsappNumber: String,
//         address: {
//           street: String,
//           city: String,
//           state: String,
//           country: String,
//           postalCode: String
//         },
//         emergencyContact: {
//           name: String,
//           relationship: String,
//           phone: String,
//           email: String
//         }
//       },
      
//       passportInfo: {
//         passportNumber: String,
//         issuingCountry: String,
//         issueDate: Date,
//         expiryDate: Date,
//         placeOfIssue: String,
//         hasPreviousVisas: {
//           type: Boolean,
//           default: false
//         },
//         previousVisaDetails: [{
//           country: String,
//           type: String,
//           issueDate: Date,
//           expiryDate: Date
//         }]
//       }
//     },
    
//     // Booking Details
//     bookingDetails: {
//       type: {
//         type: String,
//         enum: ['consultation', 'document-submission', 'appointment', 'online-help', 'walk-in'],
//         default: 'consultation'
//       },
//       serviceRequested: {
//         type: String,
//         enum: [
//           'tourist-visa',
//           'business-visa',
//           'student-visa',
//           'work-visa',
//           'family-visa',
//           'transit-visa',
//           'visa-renewal',
//           'visa-extension',
//           'express-service',
//           'premium-service',
//           'general-consultation'
//         ]
//       },
//       appointment: {
//         date: Date,
//         timeSlot: String,
//         duration: {
//           type: Number,
//           default: 60
//         },
//         mode: {
//           type: String,
//           enum: ['in-person', 'online', 'phone'],
//           default: 'in-person'
//         },
//         location: String,
//         address: String,
//         confirmed: {
//           type: Boolean,
//           default: false
//         },
//         attended: {
//           type: Boolean,
//           default: false
//         },
//         notes: String
//       },
//       bookingStatus: {
//         type: String,
//         enum: ['pending', 'confirmed', 'completed', 'cancelled', 'no-show', 'rescheduled'],
//         default: 'pending'
//       },
//       bookingAmount: {
//         type: Number,
//         default: 0,
//         min: 0
//       },
//       bookingPayment: {
//         status: {
//           type: String,
//           enum: ['pending', 'paid', 'refunded'],
//           default: 'pending'
//         },
//         method: String,
//         transactionId: String,
//         paidAt: Date
//       }
//     },
    
//     // Application Details - Conditionally Required
//     applicationDetails: {
//       visaInfo: {
//         destinationCountry: {
//           type: String,
//           required: function() {
//             return this.serviceType !== 'booking';
//           }
//         },
//         visaType: {
//           type: String,
//           enum: ['Tourist', 'Business', 'Student', 'Work', 'Transit', 'Family', 'Medical', 'Diplomatic'],
//           required: function() {
//             return this.serviceType !== 'booking';
//           }
//         },
//         category: {
//           type: String,
//           enum: ['short-term', 'long-term', 'single-entry', 'multiple-entry', 'transit'],
//           default: 'short-term'
//         },
//         purposeOfTravel: {
//           type: String,
//           required: function() {
//             return this.serviceType !== 'booking';
//           }
//         },
//         travelDates: {
//           intendedEntry: Date,
//           intendedExit: Date,
//           flexibleDates: {
//             type: Boolean,
//             default: false
//           }
//         },
//         durationOfStay: String,
//         entriesRequested: {
//           type: String,
//           enum: ['Single', 'Double', 'Multiple'],
//           default: 'Single'
//         },
//         travelCompanions: [{
//           name: String,
//           relationship: String,
//           age: Number
//         }]
//       },
      
//       // Service Package
//       servicePackage: {
//         name: {
//           type: String,
//           enum: ['basic', 'standard', 'express', 'premium', 'custom'],
//           default: 'standard'
//         },
//         description: String,
//         processingTime: {
//           type: String,
//           default: '15-20 business days'
//         },
//         inclusions: [String],
//         exclusions: [String]
//       },
      
//       // Fees
//       fees: {
//         consultationFee: {
//           type: Number,
//           default: 0,
//           min: 0
//         },
//         serviceFee: {
//           type: Number,
//           default: 0,
//           min: 0
//         },
//         embassyFee: {
//           type: Number,
//           default: 0,
//           min: 0
//         },
//         additionalFees: {
//           type: Number,
//           default: 0,
//           min: 0
//         },
//         discount: {
//           type: Number,
//           default: 0,
//           min: 0
//         },
//         totalAmount: {
//           type: Number,
//           default: 0,
//           min: 0
//         },
//         currency: {
//           type: String,
//           default: 'USD'
//         }
//       },
      
//       // Payment Information
//       payment: {
//         status: {
//           type: String,
//           enum: ['pending', 'partial', 'paid', 'overdue', 'refunded', 'cancelled'],
//           default: 'pending'
//         },
//         amountPaid: {
//           type: Number,
//           default: 0,
//           min: 0
//         },
//         paymentMethod: {
//           type: String,
//           enum: ['credit-card', 'debit-card', 'bank-transfer', 'cash', 'online-payment', 'installment']
//         },
//         dueDate: Date,
//         paymentHistory: [{
//           amount: Number,
//           date: Date,
//           method: String,
//           transactionId: String,
//           reference: String,
//           notes: String
//         }]
//       },
      
//       // Application Status
//       applicationStatus: {
//         current: {
//           type: String,
//           enum: [
//             'not-started',
//             'draft',
//             'document-collection',
//             'document-review',
//             'application-filling',
//             'payment-pending',
//             'submitted-to-embassy',
//             'embassy-processing',
//             'interview-scheduled',
//             'decision-pending',
//             'additional-documents-requested',
//             'approved',
//             'rejected',
//             'visa-printed',
//             'ready-for-collection',
//             'collected',
//             'cancelled'
//           ],
//           default: 'not-started'
//         },
//         submittedAt: Date,
//         processingStartedAt: Date,
//         expectedCompletionDate: Date,
//         actualCompletionDate: Date,
//         embassySubmissionDate: Date,
//         decisionDate: Date,
//         collectionDate: Date
//       },
      
//       // Embassy/Consulate Details
//       embassyInfo: {
//         embassyName: String,
//         location: String,
//         applicationNumber: String,
//         referenceNumber: String,
//         trackingNumber: String,
//         submissionMethod: {
//           type: String,
//           enum: ['in-person', 'courier', 'online', 'agent']
//         },
//         submissionDate: Date,
//         appointmentDate: Date,
//         interviewDate: Date,
//         collectionMethod: {
//           type: String,
//           enum: ['in-person', 'courier', 'representative']
//         },
//         collectionDate: Date,
//         trackingUrl: String
//       },
      
//       // Visa Issuance Details
//       visaIssuance: {
//         visaNumber: String,
//         issueDate: Date,
//         expiryDate: Date,
//         validityStart: Date,
//         validityEnd: Date,
//         durationOfStay: String,
//         entriesAllowed: String,
//         remarks: String,
//         issuedAt: String,
//         issuingOfficer: String,
//         visaStickerNumber: String
//       }
//     },
    
//     // Documents & Files
//     documents: {
//       photograph: {
//         cloudinaryUrl: String,
//         publicId: String,
//         uploadedAt: Date,
//         meetsRequirements: {
//           type: Boolean,
//           default: false
//         },
//         verifiedBy: String,
//         verifiedAt: Date
//       },
//       passportCopy: {
//         cloudinaryUrl: String,
//         publicId: String,
//         uploadedAt: Date,
//         verified: {
//           type: Boolean,
//           default: false
//         }
//       },
//       financialDocuments: [{
//         documentType: {
//           type: String,
//           enum: ['bank-statement', 'salary-slip', 'tax-return', 'sponsor-letter', 'proof-of-funds']
//         },
//         cloudinaryUrl: String,
//         publicId: String,
//         originalName: String,
//         uploadedAt: Date,
//         verified: {
//           type: Boolean,
//           default: false
//         }
//       }],
//       travelDocuments: [{
//         documentType: {
//           type: String,
//           enum: ['flight-ticket', 'hotel-booking', 'travel-insurance', 'itinerary']
//         },
//         cloudinaryUrl: String,
//         publicId: String,
//         originalName: String,
//         uploadedAt: Date,
//         verified: {
//           type: Boolean,
//           default: false
//         }
//       }],
//       supportingDocuments: [{
//         documentType: {
//           type: String,
//           enum: ['invitation-letter', 'employment-letter', 'enrollment-letter', 'business-registration', 'marriage-certificate', 'birth-certificate', 'police-clearance', 'medical-certificate']
//         },
//         cloudinaryUrl: String,
//         publicId: String,
//         originalName: String,
//         uploadedAt: Date,
//         verified: {
//           type: Boolean,
//           default: false
//         }
//       }],
//       otherDocuments: [{
//         description: String,
//         cloudinaryUrl: String,
//         publicId: String,
//         originalName: String,
//         uploadedAt: Date,
//         verified: {
//           type: Boolean,
//           default: false
//         }
//       }],
//       generatedDocuments: [{
//         documentType: {
//           type: String,
//           enum: ['application-form', 'cover-letter', 'checklist', 'invoice', 'receipt']
//         },
//         cloudinaryUrl: String,
//         publicId: String,
//         generatedAt: Date,
//         generatedBy: String
//       }]
//     },
    
//     // Internal Management
//     internal: {
//       assignedTo: {
//         agentId: mongoose.Schema.Types.ObjectId,
//         agentName: String,
//         agentEmail: String,
//         department: {
//           type: String,
//           enum: ['sales', 'consultation', 'processing', 'verification', 'customer-service']
//         },
//         assignedAt: {
//           type: Date,
//           default: Date.now
//         },
//         lastContacted: Date
//       },
//       priority: {
//         type: String,
//         enum: ['low', 'normal', 'high', 'urgent'],
//         default: 'normal'
//       },
//       source: {
//         type: String,
//         enum: ['website', 'walk-in', 'referral', 'partner', 'social-media', 'repeat-customer'],
//         default: 'website'
//       },
//       tags: [String],
//       notes: [{
//         note: String,
//         addedBy: String,
//         addedAt: {
//           type: Date,
//           default: Date.now
//         },
//         category: {
//           type: String,
//           enum: ['general', 'document', 'payment', 'status', 'customer', 'internal']
//         },
//         priority: {
//           type: String,
//           enum: ['low', 'medium', 'high']
//         }
//       }],
//       followUp: {
//         required: {
//           type: Boolean,
//           default: false
//         },
//         scheduledDate: Date,
//         completed: {
//           type: Boolean,
//           default: false
//         },
//         completedAt: Date,
//         notes: String
//       }
//     },
    
//     // Communication Log
//     communications: [{
//       type: {
//         type: String,
//         enum: ['email', 'sms', 'phone-call', 'whatsapp', 'in-person', 'chat']
//       },
//       direction: {
//         type: String,
//         enum: ['incoming', 'outgoing']
//       },
//       subject: String,
//       content: String,
//       sentAt: {
//         type: Date,
//         default: Date.now
//       },
//       sentBy: String,
//       recipients: [String],
//       attachments: [{
//         name: String,
//         url: String
//       }],
//       status: {
//         type: String,
//         enum: ['sent', 'delivered', 'read', 'failed'],
//         default: 'sent'
//       }
//     }],
    
//     // Status History
//     statusHistory: [{
//       stage: String,
//       status: String,
//       changedAt: {
//         type: Date,
//         default: Date.now
//       },
//       changedBy: String,
//       remarks: String,
//       metadata: mongoose.Schema.Types.Mixed
//     }],
    
//     // Audit Log
//     auditLog: [{
//       action: String,
//       performedBy: String,
//       performedAt: {
//         type: Date,
//         default: Date.now
//       },
//       details: mongoose.Schema.Types.Mixed,
//       ipAddress: String,
//       userAgent: String
//     }]
//   },
//   {
//     timestamps: true,
//     // Enable virtuals in JSON output
//     toJSON: { virtuals: true },
//     toObject: { virtuals: true }
//   }
// );

// // ========== VIRTUAL PROPERTIES ==========

// visaServiceSchema.virtual('totalDocuments').get(function() {
//   let count = 0;
//   if (this.documents?.photograph?.cloudinaryUrl) count++;
//   if (this.documents?.passportCopy?.cloudinaryUrl) count++;
//   count += this.documents?.financialDocuments?.length || 0;
//   count += this.documents?.travelDocuments?.length || 0;
//   count += this.documents?.supportingDocuments?.length || 0;
//   count += this.documents?.otherDocuments?.length || 0;
//   return count;
// });

// visaServiceSchema.virtual('verifiedDocuments').get(function() {
//   let count = 0;
//   if (this.documents?.photograph?.verified) count++;
//   if (this.documents?.passportCopy?.verified) count++;
  
//   const countVerified = (docs) => docs?.filter(doc => doc.verified).length || 0;
//   count += countVerified(this.documents?.financialDocuments);
//   count += countVerified(this.documents?.travelDocuments);
//   count += countVerified(this.documents?.supportingDocuments);
//   count += countVerified(this.documents?.otherDocuments);
  
//   return count;
// });

// visaServiceSchema.virtual('balanceDue').get(function() {
//   const total = this.applicationDetails?.fees?.totalAmount || 0;
//   const paid = this.applicationDetails?.payment?.amountPaid || 0;
//   return Math.max(0, total - paid);
// });

// visaServiceSchema.virtual('isOverdue').get(function() {
//   if (!this.applicationDetails?.payment?.dueDate) return false;
//   const dueDate = new Date(this.applicationDetails.payment.dueDate);
//   const today = new Date();
//   return today > dueDate && this.balanceDue > 0;
// });

// visaServiceSchema.virtual('nextActionRequired').get(function() {
//   const stage = this.serviceStage;
//   const status = this.applicationDetails?.applicationStatus?.current;
  
//   if (stage === 'booking-pending') return 'Confirm appointment';
//   if (stage === 'booking-confirmed') return 'Attend consultation';
//   if (stage === 'consultation-completed') return 'Submit documents';
//   if (status === 'document-collection') return 'Upload required documents';
//   if (status === 'payment-pending') return 'Make payment';
//   if (status === 'interview-scheduled') return 'Attend interview';
//   if (status === 'ready-for-collection') return 'Collect visa';
  
//   return 'No action required';
// });

// visaServiceSchema.virtual('isBooking').get(function() {
//   return this.serviceType === 'booking';
// });

// visaServiceSchema.virtual('isApplication').get(function() {
//   return this.serviceType === 'application' || this.serviceType === 'combined';
// });

// visaServiceSchema.virtual('hasBooking').get(function() {
//   return this.serviceType === 'booking' || this.serviceType === 'combined';
// });

// visaServiceSchema.virtual('hasApplication').get(function() {
//   return this.serviceType === 'application' || this.serviceType === 'combined';
// });

// // ========== PRE-SAVE HOOKS ==========

// visaServiceSchema.pre('save', function(next) {
//   try {
//     // Generate tracking number for applications
//     if ((this.serviceType === 'application' || this.serviceType === 'combined') && !this.trackingNumber) {
//       const date = new Date();
//       const dateStr = date.toISOString().slice(2, 10).replace(/-/g, '');
//       const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
//       this.trackingNumber = `TRK${dateStr}${random}`;
//     }
    
//     // Calculate total fees
//     if (this.applicationDetails?.fees && this.isModified('applicationDetails.fees')) {
//       const fees = this.applicationDetails.fees;
//       const consultation = fees.consultationFee || 0;
//       const service = fees.serviceFee || 0;
//       const embassy = fees.embassyFee || 0;
//       const additional = fees.additionalFees || 0;
//       const discount = fees.discount || 0;
      
//       fees.totalAmount = consultation + service + embassy + additional - discount;
//     }
    
//     // Update payment status based on amount paid
//     if (this.applicationDetails?.payment && this.isModified('applicationDetails.payment.amountPaid')) {
//       const payment = this.applicationDetails.payment;
//       const total = this.applicationDetails?.fees?.totalAmount || 0;
      
//       if (payment.amountPaid >= total) {
//         payment.status = 'paid';
//       } else if (payment.amountPaid > 0) {
//         payment.status = 'partial';
//       } else {
//         payment.status = 'pending';
//       }
//     }
    
//     // Record status changes in history
//     if (this.isModified('serviceStage') || this.isModified('applicationDetails.applicationStatus.current')) {
//       if (!this.statusHistory) {
//         this.statusHistory = [];
//       }
      
//       this.statusHistory.push({
//         stage: this.serviceStage,
//         status: this.applicationDetails?.applicationStatus?.current || 'N/A',
//         changedAt: new Date(),
//         changedBy: 'system',
//         remarks: 'Status updated automatically',
//         metadata: {
//           previousStage: this._original?.serviceStage,
//           previousStatus: this._original?.applicationDetails?.applicationStatus?.current
//         }
//       });
//     }
    
//     // Initialize applicationDetails if not present for bookings
//     if (this.serviceType === 'booking' && !this.applicationDetails) {
//       this.applicationDetails = {
//         visaInfo: {
//           destinationCountry: 'Not Applicable',
//           visaType: 'Tourist',
//           purposeOfTravel: 'Not Applicable'
//         },
//         applicationStatus: {
//           current: 'not-started'
//         },
//         fees: {
//           totalAmount: 0,
//           currency: 'USD'
//         },
//         payment: {
//           status: 'pending',
//           amountPaid: 0
//         }
//       };
//     }
    
//     // Set default values for appointment if not set
//     if (this.bookingDetails?.appointment && !this.bookingDetails.appointment.duration) {
//       this.bookingDetails.appointment.duration = 60;
//     }
    
//     // Safely call next() if it's a function
//     if (typeof next === 'function') {
//       next();
//     } else {
//       // If next is not a function, just return
//       return Promise.resolve();
//     }
//   } catch (error) {
//     // If there's an error and next is a function, pass it
//     if (typeof next === 'function') {
//       next(error);
//     } else {
//       // Otherwise, reject the promise
//       return Promise.reject(error);
//     }
//   }
// });

// visaServiceSchema.pre('validate', function(next) {
//   try {
//     // If it's a booking, ensure application details have default values
//     if (this.serviceType === 'booking') {
//       if (!this.applicationDetails) {
//         this.applicationDetails = {};
//       }
//       if (!this.applicationDetails.visaInfo) {
//         this.applicationDetails.visaInfo = {};
//       }
//       if (!this.applicationDetails.applicationStatus) {
//         this.applicationDetails.applicationStatus = {};
//       }
//       if (!this.applicationDetails.fees) {
//         this.applicationDetails.fees = {};
//       }
//       if (!this.applicationDetails.payment) {
//         this.applicationDetails.payment = {};
//       }
      
//       // Set dummy values to pass validation
//       this.applicationDetails.visaInfo.destinationCountry = this.applicationDetails.visaInfo.destinationCountry || 'Not Applicable';
//       this.applicationDetails.visaInfo.visaType = this.applicationDetails.visaInfo.visaType || 'Tourist';
//       this.applicationDetails.visaInfo.purposeOfTravel = this.applicationDetails.visaInfo.purposeOfTravel || 'Not Applicable';
//       this.applicationDetails.applicationStatus.current = this.applicationDetails.applicationStatus.current || 'not-started';
//       this.applicationDetails.fees.totalAmount = this.applicationDetails.fees.totalAmount || 0;
//       this.applicationDetails.fees.currency = this.applicationDetails.fees.currency || 'USD';
//       this.applicationDetails.payment.status = this.applicationDetails.payment.status || 'pending';
//       this.applicationDetails.payment.amountPaid = this.applicationDetails.payment.amountPaid || 0;
//     }
    
//     // Safely call next() if it's a function
//     if (typeof next === 'function') {
//       next();
//     } else {
//       // If next is not a function, just return
//       return Promise.resolve();
//     }
//   } catch (error) {
//     // If there's an error and next is a function, pass it
//     if (typeof next === 'function') {
//       next(error);
//     } else {
//       // Otherwise, reject the promise
//       return Promise.reject(error);
//     }
//   }
// });

// // ========== INSTANCE METHODS ==========

// visaServiceSchema.methods.convertToApplication = function(applicationData = {}) {
//   this.serviceType = 'combined';
//   this.serviceStage = 'application-initiated';
//   this.applicationDetails.applicationStatus.current = 'document-collection';
  
//   // Merge provided application data
//   if (applicationData.visaInfo) {
//     this.applicationDetails.visaInfo = { ...this.applicationDetails.visaInfo, ...applicationData.visaInfo };
//   }
  
//   if (applicationData.servicePackage) {
//     this.applicationDetails.servicePackage = applicationData.servicePackage;
//   }
  
//   if (applicationData.fees) {
//     this.applicationDetails.fees = { ...this.applicationDetails.fees, ...applicationData.fees };
//   }
  
//   // Copy booking fee to application fees if applicable
//   if (this.bookingDetails.bookingAmount > 0) {
//     this.applicationDetails.fees.consultationFee = this.bookingDetails.bookingAmount;
//     this.applicationDetails.payment.amountPaid = this.bookingDetails.bookingAmount;
//   }
  
//   // Generate tracking number if not present
//   if (!this.trackingNumber) {
//     const date = new Date();
//     const dateStr = date.toISOString().slice(2, 10).replace(/-/g, '');
//     const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
//     this.trackingNumber = `TRK${dateStr}${random}`;
//   }
  
//   return this;
// };

// visaServiceSchema.methods.updatePayment = function(amount, method, transactionId, notes = '') {
//   if (!this.applicationDetails.payment.paymentHistory) {
//     this.applicationDetails.payment.paymentHistory = [];
//   }
  
//   const paymentRecord = {
//     amount: amount,
//     date: new Date(),
//     method: method,
//     transactionId: transactionId,
//     reference: `PAY-${Date.now()}`,
//     notes: notes
//   };
  
//   this.applicationDetails.payment.paymentHistory.push(paymentRecord);
//   this.applicationDetails.payment.amountPaid = (this.applicationDetails.payment.amountPaid || 0) + amount;
//   this.applicationDetails.payment.paymentMethod = method;
  
//   // Update payment status
//   const total = this.applicationDetails.fees?.totalAmount || 0;
//   if (this.applicationDetails.payment.amountPaid >= total) {
//     this.applicationDetails.payment.status = 'paid';
//   } else if (this.applicationDetails.payment.amountPaid > 0) {
//     this.applicationDetails.payment.status = 'partial';
//   }
  
//   // Record in audit log
//   if (!this.auditLog) {
//     this.auditLog = [];
//   }
  
//   this.auditLog.push({
//     action: 'payment_received',
//     performedBy: 'system',
//     details: paymentRecord,
//     ipAddress: 'system',
//     userAgent: 'system'
//   });
  
//   return this;
// };

// visaServiceSchema.methods.addDocument = function(category, documentData) {
//   if (!this.documents) {
//     this.documents = {};
//   }
  
//   switch(category.toLowerCase()) {
//     case 'photograph':
//       this.documents.photograph = {
//         ...this.documents.photograph,
//         ...documentData,
//         uploadedAt: new Date()
//       };
//       break;
//     case 'passport':
//     case 'passportcopy':
//       this.documents.passportCopy = {
//         ...this.documents.passportCopy,
//         ...documentData,
//         uploadedAt: new Date()
//       };
//       break;
//     case 'financial':
//       if (!this.documents.financialDocuments) {
//         this.documents.financialDocuments = [];
//       }
//       this.documents.financialDocuments.push({
//         ...documentData,
//         uploadedAt: new Date()
//       });
//       break;
//     case 'travel':
//       if (!this.documents.travelDocuments) {
//         this.documents.travelDocuments = [];
//       }
//       this.documents.travelDocuments.push({
//         ...documentData,
//         uploadedAt: new Date()
//       });
//       break;
//     case 'supporting':
//       if (!this.documents.supportingDocuments) {
//         this.documents.supportingDocuments = [];
//       }
//       this.documents.supportingDocuments.push({
//         ...documentData,
//         uploadedAt: new Date()
//       });
//       break;
//     default:
//       if (!this.documents.otherDocuments) {
//         this.documents.otherDocuments = [];
//       }
//       this.documents.otherDocuments.push({
//         description: category,
//         ...documentData,
//         uploadedAt: new Date()
//       });
//   }
  
//   // Update status if this is first document
//   if (this.serviceStage === 'application-initiated' && this.totalDocuments > 0) {
//     this.serviceStage = 'document-verification';
//     this.applicationDetails.applicationStatus.current = 'document-collection';
//   }
  
//   return this;
// };

// visaServiceSchema.methods.verifyDocument = function(documentPath, verifiedBy, remarks = '') {
//   // Simple verification - in real implementation, you'd search through arrays
//   if (documentPath === 'photograph') {
//     if (this.documents?.photograph) {
//       this.documents.photograph.verified = true;
//       this.documents.photograph.verifiedBy = verifiedBy;
//       this.documents.photograph.verifiedAt = new Date();
      
//       // Add note
//       if (!this.internal.notes) {
//         this.internal.notes = [];
//       }
//       this.internal.notes.push({
//         note: `Photograph verified by ${verifiedBy}. ${remarks}`,
//         addedBy: verifiedBy,
//         category: 'document',
//         priority: 'medium'
//       });
//     }
//   }
  
//   // Check if all required documents are verified
//   if (this.serviceStage === 'document-verification' && this.verifiedDocuments >= 3) {
//     this.serviceStage = 'payment-processing';
//     this.applicationDetails.applicationStatus.current = 'payment-pending';
//   }
  
//   return this;
// };

// visaServiceSchema.methods.scheduleAppointment = function(appointmentData) {
//   this.bookingDetails.appointment = {
//     ...this.bookingDetails.appointment,
//     ...appointmentData
//   };
  
//   if (appointmentData.confirmed !== false) {
//     this.bookingDetails.appointment.confirmed = true;
//     this.bookingDetails.bookingStatus = 'confirmed';
//     this.serviceStage = 'booking-confirmed';
//   }
  
//   // Add communication record
//   if (!this.communications) {
//     this.communications = [];
//   }
  
//   this.communications.push({
//     type: 'email',
//     direction: 'outgoing',
//     subject: 'Appointment Confirmed',
//     content: `Your visa consultation appointment is confirmed for ${appointmentData.date}`,
//     sentAt: new Date(),
//     sentBy: 'system',
//     recipients: [this.customer.contactInfo.email],
//     status: 'sent'
//   });
  
//   return this;
// };

// visaServiceSchema.methods.addNote = function(note, addedBy, category = 'general', priority = 'medium') {
//   if (!this.internal.notes) {
//     this.internal.notes = [];
//   }
  
//   this.internal.notes.push({
//     note: note,
//     addedBy: addedBy,
//     addedAt: new Date(),
//     category: category,
//     priority: priority
//   });
  
//   return this;
// };

// // ========== STATIC METHODS ==========

// visaServiceSchema.statics.findByStatus = function(status) {
//   return this.find({ 'applicationDetails.applicationStatus.current': status });
// };

// visaServiceSchema.statics.findByEmail = function(email) {
//   return this.find({ 'customer.contactInfo.email': email.toLowerCase() });
// };

// visaServiceSchema.statics.findUpcomingAppointments = function() {
//   return this.find({
//     'bookingDetails.appointment.date': { $gte: new Date() },
//     'bookingDetails.bookingStatus': { $in: ['pending', 'confirmed'] }
//   }).sort({ 'bookingDetails.appointment.date': 1 });
// };

// visaServiceSchema.statics.findPendingPayments = function() {
//   return this.find({
//     'applicationDetails.payment.status': { $in: ['pending', 'partial'] },
//     'serviceType': { $in: ['application', 'combined'] }
//   });
// };

// visaServiceSchema.statics.findOverdueApplications = function() {
//   const now = new Date();
//   return this.find({
//     'applicationDetails.payment.dueDate': { $lt: now },
//     'applicationDetails.payment.status': { $in: ['pending', 'partial'] },
//     'serviceType': { $in: ['application', 'combined'] }
//   });
// };

// visaServiceSchema.statics.findByAgent = function(agentId) {
//   return this.find({ 'internal.assignedTo.agentId': agentId });
// };

// visaServiceSchema.statics.findBookings = function() {
//   return this.find({ serviceType: 'booking' });
// };

// visaServiceSchema.statics.findApplications = function() {
//   return this.find({ serviceType: { $in: ['application', 'combined'] } });
// };

// // ========== INDEXES ==========

// visaServiceSchema.index({ serviceId: 1 });
// visaServiceSchema.index({ trackingNumber: 1 });
// visaServiceSchema.index({ 'customer.contactInfo.email': 1 });
// visaServiceSchema.index({ 'customer.personalInfo.fullName': 1 });
// visaServiceSchema.index({ 'customer.passportInfo.passportNumber': 1 });
// visaServiceSchema.index({ serviceStage: 1 });
// visaServiceSchema.index({ serviceType: 1 });
// visaServiceSchema.index({ 'applicationDetails.applicationStatus.current': 1 });
// visaServiceSchema.index({ 'applicationDetails.visaInfo.destinationCountry': 1 });
// visaServiceSchema.index({ 'applicationDetails.visaInfo.visaType': 1 });
// visaServiceSchema.index({ 'internal.assignedTo.agentId': 1 });
// visaServiceSchema.index({ createdAt: -1 });
// visaServiceSchema.index({ 
//   'bookingDetails.appointment.date': 1,
//   'bookingDetails.appointment.timeSlot': 1 
// });
// visaServiceSchema.index({ 
//   'applicationDetails.embassyInfo.applicationNumber': 1 
// }, { sparse: true });

// module.exports = mongoose.model('VisaService', visaServiceSchema);




















// const mongoose = require('mongoose');
// const cloudinary = require('cloudinary').v2;

// // ========== SCHEMA ==========
// const visaServiceSchema = new mongoose.Schema(
//   {
//     // ========================
//     // PRIMARY IDENTIFIERS
//     // ========================
//     serviceId: {
//       type: String,
//       required: true,
//       unique: true,
//       index: true,
//       default: function() {
//         const timestamp = Date.now();
//         const random = Math.floor(Math.random() * 1000);
//         return `VS-${timestamp}-${random}`;
//       }
//     },
//     trackingNumber: {
//       type: String,
//       unique: true,
//       sparse: true // Allows null for bookings
//     },

//     // ========================
//     // SERVICE TYPE & STAGE
//     // ========================
//     serviceType: {
//       type: String,
//       enum: ['booking', 'application', 'combined'],
//       required: true,
//       default: 'booking'
//     },
//     serviceStage: {
//       type: String,
//       enum: [
//         'booking-pending',
//         'booking-confirmed',
//         'consultation-completed',
//         'application-initiated',
//         'application-submitted',
//         'document-verification',
//         'payment-processing',
//         'embassy-processing',
//         'visa-approved',
//         'visa-issued',
//         'completed',
//         'cancelled'
//       ],
//       default: 'booking-pending'
//     },

//     // ========================
//     // CUSTOMER INFO
//     // ========================
//     customer: {
//       personalInfo: {
//         fullName: { type: String, required: true, trim: true },
//         dateOfBirth: { type: Date, required: true },
//         gender: { type: String, enum: ['male', 'female', 'other', 'prefer-not-to-say'], default: 'prefer-not-to-say' },
//         nationality: { type: String, required: true },
//         countryOfResidence: { type: String, required: true },
//         maritalStatus: { type: String, enum: ['single','married','divorced','widowed','separated'], default: 'single' },
//         occupation: String,
//         employer: String
//       },
//       contactInfo: {
//         email: { type: String, required: true, lowercase: true, match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Enter a valid email'] },
//         primaryPhone: { type: String, required: true },
//         secondaryPhone: String,
//         whatsappNumber: String,
//         address: {
//           street: String,
//           city: String,
//           state: String,
//           country: String,
//           postalCode: String
//         },
//         emergencyContact: {
//           name: String,
//           relationship: String,
//           phone: String,
//           email: String
//         }
//       },
//       passportInfo: {
//         passportNumber: String,
//         issuingCountry: String,
//         issueDate: Date,
//         expiryDate: Date,
//         placeOfIssue: String,
//         hasPreviousVisas: { type: Boolean, default: false },
//         previousVisaDetails: [{
//           country: String,
//           type: String,
//           issueDate: Date,
//           expiryDate: Date
//         }]
//       }
//     },

//     // ========================
//     // BOOKING DETAILS
//     // ========================
//     bookingDetails: {
//       type: { type: String, enum: ['consultation','document-submission','appointment','online-help','walk-in'], default: 'consultation' },
//       serviceRequested: {
//         type: String,
//         enum: ['tourist-visa','business-visa','student-visa','work-visa','family-visa','transit-visa','visa-renewal','visa-extension','express-service','premium-service','general-consultation']
//       },
//       appointment: {
//         date: Date,
//         timeSlot: String,
//         duration: { type: Number, default: 60 },
//         mode: { type: String, enum: ['in-person','online','phone'], default: 'in-person' },
//         location: String,
//         address: String,
//         confirmed: { type: Boolean, default: false },
//         attended: { type: Boolean, default: false },
//         notes: String
//       },
//       bookingStatus: { type: String, enum: ['pending','confirmed','completed','cancelled','no-show','rescheduled'], default: 'pending' },
//       bookingAmount: { type: Number, default: 0, min: 0 },
//       bookingPayment: {
//         status: { type: String, enum: ['pending','paid','refunded'], default: 'pending' },
//         method: String,
//         transactionId: String,
//         paidAt: Date
//       }
//     },

//     // ========================
//     // APPLICATION DETAILS
//     // ========================
//     applicationDetails: {
//       visaInfo: {
//         destinationCountry: { type: String },
//         appliedCountries: { type: [String], default: [] }, // countries we applied for
//         visaType: { type: String, enum: ['Tourist','Business','Student','Work','Transit','Family','Medical','Diplomatic'] },
//         category: { type: String, enum: ['short-term','long-term','single-entry','multiple-entry','transit'], default: 'short-term' },
//         purposeOfTravel: String,
//         travelDates: {
//           intendedEntry: Date,
//           intendedExit: Date,
//           flexibleDates: { type: Boolean, default: false }
//         },
//         entriesRequested: { type: String, enum: ['Single','Double','Multiple'], default: 'Single' },
//         travelCompanions: [{ name: String, relationship: String, age: Number }]
//       },
//       servicePackage: {
//         name: { type: String, enum: ['basic','standard','express','premium','custom'], default: 'standard' },
//         description: String,
//         processingTime: { type: String, default: '15-20 business days' },
//         inclusions: [String],
//         exclusions: [String]
//       },
//       fees: {
//         consultationFee: { type: Number, default: 0, min: 0 },
//         serviceFee: { type: Number, default: 0, min: 0 },
//         embassyFee: { type: Number, default: 0, min: 0 },
//         additionalFees: { type: Number, default: 0, min: 0 },
//         discount: { type: Number, default: 0, min: 0 },
//         totalAmount: { type: Number, default: 0, min: 0 },
//         currency: { type: String, default: 'USD' }
//       },
//       payment: {
//         status: { type: String, enum: ['pending','partial','paid','overdue','refunded','cancelled'], default: 'pending' },
//         amountPaid: { type: Number, default: 0, min: 0 },
//         paymentMethod: { type: String, enum: ['credit-card','debit-card','bank-transfer','cash','online-payment','installment'] },
//         dueDate: Date,
//         paymentHistory: [{
//           amount: Number,
//           date: Date,
//           method: String,
//           transactionId: String,
//           reference: String,
//           notes: String
//         }]
//       },
//       applicationStatus: {
//         current: {
//           type: String,
//           enum: ['not-started','draft','document-collection','document-review','application-filling','payment-pending','submitted-to-embassy','embassy-processing','interview-scheduled','decision-pending','additional-documents-requested','approved','rejected','visa-printed','ready-for-collection','collected','cancelled'],
//           default: 'not-started'
//         },
//         submittedAt: Date,
//         processingStartedAt: Date,
//         expectedCompletionDate: Date,
//         actualCompletionDate: Date,
//         embassySubmissionDate: Date,
//         decisionDate: Date,
//         collectionDate: Date
//       },
//       embassyInfo: {
//         embassyName: String,
//         location: String,
//         applicationNumber: String,
//         referenceNumber: String,
//         trackingNumber: String,
//         submissionMethod: { type: String, enum: ['in-person','courier','online','agent'] },
//         submissionDate: Date,
//         appointmentDate: Date,
//         interviewDate: Date,
//         collectionMethod: { type: String, enum: ['in-person','courier','representative'] },
//         collectionDate: Date,
//         trackingUrl: String
//       },
//       visaIssuance: {
//         visaNumber: String,
//         issueDate: Date,
//         expiryDate: Date,
//         validityStart: Date,
//         validityEnd: Date,
//         durationOfStay: String,
//         entriesAllowed: String,
//         remarks: String,
//         issuedAt: String,
//         issuingOfficer: String,
//         visaStickerNumber: String
//       }
//     },

//     // ========================
//     // DOCUMENTS
//     // ========================
//     documents: {
//       photograph: { cloudinaryUrl: String, publicId: String, uploadedAt: Date, verified: { type: Boolean, default: false } },
//       passportCopy: { cloudinaryUrl: String, publicId: String, uploadedAt: Date, verified: { type: Boolean, default: false } },
//       financialDocuments: [{ documentType: String, cloudinaryUrl: String, publicId: String, uploadedAt: Date, verified: { type: Boolean, default: false } }],
//       travelDocuments: [{ documentType: String, cloudinaryUrl: String, publicId: String, uploadedAt: Date, verified: { type: Boolean, default: false } }],
//       supportingDocuments: [{ documentType: String, cloudinaryUrl: String, publicId: String, uploadedAt: Date, verified: { type: Boolean, default: false } }],
//       otherDocuments: [{ description: String, cloudinaryUrl: String, publicId: String, uploadedAt: Date, verified: { type: Boolean, default: false } }]
//     },

//     // ========================
//     // INTERNAL MANAGEMENT
//     // ========================
//     internal: {
//       assignedTo: {
//         agentId: mongoose.Schema.Types.ObjectId,
//         agentName: String,
//         agentEmail: String,
//         department: { type: String, enum: ['sales','consultation','processing','verification','customer-service'] },
//         assignedAt: { type: Date, default: Date.now },
//         lastContacted: Date
//       },
//       priority: { type: String, enum: ['low','normal','high','urgent'], default: 'normal' },
//       source: { type: String, enum: ['website','walk-in','referral','partner','social-media','repeat-customer'], default: 'website' },
//       notes: [{ note: String, addedBy: String, addedAt: { type: Date, default: Date.now }, category: String, priority: String }]
//     },

//     // ========================
//     // COMMUNICATIONS & AUDIT
//     // ========================
//     communications: [{ type: Object }],
//     statusHistory: [{ type: Object }],
//     auditLog: [{ type: Object }]
//   },
//   { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
// );

// // ========== VIRTUALS ==========
// visaServiceSchema.virtual('totalDocuments').get(function() {
//   let count = 0;
//   if (this.documents?.photograph?.cloudinaryUrl) count++;
//   if (this.documents?.passportCopy?.cloudinaryUrl) count++;
//   count += this.documents?.financialDocuments?.length || 0;
//   count += this.documents?.travelDocuments?.length || 0;
//   count += this.documents?.supportingDocuments?.length || 0;
//   count += this.documents?.otherDocuments?.length || 0;
//   return count;
// });

// visaServiceSchema.virtual('balanceDue').get(function() {
//   const total = this.applicationDetails?.fees?.totalAmount || 0;
//   const paid = this.applicationDetails?.payment?.amountPaid || 0;
//   return Math.max(0, total - paid);
// });

// visaServiceSchema.virtual('isBooking').get(function() { return this.serviceType === 'booking'; });
// visaServiceSchema.virtual('isApplication').get(function() { return this.serviceType === 'application' || this.serviceType === 'combined'; });
// visaServiceSchema.virtual('hasBooking').get(function() { return this.serviceType === 'booking' || this.serviceType === 'combined'; });
// visaServiceSchema.virtual('hasApplication').get(function() { return this.serviceType === 'application' || this.serviceType === 'combined'; });

// // ========== INSTANCE METHODS ==========
// visaServiceSchema.methods.addAppliedCountry = function(country) {
//   if (!this.applicationDetails?.visaInfo?.appliedCountries) {
//     this.applicationDetails.visaInfo.appliedCountries = [];
//   }
//   if (!this.applicationDetails.visaInfo.appliedCountries.includes(country)) {
//     this.applicationDetails.visaInfo.appliedCountries.push(country);
//   }
//   return this;
// };

// visaServiceSchema.methods.addDocument = function(category, documentData) {
//   if (!this.documents) this.documents = {};
//   switch(category.toLowerCase()) {
//     case 'photograph': this.documents.photograph = { ...this.documents.photograph, ...documentData, uploadedAt: new Date() }; break;
//     case 'passport': case 'passportcopy': this.documents.passportCopy = { ...this.documents.passportCopy, ...documentData, uploadedAt: new Date() }; break;
//     case 'financial': if (!this.documents.financialDocuments) this.documents.financialDocuments = []; this.documents.financialDocuments.push({ ...documentData, uploadedAt: new Date() }); break;
//     case 'travel': if (!this.documents.travelDocuments) this.documents.travelDocuments = []; this.documents.travelDocuments.push({ ...documentData, uploadedAt: new Date() }); break;
//     case 'supporting': if (!this.documents.supportingDocuments) this.documents.supportingDocuments = []; this.documents.supportingDocuments.push({ ...documentData, uploadedAt: new Date() }); break;
//     default: if (!this.documents.otherDocuments) this.documents.otherDocuments = []; this.documents.otherDocuments.push({ description: category, ...documentData, uploadedAt: new Date() });
//   }
//   return this;
// };

// visaServiceSchema.methods.uploadDocumentToCloudinary = async function(category, filePath, fileName) {
//   const result = await cloudinary.uploader.upload(filePath, { folder: 'visa_documents', public_id: fileName, resource_type: 'auto' });
//   this.addDocument(category, { cloudinaryUrl: result.secure_url, publicId: result.public_id, originalName: fileName });
//   return result.secure_url;
// };

// // ========== EXPORT MODEL ==========
// module.exports = mongoose.model('VisaService', visaServiceSchema);



























// const mongoose = require('mongoose');
// const cloudinary = require('cloudinary').v2;

// /* =========================
//    CLOUDINARY CONFIG
// ========================= */
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_NAME,
//   api_key: process.env.CLOUDINARY_KEY,
//   api_secret: process.env.CLOUDINARY_SECRET
// });

// /* =========================
//    REUSABLE DOCUMENT SCHEMA
// ========================= */
// const cloudDocSchema = new mongoose.Schema({
//   documentType: String,
//   cloudinaryUrl: String,
//   publicId: String,
//   size: { type: Number, max: 5 * 1024 * 1024 }, // <= 5MB
//   uploadedAt: { type: Date, default: Date.now },
//   verified: { type: Boolean, default: false }
// }, { _id: false });

// /* =========================
//    MAIN VISA SERVICE SCHEMA
// ========================= */
// const visaServiceSchema = new mongoose.Schema({

//   /* =========================
//      SYSTEM IDENTIFIERS
//   ========================= */
//   serviceId: {
//     type: String,
//     unique: true,
//     default: () => `VS-${Date.now()}-${Math.floor(Math.random() * 1000)}`
//   },
//   trackingNumber: { type: String, sparse: true },

//   /* =========================
//      TYPE DIFFERENTIATION
//      👉 THIS IS THE CORE
//   ========================= */
//   recordType: {
//     type: String,
//     enum: ['visa-catalog', 'visa-booking'],
//     required: true
//   },

//   /* =================================================
//      1️⃣ VISA CATALOG (WHAT YOU PROVIDE)
//      recordType = visa-catalog
//   ================================================= */
//   visaCatalog: {
//     country: String,
//     visaType: {
//       type: String,
//       enum: ['Tourist','Business','Student','Work','Family','Transit']
//     },
//     description: String,
//     processingTime: String,
//     price: {
//       amount: Number,
//       currency: { type: String, default: 'USD' }
//     },
//     coverImage: {
//       cloudinaryUrl: String,
//       publicId: String
//     },
//     isActive: { type: Boolean, default: true }
//   },

//   /* =================================================
//      2️⃣ VISA BOOKING / APPLICATION
//      recordType = visa-booking
//   ================================================= */
//   booking: {
//     serviceRef: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'VisaService'
//     },
//     bookingType: {
//       type: String,
//       enum: ['consultation','full-application'],
//       default: 'consultation'
//     },
//     status: {
//       type: String,
//       enum: [
//         'pending',
//         'confirmed',
//         'documents-collection',
//         'submitted',
//         'embassy-processing',
//         'approved',
//         'rejected',
//         'completed',
//         'cancelled'
//       ],
//       default: 'pending'
//     }
//   },

//   /* =========================
//      CUSTOMER INFORMATION
//   ========================= */
//   customer: {
//     fullName: String,
//     email: String,
//     phone: String,
//     nationality: String,
//     passportNumber: String
//   },

//   /* =========================
//      DOCUMENTS (≤ 5MB)
//   ========================= */
//   documents: {
//     photograph: cloudDocSchema,
//     passportCopy: cloudDocSchema,
//     financialDocuments: [cloudDocSchema],
//     travelDocuments: [cloudDocSchema],
//     supportingDocuments: [cloudDocSchema]
//   },

//   /* =========================
//      INTERNAL
//   ========================= */
//   internal: {
//     assignedTo: String,
//     notes: [String]
//   }

// }, { timestamps: true });

// /* =========================
//    INSTANCE METHOD:
//    CLOUDINARY UPLOAD (5MB)
// ========================= */
// visaServiceSchema.methods.uploadDocument = async function (category, file) {
//   if (file.size > 5 * 1024 * 1024) {
//     throw new Error('File exceeds 5MB limit');
//   }

//   const result = await cloudinary.uploader.upload(file.path, {
//     folder: 'visa_documents',
//     resource_type: 'auto'
//   });

//   const docData = {
//     cloudinaryUrl: result.secure_url,
//     publicId: result.public_id,
//     size: file.size
//   };

//   if (Array.isArray(this.documents[category])) {
//     this.documents[category].push(docData);
//   } else {
//     this.documents[category] = docData;
//   }

//   return result.secure_url;
// };

// /* =========================
//    EXPORT
// ========================= */
// module.exports = mongoose.model('VisaService', visaServiceSchema);








const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;

/* =========================
   CLOUDINARY CONFIG
========================= */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

/* =========================
   CLOUD DOCUMENT SCHEMA
========================= */
const cloudDocSchema = new mongoose.Schema({
  documentType: String,
  cloudinaryUrl: String,
  publicId: String,
  size: { type: Number, max: 5 * 1024 * 1024 }, // ≤ 5MB
  uploadedAt: { type: Date, default: Date.now },
  verified: { type: Boolean, default: false }
}, { _id: false });

/* =========================
   MAIN VISA SERVICE SCHEMA
========================= */
const visaServiceSchema = new mongoose.Schema({

  /* =========================
     SYSTEM IDENTIFIERS
  ========================= */
  serviceId: {
    type: String,
    unique: true,
    default: () => `VS-${Date.now()}-${Math.floor(Math.random() * 1000)}`
  },
  // trackingNumber: { type: String, sparse: true },
  trackingNumber: {
  type: String,
  unique: true,
  sparse: true,
  default: () => `TN-${Date.now()}-${Math.floor(Math.random()*1000)}`
}
,

  /* =========================
     TYPE DIFFERENTIATION
  ========================= */
  recordType: {
    type: String,
    enum: ['visa-catalog', 'visa-booking'],
    required: true
  },

  /* =========================
     VISA CATALOG DATA
     Only for 'visa-catalog', no personal info
  ========================= */
  // visaCatalog: {
  //   country: { type: String, required: function() { return this.recordType === 'visa-catalog'; } },
  //   visaType: {
  //     type: String,
  //     enum: ['Tourist','Business','Student','Work','Family','Transit'],
  //     required: function() { return this.recordType === 'visa-catalog'; }
  //   },
  //   description: String,
  //   processingTime: String,
  //   price: {
  //     amount: Number,
  //     currency: { type: String, default: 'USD' }
  //   },
  //   coverImage: {
  //     cloudinaryUrl: String,
  //     publicId: String
  //   },
  //   isActive: { type: Boolean, default: true }
  // },
visaCatalog: {
  country: {
    type: String,
    required: function () {
      return this.recordType === 'visa-catalog';
    }
  },
  visaType: {
    type: String,
    enum: ['Tourist','Business','Student','Work','Family','Transit'],
    required: function () {
      return this.recordType === 'visa-catalog';
    }
  },
  description: String,
  processingTime: String,
  price: {
    amount: Number,
    currency: { type: String, default: 'USD' }
  },
  coverImage: {
    cloudinaryUrl: String,
    publicId: String
  },
  isActive: { type: Boolean, default: true }
}
,

  /* =========================
     VISA BOOKING / APPLICATION
     Only for 'visa-booking', includes personal data
  ========================= */
  booking: {
    serviceRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'VisaService'
    },
    bookingType: {
      type: String,
      enum: ['consultation','full-application'],
      default: 'consultation'
    },
    status: {
      type: String,
      enum: [
        'pending',
        'confirmed',
        'documents-collection',
        'submitted',
        'embassy-processing',
        'approved',
        'rejected',
        'completed',
        'cancelled'
      ],
      default: 'pending'
    },
    customer: {
      fullName: String,
      email: String,
      phone: String,
      nationality: String,
      passportNumber: String
    },
    documents: {
      photograph: cloudDocSchema,
      passportCopy: cloudDocSchema,
      financialDocuments: [cloudDocSchema],
      travelDocuments: [cloudDocSchema],
      supportingDocuments: [cloudDocSchema]
    }
  },

  /* =========================
     INTERNAL
  ========================= */
  internal: {
    assignedTo: String,
    notes: [String]
  }

}, { timestamps: true });

/* =========================
   INSTANCE METHOD: CLOUDINARY UPLOAD
========================= */
visaServiceSchema.methods.uploadDocument = async function (category, file) {
  if (file.size > 5 * 1024 * 1024) {
    throw new Error('File exceeds 5MB limit');
  }

  const result = await cloudinary.uploader.upload(file.path, {
    folder: 'visa_documents',
    resource_type: 'auto'
  });

  const docData = {
    cloudinaryUrl: result.secure_url,
    publicId: result.public_id,
    size: file.size
  };

  if (Array.isArray(this.booking.documents[category])) {
    this.booking.documents[category].push(docData);
  } else {
    this.booking.documents[category] = docData;
  }

  return result.secure_url;
};

/* =========================
   EXPORT MODEL
========================= */
module.exports = mongoose.model('VisaService', visaServiceSchema);
