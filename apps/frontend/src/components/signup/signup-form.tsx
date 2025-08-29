"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { AuthApi } from "@/api/auth.api";
import { Loader2Icon, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { AuthUtil } from "@/utils/auth.util";
import { SignupRequest } from "@/types/auth.type";
import { toast } from "sonner";
import { parseApiError } from "@/utils/error.util";
import { GoogleOAuthButton } from "@/components/auth/google-oauth-button";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{ message: string; path: string } | null>(
    null
  );

  // Unverified user state
  const [showUnverified, setShowUnverified] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const authApi = new AuthApi();
  const authUtil = new AuthUtil();

  // Timer effect for resend button
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const payload: SignupRequest = { email, name, password, confirmPassword };
    if (!authUtil.checkError(payload, setError)) return;

    try {
      setLoading(true);
      await authApi.signup(payload);
      router.push("/verify-email");
    } catch (err: any) {
      const { status, message } = parseApiError(err);

      if (status === 409) {
        const errorMessage = message || "Email is already in use";
        setError({
          message: errorMessage,
          path: "email",
        });
        if (!err.response.data.data.isVerified) setShowUnverified(true);
      } else {
        setError({
          message: "Something went wrong. Please try again later.",
          path: "email",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    try {
      setResendLoading(true);
      await authApi.resendVerificationEmail({ email });
      toast.success("Verification email sent successfully!");
      setResendTimer(60); // 1 minute timer
    } catch (err: unknown) {
      const { message } = parseApiError(err);
      const errorMessage =
        message || "Failed to send verification email. Please try again.";
      toast.error(errorMessage);
    } finally {
      setResendLoading(false);
    }
  };

  const handleBackToSignup = () => {
    setShowUnverified(false);
    setError(null);
  };

  if (showUnverified) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-warning">
              <Mail className="h-8 w-8 text-warning-text" />
            </div>
            <CardTitle className="text-xl">Account Already Exists</CardTitle>
            <CardDescription>
              This email is already registered but not verified
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground mb-6">
              We sent a verification link to <strong>{email}</strong>. Please
              check your email and click the link to verify your account.
            </p>

            <div className="space-y-3">
              <Button
                onClick={handleResendVerification}
                disabled={resendLoading || resendTimer > 0}
                className="w-full"
              >
                {resendLoading ? (
                  <Loader2Icon className="animate-spin" />
                ) : resendTimer > 0 ? (
                  `Resend in ${resendTimer}s`
                ) : (
                  "Resend Verification Email"
                )}
              </Button>

              <Button
                variant="outline"
                onClick={handleBackToSignup}
                className="w-full"
              >
                Back to Signup
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome</CardTitle>
          <CardDescription>Login with your Google account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup}>
            <div className="grid gap-6">
              <div className="flex flex-col gap-4">
                <GoogleOAuthButton />
              </div>
              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-card text-muted-foreground relative z-10 px-2">
                  Or continue with
                </span>
              </div>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <div>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    {error && error.path === "email" ? (
                      <p className="text-sm text-destructive mt-1">
                        {error.message}
                      </p>
                    ) : null}
                  </div>
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="text">Name</Label>
                  <div>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Elon Musk"
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                    {error && error.path === "name" ? (
                      <p className="text-sm text-destructive mt-1">
                        {error.message}
                      </p>
                    ) : null}
                  </div>
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                  </div>
                  <div>
                    <Input
                      id="password"
                      type="password"
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    {error && error.path === "password" ? (
                      <p className="text-sm text-destructive mt-1">
                        {error.message}
                      </p>
                    ) : null}
                  </div>
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password">Confirm Password</Label>
                  </div>
                  <div>
                    <Input
                      id="confirmPassword"
                      type="password"
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                    {error && error.path === "confirmPassword" ? (
                      <p className="text-sm text-destructive mt-1">
                        {error.message}
                      </p>
                    ) : null}
                  </div>
                </div>

                <Button type="submit" className="w-full">
                  {loading ? (
                    <Loader2Icon className="animate-spin" />
                  ) : (
                    "Signup"
                  )}
                </Button>
              </div>
              <div className="text-center text-sm">
                Already have an account?{" "}
                <a href="/login" className="underline underline-offset-4">
                  Log in
                </a>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
