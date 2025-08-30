// User model for Epistemy Backend
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 1 },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true, select: false },
  role: { type: String, enum: ['tutor', 'student'], required: true },
  calendlyUrl: { type: String, default: null },
  // Optional price per session set by tutor (e.g., in USD or chosen currency)
  sessionPrice: { type: Number, min: 0, default: null },
  createdAt: { type: Date, required: true, default: Date.now },
  updatedAt: { type: Date, required: true, default: Date.now }
}, {
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});

userSchema.index({ role: 1 });

module.exports = mongoose.model('User', userSchema);
