const express = require('express');
const router = express.Router();
const newsletterController = require('../controllers/newsletter.controller');

// GET all subscriptions
router.get('/', newsletterController.getAll);

// CREATE subscription
router.post('/subscribe', newsletterController.subscribe);

module.exports = router;
