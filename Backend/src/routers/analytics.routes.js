// src/routes/analytics.routes.js
const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth.middleware');

router.get('/analytics/:shortCode', protect, analyticsController.getAnalytics);
router.get('/analytics/:shortCode/timeline', protect, analyticsController.getTimeline);
router.get('/analytics/:shortCode/geographic', protect, analyticsController.getGeographic);

module.exports = router;