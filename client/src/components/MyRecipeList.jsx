import React, { useEffect, } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Container, Button } from 'react-bootstrap';
import { fetchMyRecipes } from '../store/recipeSlice';
import MyRecipeCard from './MyRecipeCard';
import '../styles/custom.css';

function MyRecipeList() {
  const dispatch = useDispatch();
  const { myRecipes, loading, error, updateLoading } = useSelector(state => state.recipes);
  
  // Fetch recipes on component mount
  useEffect(() => {
    dispatch(fetchMyRecipes());
  }, [dispatch]);
  
  // Refresh recipes when an update is completed
  useEffect(() => {
    if (updateLoading === false) {
      dispatch(fetchMyRecipes());
    }
  }, [updateLoading, dispatch]);
  
  const handleRefresh = () => {
    dispatch(fetchMyRecipes());
  };
  
  if (loading) return <div className="text-center mt-5"><p>Loading recipes...</p></div>;
  
  if (error) return (
    <div className="text-center mt-5">
      <p className="text-danger">Error loading recipes: {error}</p>
      <Button className='custom-btn' variant="primary" onClick={handleRefresh}>Try Again</Button>
    </div>
  );
  
  if (!myRecipes || myRecipes.length === 0) return (
    <div className="text-center mt-5">
      <p>No recipes found. Add your first recipe!</p>
    </div>
  );
  
  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center my-4">
        <h2>My Recipes</h2>
        <Button className='btn-dark' variant="success" onClick={handleRefresh}>Refresh</Button>
      </div>
      <Row>
        {myRecipes.map(recipe => (
          <Col key={recipe.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
            <MyRecipeCard className='recipe-card' recipe={recipe} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default MyRecipeList; 