import { ApiBase } from "@/api/api.base";
import twoFactorSchema from "@/schemas/two-factor.schema";
import { userResponseSchema } from "@/schemas/user.schema";
import {
  TwoFactorGenerateResponse,
  TwoFactorVerifyRequest,
  TwoFactorVerifyResponse,
  TwoFactorLoginRequest,
  TwoFactorLoginResponse,
} from "@/types/two-factor.type";

// Define schemas for different asset API operations
export class TwoFactorApi extends ApiBase {
  constructor() {
    super("/2fa");
  }

  async generate2FA(): Promise<TwoFactorGenerateResponse> {
    return this.fetchApi<null, TwoFactorGenerateResponse>(
      "post",
      `${this.endpoint}/generate`,
      undefined,
      twoFactorSchema.generateResponse
    );
  }

  async verify2FA(
    data: TwoFactorVerifyRequest
  ): Promise<TwoFactorVerifyResponse> {
    return this.fetchApi<TwoFactorVerifyRequest, TwoFactorVerifyResponse>(
      "post",
      `${this.endpoint}/verify`,
      data,
      twoFactorSchema.verifyResponse
    );
  }

  async login2FA(data: TwoFactorLoginRequest): Promise<TwoFactorLoginResponse> {
    return this.fetchApi<TwoFactorLoginRequest, TwoFactorLoginResponse>(
      "post",
      `${this.endpoint}/login`,
      data,
      userResponseSchema
    );
  }
}
