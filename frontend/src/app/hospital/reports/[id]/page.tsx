'use client';

import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Spinner } from 'react-bootstrap';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { FaArrowLeft, FaDownload, FaPrint } from 'react-icons/fa';

interface Report {
  id: string;
  scanId: string;
  patientName: string;
  patientId: string;
  scanType: string;
  reportDate: string;
  radiologistName: string;
  findings: string;
  impression: string;
  recommendation: string;
  status: 'completed' | 'pending';
  imagePath?: string;
}

export default function ReportDetail() {
  const params = useParams();
  const router = useRouter();
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReportDetail = async () => {
      setLoading(true);
      
      try {
        // In a real implementation, we would fetch from the API
        // const response = await fetch(`http://localhost:3001/api/reports/${params.id}`);
        // const data = await response.json();
        
        // For now, use mock data
        setTimeout(() => {
          // Mock data for the report
          const mockReport: Report = {
            id: params.id as string,
            scanId: `SCN-${params.id}`,
            patientName: 'John Doe',
            patientId: 'P12345',
            scanType: 'Chest X-Ray',
            reportDate: '2023-05-15',
            radiologistName: 'Dr. Smith',
            findings: 'The lungs are clear without focal consolidation, pneumothorax, or pleural effusion. The cardiomediastinal silhouette is normal. The visualized osseous structures are intact.',
            impression: 'Normal chest radiograph.',
            recommendation: 'No follow-up imaging is required.',
            status: 'completed',
            imagePath: '/samples/chest_xray_1.jpg'
          };
          
          setReport(mockReport);
          setLoading(false);
        }, 800);
      } catch (err: any) {
        console.error('Error fetching report:', err);
        setError(err.message || 'An error occurred while fetching the report');
        setLoading(false);
      }
    };
    
    if (params.id) {
      fetchReportDetail();
    }
  }, [params.id]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // In a real implementation, this would generate and download a PDF
    alert('PDF download functionality would be implemented here');
  };

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading report...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <div className="text-center py-5">
          <p className="text-danger">{error}</p>
          <Button variant="primary" onClick={() => router.back()}>Go Back</Button>
        </div>
      </Container>
    );
  }

  if (!report) {
    return (
      <Container className="py-5">
        <div className="text-center py-5">
          <p>Report not found</p>
          <Button variant="primary" onClick={() => router.back()}>Go Back</Button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Link href="/hospital/dashboard">
          <Button variant="outline-primary">
            <FaArrowLeft className="me-2" /> Back to Dashboard
          </Button>
        </Link>
        <div>
          <Button variant="outline-secondary" className="me-2" onClick={handlePrint}>
            <FaPrint className="me-2" /> Print
          </Button>
          <Button variant="primary" onClick={handleDownload}>
            <FaDownload className="me-2" /> Download PDF
          </Button>
        </div>
      </div>

      <Card className="border-0 shadow-sm mb-4">
        <Card.Header className="bg-white py-3">
          <h4 className="mb-0 fw-bold">Radiology Report</h4>
        </Card.Header>
        <Card.Body className="p-4">
          <Row className="mb-4">
            <Col md={6}>
              <h5 className="fw-bold mb-3">Patient Information</h5>
              <p className="mb-1"><strong>Name:</strong> {report.patientName}</p>
              <p className="mb-1"><strong>ID:</strong> {report.patientId}</p>
              <p className="mb-1"><strong>Scan Type:</strong> {report.scanType}</p>
              <p className="mb-1"><strong>Status:</strong> 
                <Badge bg={report.status === 'completed' ? 'success' : 'warning'} className="ms-2">
                  {report.status === 'completed' ? 'Completed' : 'Pending'}
                </Badge>
              </p>
            </Col>
            <Col md={6}>
              <h5 className="fw-bold mb-3">Report Information</h5>
              <p className="mb-1"><strong>Report ID:</strong> {report.id}</p>
              <p className="mb-1"><strong>Scan ID:</strong> {report.scanId}</p>
              <p className="mb-1"><strong>Date:</strong> {report.reportDate}</p>
              <p className="mb-1"><strong>Radiologist:</strong> {report.radiologistName}</p>
            </Col>
          </Row>

          {report.imagePath && (
            <Row className="mb-4">
              <Col>
                <h5 className="fw-bold mb-3">Scan Image</h5>
                <div className="text-center">
                  <img 
                    src={report.imagePath} 
                    alt="Scan" 
                    className="img-fluid border rounded" 
                    style={{ maxHeight: '300px' }} 
                  />
                </div>
              </Col>
            </Row>
          )}

          <Row>
            <Col>
              <h5 className="fw-bold mb-3">Findings</h5>
              <p>{report.findings}</p>
            </Col>
          </Row>

          <Row>
            <Col>
              <h5 className="fw-bold mb-3">Impression</h5>
              <p>{report.impression}</p>
            </Col>
          </Row>

          <Row>
            <Col>
              <h5 className="fw-bold mb-3">Recommendation</h5>
              <p>{report.recommendation}</p>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
}