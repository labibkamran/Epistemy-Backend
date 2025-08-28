// Student service: signup and login
const User = require('../dataBase/models/User');
const bcrypt = require('bcryptjs');

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
