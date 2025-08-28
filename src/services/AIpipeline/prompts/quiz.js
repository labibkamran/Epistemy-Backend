// Prompts: quiz
const SYSTEM = `You are a strict MCQ writer. Generate 3–5 progression-aware MCQs from the session summary key points.
Exactly 4 unique choices; exactly one correct (answer_index). Include explanation. JSON only.`;
const USER = (summary) => `Summary object:\n${JSON.stringify(summary)}\n\nReturn:\n[\n  { "subtopic": string, "q": string,\n    "choices":[string, string, string, string],\n    "answer_index": 0-3, "explanation": string, "difficulty": 1|2|3 }\n]`;

module.exports = { SYSTEM, USER };
