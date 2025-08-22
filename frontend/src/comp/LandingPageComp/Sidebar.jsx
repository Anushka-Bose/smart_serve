import React from 'react';
import { useNavigate } from 'react-router-dom';

/* 
function Sidebar(){
  return (
    <aside className="sidebar">
      <h3>Navigation</h3>
      <ul>
        <li><a href="/dashboard/student">Student Dashboard</a></li>
        <li><a href="/dashboard/ngo">NGO Dashboard</a></li>
        <li><a href="/dashboard/staff">Staff Dashboard</a></li>
        <li><a href="/dashboard/organiser">Organizer Dashboard</a></li>
        <li><a href="/dashboard/admin">Admin Dashboard</a></li>
      </ul>
    </aside>
  );
};

export default Sidebar; */

const Sidebar = ({ user, isVisible, onClose }) => {
  const navigate = useNavigate();
  
  const menuItems = {
    student: [
      { id: 'food', label: 'Available Food', icon: 'utensils', path: '/dashboard/student' },
      { id: 'leaderboard', label: 'Leaderboard', icon: 'trophy', path: '/dashboard/student' },
      { id: 'analytics', label: 'Analytics', icon: 'chart-line', path: '/dashboard/student' }
    ],
    ngo: [
      { id: 'food', label: 'Available Food', icon: 'utensils', path: '/dashboard/ngo' },
      { id: 'leaderboard', label: 'Leaderboard', icon: 'trophy', path: '/dashboard/ngo' },
      { id: 'analytics', label: 'Analytics', icon: 'chart-line', path: '/dashboard/ngo' },
      { id: 'info', label: 'NGO Info', icon: 'info-circle', path: '/dashboard/ngo' }
    ],
    staff: [
      { id: 'food', label: 'Available Food', icon: 'utensils', path: '/dashboard/staff' },
      { id: 'leaderboard', label: 'Leaderboard', icon: 'trophy', path: '/dashboard/staff' },
      { id: 'analytics', label: 'Analytics', icon: 'chart-line', path: '/dashboard/staff' }
    ],
    organiser: [
      { id: 'food', label: 'Available Food', icon: 'utensils', path: '/dashboard/organiser' },
      { id: 'leaderboard', label: 'Leaderboard', icon: 'trophy', path: '/dashboard/organiser' },
      { id: 'analytics', label: 'Analytics', icon: 'chart-line', path: '/dashboard/organiser' },
      { id: 'events', label: 'Manage Events', icon: 'calendar', path: '/dashboard/organiser' }
    ],
    canteen: [
      { id: 'food', label: 'Available Food', icon: 'utensils', path: '/dashboard/canteen' },
      { id: 'surplus', label: 'Log Surplus', icon: 'plus-circle', path: '/dashboard/canteen' },
      { id: 'analytics', label: 'Analytics', icon: 'chart-line', path: '/dashboard/canteen' }
    ],
    admin: [
      { id: 'dashboard', label: 'Admin Dashboard', icon: 'tachometer-alt', path: '/dashboard/admin' },
      { id: 'users', label: 'Manage Users', icon: 'users', path: '/dashboard/admin' },
      { id: 'analytics', label: 'System Analytics', icon: 'chart-line', path: '/dashboard/admin' }
    ]
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isVisible && <div className="sidebar-overlay" onClick={onClose}></div>}
      
      <div className={`sidebar ${isVisible ? 'visible' : ''}`}>
        <div className="sidebar-header">
          <h3>Navigation</h3>
          <button className="close-sidebar" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <nav className="sidebar-nav">
          {menuItems[user.role]?.map(item => (
            <button
              key={item.id}
              className="nav-item"
              onClick={() => {
                navigate(item.path);
                onClose();
              }}
            >
              <i className={`fas fa-${item.icon}`}></i>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;