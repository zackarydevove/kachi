import { UpdatePasswordRequest, User } from "@/types/user.type";
import { create } from "zustand";
import { useAccountStore } from "./account.store";
import { useAssetStore } from "./asset.store";
import { UserApi } from "@/api/user.api";
import { toastUtil } from "@/utils/toast.util";

interface UserState {
  user: User | null;
  setUser: (user: UserState["user"]) => void;
  updateTwoFactorStatus: (enabled: boolean) => void;
  updatePassword: (data: UpdatePasswordRequest) => Promise<void>;
  deleteUser: () => void;
  logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  updateTwoFactorStatus: (enabled) =>
    set((state) => ({
      user: state.user ? { ...state.user, twoFactorEnabled: enabled } : null,
    })),
  updatePassword: async (data: UpdatePasswordRequest) => {
    const userApi = new UserApi();
    await userApi.updatePassword(data);
    set((state) => ({
      user: state.user ? { ...state.user, hasPassword: true } : null,
    }));
    toastUtil.success("Password has been successfully updated!");
  },
  deleteUser: async () => {
    const userApi = new UserApi();

    await userApi.delete();

    const resetAccount = useAccountStore.getState().reset;
    const resetAsset = useAssetStore.getState().reset;

    resetAccount();
    resetAsset();
    set({ user: null });
  },
  logout: () => set({ user: null }),
}));
