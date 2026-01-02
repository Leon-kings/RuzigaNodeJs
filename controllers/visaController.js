// // const Visa = require('../models/Visa');
// // const nodemailer = require('nodemailer');

// // /* ===========================
// //    CONSTANTS & HELPERS
// // =========================== */

// // const VISA_STATUS = {
// //   PENDING: 'pending',
// //   APPROVED: 'approved',
// //   REJECTED: 'rejected',
// //   IN_REVIEW: 'in-review'
// // };

// // // Convert "$123.45" → 123.45
// // const parseAmount = {
// //   $toDouble: { $substr: ['$amount', 1, -1] }
// // };

// // /* ===========================
// //    STATISTICS SERVICE
// // =========================== */

// // class StatisticsService {
// //   async getOverallStatistics() {
// //     const total = await Visa.countDocuments();

// //     const counts = await Visa.aggregate([
// //       { $group: { _id: '$status', count: { $sum: 1 } } }
// //     ]);

// //     const mapCount = status =>
// //       counts.find(c => c._id === status)?.count || 0;

// //     const pending = mapCount(VISA_STATUS.PENDING);
// //     const approved = mapCount(VISA_STATUS.APPROVED);
// //     const rejected = mapCount(VISA_STATUS.REJECTED);
// //     const inReview = mapCount(VISA_STATUS.IN_REVIEW);

// //     return {
// //       total,
// //       pending,
// //       approved,
// //       rejected,
// //       inReview,
// //       percentages: {
// //         pending: total ? ((pending / total) * 100).toFixed(2) : 0,
// //         approved: total ? ((approved / total) * 100).toFixed(2) : 0
// //       },
// //       byType: await this.groupByField('type'),
// //       byPriority: await this.groupByField('priority'),
// //       byCountry: await this.getTopCountries(),
// //       monthlyStats: await this.getMonthlyStats()
// //     };
// //   }

// //   async groupByField(field) {
// //     return Visa.aggregate([
// //       { $group: { _id: `$${field}`, count: { $sum: 1 } } }
// //     ]);
// //   }

// //   async getTopCountries() {
// //     return Visa.aggregate([
// //       { $group: { _id: '$country', count: { $sum: 1 } } },
// //       { $sort: { count: -1 } },
// //       { $limit: 10 }
// //     ]);
// //   }

// //   async getMonthlyStats() {
// //     return Visa.aggregate([
// //       {
// //         $group: {
// //           _id: {
// //             year: { $year: '$date' },
// //             month: { $month: '$date' }
// //           },
// //           count: { $sum: 1 },
// //           approved: {
// //             $sum: {
// //               $cond: [{ $eq: ['$status', VISA_STATUS.APPROVED] }, 1, 0]
// //             }
// //           },
// //           revenue: { $sum: parseAmount }
// //         }
// //       },
// //       { $sort: { '_id.year': 1, '_id.month': 1 } }
// //     ]);
// //   }

// //   async getRevenueStatistics() {
// //     const [stats] = await Visa.aggregate([
// //       {
// //         $group: {
// //           _id: null,
// //           totalRevenue: { $sum: parseAmount },
// //           avgRevenue: { $avg: parseAmount },
// //           minRevenue: { $min: parseAmount },
// //           maxRevenue: { $max: parseAmount }
// //         }
// //       }
// //     ]);

// //     return stats || {
// //       totalRevenue: 0,
// //       avgRevenue: 0,
// //       minRevenue: 0,
// //       maxRevenue: 0
// //     };
// //   }
// // }

// // /* ===========================
// //    INVENTORY SERVICE
// // =========================== */

// // class InventoryService {
// //   async getInventoryOverview() {
// //     const inventory = await Visa.aggregate([
// //       {
// //         $group: {
// //           _id: { status: '$status', type: '$type' },
// //           count: { $sum: 1 },
// //           documents: { $sum: '$documents' }
// //         }
// //       },
// //       {
// //         $group: {
// //           _id: '$_id.status',
// //           types: { $push: '$$ROOT' },
// //           totalCount: { $sum: '$count' },
// //           totalDocuments: { $sum: '$documents' }
// //         }
// //       }
// //     ]);

// //     const [documentStats] = await Visa.aggregate([
// //       {
// //         $group: {
// //           _id: null,
// //           totalDocuments: { $sum: '$documents' },
// //           avgDocuments: { $avg: '$documents' },
// //           maxDocuments: { $max: '$documents' },
// //           minDocuments: { $min: '$documents' }
// //         }
// //       }
// //     ]);

