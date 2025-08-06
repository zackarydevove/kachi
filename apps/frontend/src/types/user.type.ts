import { userResponseSchema } from "@/schemas/user.schema";
import z from "zod";

// Response schemas
export type GetUserResponse = z.infer<typeof userResponseSchema>;
