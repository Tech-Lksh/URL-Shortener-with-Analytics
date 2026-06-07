// src/utils/shortCodeGenerator.js
const crypto = require('crypto');
const config = require('../config/environment');

class ShortCodeGenerator {
    /**
     * Generate short code using Base62 encoding
     * Why: Efficiently encodes 64-bit numbers into compact 6-character strings
     * 62^6 = 56,800,235,584 possible combinations (enough for billions of URLs)
     */
    generateShortCode() {
        // Method 1: Random 6-character code
        let code = '';
        for (let i = 0; i < config.SHORT_CODE_LENGTH; i++) {
            const randomIndex = crypto.randomInt(0, config.SHORT_CODE_ALPHABET.length);
            code += config.SHORT_CODE_ALPHABET[randomIndex];
        }
        return code;
    }

    /**
     * Alternative: Generate from sequential ID (for predictable codes)
     * Better for: Private/internal URL shorteners
     */
    generateFromSequentialId(id) {
        return this.encodeBase62(id);
    }

    encodeBase62(num) {
        const alphabet = config.SHORT_CODE_ALPHABET;
        let encoded = '';
        while (num > 0) {
            encoded = alphabet[num % 62] + encoded;
            num = Math.floor(num / 62);
        }
        return encoded || alphabet[0];
    }

    decodeBase62(code) {
        const alphabet = config.SHORT_CODE_ALPHABET;
        let decoded = 0;
        for (const char of code) {
            decoded = decoded * 62 + alphabet.indexOf(char);
        }
        return decoded;
    }

    /**
     * Verify short code format
     */
    isValidShortCode(code) {
        const regex = new RegExp(`^[${config.SHORT_CODE_ALPHABET}]{${config.SHORT_CODE_LENGTH},}$`);
        return regex.test(code);
    }
}

module.exports = new ShortCodeGenerator();