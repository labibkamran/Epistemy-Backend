// User model for Epistemy Backend
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 1 },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['tutor', 'student'], required: true },
  calendlyUrl: { type: String, default: null },
  createdAt: { type: Date, required: true, default: Date.now },
  updatedAt: { type: Date, required: true, default: Date.now }
}, {
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});

userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ role: 1 });

module.exports = mongoose.model('User', userSchema);
