


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



