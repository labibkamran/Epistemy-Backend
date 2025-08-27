/*
  Tutor service for Epistemy Backend
  Handles large video uploads, extracts audio, chunks into WAV segments, transcribes each chunk via a Python sidecar (FastAPI + faster-whisper),
  merges segments with timestamp offsets and overlap de-dup, persists final transcript to disk (and optionally Mongo), and cleans up temp media.

 */

const path = require('path');
const fs = require('fs');
const axios = require('axios');
const multer = require('multer');
const crypto = require('crypto');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const { v4: uuidv4 } = require('uuid');
const Transcript = require('../dataBase/models/Transcript');

ffmpeg.setFfmpegPath(ffmpegPath);

const SIDECAR_URL = process.env.SIDECAR_URL || 'http://localhost:8081';
const CHUNK_STEP_SEC = parseInt(process.env.CHUNK_STEP_SEC || '600', 10);
const CHUNK_OVERLAP_SEC = parseInt(process.env.CHUNK_OVERLAP_SEC || '2', 10);
const UPLOAD_MAX_BYTES = parseInt(process.env.UPLOAD_MAX_BYTES || String(1024 * 1024 * 1024), 10);
const DEFAULT_LANGUAGE = process.env.DEFAULT_LANGUAGE || 'en';
const TRANSCRIBE_PROFILE = process.env.TRANSCRIBE_PROFILE || 'fast';

const uploadDir = path.join(__dirname, '../../data/uploads');
const workRoot = path.join(__dirname, '../../data/work');
const outDir = path.join(__dirname, '../../data/out');
[uploadDir, workRoot, outDir].forEach((d) => { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    try {
      fs.mkdirSync(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (e) {
      cb(e);
    }
  },
  filename: (_req, file, cb) => cb(null, uuidv4() + path.extname(file.originalname).toLowerCase())
});
const upload = multer({
  storage,
  limits: { fileSize: UPLOAD_MAX_BYTES },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!/\.(mp4|mov|mkv|m4a|wav|mp3)$/i.test(ext)) return cb(new Error('Unsupported file type'));
    cb(null, true);
  }
}).single('video');

function sha256(s) {
  return crypto.createHash('sha256').update(s, 'utf8').digest('hex');
}

function ffprobeDuration(file) {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(file, (err, data) => {
      if (err) return reject(err);
      resolve(Number(data?.format?.duration || 0));
    });
  });
}

function extractAudioToWav(srcMp4, dstWav) {
  return new Promise((resolve, reject) => {
    ffmpeg(srcMp4).audioChannels(1).audioFrequency(16000).noVideo().format('wav').output(dstWav)
      .on('end', resolve).on('error', reject).run();
  });
}

async function makeChunks(wavPath, workDir, stepSec, overlapSec) {
  const dur = await ffprobeDuration(wavPath);
  const chunks = [];
  let start = 0, idx = 0;
  while (start < dur) {
    const out = path.join(workDir, `${path.basename(wavPath, '.wav')}_chunk_${idx}.wav`);
    const len = Math.min(stepSec + overlapSec, Math.max(0, dur - start));
    // eslint-disable-next-line no-await-in-loop
    await new Promise((resolve, reject) => {
      ffmpeg(wavPath).seekInput(start).duration(len).audioChannels(1).audioFrequency(16000).noVideo().format('wav').output(out)
        .on('end', resolve).on('error', reject).run();
    });
    chunks.push({ idx, path: out, offsetSec: start });
    start += stepSec; idx += 1;
  }
  return { durationSec: dur, chunks };
}

async function transcribeChunk(sidecarUrl, chunkPath, lang, profile) {
  const { data } = await axios.post(`${sidecarUrl}/transcribe_chunk`, {
    path: path.resolve(chunkPath),
    language: lang,
    profile
  }, { timeout: 1000 * 60 * 15 });
  return data;
}

function mergeSegments(perChunk, overlapSec) {
  const out = [];
  let lastEnd = 0;
  for (const { segments, offsetSec } of perChunk) {
    for (const s of (segments || [])) {
      const start = Number(s.start) + offsetSec;
      const end = Number(s.end) + offsetSec;
      const text = String(s.text || '').trim();
      if (end <= lastEnd) continue;
      out.push({ start, end, text });
      lastEnd = Math.max(lastEnd, end);
    }
  }
  const clean = out.map((s) => s.text).join(' ').replace(/\s+/g, ' ').trim();
  return { segments: out, clean, checksum: sha256(clean) };
}

function rmrf(target) {
  try {
    if (!fs.existsSync(target)) return;
    const stat = fs.statSync(target);
    if (stat.isDirectory()) fs.rmSync(target, { recursive: true, force: true });
    else fs.unlinkSync(target);
  } catch {}
}

exports.processSession = (req, res) => {
  const reqStart = Date.now();
  
  let stage = 'receive';
  upload(req, res, async (err) => {
    if (err) return res.status(400).json({ error: err.message });
    if (!req.file) return res.status(400).json({ error: 'No video file uploaded' });

    const videoPath = req.file.path;
    const jobId = path.basename(videoPath, path.extname(videoPath));
    const workDir = path.join(workRoot, jobId);
    const language = (req.body?.language || DEFAULT_LANGUAGE).toString();
    const profile = (req.body?.profile || TRANSCRIBE_PROFILE).toString();
    const sessionId = req.body?.sessionId || null;
    if (!fs.existsSync(workDir)) fs.mkdirSync(workDir, { recursive: true });

    let sidecarMsTotal = 0;

    try {
      stage = 'extract_audio';
      const wavPath = path.join(workDir, `${jobId}.wav`);
      await extractAudioToWav(videoPath, wavPath);

      stage = 'chunk';
      const { durationSec, chunks } = await makeChunks(wavPath, workDir, CHUNK_STEP_SEC, CHUNK_OVERLAP_SEC);
      if (!chunks.length) throw new Error('No chunks generated');

      stage = 'transcribe';
      const perChunk = [];
      for (const c of chunks) {
        const t0 = Date.now();
        // eslint-disable-next-line no-await-in-loop
        const data = await transcribeChunk(SIDECAR_URL, c.path, language, profile);
        sidecarMsTotal += (Date.now() - t0);
        perChunk.push({ segments: data.segments || [], offsetSec: c.offsetSec });
      }

      stage = 'merge';
      const { segments, clean, checksum } = mergeSegments(perChunk, CHUNK_OVERLAP_SEC);

      stage = 'persist';
      const transcriptPath = path.join(outDir, `${jobId}.json`);
      const txtPath = path.join(outDir, `${jobId}.txt`);
      fs.writeFileSync(transcriptPath, JSON.stringify({
        jobId, lang: language, durationSec, checksum, segments, cleanText: clean, createdAt: new Date().toISOString()
      }, null, 2));
      fs.writeFileSync(txtPath, clean + '\n');

      if (sessionId) {
        try {
          const transcriptDoc = new Transcript({
            sessionId,
            source: 'upload',
            raw: null,
            clean,
            segments,
            sttMeta: { engine: 'faster-whisper', lang: language, profile },
            checksum,
            createdAt: new Date()
          });
          await transcriptDoc.save();
        } catch (e) {}
      }

      stage = 'cleanup';
      rmrf(workDir);
      rmrf(videoPath);

      const totalMs = Date.now() - reqStart;
      return res.json({
        jobId,
        language,
        durationSec,
        transcript: clean,
        segments,
        checksum,
        metrics: { totalMs, sidecarMsTotal, chunks: chunks.length }
      });
    } catch (error) {
      rmrf(workDir);
      return res.status(500).json({ error: error.message, stage });
    }
  });
};
