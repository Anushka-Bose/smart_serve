import { useNavigate } from "react-router-dom";
import "./Header.css";

export default function Header({ isLoggedIn, user, onLogout }) {
  const navigate = useNavigate();

  const handleLoginSelect = (e) => {
    const value = e.target.value;
    if (value === "") {
      return;
    }
    if (!isLoggedIn) {
      // If not logged in, navigate to appropriate login page
      if (value === "student") {
        navigate("/login/student");
      } else if (value === "ngo") {
        navigate("/login/ngo");
      } else if (value === "staff") {
        navigate("/login/staff");
      } else if (value === "organiser") {
        navigate("/login/organiser");
      } else if (value === "admin") {
        navigate("/login/admin");
      } else if (value === "canteen") {
        navigate("/login/canteen");
      }
    } else {
      // If logged in, navigate to appropriate dashboard
      navigate(`/dashboard/${value}`);
    }
  };

  return (
    <header className="header">
      {/* Left: App name */}
      {/* <img src=""></img> */}
      <h1 onClick={() => navigate("/")}>Smart Serve</h1>
      
      <div>
        {/* Login dropdown */}
        <select className="login-options" onChange={handleLoginSelect} defaultValue="">
          <option value="">{isLoggedIn ? "Switch Role" : "Sign In"}</option>
          <option value="student">Student</option>
          <option value="ngo">NGO</option>
          <option value="staff">Staff</option>
          <option value="organiser">Event Organiser</option>
          <option value="canteen">Canteen/Hostel</option>
          <option value="admin">Admin</option>
        </select>
        
        {/* Conditional rendering based on login status */}
        {isLoggedIn ? (
          <div className="user-menu">
            <div className="user-info">
              <div className="user-avatar">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <span>{user?.name || 'User'}</span>
            </div>
            <button className="logout-btn" onClick={onLogout}>
              Logout
            </button>
          </div>
        ) : (
          <button onClick={() => navigate("/signup")}>
            Sign Up
          </button>
        )}
      </div>
    </header>
  );
}