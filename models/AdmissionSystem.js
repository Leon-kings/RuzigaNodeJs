// const mongoose = require('mongoose');

// // University Schema
// const universitySchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: [true, 'University name is required'],
//     trim: true
//   },
//   country: {
//     type: String,
//     required: [true, 'Country is required']
//   },
//   city: {
//     type: String,
//     required: [true, 'City is required']
//   },
//   ranking: {
//     type: Number,
//     default: 999
//   },
//   worldRanking: {
//     type: Number,
//     default: 1000
//   },
//   programs: [{
//     type: String,
//     default: []
//   }],
//   tuition: {
//     type: String,
//     default: 'Contact for details'
//   },
//   language: {
//     type: String,
//     default: 'English'
//   },
//   deadline: {
//     type: String,
//     default: 'Rolling admission'
//   },
//   scholarships: [{
//     type: String,
//     default: []
//   }],
//   requirements: [{
//     type: String,
//     default: []
//   }],
//   acceptanceRate: {
//     type: String,
//     default: 'Contact for details'
//   },
//   studentPopulation: {
//     type: String,
//     default: 'N/A'
//   },
//   internationalStudents: {
//     type: String,
//     default: 'N/A'
//   },
//   images: [{
//     public_id: String,
//     url: String
//   }],
//   featured: {
//     type: Boolean,
//     default: false
//   },
//   description: {
//     type: String,
//     default: 'A prestigious university offering quality education.'
//   },
//   availableSlots: [{
//     date: Date,
//     time: String,
//     isBooked: {
//       type: Boolean,
//       default: false
//     }
//   }],
//   bookingPrice: {
//     type: Number,
//     default: 0
//   },
//   consultationDuration: {
//     type: Number,
//     default: 30
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   },
//   updatedAt: {
//     type: Date,
//     default: Date.now
//   }
// }, {
//   timestamps: true
// });

// // Booking Schema
// const bookingSchema = new mongoose.Schema({
//   university: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'University',
//     required: [true, 'University is required']
//   },
//   universityName: {
//     type: String,
//     required: true
//   },
//   student: {
//     fullName: {
//       type: String,
//       required: [true, 'Full name is required']
//     },
//     email: {
//       type: String,
//       required: [true, 'Email is required'],
//       lowercase: true,
//       trim: true
//     },
//     phone: {
//       type: String,
//       required: [true, 'Phone number is required']
//     },
//     country: {
//       type: String,
//       required: [true, 'Country is required']
//     },
//     programInterest: {
//       type: String,
//       required: [true, 'Program interest is required']
//     },
//     intakeYear: {
//       type: String,
//       required: [true, 'Intake year is required']
//     }
//   },
//   bookingDetails: {
//     date: {
//       type: Date,
//       required: [true, 'Booking date is required']
//     },
//     time: {
//       type: String,
//       required: [true, 'Booking time is required']
//     },
//     duration: {
//       type: Number,
//       default: 30
//     },
//     type: {
//       type: String,
//       enum: ['virtual', 'in-person'],
//       default: 'virtual'
//     },
//     meetingLink: String
//   },
//   status: {
//     type: String,
//     enum: ['pending', 'confirmed', 'cancelled', 'completed'],
//     default: 'pending'
//   },
//   payment: {
//     amount: {
//       type: Number,
//       default: 0
//     },
//     currency: {
//       type: String,
//       default: 'USD'
//     },
//     status: {
//       type: String,
//       enum: ['pending', 'paid', 'refunded'],
//       default: 'pending'
//     },
//     transactionId: String
//   },
//   notes: String,
//   emailSent: {
//     type: Boolean,
//     default: false
//   },
//   reminderSent: {
//     type: Boolean,
//     default: false
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   },
//   updatedAt: {
//     type: Date,
//     default: Date.now
//   }
// }, {
//   timestamps: true
// });

// // Middleware
// universitySchema.pre('save', function(next) {
//   this.updatedAt = Date.now();
//   next();
// });

// bookingSchema.pre('save', function(next) {
//   this.updatedAt = Date.now();
//   next();
// });

