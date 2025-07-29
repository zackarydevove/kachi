import { AuthRequest } from "@/services/api/auth.api";
import authSchema from "@/services/schema/auth.schema";
import { Dispatch, SetStateAction } from "react";

export class AuthUtil {
  public checkError(
    payload: AuthRequest,
    setError: Dispatch<SetStateAction<{ message: string; path: string } | null>>
  ): boolean {
    const result =
      payload.confirmPassword == undefined
        ? authSchema.login.safeParse(payload)
        : authSchema.signup.safeParse(payload);

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