// //     const recentApplications = await this.getRecentApplications(30);

// //     return {
// //       inventory,
// //       documentStats: documentStats || {},
// //       recentApplications
// //     };
// //   }

// //   async getRecentApplications(days) {
// //     const fromDate = new Date();
// //     fromDate.setDate(fromDate.getDate() - days);

// //     return Visa.aggregate([
// //       { $match: { createdAt: { $gte: fromDate } } },
// //       {
// //         $group: {
// //           _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
// //           count: { $sum: 1 }
// //         }
// //       },
// //       { $sort: { _id: 1 } }
// //     ]);
// //   }
// // }

// // /* ===========================
// //    EMAIL SERVICE
// // =========================== */

// // class EmailService {
// //   constructor() {
// //     this.transporter = nodemailer.createTransport({
// //       host: process.env.SMT_ || 'smtp.gmail.com',
// //       port: process.env.SMTP_PORT || 587,
// //       secure: false,
// //       auth: {
// //         user: process.env.SMTP_USER,
// //         pass: process.env.SMTP_PASS
// //       }
// //     });
// //   }

// //   async sendStatusUpdateEmail(visa) {
// //     const templates = {
// //       approved: 'has been approved 🎉',
// //       rejected: 'was not approved',
// //       'in-review': 'is currently under review',
// //       pending: 'has been received'
// //     };

// //     const subject = `Visa Application Update - ${visa.id}`;
// //     const message = templates[visa.status] || 'has an update';

// //     return this.sendMail(
// //       visa.email,
// //       subject,
// //       `Dear ${visa.applicant}, your ${visa.type} visa application ${message}.`
// //     );
// //   }

// //   async sendMail(to, subject, text) {
// //     try {
// //       await this.transporter.sendMail({
// //         from: process.env.SMTP_USER,
// //         to,
// //         subject,
// //         text,
// //         html: `<p>${text}</p>`
// //       });
// //       return { success: true };
// //     } catch (err) {
// //       console.error(err);
// //       return { success: false };
// //     }
// //   }
// // }

// // /* ===========================
// //    CONTROLLER
// // =========================== */

// // class VisaController {
// //   async createVisa(req, res, next) {
// //     try {
// //       const year = new Date().getFullYear();
// //       const count = await Visa.countDocuments();

// //       const visa = await Visa.create({
// //         ...req.body,
// //         id: req.body.id || `VISA-${year}-${String(count + 1).padStart(3, '0')}`
// //       });

// //       await emailService.sendStatusUpdateEmail(visa);

// //       res.status(201).json({ success: true, data: visa });
// //     } catch (err) {
// //       next(err);
// //     }
// //   }

// //   async updateVisa(req, res, next) {
// //     try {
// //       const oldVisa = await Visa.findOne({ id: req.params.id });
// //       if (!oldVisa) return res.status(404).json({ success: false });

// //       const updatedVisa = await Visa.findOneAndUpdate(
// //         { id: req.params.id },
// //         req.body,
// //         { new: true, runValidators: true }
// //       );

// //       if (req.body.status && req.body.status !== oldVisa.status) {
// //         await emailService.sendStatusUpdateEmail(updatedVisa);
// //       }

// //       res.json({ success: true, data: updatedVisa });
// //     } catch (err) {
// //       next(err);
// //     }
// //   }

// //   async getStatistics(req, res, next) {
// //     try {
// //       res.json({
// //         success: true,
// //         data: {
// //           ...(await statisticsService.getOverallStatistics()),
// //           revenue: await statisticsService.getRevenueStatistics()
// //         }
// //       });
// //     } catch (err) {
// //       next(err);
// //     }
// //   }
// // }

// // /* ===========================
// //    ERROR HANDLER
// // =========================== */

// // const errorHandler = (err, req, res, next) => {
// //   console.error(err);

// //   if (err.name === 'ValidationError') {
// //     return res.status(400).json({
// //       success: false,
// //       errors: Object.values(err.errors).map(e => e.message)
// //     });
// //   }

// //   if (err.code === 11000) {
// //     return res.status(400).json({
// //       success: false,
// //       message: 'Duplicate value'
// //     });
// //   }

// //   res.status(500).json({
// //     success: false,
// //     message: err.message || 'Server error'
// //   });
// // };

