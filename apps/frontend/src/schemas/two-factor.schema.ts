import z from "zod";
import { userSchema } from "./user.schema";

const generateResponse = z.object({
  qrCode: z.string(),
});

const verifyRequest = z.object({
  otp: z.string().length(6, "OTP must be exactly 6 digits"),
});

const verifyResponse = z.object({
  user: z.object({
    id: z.number(),
    twoFactorEnabled: z.boolean(),
  }),
});

const loginRequest = z.object({
  email: z.string().email("Invalid email format"),
  otp: z.string().length(6, "OTP must be exactly 6 digits"),
});

const twoFactorSchema = {
  generateResponse,
  verifyRequest,
  verifyResponse,
  loginRequest,
};

export default twoFactorSchema;
