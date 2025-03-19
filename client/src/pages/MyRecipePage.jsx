import React, { useState } from 'react';
import { Container, Row, Col, Navbar, Nav } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import MyRecipeList from '../components/MyRecipeList';
import AddRecipeModal from '../components/AddRecipeModal';
import { PlusLg } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import '../styles/custom.css';
import Button from 'react-bootstrap/Button';

const MyRecipePage = () => {
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
              <Nav.Link href="/recipes">All Recipes</Nav.Link>
              <Nav.Link href="/myrecipes" active>My Recipes</Nav.Link>
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
              <div className="d-flex justify-content-between align-items-center">
                <h1>My Recipe Collection</h1>
                {user && (
                  <Button
                    variant="success"
                    onClick={() => setShowAddModal(true)}
                    className="btn-dark d-flex align-items-center"
                  >
                    <PlusLg className="me-2" /> Add New Recipe
                  </Button>
                )}
              </div>
              <p className="text-muted">
                Manage your personal recipe collection. View, add, edit, or delete your recipes.
              </p>
            </Col>
          </Row>

          {/* Recipe List Component */}
          <MyRecipeList />
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

export default MyRecipePage;
