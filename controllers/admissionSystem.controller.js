// // UniversityBookingController.js
// const cloudinary = require('../cloudinary/cloudinary');
// const { University, Booking } = require('../models/AdmissionSystem');
// const nodemailer = require('nodemailer');

// class CloudinaryService {
//   async uploadImage(file, folder = 'universities') {
//     try {
//       const result = await cloudinary.uploader.upload(file.tempFilePath, {
//         folder,
//         width: 1200,
//         height: 800,
//         crop: 'fill',
//         quality: 'auto'
//       });
//       return { public_id: result.public_id, url: result.secure_url };
//     } catch (error) {
//       console.error('Cloudinary upload error:', error);
//       throw new Error('Image upload failed');
//     }
//   }

//   async uploadMultipleImages(files, folder = 'universities') {
//     const images = [];
//     for (const file of files) {
//       const image = await this.uploadImage(file, folder);
//       images.push(image);
//     }
//     return images;
//   }

//   async deleteImage(publicId) {
//     try {
//       await cloudinary.uploader.destroy(publicId);
//       return true;
//     } catch (error) {
//       console.error('Cloudinary delete error:', error);
//       throw new Error('Image deletion failed');
//     }
//   }

//   async deleteMultipleImages(publicIds) {
//     for (const publicId of publicIds) {
//       await this.deleteImage(publicId);
//     }
//     return true;
//   }
// }

// class EmailService {
//   constructor() {
//     this.transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         user: process.env.SMTP_USER,
//         pass: process.env.SMTP_PASS
//       }
//     });
//   }

//   async sendBookingConfirmation(booking, university) {
//     const mailOptions = {
//       from: `"University Booking System" <${process.env.SMTP_USER}>`,
//       to: booking.student.email,
//       subject: `Booking Confirmation - ${university.name}`,
//       html: `<p>Your booking with ${university.name} is confirmed!</p>`
//     };
//     try {
//       await this.transporter.sendMail(mailOptions);
//       return true;
//     } catch (error) {
//       console.error('Email send error:', error);
//       return false;
//     }
//   }

//   async sendBookingReminder(booking, university) {
//     const mailOptions = {
//       from: `"University Booking System" <${process.env.SMTP_USER}>`,
//       to: booking.student.email,
//       subject: `Reminder: Your Booking with ${university.name}`,
//       html: `<p>This is a reminder for your booking with ${university.name}.</p>`
//     };
//     try {
//       await this.transporter.sendMail(mailOptions);
//       return true;
//     } catch (error) {
//       console.error('Email send error:', error);
//       return false;
//     }
//   }

//   async sendCancellationEmail(booking, university) {
//     const mailOptions = {
//       from: `"University Booking System" <${process.env.SMTP_USER}>`,
//       to: booking.student.email,
//       subject: `Booking Cancellation - ${university.name}`,
//       html: `<p>Your booking with ${university.name} has been cancelled.</p>`
//     };
//     try {
//       await this.transporter.sendMail(mailOptions);
//       return true;
//     } catch (error) {
//       console.error('Email send error:', error);
//       return false;
//     }
//   }
// }

// class UniversityBookingController {
//   constructor() {
//     this.cloudinaryService = new CloudinaryService();
//     this.emailService = new EmailService();
//     this.defaultImage = [
//       {
//         public_id: 'default_university_image',
//         url: 'https://statik.tempo.co/data/2025/05/23/id_1400719/1400719_720.jpg'
//       }
//     ];
//   }

//   // ================= UNIVERSITY METHODS =================
//   getUniversities = async (req, res) => {
//     try {
//       const universities = await University.find({ isActive: true });
//       const data = universities.map(u => ({
//         ...u.toObject(),
//         images: u.images && u.images.length > 0 ? u.images : this.defaultImage
//       }));
//       res.json({ success: true, data });
//     } catch (err) {
//       res.status(500).json({ success: false, message: err.message });
//     }
//   }

//   getUniversity = async (req, res) => {
//     try {
//       const university = await University.findById(req.params.id);
//       if (!university) return res.status(404).json({ success: false, message: 'Not found' });
//       university.images = university.images && university.images.length > 0 ? university.images : this.defaultImage;
//       res.json({ success: true, data: university });
//     } catch (err) {
//       res.status(500).json({ success: false, message: err.message });
//     }
//   }

