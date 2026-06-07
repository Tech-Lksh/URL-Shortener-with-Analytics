// src/middleware/auth.middleware.js
const jwt = require('jsonwebtoken');
const config = require('../config/environment');
const User = require('../models/User');
const logger = require('../utils/logger');

/**
 * Verify JWT token and attach user to request
 */
const protect = async (req, res, next) => {
    try {
        // Get token from header
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to access this route'
            });
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, config.JWT_SECRET);
            req.user = { id: decoded.userId };

            // Optionally fetch full user data
            const user = await User.findById(decoded.userId);
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'User not found'
                });
            }

            req.user = user;
            next();
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({
                    success: false,
                    message: 'Token expired. Please refresh.'
                });
            }
            return res.status(401).json({
                success: false,
                message: 'Invalid token'
            });
        }
    } catch (error) {
        logger.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

/**
 * Optional auth - doesn't fail if no token
 */
const optionalAuth = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (token) {
            const decoded = jwt.verify(token, config.JWT_SECRET);
            const user = await User.findById(decoded.userId);
            if (user) req.user = user;
        }
    } catch (error) {
        // Silently fail - user is optional
    }
    next();
};

module.exports = {
    protect,
    optionalAuth
};