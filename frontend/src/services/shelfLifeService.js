import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Create axios instance with auth token
const createAuthInstance = () => {
  const token = localStorage.getItem('token');
  return axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
};

// Food Shelf Life API calls
export const shelfLifeService = {
  // Create new shelf life prediction
  createPrediction: async (predictionData) => {
    const instance = createAuthInstance();
    const response = await instance.post('/shelf-life/predict', predictionData);
    return response.data;
  },

  // Get user's shelf life predictions
  getUserPredictions: async () => {
    const instance = createAuthInstance();
    const response = await instance.get('/shelf-life/user');
    return response.data;
  },

  // Get active shelf life predictions
  getActivePredictions: async () => {
    const instance = createAuthInstance();
    const response = await instance.get('/shelf-life/active');
    return response.data;
  },

  // Update shelf life status
  updateStatus: async (id, status) => {
    const instance = createAuthInstance();
    const response = await instance.patch(`/shelf-life/${id}/status`, { status });
    return response.data;
  },

  // Get food categories
  getFoodCategories: async () => {
    const instance = createAuthInstance();
    const response = await instance.get('/shelf-life/categories');
    return response.data;
  },

  // Get dashboard statistics
  getStats: async () => {
    const instance = createAuthInstance();
    const response = await instance.get('/shelf-life/stats');
    return response.data;
  }
};

// Utility functions for countdown timer
export const countdownUtils = {
  // Calculate remaining time
  calculateRemainingTime: (expiresAt) => {
    const now = new Date().getTime();
    const expiryTime = new Date(expiresAt).getTime();
    const timeLeft = expiryTime - now;

    if (timeLeft <= 0) {
      return { hours: 0, minutes: 0, seconds: 0, expired: true };
    }

    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    return { hours, minutes, seconds, expired: false };
  },

  // Format time for display
  formatTime: (time) => {
    return time < 10 ? `0${time}` : time;
  },

  // Get risk level color
  getRiskLevelColor: (remainingHours) => {
    if (remainingHours > 24) return 'text-green-600';
    if (remainingHours > 6) return 'text-yellow-600';
    return 'text-red-600';
  },

  // Get risk level text
  getRiskLevelText: (remainingHours) => {
    if (remainingHours > 24) return 'LOW';
    if (remainingHours > 6) return 'MEDIUM';
    return 'HIGH';
  }
}; 