//   createUniversity = async (req, res) => {
//     try {
//       let images = this.defaultImage;
//       if (req.files && req.files.images) {
//         const files = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
//         images = await this.cloudinaryService.uploadMultipleImages(files, 'universities');
//       }

//       const university = new University({ ...req.body, images });
//       await university.save();
//       res.status(201).json({ success: true, data: university });
//     } catch (err) {
//       res.status(500).json({ success: false, message: err.message });
//     }
//   }

//   updateUniversity = async (req, res) => {
//     try {
//       const university = await University.findById(req.params.id);
//       if (!university) return res.status(404).json({ success: false, message: 'Not found' });

//       if (req.files && req.files.images) {
//         if (university.images && university.images.length > 0) {
//           const oldIds = university.images.map(i => i.public_id);
//           await this.cloudinaryService.deleteMultipleImages(oldIds);
//         }
//         const files = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
//         university.images = await this.cloudinaryService.uploadMultipleImages(files, 'universities');
//       } else if (!university.images || university.images.length === 0) {
//         university.images = this.defaultImage;
//       }

//       Object.assign(university, req.body);
//       await university.save();
//       res.json({ success: true, data: university });
//     } catch (err) {
//       res.status(500).json({ success: false, message: err.message });
//     }
//   }

//   deleteUniversity = async (req, res) => {
//     try {
//       const university = await University.findById(req.params.id);
//       if (!university) return res.status(404).json({ success: false, message: 'Not found' });

//       if (university.images && university.images.length > 0) {
//         const ids = university.images.map(i => i.public_id);
//         await this.cloudinaryService.deleteMultipleImages(ids);
//       }

//       await university.deleteOne();
//       res.json({ success: true, message: 'Deleted' });
//     } catch (err) {
//       res.status(500).json({ success: false, message: err.message });
//     }
//   }

//   // ================= BOOKING METHODS =================
//   getBookings = async (req, res) => {
//     try {
//       const bookings = await Booking.find().populate('university');
//       res.json({ success: true, data: bookings });
//     } catch (err) {
//       res.status(500).json({ success: false, message: err.message });
//     }
//   }

//   getBooking = async (req, res) => {
//     try {
//       const booking = await Booking.findById(req.params.id).populate('university');
//       if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
//       res.json({ success: true, data: booking });
//     } catch (err) {
//       res.status(500).json({ success: false, message: err.message });
//     }
//   }

//   createBooking = async (req, res) => {
//     try {
//       const { student, university: universityId, bookingDetails } = req.body;
//       const university = await University.findById(universityId);
//       if (!university) return res.status(404).json({ success: false, message: 'University not found' });

//       const booking = new Booking({ student, university: universityId, bookingDetails });
//       await booking.save();
//       await this.emailService.sendBookingConfirmation(booking, university);

//       res.status(201).json({ success: true, data: booking });
//     } catch (err) {
//       res.status(500).json({ success: false, message: err.message });
//     }
//   }

//   updateBookingStatus = async (req, res) => {
//     try {
//       const { id } = req.params;
//       const { status } = req.body;
//       const booking = await Booking.findById(id).populate('university');
//       if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

//       booking.status = status;
//       await booking.save();
//       res.json({ success: true, message: `Booking status updated to ${status}`, data: booking });
//     } catch (err) {
//       res.status(500).json({ success: false, message: err.message });
//     }
//   }

//   cancelBooking = async (req, res) => {
//     try {
//       const { id } = req.params;
//       const booking = await Booking.findById(id).populate('university');
//       if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

//       booking.status = 'cancelled';
//       await booking.save();
//       await this.emailService.sendCancellationEmail(booking, booking.university);

//       res.json({ success: true, message: 'Booking cancelled' });
//     } catch (err) {
//       res.status(500).json({ success: false, message: err.message });
//     }
//   }

//   getStudentBookings = async (req, res) => {
//     try {
//       const { email } = req.params;
//       const bookings = await Booking.find({ 'student.email': email }).populate('university');
//       res.json({ success: true, data: bookings });
//     } catch (err) {
//       res.status(500).json({ success: false, message: err.message });
//     }
//   }

//   sendBookingReminder = async (req, res) => {
//     try {
//       const { id } = req.params;
//       const booking = await Booking.findById(id).populate('university');
//       if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

