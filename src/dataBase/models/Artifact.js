// Artifact model for Epistemy Backend
const mongoose = require('mongoose');

const subtopicSchema = new mongoose.Schema({
  title: { type: String, required: true },
  objective: { type: String, required: true }
}, { _id: false });

const topicsSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  subtopics: { type: [subtopicSchema], required: true, minlength: 1 }
}, { _id: false });

const progressSchema = new mongoose.Schema({
  improvements: { type: [String], required: true },
  gaps: { type: [String], required: true },
  nextGoals: { type: [String], required: true }
}, { _id: false });

const quizItemSchema = new mongoose.Schema({
  subtopicTitle: { type: String, required: true },
  q: { type: String, required: true },
  answer: { type: String, required: true },
  explanation: { type: String, required: true },
  difficulty: { type: Number, required: true, min: 1, max: 3 }
}, { _id: false });

const artifactSchema = new mongoose.Schema({
  sessionId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Session', unique: true },
  status: { type: String, enum: ['draft', 'published'], required: true },
  version: { type: Number, required: true, min: 1 },
  topics: { type: topicsSchema, required: true },
  progress: { type: progressSchema, required: true },
  quiz: { type: [quizItemSchema], required: true },
  createdAt: { type: Date, required: true, default: Date.now },
  updatedAt: { type: Date, required: true, default: Date.now }
}, {
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});

artifactSchema.index({ sessionId: 1 }, { unique: true });
artifactSchema.index({ status: 1 });

module.exports = mongoose.model('Artifact', artifactSchema);
