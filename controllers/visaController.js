// const Visa = require('../models/Visa');
// const nodemailer = require('nodemailer');

// /* ===========================
//    CONSTANTS & HELPERS
// =========================== */

// const VISA_STATUS = {
//   PENDING: 'pending',
//   APPROVED: 'approved',
//   REJECTED: 'rejected',
//   IN_REVIEW: 'in-review'
// };

// // Convert "$123.45" → 123.45
// const parseAmount = {
//   $toDouble: { $substr: ['$amount', 1, -1] }
// };

// /* ===========================
//    STATISTICS SERVICE
// =========================== */

// class StatisticsService {
//   async getOverallStatistics() {
//     const total = await Visa.countDocuments();

//     const counts = await Visa.aggregate([
//       { $group: { _id: '$status', count: { $sum: 1 } } }
//     ]);

//     const mapCount = status =>
//       counts.find(c => c._id === status)?.count || 0;

//     const pending = mapCount(VISA_STATUS.PENDING);
//     const approved = mapCount(VISA_STATUS.APPROVED);
//     const rejected = mapCount(VISA_STATUS.REJECTED);
//     const inReview = mapCount(VISA_STATUS.IN_REVIEW);

//     return {
//       total,
//       pending,
//       approved,
//       rejected,
//       inReview,
//       percentages: {
//         pending: total ? ((pending / total) * 100).toFixed(2) : 0,
//         approved: total ? ((approved / total) * 100).toFixed(2) : 0
//       },
//       byType: await this.groupByField('type'),
//       byPriority: await this.groupByField('priority'),
//       byCountry: await this.getTopCountries(),
//       monthlyStats: await this.getMonthlyStats()
//     };
//   }

//   async groupByField(field) {
//     return Visa.aggregate([
//       { $group: { _id: `$${field}`, count: { $sum: 1 } } }
//     ]);
//   }

//   async getTopCountries() {
//     return Visa.aggregate([
//       { $group: { _id: '$country', count: { $sum: 1 } } },
//       { $sort: { count: -1 } },
//       { $limit: 10 }
//     ]);
//   }

//   async getMonthlyStats() {
//     return Visa.aggregate([
//       {
//         $group: {
//           _id: {
//             year: { $year: '$date' },
//             month: { $month: '$date' }
//           },
//           count: { $sum: 1 },
//           approved: {
//             $sum: {
//               $cond: [{ $eq: ['$status', VISA_STATUS.APPROVED] }, 1, 0]
//             }
//           },
//           revenue: { $sum: parseAmount }
//         }
//       },
//       { $sort: { '_id.year': 1, '_id.month': 1 } }
//     ]);
//   }

//   async getRevenueStatistics() {
//     const [stats] = await Visa.aggregate([
//       {
//         $group: {
//           _id: null,
//           totalRevenue: { $sum: parseAmount },
//           avgRevenue: { $avg: parseAmount },
//           minRevenue: { $min: parseAmount },
//           maxRevenue: { $max: parseAmount }
//         }
//       }
//     ]);

//     return stats || {
//       totalRevenue: 0,
//       avgRevenue: 0,
//       minRevenue: 0,
//       maxRevenue: 0
//     };
//   }
// }

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
//       },
//       {
//         $group: {
//           _id: '$_id.status',
//           types: { $push: '$$ROOT' },
//           totalCount: { $sum: '$count' },
//           totalDocuments: { $sum: '$documents' }
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

//     const recentApplications = await this.getRecentApplications(30);

//     return {
//       inventory,
//       documentStats: documentStats || {},
//       recentApplications
//     };
//   }

//   async getRecentApplications(days) {
//     const fromDate = new Date();
//     fromDate.setDate(fromDate.getDate() - days);

//     return Visa.aggregate([
//       { $match: { createdAt: { $gte: fromDate } } },
//       {
//         $group: {
//           _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
//           count: { $sum: 1 }
//         }
//       },
//       { $sort: { _id: 1 } }
//     ]);
//   }
// }

// /* ===========================
//    EMAIL SERVICE
// =========================== */

// class EmailService {
//   constructor() {
//     this.transporter = nodemailer.createTransport({
//       host: process.env.SMT_ || 'smtp.gmail.com',
//       port: process.env.SMTP_PORT || 587,
//       secure: false,
//       auth: {
//         user: process.env.SMTP_USER,
//         pass: process.env.SMTP_PASS
//       }
//     });
//   }

//   async sendStatusUpdateEmail(visa) {
//     const templates = {
//       approved: 'has been approved 🎉',
//       rejected: 'was not approved',
//       'in-review': 'is currently under review',
//       pending: 'has been received'
//     };

//     const subject = `Visa Application Update - ${visa.id}`;
//     const message = templates[visa.status] || 'has an update';

//     return this.sendMail(
//       visa.email,
//       subject,
//       `Dear ${visa.applicant}, your ${visa.type} visa application ${message}.`
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
//       return { success: true };
//     } catch (err) {
//       console.error(err);
//       return { success: false };
//     }
//   }
// }

// /* ===========================
//    CONTROLLER
// =========================== */

// class VisaController {
//   async createVisa(req, res, next) {
//     try {
//       const year = new Date().getFullYear();
//       const count = await Visa.countDocuments();

//       const visa = await Visa.create({
//         ...req.body,
//         id: req.body.id || `VISA-${year}-${String(count + 1).padStart(3, '0')}`
//       });

//       await emailService.sendStatusUpdateEmail(visa);