// // /* ===========================
// //    EXPORTS
// // =========================== */

// // const statisticsService = new StatisticsService();
// // const inventoryService = new InventoryService();
// // const emailService = new EmailService();

// // module.exports = {
// //   VisaController: new VisaController(),
// //   errorHandler
// // };



// const Visa = require('../models/Visa');
// const nodemailer = require('nodemailer');

// /* ===========================
//    EMAIL SERVICE
// =========================== */

// class EmailService {
//   constructor() {
//     this.transporter = nodemailer.createTransport({
//       host: process.env.SMTP_HOST || 'smtp.gmail.com',
//       port: process.env.SMTP_PORT || 587,
//       secure: false,
//       auth: {
//         user: process.env.SMTP_USER,
//         pass: process.env.SMTP_PASS
//       }
//     });
//   }

//   async sendStatusUpdateEmail(visa) {
//     const messages = {
//       approved: 'Your visa application has been approved.',
//       rejected: 'Your visa application was not approved.',
//       'in-review': 'Your visa application is under review.',
//       pending: 'Your visa application has been received.'
//     };

//     return this.sendMail(
//       visa.email,
//       `Visa Application Update - ${visa.id}`,
//       `Dear ${visa.applicant},\n\n${messages[visa.status] || 'There is an update on your application.'}`
//     );
//   }

//   async sendMail(to, subject, text) {
//     try {
//       await this.transporter.sendMail({
//         from: process.env.SMTP_USER,
//         to,
//         subject,
//         text,
//         html: `<p>${text}</p>`
//       });
//       return { success: true, message: 'Email sent successfully' };
//     } catch (err) {
//       console.error('Email error:', err);
//       return { success: false, message: 'Failed to send email' };
//     }
//   }
// }

// const emailService = new EmailService();

// /* ===========================
//    INVENTORY SERVICE
// =========================== */

// class InventoryService {
//   async getInventoryOverview() {
//     const inventory = await Visa.aggregate([
//       {
//         $group: {
//           _id: { status: '$status', type: '$type' },
//           count: { $sum: 1 },
//           documents: { $sum: '$documents' }
//         }
//       }
//     ]);

//     const [documentStats] = await Visa.aggregate([
//       {
//         $group: {
//           _id: null,
//           totalDocuments: { $sum: '$documents' },
//           avgDocuments: { $avg: '$documents' },
//           maxDocuments: { $max: '$documents' },
//           minDocuments: { $min: '$documents' }
//         }
//       }
//     ]);

//     return {
//       inventory,
//       documentStats: documentStats || {}
//     };
//   }
// }

// const inventoryService = new InventoryService();

// /* ===========================
//    STATISTICS SERVICE
// =========================== */

// class StatisticsService {
//   async getOverallStatistics() {
//     const total = await Visa.countDocuments();

//     const countByStatus = status =>
//       Visa.countDocuments({ status });

//     return {
//       total,
//       pending: await countByStatus('pending'),
//       approved: await countByStatus('approved'),
//       rejected: await countByStatus('rejected'),
//       inReview: await countByStatus('in-review'),
//       byType: await Visa.aggregate([{ $group: { _id: '$type', count: { $sum: 1 } } }]),
//       byCountry: await Visa.aggregate([
//         { $group: { _id: '$country', count: { $sum: 1 } } },
//         { $sort: { count: -1 } },
//         { $limit: 10 }
//       ])
//     };
//   }
// }

// const statisticsService = new StatisticsService();

// /* ===========================
//    VISA CONTROLLER
// =========================== */

// class VisaController {
//   // CREATE
//   async createVisa(req, res, next) {
//     try {
//       const year = new Date().getFullYear();
//       const count = await Visa.countDocuments();

//       const visa = await Visa.create({
//         ...req.body,
//         id: req.body.id || `VISA-${year}-${String(count + 1).padStart(3, '0')}`
//       });

//       await emailService.sendStatusUpdateEmail(visa);

//       res.status(201).json({
//         success: true,
//         data: visa
//       });
//     } catch (err) {
//       next(err);
//     }
//   }

//   // READ ALL
//   async getAllVisas(req, res, next) {
//     try {
//       const {
//         status,
//         type,
//         country,
//         priority,
//         page = 1,
//         limit = 10
//       } = req.query;

//       const filter = {};
//       if (status) filter.status = status;
//       if (type) filter.type = type;
//       if (country) filter.country = country;
//       if (priority) filter.priority = priority;

