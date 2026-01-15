// const mongoose = require('mongoose');
// const moment = require('moment');

// const emailLogSchema = new mongoose.Schema({
//     enquiryId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Enquiry',
//         required: [true, 'Enquiry ID is required'],
//         index: true
//     },
//     recipientType: {
//         type: String,
//         enum: {
//             values: ['user', 'admin', 'staff', 'other'],
//             message: 'Recipient type must be one of: user, admin, staff, other'
//         },
//         required: [true, 'Recipient type is required'],
//         index: true
//     },
//     emailType: {
//         type: String,
//         enum: {
//             values: ['confirmation', 'notification', 'followup', 'reminder', 'test', 'other'],
//             message: 'Email type must be one of: confirmation, notification, followup, reminder, test, other'
//         },
//         required: [true, 'Email type is required'],
//         index: true
//     },
//     recipientEmail: {
//         type: String,
//         required: [true, 'Recipient email is required'],
//         trim: true,
//         lowercase: true,
//         index: true
//     },
//     subject: {
//         type: String,
//         required: [true, 'Email subject is required'],
//         trim: true,
//         maxlength: [200, 'Subject cannot exceed 200 characters']
//     },
//     content: {
//         type: String,
//         required: [true, 'Email content is required']
//     },
//     messageId: {
//         type: String,
//         trim: true,
//         index: true
//     },
//     status: {
//         type: String,
//         enum: {
//             values: ['pending', 'sent', 'delivered', 'failed', 'bounced', 'opened', 'clicked'],
//             message: 'Status must be one of: pending, sent, delivered, failed, bounced, opened, clicked'
//         },
//         default: 'pending',
//         index: true
//     },
//     errorMessage: {
//         type: String,
//         trim: true
//     },
//     sentAt: {
//         type: Date,
//         default: null,
//         index: true
//     },
//     deliveredAt: {
//         type: Date,
//         default: null
//     },
//     openedAt: {
//         type: Date,
//         default: null
//     },
//     clickedAt: {
//         type: Date,
//         default: null
//     },
//     metadata: {
//         type: mongoose.Schema.Types.Mixed,
//         default: {}
//     },
//     createdAt: {
//         type: Date,
//         default: Date.now,
//         index: true
//     },
//     updatedAt: {
//         type: Date,
//         default: Date.now
//     }
// }, {
//     timestamps: true,
//     toJSON: { 
//         virtuals: true,
//         transform: function(doc, ret) {
//             // Remove large content field from JSON response by default
//             delete ret.content;
//             return ret;
//         }
//     },
//     toObject: { virtuals: true }
// });

// // Virtual for formatted sent date
// emailLogSchema.virtual('formattedSentDate').get(function() {
//     return this.sentAt ? moment(this.sentAt).format('DD/MM/YYYY HH:mm') : 'Not sent';
// });

// // Virtual for time ago
// emailLogSchema.virtual('timeAgo').get(function() {
//     return this.sentAt ? moment(this.sentAt).fromNow() : 'Not sent';
// });

// // Virtual for delivery time in seconds
// emailLogSchema.virtual('deliveryTime').get(function() {
//     if (this.sentAt && this.deliveredAt) {
//         return moment(this.deliveredAt).diff(moment(this.sentAt), 'seconds');
//     }
//     return null;
// });

// // Indexes for better query performance
// emailLogSchema.index({ enquiryId: 1, createdAt: -1 });
// emailLogSchema.index({ status: 1, sentAt: -1 });
// emailLogSchema.index({ recipientEmail: 1, createdAt: -1 });
// emailLogSchema.index({ emailType: 1, createdAt: -1 });
// emailLogSchema.index({ createdAt: -1 });
// emailLogSchema.index({ sentAt: -1 });
// emailLogSchema.index({ enquiryId: 1, status: 1 });

// // Middleware to update updatedAt timestamp
// emailLogSchema.pre('save', function(next) {
//     this.updatedAt = Date.now();
//     next();
// });

