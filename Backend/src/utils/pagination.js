// src/utils/pagination.js

class PaginationHelper {
    /**
     * Calculate pagination values
     */
    static getPaginationValues(page = 1, limit = 10) {
        const pageNum = Math.max(1, parseInt(page));
        const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
        const skip = (pageNum - 1) * limitNum;

        return { pageNum, limitNum, skip };
    }

    /**
     * Format pagination response
     */
    static formatPaginationResponse(data, total, page, limit) {
        const pageNum = Math.max(1, parseInt(page));
        const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
        const totalPages = Math.ceil(total / limitNum);

        return {
            data,
            pagination: {
                total,
                page: pageNum,
                limit: limitNum,
                pages: totalPages,
                hasNextPage: pageNum < totalPages,
                hasPrevPage: pageNum > 1
            }
        };
    }
}

module.exports = PaginationHelper;