// Step: progress
const { StringOutputParser } = require("@langchain/core/output_parsers");
const { makeLLM } = require("../config/llm");
const { ProgressSchema } = require("../schemas/progress");
const P = require("../prompts/progress");

async function evaluateProgress(currentTranscript, previousTranscript) {
  const llm = makeLLM(process.env.MODEL_PROGRESS, 0.2, { json: true, maxTokens: Number(process.env.MAX_OUTPUT_TOKENS_PROGRESS || 900) });
  const sop = new StringOutputParser();
  const { safeJsonFromLLM } = require("../util/parse");
  const prevHalf = previousTranscript ? previousTranscript.slice(0, Math.floor(previousTranscript.length / 3)) : "";
  try {
    const raw = await llm.invoke([{ role: "system", content: P.SYSTEM }, { role: "user", content: P.USER(currentTranscript, prevHalf) }]);
    const json = await safeJsonFromLLM(raw, sop);
    return ProgressSchema.parse(json);
  } catch (_e) {
    try {
      const fallback = await llm.invoke([
        { role: "system", content: P.SYSTEM },
        { role: "user", content: `CURRENT:\n\"\"\"${currentTranscript}\"\"\"\nPREVIOUS:\n\"\"\"${prevHalf}\"\"\"\nReturn strictly JSON: {\n  \"improvements\":[\"...\"],\n  \"gaps\":[\"...\"],\n  \"nextGoals\":[\"...\"],\n  \"rubric\":{\n    \"criteria\":[{\"name\":\"Conceptual\",\"level\":0,\"evidence\":\"...\"},{\"name\":\"Procedural\",\"level\":0,\"evidence\":\"...\"},{\"name\":\"Metacognition\",\"level\":0,\"evidence\":\"...\"}]\n  }\n}` }
      ]);
      const json = await safeJsonFromLLM(fallback, sop);
      return ProgressSchema.parse(json);
    } catch (__e) {
      // Final fallback: non-JSON mode, ask for raw JSON string
  const llmLoose = makeLLM(process.env.MODEL_PROGRESS, 0.2, { json: false, maxTokens: Number(process.env.MAX_OUTPUT_TOKENS_PROGRESS || 900) });
      const raw2 = await llmLoose.invoke([
        { role: "system", content: `${P.SYSTEM}\nIMPORTANT: Reply with raw JSON only (no markdown).` },
        { role: "user", content: P.USER(currentTranscript, prevHalf) }
      ]);
      const json2 = await safeJsonFromLLM(raw2, sop);
      return ProgressSchema.parse(json2);
    }
  }
}

module.exports = { evaluateProgress };
