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
          { error: 'Account already exists' },
          'Account already exists',
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
}
