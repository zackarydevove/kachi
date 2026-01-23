import RedisUtil from '@utils/redis.util';
import Send from '@utils/response.util';
import { prisma } from '@db';
import { Request, Response } from 'express';
import AssetService from '@services/asset.service';
import SnapshotService from '@services/snapshot.service';

export default class AssetController {
  static getAllAssets = async (req: Request, res: Response) => {
    const userId = (req as any).userId;
    try {
      const { accountId } = req.params;
      const { split, snapshots } = await RedisUtil.getOrSetCache(
        `user-${userId}-assets-${accountId}`,
        () => {
          return SnapshotService.getSplitAndSnapshots(Number(accountId));
        },
      );
      return Send.success(res, { split, snapshots });
    } catch (error) {
      console.error('Error getting all assets:', error);
      return Send.error(res, {}, 'Internal server error');
    }
  };

  static createAsset = async (req: Request, res: Response) => {
    const userId = (req as any).userId;

    try {
      const { accountId, ...formData } = req.body;

      await prisma.$transaction(async (tx: any) => {
        await AssetService.createAsset(Number(accountId), formData, tx);
      });

      const { split, snapshots } = await RedisUtil.setCache(
        `user-${userId}-assets-${accountId}`,
        () => {
          return SnapshotService.getSplitAndSnapshots(Number(accountId));
        },
      );

      return Send.success(res, { split, snapshots });
    } catch (error) {
      console.error('Error creating asset:', error);
      return Send.error(res, {}, 'Internal server error');
    }
  };

  static editAsset = async (req: Request, res: Response) => {
    const userId = (req as any).userId;

    try {
      const assetId = Number(req.params.assetId);
      const { accountId, ...formData } = req.body;

      await prisma.$transaction(async (tx: any) => {
        await AssetService.editAsset(accountId, assetId, formData, tx);
      });

      const { split, snapshots } = await RedisUtil.setCache(
        `user-${userId}-assets-${accountId}`,
        () => {
          return SnapshotService.getSplitAndSnapshots(Number(accountId));
        },
      );

      return Send.success(res, { split, snapshots });
    } catch (error) {
      console.error('Error updating asset:', error);
      return Send.error(res, {}, 'Internal server error');
    }
  };

  static deleteAsset = async (req: Request, res: Response) => {
    const userId = (req as any).userId;

    try {
      const assetId = Number(req.params.assetId);
      const { accountId } = req.body;

      await prisma.$transaction(async (tx: any) => {
        await AssetService.deleteAsset(accountId, assetId, tx);
      });

      const { split, snapshots } = await RedisUtil.setCache(
        `user-${userId}-assets-${accountId}`,
        () => {
          return SnapshotService.getSplitAndSnapshots(Number(accountId));
        },
      );

      return Send.success(res, { split, snapshots });
    } catch (error) {
      console.error('Error deleting asset:', error);
      return Send.error(res, {}, 'Internal server error');
    }
  };
}
