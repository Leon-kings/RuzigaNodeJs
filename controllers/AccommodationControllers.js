// const { Accommodation, Booking } = require('../models/Accommodation');
// const nodemailer = require('nodemailer');
// const mongoose = require('mongoose');
// const { 
//   uploadMultipleImages, 
//   uploadSingleImage, 
//   generateThumbnailUrl,
//   deleteImageFromCloudinary,
//   cloudinary 
// } = require('../services/accomodationCloudinaryConfig');

// // Email configuration
// const transporter = nodemailer.createTransport({
//   host: process.env.SMTP_HOST || 'smtp.gmail.com',
//   port: process.env.SMTP_PORT || 587,
//   secure: false,
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASS
//   }
// });

// // Email Services
// const emailService = {
//   // Send booking confirmation
//   sendBookingConfirmation: async (booking, accommodation) => {
//     const mailOptions = {
//       from: `"Student Accommodation" <${process.env.SMTP_USER}>`,
//       to: booking.email,
//       subject: `Booking Confirmation - ${booking.bookingReference}`,
//       html: `
//         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//           <h2 style="color: #2c3e50;">Booking Confirmation</h2>
//           <p>Dear ${booking.firstName} ${booking.lastName},</p>
          
//           <h3 style="color: #3498db;">Booking Details</h3>
//           <p><strong>Reference:</strong> ${booking.bookingReference}</p>
//           <p><strong>Status:</strong> ${booking.status}</p>
//           <p><strong>Accommodation:</strong> ${accommodation.name}</p>
//           <p><strong>Location:</strong> ${accommodation.city}, ${accommodation.country}</p>
//           <p><strong>Arrival:</strong> ${new Date(booking.arrivalDate).toLocaleDateString()}</p>
//           <p><strong>Departure:</strong> ${new Date(booking.departureDate).toLocaleDateString()}</p>
//           <p><strong>Duration:</strong> ${booking.duration}</p>
          
//           <h3 style="color: #3498db;">Contact Information</h3>
//           <p><strong>Accommodation Contact:</strong> ${accommodation.contact}</p>
          
//           ${accommodation.images && accommodation.images.length > 0 ? 
//             `<div style="margin: 20px 0;">
//               <img src="${accommodation.images[0].url}" alt="${accommodation.name}" style="max-width: 100%; border-radius: 8px;">
//             </div>` : ''
//           }
          
//           <p>Thank you for choosing our service!</p>
//           <p>Best regards,<br>Student Accommodation Team</p>
//         </div>
//       `
//     };

//     try {
//       await transporter.sendMail(mailOptions);
//       console.log(`Booking confirmation email sent to ${booking.email}`);
//       return true;
//     } catch (error) {
//       console.error('Error sending booking confirmation email:', error);
//       return false;
//     }
//   },

//   // Send booking notification to admin
//   sendAdminNotification: async (booking, accommodation) => {
//     const mailOptions = {
//       from: `"Booking System" <${process.env.SMTP_USER}>`,
//       to: process.env.ADMIN_EMAIL || accommodation.contact,
//       subject: `New Booking Received - ${booking.bookingReference}`,
//       html: `
//         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//           <h2 style="color: #e74c3c;">New Booking Alert</h2>
          
//           <h3 style="color: #3498db;">Booking Information</h3>
//           <p><strong>Reference:</strong> ${booking.bookingReference}</p>
//           <p><strong>Accommodation:</strong> ${accommodation.name}</p>
//           <p><strong>Student:</strong> ${booking.firstName} ${booking.lastName}</p>
//           <p><strong>Email:</strong> ${booking.email}</p>
//           <p><strong>Phone:</strong> ${booking.phone}</p>
          
//           <h3 style="color: #3498db;">Stay Details</h3>
//           <p><strong>Arrival:</strong> ${new Date(booking.arrivalDate).toLocaleDateString()}</p>
//           <p><strong>Departure:</strong> ${new Date(booking.departureDate).toLocaleDateString()}</p>
//           <p><strong>Occupants:</strong> ${booking.numberOfOccupants}</p>
          
//           ${accommodation.images && accommodation.images.length > 0 ? 
//             `<div style="margin: 20px 0;">
//               <img src="${accommodation.images[0].thumbnailUrl || accommodation.images[0].url}" 
//                    alt="${accommodation.name}" 
//                    style="max-width: 200px; border-radius: 8px;">
//             </div>` : ''
//           }
          
//           <p>Please review this booking in the admin dashboard.</p>
//         </div>
//       `
//     };

//     try {
//       await transporter.sendMail(mailOptions);
//       console.log('Admin notification email sent');
//       return true;
//     } catch (error) {
//       console.error('Error sending admin notification email:', error);
//       return false;
//     }
//   },

//   // Send status update email
//   sendStatusUpdate: async (booking, oldStatus, newStatus) => {
//     const mailOptions = {
//       from: `"Student Accommodation" <${process.env.SMTP_USER}>`,
//       to: booking.email,
//       subject: `Booking Status Updated - ${booking.bookingReference}`,
//       html: `
//         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//           <h2 style="color: #2c3e50;">Booking Status Updated</h2>
//           <p>Dear ${booking.firstName} ${booking.lastName},</p>
          
//           <p>Your booking status has been updated:</p>
//           <p><strong>From:</strong> ${oldStatus}</p>
//           <p><strong>To:</strong> ${newStatus}</p>
//           <p><strong>Reference:</strong> ${booking.bookingReference}</p>
          
//           <p>If you have any questions, please contact us.</p>
//           <p>Best regards,<br>Student Accommodation Team</p>
//         </div>
//       `
//     };

//     try {
//       await transporter.sendMail(mailOptions);
//       console.log(`Status update email sent to ${booking.email}`);
//       return true;
//     } catch (error) {
//       console.error('Error sending status update email:', error);
//       return false;
//     }
//   }
// };

// // Accommodation Controller
// const accommodationController = {
//   // Create new accommodation with images
//   createAccommodation: async (req, res) => {
//     try {
//       // Handle file upload
//       uploadMultipleImages(req, res, async (err) => {
//         if (err) {
//           return res.status(400).json({
//             success: false,
//             message: 'Error uploading images',
//             error: err.message
//           });
//         }

