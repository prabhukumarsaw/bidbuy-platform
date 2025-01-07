const { z } = require('zod');

const bidSchema = z.object({
  amount: z.number().positive()
});

const validateBid = (data) => {
  return bidSchema.parse(data);
};

module.exports = {
  validateBid
};