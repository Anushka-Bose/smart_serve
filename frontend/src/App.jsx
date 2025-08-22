import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './comp/LandingPageComp/Header';
import Footer from './comp/LandingPageComp/Footer';
import Sidebar from './comp/LandingPageComp/Sidebar';
import LandingPage from './comp/LandingPageComp/LandingPage';
import LoginPage from './pages/Login';
import Signup from './pages/SignUp';
import StudentDashboard from './pages/Dashboards/StudentDashboard';
import NgoDashboard from './pages/Dashboards/NGODashboard';
import StaffDashboard from './pages/Dashboards/StaffDashboard';
import OrganiserDashboard from './pages/Dashboards/OrganiserDashboard';
import CanteenDashboard from './pages/Dashboards/CanteenDashboard';
import AdminDashboard from './pages/Dashboards/AdminDashboard';
import './App.css';

function AppContent() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const location = useLocation();
  const isDashboard = location.pathname.includes('/dashboard');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    setSidebarVisible(false);
  };

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="App">
      <Header user={user} onLogout={handleLogout} onMenuToggle={toggleSidebar} />

      <div className="main-container">
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

            <Route
              path="/login"
              element={user ? <Navigate to={`/dashboard/${user.role}`} /> : <LoginPage onLogin={handleLogin} />}
            />

            <Route
              path="/signup"
              element={user ? <Navigate to={`/dashboard/${user.role}`} /> : <Signup onLogin={handleLogin} />}
            />

            {/* Protected Dashboard Routes */}
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

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
