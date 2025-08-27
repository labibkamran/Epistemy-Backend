// Tutor controller for Epistemy Backend
const tutorService = require('../services/tutorService');

exports.processSession = (req, res) => {
	tutorService.processSession(req, res);
};
