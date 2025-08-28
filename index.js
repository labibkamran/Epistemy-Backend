// Entry point for Epistemy Backend
require('dotenv').config();
const { app, server } = require('./server');
const tutorRoutes = require('./src/routes/tutorRoutes');
const studentRoutes = require('./src/routes/studentRoutes');
const connectDB = require('./src/dataBase/config');

app.get('/', (req, res) => { res.send('server is running'); });
app.get('/health', (req, res) => { res.json({ status: 'ok', message: 'Server is healthy' }); });
app.use('/tutor', tutorRoutes);
app.use('/student', studentRoutes);

const PORT = process.env.PORT || 5000;
connectDB().then(() => {
	server.listen(PORT, () => { console.log(`HTTP+WS on :${PORT}`); });
}).catch((err) => {
	console.error('Failed to connect to MongoDB:', err.message);
	process.exit(1);
});
