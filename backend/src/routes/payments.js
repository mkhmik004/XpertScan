const express = require('express');
const router = express.Router();

// Get payment history
router.get('/', (req, res) => {
  // Mock payment data
  const payments = [
    { id: '1', amount: 25.00, scanId: '1', status: 'completed', method: 'credit_card', date: new Date() },
    { id: '2', amount: 25.00, scanId: '2', status: 'completed', method: 'paypal', date: new Date() }
  ];
  
  res.status(200).json({ success: true, payments });
});

// Process a payment
router.post('/', (req, res) => {
  const { scanId, amount, method } = req.body;
  
  // Mock payment processing
  const payment = {
    id: Date.now().toString(),
    scanId,
    amount,
    method,
    status: 'completed',
    date: new Date()
  };
  
  res.status(201).json({ success: true, payment });
});

module.exports = router;