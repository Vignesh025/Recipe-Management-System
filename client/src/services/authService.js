import API from './api';

// Auth service with all authentication-related API calls
const AuthService = {
  // Register a new user
  register: async (userData) => {
    try {
      const response = await API.post('/Auth/register', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || error.message;
    }
  },

  // Login a user
  login: async (credentials) => {
    try {
      const response = await API.post('/Auth/login', credentials);
      
      // Store token in localStorage
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify({
            userId: response.data.userId,
            username: response.data.username,
            role: response.data.role
            }));
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || error.message;
    }
  },

  // Logout a user
  logout: () => {
    localStorage.removeItem('token');
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};

export default AuthService; 