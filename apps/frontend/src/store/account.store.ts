import { AccountApi } from "@/api/account.api";
import { Account, AccountForm } from "@/types/account.type";
import { create } from "zustand";

interface AccountState {
  activeAccount: Account | null;
  accounts: Account[];
  setActiveAccount: (account: AccountState["activeAccount"]) => void;
  setAccounts: (accounts: AccountState["accounts"]) => void;
  createAccount: (formData: AccountForm) => void;
  editAccount: (accountId: number, formData: AccountForm) => void;
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
  editAccount: async (accountId: number, formData: AccountForm) => {
    try {
      const accountApi = new AccountApi();
      const { updatedAccount } = await accountApi.update(accountId, formData);
      console.log("updatedAccount", updatedAccount);
      set((state) => ({
        accounts: state.accounts.map(
          (
            account // TODO: Do a map with key = id instead, it will be easier to update
          ) => (account.id === accountId ? updatedAccount : account)
        ),
      }));
    } catch (error) {
      console.error("Error in editAccount store:", error);
      throw error; // Re-throw the error so it can be handled in the component
    }
  },
}));
