import { z } from 'zod';
import { passwordSchema } from '@schema/auth.schema';

const updatePassword = z.object({
  currentPassword: z.string().optional(),
  newPassword: passwordSchema,
  confirmNewPassword: z.string().min(1, 'Confirm new password is required'),
});

const userSchema = {
  updatePassword,
};

export default userSchema;
