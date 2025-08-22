import React, { useState, useEffect } from 'react';
import apiService from '../../services/api';
import LogoutButton from '../../components/LogoutButton';

export default function CanteenDashboard({ user }) {
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
      const surplus = await apiService.getSurplus();
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
        <div style={styles.loading}>Loading canteen dashboard...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <div>
            <h1>Welcome, {user?.name || 'Canteen'}!</h1>
            <p>Canteen Dashboard - Manage surplus food and inventory</p>
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
        {/* Surplus Section */}
        <div style={styles.card}>
          <h2>🍽️ Recent Surplus</h2>
          {surplusData.length > 0 ? (
            <div style={styles.surplusList}>
              {surplusData.slice(0, 5).map((surplus, index) => (
                <div key={index} style={styles.surplusItem}>
                  <h4>{surplus.foodItem}</h4>
                  <p>{surplus.quantity} meals</p>
                  <p>{surplus.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}</p>
                  <p>{new Date(surplus.loggedAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          ) : (
            <p style={styles.noData}>No surplus data available</p>
          )}
        </div>

        {/* Quick Actions */}
        <div style={styles.card}>
          <h2>⚡ Quick Actions</h2>
          <div style={styles.actionsList}>
            <button 
              style={styles.actionButton}
              onClick={() => handleLogSurplus({
                foodItem: 'Sample Food',
                quantity: 10,
                isVeg: true
              })}
            >
              Log Surplus
            </button>
            <button style={styles.actionButton}>
              View All Surplus
            </button>
            <button style={styles.actionButton}>
              Manage Inventory
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div style={styles.card}>
          <h2>📊 Statistics</h2>
          <div style={styles.statsList}>
            <div style={styles.statItem}>
              <h3>Total Surplus Logged</h3>
              <p>{surplusData.length} items</p>
            </div>
            <div style={styles.statItem}>
              <h3>Total Meals</h3>
              <p>{surplusData.reduce((sum, item) => sum + (item.quantity || 0), 0)} meals</p>
            </div>
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
  }
};