"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { InputOTP } from "@/components/ui/input-otp";
import { TwoFactorApi } from "@/api/two-factor.api";
import { useUserStore } from "@/store/user.store";
import { Loader2Icon } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

type DialogStep = "qr-code" | "otp-input";

export default function Enable2FADialog() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<DialogStep>("qr-code");
  const [qrCode, setQrCode] = useState<string>("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const user = useUserStore((state) => state.user);
  const updateTwoFactorStatus = useUserStore(
    (state) => state.updateTwoFactorStatus
  );
  const twoFactorApi = new TwoFactorApi();
  const twoFactorEnabled = user?.twoFactorEnabled || false;

  const handleGenerate2FA = async () => {
    if (qrCode) return;

    try {
      setLoading(true);
      setError(null);

      const response = await twoFactorApi.generate2FA();
      setQrCode(response.qrCode);
    } catch (err: unknown) {
      setError("Failed to generate 2FA setup. Please try again.");
      console.error("2FA generation error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    setStep("otp-input");
    setError(null);
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      setError("Please enter a 6-digit OTP code");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await twoFactorApi.verify2FA({ otp });

      // Update user store with 2FA enabled
      updateTwoFactorStatus(true);

      // Show success message
      toast.success("2FA has been successfully enabled!");

      // Close dialog and reset state
      handleClose();
    } catch (err: unknown) {
      setError("Invalid OTP code. Please try again.");
      console.error("2FA verification error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setStep("qr-code");
    setQrCode("");
    setOtp("");
    setError(null);
  };

  const renderContent = () => {
    switch (step) {
      case "qr-code":
        return (
          <>
            <DialogHeader>
              <DialogTitle>Scan QR Code</DialogTitle>
              <DialogDescription>
                Open your favorite Authenticator App and scan this QR code.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              {!loading && qrCode ? (
                <div className="flex justify-center">
                  <Image
                    src={qrCode}
                    width={192}
                    height={192}
                    alt="2FA QR Code"
                    className="w-48 h-48 border rounded-lg"
                  />
                </div>
              ) : (
                <Loader2Icon className="animate-spin" />
              )}
              <p className="text-sm text-muted-foreground text-center">
                After scanning the QR code, click Continue to enter the
                verification code.
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handleContinue}>Continue</Button>
            </DialogFooter>
          </>
        );

      case "otp-input":
        return (
          <>
            <DialogHeader>
              <DialogTitle>Enter Verification Code</DialogTitle>
              <DialogDescription>
                Enter the 6-digit code from your authenticator app.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <InputOTP
                value={otp}
                onChange={setOtp}
                length={6}
                disabled={loading}
              />
              {error && (
                <p className="text-sm text-destructive mt-1">{error}</p>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                onClick={handleVerifyOTP}
                disabled={loading || otp.length !== 6}
              >
                {loading ? "Verifying..." : "Verify & Enable"}
              </Button>
            </DialogFooter>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild onClick={handleGenerate2FA}>
        <Button variant="outline" disabled={twoFactorEnabled}>
          {twoFactorEnabled ? "2FA Enabled" : "Enable 2FA (recommended)"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
}
