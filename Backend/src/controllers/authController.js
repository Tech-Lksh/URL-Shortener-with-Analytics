// src/controllers/authController.js
const authService = require('../services/authService');
const emailService = require('../services/emailService');
const logger = require('../utils/logger');
const config = require('../config/environment');

class AuthController {
    /**
     * POST /api/v1/auth/register
     */
    async register(req, res, next) {
        try {
            const { email, password, passwordConfirm, firstName, lastName } = req.body;

            // Validate input
            if (!email || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Please provide email and password'
                });
            }

            if (password !== passwordConfirm) {
                return res.status(400).json({
                    success: false,
                    message: 'Passwords do not match'
                });
            }

            // Register user
            const { user, verificationToken } = await authService.register(
                email,
                password,
                firstName,
                lastName
            );

            // Send verification email (implement in Phase 5)
            try {
                const verificationUrl = `${config.DOMAIN}/api/v1/auth/verify-email?token=${verificationToken}`;
                if (config.NODE_ENV === 'development') {
                    logger.info(`[DEV ONLY] Verification Token for ${user.email}: ${verificationToken}`);
                }
                // await emailService.sendVerificationEmail(user.email, verificationUrl);
            } catch (error) {
                logger.error(`Email sending failed: ${error.message}`);
            }

            res.status(201).json({
                success: true,
                data: {
                    userId: user._id,
                    email: user.email,
                    message: 'Verification email sent to your inbox',
                    ...(config.NODE_ENV === 'development' && { _devVerificationToken: verificationToken })
                }
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * POST /api/v1/auth/login
     */
    async login(req, res, next) {
        try {
            const { email, password } = req.body;

            // Login
            const { user, accessToken, refreshToken } = await authService.login(email, password);

            // Set refresh token as HTTP-only cookie (Phase 7)
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: config.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });

            res.status(200).json({
                success: true,
                data: {
                    user: {
                        id: user._id,
                        email: user.email,
                        firstName: user.firstName,
                        lastName: user.lastName
                    },
                    accessToken,
                    refreshToken
                }
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * POST /api/v1/auth/verify-email
     */
    async verifyEmail(req, res, next) {
        try {
            const { token } = req.body;

            if (!token) {
                return res.status(400).json({
                    success: false,
                    message: 'Verification token is required'
                });
            }

            const user = await authService.verifyEmail(token);

            res.status(200).json({
                success: true,
                message: 'Email verified successfully',
                data: {
                    user: {
                        id: user._id,
                        email: user.email
                    }
                }
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * POST /api/v1/auth/forgot-password
     */
    async forgotPassword(req, res, next) {
        try {
            const { email } = req.body;

            if (!email) {
                return res.status(400).json({
                    success: false,
                    message: 'Please provide an email'
                });
            }

            const resetToken = await authService.forgotPassword(email);

            // Send reset email (implement in Phase 5)
            const resetUrl = `${config.DOMAIN}/reset-password?token=${resetToken}`;
            if (config.NODE_ENV === 'development') {
                logger.info(`[DEV ONLY] Reset Token for ${email}: ${resetToken}`);
            }
            // await emailService.sendPasswordResetEmail(email, resetUrl);

            res.status(200).json({
                success: true,
                message: 'Password reset link sent to your email',
                ...(config.NODE_ENV === 'development' && { _devResetToken: resetToken })
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * POST /api/v1/auth/reset-password
     */
    async resetPassword(req, res, next) {
        try {
            const { token, newPassword, passwordConfirm } = req.body;

            if (!token || !newPassword) {
                return res.status(400).json({
                    success: false,
                    message: 'Token and new password are required'
                });
            }

            if (newPassword !== passwordConfirm) {
                return res.status(400).json({
                    success: false,
                    message: 'Passwords do not match'
                });
            }

            const user = await authService.resetPassword(token, newPassword);

            res.status(200).json({
                success: true,
                message: 'Password reset successfully',
                data: {
                    user: {
                        id: user._id,
                        email: user.email
                    }
                }
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * POST /api/v1/auth/refresh
     */
    async refreshToken(req, res, next) {
        try {
            const { refreshToken } = req.body;

            if (!refreshToken) {
                return res.status(400).json({
                    success: false,
                    message: 'Refresh token is required'
                });
            }

            const tokens = await authService.refreshAccessToken(refreshToken);

            res.status(200).json({
                success: true,
                data: tokens
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * GET /api/v1/auth/me
     */
    async getCurrentUser(req, res, next) {
        try {
            res.status(200).json({
                success: true,
                data: {
                    user: {
                        id: req.user._id,
                        email: req.user.email,
                        firstName: req.user.firstName,
                        lastName: req.user.lastName,
                        isEmailVerified: req.user.isEmailVerified,
                        createdAt: req.user.createdAt
                    }
                }
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * POST /api/v1/auth/logout
     */
    async logout(req, res, next) {
        try {
            // Clear refresh token cookie
            res.clearCookie('refreshToken');

            res.status(200).json({
                success: true,
                message: 'Logged out successfully'
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new AuthController();