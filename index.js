// Basic Express server for Epistemy Backend with dotenv support
require('dotenv').config();
const express = require('express');
const tutorRoutes = require('./src/routes/tutorRoutes');

const app = express();

app.get('/', (req, res) => {
	res.send('server is running');
});

app.get('/health', (req, res) => {
	res.json({ status: 'ok', message: 'Server is healthy' });
});


app.use('/tutor', tutorRoutes);

const PORT = process.env.PORT ;
app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
