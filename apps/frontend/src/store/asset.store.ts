import { create } from "zustand";
import {
  AssetGroup,
  Asset,
  AssetType,
  AssetFormData,
  mockDataGetAllAssetsOfUser,
} from "@/types/asset.type";

interface AssetStore {
  assetGroups: AssetGroup[];
  getAllAssets: () => void;
  addAsset: (assetType: AssetType, formData: AssetFormData[AssetType]) => void;
  updateAsset: (
    assetType: AssetType,
    assetId: number,
    formData: AssetFormData[AssetType]
  ) => void;
  deleteAsset: (assetType: AssetType, assetId: number) => void;
}

export const useAssetStore = create<AssetStore>((set, get) => ({
  assetGroups: [],
  getAllAssets: () => {
    // Simulate API call
    console.log("API: get all assets");
    set({ assetGroups: mockDataGetAllAssetsOfUser });
  },
  addAsset: (assetType, formData) => {
    // Simulate API call
    console.log("API: add asset", { assetType, formData });

    // (RESPONSE FROM API) : Create Asset object from form data
    const newAsset: Asset = {
      id: 1234, // Generate temporary ID
      name:
        assetType === "cash"
          ? (formData as AssetFormData["cash"]).cashType
          : (
              formData as
                | AssetFormData["crypto"]
                | AssetFormData["stock"]
                | AssetFormData["realEstate"]
                | AssetFormData["exotic"]
            ).name || "New Asset",
      type: assetType,
      color: "blue", // Default color
      split: 0, // Default split
      value: 0, // Default value
      pnl: "$0", // Default PnL
      // Asset-specific fields - safely access based on type
      ...formData,
      // Database fields
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: 1, // TODO: Get from auth context
    };

    // Update store
    set((state) => ({
      assetGroups: state.assetGroups.map((group) =>
        group.type === assetType
          ? { ...group, assets: [...group.assets, newAsset] }
          : group
      ),
    }));
  },
  updateAsset: (assetType, assetId, formData) => {
    // Simulate API call
    console.log("API: update asset", formData);

    // (RESPONSE FROM API) : Update Asset object from form data

    // Update store
    set((state) => ({
      assetGroups: state.assetGroups.map((group) =>
        group.type === assetType
          ? {
              ...group,
              assets: group.assets.map((asset) =>
                assetId === asset.id
                  ? {
                      ...asset,
                      ...formData,
                    }
                  : asset
              ),
            }
          : group
      ),
    }));
  },
  deleteAsset: (assetType, assetId) => {
    // Simulate API call
    console.log("API: delete asset", assetId);

    // Update store
    set((state) => ({
      assetGroups: state.assetGroups.map((group) =>
        group.type === assetType
          ? {
              ...group,
              assets: group.assets.filter((asset) => asset.id !== assetId),
            }
          : group
      ),
    }));
  },
}));
