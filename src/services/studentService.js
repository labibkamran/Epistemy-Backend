// Student service: signup and login
const User = require('../dataBase/models/User');
const bcrypt = require('bcryptjs');
const Session = require('../dataBase/models/Session');
const StudentAttempt = require('../dataBase/models/StudentAttempt');

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

async function getSessionById(sessionId, studentId) {
	if (!sessionId) throw new Error('sessionId is required');
	if (!studentId) throw new Error('studentId is required');
	
	const session = await Session.findOne({ _id: sessionId, studentId })
		.populate('tutorId', 'name')
		.lean();
	
	if (!session) throw new Error('session not found or access denied');
	
	return { 
		session: {
			...session,
			tutorName: session?.tutorId?.name || null
		}
	};
}

async function saveQuizAttempt(sessionId, studentId, answers) {
	if (!sessionId) throw new Error('sessionId is required');
	if (!studentId) throw new Error('studentId is required');
	if (!Array.isArray(answers)) throw new Error('answers must be an array');
	
	const session = await Session.findById(sessionId).lean();
	if (!session || !session.quiz) throw new Error('session or quiz not found');
	
	const items = answers.map((answer, idx) => ({
		idx,
		given: answer,
		correct: answer === session.quiz[idx]?.choices[session.quiz[idx]?.answer_index],
		ts: new Date()
	}));
	
	const correctCount = items.filter(item => item.correct).length;
	const score = Math.round((correctCount / items.length) * 100);
	
	const attempt = await StudentAttempt.create({
		sessionId,
		studentId,
		items,
		score
	});
	
	return { attempt };
}

async function getSessionAttempts(sessionId, studentId) {
	if (!sessionId) throw new Error('sessionId is required');
	if (!studentId) throw new Error('studentId is required');
	
	const attempts = await StudentAttempt.find({ sessionId, studentId })
		.sort({ createdAt: -1 })
		.select('score createdAt')
		.lean();
	
	return { attempts };
}

async function getStudentStats(studentId) {
	if (!studentId) throw new Error('studentId is required');
	
	const totalSessions = await Session.countDocuments({ studentId });
	
	const sessionsWithProgress = await Session.find({ 
		studentId, 
		'progress.score': { $exists: true, $ne: null } 
	}).select('progress.score').lean();

	const progressScores = sessionsWithProgress.map(s => s.progress.score).filter(v => typeof v === 'number');
	const avgProgress = progressScores.length ? Math.round(progressScores.reduce((a, b) => a + b, 0) / progressScores.length) : 0;
	
	const completedQuizzes = await StudentAttempt.countDocuments({ studentId });
	
	return { 
		totalSessions, 
		avgProgress, 
		completedQuizzes 
	};
}

async function listTutorsWithCalendly() {
	const tutors = await User.find({ role: 'tutor', calendlyUrl: { $ne: null } })
		.select('_id name email calendlyUrl sessionPrice')
		.lean();
	
	const tutorsWithStats = await Promise.all(tutors.map(async (tutor) => {
		const sessionCount = await Session.countDocuments({ tutorId: tutor._id });
		return {
			id: tutor._id,
			name: tutor.name,
			email: tutor.email,
			calendlyUrl: tutor.calendlyUrl,
			sessionCount: sessionCount,
			sessionPrice: tutor.sessionPrice || 0
		};
	}));
	
	return { tutors: tutorsWithStats };
}

module.exports = { signup, login, listSessionsByStudent, getSessionById, saveQuizAttempt, getSessionAttempts, getStudentStats, listTutorsWithCalendly };
