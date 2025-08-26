import twoFactorSchema from "@/schemas/two-factor.schema";
import { userResponseSchema } from "@/schemas/user.schema";
import z from "zod";

// Request schemas
export type TwoFactorVerifyRequest = z.infer<
  typeof twoFactorSchema.verifyRequest
>;
export type TwoFactorLoginRequest = z.infer<
  typeof twoFactorSchema.loginRequest
>;

// Response schemas
export type TwoFactorGenerateResponse = z.infer<
  typeof twoFactorSchema.generateResponse
>;
export type TwoFactorVerifyResponse = z.infer<
  typeof twoFactorSchema.verifyResponse
>;
export type TwoFactorLoginResponse = z.infer<typeof userResponseSchema>;
