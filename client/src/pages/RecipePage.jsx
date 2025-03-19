import React, { useState } from 'react';
import { Container, Row, Col, Navbar, Nav, Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import RecipeList from '../components/RecipeList';
import AddRecipeModal from '../components/AddRecipeModal';
import { useNavigate } from 'react-router-dom';
import '../styles/custom.css';


const RecipePage = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className='background'>
      {/* Navbar */}
      <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
        <Container>
          <Navbar.Brand href="/">Recipe Manager</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/recipes" active>All Recipes</Nav.Link>
              {user && <Nav.Link href="/myrecipes">My Recipes</Nav.Link>}
            </Nav>
            <Nav>
              {user ? (
                <>
                  <Navbar.Text className="me-3">
                    Signed in as: <span className="text-white">{user.username}</span>
                  </Navbar.Text>
                  <Nav className="me-auto">
                    <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
                  </Nav>
                </>
              ) : (
                <>
                  <Button size="sm" className="custom-btn me-2" onClick={() => navigate('/login')}>Login</Button>
                  <Button className='custom-btn' size="sm" onClick={() => navigate('/register')}>Register</Button>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Main Content */}
      <div className="content-wrapper">
        <Container>
          <Row className="mb-4">
            <Col>
            <div className='flex '>
              <p className="text">
              Welcome to <b>Recipe Manager</b> - Discover a world of flavors and share your kitchen creations with our growing community of food enthusiasts.
              Recipe Manager is your digital cookbook, allowing you to:<br/>
                ★ Browse thousands of recipes from home cooks and food lovers around the world<br/>
                ★ Share your own signature recipes and cooking tips
              </p>
              </div>
            </Col>
          </Row>

          {/* Recipe List Component */}
          <RecipeList />
        </Container>
      </div>

      {/* Footer */}
      <footer className="bg-dark py-4 ">
        <Container>
          <p className="text-light fw-light text-center mb-0">
            &copy; {new Date().getFullYear()} Recipe Manager App
          </p>
        </Container>
      </footer>

      {/* Add Recipe Modal */}
      <AddRecipeModal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
      />
    </div>
  );
};

export default RecipePage;