//         try {
//           // Process images from Cloudinary
//           const images = [];
//           if (req.files && req.files.length > 0) {
//             for (const file of req.files) {
//               const thumbnailUrl = generateThumbnailUrl(file.filename);
//               images.push({
//                 public_id: file.filename,
//                 url: file.path,
//                 thumbnailUrl: thumbnailUrl
//               });
//             }
//           }

//           // Create accommodation with processed images
//           const accommodationData = {
//             ...req.body,
//             images: images
//           };

//           // Parse amenities and features if they are strings
//           if (typeof accommodationData.amenities === 'string') {
//             accommodationData.amenities = JSON.parse(accommodationData.amenities);
//           }
//           if (typeof accommodationData.features === 'string') {
//             accommodationData.features = JSON.parse(accommodationData.features);
//           }

//           const accommodation = new Accommodation(accommodationData);
//           await accommodation.save();

//           res.status(201).json({
//             success: true,
//             message: 'Accommodation created successfully',
//             data: accommodation
//           });
//         } catch (error) {
//           // Clean up uploaded images if accommodation creation fails
//           if (req.files && req.files.length > 0) {
//             for (const file of req.files) {
//               try {
//                 await deleteImageFromCloudinary(file.filename);
//               } catch (cleanupError) {
//                 console.error('Error cleaning up images:', cleanupError);
//               }
//             }
//           }

//           res.status(400).json({
//             success: false,
//             message: 'Error creating accommodation',
//             error: error.message
//           });
//         }
//       });
//     } catch (error) {
//       res.status(400).json({
//         success: false,
//         message: 'Error in accommodation creation',
//         error: error.message
//       });
//     }
//   },

//   // Upload additional images to accommodation
//   uploadAccommodationImages: async (req, res) => {
//     try {
//       const accommodation = await Accommodation.findById(req.params.id);
      
//       if (!accommodation) {
//         return res.status(404).json({
//           success: false,
//           message: 'Accommodation not found'
//         });
//       }

//       uploadMultipleImages(req, res, async (err) => {
//         if (err) {
//           return res.status(400).json({
//             success: false,
//             message: 'Error uploading images',
//             error: err.message
//           });
//         }

//         try {
//           // Process new images
//           const newImages = [];
//           if (req.files && req.files.length > 0) {
//             for (const file of req.files) {
//               const thumbnailUrl = generateThumbnailUrl(file.filename);
//               newImages.push({
//                 public_id: file.filename,
//                 url: file.path,
//                 thumbnailUrl: thumbnailUrl
//               });
//             }
//           }

//           // Add new images to accommodation
//           accommodation.images = [...accommodation.images, ...newImages];
//           await accommodation.save();

//           res.json({
//             success: true,
//             message: 'Images uploaded successfully',
//             data: {
//               uploadedCount: newImages.length,
//               totalImages: accommodation.images.length,
//               images: accommodation.images
//             }
//           });
//         } catch (error) {
//           // Clean up uploaded images if update fails
//           if (req.files && req.files.length > 0) {
//             for (const file of req.files) {
//               try {
//                 await deleteImageFromCloudinary(file.filename);
//               } catch (cleanupError) {
//                 console.error('Error cleaning up images:', cleanupError);
//               }
//             }
//           }

//           res.status(400).json({
//             success: false,
//             message: 'Error adding images to accommodation',
//             error: error.message
//           });
//         }
//       });
//     } catch (error) {
//       res.status(500).json({
//         success: false,
//         message: 'Error processing image upload',
//         error: error.message
//       });
//     }
//   },

//   // Delete accommodation image
//   deleteAccommodationImage: async (req, res) => {
//     try {
//       const { id, imageId } = req.params;

//       const accommodation = await Accommodation.findById(id);
      
//       if (!accommodation) {
//         return res.status(404).json({
//           success: false,
//           message: 'Accommodation not found'
//         });
//       }

//       // Find the image to delete
//       const imageIndex = accommodation.images.findIndex(img => 
//         img._id.toString() === imageId || img.public_id === imageId
//       );

//       if (imageIndex === -1) {
//         return res.status(404).json({
//           success: false,
//           message: 'Image not found'
//         });
//       }

//       const imageToDelete = accommodation.images[imageIndex];

//       // Delete from Cloudinary
//       await deleteImageFromCloudinary(imageToDelete.public_id);

//       // Remove from accommodation
//       accommodation.images.splice(imageIndex, 1);
//       await accommodation.save();

//       res.json({
//         success: true,
//         message: 'Image deleted successfully',
//         data: {
//           deletedImage: imageToDelete,
//           remainingImages: accommodation.images.length
//         }
//       });
//     } catch (error) {
//       res.status(500).json({
//         success: false,
//         message: 'Error deleting image',
//         error: error.message
//       });
//     }
//   },

//   // Get all accommodations
//   getAllAccommodations: async (req, res) => {
//     try {
//       const { country, city, university, type, minPrice, maxPrice, featured, search } = req.query;
//       const filter = {};

//       if (country) filter.country = new RegExp(country, 'i');
//       if (city) filter.city = new RegExp(city, 'i');
//       if (university) filter.university = new RegExp(university, 'i');
//       if (type) filter.type = type;
//       if (featured) filter.featured = featured === 'true';
      
//       if (search) {
//         filter.$or = [
//           { name: new RegExp(search, 'i') },
//           { city: new RegExp(search, 'i') },
//           { country: new RegExp(search, 'i') },
//           { university: new RegExp(search, 'i') },
//           { description: new RegExp(search, 'i') }
//         ];
//       }

//       // Pagination
//       const page = parseInt(req.query.page) || 1;
//       const limit = parseInt(req.query.limit) || 10;
//       const skip = (page - 1) * limit;

//       const accommodations = await Accommodation.find(filter)
//         .skip(skip)
//         .limit(limit)
//         .sort({ createdAt: -1 });

//       const total = await Accommodation.countDocuments(filter);
      
