const express = require('express');
const router = express.Router();

// Mock authentication for now
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  // Demo users
  const users = {
    'admin@xpertscan.com': { id: '1', email: 'admin@xpertscan.com', role: 'admin', name: 'Admin User' },
    'radiologist@xpertscan.com': { id: '2', email: 'radiologist@xpertscan.com', role: 'radiologist', name: 'Dr. Smith' },
    'hospital@xpertscan.com': { id: '3', email: 'hospital@xpertscan.com', role: 'hospital', name: 'General Hospital' },
    'patient@xpertscan.com': { id: '4', email: 'patient@xpertscan.com', role: 'patient', name: 'John Doe' }
  };
  
  if (users[email] && password === 'password') {
    // Generate a mock token
    const token = `mock-jwt-token-${Date.now()}`;
    
    return res.status(200).json({
      success: true,
      token,
      user: users[email]
    });
  }
  
  return res.status(401).json({
    success: false,
    message: 'Invalid credentials'
  });
});

router.post('/register', (req, res) => {
  const { email, password, role, name } = req.body;
  
  // In a real app, we would validate and save to database
  return res.status(201).json({
    success: true,
    message: 'User registered successfully',
    user: { id: Date.now().toString(), email, role, name }
  });
});

module.exports = router;