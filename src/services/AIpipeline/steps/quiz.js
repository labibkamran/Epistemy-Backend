// Step: quiz
const { StringOutputParser } = require("@langchain/core/output_parsers");
const { makeLLM } = require("../config/llm");
const { QuizSchema } = require("../schemas/quiz");
const P = require("../prompts/quiz");

async function generateQuizFromSummary(summary) {
  const llm = makeLLM(process.env.MODEL_QUIZ, 0.2);
  const messages = [{ role: "system", content: P.SYSTEM }, { role: "user", content: P.USER(summary) }];
  const raw = await llm.invoke(messages);
  const text = await new StringOutputParser().parse(raw);
  const quiz = QuizSchema.parse(JSON.parse(text));
  return quiz;
}

module.exports = { generateQuizFromSummary };