//       res.json({
//         success: true,
//         count: accommodations.length,
//         total,
//         totalPages: Math.ceil(total / limit),
//         currentPage: page,
//         data: accommodations
//       });
//     } catch (error) {
//       res.status(500).json({
//         success: false,
//         message: 'Error fetching accommodations',
//         error: error.message
//       });
//     }
//   },

//   // Get single accommodation
//   getAccommodation: async (req, res) => {
//     try {
//       const accommodation = await Accommodation.findById(req.params.id);
      
//       if (!accommodation) {
//         return res.status(404).json({
//           success: false,
//           message: 'Accommodation not found'
//         });
//       }

//       // Increment views or perform other analytics here if needed

//       res.json({
//         success: true,
//         data: accommodation
//       });
//     } catch (error) {
//       res.status(500).json({
//         success: false,
//         message: 'Error fetching accommodation',
//         error: error.message
//       });
//     }
//   },

//   // Update accommodation
//   updateAccommodation: async (req, res) => {
//     try {
//       const accommodation = await Accommodation.findById(req.params.id);

//       if (!accommodation) {
//         return res.status(404).json({
//           success: false,
//           message: 'Accommodation not found'
//         });
//       }

//       // Parse amenities and features if they are strings
//       if (req.body.amenities && typeof req.body.amenities === 'string') {
//         req.body.amenities = JSON.parse(req.body.amenities);
//       }
//       if (req.body.features && typeof req.body.features === 'string') {
//         req.body.features = JSON.parse(req.body.features);
//       }

//       // Update accommodation
//       Object.keys(req.body).forEach(key => {
//         if (key !== 'images') { // Don't update images directly through this route
//           accommodation[key] = req.body[key];
//         }
//       });

//       await accommodation.save();

//       res.json({
//         success: true,
//         message: 'Accommodation updated successfully',
//         data: accommodation
//       });
//     } catch (error) {
//       res.status(400).json({
//         success: false,
//         message: 'Error updating accommodation',
//         error: error.message
//       });
//     }
//   },

//   // Delete accommodation
//   deleteAccommodation: async (req, res) => {
//     try {
//       const accommodation = await Accommodation.findById(req.params.id);

//       if (!accommodation) {
//         return res.status(404).json({
//           success: false,
//           message: 'Accommodation not found'
//         });
//       }

//       // Delete all images from Cloudinary
//       if (accommodation.images && accommodation.images.length > 0) {
//         for (const image of accommodation.images) {
//           try {
//             await deleteImageFromCloudinary(image.public_id);
//           } catch (cleanupError) {
//             console.error('Error deleting image from Cloudinary:', cleanupError);
//           }
//         }
//       }

//       // Delete accommodation from database
//       await accommodation.deleteOne();

//       res.json({
//         success: true,
//         message: 'Accommodation deleted successfully'
//       });
//     } catch (error) {
//       res.status(500).json({
//         success: false,
//         message: 'Error deleting accommodation',
//         error: error.message
//       });
//     }
//   },

//   // Get featured accommodations
//   getFeaturedAccommodations: async (req, res) => {
//     try {
//       const accommodations = await Accommodation.find({ 
//         featured: true,
//         availability: { $ne: 'Booked' }
//       })
//       .sort({ rating: -1, createdAt: -1 })
//       .limit(6);

//       res.json({
//         success: true,
//         count: accommodations.length,
//         data: accommodations
//       });
//     } catch (error) {
//       res.status(500).json({
//         success: false,
//         message: 'Error fetching featured accommodations',
//         error: error.message
//       });
//     }
//   },

//   // Update accommodation images order
//   updateImagesOrder: async (req, res) => {
//     try {
//       const { id } = req.params;
//       const { imageIds } = req.body;

//       const accommodation = await Accommodation.findById(id);
      
//       if (!accommodation) {
//         return res.status(404).json({
//           success: false,
//           message: 'Accommodation not found'
//         });
//       }

//       // Reorder images based on provided IDs
//       const orderedImages = [];
//       for (const imageId of imageIds) {
//         const image = accommodation.images.find(img => 
//           img._id.toString() === imageId || img.public_id === imageId
//         );
//         if (image) {
//           orderedImages.push(image);
//         }
//       }

//       accommodation.images = orderedImages;
//       await accommodation.save();

//       res.json({
//         success: true,
//         message: 'Images order updated successfully',
//         data: accommodation.images
//       });
//     } catch (error) {
//       res.status(400).json({
//         success: false,
//         message: 'Error updating images order',
//         error: error.message
//       });
//     }
//   }
// };

// // Booking Controller
// const bookingController = {
//   // Create new booking
//   createBooking: async (req, res) => {
//     try {
//       // Check if accommodation exists
//       const accommodation = await Accommodation.findById(req.body.accommodationId);
//       if (!accommodation) {
//         return res.status(404).json({
//           success: false,
//           message: 'Accommodation not found'
//         });
//       }

//       // Create booking
//       const booking = new Booking(req.body);
//       await booking.save();

//       // Populate accommodation details
//       await booking.populate('accommodationId');

//       // Send emails
//       await emailService.sendBookingConfirmation(booking, accommodation);
//       await emailService.sendAdminNotification(booking, accommodation);

//       res.status(201).json({
//         success: true,
//         message: 'Booking created successfully',
//         data: booking
//       });
//     } catch (error) {
//       res.status(400).json({
//         success: false,
//         message: 'Error creating booking',
//         error: error.message
//       });
//     }
//   },

//   // Get all bookings
//   getAllBookings: async (req, res) => {
//     try {
//       const { status, startDate, endDate, email } = req.query;
//       const filter = {};

//       if (status) filter.status = status;
//       if (email) filter.email = email;
//       if (startDate && endDate) {
//         filter.createdAt = {
//           $gte: new Date(startDate),
//           $lte: new Date(endDate)
//         };
//       }

//       // Pagination
//       const page = parseInt(req.query.page) || 1;
//       const limit = parseInt(req.query.limit) || 20;
//       const skip = (page - 1) * limit;

