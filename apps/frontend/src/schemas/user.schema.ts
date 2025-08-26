import z from "zod";
import { accountSchema } from "@/schemas/account.schema";
import { passwordSchema } from "./auth.schema";

export const userSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  twoFactorEnabled: z.boolean().optional(),
});

export const userResponseSchema = z.object({
  user: userSchema,
  accounts: accountSchema.array().optional(),
});

export const updatePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: passwordSchema,
  confirmNewPassword: z.string().min(1, "Confirm new password is required"),
});
