import {
  assetFormDataSchema,
  assetSchema,
  assetTypeSchema,
  graphSnapshotsSchema,
  splitAndSnapshotsSchema,
  splitSchema,
} from "@/schemas/asset.schema";
import z from "zod";

// Inferred types
export type AssetType = z.infer<typeof assetTypeSchema>;
export type Asset = z.infer<typeof assetSchema>;
export type AssetFormData = z.infer<typeof assetFormDataSchema>;
export type AssetSnapshot = z.infer<typeof graphSnapshotsSchema>;
export type AssetSplit = z.infer<typeof splitSchema>;
export type AssetsSplitAndSnapshot = z.infer<typeof splitAndSnapshotsSchema>;

// API request/response types
export type AssetCreateRequest = AssetFormData & { accountId: number };
export type AssetCreateResponse = AssetsSplitAndSnapshot;
export type AssetGetAllResponse = AssetsSplitAndSnapshot;
export type AssetUpdateRequest = AssetFormData & { accountId: number };
export type AssetUpdateResponse = AssetsSplitAndSnapshot;
export type AssetDeleteRequest = { accountId: number };
export type AssetDeleteResponse = AssetsSplitAndSnapshot;

// Labels for asset types
export const assetTypeLabels: Record<AssetType, string> = {
  networth: "Net Worth",
  crypto: "Crypto",
  realEstate: "Real Estate",
  stock: "Stocks",
  cash: "Cash",
  exotic: "Exotic Assets",
};

export const assetTypeColor: Record<AssetType, string> = {
  networth: "#000000", // black
  crypto: "#0000FF", // blue
  stock: "#008000", // green
  realEstate: "#FF0000", // red
  cash: "#FFFF00", // yellow
  exotic: "#800080", // purple
};
