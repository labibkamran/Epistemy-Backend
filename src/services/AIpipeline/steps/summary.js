// Step: summary
const { StringOutputParser } = require("@langchain/core/output_parsers");
const { makeLLM } = require("../config/llm");
const { SummarySchema } = require("../schemas/summary");
const P = require("../prompts/summary");

async function generateSummary(transcript) {
  const llm = makeLLM(process.env.MODEL_SUMMARY, 0.2);
  const messages = [{ role: "system", content: P.SYSTEM }, { role: "user", content: P.USER(transcript) }];
  const raw = await llm.invoke(messages);
  const text = await new StringOutputParser().parse(raw);
  return SummarySchema.parse(JSON.parse(text));
}

module.exports = { generateSummary };
