import { create } from "zustand";
import {
  AssetFormData,
  AssetSnapshot,
  AssetSplit,
  mockDataGetAllAssetsOfUser,
} from "@/types/asset.type";

interface AssetStore {
  snapshots: AssetSnapshot[];
  split: AssetSplit;
  getAllAssets: () => void;
  addAsset: (formData: AssetFormData) => void;
  editAsset: (assetId: number, formData: AssetFormData) => void;
  deleteAsset: (assetId: number) => void;
}

export const useAssetStore = create<AssetStore>((set, get) => ({
  snapshots: [],
  split: {
    networth: {
      value: 0,
      split: 0,
      pnl: "$0",
      assets: [],
    },
    crypto: {
      value: 0,
      split: 0,
      pnl: "$0",
      assets: [],
    },
    realEstate: {
      value: 0,
      split: 0,
      pnl: "$0",
      assets: [],
    },
    stock: {
      value: 0,
      split: 0,
      pnl: "$0",
      assets: [],
    },
    cash: {
      value: 0,
      split: 0,
      pnl: "$0",
      assets: [],
    },
    exotic: {
      value: 0,
      split: 0,
      pnl: "$0",
      assets: [],
    },
  },
  getAllAssets: () => {
    console.log("API: get all assets");
    set({
      snapshots: mockDataGetAllAssetsOfUser.snapshots,
      split: mockDataGetAllAssetsOfUser.split,
    });
  },
  addAsset: (formData) => {
    // const accountId = ...;
    console.log("API: add asset", { formData });

    // const res = ...;

    // // Update store
    // set((state) => ({
    //   // Modify only last snapshot: snapshot[lastIndex] with updated data
    //   snapshots: ...,
    //   // Modify split entirely, because adding an asset changes the split
    //   split: res.split,
    // }));
  },
  editAsset: (assetId, formData) => {
    // const accountId = ...;
    console.log("API: add asset", { assetId, formData });

    // const res = ...;

    // // Update store
    // set((state) => ({
    //   // Modify only last snapshot: snapshot[lastIndex] with updated data
    //   snapshots: ...,
    //   // Modify split entirely, because editing an asset changes the split
    //   split: res.split,
    // }));
  },
  deleteAsset: (assetId) => {
    // const accountId = ...;
    console.log("API: delete asset", assetId);

    // const res = ...;

    // // Update store
    // set((state) => ({
    //   // Modify only last snapshot: snapshot[lastIndex] with updated data
    //   snapshots: ...,
    //   // Modify split entirely, because deleting an asset changes the split
    //   split: res.split,
    // }));
  },
}));
