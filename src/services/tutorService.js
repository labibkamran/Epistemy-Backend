// Tutor service bridges controller and AI pipeline
const { runPipeline } = require('./AIpipeline');
const User = require('../dataBase/models/User');
const bcrypt = require('bcryptjs');
const Session = require('../dataBase/models/Session');

async function runPipelineForTranscript(sessionId, studentId, rawText) {
	const pack = await runPipeline({ sessionId, studentId, rawTranscriptText: rawText });
	return pack;
}

async function signup({ name, email, password, calendlyUrl = null }) {
	if (!name || !email || !password) throw new Error('name, email, password are required');
	const existing = await User.findOne({ email }).lean();
	if (existing) throw new Error('email already registered');
	const passwordHash = await bcrypt.hash(password, 10);
	const user = await User.create({ name, email, passwordHash, role: 'tutor', calendlyUrl });
	return { user: sanitize(user) };
}

async function login({ email, password }) {
	if (!email || !password) throw new Error('email and password are required');
	const user = await User.findOne({ email, role: 'tutor' }).select('+passwordHash');
	if (!user) throw new Error('user not found');
	const ok = await bcrypt.compare(password, user.passwordHash);
	if (!ok) throw new Error('invalid credentials');
	return { user: sanitize(user) };
}

function sanitize(u) {
	return { id: u._id, name: u.name, email: u.email, role: u.role, calendlyUrl: u.calendlyUrl };
}

module.exports = { runPipelineForTranscript, signup, login };
async function createSession({ tutorId, studentId = null, title = null, paid = false, status = 'draft' }) {
	if (!tutorId) throw new Error('tutorId is required');
	if (!status) status = 'draft';
	const session = await Session.create({ tutorId, studentId, title, status, paid });
	return { session };
}

async function getSession(id) {
	const session = await Session.findById(id).lean();
	return session ? { session } : null;
}

module.exports = { runPipelineForTranscript, signup, login, createSession, getSession };

