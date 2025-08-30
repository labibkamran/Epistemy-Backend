// Student routes for Epistemy Backend
const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

router.post('/signup', studentController.signup);
router.post('/login', studentController.login);
router.get('/sessions/:studentId', studentController.listSessionsByStudent);
router.get('/tutors', studentController.listTutorsWithCalendly);

module.exports = router;
