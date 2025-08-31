// Entry point for Epistemy Backend
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');

const tutorRoutes = require('./src/routes/tutorRoutes');
const studentRoutes = require('./src/routes/studentRoutes');
const connectDB = require('./src/dataBase/config');


const app = express();


app.use(cors());
app.use(express.json());


app.get('/', (req, res) => { 
	res.send('Epistemy Backend Server is running! 🚀'); 
});

app.get('/health', (req, res) => { 
	res.json({ status: 'ok', message: 'Server is healthy' }); 
});

app.use('/tutor', tutorRoutes);
app.use('/student', studentRoutes);


const server = http.createServer(app);


const PORT = process.env.PORT || 4000;
connectDB().then(() => {
	server.listen(PORT, () => { 
		console.log(`🚀 Epistemy Backend Server running on port ${PORT}`);
		console.log(`📚 Environment: ${process.env.NODE_ENV || 'development'}`);
		console.log(`🌐 Health check: http://localhost:${PORT}/health`);
	});
}).catch((err) => {
	console.error('❌ Failed to connect to MongoDB:', err.message);
	process.exit(1);
});


process.on('SIGTERM', () => {
	console.log('🛑 SIGTERM received, shutting down gracefully');
	server.close(() => {
		console.log('✅ Server closed');
		process.exit(0);
	});
});

process.on('SIGINT', () => {
	console.log('🛑 SIGINT received, shutting down gracefully');
	server.close(() => {
		console.log('✅ Server closed');
		process.exit(0);
	});
});
