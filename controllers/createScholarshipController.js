// const mongoose = require('mongoose');
// const multer = require('multer');
// const cloudinary = require('cloudinary').v2;
// const { CloudinaryStorage } = require('multer-storage-cloudinary');
// const Scholarship = require('../models/CreateScholarship');

// // ====================================
// // CLOUDINARY CONFIGURATION
// // ====================================

// // Configure Cloudinary
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET
// });

// // Create Cloudinary storage engine for multer
// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: 'scholarships',
//     allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
//     transformation: [
//       { width: 1200, height: 800, crop: 'limit', quality: 'auto' },
//       { fetch_format: 'auto' }
//     ],
//     public_id: (req, file) => {
//       const timestamp = Date.now();
//       const originalName = file.originalname.replace(/\.[^/.]+$/, "");
//       const sanitizedName = originalName.replace(/[^a-zA-Z0-9]/g, '_');
//       return `scholarship_${sanitizedName}_${timestamp}`;
//     }
//   }
// });

// // Configure multer
// const upload = multer({
//   storage: storage,
//   limits: {
//     fileSize: 1 * 1024 * 1024 // 1MB limit
//   },
//   fileFilter: (req, file, cb) => {
//     const allowedTypes = /jpeg|jpg|png|gif|webp/;
//     const extname = allowedTypes.test(file.originalname.toLowerCase());
//     const mimetype = allowedTypes.test(file.mimetype);
    
//     if (mimetype && extname) {
//       return cb(null, true);
//     }
//     cb(new Error('Error: Only image files are allowed (jpg, jpeg, png, gif, webp)!'));
//   }
// });

// // Export upload middleware for routes
// exports.uploadMiddleware = upload;

// // ====================================
// // CLOUDINARY HELPER FUNCTIONS
// // ====================================

// /**
//  * Upload file to Cloudinary
//  * @param {Buffer|string} file - File buffer, base64 string, or URL
//  * @param {Object} options - Upload options
//  * @returns {Promise<Object>} Upload result
//  */
// const uploadToCloudinary = async (file, options = {}) => {
//   try {
//     const uploadOptions = {
//       folder: 'scholarships',
//       transformation: [
//         { width: 1200, height: 800, crop: 'limit', quality: 'auto' }
//       ],
//       ...options
//     };

//     let result;
    
//     if (Buffer.isBuffer(file)) {
//       // Upload from buffer
//       result = await new Promise((resolve, reject) => {
//         const uploadStream = cloudinary.uploader.upload_stream(
//           uploadOptions,
//           (error, result) => {
//             if (error) reject(error);
//             else resolve(result);
//           }
//         );
//         uploadStream.end(file);
//       });
//     } else if (typeof file === 'string' && file.startsWith('data:')) {
//       // Upload from base64
//       result = await cloudinary.uploader.upload(file, uploadOptions);
//     } else if (typeof file === 'string' && (file.startsWith('http') || file.startsWith('https'))) {
//       // Upload from URL
//       result = await cloudinary.uploader.upload(file, uploadOptions);
//     } else {
//       throw new Error('Invalid file format');
//     }

//     return {
//       url: result.secure_url,
//       publicId: result.public_id,
//       format: result.format,
//       bytes: result.bytes,
//       width: result.width,
//       height: result.height
//     };
//   } catch (error) {
//     console.error('Cloudinary upload error:', error);
//     throw new Error(`Image upload failed: ${error.message}`);
//   }
// };

// /**
//  * Delete image from Cloudinary
//  * @param {string} publicId - Cloudinary public ID
//  * @returns {Promise<Object>} Deletion result
//  */
// const deleteFromCloudinary = async (publicId) => {
//   try {
//     if (!publicId || publicId.trim() === '') {
//       return { result: 'not_found' };
//     }
    
//     const result = await cloudinary.uploader.destroy(publicId);
    
//     if (result.result !== 'ok') {
//       console.warn(`Failed to delete image ${publicId}:`, result);
//     }
    
//     return result;
//   } catch (error) {
//     console.error('Cloudinary delete error:', error);
//     throw new Error(`Failed to delete image: ${error.message}`);
//   }
// };