//       await this.emailService.sendBookingReminder(booking, booking.university);
//       res.json({ success: true, message: 'Reminder sent' });
//     } catch (err) {
//       res.status(500).json({ success: false, message: err.message });
//     }
//   }

//   getDashboardStats = async (req, res) => {
//     try {
//       const totalUniversities = await University.countDocuments();
//       const totalBookings = await Booking.countDocuments();
//       res.json({ success: true, data: { totalUniversities, totalBookings } });
//     } catch (err) {
//       res.status(500).json({ success: false, message: err.message });
//     }
//   }
// }

// module.exports = new UniversityBookingController();

// const cloudinary = require("../cloudinary/cloudinary");
// const { University, Booking } = require("../models/AdmissionSystem");
// const nodemailer = require("nodemailer");
// const streamifier = require("streamifier");

// class CloudinaryService {
//   async uploadImageFromBuffer(fileBuffer, folder = "universities") {
//     return new Promise((resolve, reject) => {
//       const uploadStream = cloudinary.uploader.upload_stream(
//         { folder, width: 1200, height: 800, crop: "fill", quality: "auto" },
//         (error, result) => {
//           if (error) return reject(error);
//           resolve({ public_id: result.public_id, url: result.secure_url });
//         },
//       );
//       streamifier.createReadStream(fileBuffer).pipe(uploadStream);
//     });
//   }

//   async uploadMultipleImages(files, folder = "universities") {
//     const images = [];
//     for (const file of files) {
//       const image = await this.uploadImageFromBuffer(file.buffer, folder);
//       images.push(image);
//     }
//     return images;
//   }

//   async deleteImage(publicId) {
//     try {
//       await cloudinary.uploader.destroy(publicId);
//       return true;
//     } catch (error) {
//       console.error("Cloudinary delete error:", error);
//       throw new Error("Image deletion failed");
//     }
//   }

//   async deleteMultipleImages(publicIds) {
//     for (const publicId of publicIds) await this.deleteImage(publicId);
//     return true;
//   }
// }

// class EmailService {
//   constructor() {
//     this.transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
//     });
//   }

//   async sendBookingConfirmation(booking, university) {
//     try {
//       await this.transporter.sendMail({
//         from: `"University Booking System" <${process.env.SMTP_USER}>`,
//         to: booking.student.email,
//         subject: `Booking Confirmation - ${university.name}`,
//         html: `<p>Your booking with ${university.name} is confirmed!</p>`,
//       });
//       return true;
//     } catch (err) {
//       console.error(err);
//       return false;
//     }
//   }

//   async sendBookingReminder(booking, university) {
//     try {
//       await this.transporter.sendMail({
//         from: `"University Booking System" <${process.env.SMTP_USER}>`,
//         to: booking.student.email,
//         subject: `Reminder: Your Booking with ${university.name}`,
//         html: `<p>This is a reminder for your booking with ${university.name}.</p>`,
//       });
//       return true;
//     } catch (err) {
//       console.error(err);
//       return false;
//     }
//   }

//   async sendCancellationEmail(booking, university) {
//     try {
//       await this.transporter.sendMail({
//         from: `"University Booking System" <${process.env.SMTP_USER}>`,
//         to: booking.student.email,
//         subject: `Booking Cancellation - ${university.name}`,
//         html: `<p>Your booking with ${university.name} has been cancelled.</p>`,
//       });
//       return true;
//     } catch (err) {
//       console.error(err);
//       return false;
//     }
//   }
// }

// class UniversityBookingController {
//   constructor() {
//     this.cloudinaryService = new CloudinaryService();
//     this.emailService = new EmailService();
//     this.defaultImage = [
//       {
//         public_id: "default_university_image",
//         url: "https://statik.tempo.co/data/2025/05/23/id_1400719/1400719_720.jpg",
//       },
//     ];
//   }

//   // ========== Universities ==========
//   getUniversities = async (req, res) => {
//     try {
//       const universities = await University.find({});
//       const data = universities.map((u) => ({
//         ...u.toObject(),
//         images: u.images.length ? u.images : this.defaultImage,
//       }));
//       res.json({ success: true, data });
//     } catch (err) {
//       res.status(500).json({ success: false, message: err.message });
//     }
//   };

