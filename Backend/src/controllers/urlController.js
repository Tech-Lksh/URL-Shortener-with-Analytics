// src/controllers/urlController.js
const urlService = require('../services/urlService');
const UrlModel = require('../models/URL');
const AnalyticsModel = require('../models/Analytics');
const config = require('../config/environment');
const logger = require('../utils/logger');

class URLController {
    /**
     * POST /api/v1/shorten
     * Create shortened URL
     */
    async createShortenedURL(req, res, next) {
        try {
            const { originalUrl } = req.body;
            const userId = req.user ? req.user._id : null;

            if (!originalUrl) {
                return res.status(400).json({
                    success: false,
                    message: 'originalUrl is required'
                });
            }

            // Check rate limiting per user (max 100 URLs in last 24h)
            if (userId) {
                const userUrlsToday = await UrlModel.countDocuments({
                    userId,
                    createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
                });

                if (userUrlsToday >= 100) {
                    return res.status(429).json({
                        success: false,
                        message: 'Daily URL limit reached'
                    });
                }
            }

            // Call service
            const shortenedUrl = await urlService.shortenURL(
                originalUrl,
                userId
            );

            res.status(201).json({
                success: true,
                data: {
                    shortCode: shortenedUrl.shortCode,
                    shortUrl: `${config.DOMAIN}/${shortenedUrl.shortCode}`,
                    originalUrl: shortenedUrl.originalUrl,
                    createdAt: shortenedUrl.createdAt
                }
            });

            logger.info(`URL shortened: ${shortenedUrl.shortCode}`);
        } catch (error) {
            next(error);
        }
    }

