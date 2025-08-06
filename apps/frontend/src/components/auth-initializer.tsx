"use client";

import { useEffect, useState } from "react";
import { UserApi } from "@/api/user.api";
import { useUserStore } from "@/store/user.store";
import { usePathname, useRouter } from "next/navigation";

export function AuthInitializer() {
  const pathname = usePathname();
  const userApi = new UserApi();
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);
  const [isAuthChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await userApi.get();
        setUser(res.user);
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
  }, []);

  if (!isAuthChecked) return null;

  return null;
}
