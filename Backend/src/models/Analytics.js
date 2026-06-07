// src/models/Analytics.js
const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
    urlId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'URL',
        required: true,
        index: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        index: true,
        default: null
    },
    shortCode: {
        type: String,
        required: true,
        index: true
    },
    visitorId: {
        type: String,
        index: true
    },
    ipAddress: String,
    userAgent: String,
    referer: String,
    country: String,
    city: String,
    timezone: String,
    latitude: Number,
    longitude: Number,
    isp: String,
    deviceType: {
        type: String,
        enum: ['desktop', 'mobile', 'tablet', 'unknown'],
        index: true
    },
    deviceBrand: String,
    deviceModel: String,
    osType: {
        type: String,
        enum: ['Windows', 'macOS', 'Linux', 'iOS', 'Android', 'unknown'],
        index: true
    },
    osVersion: String,
    browserName: {
        type: String,
        index: true
    },
    browserVersion: String,
    browserLanguage: String,
    screen: {
        width: Number,
        height: Number,
        resolution: String
    },
    isRobot: {
        type: Boolean,
        default: false,
        index: true
    },
    botName: String,
    utm: {
        source: String,
        medium: String,
        campaign: String,
        content: String,
        term: String
    },
    customData: mongoose.Schema.Types.Mixed,
    timestamp: {
        type: Date,
        default: Date.now
    },
    hour: Number,
    day: Number,
    month: Number,
    year: Number
});

// TTL index - delete records after 90 days
analyticsSchema.index(
    { timestamp: 1 },
    { expireAfterSeconds: 7776000 } // 90 days
);

module.exports = mongoose.model('Analytics', analyticsSchema);