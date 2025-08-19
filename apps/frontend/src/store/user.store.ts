import { User } from "@/types/user.type";
import { create } from "zustand";
import { useAccountStore } from "./account.store";
import { useAssetStore } from "./asset.store";
import { UserApi } from "@/api/user.api";

interface UserState {
  user: User | null;
  setUser: (user: UserState["user"]) => void;
  deleteUser: () => void;
  logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  deleteUser: async () => {
    const userApi = new UserApi();

    const res = await userApi.delete();

    console.log("Delete User Response", res);

    const resetAccount = useAccountStore.getState().reset;
    const resetAsset = useAssetStore.getState().reset;

    resetAccount();
    resetAsset();
    set({ user: null });
  },
  logout: () => set({ user: null }),
}));
