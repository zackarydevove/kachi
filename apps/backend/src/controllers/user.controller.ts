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
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!user) {
        return Send.notFound(res, {}, 'User not found');
      }

      return Send.success(res, { user });
    } catch (error) {
      console.error('Error fetching user info:', error);
      return Send.error(res, {}, 'Internal server error');
    }
  };
}