//   getUniversity = async (req, res) => {
//     try {
//       const university = await University.findById(req.params.id);
//       if (!university)
//         return res.status(404).json({ success: false, message: "Not found" });
//       university.images = university.images.length
//         ? university.images
//         : this.defaultImage;
//       res.json({ success: true, data: university });
//     } catch (err) {
//       res.status(500).json({ success: false, message: err.message });
//     }
//   };

//   createUniversity = async (req, res) => {
//     try {
//       let images = this.defaultImage;

//       if (req.files?.images) {
//         const files = Array.isArray(req.files.images)
//           ? req.files.images
//           : [req.files.images];
//         images = await this.cloudinaryService.uploadMultipleImages(files);
//       }

//       const university = new University({ ...req.body, images });
//       await university.save();
//       res.status(201).json({ success: true, data: university });
//     } catch (err) {
//       res.status(500).json({ success: false, message: err.message });
//     }
//   };

//   updateUniversity = async (req, res) => {
//     try {
//       const university = await University.findById(req.params.id);
//       if (!university)
//         return res.status(404).json({ success: false, message: "Not found" });

//       if (req.files?.images) {
//         if (university.images.length) {
//           const oldIds = university.images.map((i) => i.public_id);
//           await this.cloudinaryService.deleteMultipleImages(oldIds);
//         }
//         const files = Array.isArray(req.files.images)
//           ? req.files.images
//           : [req.files.images];
//         university.images =
//           await this.cloudinaryService.uploadMultipleImages(files);
//       } else if (!university.images.length) {
//         university.images = this.defaultImage;
//       }

//       Object.assign(university, req.body);
//       await university.save();
//       res.json({ success: true, data: university });
//     } catch (err) {
//       res.status(500).json({ success: false, message: err.message });
//     }
//   };

//   deleteUniversity = async (req, res) => {
//     try {
//       const university = await University.findById(req.params.id);
//       if (!university)
//         return res.status(404).json({ success: false, message: "Not found" });

//       if (university.images.length) {
//         const ids = university.images.map((i) => i.public_id);
//         await this.cloudinaryService.deleteMultipleImages(ids);
//       }

//       await university.deleteOne();
//       res.json({ success: true, message: "Deleted" });
//     } catch (err) {
//       res.status(500).json({ success: false, message: err.message });
//     }
//   };

//   // ========== Bookings ==========
//   getBookings = async (req, res) => {
//     try {
//       const bookings = await Booking.find().populate({
//         path: "university",
//         strictPopulate: false,
//       });
//       res.json({ success: true, data: bookings });
//     } catch (err) {
//       res.status(500).json({ success: false, message: err.message });
//     }
//   };

//   getBooking = async (req, res) => {
//     try {
//       const booking = await Booking.findById(req.params.id).populate({
//         path: "university",
//         strictPopulate: false,
//       });
//       if (!booking)
//         return res
//           .status(404)
//           .json({ success: false, message: "Booking not found" });
//       res.json({ success: true, data: booking });
//     } catch (err) {
//       res.status(500).json({ success: false, message: err.message });
//     }
//   };

//   //   createBooking = async (req, res) => {
//   //     try {
//   //       const { student, university: universityId, bookingDetails } = req.body;
//   //       const university = await University.findById(universityId);
//   //       if (!university) return res.status(404).json({ success: false, message: 'University not found' });

//   //       const booking = new Booking({ student, university: universityId, bookingDetails });
//   //       await booking.save();
//   //       await this.emailService.sendBookingConfirmation(booking, university);
//   //       res.status(201).json({ success: true, data: booking });
//   //     } catch (err) {
//   //       res.status(500).json({ success: false, message: err.message });
//   //     }
//   //   }

//   createBooking = async (req, res) => {
//     try {
//       const { customer, service, university, bookingDetails } = req.body;

//       const uni = await University.findById(university);
//       if (!uni) {
//         return res
//           .status(404)
//           .json({ success: false, message: "University not found" });
//       }

//       const booking = new Booking({
//         university,
//         universityName: uni.name,

//         customer: {
//           fullName: customer.fullName,
//           email: customer.email,
//           phone: customer.phone,
//           targetCountry: customer.targetCountry,
//         },

//         service: {
//           name: service.name,
//         },

//         bookingDetails,
//       });

//       await booking.save();

//       await this.emailService.sendBookingConfirmation(booking, uni);

