import Send from '@utils/response.util';
import { prisma } from 'db';
import { Request, Response } from 'express';
import { send } from 'process';

export default class UserController {
  static getUser = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).userId;

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
        },
      });

      if (!user) {
        return Send.notFound(res, {}, 'User not found');
      }

      const accounts = await prisma.account.findMany({
        where: { userId: user.id },
        orderBy: { id: 'asc' },
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      });
      if (!accounts) return Send.notFound(res, {}, 'Accounts not found');

      const data = {
        user,
        accounts,
      };

      return Send.success(res, data);
    } catch (error) {
      console.error('Error fetching user info:', error);
      return Send.error(res, {}, 'Internal server error');
    }
  };

  static deleteUser = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).userId;

      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) return Send.notFound(res, {}, 'User not found');

      await prisma.user.delete({
        where: { id: userId },
      });

      return Send.success(res, {}, 'User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      return Send.error(res, {}, 'Internal server error');
    }
  };
}
