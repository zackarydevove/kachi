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

// Base asset schema
export const assetSchema = z.object({
  id: z.number(),
  accountId: z.number(),
  name: z.string(),
  type: assetTypeSchema,
  // Database fields
  createdAt: z.string().optional(),
  updatedAt: z.string().optional().nullable(),
  deletedAt: z.string().optional().nullable(),
});

// Form data schema collection
export const assetFormDataSchema = z.object({
  type: assetTypeSchema.nullable(), // Nullable just for the Add Asset Dialog
  name: z
    .string()
    .min(1, "Name is required")
    .regex(/^[a-zA-Z0-9 ]+$/, "Only letters, numbers, and spaces are allowed."),
  value: z.number().min(1, "Value is required"),
});

export const graphSnapshotsSchema = z.object({
  date: z.string(),
  networth: z.number(),
  crypto: z.number(),
  realEstate: z.number(),
  stock: z.number(),
  cash: z.number(),
  exotic: z.number(),
});

const assetSplitSchema = assetSchema.merge(
  z.object({
    split: z.number(),
    pnl: z.number(),
    value: z.number(),
  })
);

const typeSplitSchema = z.object({
  value: z.number(),
  split: z.number(),
  pnl: z.number(),
  assets: z.array(assetSplitSchema),
});

export const splitSchema = z.record(assetTypeSchema, typeSplitSchema);

export const splitAndSnapshotsSchema = z.object({
  split: splitSchema,
  snapshots: z.array(graphSnapshotsSchema),
});
