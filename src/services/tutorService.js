// Tutor service bridges controller and AI pipeline
const { runPipeline } = require('./AIpipeline');
const User = require('../dataBase/models/User');
const bcrypt = require('bcryptjs');
const Session = require('../dataBase/models/Session');

async function runPipelineForTranscript(sessionId, studentId, rawText) {
	const pack = await runPipeline({ sessionId, studentId, rawTranscriptText: rawText });
	return pack;
}

async function signup({ name, email, password, calendlyUrl = null, sessionPrice = null }) {
	if (!name || !email || !password) throw new Error('name, email, password are required');
	const existing = await User.findOne({ email }).lean();
	if (existing) throw new Error('email already registered');
	const passwordHash = await bcrypt.hash(password, 10);
	const doc = { name, email, passwordHash, role: 'tutor', calendlyUrl };
	if (sessionPrice !== null && sessionPrice !== undefined) doc.sessionPrice = Number(sessionPrice);
	const user = await User.create(doc);
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
	return { id: u._id, name: u.name, email: u.email, role: u.role, calendlyUrl: u.calendlyUrl, sessionPrice: u.sessionPrice ?? null };
}

module.exports = { runPipelineForTranscript, signup, login };
async function createSession({ tutorId, studentId = null, title = null, paid = false, status = 'draft' }) {
	if (!tutorId) throw new Error('tutorId is required');
	if (!status) status = 'draft';
	const session = await Session.create({ tutorId, studentId, title, status, paid });
	return { session };
}

async function getSession(id) {
	const session = await Session.findById(id)
		.populate('studentId', 'name email')
		.populate('tutorId', 'name email')
		.lean()
	
	if (session && session.studentId) {
		session.studentName = session.studentId.name
	}
	
	if (session && session.tutorId) {
		session.tutorName = session.tutorId.name
	}
	
	return session ? { session } : null
}

async function listSessionsByTutor(tutorId) {
	if (!tutorId) throw new Error('tutorId is required');
	const sessions = await Session.find({ tutorId }).sort({ createdAt: -1 }).lean();
	return { sessions };
}

async function updateSession(id, patch) {
	const allowed = ['title', 'topics', 'summary', 'progress', 'quiz', 'paid', 'status', 'studentId'];
	const toSet = {};
	for (const k of allowed) if (k in patch) toSet[k] = patch[k];
	const updated = await Session.findByIdAndUpdate(id, { $set: toSet }, { new: true }).lean();
	return updated ? { session: updated } : null;
}

async function listStudents() {
	// returns all users with role 'student'
	const users = await User.find({ role: 'student' }).select('_id name email').lean();
	return { students: users.map(u => ({ id: u._id, name: u.name, email: u.email })) };
}
async function getProfile(id) {
	if (!id) throw new Error('id is required');
	const user = await User.findOne({ _id: id, role: 'tutor' }).lean();
	if (!user) return null;
	return { user: sanitize(user) };
}

async function updateProfile(id, { calendlyUrl, sessionPrice } = {}) {
	if (!id) throw new Error('id is required');
	const set = {};
	if (calendlyUrl !== undefined) {
		set.calendlyUrl = calendlyUrl ?? null;
	}
	if (sessionPrice !== undefined) {
		if (sessionPrice === null || sessionPrice === '') set.sessionPrice = null;
		else set.sessionPrice = Number(sessionPrice);
	}
	const updated = await User.findOneAndUpdate(
		{ _id: id, role: 'tutor' },
		{ $set: set },
		{ new: true, runValidators: true }
	).lean();
	if (!updated) return null;
	return { user: sanitize(updated) };
}

module.exports = { runPipelineForTranscript, signup, login, createSession, getSession, listSessionsByTutor, updateSession, listStudents, getProfile, updateProfile };

