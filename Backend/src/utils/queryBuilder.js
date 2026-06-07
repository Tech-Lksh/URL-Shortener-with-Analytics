// src/utils/queryBuilder.js

class QueryBuilder {
    /**
     * Build MongoDB query with filters
     */
    static buildFilterQuery(userId, filters = {}) {
        const query = { userId };

        // Status filter
        if (filters.status) {
            query.status = filters.status;
        } else {
            // By default, exclude deleted URLs
            query.status = { $in: ['active', 'archived'] };
        }

        // Date range filter
        if (filters.dateFrom || filters.dateTo) {
            query.createdAt = {};
            if (filters.dateFrom) {
                query.createdAt.$gte = new Date(filters.dateFrom);
            }
            if (filters.dateTo) {
                query.createdAt.$lte = new Date(filters.dateTo);
            }
        }

        // Tags filter
        if (filters.tags && filters.tags.length > 0) {
            query.tags = { $in: filters.tags };
        }

        // Category filter
        if (filters.category) {
            query.category = filters.category;
        }

        // Clicks filter (min/max)
        if (filters.minClicks || filters.maxClicks) {
            query['analytics.totalClicks'] = {};
            if (filters.minClicks) {
                query['analytics.totalClicks'].$gte = parseInt(filters.minClicks);
            }
            if (filters.maxClicks) {
                query['analytics.totalClicks'].$lte = parseInt(filters.maxClicks);
            }
        }

        return query;
    }

    /**
     * Build sort object
     */
    static buildSortQuery(sortBy = 'createdAt', sortOrder = 'desc') {
        const allowedFields = [
            'createdAt',
            'updatedAt',
            'analytics.totalClicks',
            'title'
        ];

        if (!allowedFields.includes(sortBy)) {
            sortBy = 'createdAt';
        }

        const order = sortOrder === 'asc' ? 1 : -1;
        return { [sortBy]: order };
    }

    /**
     * Build search query (text search)
     */
    static buildSearchQuery(userId, searchTerm) {
        return {
            userId,
            $text: { $search: searchTerm }
        };
    }
}

module.exports = QueryBuilder;