//       const visas = await Visa.find(filter)
//         .sort({ createdAt: -1 })
//         .skip((page - 1) * limit)
//         .limit(Number(limit));

//       const total = await Visa.countDocuments(filter);

//       res.json({
//         success: true,
//         data: visas,
//         pagination: {
//           total,
//           page: Number(page),
//           limit: Number(limit)
//         }
//       });
//     } catch (err) {
//       next(err);
//     }
//   }

//   // SEARCH
//   async searchVisas(req, res, next) {
//     try {
//       const { query } = req.query;

//       const visas = await Visa.find({
//         $or: [
//           { applicant: new RegExp(query, 'i') },
//           { id: new RegExp(query, 'i') },
//           { email: new RegExp(query, 'i') },
//           { country: new RegExp(query, 'i') }
//         ]
//       }).limit(20);

//       res.json({ success: true, data: visas });
//     } catch (err) {
//       next(err);
//     }
//   }

//   // READ ONE
//   async getVisaById(req, res, next) {
//     try {
//       const visa = await Visa.findOne({ id: req.params.id });
//       if (!visa) {
//         return res.status(404).json({ success: false, message: 'Visa not found' });
//       }
//       res.json({ success: true, data: visa });
//     } catch (err) {
//       next(err);
//     }
//   }

//   // UPDATE
//   async updateVisa(req, res, next) {
//     try {
//       const oldVisa = await Visa.findOne({ id: req.params.id });
//       if (!oldVisa) {
//         return res.status(404).json({ success: false, message: 'Visa not found' });
//       }

//       const visa = await Visa.findOneAndUpdate(
//         { id: req.params.id },
//         req.body,
//         { new: true, runValidators: true }
//       );

//       if (req.body.status && req.body.status !== oldVisa.status) {
//         await emailService.sendStatusUpdateEmail(visa);
//       }

//       res.json({ success: true, data: visa });
//     } catch (err) {
//       next(err);
//     }
//   }

//   // DELETE
//   async deleteVisa(req, res, next) {
//     try {
//       const visa = await Visa.findOneAndDelete({ id: req.params.id });
//       if (!visa) {
//         return res.status(404).json({ success: false, message: 'Visa not found' });
//       }
//       res.json({ success: true, message: 'Visa deleted successfully' });
//     } catch (err) {
//       next(err);
//     }
//   }

//   // BULK UPDATE
//   async bulkUpdate(req, res, next) {
//     try {
//       const { ids, updates } = req.body;

//       const result = await Visa.updateMany(
//         { id: { $in: ids } },
//         updates,
//         { runValidators: true }
//       );

//       res.json({ success: true, data: result });
//     } catch (err) {
//       next(err);
//     }
//   }

//   // STATISTICS
//   async getStatistics(req, res, next) {
//     try {
//       const stats = await statisticsService.getOverallStatistics();
//       res.json({ success: true, data: stats });
//     } catch (err) {
//       next(err);
//     }
//   }

//   // INVENTORY
//   async getInventoryStatistics(req, res, next) {
//     try {
//       const data = await inventoryService.getInventoryOverview();
//       res.json({ success: true, data });
//     } catch (err) {
//       next(err);
//     }
//   }

//   // SEND EMAIL
//   async sendEmail(req, res, next) {
//     try {
//       const { applicationId } = req.body;

//       const visa = await Visa.findOne({ id: applicationId });
//       if (!visa) {
//         return res.status(404).json({ success: false, message: 'Visa not found' });
//       }

//       const result = await emailService.sendStatusUpdateEmail(visa);
//       res.json(result);
//     } catch (err) {
//       next(err);
//     }
//   }
// }

// /* ===========================
//    ERROR HANDLER
// =========================== */

// const errorHandler = (err, req, res, next) => {
//   console.error(err);

//   if (err.name === 'ValidationError') {
//     return res.status(400).json({
//       success: false,
//       errors: Object.values(err.errors).map(e => e.message)
//     });
//   }

//   if (err.code === 11000) {
//     return res.status(400).json({
//       success: false,
//       message: 'Duplicate value error'
//     });
//   }

//   res.status(500).json({
//     success: false,
//     message: err.message || 'Internal server error'
//   });
// };

// module.exports = {
//   VisaController: new VisaController(),
//   errorHandler
// };




const Visa = require('../models/Visa');
const nodemailer = require('nodemailer');

