const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  async sendBookingConfirmation(booking, university) {
    const mailOptions = {
      from: `"University Booking System" <${process.env.EMAIL_USER}>`,
      to: booking.student.email,
      subject: `Booking Confirmation - ${university.name}`,
      html: this.generateBookingConfirmationHTML(booking, university)
    };

    try {
      await this.transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('Email send error:', error);
      return false;
    }
  }

  async sendBookingReminder(booking, university) {
    const mailOptions = {
      from: `"University Booking System" <${process.env.EMAIL_USER}>`,
      to: booking.student.email,
      subject: `Reminder: Your Booking with ${university.name}`,
      html: this.generateReminderHTML(booking, university)
    };

    try {
      await this.transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('Email send error:', error);
      return false;
    }
  }

  async sendCancellationEmail(booking, university) {
    const mailOptions = {
      from: `"University Booking System" <${process.env.EMAIL_USER}>`,
      to: booking.student.email,
      subject: `Booking Cancellation - ${university.name}`,
      html: this.generateCancellationHTML(booking, university)
    };

    try {
      await this.transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('Email send error:', error);
      return false;
    }
  }

  generateBookingConfirmationHTML(booking, university) {
    const formattedDate = new Date(booking.bookingDetails.date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #4a6fa5; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
          .details { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #4a6fa5; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
          .important { color: #d9534f; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Booking Confirmed! 🎉</h1>
        </div>
        <div class="content">
          <h2>Hello ${booking.student.fullName},</h2>
          <p>Your booking with <strong>${university.name}</strong> has been confirmed.</p>
          
          <div class="details">
            <h3>Booking Details:</h3>
            <p><strong>University:</strong> ${university.name}</p>
            <p><strong>Date:</strong> ${formattedDate}</p>
            <p><strong>Time:</strong> ${booking.bookingDetails.time}</p>
            <p><strong>Duration:</strong> ${booking.bookingDetails.duration} minutes</p>
            <p><strong>Type:</strong> ${booking.bookingDetails.type}</p>
            ${booking.bookingDetails.meetingLink ? 
              `<p><strong>Meeting Link:</strong> <a href="${booking.bookingDetails.meetingLink}">Click to join</a></p>` : ''}
          </div>
          
          <div class="details">
            <h3>Your Information:</h3>
            <p><strong>Name:</strong> ${booking.student.fullName}</p>
            <p><strong>Email:</strong> ${booking.student.email}</p>
            <p><strong>Phone:</strong> ${booking.student.phone}</p>
            <p><strong>Program Interest:</strong> ${booking.student.programInterest}</p>
            <p><strong>Intake Year:</strong> ${booking.student.intakeYear}</p>
          </div>
          
          <p class="important">Please arrive 5 minutes before your scheduled time.</p>
          <p class="important">A reminder will be sent 24 hours before your consultation.</p>
          
          <p>If you need to reschedule or cancel, please contact us at least 24 hours in advance.</p>
        </div>
        <div class="footer">
          <p>Best regards,<br>University Booking System Team</p>
        </div>
      </body>
      </html>
    `;
  }

  generateReminderHTML(booking, university) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #ff9800; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #fff3cd; padding: 30px; border-radius: 0 0 8px 8px; }
          .details { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Booking Reminder ⏰</h1>
        </div>
        <div class="content">
          <h2>Dear ${booking.student.fullName},</h2>
          <p>This is a reminder for your booking with <strong>${university.name}</strong> tomorrow.</p>
          
          <div class="details">
            <h3>Appointment Details:</h3>
            <p><strong>Time:</strong> ${booking.bookingDetails.time}</p>
            <p><strong>Duration:</strong> ${booking.bookingDetails.duration} minutes</p>
            ${booking.bookingDetails.meetingLink ? 
              `<p><strong>Meeting Link:</strong> <a href="${booking.bookingDetails.meetingLink}">Click here to join</a></p>` : ''}
          </div>
          
          <p>Please be prepared with any questions you may have.</p>
          <p>If you need to cancel or reschedule, please contact us as soon as possible.</p>
        </div>
      </body>
      </html>
    `;
  }

  generateCancellationHTML(booking, university) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #f44336; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
          .details { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #f44336; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Booking Cancelled</h1>
        </div>
        <div class="content">
          <h2>Dear ${booking.student.fullName},</h2>
          <p>Your booking with <strong>${university.name}</strong> has been cancelled.</p>
          
          <div class="details">
            <h3>Cancelled Booking Details:</h3>
            <p><strong>University:</strong> ${university.name}</p>
            <p><strong>Date:</strong> ${new Date(booking.bookingDetails.date).toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${booking.bookingDetails.time}</p>
          </div>
          
          <p>If this was a mistake or you wish to reschedule, please contact us.</p>
          <p>We hope to assist you with your educational journey in the future.</p>
        </div>
      </body>
      </html>
    `;
  }
}

module.exports = new EmailService();