
import React, { useState, useEffect } from 'react';
import apiService from '../../services/api';

export default function StudentDashboard({ user }) {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [eventsData, setEventsData] = useState([]);
  const [surplusData, setSurplusData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');

    try {
      // Fetch data from multiple endpoints
      const [leaderboard, events, surplus] = await Promise.all([
        apiService.getLeaderboard().catch(err => ({ data: [] })),
        apiService.getEvents().catch(err => ({ data: [] })),
        apiService.getSurplus().catch(err => ({ data: [] }))
      ]);

      setLeaderboardData(leaderboard.data || []);
      setEventsData(events.data || []);
      setSurplusData(surplus.data || []);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Dashboard data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogSurplus = async (surplusData) => {
    try {
      await apiService.createSurplus(surplusData);
      // Refresh surplus data
      const updatedSurplus = await apiService.getSurplus();
      setSurplusData(updatedSurplus.data || []);
    } catch (err) {
      setError('Failed to log surplus');
      console.error('Surplus creation error:', err);
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>Welcome, {user?.name || 'Student'}!</h1>
        <p>Student Dashboard - Track your impact and stay updated</p>
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
        {/* Leaderboard Section */}
        <div style={styles.card}>
          <h2>🏆 Leaderboard</h2>
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

        {/* Events Section */}
        <div style={styles.card}>
          <h2>📅 Upcoming Events</h2>
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
            <p style={styles.noData}>No upcoming events</p>
          )}
        </div>

        {/* Surplus Section */}
        <div style={styles.card}>
          <h2>🍽️ Recent Surplus</h2>
          {surplusData.length > 0 ? (
            <div style={styles.surplusList}>
              {surplusData.slice(0, 3).map((surplus, index) => (
                <div key={index} style={styles.surplusItem}>
                  <h4>{surplus.foodType}</h4>
                  <p>{surplus.weight} kg</p>
                  <p>{new Date(surplus.loggedAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          ) : (
            <p style={styles.noData}>No recent surplus data</p>
          )}
        </div>

        {/* Quick Actions */}
        <div style={styles.card}>
          <h2>⚡ Quick Actions</h2>
          <div style={styles.actionsList}>
            <button 
              style={styles.actionButton}
              onClick={() => handleLogSurplus({
                foodType: 'Sample Food',
                weight: 10,
                description: 'Sample surplus entry'
              })}
            >
              Log Surplus
            </button>
            <button style={styles.actionButton}>
              View All Events
            </button>
            <button style={styles.actionButton}>
              Check Impact
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
  surplusList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  surplusItem: {
    padding: '15px',
    backgroundColor: '#f8f9fa',
    borderRadius: '5px',
    borderLeft: '4px solid #28a745'
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
  }
};
=======
export default function StudentDashboard(){
  return (<>
      
  </>)
}
>>>>>>> cf9f12238f033d7a1c0dad4ca49e53fb30c10a14
