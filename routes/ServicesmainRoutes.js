const express = require('express');
const router = express.Router();
const mainController = require('../controllers/mainServicesController');
const { validateFormData } = require('../validators/servicesValidation');

// ==================== CRUD Routes ====================

// CREATE - Create new form submission
router.post('/', validateFormData, mainController.createFormData);

// READ - Get all form submissions with pagination and filtering
router.get('/', mainController.getAllFormData);

// READ - Get single form submission
router.get('/:id', mainController.getFormDataById);

// UPDATE - Update form submission
router.put('/:id', validateFormData, mainController.updateFormData);

// DELETE - Delete single form submission
router.delete('/:id', mainController.deleteFormData);

// DELETE - Bulk delete form submissions
router.delete('/bulk/delete', mainController.bulkDeleteFormData);

// ==================== Dashboard Routes ====================

// Get dashboard statistics
router.get('/dashboard/stats', mainController.getDashboardStats);

// Get submissions by date range
router.get('/dashboard/submissions-by-date', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = {};
    
    if (startDate && endDate) {
      query.submittedAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    const submissions = await require('../modelsData').find(query);
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get performance metrics
router.get('/dashboard/performance', async (req, res) => {
  try {
    // Get response time statistics (time from submission to first contact)
    const performance = await require('../models/ServicesFormData').aggregate([
      {
        $match: {
          status: { $in: ['contacted', 'approved', 'rejected'] }
        }
      },
      {
        $addFields: {
          responseTime: {
            $divide: [
              { $subtract: ['$updatedAt', '$submittedAt'] },
              1000 * 60 * 60 // Convert to hours
            ]
          }
        }
      },
      {
        $group: {
          _id: null,
          avgResponseTime: { $avg: '$responseTime' },
          minResponseTime: { $min: '$responseTime' },
          maxResponseTime: { $max: '$responseTime' },
          totalProcessed: { $sum: 1 }
        }
      }
    ]);
    
    res.json(performance[0] || {});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== Email Routes ====================

// Send bulk emails
router.post('/email/bulk', mainController.sendBulkEmail);

// Send test email
router.post('/email/test', async (req, res) => {
  try {
    const { email } = req.body;
    
    await mainController.sendEmail({
      to: email,
      subject: 'Test Email from Application Portal',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #667eea; color: white; padding: 20px; text-align: center; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Test Email Successful</h1>
            </div>
            <div style="padding: 20px; background: #f9f9f9;">
              <p>This is a test email from your Application Portal.</p>
              <p>If you're receiving this, your email configuration is working correctly!</p>
              <p>Sent at: ${new Date().toLocaleString()}</p>
            </div>
          </div>
        </body>
        </html>
      `
    });
    
    res.json({ success: true, message: 'Test email sent successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==================== Export Routes ====================

// Export form data as CSV
router.get('/export/csv', async (req, res) => {
  try {
    const submissions = await require('../modelsData').find();
    
    // Convert to CSV
    const headers = [
      'ID',
      'Full Name',
      'Email',
      'Phone',
      'Target Country',
      'Program',
      'Start Date',
      'Education Level',
      'Budget',
      'Status',
      'Submitted At'
    ].join(',');
    
    const rows = submissions.map(sub => [
      sub._id,
      `"${sub.fullName}"`,
      sub.email,
      sub.phone,
      `"${sub.targetCountry}"`,
      `"${sub.program}"`,
      new Date(sub.startDate).toISOString().split('T')[0],
      `"${sub.educationLevel}"`,
      `"${sub.budget}"`,
      sub.status,
      new Date(sub.submittedAt).toISOString()
    ].join(','));
    
    const csv = [headers, ...rows].join('\n');
    
    res.header('Content-Type', 'text/csv');
    res.attachment('form-submissions.csv');
    res.send(csv);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== Health Check ====================

router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: 'Connected', // You can add actual DB check here
    version: '1.0.0'
  });
});

module.exports = router;