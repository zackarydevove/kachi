import { z } from 'zod';

// Asset type enum schema
export const assetTypeSchema = z.enum([
  'networth',
  'crypto',
  'stock',
  'realEstate',
  'cash',
  'exotic',
]);

export const splitAndPnl = z.object({});

// Base asset schema
export const assetSchema = z.object({
  id: z.number(),
  accountId: z.number(),
  name: z.string(),
  type: assetTypeSchema,
  value: z.number(),
  // Database fields
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Form data schema collection
export const assetFormDataSchema = z.object({
  type: assetTypeSchema,
  name: z
    .string()
    .min(1, 'Name is required')
    .regex(/^[a-zA-Z0-9 ]+$/, 'Only letters, numbers, and spaces are allowed.'),
  value: z.number().min(1, 'Value is required'),
});

export const snapshotsSchema = z.object({
  date: z.date(),
  networth: z.number(),
  crypto: z.number(),
  realEstate: z.number(),
  stock: z.number(),
  cash: z.number(),
  exotic: z.number(),
});

const assetWithSplitAndPnlSchema = assetSchema.merge(
  z.object({
    split: z.number(),
    pnl: z.string(),
  }),
);

const assetTypeSplitSchema = z.object({
  value: z.number(),
  split: z.number(),
  pnl: z.string(),
  assets: z.array(assetWithSplitAndPnlSchema),
});

export const splitSchema = z.record(assetTypeSchema, assetTypeSplitSchema);

export const assetRequestSchema = assetFormDataSchema.merge(
  z.object({
    accountId: z.number().min(1, 'Account ID is required'),
  }),
);
