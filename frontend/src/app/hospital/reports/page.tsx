'use client';

import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Table, Spinner } from 'react-bootstrap';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';

interface Report {
  id: string;
  scanId: string;
  patientName: string;
  scanType: string;
  reportDate: string;
  radiologistName: string;
  status: 'completed' | 'pending';
}

export default function Reports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      
      // For now, we'll use mock data instead of making API calls
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
          },
          {
            id: '6',
            scanId: 'SCN-006',
            patientName: 'Sarah Davis',
            scanType: 'Chest X-Ray',
            reportDate: '2023-05-10',
            radiologistName: 'Dr. Brown',
            status: 'completed'
          },
          {
            id: '7',
            scanId: 'SCN-007',
            patientName: 'David Wilson',
            scanType: 'MRI Knee',
            reportDate: '2023-05-09',
            radiologistName: 'Dr. Taylor',
            status: 'completed'
          }
        ];
        
        setReports(mockReports);
        setLoading(false);
      }, 800);
    };

    fetchReports();
  }, []);

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Link href="/hospital/dashboard">
          <Button variant="outline-primary">
            <FaArrowLeft className="me-2" /> Back to Dashboard
          </Button>
        </Link>
        <h4 className="mb-0 fw-bold">All Reports</h4>
      </div>

      <Card className="border-0 shadow-sm">
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
                  <th>Scan ID</th>
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
                    <td>{report.scanId}</td>
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
    </Container>
  );
}