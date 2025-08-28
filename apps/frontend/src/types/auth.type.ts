import authSchema from "@/schemas/auth.schema";
import { userResponseSchema } from "@/schemas/user.schema";
import z from "zod";

// Request schemas
export type LoginRequest = z.infer<typeof authSchema.login>;
export type SignupRequest = z.infer<typeof authSchema.signup>;
export type VerifyEmailRequest = z.infer<typeof authSchema.verifyEmail>;
export type ResendVerificationEmailRequest = z.infer<
  typeof authSchema.resendVerificationEmail
>;

// Response schemas
export type LoginResponse = z.infer<typeof userResponseSchema>;
export type SignupResponse = z.infer<typeof userResponseSchema>;
export type AuthResponse = null;
