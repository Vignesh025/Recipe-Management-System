import React, { useEffect, useMemo, useState } from 'react';
import { Container, Row, Col} from 'react-bootstrap';
import Register from '../components/Register';

const RegisterPage = () => {
  const [backgroundIndex, setBackgroundIndex] = useState(0);

  // Array of background images wrapped in useMemo
  const backgrounds = useMemo(() => [
    'https://images.unsplash.com/photo-1495521821757-a1efb6729352?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1926&q=80',
    'https://images.unsplash.com/photo-1490818387583-1baba5e638af?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1932&q=80',
    'https://images.unsplash.com/photo-1606787366850-de6330128bfc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1950&q=80',
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1950&q=80'
  ], []);

  useEffect(() => {
    const interval = setInterval(() => {
      setBackgroundIndex(prevIndex => (prevIndex + 1) % backgrounds.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [backgrounds.length]);

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

      {/* Main Content */}
      <Container className="d-flex align-items-center justify-content-center flex-grow-1">
        <Row className="justify-content-center w-100">
          <Col md={8} lg={6}>
            <Register />
          </Col>
        </Row>
      </Container>

      {/* Footer */}
      <footer className="mt-auto py-3 bg-dark bg-opacity-75 text-white text-center">
          <Container>
            <p className="mb-0">
              &copy; {new Date().getFullYear()} Recipe Manager App
            </p>
          </Container>
        </footer>
    </div>
  );
};

export default RegisterPage; 