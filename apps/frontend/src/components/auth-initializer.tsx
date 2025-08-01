"use client";

import { useEffect } from "react";
import { UserApi } from "@/services/api/user.api";
import { useUserStore } from "@/store/user.store";
import { usePathname } from "next/navigation";

export function AuthInitializer() {
  const pathname = usePathname();
  const userApi = new UserApi();
  const setUser = useUserStore((state) => state.setUser);

  // Skip AuthInitializer on /login and /signup
  const shouldInitializeAuth =
    !pathname?.startsWith("/login") && !pathname?.startsWith("/signup");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await userApi.getUser();
        setUser(res.user);
      } catch (error) {
        console.error("User not authenticated or fetch failed:", error);
      }
    };

    if (shouldInitializeAuth) fetchUser();
  }, []);

  return null;
}
