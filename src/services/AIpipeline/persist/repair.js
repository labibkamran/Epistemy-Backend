// Repair utilities to fix existing Session documents' AI outputs
const Session = require("../../../dataBase/models/Session");
const { normalizeQuiz } = require("../util/normalize");

function isValidQuizItem(it) {
  return it && typeof it.q === 'string' && Array.isArray(it.choices) && typeof it.answer_index === 'number';
}

async function repairSessionPack(sessionId) {
  const session = await Session.findById(sessionId).lean();
  if (!session) return { repaired: false, reason: 'not found' };

  const topics = session.topics || null;
  const summary = session.summary || null;
  const progress = session.progress || null;

  // Prefer top-level quiz if present, else from pack
  const rawQuiz = Array.isArray(session.quiz) && session.quiz.length ? session.quiz
                  : Array.isArray(session.pack?.quiz) ? session.pack.quiz
                  : [];
  const quiz = normalizeQuiz(rawQuiz);

  // Build a complete pack
  const pack = { topics, summary, progress, quiz };

  // If nothing to update, skip
  const needsPack = !session.pack || !session.pack.summary || !session.pack.topics || !Array.isArray(session.pack.quiz);
  const needsQuiz = !Array.isArray(session.quiz) || !session.quiz.every(isValidQuizItem);

  if (!needsPack && !needsQuiz) return { repaired: false, reason: 'already consistent' };

  const update = {};
  if (needsPack) update.pack = pack;
  if (needsQuiz) update.quiz = quiz;

  await Session.findByIdAndUpdate(sessionId, { $set: update });
  return { repaired: true };
}

async function repairAllProcessed(limit = 200) {
  const cursor = Session.find({ status: 'processed' }).cursor();
  const results = { scanned: 0, repaired: 0 };
  for await (const doc of cursor) {
    results.scanned++;
    const okQuiz = Array.isArray(doc.quiz) && doc.quiz.length && doc.quiz.every(isValidQuizItem);
    const okPack = doc.pack && doc.pack.topics && doc.pack.summary && Array.isArray(doc.pack.quiz);
    if (!okQuiz || !okPack) {
      const r = await repairSessionPack(doc._id);
      if (r.repaired) results.repaired++;
    }
    if (results.scanned >= limit) break;
  }
  return results;
}

module.exports = { repairSessionPack, repairAllProcessed };
