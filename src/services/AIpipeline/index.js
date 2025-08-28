// AI pipeline orchestrator
const { preprocess } = require("./steps/preprocess");
const { generateTopics } = require("./steps/topics");
const { generateSummary } = require("./steps/summary");
const { evaluateProgress } = require("./steps/progress");
const { generateQuizFromSummary } = require("./steps/quiz");
const { saveTranscript, upsertSession, getPreviousTranscript } = require("./persist/store");

async function runPipeline({ sessionId, studentId, rawTranscriptText }) {
  const pre = preprocess(rawTranscriptText, "en");
  await saveTranscript({ sessionId, clean: pre.cleanText, checksum: pre.checksum, segments: null, lang: pre.lang });
  const previousText = await getPreviousTranscript(sessionId, studentId);
  const topics = await generateTopics(pre.cleanText);
  await upsertSession(sessionId, { topics });
  const summary = await generateSummary(pre.cleanText);
  await upsertSession(sessionId, { summary });
  const progress = await evaluateProgress(pre.cleanText, previousText);
  await upsertSession(sessionId, { progress });
  const quiz = await generateQuizFromSummary(summary);
  await upsertSession(sessionId, { quiz });
  const pack = { topics, summary, progress, quiz };
  await upsertSession(sessionId, { pack, checksum: pre.checksum });
  return pack;
}

module.exports = { runPipeline };
