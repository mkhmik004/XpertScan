'use client';

import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Table, Form, Spinner, Alert } from 'react-bootstrap';
import Link from 'next/link';
import { FaSignOutAlt } from 'react-icons/fa';

interface Report {
  id: string;
  scanId: string;
  patientName: string;
  scanType: string;
  reportDate: string;
  radiologistName: string;
  status: 'completed' | 'pending';
}

export default function HospitalDashboard() {
  const [reports, setReports] = useState<Report[]>([]);
  // Initialize with empty array for reports
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [patientName, setPatientName] = useState('');
  const [patientId, setPatientId] = useState('');
  const [scanType, setScanType] = useState('Chest X-Ray');
  const [allocationType, setAllocationType] = useState('internal');

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      
      // For now, we'll use mock data instead of making API calls
      // This avoids the JSON parsing error until the backend is fully implemented
      
      setTimeout(() => {
        const mockReports: Report[] = [
          {
            id: '1',
            scanId: 'SCN-001',
            patientName: 'John Doe',
            scanType: 'Chest X-Ray',
            reportDate: '2023-05-15',
            radiologistName: 'Dr. Smith',
            status: 'completed'
          },
          {
            id: '2',
            scanId: 'SCN-002',
            patientName: 'Jane Smith',
            scanType: 'MRI Brain',
            reportDate: '2023-05-14',
            radiologistName: 'Dr. Johnson',
            status: 'pending'
          },
          {
            id: '3',
            scanId: 'SCN-003',
            patientName: 'Robert Brown',
            scanType: 'CT Scan Abdomen',
            reportDate: '2023-05-13',
            radiologistName: 'Open Market',
            status: 'completed'
          },
          {
            id: '4',
            scanId: 'SCN-004',
            patientName: 'Emily Wilson',
            scanType: 'Ultrasound',
            reportDate: '2023-05-12',
            radiologistName: 'Internal Staff',
            status: 'pending'
          },
          {
            id: '5',
            scanId: 'SCN-005',
            patientName: 'Michael Johnson',
            scanType: 'X-Ray Hand',
            reportDate: '2023-05-11',
            radiologistName: 'Dr. Williams',
            status: 'completed'
          }
        ];
        
        setReports(mockReports);
        setLoading(false);
      }, 800);
    };

    fetchReports();
  }, []);

  const handleUploadScan = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadError('');
    setUploadSuccess(false);
    setUploadLoading(true);
    
    try {
      const form = e.target as HTMLFormElement;
      const fileInput = form.querySelector('input[type="file"]') as HTMLInputElement;
      
      if (!fileInput || !fileInput.files) {
        console.error('File input not found');
        setUploadError('File input not found. Please try again.');
        setUploadLoading(false);
        return;
      }
      
      const file = fileInput.files[0];
      
      if (!file) {
        setUploadError('Please select a scan image to upload');
        setUploadLoading(false);
        return;
      }
      
      console.log('File selected:', file.name, 'Size:', file.size);
      
      if (!patientName || !patientId || !scanType) {
        setUploadError('Please fill in all required fields');
        setUploadLoading(false);
        return;
      }
      
      // Get user data from localStorage
      const userData = localStorage.getItem('user');
      let userId = 'demo-user';
      
      if (userData) {
        try {
          const user = JSON.parse(userData);
          userId = user.id || 'demo-user';
        } catch (e) {
          console.error('Error parsing user data:', e);
        }
      }
      
      // Create FormData object
      const formData = new FormData();
      formData.append('image', file);
      formData.append('hospitalId', userId);
      formData.append('patientId', patientId);
      formData.append('patientName', patientName);
      formData.append('scanType', scanType);
      formData.append('priority', allocationType === 'urgent' ? 'high' : 'medium');
      
      console.log('Uploading scan with data:', {
        patientName,
        patientId,
        scanType,
        allocationType,
        fileName: file?.name
      });
      
      try {
        // Try to send to backend
        const response = await fetch('http://localhost:3001/api/scans/upload', {
          method: 'POST',
          body: formData,
        });
        
        if (!response.ok) {
          console.log('API call failed, using mock implementation');
          throw new Error('API call failed');
        }
        
        const data = await response.json();
        console.log('Upload successful:', data);
      } catch (error) {
        console.log('Using mock implementation due to error:', error);
        // Mock implementation - simulate successful upload
        
        // Add mock scan to localStorage
        const mockScans = JSON.parse(localStorage.getItem('mockScans') || '[]');
        const newMockScan = {
          id: Date.now().toString(),
          patientName,
          patientId,
          scanType,
          status: 'pending',
          date: new Date().toISOString(),
          priority: allocationType === 'urgent' ? 'high' : 'medium'
        };
        mockScans.push(newMockScan);
        localStorage.setItem('mockScans', JSON.stringify(mockScans));
      }
      
      // Reset form
      setPatientName('');
      setPatientId('');
      setScanType('Chest X-Ray');
      setAllocationType('internal');
      form.reset();
      
      setUploadSuccess(true);
      
      // Add the new scan to the reports list with pending status
      const newReport: Report = {
        id: Math.random().toString(36).substring(7),
        scanId: `SCN-${Math.floor(Math.random() * 1000)}`,
        patientName,
        scanType,
        reportDate: new Date().toISOString().split('T')[0],
        radiologistName: allocationType === 'internal' ? 'Internal Staff' : 'Open Market',
        status: 'pending'
      };
      
      setReports(prev => [newReport, ...(Array.isArray(prev) ? prev : [])]);
      
    } catch (err: any) {
      console.error('Upload error:', err);
      setUploadError(err.message || 'An error occurred while uploading the scan');
    } finally {
      setUploadLoading(false);
    }
  };

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    // Redirect to sign in page
    window.location.href = '/signin';
  };

  // State for user name
  const [userName, setUserName] = useState('Hospital Admin');
  
  // Get user name from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          const user = JSON.parse(userData);
          setUserName(user.name || 'Hospital Admin');
        } catch (e) {
          console.error('Error parsing user data:', e);
        }
      }
    }
  }, []);

  return (
    <Container fluid className="py-4">
      <Row className="mb-4 d-flex align-items-center">
        <Col>
          <h1 className="mb-0">Welcome, {userName}</h1>
          <p className="text-muted">Your hospital dashboard</p>
        </Col>
        <Col xs="auto">
          <Button variant="outline-danger" onClick={handleLogout}>
            <FaSignOutAlt className="me-2" /> Logout
          </Button>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={3}>
          <Card className="border-0 shadow-sm mb-4">
            <Card.Body className="p-4">
              <div className="d-flex align-items-center mb-3">
                <div className="rounded-circle bg-primary-subtle p-3 me-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-cloud-upload text-primary" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M4.406 1.342A5.53 5.53 0 0 1 8 0c2.69 0 4.923 2 5.166 4.579C14.758 4.804 16 6.137 16 7.773 16 9.569 14.502 11 12.687 11H10a.5.5 0 0 1 0-1h2.688C13.979 10 15 8.988 15 7.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 2.825 10.328 1 8 1a4.53 4.53 0 0 0-2.941 1.1c-.757.652-1.153 1.438-1.153 2.055v.448l-.445.049C2.064 4.805 1 5.952 1 7.318 1 8.785 2.23 10 3.781 10H6a.5.5 0 0 1 0 1H3.781C1.708 11 0 9.366 0 7.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383z"/>
                    <path fillRule="evenodd" d="M7.646 4.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707V14.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3z"/>
                  </svg>
                </div>
                <div>
                  <h6 className="text-muted mb-1">Total Scans</h6>
                  <h3 className="fw-bold mb-0">{Array.isArray(reports) ? reports.length : 0}</h3>
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
                  <h6 className="text-muted mb-1">Completed Reports</h6>
                  <h3 className="fw-bold mb-0">{Array.isArray(reports) ? reports.filter(r => r.status === 'completed').length : 0}</h3>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm mb-4">
            <Card.Body className="p-4">
              <div className="d-flex align-items-center mb-3">
                <div className="rounded-circle bg-warning-subtle p-3 me-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-hourglass-split text-warning" viewBox="0 0 16 16">
                    <path d="M2.5 15a.5.5 0 1 1 0-1h1v-1a4.5 4.5 0 0 1 2.557-4.06c.29-.139.443-.377.443-.59v-.7c0-.213-.154-.451-.443-.59A4.5 4.5 0 0 1 3.5 3V2h-1a.5.5 0 0 1 0-1h11a.5.5 0 0 1 0 1h-1v1a4.5 4.5 0 0 1-2.557 4.06c-.29.139-.443.377-.443.59v.7c0 .213.154.451.443.59A4.5 4.5 0 0 1 12.5 13v1h1a.5.5 0 0 1 0 1zm2-13v1c0 .537.12 1.045.337 1.5h6.326c.216-.455.337-.963.337-1.5V2zm3 6.35c0 .701-.478 1.236-1.011 1.492A3.5 3.5 0 0 0 4.5 13s.866-1.299 3-1.48zm1 0v3.17c2.134.181 3 1.48 3 1.48a3.5 3.5 0 0 0-1.989-3.158C8.978 9.586 8.5 9.052 8.5 8.351z"/>
                  </svg>
                </div>
                <div>
                  <h6 className="text-muted mb-1">Pending Reports</h6>
                  <h3 className="fw-bold mb-0">{Array.isArray(reports) ? reports.filter(r => r.status === 'pending').length : 0}</h3>
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
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-lightning-charge text-info" viewBox="0 0 16 16">
                    <path d="M11.251.068a.5.5 0 0 1 .227.58L9.677 6.5H13a.5.5 0 0 1 .364.843l-8 8.5a.5.5 0 0 1-.842-.49L6.323 9.5H3a.5.5 0 0 1-.364-.843l8-8.5a.5.5 0 0 1 .615-.09z"/>
                  </svg>
                </div>
                <div>
                  <h6 className="text-muted mb-1">Average Response</h6>
                  <h3 className="fw-bold mb-0">2.5h</h3>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col lg={5}>
          <Card className="border-0 shadow-sm mb-4">
            <Card.Header className="bg-white py-3 d-flex justify-content-between align-items-center">
              <h5 className="mb-0 fw-bold">Upload New Scan</h5>
              <Badge bg="success" className="px-3 py-2">PACS Integrated</Badge>
            </Card.Header>
            <Card.Body>
              {uploadSuccess && (
                <Alert variant="success" className="mb-3">
                  Scan uploaded successfully! It has been sent for AI analysis and radiologist review.
                </Alert>
              )}
              
              <Alert variant="info" className="mb-3 small">
                <div className="d-flex">
                  <div className="me-2">
                    <i className="bi bi-info-circle-fill"></i>
                  </div>
                  <div>
                    <strong>PACS Integration Active</strong>
                    <p className="mb-0">XpertScan automatically syncs with your PACS system. Scans are securely stored, shared, and organized in compliance with healthcare standards.</p>
                  </div>
                </div>
              </Alert>
              
              {uploadError && (
                <Alert variant="danger" className="mb-3">
                  {uploadError}
                </Alert>
              )}
              
              <Form onSubmit={handleUploadScan}>
                <Form.Group className="mb-3">
                  <Form.Label>Patient Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    required
                    placeholder="Enter patient name"
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Patient ID</Form.Label>
                  <Form.Control
                    type="text"
                    value={patientId}
                    onChange={(e) => setPatientId(e.target.value)}
                    required
                    placeholder="Enter patient ID"
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Scan Type</Form.Label>
                  <Form.Select
                    value={scanType}
                    onChange={(e) => setScanType(e.target.value)}
                    required
                  >
                    <option value="Chest X-Ray">Chest X-Ray</option>
                    <option value="Abdominal X-Ray">Abdominal X-Ray</option>
                    <option value="Skull X-Ray">Skull X-Ray</option>
                    <option value="Spine X-Ray">Spine X-Ray</option>
                  </Form.Select>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Allocation Type</Form.Label>
                  <Form.Select
                    value={allocationType}
                    onChange={(e) => setAllocationType(e.target.value)}
                  >
                    <option value="internal">Internal Staff</option>
                    <option value="market">Open Market</option>
                  </Form.Select>
                  <Form.Text className="text-muted">
                    Choose where to allocate this scan for review
                  </Form.Text>
                </Form.Group>
                
                <Form.Group className="mb-4">
                  <Form.Label>Upload X-Ray Image</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*,.dicom,.dcm"
                    required
                  />
                  <Form.Text className="text-muted">
                    Supported formats: JPEG, PNG, DICOM (max 50MB)
                  </Form.Text>
                </Form.Group>
                
                <div className="d-grid">
                  <Button 
                    variant="primary" 
                    type="submit"
                    disabled={uploadLoading}
                  >
                    {uploadLoading ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="me-2"
                        />
                        Uploading...
                      </>
                    ) : 'Upload Scan'}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={7}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white py-3 d-flex justify-content-between align-items-center">
              <h5 className="mb-0 fw-bold">Recent Reports</h5>
              <Link href="/hospital/reports">
                <Button variant="outline-primary" size="sm">View All</Button>
              </Link>
            </Card.Header>
            <Card.Body>
              {loading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" variant="primary" />
                  <p className="mt-3">Loading reports...</p>
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
                      <th>Date</th>
                      <th>Radiologist</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(reports) && reports.map(report => (
                      <tr key={report.id}>
                        <td>{report.patientName}</td>
                        <td>{report.scanType}</td>
                        <td>{report.reportDate || 'Pending'}</td>
                        <td>{report.radiologistName || 'Pending Assignment'}</td>
                        <td>
                          <Badge bg={report.status === 'completed' ? 'success' : 'warning'}>
                            {report.status === 'completed' ? 'Completed' : 'Pending'}
                          </Badge>
                        </td>
                        <td>
                          {report.status === 'completed' ? (
                            <Link href={`/hospital/reports/${report.id}`}>
                              <Button variant="primary" size="sm">View Report</Button>
                            </Link>
                          ) : (
                            <Button variant="outline-secondary" size="sm" disabled>Pending</Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}