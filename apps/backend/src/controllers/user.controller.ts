import Send from '@utils/response.util';
import { prisma } from 'db';
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';

export default class UserController {
  static getUser = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).userId;

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          twoFactorEnabled: true,
          password: true,
          isPro: true,
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
        user: {
          id: user.id,
          email: user.email,
          twoFactorEnabled: user.twoFactorEnabled,
          hasPassword: !!user.password,
          isPro: user.isPro,
        },
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

  static updatePassword = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).userId;

      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) return Send.notFound(res, {}, 'User not found');

      const { currentPassword, newPassword, confirmNewPassword } = req.body;

      if (currentPassword === newPassword)
        return Send.badRequest(
          res,
          {},
          'New password cannot be the same as the current password',
        );

      if (newPassword !== confirmNewPassword)
        return Send.badRequest(res, {}, 'Passwords do not match');

      // Check if user has a password (Google OAuth users won't, so they can create a new password)
      const isPasswordValid = user.password
        ? await bcrypt.compare(currentPassword, user.password)
        : true;

      if (!isPasswordValid)
        return Send.badRequest(res, {}, 'Invalid current password');

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword },
      });

      return Send.success(res, {}, 'Password updated successfully');
    } catch (error) {
      console.error('Error updating password:', error);
      return Send.error(res, {}, 'Internal server error');
    }
  };
}
