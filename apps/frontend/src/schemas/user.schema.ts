import z from "zod";
import { accountSchema } from "@/schemas/account.schema";
import { passwordSchema } from "./auth.schema";

export const userSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  hasPassword: z.boolean().optional(),
  googleId: z.string().nullable().optional(),
  isVerified: z.boolean().optional(),
  twoFactorEnabled: z.boolean().optional(),
});

export const userResponseSchema = z.object({
  user: userSchema,
  accounts: accountSchema.array().optional(),
});

export const updatePasswordSchema = z.object({
  currentPassword: z.string().optional(), // Optional for Google OAuth users
  newPassword: passwordSchema,
  confirmNewPassword: z.string().min(1, "Confirm new password is required"),
});
