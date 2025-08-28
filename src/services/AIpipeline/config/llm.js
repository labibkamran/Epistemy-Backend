// LLM config for Groq via LangChain
const { ChatOpenAI } = require("@langchain/openai");

function makeLLM(model, temperature = 0.2) {
  return new ChatOpenAI({
    apiKey: process.env.GROQ_API_KEY,
    model,
    temperature,
    configuration: { baseURL: process.env.GROQ_BASE_URL }
  }).bind({ response_format: { type: "json_object" } });
}

module.exports = { makeLLM };
