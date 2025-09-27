const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  scan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Scan',
    required: true
  },
  radiologist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Radiologist'
  },
  status: {
    type: String,
    enum: ['open', 'assigned', 'in_progress', 'completed', 'rejected'],
    default: 'open'
  },
  report: {
    findings: String,
    impression: String,
    recommendation: String
  },
  assigned_at: Date,
  completed_at: Date,
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Job', JobSchema);