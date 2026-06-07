// src/routes/auth.routes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const validation = require('../middleware/validation');
const { protect } = require('../middleware/auth.middleware');

// Public routes
router.post('/register', validation.validateRegister, authController.register);
router.post('/login', validation.validateLogin, authController.login);
router.post('/verify-email', authController.verifyEmail);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.post('/refresh', authController.refreshToken);

// Protected routes
router.get('/me', protect, authController.getCurrentUser);
router.post('/logout', protect, authController.logout);

module.exports = router;