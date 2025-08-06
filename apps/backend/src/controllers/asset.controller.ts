import Send from '@utils/response.util';
import { prisma } from 'db';
import { Request, Response } from 'express';
import { Asset, AssetType } from '../../generated/prisma';

// TODO: Finish asset controller
export default class AssetController {
  static getAllAssets = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).userId;

      const assets = await prisma.asset.findMany({
        where: { id: userId, deletedAt: null },
        select: {
          id: true,
          name: true,
          type: true,
          value: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      // format in group by type
      const assetsByType = assets.reduce(
        (acc, asset) => {
          acc[asset.type] = acc[asset.type] || [];
          acc[asset.type].push(asset);
          return acc;
        },
        {} as Record<AssetType, Asset[]>,
      );

      return Send.success(res, { assetsByType });
    } catch (error) {
      console.error('Error fetching user assets:', error);
      return Send.error(res, {}, 'Internal server error');
    }
  };

  static createAsset = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).userId;
      const formData = req.body as AssetFormData[AssetType];

      const value = unitPrice * quantity;
      const newAsset = await prisma.asset.create({
        data: {
          accountId: userId, // TODO: add accountId
          formData,
          value,
        },
      });

      return Send.success(res, { newAsset });
    } catch (error) {
      console.error('Error fetching user assets:', error);
      return Send.error(res, {}, 'Internal server error');
    }
  };

  static updateAsset = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).userId;
      const assetId = Number(req.params.assetId);
      const formData = req.body as AssetFormData[AssetType];

      const value = unitPrice * quantity;
      const updatedAsset = await prisma.asset.update({
        where: { id: assetId, accountId: userId }, // TODO: add accountId
        data: {
          accountId: userId, // TODO: add accountId
          formData,
          value,
        },
      });

      return Send.success(res, { updatedAsset });
    } catch (error) {
      console.error('Error fetching user assets:', error);
      return Send.error(res, {}, 'Internal server error');
    }
  };

  static deleteAsset = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).userId;
      const assetId = Number(req.params.assetId);

      await prisma.asset.delete({
        where: { id: assetId, accountId: userId }, // TODO: add accountId
      });

      return Send.success(res, { message: 'Asset deleted successfully' });
    } catch (error) {
      console.error('Error deleting asset:', error);
      return Send.error(res, {}, 'Internal server error');
    }
  };
}
