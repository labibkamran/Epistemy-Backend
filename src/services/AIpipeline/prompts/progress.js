// Prompts: progress
const SYSTEM = `You compare two lesson transcripts and evaluate student progress.
Score a rubric (0–3) for Conceptual, Procedural, Metacognition with brief evidence quotes. JSON only.`;
const USER = (current, previous) => `CURRENT:\n\"\"\"${current}\"\"\"\n\nPREVIOUS:\n\"\"\"${previous}\"\"\"\n\nReturn:\n{\n  "improvements":[string],\n  "gaps":[string],\n  "nextGoals":[string],\n  "rubric":{\n    "criteria":[\n      {"name":"Conceptual","level":0-3,"evidence":string},\n      {"name":"Procedural","level":0-3,"evidence":string},\n      {"name":"Metacognition","level":0-3,"evidence":string}\n    ],\n    "levels":{"0":"not evident","1":"emerging","2":"developing","3":"proficient"}\n  }\n}`;

module.exports = { SYSTEM, USER };
