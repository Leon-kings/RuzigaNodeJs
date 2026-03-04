const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();
const path = require("path");

// Routes
const authRoutes = require("./routes/authRoutes");
const statisticsRoutes = require("./routes/statisticsRoutes");
const contactRoutes = require("./routes/contactRoutes");
const pageViewRoutes = require("./routes/pageViewRoutes");
const assistanceRoutes = require("./routes/assistanceRoutes");
const testimonialRoutes = require("./routes/testimonialRoutes");
const airportBookingRoutes = require("./routes/airportBookingRoutes");
// const admissionBookingRoutes = require("./routes/admissionBookingRoutes");
const cscExamRoutes = require("./routes/cscExamRoutes");
const scholarshipRoutes = require("./routes/scholarshipRoutes");
const enquiryRoutes = require("./routes/enquiryRoutes");
const serviceRoutes = require("./routes/servicesRoutes");
const ServiceMainRoutes = require("./routes/ServicesmainRoutes");
const faqRoutes = require("./routes/faqRoutes");
const newsletterRoutes = require("./routes/newsletterRoutes");
const CSCEBookingRoutes = require("./routes/CSCEBookingRoutes");
const blogRoutes = require("./routes/blogRoutes");
const commentRoutes = require("./routes/commentRoutes");
// const bookingRoutes = require("./routes/bookingRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const visaRoutes = require("./routes/visaRoutes");
const accommodationRoutes = require("./routes/accomodationRoutes");
const accomodationBookingRoutes = require("./routes/accomodationBookingRoutes");
const createScholarshipRoutes = require("./routes/createScholarshipRoutes");
const admissionRoutes = require("./routes/admissionSystem.routes");

const app = express();

/* =======================
   GLOBAL MIDDLEWARE
======================= */

app.use(helmet());

// Universal CORS with credentials support
app.use(
  cors({
    origin: (origin, callback) => callback(null, true),
    credentials: true,
    optionsSuccessStatus: 200,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =======================
   DATABASE CONNECTION
======================= */

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined");
    }

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("✅ MongoDB connected successfully");
    console.log("📦 Database:", mongoose.connection.name);
    console.log("🌍 Host:", mongoose.connection.host);
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1); // ⛔ NEVER continue without DB
  }
};

/* =======================
   HEALTH CHECKS
======================= */

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    service: "Ruziga API",
    version: "1.0.0",
    environment: process.env.NODE_ENV || "development",
  });
});

// Request logger
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  if (req.method === "POST") {
    console.log("Body:", req.body);
  }
  next();
});

app.get("/health/detailed", async (req, res) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    services: {
      database: mongoose.connection.readyState === 1 ? "healthy" : "unhealthy",
      api: "healthy",
    },
  });
});

app.get("/debug", (req, res) => {
  res.json({
    timestamp: new Date().toISOString(),
    nodeVersion: process.version,
    environment: process.env.NODE_ENV || "development",
    databaseConnected: mongoose.connection.readyState === 1,
    frontendUrl: process.env.FRONTEND_URL || "Not set",
  });
});

/* =======================
   API ROUTES
======================= */

app.use("/auth", authRoutes);
app.use("/statistics", statisticsRoutes);
app.use("/contacts", contactRoutes);
app.use("/seen", pageViewRoutes);
app.use("/assistance", assistanceRoutes);
app.use("/testimonials", testimonialRoutes);
app.use("/airport/booking", airportBookingRoutes);
// app.use("/admissions/booking", admissionBookingRoutes);
app.use("/exams", cscExamRoutes);
app.use("/scholarships", scholarshipRoutes);
app.use("/enquiries", enquiryRoutes);
app.use("/bookings", serviceRoutes);
app.use("/main/services", ServiceMainRoutes);
app.use("/frequent/question", faqRoutes);
app.use("/newsletter", newsletterRoutes);
app.use("/csce", CSCEBookingRoutes);
app.use("/blogs", blogRoutes);
app.use("/comments", commentRoutes);
// app.use("/bookings", bookingRoutes);
app.use("/notifications", notificationRoutes);
app.use("/visas/bookings", visaRoutes);
app.use("/accomodations", accommodationRoutes);
app.use("/accomodations/booking", accomodationBookingRoutes);
app.use("/scholarships/create", createScholarshipRoutes);
app.use("/admissions", admissionRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to Ruziga API",
    version: "1.0.0",
  });
});

/* =======================
   404 HANDLER
======================= */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`,
  });
});

/* =======================
   GLOBAL ERROR HANDLER
======================= */

app.use((err, req, res, next) => {
  console.error("🔥 ERROR:", err.message);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

/* =======================
   SERVER START (FIXED)
======================= */

/* =======================
   ADMIN EMAIL NOTIFICATION
======================= */

const sendAdminStartupEmail = async () => {
  try {
    if (
      !process.env.ADMIN_EMAIL ||
      !process.env.SMTP_USER ||
      !process.env.SMTP_PASS
    ) {
      console.log("⚠️ Email credentials not configured");
      return;
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: `"Ruziga API" <${process.env.SMTP_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: "🚀 Server Started Successfully",
      html: `
        <h2>✅ Server Status Notification</h2>
        <p>Your API server has started successfully.</p>
        <p><b>Time:</b> ${new Date().toISOString()}</p>
        <p><b>Environment:</b> ${process.env.NODE_ENV || "development"}</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("📧 Admin startup email sent successfully");
  } catch (error) {
    console.error("❌ Failed to send admin email:", error.message);
  }
};

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB(); // ✅ CRITICAL FIX

  const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });

  /* =======================
     GRACEFUL SHUTDOWN
  ======================= */

  const shutdown = async () => {
    server.close(() => {
      console.log("✅ HTTP server closed");
    });

    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log("✅ MongoDB connection closed");
      // Send admin notification
      await sendAdminStartupEmail();
    }

    process.exit(0);
  };

  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
};

startServer();

console.log("✅ Server initialization complete");
