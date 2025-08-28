"use client";

import { useEffect, useState } from "react";
import { UserApi } from "@/api/user.api";
import { useUserStore } from "@/store/user.store";
import { usePathname, useRouter } from "next/navigation";
import { useAccountStore } from "@/store/account.store";

export function AuthInitializer() {
  const pathname = usePathname();
  const userApi = new UserApi();
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);
  const setAccounts = useAccountStore((state) => state.setAccounts);
  const setActiveAccount = useAccountStore((state) => state.setActiveAccount);
  const [isAuthChecked, setAuthChecked] = useState(false);

  const skipRoutes = [
    "/login",
    "/signup",
    "/password/forgotten",
    "/password/reset",
    "/verify-email",
    "/resend-verification",
  ];

  useEffect(() => {
    // Skip authentication check for public pages
    if (skipRoutes.includes(pathname)) {
      setAuthChecked(true);
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await userApi.get();
        setUser(res.user);
        if (res.accounts) {
          setAccounts(res.accounts);
          setActiveAccount(res.accounts[0]);
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
  }, [pathname]);

  if (!isAuthChecked) return null;

  return null;
}
