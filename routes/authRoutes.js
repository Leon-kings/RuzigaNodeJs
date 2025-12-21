const express = require('express');
const router = express.Router();
const userController = require('../controllers/authController');
const { body } = require('express-validator');
const authMiddleware = require('../middlewares/auth');
const adminMiddleware = require('../middlewares/admin');

// ==================== PUBLIC ROUTES ====================

// Register
router.post('/register', [
  body('name').notEmpty().trim().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('phone').optional().isMobilePhone().withMessage('Valid phone number is required'),
  body('confirmPassword').optional().custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Passwords do not match');
    }
    return true;
  }),
  body('role').optional().isIn(['user', 'admin']).withMessage('Invalid role')
], userController.register);

// Login
router.post('/login', [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
], userController.login);

// Email verification
router.get('/verify-email', userController.verifyEmail);

// Password reset
router.post('/request-password-reset', [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required')
], userController.requestPasswordReset);

router.post('/reset-password', [
  body('token').notEmpty().withMessage('Token is required'),
  body('newPassword')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], userController.resetPassword);

// Health check
router.get('/health', userController.checkSystemHealth);

// Test system endpoint
router.get('/test-system', userController.testSystem);

// ==================== AUTHENTICATED ROUTES ====================

// User profile
router.get('/profile', authMiddleware, userController.getCurrentUser);
router.put('/profile', authMiddleware, [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('phone').optional().isMobilePhone().withMessage('Valid phone number is required')
], userController.updateProfile);

// Password change
router.post('/change-password', authMiddleware, [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.newPassword) {
      throw new Error('New passwords do not match');
    }
    return true;
  })
], userController.changePassword);

// Account management
router.delete('/account', authMiddleware, userController.deleteAccount);
router.post('/logout', authMiddleware, userController.logout);
router.post('/refresh-token', authMiddleware, userController.refreshToken);

// ==================== ADMIN ROUTES ====================

// Get all users (accessible to all authenticated users)
router.get('/', authMiddleware, userController.getAllUsers);

// Bulk create users (Admin only)
router.post('/bulk', authMiddleware, adminMiddleware, [
  body('users').isArray({ min: 1 }).withMessage('Users must be a non-empty array'),
  body('users.*.name').notEmpty().trim().withMessage('Name is required for each user'),
  body('users.*.email').isEmail().normalizeEmail().withMessage('Valid email is required for each user'),
  body('users.*.password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters for each user'),
  body('users.*.role').optional().isIn(['user', 'admin']).withMessage('Invalid role')
], userController.createMultipleUsers);

// User statistics (Admin only)
router.get('/statistics', authMiddleware, adminMiddleware, userController.getUserStatistics);

// Search users (Authenticated users can search)
router.get('/search', authMiddleware, userController.searchUsers);

// Single user operations (Admin only)
router.get('/:id', authMiddleware, adminMiddleware, userController.getUserById);
router.put('/:id', authMiddleware, adminMiddleware, [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('email').optional().isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('phone').optional().isMobilePhone().withMessage('Valid phone number is required'),
  body('role').optional().isIn(['user', 'admin']).withMessage('Invalid role'),
  body('isVerified').optional().isBoolean().withMessage('isVerified must be a boolean')
], userController.updateUserById);

// Delete user (Admin only)
router.delete('/:id', authMiddleware, adminMiddleware, userController.deleteUserById);

// Bulk delete (Admin only)
router.delete('/', authMiddleware, adminMiddleware, [
  body('userIds').isArray({ min: 1 }).withMessage('userIds must be a non-empty array')
], userController.deleteMultipleUsers);

module.exports = router;