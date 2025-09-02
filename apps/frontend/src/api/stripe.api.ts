import { ApiBase } from "@/api/api.base";
import { StripeGetInvoicesResponse } from "@/types/stripe.type";

// interface StripeGetInvoicesResponse {
//   invoices: any[];
// }

// Define schemas for different asset API operations
export class StripeApi extends ApiBase {
  constructor() {
    super("/stripe");
  }

  async getInvoices() {
    return this.fetchApi<null, StripeGetInvoicesResponse>(
      "get",
      `${this.endpoint}/invoices`
    );
  }
}
