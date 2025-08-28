"use client";

import { Badge } from "@/components/ui/badge";
import { useUserStore } from "@/store/user.store";

export default function TwoFABadge() {
  const user = useUserStore((state) => state.user);
  const twoFactorEnabled = user?.twoFactorEnabled || false;

  return (
    <Badge
      variant={twoFactorEnabled ? "default" : "secondary"}
      className={
        twoFactorEnabled
          ? "bg-constructive text-white"
          : "bg-warning text-warning-text"
      }
    >
      {twoFactorEnabled ? "Enabled" : "Not Enabled"}
    </Badge>
  );
}
