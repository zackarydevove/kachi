// Asset types (categories)
export type AssetType = "crypto" | "stock" | "realEstate" | "cash" | "exotic";

// Labels for asset types
export const assetTypeLabels: Record<AssetType, string> = {
  crypto: "Crypto",
  realEstate: "Real Estate",
  stock: "Stocks",
  cash: "Cash",
  exotic: "Exotic Assets",
};

// Database-friendly asset interface
export interface Asset {
  id: number;
  name: string;
  type: AssetType; // The asset type (e.g., "crypto", "cash")
  color: string;
  split: number;
  value: number;
  pnl: string;
  // Asset-specific fields
  unitPrice?: string;
  quantity?: string;
  address?: string;
  realEstateType?: string;
  category?: string;
  cost?: string;
  cashType?: string;
  currency?: string;
  buyingPrice?: string;
  currentPrice?: string;
  // Database fields
  createdAt: Date;
  updatedAt: Date;
  userId: number;
}

// Asset group interface (groups assets by type)
export interface AssetGroup {
  id: number;
  name: string;
  type: AssetType; // The group type (e.g., "crypto", "cash")
  color: string;
  split: number;
  value: number;
  pnl: string;
  assets: Asset[]; // Array of assets in this group
  // Database fields
  createdAt: Date;
  updatedAt: Date;
  userId: number;
}

// Form data structure for each asset type
export interface AssetFormData {
  crypto: {
    name: string;
    unitPrice: string;
    quantity: string;
  };
  stock: {
    name: string;
    unitPrice: string;
    quantity: string;
  };
  realEstate: {
    name: string;
    address: string;
    realEstateType: string;
    category: string;
    cost: string;
  };
  cash: {
    cashType: string;
    currency: string;
    quantity: string;
  };
  exotic: {
    name: string;
    quantity: string;
    buyingPrice: string;
    currentPrice: string;
  };
}

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

// API response types
export interface AssetApiResponse {
  success: boolean;
  data?: AssetGroup[] | Asset;
  error?: string;
}

// Create asset request
export interface CreateAssetRequest {
  type: AssetType;
  formData: AssetFormData[AssetType];
  userId: string;
}

// Update asset request
export interface UpdateAssetRequest {
  assetId: string;
  type: AssetType;
  formData: AssetFormData[AssetType];
  userId: string;
}

// Delete asset request
export interface DeleteAssetRequest {
  assetId: string;
  userId: string;
}

// Portfolio summary for dashboard
export interface PortfolioSummary {
  totalValue: number;
  totalPnL: string;
  assetCount: number;
  groups: AssetGroup[];
}

// MOCK DATA

// GET ALL
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
