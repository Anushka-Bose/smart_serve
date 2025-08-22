import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api';
import "./SignUpStyle.css"

const Signup = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    // NGO-specific fields
    distanceFromCollege: '',
    membersCount: '',
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
      if (!formData.distanceFromCollege) newErrors.distanceFromCollege = "Distance is required";
      else if (formData.distanceFromCollege < 0) newErrors.distanceFromCollege = "Distance must be positive";
      
      if (!formData.membersCount) newErrors.membersCount = "Member count is required";
      else if (formData.membersCount < 1) newErrors.membersCount = "Must have at least 1 member";
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({}); // Clear previous errors
    
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
        delete submitData.distanceFromCollege;
        delete submitData.membersCount;
      }
      
      // For non-student/staff, remove food preference
      if (submitData.role !== 'student' && submitData.role !== 'staff') {
        delete submitData.foodPreference;
      }
      
      console.log('Submitting signup data:', submitData);
      
      // Use apiService instead of direct fetch
      const response = await apiService.register(submitData);

      if (response.user) {
        // Store token and user data
        apiService.setAuthToken(response.token);
        
        const userData = {
          ...response.user,
          role: formData.role
        };
        
        console.log('Signup successful:', userData);
        onLogin(userData);
        navigate(`/dashboard/${formData.role}`);
      } else {
        alert(response.message || 'Signup failed');
      }
    } catch (error) {
      console.error('Error during signup:', error);
      
      // Show more specific error messages
      if (error.message.includes('User already exists')) {
        setErrors({ email: 'An account with this email already exists' });
      } else if (error.message.includes('Food preference is required')) {
        setErrors({ foodPreference: 'Food preference is required for students and staff' });
      } else if (error.message.includes('validation failed')) {
        setErrors({ general: 'Please check your input data and try again' });
      } else {
        setErrors({ general: error.message || 'An error occurred during signup. Please try again.' });
      }
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
          <label htmlFor="distanceFromCollege">Distance from College (km)</label>
          <input
            type="number"
            id="distanceFromCollege"
            name="distanceFromCollege"
            value={formData.distanceFromCollege}
            onChange={handleChange}
            min="0"
            step="0.1"
            className={errors.distanceFromCollege ? 'error' : ''}
            placeholder="e.g., 5.2"
          />
          {errors.distanceFromCollege && <span className="error-text">{errors.distanceFromCollege}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="membersCount">Number of Members to Feed</label>
          <input
            type="number"
            id="membersCount"
            name="membersCount"
            value={formData.membersCount}
            onChange={handleChange}
            min="1"
            className={errors.membersCount ? 'error' : ''}
            placeholder="e.g., 25"
          />
          {errors.membersCount && <span className="error-text">{errors.membersCount}</span>}
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
        
        {errors.general && (
          <div className="error-message" style={{
            backgroundColor: '#ffebee',
            color: '#c62828',
            padding: '0.75rem',
            borderRadius: '5px',
            marginBottom: '1rem',
            border: '1px solid #ffcdd2'
          }}>
            {errors.general}
          </div>
        )}
        
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