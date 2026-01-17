// const express = require('express');
// const router = express.Router();
// const userController = require('../controllers/authController');
// const { body } = require('express-validator');
// const authMiddleware = require('../middlewares/auth');
// const adminMiddleware = require('../middlewares/admin');

// // ==================== PUBLIC ROUTES ====================

// // Register
// router.post('/register', [
//   body('name').notEmpty().trim().withMessage('Name is required'),
//   body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
//   body('password')
//     .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
//   body('phone').optional().isMobilePhone().withMessage('Valid phone number is required'),
//   body('confirmPassword').optional().custom((value, { req }) => {
//     if (value !== req.body.password) {
//       throw new Error('Passwords do not match');
//     }
//     return true;
//   }),
//   body('role').optional().isIn(['user', 'admin']).withMessage('Invalid role')
// ], userController.register);

// // Login
// router.post('/login', [
//   body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
//   body('password').notEmpty().withMessage('Password is required')
// ], userController.login);

// // Email verification
// router.get('/verify-email', userController.verifyEmail);

// // Password reset
// router.post('/request-password-reset', [
//   body('email').isEmail().normalizeEmail().withMessage('Valid email is required')
// ], userController.requestPasswordReset);

// router.post('/reset-password', [
//   body('token').notEmpty().withMessage('Token is required'),
//   body('newPassword')
//     .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
// ], userController.resetPassword);

// // Health check
// router.get('/health', userController.checkSystemHealth);

// // Test system endpoint
// router.get('/test-system', userController.testSystem);

// // ==================== AUTHENTICATED ROUTES ====================

// // User profile
// router.get('/profile', userController.getCurrentUser);
// router.put('/profile', [
//   body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
//   body('phone').optional().isMobilePhone().withMessage('Valid phone number is required')
// ], userController.updateProfile);

// // Password change
// router.post('/change-password', [
//   body('currentPassword').notEmpty().withMessage('Current password is required'),
//   body('newPassword')
//     .isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
//   body('confirmPassword').custom((value, { req }) => {
//     if (value !== req.body.newPassword) {
//       throw new Error('New passwords do not match');
//     }
//     return true;
//   })
// ], userController.changePassword);

// // Account management
// router.delete('/account', userController.deleteAccount);
// router.post('/logout', userController.logout);
// router.post('/refresh-token', userController.refreshToken);

// // ==================== ADMIN ROUTES ====================

// // Get all users (accessible to all authenticated users)
// router.get('/', userController.getAllUsers);

// // Bulk create users (Admin only)
// router.post('/bulk', [
//   body('users').isArray({ min: 1 }).withMessage('Users must be a non-empty array'),
//   body('users.*.name').notEmpty().trim().withMessage('Name is required for each user'),
//   body('users.*.email').isEmail().normalizeEmail().withMessage('Valid email is required for each user'),
//   body('users.*.password')
//     .isLength({ min: 6 }).withMessage('Password must be at least 6 characters for each user'),
//   body('users.*.role').optional().isIn(['user', 'admin']).withMessage('Invalid role')
// ], userController.createMultipleUsers);

// // User statistics (Admin only)
// router.get('/statistics', userController.getUserStatistics);

// // Search users (Authenticated users can search)
// router.get('/search', userController.searchUsers);

// // Single user operations (Admin only)
// router.get('/:id', userController.getUserById);
// router.put('/:id', [
//   body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
//   body('email').optional().isEmail().normalizeEmail().withMessage('Valid email is required'),
//   body('phone').optional().isMobilePhone().withMessage('Valid phone number is required'),
//   body('role').optional().isIn(['user', 'admin']).withMessage('Invalid role'),
//   body('isVerified').optional().isBoolean().withMessage('isVerified must be a boolean')
// ], userController.updateUserById);

// // Delete user (Admin only)
// router.delete('/:id', userController.deleteUserById);

// // Bulk delete (Admin only)
// router.delete('/', [
//   body('userIds').isArray({ min: 1 }).withMessage('userIds must be a non-empty array')
// ], userController.deleteMultipleUsers);

// module.exports = router;

const express = require("express");
const router = express.Router();
const userController = require("../controllers/authController");
const { body } = require("express-validator");
// const authMiddleware = require("../middlewares/auth");
// const adminMiddleware = require("../middlewares/admin");
const statisticsController = require('../controllers/statisticsController')

