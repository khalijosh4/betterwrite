const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  payment: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['open', 'in_progress', 'pending_review', 'completed', 'cancelled'],
    default: 'open',
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  worker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  completedAt: Date,
  paymentStatus: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
  },
  paymentIntentId: String,
});

module.exports = mongoose.model('Job', jobSchema);