// // Methods
// universitySchema.methods.formatData = function() {
//   return {
//     id: this._id,
//     name: this.name,
//     country: this.country,
//     city: this.city,
//     ranking: this.ranking,
//     worldRanking: this.worldRanking,
//     programs: this.programs,
//     tuition: this.tuition,
//     language: this.language,
//     deadline: this.deadline,
//     scholarships: this.scholarships,
//     requirements: this.requirements,
//     acceptanceRate: this.acceptanceRate,
//     studentPopulation: this.studentPopulation,
//     internationalStudents: this.internationalStudents,
//     images: this.images,
//     featured: this.featured,
//     description: this.description,
//     availableSlots: this.availableSlots,
//     bookingPrice: this.bookingPrice,
//     consultationDuration: this.consultationDuration
//   };
// };

// // Indexes
// bookingSchema.index({ university: 1, status: 1 });
// bookingSchema.index({ 'student.email': 1 });
// bookingSchema.index({ 'bookingDetails.date': 1 });

// // Check if models already exist before creating them
// const University = mongoose.models.University || mongoose.model('University', universitySchema);
// const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);

// module.exports = {
//   University,
//   Booking
// };













// const mongoose = require('mongoose'); 

// // University Schema
// const universitySchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: [true, 'University name is required'],
//     trim: true
//   },
//   country: {
//     type: String,
//     required: [true, 'Country is required']
//   },
//   city: {
//     type: String,
//     required: [true, 'City is required']
//   },
//   ranking: {
//     type: Number,
//     default: 999
//   },
//   worldRanking: {
//     type: Number,
//     default: 1000
//   },
//   programs: [{
//     type: String,
//     default: []
//   }],
//   tuition: {
//     type: String,
//     default: 'Contact for details'
//   },
//   language: {
//     type: String,
//     default: 'English'
//   },
//   deadline: {
//     type: String,
//     default: 'Rolling admission'
//   },
//   scholarships: [{
//     type: String,
//     default: []
//   }],
//   requirements: [{
//     type: String,
//     default: []
//   }],
//   acceptanceRate: {
//     type: String,
//     default: 'Contact for details'
//   },
//   studentPopulation: {
//     type: String,
//     default: 'N/A'
//   },
//   internationalStudents: {
//     type: String,
//     default: 'N/A'
//   },
//   images: [{
//     public_id: String,
//     url: String
//   }],
//   featured: {
//     type: Boolean,
//     default: false
//   },
//   description: {
//     type: String,
//     default: 'A prestigious university offering quality education.'
//   },
//   availableSlots: [{
//     date: Date,
//     time: String,
//     isBooked: {
//       type: Boolean,
//       default: false
//     }
//   }],
//   bookingPrice: {
//     type: Number,
//     default: 0
//   },
//   consultationDuration: {
//     type: Number,
//     default: 30
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   },
//   updatedAt: {
//     type: Date,
//     default: Date.now
//   }
// }, {
//   timestamps: true
// });

// // Booking Schema
// const bookingSchema = new mongoose.Schema({
//   university: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'University',
//     required: [true, 'University is required']
//   },
//   universityName: {
//     type: String,
//     required: true
//   },
//   student: {
//     fullName: {
//       type: String,
//       required: [true, 'Full name is required']
//     },
//     email: {
//       type: String,
//       required: [true, 'Email is required'],
//       lowercase: true,
//       trim: true
//     },
//     phone: {
//       type: String,
//       required: [true, 'Phone number is required']
//     },
//     country: {
//       type: String,
//       required: [true, 'Country is required']
//     },
//     programInterest: {
//       type: String,
//       required: [true, 'Program interest is required']
//     },
//     intakeYear: {
//       type: String,
//       required: [true, 'Intake year is required']
//     }
//   },
//   bookingDetails: {
//     date: {
//       type: Date,
//       required: [true, 'Booking date is required']
//     },
//     time: {
//       type: String,
//       required: [true, 'Booking time is required']
//     },
//     duration: {
//       type: Number,
//       default: 30
//     },
//     type: {
//       type: String,
//       enum: ['virtual', 'in-person'],
//       default: 'virtual'
//     },
//     meetingLink: String
//   },
//   status: {
//     type: String,
//     enum: ['pending', 'confirmed', 'cancelled', 'completed'],
//     default: 'pending'
//   },
//   payment: {
//     amount: {
//       type: Number,
//       default: 0
//     },
//     currency: {
//       type: String,
//       default: 'USD'
//     },
//     status: {
//       type: String,
//       enum: ['pending', 'paid', 'refunded'],
//       default: 'pending'
//     },
//     transactionId: String
//   },
//   notes: String,
//   emailSent: {
//     type: Boolean,
//     default: false
//   },
//   reminderSent: {
//     type: Boolean,
//     default: false
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   },
//   updatedAt: {
//     type: Date,
//     default: Date.now
//   }
// }, {
//   timestamps: true
// });

