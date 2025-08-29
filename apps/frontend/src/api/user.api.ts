import {
  GetUserResponse,
  UpdatePasswordRequest,
  User,
} from "@/types/user.type";
import { ApiBase } from "@/api/api.base";
import { userSchema } from "@/schemas/user.schema";

export class UserApi extends ApiBase<null, null, GetUserResponse> {
  constructor() {
    super("/user");
  }

  async updatePassword(data: UpdatePasswordRequest) {
    return this.fetchApi<UpdatePasswordRequest, null>(
      "put",
      `${this.endpoint}/password`,
      data
    );
  }
}
