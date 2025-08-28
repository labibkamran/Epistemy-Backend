// Session model for Epistemy Backend
const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  kind: { type: String, enum: ['transcript', 'video', 'audio', 'pdf'], required: true },
  storage: { type: String, enum: ['gridfs', 'disk', 's3'], required: true },
  ref: { type: String, required: true },
  mime: { type: String, default: null }
}, { _id: false });

const linksSchema = new mongoose.Schema({
  studentView: { type: String, default: null }
}, { _id: false });

const sessionSchema = new mongoose.Schema({
  tutorId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  title: { type: String, default: null },
  status: { type: String, enum: ['draft', 'transcribed', 'processed', 'published'], required: true },
  paid: { type: Boolean, required: true },
  shareToken: { type: String, default: undefined },
  links: { type: linksSchema, default: () => ({}) },
  files: { type: [fileSchema], default: [] },
  // AI pipeline outputs
  topics: {
    type: new mongoose.Schema({
      subject: { type: String },
      subtopics: [{ title: String, objective: String }]
    }, { _id: false }),
    default: null
  },
  summary: {
    type: new mongoose.Schema({
      executive: String,
      key_points: [String],
      misconceptions: [String]
    }, { _id: false }),
    default: null
  },
  progress: { type: mongoose.Schema.Types.Mixed, default: null },
  quiz: {
    type: [new mongoose.Schema({
      subtopic: { type: String, default: null },
      q: { type: String },
      choices: { type: [String], default: [] },
      answer_index: { type: Number },
      explanation: { type: String },
      difficulty: { type: Number, default: 1 }
    }, { _id: false })],
    default: undefined
  },
  pack: { type: mongoose.Schema.Types.Mixed, default: null },
  checksum: { type: String, default: null },
  promptVersion: { type: String, default: null },
  createdAt: { type: Date, required: true, default: Date.now },
  updatedAt: { type: Date, required: true, default: Date.now }
}, {
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});

sessionSchema.index({ tutorId: 1, createdAt: -1 });
sessionSchema.index({ studentId: 1, createdAt: -1 });
sessionSchema.index({ status: 1, createdAt: -1 });
// Ensure uniqueness only for actual non-null share tokens
sessionSchema.index(
  { shareToken: 1 },
  { unique: true, partialFilterExpression: { shareToken: { $exists: true, $type: 'string' } } }
);

module.exports = mongoose.model('Session', sessionSchema);
