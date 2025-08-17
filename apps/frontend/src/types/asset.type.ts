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

// MOCK DATA TODO: DELETE
export const mockDataGetAllAssetsOfUser: AssetsSplitAndSnapshot = {
  snapshots: [
    {
      date: "2024-01-01",
      networth: 10000,
      crypto: 3000,
      realEstate: 4000,
      stock: 2000,
      cash: 800,
      exotic: 200,
    },
    {
      date: "2024-02-01",
      networth: 10250,
      crypto: 3200,
      realEstate: 4000,
      stock: 2100,
      cash: 750,
      exotic: 200,
    },
    {
      date: "2024-03-01",
      networth: 9800,
      crypto: 2800,
      realEstate: 4000,
      stock: 1850,
      cash: 750,
      exotic: 400,
    },
  ],
  split: {
    networth: {
      value: 9800,
      split: 100,
      pnl: "-$200", // overall down compared to Jan
      assets: [],
    },
    crypto: {
      value: 2800,
      split: 28.6,
      pnl: "-$400",
      assets: [
        {
          id: 1,
          accountId: 1,
          name: "BTC",
          type: "crypto",
          value: 1800,
          split: 64.3,
          pnl: "-$300",
          createdAt: new Date("2024-01-01"),
          updatedAt: new Date("2024-03-01"),
        },
        {
          id: 2,
          accountId: 1,
          name: "ETH",
          type: "crypto",
          value: 1000,
          split: 35.7,
          pnl: "-$100",
          createdAt: new Date("2024-01-01"),
          updatedAt: new Date("2024-03-01"),
        },
      ],
    },
    realEstate: {
      value: 4000,
      split: 40.8,
      pnl: "$0",
      assets: [
        {
          id: 3,
          accountId: 1,
          name: "Main House",
          type: "realEstate",
          value: 4000,
          split: 100,
          pnl: "$0",
          createdAt: new Date("2024-01-01"),
          updatedAt: new Date("2024-03-01"),
        },
      ],
    },
    stock: {
      value: 1850,
      split: 18.9,
      pnl: "-$250",
      assets: [
        {
          id: 4,
          accountId: 1,
          name: "TSLA",
          type: "stock",
          value: 1000,
          split: 54.1,
          pnl: "-$150",
          createdAt: new Date("2024-01-01"),
          updatedAt: new Date("2024-03-01"),
        },
        {
          id: 5,
          accountId: 1,
          name: "AAPL",
          type: "stock",
          value: 850,
          split: 45.9,
          pnl: "-$100",
          createdAt: new Date("2024-01-01"),
          updatedAt: new Date("2024-03-01"),
        },
      ],
    },
    cash: {
      value: 750,
      split: 7.65,
      pnl: "-$50",
      assets: [
        {
          id: 6,
          accountId: 1,
          name: "Savings Account",
          type: "cash",
          value: 750,
          split: 100,
          pnl: "-$50",
          createdAt: new Date("2024-01-01"),
          updatedAt: new Date("2024-03-01"),
        },
      ],
    },
    exotic: {
      value: 400,
      split: 4.1,
      pnl: "$200",
      assets: [
        {
          id: 7,
          accountId: 1,
          name: "Pokemon Cards",
          type: "exotic",
          value: 250,
          split: 62.5,
          pnl: "$100",
          createdAt: new Date("2024-01-01"),
          updatedAt: new Date("2024-03-01"),
        },
        {
          id: 8,
          accountId: 1,
          name: "Jordan Sneakers",
          type: "exotic",
          value: 150,
          split: 37.5,
          pnl: "$100",
          createdAt: new Date("2024-01-01"),
          updatedAt: new Date("2024-03-01"),
        },
      ],
    },
  },
};
