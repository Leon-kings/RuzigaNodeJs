// const mongoose = require("mongoose");
// const nodemailer = require("nodemailer");
// const cloudinary = require("cloudinary").v2;
// const AdmissionManagement = require("../models/AdmissionBooking");

// // ====================
// // EMAIL TRANSPORT
// // ====================
// const transporter = nodemailer.createTransport({
//   host: process.env.SMTP_HOST,
//   port: process.env.SMTP_PORT,
//   secure: false,
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASS,
//   },
// });

// // ====================
// // CONTROLLER
// // ====================
// class AdmissionController {
//   constructor() {}

//   // ====================
//   // CREATE METHODS
//   // ====================

//   async createBooking(req, res) {
//     try {
//       const booking = JSON.parse(req.body.booking);

//       const record = await AdmissionManagement.create({
//         recordType: "booking",
//         booking,
//         createdBy: req.user?._id || null,
//       });

//       res.status(201).json({
//         success: true,
//         message: "Booking created successfully",
//         data: record,
//       });
//     } catch (error) {
//       console.error("Create booking error:", error);
//       res.status(500).json({
//         success: false,
//         message: "Failed to create booking",
//         error: error.message,
//       });
//     }
//   }

//   async createUniversity(req, res) {
//     try {
//       const university = JSON.parse(req.body.university);

//       if (req.files?.logo) {
//         university.logo = req.files.logo[0].path;
//       }

//       if (req.files?.images) {
//         university.images = req.files.images.map((f) => f.path);
//       }

//       const record = await AdmissionManagement.create({
//         recordType: "university",
//         university,
//         createdBy: req.user?._id || null,
//       });

//       res.status(201).json({
//         success: true,
//         message: "University created successfully",
//         data: record,
//       });
//     } catch (error) {
//       console.error("Create university error:", error);
//       res.status(500).json({
//         success: false,
//         message: "Failed to create university",
//         error: error.message,
//       });
//     }
//   }

//   async createApplication(req, res) {
//     try {
//       const application = JSON.parse(req.body.application);

//       if (req.files) {
//         application.documents = req.files.map((f) => f.path);
//       }

//       const record = await AdmissionManagement.create({
//         recordType: "application",
//         application,
//         createdBy: req.user?._id || null,
//       });

//       res.status(201).json({
//         success: true,
//         message: "Application created successfully",
//         data: record,
//       });
//     } catch (error) {
//       console.error("Create application error:", error);
//       res.status(500).json({
//         success: false,
//         message: "Failed to create application",
//         error: error.message,
//       });
//     }
//   }

//   // ====================
//   // READ METHODS
//   // ====================

//   async getRecords(req, res) {
//     try {
//       const { recordType } = req.params;

//       const records = await AdmissionManagement.find(
//         recordType ? { recordType } : {}
//       ).sort({ createdAt: -1 });

//       res.json({
//         success: true,
//         data: records,
//       });
//     } catch (error) {
//       console.error("Get records error:", error);
//       res.status(500).json({
//         success: false,
//         message: "Failed to fetch records",
//         error: error.message,
//       });
//     }
//   }

//   async getUserRecords(req, res) {
//     try {
//       const { recordType } = req.params;

//       const records = await AdmissionManagement.find({
//         recordType,
//         createdBy: req.user?._id,
//       }).sort({ createdAt: -1 });

//       res.json({
//         success: true,
//         data: records,
//       });
//     } catch (error) {
//       console.error("Get user records error:", error);
//       res.status(500).json({
//         success: false,
//         message: "Failed to fetch user records",
//         error: error.message,
//       });
//     }
//   }

//   async getRecord(req, res) {
//     try {
//       const record = await AdmissionManagement.findById(req.params.id);

//       if (!record) {
//         return res.status(404).json({
//           success: false,
//           message: "Record not found",
//         });
//       }

//       res.json({
//         success: true,
//         data: record,
//       });
//     } catch (error) {
//       console.error("Get record error:", error);
//       res.status(500).json({
//         success: false,
//         message: "Failed to fetch record",
//         error: error.message,
//       });
//     }
//   }

//   // ====================
//   // UPDATE / DELETE
//   // ====================

//   async updateRecord(req, res) {
//     try {
//       const record = await AdmissionManagement.findByIdAndUpdate(
//         req.params.id,
//         req.body,
//         { new: true }
//       );

//       res.json({
//         success: true,
//         message: "Record updated successfully",
//         data: record,
//       });
//     } catch (error) {
//       console.error("Update record error:", error);
//       res.status(500).json({
//         success: false,
//         message: "Failed to update record",
//         error: error.message,
//       });
//     }
//   }

//   async deleteRecord(req, res) {
//     try {
//       await AdmissionManagement.findByIdAndDelete(req.params.id);

//       res.json({
//         success: true,
//         message: "Record deleted successfully",
//       });
//     } catch (error) {
//       console.error("Delete record error:", error);
//       res.status(500).json({
//         success: false,
//         message: "Failed to delete record",
//         error: error.message,
//       });
//     }
//   }

//   // ====================
//   // STATISTICS
//   // ====================

