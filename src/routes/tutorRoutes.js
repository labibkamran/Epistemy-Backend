// Tutor routes for Epistemy Backend
const express = require('express');
const router = express.Router();
const tutorController = require('../controllers/tutorController');
const { jobsStore } = require('../../server');

router.post('/signup', tutorController.signup);
router.post('/login', tutorController.login);
router.post('/session', tutorController.createSession);
router.get('/session/:id', tutorController.getSession);
router.patch('/session/:id', tutorController.updateSession);
router.get('/sessions/:tutorId', tutorController.listSessionsByTutor);
router.get('/students', tutorController.listStudents);
router.post('/process-session', tutorController.processSession);
router.get('/jobs/:jobId', (req, res) => {
	const job = jobsStore.get(req.params.jobId);
	if (!job) return res.status(404).json({ error: 'job not found' });
	res.json(job);
});

module.exports = router;

