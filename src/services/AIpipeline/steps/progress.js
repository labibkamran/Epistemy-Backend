// Step: progress
const { StringOutputParser } = require("@langchain/core/output_parsers");
const { makeLLM } = require("../config/llm");
const { ProgressSchema } = require("../schemas/progress");
const P = require("../prompts/progress");

async function evaluateProgress(currentTranscript, previousTranscript) {
  const llm = makeLLM(process.env.MODEL_PROGRESS, 0.2);
  const messages = [{ role: "system", content: P.SYSTEM }, { role: "user", content: P.USER(currentTranscript, previousTranscript || "") }];
  const raw = await llm.invoke(messages);
  const text = await new StringOutputParser().parse(raw);
  return ProgressSchema.parse(JSON.parse(text));
}

module.exports = { evaluateProgress };
