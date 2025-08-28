// Step: topics
const { StringOutputParser } = require("@langchain/core/output_parsers");
const { makeLLM } = require("../config/llm");
const { TopicsSchema } = require("../schemas/topics");
const P = require("../prompts/topics");

async function generateTopics(transcript) {
  const llm = makeLLM(process.env.MODEL_TOPICS, 0.2);
  const messages = [{ role: "system", content: P.SYSTEM }, { role: "user", content: P.USER(transcript) }];
  const raw = await llm.invoke(messages);
  const text = await new StringOutputParser().parse(raw);
  return TopicsSchema.parse(JSON.parse(text));
}

module.exports = { generateTopics };
