import { z } from "zod";

// Asset type enum schema
export const assetTypeSchema = z.enum([
  "crypto",
  "stock",
  "realEstate",
  "cash",
  "exotic",
]);

// Base asset schema
export const assetSchema = z.object({
  id: z.number(),
  name: z.string(),
  type: assetTypeSchema,
  color: z.string(),
  split: z.number(),
  value: z.number(),
  pnl: z.string(),
  // Asset-specific optional fields
  unitPrice: z.string().optional(),
  quantity: z.string().optional(),
  address: z.string().optional(),
  realEstateType: z.string().optional(),
  category: z.string().optional(),
  cost: z.string().optional(),
  cashType: z.string().optional(),
  currency: z.string().optional(),
  buyingPrice: z.string().optional(),
  currentPrice: z.string().optional(),
  // Database fields
  createdAt: z.date(),
  updatedAt: z.date(),
  userId: z.number(),
});

// Asset group schema
export const assetGroupSchema = z.object({
  id: z.number(),
  name: z.string(),
  type: assetTypeSchema,
  color: z.string(),
  split: z.number(),
  value: z.number(),
  pnl: z.string(),
  assets: z.array(assetSchema),
  // Database fields
  createdAt: z.date(),
  updatedAt: z.date(),
  userId: z.number(),
});

// Form data schemas for each asset type
export const cryptoFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  unitPrice: z.string().min(1, "Unit price is required"),
  quantity: z.string().min(1, "Quantity is required"),
});

export const stockFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  unitPrice: z.string().min(1, "Unit price is required"),
  quantity: z.string().min(1, "Quantity is required"),
});

export const realEstateFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  address: z.string().min(1, "Address is required"),
  realEstateType: z.string().min(1, "Real estate type is required"),
  category: z.string().min(1, "Category is required"),
  cost: z.string().min(1, "Cost is required"),
});

export const cashFormSchema = z.object({
  cashType: z.string().min(1, "Cash type is required"),
  currency: z.string().min(1, "Currency is required"),
  quantity: z.string().min(1, "Quantity is required"),
});

export const exoticFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  quantity: z.string().min(1, "Quantity is required"),
  buyingPrice: z.string().min(1, "Buying price is required"),
  currentPrice: z.string().min(1, "Current price is required"),
});

// Form data schema collection
export const assetFormDataSchema = z.object({
  crypto: cryptoFormSchema,
  stock: stockFormSchema,
  realEstate: realEstateFormSchema,
  cash: cashFormSchema,
  exotic: exoticFormSchema,
});
