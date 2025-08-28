// LLM config for Groq via LangChain
const { ChatOpenAI } = require("@langchain/openai");

function makeLLM(model, temperature = 0.2, opts = { json: true, maxTokens: undefined }) {
  const client = new ChatOpenAI({
    apiKey: process.env.GROQ_API_KEY,
    model,
    temperature,
  maxTokens: Number(opts?.maxTokens ?? process.env.MAX_OUTPUT_TOKENS ?? 800),
    configuration: { baseURL: process.env.GROQ_BASE_URL }
  });
  return opts?.json === false ? client : client.bind({ response_format: { type: "json_object" } });
}

module.exports = { makeLLM };
