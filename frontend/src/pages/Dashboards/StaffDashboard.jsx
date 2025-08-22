import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../../services/api';

export default function StaffDashboard({ user }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleViewLeaderboard = async () => {
    try {
      setLoading(true);
      // Navigate to leaderboard page
      navigate('/leaderboard');
    } catch (err) {
      setError('Failed to navigate to leaderboard');
      console.error('Navigation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTrackImpact = async () => {
    try {
      setLoading(true);
      // Fetch impact data via FastAPI
      const response = await fetch('http://localhost:8001/track-impact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          userType: 'staff'
        })
      });
      
      const impactData = await response.json();
      console.log('Impact data:', impactData);
      
      // Show impact data in alert
      alert(`Your staff impact: ${impactData.impact || 'No data available'}`);
    } catch (err) {
      setError('Failed to track impact');
      console.error('Impact tracking error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>Welcome, {user?.name || 'Staff'}!</h1>
        <p>Staff Dashboard - Choose your action</p>
      </div>

      {error && (
        <div style={styles.error}>
          {error}
          <button onClick={() => setError('')} style={styles.retryButton}>
            Dismiss
          </button>
        </div>
      )}

      <div style={styles.optionsGrid}>
        {/* View Leaderboard Option */}
        <div style={styles.optionCard} onClick={handleViewLeaderboard}>
          <div style={styles.optionIcon}>🏆</div>
          <h3 style={styles.optionTitle}>View Leaderboard</h3>
          <p style={styles.optionDescription}>
            See the top performers and track your ranking among students, NGOs, and staff
          </p>
          <button 
            style={{
              ...styles.optionButton,
              ...(loading && styles.buttonDisabled)
            }}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'View Leaderboard'}
          </button>
        </div>

        {/* Track Impact Option */}
        <div style={styles.optionCard} onClick={handleTrackImpact}>
          <div style={styles.optionIcon}>📊</div>
          <h3 style={styles.optionTitle}>Track Impact</h3>
          <p style={styles.optionDescription}>
            Monitor your contribution to food waste reduction and see your environmental impact
          </p>
          <button 
            style={{
              ...styles.optionButton,
              ...(loading && styles.buttonDisabled)
            }}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Track Impact'}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px',
    padding: '30px',
    backgroundColor: '#f8f9fa',
    borderRadius: '15px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  },
  error: {
    backgroundColor: '#ffebee',
    color: '#c62828',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  retryButton: {
    backgroundColor: '#c62828',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  optionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '30px',
    padding: '20px 0'
  },
  optionCard: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '15px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    border: '1px solid #e9ecef',
    textAlign: 'center',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    cursor: 'pointer'
  },
  optionCard:hover: {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 30px rgba(0,0,0,0.15)'
  },
  optionIcon: {
    fontSize: '4rem',
    marginBottom: '20px'
  },
  optionTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '15px'
  },
  optionDescription: {
    color: '#666',
    lineHeight: '1.6',
    marginBottom: '25px'
  },
  optionButton: {
    padding: '12px 24px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '500',
    transition: 'background-color 0.3s ease'
  },
  buttonDisabled: {
    backgroundColor: '#cccccc',
    cursor: 'not-allowed'
  }
};