// MongoDB connection setup 

require('dotenv').config();
const mongoose = require('mongoose');

const dbUrl = process.env.MONGO_DB_URL;
const dbName = 'epistemy';

const connectDB = async () => {
	try {
		await mongoose.connect(dbUrl + dbName, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log('MongoDB connected');
	} catch (error) {
		console.error('MongoDB connection error:', error);
		process.exit(1);
	}
};

module.exports = connectDB;
