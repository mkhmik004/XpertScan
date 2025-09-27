const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
// Simplified auth for testing
const authenticateToken = (req, res, next) => {
  req.user = { id: '123456789012345678901234', role: 'hospital' };
  return next();
};
const upload = require('../middleware/upload');
const Scan = require('../models/Scan');
const Hospital = require('../models/Hospital');
const Job = require('../models/Job');
const Radiologist = require('../models/Radiologist');

// Get all scans for a hospital
router.get('/hospital/:hospitalId', authenticateToken, async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.hospitalId);
    
    if (!hospital) {
      return res.status(404).json({ error: 'Hospital not found' });
    }
    
    const scans = await Scan.find({ hospital: req.params.hospitalId })
      .sort({ uploadDate: -1 });
    
    res.json(scans);
  } catch (error) {
    console.error('Error fetching scans:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Upload a new scan
router.post('/upload', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    const { hospitalId, patientName, patientId, patientAge, patientGender, scanType, notes } = req.body;
    
    // Validate required fields
    if (!hospitalId || !patientName || !patientId || !scanType || !req.file) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Create new scan record
    const scan = new Scan({
      hospital: hospitalId,
      patientName,
      patientId,
      patientAge,
      patientGender,
      scanType,
      notes,
      imagePath: req.file.path,
      uploadDate: new Date(),
      status: 'pending',
      priority: 'medium' // Default priority, will be updated by AI
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
      
      // Set priority based on urgency score
      if (urgency_score > 0.7) {
        scan.priority = 'high';
      } else if (urgency_score > 0.3) {
        scan.priority = 'medium';
      } else {
        scan.priority = 'low';
      }
      
      await scan.save();
      
      // Create a job for this scan
      const job = new Job({
        scan: scan._id,
        status: 'pending',
        createdAt: new Date()
      });
      
      await job.save();
      
      // Automatic job assignment for high priority scans
      if (scan.priority === 'high') {
        // Find available radiologist with lowest workload
        const availableRadiologist = await Radiologist.findOne({ available: true })
          .sort({ currentWorkload: 1 })
          .limit(1);
        
        if (availableRadiologist) {
          job.radiologist = availableRadiologist._id;
          job.status = 'assigned';
          job.assignedAt = new Date();
          
          await job.save();
          
          // Update radiologist workload
          availableRadiologist.currentWorkload += 1;
          await availableRadiologist.save();
        }
      }
      
      res.status(201).json({ 
        scan, 
        job,
        message: 'Scan uploaded and analyzed successfully' 
      });
    } catch (mlError) {
      console.error('ML service error:', mlError);
      
      // Still save the scan even if ML service fails
      await scan.save();
      
      // Create a job for this scan
      const job = new Job({
        scan: scan._id,
        status: 'pending',
        createdAt: new Date()
      });
      
      await job.save();
      
      res.status(201).json({ 
        scan, 
        job,
        message: 'Scan uploaded successfully, but analysis failed' 
      });
    }
  } catch (error) {
    console.error('Error uploading scan:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get available jobs for radiologists
router.get('/available-jobs', authenticateToken, async (req, res) => {
  try {
    const jobs = await Job.find({ status: 'pending' })
      .populate({
        path: 'scan',
        select: 'patientName patientId scanType uploadDate priority status'
      })
      .sort({ 'scan.priority': 1, createdAt: 1 });
    
    res.json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Accept a job
router.post('/jobs/:jobId/accept', authenticateToken, async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.jobId,
      { 
        status: 'in-progress',
        radiologist: req.user.id,
        assignedAt: new Date()
      },
      { new: true }
    );
    
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    
    res.json(job);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Database error' });
  }
});

// Submit report for a job
router.post('/jobs/:jobId/report', authenticateToken, async (req, res) => {
  try {
    const { findings, impression, recommendation } = req.body;
    
    if (!findings || !impression || !recommendation) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const job = await Job.findByIdAndUpdate(
      req.params.jobId,
      { 
        status: 'completed',
        report: {
          findings,
          impression,
          recommendation
        },
        completedAt: new Date()
      },
      { new: true }
    );
    
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    
    res.json(job);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;