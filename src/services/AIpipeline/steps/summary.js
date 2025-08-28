// Step: summary
const { StringOutputParser } = require("@langchain/core/output_parsers");
const { makeLLM } = require("../config/llm");
const { SummarySchema } = require("../schemas/summary");
const P = require("../prompts/summary");

async function generateSummary(transcript) {
  const llm = makeLLM(process.env.MODEL_SUMMARY, 0.2);
  const sop = new StringOutputParser();
  const { safeJsonFromLLM } = require("../util/parse");
  try {
    const raw = await llm.invoke([{ role: "system", content: P.SYSTEM }, { role: "user", content: P.USER(transcript) }]);
    const json = await safeJsonFromLLM(raw, sop);
    return SummarySchema.parse(json);
  } catch (_e) {
    try {
      const fallback = await llm.invoke([
        { role: "system", content: P.SYSTEM },
        { role: "user", content: `Transcript:\n\"\"\"${transcript}\"\"\"\nReturn strictly JSON: {\n  \"executive\": \"...\",\n  \"key_points\": [\"...\"],\n  \"misconceptions\": [\"...\"]\n}` }
      ]);
      const json = await safeJsonFromLLM(fallback, sop);
      return SummarySchema.parse(json);
    } catch (__e) {
      const { makeLLM } = require("../config/llm");
      const llmLoose = makeLLM(process.env.MODEL_SUMMARY, 0.2, { json: false });
      const raw2 = await llmLoose.invoke([
        { role: "system", content: `${P.SYSTEM}\nIMPORTANT: Reply with raw JSON only (no markdown).` },
        { role: "user", content: P.USER(transcript) }
      ]);
      const json2 = await safeJsonFromLLM(raw2, sop);
      return SummarySchema.parse(json2);
    }
  }
}

module.exports = { generateSummary };
