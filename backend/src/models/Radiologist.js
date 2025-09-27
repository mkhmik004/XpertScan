const mongoose = require('mongoose');

const RadiologistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  specialization: {
    type: String
  },
  years_experience: {
    type: Number
  },
  available: {
    type: Boolean,
    default: true
  },
  current_workload: {
    type: Number,
    default: 0
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Radiologist', RadiologistSchema);