// /**
//  * Handle image upload with cleanup
//  * @param {Object} file - Uploaded file object
//  * @param {string} existingPublicId - Existing public ID to delete
//  * @returns {Promise<Object>} Image data
//  */
// const handleImageUpload = async (file, existingPublicId = null) => {
//   try {
//     // Delete old image if exists
//     if (existingPublicId) {
//       await deleteFromCloudinary(existingPublicId);
//     }
    
//     if (!file) return null;
    
//     let imageData;
    
//     if (file.path) {
//       // File uploaded via multer middleware
//       return {
//         url: file.path,
//         publicId: file.filename,
//         filename: file.originalname
//       };
//     } else if (file.buffer) {
//       // File buffer from direct upload
//       imageData = await uploadToCloudinary(file.buffer);
//       return imageData;
//     } else if (typeof file === 'string') {
//       // Base64 or URL string
//       imageData = await uploadToCloudinary(file);
//       return imageData;
//     }
    
//     return null;
//   } catch (error) {
//     console.error('Image upload handler error:', error);
//     throw error;
//   }
// };

// // ====================================
// // VALIDATION HELPER FUNCTIONS
// // ====================================

// /**
//  * Validate and normalize scholarship data
//  * @param {Object} data - Raw scholarship data
//  * @returns {Object} Validated and normalized data
//  */
// const validateScholarshipData = (data) => {
//   const validatedData = { ...data };
  
//   // Required field validation
//   const requiredFields = ['title', 'provider', 'country', 'type', 'studyLevel', 'deadline', 'eligibility'];
//   const missingFields = requiredFields.filter(field => !validatedData[field]);
  
//   if (missingFields.length > 0) {
//     throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
//   }
  
//   // Normalize studyLevel to array
//   if (!Array.isArray(validatedData.studyLevel)) {
//     if (typeof validatedData.studyLevel === 'string') {
//       validatedData.studyLevel = validatedData.studyLevel
//         .split(',')
//         .map(level => level.trim())
//         .filter(level => level);
//     } else {
//       throw new Error('studyLevel must be an array or comma-separated string');
//     }
//   }
  
//   // Normalize benefits to array
//   if (validatedData.benefits && !Array.isArray(validatedData.benefits)) {
//     if (typeof validatedData.benefits === 'string') {
//       validatedData.benefits = validatedData.benefits
//         .split(',')
//         .map(benefit => benefit.trim())
//         .filter(benefit => benefit);
//     }
//   }
  
//   // Normalize requirements to array
//   if (validatedData.requirements && !Array.isArray(validatedData.requirements)) {
//     if (typeof validatedData.requirements === 'string') {
//       validatedData.requirements = validatedData.requirements
//         .split(',')
//         .map(req => req.trim())
//         .filter(req => req);
//     }
//   }
  
//   // Normalize tags to array
//   if (validatedData.tags && !Array.isArray(validatedData.tags)) {
//     if (typeof validatedData.tags === 'string') {
//       validatedData.tags = validatedData.tags
//         .split(',')
//         .map(tag => tag.trim())
//         .filter(tag => tag);
//     }
//   }
  
//   // Parse deadline date
//   if (typeof validatedData.deadline === 'string') {
//     const parsedDate = new Date(validatedData.deadline);
//     if (isNaN(parsedDate.getTime())) {
//       throw new Error('Invalid deadline date format');
//     }
//     validatedData.deadline = parsedDate;
//   }
  
//   // Convert featured to boolean
//   if (validatedData.featured !== undefined) {
//     validatedData.featured = Boolean(validatedData.featured);
//   }
  
//   return validatedData;
// };

// // ====================================
// // CONTROLLER FUNCTIONS - CRUD OPERATIONS
// // ====================================

// /**
//  * @desc    Get all scholarships with filtering, sorting, and pagination
//  * @route   GET /api/scholarships
//  * @access  Public
//  */
// exports.getAllScholarships = async (req, res) => {
//   try {
//     const {
//       page = 1,
//       limit = 10,
//       search,
//       country,
//       type,
//       featured
//     } = req.query;

//     const query = {};

//     if (country) query.country = new RegExp(country, 'i');
//     if (type) query.type = type;
//     if (featured !== undefined) query.featured = featured === 'true';

