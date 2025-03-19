import React, { useState, useEffect } from 'react';
import { Card, Button } from 'react-bootstrap';
import RecipeDetailModal from './Recipe';
import EditRecipeModal from './EditRecipeModal';
import { PencilSquare, Eye } from 'react-bootstrap-icons';
import { useSelector } from 'react-redux';
// Helper function to check if a URL is valid
const isValidImageUrl = (url) => {
  if (!url) return false;
  
  try {
    const parsedUrl = new URL(url);
    // Check if the URL has a valid protocol
    return ['http:', 'https:'].includes(parsedUrl.protocol);
  } catch (e) {
    return false;
  }
};

// Helper function to proxy image URLs to avoid CORS issues
const getProxiedImageUrl = (url) => {
  if (!url) return null;
  
  // Use a more reliable CORS proxy
  return `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
};


function RecipeCard({ recipe }) {
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [useProxy, setUseProxy] = useState(false);
  
  // Get current user from auth state
  const { user } = useSelector(state => state.auth);
  
  // Check if user is admin - only admins can modify recipes
  const isAdmin = user?.role === 'admin';
  const canModifyRecipe = isAdmin;
  
  useEffect(() => {
    if (recipe.imageUrl && isValidImageUrl(recipe.imageUrl)) {
      const img = new Image();
      img.onload = () => {
        setImageError(false);
      };
      img.onerror = () => {
        setUseProxy(true);
      };
      img.src = recipe.imageUrl;
    }
  }, [recipe]);
  
  
  // Default image if none provided or if there's an error loading the image
  const defaultImage = 'https://plus.unsplash.com/premium_photo-1673108852141-e8c3c22a4a22?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
  const imageUrl = (recipe.imageUrl && isValidImageUrl(recipe.imageUrl) && !imageError) 
    ? recipe.imageUrl 
    : defaultImage;
    
  // Determine which URL to display
  const displayUrl = (useProxy && recipe.imageUrl 
      ? getProxiedImageUrl(recipe.imageUrl) 
      : imageUrl);
  
  const handleImageError = () => {
    if (!useProxy && recipe.imageUrl) {
      setUseProxy(true);
      return;
    }
    
    setImageError(true);
  };
  
  return (
    <>
      <Card className="recipe-card">
        <Card.Img 
          variant="top" 
          src={displayUrl} 
          onError={handleImageError}
          style={{ height: '180px', objectFit: 'cover' }} 
          alt={recipe.recipeName}
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        <Card.Body className="d-flex flex-column">
          <Card.Title>{recipe.recipeName}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">{recipe.category}</Card.Subtitle>
          <div className="mt-auto d-flex justify-content-between">
            <Button 
              variant="outline-primary" 
              onClick={() => setShowModal(true)}
              className="custom-btn d-flex align-items-center"
            >
              <Eye className="me-1" /> View
            </Button>
            
            {canModifyRecipe && (
              <Button 
                variant="outline-secondary" 
                onClick={() => setShowEditModal(true)}
                className="custom-btn d-flex align-items-center"
              >
                <PencilSquare className="me-1" /> Edit
              </Button>
            )}
          </div>
        </Card.Body>
      </Card>

      <RecipeDetailModal
        show={showModal}
        onHide={() => setShowModal(false)}
        recipe={recipe}
        canModifyRecipe={canModifyRecipe}
      />
      
      {canModifyRecipe && (
        <EditRecipeModal
          show={showEditModal}
          onHide={() => setShowEditModal(false)}
          recipe={recipe}
        />
      )}
    </>
  );
}

export default RecipeCard;