//       const bookings = await Booking.find(filter)
//         .populate('accommodationId', 'name city country images')
//         .skip(skip)
//         .limit(limit)
//         .sort({ createdAt: -1 });

//       const total = await Booking.countDocuments(filter);

//       res.json({
//         success: true,
//         count: bookings.length,
//         total,
//         totalPages: Math.ceil(total / limit),
//         currentPage: page,
//         data: bookings
//       });
//     } catch (error) {
//       res.status(500).json({
//         success: false,
//         message: 'Error fetching bookings',
//         error: error.message
//       });
//     }
//   },

//   // Get single booking
//   getBooking: async (req, res) => {
//     try {
//       const booking = await Booking.findById(req.params.id)
//         .populate('accommodationId');

//       if (!booking) {
//         return res.status(404).json({
//           success: false,
//           message: 'Booking not found'
//         });
//       }

//       res.json({
//         success: true,
//         data: booking
//       });
//     } catch (error) {
//       res.status(500).json({
//         success: false,
//         message: 'Error fetching booking',
//         error: error.message
//       });
//     }
//   },

//   // Update booking status
//   updateBookingStatus: async (req, res) => {
//     try {
//       const { status } = req.body;
      
//       if (!['Pending', 'Confirmed', 'Cancelled', 'Completed'].includes(status)) {
//         return res.status(400).json({
//           success: false,
//           message: 'Invalid status value'
//         });
//       }

//       const booking = await Booking.findById(req.params.id);
//       if (!booking) {
//         return res.status(404).json({
//           success: false,
//           message: 'Booking not found'
//         });
//       }

//       const oldStatus = booking.status;
//       booking.status = status;
//       await booking.save();

//       // Send status update email
//       await emailService.sendStatusUpdate(booking, oldStatus, status);

//       res.json({
//         success: true,
//         message: 'Booking status updated successfully',
//         data: booking
//       });
//     } catch (error) {
//       res.status(400).json({
//         success: false,
//         message: 'Error updating booking status',
//         error: error.message
//       });
//     }
//   },

//   // Get bookings by email
//   getBookingsByEmail: async (req, res) => {
//     try {
//       const { email } = req.params;
      
//       const bookings = await Booking.find({ email })
//         .populate('accommodationId', 'name city country images')
//         .sort({ createdAt: -1 });

//       res.json({
//         success: true,
//         count: bookings.length,
//         data: bookings
//       });
//     } catch (error) {
//       res.status(500).json({
//         success: false,
//         message: 'Error fetching bookings',
//         error: error.message
//       });
//     }
//   },

//   // Cancel booking
//   cancelBooking: async (req, res) => {
//     try {
//       const booking = await Booking.findById(req.params.id);
      
//       if (!booking) {
//         return res.status(404).json({
//           success: false,
//           message: 'Booking not found'
//         });
//       }

//       const oldStatus = booking.status;
//       booking.status = 'Cancelled';
//       await booking.save();

//       // Send cancellation email
//       await emailService.sendStatusUpdate(booking, oldStatus, 'Cancelled');

//       res.json({
//         success: true,
//         message: 'Booking cancelled successfully',
//         data: booking
//       });
//     } catch (error) {
//       res.status(400).json({
//         success: false,
//         message: 'Error cancelling booking',
//         error: error.message
//       });
//     }
//   }
// };

// // Dashboard Statistics
// const dashboardController = {
//   getStatistics: async (req, res) => {
//     try {
//       const [
//         totalAccommodations,
//         totalBookings,
//         pendingBookings,
//         confirmedBookings,
//         accommodationsByCountry,
//         bookingsByMonth,
//         recentBookings,
//         recentAccommodations
//       ] = await Promise.all([
//         Accommodation.countDocuments(),
//         Booking.countDocuments(),
//         Booking.countDocuments({ status: 'Pending' }),
//         Booking.countDocuments({ status: 'Confirmed' }),
//         Accommodation.aggregate([
//           { $group: { _id: '$country', count: { $sum: 1 } } },
//           { $sort: { count: -1 } },
//           { $limit: 5 }
//         ]),
//         Booking.aggregate([
//           {
//             $group: {
//               _id: { 
//                 year: { $year: '$createdAt' },
//                 month: { $month: '$createdAt' }
//               },
//               count: { $sum: 1 }
//             }
//           },
//           { $sort: { '_id.year': -1, '_id.month': -1 } },
//           { $limit: 6 }
//         ]),
//         Booking.find()
//           .populate('accommodationId', 'name')
//           .sort({ createdAt: -1 })
//           .limit(5),
//         Accommodation.find()
//           .sort({ createdAt: -1 })
//           .limit(5)
//       ]);

//       // Calculate occupancy rate
//       const totalAccommodationsCount = await Accommodation.countDocuments();
//       const bookedAccommodations = await Accommodation.countDocuments({ availability: 'Booked' });
//       const occupancyRate = totalAccommodationsCount > 0 
//         ? (bookedAccommodations / totalAccommodationsCount) * 100 
//         : 0;

//       // Get top universities
//       const topUniversities = await Accommodation.aggregate([
//         { $group: { _id: '$university', count: { $sum: 1 } } },
//         { $sort: { count: -1 } },
//         { $limit: 5 }
//       ]);

//       res.json({
//         success: true,
//         data: {
//           totals: {
//             accommodations: totalAccommodations,
//             bookings: totalBookings,
//             pendingBookings,
//             confirmedBookings
//           },
//           occupancyRate: occupancyRate.toFixed(2),
//           topCountries: accommodationsByCountry,
//           topUniversities,
//           monthlyBookings: bookingsByMonth,
//           recentActivity: {
//             bookings: recentBookings,
//             accommodations: recentAccommodations
//           }
//         }
//       });
//     } catch (error) {
//       res.status(500).json({
//         success: false,
//         message: 'Error fetching dashboard statistics',
//         error: error.message
//       });
//     }
//   },

//   getBookingAnalytics: async (req, res) => {
//     try {
//       const { startDate, endDate } = req.query;
//       const dateFilter = {};

