# 🤖 ML Microservice Integration

This document explains how the ML microservice API is integrated with the Smart Surplus Backend to provide AI-powered food waste predictions.

## 📋 Overview

The ML microservice (`modelapi.py`) provides food waste predictions based on event data. The backend distribution service now integrates with this ML service to:

1. **Fetch predicted food waste** for events
2. **Adjust distribution strategies** based on ML insights
3. **Store ML predictions** in the database
4. **Display AI insights** in dashboards

## 🔧 ML Service Configuration

### Environment Variables
Add to your `.env` file:
```env
ML_SERVICE_URL=http://localhost:8000
```

### ML Service Endpoint
- **URL**: `http://localhost:8000/predwaste`
- **Method**: `POST`
- **Content-Type**: `application/json`

### Request Format
```json
{
  "meals_served": 100,
  "kitchen_staff": 5,
  "past_waste_kg": 2.5,
  "special_event_1": false,
  "waste_category_GRAINS": true,
  "waste_category_MEAT": false,
  "waste_category_VEGETABLES": false,
  "city": "Mumbai"
}
```

### Response Format
```json
{
  "pred": 3.2
}
```

## 🚀 Enhanced Distribution Logic

### Key Features Added:

1. **ML Prediction Integration**
   - Fetches waste predictions for each event
   - Adjusts distribution strategy based on predicted waste
   - Stores ML insights in database

2. **Historical Data Analysis**
   - Calculates past waste from previous 7 days
   - Uses average waste for ML predictions
   - Converts meals to kg (1 meal ≈ 0.3 kg)

3. **Smart Distribution**
   - High waste prediction → More aggressive distribution
   - Low waste prediction → Standard distribution
   - ML insights included in email notifications

### Distribution Rules (Enhanced):

| Surplus Quantity | Distribution Target | ML Adjustment |
|------------------|-------------------|---------------|
| ≤ 5 meals | Students + Staff | Standard |
| 6-15 meals | Canteen | Standard |
| 16-25 meals | 1 NGO | Enhanced if ML predicts high waste |
| > 25 meals | 2 NGOs | Enhanced if ML predicts high waste |

## 📊 Database Schema Updates

### Surplus Model - New Fields:
```javascript
// ML Prediction fields
mlPredictedWaste: { type: Number }, // Predicted waste in kg
mlConfidence: { type: String }, // ML model confidence level
mlPredictionDate: { type: Date, default: Date.now } // When prediction was made
```

## 🔌 API Endpoints

### New Endpoint: Get ML Predictions
```
GET /api/surplus/predictions
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "eventId": "...",
      "eventName": "College Fest",
      "eventDate": "2024-01-15T10:00:00.000Z",
      "predictedWaste": 3.2,
      "confidence": "high",
      "success": true
    }
  ],
  "message": "ML predictions retrieved successfully"
}
```

## 🎯 Frontend Integration

### API Service - New Method:
```javascript
// ML Predictions
async getMLPredictions() {
  return this.makeRequest('/surplus/predictions', { method: 'GET' });
}
```

### Admin Dashboard - ML Insights:
- Displays AI predictions for upcoming events
- Shows predicted waste amounts
- Indicates confidence levels

## 🔄 Workflow

1. **Event Creation** → Event data stored with ML-relevant fields
2. **Surplus Logging** → ML service called for waste prediction
3. **Distribution Logic** → Enhanced with ML insights
4. **Email Notifications** → Include AI predictions
5. **Dashboard Display** → Show ML insights to admins

## 🛠️ Error Handling

### ML Service Failures:
- Graceful fallback to standard distribution
- Error logging for debugging
- No impact on core functionality
- Email notifications still work

### Timeout Handling:
- 10-second timeout for ML API calls
- Automatic fallback if service unavailable
- Retry mechanism for transient failures

## 📈 Analytics & Monitoring

### Logging:
```javascript
console.log("🤖 Calling ML service with data:", predictionData);
console.log("📊 ML Predicted waste:", predictedWaste, "kg");
console.log("🧠 ML Prediction: ${mlInsights.predictedWaste}kg waste predicted");
```

### Metrics to Track:
- ML service response time
- Prediction accuracy over time
- Distribution efficiency improvements
- Error rates and fallback usage

## 🔒 Security Considerations

- ML service runs on separate port (8000)
- No sensitive data sent to ML service
- API calls use timeout protection
- Error handling prevents data leaks

## 🚀 Getting Started

1. **Start ML Service:**
   ```bash
   cd ml_ms
   python modelapi.py
   ```

2. **Configure Environment:**
   ```env
   ML_SERVICE_URL=http://localhost:8000
   ```

3. **Test Integration:**
   - Create an event with ML-relevant data
   - Log surplus for the event
   - Check logs for ML predictions
   - Verify distribution logic adjustments

## 📝 Notes

- **No Python Code Changes**: The ML service (`modelapi.py`) remains unchanged
- **Backward Compatibility**: System works without ML service
- **Notification Logic Preserved**: All existing email notifications work as before
- **Gradual Rollout**: ML features can be enabled/disabled via environment variables

## 🐛 Troubleshooting

### Common Issues:

1. **ML Service Not Responding**
   - Check if service is running on port 8000
   - Verify `ML_SERVICE_URL` environment variable
   - Check service logs for errors

2. **Predictions Not Showing**
   - Verify event has required fields (meals_served, kitchen_staff, etc.)
   - Check network connectivity to ML service
   - Review backend logs for API call errors

3. **High Response Times**
   - ML service may be slow on first request
   - Consider caching predictions
   - Monitor service performance

## 📞 Support

For ML service issues, check the `ml_ms/` directory and ensure the Python service is running correctly. The backend integration is designed to be resilient to ML service failures.
