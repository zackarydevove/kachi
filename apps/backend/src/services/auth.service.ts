import Send from '@utils/response.util';
import { prisma } from '@db';
import jwt from 'jsonwebtoken';
import authConfig from '@config/auth.config';
import { Response } from 'express';
import EmailService from '@services/email.service';

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
      secure: true,
      maxAge: 15 * 60 * 1000,
      sameSite: 'none',
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: 'none',
    });

    return accounts;
  }

  public static async sendVerificationEmail(userId: number, email: string) {
    const verificationToken = jwt.sign(
      { userId: userId },
      authConfig.verification_secret,
      {
        expiresIn: authConfig.verification_secret_expires_in as any,
      },
    );

    const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
    const emailService = new EmailService();
    await emailService.sendVerificationEmail(email, verificationLink);
  }
}
