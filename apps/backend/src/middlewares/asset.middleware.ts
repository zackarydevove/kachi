import Send from '@utils/response.util';
import { prisma } from 'db';
import { NextFunction, Request, Response } from 'express';

export interface DecodedToken {
  userId: number;
}

class AssetMiddleware {
  public static async authenticateAccountOwnAsset(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const assetId = Number(req.params.assetId);
      const accountId = req.body.accountId;

      if (!assetId || !accountId)
        return Send.badRequest(
          res,
          null,
          'Asset ID and account ID are required',
        );

      const asset = await prisma.asset.findFirst({
        where: { id: assetId },
        select: { accountId: true },
      });

      if (!asset) return Send.notFound(res, null, 'Asset not found');

      if (asset.accountId !== accountId)
        return Send.forbidden(res, null, 'Access denied');
      next();
    } catch (error) {
      console.error('Account owner validation failed:', error);
      return Send.notFound(res, null, 'Account not found');
    }
  }
}

export default AssetMiddleware;
