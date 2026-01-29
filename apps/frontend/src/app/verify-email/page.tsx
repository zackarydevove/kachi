"use client";

import { useEffect, useState, useCallback, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { GalleryVerticalEnd } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AuthApi } from "@/api/auth.api";
import { Loader2Icon, CheckCircle, Mail, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { parseApiError } from "@/utils/error.util";

function VerifyEmailHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const authApi = useMemo(() => new AuthApi(), []);

  const handleVerifyEmail = useCallback(async () => {
    if (!token) return;

    try {
      setLoading(true);
      setError(null);

      await authApi.verifyEmail({ token });
      setVerified(true);

      // Show success message and redirect after 2 seconds
      toast.success("Email verified successfully! Redirecting to login...");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: unknown) {
      const { message } = parseApiError(err);
      const errorMessage =
        message || "Failed to verify email. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [token, authApi, router]);

  useEffect(() => {
    if (token) {
      handleVerifyEmail();
    }
  }, [token, handleVerifyEmail]);

  if (token) {
    return (
      <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
        <div className="flex w-full max-w-sm flex-col gap-6">
          <a
            href="#"
            className="flex items-center gap-2 self-center font-medium"
          >
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Kachi.
          </a>

          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Verifying Your Email</CardTitle>
              <CardDescription>
                Please wait while we verify your email address
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              {loading && (
                <div className="flex flex-col items-center gap-4">
                  <Loader2Icon className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">
                    Verifying your email...
                  </p>
                </div>
              )}

              {verified && (
                <div className="flex flex-col items-center gap-4">
                  <CheckCircle className="h-8 w-8 text-constructive" />
                  <p className="text-sm text-constructive font-medium">
                    Email verified successfully!
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Redirecting to login...
                  </p>
                </div>
              )}

              {error && (
                <div className="flex flex-col items-center gap-4">
                  <AlertCircle className="h-8 w-8 text-destructive" />
                  <p className="text-sm text-destructive text-center">
                    {error}
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => router.push("/login")}
                    className="w-full"
                  >
                    Go to Login
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Initial state - after signup
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-4" />
          </div>
          Kachi.
        </a>

        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Mail className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-xl">Check Your Email</CardTitle>
            <CardDescription>
              We&apos;ve sent a verification link to your email address
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground mb-6">
              Please check your email and click the verification link to
              activate your account.
            </p>

            <div className="space-y-3">
              <Button
                variant="outline"
                onClick={() => router.push("/login")}
                className="w-full"
              >
                Back to Login
              </Button>

              <p className="text-xs text-muted-foreground">
                Didn&apos;t receive the email? Check your spam folder or{" "}
                <a
                  href="/resend-verification"
                  className="text-primary hover:underline"
                >
                  request a new one
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2Icon className="animate-spin" />
        </div>
      }
    >
      <VerifyEmailHandler />
    </Suspense>
  );
}
