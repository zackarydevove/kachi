import {
  AssetCreateRequest,
  AssetCreateResponse,
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
  AssetDeleteResponse
> {
  constructor() {
    super("/assets");
  }
}
