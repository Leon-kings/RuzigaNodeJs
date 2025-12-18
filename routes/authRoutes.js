const express = require('express');
const router = express.Router();
const userController = require('../controllers/authController');
const { body } = require('express-validator');
const authMiddleware = require('../middlewares/auth');
const adminMiddleware = require('../middlewares/admin');

// ==================== AUTHENTICATION ROUTES ====================

// Public routes
router.post('/register', [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('phone').optional().isMobilePhone().withMessage('Valid phone number is required'),
  body('role').optional().isIn(['user', 'admin']).withMessage('Invalid role')
], userController.register);

router.post('/login', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
], userController.login);

router.get('/verify-email', userController.verifyEmail);
router.post('/request-password-reset', userController.requestPasswordReset);
router.post('/reset-password', userController.resetPassword);
router.get('/health', userController.checkSystemHealth);

// Protected routes (require authentication)
router.get('/profile', authMiddleware, userController.getCurrentUser);
router.put('/profile', authMiddleware, userController.updateProfile);
router.post('/change-password', authMiddleware, userController.changePassword);
router.delete('/account', authMiddleware, userController.deleteAccount);
router.post('/logout', authMiddleware, userController.logout);
router.post('/refresh-token', authMiddleware, userController.refreshToken);

// ==================== ADMIN ROUTES ====================

// User management (Admin only)
router.get('/',  userController.getAllUsers);
router.post('/bulk', authMiddleware, adminMiddleware, [
  body('users').isArray().withMessage('Users must be an array'),
  body('users.*.name').notEmpty().withMessage('Name is required for each user'),
  body('users.*.email').isEmail().withMessage('Valid email is required for each user'),
  body('users.*.password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters for each user'),
  body('users.*.role').optional().isIn(['user', 'admin']).withMessage('Invalid role')
], userController.createMultipleUsers);

router.get('/statistics',  userController.getUserStatistics);
router.get('/search', authMiddleware, adminMiddleware, userController.searchUsers);

// Single user operations (Admin only)
router.get('/:id', authMiddleware, adminMiddleware, userController.getUserById);
router.put('/:id', authMiddleware, adminMiddleware, [
  body('email').optional().isEmail().withMessage('Valid email is required'),
  body('role').optional().isIn(['user', 'admin']).withMessage('Invalid role'),
  body('isVerified').optional().isBoolean().withMessage('isVerified must be a boolean')
], userController.updateUserById);
router.delete('/:id', authMiddleware, adminMiddleware, userController.deleteUserById);
router.delete('/', authMiddleware, adminMiddleware, [
  body('userIds').isArray().withMessage('userIds must be an array')
], userController.deleteMultipleUsers);

module.exports = router;