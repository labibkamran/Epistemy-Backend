// Prompts: quiz
const SYSTEM = `You are a strict MCQ writer. Generate 3–5 progression-aware MCQs from the session summary key points.
Exactly 4 unique choices; exactly one correct (answer_index).
Include explanation. Output strictly JSON only with no markdown or prose.`;
const USER = (summary) => `Summary object as JSON:\n${JSON.stringify(summary)}\n\nReturn strictly JSON (no prose):\n[\n  {\n    "subtopic": "...",
		"q": "...",
		"choices": ["...", "...", "...", "..."],
		"answer_index": 0,
		"explanation": "...",
		"difficulty": 1
	}\n]`;

module.exports = { SYSTEM, USER };
