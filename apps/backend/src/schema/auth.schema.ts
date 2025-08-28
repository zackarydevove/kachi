import { z } from 'zod';

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters long')
  .regex(/[A-Z]/, 'Password must include at least one uppercase letter')
  .regex(/[a-z]/, 'Password must include at least one lowercase letter')
  .regex(/[0-9]/, 'Password must include at least one number')
  .regex(/[@$!%*?&]/, 'Password must include at least one special character');

const login = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

const signup = z
  .object({
    email: z.string().email('Invalid email format'),
    name: z
      .string()
      .regex(
        /^[a-zA-Z0-9 ]+$/,
        'Only letters, numbers, and spaces are allowed.',
      ),
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Password confirmation is required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

const resetPassword = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email format'),
});

const confirmResetPassword = z.object({
  token: z.string().min(1, 'Token is required'),
  newPassword: passwordSchema,
});

const verifyEmail = z.object({
  token: z.string().min(1, 'Token is required'),
});

const resendVerificationEmail = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email format'),
});

const authSchema = {
  login,
  signup,
  verifyEmail,
  resendVerificationEmail,
  resetPassword,
  confirmResetPassword,
};

export default authSchema;
