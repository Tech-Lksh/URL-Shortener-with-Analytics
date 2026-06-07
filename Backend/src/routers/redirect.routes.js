// src/routes/redirect.routes.js
const express = require('express');
const router = express.Router();
const redirectController = require('../controllers/redirectController');

// GET /:shortCode - Must be last route to avoid conflicts
router.get('/:shortCode', redirectController.redirect);

module.exports = router;