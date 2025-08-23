const FoodShelfLife = require('../models/FoodShelfLife');
const axios = require('axios');

const ML_API_BASE_URL = process.env.ML_API_BASE_URL || 'http://localhost:8001';

// Create new food shelf life prediction
const createShelfLifePrediction = async (req, res) => {
  try {
    const { foodItem, foodCategory, temperature, humidity, eventId, notes } = req.body;
    const userId = req.user.id;

    // Call ML API for prediction
    const predictionResponse = await axios.post(`${ML_API_BASE_URL}/predict-shelf-life`, {
      foodItem,
      foodCategory,
      temperature,
      humidity
    });

    const prediction = predictionResponse.data;

    // Create food shelf life record
    const foodShelfLife = new FoodShelfLife({
      foodItem,
      foodCategory,
      temperature,
      humidity,
      predictedShelfLife: prediction.predictedShelfLife,
      expiresAt: prediction.expiresAt,
      remainingHours: prediction.remainingHours,
      isSafeToEat: prediction.isSafeToEat,
      createdBy: userId,
      event: eventId,
      notes
    });

    await foodShelfLife.save();

    res.status(201).json({
      success: true,
      data: foodShelfLife,
      prediction: prediction
    });

  } catch (error) {
    console.error('Error creating shelf life prediction:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating shelf life prediction',
      error: error.message
    });
  }
};

// Get all food shelf life predictions for a user
const getUserShelfLifePredictions = async (req, res) => {
  try {
    const userId = req.user.id;
    const predictions = await FoodShelfLife.find({ createdBy: userId })
      .populate('event', 'name date')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: predictions
    });

  } catch (error) {
    console.error('Error fetching shelf life predictions:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching shelf life predictions',
      error: error.message
    });
  }
};

// Get active food shelf life predictions (not expired)
const getActiveShelfLifePredictions = async (req, res) => {
  try {
    const predictions = await FoodShelfLife.find({
      status: 'active',
      expiresAt: { $gt: new Date() }
    })
    .populate('createdBy', 'name email')
    .populate('event', 'name date')
    .sort({ expiresAt: 1 });

    res.status(200).json({
      success: true,
      data: predictions
    });

  } catch (error) {
    console.error('Error fetching active predictions:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching active predictions',
      error: error.message
    });
  }
};

// Update food shelf life status
const updateShelfLifeStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const prediction = await FoodShelfLife.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate('createdBy', 'name email');

    if (!prediction) {
      return res.status(404).json({
        success: false,
        message: 'Food shelf life prediction not found'
      });
    }

    res.status(200).json({
      success: true,
      data: prediction
    });

  } catch (error) {
    console.error('Error updating shelf life status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating shelf life status',
      error: error.message
    });
  }
};

// Get food categories from ML API
const getFoodCategories = async (req, res) => {
  try {
    const response = await axios.get(`${ML_API_BASE_URL}/food-categories`);
    res.status(200).json({
      success: true,
      data: response.data
    });

  } catch (error) {
    console.error('Error fetching food categories:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching food categories',
      error: error.message
    });
  }
};

// Get dashboard statistics
const getShelfLifeStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const totalPredictions = await FoodShelfLife.countDocuments({ createdBy: userId });
    const activePredictions = await FoodShelfLife.countDocuments({
      createdBy: userId,
      status: 'active',
      expiresAt: { $gt: new Date() }
    });
    const expiredPredictions = await FoodShelfLife.countDocuments({
      createdBy: userId,
      status: 'active',
      expiresAt: { $lte: new Date() }
    });
    const consumedPredictions = await FoodShelfLife.countDocuments({
      createdBy: userId,
      status: 'consumed'
    });

    // Get predictions expiring soon (within 6 hours)
    const expiringSoon = await FoodShelfLife.find({
      createdBy: userId,
      status: 'active',
      expiresAt: {
        $gt: new Date(),
        $lte: new Date(Date.now() + 6 * 60 * 60 * 1000) // 6 hours
      }
    }).populate('event', 'name');

    res.status(200).json({
      success: true,
      data: {
        total: totalPredictions,
        active: activePredictions,
        expired: expiredPredictions,
        consumed: consumedPredictions,
        expiringSoon
      }
    });

  } catch (error) {
    console.error('Error fetching shelf life stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching shelf life stats',
      error: error.message
    });
  }
};

module.exports = {
  createShelfLifePrediction,
  getUserShelfLifePredictions,
  getActiveShelfLifePredictions,
  updateShelfLifeStatus,
  getFoodCategories,
  getShelfLifeStats
}; 