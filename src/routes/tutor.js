// Tutor routes for text-based AI pipeline
const router = require("express").Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { runPipeline } = require("../services/AIpipeline");

const upload = multer({ storage: multer.memoryStorage() }).single("transcript");

router.post("/process-session", (req, res) => {
  upload(req, res, async (err) => {
    if (err) return res.status(400).json({ error: err.message });
    if (!req.file) return res.status(400).json({ error: "No transcript file uploaded" });
    const { sessionId, studentId } = req.body || {};
    const rawText = req.file.buffer.toString("utf8");
    try {
      const pack = await runPipeline({ sessionId, studentId, rawTranscriptText: rawText });
      const outDir = path.join(process.cwd(), "data/out");
      if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
      fs.writeFileSync(path.join(outDir, `${sessionId || "no-session"}-pack.json`), JSON.stringify(pack, null, 2));
      return res.json({ sessionId, result: pack });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  });
});

module.exports = router;
