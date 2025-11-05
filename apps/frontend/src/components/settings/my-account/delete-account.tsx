"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "../../ui/button";
import { useState } from "react";
import { useUserStore } from "@/store/user.store";
import { useRouter } from "next/navigation";
import { Loader2Icon } from "lucide-react";

export default function DeleteAccount() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const { deleteUser } = useUserStore();

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteUser();
      setLoading(false);
      router.push("/login");
    } catch (error) {
      console.error("Error deleting user:", error);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 md:gap-7">
      <span className="text-xl md:text-2xl">Delete account</span>
      <div className="flex flex-col gap-6">
        <p className="text-sm text-muted-foreground">
          Deleting your account will permanently remove all your data and cannot
          be undone.
        </p>
        <div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                disabled={loading}
                className="w-full sm:w-auto"
              >
                {loading ? (
                  <Loader2Icon className="animate-spin" />
                ) : (
                  "I want to delete my account"
                )}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove its data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                <AlertDialogCancel
                  disabled={loading}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  disabled={loading}
                  className="w-full sm:w-auto"
                >
                  {loading ? (
                    <Loader2Icon className="animate-spin" />
                  ) : (
                    "Continue"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}
