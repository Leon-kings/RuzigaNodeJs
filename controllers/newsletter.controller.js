// const Newsletter = require('../models/Newsletter');
// const nodemailer = require('nodemailer');

// class NewsletterController {
//   constructor() {
//     // Setup email transporter
//     this.transporter = nodemailer.createTransport({
//       host: process.env.SMTP_HOST,
//       port: process.env.SMTP_PORT,
//       secure: false,
//       auth: {
//         user: process.env.SMTP_USER,
//         pass: process.env.SMTP_PASS
//       }
//     });

//     this.subscribe = this.subscribe.bind(this);
//     this.getAll = this.getAll.bind(this);
//     this.sendConfirmationEmail = this.sendConfirmationEmail.bind(this);
//   }

//   async sendConfirmationEmail(email, name) {
//     const html = `
//       <h2>Hello ${name}!</h2>
//       <p>Thank you for subscribing to our newsletter. You will now receive updates, scholarships, university news, and visa updates.</p>
//       <p>Best regards,<br>Study Abroad Team</p>
//     `;

//     return this.transporter.sendMail({
//       from: `"Study Abroad" <${process.env.EMAIL_FROM}>`,
//       to: email,
//       subject: 'Newsletter Subscription Confirmed',
//       html
//     });
//   }

//   // CREATE subscription
//   async subscribe(req, res) {
//     try {
//       const { email, name, country } = req.body;

//       if (!email) {
//         return res.status(400).json({ success: false, message: 'Email is required' });
//       }

//       const existing = await Newsletter.findOne({ email: email.toLowerCase() });
//       if (existing) {
//         return res.status(409).json({ success: false, message: 'Email already subscribed' });
//       }

//       const newsletterData = {
//         email: email.toLowerCase(),
//         name: name || 'Anonymous',
//         country: country || 'Not specified',
//         source: 'footer_newsletter'
//       };

//       const newSub = await Newsletter.create(newsletterData);

//       try {
//         await this.sendConfirmationEmail(email, newsletterData.name);
//       } catch (emailErr) {
//         console.error('Error sending newsletter email:', emailErr);
//       }

//       res.status(201).json({
//         success: true,
//         message: 'Subscribed successfully',
//         data: newSub
//       });
//     } catch (error) {
//       console.error('Newsletter subscription error:', error);
//       res.status(500).json({
//         success: false,
//         message: 'Server error while subscribing'
//       });
//     }
//   }

//   // GET all subscriptions
//   async getAll(req, res) {
//     try {
//       const subscriptions = await Newsletter.find().sort({ subscription_date: -1 }).lean();
//       res.status(200).json({
//         success: true,
//         total: subscriptions.length,
//         data: subscriptions
//       });
//     } catch (error) {
//       console.error('Error fetching newsletter subscriptions:', error);
//       res.status(500).json({
//         success: false,
//         message: 'Server error while fetching subscriptions'
//       });
//     }
//   }
// }

// module.exports = new NewsletterController();








































const Newsletter = require('../models/Newsletter');
const nodemailer = require('nodemailer');

class NewsletterController {
  constructor() {
    // Setup email transporter
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    this.subscribe = this.subscribe.bind(this);
    this.getAll = this.getAll.bind(this);
    this.getStatistics = this.getStatistics.bind(this);
    this.sendConfirmationEmail = this.sendConfirmationEmail.bind(this);
  }

  async sendConfirmationEmail(email, name) {
    const html = `
      <h2>Hello ${name}!</h2>
      <p>Thank you for subscribing to our newsletter. You will now receive updates, scholarships, university news, and visa updates.</p>
      <p>Best regards,<br>Study Abroad Team</p>
    `;

    return this.transporter.sendMail({
      from: `"Study Abroad" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: 'Newsletter Subscription Confirmed',
      html
    });
  }

  // CREATE subscription
  async subscribe(req, res) {
    try {
      const { email, name, country } = req.body;

      if (!email) {
        return res.status(400).json({ success: false, message: 'Email is required' });
      }

      const existing = await Newsletter.findOne({ email: email.toLowerCase() });
      if (existing) {
        return res.status(409).json({ success: false, message: 'Email already subscribed' });
      }

      const newsletterData = {
        email: email.toLowerCase(),
        name: name || 'Anonymous',
        country: country || 'Not specified',
        source: 'footer_newsletter'
      };

      const newSub = await Newsletter.create(newsletterData);

      try {
        await this.sendConfirmationEmail(email, newsletterData.name);
      } catch (emailErr) {
        console.error('Error sending newsletter email:', emailErr);
      }

      res.status(201).json({
        success: true,
        message: 'Subscribed successfully',
        data: newSub
      });
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error while subscribing'
      });
    }
  }

  // GET all subscriptions
  async getAll(req, res) {
    try {
      const subscriptions = await Newsletter.find()
        .sort({ subscription_date: -1 })
        .lean();

      res.status(200).json({
        success: true,
        total: subscriptions.length,
        data: subscriptions
      });
    } catch (error) {
      console.error('Error fetching newsletter subscriptions:', error);
      res.status(500).json({
        success: false,
        message: 'Server error while fetching subscriptions'
      });
    }
  }

  async getByEmail(req, res) {
    try {
      const { email } = req.params;

      const subscriptions = await Newsletter.find({ email: email.toLowerCase() })
        .sort({ subscription_date: -1 })
        .lean();

      res.status(200).json({
        success: true,
        total: subscriptions.length,
        data: subscriptions
      });
    } catch (error) {
      console.error('Error fetching newsletter subscription by email:', error);
      res.status(500).json({
        success: false,
        message: 'Server error while fetching subscriptions by email'
      });
    }
}


  // =========================
  // NEWSLETTER STATISTICS
  // =========================
  async getStatistics(req, res) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

      const [
        totalSubscribers,
        todaySubscribers,
        monthlySubscribers,
        subscribersByCountry,
        monthlyTrend
      ] = await Promise.all([
        Newsletter.countDocuments(),

        Newsletter.countDocuments({
          subscription_date: { $gte: today }
        }),

        Newsletter.countDocuments({
          subscription_date: { $gte: startOfMonth }
        }),

        Newsletter.aggregate([
          {
            $group: {
              _id: "$country",
              count: { $sum: 1 }
            }
          },
          { $sort: { count: -1 } }
        ]),

        Newsletter.aggregate([
          {
            $group: {
              _id: {
                year: { $year: "$subscription_date" },
                month: { $month: "$subscription_date" }
              },
              count: { $sum: 1 }
            }
          },
          { $sort: { "_id.year": 1, "_id.month": 1 } }
        ])
      ]);

      res.status(200).json({
        success: true,
        data: {
          totalSubscribers,
          todaySubscribers,
          monthlySubscribers,
          subscribersByCountry,
          monthlyTrend
        }
      });
    } catch (error) {
      console.error('Newsletter statistics error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error while fetching statistics'
      });
    }
  }
}

module.exports = new NewsletterController();
