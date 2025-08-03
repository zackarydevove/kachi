import Enable2FADialog from "@/components/settings/security/enable-2fa-dialog";
import SetPasswordDialog from "@/components/settings/security/set-password-dialog";
import { Badge } from "@/components/ui/badge";

export default function Page() {
  return (
    <div className="flex flex-col gap-7 pl-2 pt-6 pr-10 flex-1">
      <span className="text-2xl">Security</span>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <span>Password</span>
          <SetPasswordDialog />
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2 items-center">
            <span>Two-Factor Authentication (2FA)</span>
            <Badge
              variant="secondary"
              className="bg-yellow-100 text-yellow-800"
            >
              Not Enabled
            </Badge>
          </div>
          <Enable2FADialog />
        </div>
      </div>
    </div>
  );
}
