// AIService: handles transcript upload and runs AI pipeline
const multer = require('multer');
const { runPipeline } = require('./AIpipeline');
const upload = multer({ storage: multer.memoryStorage() }).single('transcript');

exports.processSession = (req, res) => {
	upload(req, res, async (err) => {
		if (err) return res.status(400).json({ error: err.message });
		if (!req.file) return res.status(400).json({ error: 'No transcript file uploaded' });
		const { sessionId, studentId } = req.body || {};
		const rawText = req.file.buffer.toString('utf8');
		try {
			const pack = await runPipeline({ sessionId, studentId, rawTranscriptText: rawText });
			return res.json({ sessionId, result: pack });
		} catch (e) {
			return res.status(500).json({ error: e.message });
		}
	});
};
