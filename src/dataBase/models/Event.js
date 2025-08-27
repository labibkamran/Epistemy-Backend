// Event model for Epistemy Backend
const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  runId: { type: String, required: true },
  sessionId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Session' },
  node: { type: String, enum: ['ingest','stt','normalize','topics','progress','quiz','validate','publish'], required: true },
  model: { type: String, default: null },
  latencyMs: { type: Number, default: null },
  tokensIn: { type: Number, default: null },
  tokensOut: { type: Number, default: null },
  cacheHit: { type: Boolean, default: null },
  ok: { type: Boolean, required: true },
  error: { type: String, default: null },
  createdAt: { type: Date, required: true, default: Date.now }
}, {
  timestamps: { createdAt: 'createdAt', updatedAt: false }
});

eventSchema.index({ sessionId: 1, createdAt: -1 });
eventSchema.index({ runId: 1 });

module.exports = mongoose.model('Event', eventSchema);