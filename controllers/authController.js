const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { sendEmail } = require('../mails/sendEmail');
const { validationResult } = require('express-validator');

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

// Helper function to check email service health
async function checkEmailServiceHealth() {
  try {
    // Check if email configuration is present
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.error('Email configuration missing');
      return false;
    }
    
    // Test email service connection by trying to send a test email
    // Use the actual sendEmail function from our service
    try {
      // Try to send a simple test (but don't actually send)
      // Just verify configuration is valid
      const testTransporter = require('nodemailer').createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT || 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });
      
      await testTransporter.verify();
      console.log('✅ Email service health check passed');
      return true;
    } catch (transporterError) {
      console.error('Email service health check failed:', transporterError.message);
      return false;
    }
  } catch (error) {
    console.error('Email service health check error:', error.message);
    return false;
  }
}

// Helper function to send system down notification - FIXED
const sendSystemDownNotification = async (email, name) => {
  try {
    // Check if email service is actually available before trying to send
    const canSendEmail = await checkEmailServiceHealth();
    
    if (!canSendEmail) {
      console.log('Cannot send system down notification - email service is down');
      return;
    }

    // Use the sendEmail function properly
    await sendEmail({
      to: process.env.ADMIN_EMAIL || 'admin@example.com',
      subject: '⚠️ Email Service Down - Registration Blocked',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #dc3545; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border: 1px solid #dee2e6; border-top: none; border-radius: 0 0 5px 5px; }
            .alert-box { background: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 5px; margin: 15px 0; }
            .user-info { background: white; padding: 15px; border-left: 4px solid #dc3545; margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>⚠️ Email Service Down Alert</h2>
            </div>
            <div class="content">
              <div class="alert-box">
                <h3>System Alert</h3>
                <p>The email service is currently unavailable. User registration is being blocked.</p>
              </div>
              
              <div class="user-info">
                <h4>Registration Blocked for:</h4>
                <p><strong>👤 Name:</strong> ${name}</p>
                <p><strong>📧 Email:</strong> ${email}</p>
                <p><strong>⏰ Time:</strong> ${new Date().toLocaleString()}</p>
                <p><strong>🔧 System:</strong> User Registration System</p>
              </div>
              
              <p><strong>Action Required:</strong></p>
              <ul>
                <li>Check email service configuration</li>
                <li>Verify SMTP credentials</li>
                <li>Restart email service if necessary</li>
              </ul>
              
              <p>This is an automated alert from the system monitoring service.</p>
            </div>
          </div>
        </body>
        </html>
      `
    });
    
    console.log('✅ System down notification sent to admin');
  } catch (error) {
    console.error('Failed to send system down notification:', error.message);
    // Don't throw here - we don't want to break the main flow
  }
};

// Helper function for email sending with retry
async function sendEmailWithRetry(emailData, maxRetries = 2) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await sendEmail(emailData);
      console.log(`✅ Email sent successfully on attempt ${attempt}`);
      return true;
    } catch (error) {
      console.error(`❌ Email send attempt ${attempt} failed:`, error.message);
      
      if (attempt < maxRetries) {
        const delay = Math.min(1000 * Math.pow(2, attempt), 5000);
        console.log(`⏳ Waiting ${delay}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      console.error('❌ All email retry attempts failed');
      return false;
    }
  }
}

// ==================== CREATE OPERATIONS ====================

// Register new user (CREATE)
exports.register = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, phone, confirmPassword, role } = req.body;

    // Validate confirmPassword if provided
    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    // Check email service health before proceeding
    const isEmailServiceAvailable = await checkEmailServiceHealth();
    
    if (!isEmailServiceAvailable) {
      console.log(`❌ Email service down - Registration blocked for ${email}`);
      
      // Try to send system down notification (but don't block if it fails)
      try {
        await sendSystemDownNotification(email, name);
      } catch (notificationError) {
        console.error('System down notification failed:', notificationError.message);
        // Continue even if notification fails
      }
      
      return res.status(503).json({ 
        message: 'Email service is currently unavailable. Please try again later or contact support.' 
      });
    }

    // Create new user
    const user = new User({
      name,
      email: email.toLowerCase(),
      password,
      phone,
      role: role || 'user',
      isVerified: false
    });

    await user.save();
    console.log(`✅ User created: ${email}`);

    // Generate verification token
    const verificationToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Send verification email with retry logic
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
    const emailSent = await sendEmailWithRetry({
      to: user.email,
      subject: 'Verify Your Email',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #4a6fa5; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 5px 5px; }
            .button { 
              display: inline-block; 
              background: #4a6fa5; 
              color: white; 
              padding: 12px 24px; 
              text-decoration: none; 
              border-radius: 5px;
              margin: 20px 0;
            }
            .code-box { 
              background: #f0f0f0; 
              padding: 10px; 
              border-radius: 5px; 
              font-family: monospace; 
              margin: 10px 0;
              word-break: break-all;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Email Verification</h1>
              <p>${process.env.COMPANY_NAME || 'Our Service'}</p>
            </div>
            <div class="content">
              <h2>Hello ${user.name},</h2>
              <p>Thank you for registering with us! Please verify your email address to complete your registration.</p>
              
              <div style="text-align: center;">
                <a href="${verificationUrl}" class="button">Verify Email Address</a>
              </div>
              
              <p>Or copy and paste this link in your browser:</p>
              <div class="code-box">${verificationUrl}</div>
              
              <p><strong>Important:</strong> This verification link will expire in 24 hours.</p>
              
              <p>If you didn't create an account with us, please ignore this email.</p>
              
              <p>Best regards,<br>
              <strong>${process.env.COMPANY_NAME || 'The Team'}</strong></p>
            </div>
          </div>
        </body>
        </html>
      `
    });

    if (!emailSent) {
      // If email fails, delete the user that was just created
      await User.findByIdAndDelete(user._id);
      
      console.error('❌ Email sending failed for user:', email);
      
      return res.status(500).json({ 
        message: 'Failed to send verification email. Our system is experiencing issues. Please try again later.'
      });
    }

    console.log(`✅ Verification email sent to ${email}`);

    // Generate auth token
    const token = generateToken(user._id);

    res.status(201).json({
      message: 'User registered successfully. Please verify your email.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isVerified: false
      }
    });
  } catch (error) {
    console.error('❌ Registration error:', error);
    
    // Check if it's a duplicate key error
    if (error.code === 11000 || error.message.includes('duplicate key')) {
      return res.status(409).json({ message: 'User already exists' });
    }
    
    // Check if it's a validation error
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: Object.values(error.errors).map(err => err.message) 
      });
    }
    
    res.status(500).json({ 
      message: 'Server error during registration',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Create multiple users (Bulk Create)
exports.createMultipleUsers = async (req, res) => {
  try {
    const usersData = req.body.users;
    
    if (!Array.isArray(usersData) || usersData.length === 0) {
      return res.status(400).json({ message: 'Please provide an array of users' });
    }

    // Check email service health before proceeding
    const isEmailServiceAvailable = await checkEmailServiceHealth();
    
    if (!isEmailServiceAvailable) {
      return res.status(503).json({ 
        message: 'Email service is currently unavailable. Bulk user creation is blocked.' 
      });
    }

    // Validate each user
    const errors = [];
    const validUsers = [];

    for (const userData of usersData) {
      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email.toLowerCase() });
      if (existingUser) {
        errors.push(`User with email ${userData.email} already exists`);
      } else {
        validUsers.push({
          ...userData,
          email: userData.email.toLowerCase(),
          role: userData.role || 'user',
          isVerified: false
        });
      }
    }

    if (validUsers.length === 0) {
      return res.status(400).json({ 
        message: 'No valid users to create', 
        errors 
      });
    }

    // Create users
    const createdUsers = await User.insertMany(validUsers);

    // Send verification emails
    const emailResults = [];
    for (const user of createdUsers) {
      const verificationToken = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${verificationToken}`;
      
      try {
        await sendEmailWithRetry({
          to: user.email,
          subject: 'Verify Your Email',
          html: `
            <h1>Email Verification</h1>
            <p>Please click the link below to verify your email:</p>
            <a href="${verificationUrl}">Verify Email</a>
          `
        });
        emailResults.push({ email: user.email, status: 'sent' });
      } catch (emailError) {
        emailResults.push({ email: user.email, status: 'failed', error: emailError.message });
      }
    }

    res.status(201).json({
      message: `${createdUsers.length} users created successfully`,
      created: createdUsers.length,
      failed: errors.length,
      emailResults: emailResults,
      errors: errors.length > 0 ? errors : undefined,
      users: createdUsers.map(user => ({
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }))
    });
  } catch (error) {
    console.error('Bulk create error:', error);
    res.status(500).json({ 
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// ==================== READ OPERATIONS ====================

// Get all users (READ)
exports.getAllUsers = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      sortBy = 'createdAt', 
      sortOrder = 'desc',
      search = '',
      role = '',
      verified = ''
    } = req.query;

    // Build query
    const query = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (role) {
      query.role = role;
    }
    
    if (verified !== '') {
      query.isVerified = verified === 'true';
    }

    // Calculate pagination
    const skip = (page - 1) * limit;
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    // Get users with pagination
    const users = await User.find(query)
      .select('-password')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count
    const totalUsers = await User.countDocuments(query);
    const totalPages = Math.ceil(totalUsers / limit);

    res.json({
      users,
      pagination: {
        total: totalUsers,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user by ID (READ)
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findById(id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get current user profile (READ)
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user statistics (READ)
exports.getUserStatistics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const verifiedUsers = await User.countDocuments({ isVerified: true });
    const adminUsers = await User.countDocuments({ role: 'admin' });
    const regularUsers = await User.countDocuments({ role: 'user' });
    
    // Get today's new users
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const newUsersToday = await User.countDocuments({ 
      createdAt: { $gte: today } 
    });

    // Get active users (logged in last 7 days)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const activeUsers = await User.countDocuments({ 
      lastLogin: { $gte: weekAgo } 
    });

    res.json({
      totalUsers,
      verifiedUsers,
      adminUsers,
      regularUsers,
      newUsersToday,
      activeUsers,
      verificationRate: totalUsers > 0 ? (verifiedUsers / totalUsers * 100).toFixed(2) : 0
    });
  } catch (error) {
    console.error('Get user statistics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Search users (READ)
exports.searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query || query.length < 2) {
      return res.status(400).json({ message: 'Search query must be at least 2 characters' });
    }

    const users = await User.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
        { phone: { $regex: query, $options: 'i' } }
      ]
    }).select('-password').limit(20);

    res.json(users);
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ==================== UPDATE OPERATIONS ====================

// Update user profile (UPDATE)
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;
    const userId = req.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields
    if (name) user.name = name;
    if (phone) user.phone = phone;

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user by ID (Admin only) (UPDATE)
exports.updateUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, role, isVerified } = req.body;

    // Check if user exists
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if email is being changed and if it's already taken
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }
      user.email = email.toLowerCase();
      
      // If email changed, unverify the account
      user.isVerified = false;
      
      // Send new verification email if service is available
      const isEmailServiceAvailable = await checkEmailServiceHealth();
      if (isEmailServiceAvailable) {
        const verificationToken = jwt.sign(
          { userId: user._id },
          process.env.JWT_SECRET,
          { expiresIn: '24h' }
        );
        
        const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${verificationToken}`;
        await sendEmailWithRetry({
          to: user.email,
          subject: 'Verify Your Updated Email',
          html: `
            <h1>Email Verification Required</h1>
            <p>Your email has been updated. Please verify your new email address:</p>
            <a href="${verificationUrl}">Verify Email</a>
          `
        });
      }
    }

    // Update other fields
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (role) user.role = role;
    if (isVerified !== undefined) user.isVerified = isVerified;

    await user.save();

    res.json({
      message: 'User updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isVerified: user.isVerified,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Update user by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Change password (UPDATE)
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    // Send password change notification email if service is available
    const isEmailServiceAvailable = await checkEmailServiceHealth();
    if (isEmailServiceAvailable) {
      await sendEmailWithRetry({
        to: user.email,
        subject: 'Password Changed Successfully',
        html: `
          <h1>Password Updated</h1>
          <p>Your password was successfully changed.</p>
          <p>If you didn't make this change, please contact support immediately.</p>
        `
      });
    }

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Reset password (UPDATE)
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    // Send confirmation email if service is available
    const isEmailServiceAvailable = await checkEmailServiceHealth();
    if (isEmailServiceAvailable) {
      await sendEmailWithRetry({
        to: user.email,
        subject: 'Password Reset Successful',
        html: `
          <h1>Password Reset Successful</h1>
          <p>Your password has been reset successfully.</p>
        `
      });
    }

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Reset password error:', error);
    
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
};

// Verify email (UPDATE)
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if already verified
    if (user.isVerified) {
      return res.status(400).json({ message: 'Email already verified' });
    }

    // Update verification status
    user.isVerified = true;
    await user.save();

    // Send welcome email if service is available
    const isEmailServiceAvailable = await checkEmailServiceHealth();
    if (isEmailServiceAvailable) {
      await sendEmailWithRetry({
        to: user.email,
        subject: 'Welcome! Email Verified Successfully',
        html: `
          <h1>Welcome to Our Platform!</h1>
          <p>Your email has been successfully verified.</p>
          <p>You can now enjoy all features of our platform.</p>
        `
      });
    }

    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Verify email error:', error);
    
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
};

// Request password reset (UPDATE - First step)
exports.requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    // Check email service health
    const isEmailServiceAvailable = await checkEmailServiceHealth();
    if (!isEmailServiceAvailable) {
      return res.status(503).json({ 
        message: 'Email service is currently unavailable. Please try again later.' 
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      // Don't reveal that user doesn't exist for security
      return res.json({ message: 'If an account exists with this email, a reset link has been sent' });
    }

    // Generate reset token
    const resetToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Send reset email with retry
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    const emailSent = await sendEmailWithRetry({
      to: user.email,
      subject: 'Password Reset Request',
      html: `
        <h1>Password Reset</h1>
        <p>You requested to reset your password.</p>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `
    });

    if (!emailSent) {
      return res.status(500).json({ 
        message: 'Failed to send password reset email. Please try again later.' 
      });
    }

    res.json({ message: 'Password reset email sent' });
  } catch (error) {
    console.error('Request password reset error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ==================== DELETE OPERATIONS ====================

// Delete user account (DELETE)
exports.deleteAccount = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Send deletion notification email if service is available
    const isEmailServiceAvailable = await checkEmailServiceHealth();
    if (isEmailServiceAvailable) {
      await sendEmailWithRetry({
        to: user.email,
        subject: 'Account Deletion Confirmation',
        html: `
          <h1>Account Deleted</h1>
          <p>Your account has been successfully deleted.</p>
          <p>We're sorry to see you go. You can always create a new account if you change your mind.</p>
        `
      });
    }

    // Delete user
    await user.deleteOne();

    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete user by ID (Admin only) (DELETE)
exports.deleteUserById = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user exists
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent deleting yourself if you're an admin
    if (id === req.userId) {
      return res.status(400).json({ message: 'You cannot delete your own account from admin panel' });
    }

    // Send deletion notification email if service is available
    const isEmailServiceAvailable = await checkEmailServiceHealth();
    if (isEmailServiceAvailable) {
      await sendEmailWithRetry({
        to: user.email,
        subject: 'Account Deleted by Administrator',
        html: `
          <h1>Account Deleted</h1>
          <p>Your account has been deleted by an administrator.</p>
          <p>If you believe this was a mistake, please contact support.</p>
        `
      });
    }

    // Delete user
    await user.deleteOne();

    res.json({ 
      message: 'User deleted successfully',
      deletedUser: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Delete user by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete multiple users (Admin only) (DELETE)
exports.deleteMultipleUsers = async (req, res) => {
  try {
    const { userIds } = req.body;

    if (!Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ message: 'Please provide an array of user IDs' });
    }

    // Prevent deleting yourself
    if (userIds.includes(req.userId)) {
      return res.status(400).json({ message: 'You cannot delete your own account' });
    }

    // Find users
    const users = await User.find({ _id: { $in: userIds } });
    const foundIds = users.map(user => user._id.toString());

    // Find users that don't exist
    const notFound = userIds.filter(id => !foundIds.includes(id));

    // Send deletion emails if service is available
    const isEmailServiceAvailable = await checkEmailServiceHealth();
    if (isEmailServiceAvailable) {
      for (const user of users) {
        await sendEmailWithRetry({
          to: user.email,
          subject: 'Account Deleted by Administrator',
          html: `
            <h1>Account Deleted</h1>
            <p>Your account has been deleted by an administrator.</p>
            <p>If you believe this was a mistake, please contact support.</p>
          `
        });
      }
    }

    // Delete users
    await User.deleteMany({ _id: { $in: foundIds } });

    res.json({
      message: `${users.length} users deleted successfully`,
      deletedCount: users.length,
      notFound: notFound.length > 0 ? notFound : undefined
    });
  } catch (error) {
    console.error('Delete multiple users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ==================== AUTHENTICATION OPERATIONS ====================

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if email is verified (optional - you can comment this out)
    // if (!user.isVerified) {
    //   return res.status(403).json({ 
    //     message: 'Please verify your email before logging in',
    //     needsVerification: true 
    //   });
    // }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Logout
exports.logout = async (req, res) => {
  try {
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Refresh token
exports.refreshToken = async (req, res) => {
  try {
    const userId = req.userId;
    
    // Generate new token
    const token = generateToken(userId);

    res.json({
      message: 'Token refreshed successfully',
      token
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Check system health
exports.checkSystemHealth = async (req, res) => {
  try {
    const health = {
      status: 'healthy',
      timestamp: new Date(),
      services: {
        database: 'healthy',
        email: 'healthy',
        api: 'healthy'
      }
    };

    // Check database
    try {
      await User.db.command({ ping: 1 });
    } catch (dbError) {
      health.status = 'unhealthy';
      health.services.database = 'unhealthy';
    }

    // Check email service
    const isEmailHealthy = await checkEmailServiceHealth();
    health.services.email = isEmailHealthy ? 'healthy' : 'unhealthy';
    if (!isEmailHealthy) {
      health.status = 'degraded';
      health.message = 'Email service is unavailable. User registration will be blocked.';
    }

    res.status(health.status === 'healthy' ? 200 : 503).json(health);
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({ 
      status: 'unhealthy',
      message: 'System health check failed'
    });
  }
};