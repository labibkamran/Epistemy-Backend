// Tutor routes for Epistemy Backend
const express = require('express');
const router = express.Router();
const tutorController = require('../controllers/tutorController');


router.post('/signup', tutorController.signup);
router.post('/login', tutorController.login);
// Tutor profile
router.get('/profile/:id', tutorController.getProfile);
router.patch('/profile/:id', tutorController.updateProfile);
router.post('/session', tutorController.createSession);
router.get('/session/:id', tutorController.getSession);
router.patch('/session/:id', tutorController.updateSession);
router.get('/sessions/:tutorId', tutorController.listSessionsByTutor);
router.get('/students', tutorController.listStudents);
router.post('/process-session', tutorController.processSession);


module.exports = router;

