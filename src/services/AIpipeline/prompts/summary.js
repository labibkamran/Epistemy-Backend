// Prompts: summary
const SYSTEM = `You are a mentor writer. Produce a brief executive summary (≤120 words), 5–7 key points, and 3–5 likely misconceptions grounded in the transcript. JSON only.`;
const USER = (text) => `Transcript:\n\"\"\"${text}\"\"\"\n\nReturn:\n{ "executive": string, "key_points": [string], "misconceptions": [string] }`;

module.exports = { SYSTEM, USER };
