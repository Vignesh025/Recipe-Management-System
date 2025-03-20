import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { deleteRecipe } from '../store/recipeSlice';
import EditRecipeModal from './EditRecipeModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import { TrashFill } from 'react-bootstrap-icons';
import '../styles/custom.css';

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



function RecipeDetailModal({ show, onHide, recipe, canModifyRecipe }) {
  const dispatch = useDispatch();
  const { deleteLoading, deleteError } = useSelector(state => state.recipes);
  const { user } = useSelector(state => state.auth);
  const [showEditModal, setShowEditModal] = useState(false);
  const [useProxy, setUseProxy] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // If canModifyRecipe prop isn't provided, check user permissions
  const isAdmin = user?.role === 'admin';
  // Only admins can edit or delete recipes
  const canEdit = canModifyRecipe !== undefined ? canModifyRecipe : isAdmin;
  
  useEffect(() => {
    if (recipe && show) {
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
    }
  }, [recipe, show]);
  
  
  if (!recipe) return null;

  const handleImageError = () => {
    if (!useProxy && recipe.imageUrl) {
      setUseProxy(true);
      return;
    }
    
    setImageError(true);
  };
  
  // Default image if none provided or if there's an error loading the image
  const defaultImage = 'https://plus.unsplash.com/premium_photo-1673108852141-e8c3c22a4a22?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
  
  // Determine which URL to display
  let displayUrl;
  if (useProxy && recipe?.imageUrl) {
    displayUrl = getProxiedImageUrl(recipe.imageUrl);
  } else if (recipe?.imageUrl && isValidImageUrl(recipe.imageUrl) && !imageError) {
    displayUrl = recipe.imageUrl;
  } else {
    displayUrl = defaultImage;
  }

  const handleDelete = () => {
    dispatch(deleteRecipe(recipe.id))
      .unwrap()
      .then(() => {
        onHide();
      })
      .catch(error => {
      });
  };

  return (
    <>
    <Modal
        show={show}
        onHide={onHide}
      size="lg"
        aria-labelledby="recipe-modal"
      centered
      className='view-modal'
    >
      <Modal.Header closeButton>
          <Modal.Title id="recipe-modal">
            {recipe.recipeName}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
          {deleteError && (
            <div className="alert alert-danger mb-3">
              Failed to delete recipe: {deleteError}
            </div>
          )}
          
          {/* Delete Confirmation Modal */}
          <DeleteConfirmModal
            show={showDeleteConfirm}
            onHide={() => setShowDeleteConfirm(false)}
            onConfirm={handleDelete}
            loading={deleteLoading}
          />
          
          {displayUrl && isValidImageUrl(displayUrl) && !imageError ? (
            <div className="text-center mb-4">
              <img 
                src={displayUrl} 
                alt={recipe.recipeName} 
                onError={handleImageError}
                style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'cover' }}
                crossOrigin="anonymous"
                referrerPolicy="no-referrer"
              />
            </div>
          ) : displayUrl && (!isValidImageUrl(displayUrl) || imageError) ? (
            <div className="text-center mb-4">
              <div className="alert alert-warning">
                Image could not be loaded
              </div>
            </div>
          ) : null}
          
          <h5>Category</h5>
          <p>{recipe.category}</p>
          
          <h5>Ingredients</h5>
          <p style={{ whiteSpace: 'pre-line' }}>{recipe.ingredients}</p>
          
          <h5>Instructions</h5>
          <p style={{ whiteSpace: 'pre-line' }}>{recipe.instructions}</p>
      </Modal.Body>
      <Modal.Footer>
          {canEdit && (
            <Button 
              variant="danger" 
              onClick={() => setShowDeleteConfirm(true)}
              className="custom-btn me-auto"
            >
              <TrashFill className="me-1" /> Delete
            </Button>
          )}
          <Button className='custom-btn' onClick={onHide}>Close</Button>
          {canEdit && (
            <Button 
              className='custom-btn'
              variant="success" 
              onClick={() => setShowEditModal(true)}
            >
              Edit Recipe
            </Button>
          )}
      </Modal.Footer>
    </Modal>

      {/* Edit Recipe Modal */}
      {canEdit && (
        <EditRecipeModal
          show={showEditModal}
          onHide={() => setShowEditModal(false)}
          recipe={recipe}
        />
      )}
    </>
  );
}

export default RecipeDetailModal;