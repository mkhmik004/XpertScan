const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const { mockMongoose, setupMockData } = require('./mockServices');

// Load environment variables
dotenv.config();

// Import database connection
const { connectDB } = require('./config/database');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const scanRoutes = require('./routes/scans');
const reportRoutes = require('./routes/reports');
const paymentRoutes = require('./routes/payments');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3001;

// Use mock MongoDB for development
global.useMocks = true;

// Connect to MongoDB (will use mock if useMocks is true)
if (global.useMocks) {
  console.log('Using mock MongoDB connection for development');
  mockMongoose.connect();
  setupMockData();
} else {
  console.log('Using real MongoDB connection');
  connectDB();
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use('/samples', express.static(path.join(__dirname, '../data/samples')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/scans', scanRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/payments', paymentRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'XpertScan API is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;