//   async getStatistics(req, res) {
//     try {
//       const { recordType } = req.params;
//       const count = await AdmissionManagement.countDocuments({ recordType });

//       res.json({
//         success: true,
//         count,
//       });
//     } catch (error) {
//       console.error("Get statistics error:", error);
//       res.status(500).json({
//         success: false,
//         message: "Failed to get statistics",
//         error: error.message,
//       });
//     }
//   }

//   async getDashboardStatistics(req, res) {
//     try {
//       const result = await this.getDashboardStatsService();

//       if (!result.success) {
//         return res.status(500).json(result);
//       }

//       res.json(result);
//     } catch (error) {
//       console.error("Get dashboard statistics error:", error);
//       res.status(500).json({
//         success: false,
//         message: "Failed to get dashboard statistics",
//         error: error.message,
//       });
//     }
//   }

//   async getAnalytics(req, res) {
//     try {
//       const { type } = req.params;
//       const {
//         startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
//         endDate = new Date().toISOString(),
//       } = req.query;

//       let result;

//       switch (type) {
//         case "application":
//           result = await this.getApplicationAnalytics(startDate, endDate);
//           break;
//         case "booking":
//           result = await this.getBookingAnalytics(startDate, endDate);
//           break;
//         case "university":
//           result = await this.getUniversityAnalytics();
//           break;
//         default:
//           return res.status(400).json({
//             success: false,
//             message: "Invalid analytics type",
//           });
//       }

//       res.json(result);
//     } catch (error) {
//       console.error("Get analytics error:", error);
//       res.status(500).json({
//         success: false,
//         message: "Failed to get analytics",
//         error: error.message,
//       });
//     }
//   }

//   // ====================
//   // BOOKING REMINDERS
//   // ====================

//   async sendBookingReminders(req, res) {
//     try {
//       const tomorrow = new Date();
//       tomorrow.setDate(tomorrow.getDate() + 1);

//       const bookings = await AdmissionManagement.find({
//         recordType: "booking",
//         isActive: true,
//         "booking.status": { $in: ["confirmed", "pending"] },
//         "booking.details.bookingDate": {
//           $gte: new Date(tomorrow.setHours(0, 0, 0, 0)),
//           $lt: new Date(tomorrow.setHours(23, 59, 59, 999)),
//         },
//         "booking.reminderSent": false,
//       });

//       const results = [];

//       for (const booking of bookings) {
//         try {
//           await this.sendEmail(
//             booking.booking.visitor.email,
//             "Booking Reminder",
//             "booking_reminder",
//             booking.booking
//           );

//           booking.booking.reminderSent = true;
//           await booking.save();

//           results.push({ bookingId: booking.recordId, success: true });
//         } catch (err) {
//           results.push({
//             bookingId: booking.recordId,
//             success: false,
//             error: err.message,
//           });
//         }
//       }

//       res.json({
//         success: true,
//         results,
//       });
//     } catch (error) {
//       console.error("Send booking reminders error:", error);
//       res.status(500).json({
//         success: false,
//         message: "Failed to send booking reminders",
//         error: error.message,
//       });
//     }
//   }

//   // ====================
//   // HELPERS
//   // ====================

//   async sendEmail(to, subject, template, data) {
//     await transporter.sendMail({
//       from: process.env.SMTP_FROM,
//       to,
//       subject,
//       html: `<pre>${JSON.stringify(data, null, 2)}</pre>`,
//     });

//     return { success: true };
//   }

//   getNextStepsForStatus(status) {
//     const steps = {
//       submitted: "Awaiting review",
//       accepted: "Proceed with enrollment",
//       rejected: "Application rejected",
//     };
//     return steps[status] || "Check portal for updates";
//   }
// }

// // ====================
// // EXPORT (IMPORTANT)
// // ====================
// module.exports = new AdmissionController();







































const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const AdmissionManagement = require("../models/AdmissionBooking");

// ====================
// EMAIL TRANSPORT
// ====================
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// ====================
// CONTROLLER
// ====================
class AdmissionController {
  constructor() {}

