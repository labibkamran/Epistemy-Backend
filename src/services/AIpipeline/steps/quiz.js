// Step: quiz
const { StringOutputParser } = require("@langchain/core/output_parsers");
const { makeLLM } = require("../config/llm");
const { QuizSchema } = require("../schemas/quiz");
const P = require("../prompts/quiz");

async function generateQuizFromSummary(summary) {
  const llm = makeLLM(process.env.MODEL_QUIZ, 0.2, { json: true, maxTokens: Number(process.env.MAX_OUTPUT_TOKENS_QUIZ || 700) });
  const sop = new StringOutputParser();
  const { safeJsonFromLLM } = require("../util/parse");
  try {
    const raw = await llm.invoke([{ role: "system", content: P.SYSTEM }, { role: "user", content: P.USER(summary) }]);
    const json = await safeJsonFromLLM(raw, sop, { expect: 'array' });
    const quiz = QuizSchema.parse(json);
    return quiz;
  } catch (_e) {
    const fallback = await llm.invoke([
      { role: "system", content: P.SYSTEM },
      { role: "user", content: `Return strictly JSON only (no prose). Output an array of 3-5 items. Example shape:\n[ {\n  \"subtopic\": \"...\",\n  \"q\": \"...\",\n  \"choices\": [\"...\", \"...\", \"...\", \"...\"],\n  \"answer_index\": 0,\n  \"explanation\": \"...\",\n  \"difficulty\": 1\n} ]\nDo NOT echo the summary content in prose. Create from this summary JSON:\n${JSON.stringify(summary)}` }
    ]);
    const json = await safeJsonFromLLM(fallback, sop, { expect: 'array' });
    const quiz = QuizSchema.parse(json);
    return quiz;
  }
}

module.exports = { generateQuizFromSummary };
