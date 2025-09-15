import { ApiBase } from "./api.base";

interface GenerateLinkTokenResponse {
  linkToken: string;
}

export class PlaidApi extends ApiBase {
  constructor() {
    super("/plaid");
  }

  async generateLinkToken(
    accountId: number
  ): Promise<GenerateLinkTokenResponse> {
    return this.fetchApi(
      "get",
      `${this.endpoint}/generate-link-token/${accountId}`,
      null
    );
  }

  async exchangePublicToken(publicTokenFromClient: string, accountId: number) {
    return this.fetchApi("put", `${this.endpoint}/set-access-token`, {
      publicTokenFromClient,
      accountId,
    });
  }
}
