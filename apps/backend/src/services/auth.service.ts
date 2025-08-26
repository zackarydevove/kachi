import Send from '@utils/response.util';
import { prisma } from '../db';
import jwt from 'jsonwebtoken';
import authConfig from '@config/auth.config';
import { Response } from 'express';

export default class AuthService {
  public static async generateTokens(
    res: Response,
    userId: number,
    email: string,
  ) {
    const accounts = await prisma.account.findMany({
      where: { userId },
      orderBy: { id: 'asc' },
      select: {
        id: true,
        name: true,
        avatar: true,
      },
    });

    if (!accounts || accounts.length === 0) {
      return Send.notFound(res, null, 'Accounts not found');
    }

    const accessToken = jwt.sign({ userId }, authConfig.secret, {
      expiresIn: authConfig.secret_expires_in as any,
    });

    const refreshToken = jwt.sign({ userId }, authConfig.refresh_secret, {
      expiresIn: authConfig.refresh_secret_expires_in as any,
    });

    await prisma.user.update({
      where: { email },
      data: { refreshToken },
    });

    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 15 * 60 * 1000,
      sameSite: 'strict',
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: 'strict',
    });

    return accounts;
  }
}
