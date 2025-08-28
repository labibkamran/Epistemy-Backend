// Persistence helpers for AI pipeline
const Transcript = require("../../../dataBase/models/Transcript");
const Session = require("../../../dataBase/models/Session");

async function saveTranscript({ sessionId, clean, checksum, segments = null, lang = "en" }) {
  return Transcript.findOneAndUpdate(
    { sessionId },
    {
      $set: {
        source: "upload",
        clean,
        segments,
        sttMeta: { engine: "text-upload", lang },
        checksum
      },
      $setOnInsert: { createdAt: new Date() }
    },
    { upsert: true, new: true }
  );
}

async function upsertSession(sessionId, patch) {
  const now = new Date();
  return Session.findByIdAndUpdate(
    sessionId,
    { $set: { ...patch, updatedAt: now } },
    { new: true }
  );
}

async function getPreviousTranscript(sessionId, studentId) {
  const current = await Session.findById(sessionId).lean();
  const sid = studentId || current?.studentId;
  if (!sid) return "";
  const prevSession = await Session.findOne({
    studentId: sid,
    _id: { $ne: sessionId },
    createdAt: { $lt: current?.createdAt || new Date() }
  }).sort({ createdAt: -1 }).lean();
  if (!prevSession) return "";
  const prevTranscript = await Transcript.findOne({ sessionId: prevSession._id }).lean();
  return prevTranscript?.clean || "";
}

module.exports = { saveTranscript, upsertSession, getPreviousTranscript };
