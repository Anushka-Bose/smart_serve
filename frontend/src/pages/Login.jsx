/* import React, { useState } from 'react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('student');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const handleLogin = (e) => {
    e.preventDefault();
    // In a real app, you would validate credentials with a backend
    setIsLoggedIn(true);
    setCurrentUser({ email, userType });
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setEmail('');
    setPassword('');
    setUserType('student');
  };

  if (isLoggedIn) {
    return (
      <Dashboard user={currentUser} onLogout={handleLogout} />
    );
  }

  return (
    <div style={styles.loginContainer}>
      <div style={styles.loginBox}>
        <h2 style={styles.loginTitle}>Centralized Login System</h2>
        <p style={styles.subtitle}>Sign in to access your dashboard</p>
        
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
            />
          </div>
          
          <div style={styles.inputGroup}>
            <label htmlFor="userType" style={styles.label}>User Type</label>
            <select
              id="userType"
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              style={styles.select}
            >
              <option value="student">Student</option>
              <option value="ngo">NGO</option>
              <option value="staff">Staff</option>
              <option value="organizer">Organizer</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          
          <button type="submit" style={styles.loginButton}>Login</button>
        </form>
        
        <div style={styles.demoInfo}>
          <h4>Demo Credentials:</h4>
          <p>Any email/password will work for demonstration</p>
          <p>Select different user types to see various dashboards</p>
        </div>
      </div>
    </div>
  );
};

const Dashboard = ({ user, onLogout }) => {
  const [activeOption, setActiveOption] = useState(null);
  const [apiResponse, setApiResponse] = useState('');

  const handleApiCall = (option) => {
    setActiveOption(option);
    
    // Mock API responses based on the option selected
    const mockResponses = {
      leaderboard: {
        status: 'success',
        data: [
          { rank: 1, name: 'Eco Club', points: 2450 },
          { rank: 2, name: 'Green Team', points: 2100 },
          { rank: 3, name: 'Sustainability Society', points: 1950 }
        ]
      },
      impact: {
        status: 'success',
        data: {
          mealsDonated: 1250,
          co2Reduced: 320, // kg
          peopleHelped: 560
        }
      },
      aiModel: {
        status: 'success',
        prediction: {
          estimatedImpact: 245,
          recommendedAction: 'Distribute to suburban areas',
          confidence: 0.87
        }
      },
      events: {
        status: 'success',
        data: {
          eventId: 'EVT-2023-087',
          name: 'Food Drive 2023',
          date: '2023-12-15',
          location: 'Central Park'
        }
      },
      surplus: {
        status: 'success',
        data: {
          surplusId: 'SUR-2023-026',
          foodType: 'Produce',
          weight: 120, // kg
          loggedAt: new Date().toISOString()
        }
      }
    };
    
    // Simulate API call delay
    setTimeout(() => {
      setApiResponse(JSON.stringify(mockResponses[option] || { status: 'error', message: 'Unknown endpoint' }, null, 2));
    }, 1000);
  };

  const renderDashboardOptions = () => {
    switch (user.userType) {
      case 'student':
      case 'ngo':
      case 'staff':
        return (
          <div style={styles.optionsGrid}>
            <div style={styles.optionCard} onClick={() => handleApiCall('leaderboard')}>
              <h3>View Leaderboard</h3>
              <p>Check current rankings and points</p>
            </div>
            <div style={styles.optionCard} onClick={() => handleApiCall('impact')}>
              <h3>Track Impact</h3>
              <p>Monitor your contributions</p>
            </div>
          </div>
        );
      case 'organizer':
        return (
          <div style={styles.optionsGrid}>
            <div style={styles.optionCard} onClick={() => handleApiCall('leaderboard')}>
              <h3>View Leaderboard</h3>
              <p>Check current rankings</p>
            </div>
            <div style={styles.optionCard} onClick={() => handleApiCall('impact')}>
              <h3>Track Impact</h3>
              <p>Monitor your contributions</p>
            </div>
            <div style={styles.optionCard} onClick={() => handleApiCall('aiModel')}>
              <h3>Use AI Model</h3>
              <p>Access predictive analytics</p>
            </div>
            <div style={styles.optionCard} onClick={() => handleApiCall('events')}>
              <h3>Create Events</h3>
              <p>Organize new activities</p>
            </div>
            <div style={styles.optionCard} onClick={() => handleApiCall('surplus')}>
              <h3>Log Surplus</h3>
              <p>Record excess resources</p>
            </div>
          </div>
        );
      case 'admin':
        return (
          <div style={styles.optionsGrid}>
            <div style={styles.optionCard} onClick={() => handleApiCall('leaderboard')}>
              <h3>View Leaderboard</h3>
              <p>Check current rankings</p>
            </div>
            <div style={styles.optionCard} onClick={() => handleApiCall('leaderboard')}>
              <h3>Update Leaderboard</h3>
              <p>Modify rankings data</p>
            </div>
            <div style={styles.optionCard} onClick={() => handleApiCall('impact')}>
              <h3>Track Impact</h3>
              <p>Monitor system contributions</p>
            </div>
          </div>
        );
      default:
        return <p>No options available for this user type.</p>;
    }
  };

  return (
    <div style={styles.dashboardContainer}>
      <div style={styles.dashboardHeader}>
        <h2>Welcome, {user.email}</h2>
        <p>You are logged in as: <strong>{user.userType}</strong></p>
        <button onClick={onLogout} style={styles.logoutButton}>Logout</button>
      </div>
      
      <div style={styles.dashboardContent}>
        <div style={styles.optionsPanel}>
          <h3>Available Options</h3>
          {renderDashboardOptions()}
        </div>
        
        <div style={styles.apiResponse}>
          <h3>API Response {activeOption ? `- ${activeOption}` : ''}</h3>
          <pre style={styles.responsePre}>
            {apiResponse || 'Select an option to see API response'}
          </pre>
        </div>
      </div>
    </div>
  );
};

// Styles
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
  select: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '1rem',
    backgroundColor: 'white'
  },
  loginButton: {
    padding: '0.75rem',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '1rem',
    cursor: 'pointer',
    marginTop: '1rem'
  },
  demoInfo: {
    marginTop: '1.5rem',
    padding: '1rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '5px',
    fontSize: '0.9rem'
  },
  dashboardContainer: {
    minHeight: '100vh',
    backgroundColor: '#f0f2f5',
    padding: '1rem'
  },
  dashboardHeader: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    marginBottom: '1.5rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  logoutButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#ff4757',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  dashboardContent: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1.5rem'
  },
  optionsPanel: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
  },
  optionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '1rem',
    marginTop: '1rem'
  },
  optionCard: {
    backgroundColor: '#f8f9fa',
    padding: '1rem',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    border: '1px solid #e9ecef'
  },
  apiResponse: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
  },
  responsePre: {
    backgroundColor: '#f8f9fa',
    padding: '1rem',
    borderRadius: '5px',
    overflow: 'auto',
    maxHeight: '300px',
    fontSize: '0.9rem'
  }
};

// Add hover effect with JavaScript
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    const optionCards = document.querySelectorAll('.option-card');
    optionCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-3px)';
        card.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
        card.style.backgroundColor = '#e3f2fd';
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'none';
        card.style.boxShadow = 'none';
        card.style.backgroundColor = '#f8f9fa';
      });
    });
  });
}

export default LoginPage; */

import React, { useState } from "react";

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("student");

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin({ email, password, userType });
  };

  return (
    <div>
      <h2>Centralized Login</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="email" 
          placeholder="Email"
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        <input 
          type="password" 
          placeholder="Password"
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        <select value={userType} onChange={(e) => setUserType(e.target.value)}>
          <option value="student">Student</option>
          <option value="ngo">NGO</option>
          <option value="staff">Staff</option>
          <option value="organizer">Organizer</option>
          <option value="admin">Admin</option>
          <option value="canteen">Canteen</option>
        </select>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
