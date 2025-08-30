// Tutor controller for Epistemy Backend
const multer = require('multer');
const tutorService = require('../services/tutorService');
const upload = multer({ storage: multer.memoryStorage() }).single('transcript');

exports.signup = async (req, res) => {
	try {
		const result = await tutorService.signup(req.body);
		res.status(201).json(result);
	} catch (e) {
		res.status(400).json({ error: e.message });
	}
};

exports.login = async (req, res) => {
	try {
		const result = await tutorService.login(req.body);
		res.json(result);
	} catch (e) {
		res.status(400).json({ error: e.message });
	}
};

exports.createSession = async (req, res) => {
	try {
		const result = await tutorService.createSession(req.body);
		res.status(201).json(result);
	} catch (e) {
		res.status(400).json({ error: e.message });
	}
};

exports.getSession = async (req, res) => {
	try {
		const result = await tutorService.getSession(req.params.id);
		if (!result) return res.status(404).json({ error: 'not found' });
		res.json(result);
	} catch (e) {
		res.status(400).json({ error: e.message });
	}
};

exports.listSessionsByTutor = async (req, res) => {
	try {
		const { tutorId } = req.params;
		const result = await tutorService.listSessionsByTutor(tutorId);
		res.json(result);
	} catch (e) {
		res.status(400).json({ error: e.message });
	}
};

exports.updateSession = async (req, res) => {
	try {
		const { id } = req.params;
		const patch = req.body || {};
		const result = await tutorService.updateSession(id, patch);
		if (!result) return res.status(404).json({ error: 'not found' });
		res.json(result);
	} catch (e) {
		res.status(400).json({ error: e.message });
	}
};

exports.listStudents = async (_req, res) => {
	try {
		const result = await tutorService.listStudents();
		res.json(result);
	} catch (e) {
		res.status(400).json({ error: e.message });
	}
};

exports.processSession = (req, res) => {
	upload(req, res, async (err) => {
		if (err) return res.status(400).json({ error: err.message });
		if (!req.file) return res.status(400).json({ error: 'No transcript file uploaded' });
		const { sessionId, studentId } = req.body || {};
		const rawText = req.file.buffer.toString('utf8');
		try {
			const pack = await tutorService.runPipelineForTranscript(sessionId, studentId, rawText);
			return res.json({ sessionId, result: pack });
		} catch (e) {
			return res.status(500).json({ error: e.message });
		}
	});
};
