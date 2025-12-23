const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = 'uploads/scholarship';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + extension);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, DOC, DOCX, JPEG, and PNG are allowed.'), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 10 // Max 10 files
  }
});

// Specific upload configurations
const singleDocumentUpload = upload.single('document');
const multipleDocumentsUpload = upload.array('documents', 10);
const specificDocumentUpload = upload.fields([
  { name: 'transcripts', maxCount: 1 },
  { name: 'passportCopy', maxCount: 1 },
  { name: 'cvResume', maxCount: 1 },
  { name: 'statementOfPurpose', maxCount: 1 },
  { name: 'languageCertificate', maxCount: 1 },
  { name: 'researchProposal', maxCount: 1 },
  { name: 'portfolio', maxCount: 1 },
  { name: 'recommendationLetter', maxCount: 3 }
]);

// Cleanup temporary files
const cleanupTempFiles = (files) => {
  if (files) {
    if (Array.isArray(files)) {
      files.forEach(file => {
        if (file.path && fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    } else if (typeof files === 'object') {
      Object.values(files).forEach(fileArray => {
        if (Array.isArray(fileArray)) {
          fileArray.forEach(file => {
            if (file.path && fs.existsSync(file.path)) {
              fs.unlinkSync(file.path);
            }
          });
        }
      });
    }
  }
};

module.exports = {
  singleDocumentUpload,
  multipleDocumentsUpload,
  specificDocumentUpload,
  cleanupTempFiles,
  upload
};