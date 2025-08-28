// Transcript model for Epistemy Backend
const mongoose = require('mongoose');

const segmentSchema = new mongoose.Schema({
  start: { type: Number, required: true },
  end: { type: Number, required: true },
  speaker: { type: String, enum: ['Tutor', 'Student', null], default: null },
  text: { type: String, required: true }
}, { _id: false });

const sttMetaSchema = new mongoose.Schema({
  engine: { type: String },
  lang: { type: String, default: null },
  notes: { type: String, default: null }
}, { _id: false });

const transcriptSchema = new mongoose.Schema({
  sessionId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Session', unique: true },
  source: { type: String, enum: ['upload', 'stt'], required: true },
  raw: { type: String, default: null },
  clean: { type: String, required: true },
  segments: { type: [segmentSchema], default: null },
  sttMeta: { type: sttMetaSchema, default: null },
  checksum: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now }
}, {
  timestamps: { createdAt: 'createdAt', updatedAt: false }
});

transcriptSchema.index({ checksum: 1 });

module.exports = mongoose.model('Transcript', transcriptSchema);
