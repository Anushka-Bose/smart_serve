const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const {
  createShelfLifePrediction,
  getUserShelfLifePredictions,
  getActiveShelfLifePredictions,
  updateShelfLifeStatus,
  getFoodCategories,
  getShelfLifeStats
} = require('../controllers/foodShelfLifeController');

// All routes require authentication
router.use(authMiddleware);

// Create new shelf life prediction
router.post('/predict', createShelfLifePrediction);

// Get user's shelf life predictions
router.get('/user', getUserShelfLifePredictions);

// Get active shelf life predictions (for all users)
router.get('/active', getActiveShelfLifePredictions);

// Update shelf life status
router.patch('/:id/status', updateShelfLifeStatus);

// Get food categories
router.get('/categories', getFoodCategories);

// Get dashboard statistics
router.get('/stats', getShelfLifeStats);

module.exports = router; 