//       res.status(201).json({ success: true, data: booking });
//     } catch (err) {
//       console.error("Create booking error:", err);
//       res.status(500).json({ success: false, message: err.message });
//     }
//   };

//   updateBookingStatus = async (req, res) => {
//     try {
//       const booking = await Booking.findById(req.params.id).populate({
//         path: "university",
//         strictPopulate: false,
//       });
//       if (!booking)
//         return res
//           .status(404)
//           .json({ success: false, message: "Booking not found" });

//       booking.status = req.body.status;
//       await booking.save();
//       res.json({
//         success: true,
//         message: `Booking status updated to ${booking.status}`,
//         data: booking,
//       });
//     } catch (err) {
//       res.status(500).json({ success: false, message: err.message });
//     }
//   };

//   deleteBooking = async (req, res) => {
//     try {
//       const { id } = req.params;

//       // Find the booking
//       const booking = await Booking.findById(id);
//       if (!booking)
//         return res
//           .status(404)
//           .json({ success: false, message: "Booking not found" });

//       // Delete the booking
//       await booking.deleteOne();

//       res.json({ success: true, message: "Booking deleted successfully" });
//     } catch (err) {
//       console.error("Delete booking error:", err);
//       res.status(500).json({ success: false, message: err.message });
//     }
//   };

//   cancelBooking = async (req, res) => {
//     try {
//       const booking = await Booking.findById(req.params.id).populate({
//         path: "university",
//         strictPopulate: false,
//       });
//       if (!booking)
//         return res
//           .status(404)
//           .json({ success: false, message: "Booking not found" });

//       booking.status = "cancelled";
//       await booking.save();
//       await this.emailService.sendCancellationEmail(
//         booking,
//         booking.university,
//       );

//       res.json({ success: true, message: "Booking cancelled" });
//     } catch (err) {
//       res.status(500).json({ success: false, message: err.message });
//     }
//   };

//   getStudentBookings = async (req, res) => {
//     try {
//       const bookings = await Booking.find({
//         "student.email": req.params.email,
//       }).populate({ path: "university", strictPopulate: false });
//       res.json({ success: true, data: bookings });
//     } catch (err) {
//       res.status(500).json({ success: false, message: err.message });
//     }
//   };

//   sendBookingReminder = async (req, res) => {
//     try {
//       const booking = await Booking.findById(req.params.id).populate({
//         path: "university",
//         strictPopulate: false,
//       });
//       if (!booking)
//         return res
//           .status(404)
//           .json({ success: false, message: "Booking not found" });

//       await this.emailService.sendBookingReminder(booking, booking.university);
//       res.json({ success: true, message: "Reminder sent" });
//     } catch (err) {
//       res.status(500).json({ success: false, message: err.message });
//     }
//   };

//   getDashboardStats = async (req, res) => {
//     try {
//       const totalUniversities = await University.countDocuments();
//       const totalBookings = await Booking.countDocuments();
//       res.json({ success: true, data: { totalUniversities, totalBookings } });
//     } catch (err) {
//       res.status(500).json({ success: false, message: err.message });
//     }
//   };
// }

// module.exports = new UniversityBookingController();

const cloudinary = require("../cloudinary/cloudinary");
const { University, Booking } = require("../models/AdmissionSystem");
const streamifier = require("streamifier");

/* ===================== CLOUDINARY ===================== */
class CloudinaryService {
  uploadFromBuffer(buffer, folder = "universities") {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder, quality: "auto" },
        (err, result) => {
          if (err) return reject(err);
          resolve({ public_id: result.public_id, url: result.secure_url });
        },
      );
      streamifier.createReadStream(buffer).pipe(stream);
    });
  }

  async uploadMultiple(files) {
    const images = [];
    for (const file of files) {
      images.push(await this.uploadFromBuffer(file.buffer));
    }
    return images;
  }

  async deleteMultiple(ids) {
    for (const id of ids) await cloudinary.uploader.destroy(id);
  }
}

const cloudinaryService = new CloudinaryService();

const DEFAULT_IMAGE = [
  {
    public_id: "default",
    url: "https://wenr.wes.org/wp-content/uploads/2019/09/iStock-1142918319_WENR_Ranking_740_430.jpg",
  },
];

