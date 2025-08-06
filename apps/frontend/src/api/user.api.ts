import { GetUserResponse } from "@/types/user.type";
import { ApiBase } from "@/api/api.base";

export class UserApi extends ApiBase<null, null, GetUserResponse> {
  constructor() {
    super("/user");
  }
}
