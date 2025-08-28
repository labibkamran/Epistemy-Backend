// Zod schema: topics
const { z } = require("zod");

const TopicsSchema = z.object({
  subject: z.string().min(1),
  subtopics: z.array(z.object({
    title: z.string().min(1).max(60),
    objective: z.string().min(1)
  })).min(3).max(10)
});

module.exports = { TopicsSchema };