//     if (search) {
//       query.$or = [
//         { title: new RegExp(search, 'i') },
//         { provider: new RegExp(search, 'i') },
//         { eligibility: new RegExp(search, 'i') }
//       ];
//     }

//     const skip = (page - 1) * limit;

//     const [data, total] = await Promise.all([
//       Scholarship.find(query)
//         .sort('-createdAt')
//         .skip(skip)
//         .limit(Number(limit)),
//       Scholarship.countDocuments(query)
//     ]);

//     res.status(200).json({
//       success: true,
//       total,
//       count: data.length,
//       data
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, error: 'Server error' });
//   }
// };


// /**
//  * @desc    Get single scholarship by ID
//  * @route   GET /api/scholarships/:id
//  * @access  Public
//  */
// exports.getApplicationById = async (req, res) => {
//   try {
//     const application = await Scholarship.findById(req.params.id);

//     if (!application) {
//       return res.status(404).json({
//         success: false,
//         error: 'Application not found'
//       });
//     }

//     res.status(200).json({
//       success: true,
//       data: application
//     });
//   } catch (error) {
//     console.error('Get application by ID error:', error);
//     res.status(500).json({
//       success: false,
//       error: 'Server error'
//     });
//   }
// };


// /**
//  * @desc    Create a new scholarship
//  * @route   POST /api/scholarships
//  * @access  Private/Admin
//  */
// exports.createScholarship = async (req, res) => {
//   try {
//     // Validate request data
//     const validatedData = validateScholarshipData(req.body);
    
//     // Handle image upload
//     let imageData = null;
    
//     if (req.file) {
//       // Image uploaded via multer middleware
//       imageData = {
//         url: req.file.path,
//         publicId: req.file.filename
//       };
//     } else if (req.body.image) {
//       // Image provided as base64 or URL
//       try {
//         imageData = await handleImageUpload(req.body.image);
//       } catch (imageError) {
//         return res.status(400).json({
//           success: false,
//           error: `Image upload failed: ${imageError.message}`
//         });
//       }
//     }
    
//     // Add image data to scholarship
//     if (imageData) {
//       validatedData.image = imageData.url;
//       validatedData.imagePublicId = imageData.publicId;
//     }
    
//     // Create scholarship
//     const scholarship = await Scholarship.create(validatedData);
    
//     res.status(201).json({
//       success: true,
//       message: 'Scholarship created successfully',
//       data: scholarship
//     });
//   } catch (error) {
//     console.error('Create scholarship error:', error);
    
//     // Clean up uploaded image if creation failed
//     if (req.file && req.file.filename) {
//       await deleteFromCloudinary(req.file.filename);
//     }
    
//     const statusCode = error.name === 'ValidationError' ? 400 : 500;
//     res.status(statusCode).json({
//       success: false,
//       error: error.message
//     });
//   }
// };

// /**
//  * @desc    Update an existing scholarship
//  * @route   PUT /api/scholarships/:id
//  * @access  Private/Admin
//  */
// exports.updateScholarship = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({
//         success: false,
//         error: 'Invalid scholarship ID'
//       });
//     }
    
//     // Check if scholarship exists
//     const existingScholarship = await Scholarship.findById(id);
//     if (!existingScholarship) {
//       return res.status(404).json({
//         success: false,
//         error: 'Scholarship not found'
//       });
//     }
    
//     // Validate request data
//     const validatedData = validateScholarshipData(req.body);
    
//     // Handle image update
//     let imageData = null;
//     let oldPublicId = existingScholarship.imagePublicId;
    
//     if (req.file) {
//       // New image uploaded via multer
//       imageData = {
//         url: req.file.path,
//         publicId: req.file.filename
//       };
//     } else if (req.body.image && req.body.image !== existingScholarship.image) {
//       // New image provided as base64 or URL
//       try {
//         imageData = await handleImageUpload(req.body.image, oldPublicId);
//         oldPublicId = null; // Already deleted in handleImageUpload
//       } catch (imageError) {
//         return res.status(400).json({
//           success: false,
//           error: `Image upload failed: ${imageError.message}`
//         });
//       }
//     } else if (req.body.removeImage === 'true') {
//       // Remove existing image
//       if (oldPublicId) {
//         await deleteFromCloudinary(oldPublicId);
//         validatedData.image = '';
//         validatedData.imagePublicId = '';
//       }
//     }
    
