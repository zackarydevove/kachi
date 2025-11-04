import { AccountApi } from "@/api/account.api";
import { Account, AccountForm } from "@/types/account.type";
import { create } from "zustand";
import { toast } from "sonner";

interface AccountState {
  activeAccount: Account | null;
  accounts: Account[];
  setActiveAccount: (account: AccountState["activeAccount"]) => void;
  setAccounts: (accounts: AccountState["accounts"]) => void;
  createAccount: (formData: AccountForm) => void;
  editAccount: (accountId: number, formData: AccountForm) => void;
  deleteAccount: (accountId: number) => void;
  reset: () => void;
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
      set((state) => ({ accounts: [...state.accounts, newAccount] }));
      toast.success("Account created successfully");
    } catch (error) {
      console.error("Error in createAccount store:", error);
      throw error; // Re-throw the error so it can be handled in the component
    }
  },
  editAccount: async (accountId: number, formData: AccountForm) => {
    try {
      const accountApi = new AccountApi();
      const { updatedAccount } = await accountApi.update(accountId, formData);
      set((state) => ({
        accounts: state.accounts.map((account) =>
          account.id === accountId ? updatedAccount : account
        ),
        activeAccount:
          state.activeAccount?.id === accountId
            ? updatedAccount
            : state.activeAccount,
      }));
      toast.success("Account updated successfully");
    } catch (error) {
      console.error("Error in editAccount store:", error);
      throw error; // Re-throw the error so it can be handled in the component
    }
  },
  deleteAccount: async (accountId: number) => {
    try {
      const accountApi = new AccountApi();
      await accountApi.delete(accountId);
      set((state) => {
        const filteredAccounts = state.accounts.filter(
          (account) => account.id !== accountId
        );
        return {
          accounts: filteredAccounts,
          activeAccount:
            state.activeAccount?.id === accountId
              ? filteredAccounts[0] || null
              : state.activeAccount,
        };
      });
      toast.success("Account deleted successfully");
    } catch (error) {
      console.error("Error in deleteAccount store:", error);
      throw error; // Re-throw the error so it can be handled in the component
    }
  },
  reset: () => {
    set({
      activeAccount: null,
      accounts: [],
    });
  },
}));
