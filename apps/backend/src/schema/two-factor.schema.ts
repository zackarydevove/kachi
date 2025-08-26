import z from 'zod';

const login = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .email('Invalid email format'),
  otp: z
    .string()
    .length(6, 'OTP must be exactly 6 digits')
    .regex(/^\d{6}$/, 'OTP must contain only numbers'),
});

const validateSchema = z.object({
  otp: z.string().length(6, 'OTP must be exactly 6 digits'),
});

const validateLoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  otp: z.string().length(6, 'OTP must be exactly 6 digits'),
});

const twoFactorSchema = {
  login,
  validateSchema,
  validateLoginSchema,
};

export default twoFactorSchema;
