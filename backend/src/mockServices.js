// Mock services for testing without external dependencies
const mongoose = require('mongoose');
const Scan = require('./models/Scan');
const Job = require('./models/Job');
const User = require('./models/User');

// Mock MongoDB connection
const mockMongoose = {
  connect: () => {
    console.log('Using mock MongoDB connection');
    return Promise.resolve();
  }
};

// Mock data
const setupMockData = async () => {
  console.log('Setting up mock data');
  
  // Mock users
  global.mockUsers = [
    { _id: '123456789012345678901234', name: 'Hospital Admin', email: 'hospital@example.com', role: 'hospital' },
    { _id: '123456789012345678901235', name: 'Dr. Smith', email: 'smith@example.com', role: 'radiologist' },
    { _id: '123456789012345678901236', name: 'Dr. Jones', email: 'jones@example.com', role: 'radiologist' }
  ];
  
  // Mock scans
  global.mockScans = [];
  
  // Mock jobs
  global.mockJobs = [];
};

// Mock models
const mockModels = {
  Scan: {
    create: async (data) => {
      const newScan = { _id: new mongoose.Types.ObjectId().toString(), ...data };
      global.mockScans.push(newScan);
      return newScan;
    },
    findById: async (id) => {
      return global.mockScans.find(scan => scan._id === id);
    },
    findByIdAndUpdate: async (id, update) => {
      const scanIndex = global.mockScans.findIndex(scan => scan._id === id);
      if (scanIndex !== -1) {
        global.mockScans[scanIndex] = { ...global.mockScans[scanIndex], ...update };
        return global.mockScans[scanIndex];
      }
      return null;
    }
  },
  Job: {
    create: async (data) => {
      const newJob = { _id: new mongoose.Types.ObjectId().toString(), ...data };
      global.mockJobs.push(newJob);
      return newJob;
    },
    find: async (query) => {
      return {
        populate: () => {
          return {
            sort: () => {
              return global.mockJobs.filter(job => {
                if (query.status) return job.status === query.status;
                return true;
              });
            }
          };
        }
      };
    },
    findById: async (id) => {
      return global.mockJobs.find(job => job._id === id);
    },
    findByIdAndUpdate: async (id, update) => {
      const jobIndex = global.mockJobs.findIndex(job => job._id === id);
      if (jobIndex !== -1) {
        global.mockJobs[jobIndex] = { ...global.mockJobs[jobIndex], ...update };
        return global.mockJobs[jobIndex];
      }
      return null;
    }
  },
  User: {
    findById: async (id) => {
      return global.mockUsers.find(user => user._id === id);
    }
  }
};

module.exports = {
  mockMongoose,
  setupMockData,
  mockModels
};