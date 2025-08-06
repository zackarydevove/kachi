import { z } from "zod";

export const accountSchema = z.object({
  id: z.number(),
  name: z.string(),
  avatar: z.string().optional(),
});

export const accountFormSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .regex(/^[a-zA-Z0-9 ]+$/, "Only letters, numbers, and spaces are allowed."),
  avatar: z.string().optional(),
});
