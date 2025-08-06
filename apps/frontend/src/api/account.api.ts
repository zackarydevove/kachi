import { ApiBase } from "@/api/api.base";
import {
  AccountCreateRequest,
  AccountCreateResponse,
  AccountUpdateRequest,
  AccountUpdateResponse,
} from "@/types/account.type";

export class AccountApi extends ApiBase<
  AccountCreateRequest,
  AccountCreateResponse,
  null,
  null,
  AccountUpdateRequest,
  AccountUpdateResponse
> {
  constructor() {
    super("/account");
  }
}
