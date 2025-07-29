import { z } from "zod";
import { ApiBase } from "./api.base";

// Define request schema
const AuthRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  confirmPassword: z.string().min(6).optional(),
});

// Define response schema
const AuthResponseSchema = z.object({
  token: z.string(),
  user: z.object({
    id: z.number(),
    name: z.string(),
    email: z.string().email(),
  }),
});

// TypeScript types
export type AuthRequest = z.infer<typeof AuthRequestSchema>;
export type AuthResponse = z.infer<typeof AuthResponseSchema>;

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
