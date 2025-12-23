const express = require('express');
const router = express.Router();
const multer = require('multer');
const admissionBookingController = require('../controllers/admissionBookingController');
const { validateApplication, validateEmail, validateDocument } = require('../validators/admissionValidator');


// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/documents/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, JPG, PNG, DOC, and DOCX files are allowed.'));
    }
  }
});

// Public routes (no authentication required)
router.post('/', validateApplication, admissionBookingController.createApplication);
router.get('/search', admissionBookingController.searchApplications);

// Protected routes (require authentication)
// router.use(authenticate);

// Application CRUD routes
router.get('/',  admissionBookingController.getAllApplications);
router.get('/:id',  admissionBookingController.getApplication);
router.put('/:id', validateApplication, admissionBookingController.updateApplication);
router.delete('/:id', admissionBookingController.deleteApplication);

// Application actions
router.post('/:id/submit',  admissionBookingController.submitApplication);
router.patch('/:id/status', admissionBookingController.updateStatus);
router.post('/:id/notes', admissionBookingController.addNote);

// Document management
router.post('/:id/documents', 
  
  upload.single('document'),
  admissionBookingController.uploadDocument
);

router.patch('/:id/documents/:docId/verify', 
 
  admissionBookingController.verifyDocument
);

// Statistics routes
router.get('/statistics', admissionBookingController.getStatistics);
router.get('/admission-rates', admissionBookingController.getAdmissionRates);

// Email routes
router.post('/send-email', validateEmail, admissionBookingController.sendEmail);

// Bulk operations
router.post('/bulk/update',  admissionBookingController.bulkUpdate);
router.get('/export', admissionBookingController.exportApplications);

module.exports = router;