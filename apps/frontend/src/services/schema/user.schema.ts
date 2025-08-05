import z from "zod";

export const userSchema = z.object({
  id: z.number(),
  email: z.string().email(),
});

const accountSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export const userAndAccountSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  account: accountSchema,
});

export const userResponseSchema = z.object({ user: userAndAccountSchema });

// Response schemas
export type GetUserResponse = z.infer<typeof userResponseSchema>;
