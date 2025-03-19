import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import RecipeService from '../services/recipeService';

// Async thunk for fetching recipes
export const fetchRecipes = createAsyncThunk(
  'recipes/fetchRecipes',
  async (_, { rejectWithValue }) => {
    try {
      return await RecipeService.getRecipes();
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Async thunk for fetching user's recipes
export const fetchMyRecipes = createAsyncThunk(
  'recipes/fetchMyRecipes',
  async (_, { rejectWithValue }) => {
    try {
      return await RecipeService.getMyRecipes();
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Async thunk for adding a new recipe
export const addRecipe = createAsyncThunk(
  'recipes/addRecipe',
  async (recipeData, { rejectWithValue }) => {
    try {
      return await RecipeService.createRecipe(recipeData);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Async thunk for updating a recipe
export const updateRecipe = createAsyncThunk(
  'recipes/updateRecipe',
  async (recipe, { rejectWithValue }) => {
    try {
      const response = await RecipeService.updateRecipe(recipe.id, recipe);
      // If the backend returns no data (204 No Content), return the data we sent
      return response || recipe;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Async thunk for deleting a recipe
export const deleteRecipe = createAsyncThunk(
  'recipes/deleteRecipe',
  async (id, { rejectWithValue }) => {
    try {
      await RecipeService.deleteRecipe(id);
      return id;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Recipe slice
const recipeSlice = createSlice({
  name: 'recipes',
  initialState: {
    recipes: [],
    myRecipes: [],
    loading: false,
    error: null,
    addLoading: false,
    addError: null,
    updateLoading: false,
    updateError: null,
    deleteLoading: false,
    deleteError: null
  },
  reducers: {
    clearRecipes: (state) => {
      state.recipes = [];
      state.myRecipes = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch recipes cases
      .addCase(fetchRecipes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecipes.fulfilled, (state, action) => {
        state.loading = false;
        state.recipes = action.payload;
      })
      .addCase(fetchRecipes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch my recipes cases
      .addCase(fetchMyRecipes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyRecipes.fulfilled, (state, action) => {
        state.loading = false;
        state.myRecipes = action.payload;
      })
      .addCase(fetchMyRecipes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Add recipe cases
      .addCase(addRecipe.pending, (state) => {
        state.addLoading = true;
        state.addError = null;
      })
      .addCase(addRecipe.fulfilled, (state, action) => {
        state.addLoading = false;
        state.recipes.push(action.payload);
        if (state.myRecipes) {
          state.myRecipes.push(action.payload);
        }
      })
      .addCase(addRecipe.rejected, (state, action) => {
        state.addLoading = false;
        state.addError = action.payload;
      })
      
      // Update recipe cases
      .addCase(updateRecipe.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
      })
      .addCase(updateRecipe.fulfilled, (state, action) => {
        state.updateLoading = false;
        const index = state.recipes.findIndex(recipe => recipe.id === action.payload.id);
        if (index !== -1) {
          state.recipes[index] = action.payload;
        }
        
        const myIndex = state.myRecipes?.findIndex(recipe => recipe.id === action.payload.id);
        if (myIndex !== -1) {
          state.myRecipes[myIndex] = action.payload;
        }
      })
      .addCase(updateRecipe.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload;
      })
      
      // Delete recipe cases
      .addCase(deleteRecipe.pending, (state) => {
        state.deleteLoading = true;
        state.deleteError = null;
      })
      .addCase(deleteRecipe.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.recipes = state.recipes.filter(recipe => recipe.id !== action.payload);
        if (state.myRecipes) {
          state.myRecipes = state.myRecipes.filter(recipe => recipe.id !== action.payload);
        }
      })
      .addCase(deleteRecipe.rejected, (state, action) => {
        state.deleteLoading = false;
        state.deleteError = action.payload;
      });
  }
});

export const { clearRecipes } = recipeSlice.actions;
export default recipeSlice.reducer; 