// src/server.js
const app = require('./app');
const connectDB = require('./src/config/database');
const config = require('./src/config/environment');
const logger = require('./src/utils/logger');

const startServer = async () => {
    try {
        // Connect to database
        await connectDB();

        // Start server
        const server = app.listen(config.PORT, () => {
            logger.info(`Server running on port ${config.PORT} in ${config.NODE_ENV} mode`);
        });

        // Graceful shutdown
        process.on('SIGTERM', () => {
            logger.info('SIGTERM signal received: closing HTTP server');
            server.close(() => {
                logger.info('HTTP server closed');
                process.exit(0);
            });
        });
    } catch (error) {
        logger.error(`Failed to start server: ${error.message}`);
        process.exit(1);
    }
};

startServer();