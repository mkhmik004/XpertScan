'use client';

import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Table, Spinner, Tabs, Tab, Alert, ProgressBar } from 'react-bootstrap';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaUserMd, FaClipboardCheck, FaClock, FaStar, FaSignOutAlt } from 'react-icons/fa';

interface Scan {
  id: string;
  patient_id: string;
  scan_type: string;
  upload_date: string;
  priority: 'high' | 'medium' | 'low';
  ai_confidence: number;
  status: 'pending' | 'assigned' | 'completed';
  image_path: string;
}

interface Job {
  id: number;
  scan_id: number;
  status: 'open' | 'assigned' | 'completed';
  patient_id: string;
  scan_type: string;
  priority: 'high' | 'medium' | 'low';
  ai_confidence: number;
  ai_prediction: string;
  image_path: string;
}

export default function RadiologistDashboard() {
  const [availableJobs, setAvailableJobs] = useState<Job[]>([]);
  const [myJobs, setMyJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        // Get user ID from local storage
        const userData = localStorage.getItem('user');
        if (!userData) {
          throw new Error('User not logged in');
        }
        
        const user = JSON.parse(userData);
        
        // Fetch available jobs
        const availableResponse = await fetch('http://localhost:3001/api/scans/jobs');
        
        // Fetch jobs assigned to this radiologist
        const myJobsResponse = await fetch(`http://localhost:3001/api/scans/radiologist?userId=${user.id}`);
        
        if (!availableResponse.ok || !myJobsResponse.ok) {
          throw new Error('Failed to fetch jobs');
        }
        
        const availableData = await availableResponse.json();
        const myJobsData = await myJobsResponse.json();
        
        if (Array.isArray(availableData) && availableData.length > 0) {
          setAvailableJobs(availableData);
        } else {
          // Use mock data for available jobs
          setAvailableJobs([
            {
              id: 1,
              scan_id: 1,
              status: 'open',
              patient_id: 'P1234',
              scan_type: 'Chest X-Ray',
              priority: 'high',
              ai_confidence: 0.92,
              ai_prediction: 'Pneumonia',
              image_path: '/samples/chest_xray_1.jpg'
            },
            {
              id: 2,
              scan_id: 2,
              status: 'open',
              patient_id: 'P2345',
              scan_type: 'Chest X-Ray',
              priority: 'medium',
              ai_confidence: 0.78,
              ai_prediction: 'Normal',
              image_path: '/samples/chest_xray_2.jpg'
            }
          ]);
        }
        
        if (Array.isArray(myJobsData) && myJobsData.length > 0) {
          setMyJobs(myJobsData);
        } else {
          // Use mock data for my jobs
          setMyJobs([
            {
              id: 3,
              scan_id: 3,
              status: 'assigned',
              patient_id: 'P3456',
              scan_type: 'Chest X-Ray',
              priority: 'low',
              ai_confidence: 0.45,
              ai_prediction: 'Normal',
              image_path: '/samples/chest_xray_3.jpg'
            }
          ]);
        }
      } catch (err: any) {
        console.log('Error fetching jobs:', err);
        setError(err.message || 'An error occurred while fetching jobs');
        
        // Use mock data
        setAvailableJobs([
          {
            id: 1,
            scan_id: 1,
            status: 'open',
            patient_id: 'P1234',
            scan_type: 'Chest X-Ray',
            priority: 'high',
            ai_confidence: 0.92,
            ai_prediction: 'Pneumonia',
            image_path: '/samples/chest_xray_1.jpg'
          },
          {
            id: 2,
            scan_id: 2,
            status: 'open',
            patient_id: 'P2345',
            scan_type: 'Chest X-Ray',
            priority: 'medium',
            ai_confidence: 0.78,
            ai_prediction: 'Normal',
            image_path: '/samples/chest_xray_2.jpg'
          }
        ]);
        
        setMyJobs([
          {
            id: 3,
            scan_id: 3,
            status: 'assigned',
            patient_id: 'P3456',
            scan_type: 'Chest X-Ray',
            priority: 'low',
            ai_confidence: 0.45,
            ai_prediction: 'Normal',
            image_path: '/samples/chest_xray_3.jpg'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleAcceptJob = async (jobId: number) => {
    try {
      setLoading(true);
      
      // Get user ID from local storage
      const userData = localStorage.getItem('user');
      if (!userData) {
        throw new Error('User not logged in');
      }
      
      const user = JSON.parse(userData);
      
      // Call API to accept job
      const response = await fetch(`http://localhost:3001/api/scans/jobs/${jobId}/accept`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId: user.id })
      });
      
      if (!response.ok) {
        throw new Error('Failed to accept job');
      }
      
      // Update job lists
      const acceptedJob = availableJobs.find(job => job.id === jobId);
      if (acceptedJob) {
        acceptedJob.status = 'assigned';
        setMyJobs([...myJobs, acceptedJob]);
        setAvailableJobs(availableJobs.filter(job => job.id !== jobId));
      }
      
      setSuccessMessage('Job accepted successfully! You can now review the scan.');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred while accepting the job');
      
      // Clear error message after 3 seconds
      setTimeout(() => {
        setError('');
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleViewScan = (scanId: number) => {
    router.push(`/radiologist/scans/${scanId}`);
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge bg="danger">Urgent</Badge>;
      case 'medium':
        return <Badge bg="warning">Priority</Badge>;
      case 'low':
        return <Badge bg="success">Routine</Badge>;
      default:
        return <Badge bg="secondary">Unknown</Badge>;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    router.push('/signin');
  };

  // Define stats for the dashboard
  const stats = {
    totalCases: 45,
    completedCases: 32,
    avgTime: "24 hrs",
    rating: 4.7
  };
  
  // Get user name from localStorage (only in browser)
  const [userName, setUserName] = useState('Radiologist');
  
  useEffect(() => {
    // Only access localStorage in the browser
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          const parsedData = JSON.parse(userData);
          setUserName(parsedData.name || 'Radiologist');
        } catch (e) {
          console.error('Error parsing user data:', e);
        }
      }
    }
  }, []);
  
  return (
    <Container fluid className="p-4">
      <Row className="mb-4 d-flex align-items-center">
        <Col>
          <h1 className="mb-0">Welcome, {userName}</h1>
          <p className="text-muted">Your personalized radiologist dashboard</p>
        </Col>
        <Col xs="auto">
          <Button variant="outline-danger" onClick={handleLogout}>
            <FaSignOutAlt className="me-2" /> Logout
          </Button>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}
      {successMessage && <Alert variant="success">{successMessage}</Alert>}

      <Row className="mb-4">
        <Col md={3}>
          <Card className="shadow-sm mb-3 bg-primary text-white">
            <Card.Body className="d-flex align-items-center">
              <div className="rounded-circle bg-white p-3 me-3">
                <FaUserMd className="text-primary" size={24} />
              </div>
              <div>
                <h6 className="mb-0">Total Cases</h6>
                <h3 className="mb-0">{stats.totalCases}</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="shadow-sm mb-3 bg-success text-white">
            <Card.Body className="d-flex align-items-center">
              <div className="rounded-circle bg-white p-3 me-3">
                <FaClipboardCheck className="text-success" size={24} />
              </div>
              <div>
                <h6 className="mb-0">Completed</h6>
                <h3 className="mb-0">{stats.completedCases}</h3>
                <small>{Math.round((stats.completedCases / stats.totalCases) * 100)}% completion rate</small>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="shadow-sm mb-3 bg-info text-white">
            <Card.Body className="d-flex align-items-center">
              <div className="rounded-circle bg-white p-3 me-3">
                <FaClock className="text-info" size={24} />
              </div>
              <div>
                <h6 className="mb-0">Avg. Time</h6>
                <h3 className="mb-0">{stats.averageTime} min</h3>
                <small>per case</small>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="shadow-sm mb-3 bg-warning text-white">
            <Card.Body className="d-flex align-items-center">
              <div className="rounded-circle bg-white p-3 me-3">
                <FaStar className="text-warning" size={24} />
              </div>
              <div>
                <h6 className="mb-0">Rating</h6>
                <h3 className="mb-0">{stats.rating.toFixed(1)}/5</h3>
                <div>
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className={i < Math.round(stats.rating) ? "text-white" : "text-white-50"} size={12} />
                  ))}
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Tabs defaultActiveKey="myJobs" id="dashboard-tabs" className="mb-4">
        <Tab eventKey="myJobs" title="My Assigned Jobs">
          {loading ? (
            <div className="text-center p-5">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : myJobs.length === 0 ? (
            <Alert variant="info">You don't have any assigned jobs yet. Check the available jobs tab to accept new work.</Alert>
          ) : (
            <Table striped bordered hover responsive className="shadow-sm">
              <thead className="bg-light">
                <tr>
                  <th>Patient ID</th>
                  <th>Scan Type</th>
                  <th>Priority</th>
                  <th>AI Prediction</th>
                  <th>AI Confidence</th>
                  <th>Review</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {myJobs.map((job) => (
                  <tr key={job.id}>
                    <td>{job.patient_id}</td>
                    <td>{job.scan_type}</td>
                    <td>{getPriorityBadge(job.priority)}</td>
                    <td>{job.ai_prediction}</td>
                    <td>
                      {(job.ai_confidence * 100).toFixed(1)}%
                      <ProgressBar 
                        now={job.ai_confidence * 100} 
                        variant={job.ai_confidence > 0.8 ? "success" : job.ai_confidence > 0.6 ? "warning" : "danger"}
                        style={{height: "5px"}}
                      />
                    </td>
                    <td>
                      {job.review ? (
                        <div>
                          <div>
                            {[...Array(5)].map((_, i) => (
                              <FaStar key={i} className={i < (job.rating || 0) ? "text-warning" : "text-muted"} size={12} />
                            ))}
                          </div>
                          <small className="text-muted">{job.review}</small>
                        </div>
                      ) : (
                        <span className="text-muted">No review yet</span>
                      )}
                    </td>
                    <td>
                      <Button 
                        variant="primary" 
                        size="sm" 
                        onClick={() => handleViewScan(job.scan_id)}
                      >
                        Review Scan
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Tab>
        
        <Tab eventKey="availableJobs" title="Available Jobs">
          {loading ? (
            <div className="text-center p-5">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : availableJobs.length === 0 ? (
            <Alert variant="info">There are no available jobs at the moment. Please check back later.</Alert>
          ) : (
            <Table striped bordered hover responsive className="shadow-sm">
              <thead className="bg-light">
                <tr>
                  <th>Patient ID</th>
                  <th>Scan Type</th>
                  <th>Priority</th>
                  <th>AI Prediction</th>
                  <th>AI Confidence</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {availableJobs.map((job) => (
                  <tr key={job.id}>
                    <td>{job.patient_id}</td>
                    <td>{job.scan_type}</td>
                    <td>{getPriorityBadge(job.priority)}</td>
                    <td>{job.ai_prediction}</td>
                    <td>
                      {(job.ai_confidence * 100).toFixed(1)}%
                      <ProgressBar 
                        now={job.ai_confidence * 100} 
                        variant={job.ai_confidence > 0.8 ? "success" : job.ai_confidence > 0.6 ? "warning" : "danger"}
                        style={{height: "5px"}}
                      />
                    </td>
                    <td>
                      <Button 
                        variant="success" 
                        size="sm" 
                        onClick={() => handleAcceptJob(job.id)}
                        disabled={loading}
                      >
                        Accept Job
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Tab>
      </Tabs>
    </Container>
  );

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <h2 className="fw-bold">Radiologist Dashboard</h2>
          <p className="text-muted">Review and analyze patient scans</p>
        </Col>
        <Col xs="auto" className="d-flex align-items-center">
          <Button variant="outline-secondary" className="me-2">
            <i className="bi bi-bell"></i> Notifications
          </Button>
          <div className="dropdown">
            <Button variant="outline-secondary" id="profileDropdown" data-bs-toggle="dropdown" aria-expanded="false">
              <i className="bi bi-person"></i> Profile
            </Button>
            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="profileDropdown">
              <li><a className="dropdown-item" href="#">My Account</a></li>
              <li><a className="dropdown-item" href="#">Settings</a></li>
              <li><hr className="dropdown-divider" /></li>
              <li><a className="dropdown-item" href="#" onClick={handleLogout}>Sign Out</a></li>
            </ul>
          </div>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={3}>
          <Card className="border-0 shadow-sm mb-4">
            <Card.Body className="p-4">
              <div className="d-flex align-items-center mb-3">
                <div className="rounded-circle bg-primary-subtle p-3 me-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-clipboard2-pulse text-primary" viewBox="0 0 16 16">
                    <path d="M9.5 0a.5.5 0 0 1 .5.5.5.5 0 0 0 .5.5.5.5 0 0 1 .5.5V2a.5.5 0 0 1-.5.5h-5A.5.5 0 0 1 5 2v-.5a.5.5 0 0 1 .5-.5.5.5 0 0 0 .5-.5.5.5 0 0 1 .5-.5z"/>
                    <path d="M3 2.5a.5.5 0 0 1 .5-.5H4a.5.5 0 0 0 0-1h-.5A1.5 1.5 0 0 0 2 2.5v12A1.5 1.5 0 0 0 3.5 16h9a1.5 1.5 0 0 0 1.5-1.5v-12A1.5 1.5 0 0 0 12.5 1H12a.5.5 0 0 0 0 1h.5a.5.5 0 0 1 .5.5v12a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5z"/>
                    <path d="M9.979 5.356a.5.5 0 0 0-.968.04L7.92 10.49l-.94-3.135a.5.5 0 0 0-.926-.08L4.69 10H4.5a.5.5 0 0 0 0 1H5a.5.5 0 0 0 .447-.276l.936-1.873 1.138 3.793a.5.5 0 0 0 .968-.04L9.58 7.51l.94 3.135A.5.5 0 0 0 11 11h.5a.5.5 0 0 0 0-1h-.128z"/>
                  </svg>
                </div>
                <div>
                  <h6 className="text-muted mb-1">Pending Reviews</h6>
                  <h3 className="fw-bold mb-0">3</h3>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm mb-4">
            <Card.Body className="p-4">
              <div className="d-flex align-items-center mb-3">
                <div className="rounded-circle bg-success-subtle p-3 me-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-check-circle text-success" viewBox="0 0 16 16">
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                    <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05"/>
                  </svg>
                </div>
                <div>
                  <h6 className="text-muted mb-1">Completed Today</h6>
                  <h3 className="fw-bold mb-0">12</h3>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm mb-4">
            <Card.Body className="p-4">
              <div className="d-flex align-items-center mb-3">
                <div className="rounded-circle bg-danger-subtle p-3 me-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-exclamation-triangle text-danger" viewBox="0 0 16 16">
                    <path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.15.15 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.2.2 0 0 1-.054.06.1.1 0 0 1-.066.017H1.146a.1.1 0 0 1-.066-.017.2.2 0 0 1-.054-.06.18.18 0 0 1 .002-.183L7.884 2.073a.15.15 0 0 1 .054-.057m1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767z"/>
                    <path d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z"/>
                  </svg>
                </div>
                <div>
                  <h6 className="text-muted mb-1">Urgent Cases</h6>
                  <h3 className="fw-bold mb-0">2</h3>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm mb-4">
            <Card.Body className="p-4">
              <div className="d-flex align-items-center mb-3">
                <div className="rounded-circle bg-info-subtle p-3 me-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-graph-up text-info" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M0 0h1v15h15v1H0zm14.817 3.113a.5.5 0 0 1 .07.704l-4.5 5.5a.5.5 0 0 1-.74.037L7.06 6.767l-3.656 5.027a.5.5 0 0 1-.808-.588l4-5.5a.5.5 0 0 1 .758-.06l2.609 2.61 4.15-5.073a.5.5 0 0 1 .704-.07"/>
                  </svg>
                </div>
                <div>
                  <h6 className="text-muted mb-1">AI Accuracy</h6>
                  <h3 className="fw-bold mb-0">92%</h3>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="border-0 shadow-sm mb-4">
        <Card.Header className="bg-white py-3 d-flex justify-content-between align-items-center">
          <h5 className="mb-0 fw-bold">Pending Scans</h5>
          <Badge bg="info" className="px-3 py-2">AI-Prioritized Queue</Badge>
        </Card.Header>
        <Card.Body>
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3">Loading scans...</p>
            </div>
          ) : error ? (
            <div className="text-center py-5">
              <p className="text-danger">{error}</p>
            </div>
          ) : (
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Scan Type</th>
                  <th>Upload Date</th>
                  <th>Priority</th>
                  <th>AI Confidence</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(scans) && scans.filter(scan => scan.status === 'pending').map(scan => (
                  <tr key={scan.id}>
                    <td>
                      <div className="fw-bold">{scan.patientName}</div>
                      <small className="text-muted">ID: {scan.patientId}</small>
                    </td>
                    <td>{scan.scanType}</td>
                    <td>{scan.uploadDate}</td>
                    <td>{getPriorityBadge(scan.priority)}</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="progress flex-grow-1" style={{ height: '6px' }}>
                          <div 
                            className="progress-bar" 
                            role="progressbar" 
                            style={{ width: `${scan.aiConfidence * 100}%` }}
                            aria-valuenow={scan.aiConfidence * 100} 
                            aria-valuemin={0} 
                            aria-valuemax={100}
                          ></div>
                        </div>
                        <span className="ms-2">{Math.round(scan.aiConfidence * 100)}%</span>
                      </div>
                    </td>
                    <td>
                      <Badge bg={scan.status === 'pending' ? 'warning' : 'success'}>
                        {scan.status === 'pending' ? 'Pending' : 'Reviewed'}
                      </Badge>
                    </td>
                    <td>
                      <Link href={`/radiologist/scans/${scan.id}`}>
                        <Button variant="primary" size="sm">Review</Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}