    /**
     * GET /api/v1/my-urls
     * Get user URLs with pagination, sorting, filters, and search
     */
    async getUserURLs(req, res, next) {
        try {
            const userId = req.user._id;
            const {
                page = 1,
                limit = 10,
                sort,
                order,
                status,
                dateFrom,
                dateTo,
                tags,
                search
            } = req.query;

            // Formulate filters and sorting objects
            const filters = {};
            if (status) filters.status = status;
            if (dateFrom) filters.dateFrom = dateFrom;
            if (dateTo) filters.dateTo = dateTo;
            
            if (tags) {
                filters.tags = Array.isArray(tags) ? tags : [tags];
            }

            const sortOption = {
                by: sort,
                order: order
            };

            let response;
            if (search) {
                response = await urlService.searchURLs(userId, search, page, limit);
            } else {
                response = await urlService.getUserURLs(userId, page, limit, filters, sortOption);
            }

            // Map URLs to include shortUrl field
            const formattedData = response.data.map(url => ({
                ...url,
                shortUrl: `${config.DOMAIN}/${url.shortCode}`
            }));

            res.status(200).json({
                success: true,
                data: formattedData,
                pagination: response.pagination
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * PUT /api/v1/urls/:shortCode
     * Update URL title, description, tags, category, status
     */
    async updateURL(req, res, next) {
        try {
            const { shortCode } = req.params;
            const userId = req.user._id;
            const { title, description, tags, category, status } = req.body;

            const url = await urlService.updateURL(userId, shortCode, {
                title,
                description,
                tags,
                category,
                status
            });

            res.status(200).json({
                success: true,
                data: url
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * DELETE /api/v1/urls/:shortCode
     * Delete URL (soft delete by default, permanent optional)
     */
    async deleteURL(req, res, next) {
        try {
            const { shortCode } = req.params;
            const userId = req.user._id;
            const { permanent } = req.query;

            await urlService.deleteURL(userId, shortCode, permanent === 'true');

            res.status(200).json({
                success: true,
                message: permanent === 'true' ? 'URL permanently deleted' : 'URL moved to trash (soft deleted)'
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * POST /api/v1/urls/bulk-delete
     * Bulk delete URLs
     */
    async bulkDeleteURLs(req, res, next) {
        try {
            const userId = req.user._id;
            const { shortCodes, permanent } = req.body;

            if (!Array.isArray(shortCodes) || shortCodes.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'shortCodes array is required'
                });
            }

            if (shortCodes.length > 100) {
                return res.status(400).json({
                    success: false,
                    message: 'Maximum 100 URLs can be deleted at once'
                });
            }

            const result = await urlService.bulkDeleteURLs(
                userId,
                shortCodes,
                permanent === true
            );

            res.status(200).json({
                success: true,
                message: `${result.modifiedCount || result.deletedCount || 0} URLs deleted`,
                data: {
                    deletedCount: result.modifiedCount || result.deletedCount || 0
                }
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * GET /api/v1/urls/stats
     * Get URL analytics stats
     */
    async getURLStats(req, res, next) {
        try {
            const userId = req.user._id;
            const stats = await urlService.getURLStats(userId);

            res.status(200).json({
                success: true,
                data: stats
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * GET /api/v1/urls/export
     * Export all user URLs as JSON or CSV
     */
    async exportURLs(req, res, next) {
        try {
            const userId = req.user._id;
            const { format = 'json' } = req.query;

            // Fetch detailed click logs
            const records = await AnalyticsModel.find({ userId })
                .populate('urlId', 'originalUrl')
                .sort({ timestamp: -1 })
                .lean();

            // Filter out records where the URL has been permanently deleted
            const activeRecords = records.filter(record => record.urlId !== null && record.urlId !== undefined);

            if (format === 'csv') {
                const csv = URLController.convertToCSV(activeRecords);
                res.setHeader('Content-Type', 'text/csv');
                res.setHeader('Content-Disposition', 'attachment; filename="analytics_export.csv"');
                return res.status(200).send(csv);
            } else {
                const formattedRecords = activeRecords.map(record => ({
                    ...record,
                    originalUrl: record.urlId?.originalUrl || ''
                }));
                res.setHeader('Content-Type', 'application/json');
                res.setHeader('Content-Disposition', 'attachment; filename="analytics_export.json"');
                return res.status(200).json(formattedRecords);
            }
        } catch (error) {
            next(error);
        }
    }

    /**
     * Helper to convert data to CSV
     */
    static convertToCSV(data) {
        if (!data || data.length === 0) return '';

        const headers = [
            'Short Code',
            'Original URL',
            'Timestamp',
            'Visitor ID',
            'IP Address',
            'User Agent',
            'Referrer',
            'Country',
            'City',
            'Timezone',
            'Latitude',
            'Longitude',
            'ISP',
            'Device Type',
            'Device Brand',
            'Device Model',
            'OS Type',
            'OS Version',
            'Browser Name',
            'Browser Version',
            'Browser Language',
            'Screen Width',
            'Screen Height',
            'Screen Resolution',
            'Is Robot',
            'Bot Name',
            'UTM Source',
            'UTM Medium',
            'UTM Campaign',
            'UTM Content',
            'UTM Term',
            'Hour',
            'Day',
            'Month',
            'Year'
        ];

        const csvContent = [
            headers.join(','),
            ...data.map(item => {
                const originalUrl = item.urlId?.originalUrl || '';
                return [
                    item.shortCode || '',
                    `"${originalUrl.replace(/"/g, '""')}"`,
                    item.timestamp ? new Date(item.timestamp).toISOString() : '',
                    item.visitorId || '',
                    item.ipAddress || '',
                    `"${(item.userAgent || '').replace(/"/g, '""')}"`,
                    `"${(item.referer || '').replace(/"/g, '""')}"`,
                    item.country || '',
                    item.city || '',
                    item.timezone || '',
                    item.latitude !== undefined && item.latitude !== null ? item.latitude : '',
                    item.longitude !== undefined && item.longitude !== null ? item.longitude : '',
                    `"${(item.isp || '').replace(/"/g, '""')}"`,
                    item.deviceType || '',
                    item.deviceBrand || '',
                    item.deviceModel || '',
                    item.osType || '',
                    item.osVersion || '',
                    item.browserName || '',
                    item.browserVersion || '',
                    item.browserLanguage || '',
                    item.screen?.width !== undefined && item.screen?.width !== null ? item.screen.width : '',
                    item.screen?.height !== undefined && item.screen?.height !== null ? item.screen.height : '',
                    item.screen?.resolution || '',
                    item.isRobot ? 'Yes' : 'No',
                    item.botName || '',
                    item.utm?.source || '',
                    item.utm?.medium || '',
                    item.utm?.campaign || '',
                    item.utm?.content || '',
                    item.utm?.term || '',
                    item.hour !== undefined && item.hour !== null ? item.hour : '',
                    item.day !== undefined && item.day !== null ? item.day : '',
                    item.month !== undefined && item.month !== null ? item.month : '',
                    item.year !== undefined && item.year !== null ? item.year : ''
                ].join(',');
            })
        ].join('\n');

        return csvContent;
    }

    /**
     * GET /api/v1/urls/:shortCode
     * Get URL details and analytics
     */
    async getURLDetails(req, res, next) {
        try {
            const { shortCode } = req.params;

            const url = await urlService.getURLByShortCode(shortCode);

            res.status(200).json({
                success: true,
                data: {
                    shortCode: url.shortCode,
                    originalUrl: url.originalUrl,
                    shortUrl: `${config.DOMAIN}/${url.shortCode}`,
                    analytics: url.analytics,
                    createdAt: url.createdAt,
                    title: url.title || '',
                    description: url.description || '',
                    tags: url.tags || [],
                    category: url.category || '',
                    status: url.status || 'active'
                }
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new URLController();