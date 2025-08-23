import React, { useState } from 'react';
import apiService from '../services/api';

const LoginAdmin = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await apiService.login(email, password, 'admin');
      
      // Store token and user data
      apiService.setAuthToken(response.token);
      
      const userData = {
        ...response.user,
        role: 'admin'
      };
      
      // Call the parent's onLogin function
      onLogin(userData);
    } catch (error) {
      setError(error.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.loginContainer}>
      <div style={styles.loginBox}>
        <h2 style={styles.loginTitle}>Admin Login</h2>
        <p style={styles.subtitle}>Sign in to access the admin dashboard</p>
        
        {error && (
          <div style={styles.errorMessage}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleLogin} style={styles.loginForm}>
          <div style={styles.inputGroup}>
            <label htmlFor="email" style={styles.label}>Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              placeholder="Enter your email"
              required
              disabled={isLoading}
            />
          </div>
          
          <div style={styles.inputGroup}>
            <label htmlFor="password" style={styles.label}>Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              placeholder="Enter your password"
              required
              disabled={isLoading}
            />
          </div>
          
          <button 
            type="submit" 
            style={{
              ...styles.loginButton,
              ...(isLoading && styles.loginButtonDisabled)
            }}
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login as Admin'}
          </button>
        </form>
        
        <div style={styles.demoInfo}>
          <h4>Admin Access:</h4>
          <p>Use your admin credentials to access full system management</p>
          <p>Make sure your backend server is running on port 4000</p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  loginContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f0f2f5',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  },
  loginBox: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '10px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '400px'
  },
  loginTitle: {
    textAlign: 'center',
    marginBottom: '0.5rem',
    color: '#333'
  },
  subtitle: {
    textAlign: 'center',
    color: '#666',
    marginBottom: '1.5rem'
  },
  errorMessage: {
    backgroundColor: '#ffebee',
    color: '#c62828',
    padding: '0.75rem',
    borderRadius: '5px',
    marginBottom: '1rem',
    border: '1px solid #ffcdd2'
  },
  loginForm: {
    display: 'flex',
    flexDirection: 'column'
  },
  inputGroup: {
    marginBottom: '1rem'
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: '500',
    color: '#333'
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '1rem'
  },
  loginButton: {
    padding: '0.75rem',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '1rem',
    cursor: 'pointer',
    marginTop: '1rem',
    transition: 'background-color 0.3s ease'
  },
  loginButtonDisabled: {
    backgroundColor: '#cccccc',
    cursor: 'not-allowed'
  },
  demoInfo: {
    marginTop: '1.5rem',
    padding: '1rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '5px',
    fontSize: '0.9rem'
  }
};

export default LoginAdmin; 