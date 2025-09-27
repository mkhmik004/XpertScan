'use client';

import Link from 'next/link';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { useState } from 'react';

export default function Home() {
  return (
    <main>
      {/* Navigation */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
        <Container>
          <Link href="/" className="navbar-brand fw-bold text-primary">XpertScan</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link href="/about" className="nav-link">About</Link>
              </li>
              <li className="nav-item">
                <Link href="/features" className="nav-link">Features</Link>
              </li>
              <li className="nav-item">
                <Link href="/signin" className="nav-link">Sign In</Link>
              </li>
              <li className="nav-item">
                <Link href="/signup" className="nav-link">
                  <Button variant="primary">Get Started</Button>
                </Link>
              </li>
            </ul>
          </div>
        </Container>
      </nav>

      {/* Hero Section */}
      <section className="py-5 bg-light">
        <Container>
          <Row className="align-items-center">
            <Col md={6} className="mb-4 mb-md-0">
              <span className="badge bg-primary-subtle text-primary mb-2">Connecting Patients to Radiologists</span>
              <h1 className="display-4 fw-bold mb-3">Every Scan Connected to Qualified Radiologists Immediately</h1>
              <p className="lead text-muted mb-4">
                XpertScan connects every scan to qualified radiologists instantly, even for mobile X-ray units and rural hospitals. AI helps prioritize urgent cases, so critical patients get faster attention.
              </p>
              <div className="d-flex gap-3">
                <Link href="/signup">
                  <Button variant="primary" size="lg">Join XpertScan</Button>
                </Link>
                <Link href="/signin">
                  <Button variant="outline-secondary" size="lg">Sign In</Button>
                </Link>
              </div>
            </Col>
            <Col md={6}>
              <img 
                src="https://placehold.co/600x400/e9f5ff/0070f3?text=XpertScan+Network" 
                alt="XpertScan Platform" 
                className="img-fluid rounded shadow-lg"
              />
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-5">
        <Container>
          <div className="text-center mb-5">
            <h2 className="fw-bold">Why Choose XpertScan?</h2>
            <p className="text-muted">Connecting patients, radiologists, and healthcare facilities for better outcomes</p>
          </div>
          <Row>
            <Col md={4} className="mb-4">
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="p-4">
                  <div className="rounded-circle bg-primary-subtle p-3 mb-3 d-inline-block">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-lightning-charge text-primary" viewBox="0 0 16 16">
                      <path d="M11.251.068a.5.5 0 0 1 .227.58L9.677 6.5H13a.5.5 0 0 1 .364.843l-8 8.5a.5.5 0 0 1-.842-.49L6.323 9.5H3a.5.5 0 0 1-.364-.843l8-8.5a.5.5 0 0 1 .615-.09z"/>
                    </svg>
                  </div>
                  <h4 className="fw-bold mb-3">Urgent Case Prioritization</h4>
                  <p className="text-muted">AI helps prioritize urgent scans, so critical patients get faster attention from qualified radiologists.</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="p-4">
                  <div className="rounded-circle bg-primary-subtle p-3 mb-3 d-inline-block">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-shield-check text-primary" viewBox="0 0 16 16">
                      <path d="M5.338 1.59a61 61 0 0 0-2.837.856.48.48 0 0 0-.328.39c-.554 4.157.726 7.19 2.253 9.188a10.7 10.7 0 0 0 2.287 2.233c.346.244.652.42.893.533q.18.085.293.118a1 1 0 0 0 .101.025 1 1 0 0 0 .1-.025q.114-.034.294-.118c.24-.113.547-.29.893-.533a10.7 10.7 0 0 0 2.287-2.233c1.527-1.997 2.807-5.031 2.253-9.188a.48.48 0 0 0-.328-.39c-.651-.213-1.75-.56-2.837-.855C9.552 1.29 8.531 1.067 8 1.067c-.53 0-1.552.223-2.662.524zM5.072.56C6.157.265 7.31 0 8 0s1.843.265 2.928.56c1.11.3 2.229.655 2.887.87a1.54 1.54 0 0 1 1.044 1.262c.596 4.477-.787 7.795-2.465 9.99a11.8 11.8 0 0 1-2.517 2.453 7 7 0 0 1-1.048.625c-.28.132-.581.24-.829.24s-.548-.108-.829-.24a7 7 0 0 1-1.048-.625 11.8 11.8 0 0 1-2.517-2.453C1.928 10.487.545 7.169 1.141 2.692A1.54 1.54 0 0 1 2.185 1.43 63 63 0 0 1 5.072.56z"/>
                      <path d="M10.854 5.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 7.793l2.646-2.647a.5.5 0 0 1 .708 0z"/>
                    </svg>
                  </div>
                  <h4 className="fw-bold mb-3">Verified Radiologists</h4>
                  <p className="text-muted">All radiologists are verified through their governing bodies, ensuring qualified professionals review every scan.</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="p-4">
                  <div className="rounded-circle bg-primary-subtle p-3 mb-3 d-inline-block">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-people text-primary" viewBox="0 0 16 16">
                      <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1zm-7.978-1L7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002-.014.002zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0M6.936 9.28a6 6 0 0 0-1.23-.247A7 7 0 0 0 5 9c-4 0-5 3-5 4q0 1 1 1h4.216A2.24 2.24 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816M4.92 10A5.5 5.5 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0m3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4"/>
                    </svg>
                  </div>
                  <h4 className="fw-bold mb-3">Remote Flexibility</h4>
                  <p className="text-muted">Radiologists can work remotely and flexibly, reviewing scans from anywhere, reducing overwork and increasing coverage.</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Row className="mt-4">
            <Col md={4} className="mb-4">
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="p-4">
                  <div className="rounded-circle bg-primary-subtle p-3 mb-3 d-inline-block">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-database text-primary" viewBox="0 0 16 16">
                      <path d="M4.318 2.687C5.234 2.271 6.536 2 8 2s2.766.27 3.682.687C12.644 3.125 13 3.627 13 4c0 .374-.356.875-1.318 1.313C10.766 5.729 9.464 6 8 6s-2.766-.27-3.682-.687C3.356 4.875 3 4.373 3 4c0-.374.356-.875 1.318-1.313ZM13 5.698V7c0 .374-.356.875-1.318 1.313C10.766 8.729 9.464 9 8 9s-2.766-.27-3.682-.687C3.356 7.875 3 7.373 3 7V5.698c.271.202.58.378.904.525C4.978 6.711 6.427 7 8 7s3.022-.289 4.096-.777A5 5 0 0 0 13 5.698M13 8.698V10c0 .374-.356.875-1.318 1.313C10.766 11.729 9.464 12 8 12s-2.766-.27-3.682-.687C3.356 10.875 3 10.373 3 10V8.698c.271.202.58.378.904.525C4.978 9.711 6.427 10 8 10s3.022-.289 4.096-.777A5 5 0 0 0 13 8.698M3 11.698V13c0 .374.356.875 1.318 1.313C5.234 14.729 6.536 15 8 15s2.766-.27 3.682-.687C12.644 13.875 13 13.373 13 13v-1.302c-.271.202-.58.378-.904.525C11.022 12.711 9.573 13 8 13s-3.022-.289-4.096-.777a5 5 0 0 1-.904-.525Z"/>
                    </svg>
                  </div>
                  <h4 className="fw-bold mb-3">PACS Integration</h4>
                  <p className="text-muted">Integrates with existing PACS systems and provides a simple digital workflow for clinics without it.</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="p-4">
                  <div className="rounded-circle bg-primary-subtle p-3 mb-3 d-inline-block">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-clock text-primary" viewBox="0 0 16 16">
                      <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z"/>
                      <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0"/>
                    </svg>
                  </div>
                  <h4 className="fw-bold mb-3">Timely Reports</h4>
                  <p className="text-muted">Reports are delivered quickly, so patients get timely treatment and better outcomes.</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="p-4">
                  <div className="rounded-circle bg-primary-subtle p-3 mb-3 d-inline-block">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-graph-up text-primary" viewBox="0 0 16 16">
                      <path fillRule="evenodd" d="M0 0h1v15h15v1H0zm14.817 3.113a.5.5 0 0 1 .07.704l-4.5 5.5a.5.5 0 0 1-.74.037L7.06 6.767l-3.656 5.027a.5.5 0 0 1-.808-.588l4-5.5a.5.5 0 0 1 .758-.06l2.609 2.61 4.15-5.073a.5.5 0 0 1 .704-.07Z"/>
                    </svg>
                  </div>
                  <h4 className="fw-bold mb-3">Continuous Improvement</h4>
                  <p className="text-muted">Collects scan data to train our AI models, improving speed and accuracy over time.</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-5 bg-primary text-white">
        <Container className="text-center">
          <h2 className="fw-bold mb-3">Connect every scan to qualified radiologists</h2>
          <p className="lead mb-4">Join our network of hospitals, clinics, mobile X-ray units, and verified radiologists</p>
          <Link href="/signup">
            <Button variant="light" size="lg" className="text-primary fw-bold">Join XpertScan Today</Button>
          </Link>
        </Container>
      </section>

      {/* Footer */}
      <footer className="py-4 bg-light">
        <Container>
          <Row>
            <Col md={4} className="mb-4 mb-md-0">
              <h5 className="fw-bold text-primary">XpertScan</h5>
              <p className="text-muted">Connecting hospitals, clinics, and mobile X-ray units to verified radiologists with AI-powered triage.</p>
            </Col>
            <Col md={2} className="mb-4 mb-md-0">
              <h6 className="fw-bold">Company</h6>
              <ul className="list-unstyled">
                <li><Link href="/about" className="text-decoration-none text-muted">About</Link></li>
                <li><Link href="/team" className="text-decoration-none text-muted">Team</Link></li>
                <li><Link href="/careers" className="text-decoration-none text-muted">Careers</Link></li>
              </ul>
            </Col>
            <Col md={2} className="mb-4 mb-md-0">
              <h6 className="fw-bold">Product</h6>
              <ul className="list-unstyled">
                <li><Link href="/features" className="text-decoration-none text-muted">Features</Link></li>
                <li><Link href="/pricing" className="text-decoration-none text-muted">Pricing</Link></li>
                <li><Link href="/faq" className="text-decoration-none text-muted">FAQ</Link></li>
              </ul>
            </Col>
            <Col md={4}>
              <h6 className="fw-bold">Contact</h6>
              <p className="text-muted">info@xpertscan.com<br />+1 (555) 123-4567</p>
              <div className="d-flex gap-2">
                <a href="#" className="text-muted"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-twitter" viewBox="0 0 16 16">
                  <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334q.002-.211-.006-.422A6.7 6.7 0 0 0 16 3.542a6.7 6.7 0 0 1-1.889.518 3.3 3.3 0 0 0 1.447-1.817 6.5 6.5 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.32 9.32 0 0 1-6.767-3.429 3.29 3.29 0 0 0 1.018 4.382A3.3 3.3 0 0 1 .64 6.575v.045a3.29 3.29 0 0 0 2.632 3.218 3.2 3.2 0 0 1-.865.115 3 3 0 0 1-.614-.057 3.28 3.28 0 0 0 3.067 2.277A6.6 6.6 0 0 1 .78 13.58a6 6 0 0 1-.78-.045A9.34 9.34 0 0 0 5.026 15"/>
                </svg></a>
                <a href="#" className="text-muted"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-linkedin" viewBox="0 0 16 16">
                  <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z"/>
                </svg></a>
                <a href="#" className="text-muted"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-facebook" viewBox="0 0 16 16">
                  <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951"/>
                </svg></a>
              </div>
            </Col>
          </Row>
          <hr className="my-4" />
          <div className="text-center text-muted">
            <small>&copy; {new Date().getFullYear()} XpertScan. All rights reserved.</small>
          </div>
        </Container>
      </footer>
    </main>
  );
}
