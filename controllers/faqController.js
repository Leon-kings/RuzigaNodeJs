const { FAQ, Question, Statistics } = require('../models/FAQ');
const nodemailer = require('nodemailer');
const moment = require('moment');
const { validationResult } = require('express-validator');

class FAQController {
  constructor() {
    // Email transporter
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    // Bind all methods to the instance to maintain 'this' context
    this.sendEmail = this.sendEmail.bind(this);
    this.sendQuestionConfirmation = this.sendQuestionConfirmation.bind(this);
    this.sendAnswerNotification = this.sendAnswerNotification.bind(this);
    this.updateStatistics = this.updateStatistics.bind(this);
    this.getStatistics = this.getStatistics.bind(this);
    this.getPopularCategories = this.getPopularCategories.bind(this);
    this.recordEmailStat = this.recordEmailStat.bind(this);
    this.incrementFAQViews = this.incrementFAQViews.bind(this);
    this.getAllFAQs = this.getAllFAQs.bind(this);
    this.getFAQById = this.getFAQById.bind(this);
    this.submitQuestion = this.submitQuestion.bind(this);
    this.submitQuestionV2 = this.submitQuestionV2.bind(this);
    this.getAllQuestions = this.getAllQuestions.bind(this);
    this.answerQuestion = this.answerQuestion.bind(this);
    this.createFAQ = this.createFAQ.bind(this);
    this.updateFAQ = this.updateFAQ.bind(this);
    this.deleteFAQ = this.deleteFAQ.bind(this);
    this.getDashboardData = this.getDashboardData.bind(this);
  }

  // ==================== EMAIL METHODS ====================