//     // Add new image data
//     if (imageData) {
//       validatedData.image = imageData.url;
//       validatedData.imagePublicId = imageData.publicId;
//     }
    
//     // Delete old image if new one was uploaded
//     if (oldPublicId && imageData) {
//       await deleteFromCloudinary(oldPublicId);
//     }
    
//     // Update scholarship
//     const updatedScholarship = await Scholarship.findByIdAndUpdate(
//       id,
//       validatedData,
//       { new: true, runValidators: true }
//     );
    
//     res.status(200).json({
//       success: true,
//       message: 'Scholarship updated successfully',
//       data: updatedScholarship
//     });
//   } catch (error) {
//     console.error('Update scholarship error:', error);
    
//     // Clean up uploaded image if update failed
//     if (req.file && req.file.filename) {
//       await deleteFromCloudinary(req.file.filename);
//     }
    
//     const statusCode = error.name === 'ValidationError' ? 400 : 500;
//     res.status(statusCode).json({
//       success: false,
//       error: error.message
//     });
//   }
// };

// /**
//  * @desc    Delete a scholarship
//  * @route   DELETE /api/scholarships/:id
//  * @access  Private/Admin
//  */
// exports.deleteScholarship = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({
//         success: false,
//         error: 'Invalid scholarship ID'
//       });
//     }
    
//     // Find scholarship first to get image public ID
//     const scholarship = await Scholarship.findById(id);
//     if (!scholarship) {
//       return res.status(404).json({
//         success: false,
//         error: 'Scholarship not found'
//       });
//     }
    
//     // Delete image from Cloudinary
//     if (scholarship.imagePublicId) {
//       await deleteFromCloudinary(scholarship.imagePublicId);
//     }
    
//     // Delete scholarship from database
//     await Scholarship.findByIdAndDelete(id);
    
//     res.status(200).json({
//       success: true,
//       message: 'Scholarship deleted successfully',
//       data: {}
//     });
//   } catch (error) {
//     console.error('Delete scholarship error:', error);
//     res.status(500).json({
//       success: false,
//       error: 'Server error while deleting scholarship'
//     });
//   }
// };

// /**
//  * @desc    Upload image for scholarship
//  * @route   POST /api/scholarships/:id/image
//  * @access  Private/Admin
//  */
// exports.uploadScholarshipImage = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({
//         success: false,
//         error: 'Invalid scholarship ID'
//       });
//     }
    
//     if (!req.file) {
//       return res.status(400).json({
//         success: false,
//         error: 'Please upload an image file'
//       });
//     }
    
//     // Check if scholarship exists
//     const scholarship = await Scholarship.findById(id);
//     if (!scholarship) {
//       // Delete uploaded image if scholarship not found
//       if (req.file.filename) {
//         await deleteFromCloudinary(req.file.filename);
//       }
//       return res.status(404).json({
//         success: false,
//         error: 'Scholarship not found'
//       });
//     }
    
//     // Delete old image if exists
//     if (scholarship.imagePublicId) {
//       await deleteFromCloudinary(scholarship.imagePublicId);
//     }
    
//     // Update scholarship with new image
//     scholarship.image = req.file.path;
//     scholarship.imagePublicId = req.file.filename;
//     await scholarship.save();
    
//     res.status(200).json({
//       success: true,
//       message: 'Image uploaded successfully',
//       data: {
//         imageUrl: req.file.path,
//         publicId: req.file.filename
//       }
//     });
//   } catch (error) {
//     console.error('Upload image error:', error);
    
//     // Clean up uploaded image on error
//     if (req.file && req.file.filename) {
//       await deleteFromCloudinary(req.file.filename);
//     }
    
//     res.status(500).json({
//       success: false,
//       error: 'Server error while uploading image'
//     });
//   }
// };

// /**
//  * @desc    Get featured scholarships
//  * @route   GET /api/scholarships/featured
//  * @access  Public
//  */
// exports.getFeaturedScholarships = async (req, res) => {
//   try {
//     const scholarships = await Scholarship.find({ 
//       featured: true,
//       applicationStatus: 'open'
//     })
//     .sort({ createdAt: -1 })
//     .limit(6)
//     .lean();
    
