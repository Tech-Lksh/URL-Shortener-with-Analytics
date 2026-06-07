// src/services/geoIpService.js
const http = require('http');
const logger = require('../utils/logger');

class GeoIpService {
    /**
     * Get geolocation data from IP address
     * Using ip-api.com (free tier: 45 requests/minute)
     * For production: use MaxMind GeoIP2
     */
    async getGeoLocation(ipAddress) {
        return new Promise((resolve, reject) => {
            try {
                let lookupIp = ipAddress;
                
                // If private/localhost IP, lookup the host's own public IP to get the developer's actual location in development
                if (this.isPrivateIP(lookupIp)) {
                    lookupIp = ''; 
                }

                const url = `http://ip-api.com/json/${lookupIp}?fields=status,message,country,countryCode,city,lat,lon,timezone,isp`;

                http.get(url, (res) => {
                    let data = '';

                    res.on('data', (chunk) => {
                        data += chunk;
                    });

                    res.on('end', () => {
                        try {
                            const result = JSON.parse(data);

                            if (result.status === 'success') {
                                resolve({
                                    country: result.country,
                                    countryCode: result.countryCode,
                                    city: result.city,
                                    latitude: result.lat,
                                    longitude: result.lon,
                                    timezone: result.timezone,
                                    isp: result.isp
                                });
                            } else {
                                resolve(this.getDefaultLocation());
                            }
                        } catch (error) {
                            logger.error(`GeoIP parsing error: ${error.message}`);
                            resolve(this.getDefaultLocation());
                        }
                    });
                }).on('error', (error) => {
                    logger.error(`GeoIP lookup error: ${error.message}`);
                    resolve(this.getDefaultLocation());
                });
            } catch (error) {
                logger.error(`GeoIP error: ${error.message}`);
                resolve(this.getDefaultLocation());
            }
        });
    }

    isPrivateIP(ip) {
        if (!ip) return true;
        const cleanIp = ip.replace(/^::ffff:/, '');
        return (
            /^(127\.|192\.168\.|10\.|172\.)/.test(cleanIp) ||
            cleanIp === '::1' ||
            cleanIp === '0.0.0.0' ||
            cleanIp === 'localhost'
        );
    }

    getDefaultLocation() {
        return {
            country: 'Unknown',
            countryCode: 'XX',
            city: 'Unknown',
            latitude: null,
            longitude: null,
            timezone: 'UTC',
            isp: 'Unknown'
        };
    }

    /**
     * Extract IP from request headers
     */
    static getClientIP(req) {
        return (
            req.headers['cf-connecting-ip'] || // Cloudflare
            req.headers['x-forwarded-for']?.split(',')[0] || // Proxy
            req.headers['x-real-ip'] || // Nginx
            req.socket.remoteAddress ||
            '0.0.0.0'
        );
    }
}

module.exports = new GeoIpService();