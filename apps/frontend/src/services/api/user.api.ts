import { GetUserResponse, userResponseSchema } from "../schema/user.schema";
import { ApiBase, GetResponse } from "./api.base";

export class UserApi extends ApiBase<null, null, GetUserResponse> {
  constructor() {
    super("/user", {
      getResponse: userResponseSchema,
    });
  }
}