//     res.status(200).json({
//       success: true,
//       count: scholarships.length,
//       data: scholarships
//     });
//   } catch (error) {
//     console.error('Get featured scholarships error:', error);
//     res.status(500).json({
//       success: false,
//       error: 'Server error while fetching featured scholarships'
//     });
//   }
// };

// /**
//  * @desc    Get scholarships by country
//  * @route   GET /api/scholarships/country/:country
//  * @access  Public
//  */
// exports.getScholarshipsByCountry = async (req, res) => {
//   try {
//     const { country } = req.params;
//     const { limit = 10 } = req.query;
    
//     const scholarships = await Scholarship.find({ 
//       country: new RegExp(country, 'i'),
//       applicationStatus: 'open'
//     })
//     .sort({ deadline: 1 })
//     .limit(parseInt(limit))
//     .lean();
    
//     res.status(200).json({
//       success: true,
//       count: scholarships.length,
//       data: scholarships
//     });
//   } catch (error) {
//     console.error('Get scholarships by country error:', error);
//     res.status(500).json({
//       success: false,
//       error: 'Server error while fetching scholarships by country'
//     });
//   }
// };

// /**
//  * @desc    Get scholarship statistics
//  * @route   GET /api/scholarships/stats
//  * @access  Public
//  */
// exports.getStatistics = async (req, res) => {
//   try {
//     const [
//       totalScholarships,
//       openScholarships,
//       featuredScholarships,
//       upcomingDeadlines,
//       countryStats,
//       typeStats
//     ] = await Promise.all([
//       Scholarship.countDocuments(),
//       Scholarship.countDocuments({ applicationStatus: 'open' }),
//       Scholarship.countDocuments({ featured: true, applicationStatus: 'open' }),
//       Scholarship.countDocuments({ 
//         deadline: { $gt: new Date() },
//         applicationStatus: 'open'
//       }),
//       Scholarship.aggregate([
//         { $group: { _id: '$country', count: { $sum: 1 } } },
//         { $sort: { count: -1 } },
//         { $limit: 10 }
//       ]),
//       Scholarship.aggregate([
//         { $group: { _id: '$type', count: { $sum: 1 } } }
//       ])
//     ]);
    
//     res.status(200).json({
//       success: true,
//       data: {
//         total: totalScholarships,
//         open: openScholarships,
//         featured: featuredScholarships,
//         upcoming: upcomingDeadlines,
//         topCountries: countryStats,
//         types: typeStats,
//         expired: totalScholarships - openScholarships
//       }
//     });
//   } catch (error) {
//     console.error('Get statistics error:', error);
//     res.status(500).json({
//       success: false,
//       error: 'Server error while fetching statistics'
//     });
//   }
// };

// /**
//  * @desc    Bulk delete scholarships
//  * @route   DELETE /api/scholarships/bulk
//  * @access  Private/Admin
//  */
// exports.bulkDeleteScholarships = async (req, res) => {
//   try {
//     const { ids } = req.body;
    
//     if (!Array.isArray(ids) || ids.length === 0) {
//       return res.status(400).json({
//         success: false,
//         error: 'Please provide an array of scholarship IDs to delete'
//       });
//     }
    
//     // Validate all IDs
//     const invalidIds = ids.filter(id => !mongoose.Types.ObjectId.isValid(id));
//     if (invalidIds.length > 0) {
//       return res.status(400).json({
//         success: false,
//         error: `Invalid scholarship IDs: ${invalidIds.join(', ')}`
//       });
//     }
    
//     // Get scholarships to delete (to get their image public IDs)
//     const scholarships = await Scholarship.find({ _id: { $in: ids } });
    
//     // Delete images from Cloudinary
//     const deletePromises = scholarships.map(scholarship => {
//       if (scholarship.imagePublicId) {
//         return deleteFromCloudinary(scholarship.imagePublicId);
//       }
//       return Promise.resolve();
//     });
    
//     await Promise.all(deletePromises);
    
//     // Delete scholarships from database
//     const result = await Scholarship.deleteMany({ _id: { $in: ids } });
    
