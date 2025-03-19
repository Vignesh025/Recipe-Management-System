import { configureStore } from '@reduxjs/toolkit';
import recipeReducer from './recipeSlice';
import authReducer from './authSlice';

export const store = configureStore({
  reducer: {
    recipes: recipeReducer,
    auth: authReducer,
  },
});

export default store; 