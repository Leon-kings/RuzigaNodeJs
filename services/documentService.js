// const fs = require('fs').promises;
// const path = require('path');
// const ExcelJS = require('exceljs');
// const PDFDocument = require('pdfkit');

// class DocumentService {
//   constructor() {
//     this.uploadsDir = path.join(__dirname, '../uploads');
//     this.documentsDir = path.join(this.uploadsDir, 'documents');
//     this.ensureDirectories();
//   }

//   async ensureDirectories() {
//     await fs.mkdir(this.uploadsDir, { recursive: true });
//     await fs.mkdir(this.documentsDir, { recursive: true });
//   }

//   async uploadDocument(file, applicationId, documentType) {
//     const appDir = path.join(this.documentsDir, applicationId);
//     await fs.mkdir(appDir, { recursive: true });

//     const fileName = `${documentType}_${Date.now()}_${file.originalname}`;
//     const filePath = path.join(appDir, fileName);

//     await fs.rename(file.path, filePath);

//     // Return relative URL for database storage
//     return `/uploads/documents/${applicationId}/${fileName}`;
//   }

//   async deleteApplicationDocuments(applicationId) {
//     const appDir = path.join(this.documentsDir, applicationId);
//     try {
//       await fs.rm(appDir, { recursive: true, force: true });
//       return true;
//     } catch (error) {
//       console.error('Error deleting documents:', error);
//       return false;
//     }
//   }

//   async exportToExcel(applications) {
//     const workbook = new ExcelJS.Workbook();
//     const worksheet = workbook.addWorksheet('Applications');

//     // Define columns
//     worksheet.columns = [
//       { header: 'Application ID', key: 'applicationId', width: 20 },
//       { header: 'Name', key: 'fullName', width: 25 },
//       { header: 'Email', key: 'email', width: 30 },
//       { header: 'Phone', key: 'phone', width: 20 },
//       { header: 'Nationality', key: 'nationality', width: 15 },
//       { header: 'Current Education', key: 'currentEducation', width: 20 },
//       { header: 'GPA', key: 'gpa', width: 10 },
//       { header: 'Target University', key: 'targetUniversity', width: 30 },
//       { header: 'Target Country', key: 'targetCountry', width: 20 },
//       { header: 'Target Program', key: 'targetProgram', width: 25 },
//       { header: 'Program Level', key: 'programLevel', width: 15 },
//       { header: 'Intake', key: 'intake', width: 15 },
//       { header: 'Scholarship Interest', key: 'scholarshipInterest', width: 25 },
//       { header: 'Status', key: 'status', width: 15 },
//       { header: 'Documents Status', key: 'documents', width: 15 },
//       { header: 'Essay Status', key: 'essay', width: 15 },
//       { header: 'Application Score', key: 'applicationScore', width: 15 },
//       { header: 'Created At', key: 'createdAt', width: 20 },
//       { header: 'Assigned Counselor', key: 'counselor', width: 25 }
//     ];

//     // Add data
//     applications.forEach(app => {
//       worksheet.addRow({
//         applicationId: app.applicationId,
//         fullName: app.fullName,
//         email: app.email,
//         phone: app.phone,
//         nationality: app.nationality,
//         currentEducation: app.currentEducation,
//         gpa: app.gpa,
//         targetUniversity: app.targetUniversity,
//         targetCountry: app.targetCountry,
//         targetProgram: app.targetProgram,
//         programLevel: app.programLevel,
//         intake: `${app.intakeSeason} ${app.intakeYear}`,
//         scholarshipInterest: app.scholarshipInterest,
//         status: app.status,
//         documents: app.documents,
//         essay: app.essay,
//         applicationScore: app.statistics.applicationScore || 0,
//         createdAt: app.createdAt.toLocaleDateString(),
//         counselor: app.assignedCounselor ? 
//           `${app.assignedCounselor.firstName} ${app.assignedCounselor.lastName}` : 'Not Assigned'
//       });
//     });

