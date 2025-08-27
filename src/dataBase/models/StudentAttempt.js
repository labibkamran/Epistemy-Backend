// StudentAttempt model for Epistemy Backend
const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  idx: { type: Number, required: true, min: 0 },
  given: { type: String, required: true },
  correct: { type: Boolean, required: true },
  ts: { type: Date, required: true }
}, { _id: false });

const studentAttemptSchema = new mongoose.Schema({
  sessionId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Session' },
  studentId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  items: { type: [itemSchema], required: true },
  score: { type: Number, default: null },
  createdAt: { type: Date, required: true, default: Date.now }
}, {
  timestamps: { createdAt: 'createdAt', updatedAt: false }
});

studentAttemptSchema.index({ sessionId: 1, studentId: 1 });

module.exports = mongoose.model('StudentAttempt', studentAttemptSchema);
