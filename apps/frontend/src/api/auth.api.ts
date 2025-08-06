import { userResponseSchema } from "@/schemas/user.schema";
import { ApiBase } from "@/api/api.base";
import {
  AuthResponse,
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SignupResponse,
} from "@/types/auth.type";

export class AuthApi extends ApiBase {
  constructor() {
    super("/auth");
  }

  async login(data: LoginRequest): Promise<LoginResponse> {
    return this.fetchApi<LoginRequest, LoginResponse>(
      "post",
      `${this.endpoint}/login`,
      data,
      userResponseSchema
    );
  }

  async signup(data: SignupRequest): Promise<SignupResponse> {
    return this.fetchApi<SignupRequest, SignupResponse>(
      "post",
      `${this.endpoint}/signup`,
      data,
      userResponseSchema
    );
  }

  async logout(): Promise<AuthResponse> {
    return this.fetchApi("post", `${this.endpoint}/logout`);
  }

  async refreshToken(): Promise<AuthResponse> {
    return this.fetchApi("post", `${this.endpoint}/refresh-token`);
  }
}
