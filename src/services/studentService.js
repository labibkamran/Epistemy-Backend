// Student service: signup and login
const User = require('../dataBase/models/User');
const bcrypt = require('bcryptjs');
const Session = require('../dataBase/models/Session');

async function signup({ name, email, password }) {
	if (!name || !email || !password) throw new Error('name, email, password are required');
	const existing = await User.findOne({ email }).lean();
	if (existing) throw new Error('email already registered');
	const passwordHash = await bcrypt.hash(password, 10);
	const user = await User.create({ name, email, passwordHash, role: 'student' });
	return { user: sanitize(user) };
}

async function login({ email, password }) {
	if (!email || !password) throw new Error('email and password are required');
	const user = await User.findOne({ email, role: 'student' }).select('+passwordHash');
	if (!user) throw new Error('user not found');
	const ok = await bcrypt.compare(password, user.passwordHash);
	if (!ok) throw new Error('invalid credentials');
	return { user: sanitize(user) };
}

function sanitize(u) {
	return { id: u._id, name: u.name, email: u.email, role: u.role, calendlyUrl: u.calendlyUrl };
}

module.exports = { signup, login };
async function listSessionsByStudent(studentId) {
	if (!studentId) throw new Error('studentId is required');
	const sessions = await Session.find({ studentId })
		.sort({ createdAt: -1 })
		.populate('tutorId', 'name')
		.lean();
	const mapped = sessions.map(s => ({ ...s, tutorName: s?.tutorId?.name || null }));
	return { sessions: mapped };
}

async function listTutorsWithCalendly() {
	const tutors = await User.find({ role: 'tutor', calendlyUrl: { $ne: null } })
		.select('_id name email calendlyUrl')
		.lean();
	return { tutors: tutors.map(t => ({ id: t._id, name: t.name, email: t.email, calendlyUrl: t.calendlyUrl })) };
}

module.exports = { signup, login, listSessionsByStudent, listTutorsWithCalendly };
