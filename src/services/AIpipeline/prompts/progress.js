// Prompts: progress
const SYSTEM = `You compare two lesson transcripts and evaluate student progress.
Output strictly compact JSON only (no markdown). Keep arrays ≤5 items and evidence ≤120 chars.
Score a rubric (0–3) for Conceptual, Procedural, Metacognition with brief evidence quotes.`;
const USER = (current, previous) => `CURRENT:\n\"\"\"${current}\"\"\"\n\nPREVIOUS:\n\"\"\"${previous}\"\"\"\n\nReturn JSON (no prose):\n{\n  "improvements":["..."],\n  "gaps":["..."],\n  "nextGoals":["..."],\n  "rubric":{\n    "criteria":[\n      {"name":"Conceptual","level":0,"evidence":"..."},\n      {"name":"Procedural","level":0,"evidence":"..."},\n      {"name":"Metacognition","level":0,"evidence":"..."}\n    ],\n    "levels":{"0":"not evident","1":"emerging","2":"developing","3":"proficient"}\n  }\n}\nNotes: level is an integer 0,1,2,3.`;

module.exports = { SYSTEM, USER };