//     res.status(200).json({
//       success: true,
//       message: `${result.deletedCount} scholarships deleted successfully`,
//       deletedCount: result.deletedCount
//     });
//   } catch (error) {
//     console.error('Bulk delete error:', error);
//     res.status(500).json({
//       success: false,
//       error: 'Server error during bulk deletion'
//     });
//   }
// };

// /**
//  * @desc    Update multiple scholarships (bulk update)
//  * @route   PATCH /api/scholarships/bulk
//  * @access  Private/Admin
//  */
// exports.bulkUpdateScholarships = async (req, res) => {
//   try {
//     const { ids, updateData } = req.body;
    
//     if (!Array.isArray(ids) || ids.length === 0) {
//       return res.status(400).json({
//         success: false,
//         error: 'Please provide an array of scholarship IDs to update'
//       });
//     }
    
//     if (!updateData || typeof updateData !== 'object') {
//       return res.status(400).json({
//         success: false,
//         error: 'Please provide update data'
//       });
//     }
    
//     // Validate all IDs
//     const invalidIds = ids.filter(id => !mongoose.Types.ObjectId.isValid(id));
//     if (invalidIds.length > 0) {
//       return res.status(400).json({
//         success: false,
//         error: `Invalid scholarship IDs: ${invalidIds.join(', ')}`
//       });
//     }
    
//     // Update scholarships
//     const result = await Scholarship.updateMany(
//       { _id: { $in: ids } },
//       updateData,
//       { runValidators: true }
//     );
    
//     res.status(200).json({
//       success: true,
//       message: `${result.modifiedCount} scholarships updated successfully`,
//       modifiedCount: result.modifiedCount,
//       matchedCount: result.matchedCount
//     });
//   } catch (error) {
//     console.error('Bulk update error:', error);
//     res.status(500).json({
//       success: false,
//       error: 'Server error during bulk update'
//     });
//   }
// };

// /**
//  * @desc    Search scholarships with advanced filters
//  * @route   GET /api/scholarships/search
//  * @access  Public
//  */
// exports.searchScholarships = async (req, res) => {
//   try {
//     const {
//       q, // Search query
//       countries,
//       types,
//       studyLevels,
//       funding,
//       sortBy = 'deadline',
//       sortOrder = 'asc'
//     } = req.query;
    
//     const query = {};
    
//     // Text search
//     if (q) {
//       query.$text = { $search: q };
//     }
    
//     // Array filters
//     if (countries) {
//       const countryArray = countries.split(',').map(c => c.trim());
//       query.country = { $in: countryArray };
//     }
    
//     if (types) {
//       const typeArray = types.split(',').map(t => t.trim());
//       query.type = { $in: typeArray };
//     }
    
//     if (studyLevels) {
//       const levelArray = studyLevels.split(',').map(l => l.trim());
//       query.studyLevel = { $in: levelArray };
//     }
    
//     // Funding filter
//     if (funding) {
//       if (funding === 'fully') query.type = 'Fully Funded';
//       else if (funding === 'partial') query.type = 'Partially Funded';
//     }
    
//     // Only show open scholarships by default
//     if (req.query.status === undefined) {
//       query.applicationStatus = 'open';
//     } else if (req.query.status) {
//       query.applicationStatus = req.query.status;
//     }
    
//     // Sort options
//     const sortOptions = {
//       deadline: { deadline: sortOrder === 'desc' ? -1 : 1 },
//       newest: { createdAt: -1 },
//       featured: { featured: -1 },
//       popular: { views: -1 },
//       title: { title: sortOrder === 'desc' ? -1 : 1 }
//     };
    
//     const sort = sortOptions[sortBy] || { deadline: 1 };
    
//     const scholarships = await Scholarship.find(query)
//       .sort(sort)
//       .limit(50)
//       .lean();
    
//     res.status(200).json({
//       success: true,
//       count: scholarships.length,
//       data: scholarships
//     });
//   } catch (error) {
//     console.error('Search scholarships error:', error);
//     res.status(500).json({
//       success: false,
//       error: 'Server error during search'
//     });
//   }
// };



const mongoose = require('mongoose');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const Scholarship = require('../models/CreateScholarship');

