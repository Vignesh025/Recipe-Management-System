import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRecipes } from '../store/recipeSlice';
import RecipeCard from './RecipeCard';
import { Row, Col, Container, Button } from 'react-bootstrap';
import '../styles/custom.css';

function RecipeList() {
  const dispatch = useDispatch();
  const { recipes, loading, error, updateLoading } = useSelector(state => state.recipes);
  
  // Fetch recipes on component mount
  useEffect(() => {
    dispatch(fetchRecipes());
  }, [dispatch]);
  
  // Refresh recipes when an update is completed
  useEffect(() => {
    if (updateLoading === false) {
      dispatch(fetchRecipes());
    }
  }, [updateLoading, dispatch]);
  
  const handleRefresh = () => {
    dispatch(fetchRecipes());
  };
  
  if (loading) return <div className="text-center mt-5"><p>Loading recipes...</p></div>;
  
  if (error) return (
    <div className="text-center py-5">
      <h3>Failed to load recipes</h3>
      <p className="text-muted">{error}</p>
      <Button onClick={handleRefresh}>Try Again</Button>
    </div>
  );
  
  if (recipes.length === 0) return (
    <div className="text-center mt-5">
      <p>No recipes found. Add your first recipe!</p>
    </div>
  );
  
  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center my-4">
        <h2>All Recipes</h2>
        <div className="d-flex justify-content-center mb-4">
          <Button className='btn-dark' variant="success" onClick={handleRefresh}>Refresh</Button>
        </div>
      </div>
      <Row>
        {recipes.map(recipe => (
          <Col key={recipe.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
            <RecipeCard className='recipe-card' recipe={recipe} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default RecipeList; 