// Normalization helpers for pipeline outputs

function toStr(x) {
  if (x === null || x === undefined) return '';
  if (typeof x === 'string') return x;
  try { return String(x); } catch { return ''; }
}

function clamp(n, min, max) {
  if (typeof n !== 'number' || Number.isNaN(n)) return min;
  return Math.min(max, Math.max(min, n));
}

function normalizeQuiz(items) {
  if (!Array.isArray(items)) return [];
  const out = [];
  for (const raw of items) {
    if (!raw) continue;
    // Support both legacy and new shapes
    const q = toStr(raw.q ?? raw.question);
    const choices = Array.isArray(raw.choices) ? raw.choices.map(toStr)
                   : Array.isArray(raw.options) ? raw.options.map(toStr)
                   : [];
    let ans = raw.answer_index;
    if (ans === undefined && raw.answerIndex !== undefined) ans = raw.answerIndex;
    ans = typeof ans === 'string' ? parseInt(ans, 10) : ans;
    const explanation = toStr(raw.explanation);
    const subtopic = raw.subtopic ? toStr(raw.subtopic) : null;
    let difficulty = raw.difficulty;
    difficulty = typeof difficulty === 'string' ? parseInt(difficulty, 10) : difficulty;
    if (difficulty === undefined || Number.isNaN(difficulty)) difficulty = 1;
    difficulty = clamp(difficulty, 1, 3);

    // Basic validation
    if (!q || !Array.isArray(choices) || choices.length < 2) continue;
    if (typeof ans !== 'number' || ans < 0 || ans >= choices.length) continue;

    out.push({ subtopic, q, choices, answer_index: ans, explanation, difficulty });
  }
  return out;
}

module.exports = { normalizeQuiz };