/* ====================================
   CLOUDINARY CONFIGURATION
==================================== */

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'scholarships',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [
      { width: 1200, height: 800, crop: 'limit', quality: 'auto' },
      { fetch_format: 'auto' }
    ],
    public_id: (req, file) => {
      const timestamp = Date.now();
      const originalName = file.originalname.replace(/\.[^/.]+$/, '');
      const sanitizedName = originalName.replace(/[^a-zA-Z0-9]/g, '_');
      return `scholarship_${sanitizedName}_${timestamp}`;
    }
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 1 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(file.originalname.toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) return cb(null, true);
    cb(new Error('Only image files are allowed'));
  }
});

/* ✅ DO NOT REMOVE */
exports.uploadMiddleware = upload;

/* ✅ REQUIRED FOR ROUTES */
exports.uploadSingleImage = upload.single('image');

/* ====================================
   CLOUDINARY HELPERS
==================================== */

const uploadToCloudinary = async (file, options = {}) => {
  const uploadOptions = {
    folder: 'scholarships',
    transformation: [{ width: 1200, height: 800, crop: 'limit', quality: 'auto' }],
    ...options
  };

  let result;

  if (Buffer.isBuffer(file)) {
    result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(uploadOptions, (err, res) =>
        err ? reject(err) : resolve(res)
      );
      stream.end(file);
    });
  } else {
    result = await cloudinary.uploader.upload(file, uploadOptions);
  }

  return {
    url: result.secure_url,
    publicId: result.public_id
  };
};

const deleteFromCloudinary = async (publicId) => {
  if (!publicId) return;
  await cloudinary.uploader.destroy(publicId);
};

const handleImageUpload = async (file, existingPublicId = null) => {
  if (existingPublicId) await deleteFromCloudinary(existingPublicId);

  if (file?.path) {
    return { url: file.path, publicId: file.filename };
  }

  if (file?.buffer) {
    return await uploadToCloudinary(file.buffer);
  }

  if (typeof file === 'string') {
    return await uploadToCloudinary(file);
  }

  return null;
};

/* ====================================
   VALIDATION
==================================== */

const validateScholarshipData = (data) => {
  const validated = { ...data };

  const required = ['title', 'provider', 'country', 'type', 'studyLevel', 'deadline', 'eligibility'];
  const missing = required.filter(f => !validated[f]);
  if (missing.length) throw new Error(`Missing fields: ${missing.join(', ')}`);

  ['studyLevel', 'benefits', 'requirements', 'tags'].forEach(field => {
    if (validated[field] && !Array.isArray(validated[field])) {
      validated[field] = validated[field].split(',').map(v => v.trim()).filter(Boolean);
    }
  });

  validated.deadline = new Date(validated.deadline);
  if (isNaN(validated.deadline)) throw new Error('Invalid deadline');

  if (validated.featured !== undefined) {
    validated.featured = Boolean(validated.featured);
  }

  return validated;
};

/* ====================================
   CONTROLLERS
==================================== */

