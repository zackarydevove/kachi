import { z } from "zod";

// Asset type enum schema
export const assetTypeSchema = z.enum([
  "networth",
  "crypto",
  "stock",
  "realEstate",
  "cash",
  "exotic",
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
  type: assetTypeSchema.nullable(), // Nullable just for the Add Asset Dialog
  name: z.string(),
  value: z.number(),
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
  })
);

const assetTypeSplitSchema = z.object({
  value: z.number(),
  split: z.number(),
  pnl: z.string(),
  assets: z.array(assetWithSplitAndPnlSchema),
});

// 5. Dynamic split schema — no repeating keys
export const splitSchema = z.record(assetTypeSchema, assetTypeSplitSchema);
