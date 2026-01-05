// const cloudinary = require('cloudinary').v2;
// const { CloudinaryStorage } = require('multer-storage-cloudinary');
// const multer = require('multer');

// // Configure Cloudinary
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET
// });

// // Configure storage for accommodation images
// const accommodationStorage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: 'student_accommodation/accommodations',
//     allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
//     transformation: [{ width: 1200, height: 800, crop: 'fill' }],
//     public_id: (req, file) => {
//       const timestamp = Date.now();
//       const originalname = file.originalname.split('.')[0];
//       return `acc_${timestamp}_${originalname}`;
//     }
//   }
// });

// // Configure storage for thumbnails
// const thumbnailStorage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: 'student_accommodation/thumbnails',
//     allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
//     transformation: [{ width: 400, height: 300, crop: 'fill' }]
//   }
// });

// // Create multer upload instances
// const uploadAccommodationImage = multer({ 
//   storage: accommodationStorage,
//   limits: {
//     fileSize: 1 * 1024 * 1024 // 1MB limit
//   },
//   fileFilter: (req, file, cb) => {
//     const allowedTypes = /jpeg|jpg|png|webp/;
//     const extname = allowedTypes.test(file.originalname.toLowerCase());
//     const mimetype = allowedTypes.test(file.mimetype);
    
//     if (mimetype && extname) {
//       return cb(null, true);
//     } else {
//       cb(new Error('Only image files are allowed!'));
//     }
//   }
// });

// // Helper function to upload multiple images
// const uploadMultipleImages = uploadAccommodationImage.array('images', 10);

// // Helper function to upload single image
// const uploadSingleImage = uploadAccommodationImage.single('image');

// // Function to generate thumbnail URL
// const generateThumbnailUrl = (publicId) => {
//   return cloudinary.url(publicId, {
//     transformation: [
//       { width: 400, height: 300, crop: 'fill' },
//       { quality: 'auto' },
//       { format: 'webp' }
//     ]
//   });
// };

// // Function to delete image from Cloudinary
// const deleteImageFromCloudinary = async (publicId) => {
//   try {
//     const result = await cloudinary.uploader.destroy(publicId);
//     return result;
//   } catch (error) {
//     console.error('Error deleting image from Cloudinary:', error);
//     throw error;
//   }
// };

// module.exports = {
//   cloudinary,
//   uploadMultipleImages,
//   uploadSingleImage,
//   generateThumbnailUrl,
//   deleteImageFromCloudinary
// };



const multer = require('multer');
const path = require('path');
const cloudinary = require('cloudinary').v2;

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Multer storage (memory)
const storage = multer.memoryStorage();
const uploadMultipleImages = multer({ storage }).array('images', 10); // max 10 files
const uploadSingleImage = multer({ storage }).single('image');

// Utility functions
const generateThumbnailUrl = (url) => {
  return url; // implement if needed
};

const deleteImageFromCloudinary = async (publicId) => {
  return await cloudinary.uploader.destroy(publicId);
};

module.exports = { uploadMultipleImages, uploadSingleImage, cloudinary, generateThumbnailUrl, deleteImageFromCloudinary };
