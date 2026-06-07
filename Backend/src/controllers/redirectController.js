// src/controllers/redirectController.js
const urlService = require('../services/urlService');
const analyticsService = require('../services/analyticsService');
const logger = require('../utils/logger');

class RedirectController {
    /**
     * GET /:shortCode
     * The most critical endpoint - must be sub-50ms
     * Will implement caching in Phase 6
     */
    async redirect(req, res, next) {
        try {
            const { shortCode } = req.params;

            // Get URL (will be cached in Phase 6)
            const url = await urlService.getURLByShortCode(shortCode);

            // Increment clicks asynchronously (Phase 8 with BullMQ)
            // For now, do it synchronously but in background
            // Track analytics asynchronously (Phase 8 with BullMQ)
            analyticsService.trackClick(shortCode, req).catch(err => {
                logger.error(`Analytics tracking error: ${err.message}`);
            });


            // Redirect with 301 (permanent) or 302 (temporary)
            // 302 allows us to change destination later
            res.redirect(302, url.originalUrl);

            logger.info(`Redirect: ${shortCode} -> ${url.originalUrl}`);
        } catch (error) {
            // Detailed 404 handling
            if (error.message === 'Short URL not found') {
                return res.status(404).json({
                    success: false,
                    message: 'Short URL not found'
                });
            }
            next(error);
        }
    }
}

module.exports = new RedirectController();