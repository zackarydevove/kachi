import {
  updatePasswordSchema,
  userResponseSchema,
  userSchema,
} from "@/schemas/user.schema";
import z from "zod";

// Inferred types
export type User = z.infer<typeof userSchema>;

// Request schemas
export type UpdatePasswordRequest = z.infer<typeof updatePasswordSchema>;

// Response schemas
export type GetUserResponse = z.infer<typeof userResponseSchema>;
