// src/services/analyticsService.js
const mongoose = require('mongoose');
const Analytics = require('../models/Analytics');
const UrlModel = require('../models/URL');
const geoIpService = require('./geoIpService');
const userAgentService = require('./userAgentService');
const visitorFingerprintService = require('./visitorFingerprintService');
const logger = require('../utils/logger');

class AnalyticsService {
    /**
     * Track a click event
     * This is called asynchronously from redirect
     */
    async trackClick(shortCode, req, customData = {}) {
        try {
            // Find URL
            const url = await UrlModel.findOne({ shortCode });
            if (!url) {
                logger.warn(`Analytics: URL not found for ${shortCode}`);
                return null;
            }

            // Extract data from request
            const ipAddress = geoIpService.constructor.getClientIP(req);
            const userAgent = req.headers['user-agent'] || '';
            const referer = req.headers['referer'] || req.headers['referrer'] || '';
            const acceptLanguage = req.headers['accept-language'] || '';

            // Get geolocation
            const geoData = await geoIpService.getGeoLocation(ipAddress);

            // Parse user-agent
            const uaData = userAgentService.parseUserAgent(userAgent);

            // Check if bot
            const isBot = userAgentService.isBot(userAgent);
            const botName = isBot ? userAgentService.getBotName(userAgent) : null;

            // Generate visitor fingerprint
            const visitorId = visitorFingerprintService.generateFingerprint(
                ipAddress,
                userAgent,
                acceptLanguage
            );

            // Get current date components for aggregation
            const now = new Date();
            const hour = now.getHours();
            const day = now.getDate();
            const month = now.getMonth() + 1;
            const year = now.getFullYear();

            // Parse UTM parameters from request query first, then referer
            const utm = this.parseUTMParameters(req, referer);

            // Parse screen info from query parameters or customData
            const screen = {
                width: parseInt(req?.query?.sw || req?.query?.screen_width || req?.query?.width || customData?.screen?.width || customData?.screenWidth) || undefined,
                height: parseInt(req?.query?.sh || req?.query?.screen_height || req?.query?.height || customData?.screen?.height || customData?.screenHeight) || undefined,
                resolution: req?.query?.sr || req?.query?.screen_resolution || req?.query?.resolution || customData?.screen?.resolution || customData?.screenResolution || undefined
            };

            // Create analytics record
            const analytics = new Analytics({
                urlId: url._id,
                userId: url.userId,
                shortCode,
                visitorId,
                ipAddress,
                userAgent,
                referer,
                country: geoData.country,
                city: geoData.city,
                timezone: geoData.timezone,
                latitude: geoData.latitude,
                longitude: geoData.longitude,
                isp: geoData.isp,
                ...uaData,
                isRobot: isBot,
                botName,
                browserLanguage: acceptLanguage.split(',')[0],
                screen,
                utm,
                customData,
                timestamp: now,
                hour,
                day,
                month,
                year
            });

            await analytics.save();

            // Check if this visitor has clicked this URL before
            const existingClick = await Analytics.findOne({ urlId: url._id, visitorId });
            const isUnique = !existingClick;

            // Update URL click count
            await UrlModel.findByIdAndUpdate(
                url._id,
                {
                    $inc: { 
                        'analytics.totalClicks': 1,
                        ...(isUnique && { 'analytics.uniqueVisitors': 1 })
                    },
                    $set: { 'analytics.lastClickedAt': now }
                },
                { returnDocument: 'after' }
            );

            logger.info(`Analytics tracked: ${shortCode} from ${geoData.country}`);
            return analytics;
        } catch (error) {
            logger.error(`Analytics tracking error: ${error.message}`);
            return null;
        }
    }

    /**
     * Parse UTM parameters from request query or referer URL
     */
    parseUTMParameters(req, referer) {
        const utm = {
            source: req?.query?.utm_source || null,
            medium: req?.query?.utm_medium || null,
            campaign: req?.query?.utm_campaign || null,
            content: req?.query?.utm_content || null,
            term: req?.query?.utm_term || null
        };

        // If not found in query, check referer URL
        if (!utm.source && referer) {
            try {
                const url = new URL(referer);
                utm.source = url.searchParams.get('utm_source') || null;
                utm.medium = url.searchParams.get('utm_medium') || null;
                utm.campaign = url.searchParams.get('utm_campaign') || null;
                utm.content = url.searchParams.get('utm_content') || null;
                utm.term = url.searchParams.get('utm_term') || null;
            } catch (error) {
                logger.warn(`UTM parsing error from referer: ${error.message}`);
            }
        }

        return utm;
    }

