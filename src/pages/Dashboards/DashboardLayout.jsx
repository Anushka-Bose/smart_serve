import { useState } from 'react';

const DashboardLayout = ({ 
  user, 
  title, 
  tabs, 
  activeTab, 
  onTabChange, 
  children 
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="dashboard-container">
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <div className="header-left">
          <button 
            className="sidebar-toggle"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            <i className={`fas fa-${sidebarCollapsed ? 'bars' : 'times'}`}></i>
          </button>
          <h1>{title}</h1>
        </div>
        
        <div className="user-welcome">
          <div className="user-info">
            <div className="user-avatar">
              {user.name.charAt(0)}
            </div>
            <div className="user-details">
              <span className="user-name">{user.name}</span>
              <span className="user-role">{user.role}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="dashboard-content">
        {/* Sidebar Navigation */}
        <div className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
          <div className="sidebar-tabs">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => {
                  onTabChange(tab.id);
                  if (window.innerWidth < 768) {
                    setSidebarCollapsed(true);
                  }
                }}
              >
                <i className={`fas fa-${tab.icon}`}></i>
                {!sidebarCollapsed && <span>{tab.label}</span>}
              </button>
            ))}
          </div>
          
          <div className="sidebar-footer">
            <div className="app-info">
              {!sidebarCollapsed && (
                <>
                  <h3>FoodSave</h3>
                  <p>Reduce Waste, Feed Communities</p>
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* Main Content Area */}
        <div className={`main-content ${sidebarCollapsed ? 'expanded' : ''}`}>
          {/* Breadcrumb Navigation */}
          <div className="breadcrumb">
            <span>Dashboard</span>
            <i className="fas fa-chevron-right"></i>
            <span className="current-tab">
              {tabs.find(tab => tab.id === activeTab)?.label}
            </span>
          </div>
          
          {/* Page Content */}
          <div className="content-area">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;