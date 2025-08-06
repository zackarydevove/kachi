import Send from '@utils/response.util';
import { prisma } from 'db';
import { Request, Response } from 'express';

export default class AccountController {
  static addAccount = async (req: Request, res: Response) => {
    try {
      const { name, avatar } = req.body;
      const userId = (req as any).userId;

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

      const newAccount = await prisma.account.create({
        data: { name, avatar, userId },
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      });

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

      return Send.success(res, { updatedAccount });
    } catch (error) {
      console.error('Error editing account: ', error);
      return Send.error(res, { error }, 'Internal server error');
    }
  };
}
