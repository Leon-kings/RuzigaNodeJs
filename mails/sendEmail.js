const nodemailer = require("nodemailer");

class EmailService {
  constructor() {
    // Company information
    this.companyInfo = {
      name: "REC Apply",
      phone: "+1 (555) 123-4567",
      supportHours: "Monday to Friday, 9 AM to 5 PM EST",
      website: "https://rk-services-xi.vercel.app",
      address: "123 Business Street, City, State 12345",
      supportEmail: "r.educationalconsultance@gmail.com",
      adminEmail: "r.educationalconsultance@gmail.com",
    };

    // Email transporter configuration (combined settings from all codebases)
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || process.env.SMTP_HOST || "smtp.gmail.com",
      port: process.env.SMTP_PORT || process.env.SMTP_PORT || 587,
      secure: process.env.EMAIL_SECURE === "true" || false,
      auth: {
        user: process.env.SMTP_USER || process.env.SMTP_USER || process.env.SMTP_USER,
        pass: process.env.SMTP_PASS || process.env.SMTP_PASS || process.env.EMAIL_PASS,
      },
    });

    // Set default "From" address with company name
    this.defaultFrom =
      process.env.EMAIL_FROM ||
      `"${this.companyInfo.name}" <${this.companyInfo.supportEmail}>`;

    // Frontend URL for testimonial links
    this.frontendUrl = process.env.FRONTEND_URL ;
    this.adminUrl = process.env.EMAIL_FROM ;
  }

  // =================== GENERIC EMAIL METHODS ===================

  // Generic email sending function (compatible with third codebase)
  async sendEmail(options) {
    try {
      const mailOptions = {
        from: options.from || this.defaultFrom,
        to: options.to || options.email,
        subject: options.subject,
        text: options.text,
        html: options.html,
        replyTo: options.replyTo || this.companyInfo.supportEmail,
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log("✅ Email sent:", info.messageId);
      return info;
    } catch (error) {
      console.error("❌ Email sending error:", error);
      throw error;
    }
  }

  // Legacy sendEmail function (for compatibility with third codebase)
  async sendLegacyEmail(options) {
    try {
      // FIX: Use this.transporter.sendMail directly instead of calling this.sendEmail
      const mailOptions = {
        from: process.env.EMAIL_FROM || this.defaultFrom,
        to: options.email || options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
        replyTo: options.replyTo || this.companyInfo.supportEmail,
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log("✅ Legacy email sent:", info.messageId);
      return info;
    } catch (error) {
      console.error("❌ Legacy email sending error:", error);
      throw error;
    }
  }

  // Test email connection
  async testConnection() {
    try {
      await this.transporter.verify();
      console.log("✅ SMTP Connection: Success");
      return true;
    } catch (error) {
      console.error("❌ SMTP Connection: Failed", error);
      return false;
    }
  }

  // =================== TESTIMONIAL EMAILS ===================

  // Send testimonial submission confirmation to user
  async sendTestimonialSubmitted(userEmail, userName) {
    try {
      const mailOptions = {
        from: this.defaultFrom,
        to: userEmail,
        subject: `Testimonial Submitted Successfully! - ${this.companyInfo.name}`,
        html: this.getTestimonialSubmittedTemplate(userName),
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`✅ Testimonial submission email sent to ${userEmail}`);
      return true;
    } catch (error) {
      console.error("❌ Error sending testimonial submission email:", error.message);
      return false;
    }
  }

  // Send testimonial approval notification to user
  async sendTestimonialApproved(userEmail, userName) {
    try {
      const mailOptions = {
        from: this.defaultFrom,
        to: userEmail,
        subject: `Your Testimonial Has Been Approved! - ${this.companyInfo.name}`,
        html: this.getTestimonialApprovedTemplate(userName),
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`✅ Testimonial approval email sent to ${userEmail}`);
      return true;
    } catch (error) {
      console.error("❌ Error sending testimonial approval email:", error.message);
      return false;
    }
  }

  // Send new testimonial notification to admin
  async sendTestimonialAdminNotification(testimonial) {
    try {
      const mailOptions = {
        from: this.defaultFrom,
        to: this.companyInfo.adminEmail,
        subject: `New Testimonial Submitted - Requires Review`,
        html: this.getTestimonialAdminTemplate(testimonial),
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`✅ Testimonial admin notification sent`);
      return true;
    } catch (error) {
      console.error("❌ Error sending testimonial admin notification:", error.message);
      return false;
    }
  }

  // =================== ASSISTANCE REQUEST EMAILS ===================

  // Send confirmation to user (from first codebase)
  async sendAssistanceConfirmation(request) {
    try {
      const mailOptions = {
        from: this.defaultFrom,
        to: request.email,
        subject: `Assistance Request Received (#${request._id}) - ${this.companyInfo.name}`,
        html: this.getAssistanceConfirmationTemplate(request),
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`✅ Assistance confirmation sent to ${request.email}`);
      return true;
    } catch (error) {
      console.error("❌ Error sending assistance confirmation:", error.message);
      return false;
    }
  }

  // Send notification to support team (from first codebase)
  async sendAssistanceNotification(request) {
    try {
      const mailOptions = {
        from: this.defaultFrom,
        to: this.companyInfo.adminEmail,
        subject: `New ${request.priority} Priority Request: ${request.issueType} (#${request._id})`,
        html: this.getAssistanceNotificationTemplate(request),
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`✅ Assistance notification sent for request ${request._id}`);
      return true;
    } catch (error) {
      console.error("❌ Error sending assistance notification:", error.message);
      return false;
    }
  }

  // Send status update to user (from first codebase)
  async sendAssistanceStatusUpdate(request, oldStatus) {
    try {
      if (request.status === oldStatus) return true;

      const mailOptions = {
        from: this.defaultFrom,
        to: request.email,
        subject: `Update on Your Assistance Request (#${request._id}) - ${this.companyInfo.name}`,
        html: this.getAssistanceStatusUpdateTemplate(request, oldStatus),
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`✅ Assistance status update sent to ${request.email}`);
      return true;
    } catch (error) {
      console.error("❌ Error sending assistance status update:", error.message);
      return false;
    }
  }

  // =================== CONTACT FORM EMAILS ===================

  // Contact form notification to admin (from second codebase)
  async sendContactNotification(contactData) {
    const mailOptions = {
      from: this.defaultFrom,
      to: this.companyInfo.adminEmail,
      subject: `New Contact Form: ${contactData.subject} - ${this.companyInfo.name}`,
      html: this.getContactNotificationTemplate(contactData),
      text: this.getContactNotificationText(contactData),
    };

    return await this.sendEmail(mailOptions);
  }

  // Auto-acknowledgement to user (from second codebase)
  async sendContactAcknowledgement(contactEmail, contactName, additionalInfo = {}) {
    const company = { ...this.companyInfo, ...additionalInfo };

    const mailOptions = {
      from: this.defaultFrom,
      to: contactEmail,
      subject: `We Received Your Message - ${company.name}`,
      html: this.getContactAcknowledgementTemplate(contactName, company),
      text: this.getContactAcknowledgementText(contactName, company),
    };

    return await this.sendEmail(mailOptions);
  }

  // Reply to contact form submission (from second codebase)
  async sendContactReply(contactEmail, contactName, replyMessage, adminName = "Support Team") {
    const mailOptions = {
      from: this.defaultFrom,
      to: contactEmail,
      replyTo: this.companyInfo.supportEmail,
      subject: `Re: Your Inquiry - ${this.companyInfo.name}`,
      html: this.getContactReplyTemplate(contactName, replyMessage, adminName),
      text: this.getContactReplyText(contactName, replyMessage, adminName),
    };

    return await this.sendEmail(mailOptions);
  }

  // =================== ADDITIONAL EMAIL TEMPLATES ===================

  // Welcome email (for newsletter signup, etc.)
  async sendWelcomeEmail(userEmail, userName) {
    const mailOptions = {
      from: this.defaultFrom,
      to: userEmail,
      subject: `Welcome to ${this.companyInfo.name}!`,
      html: this.getWelcomeEmailTemplate(userName),
      text: this.getWelcomeEmailText(userName),
    };

    return await this.sendEmail(mailOptions);
  }

  // Password reset email
  async sendPasswordResetEmail(userEmail, resetLink, userName = "User") {
    const mailOptions = {
      from: this.defaultFrom,
      to: userEmail,
      subject: `Password Reset Request - ${this.companyInfo.name}`,
      html: this.getPasswordResetTemplate(userName, resetLink),
      text: this.getPasswordResetText(userName, resetLink),
    };

    return await this.sendEmail(mailOptions);
  }

  // =================== EMAIL TEMPLATES ===================

  // Testimonial Templates (from third codebase - enhanced with company branding)

  getTestimonialSubmittedTemplate(userName) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #4a6fa5; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px; background: #f9f9f9; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; background: #eee; }
          .company-info { background: #e8f4ff; padding: 15px; border-radius: 5px; margin: 15px 0; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Testimonial Submitted Successfully!</h1>
            <p>${this.companyInfo.name}</p>
          </div>
          <div class="content">
            <h2>Hello ${userName},</h2>
            <p>Thank you for taking the time to submit your testimonial. Our team will review it shortly to ensure it meets our guidelines.</p>
            
            <div class="company-info">
              <p><strong>What happens next:</strong></p>
              <ol>
                <li>Our team will review your testimonial within 24-48 hours</li>
                <li>You'll receive an email once it's approved</li>
                <li>Your testimonial will appear on our website</li>
              </ol>
            </div>
            
            <p>If you have any questions, feel free to contact us:</p>
            <p>📞 <strong>Phone:</strong> ${this.companyInfo.phone}</p>
            <p>✉️ <strong>Email:</strong> ${this.companyInfo.supportEmail}</p>
            
            <br>
            <p>Best regards,<br>The ${this.companyInfo.name} Team</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} ${this.companyInfo.name}. All rights reserved.</p>
            <p>${this.companyInfo.address}</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  getTestimonialApprovedTemplate(userName) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #28a745; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px; background: #f9f9f9; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; background: #eee; }
          .success-box { background: #d4edda; border: 1px solid #c3e6cb; color: #155724; padding: 15px; border-radius: 5px; margin: 15px 0; }
          .button { 
            background: #28a745; 
            color: white; 
            padding: 12px 24px; 
            text-decoration: none; 
            border-radius: 5px; 
            display: inline-block;
            margin: 10px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Your Testimonial Has Been Approved!</h1>
            <p>${this.companyInfo.name}</p>
          </div>
          <div class="content">
            <div class="success-box">
              <h2 style="margin-top: 0;">Congratulations ${userName}!</h2>
              <p>Your testimonial has been approved and is now live on our website.</p>
            </div>
            
            <p>Thank you for sharing your experience with other students. Your feedback helps future students make informed decisions.</p>
            
            <br>
            <a href="${this.frontendUrl}/testimonials" class="button">View All Testimonials</a>
            <br><br>
            
            <p><strong>Share your testimonial:</strong></p>
            <p>Help others discover ${this.companyInfo.name} by sharing your experience on social media!</p>
            
            <br>
            <p>If you have any questions or would like to update your testimonial, please contact us:</p>
            <p>📞 <strong>Phone:</strong> ${this.companyInfo.phone}</p>
            <p>✉️ <strong>Email:</strong> ${this.companyInfo.supportEmail}</p>
            
            <br>
            <p>Best regards,<br>The ${this.companyInfo.name} Team</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} ${this.companyInfo.name}. All rights reserved.</p>
            <p>${this.companyInfo.website} | ${this.companyInfo.address}</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  getTestimonialAdminTemplate(testimonial) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #4a6fa5; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px; background: #f9f9f9; }
          .testimonial-card { 
            background: white; 
            padding: 20px; 
            border-radius: 8px; 
            margin: 15px 0; 
            border-left: 4px solid #4a6fa5;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
          }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; background: #eee; }
          .button { 
            background: #4a6fa5; 
            color: white; 
            padding: 12px 24px; 
            text-decoration: none; 
            border-radius: 5px; 
            display: inline-block;
            margin: 10px 0;
          }
          .rating { 
            color: #ffc107; 
            font-size: 18px; 
            letter-spacing: 2px;
            margin: 10px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Testimonial Submitted</h1>
            <p>${this.companyInfo.name} - Requires Review</p>
          </div>
          <div class="content">
            <h2>A new testimonial requires your review</h2>
            <p>Submitted: ${new Date(testimonial.createdAt || Date.now()).toLocaleString()}</p>
            
            <div class="testimonial-card">
              <h3 style="margin-top: 0;">${testimonial.name || 'Anonymous User'}</h3>
              ${testimonial.university ? `<p><strong>🏫 University:</strong> ${testimonial.university}</p>` : ''}
              ${testimonial.program ? `<p><strong>📚 Program:</strong> ${testimonial.program}</p>` : ''}
              ${testimonial.rating ? `
                <p><strong>Rating:</strong></p>
                <div class="rating">${'★'.repeat(testimonial.rating)}${'☆'.repeat(5 - testimonial.rating)} (${testimonial.rating}/5)</div>
              ` : ''}
              <p><strong>Message:</strong></p>
              <p style="background: #f8f9fa; padding: 15px; border-radius: 5px;">
                ${testimonial.content || testimonial.message || 'No message provided'}
              </p>
              
              ${testimonial.email ? `<p><strong>📧 Email:</strong> ${testimonial.email}</p>` : ''}
            </div>
            
            <br>
            <a href="${this.adminUrl}/testimonials" class="button">Review Testimonial in Admin Panel</a>
            
            <div style="margin-top: 20px; padding: 15px; background: #f8d7da; border: 1px solid #f5c6cb; border-radius: 5px;">
              <p><strong>⚠️ Action Required:</strong> Please review this testimonial within 24 hours.</p>
            </div>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} ${this.companyInfo.name} Admin Panel</p>
            <p>This is an automated notification. Do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Assistance Request Templates (from first codebase - enhanced)
  getAssistanceConfirmationTemplate(request) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #4a6fa5; color: white; padding: 20px; border-radius: 5px 5px 0 0; text-align: center; }
          .content { background: #f8f9fa; padding: 20px; border-radius: 0 0 5px 5px; border: 1px solid #dee2e6; border-top: none; }
          .badge { display: inline-block; padding: 3px 8px; border-radius: 12px; font-size: 12px; font-weight: bold; }
          .status-pending { background: #ffc107; color: #856404; }
          .priority-urgent { background: #dc3545; color: white; }
          .priority-high { background: #fd7e14; color: white; }
          .priority-medium { background: #4a6fa5; color: white; }
          .priority-low { background: #6c757d; color: white; }
          .info-box { background: white; border: 1px solid #dee2e6; border-radius: 5px; padding: 15px; margin: 15px 0; }
          .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #dee2e6; font-size: 12px; color: #6c757d; }
        </style>
      </head>
      <body>
        <div class="header">
          <h2 style="margin: 0;">Support Request Received</h2>
          <p style="margin: 5px 0 0 0; opacity: 0.9;">${this.companyInfo.name}</p>
        </div>
        <div class="content">
          <p>Hi ${request.name},</p>
          <p>Thank you for contacting ${this.companyInfo.name}. We've received your request and our team will review it shortly.</p>
          
          <div class="info-box">
            <p><strong>Request ID:</strong> ${request._id}</p>
            <p><strong>Status:</strong> <span class="badge status-pending">Pending</span></p>
            <p><strong>Priority:</strong> <span class="badge priority-${request.priority}">${request.priority.toUpperCase()}</span></p>
            <p><strong>Issue Type:</strong> ${request.issueType}</p>
            <p><strong>Submitted:</strong> ${new Date(request.createdAt).toLocaleString()}</p>
          </div>
          
          <p><strong>Your Message:</strong></p>
          <div style="background: white; border-left: 4px solid #4a6fa5; padding: 10px 15px; margin: 10px 0;">
            ${request.message}
          </div>
          
          <p>We aim to respond within 24-48 hours during our business hours. You'll receive another email when we update your request.</p>
          
          <p><strong>For urgent matters:</strong></p>
          <p>📞 <strong>Call us:</strong> ${this.companyInfo.phone}</p>
          <p>✉️ <strong>Email:</strong> ${this.companyInfo.supportEmail}</p>
          <p>🕐 <strong>Hours:</strong> ${this.companyInfo.supportHours}</p>
          
          <p>Best regards,<br>${this.companyInfo.name} Support Team</p>
          
          <div class="footer">
            <p>This is an automated message. Please do not reply to this email.</p>
            <p>Request submitted from: ${request.pageUrl}</p>
            <p>© ${new Date().getFullYear()} ${this.companyInfo.name}. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  getAssistanceNotificationTemplate(request) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 700px; margin: 0 auto; padding: 20px; }
          .header { background: #dc3545; color: white; padding: 15px; border-radius: 5px; margin-bottom: 20px; text-align: center; }
          .card { background: white; border: 1px solid #dee2e6; border-radius: 5px; padding: 20px; margin-bottom: 15px; }
          .badge { display: inline-block; padding: 3px 8px; border-radius: 12px; font-size: 12px; font-weight: bold; margin-right: 5px; }
          .priority-urgent { background: #dc3545; color: white; }
          .priority-high { background: #fd7e14; color: white; }
          .user-info { background: #e8f4fd; border-left: 4px solid #4a6fa5; }
          .message-box { background: #fff8e1; border-left: 4px solid #ffc107; }
          .tech-info { background: #f8f9fa; font-size: 12px; color: #6c757d; }
          .btn { display: inline-block; background: #4a6fa5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 10px; }
          .company-header { background: #4a6fa5; color: white; padding: 10px; border-radius: 5px 5px 0 0; text-align: center; }
        </style>
      </head>
      <body>
        <div class="company-header">
          <h3 style="margin: 0;">${this.companyInfo.name}</h3>
        </div>
        
        <div class="header">
          <h2 style="margin: 0;">⚠️ New Assistance Request</h2>
        </div>
        
        <div class="card">
          <h3 style="margin-top: 0;">Request Details</h3>
          <p><strong>ID:</strong> ${request._id}</p>
          <p><strong>Priority:</strong> <span class="badge priority-${request.priority}">${request.priority.toUpperCase()}</span></p>
          <p><strong>Type:</strong> ${request.issueType.toUpperCase()}</p>
          <p><strong>Page:</strong> ${request.pageUrl}</p>
        </div>
        
        <div class="card user-info">
          <h4>User Information</h4>
          <p><strong>Name:</strong> ${request.name}</p>
          <p><strong>Email:</strong> <a href="mailto:${request.email}">${request.email}</a></p>
          <p><strong>Phone:</strong> ${request.phone || 'N/A'}</p>
          <p><strong>Submitted:</strong> ${new Date(request.createdAt).toLocaleString()}</p>
        </div>
        
        <div class="card message-box">
          <h4>User Message</h4>
          <p>${request.message}</p>
        </div>
        
        <div class="card tech-info">
          <p><strong>IP Address:</strong> ${request.ip || 'N/A'}</p>
          <p><strong>User Agent:</strong> ${request.userAgent || 'N/A'}</p>
        </div>
        
        <div style="text-align: center; margin-top: 20px;">
          <a href="${this.adminUrl}/requests/${request._id}" class="btn">
            👁️ View Request in Admin Panel
          </a>
        </div>
        
        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #dee2e6; font-size: 12px; color: #6c757d;">
          <p>This is an automated notification from ${this.companyInfo.name} Assistance System.</p>
        </div>
      </body>
      </html>
    `;
  }

  getAssistanceStatusUpdateTemplate(request, oldStatus) {
    const statusMessages = {
      pending: 'is pending review',
      in_progress: 'is now being worked on',
      resolved: 'has been resolved',
      closed: 'has been closed'
    };

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #4a6fa5; color: white; padding: 20px; border-radius: 5px 5px 0 0; text-align: center; }
          .status-box { background: #e7f3ff; border: 1px solid #4a6fa5; border-radius: 5px; padding: 20px; margin: 20px 0; }
          .badge { display: inline-block; padding: 3px 8px; border-radius: 12px; font-size: 12px; font-weight: bold; }
          .status-resolved { background: #28a745; color: white; }
          .status-in_progress { background: #17a2b8; color: white; }
          .status-closed { background: #6c757d; color: white; }
          .status-pending { background: #ffc107; color: #856404; }
          .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #dee2e6; font-size: 12px; color: #6c757d; }
        </style>
      </head>
      <body>
        <div class="header">
          <h2 style="margin: 0;">Request Status Update</h2>
          <p style="margin: 5px 0 0 0; opacity: 0.9;">${this.companyInfo.name}</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 0 0 5px 5px; border: 1px solid #dee2e6; border-top: none;">
          <p>Hi ${request.name},</p>
          
          <div class="status-box">
            <p>Your request <strong>#${request._id}</strong> ${statusMessages[request.status] || 'status has been updated'}.</p>
            
            <p><strong>New Status:</strong> <span class="badge status-${request.status}">${request.status.replace('_', ' ').toUpperCase()}</span></p>
            
            ${request.resolutionNotes ? `
              <p><strong>Notes from Support:</strong></p>
              <p style="background: white; padding: 10px; border-radius: 5px; border-left: 4px solid #28a745;">
                ${request.resolutionNotes}
              </p>
            ` : ''}
            
            ${request.resolvedAt ? `
              <p><strong>Resolved At:</strong> ${new Date(request.resolvedAt).toLocaleString()}</p>
            ` : ''}
          </div>
          
          <p><strong>Contact Information:</strong></p>
          <p>📞 <strong>Phone:</strong> ${this.companyInfo.phone}</p>
          <p>✉️ <strong>Email:</strong> ${this.companyInfo.supportEmail}</p>
          <p>🕐 <strong>Hours:</strong> ${this.companyInfo.supportHours}</p>
          
          <p>If you have any questions about this update, please reply to this email.</p>
          
          <p>Best regards,<br>${this.companyInfo.name} Support Team</p>
          
          <div class="footer">
            <p>This is an automated status update.</p>
            <p>© ${new Date().getFullYear()} ${this.companyInfo.name}. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Contact Form Templates (from second codebase - already included in previous version)
  getContactNotificationTemplate(contactData) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #4a6fa5; color: white; padding: 20px; text-align: center; }
          .content { background: #f9f9f9; padding: 30px; }
          .footer { background: #eee; padding: 15px; text-align: center; font-size: 12px; color: #666; }
          .contact-details { background: white; padding: 15px; border-left: 4px solid #4a6fa5; margin: 15px 0; }
          .message-box { background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0; }
          .action-button { 
            display: inline-block; 
            background: #4a6fa5; 
            color: white; 
            padding: 10px 20px; 
            text-decoration: none; 
            border-radius: 4px;
            margin: 10px 5px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Contact Form Submission</h1>
            <p>${this.companyInfo.name}</p>
          </div>
          
          <div class="content">
            <h2>Contact Details</h2>
            <div class="contact-details">
              <p><strong>👤 Name:</strong> ${contactData.name}</p>
              <p><strong>📧 Email:</strong> ${contactData.email}</p>
              <p><strong>📋 Subject:</strong> ${contactData.subject}</p>
              <p><strong>🕐 Received:</strong> ${new Date().toLocaleString()}</p>
              <p><strong>📱 IP Address:</strong> ${contactData.ipAddress || "Not available"}</p>
            </div>
            
            <h3>Message Content:</h3>
            <div class="message-box">
              ${contactData.message}
            </div>
            
            <div style="margin-top: 30px;">
              <a href="mailto:${contactData.email}" class="action-button" style="background: #28a745;">
                Reply to ${contactData.name}
              </a>
            </div>
          </div>
          
          <div class="footer">
            <p>This is an automated notification from ${this.companyInfo.name} Contact Form.</p>
            <p>© ${new Date().getFullYear()} ${this.companyInfo.name}. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  getContactNotificationText(contactData) {
    return `NEW CONTACT FORM SUBMISSION\n\nName: ${contactData.name}\nEmail: ${contactData.email}\nSubject: ${contactData.subject}\n\nMessage:\n${contactData.message}\n\nReceived: ${new Date().toLocaleString()}\n\n---\nThis is an automated notification from ${this.companyInfo.name} Contact Form.`;
  }

  getContactAcknowledgementTemplate(contactName, company) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #4a6fa5; color: white; padding: 20px; text-align: center; }
          .content { background: #f9f9f9; padding: 30px; }
          .footer { background: #eee; padding: 15px; text-align: center; font-size: 12px; color: #666; }
          .logo { max-width: 150px; margin-bottom: 20px; }
          .contact-info { margin-top: 20px; font-size: 14px; background: white; padding: 15px; border-radius: 5px; }
          .button { 
            display: inline-block; 
            background: #4a6fa5; 
            color: white; 
            padding: 12px 24px; 
            text-decoration: none; 
            border-radius: 4px;
            margin: 15px 0;
          }
          .highlight-box { 
            background: #e8f4ff; 
            border-left: 4px solid #4a6fa5; 
            padding: 15px; 
            margin: 20px 0; 
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>We Received Your Message</h1>
            <p>${company.name}</p>
          </div>
          
          <div class="content">
            <h2>Thank You for Contacting ${company.name}</h2>
            
            <p>Dear ${contactName},</p>
            
            <div class="highlight-box">
              <p><strong>✅ Confirmation:</strong> We have successfully received your inquiry.</p>
              <p><strong>⏱️ Response Time:</strong> Our team will review it and get back to you within <strong>24-48 hours</strong> during our business hours.</p>
            </div>
            
            <p><strong>Here's what happens next:</strong></p>
            <ol>
              <li>Your message has been logged and assigned a reference number</li>
              <li>Our support team will review your inquiry</li>
              <li>We'll respond with detailed information or schedule a call if needed</li>
            </ol>
            
            <div class="contact-info">
              <p><strong>For urgent matters:</strong></p>
              <p>📞 <strong>Call us:</strong> ${company.phone}</p>
              <p>✉️ <strong>Email:</strong> ${company.supportEmail}</p>
              <p>🕐 <strong>Support Hours:</strong> ${company.supportHours}</p>
              <p>📍 <strong>Address:</strong> ${company.address}</p>
            </div>
            
            <p>In the meantime, you might find helpful information on our website:</p>
            <a href="${company.website}" class="button">Visit Our Website</a>
            
            <p style="margin-top: 30px; font-size: 14px; color: #666;">
              <strong>Reference:</strong> CONTACT-${Date.now()}<br>
              <strong>Submitted:</strong> ${new Date().toLocaleString()}
            </p>
          </div>
          
          <div class="footer">
            <p>This is an automated acknowledgment. Please do not reply to this email.</p>
            <p>If you need to send additional information, please reply to your original email thread or contact us at ${company.phone}.</p>
            <p>&copy; ${new Date().getFullYear()} ${company.name}. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  getContactAcknowledgementText(contactName, company) {
    return `WE RECEIVED YOUR MESSAGE\n\nDear ${contactName},\n\nThank you for contacting ${company.name}.\n\nWe have received your inquiry and our team will get back to you within 24-48 hours during our business hours.\n\nFor urgent matters:\n📞 Call us: ${company.phone}\n✉️ Email: ${company.supportEmail}\n🕐 Support Hours: ${company.supportHours}\n📍 Address: ${company.address}\n\nReference: CONTACT-${Date.now()}\nSubmitted: ${new Date().toLocaleString()}\n\nThis is an automated acknowledgement. Please do not reply to this email.\n\nBest regards,\n${company.name} Team`;
  }

  getContactReplyTemplate(contactName, replyMessage, adminName) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #28a745; color: white; padding: 20px; text-align: center; }
          .content { background: #f9f9f9; padding: 30px; }
          .footer { background: #eee; padding: 15px; text-align: center; font-size: 12px; color: #666; }
          .reply-box { 
            background: white; 
            padding: 20px; 
            border-left: 4px solid #28a745; 
            margin: 20px 0;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
          }
          .signature { 
            margin-top: 30px; 
            padding-top: 20px; 
            border-top: 1px solid #ddd;
          }
          .contact-details { 
            background: #f8f9fa; 
            padding: 15px; 
            border-radius: 5px; 
            margin: 20px 0; 
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Response to Your Inquiry</h1>
            <p>${this.companyInfo.name}</p>
          </div>
          
          <div class="content">
            <p>Dear ${contactName},</p>
            
            <p>Thank you for contacting ${this.companyInfo.name}. Here is our response to your inquiry:</p>
            
            <div class="reply-box">
              ${replyMessage.replace(/\n/g, "<br>")}
            </div>
            
            <div class="contact-details">
              <p><strong>If you need further assistance:</strong></p>
              <p>📞 <strong>Phone:</strong> ${this.companyInfo.phone}</p>
              <p>✉️ <strong>Email:</strong> ${this.companyInfo.supportEmail}</p>
              <p>🕐 <strong>Hours:</strong> ${this.companyInfo.supportHours}</p>
            </div>
            
            <div class="signature">
              <p>Best regards,</p>
              <p><strong>${adminName}</strong></p>
              <p>${this.companyInfo.name} Support Team</p>
            </div>
          </div>
          
          <div class="footer">
            <p>This email was sent in response to your contact form submission.</p>
            <p>&copy; ${new Date().getFullYear()} ${this.companyInfo.name}. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  getContactReplyText(contactName, replyMessage, adminName) {
    return `RESPONSE TO YOUR INQUIRY\n\nDear ${contactName},\n\nThank you for contacting ${this.companyInfo.name}. Here is our response to your inquiry:\n\n${replyMessage}\n\nIf you need further assistance:\n📞 Phone: ${this.companyInfo.phone}\n✉️ Email: ${this.companyInfo.supportEmail}\n🕐 Hours: ${this.companyInfo.supportHours}\n\nBest regards,\n${adminName}\n${this.companyInfo.name} Support Team\n\n---\nThis email was sent in response to your contact form submission.`;
  }

  // Additional Templates (Welcome, Password Reset - already included in previous version)
  getWelcomeEmailTemplate(userName) {
    return `
      <!DOCTYPE html>
      <html>
      <body style="font-family: Arial, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #4a6fa5; color: white; padding: 30px; text-align: center;">
            <h1>Welcome to ${this.companyInfo.name}!</h1>
          </div>
          <div style="padding: 30px; background: #f9f9f9;">
            <p>Dear ${userName},</p>
            <p>Thank you for joining us! We're excited to have you on board.</p>
            <p>If you have any questions, feel free to contact us at ${this.companyInfo.supportEmail}</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  getWelcomeEmailText(userName) {
    return `Welcome to ${this.companyInfo.name}!\n\nDear ${userName},\n\nThank you for joining us! We're excited to have you on board.\n\nIf you have any questions, feel free to contact us at ${this.companyInfo.supportEmail}\n\nBest regards,\n${this.companyInfo.name} Team`;
  }

  getPasswordResetTemplate(userName, resetLink) {
    return `
      <!DOCTYPE html>
      <html>
      <body style="font-family: Arial, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #dc3545; color: white; padding: 20px; text-align: center;">
            <h2>Password Reset</h2>
            <p>${this.companyInfo.name}</p>
          </div>
          <div style="padding: 30px; background: #f9f9f9;">
            <p>Dear ${userName},</p>
            <p>You requested to reset your password. Click the link below to proceed:</p>
            <p><a href="${resetLink}" style="background: #4a6fa5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a></p>
            <p>This link will expire in 1 hour.</p>
            <p>If you didn't request this, please ignore this email.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  getPasswordResetText(userName, resetLink) {
    return `Password Reset Request - ${this.companyInfo.name}\n\nDear ${userName},\n\nYou requested to reset your password. Click the link below to proceed:\n\n${resetLink}\n\nThis link will expire in 1 hour.\n\nIf you didn't request this, please ignore this email.\n\nBest regards,\n${this.companyInfo.name} Team`;
  }

  // =================== UTILITY METHODS ===================

  // Update company information
  updateCompanyInfo(newInfo) {
    this.companyInfo = { ...this.companyInfo, ...newInfo };
    this.defaultFrom = `"${this.companyInfo.name}" <${this.companyInfo.supportEmail}>`;
  }

  // Get current company info
  getCompanyInfo() {
    return { ...this.companyInfo };
  }

  // Legacy compatibility - expose templates for direct use
  get emailTemplates() {
    return {
      testimonialSubmitted: (name) => this.getTestimonialSubmittedTemplate(name),
      testimonialApproved: (name) => this.getTestimonialApprovedTemplate(name),
      adminNotification: (testimonial) => this.getTestimonialAdminTemplate(testimonial),
    };
  }
}

// Create singleton instance
const emailService = new EmailService();

// Export for use
module.exports = emailService;

// Optional: export class for testing/extension
module.exports.EmailService = EmailService;

// Legacy exports for compatibility with third codebase
module.exports.sendEmail = emailService.sendLegacyEmail.bind(emailService);
module.exports.emailTemplates = emailService.emailTemplates;


// const nodemailer = require("nodemailer");

// class EmailService {
//   constructor() {
//     // Company information
//     this.companyInfo = {
//       name: "REC Apply",
//       phone: "+1 (555) 123-4567",
//       supportHours: "Monday to Friday, 9 AM to 5 PM EST",
//       website: "https://rk-services-xi.vercel.app",
//       address: "123 Business Street, City, State 12345",
//       supportEmail: "r.educationalconsultance@gmail.com",
//       adminEmail: "r.educationalconsultance@gmail.com",
//     };

//     // Email transporter configuration (combined settings from all codebases)
//     this.transporter = nodemailer.createTransport({
//       host: process.env.SMTP_HOST || process.env.SMTP_HOST || "smtp.gmail.com",
//       port: process.env.SMTP_PORT || process.env.SMTP_PORT || 587,
//       secure: process.env.EMAIL_SECURE === "true" || false,
//       auth: {
//         user: process.env.SMTP_USER || process.env.SMTP_USER || process.env.SMTP_USER,
//         pass: process.env.SMTP_PASS || process.env.SMTP_PASS || process.env.EMAIL_PASS,
//       },
//     });

//     // Set default "From" address with company name
//     this.defaultFrom =
//       process.env.EMAIL_FROM ||
//       `"${this.companyInfo.name}" <${this.companyInfo.supportEmail}>`;

//     // Frontend URL for testimonial links
//     this.frontendUrl = process.env.FRONTEND_URL ;
//     this.adminUrl = process.env.EMAIL_FROM ;
//   }

//   // =================== GENERIC EMAIL METHODS ===================

//   // Generic email sending function (compatible with third codebase)
//   async sendEmail(options) {
//     try {
//       const mailOptions = {
//         from: options.from || this.defaultFrom,
//         to: options.to || options.email,
//         subject: options.subject,
//         text: options.text,
//         html: options.html,
//         replyTo: options.replyTo || this.companyInfo.supportEmail,
//       };

//       const info = await this.transporter.sendMail(mailOptions);
//       console.log("✅ Email sent:", info.messageId);
//       return info;
//     } catch (error) {
//       console.error("❌ Email sending error:", error);
//       throw error;
//     }
//   }

//   // Legacy sendEmail function (for compatibility with third codebase)
//   async sendLegacyEmail(options) {
//     return this.sendEmail({
//       from: process.env.EMAIL_FROM || this.defaultFrom,
//       to: options.email,
//       subject: options.subject,
//       html: options.html,
//     });
//   }

//   // Test email connection
//   async testConnection() {
//     try {
//       await this.transporter.verify();
//       console.log("✅ SMTP Connection: Success");
//       return true;
//     } catch (error) {
//       console.error("❌ SMTP Connection: Failed", error);
//       return false;
//     }
//   }

//   // =================== TESTIMONIAL EMAILS ===================

//   // Send testimonial submission confirmation to user
//   async sendTestimonialSubmitted(userEmail, userName) {
//     try {
//       const mailOptions = {
//         from: this.defaultFrom,
//         to: userEmail,
//         subject: `Testimonial Submitted Successfully! - ${this.companyInfo.name}`,
//         html: this.getTestimonialSubmittedTemplate(userName),
//       };

//       await this.transporter.sendMail(mailOptions);
//       console.log(`✅ Testimonial submission email sent to ${userEmail}`);
//       return true;
//     } catch (error) {
//       console.error("❌ Error sending testimonial submission email:", error.message);
//       return false;
//     }
//   }

//   // Send testimonial approval notification to user
//   async sendTestimonialApproved(userEmail, userName) {
//     try {
//       const mailOptions = {
//         from: this.defaultFrom,
//         to: userEmail,
//         subject: `Your Testimonial Has Been Approved! - ${this.companyInfo.name}`,
//         html: this.getTestimonialApprovedTemplate(userName),
//       };

//       await this.transporter.sendMail(mailOptions);
//       console.log(`✅ Testimonial approval email sent to ${userEmail}`);
//       return true;
//     } catch (error) {
//       console.error("❌ Error sending testimonial approval email:", error.message);
//       return false;
//     }
//   }

//   // Send new testimonial notification to admin
//   async sendTestimonialAdminNotification(testimonial) {
//     try {
//       const mailOptions = {
//         from: this.defaultFrom,
//         to: this.companyInfo.adminEmail,
//         subject: `New Testimonial Submitted - Requires Review`,
//         html: this.getTestimonialAdminTemplate(testimonial),
//       };

//       await this.transporter.sendMail(mailOptions);
//       console.log(`✅ Testimonial admin notification sent`);
//       return true;
//     } catch (error) {
//       console.error("❌ Error sending testimonial admin notification:", error.message);
//       return false;
//     }
//   }

//   // =================== ASSISTANCE REQUEST EMAILS ===================

//   // Send confirmation to user (from first codebase)
//   async sendAssistanceConfirmation(request) {
//     try {
//       const mailOptions = {
//         from: this.defaultFrom,
//         to: request.email,
//         subject: `Assistance Request Received (#${request._id}) - ${this.companyInfo.name}`,
//         html: this.getAssistanceConfirmationTemplate(request),
//       };

//       await this.transporter.sendMail(mailOptions);
//       console.log(`✅ Assistance confirmation sent to ${request.email}`);
//       return true;
//     } catch (error) {
//       console.error("❌ Error sending assistance confirmation:", error.message);
//       return false;
//     }
//   }

//   // Send notification to support team (from first codebase)
//   async sendAssistanceNotification(request) {
//     try {
//       const mailOptions = {
//         from: this.defaultFrom,
//         to: this.companyInfo.adminEmail,
//         subject: `New ${request.priority} Priority Request: ${request.issueType} (#${request._id})`,
//         html: this.getAssistanceNotificationTemplate(request),
//       };

//       await this.transporter.sendMail(mailOptions);
//       console.log(`✅ Assistance notification sent for request ${request._id}`);
//       return true;
//     } catch (error) {
//       console.error("❌ Error sending assistance notification:", error.message);
//       return false;
//     }
//   }

//   // Send status update to user (from first codebase)
//   async sendAssistanceStatusUpdate(request, oldStatus) {
//     try {
//       if (request.status === oldStatus) return true;

//       const mailOptions = {
//         from: this.defaultFrom,
//         to: request.email,
//         subject: `Update on Your Assistance Request (#${request._id}) - ${this.companyInfo.name}`,
//         html: this.getAssistanceStatusUpdateTemplate(request, oldStatus),
//       };

//       await this.transporter.sendMail(mailOptions);
//       console.log(`✅ Assistance status update sent to ${request.email}`);
//       return true;
//     } catch (error) {
//       console.error("❌ Error sending assistance status update:", error.message);
//       return false;
//     }
//   }

//   // =================== CONTACT FORM EMAILS ===================

//   // Contact form notification to admin (from second codebase)
//   async sendContactNotification(contactData) {
//     const mailOptions = {
//       from: this.defaultFrom,
//       to: this.companyInfo.adminEmail,
//       subject: `New Contact Form: ${contactData.subject} - ${this.companyInfo.name}`,
//       html: this.getContactNotificationTemplate(contactData),
//       text: this.getContactNotificationText(contactData),
//     };

//     return await this.sendEmail(mailOptions);
//   }

//   // Auto-acknowledgement to user (from second codebase)
//   async sendContactAcknowledgement(contactEmail, contactName, additionalInfo = {}) {
//     const company = { ...this.companyInfo, ...additionalInfo };

//     const mailOptions = {
//       from: this.defaultFrom,
//       to: contactEmail,
//       subject: `We Received Your Message - ${company.name}`,
//       html: this.getContactAcknowledgementTemplate(contactName, company),
//       text: this.getContactAcknowledgementText(contactName, company),
//     };

//     return await this.sendEmail(mailOptions);
//   }

//   // Reply to contact form submission (from second codebase)
//   async sendContactReply(contactEmail, contactName, replyMessage, adminName = "Support Team") {
//     const mailOptions = {
//       from: this.defaultFrom,
//       to: contactEmail,
//       replyTo: this.companyInfo.supportEmail,
//       subject: `Re: Your Inquiry - ${this.companyInfo.name}`,
//       html: this.getContactReplyTemplate(contactName, replyMessage, adminName),
//       text: this.getContactReplyText(contactName, replyMessage, adminName),
//     };

//     return await this.sendEmail(mailOptions);
//   }

//   // =================== ADDITIONAL EMAIL TEMPLATES ===================

//   // Welcome email (for newsletter signup, etc.)
//   async sendWelcomeEmail(userEmail, userName) {
//     const mailOptions = {
//       from: this.defaultFrom,
//       to: userEmail,
//       subject: `Welcome to ${this.companyInfo.name}!`,
//       html: this.getWelcomeEmailTemplate(userName),
//       text: this.getWelcomeEmailText(userName),
//     };

//     return await this.sendEmail(mailOptions);
//   }

//   // Password reset email
//   async sendPasswordResetEmail(userEmail, resetLink, userName = "User") {
//     const mailOptions = {
//       from: this.defaultFrom,
//       to: userEmail,
//       subject: `Password Reset Request - ${this.companyInfo.name}`,
//       html: this.getPasswordResetTemplate(userName, resetLink),
//       text: this.getPasswordResetText(userName, resetLink),
//     };

//     return await this.sendEmail(mailOptions);
//   }

//   // =================== EMAIL TEMPLATES ===================

//   // Testimonial Templates (from third codebase - enhanced with company branding)

//   getTestimonialSubmittedTemplate(userName) {
//     return `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <style>
//           body { font-family: Arial, sans-serif; line-height: 1.6; }
//           .container { max-width: 600px; margin: 0 auto; padding: 20px; }
//           .header { background: #4a6fa5; color: white; padding: 20px; text-align: center; }
//           .content { padding: 30px; background: #f9f9f9; }
//           .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; background: #eee; }
//           .company-info { background: #e8f4ff; padding: 15px; border-radius: 5px; margin: 15px 0; font-size: 14px; }
//         </style>
//       </head>
//       <body>
//         <div class="container">
//           <div class="header">
//             <h1>Testimonial Submitted Successfully!</h1>
//             <p>${this.companyInfo.name}</p>
//           </div>
//           <div class="content">
//             <h2>Hello ${userName},</h2>
//             <p>Thank you for taking the time to submit your testimonial. Our team will review it shortly to ensure it meets our guidelines.</p>
            
//             <div class="company-info">
//               <p><strong>What happens next:</strong></p>
//               <ol>
//                 <li>Our team will review your testimonial within 24-48 hours</li>
//                 <li>You'll receive an email once it's approved</li>
//                 <li>Your testimonial will appear on our website</li>
//               </ol>
//             </div>
            
//             <p>If you have any questions, feel free to contact us:</p>
//             <p>📞 <strong>Phone:</strong> ${this.companyInfo.phone}</p>
//             <p>✉️ <strong>Email:</strong> ${this.companyInfo.supportEmail}</p>
            
//             <br>
//             <p>Best regards,<br>The ${this.companyInfo.name} Team</p>
//           </div>
//           <div class="footer">
//             <p>© ${new Date().getFullYear()} ${this.companyInfo.name}. All rights reserved.</p>
//             <p>${this.companyInfo.address}</p>
//           </div>
//         </div>
//       </body>
//       </html>
//     `;
//   }

//   getTestimonialApprovedTemplate(userName) {
//     return `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <style>
//           body { font-family: Arial, sans-serif; line-height: 1.6; }
//           .container { max-width: 600px; margin: 0 auto; padding: 20px; }
//           .header { background: #28a745; color: white; padding: 20px; text-align: center; }
//           .content { padding: 30px; background: #f9f9f9; }
//           .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; background: #eee; }
//           .success-box { background: #d4edda; border: 1px solid #c3e6cb; color: #155724; padding: 15px; border-radius: 5px; margin: 15px 0; }
//           .button { 
//             background: #28a745; 
//             color: white; 
//             padding: 12px 24px; 
//             text-decoration: none; 
//             border-radius: 5px; 
//             display: inline-block;
//             margin: 10px 0;
//           }
//         </style>
//       </head>
//       <body>
//         <div class="container">
//           <div class="header">
//             <h1>Your Testimonial Has Been Approved!</h1>
//             <p>${this.companyInfo.name}</p>
//           </div>
//           <div class="content">
//             <div class="success-box">
//               <h2 style="margin-top: 0;">Congratulations ${userName}!</h2>
//               <p>Your testimonial has been approved and is now live on our website.</p>
//             </div>
            
//             <p>Thank you for sharing your experience with other students. Your feedback helps future students make informed decisions.</p>
            
//             <br>
//             <a href="${this.frontendUrl}/testimonials" class="button">View All Testimonials</a>
//             <br><br>
            
//             <p><strong>Share your testimonial:</strong></p>
//             <p>Help others discover ${this.companyInfo.name} by sharing your experience on social media!</p>
            
//             <br>
//             <p>If you have any questions or would like to update your testimonial, please contact us:</p>
//             <p>📞 <strong>Phone:</strong> ${this.companyInfo.phone}</p>
//             <p>✉️ <strong>Email:</strong> ${this.companyInfo.supportEmail}</p>
            
//             <br>
//             <p>Best regards,<br>The ${this.companyInfo.name} Team</p>
//           </div>
//           <div class="footer">
//             <p>© ${new Date().getFullYear()} ${this.companyInfo.name}. All rights reserved.</p>
//             <p>${this.companyInfo.website} | ${this.companyInfo.address}</p>
//           </div>
//         </div>
//       </body>
//       </html>
//     `;
//   }

//   getTestimonialAdminTemplate(testimonial) {
//     return `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <style>
//           body { font-family: Arial, sans-serif; line-height: 1.6; }
//           .container { max-width: 600px; margin: 0 auto; padding: 20px; }
//           .header { background: #4a6fa5; color: white; padding: 20px; text-align: center; }
//           .content { padding: 30px; background: #f9f9f9; }
//           .testimonial-card { 
//             background: white; 
//             padding: 20px; 
//             border-radius: 8px; 
//             margin: 15px 0; 
//             border-left: 4px solid #4a6fa5;
//             box-shadow: 0 2px 5px rgba(0,0,0,0.1);
//           }
//           .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; background: #eee; }
//           .button { 
//             background: #4a6fa5; 
//             color: white; 
//             padding: 12px 24px; 
//             text-decoration: none; 
//             border-radius: 5px; 
//             display: inline-block;
//             margin: 10px 0;
//           }
//           .rating { 
//             color: #ffc107; 
//             font-size: 18px; 
//             letter-spacing: 2px;
//             margin: 10px 0;
//           }
//         </style>
//       </head>
//       <body>
//         <div class="container">
//           <div class="header">
//             <h1>New Testimonial Submitted</h1>
//             <p>${this.companyInfo.name} - Requires Review</p>
//           </div>
//           <div class="content">
//             <h2>A new testimonial requires your review</h2>
//             <p>Submitted: ${new Date(testimonial.createdAt || Date.now()).toLocaleString()}</p>
            
//             <div class="testimonial-card">
//               <h3 style="margin-top: 0;">${testimonial.name || 'Anonymous User'}</h3>
//               ${testimonial.university ? `<p><strong>🏫 University:</strong> ${testimonial.university}</p>` : ''}
//               ${testimonial.program ? `<p><strong>📚 Program:</strong> ${testimonial.program}</p>` : ''}
//               ${testimonial.rating ? `
//                 <p><strong>Rating:</strong></p>
//                 <div class="rating">${'★'.repeat(testimonial.rating)}${'☆'.repeat(5 - testimonial.rating)} (${testimonial.rating}/5)</div>
//               ` : ''}
//               <p><strong>Message:</strong></p>
//               <p style="background: #f8f9fa; padding: 15px; border-radius: 5px;">
//                 ${testimonial.content || testimonial.message || 'No message provided'}
//               </p>
              
//               ${testimonial.email ? `<p><strong>📧 Email:</strong> ${testimonial.email}</p>` : ''}
//             </div>
            
//             <br>
//             <a href="${this.adminUrl}/testimonials" class="button">Review Testimonial in Admin Panel</a>
            
//             <div style="margin-top: 20px; padding: 15px; background: #f8d7da; border: 1px solid #f5c6cb; border-radius: 5px;">
//               <p><strong>⚠️ Action Required:</strong> Please review this testimonial within 24 hours.</p>
//             </div>
//           </div>
//           <div class="footer">
//             <p>© ${new Date().getFullYear()} ${this.companyInfo.name} Admin Panel</p>
//             <p>This is an automated notification. Do not reply to this email.</p>
//           </div>
//         </div>
//       </body>
//       </html>
//     `;
//   }

//   // Assistance Request Templates (from first codebase - enhanced)
//   getAssistanceConfirmationTemplate(request) {
//     return `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <style>
//           body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
//           .header { background: #4a6fa5; color: white; padding: 20px; border-radius: 5px 5px 0 0; text-align: center; }
//           .content { background: #f8f9fa; padding: 20px; border-radius: 0 0 5px 5px; border: 1px solid #dee2e6; border-top: none; }
//           .badge { display: inline-block; padding: 3px 8px; border-radius: 12px; font-size: 12px; font-weight: bold; }
//           .status-pending { background: #ffc107; color: #856404; }
//           .priority-urgent { background: #dc3545; color: white; }
//           .priority-high { background: #fd7e14; color: white; }
//           .priority-medium { background: #4a6fa5; color: white; }
//           .priority-low { background: #6c757d; color: white; }
//           .info-box { background: white; border: 1px solid #dee2e6; border-radius: 5px; padding: 15px; margin: 15px 0; }
//           .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #dee2e6; font-size: 12px; color: #6c757d; }
//         </style>
//       </head>
//       <body>
//         <div class="header">
//           <h2 style="margin: 0;">Support Request Received</h2>
//           <p style="margin: 5px 0 0 0; opacity: 0.9;">${this.companyInfo.name}</p>
//         </div>
//         <div class="content">
//           <p>Hi ${request.name},</p>
//           <p>Thank you for contacting ${this.companyInfo.name}. We've received your request and our team will review it shortly.</p>
          
//           <div class="info-box">
//             <p><strong>Request ID:</strong> ${request._id}</p>
//             <p><strong>Status:</strong> <span class="badge status-pending">Pending</span></p>
//             <p><strong>Priority:</strong> <span class="badge priority-${request.priority}">${request.priority.toUpperCase()}</span></p>
//             <p><strong>Issue Type:</strong> ${request.issueType}</p>
//             <p><strong>Submitted:</strong> ${new Date(request.createdAt).toLocaleString()}</p>
//           </div>
          
//           <p><strong>Your Message:</strong></p>
//           <div style="background: white; border-left: 4px solid #4a6fa5; padding: 10px 15px; margin: 10px 0;">
//             ${request.message}
//           </div>
          
//           <p>We aim to respond within 24-48 hours during our business hours. You'll receive another email when we update your request.</p>
          
//           <p><strong>For urgent matters:</strong></p>
//           <p>📞 <strong>Call us:</strong> ${this.companyInfo.phone}</p>
//           <p>✉️ <strong>Email:</strong> ${this.companyInfo.supportEmail}</p>
//           <p>🕐 <strong>Hours:</strong> ${this.companyInfo.supportHours}</p>
          
//           <p>Best regards,<br>${this.companyInfo.name} Support Team</p>
          
//           <div class="footer">
//             <p>This is an automated message. Please do not reply to this email.</p>
//             <p>Request submitted from: ${request.pageUrl}</p>
//             <p>© ${new Date().getFullYear()} ${this.companyInfo.name}. All rights reserved.</p>
//           </div>
//         </div>
//       </body>
//       </html>
//     `;
//   }

//   getAssistanceNotificationTemplate(request) {
//     return `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <style>
//           body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 700px; margin: 0 auto; padding: 20px; }
//           .header { background: #dc3545; color: white; padding: 15px; border-radius: 5px; margin-bottom: 20px; text-align: center; }
//           .card { background: white; border: 1px solid #dee2e6; border-radius: 5px; padding: 20px; margin-bottom: 15px; }
//           .badge { display: inline-block; padding: 3px 8px; border-radius: 12px; font-size: 12px; font-weight: bold; margin-right: 5px; }
//           .priority-urgent { background: #dc3545; color: white; }
//           .priority-high { background: #fd7e14; color: white; }
//           .user-info { background: #e8f4fd; border-left: 4px solid #4a6fa5; }
//           .message-box { background: #fff8e1; border-left: 4px solid #ffc107; }
//           .tech-info { background: #f8f9fa; font-size: 12px; color: #6c757d; }
//           .btn { display: inline-block; background: #4a6fa5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 10px; }
//           .company-header { background: #4a6fa5; color: white; padding: 10px; border-radius: 5px 5px 0 0; text-align: center; }
//         </style>
//       </head>
//       <body>
//         <div class="company-header">
//           <h3 style="margin: 0;">${this.companyInfo.name}</h3>
//         </div>
        
//         <div class="header">
//           <h2 style="margin: 0;">⚠️ New Assistance Request</h2>
//         </div>
        
//         <div class="card">
//           <h3 style="margin-top: 0;">Request Details</h3>
//           <p><strong>ID:</strong> ${request._id}</p>
//           <p><strong>Priority:</strong> <span class="badge priority-${request.priority}">${request.priority.toUpperCase()}</span></p>
//           <p><strong>Type:</strong> ${request.issueType.toUpperCase()}</p>
//           <p><strong>Page:</strong> ${request.pageUrl}</p>
//         </div>
        
//         <div class="card user-info">
//           <h4>User Information</h4>
//           <p><strong>Name:</strong> ${request.name}</p>
//           <p><strong>Email:</strong> <a href="mailto:${request.email}">${request.email}</a></p>
//           <p><strong>Phone:</strong> ${request.phone || 'N/A'}</p>
//           <p><strong>Submitted:</strong> ${new Date(request.createdAt).toLocaleString()}</p>
//         </div>
        
//         <div class="card message-box">
//           <h4>User Message</h4>
//           <p>${request.message}</p>
//         </div>
        
//         <div class="card tech-info">
//           <p><strong>IP Address:</strong> ${request.ip || 'N/A'}</p>
//           <p><strong>User Agent:</strong> ${request.userAgent || 'N/A'}</p>
//         </div>
        
//         <div style="text-align: center; margin-top: 20px;">
//           <a href="${this.adminUrl}/requests/${request._id}" class="btn">
//             👁️ View Request in Admin Panel
//           </a>
//         </div>
        
//         <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #dee2e6; font-size: 12px; color: #6c757d;">
//           <p>This is an automated notification from ${this.companyInfo.name} Assistance System.</p>
//         </div>
//       </body>
//       </html>
//     `;
//   }

//   getAssistanceStatusUpdateTemplate(request, oldStatus) {
//     const statusMessages = {
//       pending: 'is pending review',
//       in_progress: 'is now being worked on',
//       resolved: 'has been resolved',
//       closed: 'has been closed'
//     };

//     return `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <style>
//           body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
//           .header { background: #4a6fa5; color: white; padding: 20px; border-radius: 5px 5px 0 0; text-align: center; }
//           .status-box { background: #e7f3ff; border: 1px solid #4a6fa5; border-radius: 5px; padding: 20px; margin: 20px 0; }
//           .badge { display: inline-block; padding: 3px 8px; border-radius: 12px; font-size: 12px; font-weight: bold; }
//           .status-resolved { background: #28a745; color: white; }
//           .status-in_progress { background: #17a2b8; color: white; }
//           .status-closed { background: #6c757d; color: white; }
//           .status-pending { background: #ffc107; color: #856404; }
//           .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #dee2e6; font-size: 12px; color: #6c757d; }
//         </style>
//       </head>
//       <body>
//         <div class="header">
//           <h2 style="margin: 0;">Request Status Update</h2>
//           <p style="margin: 5px 0 0 0; opacity: 0.9;">${this.companyInfo.name}</p>
//         </div>
        
//         <div style="background: #f8f9fa; padding: 20px; border-radius: 0 0 5px 5px; border: 1px solid #dee2e6; border-top: none;">
//           <p>Hi ${request.name},</p>
          
//           <div class="status-box">
//             <p>Your request <strong>#${request._id}</strong> ${statusMessages[request.status] || 'status has been updated'}.</p>
            
//             <p><strong>New Status:</strong> <span class="badge status-${request.status}">${request.status.replace('_', ' ').toUpperCase()}</span></p>
            
//             ${request.resolutionNotes ? `
//               <p><strong>Notes from Support:</strong></p>
//               <p style="background: white; padding: 10px; border-radius: 5px; border-left: 4px solid #28a745;">
//                 ${request.resolutionNotes}
//               </p>
//             ` : ''}
            
//             ${request.resolvedAt ? `
//               <p><strong>Resolved At:</strong> ${new Date(request.resolvedAt).toLocaleString()}</p>
//             ` : ''}
//           </div>
          
//           <p><strong>Contact Information:</strong></p>
//           <p>📞 <strong>Phone:</strong> ${this.companyInfo.phone}</p>
//           <p>✉️ <strong>Email:</strong> ${this.companyInfo.supportEmail}</p>
//           <p>🕐 <strong>Hours:</strong> ${this.companyInfo.supportHours}</p>
          
//           <p>If you have any questions about this update, please reply to this email.</p>
          
//           <p>Best regards,<br>${this.companyInfo.name} Support Team</p>
          
//           <div class="footer">
//             <p>This is an automated status update.</p>
//             <p>© ${new Date().getFullYear()} ${this.companyInfo.name}. All rights reserved.</p>
//           </div>
//         </div>
//       </body>
//       </html>
//     `;
//   }

//   // Contact Form Templates (from second codebase - already included in previous version)
//   getContactNotificationTemplate(contactData) {
//     return `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <style>
//           body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
//           .container { max-width: 600px; margin: 0 auto; padding: 20px; }
//           .header { background: #4a6fa5; color: white; padding: 20px; text-align: center; }
//           .content { background: #f9f9f9; padding: 30px; }
//           .footer { background: #eee; padding: 15px; text-align: center; font-size: 12px; color: #666; }
//           .contact-details { background: white; padding: 15px; border-left: 4px solid #4a6fa5; margin: 15px 0; }
//           .message-box { background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0; }
//           .action-button { 
//             display: inline-block; 
//             background: #4a6fa5; 
//             color: white; 
//             padding: 10px 20px; 
//             text-decoration: none; 
//             border-radius: 4px;
//             margin: 10px 5px;
//           }
//         </style>
//       </head>
//       <body>
//         <div class="container">
//           <div class="header">
//             <h1>New Contact Form Submission</h1>
//             <p>${this.companyInfo.name}</p>
//           </div>
          
//           <div class="content">
//             <h2>Contact Details</h2>
//             <div class="contact-details">
//               <p><strong>👤 Name:</strong> ${contactData.name}</p>
//               <p><strong>📧 Email:</strong> ${contactData.email}</p>
//               <p><strong>📋 Subject:</strong> ${contactData.subject}</p>
//               <p><strong>🕐 Received:</strong> ${new Date().toLocaleString()}</p>
//               <p><strong>📱 IP Address:</strong> ${contactData.ipAddress || "Not available"}</p>
//             </div>
            
//             <h3>Message Content:</h3>
//             <div class="message-box">
//               ${contactData.message}
//             </div>
            
//             <div style="margin-top: 30px;">
//               <a href="mailto:${contactData.email}" class="action-button" style="background: #28a745;">
//                 Reply to ${contactData.name}
//               </a>
//             </div>
//           </div>
          
//           <div class="footer">
//             <p>This is an automated notification from ${this.companyInfo.name} Contact Form.</p>
//             <p>© ${new Date().getFullYear()} ${this.companyInfo.name}. All rights reserved.</p>
//           </div>
//         </div>
//       </body>
//       </html>
//     `;
//   }

//   getContactNotificationText(contactData) {
//     return `NEW CONTACT FORM SUBMISSION\n\nName: ${contactData.name}\nEmail: ${contactData.email}\nSubject: ${contactData.subject}\n\nMessage:\n${contactData.message}\n\nReceived: ${new Date().toLocaleString()}\n\n---\nThis is an automated notification from ${this.companyInfo.name} Contact Form.`;
//   }

//   getContactAcknowledgementTemplate(contactName, company) {
//     return `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <style>
//           body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
//           .container { max-width: 600px; margin: 0 auto; padding: 20px; }
//           .header { background: #4a6fa5; color: white; padding: 20px; text-align: center; }
//           .content { background: #f9f9f9; padding: 30px; }
//           .footer { background: #eee; padding: 15px; text-align: center; font-size: 12px; color: #666; }
//           .logo { max-width: 150px; margin-bottom: 20px; }
//           .contact-info { margin-top: 20px; font-size: 14px; background: white; padding: 15px; border-radius: 5px; }
//           .button { 
//             display: inline-block; 
//             background: #4a6fa5; 
//             color: white; 
//             padding: 12px 24px; 
//             text-decoration: none; 
//             border-radius: 4px;
//             margin: 15px 0;
//           }
//           .highlight-box { 
//             background: #e8f4ff; 
//             border-left: 4px solid #4a6fa5; 
//             padding: 15px; 
//             margin: 20px 0; 
//           }
//         </style>
//       </head>
//       <body>
//         <div class="container">
//           <div class="header">
//             <h1>We Received Your Message</h1>
//             <p>${company.name}</p>
//           </div>
          
//           <div class="content">
//             <h2>Thank You for Contacting ${company.name}</h2>
            
//             <p>Dear ${contactName},</p>
            
//             <div class="highlight-box">
//               <p><strong>✅ Confirmation:</strong> We have successfully received your inquiry.</p>
//               <p><strong>⏱️ Response Time:</strong> Our team will review it and get back to you within <strong>24-48 hours</strong> during our business hours.</p>
//             </div>
            
//             <p><strong>Here's what happens next:</strong></p>
//             <ol>
//               <li>Your message has been logged and assigned a reference number</li>
//               <li>Our support team will review your inquiry</li>
//               <li>We'll respond with detailed information or schedule a call if needed</li>
//             </ol>
            
//             <div class="contact-info">
//               <p><strong>For urgent matters:</strong></p>
//               <p>📞 <strong>Call us:</strong> ${company.phone}</p>
//               <p>✉️ <strong>Email:</strong> ${company.supportEmail}</p>
//               <p>🕐 <strong>Support Hours:</strong> ${company.supportHours}</p>
//               <p>📍 <strong>Address:</strong> ${company.address}</p>
//             </div>
            
//             <p>In the meantime, you might find helpful information on our website:</p>
//             <a href="${company.website}" class="button">Visit Our Website</a>
            
//             <p style="margin-top: 30px; font-size: 14px; color: #666;">
//               <strong>Reference:</strong> CONTACT-${Date.now()}<br>
//               <strong>Submitted:</strong> ${new Date().toLocaleString()}
//             </p>
//           </div>
          
//           <div class="footer">
//             <p>This is an automated acknowledgment. Please do not reply to this email.</p>
//             <p>If you need to send additional information, please reply to your original email thread or contact us at ${company.phone}.</p>
//             <p>&copy; ${new Date().getFullYear()} ${company.name}. All rights reserved.</p>
//           </div>
//         </div>
//       </body>
//       </html>
//     `;
//   }

//   getContactAcknowledgementText(contactName, company) {
//     return `WE RECEIVED YOUR MESSAGE\n\nDear ${contactName},\n\nThank you for contacting ${company.name}.\n\nWe have received your inquiry and our team will get back to you within 24-48 hours during our business hours.\n\nFor urgent matters:\n📞 Call us: ${company.phone}\n✉️ Email: ${company.supportEmail}\n🕐 Support Hours: ${company.supportHours}\n📍 Address: ${company.address}\n\nReference: CONTACT-${Date.now()}\nSubmitted: ${new Date().toLocaleString()}\n\nThis is an automated acknowledgement. Please do not reply to this email.\n\nBest regards,\n${company.name} Team`;
//   }

//   getContactReplyTemplate(contactName, replyMessage, adminName) {
//     return `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <style>
//           body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
//           .container { max-width: 600px; margin: 0 auto; padding: 20px; }
//           .header { background: #28a745; color: white; padding: 20px; text-align: center; }
//           .content { background: #f9f9f9; padding: 30px; }
//           .footer { background: #eee; padding: 15px; text-align: center; font-size: 12px; color: #666; }
//           .reply-box { 
//             background: white; 
//             padding: 20px; 
//             border-left: 4px solid #28a745; 
//             margin: 20px 0;
//             box-shadow: 0 2px 5px rgba(0,0,0,0.1);
//           }
//           .signature { 
//             margin-top: 30px; 
//             padding-top: 20px; 
//             border-top: 1px solid #ddd;
//           }
//           .contact-details { 
//             background: #f8f9fa; 
//             padding: 15px; 
//             border-radius: 5px; 
//             margin: 20px 0; 
//             font-size: 14px;
//           }
//         </style>
//       </head>
//       <body>
//         <div class="container">
//           <div class="header">
//             <h1>Response to Your Inquiry</h1>
//             <p>${this.companyInfo.name}</p>
//           </div>
          
//           <div class="content">
//             <p>Dear ${contactName},</p>
            
//             <p>Thank you for contacting ${this.companyInfo.name}. Here is our response to your inquiry:</p>
            
//             <div class="reply-box">
//               ${replyMessage.replace(/\n/g, "<br>")}
//             </div>
            
//             <div class="contact-details">
//               <p><strong>If you need further assistance:</strong></p>
//               <p>📞 <strong>Phone:</strong> ${this.companyInfo.phone}</p>
//               <p>✉️ <strong>Email:</strong> ${this.companyInfo.supportEmail}</p>
//               <p>🕐 <strong>Hours:</strong> ${this.companyInfo.supportHours}</p>
//             </div>
            
//             <div class="signature">
//               <p>Best regards,</p>
//               <p><strong>${adminName}</strong></p>
//               <p>${this.companyInfo.name} Support Team</p>
//             </div>
//           </div>
          
//           <div class="footer">
//             <p>This email was sent in response to your contact form submission.</p>
//             <p>&copy; ${new Date().getFullYear()} ${this.companyInfo.name}. All rights reserved.</p>
//           </div>
//         </div>
//       </body>
//       </html>
//     `;
//   }

//   getContactReplyText(contactName, replyMessage, adminName) {
//     return `RESPONSE TO YOUR INQUIRY\n\nDear ${contactName},\n\nThank you for contacting ${this.companyInfo.name}. Here is our response to your inquiry:\n\n${replyMessage}\n\nIf you need further assistance:\n📞 Phone: ${this.companyInfo.phone}\n✉️ Email: ${this.companyInfo.supportEmail}\n🕐 Hours: ${this.companyInfo.supportHours}\n\nBest regards,\n${adminName}\n${this.companyInfo.name} Support Team\n\n---\nThis email was sent in response to your contact form submission.`;
//   }

//   // Additional Templates (Welcome, Password Reset - already included in previous version)
//   getWelcomeEmailTemplate(userName) {
//     return `
//       <!DOCTYPE html>
//       <html>
//       <body style="font-family: Arial, sans-serif;">
//         <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
//           <div style="background: #4a6fa5; color: white; padding: 30px; text-align: center;">
//             <h1>Welcome to ${this.companyInfo.name}!</h1>
//           </div>
//           <div style="padding: 30px; background: #f9f9f9;">
//             <p>Dear ${userName},</p>
//             <p>Thank you for joining us! We're excited to have you on board.</p>
//             <p>If you have any questions, feel free to contact us at ${this.companyInfo.supportEmail}</p>
//           </div>
//         </div>
//       </body>
//       </html>
//     `;
//   }

//   getWelcomeEmailText(userName) {
//     return `Welcome to ${this.companyInfo.name}!\n\nDear ${userName},\n\nThank you for joining us! We're excited to have you on board.\n\nIf you have any questions, feel free to contact us at ${this.companyInfo.supportEmail}\n\nBest regards,\n${this.companyInfo.name} Team`;
//   }

//   getPasswordResetTemplate(userName, resetLink) {
//     return `
//       <!DOCTYPE html>
//       <html>
//       <body style="font-family: Arial, sans-serif;">
//         <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
//           <div style="background: #dc3545; color: white; padding: 20px; text-align: center;">
//             <h2>Password Reset</h2>
//             <p>${this.companyInfo.name}</p>
//           </div>
//           <div style="padding: 30px; background: #f9f9f9;">
//             <p>Dear ${userName},</p>
//             <p>You requested to reset your password. Click the link below to proceed:</p>
//             <p><a href="${resetLink}" style="background: #4a6fa5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a></p>
//             <p>This link will expire in 1 hour.</p>
//             <p>If you didn't request this, please ignore this email.</p>
//           </div>
//         </div>
//       </body>
//       </html>
//     `;
//   }

//   getPasswordResetText(userName, resetLink) {
//     return `Password Reset Request - ${this.companyInfo.name}\n\nDear ${userName},\n\nYou requested to reset your password. Click the link below to proceed:\n\n${resetLink}\n\nThis link will expire in 1 hour.\n\nIf you didn't request this, please ignore this email.\n\nBest regards,\n${this.companyInfo.name} Team`;
//   }

//   // =================== UTILITY METHODS ===================

//   // Update company information
//   updateCompanyInfo(newInfo) {
//     this.companyInfo = { ...this.companyInfo, ...newInfo };
//     this.defaultFrom = `"${this.companyInfo.name}" <${this.companyInfo.supportEmail}>`;
//   }

//   // Get current company info
//   getCompanyInfo() {
//     return { ...this.companyInfo };
//   }

//   // Legacy compatibility - expose templates for direct use
//   get emailTemplates() {
//     return {
//       testimonialSubmitted: (name) => this.getTestimonialSubmittedTemplate(name),
//       testimonialApproved: (name) => this.getTestimonialApprovedTemplate(name),
//       adminNotification: (testimonial) => this.getTestimonialAdminTemplate(testimonial),
//     };
//   }
// }

// // Create singleton instance
// const emailService = new EmailService();

// // Export for use
// module.exports = emailService;

// // Optional: export class for testing/extension
// module.exports.EmailService = EmailService;

// // Legacy exports for compatibility with third codebase
// module.exports.sendEmail = emailService.sendLegacyEmail.bind(emailService);
// module.exports.emailTemplates = emailService.emailTemplates;