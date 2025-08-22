const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Helper method to get auth token
  getAuthToken() {
    return localStorage.getItem('token');
  }

  // Helper method to set auth token
  setAuthToken(token) {
    localStorage.setItem('token', token);
  }

  // Helper method to remove auth token
  removeAuthToken() {
    localStorage.removeItem('token');
  }

  // Generic request method
  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getAuthToken();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Generic POST method
  async post(endpoint, data) {
    return this.makeRequest(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Auth endpoints
  async login(email, password, role) {
    return this.makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, role }),
    });
  }

  async register(userData) {
    return this.makeRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout() {
    this.removeAuthToken();
    return this.makeRequest('/auth/logout', {
      method: 'POST',
    });
  }

  // Events endpoints
  async getEvents() {
    return this.makeRequest('/events');
  }

  async createEvent(eventData) {
    return this.makeRequest('/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  }

  async updateEvent(eventId, eventData) {
    return this.makeRequest(`/events/${eventId}`, {
      method: 'PUT',
      body: JSON.stringify(eventData),
    });
  }

  async deleteEvent(eventId) {
    return this.makeRequest(`/events/${eventId}`, {
      method: 'DELETE',
    });
  }

  // Surplus endpoints
  async getSurplus() {
    return this.makeRequest('/surplus');
  }

  async createSurplus(surplusData) {
    return this.makeRequest('/surplus', {
      method: 'POST',
      body: JSON.stringify(surplusData),
    });
  }

  async updateSurplus(surplusId, surplusData) {
    return this.makeRequest(`/surplus/${surplusId}`, {
      method: 'PUT',
      body: JSON.stringify(surplusData),
    });
  }

  async deleteSurplus(surplusId) {
    return this.makeRequest(`/surplus/${surplusId}`, {
      method: 'DELETE',
    });
  }

  // Leaderboard endpoints
  async getLeaderboard() {
    return this.makeRequest('/leaderboard');
  }

  async updateLeaderboard(leaderboardData) {
    return this.makeRequest('/leaderboard', {
      method: 'PUT',
      body: JSON.stringify(leaderboardData),
    });
  }

  // User profile endpoints
  async getUserProfile() {
    return this.makeRequest('/auth/profile');
  }

  async updateUserProfile(profileData) {
    return this.makeRequest('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService; 