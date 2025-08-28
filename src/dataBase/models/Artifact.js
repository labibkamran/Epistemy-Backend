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

const rubricCriteriaSchema = new mongoose.Schema({
  name: { type: String, required: true },
  level: { type: Number, required: true, min: 0, max: 3 },
  evidence: { type: String, default: '' }
}, { _id: false });

const progressSchema = new mongoose.Schema({
  improvements: { type: [String], default: [] },
  gaps: { type: [String], default: [] },
  nextGoals: { type: [String], required: true },
  rubric: {
    criteria: { type: [rubricCriteriaSchema], required: true },
    levels: { type: Map, of: String, required: true }
  }
}, { _id: false });

const summarySchema = new mongoose.Schema({
  executive: { type: String, required: true },
  key_points: { type: [String], required: true },
  misconceptions: { type: [String], default: [] }
}, { _id: false });

const quizItemSchema = new mongoose.Schema({
  subtopic: { type: String, required: true },
  q: { type: String, required: true },
  choices: { type: [String], required: true, validate: v => v.length === 4 },
  answer_index: { type: Number, required: true, min: 0, max: 3 },
  explanation: { type: String, required: true },
  difficulty: { type: Number, required: true, min: 1, max: 3 }
}, { _id: false });

const artifactSchema = new mongoose.Schema({
  sessionId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Session', unique: true },
  status: { type: String, enum: ['draft', 'published'], required: true },
  version: { type: Number, required: true, min: 1 },
  topics: { type: topicsSchema, default: null },
  summary: { type: summarySchema, default: null },
  progress: { type: progressSchema, default: null },
  quiz: { type: [quizItemSchema], default: [] },
  pack: { type: Object, default: null },
  checksum: { type: String, default: null },
  promptVersion: { type: String, default: null },
  createdAt: { type: Date, required: true, default: Date.now },
  updatedAt: { type: Date, required: true, default: Date.now }
}, {
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});

artifactSchema.index({ sessionId: 1 }, { unique: true });
artifactSchema.index({ status: 1 });

module.exports = mongoose.model('Artifact', artifactSchema);
