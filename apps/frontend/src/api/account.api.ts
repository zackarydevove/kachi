import { ApiBase } from "@/api/api.base";
import {
  AccountCreateRequest,
  AccountCreateResponse,
} from "@/types/account.type";

export class AccountApi extends ApiBase<
  AccountCreateRequest,
  AccountCreateResponse
> {
  constructor() {
    super("/account");
  }
}