/* ===========================
   CONSTANTS & CONFIGURATION
=========================== */

const VISA_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  IN_REVIEW: 'in-review'
};

const STATUS_TRANSITIONS = {
  [VISA_STATUS.PENDING]: [VISA_STATUS.IN_REVIEW, VISA_STATUS.REJECTED],
  [VISA_STATUS.IN_REVIEW]: [VISA_STATUS.APPROVED, VISA_STATUS.REJECTED, VISA_STATUS.PENDING],
  [VISA_STATUS.APPROVED]: [], // Terminal state
  [VISA_STATUS.REJECTED]: [VISA_STATUS.IN_REVIEW] // Allow re-review
};

/* ===========================
   EMAIL SERVICE
=========================== */

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  async sendStatusUpdateEmail(visa, oldStatus = null) {
    const messages = {
      [VISA_STATUS.APPROVED]: {
        subject: '🎉 Visa Application Approved',
        text: `Congratulations! Your ${visa.type} visa application (${visa.id}) has been approved.`
      },
      [VISA_STATUS.REJECTED]: {
        subject: 'Visa Application Update',
        text: `Your ${visa.type} visa application (${visa.id}) was not approved. Please contact our office for more information.`
      },
      [VISA_STATUS.IN_REVIEW]: {
        subject: 'Visa Application Under Review',
        text: `Your ${visa.type} visa application (${visa.id}) is currently under review. We will notify you once a decision is made.`
      },
      [VISA_STATUS.PENDING]: {
        subject: 'Visa Application Received',
        text: `We have received your ${visa.type} visa application (${visa.id}). It is now pending initial review.`
      }
    };

    const template = messages[visa.status] || {
      subject: 'Visa Application Update',
      text: `There is an update on your ${visa.type} visa application (${visa.id}).`
    };

    return this.sendMail(
      visa.email,
      `${template.subject} - ${visa.id}`,
      `Dear ${visa.applicant},\n\n${template.text}\n\nThank you,\nVisa Processing Team`
    );
  }

  async sendMail(to, subject, text) {
    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_USER,
        to,
        subject,
        text,
        html: `<p>${text.replace(/\n/g, '<br>')}</p>`
      });
      return { success: true, message: 'Email sent successfully' };
    } catch (err) {
      console.error('Email error:', err);
      return { success: false, message: 'Failed to send email' };
    }
  }
}

const emailService = new EmailService();

/* ===========================
   STATISTICS SERVICE
=========================== */

class StatisticsService {
  async getOverallStatistics() {
    const total = await Visa.countDocuments();

    const counts = await Visa.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const mapCount = status =>
      counts.find(c => c._id === status)?.count || 0;

    const pending = mapCount(VISA_STATUS.PENDING);
    const approved = mapCount(VISA_STATUS.APPROVED);
    const rejected = mapCount(VISA_STATUS.REJECTED);
    const inReview = mapCount(VISA_STATUS.IN_REVIEW);

    return {
      total,
      pending,
      approved,
      rejected,
      inReview,
      percentages: {
        pending: total ? ((pending / total) * 100).toFixed(2) : 0,
        approved: total ? ((approved / total) * 100).toFixed(2) : 0,
        rejected: total ? ((rejected / total) * 100).toFixed(2) : 0,
        inReview: total ? ((inReview / total) * 100).toFixed(2) : 0
      },
      byType: await this.groupByField('type'),
      byPriority: await this.groupByField('priority'),
      byCountry: await this.getTopCountries(),
      monthlyStats: await this.getMonthlyStats()
    };
  }

