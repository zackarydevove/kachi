import Send from '@utils/response.util';
import { prisma } from 'db';
import { Request, Response } from 'express';
import SnapshotService from 'services/snapshot.service';
import RedisUtil from '@utils/redis.util';

export default class AccountController {
  static addAccount = async (req: Request, res: Response) => {
    try {
      const { name, avatar } = req.body;
      const userId = (req as any).userId;

      // Check if the user is pro and has at least one account
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { isPro: true },
      });
      const userAccountsCount = await prisma.account.count({
        where: { userId },
      });
      if (!user?.isPro && userAccountsCount >= 1) {
        return Send.badRequest(
          res,
          { error: 'User is not pro and already has one account' },
          'User is not pro and already has one account',
        );
      }

      const existingAccount = await prisma.account.findFirst({
        where: { name, userId },
      });
      if (existingAccount) {
        return Send.conflict(
          res,
          { error: 'Account with this name already exists' },
          'Account with this name already exists',
        );
      }

      const newAccount = await prisma.$transaction(async (tx) => {
        const newAccount = await tx.account.create({
          data: { name, avatar, userId },
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        });

        // Initialize snapshots for the new account
        await SnapshotService.initializeAccountSnapshots(newAccount.id, tx);

        return newAccount;
      });

      // Invalidate user cache since accounts have changed
      await RedisUtil.deleteCache(`user-${userId}-info`);

      return Send.success(res, { newAccount });
    } catch (error) {
      console.error('Error creating new account: ', error);
      return Send.error(res, { error }, 'Internal server error');
    }
  };

  static editAccount = async (req: Request, res: Response) => {
    try {
      const { name, avatar } = req.body;
      const accountId = parseInt(req.params.accountId);
      const userId = (req as any).userId;

      // Convert accountId to number since it comes as string from params
      if (isNaN(accountId)) {
        return Send.badRequest(
          res,
          { error: 'Invalid account ID' },
          'Invalid account ID',
        );
      }

      // Check if the account exists and belongs to the user
      const existingAccount = await prisma.account.findFirst({
        where: { id: accountId, userId },
      });

      if (!existingAccount) {
        return Send.notFound(
          res,
          { error: 'Account not found or access denied' },
          'Account not found or access denied',
        );
      }

      // Check if another account with the same name already exists for this user (excluding current account)
      const existingAccountWithSameName = await prisma.account.findFirst({
        where: {
          name,
          userId,
          id: { not: accountId },
        },
      });

      if (existingAccountWithSameName) {
        return Send.conflict(
          res,
          { error: 'Account with this name already exists' },
          'Account with this name already exists',
        );
      }

      const updatedAccount = await prisma.account.update({
        where: { id: accountId },
        data: { name, avatar },
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      });

      // Invalidate user cache since account data has changed
      await RedisUtil.deleteCache(`user-${userId}-info`);

      return Send.success(res, { updatedAccount });
    } catch (error) {
      console.error('Error editing account: ', error);
      return Send.error(res, { error }, 'Internal server error');
    }
  };

  static deleteAccount = async (req: Request, res: Response) => {
    try {
      const accountId = parseInt(req.params.accountId);
      const userId = (req as any).userId;

      // Validate accountId
      if (isNaN(accountId)) {
        return Send.badRequest(
          res,
          { error: 'Invalid account ID' },
          'Invalid account ID',
        );
      }

      // Check the account exists and belongs to the user
      const existingAccount = await prisma.account.findFirst({
        where: { id: accountId, userId },
      });
      if (!existingAccount) {
        return Send.notFound(
          res,
          { error: 'Account not found or access denied' },
          'Account not found or access denied',
        );
      }

      // Check user has at least two accounts, if not they cannot delete the account
      const userAccountsCount = await prisma.account.count({
        where: { userId },
      });
      if (userAccountsCount <= 1) {
        return Send.badRequest(
          res,
          { error: 'User must have at least one account' },
          'User must have at least one account',
        );
      }

      const deletedAccount = await prisma.account.delete({
        where: { id: accountId },
        select: { id: true },
      });

      // Invalidate user cache since accounts have changed
      await RedisUtil.deleteCache(`user-${userId}-info`);

      return Send.success(res, { deletedAccountId: deletedAccount.id });
    } catch (error) {
      console.error('Error deleting account: ', error);
      return Send.error(res, { error }, 'Internal server error');
    }
  };
}
