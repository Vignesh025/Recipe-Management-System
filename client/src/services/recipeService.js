import API from './api';

const RecipeService = {
  // Get all recipes
  getRecipes: async () => {
    try {
      const response = await API.get('/Recipes');
      return response.data;
    } catch (error) {
      console.error('Error fetching recipes:', error);
      throw error.response?.data?.message || error.message;
    }
  },

  // Get recipes for the current user
  getMyRecipes: async () => {
    try {
      const response = await API.get('/Recipes/my');
      return response.data;
    } catch (error) {
      console.error('Error fetching my recipes:', error);
      throw error.response?.data?.message || error.message;
    }
  },

  // Get a specific recipe by ID
  getRecipeById: async (id) => {
    try {
      const response = await API.get(`/Recipes/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || error.message;
    }
  },

  // Create a new recipe
  createRecipe: async (recipeData) => {
    try {
      const response = await API.post('/Recipes', recipeData);
      return response.data;
    } catch (error) {
      console.error('Error creating recipe:', error);
      console.error('Error details:', error.response?.data || error.message);
      throw error.response?.data?.message || error.message;
    }
  },

  // Update an existing recipe
  updateRecipe: async (id, recipeData) => {
    try {
      // Ensure we're sending the complete recipe object with the correct ID
      const completeRecipeData = {
        ...recipeData,
        id: id
      };
      
      const response = await API.put(`/Recipes/${id}`, completeRecipeData);
      return response.data;
    } catch (error) {
      console.error('Error updating recipe:', error);
      console.error('Error details:', error.response?.data || error.message);
      throw error.response?.data?.message || error.message;
    }
  },

  // Delete a recipe
  deleteRecipe: async (id) => {
    try {
      const response = await API.delete(`/Recipes/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || error.message;
    }
  }
};

export default RecipeService; 