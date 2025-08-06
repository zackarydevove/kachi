import { AccountApi } from "@/api/account.api";
import { Account, AccountForm } from "@/types/account.type";
import { create } from "zustand";

interface AccountState {
  activeAccount: Account | null;
  accounts: Account[];
  setActiveAccount: (account: AccountState["activeAccount"]) => void;
  setAccounts: (accounts: AccountState["accounts"]) => void;
  createAccount: (formData: AccountForm) => void;
}

export const useAccountStore = create<AccountState>((set) => ({
  activeAccount: null,
  accounts: [],
  setActiveAccount: (activeAccount) => set({ activeAccount }),
  setAccounts: (accounts) => set({ accounts }),
  createAccount: async (formData: AccountForm) => {
    try {
      const accountApi = new AccountApi();
      const { newAccount } = await accountApi.create(formData);
      console.log("newAccount", newAccount);
      set((state) => ({ accounts: [...state.accounts, newAccount] }));
    } catch (error) {
      console.error("Error in createAccount store:", error);
      throw error; // Re-throw the error so it can be handled in the component
    }
  },
}));
