// Zod schema: progress
const { z } = require("zod");

const ProgressSchema = z.object({
  improvements: z.array(z.string()).default([]),
  gaps: z.array(z.string()).default([]),
  nextGoals: z.array(z.string()).min(1).max(8),
  rubric: z.object({
    criteria: z.array(z.object({
      name: z.string(),
      level: z.number().int().min(0).max(3),
      evidence: z.string().default("")
    })).length(3),
    levels: z.record(z.string()).default({
      "0": "not evident",
      "1": "emerging",
      "2": "developing",
      "3": "proficient"
    })
  })
});

module.exports = { ProgressSchema };
