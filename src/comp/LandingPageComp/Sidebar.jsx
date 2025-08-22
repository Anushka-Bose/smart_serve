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
    // Add other role menu items here
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