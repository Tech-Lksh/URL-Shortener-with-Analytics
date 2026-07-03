// src/app.js
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const logger = require('./src/utils/logger');

const urlRoutes = require('./src/routers/url.routes');
const redirectRoutes = require('./src/routers/redirect.routes');
const authRoutes = require('./src/routers/auth.routes');
const analyticsRoutes = require('./src/routers/analytics.routes');

const app = express();

// Security & Performance Middleware
app.use(helmet());
app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'https://url-shortener-with-analytics-eight.vercel.app'],
    credentials: true
}));
app.use(compression());

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Request logging
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.path}`);
    next();
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1', urlRoutes);
app.use('/api/v1', analyticsRoutes);
app.use('/', redirectRoutes); // Must be last

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Global error handler
app.use((error, req, res, next) => {
    logger.error(error);
    res.status(error.status || 500).json({
        success: false,
        message: error.message || 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
});

module.exports = app;