import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
//import './LoginStudent.css';

const LoginStudent = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    studentId: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Simulate API call
      const response = await fetch('/api/auth/login/student', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const userData = await response.json();
        onLogin({ ...userData, role: 'student' });
        navigate('/dashboard/student');
      } else {
        setError('Invalid student credentials. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container student-login">
      <div className="login-card">
        <div className="login-header">
          <div className="role-icon">
            <i className="fas fa-graduation-cap"></i>
          </div>
          <h1>Student Login</h1>
          <p>Access surplus food and track your impact</p>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Student Email</label>
            <div className="input-icon">
              <i className="fas fa-envelope"></i>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your student email"
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="studentId">Student ID</label>
            <div className="input-icon">
              <i className="fas fa-id-card"></i>
              <input
                type="text"
                id="studentId"
                name="studentId"
                value={formData.studentId}
                onChange={handleChange}
                placeholder="Enter your student ID"
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-icon">
              <i className="fas fa-lock"></i>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
            </div>
          </div>
          
          <button type="submit" disabled={isLoading} className="submit-btn">
            {isLoading ? (
              <>
                <div className="spinner"></div>
                Signing In...
              </>
            ) : (
              'Sign In as Student'
            )}
          </button>
        </form>
        
        <div className="login-footer">
          <p>Don't have a student account? <a href="/signup?role=student">Sign up</a></p>
          <a href="/forgot-password" className="forgot-link">Forgot password?</a>
        </div>
      </div>
      
      <div className="login-features">
        <h3>Student Benefits</h3>
        <div className="feature-list">
          <div className="feature-item">
            <i className="fas fa-utensils"></i>
            <span>Claim surplus food from events</span>
          </div>
          <div className="feature-item">
            <i className="fas fa-trophy"></i>
            <span>Earn points on the leaderboard</span>
          </div>
          <div className="feature-item">
            <i className="fas fa-chart-line"></i>
            <span>Track your environmental impact</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginStudent;