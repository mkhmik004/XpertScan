const mongoose = require('mongoose');

const ScanSchema = new mongoose.Schema({
  hospital: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital',
    required: true
  },
  patient_id: {
    type: String,
    required: true
  },
  patient_name: {
    type: String,
    required: true
  },
  scan_type: {
    type: String,
    required: true,
    enum: ['X-Ray', 'MRI', 'CT Scan', 'Ultrasound', 'Other']
  },
  image_path: {
    type: String,
    required: true
  },
  image_url: {
    type: String
  },
  upload_date: {
    type: Date,
    default: Date.now
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['pending', 'assigned', 'completed'],
    default: 'pending'
  },
  ai_results: {
    classification: String,
    confidence: Number,
    urgency_score: Number,
    heatmap_path: String,
    processed_at: Date
  },
  metadata: {
    type: Map,
    of: String
  }
});

module.exports = mongoose.model('Scan', ScanSchema);