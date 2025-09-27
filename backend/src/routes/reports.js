const express = require('express');
const router = express.Router();

// Get all reports
router.get('/', (req, res) => {
  // Mock report data
  const reports = [
    { id: '1', scanId: '1', patientName: 'John Doe', findings: 'Pneumonia detected', recommendation: 'Antibiotics recommended', radiologistId: '2', createdAt: new Date() },
    { id: '2', scanId: '2', patientName: 'Jane Smith', findings: 'Normal scan', recommendation: 'No action required', radiologistId: '2', createdAt: new Date() }
  ];
  
  res.status(200).json({ success: true, reports });
});

// Create new report
router.post('/', (req, res) => {
  const { scanId, findings, recommendation } = req.body;
  
  // In a real app, we would save to database
  const newReport = {
    id: Date.now().toString(),
    scanId,
    findings,
    recommendation,
    radiologistId: '2', // Mock radiologist ID
    createdAt: new Date()
  };
  
  res.status(201).json({ success: true, report: newReport });
});

module.exports = router;