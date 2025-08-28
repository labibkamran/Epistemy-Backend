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
