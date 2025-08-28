// Step: topics
const { StringOutputParser } = require("@langchain/core/output_parsers");
const { makeLLM } = require("../config/llm");
const { TopicsSchema } = require("../schemas/topics");
const P = require("../prompts/topics");

async function generateTopics(transcript) {
  const llm = makeLLM(process.env.MODEL_TOPICS, 0.2);
  const sop = new StringOutputParser();
  const { safeJsonFromLLM } = require("../util/parse");
  try {
    const raw = await llm.invoke([{ role: "system", content: P.SYSTEM }, { role: "user", content: P.USER(transcript) }]);
    const json = await safeJsonFromLLM(raw, sop);
    return TopicsSchema.parse(json);
  } catch (_e) {
    try {
      const fallback = await llm.invoke([
        { role: "system", content: P.SYSTEM },
        { role: "user", content: `Transcript:\n\"\"\"${transcript}\"\"\"\nReturn strictly JSON: {\n  \"subject\": \"...\",\n  \"subtopics\":[{\"title\":\"...\",\"objective\":\"...\"}]\n}` }
      ]);
      const json = await safeJsonFromLLM(fallback, sop);
      return TopicsSchema.parse(json);
    } catch (__e) {
      const { makeLLM } = require("../config/llm");
      const llmLoose = makeLLM(process.env.MODEL_TOPICS, 0.2, { json: false });
      const raw2 = await llmLoose.invoke([
        { role: "system", content: `${P.SYSTEM}\nIMPORTANT: Reply with raw JSON only (no markdown).` },
        { role: "user", content: P.USER(transcript) }
      ]);
      const json2 = await safeJsonFromLLM(raw2, sop);
      return TopicsSchema.parse(json2);
    }
  }
}

module.exports = { generateTopics };
