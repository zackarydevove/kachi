import { accountFormSchema, accountSchema } from "@/schemas/account.schema";
import z from "zod";

// Inferred types
export type Account = z.infer<typeof accountSchema>;
export type AccountForm = z.infer<typeof accountFormSchema>;

// Request schemas
export type AccountCreateRequest = z.infer<typeof accountFormSchema>;
export type AccountUpdateRequest = z.infer<typeof accountFormSchema>;

// Response schemas
export type AccountCreateResponse = {
  newAccount: z.infer<typeof accountSchema>;
};

export type AccountUpdateResponse = {
  updatedAccount: z.infer<typeof accountSchema>;
};

export type AccountDeleteResponse = {
  deletedAccountId: number;
};