exports.getAllScholarships = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, country, type, featured } = req.query;
    const query = {};

    if (country) query.country = new RegExp(country, 'i');
    if (type) query.type = type;
    if (featured !== undefined) query.featured = featured === 'true';

    if (search) {
      query.$or = [
        { title: new RegExp(search, 'i') },
        { provider: new RegExp(search, 'i') },
        { eligibility: new RegExp(search, 'i') }
      ];
    }

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      Scholarship.find(query).sort('-createdAt').skip(skip).limit(+limit),
      Scholarship.countDocuments(query)
    ]);

    res.json({ success: true, total, count: data.length, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};


exports.getScholarshipsByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const { page = 1, limit = 10, search, country, type, featured } = req.query;

    const query = {
      email: email.toLowerCase()
    };

    if (country) query.country = new RegExp(country, 'i');
    if (type) query.type = type;
    if (featured !== undefined) query.featured = featured === 'true';

    if (search) {
      query.$or = [
        { title: new RegExp(search, 'i') },
        { provider: new RegExp(search, 'i') },
        { eligibility: new RegExp(search, 'i') }
      ];
    }

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      Scholarship.find(query).sort('-createdAt').skip(skip).limit(+limit),
      Scholarship.countDocuments(query)
    ]);

    res.json({
      success: true,
      total,
      count: data.length,
      data
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};


exports.getApplicationById = async (req, res) => {
  try {
    const app = await Scholarship.findById(req.params.id);
    if (!app) return res.status(404).json({ success: false, error: 'Not found' });
    res.json({ success: true, data: app });
  } catch {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// exports.createScholarship = async (req, res) => {
//   try {
//     const validatedData = validateScholarshipData(req.body);

//     let imageData = null;

//     if (req.file) {
//       imageData = { url: req.file.path, publicId: req.file.filename };
//     } else if (req.body.image) {
//       imageData = await handleImageUpload(req.body.image);
//     }

//     if (imageData) {
//       validatedData.image = imageData.url;
//       validatedData.imagePublicId = imageData.publicId;
//     }

//     const scholarship = await Scholarship.create(validatedData);

//     res.status(201).json({ success: true, data: scholarship });
//   } catch (error) {
//     if (req.file?.filename) await deleteFromCloudinary(req.file.filename);
//     res.status(400).json({ success: false, error: error.message });
//   }
// };
exports.createScholarship = async (req, res) => {
  try {
    // ✅ FIX studyLevel FIRST
    if (typeof req.body.studyLevel === 'string') {
      try {
        req.body.studyLevel = JSON.parse(req.body.studyLevel);
      } catch {
        req.body.studyLevel = [req.body.studyLevel];
      }
    }

    const validatedData = validateScholarshipData(req.body);

    let imageData = null;

    if (req.file) {
      imageData = { url: req.file.path, publicId: req.file.filename };
    } else if (req.body.image) {
      imageData = await handleImageUpload(req.body.image);
    }

    if (imageData) {
      validatedData.image = imageData.url;
      validatedData.imagePublicId = imageData.publicId;
    }

    const scholarship = await Scholarship.create(validatedData);

    res.status(201).json({ success: true, data: scholarship });
  } catch (error) {
    if (req.file?.filename) await deleteFromCloudinary(req.file.filename);
    res.status(400).json({ success: false, error: error.message });
  }
};


exports.updateScholarship = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ success: false, error: 'Invalid ID' });

    const scholarship = await Scholarship.findById(id);
    if (!scholarship)
      return res.status(404).json({ success: false, error: 'Not found' });

    const validatedData = validateScholarshipData(req.body);

    let imageData = null;

    if (req.file) {
      imageData = { url: req.file.path, publicId: req.file.filename };
    } else if (req.body.image && req.body.image !== scholarship.image) {
      imageData = await handleImageUpload(req.body.image, scholarship.imagePublicId);
    }

    if (imageData) {
      validatedData.image = imageData.url;
      validatedData.imagePublicId = imageData.publicId;
    }

    const updated = await Scholarship.findByIdAndUpdate(id, validatedData, {
      new: true,
      runValidators: true
    });

    res.json({ success: true, data: updated });
  } catch (err) {
    if (req.file?.filename) await deleteFromCloudinary(req.file.filename);
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.deleteScholarship = async (req, res) => {
  try {
    const scholarship = await Scholarship.findById(req.params.id);
    if (!scholarship)
      return res.status(404).json({ success: false, error: 'Not found' });

    if (scholarship.imagePublicId) {
      await deleteFromCloudinary(scholarship.imagePublicId);
    }

    await scholarship.deleteOne();
    res.json({ success: true, message: 'Deleted successfully' });
  } catch {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

exports.uploadScholarshipImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No image uploaded'
      });
    }

    const scholarship = await Scholarship.findById(req.params.id);

    if (!scholarship) {
      return res.status(404).json({
        success: false,
        error: 'Scholarship not found'
      });
    }

    // Delete old image
    if (scholarship.imagePublicId) {
      await cloudinary.uploader.destroy(scholarship.imagePublicId);
    }

    scholarship.image = req.file.path;
    scholarship.imagePublicId = req.file.filename;

    await scholarship.save();

    res.json({
      success: true,
      message: 'Image uploaded successfully',
      image: scholarship.image
    });
  } catch (error) {
    if (req.file?.filename) {
      await cloudinary.uploader.destroy(req.file.filename);
    }

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};



