import { create } from "zustand";
import { AssetFormData, AssetSnapshot, AssetSplit } from "@/types/asset.type";
import { AssetApi } from "@/api/asset.api";
import { useAccountStore } from "./account.store";
import { toast } from "sonner";

interface AssetStore {
  snapshots: AssetSnapshot[];
  split: AssetSplit;
  getAllAssets: () => Promise<void>;
  addAsset: (formData: AssetFormData) => Promise<void>;
  editAsset: (assetId: number, formData: AssetFormData) => Promise<void>;
  deleteAsset: (assetId: number) => Promise<void>;
  reset: () => void;
}

const assetApi = new AssetApi();

const initialSplit = {
  networth: {
    value: 0,
    split: 0,
    pnl: 0,
    assets: [],
  },
  crypto: {
    value: 0,
    split: 0,
    pnl: 0,
    assets: [],
  },
  realEstate: {
    value: 0,
    split: 0,
    pnl: 0,
    assets: [],
  },
  stock: {
    value: 0,
    split: 0,
    pnl: 0,
    assets: [],
  },
  cash: {
    value: 0,
    split: 0,
    pnl: 0,
    assets: [],
  },
  exotic: {
    value: 0,
    split: 0,
    pnl: 0,
    assets: [],
  },
};

export const useAssetStore = create<AssetStore>((set, get) => ({
  snapshots: [],
  split: initialSplit,
  getAllAssets: async () => {
    const accountId = useAccountStore.getState().activeAccount?.id;
    if (!accountId) {
      throw new Error("Account ID is required");
    }

    const res = await assetApi.getSplitAndSnapshotsByAccountId(accountId);

    set({
      snapshots: res.snapshots,
      split: res.split,
    });
  },
  addAsset: async (formData) => {
    const accountId = useAccountStore.getState().activeAccount?.id;
    if (!accountId) {
      throw new Error("Account ID is required");
    }

    const res = await assetApi.create({
      ...formData,
      accountId: accountId,
    });

    toast.success("Asset created successfully!");

    set({
      snapshots: res.snapshots,
      split: res.split,
    });
  },
  editAsset: async (assetId, formData) => {
    const accountId = useAccountStore.getState().activeAccount?.id;
    if (!accountId) {
      throw new Error("Account ID is required");
    }

    const res = await assetApi.update(assetId, {
      ...formData,
      accountId: accountId,
    });

    toast.success("Asset updated successfully!");

    set({
      snapshots: res.snapshots,
      split: res.split,
    });
  },
  deleteAsset: async (assetId) => {
    const accountId = useAccountStore.getState().activeAccount?.id;
    if (!accountId) {
      throw new Error("Account ID is required");
    }

    const res = await assetApi.delete(assetId, { accountId: accountId });

    toast.success("Asset deleted successfully!");

    set({
      snapshots: res.snapshots,
      split: res.split,
    });
  },
  reset: () => {
    set({
      snapshots: [],
      split: initialSplit,
    });
  },
}));
