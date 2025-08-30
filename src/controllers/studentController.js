// Student controller for Epistemy Backend
const studentService = require('../services/studentService');

exports.signup = async (req, res) => {
	try {
		const result = await studentService.signup(req.body);
		res.status(201).json(result);
	} catch (e) {
		res.status(400).json({ error: e.message });
	}
};

exports.login = async (req, res) => {
	try {
		const result = await studentService.login(req.body);
		res.json(result);
	} catch (e) {
		res.status(400).json({ error: e.message });
	}
};

exports.listSessionsByStudent = async (req, res) => {
	try {
		const { studentId } = req.params;
		const result = await studentService.listSessionsByStudent(studentId);
		res.json(result);
	} catch (e) {
		res.status(400).json({ error: e.message });
	}
};

exports.listTutorsWithCalendly = async (_req, res) => {
	try {
		const result = await studentService.listTutorsWithCalendly();
		res.json(result);
	} catch (e) {
		res.status(400).json({ error: e.message });
	}
};
