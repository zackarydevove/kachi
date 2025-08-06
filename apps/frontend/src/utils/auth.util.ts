import authSchema from "@/schemas/auth.schema";
import { LoginRequest, SignupRequest } from "@/types/auth.type";
import { Dispatch, SetStateAction } from "react";

export class AuthUtil {
  public checkError(
    payload: LoginRequest | SignupRequest,
    setError: Dispatch<SetStateAction<{ message: string; path: string } | null>>
  ): boolean {
    const isSignup = "confirmPassword" in payload;
    const result = isSignup
      ? authSchema.signup.safeParse(payload)
      : authSchema.login.safeParse(payload);

    if (!result.success) {
      const parsed = JSON.parse(result.error.message);
      const message = parsed?.[0]?.message || "Invalid email or password";
      const path = parsed?.[0]?.path?.[0];
      setError({ message, path });
      return false;
    }
    return true;
  }
}
