import { z } from "zod";
import { ApiBase } from "./api.base";

// Define request schema
const AuthRequestSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(), // TODO: This is not optional, do differnet request for login and signup
  password: z.string().min(6),
  confirmPassword: z.string().min(6).optional(), // TODO: same here
});

// Define response schema
const AuthResponseSchema = z.object({
  user: z.object({
    id: z.number(),
    email: z.string().email(),
    account: {
      id: z.number(),
      name: z.string(),
    },
  }),
});

// TypeScript types
export type AuthRequest = z.infer<typeof AuthRequestSchema>;
export type AuthResponse = z.infer<typeof AuthResponseSchema>;

// TODO: Fix the abstract class to put the schema wanted, for example the schema of login and request are not the same
// but here we expect the same request
export class AuthApi extends ApiBase<AuthRequest, AuthResponse> {
  constructor() {
    super("/auth");
  }

  protected requestSchema() {
    return AuthRequestSchema;
  }

  protected responseSchema() {
    return AuthResponseSchema;
  }

  async login(data: AuthRequest): Promise<AuthResponse> {
    return this.fetchApi("post", `${this.endpoint}/login`, data);
  }

  async signup(data: AuthRequest): Promise<AuthResponse> {
    return this.fetchApi("post", `${this.endpoint}/signup`, data);
  }

  async validate(): Promise<AuthResponse> {
    return this.fetchApi("get", `${this.endpoint}/validate`);
  }

  async logout(): Promise<AuthResponse> {
    return this.fetchApi("post", `${this.endpoint}/logout`);
  }

  async refreshToken(): Promise<AuthResponse> {
    return this.fetchApi("post", `${this.endpoint}/refresh-token`);
  }
}
