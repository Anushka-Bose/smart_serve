# Smart Surplus Management System

A full-stack application for managing surplus food and events with role-based dashboards.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd smart-surplus-backend
   ```

2. **Install Backend Dependencies**
   ```bash
   cd last-try-backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Configure Environment Variables**

   Backend (`.env` file in `last-try-backend/`):
   ```env
   MONGODB_URL=your_mongodb_connection_string
   PORT=4000
   JWT_SECRET=your_jwt_secret
   EMAIL_HOST=smtp.example.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_password
   WEATHER_API_KEY=your_weather_api_key
   CITY=Kolkata
   BACKEND_URL=http://localhost:4000
   ```

   Frontend (`.env` file in `frontend/`):
   ```env
   VITE_API_BASE_URL=http://localhost:4000/api
   ```

5. **Start the Application**

   **Option 1: Start Backend and Frontend Separately**
   
   Terminal 1 (Backend):
   ```bash
   cd last-try-backend
   npm run dev
   ```
   
   Terminal 2 (Frontend):
   ```bash
   cd frontend
   npm run dev
   ```

   **Option 2: Use the provided scripts**
   
   ```bash
   # Start backend
   npm run backend
   
   # Start frontend (in another terminal)
   npm run frontend
   ```

6. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:4000

## 🏗️ Architecture

### Backend (Node.js + Express)
- **Port**: 4000
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT tokens
- **Features**:
  - User authentication (login/signup)
  - Role-based access control
  - Events management
  - Surplus food tracking
  - Leaderboard system
  - Email notifications

### Frontend (React + Vite)
- **Port**: 5173
- **Framework**: React 19
- **Routing**: React Router DOM
- **Features**:
  - Responsive design
  - Role-based dashboards
  - Real-time data integration
  - Modern UI components

## 👥 User Roles

1. **Student**: View events, track impact, log surplus
2. **NGO**: Manage donations, view leaderboard
3. **Staff**: Access staff-specific features
4. **Organiser**: Create and manage events
5. **Canteen**: Log surplus food
6. **Admin**: Full system access and management

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `POST /api/auth/logout` - User logout

### Events
- `GET /api/events` - Get all events
- `POST /api/events` - Create new event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

### Surplus
- `GET /api/surplus` - Get surplus data
- `POST /api/surplus` - Log new surplus
- `PUT /api/surplus/:id` - Update surplus
- `DELETE /api/surplus/:id` - Delete surplus

### Leaderboard
- `GET /api/leaderboard` - Get leaderboard data
- `PUT /api/leaderboard` - Update leaderboard

## 🔐 Authentication

The application uses JWT tokens for authentication:
- Tokens are stored in localStorage
- Automatic token inclusion in API requests
- Role-based route protection

## 📱 Features

### Dashboard Features
- **Real-time Data**: Live updates from backend APIs
- **Role-based Views**: Different dashboards for each user type
- **Interactive Components**: Clickable cards and buttons
- **Error Handling**: Graceful error display and retry mechanisms

### API Integration
- **Centralized API Service**: All backend communication through `apiService`
- **Error Handling**: Comprehensive error handling and user feedback
- **Loading States**: Loading indicators for better UX
- **Token Management**: Automatic token handling and refresh

## 🛠️ Development

### Backend Development
```bash
cd last-try-backend
npm run dev  # Starts with nodemon for auto-reload
```

### Frontend Development
```bash
cd frontend
npm run dev  # Starts Vite dev server
```

### Database
The application uses MongoDB. Make sure your MongoDB instance is running and the connection string is correctly configured in the `.env` file.

## 🚨 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure the backend CORS configuration includes your frontend URL
   - Check that both servers are running on the correct ports

2. **Database Connection Issues**
   - Verify your MongoDB connection string
   - Ensure MongoDB is running
   - Check network connectivity

3. **Authentication Issues**
   - Clear localStorage and try logging in again
   - Check JWT secret configuration
   - Verify user credentials in the database

4. **Port Conflicts**
   - Backend runs on port 4000
   - Frontend runs on port 5173
   - Ensure these ports are available

### Debug Mode
Enable debug logging by setting `NODE_ENV=development` in your backend `.env` file.

## 📝 License

This project is licensed under the ISC License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For support and questions, please contact the development team or create an issue in the repository.