//       if (startDate && endDate) {
//         dateFilter.createdAt = {
//           $gte: new Date(startDate),
//           $lte: new Date(endDate)
//         };
//       } else {
//         // Default to last 30 days
//         const thirtyDaysAgo = new Date();
//         thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
//         dateFilter.createdAt = { $gte: thirtyDaysAgo };
//       }

//       const analytics = await Booking.aggregate([
//         { $match: dateFilter },
//         {
//           $group: {
//             _id: {
//               status: '$status',
//               date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }
//             },
//             count: { $sum: 1 }
//           }
//         },
//         { $sort: { '_id.date': 1 } }
//       ]);

//       res.json({
//         success: true,
//         data: analytics
//       });
//     } catch (error) {
//       res.status(500).json({
//         success: false,
//         message: 'Error fetching booking analytics',
//         error: error.message
//       });
//     }
//   }
// };

// module.exports = {
//   emailService,
//   accommodationController,
//   bookingController,
//   dashboardController,
//   uploadMultipleImages,
//   uploadSingleImage
// };






// const { Accommodation, Booking } = require('../models/Accommodation');
// const nodemailer = require('nodemailer');
// const { uploadMultipleImages, generateThumbnailUrl, deleteImageFromCloudinary } = require('../services/accomodationCloudinaryConfig');

// // Email transporter
// const transporter = nodemailer.createTransport({
//   host: process.env.SMTP_HOST || 'smtp.gmail.com',
//   port: process.env.SMTP_PORT || 587,
//   secure: false,
//   auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
// });

// // Email services
// const emailService = {
//   sendBookingConfirmation: async (booking, accommodation) => {
//     const mailOptions = {
//       from: `"Student Accommodation" <${process.env.SMTP_USER}>`,
//       to: booking.email,
//       subject: `Booking Confirmation - ${booking.bookingReference}`,
//       html: `<p>Dear ${booking.firstName}, your booking for ${accommodation.name} is confirmed.</p>`
//     };
//     return transporter.sendMail(mailOptions);
//   },
//   sendAdminNotification: async (booking, accommodation) => {
//     const mailOptions = {
//       from: `"Booking System" <${process.env.SMTP_USER}>`,
//       to: process.env.ADMIN_EMAIL || accommodation.contact,
//       subject: `New Booking - ${booking.bookingReference}`,
//       html: `<p>New booking for ${accommodation.name} by ${booking.firstName} ${booking.lastName}</p>`
//     };
//     return transporter.sendMail(mailOptions);
//   }
// };

// // Accommodation controller
// const accommodationController = {
//   createAccommodation: async (req, res) => {
//     try {
//       const images = (req.files || []).map(file => ({
//         public_id: file.originalname,
//         url: file.path,
//         thumbnailUrl: generateThumbnailUrl(file.path)
//       }));

//       const data = { ...req.body, images };
//       if (typeof data.amenities === 'string') data.amenities = JSON.parse(data.amenities);
//       if (typeof data.features === 'string') data.features = JSON.parse(data.features);

//       const accommodation = new Accommodation(data);
//       await accommodation.save();

//       res.status(201).json({ success: true, message: 'Accommodation created', data: accommodation });
//     } catch (error) {
//       res.status(400).json({ success: false, message: 'Error creating accommodation', error: error.message });
//     }
//   },

//   getAllAccommodations: async (req, res) => {
//     try {
//       const accommodations = await Accommodation.find().sort({ createdAt: -1 });
//       res.json({ success: true, count: accommodations.length, data: accommodations });
//     } catch (error) {
//       res.status(500).json({ success: false, message: 'Error fetching accommodations', error: error.message });
//     }
//   },

//   getAccommodation: async (req, res) => {
//     try {
//       const accommodation = await Accommodation.findById(req.params.id);
//       if (!accommodation) return res.status(404).json({ success: false, message: 'Accommodation not found' });
//       res.json({ success: true, data: accommodation });
//     } catch (error) {
//       res.status(500).json({ success: false, message: 'Error fetching accommodation', error: error.message });
//     }
//   },

//   updateAccommodation: async (req, res) => {
//     try {
//       const accommodation = await Accommodation.findById(req.params.id);
//       if (!accommodation) return res.status(404).json({ success: false, message: 'Accommodation not found' });

//       Object.keys(req.body).forEach(key => { if (key !== 'images') accommodation[key] = req.body[key]; });
//       await accommodation.save();
//       res.json({ success: true, message: 'Accommodation updated', data: accommodation });
//     } catch (error) {
//       res.status(400).json({ success: false, message: 'Error updating accommodation', error: error.message });
//     }
//   },

//   deleteAccommodation: async (req, res) => {
//     try {
//       const accommodation = await Accommodation.findById(req.params.id);
//       if (!accommodation) return res.status(404).json({ success: false, message: 'Accommodation not found' });

//       if (accommodation.images) {
//         for (const image of accommodation.images) await deleteImageFromCloudinary(image.public_id);
//       }

//       await accommodation.deleteOne();
//       res.json({ success: true, message: 'Accommodation deleted' });
//     } catch (error) {
//       res.status(500).json({ success: false, message: 'Error deleting accommodation', error: error.message });
//     }
//   }
// };

// // // Booking controller
// // const bookingController = {
// //   createBooking: async (req, res) => {
// //     try {
// //       const accommodation = await Accommodation.findById(req.body.accommodationId);
// //       if (!accommodation) return res.status(404).json({ success: false, message: 'Accommodation not found' });

// //       const booking = new Booking(req.body);
// //       await booking.save();
// //       await emailService.sendBookingConfirmation(booking, accommodation);
// //       await emailService.sendAdminNotification(booking, accommodation);

// //       res.status(201).json({ success: true, message: 'Booking created', data: booking });
// //     } catch (error) {
// //       res.status(400).json({ success: false, message: 'Error creating booking', error: error.message });
// //     }
// //   },

// //   getAllBookings: async (req, res) => {
// //     try {
// //       const bookings = await Booking.find().populate('accommodationId').sort({ createdAt: -1 });
// //       res.json({ success: true, count: bookings.length, data: bookings });
// //     } catch (error) {
// //       res.status(500).json({ success: false, message: 'Error fetching bookings', error: error.message });
// //     }
// //   },

