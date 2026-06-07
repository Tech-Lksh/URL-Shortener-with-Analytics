// src/utils/logger.js
const fs = require('fs');
const path = require('path');

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir);
}

class Logger {
    log(level, message, data = {}) {
        const timestamp = new Date().toISOString();
        const logEntry = {
            timestamp,
            level,
            message,
            ...data
        };

        console.log(`[${timestamp}] [${level}] ${message}`);

        // Optionally log to file
        if (process.env.NODE_ENV === 'production') {
            fs.appendFileSync(
                path.join(logsDir, `${level.toLowerCase()}.log`),
                JSON.stringify(logEntry) + '\n'
            );
        }
    }

    info(message, data) {
        this.log('INFO', message, data);
    }

    warn(message, data) {
        this.log('WARN', message, data);
    }

    error(message, data) {
        this.log('ERROR', message, data);
    }

    debug(message, data) {
        if (process.env.NODE_ENV === 'development') {
            this.log('DEBUG', message, data);
        }
    }
}

module.exports = new Logger();