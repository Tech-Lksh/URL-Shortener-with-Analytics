// src/routes/url.routes.js
const express = require('express');
const router = express.Router();
const urlController = require('../controllers/urlController');
const validation = require('../middleware/validation');
const { protect, optionalAuth } = require('../middleware/auth.middleware');

// POST /api/v1/shorten
router.post('/shorten', optionalAuth, validation.validateShortenRequest, urlController.createShortenedURL);
// GET /api/v1/urls/:shortCode
router.get('/my-urls', protect, validation.validateQueryParams, urlController.getUserURLs);
router.get('/urls/stats', protect, urlController.getURLStats);
router.get('/urls/export', protect, validation.validateQueryParams, urlController.exportURLs);
router.get('/urls/:shortCode', urlController.getURLDetails);
router.put('/urls/:shortCode', protect, urlController.updateURL);
router.delete('/urls/:shortCode', protect, urlController.deleteURL);
router.post('/urls/bulk-delete', protect, urlController.bulkDeleteURLs);


module.exports = router;