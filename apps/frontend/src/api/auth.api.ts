import { userResponseSchema } from "@/schemas/user.schema";
import { ApiBase } from "@/api/api.base";
import {
  AuthResponse,
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SignupResponse,
  VerifyEmailRequest,
  ResendVerificationEmailRequest,
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

  async verifyEmail(data: VerifyEmailRequest) {
    return this.fetchApi<VerifyEmailRequest, null>(
      "post",
      `${this.endpoint}/verify-email`,
      data
    );
  }

  async resendVerificationEmail(data: ResendVerificationEmailRequest) {
    return this.fetchApi<ResendVerificationEmailRequest, null>(
      "post",
      `${this.endpoint}/resend-verification-email`,
      data
    );
  }

  async logout(): Promise<AuthResponse> {
    return this.fetchApi("post", `${this.endpoint}/logout`);
  }

  async refreshToken(): Promise<AuthResponse> {
    return this.fetchApi("post", `${this.endpoint}/refresh-token`);
  }

  async resetPassword(email: string): Promise<AuthResponse> {
    return this.fetchApi("put", `${this.endpoint}/reset-password`, { email });
  }

  async confirmResetPassword(
    token: string,
    newPassword: string
  ): Promise<AuthResponse> {
    return this.fetchApi("put", `${this.endpoint}/confirm-reset-password`, {
      token,
      newPassword,
    });
  }
}
