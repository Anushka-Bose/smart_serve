# 🍽️ Food Shelf Life Prediction System

## Overview

The Food Shelf Life Prediction System is a comprehensive solution that predicts how long food items will remain safe to eat based on environmental conditions (temperature and humidity). It integrates with the existing Smart Serve platform to help reduce food waste and ensure food safety.

## 🚀 Features

### 1. Food Shelf Life Prediction
- **Real-time Countdown Timer**: Shows hours, minutes, and seconds until food expires
- **Environmental Factors**: Considers temperature and humidity in predictions
- **Food Categories**: Supports GRAINS, MEAT, VEGETABLES, DAIRY, and FRUITS
- **Risk Level Assessment**: LOW, MEDIUM, HIGH risk indicators
- **Visual Countdown**: Beautiful countdown timer with color-coded risk levels

### 2. Enhanced Leaderboard
- **Modern UI**: Sexy, animated leaderboard with gradients and hover effects
- **Time Filters**: All time, monthly, and weekly views
- **Medal System**: Gold, silver, bronze medals for top performers
- **Progress Bars**: Visual progress indicators for top 3 positions
- **Statistics**: Summary cards showing total entries, positive points, and actions

### 3. Integration Features
- **ML API Integration**: FastAPI-based prediction service
- **Backend Integration**: Node.js/Express backend with MongoDB
- **Frontend Integration**: React-based modern UI
- **Real-time Updates**: Live countdown timers and status updates

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   ML API        │
│   (React)       │◄──►│   (Node.js)     │◄──►│   (FastAPI)     │
│   Port: 5173    │    │   Port: 5000    │    │   Port: 8001    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   User Interface│    │   MongoDB       │    │   Prediction    │
│   Components    │    │   Database      │    │   Algorithms    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📁 File Structure

### Backend (last-try-backend/)
```
├── models/
│   └── FoodShelfLife.js          # Food shelf life model
├── controllers/
│   └── foodShelfLifeController.js # Shelf life controller
├── routes/
│   └── foodShelfLife.js          # Shelf life routes
└── app.js                        # Updated with new routes
```

### Frontend (frontend/)
```
├── src/
│   ├── services/
│   │   └── shelfLifeService.js   # API service functions
│   ├── comp/
│   │   ├── CountdownTimer.jsx    # Countdown timer component
│   │   └── Leaderboard.jsx       # Enhanced leaderboard
│   └── pages/
│       └── FoodShelfLifePage.jsx # Main shelf life page
```

### ML API (ml_ms/)
```
├── shelf_life_predictor.py       # FastAPI prediction service
└── requirements.txt              # Python dependencies
```

## 🛠️ Installation & Setup

### 1. Install Dependencies

**Backend:**
```bash
cd last-try-backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

**ML API:**
```bash
cd ml_ms
pip install -r requirements.txt
```

### 2. Start All Services

**Option 1: Use the batch script (Windows)**
```bash
start_services.bat
```

**Option 2: Start manually**

Terminal 1 (ML API):
```bash
cd ml_ms
python shelf_life_predictor.py
```

Terminal 2 (Backend):
```bash
cd last-try-backend
npm run dev
```

Terminal 3 (Frontend):
```bash
cd frontend
npm run dev
```

### 3. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **ML API**: http://localhost:8001
- **Food Shelf Life Page**: http://localhost:5173/shelf-life
- **Leaderboard**: http://localhost:5173/leaderboard

## 🎯 How to Use

### Food Shelf Life Prediction

1. **Navigate to Shelf Life Page**
   - Go to `/shelf-life` or click the link in your dashboard

2. **Create New Prediction**
   - Click "Add New Prediction"
   - Select food category (GRAINS, MEAT, VEGETABLES, DAIRY, FRUITS)
   - Enter food item name
   - Set temperature (°C) and humidity (%)
   - Add optional notes
   - Click "Predict Shelf Life"

3. **View Predictions**
   - See real-time countdown timer
   - Monitor risk levels (LOW/MEDIUM/HIGH)
   - Track all your predictions
   - Mark items as consumed or expired

### Leaderboard

1. **Access Leaderboard**
   - Go to `/leaderboard` or click the leaderboard link

2. **Filter by Time**
   - All Time: Complete history
   - This Month: Current month's data
   - This Week: Current week's data

3. **View Statistics**
   - Total entries
   - Positive points earned
   - Number of positive actions

## 🔧 API Endpoints

### Food Shelf Life API

**POST** `/api/shelf-life/predict`
- Create new shelf life prediction

**GET** `/api/shelf-life/user`
- Get user's predictions

**GET** `/api/shelf-life/active`
- Get all active predictions

**PATCH** `/api/shelf-life/:id/status`
- Update prediction status

**GET** `/api/shelf-life/categories`
- Get available food categories

**GET** `/api/shelf-life/stats`
- Get user statistics

### ML API Endpoints

**POST** `/predict-shelf-life`
- Predict shelf life based on food item, temperature, humidity

**GET** `/food-categories`
- Get available food categories and items

## 🎨 UI Features

### Countdown Timer
- Real-time countdown with hours, minutes, seconds
- Color-coded risk levels
- Expired state handling
- Smooth animations

### Leaderboard
- Gradient backgrounds
- Medal icons for top positions
- Progress bars for top 3
- Hover effects and animations
- Responsive design

### Food Shelf Life Page
- Modern card-based layout
- Statistics dashboard
- Form validation
- Loading states
- Error handling

## 🔒 Security Features

- JWT authentication for all API calls
- Protected routes
- Input validation
- Error handling
- CORS configuration

## 📊 Data Models

### FoodShelfLife Schema
```javascript
{
  foodItem: String,
  foodCategory: String,
  temperature: Number,
  humidity: Number,
  predictedShelfLife: Number,
  expiresAt: Date,
  isSafeToEat: Boolean,
  remainingHours: Number,
  createdBy: ObjectId,
  event: ObjectId,
  notes: String,
  status: String // 'active', 'expired', 'consumed'
}
```

## 🚀 Future Enhancements

1. **IoT Integration**: Real-time temperature/humidity sensors
2. **Mobile App**: React Native mobile application
3. **Notifications**: Push notifications for expiring food
4. **Analytics**: Advanced analytics and reporting
5. **Machine Learning**: Improved prediction algorithms
6. **Barcode Scanning**: Scan food items for automatic detection

## 🐛 Troubleshooting

### Common Issues

1. **ML API not starting**
   - Check Python version (3.8+ required)
   - Install dependencies: `pip install -r requirements.txt`

2. **Backend connection errors**
   - Verify MongoDB is running
   - Check environment variables
   - Ensure port 5000 is available

3. **Frontend build errors**
   - Clear node_modules and reinstall
   - Check Node.js version (16+ required)
   - Verify all dependencies are installed

### Logs

- **ML API**: Check terminal output for FastAPI logs
- **Backend**: Check terminal output for Express logs
- **Frontend**: Check browser console for React errors

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review the API documentation
3. Check browser console for errors
4. Verify all services are running

## 🎉 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**Made with ❤️ for reducing food waste and promoting sustainability** 