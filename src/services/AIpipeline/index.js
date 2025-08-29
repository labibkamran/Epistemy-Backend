// AI pipeline orchestrator
const { preprocess } = require("./steps/preprocess");
const { generateTopics } = require("./steps/topics");
const { generateSummary } = require("./steps/summary");
const { evaluateProgress } = require("./steps/progress");
const { generateQuizFromSummary } = require("./steps/quiz");
const { saveTranscript, upsertSession, getPreviousTranscript } = require("./persist/store");
const { normalizeQuiz } = require("./util/normalize");

const pause = (ms) => new Promise((r) => setTimeout(r, ms));
const STEP_PAUSE_MS = Number(process.env.LLM_STEP_PAUSE_MS || 0);

async function runPipeline({ sessionId, studentId, rawTranscriptText }) {
  const pre = preprocess(rawTranscriptText, "en");
  await saveTranscript({ sessionId, clean: pre.cleanText, checksum: pre.checksum, segments: null, lang: pre.lang });
  await upsertSession(sessionId, { status: 'transcribed' });
  const results = {};

  // topics
  const topics = await generateTopics(pre.llmText);
  results.topics = topics;
  await upsertSession(sessionId, { topics });
  if (STEP_PAUSE_MS) await pause(STEP_PAUSE_MS);

  // summary
  const summary = await generateSummary(pre.llmText);
  results.summary = summary;
  await upsertSession(sessionId, { summary });
  if (STEP_PAUSE_MS) await pause(STEP_PAUSE_MS);

  // progress
  const prev = await getPreviousTranscript(sessionId, studentId);
  const progress = await evaluateProgress(pre.llmText, prev ? prev.slice(0, pre.maxChars) : "");
  results.progress = progress;
  await upsertSession(sessionId, { progress });
  if (STEP_PAUSE_MS) await pause(STEP_PAUSE_MS);

  // quiz
  const quiz = await generateQuizFromSummary(results.summary);
  const normalizedQuiz = normalizeQuiz(quiz);
  results.quiz = normalizedQuiz;
  await upsertSession(sessionId, { quiz: normalizedQuiz });

  const pack = { topics: results.topics, summary: results.summary, progress: results.progress, quiz: results.quiz };
  await upsertSession(sessionId, { pack, checksum: pre.checksum, status: 'processed' });
  return pack;
}

module.exports = { runPipeline };
