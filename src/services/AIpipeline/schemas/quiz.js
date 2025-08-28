// Zod schema: quiz
const { z } = require("zod");

const QuizItemSchema = z.object({
  subtopic: z.string(),
  q: z.string(),
  choices: z.array(z.string()).length(4),
  answer_index: z.number().int().min(0).max(3),
  explanation: z.string(),
  difficulty: z.number().int().min(1).max(3)
});
const QuizSchema = z.array(QuizItemSchema).min(3).max(7);

module.exports = { QuizSchema };
