// src/config/environment.js
const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    PORT: process.env.PORT || 3000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/url-shortener',
    JWT_SECRET: process.env.JWT_SECRET || 'dev-secret-key',
    SHORT_CODE_LENGTH: 6,
    SHORT_CODE_ALPHABET: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
    DOMAIN: process.env.DOMAIN || 'http://localhost:3000'
};