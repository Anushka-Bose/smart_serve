import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './comp/LandingPageComp/Header';
import Footer from './comp/LandingPageComp/Footer';
import Sidebar from './comp/LandingPageComp/Sidebar';
import LandingPage from './comp/LandingPageComp/LandingPage';
import LoginPage from './pages/Login';
import Signup from './pages/SignUp';
import LoginStudent from './pages/LoginStudent';
import LoginNGO from './pages/LoginNGO';
import LoginStaff from './pages/LoginStaff';
import LoginOrganiser from './pages/LoginOrganiser';
import LoginCanteen from './pages/LoginCanteen';
import LoginAdmin from './pages/LoginAdmin';
import StudentDashboard from './pages/Dashboards/StudentDashboard';
import NgoDashboard from './pages/Dashboards/NGODashboard';
import StaffDashboard from './pages/Dashboards/StaffDashboard';
import OrganiserDashboard from './pages/Dashboards/OrganiserDashboard';
import CanteenDashboard from './pages/Dashboards/CanteenDashboard';
import AdminDashboard from './pages/Dashboards/AdminDashboard';
import apiService from './services/api';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarVisible, setSidebarVisible] = useState(false);

  useEffect(() => {
    // Check if user is logged in on app load
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (userData && token) {
      setUser(JSON.parse(userData));
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = async () => {
    try {
      // Call logout API
      await apiService.logout();
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      // Clear local state regardless of API call success
      setUser(null);
      localStorage.removeItem('user');
      apiService.removeAuthToken();
      setSidebarVisible(false);
    }
  };

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  // Check if current route is a dashboard
  const isDashboard = window.location.pathname.includes('/dashboard');

  return (
    <Router>
      <div className="App">
        <Header user={user} onLogout={handleLogout} onMenuToggle={toggleSidebar} />
        
        <div className="main-container">
          {/* Show sidebar only when logged in and on dashboard pages */}
          {user && isDashboard && (
            <Sidebar 
              user={user} 
              isVisible={sidebarVisible} 
              onClose={() => setSidebarVisible(false)} 
            />
          )}
          
          <div className={`content ${isDashboard ? 'dashboard-content' : ''}`}>
            <Routes>
              {/* Public Routes */}
              <Route 
                path="/" 
                element={user ? <Navigate to={`/dashboard/${user.role}`} /> : <LandingPage />} 
              />
              
              {/* Unified Login Route */}
              <Route 
                path="/login" 
                element={user ? <Navigate to={`/dashboard/${user.role}`} /> : <LoginPage onLogin={handleLogin} />} 
              />
              
              {/* Role-specific Login Routes (for direct access) */}
              <Route 
                path="/login/student" 
                element={user ? <Navigate to="/dashboard/student" /> : <LoginStudent onLogin={handleLogin} />} 
              />
              <Route 
                path="/login/ngo" 
                element={user ? <Navigate to="/dashboard/ngo" /> : <LoginNGO onLogin={handleLogin} />} 
              />
              <Route 
                path="/login/staff" 
                element={user ? <Navigate to="/dashboard/staff" /> : <LoginStaff onLogin={handleLogin} />} 
              />
              <Route 
                path="/login/organiser" 
                element={user ? <Navigate to="/dashboard/organiser" /> : <LoginOrganiser onLogin={handleLogin} />} 
              />
              <Route 
                path="/login/canteen" 
                element={user ? <Navigate to="/dashboard/canteen" /> : <LoginCanteen onLogin={handleLogin} />} 
              />
              <Route 
                path="/login/admin" 
                element={user ? <Navigate to="/dashboard/admin" /> : <LoginAdmin onLogin={handleLogin} />} 
              />
              
              {/* Signup Route */}
              <Route 
                path="/signup" 
                element={user ? <Navigate to={`/dashboard/${user.role}`} /> : <Signup onLogin={handleLogin} />} 
              />
              
              {/* Dashboard Routes - Protected */}
              <Route 
                path="/dashboard/student" 
                element={user ? <StudentDashboard user={user} /> : <Navigate to="/login" />} 
              />
              <Route 
                path="/dashboard/ngo" 
                element={user ? <NgoDashboard user={user} /> : <Navigate to="/login" />} 
              />
              <Route 
                path="/dashboard/staff" 
                element={user ? <StaffDashboard user={user} /> : <Navigate to="/login" />} 
              />
              <Route 
                path="/dashboard/organiser" 
                element={user ? <OrganiserDashboard user={user} /> : <Navigate to="/login" />} 
              />
              <Route 
                path="/dashboard/canteen" 
                element={user ? <CanteenDashboard user={user} /> : <Navigate to="/login" />} 
              />
              <Route 
                path="/dashboard/admin" 
                element={user ? <AdminDashboard user={user} /> : <Navigate to="/login" />} 
              />
              
              {/* Fallback Route */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </div>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;