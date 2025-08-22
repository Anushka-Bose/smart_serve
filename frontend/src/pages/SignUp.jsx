import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./SignUpStyle.css"

const Signup = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    // NGO-specific fields
    distance: '',
    memberCount: '',
    // Student/Staff fields
    foodPreference: 'vegetarian'
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ 
      ...formData, 
      [name]: value 
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
    
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    
    // NGO-specific validations
    if (formData.role === 'ngo') {
      if (!formData.distance) newErrors.distance = "Distance is required";
      else if (formData.distance < 0) newErrors.distance = "Distance must be positive";
      
      if (!formData.memberCount) newErrors.memberCount = "Member count is required";
      else if (formData.memberCount < 1) newErrors.memberCount = "Must have at least 1 member";
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setIsSubmitting(false);
      return;
    }
    
    try {
      // Prepare data for submission
      const submitData = { ...formData };
      delete submitData.confirmPassword;
      
      // For non-NGO roles, remove NGO-specific fields
      if (submitData.role !== 'ngo') {
        delete submitData.distance;
        delete submitData.memberCount;
      }
      
      // For non-student/staff, remove food preference
      if (submitData.role !== 'student' && submitData.role !== 'staff') {
        delete submitData.foodPreference;
      }
      
      const response = await fetch("/api/auth/signup", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      const data = await response.json();

      if (response.ok) {
        onLogin(data.user);
        navigate(`/dashboard/${formData.role}`);
      } else {
        alert(data.message || 'Signup failed');
      }
    } catch (error) {
      console.error('Error during signup:', error);
      alert('An error occurred during signup. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render NGO-specific fields
  const renderNgoFields = () => {
    if (formData.role !== 'ngo') return null;
    
    return (
      <div className="form-section">
        <h3>NGO Information</h3>
        <div className="form-group">
          <label htmlFor="distance">Distance from College (km)</label>
          <input
            type="number"
            id="distance"
            name="distance"
            value={formData.distance}
            onChange={handleChange}
            min="0"
            step="0.1"
            className={errors.distance ? 'error' : ''}
            placeholder="e.g., 5.2"
          />
          {errors.distance && <span className="error-text">{errors.distance}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="memberCount">Number of Members to Feed</label>
          <input
            type="number"
            id="memberCount"
            name="memberCount"
            value={formData.memberCount}
            onChange={handleChange}
            min="1"
            className={errors.memberCount ? 'error' : ''}
            placeholder="e.g., 25"
          />
          {errors.memberCount && <span className="error-text">{errors.memberCount}</span>}
        </div>
      </div>
    );
  };

  // Render food preference for students and staff
  const renderFoodPreference = () => {
    if (formData.role !== 'student' && formData.role !== 'staff') return null;
    
    return (
      <div className="form-group">
        <label htmlFor="foodPreference">Food Preference</label>
        <select
          id="foodPreference"
          name="foodPreference"
          value={formData.foodPreference}
          onChange={handleChange}
        >
          <option value="vegetarian">Vegetarian</option>
          <option value="non-vegetarian">Non-Vegetarian</option>
          <option value="no-preference">No Preference</option>
        </select>
        <p className="input-hint">This helps us provide you with relevant food options</p>
      </div>
    );
  };

  // Role descriptions
  const roleDescriptions = {
    student: "Can view leaderboard and track impact",
    ngo: "Can view leaderboard and track impact",
    staff: "Can view leaderboard and track impact",
    organiser: "Can view leaderboard, track impact, create events, use AI prediction model, and log surplus",
    canteen: "Can report surplus food and manage inventory",
    admin: "Can update and view leaderboard, and view system analytics"
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create Your Account</h2>
        <p>Join our mission to reduce food waste</p>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-section">
            <h3>Basic Information</h3>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className={errors.name ? 'error' : ''}
              />
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email address"
                className={errors.email ? 'error' : ''}
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a strong password"
                className={errors.password ? 'error' : ''}
              />
              {errors.password && <span className="error-text">{errors.password}</span>}
              <p className="input-hint">Must be at least 6 characters long</p>
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                className={errors.confirmPassword ? 'error' : ''}
              />
              {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="role">I am a</label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="student">Student</option>
                <option value="ngo">NGO Representative</option>
                <option value="staff">College Staff</option>
                <option value="organiser">Event Organiser</option>
                <option value="canteen">Canteen/Hostel Manager</option>
                <option value="admin">Administrator</option>
              </select>
              <p className="input-hint">{roleDescriptions[formData.role]}</p>
            </div>
            
            {renderFoodPreference()}
          </div>
          
          {renderNgoFields()}
          
          <button type="submit" disabled={isSubmitting} className="submit-btn">
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        
        <p className="auth-link">
          Already have an account? <button onClick={() => navigate('/login')}>Log in</button>
        </p>
      </div>
    </div>
  );
};

export default Signup;