  async groupByField(field) {
    return Visa.aggregate([
      { $group: { _id: `$${field}`, count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
  }

  async getTopCountries() {
    return Visa.aggregate([
      { $group: { _id: '$country', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
  }

  async getMonthlyStats() {
    return Visa.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 },
          approved: {
            $sum: {
              $cond: [{ $eq: ['$status', VISA_STATUS.APPROVED] }, 1, 0]
            }
          },
          pending: {
            $sum: {
              $cond: [{ $eq: ['$status', VISA_STATUS.PENDING] }, 1, 0]
            }
          }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);
  }

  async getRevenueStatistics() {
    // Helper to parse amount string to number
    const parseAmount = {
      $toDouble: {
        $substr: [
          '$amount',
          1,
          { $subtract: [{ $strLenCP: '$amount' }, 1] }
        ]
      }
    };

    const [stats] = await Visa.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: parseAmount },
          avgRevenue: { $avg: parseAmount },
          minRevenue: { $min: parseAmount },
          maxRevenue: { $max: parseAmount }
        }
      }
    ]);

    return stats || {
      totalRevenue: 0,
      avgRevenue: 0,
      minRevenue: 0,
      maxRevenue: 0
    };
  }

  async getStatusChangeHistory() {
    return Visa.aggregate([
      { $match: { statusHistory: { $exists: true, $ne: [] } } },
      { $unwind: '$statusHistory' },
      {
        $group: {
          _id: {
            from: '$statusHistory.from',
            to: '$statusHistory.to'
          },
          count: { $sum: 1 },
          avgTimeHours: { $avg: '$statusHistory.timeInStatusHours' }
        }
      },
      { $sort: { count: -1 } }
    ]);
  }
}

const statisticsService = new StatisticsService();

/* ===========================
   INVENTORY SERVICE
=========================== */

class InventoryService {
  async getInventoryOverview() {
    const inventory = await Visa.aggregate([
      {
        $group: {
          _id: { status: '$status', type: '$type' },
          count: { $sum: 1 },
          documents: { $sum: '$documents' }
        }
      },
      {
        $group: {
          _id: '$_id.status',
          types: { $push: '$$ROOT' },
          totalCount: { $sum: '$count' },
          totalDocuments: { $sum: '$documents' }
        }
      }
    ]);

    const [documentStats] = await Visa.aggregate([
      {
        $group: {
          _id: null,
          totalDocuments: { $sum: '$documents' },
          avgDocuments: { $avg: '$documents' },
          maxDocuments: { $max: '$documents' },
          minDocuments: { $min: '$documents' }
        }
      }
    ]);

    const recentApplications = await this.getRecentApplications(30);

    return {
      inventory,
      documentStats: documentStats || {},
      recentApplications
    };
  }

  async getRecentApplications(days) {
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - days);

    return Visa.aggregate([
      { $match: { createdAt: { $gte: fromDate } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
  }

  async getStatusSummary() {
    return Visa.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          avgProcessingTime: { $avg: { $subtract: ['$updatedAt', '$createdAt'] } },
          minDocuments: { $min: '$documents' },
          maxDocuments: { $max: '$documents' }
        }
      },
      { $sort: { count: -1 } }
    ]);
  }
}

const inventoryService = new InventoryService();

/* ===========================
   STATUS CHANGE FUNCTIONS
=========================== */

class StatusService {
  static isValidTransition(fromStatus, toStatus) {
    if (!fromStatus) return true; // New application
    
    const allowedTransitions = STATUS_TRANSITIONS[fromStatus] || [];
    return allowedTransitions.includes(toStatus);
  }

  static getStatusDisplayName(status) {
    const displayNames = {
      [VISA_STATUS.PENDING]: 'Pending',
      [VISA_STATUS.IN_REVIEW]: 'In Review',
      [VISA_STATUS.APPROVED]: 'Approved',
      [VISA_STATUS.REJECTED]: 'Rejected'
    };
    return displayNames[status] || status;
  }

  static calculateTimeInStatus(oldStatusTimestamp) {
    if (!oldStatusTimestamp) return 0;
    const now = new Date();
    const diffMs = now - new Date(oldStatusTimestamp);
    return Math.round(diffMs / (1000 * 60 * 60)); // Convert to hours
  }
}

/* ===========================
   VISA CONTROLLER
=========================== */

class VisaController {
  // CREATE VISA
  async createVisa(req, res, next) {
    try {
      const year = new Date().getFullYear();
      const count = await Visa.countDocuments();

      const visaData = {
        ...req.body,
        id: req.body.id || `VISA-${year}-${String(count + 1).padStart(3, '0')}`,
        status: VISA_STATUS.PENDING,
        statusHistory: [{
          from: null,
          to: VISA_STATUS.PENDING,
          changedAt: new Date(),
          changedBy: req.user?.id || 'system'
        }]
      };

      const visa = await Visa.create(visaData);
      await emailService.sendStatusUpdateEmail(visa);

      res.status(201).json({ success: true, data: visa });
    } catch (err) {
      next(err);
    }
  }

