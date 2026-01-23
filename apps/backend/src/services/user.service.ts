import RedisUtil from '@utils/redis.util';
import { prisma } from '@db';

export default class UserService {
  static async getUserAndAccounts(userId: number) {
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
      throw 'User not found';
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
    if (!accounts) throw 'Accounts not found';

    return {
      user: {
        id: user.id,
        email: user.email,
        twoFactorEnabled: user.twoFactorEnabled,
        hasPassword: !!user.password,
        isPro: user.isPro,
      },
      accounts,
    };
  }

  static async setUserAndAccountsCache(userId: number) {
    const data = await RedisUtil.setCache(`user-${userId}-info`, async () => {
      return await this.getUserAndAccounts(userId);
    });

    return data;
  }

  static async getOrSetUserAndAccountsCache(userId: number) {
    const data = await RedisUtil.getOrSetCache(
      `user-${userId}-info`,
      async () => {
        return await this.getUserAndAccounts(userId);
      },
    );

    return data;
  }
}