// // Static method to get email statistics
// emailLogSchema.statics.getEmailStatistics = async function(startDate, endDate) {
//     const stats = await this.aggregate([
//         {
//             $match: {
//                 createdAt: { $gte: startDate, $lte: endDate }
//             }
//         },
//         {
//             $group: {
//                 _id: null,
//                 total: { $sum: 1 },
//                 byStatus: {
//                     $push: {
//                         status: "$status",
//                         count: 1
//                     }
//                 },
//                 byType: {
//                     $push: {
//                         type: "$emailType",
//                         count: 1
//                     }
//                 },
//                 byRecipient: {
//                     $push: {
//                         recipient: "$recipientType",
//                         count: 1
//                     }
//                 },
//                 byDay: {
//                     $push: {
//                         date: { $dateToString: { format: "%Y-%m-%d", date: "$sentAt" } },
//                         count: 1
//                     }
//                 }
//             }
//         },
//         {
//             $project: {
//                 total: 1,
//                 statusSummary: {
//                     $arrayToObject: {
//                         $map: {
//                             input: "$byStatus",
//                             as: "item",
//                             in: { k: "$$item.status", v: { $sum: "$$item.count" } }
//                         }
//                     }
//                 },
//                 typeSummary: {
//                     $arrayToObject: {
//                         $map: {
//                             input: "$byType",
//                             as: "item",
//                             in: { k: "$$item.type", v: { $sum: "$$item.count" } }
//                         }
//                     }
//                 },
//                 recipientSummary: {
//                     $arrayToObject: {
//                         $map: {
//                             input: "$byRecipient",
//                             as: "item",
//                             in: { k: "$$item.recipient", v: { $sum: "$$item.count" } }
//                         }
//                     }
//                 },
//                 dailySummary: {
//                     $arrayToObject: {
//                         $map: {
//                             input: "$byDay",
//                             as: "item",
//                             in: { k: "$$item.date", v: { $sum: "$$item.count" } }
//                         }
//                     }
//                 }
//             }
//         }
//     ]);

//     return stats[0] || {
//         total: 0,
//         statusSummary: {},
//         typeSummary: {},
//         recipientSummary: {},
//         dailySummary: {}
//     };
// };

// // Static method to get failed emails
// emailLogSchema.statics.getFailedEmails = async function(limit = 50) {
//     return this.find({ 
//         status: 'failed',
//         createdAt: { $gte: moment().subtract(7, 'days').toDate() }
//     })
//     .sort({ createdAt: -1 })
//     .limit(limit)
//     .populate('enquiryId', 'name email course')
//     .lean();
// };

// // Static method to get recent emails for an enquiry
// emailLogSchema.statics.getEnquiryEmails = async function(enquiryId, limit = 10) {
//     if (!mongoose.Types.ObjectId.isValid(enquiryId)) {
//         throw new Error('Invalid enquiry ID');
//     }
    
//     return this.find({ enquiryId })
//         .sort({ createdAt: -1 })
//         .limit(limit)
//         .lean();
// };

// // Static method to get delivery rate
// emailLogSchema.statics.getDeliveryRate = async function(startDate, endDate) {
//     const result = await this.aggregate([
//         {
//             $match: {
//                 sentAt: { $gte: startDate, $lte: endDate }
//             }
//         },
//         {
//             $group: {
//                 _id: null,
//                 total: { $sum: 1 },
//                 delivered: {
//                     $sum: {
//                         $cond: [{ $in: ["$status", ["delivered", "opened", "clicked"]] }, 1, 0]
//                     }
//                 },
//                 failed: {
//                     $sum: {
//                         $cond: [{ $eq: ["$status", "failed"] }, 1, 0]
//                     }
//                 },
//                 bounced: {
//                     $sum: {
//                         $cond: [{ $eq: ["$status", "bounced"] }, 1, 0]
//                     }
//                 }
//             }
//         },
//         {
//             $project: {
//                 total: 1,
//                 delivered: 1,
//                 failed: 1,
//                 bounced: 1,
//                 deliveryRate: {
//                     $multiply: [
//                         { $divide: ["$delivered", "$total"] },
//                         100
//                     ]
//                 },
//                 failureRate: {
//                     $multiply: [
//                         { $divide: ["$failed", "$total"] },
//                         100
//                     ]
//                 },
//                 bounceRate: {
//                     $multiply: [
//                         { $divide: ["$bounced", "$total"] },
//                         100
//                     ]
//                 }
//             }
//         }
//     ]);

//     return result[0] || {
//         total: 0,
//         delivered: 0,
//         failed: 0,
//         bounced: 0,
//         deliveryRate: 0,
//         failureRate: 0,
//         bounceRate: 0
//     };
// };

