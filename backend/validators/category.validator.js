const { z } = require('zod');

const categorySchema = z.object({
  name: z.string().min(2).max(50),
  description: z.string().optional(),
  icon: z.string().optional(),
  parentId: z.string().optional(),
  isActive: z.boolean().optional()
});

const validateCategory = (data) => {
  return categorySchema.parse(data);
};

module.exports = {
  validateCategory
};