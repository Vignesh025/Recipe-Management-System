import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register, clearError, resetRegisterSuccess } from '../store/authSlice';
import { Form, Alert, Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../styles/custom.css';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [validated, setValidated] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, registerSuccess, isAuthenticated } = useSelector(state => state.auth);

  // Redirect if already authenticated or registration was successful
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/recipes');
    }
    
    if (registerSuccess) {
      navigate('/login');
      dispatch(resetRegisterSuccess());
    }
    
    // Clear any previous errors when component mounts
    dispatch(clearError());
  }, [isAuthenticated, registerSuccess, navigate, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Check password match when either password or confirmPassword changes
    if (name === 'password' || name === 'confirmPassword') {
      if (name === 'password') {
        setPasswordMatch(value === formData.confirmPassword);
      } else {
        setPasswordMatch(formData.password === value);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    
    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setPasswordMatch(false);
      return;
    }
    
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    // Create registration data (exclude confirmPassword)
    const registrationData = {
      username: formData.username,
      password: formData.password
    };

    dispatch(register(registrationData));
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Body className="p-4">
              <h2 className="text-center mb-4">Create an Account</h2>
              
              {error && (
                <Alert variant="danger" onClose={() => dispatch(clearError())} dismissible>
                  {error}
                </Alert>
              )}
              
              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formUsername">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Choose a username"
                    required
                    minLength={3}
                  />
                  <Form.Control.Feedback type="invalid">
                    Please choose a username (at least 3 characters).
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Choose a password"
                    required
                    minLength={6}
                  />
                  <Form.Control.Feedback type="invalid">
                    Password must be at least 6 characters.
                  </Form.Control.Feedback>
                </Form.Group>
                
                <Form.Group className="mb-3" controlId="formConfirmPassword">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    required
                    isInvalid={!passwordMatch}
                  />
                  <Form.Control.Feedback type="invalid">
                    {!passwordMatch ? "Passwords don't match." : "Please confirm your password."}
                  </Form.Control.Feedback>
                </Form.Group>
                
                <div className="d-grid gap-2 mt-4">
                  <Button 
                    type="submit"
                    disabled={loading || !passwordMatch}
                    className='custom-btn'
                  >
                    {loading ? 'Registering...' : 'Register'}
                  </Button>
                </div>
                
                <div className="text-center mt-3">
                  <p className="mb-0">
                    Already have an account? <a href="/login">Login</a>
                  </p>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Register;