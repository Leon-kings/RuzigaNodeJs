
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const helmet = require('helmet');
// require('dotenv').config();

// // Routes
// const authRoutes = require('./routes/authRoutes');
// const statisticsRoutes = require('./routes/statisticsRoutes');
// const contactRoutes = require('./routes/contactRoutes');
// const pageViewRoutes = require('./routes/pageViewRoutes');
// const assistanceRoutes = require('./routes/assistanceRoutes');
// const testimonialRoutes = require('./routes/testimonialRoutes');

// const app = express();

// /* =======================
//    GLOBAL MIDDLEWARE
// ======================= */
// app.use(helmet());
// app.use(cors({
//   origin: process.env.FRONTEND_URL || "http://localhost:5173/",
//   credentials: true,
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization"]
// }));

// app.options("/*", cors());

// app.use(express.json({ limit: '10kb' }));
// app.use(express.urlencoded({ extended: true }));

// /* =======================
//    DATABASE CONNECTION (IMPROVED)
// ======================= */
// const connectDB = async () => {
//   try {
//     if (!process.env.MONGODB_URI) {
//       console.error('❌ MONGODB_URI is not defined in .env file');
//       console.log('⚠️ Please add MONGODB_URI to your .env file');
//       // Create a mock database connection for testing
//       console.log('⚠️ Running without database connection');
//       return false;
//     }

//     await mongoose.connect(process.env.MONGODB_URI);
//     console.log('✅ MongoDB connected successfully');
//     console.log(`📊 Database: ${mongoose.connection.db.databaseName}`);
//     console.log(`👤 Host: ${mongoose.connection.host}`);
//     return true;
//   } catch (error) {
//     console.error('❌ MongoDB connection failed:', error.message);
    
//     // Check specific error types
//     if (error.name === 'MongooseServerSelectionError') {
//       console.log('🔍 Troubleshooting steps:');
//       console.log('1. Make sure MongoDB is running:');
//       console.log('   Windows: net start MongoDB');
//       console.log('   Mac/Linux: brew services start mongodb-community');
//       console.log('2. Check if MongoDB is installed');
//       console.log('3. Verify the MONGODB_URI in .env file');
//     }
    
//     // Don't exit in development - allow testing without DB
//     if (process.env.NODE_ENV === 'production') {
//       console.log('🛑 Exiting due to database connection failure');
//       process.exit(1);
//     } else {
//       console.log('⚠️ Development mode: Continuing without database');
//       return false;
//     }
//   }
// };

// // Initialize database connection
// connectDB();

// // Monitor connection events
// mongoose.connection.on('connected', () => {
//   console.log('✅ Mongoose connected to MongoDB');
// });

// mongoose.connection.on('error', (err) => {
//   console.error('❌ Mongoose connection error:', err.message);
// });

// mongoose.connection.on('disconnected', () => {
//   console.log('⚠️ Mongoose disconnected from MongoDB');
// });

// /* =======================
//    HEALTH CHECK ENDPOINTS
// ======================= */

// // Simple health check
// app.get('/health', (req, res) => {
//   const health = {
//     status: 'OK',
//     timestamp: new Date().toISOString(),
//     service: 'Ruziga API',
//     version: '1.0.0',
//     environment: process.env.NODE_ENV || 'development'
//   };
  
//   res.status(200).json(health);
// });

// // Detailed system health check
// app.get('/health/detailed', async (req, res) => {
//   try {
//     const health = {
//       status: 'healthy',
//       timestamp: new Date().toISOString(),
//       uptime: process.uptime(),
//       services: {
//         database: 'unhealthy',
//         email: 'unhealthy',
//         api: 'healthy'
//       },
//       environment: process.env.NODE_ENV || 'development'
//     };

//     // Check database
//     try {
//       if (mongoose.connection.readyState === 1) {
//         await mongoose.connection.db.admin().ping();
//         health.services.database = 'healthy';
//       } else {
//         health.services.database = 'unhealthy';
//         health.status = 'degraded';
//         health.databaseState = mongoose.connection.readyState;
//         health.databaseStates = {
//           0: 'disconnected',
//           1: 'connected',
//           2: 'connecting',
//           3: 'disconnecting'
//         };
//       }
//     } catch (dbError) {
//       health.services.database = 'unhealthy';
//       health.status = 'degraded';
//       health.databaseError = dbError.message;
//     }

//     // Check email configuration
//     if (process.env.SMTP_HOST && process.env.SMTP_USER) {
//       health.services.email = 'configured';
//     } else {
//       health.services.email = 'unconfigured';
//       health.status = 'degraded';
//     }

//     res.status(health.status === 'healthy' ? 200 : 503).json(health);
//   } catch (error) {
//     res.status(500).json({
//       status: 'unhealthy',
//       message: 'Health check failed',
//       error: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   }
// });

