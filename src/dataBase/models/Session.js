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
  shareToken: { type: String, default: null, unique: true, sparse: true },
  links: { type: linksSchema, default: () => ({}) },
  files: { type: [fileSchema], default: [] },
  createdAt: { type: Date, required: true, default: Date.now },
  updatedAt: { type: Date, required: true, default: Date.now }
}, {
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});

sessionSchema.index({ tutorId: 1, createdAt: -1 });
sessionSchema.index({ studentId: 1, createdAt: -1 });
sessionSchema.index({ shareToken: 1 }, { unique: true, sparse: true });
sessionSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Session', sessionSchema);