// //   getBooking: async (req, res) => {
// //     try {
// //       const booking = await Booking.findById(req.params.id).populate('accommodationId');
// //       if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
// //       res.json({ success: true, data: booking });
// //     } catch (error) {
// //       res.status(500).json({ success: false, message: 'Error fetching booking', error: error.message });
// //     }
// //   },

// //   updateBooking: async (req, res) => {
// //     try {
// //       const booking = await Booking.findById(req.params.id);
// //       if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

// //       Object.keys(req.body).forEach(key => booking[key] = req.body[key]);
// //       await booking.save();
// //       res.json({ success: true, message: 'Booking updated', data: booking });
// //     } catch (error) {
// //       res.status(400).json({ success: false, message: 'Error updating booking', error: error.message });
// //     }
// //   },

// //   deleteBooking: async (req, res) => {
// //     try {
// //       const booking = await Booking.findById(req.params.id);
// //       if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

// //       await booking.deleteOne();
// //       res.json({ success: true, message: 'Booking deleted' });
// //     } catch (error) {
// //       res.status(500).json({ success: false, message: 'Error deleting booking', error: error.message });
// //     }
// //   }
// // };
// // Booking Controller
// const bookingController = {
//   createBooking: async (req, res) => {
//     try {
//       const accommodation = await Accommodation.findById(req.body.accommodationId);
//       if (!accommodation) return res.status(404).json({ success: false, message: 'Accommodation not found' });

//       const booking = new Booking(req.body);
//       await booking.save();
//       await booking.populate('accommodationId');

//       res.status(201).json({ success: true, data: booking });
//     } catch (error) {
//       res.status(400).json({ success: false, message: 'Error creating booking', error: error.message });
//     }
//   },

//   getAllBookings: async (req, res) => {
//     try {
//       const bookings = await Booking.find().populate('accommodationId');
//       res.json({ success: true, data: bookings });
//     } catch (error) {
//       res.status(500).json({ success: false, message: 'Error fetching bookings', error: error.message });
//     }
//   },

//   getBooking: async (req, res) => {
//     try {
//       const booking = await Booking.findById(req.params.id).populate('accommodationId');
//       if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
//       res.json({ success: true, data: booking });
//     } catch (error) {
//       res.status(500).json({ success: false, message: 'Error fetching booking', error: error.message });
//     }
//   },

//   updateBooking: async (req, res) => {
//     try {
//       const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
//       if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
//       res.json({ success: true, data: booking });
//     } catch (error) {
//       res.status(400).json({ success: false, message: 'Error updating booking', error: error.message });
//     }
//   },

//   deleteBooking: async (req, res) => {
//     try {
//       const booking = await Booking.findByIdAndDelete(req.params.id);
//       if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
//       res.json({ success: true, message: 'Booking deleted successfully' });
//     } catch (error) {
//       res.status(500).json({ success: false, message: 'Error deleting booking', error: error.message });
//     }
//   }
// };

// module.exports = { accommodationController, bookingController, emailService };











// const { Accommodation, Booking } = require('../models/Accommodation');
// const mongoose = require('mongoose');
// const nodemailer = require('nodemailer');
// const { 
//   uploadMultipleImages, 
//   generateThumbnailUrl, 
//   deleteImageFromCloudinary 
// } = require('../services/accomodationCloudinaryConfig');

// // -------------------- EMAIL CONFIG --------------------
// const transporter = nodemailer.createTransport({
//   host: process.env.SMTP_HOST || 'smtp.gmail.com',
//   port: process.env.SMTP_PORT || 587,
//   secure: false,
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASS
//   }
// });

// // -------------------- EMAIL SERVICE --------------------
// const emailService = {
//   sendBookingConfirmation: async (booking, accommodation) => {
//     const mailOptions = {
//       from: `"Student Accommodation" <${process.env.SMTP_USER}>`,
//       to: booking.email,
//       subject: `Booking Confirmation - ${booking.bookingReference}`,
//       html: `<p>Booking confirmed for ${accommodation.name}</p>`
//     };
//     try { await transporter.sendMail(mailOptions); } 
//     catch (err) { console.error(err); }
//   },
//   sendAdminNotification: async (booking, accommodation) => {
//     const mailOptions = {
//       from: `"Booking System" <${process.env.SMTP_USER}>`,
//       to: process.env.ADMIN_EMAIL || accommodation.contact,
//       subject: `New Booking Received - ${booking.bookingReference}`,
//       html: `<p>New booking for ${accommodation.name}</p>`
//     };
//     try { await transporter.sendMail(mailOptions); } 
//     catch (err) { console.error(err); }
//   },
//   sendStatusUpdate: async (booking, oldStatus, newStatus) => {
//     const mailOptions = {
//       from: `"Student Accommodation" <${process.env.SMTP_USER}>`,
//       to: booking.email,
//       subject: `Booking Status Updated - ${booking.bookingReference}`,
//       html: `<p>Status updated: ${oldStatus} → ${newStatus}</p>`
//     };
//     try { await transporter.sendMail(mailOptions); } 
//     catch (err) { console.error(err); }
//   }
// };

// // -------------------- ACCOMMODATION CONTROLLER --------------------
// const accommodationController = {
//   createAccommodation: async (req, res) => {
//     uploadMultipleImages(req, res, async (err) => {
//       if (err) return res.status(400).json({ success: false, message: 'Image upload error', error: err.message });

//       try {
//         const images = [];
//         if (req.files && req.files.length > 0) {
//           for (const file of req.files) {
//             images.push({
//               public_id: file.filename,
//               url: file.path,
//               thumbnailUrl: generateThumbnailUrl(file.filename)
//             });
//           }
//         }

//         if (typeof req.body.amenities === 'string') req.body.amenities = JSON.parse(req.body.amenities);
//         if (typeof req.body.features === 'string') req.body.features = JSON.parse(req.body.features);

//         const accommodation = new Accommodation({ ...req.body, images });
//         await accommodation.save();

