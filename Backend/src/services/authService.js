// src/services/authService.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const config = require('../config/environment');
const logger = require('../utils/logger');
const { ValidationError, UnauthorizedError, NotFoundError } = require('../utils/errorHandler');

class AuthService {
    /**
     * Generate JWT tokens
     */
    generateTokens(userId) {
        const accessToken = jwt.sign(
            { userId },
            config.JWT_SECRET,
            { expiresIn: '15m' } // Short-lived
        );

        const refreshToken = jwt.sign(
            { userId },
            config.JWT_SECRET + '_refresh',
            { expiresIn: '7d' } // Long-lived
        );

        return { accessToken, refreshToken };
    }

    /**
     * Verify JWT token
     */
    verifyToken(token, isRefresh = false) {
        try {
            const secret = isRefresh ? config.JWT_SECRET + '_refresh' : config.JWT_SECRET;
            return jwt.verify(token, secret);
        } catch (error) {
            throw new UnauthorizedError(`Invalid token: ${error.message}`);
        }
    }

    /**
     * Register new user
     */
    async register(email, password, firstName, lastName) {
        // Check if user exists
        let user = await User.findOne({ email });
        if (user) {
            throw new ValidationError('User already exists with this email');
        }

        // Create user
        user = new User({
            email,
            password,
            firstName,
            lastName
        });

        // Generate email verification token
        const verificationToken = user.generateEmailVerificationToken();
        await user.save();

        logger.info(`User registered: ${email}`);

        return {
            user,
            verificationToken // Return token for email service
        };
    }

    /**
     * Login user
     */
    async login(email, password) {
        // Validate input
        if (!email || !password) {
            throw new ValidationError('Please provide email and password');
        }

        // Find user and include password field
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            throw new ValidationError('Invalid credentials');
        }

        // Check if account is locked
        if (user.isLocked()) {
            throw new UnauthorizedError('Account is locked. Try again later');
        }

        // Check password
        const isPasswordCorrect = await user.matchPassword(password);
        if (!isPasswordCorrect) {
            await user.incLoginAttempts();
            throw new ValidationError('Invalid credentials');
        }

        // Reset login attempts on successful login
        await user.resetLoginAttempts();

        // Update last login
        user.lastLoginAt = new Date();
        await user.save();

        // Generate tokens
        const tokens = this.generateTokens(user._id);

        logger.info(`User logged in: ${email}`);

        return {
            user: user.toJSON(),
            ...tokens
        };
    }

    /**
     * Verify email
     */
    async verifyEmail(token) {
        // Hash token to find user
        const hashedToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        const user = await User.findOne({
            emailVerificationToken: hashedToken,
            emailVerificationExpires: { $gt: Date.now() }
        });

        if (!user) {
            throw new ValidationError('Invalid or expired verification token');
        }

        // Update user
        user.isEmailVerified = true;
        user.emailVerificationToken = undefined;
        user.emailVerificationExpires = undefined;
        await user.save();

        logger.info(`Email verified: ${user.email}`);

        return user;
    }

    /**
     * Request password reset
     */
    async forgotPassword(email) {
        const user = await User.findOne({ email });
        if (!user) {
            throw new NotFoundError('User');
        }

        // Generate reset token
        const resetToken = user.generatePasswordResetToken();
        await user.save();

        logger.info(`Password reset requested: ${email}`);

        return resetToken; // Return for email service
    }

    /**
     * Reset password
     */
    async resetPassword(token, newPassword) {
        // Hash token to find user
        const hashedToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        const user = await User.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() }
        });

        if (!user) {
            throw new ValidationError('Invalid or expired reset token');
        }

        // Update password
        user.password = newPassword;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        user.loginAttempts = 0;
        user.lockUntil = undefined;
        await user.save();

        logger.info(`Password reset: ${user.email}`);

        return user;
    }

    /**
     * Refresh access token
     */
    async refreshAccessToken(refreshToken) {
        const decoded = this.verifyToken(refreshToken, true);
        return this.generateTokens(decoded.userId);
    }
}

module.exports = new AuthService();