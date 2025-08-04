"use client";

import { useEffect, useState } from "react";
import { UserApi } from "@/services/api/user.api";
import { useUserStore } from "@/store/user.store";
import { usePathname, useRouter } from "next/navigation";

// Check is User is allowed (has accessToken), to do so we will try to GET /user
// if got user, let him go on the page
// if 401 (accessToken expired or doesnt't exist), the abstract api class will catch it and try to /refresh-token
// if /refresh-token worked, it will give a new access token and retry the GET /user
// if not it will return to /login
// but you can't try GET /user on /login and /signup or it will be infinite loop, what to do in that case ? (case where user already has valid access or refresh tokens so he doesn't have to login again)
export function AuthInitializer() {
  const pathname = usePathname();
  const userApi = new UserApi();
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);
  const [isAuthChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await userApi.getUser();
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
