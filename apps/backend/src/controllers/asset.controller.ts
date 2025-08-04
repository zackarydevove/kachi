import Send from '@utils/response.util';
import { prisma } from 'db';
import { Request, Response } from 'express';
import { send } from 'process';

export default class AssetController {
  //  TODO: Add schema and prevent unityPrice and quantity to be negative
  static createAsset = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).userId;
      const { name, type, unitPrice, quantity } = req.body;

      const value = unitPrice * quantity;
      const newAsset = await prisma.asset.create({
        data: {
          name,
          type,
          unitPrice,
          quantity,
          value,
        },
      });

      return Send.success(res, { newAsset });
    } catch (error) {
      console.error('Error fetching user assets:', error);
      return Send.error(res, {}, 'Internal server error');
    }
  };

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

      return Send.success(res, { assets });
    } catch (error) {
      console.error('Error fetching user assets:', error);
      return Send.error(res, {}, 'Internal server error');
    }
  };
}