// // Test endpoint for debugging
// app.get('/debug', (req, res) => {
//   const debugInfo = {
//     timestamp: new Date().toISOString(),
//     nodeVersion: process.version,
//     platform: process.platform,
//     environment: process.env.NODE_ENV || 'development',
//     database: {
//       MONGODB_URI: process.env.MONGODB_URI ? 'Set' : 'Not set',
//       mongooseState: mongoose.connection.readyState,
//       stateDescription: {
//         0: 'disconnected',
//         1: 'connected',
//         2: 'connecting',
//         3: 'disconnecting'
//       }[mongoose.connection.readyState]
//     },
//     email: {
//       SMTP_HOST: process.env.SMTP_HOST ? 'Set' : 'Not set',
//       SMTP_USER: process.env.SMTP_USER ? 'Set' : 'Not set',
//       SMTP_PASS: process.env.SMTP_PASS ? 'Set' : 'Not set'
//     },
//     server: {
//       port: process.env.PORT || 5000,
//       frontendUrl: process.env.FRONTEND_URL || 'Not set'
//     },
//     flags: {
//       SKIP_EMAILS: process.env.SKIP_EMAILS || 'Not set',
//       NODE_ENV: process.env.NODE_ENV || 'development'
//     }
//   };
  
//   res.json(debugInfo);
// });

// /* =======================
//    API ROUTES
// ======================= */
// app.use('/auth', authRoutes);
// app.use('/statistics', statisticsRoutes);
// app.use('/contacts', contactRoutes);
// app.use('/page/views', pageViewRoutes);
// app.use('/assistance', assistanceRoutes);
// app.use('/testimonials', testimonialRoutes);

// // Welcome route
// app.get('/', (req, res) => {
//   res.json({
//     message: 'Welcome to Ruziga API',
//     version: '1.0.0',
//     documentation: 'Available at /api-docs',
//     endpoints: {
//       auth: '/auth',
//       statistics: '/statistics',
//       contacts: '/contacts',
//       pageViews: '/page/views',
//       assistance: '/assistance',
//       testimonials: '/testimonials'
//     },
//     health: {
//       simple: '/health',
//       detailed: '/health/detailed',
//       debug: '/debug'
//     }
//   });
// });

// /* =======================
//    404 HANDLER
// ======================= */
// app.use((req, res, next) => {
//   res.status(404).json({
//     success: false,
//     message: `Route not found: ${req.originalUrl}`,
//     timestamp: new Date().toISOString()
//   });
// });

// /* =======================
//    GLOBAL ERROR HANDLER (UPGRADED)
// ======================= */
// app.use((err, req, res, next) => {
//   const statusCode = err.statusCode || 500;
  
//   // Log full error in development
//   console.error('🔥 ERROR:', {
//     message: err.message,
//     stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
//     path: req.path,
//     method: req.method,
//     body: req.body,
//     query: req.query,
//     timestamp: new Date().toISOString()
//   });

//   // Mongoose bad ObjectId
//   if (err.name === 'CastError') {
//     return res.status(400).json({
//       success: false,
//       message: 'Invalid ID format',
//       error: err.message
//     });
//   }

//   // Mongoose duplicate key
//   if (err.code === 11000) {
//     const field = Object.keys(err.keyValue)[0];
//     const value = err.keyValue[field];
//     return res.status(409).json({
//       success: false,
//       message: `Duplicate value detected`,
//       error: `${field} '${value}' already exists`
//     });
//   }

//   // Validation errors
//   if (err.name === 'ValidationError') {
//     const errors = Object.values(err.errors).map(e => ({
//       field: e.path,
//       message: e.message
//     }));
    
//     return res.status(400).json({
//       success: false,
//       message: 'Validation failed',
//       errors: errors
//     });
//   }

//   // JWT errors
//   if (err.name === 'JsonWebTokenError') {
//     return res.status(401).json({
//       success: false,
//       message: 'Invalid token',
//       error: 'Please provide a valid authentication token'
//     });
//   }

//   if (err.name === 'TokenExpiredError') {
//     return res.status(401).json({
//       success: false,
//       message: 'Token expired',
//       error: 'Your session has expired. Please login again.'
//     });
//   }

//   // Default error response
//   const errorResponse = {
//     success: false,
//     message: err.message || 'Internal Server Error',
//     timestamp: new Date().toISOString()
//   };

//   // Include stack trace in development
//   if (process.env.NODE_ENV === 'development') {
//     errorResponse.stack = err.stack;
//     errorResponse.details = err;
//   }

//   res.status(statusCode).json(errorResponse);
// });

// /* =======================
//    SERVER START
// ======================= */
// const PORT = process.env.PORT || 5000;
// const server = app.listen(PORT, () => {
//   console.log('='.repeat(50));
//   console.log(`🚀 Server running on port ${PORT}`);
//   console.log(`📁 Environment: ${process.env.NODE_ENV || 'development'}`);
//   console.log(`🔗 Local: http://localhost:${PORT}`);
//   console.log('📋 Available endpoints:');
//   console.log(`   📍 Home: http://localhost:${PORT}/`);
//   console.log(`   🔧 Health: http://localhost:${PORT}/health`);
//   console.log(`   🐛 Debug: http://localhost:${PORT}/debug`);
//   console.log(`   👤 Auth: http://localhost:${PORT}/auth`);
//   console.log('='.repeat(50));
  
