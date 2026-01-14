// const mongoose = require('mongoose');
// const moment = require('moment');

// const enquirySchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: [true, 'Name is required'],
//         trim: true,
//         minlength: [2, 'Name must be at least 2 characters long'],
//         maxlength: [100, 'Name cannot exceed 100 characters']
//     },
//     email: {
//         type: String,
//         required: [true, 'Email is required'],
//         trim: true,
//         lowercase: true,
//         match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address'],
//         index: true
//     },
//     phone: {
//         type: String,
//         required: [true, 'Phone number is required'],
//         trim: true,
//         minlength: [5, 'Phone number must be at least 5 characters long'],
//         maxlength: [20, 'Phone number cannot exceed 20 characters']
//     },
//     country: {
//         type: String,
//         required: [true, 'Country is required'],
//         trim: true,
//         minlength: [2, 'Country must be at least 2 characters long'],
//         maxlength: [100, 'Country cannot exceed 100 characters']
//     },
//     course: {
//         type: String,
//         required: [true, 'Course is required'],
//         trim: true,
//         minlength: [2, 'Course must be at least 2 characters long'],
//         maxlength: [200, 'Course cannot exceed 200 characters']
//     },
//     message: {
//         type: String,
//         trim: true,
//         maxlength: [2000, 'Message cannot exceed 2000 characters'],
//         default: ''
//     },
//     status: {
//         type: String,
//         enum: {
//             values: ['new', 'contacted', 'in_progress', 'qualified', 'converted', 'rejected', 'on_hold'],
//             message: 'Status must be one of: new, contacted, in_progress, qualified, converted, rejected, on_hold'
//         },
//         default: 'new',
//         index: true
//     },
//     priority: {
//         type: String,
//         enum: ['low', 'medium', 'high', 'urgent'],
//         default: 'medium'
//     },
//     source: {
//         type: String,
//         trim: true,
//         default: 'website'
//     },
//     assignedTo: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User',
//         default: null
//     },
//     notes: [{
//         content: {
//             type: String,
//             required: true,
//             trim: true
//         },
//         createdBy: {
//             type: String,
//             default: 'system'
//         },
//         createdAt: {
//             type: Date,
//             default: Date.now
//         }
//     }],
//     followUpDate: {
//         type: Date,
//         default: null
//     },
//     isDeleted: {
//         type: Boolean,
//         default: false,
//         index: true
//     },
//     deletedAt: {
//         type: Date,
//         default: null
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
//     toJSON: { virtuals: true },
//     toObject: { virtuals: true }
// });

// // Virtual for formatted date
// enquirySchema.virtual('formattedDate').get(function() {
//     return moment(this.createdAt).format('DD/MM/YYYY');
// });

// // Virtual for time ago
// enquirySchema.virtual('timeAgo').get(function() {
//     return moment(this.createdAt).fromNow();
// });

// // Virtual for reference number
// enquirySchema.virtual('referenceNumber').get(function() {
//     return `ENQ-${this._id.toString().slice(-8).toUpperCase()}`;
// });

// // Virtual for email logs
// enquirySchema.virtual('emailLogs', {
//     ref: 'EmailLog',
//     localField: '_id',
//     foreignField: 'enquiryId'
// });

// // Indexes for better query performance
// enquirySchema.index({ email: 1, createdAt: -1 });
// enquirySchema.index({ status: 1, priority: 1 });
// enquirySchema.index({ course: 1, createdAt: -1 });
// enquirySchema.index({ country: 1, createdAt: -1 });
// enquirySchema.index({ createdAt: -1 });
// enquirySchema.index({ isDeleted: 1, status: 1 });
// enquirySchema.index({ followUpDate: 1, status: 1 });

// // Middleware to update updatedAt timestamp
// enquirySchema.pre('save', function(next) {
//     this.updatedAt = Date.now();
    
//     // Auto-set followUpDate if status changes to contacted
//     if (this.isModified('status') && this.status === 'contacted') {
//         this.followUpDate = moment().add(7, 'days').toDate();
//     }
    
//     next();
// });

