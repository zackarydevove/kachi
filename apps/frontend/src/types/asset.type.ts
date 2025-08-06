import {
  assetGroupSchema,
  assetSchema,
  assetTypeSchema,
  cashFormSchema,
  cryptoFormSchema,
  exoticFormSchema,
  realEstateFormSchema,
  stockFormSchema,
} from "@/schemas/asset.schema";
import z from "zod";

// Inferred types
export type AssetType = z.infer<typeof assetTypeSchema>;
export type Asset = z.infer<typeof assetSchema>;
export type AssetGroup = z.infer<typeof assetGroupSchema>;

// Form data types
type CryptoFormData = z.infer<typeof cryptoFormSchema>;
type StockFormData = z.infer<typeof stockFormSchema>;
type RealEstateFormData = z.infer<typeof realEstateFormSchema>;
type CashFormData = z.infer<typeof cashFormSchema>;
type ExoticFormData = z.infer<typeof exoticFormSchema>;

export type AssetFormData = {
  crypto: CryptoFormData;
  stock: StockFormData;
  realEstate: RealEstateFormData;
  cash: CashFormData;
  exotic: ExoticFormData;
};

// API request/response types
export type AssetCreateRequest = AssetFormData[AssetType];
export type AssetCreateResponse = Asset;
export type AssetGetAllResponse = AssetGroup[];
export type AssetUpdateRequest = AssetFormData[AssetType];
export type AssetUpdateResponse = Asset;
export type AssetDeleteResponse = { id: number };

// Labels for asset types
export const assetTypeLabels: Record<AssetType, string> = {
  crypto: "Crypto",
  realEstate: "Real Estate",
  stock: "Stocks",
  cash: "Cash",
  exotic: "Exotic Assets",
};

// Initial form data using schema-inferred types
export const initialFormData: AssetFormData = {
  crypto: {
    name: "",
    unitPrice: "",
    quantity: "",
  },
  stock: {
    name: "",
    unitPrice: "",
    quantity: "",
  },
  realEstate: {
    name: "",
    address: "",
    realEstateType: "",
    category: "",
    cost: "",
  },
  cash: {
    cashType: "",
    currency: "",
    quantity: "",
  },
  exotic: {
    name: "",
    quantity: "",
    buyingPrice: "",
    currentPrice: "",
  },
};

// MOCK DATA TODO: DELETE
export const mockDataGetAllAssetsOfUser: AssetGroup[] = [
  {
    id: 1,
    name: "Crypto",
    type: "crypto",
    color: "blue",
    split: 23,
    value: 123,
    pnl: "$1,450",
    assets: [
      {
        id: 1,
        name: "BTC",
        type: "crypto",
        color: "blue",
        split: 80,
        value: 123,
        pnl: "$1,000",
        unitPrice: "12",
        quantity: "12",
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
        userId: 1,
      },
      {
        id: 2,
        name: "ETH",
        type: "crypto",
        color: "blue",
        split: 20,
        value: 123,
        pnl: "$450",
        unitPrice: "12",
        quantity: "12",
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
        userId: 1,
      },
    ],
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    userId: 1,
  },
  {
    id: 2,
    name: "Stocks",
    type: "stock",
    color: "green",
    split: 37,
    value: 123,
    pnl: "$2,450",
    assets: [
      {
        id: 3,
        name: "TSLA",
        type: "stock",
        color: "green",
        split: 80,
        value: 123,
        pnl: "$1,000",
        unitPrice: "12",
        quantity: "12",
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
        userId: 1,
      },
      {
        id: 4,
        name: "MSCI",
        type: "stock",
        color: "green",
        split: 20,
        value: 123,
        pnl: "$450",
        unitPrice: "12",
        quantity: "12",
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
        userId: 1,
      },
    ],
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    userId: 1,
  },
  {
    id: 3,
    name: "Real Estate",
    type: "realEstate",
    color: "red",
    split: 40,
    value: 123,
    pnl: "$2,450",
    assets: [
      {
        id: 5,
        name: "Main house",
        type: "realEstate",
        color: "red",
        split: 80,
        value: 123,
        pnl: "$1,000",
        address: "12 St. Robert, LA",
        realEstateType: "Main Property",
        category: "Rental",
        cost: "$123",
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
        userId: 1,
      },
      {
        id: 6,
        name: "Rental",
        type: "realEstate",
        color: "red",
        split: 20,
        value: 123,
        pnl: "$450",
        address: "13 St. Greg, LA",
        realEstateType: "Main Property",
        category: "Rental",
        cost: "$123",
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
        userId: 1,
      },
    ],
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    userId: 1,
  },
  {
    id: 4,
    name: "Cash",
    type: "cash",
    color: "yellow",
    split: 40,
    value: 123,
    pnl: "$2,450",
    assets: [
      {
        id: 7,
        name: "Main account",
        type: "cash",
        color: "yellow",
        split: 80,
        value: 123,
        pnl: "$1,000",
        cashType: "Main account",
        currency: "USD",
        quantity: "12500",
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
        userId: 1,
      },
      {
        id: 8,
        name: "Saving Account",
        type: "cash",
        color: "yellow",
        split: 20,
        value: 123,
        pnl: "$450",
        cashType: "Saving Account",
        currency: "USD",
        quantity: "100500",
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
        userId: 1,
      },
    ],
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    userId: 1,
  },
  {
    id: 5,
    name: "Exotic",
    type: "exotic",
    color: "orange",
    split: 40,
    value: 123,
    pnl: "$2,450",
    assets: [
      {
        id: 9,
        name: "Pokemon",
        type: "exotic",
        color: "orange",
        split: 80,
        value: 123,
        pnl: "$1,000",
        quantity: "100",
        buyingPrice: "$12",
        currentPrice: "$13",
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
        userId: 1,
      },
      {
        id: 10,
        name: "Jordan",
        type: "exotic",
        color: "orange",
        split: 20,
        value: 123,
        pnl: "$450",
        quantity: "3",
        buyingPrice: "$450",
        currentPrice: "$900",
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
        userId: 1,
      },
    ],
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    userId: 1,
  },
];
