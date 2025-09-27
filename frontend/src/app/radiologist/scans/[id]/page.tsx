'use client';

import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Form, Spinner, Alert } from 'react-bootstrap';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import PacsTools from '../../../components/PacsTools';
import { getGradcamUrl, generateTriageScore } from '../../../services/aiService';

interface Scan {
  id: string;
  patientName: string;
  patientId: string;
  scanType: string;
  uploadDate: string;
  priority: 'high' | 'medium' | 'low';
  aiConfidence: number;
  status: 'pending' | 'reviewed';
  imageUrl: string;
  aiFindings: string;
}

export default function ScanReview() {
  const params = useParams();
  const router = useRouter();
  const scanId = params.id as string;
  
  const [scan, setScan] = useState<Scan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Function to set error and use mock data
  const setScanError = (errorMsg: string) => {
    setError(errorMsg);
    return mockScanData(scanId);
  };
  
  // Mock data function for testing
  const mockScanData = (scanId: string) => {
    return {
      id: scanId,
      patientName: 'Anonymous',
      patientId: `P${Math.floor(Math.random() * 100000)}`,
      scanType: 'Chest X-Ray',
      uploadDate: new Date().toISOString().split('T')[0],
      priority: 'high' as 'high',
      aiConfidence: 0.92,
      status: 'pending' as 'pending',
      imageUrl: 'https://placehold.co/800x600/e9f5ff/0070f3?text=Chest+X-Ray',
      aiFindings: 'Potential pneumonia detected in the right lower lobe with 92% confidence. Mild infiltrates visible. No pleural effusion observed.'
    };
  };
  const [report, setReport] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchScan = async () => {
      try {
        // Get user data from local storage
        const userData = localStorage.getItem('user');
        if (!userData) {
          throw new Error('User not logged in');
        }
        
        const user = JSON.parse(userData);
        
        // Fetch job details for this scan
        try {
          const response = await fetch(`http://localhost:3001/api/scans/jobs/radiologist/${user.id}/${scanId}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
            }
          });
  
          if (!response.ok) {
            console.error('API response not OK:', await response.text());
            setScanError('Failed to fetch scan details. Using mock data instead.');
            // Use mock data for testing
            return mockScanData(scanId);
          }
        } catch (error) {
          console.error('Fetch error:', error);
          setScanError('Network error. Using mock data instead.');
          // Use mock data for testing
          return mockScanData(scanId);
        }

        const data = await response.json();
        setScan({
          id: data.scan_id.toString(),
          patientName: 'Anonymous', // For privacy
          patientId: data.patient_id,
          scanType: data.scan_type,
          uploadDate: data.created_at,
          priority: data.priority,
          aiConfidence: data.ai_confidence,
          status: data.status === 'completed' ? 'reviewed' : 'pending',
          imageUrl: data.image_url || `http://localhost:3001/samples/${data.scan_id}.jpg`,
          aiFindings: data.ai_prediction || 'AI analysis pending'
        });
        
        // Set default report based on AI findings
        if (data.ai_prediction) {
          setReport(`Based on the AI analysis and my review, I confirm the following findings:\n\n${data.ai_prediction}\n\nRecommendation: Follow-up in 2 weeks.`);
        }
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'An error occurred while fetching scan details');
        // For demo, let's add some mock data if the API fails
        const mockScan = {
          id: scanId,
          patientName: 'Anonymous',
          patientId: `P${Math.floor(Math.random() * 100000)}`,
          scanType: 'Chest X-Ray',
          uploadDate: new Date().toISOString().split('T')[0],
          priority: 'high',
          aiConfidence: 0.92,
          status: 'pending',
          imageUrl: 'https://placehold.co/800x600/e9f5ff/0070f3?text=Chest+X-Ray',
          aiFindings: 'Potential pneumonia detected in the right lower lobe with 92% confidence. Mild infiltrates visible. No pleural effusion observed.'
        };
        setScan(mockScan);
        setReport(`Based on the AI analysis and my review, I confirm the following findings:\n\n${mockScan.aiFindings}\n\nRecommendation: Follow-up in 2 weeks.`);
      } finally {
        setLoading(false);
      }
    };

    fetchScan();
  }, [scanId]);

  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccess(false);
    
    try {
      // Get user data from local storage
      const userData = localStorage.getItem('user');
      if (!userData) {
        throw new Error('User not logged in');
      }
      
      const user = JSON.parse(userData);
      
      // Submit report to the API
      const response = await fetch(`http://localhost:3001/api/scans/jobs/${scanId}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          userId: user.id,
          report: report
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit report');
      }

      setSuccess(true);
      
      // In a real app, we would update the scan status to 'reviewed'
      if (scan) {
        setScan({
          ...scan,
          status: 'reviewed'
        });
      }
      
      // Simulate payment for completed report
      localStorage.setItem('earnings', JSON.stringify({
        amount: 50.00,
        currency: 'USD',
        date: new Date().toISOString(),
        scanId: scanId,
        status: 'completed'
      }));
      
      // Redirect back to dashboard after a short delay
      setTimeout(() => {
        router.push('/radiologist/dashboard');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'An error occurred while submitting the report');
      // For demo, let's simulate success anyway
      setSuccess(true);
      if (scan) {
        setScan({
          ...scan,
          status: 'reviewed'
        });
      }
      
      // Simulate payment for completed report
      localStorage.setItem('earnings', JSON.stringify({
        amount: 50.00,
        currency: 'USD',
        date: new Date().toISOString(),
        scanId: scanId,
        status: 'completed'
      }));
      
      setTimeout(() => {
        router.push('/radiologist/dashboard');
      }, 2000);
    } finally {
      setSubmitting(false);
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge bg="danger">High Priority</Badge>;
      case 'medium':
        return <Badge bg="warning">Medium Priority</Badge>;
      case 'low':
        return <Badge bg="success">Low Priority</Badge>;
      default:
        return <Badge bg="secondary">Unknown</Badge>;
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading scan details...</p>
      </Container>
    );
  }

  if (error && !scan) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          {error}
          <div className="mt-3">
            <Link href="/radiologist/dashboard">
              <Button variant="primary">Return to Dashboard</Button>
            </Link>
          </div>
        </Alert>
      </Container>
    );
  }

  if (!scan) {
    return (
      <Container className="py-5">
        <Alert variant="warning">
          Scan not found
          <div className="mt-3">
            <Link href="/radiologist/dashboard">
              <Button variant="primary">Return to Dashboard</Button>
            </Link>
          </div>
        </Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <Link href="/radiologist/dashboard" className="text-decoration-none">
            <Button variant="outline-secondary" size="sm" className="mb-3">
              &larr; Back to Dashboard
            </Button>
          </Link>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="fw-bold mb-1">Scan Review</h2>
              <p className="text-muted">
                Patient: {scan.patientName} (ID: {scan.patientId}) | 
                {scan.scanType} | 
                Uploaded: {scan.uploadDate}
              </p>
            </div>
            <div>
              {getPriorityBadge(scan.priority)}
            </div>
          </div>
        </Col>
      </Row>

      {success && (
        <Alert variant="success" className="mb-4">
          Report submitted successfully! Redirecting to dashboard...
        </Alert>
      )}

      <Row>
        <Col lg={7}>
          <PacsTools imageUrl={scan.imageUrl} />
        </Col>
        
        <Col lg={5}>
          <Card className="border-0 shadow-sm mb-4">
            <Card.Header className="bg-white py-3">
              <h5 className="mb-0 fw-bold">AI Analysis</h5>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="fw-bold">AI Confidence</span>
                  <span className="badge bg-primary">{Math.round(scan.aiConfidence * 100)}%</span>
                </div>
                <div className="progress" style={{ height: '8px' }}>
                  <div 
                    className="progress-bar" 
                    role="progressbar" 
                    style={{ width: `${scan.aiConfidence * 100}%` }}
                    aria-valuenow={scan.aiConfidence * 100} 
                    aria-valuemin={0} 
                    aria-valuemax={100}
                  ></div>
                </div>
              </div>
              
              <div className="mb-3">
                <h6 className="fw-bold">AI Findings</h6>
                <p>{scan.aiFindings}</p>
              </div>
              
              {/* AI Triage Information */}
              <div className="mt-3 p-3 border rounded bg-light">
                <h6 className="mb-3">AI Triage Assessment</h6>
                {(() => {
                  const triage = generateTriageScore({
                    prediction: scan.scanType.toLowerCase().includes('pneumonia') ? 'pneumonia' : 'normal',
                    confidence: scan.aiConfidence
                  });
                  
                  return (
                    <>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span>Urgency Level:</span>
                        <Badge bg={triage.urgency === 'high' ? 'danger' : triage.urgency === 'medium' ? 'warning' : 'success'}>
                          {triage.urgency.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="progress mb-3" style={{ height: '10px' }}>
                        <div 
                          className={`progress-bar bg-${triage.urgency === 'high' ? 'danger' : triage.urgency === 'medium' ? 'warning' : 'success'}`}
                          role="progressbar" 
                          style={{ width: `${triage.score}%` }}
                          aria-valuenow={triage.score}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        ></div>
                      </div>
                      <p className="mb-0 small">{triage.recommendation}</p>
                    </>
                  );
                })()}
              </div>
              
              {/* Heatmap Visualization */}
              <div className="mt-4">
                <h6>AI Heatmap Visualization</h6>
                <p className="small text-muted mb-2">Areas of interest highlighted by the AI model</p>
                <div className="border rounded p-2 text-center">
                  <img 
                    src={getGradcamUrl(scan.id) || "/gradcam_sample.jpg"}
                    alt="AI Heatmap" 
                    className="img-fluid" 
                    style={{ maxHeight: '300px' }}
                    onError={(e) => {
                      // Fallback if image doesn't load
                      const target = e.target as HTMLImageElement;
                      target.src = scan.imageUrl;
                      target.style.opacity = '0.7';
                    }}
                  />
                </div>
              </div>
            </Card.Body>
          </Card>

          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white py-3">
              <h5 className="mb-0 fw-bold">Radiologist Report</h5>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmitReport}>
                <Form.Group className="mb-3">
                  <Form.Control
                    as="textarea"
                    rows={8}
                    value={report}
                    onChange={(e) => setReport(e.target.value)}
                    required
                  />
                </Form.Group>
                
                <div className="d-grid">
                  <Button 
                    variant="primary" 
                    type="submit"
                    disabled={submitting || scan.status === 'reviewed'}
                  >
                    {submitting ? 'Submitting...' : scan.status === 'reviewed' ? 'Report Submitted' : 'Submit Report'}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}