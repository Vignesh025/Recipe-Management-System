import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AuthService from '../services/authService';

// Check if user is already logged in
const token = localStorage.getItem('token');
const storedUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

// Async thunk for user registration
export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      return await AuthService.register(userData);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Async thunk for user login
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      return await AuthService.login(credentials);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Async thunk for user logout
export const logout = createAsyncThunk(
  'auth/logout',
  async () => {
    AuthService.logout();
  }
);

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: storedUser,
    token: token,
    isAuthenticated: !!token,
    loading: false,
    error: null,
    registerSuccess: false
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetRegisterSuccess: (state) => {
      state.registerSuccess = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Register cases
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.registerSuccess = false;
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false;
        state.registerSuccess = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Login cases
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = {
          userId: action.payload.userId,
          username: action.payload.username,
          role: action.payload.role
        };
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Logout cases
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      });
  }
});

export const { clearError, resetRegisterSuccess } = authSlice.actions;
export default authSlice.reducer; 