// // Instance method to mark as opened
// emailLogSchema.methods.markAsOpened = function() {
//     if (this.status !== 'opened' && this.status !== 'clicked') {
//         this.status = 'opened';
//         this.openedAt = new Date();
//         return this.save();
//     }
//     return Promise.resolve(this);
// };

// // Instance method to mark as clicked
// emailLogSchema.methods.markAsClicked = function() {
//     if (this.status !== 'clicked') {
//         this.status = 'clicked';
//         this.clickedAt = new Date();
//         return this.save();
//     }
//     return Promise.resolve(this);
// };

// // Instance method to mark as delivered
// emailLogSchema.methods.markAsDelivered = function() {
//     if (this.status === 'sent' || this.status === 'pending') {
//         this.status = 'delivered';
//         this.deliveredAt = new Date();
//         return this.save();
//     }
//     return Promise.resolve(this);
// };

// // Instance method to mark as failed
// emailLogSchema.methods.markAsFailed = function(errorMessage) {
//     this.status = 'failed';
//     this.errorMessage = errorMessage;
//     return this.save();
// };

// const EmailLog = mongoose.model('EmailLog', emailLogSchema);

// module.exports = EmailLog;





























































const mongoose = require('mongoose');
const moment = require('moment');

const emailLogSchema = new mongoose.Schema({
    enquiryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Enquiry',
        required: [true, 'Enquiry ID is required'],
        index: true
    },
    recipientType: {
        type: String,
        enum: ['user', 'admin', 'staff', 'other'],
        required: [true, 'Recipient type is required'],
        index: true
    },
    emailType: {
        type: String,
        enum: ['confirmation', 'notification', 'followup', 'reminder', 'test', 'other'],
        required: [true, 'Email type is required'],
        index: true
    },
    recipientEmail: {
        type: String,
        required: [true, 'Recipient email is required'],
        trim: true,
        lowercase: true,
        index: true
    },
    subject: {
        type: String,
        required: [true, 'Email subject is required'],
        trim: true,
        maxlength: [200, 'Subject cannot exceed 200 characters']
    },
    content: {
        type: String,
        required: [true, 'Email content is required']
    },
    messageId: {
        type: String,
        trim: true,
        index: true
    },
    status: {
        type: String,
        enum: ['pending', 'sent', 'delivered', 'failed', 'bounced', 'opened', 'clicked'],
        default: 'pending',
        index: true
    },
    errorMessage: {
        type: String,
        trim: true
    },
    sentAt: {
        type: Date,
        default: null,
        index: true
    },
    deliveredAt: {
        type: Date,
        default: null
    },
    openedAt: {
        type: Date,
        default: null
    },
    clickedAt: {
        type: Date,
        default: null
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: true
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    toJSON: { 
        virtuals: true,
        transform: (doc, ret) => {
            delete ret.content; // Remove content by default
            return ret;
        }
    },
    toObject: { virtuals: true }
});

// ======================
// VIRTUALS
// ======================
emailLogSchema.virtual('formattedSentDate').get(function() {
    return this.sentAt ? moment(this.sentAt).format('DD/MM/YYYY HH:mm') : 'Not sent';
});

emailLogSchema.virtual('timeAgo').get(function() {
    return this.sentAt ? moment(this.sentAt).fromNow() : 'Not sent';
});

emailLogSchema.virtual('deliveryTime').get(function() {
    if (this.sentAt && this.deliveredAt) {
        return moment(this.deliveredAt).diff(moment(this.sentAt), 'seconds');
    }
    return null;
});

// ======================
// INDEXES
// ======================
emailLogSchema.index({ enquiryId: 1, createdAt: -1 });
emailLogSchema.index({ status: 1, sentAt: -1 });
emailLogSchema.index({ recipientEmail: 1, createdAt: -1 });
emailLogSchema.index({ emailType: 1, createdAt: -1 });
emailLogSchema.index({ createdAt: -1 });
emailLogSchema.index({ sentAt: -1 });
emailLogSchema.index({ enquiryId: 1, status: 1 });

// ======================
// MIDDLEWARE
// ======================
emailLogSchema.pre('save', async function() {
    this.updatedAt = Date.now();
});