// // Static method to get statistics
// enquirySchema.statics.getStatistics = async function(startDate, endDate) {
//     const stats = await this.aggregate([
//         {
//             $match: {
//                 createdAt: { $gte: startDate, $lte: endDate },
//                 isDeleted: false
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
//                 byCourse: {
//                     $push: {
//                         course: "$course",
//                         count: 1
//                     }
//                 },
//                 byCountry: {
//                     $push: {
//                         country: "$country",
//                         count: 1
//                     }
//                 },
//                 byDay: {
//                     $push: {
//                         date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
//                         count: 1
//                     }
//                 }
//             }
//         },
//         {
//             $project: {
//                 total: 1,
//                 statusDistribution: {
//                     $arrayToObject: {
//                         $map: {
//                             input: "$byStatus",
//                             as: "item",
//                             in: { k: "$$item.status", v: { $sum: "$$item.count" } }
//                         }
//                     }
//                 },
//                 courseDistribution: {
//                     $arrayToObject: {
//                         $map: {
//                             input: "$byCourse",
//                             as: "item",
//                             in: { k: "$$item.course", v: { $sum: "$$item.count" } }
//                         }
//                     }
//                 },
//                 countryDistribution: {
//                     $arrayToObject: {
//                         $map: {
//                             input: "$byCountry",
//                             as: "item",
//                             in: { k: "$$item.country", v: { $sum: "$$item.count" } }
//                         }
//                     }
//                 },
//                 dailyDistribution: {
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
//         statusDistribution: {},
//         courseDistribution: {},
//         countryDistribution: {},
//         dailyDistribution: {}
//     };
// };

// // Static method to get dashboard summary
// enquirySchema.statics.getDashboardSummary = async function() {
//     const today = moment().startOf('day');
//     const yesterday = moment().subtract(1, 'day').startOf('day');
//     const last7Days = moment().subtract(7, 'days').startOf('day');
//     const last30Days = moment().subtract(30, 'days').startOf('day');

//     const [
//         total,
//         todayCount,
//         yesterdayCount,
//         last7DaysCount,
//         last30DaysCount,
//         statusSummary,
//         courseTop5,
//         countryTop5
//     ] = await Promise.all([
//         this.countDocuments({ isDeleted: false }),
//         this.countDocuments({ 
//             createdAt: { $gte: today.toDate() },
//             isDeleted: false 
//         }),
//         this.countDocuments({ 
//             createdAt: { $gte: yesterday.toDate(), $lt: today.toDate() },
//             isDeleted: false 
//         }),
//         this.countDocuments({ 
//             createdAt: { $gte: last7Days.toDate() },
//             isDeleted: false 
//         }),
//         this.countDocuments({ 
//             createdAt: { $gte: last30Days.toDate() },
//             isDeleted: false 
//         }),
//         this.aggregate([
//             { $match: { isDeleted: false } },
//             { $group: { _id: "$status", count: { $sum: 1 } } },
//             { $sort: { count: -1 } }
//         ]),
//         this.aggregate([
//             { $match: { isDeleted: false } },
//             { $group: { _id: "$course", count: { $sum: 1 } } },
//             { $sort: { count: -1 } },
//             { $limit: 5 }
//         ]),
//         this.aggregate([
//             { $match: { isDeleted: false } },
//             { $group: { _id: "$country", count: { $sum: 1 } } },
//             { $sort: { count: -1 } },
//             { $limit: 5 }
//         ])
//     ]);

//     return {
//         total,
//         today: todayCount,
//         yesterday: yesterdayCount,
//         last7Days: last7DaysCount,
//         last30Days: last30DaysCount,
//         statusSummary,
//         topCourses: courseTop5,
//         topCountries: countryTop5
//     };
// };

// // Static method to get recent duplicates
// enquirySchema.statics.findRecentDuplicates = async function(email, hours = 24) {
//     return this.find({
//         email: email.toLowerCase().trim(),
//         createdAt: { 
//             $gte: moment().subtract(hours, 'hours').toDate() 
//         },
//         isDeleted: false
//     }).sort({ createdAt: -1 });
// };

// // Instance method to add a note
// enquirySchema.methods.addNote = function(content, createdBy = 'system') {
//     this.notes.push({
//         content: content.trim(),
//         createdBy,
//         createdAt: new Date()
//     });
//     return this.save();
// };

// // Instance method to soft delete
// enquirySchema.methods.softDelete = function() {
//     this.isDeleted = true;
//     this.deletedAt = new Date();
//     return this.save();
// };

// // Instance method to restore
// enquirySchema.methods.restore = function() {
//     this.isDeleted = false;
//     this.deletedAt = null;
//     return this.save();
// };

// // Instance method to get email history
// enquirySchema.methods.getEmailHistory = async function() {
//     const EmailLog = mongoose.model('EmailLog');
//     return EmailLog.find({ enquiryId: this._id })
//         .sort({ createdAt: -1 })
//         .lean();
// };

// const Enquiry = mongoose.model('Enquiry', enquirySchema);

// module.exports = Enquiry;



































const mongoose = require('mongoose');
const moment = require('moment');

const enquirySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters long'],
        maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address'],
        index: true
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true,
        minlength: [5, 'Phone number must be at least 5 characters long'],
        maxlength: [20, 'Phone number cannot exceed 20 characters']
    },
    country: {
        type: String,
        required: [true, 'Country is required'],
        trim: true,
        minlength: [2, 'Country must be at least 2 characters long'],
        maxlength: [100, 'Country cannot exceed 100 characters']
    },
    course: {
        type: String,
        required: [true, 'Course is required'],
        trim: true,
        minlength: [2, 'Course must be at least 2 characters long'],
        maxlength: [200, 'Course cannot exceed 200 characters']
    },
    message: {
        type: String,
        trim: true,
        maxlength: [2000, 'Message cannot exceed 2000 characters'],
        default: ''
    },
    status: {
        type: String,
        enum: ['new', 'contacted', 'in_progress', 'qualified', 'converted', 'rejected', 'on_hold'],
        default: 'new',
        index: true
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium'
    },
    source: {
        type: String,
        trim: true,
        default: 'website'
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    notes: [{
        content: { type: String, required: true, trim: true },
        createdBy: { type: String, default: 'system' },
        createdAt: { type: Date, default: Date.now }
    }],
    followUpDate: { type: Date, default: null },
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date, default: null }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// === VIRTUALS ===
enquirySchema.virtual('formattedDate').get(function() {
    return moment(this.createdAt).format('DD/MM/YYYY');
});

enquirySchema.virtual('timeAgo').get(function() {
    return moment(this.createdAt).fromNow();
});

enquirySchema.virtual('referenceNumber').get(function() {
    return `ENQ-${this._id.toString().slice(-8).toUpperCase()}`;
});

enquirySchema.virtual('emailLogs', {
    ref: 'EmailLog',
    localField: '_id',
    foreignField: 'enquiryId'
});

// === INDEXES ===
enquirySchema.index({ email: 1, createdAt: -1 });
enquirySchema.index({ status: 1, priority: 1 });
enquirySchema.index({ course: 1, createdAt: -1 });
enquirySchema.index({ country: 1, createdAt: -1 });
enquirySchema.index({ createdAt: -1 });
enquirySchema.index({ isDeleted: 1, status: 1 });
enquirySchema.index({ followUpDate: 1, status: 1 });

// === MIDDLEWARE ===
enquirySchema.pre('save', function(next) {
    this.updatedAt = Date.now();

    // Auto-set followUpDate if status changes to contacted
    if (this.isModified('status') && this.status === 'contacted') {
        this.followUpDate = moment().add(7, 'days').toDate();
    }

    next();
});

// === STATIC METHODS ===

// Get recent duplicates by email
enquirySchema.statics.findRecentDuplicates = async function(email, hours = 24) {
    return this.find({
        email: email.toLowerCase().trim(),
        createdAt: { $gte: moment().subtract(hours, 'hours').toDate() },
        isDeleted: false
    }).sort({ createdAt: -1 });
};

// Get statistics
enquirySchema.statics.getStatistics = async function(startDate, endDate) {
    const stats = await this.aggregate([
        { $match: { createdAt: { $gte: startDate, $lte: endDate }, isDeleted: false } },
        { $group: {
            _id: null,
            total: { $sum: 1 },
            byStatus: { $push: { status: "$status", count: 1 } },
            byCourse: { $push: { course: "$course", count: 1 } },
            byCountry: { $push: { country: "$country", count: 1 } },
            byDay: { $push: { date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: 1 } }
        }},
        { $project: {
            total: 1,
            statusDistribution: { $arrayToObject: { $map: { input: "$byStatus", as: "item", in: { k: "$$item.status", v: { $sum: "$$item.count" } } } } },
            courseDistribution: { $arrayToObject: { $map: { input: "$byCourse", as: "item", in: { k: "$$item.course", v: { $sum: "$$item.count" } } } } },
            countryDistribution: { $arrayToObject: { $map: { input: "$byCountry", as: "item", in: { k: "$$item.country", v: { $sum: "$$item.count" } } } } },
            dailyDistribution: { $arrayToObject: { $map: { input: "$byDay", as: "item", in: { k: "$$item.date", v: { $sum: "$$item.count" } } } } }
        }}
    ]);

    return stats[0] || { total: 0, statusDistribution: {}, courseDistribution: {}, countryDistribution: {}, dailyDistribution: {} };
};

// === INSTANCE METHODS ===

// Add a note
enquirySchema.methods.addNote = function(content, createdBy = 'system') {
    this.notes.push({ content: content.trim(), createdBy, createdAt: new Date() });
    return this.save();
};

// Soft delete
enquirySchema.methods.softDelete = function() {
    this.isDeleted = true;
    this.deletedAt = new Date();
    return this.save();
};

// Restore
enquirySchema.methods.restore = function() {
    this.isDeleted = false;
    this.deletedAt = null;
    return this.save();
};

// Get email history
enquirySchema.methods.getEmailHistory = async function() {
    const EmailLog = mongoose.model('EmailLog');
    return EmailLog.find({ enquiryId: this._id }).sort({ createdAt: -1 }).lean();
};

// Export model
const Enquiry = mongoose.model('Enquiry', enquirySchema);
module.exports = Enquiry;
