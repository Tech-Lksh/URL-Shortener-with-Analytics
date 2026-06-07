// src/services/userAgentService.js
const UAParser = require('ua-parser-js');

class UserAgentService {
    /**
     * Parse user-agent string to extract browser, OS, device info
     */
    parseUserAgent(userAgentString) {
        const parser = new UAParser(userAgentString);
        const result = parser.getResult();

        return {
            browserName: result.browser.name || 'Unknown',
            browserVersion: result.browser.version || 'Unknown',
            osType: this.normalizeOS(result.os.name),
            osVersion: result.os.version || 'Unknown',
            deviceType: this.getDeviceType(result.device.type),
            deviceBrand: result.device.vendor || 'Unknown',
            deviceModel: result.device.model || 'Unknown'
        };
    }

    /**
     * Normalize OS name to match Mongoose schema enum
     */
    normalizeOS(osName) {
        if (!osName) return 'unknown';
        
        const name = osName.toLowerCase();
        if (name.includes('win')) return 'Windows';
        if (name.includes('mac') || name.includes('os x')) return 'macOS';
        if (name.includes('linux') || name.includes('ubuntu') || name.includes('debian') || name.includes('fedora') || name.includes('redhat') || name.includes('suse') || name.includes('mint') || name.includes('centos')) return 'Linux';
        if (name.includes('ios') || name.includes('iphone') || name.includes('ipad')) return 'iOS';
        if (name.includes('android')) return 'Android';
        
        return 'unknown';
    }

    /**
     * Determine device type from UA parser result
     */
    getDeviceType(deviceType) {
        if (!deviceType) return 'desktop';

        const types = {
            'mobile': 'mobile',
            'tablet': 'tablet',
            'wearable': 'mobile',
            'console': 'desktop'
        };

        return types[deviceType] || 'desktop';
    }

    /**
     * Detect if user-agent is a bot/crawler
     */
    isBot(userAgentString) {
        const botPatterns = [
            /bot\b|crawler\b|spider\b|scraper\b|curl\b|wget\b|yahoo\b|baidu\b|bingbot\b|googlebot\b|yandex\b|duckduckbot\b|baiduspider\b|facebookexternalhit\b|twitterbot\b|linkedinbot\b|whatsapp\b|telegram\b/i
        ];

        return botPatterns.some(pattern => pattern.test(userAgentString));
    }

    /**
     * Extract bot name if bot detected
     */
    getBotName(userAgentString) {
        const bots = {
            googlebot: /googlebot/i,
            bingbot: /bingbot/i,
            yandex: /yandex/i,
            baidu: /baidu/i,
            facebook: /facebookexternalhit/i,
            twitter: /twitterbot/i,
            linkedin: /linkedinbot/i
        };

        for (const [name, pattern] of Object.entries(bots)) {
            if (pattern.test(userAgentString)) {
                return name;
            }
        }

        return 'unknown';
    }
}

module.exports = new UserAgentService();