// // Middleware (without next)
// universitySchema.pre('save', function() {
//   this.updatedAt = Date.now();
// });

// bookingSchema.pre('save', function() {
//   this.updatedAt = Date.now();
// });

// // Methods
// universitySchema.methods.formatData = function() {
//   return {
//     id: this._id,
//     name: this.name,
//     country: this.country,
//     city: this.city,
//     ranking: this.ranking,
//     worldRanking: this.worldRanking,
//     programs: this.programs,
//     tuition: this.tuition,
//     language: this.language,
//     deadline: this.deadline,
//     scholarships: this.scholarships,
//     requirements: this.requirements,
//     acceptanceRate: this.acceptanceRate,
//     studentPopulation: this.studentPopulation,
//     internationalStudents: this.internationalStudents,
//     images: this.images,
//     featured: this.featured,
//     description: this.description,
//     availableSlots: this.availableSlots,
//     bookingPrice: this.bookingPrice,
//     consultationDuration: this.consultationDuration
//   };
// };

// // Indexes
// bookingSchema.index({ university: 1, status: 1 });
// bookingSchema.index({ 'student.email': 1 });
// bookingSchema.index({ 'bookingDetails.date': 1 });

// // Check if models already exist before creating them
// const University = mongoose.models.University || mongoose.model('University', universitySchema);
// const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);

// module.exports = {
//   University,
//   Booking
// };






















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
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS
//       }
//     });
//   }

//   async sendBookingConfirmation(booking, university) {
//     const mailOptions = {
//       from: `"University Booking System" <${process.env.EMAIL_USER}>`,
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
//       from: `"University Booking System" <${process.env.EMAIL_USER}>`,
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
//       from: `"University Booking System" <${process.env.EMAIL_USER}>`,
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


































const mongoose = require('mongoose');

// ================== University Schema ==================
const universitySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  country: { type: String, required: true },
  city: { type: String, required: true },
  ranking: { type: Number, default: 999 },
  worldRanking: { type: Number, default: 1000 },
  programs: { type: [String], default: [] },
  tuition: { type: String, default: 'Contact for details' },
  language: { type: String, default: 'English' },
  deadline: { type: String, default: 'Rolling admission' },
  scholarships: { type: [String], default: [] },
  requirements: { type: [String], default: [] },
  acceptanceRate: { type: String, default: 'Contact for details' },
  studentPopulation: { type: String, default: 'N/A' },
  internationalStudents: { type: String, default: 'N/A' },
  images: { type: [{ public_id: String, url: String }], default: [] },
  featured: { type: Boolean, default: false },
  description: { type: String, default: 'A prestigious university offering quality education.' },
  availableSlots: { type: [{ date: Date, time: String, isBooked: { type: Boolean, default: false } }], default: [] },
  bookingPrice: { type: Number, default: 0 },
  consultationDuration: { type: Number, default: 30 },
}, { timestamps: true });

// ================== Booking Schema ==================
const bookingSchema = new mongoose.Schema({
  university: { type: mongoose.Schema.Types.ObjectId, ref: 'University', required: true },
  student: {
    fullName: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true },
    country: { type: String, required: true },
    programInterest: { type: String, required: true },
    intakeYear: { type: String, required: true }
  },
  bookingDetails: {
    date: { type: Date, required: true },
    time: { type: String, required: true },
    duration: { type: Number, default: 30 },
    type: { type: String, enum: ['virtual', 'in-person'], default: 'virtual' },
    meetingLink: String
  },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled', 'completed'], default: 'pending' },
  payment: {
    amount: { type: Number, default: 0 },
    currency: { type: String, default: 'USD' },
    status: { type: String, enum: ['pending', 'paid', 'refunded'], default: 'pending' },
    transactionId: String
  },
  notes: String,
  emailSent: { type: Boolean, default: false },
  reminderSent: { type: Boolean, default: false },
}, { timestamps: true });

// ================== Indexes ==================
bookingSchema.index({ university: 1, status: 1 });
bookingSchema.index({ 'student.email': 1 });
bookingSchema.index({ 'bookingDetails.date': 1 });

// ================== Export Models ==================
const University = mongoose.models.University || mongoose.model('University', universitySchema);
const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);

module.exports = { University, Booking };
