import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function Security() {
  return (
    <div className="flex flex-col gap-7 pl-2 pt-6 pr-10 flex-1">
      <span className="text-2xl">Security</span>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <span>Password</span>
          {/* Dialog button here to open modal */}
          <Button variant="outline">Set your password</Button>
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
          {/* Dialog button here to open modal */}
          <Button variant="outline">Enable 2FA (recommended)</Button>
        </div>
      </div>
    </div>
  );
}
