// Tutor routes for Epistemy Backend
const express = require('express');
const router = express.Router();
const tutorController = require('../controllers/tutorController');

router.post('/process-session', tutorController.processSession);

module.exports = router;