  // ====================
  // CREATE METHODS
  // ====================
  async createBooking(req, res) {
    try {
      const booking = JSON.parse(req.body.booking);

      const record = await AdmissionManagement.create({
        recordType: "booking",
        booking,
        createdBy: req.user?._id || null,
      });

      res.status(201).json({
        success: true,
        message: "Booking created successfully",
        data: record,
      });
    } catch (error) {
      console.error("Create booking error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create booking",
        error: error.message,
      });
    }
  }

  async createUniversity(req, res) {
    try {
      const university = req.body.university;

      // Remove image/logo handling
      // Just save university data as-is
      const record = await AdmissionManagement.create({
        recordType: "university",
        university,
        createdBy: req.user?._id || null,
      });

      res.status(201).json({
        success: true,
        message: "University created successfully",
        data: record,
      });
    } catch (error) {
      console.error("Create university error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create university",
        error: error.message,
      });
    }
  }

  async createApplication(req, res) {
    try {
      const application = JSON.parse(req.body.application);

      if (req.files) {
        application.documents = req.files.map((f) => f.path);
      }

      const record = await AdmissionManagement.create({
        recordType: "application",
        application,
        createdBy: req.user?._id || null,
      });

      res.status(201).json({
        success: true,
        message: "Application created successfully",
        data: record,
      });
    } catch (error) {
      console.error("Create application error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create application",
        error: error.message,
      });
    }
  }

  // ====================
  // READ METHODS
  // ====================
  async getRecords(req, res) {
    try {
      const { recordType } = req.params;

      const records = await AdmissionManagement.find(
        recordType ? { recordType } : {}
      ).sort({ createdAt: -1 });

      res.json({
        success: true,
        data: records,
      });
    } catch (error) {
      console.error("Get records error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch records",
        error: error.message,
      });
    }
  }

  async getUserRecords(req, res) {
    try {
      const { recordType } = req.params;

      const records = await AdmissionManagement.find({
        recordType,
        createdBy: req.user?._id,
      }).sort({ createdAt: -1 });

      res.json({
        success: true,
        data: records,
      });
    } catch (error) {
      console.error("Get user records error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch user records",
        error: error.message,
      });
    }
  }

  async getRecord(req, res) {
    try {
      const record = await AdmissionManagement.findById(req.params.id);

      if (!record) {
        return res.status(404).json({
          success: false,
          message: "Record not found",
        });
      }

      res.json({
        success: true,
        data: record,
      });
    } catch (error) {
      console.error("Get record error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch record",
        error: error.message,
      });
    }
  }

  // ====================
  // UPDATE / DELETE
  // ====================
  async updateRecord(req, res) {
    try {
      const record = await AdmissionManagement.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

      res.json({
        success: true,
        message: "Record updated successfully",
        data: record,
      });
    } catch (error) {
      console.error("Update record error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update record",
        error: error.message,
      });
    }
  }

  async deleteRecord(req, res) {
    try {
      await AdmissionManagement.findByIdAndDelete(req.params.id);

      res.json({
        success: true,
        message: "Record deleted successfully",
      });
    } catch (error) {
      console.error("Delete record error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to delete record",
        error: error.message,
      });
    }
  }

  // ====================
  // STATISTICS
  // ====================
  async getStatistics(req, res) {
    try {
      const { recordType } = req.params;
      const count = await AdmissionManagement.countDocuments({ recordType });

      res.json({
        success: true,
        count,
      });
    } catch (error) {
      console.error("Get statistics error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to get statistics",
        error: error.message,
      });
    }
  }

  async getDashboardStatistics(req, res) {
    try {
      const result = { success: true, data: {} };

      res.json(result);
    } catch (error) {
      console.error("Get dashboard statistics error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to get dashboard statistics",
        error: error.message,
      });
    }
  }

  async getAnalytics(req, res) {
    try {
      const { type } = req.params;
      const {
        startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        endDate = new Date().toISOString(),
      } = req.query;

      let result;

      switch (type) {
        case "application":
          result = await AdmissionManagement.find({
            recordType: "application",
            createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
          });
          break;
        case "booking":
          result = await AdmissionManagement.find({
            recordType: "booking",
            createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
          });
          break;
        case "university":
          result = await AdmissionManagement.find({ recordType: "university" });
          break;
        default:
          return res.status(400).json({
            success: false,
            message: "Invalid analytics type",
          });
      }

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error("Get analytics error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to get analytics",
        error: error.message,
      });
    }
  }

  // ====================
  // BOOKING REMINDERS
  // ====================
  async sendBookingReminders(req, res) {
    try {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      const bookings = await AdmissionManagement.find({
        recordType: "booking",
        isActive: true,
        "booking.status": { $in: ["confirmed", "pending"] },
        "booking.details.bookingDate": {
          $gte: new Date(tomorrow.setHours(0, 0, 0, 0)),
          $lt: new Date(tomorrow.setHours(23, 59, 59, 999)),
        },
        "booking.reminderSent": false,
      });

      const results = [];

      for (const booking of bookings) {
        try {
          await this.sendEmail(
            booking.booking.visitor.email,
            "Booking Reminder",
            "booking_reminder",
            booking.booking
          );

          booking.booking.reminderSent = true;
          await booking.save();

          results.push({ bookingId: booking.recordId, success: true });
        } catch (err) {
          results.push({
            bookingId: booking.recordId,
            success: false,
            error: err.message,
          });
        }
      }

      res.json({
        success: true,
        results,
      });
    } catch (error) {
      console.error("Send booking reminders error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to send booking reminders",
        error: error.message,
      });
    }
  }

  // ====================
  // HELPERS
  // ====================
  async sendEmail(to, subject, template, data) {
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject,
      html: `<pre>${JSON.stringify(data, null, 2)}</pre>`,
    });

    return { success: true };
  }

  getNextStepsForStatus(status) {
    const steps = {
      submitted: "Awaiting review",
      accepted: "Proceed with enrollment",
      rejected: "Application rejected",
    };
    return steps[status] || "Check portal for updates";
  }
}

// ====================
// EXPORT
// ====================
module.exports = new AdmissionController();
