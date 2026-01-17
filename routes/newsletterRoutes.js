// const express = require('express');
// const router = express.Router();
// const newsletterController = require('../controllers/newsletter.controller');

// // GET all subscriptions
// router.get('/', newsletterController.getAll);

// // CREATE subscription
// router.post('/subscribe', newsletterController.subscribe);

// module.exports = router;
















const express = require('express');
const router = express.Router();
const newsletterController = require('../controllers/newsletter.controller');

// Newsletter
router.post('/subscribe', newsletterController.subscribe);
router.get('/', newsletterController.getAll);
router.get('/:email', newsletterController.getByEmail);

// Statistics
router.get('/statistics', newsletterController.getStatistics);

module.exports = router;
