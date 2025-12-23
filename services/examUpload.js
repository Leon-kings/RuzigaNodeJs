const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../cloudinary/cloudinary');

// Define allowed file types
const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

// Configure Cloudinary storage for exams
const examImageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'csce-exams',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [{ width: 800, height: 600, crop: 'limit' }],
    public_id: (req, file) => {
      const timestamp = Date.now();
      const examName = req.body.name ? req.body.name.replace(/\s+/g, '-').toLowerCase() : 'exam';
      return `exam-${examName}-${timestamp}`;
    }
  }
});

// Configure Cloudinary storage for profiles
const profileStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'csce-profiles',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    transformation: [{ width: 300, height: 300, crop: 'thumb', gravity: 'face' }],
    public_id: (req, file) => {
      const timestamp = Date.now();
      return `profile-${req.user?.id || 'user'}-${timestamp}`;
    }
  }
});

// File filter function
const fileFilter = (req, file, cb) => {
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.'), false);
  }
};

// Multer upload configurations
const uploadExamImage = multer({
  storage: examImageStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1 * 1024 * 1024, // 1MB limit
    files: 1
  }
});

const uploadProfileImage = multer({
  storage: profileStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1 * 1024 * 1024, // 2MB limit
    files: 1
  }
});

// Middleware to handle single file upload
const singleExamImageUpload = uploadExamImage.single('image');

// Middleware to handle single profile image upload
const singleProfileImageUpload = uploadProfileImage.single('avatar');

// Middleware to handle multiple file uploads
const multipleExamImagesUpload = uploadExamImage.array('images', 5); // Max 5 images

// Helper function to delete image from Cloudinary
const deleteImageFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    throw error;
  }
};

// Helper function to extract public ID from Cloudinary URL
const extractPublicIdFromUrl = (url) => {
  try {
    const urlParts = url.split('/');
    const uploadIndex = urlParts.indexOf('upload');
    if (uploadIndex !== -1 && uploadIndex + 1 < urlParts.length) {
      const versionAndPublicId = urlParts[uploadIndex + 1];
      const parts = versionAndPublicId.split('/');
      const publicIdWithExtension = parts.slice(1).join('/');
      const publicId = publicIdWithExtension.split('.')[0];
      return publicId;
    }
    return null;
  } catch (error) {
    console.error('Error extracting public ID from URL:', error);
    return null;
  }
};

module.exports = {
  singleExamImageUpload,
  singleProfileImageUpload,
  multipleExamImagesUpload,
  deleteImageFromCloudinary,
  extractPublicIdFromUrl,
  cloudinary
};