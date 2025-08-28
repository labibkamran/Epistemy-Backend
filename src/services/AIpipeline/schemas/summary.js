// Zod schema: summary
const { z } = require("zod");

const SummarySchema = z.object({
  executive: z.string().min(1).max(800),
  key_points: z.array(z.string()).min(3).max(10),
  misconceptions: z.array(z.string()).min(0).max(8)
});

module.exports = { SummarySchema };
