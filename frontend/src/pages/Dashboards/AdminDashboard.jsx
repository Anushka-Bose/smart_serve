import React, { useState, useEffect } from 'react';
import apiService from '../../services/api';
import LogoutButton from '../../components/LogoutButton';

export default function AdminDashboard({ user }) {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [eventsData, setEventsData] = useState([]);
  const [surplusData, setSurplusData] = useState([]);
  const [mlPredictions, setMlPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');

    try {
      const [leaderboard, events, surplus, predictions] = await Promise.allSettled([
        apiService.getLeaderboard(),
        apiService.getEvents(),
        apiService.getSurplus(),
        apiService.getMLPredictions()
      ]);

      if (leaderboard.status === 'fulfilled') {
        setLeaderboardData(leaderboard.value.data || []);
      } else {
        console.error('Leaderboard fetch failed:', leaderboard.reason);
        setLeaderboardData([]);
      }

      if (events.status === 'fulfilled') {
        setEventsData(events.value.data || []);
      } else {
        console.error('Events fetch failed:', events.reason);
        setEventsData([]);
      }

      if (surplus.status === 'fulfilled') {
        setSurplusData(surplus.value.data || []);
      } else {
        console.error('Surplus fetch failed:', surplus.reason);
        setSurplusData([]);
      }

      if (predictions.status === 'fulfilled') {
        setMlPredictions(predictions.value.data || []);
      } else {
        console.error('ML Predictions fetch failed:', predictions.reason);
        setMlPredictions([]);
      }

    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Dashboard data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateLeaderboard = async (leaderboardData) => {
    try {
      await apiService.updateLeaderboard(leaderboardData);
      // Refresh leaderboard data
      const updatedLeaderboard = await apiService.getLeaderboard();
      setLeaderboardData(updatedLeaderboard.data || []);
    } catch (err) {
      setError('Failed to update leaderboard');
      console.error('Leaderboard update error:', err);
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Loading admin dashboard...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <div>
            <h1>Welcome, {user?.name || 'Admin'}!</h1>
            <p>Admin Dashboard - Full system management and analytics</p>
          </div>
          <LogoutButton />
        </div>
      </div>

      {error && (
        <div style={styles.error}>
          {error}
          <button onClick={fetchDashboardData} style={styles.retryButton}>
            Retry
          </button>
        </div>
      )}

      <div style={styles.grid}>
        {/* System Overview */}
        <div style={styles.card}>
          <h2>📊 System Overview</h2>
          <div style={styles.statsList}>
            <div style={styles.statItem}>
              <h3>Total Events</h3>
              <p>{eventsData.length} events</p>
            </div>
            <div style={styles.statItem}>
              <h3>Total Surplus</h3>
              <p>{surplusData.length} items</p>
            </div>
            <div style={styles.statItem}>
              <h3>Total Meals</h3>
              <p>{surplusData.reduce((sum, item) => sum + (item.quantity || 0), 0)} meals</p>
            </div>
          </div>
        </div>

        {/* Leaderboard Management */}
        <div style={styles.card}>
          <h2>🏆 Leaderboard Management</h2>
          {leaderboardData.length > 0 ? (
            <div style={styles.leaderboardList}>
              {leaderboardData.slice(0, 5).map((entry, index) => (
                <div key={index} style={styles.leaderboardItem}>
                  <span style={styles.rank}>#{entry.rank || index + 1}</span>
                  <span style={styles.name}>{entry.name}</span>
                  <span style={styles.points}>{entry.points} pts</span>
                </div>
              ))}
            </div>
          ) : (
            <p style={styles.noData}>No leaderboard data available</p>
          )}
        </div>

        {/* Recent Events */}
        <div style={styles.card}>
          <h2>📅 Recent Events</h2>
          {eventsData.length > 0 ? (
            <div style={styles.eventsList}>
              {eventsData.slice(0, 3).map((event, index) => (
                <div key={index} style={styles.eventItem}>
                  <h4>{event.name}</h4>
                  <p>{new Date(event.date).toLocaleDateString()}</p>
                  <p>{event.location}</p>
                </div>
              ))}
            </div>
          ) : (
            <p style={styles.noData}>No events found</p>
          )}
        </div>

        {/* ML Predictions */}
        <div style={styles.card}>
          <h2>🤖 AI Predictions</h2>
          {mlPredictions.length > 0 ? (
            <div style={styles.predictionsList}>
              {mlPredictions.slice(0, 3).map((prediction, index) => (
                <div key={index} style={styles.predictionItem}>
                  <h4>{prediction.eventName}</h4>
                  <p>Date: {new Date(prediction.eventDate).toLocaleDateString()}</p>
                  <p>Predicted Waste: {prediction.predictedWaste ? `${prediction.predictedWaste}kg` : 'N/A'}</p>
                  <p>Confidence: {prediction.confidence || 'N/A'}</p>
                </div>
              ))}
            </div>
          ) : (
            <p style={styles.noData}>No ML predictions available</p>
          )}
        </div>

        {/* Quick Actions */}
        <div style={styles.card}>
          <h2>⚡ Admin Actions</h2>
          <div style={styles.actionsList}>
            <button 
              style={styles.actionButton}
              onClick={() => handleUpdateLeaderboard({
                // Sample leaderboard update
                updates: []
              })}
            >
              Update Leaderboard
            </button>
            <button style={styles.actionButton}>
              Manage Users
            </button>
            <button style={styles.actionButton}>
              System Analytics
            </button>
            <button style={styles.actionButton}>
              View All Events
            </button>
          </div>
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
    marginBottom: '30px',
    padding: '20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '10px'
  },
  headerContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%'
  },
  loading: {
    textAlign: 'center',
    fontSize: '18px',
    padding: '40px'
  },
  error: {
    backgroundColor: '#ffebee',
    color: '#c62828',
    padding: '15px',
    borderRadius: '5px',
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
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px'
  },
  card: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    border: '1px solid #e9ecef'
  },
  statsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  statItem: {
    padding: '15px',
    backgroundColor: '#f8f9fa',
    borderRadius: '5px',
    textAlign: 'center'
  },
  leaderboardList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  leaderboardItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px',
    backgroundColor: '#f8f9fa',
    borderRadius: '5px'
  },
  rank: {
    fontWeight: 'bold',
    color: '#007bff'
  },
  name: {
    flex: 1,
    marginLeft: '10px'
  },
  points: {
    fontWeight: 'bold',
    color: '#28a745'
  },
  eventsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  eventItem: {
    padding: '15px',
    backgroundColor: '#f8f9fa',
    borderRadius: '5px',
    borderLeft: '4px solid #007bff'
  },
  noData: {
    textAlign: 'center',
    color: '#6c757d',
    fontStyle: 'italic'
  },
  actionsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  actionButton: {
    padding: '12px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'background-color 0.3s ease'
  },
  predictionsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  predictionItem: {
    padding: '15px',
    backgroundColor: '#f8f9fa',
    borderRadius: '5px',
    borderLeft: '4px solid #28a745'
  }
};