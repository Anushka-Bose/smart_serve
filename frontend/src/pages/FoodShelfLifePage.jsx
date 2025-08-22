import React, { useState, useEffect } from 'react';
import { shelfLifeService } from '../services/shelfLifeService';
import CountdownTimer from '../comp/CountdownTimer';

const FoodShelfLifePage = () => {
  const [formData, setFormData] = useState({
    foodItem: '',
    foodCategory: '',
    temperature: 25,
    humidity: 60,
    eventId: '',
    notes: ''
  });

  const [categories, setCategories] = useState({});
  const [predictions, setPredictions] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [currentPrediction, setCurrentPrediction] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [categoriesRes, predictionsRes, statsRes] = await Promise.all([
        shelfLifeService.getFoodCategories(),
        shelfLifeService.getUserPredictions(),
        shelfLifeService.getStats()
      ]);

      setCategories(categoriesRes.data);
      setPredictions(predictionsRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await shelfLifeService.createPrediction(formData);
      setCurrentPrediction(response.data);
      setPredictions(prev => [response.data, ...prev]);
      setFormData({
        foodItem: '',
        foodCategory: '',
        temperature: 25,
        humidity: 60,
        eventId: '',
        notes: ''
      });
      setShowForm(false);
      await loadData(); // Refresh stats
    } catch (error) {
      console.error('Error creating prediction:', error);
      alert('Error creating prediction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await shelfLifeService.updateStatus(id, status);
      await loadData();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const getCategoryItems = (category) => {
    return categories.food_items?.[category] || [];
  };

  if (loading && predictions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🍽️ Food Shelf Life Predictor
          </h1>
          <p className="text-gray-600">
            Predict how long your food will stay safe to eat based on temperature and humidity
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-blue-200">
            <div className="text-2xl font-bold text-blue-600">{stats.total || 0}</div>
            <div className="text-gray-600">Total Predictions</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg border border-green-200">
            <div className="text-2xl font-bold text-green-600">{stats.active || 0}</div>
            <div className="text-gray-600">Active Items</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg border border-yellow-200">
            <div className="text-2xl font-bold text-yellow-600">{stats.expired || 0}</div>
            <div className="text-gray-600">Expired Items</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg border border-purple-200">
            <div className="text-2xl font-bold text-purple-600">{stats.consumed || 0}</div>
            <div className="text-gray-600">Consumed Items</div>
          </div>
        </div>

        {/* Current Prediction Display */}
        {currentPrediction && (
          <div className="bg-white rounded-xl p-6 shadow-lg border border-blue-200 mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Latest Prediction: {currentPrediction.foodItem}
            </h3>
            <CountdownTimer 
              expiresAt={currentPrediction.expiresAt}
              remainingHours={currentPrediction.remainingHours}
            />
          </div>
        )}

        {/* Add New Prediction Button */}
        <div className="text-center mb-8">
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            {showForm ? 'Cancel' : '+ Add New Prediction'}
          </button>
        </div>

        {/* Prediction Form */}
        {showForm && (
          <div className="bg-white rounded-xl p-6 shadow-lg border border-blue-200 mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">New Food Prediction</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Food Category
                  </label>
                  <select
                    name="foodCategory"
                    value={formData.foodCategory}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Category</option>
                    {Object.keys(categories.food_items || {}).map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Food Item
                  </label>
                  <input
                    type="text"
                    name="foodItem"
                    value={formData.foodItem}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Rice, Chicken, Tomato"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Temperature (°C)
                  </label>
                  <input
                    type="number"
                    name="temperature"
                    value={formData.temperature}
                    onChange={handleInputChange}
                    min="-10"
                    max="50"
                    step="0.1"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Humidity (%)
                  </label>
                  <input
                    type="number"
                    name="humidity"
                    value={formData.humidity}
                    onChange={handleInputChange}
                    min="0"
                    max="100"
                    step="0.1"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Additional notes about the food item..."
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  {loading ? 'Predicting...' : 'Predict Shelf Life'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Predictions List */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-blue-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Predictions</h3>
          {predictions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No predictions yet. Create your first prediction above!
            </div>
          ) : (
            <div className="space-y-4">
              {predictions.map((prediction) => (
                <div key={prediction._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">{prediction.foodItem}</h4>
                      <p className="text-sm text-gray-600">
                        Category: {prediction.foodCategory} | 
                        Temp: {prediction.temperature}°C | 
                        Humidity: {prediction.humidity}%
                      </p>
                      {prediction.notes && (
                        <p className="text-sm text-gray-500 mt-1">Notes: {prediction.notes}</p>
                      )}
                    </div>
                    <div className="ml-4">
                      <CountdownTimer 
                        expiresAt={prediction.expiresAt}
                        remainingHours={prediction.remainingHours}
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                      Created: {new Date(prediction.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex space-x-2">
                      {prediction.status === 'active' && (
                        <>
                          <button
                            onClick={() => handleStatusUpdate(prediction._id, 'consumed')}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                          >
                            Mark Consumed
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(prediction._id, 'expired')}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                          >
                            Mark Expired
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodShelfLifePage; 