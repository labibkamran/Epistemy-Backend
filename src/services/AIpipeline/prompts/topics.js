// Prompts: topics
const SYSTEM = `You are a senior curriculum designer. Extract subject and 4–8 subtopics with measurable objectives. Titles ≤ 6 words. Objectives start with a strong verb. Output JSON only.`;
const USER = (text) => `Transcript:\n\"\"\"${text}\"\"\"\nReturn: { "subject": string, "subtopics": [{ "title": string, "objective": string }] }`;

module.exports = { SYSTEM, USER };
