// src/services/visitorFingerprintService.js
const crypto = require('crypto');

class VisitorFingerprintService {
    /**
     * Generate visitor fingerprint from request data
     * Fingerprint: Hash of IP + UserAgent + Accept-Language
     * Useful for tracking unique visitors without cookies
     */
    generateFingerprint(ipAddress, userAgent, acceptLanguage) {
        const data = `${ipAddress}:${userAgent}:${acceptLanguage}`;
        return crypto.createHash('sha256').update(data).digest('hex');
    }

    /**
     * Alternative: UUID-based visitor ID
     * Store in client cookie for session tracking
     */
    generateVisitorId() {
        const { v4: uuidv4 } = require('uuid');
        return uuidv4();
    }
}

module.exports = new VisitorFingerprintService();