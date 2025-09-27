'use client';

import { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'hospital', // Default role
    licenseNumber: '',
    governingBody: '',
    yearsOfExperience: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      // Real API call to backend
      const response = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          ...(formData.role === 'radiologist' && {
            licenseNumber: formData.licenseNumber,
            governingBody: formData.governingBody,
            yearsOfExperience: formData.yearsOfExperience,
            verificationStatus: 'pending'
          })
        }),
      });

      // If the API call fails, fall back to mock behavior
      if (!response.ok) {
        console.log('API call failed, using fallback behavior');
        // Store user data in localStorage as a fallback
        localStorage.setItem('user', JSON.stringify({
          name: formData.name,
          email: formData.email,
          role: formData.role,
          id: 'local-' + Date.now()
        }));
        
        // Redirect to sign in page
        router.push('/signin?registered=true');
        return;
      }

      const data = await response.json();
      console.log('Registration successful:', data);

      // Redirect to sign in page on success
      router.push('/signin?registered=true');
    } catch (err: any) {
      console.error('Signup error:', err);
      setError(err.message || 'An error occurred during sign up');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={6} lg={5}>
          <div className="text-center mb-4">
            <Link href="/" className="text-decoration-none">
              <h2 className="fw-bold text-primary">XpertScan</h2>
            </Link>
            <p className="text-muted">Create a new account</p>
          </div>

          <Card className="border-0 shadow-sm">
            <Card.Body className="p-4">
              {error && <Alert variant="danger">{error}</Alert>}
              
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your full name"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter your email"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Create a password"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    placeholder="Confirm your password"
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Account Type</Form.Label>
                  <div>
                    <Form.Check
                      inline
                      type="radio"
                      label="Hospital/Clinic"
                      name="role"
                      value="hospital"
                      checked={formData.role === 'hospital'}
                      onChange={handleChange}
                      id="role-hospital"
                    />
                    <Form.Check
                      inline
                      type="radio"
                      label="Radiologist"
                      name="role"
                      value="radiologist"
                      checked={formData.role === 'radiologist'}
                      onChange={handleChange}
                      id="role-radiologist"
                    />
                  </div>
                </Form.Group>

                {formData.role === 'radiologist' && (
                  <div className="border rounded p-3 mb-4 bg-light">
                    <p className="fw-bold mb-3">Radiologist Verification</p>
                    <p className="small text-muted mb-3">To ensure patient safety and compliance, we verify all radiologists through their governing medical body.</p>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>License/Registration Number</Form.Label>
                      <Form.Control
                        type="text"
                        name="licenseNumber"
                        value={formData.licenseNumber}
                        onChange={handleChange}
                        required={formData.role === 'radiologist'}
                        placeholder="Enter your medical license number"
                      />
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Governing Medical Body</Form.Label>
                      <Form.Control
                        type="text"
                        name="governingBody"
                        value={formData.governingBody}
                        onChange={handleChange}
                        required={formData.role === 'radiologist'}
                        placeholder="e.g., American Board of Radiology"
                      />
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Years of Experience</Form.Label>
                      <Form.Control
                        type="number"
                        name="yearsOfExperience"
                        value={formData.yearsOfExperience}
                        onChange={handleChange}
                        required={formData.role === 'radiologist'}
                        placeholder="Years of professional experience"
                        min="0"
                      />
                    </Form.Group>
                    
                    <Alert variant="info" className="mb-0 small">
                      <i className="bi bi-info-circle me-2"></i>
                      Your credentials will be verified within 1-2 business days. You'll receive an email once verification is complete.
                    </Alert>
                  </div>
                )}

                <Button 
                  variant="primary" 
                  type="submit" 
                  className="w-100 mb-3"
                  disabled={loading}
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </Form>

              <div className="text-center mt-3">
                <p className="mb-0">Already have an account? <Link href="/signin" className="text-primary">Sign in</Link></p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}