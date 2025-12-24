const FAQ = require('../models/FAQ');
const nodemailer = require('nodemailer');
const { validationResult } = require('express-validator');

// Email transporter setup
const createTransporter = () => {
  return nodemailer.createTransport({
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
};

// Send email to admin about new question
const sendNewQuestionEmail = async (questionData) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"FAQ System" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAILS, // Comma separated emails
      subject: `❓ New FAQ Question Submitted: ${questionData.question.substring(0, 50)}...`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; color: white; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .question { background: white; padding: 20px; border-left: 4px solid #667eea; margin: 20px 0; border-radius: 4px; }
            .info-item { margin: 10px 0; }
            .label { font-weight: bold; color: #555; }
            .button { display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .stats { display: flex; justify-content: space-between; background: white; padding: 15px; border-radius: 8px; margin: 20px 0; }
            .stat-item { text-align: center; flex: 1; }
            .stat-number { font-size: 24px; font-weight: bold; color: #667eea; }
            .stat-label { font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📋 New FAQ Question Submitted</h1>
              <p>A user has submitted a new question to the FAQ system</p>
            </div>
            <div class="content">
              <div class="question">
                <h3>❓ Question:</h3>
                <p>${questionData.question}</p>
              </div>
              
              <div class="info-item">
                <span class="label">👤 Submitted By:</span>
                ${questionData.submittedBy?.name ? `${questionData.submittedBy.name} (${questionData.submittedBy.email})` : 'Anonymous User'}
              </div>
              
              <div class="info-item">
                <span class="label">📅 Submitted At:</span>
                ${new Date(questionData.createdAt).toLocaleString()}
              </div>
              
              <div class="info-item">
                <span class="label">🏷️ Category:</span>
                ${questionData.category}
              </div>
              
              <div class="info-item">
                <span class="label">🌐 IP Address:</span>
                ${questionData.submittedBy?.ipAddress || 'Not available'}
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.ADMIN_DASHBOARD_URL || 'http://localhost:3000/admin'}" class="button">
                  🔍 View in Admin Dashboard
                </a>
              </div>
              
              <div class="stats">
                <div class="stat-item">
                  <div class="stat-number">${questionData.stats?.pendingQuestions || 0}</div>
                  <div class="stat-label">Pending Questions</div>
                </div>
                <div class="stat-item">
                  <div class="stat-number">${questionData.stats?.totalFAQs || 0}</div>
                  <div class="stat-label">Total FAQs</div>
                </div>
                <div class="stat-item">
                  <div class="stat-number">${questionData.stats?.todaysQuestions || 0}</div>
                  <div class="stat-label">Today's Questions</div>
                </div>
              </div>
              
              <p style="color: #666; font-size: 14px; text-align: center; margin-top: 30px;">
                This is an automated notification from the FAQ System.<br>
                Please login to the admin panel to answer this question.
              </p>
            </div>
          </div>
        </body>
        </html>
      `
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 New question email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error('❌ Error sending new question email:', error);
    throw error;
  }
};

// Send confirmation email to user
const sendUserConfirmationEmail = async (userEmail, questionData) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"FAQ Support Team" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: '✅ Your Question Has Been Received',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%); padding: 30px; color: white; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .question { background: white; padding: 20px; border-left: 4px solid #4CAF50; margin: 20px 0; border-radius: 4px; }
            .info-item { margin: 10px 0; }
            .label { font-weight: bold; color: #555; }
            .button { display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%); color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .timeline { margin: 30px 0; }
            .timeline-item { display: flex; align-items: center; margin: 15px 0; }
            .timeline-dot { width: 20px; height: 20px; background: #4CAF50; border-radius: 50%; margin-right: 15px; }
            .timeline-content { flex: 1; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ Question Received!</h1>
              <p>Thank you for contacting us. We've received your question.</p>
            </div>
            <div class="content">
              <div class="question">
                <h3>📝 Your Question:</h3>
                <p>${questionData.question}</p>
              </div>
              
              <div class="info-item">
                <span class="label">📅 Submitted:</span>
                ${new Date().toLocaleString()}
              </div>
              
              <div class="info-item">
                <span class="label">🆔 Reference ID:</span>
                ${questionData._id}
              </div>
              
              <div class="timeline">
                <h3>📅 What Happens Next?</h3>
                <div class="timeline-item">
                  <div class="timeline-dot"></div>
                  <div class="timeline-content">
                    <strong>Step 1: Question Review</strong>
                    <p>Our team will review your question within 24 hours.</p>
                  </div>
                </div>
                <div class="timeline-item">
                  <div class="timeline-dot"></div>
                  <div class="timeline-content">
                    <strong>Step 2: Research & Answer</strong>
                    <p>We'll research and prepare a comprehensive answer.</p>
                  </div>
                </div>
                <div class="timeline-item">
                  <div class="timeline-dot"></div>
                  <div class="timeline-content">
                    <strong>Step 3: Response</strong>
                    <p>You'll receive a detailed response via email.</p>
                  </div>
                </div>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/faq" class="button">
                  🔍 Browse More FAQs
                </a>
              </div>
              
              <p style="color: #666; font-size: 14px; text-align: center; margin-top: 30px;">
                <strong>💡 Tip:</strong> Check our existing FAQs for instant answers.<br>
                <strong>⏱️ Response Time:</strong> We aim to respond within 24-48 hours.<br>
                <strong>📧 Contact:</strong> If urgent, reply to this email.
              </p>
            </div>
          </div>
        </body>
        </html>
      `
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 User confirmation email sent to ${userEmail}: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error('❌ Error sending user confirmation email:', error);
    throw error;
  }
};

// Send answer notification to user
const sendAnswerNotificationEmail = async (userEmail, questionData, answer) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"FAQ Support Team" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: `📬 Answer to Your Question: ${questionData.question.substring(0, 50)}...`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #2196F3 0%, #21CBF3 100%); padding: 30px; color: white; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .question, .answer { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .question { border-left: 4px solid #FF9800; }
            .answer { border-left: 4px solid #4CAF50; }
            .info-item { margin: 10px 0; }
            .label { font-weight: bold; color: #555; }
            .button { display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #2196F3 0%, #21CBF3 100%); color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .helpful { background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📬 Your Question Has Been Answered!</h1>
              <p>Here's the answer to your question from our expert team</p>
            </div>
            <div class="content">
              <div class="question">
                <h3 style="color: #FF9800;">❓ Your Question:</h3>
                <p>${questionData.question}</p>
                <div class="info-item">
                  <span class="label">📅 Asked:</span>
                  ${new Date(questionData.createdAt).toLocaleDateString()}
                </div>
              </div>
              
              <div class="answer">
                <h3 style="color: #4CAF50;">✅ Expert Answer:</h3>
                <p>${answer}</p>
                <div class="info-item">
                  <span class="label">👨‍💼 Answered By:</span>
                  ${questionData.answeredBy?.adminEmail || 'FAQ Support Team'}
                </div>
                <div class="info-item">
                  <span class="label">📅 Answered On:</span>
                  ${new Date(questionData.updatedAt).toLocaleString()}
                </div>
              </div>
              
              <div class="helpful">
                <h4>Was this answer helpful?</h4>
                <p>Your feedback helps us improve our FAQ system for everyone.</p>
                <div style="margin: 20px 0;">
                  <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/feedback/${questionData._id}/helpful" style="display: inline-block; padding: 10px 20px; background: #4CAF50; color: white; text-decoration: none; border-radius: 5px; margin: 0 10px;">👍 Helpful</a>
                  <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/feedback/${questionData._id}/not-helpful" style="display: inline-block; padding: 10px 20px; background: #f44336; color: white; text-decoration: none; border-radius: 5px; margin: 0 10px;">👎 Not Helpful</a>
                </div>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/faq" class="button">
                  🔍 Browse More FAQs
                </a>
              </div>
              
              <p style="color: #666; font-size: 14px; text-align: center; margin-top: 30px;">
                <strong>📞 Need More Help?</strong> Reply to this email for further assistance.<br>
                <strong>💾 Save This Email</strong> for future reference.<br>
                <strong>⭐ Pro Tip:</strong> Check our FAQ section before submitting new questions.
              </p>
            </div>
          </div>
        </body>
        </html>
      `
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 Answer notification sent to ${userEmail}: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error('❌ Error sending answer notification email:', error);
    throw error;
  }
};

// Send daily statistics to admin
const sendDailyStatsEmail = async (stats) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"FAQ System Analytics" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAILS,
      subject: `📊 Daily FAQ Statistics Report - ${new Date().toLocaleDateString()}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 700px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%); padding: 30px; color: white; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 20px; margin: 30px 0; }
            .stat-card { background: white; padding: 20px; border-radius: 10px; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            .stat-number { font-size: 36px; font-weight: bold; color: #6a11cb; margin: 10px 0; }
            .stat-label { font-size: 14px; color: #666; }
            .trend-up { color: #4CAF50; }
            .trend-down { color: #f44336; }
            .table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            .table th, .table td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
            .table th { background: #f5f5f5; font-weight: bold; }
            .badge { display: inline-block; padding: 3px 8px; border-radius: 12px; font-size: 12px; }
            .badge-pending { background: #FFEAA7; color: #E17055; }
            .badge-active { background: #A3E4D7; color: #1A5276; }
            .progress-bar { height: 10px; background: #e0e0e0; border-radius: 5px; overflow: hidden; margin: 10px 0; }
            .progress-fill { height: 100%; background: linear-gradient(90deg, #6a11cb, #2575fc); }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📊 Daily FAQ Statistics Report</h1>
              <p>${new Date().toLocaleDateString()} - Generated at ${new Date().toLocaleTimeString()}</p>
            </div>
            <div class="content">
              <h2>📈 Overview</h2>
              <div class="stats-grid">
                <div class="stat-card">
                  <div class="stat-number">${stats.totalFAQs}</div>
                  <div class="stat-label">Total FAQs</div>
                </div>
                <div class="stat-card">
                  <div class="stat-number">${stats.activeFAQs}</div>
                  <div class="stat-label">Active FAQs</div>
                </div>
                <div class="stat-card">
                  <div class="stat-number">${stats.pendingQuestions}</div>
                  <div class="stat-label">Pending Questions</div>
                </div>
                <div class="stat-card">
                  <div class="stat-number">${stats.todaysQuestions}</div>
                  <div class="stat-label">Today's Questions</div>
                </div>
                <div class="stat-card">
                  <div class="stat-number">${stats.totalViews}</div>
                  <div class="stat-label">Total Views</div>
                </div>
                <div class="stat-card">
                  <div class="stat-number">${stats.dailyViews}</div>
                  <div class="stat-label">Today's Views</div>
                </div>
              </div>
              
              <h2>🏷️ Category Distribution</h2>
              <table class="table">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Count</th>
                    <th>Views</th>
                    <th>Popularity</th>
                  </tr>
                </thead>
                <tbody>
                  ${stats.categoryStats.map(cat => `
                    <tr>
                      <td><strong>${cat._id}</strong></td>
                      <td>${cat.count}</td>
                      <td>${cat.totalViews}</td>
                      <td>
                        <div class="progress-bar">
                          <div class="progress-fill" style="width: ${(cat.count / stats.totalFAQs * 100)}%"></div>
                        </div>
                        ${Math.round(cat.count / stats.totalFAQs * 100)}%
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
              
              <h2>⏰ Recent Questions (Last 24h)</h2>
              ${stats.recentQuestions.length > 0 ? `
                <table class="table">
                  <thead>
                    <tr>
                      <th>Time</th>
                      <th>Question</th>
                      <th>Category</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${stats.recentQuestions.map(q => `
                      <tr>
                        <td>${new Date(q.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
                        <td>${q.question.substring(0, 50)}...</td>
                        <td>${q.category}</td>
                        <td><span class="badge badge-${q.status}">${q.status}</span></td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              ` : '<p>No new questions in the last 24 hours.</p>'}
              
              <h2>🔥 Most Popular FAQs</h2>
              <table class="table">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Question</th>
                    <th>Views</th>
                    <th>Helpful %</th>
                  </tr>
                </thead>
                <tbody>
                  ${stats.popularFAQs.map((faq, index) => `
                    <tr>
                      <td>#${index + 1}</td>
                      <td>${faq.question.substring(0, 60)}...</td>
                      <td>${faq.views}</td>
                      <td>${faq.helpfulPercentage}%</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
              
              <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 30px 0; text-align: center;">
                <h3 style="margin-top: 0;">🚀 Action Items</h3>
                ${stats.pendingQuestions > 0 ? `
                  <p>📝 <strong>${stats.pendingQuestions}</strong> questions need your attention.</p>
                ` : ''}
                ${stats.todaysQuestions > 0 ? `
                  <p>🎯 <strong>${stats.todaysQuestions}</strong> questions submitted today.</p>
                ` : ''}
                <a href="${process.env.ADMIN_DASHBOARD_URL || 'http://localhost:3000/admin'}" style="display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%); color: white; text-decoration: none; border-radius: 5px; margin: 10px;">Go to Admin Dashboard</a>
              </div>
              
              <p style="color: #666; font-size: 14px; text-align: center;">
                This report is generated daily at 8:00 AM.<br>
                To adjust reporting frequency, contact the system administrator.
              </p>
            </div>
          </div>
        </body>
        </html>
      `
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log(`📊 Daily stats email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error('❌ Error sending daily stats email:', error);
    throw error;
  }
};

// Controller functions
const faqController = {
  // Get all FAQs
  getAllFAQs: async (req, res) => {
    try {
      const { category, status, search, page = 1, limit = 10, sort = '-createdAt' } = req.query;
      
      let query = {};
      
      // Filter by category
      if (category && category !== 'all') {
        query.category = category;
      }
      
      // Filter by status
      if (status) {
        query.status = status;
      } else {
        query.status = 'active'; // Default to active
      }
      
      // Search functionality
      if (search) {
        query.$or = [
          { question: { $regex: search, $options: 'i' } },
          { answer: { $regex: search, $options: 'i' } },
          { tags: { $regex: search, $options: 'i' } }
        ];
      }
      
      // Calculate pagination
      const skip = (parseInt(page) - 1) * parseInt(limit);
      
      // Execute query with pagination
      const faqs = await FAQ.find(query)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .select('-__v');
      
      // Increment views for fetched FAQs
      await Promise.all(faqs.map(async (faq) => {
        faq.views += 1;
        faq.lastViewedAt = new Date();
        await faq.save();
      }));
      
      // Get total count for pagination
      const total = await FAQ.countDocuments(query);
      
      res.status(200).json({
        status: 'success',
        data: {
          faqs,
          pagination: {
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            pages: Math.ceil(total / parseInt(limit))
          }
        }
      });
    } catch (error) {
      console.error('❌ Error fetching FAQs:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to fetch FAQs',
        error: error.message
      });
    }
  },
  
  // Get single FAQ
  getFAQById: async (req, res) => {
    try {
      const faq = await FAQ.findById(req.params.id);
      
      if (!faq) {
        return res.status(404).json({
          status: 'error',
          message: 'FAQ not found'
        });
      }
      
      // Increment views
      faq.views += 1;
      faq.lastViewedAt = new Date();
      await faq.save();
      
      res.status(200).json({
        status: 'success',
        data: { faq }
      });
    } catch (error) {
      console.error('❌ Error fetching FAQ:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to fetch FAQ',
        error: error.message
      });
    }
  },
  
  // Submit new question
  submitQuestion: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          status: 'error',
          message: 'Validation failed',
          errors: errors.array()
        });
      }
      
      const { question, email, name, category = 'pending' } = req.body;
      
      // Get client IP
      const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'Unknown';
      
      // Create new FAQ (pending status)
      const newFAQ = new FAQ({
        question,
        answer: 'Our team will review this question and provide an answer soon.',
        category,
        status: 'pending',
        submittedBy: {
          email: email || null,
          name: name || 'Anonymous',
          ipAddress
        }
      });
      
      await newFAQ.save();
      
      // Get statistics for email
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const todaysQuestions = await FAQ.countDocuments({
        createdAt: { $gte: todayStart },
        status: 'pending'
      });
      
      const totalStats = await FAQ.getStatistics();
      
      // Send email to admin
      try {
        await sendNewQuestionEmail({
          ...newFAQ.toObject(),
          stats: {
            pendingQuestions: totalStats.pendingQuestions,
            totalFAQs: totalStats.totalFAQs,
            todaysQuestions
          }
        });
        console.log('✅ Admin notification sent');
      } catch (emailError) {
        console.error('❌ Failed to send admin notification:', emailError);
        // Don't fail the request if email fails
      }
      
      // Send confirmation to user if email provided
      if (email) {
        try {
          await sendUserConfirmationEmail(email, newFAQ);
          console.log('✅ User confirmation sent');
        } catch (emailError) {
          console.error('❌ Failed to send user confirmation:', emailError);
        }
      }
      
      res.status(201).json({
        status: 'success',
        message: 'Question submitted successfully. Our team will review it soon.',
        data: {
          id: newFAQ._id,
          question: newFAQ.question,
          submittedAt: newFAQ.createdAt
        }
      });
    } catch (error) {
      console.error('❌ Error submitting question:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to submit question',
        error: error.message
      });
    }
  },
  
  // Answer a pending question (Admin only)
  answerQuestion: async (req, res) => {
    try {
      const { id } = req.params;
      const { answer, adminEmail, category } = req.body;
      
      if (!answer || !adminEmail) {
        return res.status(400).json({
          status: 'error',
          message: 'Answer and admin email are required'
        });
      }
      
      const faq = await FAQ.findById(id);
      
      if (!faq) {
        return res.status(404).json({
          status: 'error',
          message: 'Question not found'
        });
      }
      
      if (faq.status !== 'pending') {
        return res.status(400).json({
          status: 'error',
          message: 'This question is not pending'
        });
      }
      
      // Update FAQ with answer
      faq.answer = answer;
      faq.status = 'active';
      faq.category = category || faq.category;
      faq.answeredBy = {
        adminEmail,
        answeredAt: new Date()
      };
      faq.updatedAt = new Date();
      
      await faq.save();
      
      // Send answer notification to user if email provided
      if (faq.submittedBy?.email) {
        try {
          await sendAnswerNotificationEmail(faq.submittedBy.email, faq, answer);
          console.log('✅ Answer notification sent to user');
        } catch (emailError) {
          console.error('❌ Failed to send answer notification:', emailError);
        }
      }
      
      res.status(200).json({
        status: 'success',
        message: 'Question answered successfully',
        data: { faq }
      });
    } catch (error) {
      console.error('❌ Error answering question:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to answer question',
        error: error.message
      });
    }
  },
  
  // Get statistics
  getStatistics: async (req, res) => {
    try {
      const stats = await FAQ.getStatistics();
      
      // Add additional stats
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      
      stats.todaysQuestions = await FAQ.countDocuments({
        createdAt: { $gte: todayStart },
        status: 'pending'
      });
      
      stats.dailyViews = await FAQ.aggregate([
        { $match: { lastViewedAt: { $gte: todayStart } } },
        { $group: { _id: null, total: { $sum: 1 } } }
      ]);
      stats.dailyViews = stats.dailyViews[0]?.total || 0;
      
      res.status(200).json({
        status: 'success',
        data: { stats }
      });
    } catch (error) {
      console.error('❌ Error fetching statistics:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to fetch statistics',
        error: error.message
      });
    }
  },
  
  // Send daily stats email manually
  sendDailyStats: async (req, res) => {
    try {
      // Get stats
      const stats = await FAQ.getStatistics();
      
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      
      stats.todaysQuestions = await FAQ.countDocuments({
        createdAt: { $gte: todayStart },
        status: 'pending'
      });
      
      stats.dailyViews = await FAQ.aggregate([
        { $match: { lastViewedAt: { $gte: todayStart } } },
        { $group: { _id: null, total: { $sum: 1 } } }
      ]);
      stats.dailyViews = stats.dailyViews[0]?.total || 0;
      
      // Send email
      await sendDailyStatsEmail(stats);
      
      res.status(200).json({
        status: 'success',
        message: 'Daily statistics email sent successfully',
        data: { stats }
      });
    } catch (error) {
      console.error('❌ Error sending daily stats:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to send daily statistics',
        error: error.message
      });
    }
  },
  
  // Vote on FAQ helpfulness
  voteFAQ: async (req, res) => {
    try {
      const { id } = req.params;
      const { vote } = req.body; // 'helpful' or 'unhelpful'
      
      if (!['helpful', 'unhelpful'].includes(vote)) {
        return res.status(400).json({
          status: 'error',
          message: 'Invalid vote type. Use "helpful" or "unhelpful"'
        });
      }
      
      const update = vote === 'helpful' 
        ? { $inc: { helpfulVotes: 1 } }
        : { $inc: { unhelpfulVotes: 1 } };
      
      const faq = await FAQ.findByIdAndUpdate(
        id,
        update,
        { new: true }
      );
      
      if (!faq) {
        return res.status(404).json({
          status: 'error',
          message: 'FAQ not found'
        });
      }
      
      res.status(200).json({
        status: 'success',
        message: `Vote recorded as ${vote}`,
        data: {
          faq,
          helpfulPercentage: faq.helpfulPercentage
        }
      });
    } catch (error) {
      console.error('❌ Error voting on FAQ:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to record vote',
        error: error.message
      });
    }
  },
  
  // Update FAQ (Admin only)
  updateFAQ: async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      const faq = await FAQ.findByIdAndUpdate(
        id,
        updates,
        { new: true, runValidators: true }
      );
      
      if (!faq) {
        return res.status(404).json({
          status: 'error',
          message: 'FAQ not found'
        });
      }
      
      res.status(200).json({
        status: 'success',
        message: 'FAQ updated successfully',
        data: { faq }
      });
    } catch (error) {
      console.error('❌ Error updating FAQ:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to update FAQ',
        error: error.message
      });
    }
  },
  
  // Delete FAQ (Admin only)
  deleteFAQ: async (req, res) => {
    try {
      const { id } = req.params;
      
      const faq = await FAQ.findByIdAndDelete(id);
      
      if (!faq) {
        return res.status(404).json({
          status: 'error',
          message: 'FAQ not found'
        });
      }
      
      res.status(200).json({
        status: 'success',
        message: 'FAQ deleted successfully'
      });
    } catch (error) {
      console.error('❌ Error deleting FAQ:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to delete FAQ',
        error: error.message
      });
    }
  }
};

module.exports = faqController;