/* ==================== PUBLIC ROUTES ==================== */

// Register
router.post(
  "/register",
  [
    body("name").notEmpty().trim().withMessage("Name is required"),
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Valid email is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    body("phone")
      .optional()
      .isMobilePhone()
      .withMessage("Valid phone number is required"),
    body("confirmPassword")
      .optional()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Passwords do not match");
        }
        return true;
      }),
    body("role").optional().isIn(["user", "admin"]).withMessage("Invalid role"),
  ],
  userController.register
);

// Login
router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  userController.login
);

// Email verification
router.get("/verify-email", userController.verifyEmail);

// Password reset
router.post(
  "/request-password-reset",
  [
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Valid email is required"),
  ],
  userController.requestPasswordReset
);

router.post(
  "/reset-password",
  [
    body("token").notEmpty().withMessage("Token is required"),
    body("newPassword")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  userController.resetPassword
);

// Health & system checks
router.get("/health", userController.checkSystemHealth);
router.get("/test-system", userController.testSystem);

/* ==================== AUTHENTICATED ROUTES ==================== */

// Profile
router.get("/profile", userController.getCurrentUser);

router.put(
  "/profile",
  [
    body("name")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Name cannot be empty"),
    body("phone")
      .optional()
      .isMobilePhone()
      .withMessage("Valid phone number is required"),
  ],
  userController.updateProfile
);

// Password change
router.post(
  "/change-password",
  [
    body("currentPassword")
      .notEmpty()
      .withMessage("Current password is required"),
    body("newPassword")
      .isLength({ min: 6 })
      .withMessage("New password must be at least 6 characters"),
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error("New passwords do not match");
      }
      return true;
    }),
  ],
  userController.changePassword
);

// Logout
router.post("/logout", userController.logout);

// 🔑 Refresh token (NO authMiddleware)
router.post("/refresh-token", userController.refreshToken);

/* ==================== USER / ADMIN ROUTES ==================== */

// Search users (authenticated)
router.get("/search", userController.searchUsers);

// User statistics (Admin only)
router.get("/statistics", userController.getUserStatistics);

// Get all users (Admin only — FIXED)
router.get("/", userController.getAllUsers);

// Bulk create users (Admin only)
router.post(
  "/bulk",
  [
    body("users")
      .isArray({ min: 1 })
      .withMessage("Users must be a non-empty array"),
    body("users.*.name")
      .notEmpty()
      .trim()
      .withMessage("Name is required for each user"),
    body("users.*.email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Valid email is required for each user"),
    body("users.*.password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters for each user"),
    body("users.*.role")
      .optional()
      .isIn(["user", "admin"])
      .withMessage("Invalid role"),
  ],
  userController.createMultipleUsers
);
router.get('/summary', statisticsController.getStatisticsSummary);
router.get('/daily', statisticsController.getDailyStatistics);
router.get('/weekly', statisticsController.getWeeklyStatistics);
router.get('/monthly', statisticsController.getMonthlyStatistics);
router.get('/yearly', statisticsController.getYearlyStatistics);
router.get('/five-year', statisticsController.getFiveYearStatistics);

// Single user operations (Admin only) — KEEP LAST
router.get("/:id", userController.getUserById);
router.get("/:email", userController.getUserByEmail);

router.put(
  "/:id",
  [
    body("name")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Name cannot be empty"),
    body("email")
      .optional()
      .isEmail()
      .normalizeEmail()
      .withMessage("Valid email is required"),
    body("phone")
      .optional()
      .isMobilePhone()
      .withMessage("Valid phone number is required"),
    body("role").optional().isIn(["user", "admin"]).withMessage("Invalid role"),
    body("isVerified")
      .optional()
      .isBoolean()
      .withMessage("isVerified must be a boolean"),
  ],
  userController.updateUserById
);

router.delete("/:id", userController.deleteUserById);

// Bulk delete (Admin only)
router.delete(
  "/",
  [
    body("userIds")
      .isArray({ min: 1 })
      .withMessage("userIds must be a non-empty array"),
  ],
  userController.deleteMultipleUsers
);

module.exports = router;
