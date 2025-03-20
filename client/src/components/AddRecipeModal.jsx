import React, { useState } from 'react';
import { Modal, Form, Alert, Button, Spinner } from 'react-bootstrap';
import { useDispatch} from 'react-redux';
import { addRecipe } from '../store/recipeSlice';
import '../styles/custom.css';

// Helper function to check if a URL is valid
const isValidImageUrl = (url) => {
  if (!url) return true; // Empty URL is valid (optional field)
  
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

const AddRecipeModal = ({ show, onHide }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    recipeName: '',
    category: '',
    imageUrl: '',
    ingredients: '',
    instructions: ''
  });
  const [validated, setValidated] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [useProxy, setUseProxy] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // If image URL changes, update preview directly
    if (name === 'imageUrl') {
      if (value && isValidImageUrl(value)) {
        setImageLoading(false);
        setImageError(false);
        setUseProxy(false); // Reset proxy flag when URL changes
        setImagePreview(value); // Just use the URL directly
        
        // Pre-validate the image
        const img = new Image();
        img.onload = () => {
          setImageError(false);
        };
        img.onerror = () => {
          setUseProxy(true);
        };
        img.src = value;
      } else {
        setImagePreview(null);
        setImageError(value ? true : false); // Only show error if there's a value but it's invalid
      }
    }
  };

  const handleImageError = (e) => {
    if (!useProxy && imagePreview) {
      setUseProxy(true);
      return;
    }
    
    setImageError(true);
    setImagePreview(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    
    // Form validation
    if (!form.checkValidity() || (formData.imageUrl && !isValidImageUrl(formData.imageUrl))) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    
    // Prepare the data for submission
    const newRecipe = {
      ...formData,
      // Ensure the imageUrl is properly formatted
      imageUrl: formData.imageUrl ? formData.imageUrl.trim() : ''
    };
    
    setLoading(true);
    dispatch(addRecipe(newRecipe))
      .unwrap()
      .then(() => {
        setFormData({
          recipeName: '',
          category: '',
          imageUrl: '',
          ingredients: '',
          instructions: ''
        });
        setImagePreview(null);
        setImageError(false);
        setValidated(false);
        setLoading(false);
        onHide();
      })
      .catch(error => {
        setLoading(false);
      });
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered className='view-modal'>
      <Modal.Header closeButton>
        <Modal.Title>Add New Recipe</Modal.Title>
      </Modal.Header>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Recipe Name</Form.Label>
            <Form.Control
              type="text"
              name="recipeName"
              value={formData.recipeName}
              onChange={handleChange}
              required
              placeholder="Enter recipe name"
            />
            <Form.Control.Feedback type="invalid">
              Please provide a recipe name.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Category</Form.Label>
            <Form.Select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select a cuisine category</option>
              <option value="Indian">Indian</option>
              <option value="French">French</option>
              <option value="Italian">Italian</option>
              <option value="Chinese">Chinese</option>
              <option value="Japanese">Japanese</option>
              <option value="Korean">Korean</option>
              <option value="American">American</option>
              <option value="Thai">Thai</option>
              <option value="Others">Others</option>
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              Please select a category.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Image URL (Optional)</Form.Label>
            <Form.Control
              type="text"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              isInvalid={formData.imageUrl && !isValidImageUrl(formData.imageUrl)}
            />
            <Form.Control.Feedback type="invalid">
              Please provide a valid URL.
            </Form.Control.Feedback>
            <Form.Text className="text-muted">
              Enter a direct link to an image. Make sure the URL starts with http:// or https://
            </Form.Text>
            
            {/* Image preview section */}
            {formData.imageUrl && (
              <div className="mt-2">
                {imageLoading ? (
                  <div className="text-center py-3">
                    <Spinner animation="border" size="sm" /> Loading image preview...
                  </div>
                ) : imageError ? (
                  <Alert variant="warning">
                    Unable to load image preview. The URL may be invalid or the image might not be accessible.
                  </Alert>
                ) : imagePreview ? (
                  <div className="text-center">
                    <img 
                      src={useProxy ? getProxiedImageUrl(imagePreview) : imagePreview} 
                      alt="Preview" 
                      style={{ maxHeight: '200px', maxWidth: '100%' }} 
                      className="mt-2 border rounded"
                      onError={handleImageError}
                      crossOrigin="anonymous"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ) : null}
              </div>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Ingredients</Form.Label>
            <Form.Control
              as="textarea"
              name="ingredients"
              value={formData.ingredients}
              onChange={handleChange}
              required
              rows={3}
              placeholder="Enter ingredients, one per line"
            />
            <Form.Control.Feedback type="invalid">
              Please provide the ingredients.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Instructions</Form.Label>
            <Form.Control
              as="textarea"
              name="instructions"
              value={formData.instructions}
              onChange={handleChange}
              required
              rows={5}
              placeholder="Enter cooking instructions"
            />
            <Form.Control.Feedback type="invalid">
              Please provide cooking instructions.
            </Form.Control.Feedback>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button className='custom-btn' variant="secondary" onClick={onHide}>
            Cancel
          </Button>
          <Button className='custom-btn' variant="primary" type="submit" disabled={loading}>
            {loading ? 'Adding...' : 'Add Recipe'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AddRecipeModal; 