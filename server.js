const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

// Routes
const authRoutes = require('./routes/authRoutes');
const statisticsRoutes = require('./routes/statisticsRoutes');
const contactRoutes = require('./routes/contactRoutes');

const app = express();

/* =======================
   GLOBAL MIDDLEWARE
======================= */
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

/* =======================
   DATABASE CONNECTION
======================= */
(async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in .env');
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1); // stop app if DB fails
  }
})();
// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'Contact API'
  });
});
/* =======================
   ROUTES
======================= */
app.use('/auth', authRoutes);
app.use('/statistics', statisticsRoutes);
app.use('/contacts', contactRoutes);

/* =======================
   404 HANDLER
======================= */
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`,
  });
});

/* =======================
   GLOBAL ERROR HANDLER (UPGRADED)
======================= */
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  // Log full error in development
  if (process.env.NODE_ENV !== 'production') {
    console.error('🔥 ERROR:', err);
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format',
    });
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      message: `Duplicate value for ${Object.keys(err.keyValue).join(', ')}`,
    });
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: Object.values(err.errors).map(e => e.message),
    });
  }

  // Default error
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

/* =======================
   SERVER START
======================= */
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

/* =======================
   GRACEFUL SHUTDOWN
======================= */
process.on('unhandledRejection', err => {
  console.error('❌ Unhandled Rejection:', err.message);
  server.close(() => process.exit(1));
});

process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received. Shutting down gracefully...');
  server.close(() => process.exit(0));
});
