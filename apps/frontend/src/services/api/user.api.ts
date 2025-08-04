import z from "zod";
import { ApiBase } from "./api.base";
import { userAndAccountSchema } from "../schema/user.schema";

const UserRequestSchema = z.object({
  email: z.string().email(),
});

const UserResponseSchema = { user: userAndAccountSchema };

// TypeScript types
export type UserRequest = z.infer<typeof UserRequestSchema>;
export type UserResponse = z.infer<typeof UserResponseSchema>;

export class UserApi extends ApiBase<UserRequest, UserResponse> {
  constructor() {
    super("/user");
  }

  public requestSchema() {
    return UserRequestSchema;
  }

  public responseSchema() {
    return UserResponseSchema;
  }

  async getUser(): Promise<UserResponse> {
    return this.fetchApi("get", `${this.endpoint}/me`);
  }
}
