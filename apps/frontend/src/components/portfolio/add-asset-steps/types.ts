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
    type: string;
    category: string;
    cost: string;
  };
  cash: {
    type: string;
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
    type: "",
    category: "",
    cost: "",
  },
  cash: {
    type: "",
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

export type AssetType = keyof AssetFormData;

export const assetTypeLabels: Record<string, string> = {
  crypto: "Cryptocurrency",
  realEstate: "Real Estate",
  stock: "Stocks",
  cash: "Cash",
  exotic: "Exotic Assets",
};
