// src/models/URL.js
const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
    originalUrl: {
        type: String,
        required: true,
        validate: {
            validator: (url) => {
                try {
                    new URL(url);
                    return true;
                } catch {
                    return false;
                }
            },
            message: 'Invalid URL format'
        }
    },
    shortCode: {
        type: String,
        required: true,
        unique: true,
        index: true,
        trim: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    analytics: {
        totalClicks: {
            type: Number,
            default: 0
        },
        lastClickedAt: {
            type: Date,
            default: null
        },
        uniqueVisitors: {
            type: Number,
            default: 0
        }
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: true
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    title: {
        type: String,
        default: '',
        index: true
    },
    description: String,
    tags: {
        type: [String],
        default: [],
        index: true
    },
    category: String,
    status: {
        type: String,
        enum: ['active', 'archived', 'deleted'],
        default: 'active',
        index: true
    },

});
// Create indexes
urlSchema.index({ userId: 1, createdAt: -1 });
urlSchema.index({ userId: 1, status: 1, createdAt: -1 });
urlSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('URL', urlSchema);