import { create } from "zustand";

interface UserState {
  user: {
    id: number;
    email: string;
    account: { id: number; name: string };
  } | null;
  setUser: (user: UserState["user"]) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}));