  // GET ALL VISAS
  async getAllVisas(req, res, next) {
    try {
      const {
        status,
        type,
        country,
        priority,
        page = 1,
        limit = 10,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = req.query;

      const filter = {};
      if (status) filter.status = status;
      if (type) filter.type = type;
      if (country) filter.country = country;
      if (priority) filter.priority = priority;

      const sort = {};
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

      const visas = await Visa.find(filter)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(Number(limit));

      const total = await Visa.countDocuments(filter);

      res.json({
        success: true,
        data: visas,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          pages: Math.ceil(total / limit)
        }
      });
    } catch (err) {
      next(err);
    }
  }

  // SEARCH VISAS
  async searchVisas(req, res, next) {
    try {
      const { query } = req.query;

      const visas = await Visa.find({
        $or: [
          { applicant: new RegExp(query, 'i') },
          { id: new RegExp(query, 'i') },
          { email: new RegExp(query, 'i') },
          { country: new RegExp(query, 'i') },
          { 'contact.phone': new RegExp(query, 'i') }
        ]
      }).limit(20);

      res.json({ success: true, data: visas });
    } catch (err) {
      next(err);
    }
  }

  // GET VISA BY ID
  async getVisaById(req, res, next) {
    try {
      const visa = await Visa.findOne({ id: req.params.id });
      if (!visa) {
        return res.status(404).json({ success: false, message: 'Visa not found' });
      }
      res.json({ success: true, data: visa });
    } catch (err) {
      next(err);
    }
  }

  // UPDATE VISA
  async updateVisa(req, res, next) {
    try {
      const oldVisa = await Visa.findOne({ id: req.params.id });
      if (!oldVisa) {
        return res.status(404).json({ success: false, message: 'Visa not found' });
      }

      const visa = await Visa.findOneAndUpdate(
        { id: req.params.id },
        req.body,
        { new: true, runValidators: true }
      );

      if (req.body.status && req.body.status !== oldVisa.status) {
        await emailService.sendStatusUpdateEmail(visa, oldVisa.status);
      }

      res.json({ success: true, data: visa });
    } catch (err) {
      next(err);
    }
  }

  // DELETE VISA
  async deleteVisa(req, res, next) {
    try {
      const visa = await Visa.findOneAndDelete({ id: req.params.id });
      if (!visa) {
        return res.status(404).json({ success: false, message: 'Visa not found' });
      }
      res.json({ success: true, message: 'Visa deleted successfully' });
    } catch (err) {
      next(err);
    }
  }