// ======================
// STATIC METHODS
// ======================
emailLogSchema.statics.getEmailStatistics = async function(startDate, endDate) {
    const stats = await this.aggregate([
        { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
        { $group: {
            _id: null,
            total: { $sum: 1 },
            byStatus: { $push: { status: "$status", count: 1 } },
            byType: { $push: { type: "$emailType", count: 1 } },
            byRecipient: { $push: { recipient: "$recipientType", count: 1 } },
            byDay: { $push: { date: { $dateToString: { format: "%Y-%m-%d", date: "$sentAt" } }, count: 1 } }
        }},
        { $project: {
            total: 1,
            statusSummary: { $arrayToObject: { $map: { input: "$byStatus", as: "item", in: { k: "$$item.status", v: { $sum: "$$item.count" } } } } },
            typeSummary: { $arrayToObject: { $map: { input: "$byType", as: "item", in: { k: "$$item.type", v: { $sum: "$$item.count" } } } } },
            recipientSummary: { $arrayToObject: { $map: { input: "$byRecipient", as: "item", in: { k: "$$item.recipient", v: { $sum: "$$item.count" } } } } },
            dailySummary: { $arrayToObject: { $map: { input: "$byDay", as: "item", in: { k: "$$item.date", v: { $sum: "$$item.count" } } } } }
        }}
    ]);

    return stats[0] || { total: 0, statusSummary: {}, typeSummary: {}, recipientSummary: {}, dailySummary: {} };
};

emailLogSchema.statics.getFailedEmails = async function(limit = 50) {
    return this.find({ 
        status: 'failed',
        createdAt: { $gte: moment().subtract(7, 'days').toDate() }
    })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('enquiryId', 'name email course')
    .lean();
};

emailLogSchema.statics.getEnquiryEmails = async function(enquiryId, limit = 10) {
    if (!mongoose.Types.ObjectId.isValid(enquiryId)) throw new Error('Invalid enquiry ID');
    return this.find({ enquiryId }).sort({ createdAt: -1 }).limit(limit).lean();
};

emailLogSchema.statics.getDeliveryRate = async function(startDate, endDate) {
    const result = await this.aggregate([
        { $match: { sentAt: { $gte: startDate, $lte: endDate } } },
        { $group: {
            _id: null,
            total: { $sum: 1 },
            delivered: { $sum: { $cond: [{ $in: ["$status", ["delivered","opened","clicked"]] }, 1, 0] } },
            failed: { $sum: { $cond: [{ $eq: ["$status","failed"] }, 1, 0] } },
            bounced: { $sum: { $cond: [{ $eq: ["$status","bounced"] }, 1, 0] } }
        }},
        { $project: {
            total: 1,
            delivered: 1,
            failed: 1,
            bounced: 1,
            deliveryRate: { $multiply: [{ $divide: ["$delivered","$total"] }, 100] },
            failureRate: { $multiply: [{ $divide: ["$failed","$total"] }, 100] },
            bounceRate: { $multiply: [{ $divide: ["$bounced","$total"] }, 100] }
        }}
    ]);
    return result[0] || { total:0, delivered:0, failed:0, bounced:0, deliveryRate:0, failureRate:0, bounceRate:0 };
};

// ======================
// INSTANCE METHODS
// ======================
emailLogSchema.methods.markAsOpened = function() {
    if (!['opened','clicked'].includes(this.status)) {
        this.status = 'opened';
        this.openedAt = new Date();
        return this.save();
    }
    return Promise.resolve(this);
};

emailLogSchema.methods.markAsClicked = function() {
    if (this.status !== 'clicked') {
        this.status = 'clicked';
        this.clickedAt = new Date();
        return this.save();
    }
    return Promise.resolve(this);
};

emailLogSchema.methods.markAsDelivered = function() {
    if (['pending','sent'].includes(this.status)) {
        this.status = 'delivered';
        this.deliveredAt = new Date();
        return this.save();
    }
    return Promise.resolve(this);
};

emailLogSchema.methods.markAsFailed = function(errorMessage) {
    this.status = 'failed';
    this.errorMessage = errorMessage;
    return this.save();
};

// ======================
// EXPORT
// ======================
const EmailLog = mongoose.model('EmailLog', emailLogSchema);
module.exports = EmailLog;