//         res.status(201).json({ success: true, message: 'Accommodation created', data: accommodation });
//       } catch (error) {
//         res.status(400).json({ success: false, message: 'Error creating accommodation', error: error.message });
//       }
//     });
//   },

//   getAllAccommodations: async (req, res) => {
//     try {
//       const accommodations = await Accommodation.find().sort({ createdAt: -1 });
//       res.json({ success: true, count: accommodations.length, data: accommodations });
//     } catch (error) {
//       res.status(500).json({ success: false, message: 'Error fetching accommodations', error: error.message });
//     }
//   },

//   getAccommodation: async (req, res) => {
//     const { id } = req.params;

//     try {
//       const accommodation = await Accommodation.findById(id);
//       if (!accommodation) return res.status(404).json({ success: false, message: 'Accommodation not found' });
//       res.json({ success: true, data: accommodation });
//     } catch (error) {
//       res.status(500).json({ success: false, message: 'Error fetching accommodation', error: error.message });
//     }
//   },

//   updateAccommodation: async (req, res) => {
//     const { id } = req.params;

//     try {
//       const accommodation = await Accommodation.findById(id);
//       if (!accommodation) return res.status(404).json({ success: false, message: 'Accommodation not found' });

//       if (req.body.amenities && typeof req.body.amenities === 'string') req.body.amenities = JSON.parse(req.body.amenities);
//       if (req.body.features && typeof req.body.features === 'string') req.body.features = JSON.parse(req.body.features);

//       Object.keys(req.body).forEach(key => { if (key !== 'images') accommodation[key] = req.body[key]; });
//       await accommodation.save();

//       res.json({ success: true, message: 'Accommodation updated', data: accommodation });
//     } catch (error) {
//       res.status(400).json({ success: false, message: 'Error updating accommodation', error: error.message });
//     }
//   },

//   deleteAccommodation: async (req, res) => {
//     const { id } = req.params;

//     try {
//       const accommodation = await Accommodation.findById(id);
//       if (!accommodation) return res.status(404).json({ success: false, message: 'Accommodation not found' });

//       // Delete images
//       for (const img of accommodation.images) {
//         try { await deleteImageFromCloudinary(img.public_id); } catch (err) { console.error(err); }
//       }

//       await accommodation.deleteOne();
//       res.json({ success: true, message: 'Accommodation deleted' });
//     } catch (error) {
//       res.status(500).json({ success: false, message: 'Error deleting accommodation', error: error.message });
//     }
//   }
// };

// // -------------------- BOOKING CONTROLLER --------------------
// const bookingController = {
//   createBooking: async (req, res) => {
//     const { accommodationId } = req.body;
//     if (!mongoose.Types.ObjectId.isValid(accommodationId)) 
//       return res.status(400).json({ success: false, message: 'Invalid accommodation ID' });

//     try {
//       const accommodation = await Accommodation.findById(accommodationId);
//       if (!accommodation) return res.status(404).json({ success: false, message: 'Accommodation not found' });

//       const booking = new Booking(req.body);
//       await booking.save();

//       await emailService.sendBookingConfirmation(booking, accommodation);
//       await emailService.sendAdminNotification(booking, accommodation);

//       res.status(201).json({ success: true, message: 'Booking created', data: booking });
//     } catch (error) {
//       res.status(400).json({ success: false, message: 'Error creating booking', error: error.message });
//     }
//   },

//   getAllBookings: async (req, res) => {
//     try {
//       const bookings = await Booking.find();
//       res.json({ success: true, count: bookings.length, data: bookings });
//     } catch (error) {
//       res.status(500).json({ success: false, message: 'Error fetching bookings', error: error.message });
//     }
//   },

//   getBooking: async (req, res) => {
//     const { id } = req.params;

//     try {
//       const booking = await Booking.findById(id);
//       if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
//       res.json({ success: true, data: booking });
//     } catch (error) {
//       res.status(500).json({ success: false, message: 'Error fetching booking', error: error.message });
//     }
//   },

//   updateBooking: async (req, res) => {
//     const { id } = req.params;

//     try {
//       const booking = await Booking.findByIdAndUpdate(id, req.body, { new: true });
//       if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
//       res.json({ success: true, message: 'Booking updated', data: booking });
//     } catch (error) {
//       res.status(400).json({ success: false, message: 'Error updating booking', error: error.message });
//     }
//   },

//   deleteBooking: async (req, res) => {
//     const { id } = req.params;

//     try {
//       const booking = await Booking.findByIdAndDelete(id);
//       if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
//       res.json({ success: true, message: 'Booking deleted', data: booking });
//     } catch (error) {
//       res.status(500).json({ success: false, message: 'Error deleting booking', error: error.message });
//     }
//   }
// };

// module.exports = { accommodationController, bookingController, emailService };




const { Accommodation, Booking } = require('../models/Accommodation');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const { 
  uploadMultipleImages, 
  generateThumbnailUrl, 
  deleteImageFromCloudinary 
} = require('../services/accomodationCloudinaryConfig');

// -------------------- EMAIL CONFIG --------------------
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// -------------------- EMAIL SERVICE --------------------
const emailService = {
  sendBookingConfirmation: async (booking, accommodation) => {
    try {
      await transporter.sendMail({
        from: `"Student Accommodation" <${process.env.SMTP_USER}>`,
        to: booking.email,
        subject: `Booking Confirmation - ${booking.bookingReference}`,
        html: `<p>Booking confirmed for ${accommodation.name}</p>`
      });
    } catch (err) { console.error(err); }
  },
  sendAdminNotification: async (booking, accommodation) => {
    try {
      await transporter.sendMail({
        from: `"Booking System" <${process.env.SMTP_USER}>`,
        to: process.env.ADMIN_EMAIL || accommodation.contact,
        subject: `New Booking Received - ${booking.bookingReference}`,
        html: `<p>New booking for ${accommodation.name}</p>`
      });
    } catch (err) { console.error(err); }
  },
  sendStatusUpdate: async (booking, oldStatus, newStatus) => {
    try {
      await transporter.sendMail({
        from: `"Student Accommodation" <${process.env.SMTP_USER}>`,
        to: booking.email,
        subject: `Booking Status Updated - ${booking.bookingReference}`,
        html: `<p>Status updated: ${oldStatus} → ${newStatus}</p>`
      });
    } catch (err) { console.error(err); }
  }
};

