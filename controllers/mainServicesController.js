const FormData = require('../models/ServicesFormData');
const nodemailer = require('nodemailer');
const { validationResult } = require('express-validator');

class MainController {
  // ==================== CRUD Operations ====================
  
  // CREATE - Create new form submission
  async createFormData(req, res) {
    try {
      // Validate request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      const formData = new FormData({
        fullName: req.body.fullName,
        email: req.body.email,
        phone: req.body.phone,
        targetCountry: req.body.targetCountry,
        program: req.body.program,
        startDate: req.body.startDate,
        educationLevel: req.body.educationLevel,
        budget: req.body.budget,
        requirements: req.body.requirements || '',
        status: req.body.status || 'pending'
      });

      const savedData = await formData.save();

      // Send confirmation email
      await this.sendConfirmationEmail(savedData);

      res.status(201).json({
        success: true,
        message: 'Form data created successfully',
        data: savedData
      });
    } catch (error) {
      console.error('Create form data error:', error);
      res.status(500).json({
        success: false,
        message: 'Error creating form data',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // READ - Get all form submissions with pagination and filtering
  async getAllFormData(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        status,
        search,
        country,
        program,
        sortBy = 'submittedAt',
        sortOrder = 'desc'
      } = req.query;

      // Build query
      const query = {};
      
      if (status && status !== 'all') {
        query.status = status;
      }
      
      if (country && country !== 'all') {
        query.targetCountry = country;
      }
      
      if (program && program !== 'all') {
        query.program = program;
      }
      
      if (search) {
        query.$or = [
          { fullName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { phone: { $regex: search, $options: 'i' } },
          { requirements: { $regex: search, $options: 'i' } }
        ];
      }

      // Build sort
      const sort = {};
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

      // Execute query with pagination
      const submissions = await FormData.find(query)
        .sort(sort)
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .select('-__v'); // Exclude version key

      const total = await FormData.countDocuments(query);

      // Get filter options for frontend
      const countries = await FormData.distinct('targetCountry');
      const programs = await FormData.distinct('program');
      const statuses = ['pending', 'contacted', 'approved', 'rejected'];

      res.json({
        success: true,
        data: submissions,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / limit)
        },
        filters: {
          countries,
          programs,
          statuses
        }
      });
    } catch (error) {
      console.error('Get all form data error:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching form data',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  async getFormDataByEmail(req, res) {
    try {
      const { email } = req.params;
      const {
        page = 1,
        limit = 10,
        status,
        search,
        country,
        program,
        sortBy = 'submittedAt',
        sortOrder = 'desc'
      } = req.query;

      // Build query
      const query = { email: email.toLowerCase() };
      
      if (status && status !== 'all') {
        query.status = status;
      }
      
      if (country && country !== 'all') {
        query.targetCountry = country;
      }
      
      if (program && program !== 'all') {
        query.program = program;
      }
      
      if (search) {
        query.$or = [
          { fullName: { $regex: search, $options: 'i' } },
          { phone: { $regex: search, $options: 'i' } },
          { requirements: { $regex: search, $options: 'i' } }
        ];
      }

      // Build sort
      const sort = {};
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

      // Execute query with pagination
      const submissions = await FormData.find(query)
        .sort(sort)
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .select('-__v');

      const total = await FormData.countDocuments(query);

      // Get filter options for frontend (optional, still for user)
      const countries = await FormData.distinct('targetCountry');
      const programs = await FormData.distinct('program');
      const statuses = ['pending', 'contacted', 'approved', 'rejected'];

      res.json({
        success: true,
        data: submissions,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / limit)
        },
        filters: {
          countries,
          programs,
          statuses
        }
      });
    } catch (error) {
      console.error('Get form data by email error:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching form data by email',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }


  // READ - Get single form submission by ID
  async getFormDataById(req, res) {
    try {
      const submission = await FormData.findById(req.params.id)
        .select('-__v');

      if (!submission) {
        return res.status(404).json({
          success: false,
          message: 'Form data not found'
        });
      }

      res.json({
        success: true,
        data: submission
      });
    } catch (error) {
      console.error('Get form data by ID error:', error);
      
      if (error.name === 'CastError') {
        return res.status(400).json({
          success: false,
          message: 'Invalid form data ID'
        });
      }
      
      res.status(500).json({
        success: false,
        message: 'Error fetching form data',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // UPDATE - Update form submission by ID
  async updateFormData(req, res) {
    try {
      // Validate request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      const { id } = req.params;
      const updateData = { ...req.body };
      
      // Remove immutable fields
      delete updateData._id;
      delete updateData.submittedAt;
      delete updateData.createdAt;

      const updatedData = await FormData.findByIdAndUpdate(
        id,
        updateData,
        {
          new: true,
          runValidators: true,
          context: 'query'
        }
      ).select('-__v');

      if (!updatedData) {
        return res.status(404).json({
          success: false,
          message: 'Form data not found'
        });
      }

      // Send update notification email if email or status changed
      if (req.body.status || req.body.email) {
        await this.sendStatusUpdateEmail(updatedData);
      }

      res.json({
        success: true,
        message: 'Form data updated successfully',
        data: updatedData
      });
    } catch (error) {
      console.error('Update form data error:', error);
      
      if (error.name === 'CastError') {
        return res.status(400).json({
          success: false,
          message: 'Invalid form data ID'
        });
      }
      
      if (error.name === 'ValidationError') {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: Object.values(error.errors).map(err => err.message)
        });
      }
      
      res.status(500).json({
        success: false,
        message: 'Error updating form data',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // DELETE - Delete form submission by ID
  async deleteFormData(req, res) {
    try {
      const { id } = req.params;
      
      const deletedData = await FormData.findByIdAndDelete(id)
        .select('-__v');

      if (!deletedData) {
        return res.status(404).json({
          success: false,
          message: 'Form data not found'
        });
      }

      // Send deletion notification email
      await this.sendDeletionEmail(deletedData);

      res.json({
        success: true,
        message: 'Form data deleted successfully',
        data: deletedData
      });
    } catch (error) {
      console.error('Delete form data error:', error);
      
      if (error.name === 'CastError') {
        return res.status(400).json({
          success: false,
          message: 'Invalid form data ID'
        });
      }
      
      res.status(500).json({
        success: false,
        message: 'Error deleting form data',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // DELETE - Bulk delete form submissions
  async bulkDeleteFormData(req, res) {
    try {
      const { ids } = req.body;

      if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Please provide an array of IDs to delete'
        });
      }

      const result = await FormData.deleteMany({
        _id: { $in: ids }
      });

      res.json({
        success: true,
        message: `Successfully deleted ${result.deletedCount} form submissions`,
        deletedCount: result.deletedCount
      });
    } catch (error) {
      console.error('Bulk delete error:', error);
      res.status(500).json({
        success: false,
        message: 'Error bulk deleting form data',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // ==================== Dashboard Operations ====================
  
  async getDashboardStats(req, res) {
    try {
      // Get total submissions
      const totalSubmissions = await FormData.countDocuments();
      
      // Get submissions by status
      const submissionsByStatus = await FormData.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } }
      ]);
      
      // Get submissions by country
      const submissionsByCountry = await FormData.aggregate([
        {
          $group: {
            _id: '$targetCountry',
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]);
      
      // Get submissions by program
      const submissionsByProgram = await FormData.aggregate([
        {
          $group: {
            _id: '$program',
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]);
      
      // Get recent submissions (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const recentSubmissions = await FormData.countDocuments({
        submittedAt: { $gte: sevenDaysAgo }
      });
      
      // Get today's submissions
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const todaySubmissions = await FormData.countDocuments({
        submittedAt: { $gte: today }
      });
      
      // Get monthly trend
      const monthlyTrend = await FormData.aggregate([
        {
          $group: {
            _id: {
              year: { $year: '$submittedAt' },
              month: { $month: '$submittedAt' }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
        { $limit: 12 }
      ]);
      
      // Get budget statistics
      const budgetStats = await FormData.aggregate([
        {
          $group: {
            _id: '$budget',
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } },
        { $limit: 5 }
      ]);
      
      // Get education level statistics
      const educationStats = await FormData.aggregate([
        {
          $group: {
            _id: '$educationLevel',
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } }
      ]);

      res.json({
        success: true,
        data: {
          totalSubmissions,
          todaySubmissions,
          recentSubmissions,
          averageDailySubmissions: Math.round(recentSubmissions / 7),
          submissionsByStatus: submissionsByStatus.reduce((acc, curr) => {
            acc[curr._id] = curr.count;
            return acc;
          }, {}),
          submissionsByCountry,
          submissionsByProgram,
          monthlyTrend,
          budgetStats,
          educationStats,
          statusDistribution: this.calculatePercentage(submissionsByStatus, totalSubmissions)
        }
      });
    } catch (error) {
      console.error('Dashboard stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching dashboard statistics'
      });
    }
  }

  // ==================== Email Operations ====================

  async sendConfirmationEmail(formData) {
    try {
      const emailContent = this.generateConfirmationEmail(formData);
      
      await this.sendEmail({
        to: formData.email,
        subject: 'Form Submission Confirmation',
        html: emailContent
      });
      
      console.log(`Confirmation email sent to ${formData.email}`);
    } catch (error) {
      console.error('Error sending confirmation email:', error);
      // Don't throw error to prevent form submission failure
    }
  }

  async sendStatusUpdateEmail(formData) {
    try {
      const emailContent = this.generateStatusUpdateEmail(formData);
      
      await this.sendEmail({
        to: formData.email,
        subject: `Application Status Update - ${formData.status.toUpperCase()}`,
        html: emailContent
      });
      
      console.log(`Status update email sent to ${formData.email}`);
    } catch (error) {
      console.error('Error sending status update email:', error);
    }
  }

  async sendDeletionEmail(formData) {
    try {
      const emailContent = this.generateDeletionEmail(formData);
      
      await this.sendEmail({
        to: formData.email,
        subject: 'Application Deletion Notification',
        html: emailContent
      });
      
      console.log(`Deletion notification email sent to ${formData.email}`);
    } catch (error) {
      console.error('Error sending deletion email:', error);
    }
  }

  async sendEmail(emailData) {
    try {
      // Create transporter
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: process.env.EMAIL_PORT || 587,
        secure: process.env.EMAIL_SECURE === 'true',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD
        },
        tls: {
          rejectUnauthorized: false
        }
      });

      // Verify connection
      await transporter.verify();
      console.log('Email server is ready to send messages');

      // Send mail
      const mailOptions = {
        from: process.env.EMAIL_FROM || '"Application Portal" <noreply@application.com>',
        to: emailData.to,
        subject: emailData.subject,
        html: emailData.html,
        text: emailData.text || this.stripHtml(emailData.html),
        replyTo: process.env.EMAIL_REPLY_TO || process.env.EMAIL_USER
      };

      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent:', info.messageId);
      return info;
    } catch (error) {
      console.error('Email send error:', error);
      throw error;
    }
  }

  async sendBulkEmail(req, res) {
    try {
      const { recipients, subject, message, template = 'default' } = req.body;

      if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Please provide an array of recipient emails'
        });
      }

      if (!subject || !message) {
        return res.status(400).json({
          success: false,
          message: 'Subject and message are required'
        });
      }

      const results = [];
      const failed = [];

      for (const recipient of recipients) {
        try {
          const emailContent = this.generateBulkEmail(recipient, message, template);
          
          await this.sendEmail({
            to: recipient,
            subject: subject,
            html: emailContent
          });
          
          results.push({ email: recipient, status: 'sent' });
          console.log(`Bulk email sent to ${recipient}`);
        } catch (error) {
          console.error(`Failed to send to ${recipient}:`, error.message);
          failed.push({ email: recipient, error: error.message });
          results.push({ email: recipient, status: 'failed', error: error.message });
        }
      }

      res.json({
        success: true,
        message: `Bulk email operation completed. Sent: ${results.filter(r => r.status === 'sent').length}, Failed: ${failed.length}`,
        results: results,
        summary: {
          total: recipients.length,
          sent: results.filter(r => r.status === 'sent').length,
          failed: failed.length
        }
      });
    } catch (error) {
      console.error('Bulk email error:', error);
      res.status(500).json({
        success: false,
        message: 'Error sending bulk emails',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // ==================== Helper Methods ====================

  calculatePercentage(data, total) {
    return data.map(item => ({
      category: item._id,
      count: item.count,
      percentage: total > 0 ? ((item.count / total) * 100).toFixed(2) : 0
    }));
  }

  stripHtml(html) {
    return html.replace(/<[^>]*>?/gm, '').replace(/\s+/g, ' ').trim();
  }

  // ==================== Email Templates ====================

  generateConfirmationEmail(formData) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
          .container { padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; border-top: 1px solid #eee; margin-top: 20px; }
          .info-box { background: white; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #667eea; }
          .info-label { font-weight: bold; color: #555; }
          .info-value { color: #333; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Application Received</h1>
          </div>
          <div class="content">
            <p>Dear <strong>${formData.fullName}</strong>,</p>
            <p>Thank you for submitting your application through our portal. We have received your details and our team will review them shortly.</p>
            
            <div class="info-box">
              <p><span class="info-label">Application ID:</span> <span class="info-value">${formData._id}</span></p>
              <p><span class="info-label">Submitted:</span> <span class="info-value">${new Date(formData.submittedAt).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span></p>
            </div>
            
            <h3>Application Summary:</h3>
            <div class="info-box">
              <p><span class="info-label">Program:</span> <span class="info-value">${formData.program}</span></p>
              <p><span class="info-label">Target Country:</span> <span class="info-value">${formData.targetCountry}</span></p>
              <p><span class="info-label">Start Date:</span> <span class="info-value">${new Date(formData.startDate).toLocaleDateString()}</span></p>
              <p><span class="info-label">Education Level:</span> <span class="info-value">${formData.educationLevel}</span></p>
              <p><span class="info-label">Budget Range:</span> <span class="info-value">${formData.budget}</span></p>
            </div>
            
            <p><strong>Next Steps:</strong></p>
            <ol>
              <li>Our team will review your application within 3-5 business days</li>
              <li>You'll receive an update via email once your application is reviewed</li>
              <li>Please check your email regularly for updates</li>
            </ol>
            
            <p>If you have any questions, please don't hesitate to contact our support team.</p>
            
            <p>Best regards,<br>The Application Portal Team</p>
          </div>
          <div class="footer">
            <p>This is an automated email. Please do not reply to this message.</p>
            <p>© ${new Date().getFullYear()} Application Portal. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  generateStatusUpdateEmail(formData) {
    const statusMessages = {
      pending: 'Your application is currently being reviewed by our team.',
      contacted: 'Our team has contacted you for additional information or clarification.',
      approved: 'Congratulations! Your application has been approved.',
      rejected: 'After careful consideration, we regret to inform you that your application has been rejected.'
    };

    const statusColors = {
      pending: '#FFA500',
      contacted: '#0080FF',
      approved: '#00C851',
      rejected: '#FF3547'
    };

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
          .container { padding: 20px; }
          .header { background: ${statusColors[formData.status] || '#667eea'}; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; border-top: 1px solid #eee; margin-top: 20px; }
          .status-badge { display: inline-block; padding: 8px 20px; background: white; color: ${statusColors[formData.status] || '#667eea'}; border-radius: 20px; font-weight: bold; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Application Status Update</h1>
          </div>
          <div class="content">
            <p>Dear <strong>${formData.fullName}</strong>,</p>
            
            <div style="text-align: center; margin: 20px 0;">
              <div class="status-badge">STATUS: ${formData.status.toUpperCase()}</div>
            </div>
            
            <p>${statusMessages[formData.status] || 'Your application status has been updated.'}</p>
            
            <div style="background: white; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid ${statusColors[formData.status] || '#667eea'}">
              <p><strong>Application Details:</strong></p>
              <p>ID: ${formData._id}</p>
              <p>Program: ${formData.program}</p>
              <p>Country: ${formData.targetCountry}</p>
              <p>Updated: ${new Date().toLocaleDateString()}</p>
            </div>
            
            ${formData.status === 'approved' ? `
            <p><strong>Next Steps:</strong></p>
            <ol>
              <li>Our representative will contact you within 24 hours</li>
              <li>Please prepare the necessary documents</li>
              <li>Check your email for further instructions</li>
            </ol>
            ` : ''}
            
            ${formData.status === 'rejected' ? `
            <p>If you would like more information about this decision or wish to appeal, please contact our support team.</p>
            ` : ''}
            
            <p>Thank you for using our application portal.</p>
            
            <p>Best regards,<br>The Application Portal Team</p>
          </div>
          <div class="footer">
            <p>This is an automated email. Please do not reply to this message.</p>
            <p>© ${new Date().getFullYear()} Application Portal. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  generateDeletionEmail(formData) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
          .container { padding: 20px; }
          .header { background: #FF3547; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; border-top: 1px solid #eee; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Application Deleted</h1>
          </div>
          <div class="content">
            <p>Dear <strong>${formData.fullName}</strong>,</p>
            
            <p>This email is to inform you that your application has been deleted from our system.</p>
            
            <div style="background: white; padding: 15px; border-radius: 5px; margin: 20px 0; border: 1px solid #FF3547;">
              <p><strong>Deleted Application Details:</strong></p>
              <p>Application ID: ${formData._id}</p>
              <p>Program: ${formData.program}</p>
              <p>Country: ${formData.targetCountry}</p>
              <p>Deleted: ${new Date().toLocaleDateString()}</p>
            </div>
            
            <p><strong>Note:</strong> Once deleted, your application cannot be recovered. If this was done in error or if you wish to reapply, please visit our portal and submit a new application.</p>
            
            <p>If you have any questions or concerns, please contact our support team.</p>
            
            <p>Best regards,<br>The Application Portal Team</p>
          </div>
          <div class="footer">
            <p>This is an automated email. Please do not reply to this message.</p>
            <p>© ${new Date().getFullYear()} Application Portal. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  generateBulkEmail(recipient, message, template) {
    // You can expand this with different templates
    const templates = {
      default: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
            .container { padding: 20px; }
            .header { background: #667eea; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; border-top: 1px solid #eee; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Important Update</h1>
            </div>
            <div class="content">
              <p>Dear Applicant,</p>
              
              ${message}
              
              <p>Best regards,<br>The Application Portal Team</p>
            </div>
            <div class="footer">
              <p>This is an automated email. Please do not reply to this message.</p>
              <p>© ${new Date().getFullYear()} Application Portal. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      newsletter: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
            .container { padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; border-top: 1px solid #eee; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Application Portal Newsletter</h1>
              <p>Monthly Updates & Opportunities</p>
            </div>
            <div class="content">
              ${message}
              <p>Stay tuned for more updates!</p>
              <p>Best regards,<br>The Application Portal Team</p>
            </div>
            <div class="footer">
              <p>You're receiving this email because you subscribed to our newsletter.</p>
              <p>© ${new Date().getFullYear()} Application Portal. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    return templates[template] || templates.default;
  }
}

module.exports = new MainController();