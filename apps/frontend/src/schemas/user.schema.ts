import z from "zod";
import { accountSchema } from "@/schemas/account.schema";

export const userSchema = z.object({
  id: z.number(),
  email: z.string().email(),
});

export const userResponseSchema = z.object({
  user: userSchema,
  accounts: accountSchema.array(),
});
