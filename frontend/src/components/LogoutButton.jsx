import React from 'react';
import apiService from '../services/api';

const LogoutButton = ({ style = {} }) => {
  const handleLogout = async () => {
    try {
      await apiService.logout();
      // Redirect to login page
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
      // Still redirect even if logout API fails
      window.location.href = '/login';
    }
  };

  const defaultStyle = {
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'background-color 0.3s ease',
    fontWeight: '500',
    ...style
  };

  return (
    <button onClick={handleLogout} style={defaultStyle}>
      🚪 Logout
    </button>
  );
};

export default LogoutButton;
