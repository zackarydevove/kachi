import { ApiBase } from "@/api/api.base";
import {
  AccountCreateRequest,
  AccountCreateResponse,
  AccountDeleteResponse,
  AccountUpdateRequest,
  AccountUpdateResponse,
} from "@/types/account.type";

export class AccountApi extends ApiBase<
  AccountCreateRequest,
  AccountCreateResponse,
  null,
  null,
  AccountUpdateRequest,
  AccountUpdateResponse,
  AccountDeleteResponse
> {
  constructor() {
    super("/account");
  }
}