/* ===================== UNIVERSITY CRUD ===================== */
exports.createUniversity = async (req, res) => {
  try {
    let images = DEFAULT_IMAGE;

    if (req.files?.images) {
      const files = Array.isArray(req.files.images)
        ? req.files.images
        : [req.files.images];
      images = await cloudinaryService.uploadMultiple(files);
    }

    const university = await University.create({ ...req.body, images });
    res.status(201).json({ success: true, data: university });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.getUniversities = async (_, res) => {
  const data = await University.find();
  res.json({ success: true, data });
};

exports.getUniversity = async (req, res) => {
  const uni = await University.findById(req.params.id);
  if (!uni) return res.status(404).json({ success: false });
  res.json({ success: true, data: uni });
};

exports.updateUniversity = async (req, res) => {
  try {
    const uni = await University.findById(req.params.id);
    if (!uni) return res.status(404).json({ success: false });

    if (req.files?.images) {
      if (uni.images.length)
        await cloudinaryService.deleteMultiple(
          uni.images.map((i) => i.public_id),
        );

      const files = Array.isArray(req.files.images)
        ? req.files.images
        : [req.files.images];
      uni.images = await cloudinaryService.uploadMultiple(files);
    }

    Object.assign(uni, req.body);
    await uni.save();

    res.json({ success: true, data: uni });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.deleteUniversity = async (req, res) => {
  const uni = await University.findById(req.params.id);
  if (!uni) return res.status(404).json({ success: false });

  if (uni.images.length)
    await cloudinaryService.deleteMultiple(uni.images.map((i) => i.public_id));

  await uni.deleteOne();
  res.json({ success: true });
};

/* ===================== BOOKING CRUD ===================== */
exports.createBooking = async (req, res) => {
  try {
    const { university, customer, service, bookingDetails } = req.body;

    const uni = await University.findById(university);
    if (!uni) return res.status(404).json({ success: false });

    const booking = await Booking.create({
      university,
      universityName: uni.name,
      customer,
      service,
      bookingDetails,
    });

    res.status(201).json({ success: true, data: booking });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// exports.getBookings = async (_, res) => {
//   const data = await Booking.find().populate("university");
//   res.json({ success: true, data });
// };
exports.getBookings = async (_, res) => {
  try {
    // Find all bookings and populate 'university' safely
    const bookings = await Booking.find()
      .populate({
        path: "university",
        strictPopulate: false, // avoids strictPopulate errors
        select: "name country city ranking worldRanking", // only include key fields
      })
      .sort({ createdAt: -1 }); // optional: newest first

    res.json({ success: true, data: bookings });
  } catch (error) {
    console.error("Get Bookings Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
      error: error.message,
    });
  }
};

/* ===================== EDIT BOOKING ===================== */
exports.editBooking = async (req, res) => {
  try {
    const { bookingId } = req.params; // booking ID from URL
    const updates = req.body; // fields to update

    // Validate that booking exists
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    // Apply updates
    Object.keys(updates).forEach((key) => {
      booking[key] = updates[key];
    });

    // Save updated booking
    const updatedBooking = await booking.save();

    // Populate university after update
    await updatedBooking.populate({
      path: "university",
      strictPopulate: false,
      select: "name country city ranking worldRanking",
    });

    res.json({ success: true, data: updatedBooking });
  } catch (error) {
    console.error("Edit Booking Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update booking",
      error: error.message,
    });
  }
};

exports.getBooking = async (req, res) => {
  const booking = await Booking.findById(req.params.id).populate("university");
  if (!booking) return res.status(404).json({ success: false });
  res.json({ success: true, data: booking });
};

exports.updateBookingStatus = async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) return res.status(404).json({ success: false });

  booking.status = req.body.status;
  await booking.save();

  res.json({ success: true, data: booking });
};

exports.deleteBooking = async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) return res.status(404).json({ success: false });

  await booking.deleteOne();
  res.json({ success: true });
};

/* ===================== STATISTICS ===================== */
exports.getDashboardStats = async (_, res) => {
  const [universities, bookings, pending, confirmed, cancelled] =
    await Promise.all([
      University.countDocuments(),
      Booking.countDocuments(),
      Booking.countDocuments({ status: "pending" }),
      Booking.countDocuments({ status: "confirmed" }),
      Booking.countDocuments({ status: "cancelled" }),
    ]);

  res.json({
    success: true,
    data: {
      universities,
      bookings,
      status: { pending, confirmed, cancelled },
    },
  });
};
