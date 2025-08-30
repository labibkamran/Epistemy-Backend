// Student routes for Epistemy Backend
const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

router.post('/signup', studentController.signup);
router.post('/login', studentController.login);
router.get('/sessions/:studentId', studentController.listSessionsByStudent);
router.get('/session/:sessionId', studentController.getSessionById);
router.post('/session/:sessionId/quiz', studentController.saveQuizAttempt);
router.get('/session/:sessionId/attempts', studentController.getSessionAttempts);
router.get('/stats/:studentId', studentController.getStudentStats);
router.get('/tutors', studentController.listTutorsWithCalendly);

module.exports = router;
