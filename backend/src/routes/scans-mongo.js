const express = require('express');
const router = express.Router();
const axios = require('axios');
const path = require('path');
const fs = require('fs');
const upload = require('../middleware/upload');
const { Scan, Hospital, Job, Radiologist } = require('../models/index');

// Get all scans for hospital
router.get('/hospital', async (req, res) => {
  try {
    const userId = req.query.userId;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    const hospital = await Hospital.findOne({ user: userId });
    
    if (!hospital) {
      return res.status(404).json({ error: 'Hospital not found' });
    }
    
    const scans = await Scan.find({ hospital: hospital._id })
      .populate({
        path: 'hospital',
        select: 'name'
      });
    
    res.json(scans);
  } catch (error) {
    console.error('Error fetching hospital scans:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Upload a new scan
router.post('/upload', upload.single('scanImage'), async (req, res) => {
  try {
    const { hospitalId, patientId, patientName, scanType, priority } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ error: 'Scan image is required' });
    }
    
    if (!hospitalId || !patientId || !patientName || !scanType) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const hospital = await Hospital.findById(hospitalId);
    
    if (!hospital) {
      return res.status(404).json({ error: 'Hospital not found' });
    }
    
    // Create the scan record
    const scan = new Scan({
      hospital: hospitalId,
      patient_id: patientId,
      patient_name: patientName,
      scan_type: scanType,
      image_path: req.file.path,
      image_url: `/uploads/scans/${path.basename(req.file.path)}`,
      priority: priority || 'medium',
      status: 'pending'
    });
    
    await scan.save();
    
    // Call ML service for analysis
    try {
      const mlServiceUrl = process.env.ML_SERVICE_URL || 'http://localhost:5000/analyze';
      const formData = new FormData();
      formData.append('image', fs.createReadStream(req.file.path));
      
      const mlResponse = await axios.post(mlServiceUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      const { classification, confidence, urgency_score, heatmap_path } = mlResponse.data;
      
      // Update scan with AI results
      scan.ai_results = {
        classification,
        confidence,
        urgency_score,
        heatmap_path,
        processed_at: new Date()
      };
      
      await scan.save();
      
      // Create a job based on urgency
      const job = new Job({
        scan: scan._id,
        status: 'open'
      });
      
      await job.save();
      
      // Automatic assignment logic
      if (urgency_score < 0.3) {
        // Low urgency - assign to internal staff if available
        const availableRadiologist = await Radiologist.findOne({ 
          available: true,
          current_workload: { $lt: 5 } // Threshold for workload
        }).sort({ current_workload: 1 });
        
        if (availableRadiologist) {
          job.radiologist = availableRadiologist._id;
          job.status = 'assigned';
          job.assigned_at = new Date();
          
          // Update radiologist workload
          availableRadiologist.current_workload += 1;
          await availableRadiologist.save();
        }
        
        await job.save();
      }
      
    } catch (mlError) {
      console.error('Error calling ML service:', mlError);
      // Continue without ML results if service is unavailable
    }
    
    res.status(201).json({ 
      message: 'Scan uploaded successfully',
      scan: scan
    });
    
  } catch (error) {
    console.error('Error uploading scan:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get available jobs for radiologists
router.get('/jobs', async (req, res) => {
  try {
    const jobs = await Job.find({ status: 'open' })
      .populate({
        path: 'scan',
        select: 'scan_type priority patient_id image_path'
      })
      .sort({ 'scan.priority': -1, created_at: 1 });
    
    res.json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Accept a job
router.post('/jobs/:jobId/accept', async (req, res) => {
  try {
    const { jobId } = req.params;
    const { radiologistId } = req.body;
    
    if (!radiologistId) {
      return res.status(400).json({ error: 'Radiologist ID is required' });
    }
    
    const job = await Job.findById(jobId);
    
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    
    if (job.status !== 'open') {
      return res.status(400).json({ error: 'Job is not available' });
    }
    
    const radiologist = await Radiologist.findById(radiologistId);
    
    if (!radiologist) {
      return res.status(404).json({ error: 'Radiologist not found' });
    }
    
    // Update job
    job.radiologist = radiologistId;
    job.status = 'assigned';
    job.assigned_at = new Date();
    
    await job.save();
    
    // Update scan status
    const scan = await Scan.findById(job.scan);
    scan.status = 'assigned';
    await scan.save();
    
    // Update radiologist workload
    radiologist.current_workload += 1;
    await radiologist.save();
    
    res.json({ message: 'Job accepted successfully', job });
  } catch (error) {
    console.error('Error accepting job:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Submit report for a job
router.post('/jobs/:jobId/report', async (req, res) => {
  try {
    const { jobId } = req.params;
    const { findings, impression, recommendation } = req.body;
    
    if (!findings || !impression) {
      return res.status(400).json({ error: 'Findings and impression are required' });
    }
    
    const job = await Job.findById(jobId);
    
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    
    if (job.status !== 'assigned' && job.status !== 'in_progress') {
      return res.status(400).json({ error: 'Job is not assigned or in progress' });
    }
    
    // Update job
    job.report = {
      findings,
      impression,
      recommendation: recommendation || ''
    };
    job.status = 'completed';
    job.completed_at = new Date();
    
    await job.save();
    
    // Update scan status
    const scan = await Scan.findById(job.scan);
    scan.status = 'completed';
    await scan.save();
    
    // Update radiologist workload
    const radiologist = await Radiologist.findById(job.radiologist);
    if (radiologist) {
      radiologist.current_workload = Math.max(0, radiologist.current_workload - 1);
      await radiologist.save();
    }
    
    res.json({ message: 'Report submitted successfully', job });
  } catch (error) {
    console.error('Error submitting report:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get AI analysis for a scan
router.get('/:scanId/ai-analysis', async (req, res) => {
  try {
    const { scanId } = req.params;
    
    const scan = await Scan.findById(scanId);
    
    if (!scan) {
      return res.status(404).json({ error: 'Scan not found' });
    }
    
    if (!scan.ai_results) {
      return res.status(404).json({ error: 'AI analysis not available for this scan' });
    }
    
    res.json(scan.ai_results);
  } catch (error) {
    console.error('Error fetching AI analysis:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;