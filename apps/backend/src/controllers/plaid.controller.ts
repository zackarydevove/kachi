import { Request, Response } from 'express';
import Send from '@utils/response.util';
import PlaidService from 'services/plaid.service';
import { prisma } from 'db';
import RedisUtil from '@utils/redis.util';
import SnapshotService from 'services/snapshot.service';

export default class PlaidController {
  static generateLinkToken = async (req: Request, res: Response) => {
    const accountId = parseInt(req.params.accountId);
    try {
      const linkToken = await PlaidService.generateLinkToken(accountId);
      return Send.success(res, { linkToken }, 'Link token generated');
    } catch (error) {
      console.error(error);
      return Send.error(res, {}, 'Error generating link token');
    }
  };

  static exchangePublicToken = async (req: Request, res: Response) => {
    const { publicTokenFromClient, accountId } = req.body;
    const userId = (req as any).userId;
    try {
      await prisma.$transaction(async (tx) => {
        await PlaidService.exchangePublicToken(
          accountId,
          publicTokenFromClient,
          tx,
        );
        await PlaidService.createOrUpdatePlaidAssets(accountId, userId, tx);
      });

      // Update cache after transaction commits to ensure we read committed data
      await RedisUtil.setCache(`user-${userId}-assets-${accountId}`, () => {
        return SnapshotService.getSplitAndSnapshots(Number(accountId));
      });

      return Send.success(res, null, 'Public token exchanged');
    } catch (error) {
      console.error(error);
      return Send.error(res, {}, 'Error exchanging plaid public token');
    }
  };
}
