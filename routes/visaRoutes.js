const express = require('express');
const router = express.Router();
const { VisaController, errorHandler } = require('../controllers/visaController');

// CRUD operations
router.post('/', (req, res, next) => VisaController.createVisa(req, res, next));
router.get('/', (req, res, next) => VisaController.getAllVisas(req, res, next));
router.get('/search', (req, res, next) => VisaController.searchVisas(req, res, next));
router.get('/:id', (req, res, next) => VisaController.getVisaById(req, res, next));
router.put('/:id', (req, res, next) => VisaController.updateVisa(req, res, next));
router.delete('/:id', (req, res, next) => VisaController.deleteVisa(req, res, next));

// Bulk operations
router.post('/bulk', (req, res, next) => VisaController.bulkUpdate(req, res, next));

// Statistics
router.get('/stats/overall', (req, res, next) => VisaController.getStatistics(req, res, next));
router.get('/stats/inventory', (req, res, next) => VisaController.getInventoryStatistics(req, res, next));

// Email services
router.post('/send-email', (req, res, next) => VisaController.sendEmail(req, res, next));

module.exports = router;