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
import { InputOTP } from "@/components/ui/input-otp";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { AuthApi } from "@/api/auth.api";
import { TwoFactorApi } from "@/api/two-factor.api";
import { Loader2Icon, Mail } from "lucide-react";
import { AuthUtil } from "@/utils/auth.util";
import { useUserStore } from "@/store/user.store";
import { LoginRequest } from "@/types/auth.type";
import { useAccountStore } from "@/store/account.store";
import { toast } from "sonner";
import { parseApiError } from "@/utils/error.util";
import { GoogleOAuthButton } from "@/components/auth/google-oauth-button";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{ message: string; path: string } | null>(
    null,
  );

  // 2FA state
  const [show2FA, setShow2FA] = useState(false);
  const [otp, setOtp] = useState("");
  const [twoFactorLoading, setTwoFactorLoading] = useState(false);

  // Unverified user state
  const [showUnverified, setShowUnverified] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const setUser = useUserStore((state) => state.setUser);
  const setAccounts = useAccountStore((state) => state.setAccounts);
  const setActiveAccount = useAccountStore((state) => state.setActiveAccount);

  const authApi = new AuthApi();
  const twoFactorApi = new TwoFactorApi();
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const payload: LoginRequest = { email, password };
    if (!authUtil.checkError(payload, setError)) return;

    try {
      setLoading(true);
      const res = await authApi.login(payload);

      if (res.user.twoFactorEnabled) {
        setShow2FA(true);
        setLoading(false);
        return;
      }

      // Regular login flow
      setUser(res.user);
      if (res.accounts) {
        setAccounts(res.accounts);
        setActiveAccount(res.accounts[0]);
      }
      router.push("/portfolio");
    } catch (err: unknown) {
      const { status, message } = parseApiError(err);

      if (status === 401) {
        const errorMessage = message || "Invalid email or password";

        // Check if it's an unverified user error
        if (
          errorMessage.includes("isn't verified") ||
          errorMessage.includes("verify your account")
        ) {
          setShowUnverified(true);
          setError(null);
        } else {
          setError({
            message: errorMessage,
            path: "password",
          });
        }
      } else {
        setError({
          message: "Something went wrong. Please try again later.",
          path: "password",
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

  const handleBackToLogin = () => {
    setShowUnverified(false);
    setShow2FA(false);
    setOtp("");
    setError(null);
  };

  const handle2FALogin = async () => {
    if (otp.length !== 6) {
      setError({
        message: "Please enter a valid 6-digit OTP code",
        path: "otp",
      });
      return;
    }

    try {
      setTwoFactorLoading(true);
      setError(null);

      const res = await twoFactorApi.login2FA({ email, otp });

      // Success - set user and accounts
      setUser(res.user);
      if (res.accounts) {
        setAccounts(res.accounts);
        setActiveAccount(res.accounts[0]);
      }
      router.push("/portfolio");
    } catch (err: unknown) {
      setError({
        message: "Invalid OTP code. Please try again.",
        path: "otp",
      });
    } finally {
      setTwoFactorLoading(false);
    }
  };

  if (showUnverified) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-warning">
              <Mail className="h-8 w-8 text-warning-text" />
            </div>
            <CardTitle className="text-xl">Email Not Verified</CardTitle>
            <CardDescription>
              Please verify your email address before logging in
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
                onClick={handleBackToLogin}
                className="w-full"
              >
                Back to Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (show2FA) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Two-Factor Authentication</CardTitle>
            <CardDescription>
              Enter the 6-digit code from your authenticator app
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <div className="grid gap-3">
                <Label htmlFor="otp">Authentication Code</Label>
                <div className="flex justify-center">
                  <InputOTP value={otp} onChange={setOtp} length={6} />
                </div>
                {error && error.path === "otp" ? (
                  <p className="text-sm text-destructive text-center">
                    {error.message}
                  </p>
                ) : null}
              </div>

              <Button
                onClick={handle2FALogin}
                className="w-full"
                disabled={twoFactorLoading || otp.length !== 6}
              >
                {twoFactorLoading ? (
                  <Loader2Icon className="animate-spin" />
                ) : (
                  "Verify & Login"
                )}
              </Button>

              <Button
                variant="outline"
                onClick={handleBackToLogin}
                className="w-full"
              >
                Back to Login
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
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>Login with your Google account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
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
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <a
                      href="/password/forgotten"
                      className="ml-auto text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </a>
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
                <Button type="submit" className="w-full">
                  {loading ? <Loader2Icon className="animate-spin" /> : "Login"}
                </Button>
              </div>
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <a href="/signup" className="underline underline-offset-4">
                  Sign up
                </a>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      {/* <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div> */}
    </div>
  );
}
