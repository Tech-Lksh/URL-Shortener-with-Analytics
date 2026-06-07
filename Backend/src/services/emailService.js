// src/services/emailService.js
const logger = require('../utils/logger');

class EmailService {
    async sendVerificationEmail(email, verificationUrl) {
        logger.info(`[STUB] Verification email would be sent to ${email}`);
        // Phase 5: Implement with Nodemailer
    }

    async sendPasswordResetEmail(email, resetUrl) {
        logger.info(`[STUB] Reset email would be sent to ${email}`);
        // Phase 5: Implement with Nodemailer
    }

    async sendNotification(email, subject, message) {
        logger.info(`[STUB] Email would be sent to ${email}: ${subject}`);
        // Phase 5: Implement with Nodemailer
    }
}

module.exports = new EmailService();