//   // Log configuration status
//   console.log('\n🔧 Configuration Status:');
//   console.log(`   📊 Database: ${process.env.MONGODB_URI ? '✅ Configured' : '❌ Not configured'}`);
//   console.log(`   📧 Email: ${process.env.SMTP_HOST ? '✅ Configured' : '❌ Not configured'}`);
//   console.log(`   🔐 JWT: ${process.env.JWT_SECRET ? '✅ Configured' : '❌ Not configured'}`);
//   console.log(`   🚫 Skip Emails: ${process.env.SKIP_EMAILS === 'true' ? '✅ Active' : '❌ Inactive'}`);
// });

// /* =======================
//    GRACEFUL SHUTDOWN
// ======================= */
// const shutdown = async (signal) => {
//   console.log(`\n${signal} received. Shutting down gracefully...`);
  
//   // Close server
//   server.close(() => {
//     console.log('✅ HTTP server closed');
//   });
  
//   // Close database connection
//   if (mongoose.connection.readyState === 1) {
//     try {
//       await mongoose.connection.close();
//       console.log('✅ MongoDB connection closed');
//     } catch (err) {
//       console.error('❌ Error closing MongoDB connection:', err.message);
//     }
//   }
  
//   // Exit process
//   setTimeout(() => {
//     console.log('👋 Shutdown complete');
//     process.exit(0);
//   }, 1000);
// };

// // Handle different shutdown signals
// process.on('SIGTERM', () => shutdown('SIGTERM'));
// process.on('SIGINT', () => shutdown('SIGINT'));

// // Handle unhandled promise rejections
// process.on('unhandledRejection', (err) => {
//   console.error('❌ Unhandled Rejection:', err.message);
//   console.error(err.stack);
// });

// // Handle uncaught exceptions
// process.on('uncaughtException', (err) => {
//   console.error('❌ Uncaught Exception:', err.message);
//   console.error(err.stack);
//   process.exit(1);
// });

// // Log startup completion
// console.log('✅ Server initialization complete');



const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

// Routes
const authRoutes = require('./routes/authRoutes');
const statisticsRoutes = require('./routes/statisticsRoutes');
const contactRoutes = require('./routes/contactRoutes');
const pageViewRoutes = require('./routes/pageViewRoutes');
const assistanceRoutes = require('./routes/assistanceRoutes');
const testimonialRoutes = require('./routes/testimonialRoutes');

const app = express();

/* =======================
   GLOBAL MIDDLEWARE
======================= */
app.use(helmet());

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));


app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

/* =======================
   DATABASE CONNECTION
======================= */
const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.error('❌ MONGODB_URI is not defined in .env file');
      console.log('⚠️ Running without database connection');
      return false;
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected successfully');
    console.log(`📊 Database: ${mongoose.connection.db.databaseName}`);
    console.log(`👤 Host: ${mongoose.connection.host}`);
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);

    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    } else {
      console.log('⚠️ Development mode: Continuing without database');
      return false;
    }
  }
};

connectDB();

mongoose.connection.on('connected', () => {
  console.log('✅ Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose connection error:', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ Mongoose disconnected from MongoDB');
});

/* =======================
   HEALTH CHECKS
======================= */
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'Ruziga API',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

app.get('/health/detailed', async (req, res) => {
  try {
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      services: {
        database: mongoose.connection.readyState === 1 ? 'healthy' : 'unhealthy',
        api: 'healthy'
      }
    };

    res.status(200).json(health);
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      message: 'Health check failed'
    });
  }
});

app.get('/debug', (req, res) => {
  res.json({
    timestamp: new Date().toISOString(),
    nodeVersion: process.version,
    environment: process.env.NODE_ENV || 'development',
    databaseConnected: mongoose.connection.readyState === 1,
    frontendUrl: process.env.FRONTEND_URL || 'Not set'
  });
});

/* =======================
   API ROUTES
======================= */
app.use('/auth', authRoutes);
app.use('/statistics', statisticsRoutes);
app.use('/contacts', contactRoutes);
app.use('/page/views', pageViewRoutes);
app.use('/assistance', assistanceRoutes);
app.use('/testimonials', testimonialRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Ruziga API',
    version: '1.0.0'
  });
});

/* =======================
   404 HANDLER
======================= */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`
  });
});

/* =======================
   GLOBAL ERROR HANDLER
======================= */
app.use((err, req, res, next) => {
  console.error('🔥 ERROR:', err.message);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
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
const shutdown = async () => {
  server.close(() => {
    console.log('✅ HTTP server closed');
  });

  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.close();
    console.log('✅ MongoDB connection closed');
  }

  process.exit(0);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

console.log('✅ Server initialization complete');
