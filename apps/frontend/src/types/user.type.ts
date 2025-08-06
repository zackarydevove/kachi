import { userResponseSchema, userSchema } from "@/schemas/user.schema";
import z from "zod";

// Inferred types
export type User = z.infer<typeof userSchema>;

// Response schemas
export type GetUserResponse = z.infer<typeof userResponseSchema>;
