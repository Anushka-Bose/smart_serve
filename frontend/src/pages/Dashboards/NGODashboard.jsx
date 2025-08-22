import React, { useState, useEffect } from 'react';
import apiService from '../../services/api';

export default function NGODashboard({ user }) {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [surplusData, setSurplusData] = useState([]);
  const [donationsData, setDonationsData] = useState([]);
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
      const [leaderboard, surplus] = await Promise.all([
        apiService.getLeaderboard().catch(err => ({ data: [] })),
        apiService.getSurplus().catch(err => ({ data: [] }))
      ]);

      setLeaderboardData(leaderboard.data || []);
      setSurplusData(surplus.data || []);
      
      // Mock donations data for NGO
      setDonationsData([
        { id: 1, type: 'Food Donation', amount: '50 kg', date: '2024-01-15', status: 'Completed' },
        { id: 2, type: 'Equipment Donation', amount: '10 items', date: '2024-01-10', status: 'In Progress' },
        { id: 3, type: 'Volunteer Hours', amount: '25 hours', date: '2024-01-08', status: 'Completed' }
      ]);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Dashboard data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestDonation = async (donationData) => {
    try {
      // This would be a new API endpoint for NGO donation requests
      console.log('Requesting donation:', donationData);
      // await apiService.requestDonation(donationData);
    } catch (err) {
      setError('Failed to request donation');
      console.error('Donation request error:', err);
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Loading NGO dashboard...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>Welcome, {user?.name || 'NGO'}!</h1>
        <p>NGO Dashboard - Manage donations and track impact</p>
        {user?.membersCount && (
          <p>Organization Size: {user.membersCount} members</p>
        )}
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
        {/* Donations Section */}
        <div style={styles.card}>
          <h2>📦 Recent Donations</h2>
          {donationsData.length > 0 ? (
            <div style={styles.donationsList}>
              {donationsData.map((donation, index) => (
                <div key={index} style={styles.donationItem}>
                  <h4>{donation.type}</h4>
                  <p>Amount: {donation.amount}</p>
                  <p>Date: {donation.date}</p>
                  <span style={{
                    ...styles.status,
                    backgroundColor: donation.status === 'Completed' ? '#4CAF50' : '#FF9800'
                  }}>
                    {donation.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p style={styles.noData}>No recent donations</p>
          )}
        </div>

        {/* Available Surplus */}
        <div style={styles.card}>
          <h2>🍽️ Available Surplus</h2>
          {surplusData.length > 0 ? (
            <div style={styles.surplusList}>
              {surplusData.slice(0, 3).map((surplus, index) => (
                <div key={index} style={styles.surplusItem}>
                  <h4>{surplus.foodType}</h4>
                  <p>{surplus.weight} kg</p>
                  <p>{new Date(surplus.loggedAt).toLocaleDateString()}</p>
                  <button 
                    style={styles.requestButton}
                    onClick={() => handleRequestDonation({
                      type: 'surplus',
                      surplusId: surplus._id,
                      requestedBy: user._id
                    })}
                  >
                    Request
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p style={styles.noData}>No surplus food available</p>
          )}
        </div>

        {/* Leaderboard */}
        <div style={styles.card}>
          <h2>🏆 NGO Leaderboard</h2>
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

        {/* Quick Actions */}
        <div style={styles.card}>
          <h2>⚡ Quick Actions</h2>
          <div style={styles.actionsList}>
            <button 
              style={styles.actionButton}
              onClick={() => handleRequestDonation({
                type: 'general',
                description: 'General donation request'
              })}
            >
              Request Donation
            </button>
            <button style={styles.actionButton}>
              View All Surplus
            </button>
            <button style={styles.actionButton}>
              Report Impact
            </button>
            <button style={styles.actionButton}>
              Manage Volunteers
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
  donationsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  donationItem: {
    padding: '15px',
    backgroundColor: '#f8f9fa',
    borderRadius: '5px',
    borderLeft: '4px solid #2196F3'
  },
  status: {
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '12px',
    color: 'white',
    fontWeight: 'bold'
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
    borderLeft: '4px solid #4CAF50'
  },
  requestButton: {
    backgroundColor: '#2196F3',
    color: 'white',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    marginTop: '8px'
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