    /**
     * Get analytics summary for a URL
     */
    async getAnalyticsSummary(urlId) {
        const aggregationPromise = Analytics.aggregate([
            { $match: { urlId: new mongoose.Types.ObjectId(urlId) } },
            {
                $group: {
                    _id: null,
                    totalClicks: { $sum: 1 },
                    uniqueVisitors: { $addToSet: '$visitorId' },
                    botClicks: {
                        $sum: { $cond: ['$isRobot', 1, 0] }
                    }
                }
            },
            {
                $project: {
                    totalClicks: 1,
                    uniqueVisitors: { $size: '$uniqueVisitors' },
                    humanClicks: { $subtract: ['$totalClicks', '$botClicks'] },
                    botClicks: 1
                }
            }
        ]);

        // Calculate 7-day trend (clicks in last 7 days vs previous 7 days)
        const now = Date.now();
        const sevenDaysAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
        const fourteenDaysAgo = new Date(now - 14 * 24 * 60 * 60 * 1000);

        const currentPeriodPromise = Analytics.countDocuments({
            urlId: new mongoose.Types.ObjectId(urlId),
            timestamp: { $gte: sevenDaysAgo }
        });

        const previousPeriodPromise = Analytics.countDocuments({
            urlId: new mongoose.Types.ObjectId(urlId),
            timestamp: { $gte: fourteenDaysAgo, $lt: sevenDaysAgo }
        });

        const [aggResult, currentPeriod, previousPeriod] = await Promise.all([
            aggregationPromise,
            currentPeriodPromise,
            previousPeriodPromise
        ]);

        const summary = aggResult[0] || {
            totalClicks: 0,
            uniqueVisitors: 0,
            humanClicks: 0,
            botClicks: 0
        };

        // Calculate click trend percentage
        let clickTrend = 0;
        if (previousPeriod > 0) {
            clickTrend = parseFloat((((currentPeriod - previousPeriod) / previousPeriod) * 100).toFixed(1));
        } else if (currentPeriod > 0) {
            clickTrend = 100.0;
        }

        return {
            ...summary,
            clickTrend
        };
    }

    /**
     * Get timeline data (clicks over time)
     */
    async getTimelineAnalytics(urlId, timeframe = 'day') {
        const match = { $match: { urlId: new mongoose.Types.ObjectId(urlId) } };

        let groupBy;
        let sortField;

        if (timeframe === 'hour') {
            groupBy = { year: '$year', month: '$month', day: '$day', hour: '$hour' };
            sortField = { hour: -1 };
        } else if (timeframe === 'day') {
            groupBy = { year: '$year', month: '$month', day: '$day' };
            sortField = { day: -1 };
        } else if (timeframe === 'month') {
            groupBy = { year: '$year', month: '$month' };
            sortField = { month: -1 };
        } else {
            groupBy = { year: '$year' };
            sortField = { year: -1 };
        }

        const result = await Analytics.aggregate([
            match,
            {
                $group: {
                    _id: groupBy,
                    clicks: { $sum: 1 },
                    uniqueVisitors: { $addToSet: '$visitorId' }
                }
            },
            { $sort: sortField },
            { $limit: 90 } // Last 90 days/months/etc
        ]);

        return result.map(item => ({
            ...item._id,
            clicks: item.clicks,
            uniqueVisitors: item.uniqueVisitors.length
        }));
    }

    /**
     * Get geographic breakdown
     */
    async getGeographicAnalytics(urlId) {
        return Analytics.aggregate([
            { $match: { urlId: new mongoose.Types.ObjectId(urlId) } },
            {
                $group: {
                    _id: { country: '$country', city: '$city' },
                    clicks: { $sum: 1 },
                    uniqueVisitors: { $addToSet: '$visitorId' }
                }
            },
            { $sort: { clicks: -1 } },
            { $limit: 50 },
            {
                $project: {
                    country: '$_id.country',
                    city: '$_id.city',
                    clicks: 1,
                    uniqueVisitors: { $size: '$uniqueVisitors' }
                }
            }
        ]);
    }

    /**
     * Get device breakdown
     */
    async getDeviceAnalytics(urlId) {
        return Analytics.aggregate([
            { $match: { urlId: new mongoose.Types.ObjectId(urlId) } },
            {
                $group: {
                    _id: '$deviceType',
                    clicks: { $sum: 1 },
                    uniqueVisitors: { $addToSet: '$visitorId' }
                }
            },
            { $sort: { clicks: -1 } },
            {
                $project: {
                    deviceType: '$_id',
                    clicks: 1,
                    uniqueVisitors: { $size: '$uniqueVisitors' }
                }
            }
        ]);
    }

    /**
     * Get browser breakdown
     */
    async getBrowserAnalytics(urlId) {
        return Analytics.aggregate([
            { $match: { urlId: new mongoose.Types.ObjectId(urlId) } },
            {
                $group: {
                    _id: '$browserName',
                    clicks: { $sum: 1 },
                    uniqueVisitors: { $addToSet: '$visitorId' }
                }
            },
            { $sort: { clicks: -1 } },
            { $limit: 20 },
            {
                $project: {
                    browserName: '$_id',
                    clicks: 1,
                    uniqueVisitors: { $size: '$uniqueVisitors' }
                }
            }
        ]);
    }

    /**
     * Get OS breakdown
     */
    async getOSAnalytics(urlId) {
        return Analytics.aggregate([
            { $match: { urlId: new mongoose.Types.ObjectId(urlId) } },
            {
                $group: {
                    _id: '$osType',
                    clicks: { $sum: 1 },
                    uniqueVisitors: { $addToSet: '$visitorId' }
                }
            },
            { $sort: { clicks: -1 } },
            {
                $project: {
                    osType: '$_id',
                    clicks: 1,
                    uniqueVisitors: { $size: '$uniqueVisitors' }
                }
            }
        ]);
    }

    /**
     * Get recent raw click logs for a URL
     */
    async getRecentClicks(urlId, limit = 100) {
        return Analytics.find({ urlId: new mongoose.Types.ObjectId(urlId) })
            .sort({ timestamp: -1 })
            .limit(limit)
            .lean();
    }
}

module.exports = new AnalyticsService();