  async sendEmail(to, subject, htmlContent, textContent = null) {
    try {
      const mailOptions = {
        from: `"FAQ System" <${process.env.EMAIL_FROM}>`,
        to,
        subject,
        html: htmlContent,
        text: textContent || this.htmlToText(htmlContent)
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log(`Email sent: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Error sending email:', error);
      return { success: false, error: error.message };
    }
  }

  htmlToText(html) {
    return html
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  async sendQuestionConfirmation(email, questionData) {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; color: white; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .question-box { background: white; padding: 20px; border-left: 4px solid #667eea; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          .btn { display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 5px; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📋 Question Received</h1>
            <p>FAQ System - Study Abroad Assistance</p>
          </div>
          <div class="content">
            <h2>Thank you for your question!</h2>
            <p>We've received your question and our team will get back to you within 24 hours.</p>
            
            <div class="question-box">
              <h3>Your Question:</h3>
              <p><strong>${questionData.question}</strong></p>
              <p><em>Submitted on: ${new Date(questionData.createdAt).toLocaleDateString()}</em></p>
            </div>
            
            <p>You can check our <a href="${process.env.FRONTEND_URL}/faq">FAQ page</a> for common questions that might already have answers.</p>
            
            <p>If you need immediate assistance, please contact our support team.</p>
            
            <div class="footer">
              <p>Best regards,<br>FAQ Support Team</p>
              <p>© ${new Date().getFullYear()} FAQ System. All rights reserved.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail(
      email,
      'Question Received - FAQ System',
      html
    );
  }

  async sendAnswerNotification(email, questionData, answer) {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%); padding: 30px; color: white; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .answer-box { background: white; padding: 20px; border-left: 4px solid #4CAF50; margin: 20px 0; }
          .question-box { background: #f0f0f0; padding: 15px; margin: 15px 0; border-radius: 5px; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Your Question Has Been Answered</h1>
            <p>FAQ System - Study Abroad Assistance</p>
          </div>
          <div class="content">
            <h2>Hello!</h2>
            <p>We're writing to inform you that our team has answered your question.</p>
            
            <div class="question-box">
              <h3>Your Question:</h3>
              <p><strong>${questionData.question}</strong></p>
            </div>
            
            <div class="answer-box">
              <h3>Our Answer:</h3>
              <p>${answer}</p>
              <p><em>Answered on: ${new Date().toLocaleDateString()}</em></p>
            </div>
            
            <p>If you need further clarification, please don't hesitate to reply to this email.</p>
            <p>You can also browse more questions on our <a href="${process.env.FRONTEND_URL}/faq">FAQ page</a>.</p>
            
            <div class="footer">
              <p>Best regards,<br>FAQ Support Team</p>
              <p>© ${new Date().getFullYear()} FAQ System. All rights reserved.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail(
      email,
      'Your Question Has Been Answered - FAQ System',
      html
    );
  }

  // ==================== STATISTICS METHODS ====================

  async updateStatistics() {
    const today = moment().startOf('day').toDate();
    
    try {
      // Calculate FAQ statistics
      const totalFAQs = await FAQ.countDocuments();
      const publishedFAQs = await FAQ.countDocuments({ isPublished: true });
      const newFAQs = await FAQ.countDocuments({
        createdAt: { $gte: today }
      });
      const updatedFAQs = await FAQ.countDocuments({
        updatedAt: { $gte: today },
        createdAt: { $lt: today }
      });
      
      const faqViewsResult = await FAQ.aggregate([
        { $group: { _id: null, totalViews: { $sum: '$views' } } }
      ]);
      const faqViews = faqViewsResult[0]?.totalViews || 0;

      // Calculate question statistics
      const totalQuestions = await Question.countDocuments();
      const pendingQuestions = await Question.countDocuments({ status: 'pending' });
      const answeredQuestions = await Question.countDocuments({ status: 'answered' });
      const newQuestions = await Question.countDocuments({
        createdAt: { $gte: today }
      });

      // Calculate average response time
      const responseTimes = await Question.aggregate([
        { $match: { status: 'answered', answeredAt: { $exists: true } } },
        {
          $project: {
            responseTime: {
              $divide: [
                { $subtract: ['$answeredAt', '$createdAt'] },
                1000 * 60 * 60 // Convert to hours
              ]
            }
          }
        },
        {
          $group: {
            _id: null,
            avgResponseTime: { $avg: '$responseTime' }
          }
        }
      ]);

      // Calculate category statistics
      const faqCategories = await FAQ.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]);

      const questionCategories = await Question.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]);

      // Create or update statistics
      const stats = await Statistics.findOneAndUpdate(
        { date: today },
        {
          date: today,
          faqStats: {
            totalFAQs,
            publishedFAQs,
            newFAQs,
            updatedFAQs,
            faqViews
          },
          questionStats: {
            totalQuestions,
            pendingQuestions,
            answeredQuestions,
            newQuestions,
            avgResponseTime: responseTimes[0]?.avgResponseTime || 0
          },
          categoryStats: {
            faqCategories: faqCategories.map(cat => ({
              category: cat._id,
              count: cat.count
            })),
            questionCategories: questionCategories.map(cat => ({
              category: cat._id,
              count: cat.count
            }))
          },
          $setOnInsert: { createdAt: new Date() }
        },
        { upsert: true, new: true }
      );

      return stats;
    } catch (error) {
      console.error('Error updating statistics:', error);
      throw error;
    }
  }

  async getStatistics(req, res) {
    try {
      const { period = 'today' } = req.query;
      let startDate, endDate;

      switch (period) {
        case 'today':
          startDate = moment().startOf('day').toDate();
          endDate = moment().endOf('day').toDate();
          break;
        case 'week':
          startDate = moment().startOf('week').toDate();
          endDate = moment().endOf('week').toDate();
          break;
        case 'month':
          startDate = moment().startOf('month').toDate();
          endDate = moment().endOf('month').toDate();
          break;
        case 'year':
          startDate = moment().startOf('year').toDate();
          endDate = moment().endOf('year').toDate();
          break;
        default:
          startDate = moment().startOf('day').toDate();
          endDate = moment().endOf('day').toDate();
      }

      const stats = await Statistics.find({
        date: {
          $gte: startDate,
          $lte: endDate
        }
      }).sort({ date: 1 });

      // Get summary
      const summary = {
        totalFAQs: await FAQ.countDocuments(),
        totalQuestions: await Question.countDocuments(),
        pendingQuestions: await Question.countDocuments({ status: 'pending' }),
        answeredQuestions: await Question.countDocuments({ status: 'answered' }),
        popularCategories: await this.getPopularCategories(),
        recentQuestions: await Question.find()
          .sort({ createdAt: -1 })
          .limit(5)
          .select('question email status createdAt')
          .lean()
      };

      res.status(200).json({
        success: true,
        data: {
          stats,
          summary,
          period: {
            start: startDate,
            end: endDate,
            name: period
          }
        }
      });
    } catch (error) {
      console.error('Error getting statistics:', error);
      res.status(500).json({
        success: false,
        message: 'Server error while fetching statistics'
      });
    }
  }

  async getPopularCategories() {
    const faqCategories = await FAQ.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    const questionCategories = await Question.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    return {
      faqCategories,
      questionCategories
    };
  }

  async recordEmailStat(type, success = true) {
    try {
      const today = moment().startOf('day').toDate();
      
      const update = success 
        ? { $inc: { 'emailStats.sent': 1 } }
        : { $inc: { 'emailStats.failed': 1 } };
      
      await Statistics.findOneAndUpdate(
        { date: today },
        update,
        { upsert: true }
      );
    } catch (error) {
      console.error('Error recording email stat:', error);
    }
  }

  async incrementFAQViews(faqId) {
    try {
      await FAQ.findByIdAndUpdate(faqId, { $inc: { views: 1 } });
    } catch (error) {
      console.error('Error incrementing FAQ views:', error);
    }
  }

  // ==================== FAQ METHODS ====================

  async getAllFAQs(req, res) {
    try {
      const { 
        page = 1, 
        limit = 10, 
        category, 
        search,
        sort = 'createdAt:desc'
      } = req.query;
      
      const skip = (parseInt(page) - 1) * parseInt(limit);
      const filter = { isPublished: true };
      
      // Apply filters
      if (category && category !== 'all') {
        filter.category = category;
      }
      
      if (search) {
        filter.$text = { $search: search };
      }
      
      // Apply sorting
      const sortOptions = {};
      const [sortField, sortOrder] = sort.split(':');
      sortOptions[sortField] = sortOrder === 'desc' ? -1 : 1;
      
      const [faqs, total] = await Promise.all([
        FAQ.find(filter)
          .sort(sortOptions)
          .skip(skip)
          .limit(parseInt(limit))
          .lean(),
        FAQ.countDocuments(filter)
      ]);
      
      // Increment views for each FAQ
      faqs.forEach(faq => {
        this.incrementFAQViews(faq._id);
      });
      
      res.status(200).json({
        success: true,
        data: faqs,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      });
    } catch (error) {
      console.error('Error getting FAQs:', error);
      res.status(500).json({
        success: false,
        message: 'Server error while fetching FAQs'
      });
    }
  }

  async getFAQById(req, res) {
    try {
      const faq = await FAQ.findById(req.params.id);
      
      if (!faq) {
        return res.status(404).json({
          success: false,
          message: 'FAQ not found'
        });
      }
      
      // Increment views
      await this.incrementFAQViews(faq._id);
      
      res.status(200).json({
        success: true,
        data: faq
      });
    } catch (error) {
      console.error('Error getting FAQ:', error);
      res.status(500).json({
        success: false,
        message: 'Server error while fetching FAQ'
      });
    }
  }

  // UPDATED: Submit question - matches frontend data structure AND your schema
  // async submitQuestion(req, res) {
  //   const errors = validationResult(req);
  //   if (!errors.isEmpty()) {
  //     return res.status(400).json({
  //       success: false,
  //       errors: errors.array()
  //     });
  //   }
    
  //   try {
  //     // Extract data from request body (matches frontend structure)
  //     const { question, email, timestamp, source = "faq-page" } = req.body;
      
  //     console.log('📥 Received request:', { question, email, timestamp, source });
      
  //     // Optional: Extract name from email or use default
  //     const emailParts = email.split('@')[0];
  //     const name = emailParts.charAt(0).toUpperCase() + emailParts.slice(1);
      
  //     // CRITICAL FIX: Match your schema exactly
  //     const questionData = {
  //       question: question.trim(),
  //       email: email.trim(),
  //       name: name || 'User', // Use extracted name or default
  //       source: source || 'faq-page',
  //       // Both timestamp AND createdAt fields as per your schema
  //       timestamp: timestamp ? new Date(timestamp) : new Date(),
  //       // The schema has default for createdAt, but we can set it explicitly
  //       createdAt: timestamp ? new Date(timestamp) : new Date()
  //     };
      
  //     console.log('📝 Creating question with data:', questionData);
      
  //     // Save question to database
  //     const newQuestion = await Question.create(questionData);
      
  //     console.log('✅ Question saved successfully!');
  //     console.log('📊 Question ID:', newQuestion._id);
  //     console.log('📄 Full document:', newQuestion);
      
  //     // Verify it was actually saved
  //     const verify = await Question.findById(newQuestion._id);
  //     if (!verify) {
  //       console.error('❌ ERROR: Question not found after saving!');
  //       throw new Error('Question not persisted to database');
  //     }
      
  //     console.log('🔍 Verification: Document found in DB');
      
  //     // Send confirmation email
  //     try {
  //       const emailResult = await this.sendQuestionConfirmation(email, newQuestion);
  //       if (emailResult.success) {
  //         console.log('📧 Confirmation email sent successfully');
  //         await this.recordEmailStat('confirmation', true);
  //       } else {
  //         console.error('❌ Email sending failed:', emailResult.error);
  //         await this.recordEmailStat('confirmation', false);
  //       }
  //     } catch (emailError) {
  //       console.error('Error sending confirmation email:', emailError);
  //       await this.recordEmailStat('confirmation', false);
  //     }
      
  //     // Update statistics
  //     await this.updateStatistics();
      
  //     res.status(201).json({
  //       success: true,
  //       message: 'Question submitted successfully',
  //       data: {
  //         id: newQuestion._id,
  //         question: newQuestion.question,
  //         status: newQuestion.status,
  //         timestamp: newQuestion.timestamp,
  //         createdAt: newQuestion.createdAt,
  //         confirmation: 'A confirmation email has been sent to your email address'
  //       }
  //     });
      
  //   } catch (error) {
  //     console.error('❌ Error submitting question:', error);
  //     console.error('❌ Error name:', error.name);
  //     console.error('❌ Error message:', error.message);
  //     console.error('❌ Error stack:', error.stack);
      
  //     // Log the full error for debugging
  //     if (error.name === 'ValidationError') {
  //       console.error('❌ Validation errors:', error.errors);
  //     }
      
  //     res.status(500).json({
  //       success: false,
  //       message: 'Server error while submitting question',
  //       error: process.env.NODE_ENV === 'development' ? error.message : undefined,
  //       errorType: error.name
  //     });
  //   }
  // }
  // UPDATED: Submit question - matches the updated schema
async submitQuestion(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }
  
  try {
    // Extract data from request body
    const { question, email, timestamp, source = "faq-page" } = req.body;
    
    console.log('📥 Received request:', { question, email, timestamp, source });
    
    // Extract name from email
    const emailParts = email.split('@')[0];
    const name = emailParts.charAt(0).toUpperCase() + emailParts.slice(1);
    
    // Match the updated schema
    const questionData = {
      question: question.trim(),
      email: email.trim().toLowerCase(),
      name: name || 'User',
      source: source || 'faq-page',
      timestamp: timestamp ? new Date(timestamp) : new Date(),
      createdAt: timestamp ? new Date(timestamp) : new Date(),
      metadata: {
        ipAddress: req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        userAgent: req.headers['user-agent'],
        referrer: req.headers.referer
      }
    };
    
    console.log('📝 Creating question with data:', questionData);
    
    // Save question to database
    const newQuestion = await Question.create(questionData);
    
    console.log('✅ Question saved successfully!');
    console.log('📊 Question ID:', newQuestion._id);
    
    // Send confirmation email
    try {
      const emailResult = await this.sendQuestionConfirmation(email, newQuestion);
      if (emailResult.success) {
        console.log('📧 Confirmation email sent successfully');
        await this.recordEmailStat('confirmation', true);
      } else {
        console.error('❌ Email sending failed:', emailResult.error);
        await this.recordEmailStat('confirmation', false);
      }
    } catch (emailError) {
      console.error('Error sending confirmation email:', emailError);
      await this.recordEmailStat('confirmation', false);
    }
    
    // Update statistics
    await this.updateStatistics();
    
    res.status(201).json({
      success: true,
      message: 'Question submitted successfully',
      data: {
        id: newQuestion._id,
        question: newQuestion.question,
        status: newQuestion.status,
        confirmation: 'A confirmation email has been sent to your email address'
      }
    });
    
  } catch (error) {
    console.error('❌ Error submitting question:', error);
    console.error('❌ Error name:', error.name);
    console.error('❌ Error message:', error.message);
    
    if (error.name === 'ValidationError') {
      console.error('❌ Validation errors:', error.errors);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while submitting question'
    });
  }
}

  // UPDATED: Alternative submit method that matches your schema
  async submitQuestionV2(req, res) {
    try {
      // Direct mapping from frontend data structure
      const { question, email, timestamp, source = "faq-page" } = req.body;
      
      console.log('📥 submitQuestionV2 received:', { question, email, timestamp, source });
      
      // Basic validation
      if (!question || !question.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Question is required'
        });
      }
      
      if (!email || !email.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Email is required'
        });
      }
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid email address'
        });
      }
      
      // Extract name from email
      const emailParts = email.split('@')[0];
      const name = emailParts.charAt(0).toUpperCase() + emailParts.slice(1);
      
      // Save question to database - MATCHING YOUR SCHEMA
      const questionData = {
        question: question.trim(),
        email: email.trim(),
        name: name || 'User',
        source: source || 'faq-page',
        timestamp: timestamp ? new Date(timestamp) : new Date(),
        createdAt: timestamp ? new Date(timestamp) : new Date()
      };
      
      console.log('📝 Creating question with data:', questionData);
      
      const newQuestion = await Question.create(questionData);
      
      console.log('✅ Question saved! ID:', newQuestion._id);
      
      // Verify save
      const verify = await Question.findById(newQuestion._id);
      console.log(verify ? '✅ Verified in DB' : '❌ NOT found in DB');
      
      // Send confirmation email
      try {
        await this.sendQuestionConfirmation(email, newQuestion);
        await this.recordEmailStat('confirmation', true);
      } catch (emailError) {
        console.error('Error sending confirmation email:', emailError);
        await this.recordEmailStat('confirmation', false);
      }
      
      // Update statistics
      await this.updateStatistics();
      
      res.status(201).json({
        success: true,
        message: 'Question submitted successfully',
        data: {
          id: newQuestion._id,
          question: newQuestion.question,
          status: newQuestion.status,
          timestamp: newQuestion.timestamp,
          confirmation: 'A confirmation email has been sent to your email address'
        }
      });
    } catch (error) {
      console.error('❌ Error in submitQuestionV2:', error);
      console.error('❌ Error details:', error.message);
      
      res.status(500).json({
        success: false,
        message: 'Server error while submitting question',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  async getAllQuestions(req, res) {
    try {
      const { 
        page = 1, 
        limit = 20, 
        status,
        category,
        startDate,
        endDate
      } = req.query;
      
      const skip = (parseInt(page) - 1) * parseInt(limit);
      const filter = {};
      
      // Apply filters
      if (status) filter.status = status;
      if (category) filter.category = category;
      
      if (startDate && endDate) {
        filter.createdAt = {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        };
      }
      
      const [questions, total] = await Promise.all([
        Question.find(filter)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(parseInt(limit))
          .lean(),
        Question.countDocuments(filter)
      ]);
      
      res.status(200).json({
        success: true,
        data: questions,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      });
    } catch (error) {
      console.error('Error getting questions:', error);
      res.status(500).json({
        success: false,
        message: 'Server error while fetching questions'
      });
    }
  }

  async answerQuestion(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    
    try {
      const { answer } = req.body;
      
      const question = await Question.findById(req.params.id);
      
      if (!question) {
        return res.status(404).json({
          success: false,
          message: 'Question not found'
        });
      }
      
      // Update question with answer
      question.answer = answer;
      question.status = 'answered';
      question.answeredAt = new Date();
      
      await question.save();
      
      // Send answer notification email
      try {
        const emailResult = await this.sendAnswerNotification(question.email, question, answer);
        if (emailResult.success) {
          await this.recordEmailStat('answer', true);
        } else {
          await this.recordEmailStat('answer', false);
        }
      } catch (emailError) {
        console.error('Error sending answer email:', emailError);
        await this.recordEmailStat('answer', false);
      }
      
      // Update statistics
      await this.updateStatistics();
      
      res.status(200).json({
        success: true,
        message: 'Question answered successfully',
        data: question
      });
    } catch (error) {
      console.error('Error answering question:', error);
      res.status(500).json({
        success: false,
        message: 'Server error while answering question'
      });
    }
  }

  async createFAQ(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    
    try {
      const { question, answer, category, tags, isPublished = true } = req.body;
      
      const newFAQ = await FAQ.create({
        question,
        answer,
        category,
        tags: tags || [],
        isPublished
      });
      
      // Update statistics
      await this.updateStatistics();
      
      res.status(201).json({
        success: true,
        message: 'FAQ created successfully',
        data: newFAQ
      });
    } catch (error) {
      console.error('Error creating FAQ:', error);
      res.status(500).json({
        success: false,
        message: 'Server error while creating FAQ'
      });
    }
  }

  async updateFAQ(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    
    try {
      const { question, answer, category, tags, isPublished } = req.body;
      
      const faq = await FAQ.findById(req.params.id);
      
      if (!faq) {
        return res.status(404).json({
          success: false,
          message: 'FAQ not found'
        });
      }
      
      // Update FAQ
      if (question !== undefined) faq.question = question;
      if (answer !== undefined) faq.answer = answer;
      if (category !== undefined) faq.category = category;
      if (tags !== undefined) faq.tags = tags;
      if (isPublished !== undefined) faq.isPublished = isPublished;
      
      await faq.save();
      
      // Update statistics
      await this.updateStatistics();
      
      res.status(200).json({
        success: true,
        message: 'FAQ updated successfully',
        data: faq
      });
    } catch (error) {
      console.error('Error updating FAQ:', error);
      res.status(500).json({
        success: false,
        message: 'Server error while updating FAQ'
      });
    }
  }

  async deleteFAQ(req, res) {
    try {
      const faq = await FAQ.findById(req.params.id);
      
      if (!faq) {
        return res.status(404).json({
          success: false,
          message: 'FAQ not found'
        });
      }
      
      await faq.deleteOne();
      
      // Update statistics
      await this.updateStatistics();
      
      res.status(200).json({
        success: true,
        message: 'FAQ deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      res.status(500).json({
        success: false,
        message: 'Server error while deleting FAQ'
      });
    }
  }

  async getDashboardData(req, res) {
    try {
      const [
        totalFAQs,
        totalQuestions,
        pendingQuestions,
        answeredQuestions,
        todayStats,
        popularCategories,
        recentQuestions,
        popularFAQs
      ] = await Promise.all([
        FAQ.countDocuments(),
        Question.countDocuments(),
        Question.countDocuments({ status: 'pending' }),
        Question.countDocuments({ status: 'answered' }),
        this.updateStatistics(),
        this.getPopularCategories(),
        Question.find()
          .sort({ createdAt: -1 })
          .limit(10)
          .select('question email status createdAt')
          .lean(),
        FAQ.find({ isPublished: true })
          .sort({ views: -1 })
          .limit(5)
          .select('question category views')
          .lean()
      ]);
      
      res.status(200).json({
        success: true,
        data: {
          overview: {
            totalFAQs,
            totalQuestions,
            pendingQuestions,
            answeredQuestions,
            responseRate: totalQuestions > 0 
              ? Math.round((answeredQuestions / totalQuestions) * 100) 
              : 0
          },
          statistics: todayStats,
          popularCategories,
          recentQuestions,
          popularFAQs
        }
      });
    } catch (error) {
      console.error('Error getting dashboard data:', error);
      res.status(500).json({
        success: false,
        message: 'Server error while fetching dashboard data'
      });
    }
  }
}

// Create a singleton instance
const faqController = new FAQController();

module.exports = faqController;