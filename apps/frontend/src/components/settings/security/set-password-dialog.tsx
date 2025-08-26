"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useUserStore } from "@/store/user.store";
import { useState } from "react";
import { updatePasswordSchema } from "@/schemas/user.schema";
import { Loader2Icon } from "lucide-react";

export default function SetPasswordDialog() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const updatePassword = useUserStore((state) => state.updatePassword);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    console.log("hello");
    setLoading(true);
    e.preventDefault();
    try {
      if (!checkError()) return;
      await updatePassword({
        currentPassword,
        newPassword,
        confirmNewPassword,
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setIsOpen(false);
    } catch (error: any) {
      console.error(error);
      setError(
        error.response.data.message || "Something went wrong, please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const checkError = () => {
    if (currentPassword === newPassword) {
      setError("New password cannot be the same as the current password.");
      return false;
    }

    if (newPassword !== confirmNewPassword) {
      setError("New password and confirm new password do not match.");
      return false;
    }

    const result = updatePasswordSchema.safeParse({
      currentPassword,
      newPassword,
      confirmNewPassword,
    });

    if (!result.success) {
      const parsed = JSON.parse(result.error.message);
      const message =
        parsed?.[0]?.message || "Something went wrong, please try again.";
      setError(message);
      return false;
    }
    setError(null);
    return true;
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    setError(null);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
  };

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button variant="outline">Set your password</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Set password</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 mt-2">
              <div className="grid gap-3">
                <Label htmlFor="new-password-1">Current password</Label>
                <Input
                  disabled={loading}
                  id="current-password"
                  name="current-password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  type="password"
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="new-password-1">New password</Label>
                <Input
                  disabled={loading}
                  id="new-password"
                  name="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  type="password"
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="confirm-password-1">Confirm new password</Label>
                <Input
                  disabled={loading}
                  id="confirm-password"
                  name="confirm-password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  required
                  type="password"
                />
              </div>
              {error && (
                <p className="text-sm text-destructive mb-4">{error}</p>
              )}
            </div>
            <DialogFooter className="flex">
              <div className="flex gap-2">
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <Loader2Icon className="w-4 h-4 animate-spin" />
                  ) : (
                    "Continue"
                  )}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
