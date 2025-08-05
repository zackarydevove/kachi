// import { z } from "zod";
// import { ApiBase, ApiSchemas } from "./api.base";
// import { Asset, AssetType, AssetFormData, AssetGroup } from "@/types";

// // Define schemas for different asset API operations
// const AssetSchemas: ApiSchemas = {
//   // Get all assets
//   getAll: {
//     response: z.object({
//       success: z.boolean(),
//       data: z.array(
//         z.object({
//           id: z.string(),
//           name: z.string(),
//           type: z.enum(["crypto", "stock", "realEstate", "cash", "exotic"]),
//           color: z.string(),
//           split: z.number(),
//           value: z.number(),
//           pnl: z.string(),
//           unitPrice: z.string().optional(),
//           quantity: z.string().optional(),
//           address: z.string().optional(),
//           realEstateType: z.string().optional(),
//           category: z.string().optional(),
//           cost: z.string().optional(),
//           cashType: z.string().optional(),
//           currency: z.string().optional(),
//           buyingPrice: z.string().optional(),
//           currentPrice: z.string().optional(),
//           createdAt: z.date(),
//           updatedAt: z.date(),
//           userId: z.string(),
//         })
//       ),
//       error: z.string().optional(),
//     }),
//   },

//   // Create asset
//   post: {
//     request: z.object({
//       type: z.enum(["crypto", "stock", "realEstate", "cash", "exotic"]),
//       formData: z.union([
//         z.object({
//           name: z.string(),
//           unitPrice: z.string(),
//           quantity: z.string(),
//         }),
//         z.object({
//           name: z.string(),
//           address: z.string(),
//           realEstateType: z.string(),
//           category: z.string(),
//           cost: z.string(),
//         }),
//         z.object({
//           cashType: z.string(),
//           currency: z.string(),
//           quantity: z.string(),
//         }),
//         z.object({
//           name: z.string(),
//           quantity: z.string(),
//           buyingPrice: z.string(),
//           currentPrice: z.string(),
//         }),
//       ]),
//       userId: z.string(),
//     }),
//     response: z.object({
//       success: z.boolean(),
//       data: z.object({
//         id: z.string(),
//         name: z.string(),
//         type: z.enum(["crypto", "stock", "realEstate", "cash", "exotic"]),
//         color: z.string(),
//         split: z.number(),
//         value: z.number(),
//         pnl: z.string(),
//         unitPrice: z.string().optional(),
//         quantity: z.string().optional(),
//         address: z.string().optional(),
//         realEstateType: z.string().optional(),
//         category: z.string().optional(),
//         cost: z.string().optional(),
//         cashType: z.string().optional(),
//         currency: z.string().optional(),
//         buyingPrice: z.string().optional(),
//         currentPrice: z.string().optional(),
//         createdAt: z.date(),
//         updatedAt: z.date(),
//         userId: z.string(),
//       }),
//       error: z.string().optional(),
//     }),
//   },

//   // Update asset
//   put: {
//     request: z.object({
//       type: z.enum(["crypto", "stock", "realEstate", "cash", "exotic"]),
//       formData: z.union([
//         z.object({
//           name: z.string(),
//           unitPrice: z.string(),
//           quantity: z.string(),
//         }),
//         z.object({
//           name: z.string(),
//           address: z.string(),
//           realEstateType: z.string(),
//           category: z.string(),
//           cost: z.string(),
//         }),
//         z.object({
//           cashType: z.string(),
//           currency: z.string(),
//           quantity: z.string(),
//         }),
//         z.object({
//           name: z.string(),
//           quantity: z.string(),
//           buyingPrice: z.string(),
//           currentPrice: z.string(),
//         }),
//       ]),
//       userId: z.string(),
//     }),
//     response: z.object({
//       success: z.boolean(),
//       data: z.object({
//         id: z.string(),
//         name: z.string(),
//         type: z.enum(["crypto", "stock", "realEstate", "cash", "exotic"]),
//         color: z.string(),
//         split: z.number(),
//         value: z.number(),
//         pnl: z.string(),
//         unitPrice: z.string().optional(),
//         quantity: z.string().optional(),
//         address: z.string().optional(),
//         realEstateType: z.string().optional(),
//         category: z.string().optional(),
//         cost: z.string().optional(),
//         cashType: z.string().optional(),
//         currency: z.string().optional(),
//         buyingPrice: z.string().optional(),
//         currentPrice: z.string().optional(),
//         createdAt: z.date(),
//         updatedAt: z.date(),
//         userId: z.string(),
//       }),
//       error: z.string().optional(),
//     }),
//   },

//   // Delete asset
//   delete: {
//     response: z.object({
//       success: z.boolean(),
//       error: z.string().optional(),
//     }),
//   },
// };

// export class AssetApi extends ApiBase<typeof AssetSchemas> {
//   constructor() {
//     super("/assets");
//   }

//   protected schemas() {
//     return AssetSchemas;
//   }

//   // Custom methods for asset-specific operations
//   async getAllAssets(): Promise<AssetGroup[]> {
//     const response = await this.getAll();
//     // Handle both direct array response and wrapped response
//     if (Array.isArray(response)) {
//       return response as AssetGroup[];
//     }
//     return (response as { data: AssetGroup[] }).data;
//   }

//   async createAsset(
//     type: AssetType,
//     formData: AssetFormData[AssetType]
//   ): Promise<Asset> {
//     const response = await this.create({
//       type,
//       formData,
//       userId: "user-1", // TODO: Get from auth context
//     });
//     return (response as { data: Asset }).data;
//   }

//   async updateAsset(
//     id: string,
//     type: AssetType,
//     formData: AssetFormData[AssetType]
//   ): Promise<Asset> {
//     const response = await this.update(id, {
//       type,
//       formData,
//       userId: "user-1", // TODO: Get from auth context
//     });
//     return (response as { data: Asset }).data;
//   }

//   async deleteAsset(id: string): Promise<void> {
//     await this.delete(id);
//   }
// }
