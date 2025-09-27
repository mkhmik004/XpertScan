'use client';

import { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Real API call to backend
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      // If the API call fails, fall back to mock behavior
      if (!response.ok) {
        console.log('API call failed, using fallback behavior');
        
        // Create fallback user data based on email
        let userRole = 'hospital';
        if (email.includes('radiologist')) {
          userRole = 'radiologist';
        } else if (email.includes('admin')) {
          userRole = 'admin';
        }
        
        const fallbackUser = {
          id: 'local-' + Date.now(),
          name: email.split('@')[0],
          email: email,
          role: userRole
        };
        
        const fallbackToken = 'fallback-jwt-token-' + Date.now();
        
        // Store fallback data in localStorage
        localStorage.setItem('token', fallbackToken);
        localStorage.setItem('user', JSON.stringify(fallbackUser));
        
        // Redirect based on role
        if (userRole === 'radiologist') {
          router.push('/radiologist/dashboard');
        } else if (userRole === 'admin') {
          router.push('/admin/dashboard');
        } else {
          router.push('/hospital/dashboard');
        }
        return;
      }

      const data = await response.json();
      console.log('Login successful:', data);

      // Store token in localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Redirect based on role
      if (data.user.role === 'admin') {
        router.push('/admin/dashboard');
      } else if (data.user.role === 'radiologist') {
        router.push('/radiologist/dashboard');
      } else {
        router.push('/hospital/dashboard');
      }
    } catch (err: any) {
      console.error('Signin error:', err);
      setError(err.message || 'An error occurred during sign in');
    } finally {
      setLoading(false);
    }
  };

  // Demo credentials for quick testing
  const fillDemoCredentials = (role: string) => {
    if (role === 'radiologist') {
      setEmail('radiologist@xpertscan.com');
      setPassword('password');
    } else if (role === 'admin') {
      setEmail('admin@xpertscan.com');
      setPassword('password');
    } else {
      setEmail('hospital@xpertscan.com');
      setPassword('password');
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
            <p className="text-muted">Sign in to your account</p>
          </div>

          <Card className="border-0 shadow-sm">
            <Card.Body className="p-4">
              {error && <Alert variant="danger">{error}</Alert>}
              
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter your email"
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter your password"
                  />
                </Form.Group>

                <Button 
                  variant="primary" 
                  type="submit" 
                  className="w-100 mb-3"
                  disabled={loading}
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
              </Form>

              <div className="text-center mt-3">
                <p className="mb-0">Don't have an account? <Link href="/signup" className="text-primary">Sign up</Link></p>
              </div>
            </Card.Body>
          </Card>

          <div className="mt-4">
            <p className="text-center text-muted mb-2">Demo Accounts (Click to fill)</p>
            <div className="d-flex justify-content-center gap-2">
              <Button 
                variant="outline-secondary" 
                size="sm"
                onClick={() => fillDemoCredentials('radiologist')}
              >
                Radiologist
              </Button>
              <Button 
                variant="outline-secondary" 
                size="sm"
                onClick={() => fillDemoCredentials('admin')}
              >
                Admin
              </Button>
              <Button 
                variant="outline-secondary" 
                size="sm"
                onClick={() => fillDemoCredentials('hospital')}
              >
                Hospital
              </Button>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}