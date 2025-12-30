const express = require('express');
const router = express.Router();

const blogController = require('../controllers/blogControllers');

// Get statistics (separate route to avoid conflict)
router.get('/statistics', blogController.getStatistics);

module.exports = router;