  // BULK UPDATE STATUS
  async bulkUpdateStatus(req, res, next) {
    try {
      const { ids, status, reason } = req.body;

      if (!Object.values(VISA_STATUS).includes(status)) {
        return res.status(400).json({ 
          success: false, 
          message: 'Invalid status provided' 
        });
      }

      const visas = await Visa.find({ id: { $in: ids } });
      
      // Check if all transitions are valid
      const invalidTransitions = visas.filter(visa => 
        !StatusService.isValidTransition(visa.status, status)
      );

      if (invalidTransitions.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Cannot change status from ${invalidTransitions[0].status} to ${status} for some applications`
        });
      }

      const updatePromises = visas.map(async (visa) => {
        const statusHistory = [
          ...(visa.statusHistory || []),
          {
            from: visa.status,
            to: status,
            changedAt: new Date(),
            changedBy: req.user?.id || 'system',
            reason: reason,
            timeInStatusHours: StatusService.calculateTimeInStatus(visa.updatedAt)
          }
        ];

        const updatedVisa = await Visa.findOneAndUpdate(
          { id: visa.id },
          { 
            status, 
            statusHistory,
            updatedAt: new Date()
          },
          { new: true }
        );

        // Send email notification
        await emailService.sendStatusUpdateEmail(updatedVisa, visa.status);
        
        return updatedVisa;
      });

      const updatedVisas = await Promise.all(updatePromises);

      res.json({ 
        success: true, 
        message: `Updated ${updatedVisas.length} applications to ${status}`,
        data: updatedVisas 
      });
    } catch (err) {
      next(err);
    }
  }

  // UPDATE SINGLE STATUS
  async updateStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status, reason } = req.body;

      if (!Object.values(VISA_STATUS).includes(status)) {
        return res.status(400).json({ 
          success: false, 
          message: 'Invalid status provided' 
        });
      }

      const oldVisa = await Visa.findOne({ id });
      if (!oldVisa) {
        return res.status(404).json({ success: false, message: 'Visa not found' });
      }

      if (!StatusService.isValidTransition(oldVisa.status, status)) {
        return res.status(400).json({
          success: false,
          message: `Cannot change status from ${oldVisa.status} to ${status}`
        });
      }

      const statusHistory = [
        ...(oldVisa.statusHistory || []),
        {
          from: oldVisa.status,
          to: status,
          changedAt: new Date(),
          changedBy: req.user?.id || 'system',
          reason: reason,
          timeInStatusHours: StatusService.calculateTimeInStatus(oldVisa.updatedAt)
        }
      ];

      const visa = await Visa.findOneAndUpdate(
        { id },
        { 
          status, 
          statusHistory,
          updatedAt: new Date()
        },
        { new: true, runValidators: true }
      );

      await emailService.sendStatusUpdateEmail(visa, oldVisa.status);

      res.json({ 
        success: true, 
        data: visa,
        message: `Status changed from ${oldVisa.status} to ${status}`
      });
    } catch (err) {
      next(err);
    }
  }

  // GET STATUS HISTORY
  async getStatusHistory(req, res, next) {
    try {
      const visa = await Visa.findOne({ id: req.params.id });
      if (!visa) {
        return res.status(404).json({ success: false, message: 'Visa not found' });
      }

      res.json({ 
        success: true, 
        data: visa.statusHistory || [],
        currentStatus: visa.status
      });
    } catch (err) {
      next(err);
    }
  }

  // GET STATUS OPTIONS
  async getStatusOptions(req, res, next) {
    try {
      const { currentStatus } = req.query;
      
      let availableStatuses = Object.values(VISA_STATUS);
      
      if (currentStatus && STATUS_TRANSITIONS[currentStatus]) {
        availableStatuses = [currentStatus, ...STATUS_TRANSITIONS[currentStatus]];
      }

      const options = availableStatuses.map(status => ({
        value: status,
        label: StatusService.getStatusDisplayName(status),
        canTransition: StatusService.isValidTransition(currentStatus, status)
      }));

      res.json({ success: true, data: options });
    } catch (err) {
      next(err);
    }
  }

  // GET STATISTICS
  async getStatistics(req, res, next) {
    try {
      const [overallStats, revenueStats, statusChanges] = await Promise.all([
        statisticsService.getOverallStatistics(),
        statisticsService.getRevenueStatistics(),
        statisticsService.getStatusChangeHistory()
      ]);

      res.json({
        success: true,
        data: {
          ...overallStats,
          revenue: revenueStats,
          statusChangeHistory: statusChanges
        }
      });
    } catch (err) {
      next(err);
    }
  }

  // GET INVENTORY STATISTICS
  async getInventoryStatistics(req, res, next) {
    try {
      const data = await inventoryService.getInventoryOverview();
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  // SEND EMAIL
  async sendEmail(req, res, next) {
    try {
      const { applicationId, customMessage } = req.body;

      const visa = await Visa.findOne({ id: applicationId });
      if (!visa) {
        return res.status(404).json({ success: false, message: 'Visa not found' });
      }

      let result;
      if (customMessage) {
        result = await emailService.sendMail(
          visa.email,
          `Custom Update - ${visa.id}`,
          `Dear ${visa.applicant},\n\n${customMessage}\n\nBest regards,\nVisa Processing Team`
        );
      } else {
        result = await emailService.sendStatusUpdateEmail(visa);
      }

      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  // GET APPLICATIONS BY STATUS
  async getApplicationsByStatus(req, res, next) {
    try {
      const { status } = req.params;
      
      if (!Object.values(VISA_STATUS).includes(status)) {
        return res.status(400).json({ 
          success: false, 
          message: 'Invalid status' 
        });
      }

      const applications = await Visa.find({ status })
        .sort({ createdAt: -1 })
        .limit(100);

      const count = await Visa.countDocuments({ status });

      res.json({
        success: true,
        data: applications,
        count,
        status: StatusService.getStatusDisplayName(status)
      });
    } catch (err) {
      next(err);
    }
  }
}

/* ===========================
   ERROR HANDLER
=========================== */

const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      errors: Object.values(err.errors).map(e => e.message)
    });
  }

  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: 'Duplicate value error - This ID or email already exists'
    });
  }

  res.status(500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
};

/* ===========================
   EXPORTS
=========================== */

module.exports = {
  VisaController: new VisaController(),
  errorHandler,
  VISA_STATUS,
  StatusService
};