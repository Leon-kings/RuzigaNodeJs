const nodemailer = require("nodemailer");

class EmailService {
  constructor() {
    this.companyInfo = {
      name: "REC Apply",
      phone: "+1 (555) 123-4567",
      supportHours: "Monday to Friday, 9 AM to 5 PM EST",
      website: "https://rk-services-xi.vercel.app",
      address: "123 Business Street, City, State 12345",
      supportEmail: "r.educationalconsultance@gmail.com",
      adminEmail: "r.educationalconsultance@gmail.com",
    };

    // Email transporter configuration
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Set default "From" address with company name
    this.defaultFrom =
      process.env.EMAIL_FROM ||
      `"${this.companyInfo.name}" <${this.companyInfo.supportEmail}>`;
  }

  // Generic email sending function
  async sendEmail(options) {
    try {
      const mailOptions = {
        from: options.from || this.defaultFrom,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
        replyTo: options.replyTo || this.companyInfo.supportEmail,
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log("Email sent:", info.messageId);
      return info;
    } catch (error) {
      console.error("Email sending error:", error);
      throw error;
    }
  }

  // =================== CONTACT FORM EMAILS ===================

  // Contact form notification to admin
  async sendContactNotification(contactData) {
    const mailOptions = {
      from: this.defaultFrom,
      to: this.companyInfo.adminEmail, // Goes to admin
      subject: `New Contact Form: ${contactData.subject}`,
      html: `
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
            </div>
            
            <div class="content">
              <h2>Contact Details</h2>
              <div class="contact-details">
                <p><strong>👤 Name:</strong> ${contactData.name}</p>
                <p><strong>📧 Email:</strong> ${contactData.email}</p>
                <p><strong>📋 Subject:</strong> ${contactData.subject}</p>
                <p><strong>🕐 Received:</strong> ${new Date().toLocaleString()}</p>
                <p><strong>📱 IP Address:</strong> ${
                  contactData.ipAddress || "Not available"
                }</p>
              </div>
              
              <h3>Message Content:</h3>
              <div class="message-box">
                ${contactData.message}
              </div>
              
              <div style="margin-top: 30px;">
          
                <a href="mailto:${
                  contactData.email
                }" class="action-button" style="background: #28a745;">
                  Reply to ${contactData.name}
                </a>
              </div>
            </div>
            
            <div class="footer">
              <p>This is an automated notification from ${
                this.companyInfo.name
              } Contact Form.</p>
              <p>© ${new Date().getFullYear()} ${
        this.companyInfo.name
      }. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `NEW CONTACT FORM SUBMISSION\n\nName: ${contactData.name}\nEmail: ${
        contactData.email
      }\nSubject: ${contactData.subject}\n\nMessage:\n${
        contactData.message
      }\n\nReceived: ${new Date().toLocaleString()}\n\n---\nThis is an automated notification from ${
        this.companyInfo.name
      } Contact Form.`,
    };

    return await this.sendEmail(mailOptions);
  }

  // Auto-acknowledgement to user (THE EMAIL YOU WANT TO EDIT)
  async sendAutoAcknowledgement(
    contactEmail,
    contactName,
    additionalInfo = {}
  ) {
    const company = { ...this.companyInfo, ...additionalInfo };

    const mailOptions = {
      from: this.defaultFrom,
      to: contactEmail, // Goes to the person who submitted the form
      subject: `We Received Your Message - ${company.name}`,
      html: `
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
                <p>🕐 <strong>Support Hours:</strong> ${
                  company.supportHours
                }</p>
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
              <p>If you need to send additional information, please reply to your original email thread or contact us at ${
                company.phone
              }.</p>
              <p>&copy; ${new Date().getFullYear()} ${
        company.name
      }. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `WE RECEIVED YOUR MESSAGE\n\nDear ${contactName},\n\nThank you for contacting ${
        company.name
      }.\n\nWe have received your inquiry and our team will get back to you within 24-48 hours during our business hours.\n\nFor urgent matters:\n📞 Call us: ${
        company.phone
      }\n✉️ Email: ${company.supportEmail}\n🕐 Support Hours: ${
        company.supportHours
      }\n📍 Address: ${
        company.address
      }\n\nReference: CONTACT-${Date.now()}\nSubmitted: ${new Date().toLocaleString()}\n\nThis is an automated acknowledgement. Please do not reply to this email.\n\nBest regards,\n${
        company.name
      } Team`,
    };

    return await this.sendEmail(mailOptions);
  }

  // Reply to contact form submission
  async sendReplyToContact(
    contactEmail,
    contactName,
    replyMessage,
    adminName = "Support Team"
  ) {
    const mailOptions = {
      from: this.defaultFrom,
      to: contactEmail,
      replyTo: this.companyInfo.supportEmail, // So replies go to support email
      subject: "Re: Your Inquiry - " + this.companyInfo.name,
      html: `
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
            </div>
            
            <div class="content">
              <p>Dear ${contactName},</p>
              
              <p>Thank you for contacting ${
                this.companyInfo.name
              }. Here is our response to your inquiry:</p>
              
              <div class="reply-box">
                ${replyMessage.replace(/\n/g, "<br>")}
              </div>
              
              <div class="contact-details">
                <p><strong>If you need further assistance:</strong></p>
                <p>📞 <strong>Phone:</strong> ${this.companyInfo.phone}</p>
                <p>✉️ <strong>Email:</strong> ${
                  this.companyInfo.supportEmail
                }</p>
                <p>🕐 <strong>Hours:</strong> ${
                  this.companyInfo.supportHours
                }</p>
              </div>
              
              <div class="signature">
                <p>Best regards,</p>
                <p><strong>${adminName}</strong></p>
                <p>${this.companyInfo.name} Support Team</p>
              </div>
            </div>
            
            <div class="footer">
              <p>This email was sent in response to your contact form submission.</p>
              <p>&copy; ${new Date().getFullYear()} ${
        this.companyInfo.name
      }. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `RESPONSE TO YOUR INQUIRY\n\nDear ${contactName},\n\nThank you for contacting ${this.companyInfo.name}. Here is our response to your inquiry:\n\n${replyMessage}\n\nIf you need further assistance:\n📞 Phone: ${this.companyInfo.phone}\n✉️ Email: ${this.companyInfo.supportEmail}\n🕐 Hours: ${this.companyInfo.supportHours}\n\nBest regards,\n${adminName}\n${this.companyInfo.name} Support Team\n\n---\nThis email was sent in response to your contact form submission.`,
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
      html: `
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
      `,
    };

    return await this.sendEmail(mailOptions);
  }

  // Password reset email
  async sendPasswordResetEmail(userEmail, resetLink, userName = "User") {
    const mailOptions = {
      from: this.defaultFrom,
      to: userEmail,
      subject: `Password Reset Request - ${this.companyInfo.name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <body style="font-family: Arial, sans-serif;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: #dc3545; color: white; padding: 20px; text-align: center;">
              <h2>Password Reset</h2>
            </div>
            <div style="padding: 30px; background: #f9f9f9;">
              <p>Dear ${userName},</p>
              <p>You requested to reset your password. Click the link below to proceed:</p>
              <p><a href="${resetLink}" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a></p>
              <p>This link will expire in 1 hour.</p>
              <p>If you didn't request this, please ignore this email.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    return await this.sendEmail(mailOptions);
  }

  // =================== UTILITY METHODS ===================

  // Update company information
  updateCompanyInfo(newInfo) {
    this.companyInfo = { ...this.companyInfo, ...newInfo };
    this.defaultFrom = `"${this.companyInfo.name}" <${this.companyInfo.supportEmail}>`;
  }

  // Test email connection
  async testConnection() {
    try {
      await this.transporter.verify();
      console.log("SMTP Connection: ✅ Success");
      return true;
    } catch (error) {
      console.error("SMTP Connection: ❌ Failed", error);
      return false;
    }
  }

  // Get current company info
  getCompanyInfo() {
    return { ...this.companyInfo };
  }
}

// Create singleton instance
const emailService = new EmailService();

// Export for use
module.exports = emailService;

// Optional: export class for testing/extension
module.exports.EmailService = EmailService;