// -------------------- ACCOMMODATION CONTROLLER --------------------
const accommodationController = {
 
createAccommodation: async (req, res) => {
  try {
    const images = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        images.push({
          public_id: file.filename || file.originalname,
          url: file.path, // Cloudinary URL
          thumbnailUrl: generateThumbnailUrl(file.path)
        });
      }
    }

    if (typeof req.body.amenities === 'string') req.body.amenities = JSON.parse(req.body.amenities);
    if (typeof req.body.features === 'string') req.body.features = JSON.parse(req.body.features);

    const accommodation = new Accommodation({ ...req.body, images });
    await accommodation.save();

    res.status(201).json({ success: true, message: 'Accommodation created', data: accommodation });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Error creating accommodation', error: error.message });
  }
}
,

  getAllAccommodations: async (req, res) => {
    try {
      const accommodations = await Accommodation.find().sort({ createdAt: -1 });
      res.json({ success: true, count: accommodations.length, data: accommodations });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error fetching accommodations', error: error.message });
    }
  },

  // getAccommodation: async (req, res) => {
  //   const { id } = req.params;
  //   try {
  //     const accommodation = await Accommodation.findById(id);
  //     if (!accommodation) return res.status(404).json({ success: false, message: 'Accommodation not found' });
  //     res.json({ success: true, data: accommodation });
  //   } catch (error) {
  //     res.status(500).json({ success: false, message: 'Error fetching accommodation', error: error.message });
  //   }
  // },
  getAccommodation: async (req, res) => {
  const { id } = req.params;
  try {
    const accommodation = await Accommodation.findById(id);
    if (!accommodation) return res.status(404).json({ success: false, message: 'Accommodation not found' });
    res.json({ success: true, data: accommodation });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching accommodation', error: error.message });
  }
},

getAccommodationByEmail: async (req, res) => {
  const { email } = req.params;

  try {
    const accommodation = await Accommodation.findOne({ email });
    if (!accommodation) {
      return res.status(404).json({ success: false, message: 'Accommodation not found for this email' });
    }
    res.json({ success: true, data: accommodation });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching accommodation by email', error: error.message });
  }
},


  updateAccommodation: async (req, res) => {
    const { id } = req.params;
    try {
      const accommodation = await Accommodation.findById(id);
      if (!accommodation) return res.status(404).json({ success: false, message: 'Accommodation not found' });

      // Parse JSON fields if needed
      if (req.body.amenities && typeof req.body.amenities === 'string') req.body.amenities = JSON.parse(req.body.amenities);
      if (req.body.features && typeof req.body.features === 'string') req.body.features = JSON.parse(req.body.features);

      // Update fields except images
      Object.keys(req.body).forEach(key => {
        if (key !== 'images') accommodation[key] = req.body[key];
      });

      await accommodation.save();
      res.json({ success: true, message: 'Accommodation updated', data: accommodation });
    } catch (error) {
      res.status(400).json({ success: false, message: 'Error updating accommodation', error: error.message });
    }
  },

  deleteAccommodation: async (req, res) => {
    const { id } = req.params;
    try {
      const accommodation = await Accommodation.findById(id);
      if (!accommodation) return res.status(404).json({ success: false, message: 'Accommodation not found' });

      // Delete images from Cloudinary
      for (const img of accommodation.images) {
        try { await deleteImageFromCloudinary(img.public_id); } catch (err) { console.error(err); }
      }

      await accommodation.deleteOne();
      res.json({ success: true, message: 'Accommodation deleted' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error deleting accommodation', error: error.message });
    }
  }
};

// -------------------- BOOKING CONTROLLER --------------------
const bookingController = {
  createBooking: async (req, res) => {
    const { accommodationId } = req.body;
    if (!mongoose.Types.ObjectId.isValid(accommodationId))
      return res.status(400).json({ success: false, message: 'Invalid accommodation ID' });

    try {
      const accommodation = await Accommodation.findById(accommodationId);
      if (!accommodation) return res.status(404).json({ success: false, message: 'Accommodation not found' });

      const booking = new Booking(req.body);
      await booking.save();

      await emailService.sendBookingConfirmation(booking, accommodation);
      await emailService.sendAdminNotification(booking, accommodation);

      res.status(201).json({ success: true, message: 'Booking created', data: booking });
    } catch (error) {
      res.status(400).json({ success: false, message: 'Error creating booking', error: error.message });
    }
  },

  getAllBookings: async (req, res) => {
    try {
      const bookings = await Booking.find();
      res.json({ success: true, count: bookings.length, data: bookings });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error fetching bookings', error: error.message });
    }
  },

  getBookingsByEmail: async (req, res) => {
  const { email } = req.params;

  try {
    const bookings = await Booking.find({ email }).sort({ createdAt: -1 });

    if (!bookings || bookings.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No bookings found for this email'
      });
    }

    res.json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching bookings by email',
      error: error.message
    });
  }
   },

  getBooking: async (req, res) => {
    const { id } = req.params;
    try {
      const booking = await Booking.findById(id);
      if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
      res.json({ success: true, data: booking });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error fetching booking', error: error.message });
    }
  },



  updateBooking: async (req, res) => {
    const { id } = req.params;
    try {
      const booking = await Booking.findByIdAndUpdate(id, req.body, { new: true });
      if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
      res.json({ success: true, message: 'Booking updated', data: booking });
    } catch (error) {
      res.status(400).json({ success: false, message: 'Error updating booking', error: error.message });
    }
  },

  deleteBooking: async (req, res) => {
    const { id } = req.params;
    try {
      const booking = await Booking.findByIdAndDelete(id);
      if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
      res.json({ success: true, message: 'Booking deleted', data: booking });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error deleting booking', error: error.message });
    }
  }
};

module.exports = { accommodationController, bookingController, emailService };
