import z from 'zod';
import {
  assetFormDataSchema,
  assetSchema,
  assetTypeSchema,
} from '@schema/asset.schema';

export type Asset = z.infer<typeof assetSchema>;
export type AssetType = z.infer<typeof assetTypeSchema>;
export type AssetFormData = z.infer<typeof assetFormDataSchema>;
