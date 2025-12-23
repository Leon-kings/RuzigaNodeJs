const multer = require("multer");
const path = require("path");
const fs = require("fs");

/* ===============================
   ENSURE UPLOAD DIRECTORY
================================ */
const uploadDir = "uploads/scholarship";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

/* ===============================
   MULTER STORAGE
================================ */
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${unique}${path.extname(file.originalname)}`);
  },
});

/* ===============================
   FILE FILTER
================================ */
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "application/pdf",
    "image/jpeg",
    "image/jpg",
    "image/png",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error("Invalid file type"), false);
  }

  cb(null, true);
};

/* ===============================
   MULTER INSTANCE
================================ */
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});

/* ===============================
   EXPRESS MIDDLEWARE (FIXED)
================================ */
const cleanupTempFiles = (req, res, next) => {
  const files = req.files || req.file;

  const deleteFile = (file) => {
    if (file?.path && fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
  };

  if (Array.isArray(files)) {
    files.forEach(deleteFile);
  } else if (typeof files === "object") {
    Object.values(files).flat().forEach(deleteFile);
  } else if (files) {
    deleteFile(files);
  }

  next(); // ✅ REQUIRED
};

/* ===============================
   EXPORT REAL MIDDLEWARE
================================ */
module.exports = {
  singleDocumentUpload: upload.single("document"),
  multipleDocumentsUpload: upload.array("documents", 10),
  specificDocumentUpload: upload.fields([
    { name: "transcripts", maxCount: 1 },
    { name: "passportCopy", maxCount: 1 },
    { name: "cvResume", maxCount: 1 },
    { name: "statementOfPurpose", maxCount: 1 },
    { name: "languageCertificate", maxCount: 1 },
    { name: "researchProposal", maxCount: 1 },
    { name: "portfolio", maxCount: 1 },
    { name: "recommendationLetter", maxCount: 3 },
  ]),
  cleanupTempFiles,
};
