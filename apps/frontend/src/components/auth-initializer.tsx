"use client";

import { useEffect, useState } from "react";
import { UserApi } from "@/api/user.api";
import { useUserStore } from "@/store/user.store";
import { usePathname, useRouter } from "next/navigation";
import { useAccountStore } from "@/store/account.store";

const skipRoutes = [
  "/",
  "/login",
  "/signup",
  "/password/forgotten",
  "/password/reset",
  "/verify-email",
  "/resend-verification",
  "/auth/google/callback",
];

export function AuthInitializer() {
  const pathname = usePathname();
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);
  const setAccounts = useAccountStore((state) => state.setAccounts);
  const setActiveAccount = useAccountStore((state) => state.setActiveAccount);
  const [isAuthChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    // Skip authentication check for public pages
    if (skipRoutes.includes(pathname)) {
      setAuthChecked(true);
      return;
    }

    const userApi = new UserApi();
    const fetchUser = async () => {
      try {
        const res = await userApi.get();
        setUser(res.user);
        if (res.accounts) {
          setAccounts(res.accounts);
          // To avoid overwrite, only set activeAccount if it's null
          // or if the current activeAccount is not in the accounts array anymore (deleted)
          const currentActiveAccount = useAccountStore.getState().activeAccount;
          if (
            !currentActiveAccount ||
            !res.accounts.find((acc) => acc.id === currentActiveAccount.id)
          ) {
            setActiveAccount(res.accounts[0]);
          }
        }
        if (pathname === "/login" || pathname === "/signup") {
          router.replace("/portfolio");
        }
      } catch (error) {
        console.error("User not authenticated or fetch failed:", error);
      } finally {
        setAuthChecked(true);
      }
    };
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  if (!isAuthChecked) return null;

  return null;
}
