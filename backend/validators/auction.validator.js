const { z } = require('zod');

// Base auction schema
const auctionBaseSchema = z.object({
  title: z.string()
    .min(3, 'Title must be at least 3 characters')
    .max(255, 'Title cannot exceed 255 characters'),
  description: z.string().optional(),
  startingPrice: z.number()
    .positive('Starting price must be positive')
    .min(0.01, 'Starting price must be at least 0.01'),
  minBidIncrement: z.number()
    .positive('Minimum bid increment must be positive')
    .min(0.01, 'Minimum bid increment must be at least 0.01'),
  reservePrice: z.number()
    .positive('Reserve price must be positive')
    .optional(),
  startTime: z.string()
    .datetime('Invalid start time format')
    .refine(val => new Date(val) > new Date(), {
      message: 'Start time must be in the future',
    }),
  endTime: z.string()
    .datetime('Invalid end time format')
    .refine(val => new Date(val) > new Date(), {
      message: 'End time must be in the future',
    }),
  categoryId: z.string().uuid('Invalid category ID'),
  images: z.array(z.string().url('Invalid image URL')).optional(),
  tags: z.array(z.string()).optional(),
});

// Create auction schema
const createAuctionSchema = auctionBaseSchema.refine(
  data => new Date(data.endTime) > new Date(data.startTime),
  {
    message: 'End time must be after start time',
    path: ['endTime'],
  }
);

// Update auction schema - all fields optional
const updateAuctionSchema = auctionBaseSchema.partial().refine(
  data => {
    if (data.startTime && data.endTime) {
      return new Date(data.endTime) > new Date(data.startTime);
    }
    return true;
  },
  {
    message: 'End time must be after start time',
    path: ['endTime'],
  }
);

// Status update schema
const updateStatusSchema = z.object({
  status: z.enum(['DRAFT', 'SCHEDULED', 'ACTIVE', 'ENDED', 'CANCELLED', 'SOLD']),
});

// Query params schema
const querySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
  sort: z.string().optional(),
  status: z.enum(['DRAFT', 'SCHEDULED', 'ACTIVE', 'ENDED', 'CANCELLED', 'SOLD']).optional(),
  categoryId: z.string().uuid('Invalid category ID').optional(),
  minPrice: z.string().regex(/^\d+$/).transform(Number).optional(),
  maxPrice: z.string().regex(/^\d+$/).transform(Number).optional(),
  search: z.string().optional(),
});

module.exports = {
  createAuctionSchema,
  updateAuctionSchema,
  updateStatusSchema,
  querySchema,
};