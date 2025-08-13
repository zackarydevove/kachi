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

// Define schemas for different asset API operations
export class AssetApi extends ApiBase<
  AssetCreateRequest,
  AssetCreateResponse,
  null,
  AssetGetAllResponse,
  AssetUpdateRequest,
  AssetUpdateResponse,
  AssetDeleteRequest,
  AssetDeleteResponse
> {
  constructor() {
    super("/assets");
  }
}
