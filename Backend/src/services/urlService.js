// src/services/urlService.js
const UrlModel = require('../models/URL');
const shortCodeGenerator = require('../utils/shortCodeGenerator');
const logger = require('../utils/logger');
const PaginationHelper = require('../utils/pagination');
const QueryBuilder = require('../utils/queryBuilder');

class URLService {
    /**
     * Create shortened URL with collision handling
     * Retries up to 5 times if collision occurs
     */
    async shortenURL(originalUrl, userId = null) {
        // Validate URL
        try {
            new URL(originalUrl); // Will throw if invalid
        } catch (error) {
            throw new Error(`Invalid URL: ${error.message}`);
        }

        // Check for duplicates (avoid creating same URL twice)
        let existingUrl = await UrlModel.findOne({ originalUrl, userId });
        if (existingUrl) {
            logger.info(`Duplicate URL detected: ${originalUrl}`);
            return existingUrl;
        }

        // Generate unique short code with collision handling
        let shortCode;
        let maxRetries = 5;
        let retries = 0;

        while (retries < maxRetries) {
            shortCode = shortCodeGenerator.generateShortCode();

            // Check if code already exists
            const existing = await UrlModel.findOne({ shortCode });
            if (!existing) break; // Success!

            retries++;
            logger.warn(`Short code collision detected. Retry ${retries}/${maxRetries}`);
        }

        if (retries === maxRetries) {
            throw new Error('Failed to generate unique short code after 5 attempts');
        }

        // Create and save
        const newUrl = new UrlModel({
            originalUrl,
            shortCode,
            userId,
            analytics: {
                totalClicks: 0,
                uniqueVisitors: 0
            }
        });

        await newUrl.save();
        logger.info(`URL shortened: ${shortCode} -> ${originalUrl}`);

        return newUrl;
    }

    /**
     * Get URL by short code
     */
    async getURLByShortCode(shortCode) {
        const url = await UrlModel.findOne({ shortCode }).lean();

        if (!url) {
            throw new Error('Short URL not found');
        }

        return url;
    }

    /**
     * Increment click counter
     */
    async incrementClickCount(shortCode) {
        const result = await UrlModel.findOneAndUpdate(
            { shortCode },
            {
                $inc: { 'analytics.totalClicks': 1 },
                $set: { 'analytics.lastClickedAt': new Date() }
            },
            { new: true }
        );

        return result;
    }

    /**
     * Get URL analytics
     */
    async getAnalytics(shortCode, userId) {
        const url = await UrlModel.findOne({ shortCode });

        if (!url) {
            throw new Error('Short URL not found');
        }

        // Authorization check
        if (url.userId && url.userId.toString() !== userId) {
            throw new Error('Not authorized to view these analytics');
        }

        return url.analytics;
    }

    /**
     * Get all URLs for a user with pagination, sorting, and filters
     */
    async getUserURLs(userId, page = 1, limit = 10, filters = {}, sort = {}) {
        const { skip, limitNum } = PaginationHelper.getPaginationValues(page, limit);

        // Build query
        const query = QueryBuilder.buildFilterQuery(userId, filters);
        const sortQuery = QueryBuilder.buildSortQuery(
            sort.by || 'createdAt',
            sort.order || 'desc'
        );

        // Execute query
        const urls = await UrlModel.find(query)
            .sort(sortQuery)
            .skip(skip)
            .limit(limitNum)
            .lean();

        const total = await UrlModel.countDocuments(query);

        return PaginationHelper.formatPaginationResponse(urls, total, page, limit);
    }

    /**
     * Search user URLs using text search
     */
    async searchURLs(userId, searchTerm, page = 1, limit = 10) {
        const { skip, limitNum } = PaginationHelper.getPaginationValues(page, limit);

        const query = QueryBuilder.buildSearchQuery(userId, searchTerm);

        const urls = await UrlModel.find(query)
            .sort({ score: { $meta: 'textScore' } })
            .skip(skip)
            .limit(limitNum)
            .lean();

        const total = await UrlModel.countDocuments(query);

        return PaginationHelper.formatPaginationResponse(urls, total, page, limit);
    }

    /**
     * Update URL title, description, tags, category, status
     */
    async updateURL(userId, shortCode, updateData) {
        const url = await UrlModel.findOneAndUpdate(
            { shortCode, userId },
            {
                ...updateData,
                updatedAt: new Date()
            },
            { new: true, runValidators: true }
        );

        if (!url) {
            throw new Error('URL not found or unauthorized');
        }

        return url;
    }

    /**
     * Delete URL (soft or permanent)
     */
    async deleteURL(userId, shortCode, permanent = false) {
        let result;
        if (permanent) {
            result = await UrlModel.findOneAndDelete({ shortCode, userId });
            if (result) {
                const AnalyticsModel = require('../models/Analytics');
                await AnalyticsModel.deleteMany({ urlId: result._id });
            }
        } else {
            result = await UrlModel.findOneAndUpdate(
                { shortCode, userId },
                { status: 'deleted', updatedAt: new Date() },
                { new: true }
            );
        }

        if (!result) {
            throw new Error('URL not found or unauthorized');
        }

        return result;
    }

    /**
     * Bulk delete URLs (soft or permanent)
     */
    async bulkDeleteURLs(userId, shortCodes, permanent = false) {
        if (permanent) {
            const urlsToDelete = await UrlModel.find({
                shortCode: { $in: shortCodes },
                userId
            }).select('_id');
            const urlIds = urlsToDelete.map(u => u._id);

            const result = await UrlModel.deleteMany({
                _id: { $in: urlIds }
            });

            if (urlIds.length > 0) {
                const AnalyticsModel = require('../models/Analytics');
                await AnalyticsModel.deleteMany({ urlId: { $in: urlIds } });
            }
            return result;
        } else {
            return await UrlModel.updateMany(
                { shortCode: { $in: shortCodes }, userId },
                { status: 'deleted', updatedAt: new Date() }
            );
        }
    }

    /**
     * Get URL analytics stats for user
     */
    async getURLStats(userId) {
        const urls = await UrlModel.find({ userId }).lean();
        
        const totalURLs = urls.length;
        let totalClicks = 0;
        let topURL = null;
        let maxClicks = -1;

        const statusCounts = {
            active: 0,
            archived: 0,
            deleted: 0
        };

        urls.forEach(url => {
            const clicks = url.analytics?.totalClicks || 0;
            totalClicks += clicks;
            
            if (clicks > maxClicks) {
                maxClicks = clicks;
                topURL = {
                    shortCode: url.shortCode,
                    originalUrl: url.originalUrl,
                    title: url.title || '',
                    clicks: clicks
                };
            }

            const status = url.status || 'active';
            if (statusCounts[status] !== undefined) {
                statusCounts[status]++;
            }
        });

        const averageClicks = totalURLs > 0 ? (totalClicks / totalURLs) : 0;

        return {
            totalURLs,
            totalClicks,
            averageClicks: parseFloat(averageClicks.toFixed(2)),
            topURL,
            statusCounts
        };
    }
}

module.exports = new URLService();