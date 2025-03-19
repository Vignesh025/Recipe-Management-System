import React, { useState, useEffect, useMemo } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import '../styles/custom.css';

const HomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector(state => state.auth);
  const [backgroundIndex, setBackgroundIndex] = useState(0);

  // Array of background images wrapped in useMemo
  const backgrounds = useMemo(() => [
    'https://images.unsplash.com/photo-1495521821757-a1efb6729352?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1926&q=80',
    'https://images.unsplash.com/photo-1490818387583-1baba5e638af?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1932&q=80',
    'https://images.unsplash.com/photo-1606787366850-de6330128bfc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1950&q=80',
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1950&q=80'
  ], []);

  // Effect to change background every 5 seconds
  useEffect(() => {
    // If user is authenticated, redirect to recipes page
    if (isAuthenticated) {
      navigate('/recipes');
      return;
    }

    const interval = setInterval(() => {
      setBackgroundIndex(prevIndex => (prevIndex + 1) % backgrounds.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAuthenticated, navigate, backgrounds.length]);

  // Preload images for smoother transitions
  useEffect(() => {
    backgrounds.forEach(url => {
      const img = new Image();
      img.src = url;
    });
  }, [backgrounds]);

  return (
    <div
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${backgrounds[backgroundIndex]})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        transition: 'background-image 1s ease-in-out',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}
    >
      <div className="d-flex flex-column min-vh-100">
        {/* Header content would go here if you have any */}

        <Container className="flex-grow-1 d-flex">
          <Row className="justify-content-center align-items-center text-center w-100">
            <Col md={8} lg={6}>
              <div className="bg-dark bg-opacity-75 p-5 rounded shadow-lg">
                <h1 className="display-4 text-white mb-4">Recipe Manager</h1>
                <p className="lead text-white mb-5">
                  Store, organize, and discover your favorite recipes all in one place.
                </p>
                <div className="d-grid gap-3 d-md-flex justify-content-md-center">
                  <Button
                    size="lg"
                    onClick={() => navigate('/login')}
                    className="custom-btn px-4 py-2"
                  >
                    Login
                  </Button>
                  <Button
                    size="lg"
                    onClick={() => navigate('/register')}
                    className="custom-btn px-4 py-2"
                  >
                    Register
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
        <footer className="mt-auto py-3 bg-dark bg-opacity-75 text-white text-center">
          <Container>
            <p className="mb-0">
              &copy; {new Date().getFullYear()} Recipe Manager App
            </p>
          </Container>
        </footer>
      </div>
    </div>
  );
};

export default HomePage;
