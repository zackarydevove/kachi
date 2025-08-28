"use client";

import { AuthApi } from "@/api/auth.api";
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
import { Loader2Icon } from "lucide-react";
import { useState } from "react";

export default function ForgottenPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>("");
  const [success, setSuccess] = useState<string | null>("");

  const authApi = new AuthApi();

  const handleForgottenPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authApi.resetPassword(email);
      setSuccess("An email has been sent to reset your password");
    } catch (error) {
      setError("Invalid email, please try again");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex justify-center items-center h-screen w-screen">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Password Forgotten</CardTitle>
          <CardDescription>
            Forgotten your password? Enter your e-mail address below, and
            we&apos;ll send you an e-mail allowing you to reset it.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleForgottenPassword}>
            <div className="grid gap-6">
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
                    {error ? (
                      <p className="text-sm text-destructive mt-1">{error}</p>
                    ) : null}
                  </div>
                </div>
                {success ? (
                  <p className="text-sm text-constructive mt-1">{success}</p>
                ) : null}
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <Loader2Icon className="animate-spin" />
                  ) : (
                    "Send reset link"
                  )}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
