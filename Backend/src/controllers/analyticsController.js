// src/controllers/analyticsController.js
const analyticsService = require('../services/analyticsService');
const URL = require('../models/URL');

class AnalyticsController {
    /**
     * GET /api/v1/analytics/:shortCode
     * Get complete analytics for a URL
     */
    async getAnalytics(req, res, next) {
        try {
            const { shortCode } = req.params;
            const userId = req.user?._id;

            // Get URL and check authorization
            const url = await URL.findOne({ shortCode });
            if (!url) {
                return res.status(404).json({
                    success: false,
                    message: 'URL not found'
                });
            }

            if (url.userId && url.userId.toString() !== userId?.toString()) {
                return res.status(403).json({
                    success: false,
                    message: 'Not authorized to view analytics'
                });
            }

            // Get all analytics data
            const [summary, timeline, geographic, devices, browsers, os, logs] = await Promise.all([
                analyticsService.getAnalyticsSummary(url._id),
                analyticsService.getTimelineAnalytics(url._id, 'day'),
                analyticsService.getGeographicAnalytics(url._id),
                analyticsService.getDeviceAnalytics(url._id),
                analyticsService.getBrowserAnalytics(url._id),
                analyticsService.getOSAnalytics(url._id),
                analyticsService.getRecentClicks(url._id, 100)
            ]);

            res.status(200).json({
                success: true,
                data: {
                    summary,
                    timeline,
                    geographic,
                    devices,
                    browsers,
                    os,
                    logs
                }
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * GET /api/v1/analytics/:shortCode/timeline
     */
    async getTimeline(req, res, next) {
        try {
            const { shortCode } = req.params;
            const { timeframe = 'day' } = req.query;
            const userId = req.user?._id;

            const url = await URL.findOne({ shortCode });
            if (!url) {
                return res.status(404).json({
                    success: false,
                    message: 'URL not found'
                });
            }

            if (url.userId && url.userId.toString() !== userId?.toString()) {
                return res.status(403).json({
                    success: false,
                    message: 'Not authorized to view analytics'
                });
            }

            const timeline = await analyticsService.getTimelineAnalytics(url._id, timeframe);

            res.status(200).json({
                success: true,
                data: timeline
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * GET /api/v1/analytics/:shortCode/geographic
     */
    async getGeographic(req, res, next) {
        try {
            const { shortCode } = req.params;
            const userId = req.user?._id;

            const url = await URL.findOne({ shortCode });
            if (!url) {
                return res.status(404).json({
                    success: false,
                    message: 'URL not found'
                });
            }

            if (url.userId && url.userId.toString() !== userId?.toString()) {
                return res.status(403).json({
                    success: false,
                    message: 'Not authorized to view analytics'
                });
            }

            const geographic = await analyticsService.getGeographicAnalytics(url._id);

            res.status(200).json({
                success: true,
                data: geographic
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new AnalyticsController();