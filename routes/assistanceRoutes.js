const express = require('express');
const router = express.Router();
const assistanceController = require('../controllers/assistanceController');

// ========== CRUD ROUTES ==========

// CREATE - Submit new assistance request
router.post('/', assistanceController.createRequest);

// READ - Get all requests (with filters & pagination)
router.get('/', assistanceController.getRequests);

// READ - Get single request by ID
router.get('/:id', assistanceController.getRequest);

// UPDATE - Update request by ID
router.put('/:id', assistanceController.updateRequest);

// DELETE - Delete request by ID
router.delete('/:id', assistanceController.deleteRequest);

// ========== STATISTICS ROUTES ==========

// Overall statistics
router.get('/stats/overview', assistanceController.getStatistics);

// Status counts
router.get('/stats/status-counts', async (req, res) => {
  try {
    const counts = await AssistanceRequest.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    const formatted = counts.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {});
    
    res.json({
      success: true,
      data: formatted
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch status counts'
    });
  }
});

// Issue type distribution
router.get('/stats/issue-types', async (req, res) => {
  try {
    const distribution = await AssistanceRequest.aggregate([
      {
        $group: {
          _id: '$issueType',
          count: { $sum: 1 },
          avgResolutionTime: {
            $avg: {
              $cond: [
                { $ne: ['$resolvedAt', null] },
                { $subtract: ['$resolvedAt', '$createdAt'] },
                null
              ]
            }
          }
        }
      },
      { $sort: { count: -1 } }
    ]);
    
    res.json({
      success: true,
      data: distribution
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch issue type distribution'
    });
  }
});

module.exports = router;