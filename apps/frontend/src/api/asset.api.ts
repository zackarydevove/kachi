import {
  AssetCreateRequest,
  AssetCreateResponse,
  AssetDeleteRequest,
  AssetDeleteResponse,
  AssetGetAllResponse,
  AssetUpdateRequest,
  AssetUpdateResponse,
} from "@/types/asset.type";
import { ApiBase } from "@/api/api.base";
import { splitAndSnapshotsSchema } from "@/schemas/asset.schema";

// Define schemas for different asset API operations
export class AssetApi extends ApiBase<
  AssetCreateRequest,
  AssetCreateResponse,
  null,
  null,
  AssetUpdateRequest,
  AssetUpdateResponse,
  AssetDeleteRequest,
  AssetDeleteResponse
> {
  constructor() {
    super("/asset");
  }

  async getSplitAndSnapshotsByAccountId(
    accountId: number
  ): Promise<AssetGetAllResponse> {
    return this.fetchApi<null, AssetGetAllResponse>(
      "get",
      `${this.endpoint}/all/${accountId}`,
      undefined,
      splitAndSnapshotsSchema
    );
  }
}