//     // Apply styling
//     worksheet.getRow(1).font = { bold: true };
//     worksheet.getRow(1).fill = {
//       type: 'pattern',
//       pattern: 'solid',
//       fgColor: { argb: 'FFE0E0E0' }
//     };

//     // Auto filter
//     worksheet.autoFilter = {
//       from: 'A1',
//       to: `S${applications.length + 1}`
//     };

//     // Generate buffer
//     const buffer = await workbook.xlsx.writeBuffer();
//     return buffer;
//   }

//   async exportToPDF(applications) {
//     return new Promise((resolve, reject) => {
//       try {
//         const doc = new PDFDocument({ margin: 50 });
//         const chunks = [];

//         doc.on('data', chunk => chunks.push(chunk));
//         doc.on('end', () => resolve(Buffer.concat(chunks)));
//         doc.on('error', reject);

//         // Add title
//         doc.fontSize(20).text('Admission Applications Report', { align: 'center' });
//         doc.moveDown();

//         // Add generation date
//         doc.fontSize(10)
//           .text(`Generated: ${new Date().toLocaleString()}`, { align: 'right' });
//         doc.moveDown(2);

//         // Add summary
//         doc.fontSize(12).text(`Total Applications: ${applications.length}`);
//         doc.moveDown();

//         // Create table
//         let y = doc.y;
//         const startY = y;
//         const rowHeight = 30;
//         const colWidths = [80, 60, 80, 60, 80];
//         const headers = ['ID', 'Name', 'University', 'Program', 'Status'];

//         // Draw headers
//         doc.fontSize(10).font('Helvetica-Bold');
//         headers.forEach((header, i) => {
//           doc.text(header, 50 + i * colWidths[i], y, { width: colWidths[i] });
//         });
        
//         y += rowHeight;
//         doc.moveTo(50, y).lineTo(50 + colWidths.reduce((a, b) => a + b, 0), y).stroke();

//         // Draw rows
//         doc.font('Helvetica');
//         applications.forEach((app, index) => {
//           if (y > 700) { // New page if near bottom
//             doc.addPage();
//             y = 50;
//           }

//           const rowData = [
//             app.applicationId,
//             app.fullName,
//             app.targetUniversity.substring(0, 20),
//             app.targetProgram.substring(0, 15),
//             app.status
//           ];

//           rowData.forEach((text, i) => {
//             doc.fontSize(9)
//               .text(text, 50 + i * colWidths[i], y, { width: colWidths[i] });
//           });

//           y += rowHeight;
          
//           // Draw row separator
//           doc.moveTo(50, y).lineTo(50 + colWidths.reduce((a, b) => a + b, 0), y).stroke();
//         });

//         doc.end();
//       } catch (error) {
//         reject(error);
//       }
//     });
//   }

//   async exportToCSV(applications) {
//     const headers = [
//       'Application ID', 'Name', 'Email', 'Phone', 'Nationality',
//       'Current Education', 'GPA', 'Target University', 'Target Country',
//       'Target Program', 'Program Level', 'Intake', 'Status',
//       'Documents Status', 'Essay Status', 'Created At'
//     ];

//     const rows = applications.map(app => [
//       app.applicationId,
//       app.fullName,
//       app.email,
//       app.phone,
//       app.nationality,
//       app.currentEducation,
//       app.gpa,
//       app.targetUniversity,
//       app.targetCountry,
//       app.targetProgram,
//       app.programLevel,
//       `${app.intakeSeason} ${app.intakeYear}`,
//       app.status,
//       app.documents,
//       app.essay,
//       app.createdAt.toISOString()
//     ]);

//     const csvContent = [
//       headers.join(','),
//       ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
//     ].join('\n');

//     return csvContent;
//   }
// }

// module.exports = new DocumentService();
const multer = require('multer');
const path = require('path');

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/temp/'); // Temporary upload location
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|pdf|doc|docx|txt/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only document files (PDF, DOC, JPG, PNG) are allowed'));
  }
};

// Create upload middleware
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1 * 1024 * 1024 // 1MB limit
  }
});

module.exports = upload;