import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../../services/api';

export default function OrganiserDashboard({ user }) {
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
          userType: 'organiser'
        })
      });
      
      const impactData = await response.json();
      console.log('Impact data:', impactData);
      
      // Show impact data in alert
      alert(`Your organiser impact: ${impactData.impact || 'No data available'}`);
    } catch (err) {
      setError('Failed to track impact');
      console.error('Impact tracking error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUseAIModel = async () => {
    try {
      setLoading(true);
      // Navigate to food shelf life prediction page
      navigate('/shelf-life');
    } catch (err) {
      setError('Failed to access AI model');
      console.error('AI model access error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvents = async () => {
    try {
      setLoading(true);
      // Create event via POST API
      const response = await apiService.post('/events/create', {
        name: 'Sample Event',
        date: new Date().toISOString(),
        location: 'Sample Location',
        description: 'Sample event description'
      });
      
      alert('Event created successfully!');
    } catch (err) {
      setError('Failed to create event');
      console.error('Event creation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogSurplus = async () => {
    try {
      setLoading(true);
      // Log surplus via POST API
      const response = await apiService.post('/surplus/log', {
        foodItem: 'Sample Food',
        quantity: 10,
        isVeg: true,
        eventId: 'sample-event-id'
      });
      
      alert('Surplus logged successfully!');
    } catch (err) {
      setError('Failed to log surplus');
      console.error('Surplus logging error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePredictSurplus = async () => {
    try {
      setLoading(true);
      // Call the surplus prediction FastAPI endpoint
      const response = await fetch('http://localhost:8001/predict-surplus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventName: 'Sample Event',
          guestCount: 150,
          eventType: 'corporate',
          mealType: 'lunch',
          duration: 4
        })
      });
      
      const predictionData = await response.json();
      console.log('Surplus prediction data:', predictionData);
      
      // Show prediction results in alert
      const message = `
Surplus Prediction Results:
Event: ${predictionData.eventName}
Guests: ${predictionData.guestCount}
Predicted Surplus: ${predictionData.predictedSurplus}kg (${predictionData.surplusPercentage}%)
Estimated Waste: ${predictionData.estimatedWaste}kg
Potential Savings: $${predictionData.potentialSavings}

Recommended Actions:
${predictionData.recommendedActions.join('\n')}
      `;
      
      alert(message);
    } catch (err) {
      setError('Failed to predict surplus');
      console.error('Surplus prediction error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>Welcome, {user?.name || 'Organiser'}!</h1>
        <p>Organiser Dashboard - Choose your action</p>
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
            See the top performers and track rankings across all user types
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
            Monitor your events' contribution to food waste reduction
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

        {/* Use AI Model Option */}
        <div style={styles.optionCard} onClick={handleUseAIModel}>
          <div style={styles.optionIcon}>🤖</div>
          <h3 style={styles.optionTitle}>Use AI Model</h3>
          <p style={styles.optionDescription}>
            Predict food shelf life using our advanced AI model
          </p>
          <button 
            style={{
              ...styles.optionButton,
              ...(loading && styles.buttonDisabled)
            }}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Use AI Model'}
          </button>
        </div>

        {/* Create Events Option */}
        <div style={styles.optionCard} onClick={handleCreateEvents}>
          <div style={styles.optionIcon}>📅</div>
          <h3 style={styles.optionTitle}>Create Events</h3>
          <p style={styles.optionDescription}>
            Create new events and manage event details
          </p>
          <button 
            style={{
              ...styles.optionButton,
              ...(loading && styles.buttonDisabled)
            }}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Create Events'}
          </button>
        </div>

        {/* Log Surplus Option */}
        <div style={styles.optionCard} onClick={handleLogSurplus}>
          <div style={styles.optionIcon}>🍽️</div>
          <h3 style={styles.optionTitle}>Log Surplus</h3>
          <p style={styles.optionDescription}>
            Log surplus food from your events for redistribution
          </p>
          <button 
            style={{
              ...styles.optionButton,
              ...(loading && styles.buttonDisabled)
            }}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Log Surplus'}
          </button>
        </div>

        {/* Predict Surplus Option */}
        <div style={styles.optionCard} onClick={handlePredictSurplus}>
          <div style={styles.optionIcon}>🔮</div>
          <h3 style={styles.optionTitle}>Predict Surplus</h3>
          <p style={styles.optionDescription}>
            Predict surplus based on event details and guest count
          </p>
          <button 
            style={{
              ...styles.optionButton,
              ...(loading && styles.buttonDisabled)
            }}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Predict Surplus'}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    maxWidth: '1400px',
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
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '20px',
    padding: '20px 0'
  },
  optionCard: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '15px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    border: '1px solid #e9ecef',
    textAlign: 'center',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    cursor: 'pointer'
  },
  optionCardhover: {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 30px rgba(0,0,0,0.15)'
  },
  optionIcon: {
    fontSize: '3.5rem',
    marginBottom: '15px'
  },
  optionTitle: {
    fontSize: '1.3rem',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '12px'
  },
  optionDescription: {
    color: '#666',
    lineHeight: '1.5',
    marginBottom: '20px',
    fontSize: '0.95rem'
  },
  optionButton: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'background-color 0.3s ease'
  },
  buttonDisabled: {
    backgroundColor: '#cccccc',
    cursor: 'not-allowed'
  }
};