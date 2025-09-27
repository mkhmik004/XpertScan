const express = require('express');
const router = express.Router();

// Get all users (admin only)
router.get('/', (req, res) => {
  // Mock users data
  const users = [
    { id: '1', email: 'admin@xpertscan.com', role: 'admin', name: 'Admin User' },
    { id: '2', email: 'radiologist@xpertscan.com', role: 'radiologist', name: 'Dr. Smith' },
    { id: '3', email: 'hospital@xpertscan.com', role: 'hospital', name: 'General Hospital' },
    { id: '4', email: 'patient@xpertscan.com', role: 'patient', name: 'John Doe' }
  ];
  
  res.status(200).json({ success: true, users });
});

// Get user by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  
  // Mock user data
  const user = { id, email: `user${id}@xpertscan.com`, role: 'radiologist', name: `User ${id}` };
  
  res.status(200).json({ success: true, user });
});

module.exports = router;