//       res.status(201).json({ success: true, data: visa });
//     } catch (err) {
//       next(err);
//     }
//   }

//   async updateVisa(req, res, next) {
//     try {
//       const oldVisa = await Visa.findOne({ id: req.params.id });
//       if (!oldVisa) return res.status(404).json({ success: false });

//       const updatedVisa = await Visa.findOneAndUpdate(
//         { id: req.params.id },
//         req.body,
//         { new: true, runValidators: true }
//       );

//       if (req.body.status && req.body.status !== oldVisa.status) {
//         await emailService.sendStatusUpdateEmail(updatedVisa);
//       }

//       res.json({ success: true, data: updatedVisa });
//     } catch (err) {
//       next(err);
//     }
//   }

//   async getStatistics(req, res, next) {
//     try {
//       res.json({
//         success: true,
//         data: {
//           ...(await statisticsService.getOverallStatistics()),
//           revenue: await statisticsService.getRevenueStatistics()
//         }
//       });
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
//       message: 'Duplicate value'
//     });
//   }

//   res.status(500).json({
//     success: false,
//     message: err.message || 'Server error'
//   });
// };

// /* ===========================
//    EXPORTS
// =========================== */

// const statisticsService = new StatisticsService();
// const inventoryService = new InventoryService();
// const emailService = new EmailService();

// module.exports = {
//   VisaController: new VisaController(),
//   errorHandler
// };



const Visa = require('../models/Visa');
const nodemailer = require('nodemailer');

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

  async sendStatusUpdateEmail(visa) {
    const messages = {
      approved: 'Your visa application has been approved.',
      rejected: 'Your visa application was not approved.',
      'in-review': 'Your visa application is under review.',
      pending: 'Your visa application has been received.'
    };

    return this.sendMail(
      visa.email,
      `Visa Application Update - ${visa.id}`,
      `Dear ${visa.applicant},\n\n${messages[visa.status] || 'There is an update on your application.'}`
    );
  }

  async sendMail(to, subject, text) {
    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_USER,
        to,
        subject,
        text,
        html: `<p>${text}</p>`
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

    return {
      inventory,
      documentStats: documentStats || {}
    };
  }
}

const inventoryService = new InventoryService();

/* ===========================
   STATISTICS SERVICE
=========================== */

class StatisticsService {
  async getOverallStatistics() {
    const total = await Visa.countDocuments();

    const countByStatus = status =>
      Visa.countDocuments({ status });

    return {
      total,
      pending: await countByStatus('pending'),
      approved: await countByStatus('approved'),
      rejected: await countByStatus('rejected'),
      inReview: await countByStatus('in-review'),
      byType: await Visa.aggregate([{ $group: { _id: '$type', count: { $sum: 1 } } }]),
      byCountry: await Visa.aggregate([
        { $group: { _id: '$country', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ])
    };
  }
}

const statisticsService = new StatisticsService();

/* ===========================
   VISA CONTROLLER
=========================== */

class VisaController {
  // CREATE
  async createVisa(req, res, next) {
    try {
      const year = new Date().getFullYear();
      const count = await Visa.countDocuments();

      const visa = await Visa.create({
        ...req.body,
        id: req.body.id || `VISA-${year}-${String(count + 1).padStart(3, '0')}`
      });

      await emailService.sendStatusUpdateEmail(visa);

      res.status(201).json({
        success: true,
        data: visa
      });
    } catch (err) {
      next(err);
    }
  }

  // READ ALL
  async getAllVisas(req, res, next) {
    try {
      const {
        status,
        type,
        country,
        priority,
        page = 1,
        limit = 10
      } = req.query;

      const filter = {};
      if (status) filter.status = status;
      if (type) filter.type = type;
      if (country) filter.country = country;
      if (priority) filter.priority = priority;

      const visas = await Visa.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit));

      const total = await Visa.countDocuments(filter);

      res.json({
        success: true,
        data: visas,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit)
        }
      });
    } catch (err) {
      next(err);
    }
  }

  // SEARCH
  async searchVisas(req, res, next) {
    try {
      const { query } = req.query;

      const visas = await Visa.find({
        $or: [
          { applicant: new RegExp(query, 'i') },
          { id: new RegExp(query, 'i') },
          { email: new RegExp(query, 'i') },
          { country: new RegExp(query, 'i') }
        ]
      }).limit(20);

      res.json({ success: true, data: visas });
    } catch (err) {
      next(err);
    }
  }

  // READ ONE
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

  // UPDATE
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
        await emailService.sendStatusUpdateEmail(visa);
      }

      res.json({ success: true, data: visa });
    } catch (err) {
      next(err);
    }
  }

  // DELETE
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

  // BULK UPDATE
  async bulkUpdate(req, res, next) {
    try {
      const { ids, updates } = req.body;

      const result = await Visa.updateMany(
        { id: { $in: ids } },
        updates,
        { runValidators: true }
      );

      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  // STATISTICS
  async getStatistics(req, res, next) {
    try {
      const stats = await statisticsService.getOverallStatistics();
      res.json({ success: true, data: stats });
    } catch (err) {
      next(err);
    }
  }

  // INVENTORY
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
      const { applicationId } = req.body;

      const visa = await Visa.findOne({ id: applicationId });
      if (!visa) {
        return res.status(404).json({ success: false, message: 'Visa not found' });
      }

      const result = await emailService.sendStatusUpdateEmail(visa);
      res.json(result);
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
      message: 'Duplicate value error'
    });
  }

  res.status(500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
};

module.exports = {
  VisaController: new VisaController(),
  errorHandler
};
