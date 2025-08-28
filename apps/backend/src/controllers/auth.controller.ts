import { Request, Response } from 'express';
import Send from '@utils/response.util';
import { prisma } from 'db';
import authSchema from 'schema/auth.schema';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import authConfig from '@config/auth.config';
import SnapshotService from 'services/snapshot.service';
import AuthService from 'services/auth.service';
import EmailService from 'services/email.service';
import { DecodedToken } from '@middlewares/auth.middleware';

// TODO: Create response schema for each
export default class AuthController {
  public static async login(req: Request, res: Response) {
    const { email, password } = req.body as z.infer<typeof authSchema.login>;

    try {
      // Check user exist
      const user = await prisma.user.findUnique({
        where: { email },
        select: {
          id: true,
          email: true,
          password: true,
          twoFactorEnabled: true,
          isVerified: true,
        },
      });
      if (!user)
        return Send.unauthorized(res, null, 'Invalid email or password');

      // Check password valid
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid)
        return Send.unauthorized(res, null, 'Invalid email or password.'); // Don't send only password otherwise it gives information for hackers

      if (!user.isVerified)
        return Send.unauthorized(
          res,
          null,
          `Your email isn't verified. Please verify your account to log in.`,
        );

      if (user.twoFactorEnabled) {
        return Send.success(
          res,
          {
            user: {
              id: user.id,
              email: user.email,
              twoFactorEnabled: user.twoFactorEnabled,
            },
          },
          '2FA is enabled for this account',
        );
      }

      const accounts = await AuthService.generateTokens(
        res,
        user.id,
        user.email,
      );

      return Send.success(res, {
        user: {
          id: user.id,
          email: user.email,
          twoFactorEnabled: user.twoFactorEnabled,
        },
        accounts,
      });
    } catch (error) {
      console.error('Login Failed:', error);
      return Send.error(res, null, 'Login failed.');
    }
  }

  // TODO: Use transaction to avoid creating user if account fail
  public static async register(req: Request, res: Response) {
    const { email, name, password, confirmPassword } = req.body as z.infer<
      typeof authSchema.signup
    >;

    try {
      // Check if user credentials already exist
      const existingUser = await prisma.user.findUnique({
        where: { email },
        select: { isVerified: true },
      });
      if (existingUser) {
        return Send.conflict(
          res,
          { isVerified: existingUser.isVerified },
          'Email is already in use',
        );
      }

      // Check if password match (but should already check in schema middleware)
      if (password != confirmPassword) {
        return Send.badRequest(res, null, 'Passwords are not matching');
      }
      const hashedPassword = await bcrypt.hash(password, 10);

      const data = await prisma.$transaction(async (tx) => {
        const newUser = await tx.user.create({
          data: {
            email,
            password: hashedPassword,
          },
          select: { id: true, email: true },
        });

        const newAccount = await tx.account.create({
          data: {
            name,
            userId: newUser.id,
            avatar: '/avatars/shadcn.jpg',
          },
          select: { id: true, name: true, avatar: true },
        });

        const snapshotService = new SnapshotService();
        await snapshotService.initializeAccountSnapshots(newAccount.id, tx);

        return {
          user: {
            id: newUser.id,
            email: newUser.email,
          },
          accounts: [
            {
              id: newAccount.id,
              name: newAccount.name,
              avatar: newAccount.avatar,
            },
          ],
        };
      });

      await AuthService.sendVerificationEmail(data.user.id, data.user.email);

      return Send.success(
        res,
        data,
        'User successfully registered. Please verify your email to log in.',
      );
    } catch (error) {
      console.error('Registration failed:', error);
      return Send.error(res, null, 'Registration failed.');
    }
  }

  public static async verifyEmail(req: Request, res: Response) {
    const { token } = req.body;

    try {
      const decoded = jwt.verify(
        token,
        authConfig.verification_secret,
      ) as DecodedToken;
      if (!decoded) return Send.unauthorized(res, null, 'Invalid token');

      const user = await prisma.user.findUnique({
        where: { id: decoded.userId as number },
      });
      if (!user) return Send.notFound(res, null, 'User not found');

      if (user.isVerified)
        return Send.success(res, null, 'Email already verified');

      await prisma.user.update({
        where: { id: user.id },
        data: {
          isVerified: true,
        },
      });

      return Send.success(res, null, 'Email verified successfully');
    } catch (error) {
      console.error('Verify email failed:', error);
      return Send.error(res, null, 'Verify email failed.');
    }
  }

  public static async resendVerificationEmail(req: Request, res: Response) {
    const { email } = req.body;
    try {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) return Send.notFound(res, null, 'User not found');

      if (user.isVerified)
        return Send.success(res, null, 'Email already verified');

      await AuthService.sendVerificationEmail(user.id, user.email);

      return Send.success(res, null, 'Verification email sent');
    } catch (error) {
      console.error('Resend verification email failed:', error);
      return Send.error(res, null, 'Resend verification email failed.');
    }
  }

  public static async logout(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;
      if (userId) {
        await prisma.user.update({
          where: { id: userId },
          data: { refreshToken: null },
        });
      }

      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');

      return Send.success(res, null, 'Logged out successfully.');
    } catch (error) {
      console.error('Logout failed:', error);
      return Send.error(res, null, 'Logout failed.');
    }
  }

  public static async refreshToken(req: Request, res: Response) {
    try {
      const userId = (req as any).userId; // Get userId from the refreshTokenValidation middleware
      const refreshToken = req.cookies.refreshToken; // Get the refresh token from cookies

      // Check if the refresh token has been revoked
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user || !user.refreshToken) {
        return Send.unauthorized(res, 'Refresh token not found');
      }

      // Check if the refresh token in the database matches the one from the client
      if (user.refreshToken !== refreshToken) {
        return Send.unauthorized(res, { message: 'Invalid refresh token' });
      }

      // Generate a new access token
      const newAccessToken = jwt.sign({ userId: user.id }, authConfig.secret, {
        expiresIn: authConfig.secret_expires_in as any,
      });

      // Generate a new refresh token
      const newRefreshToken = jwt.sign(
        { userId: user.id },
        authConfig.refresh_secret,
        { expiresIn: authConfig.refresh_secret_expires_in as any },
      );

      await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken: newRefreshToken },
      });

      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');

      // Send the new access token in the response
      res.cookie('accessToken', newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 15 * 60 * 1000, // 15 minutes
        sameSite: 'strict',
      });

      // Idem new refresh token to reset inactive period
      res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: 'strict',
      });

      return Send.success(res, {
        message: 'Access token refreshed successfully',
      });
    } catch (error) {
      console.error('Refresh Token failed:', error);
      return Send.error(res, null, 'Failed to refresh token');
    }
  }

  public static async resetPassword(req: Request, res: Response) {
    const { email } = req.body;
    try {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user)
        return Send.notFound(
          res,
          null,
          'An email has been sent to reset your password', // To avoid leaking information
        );

      const resetToken = jwt.sign(
        { userId: user.id },
        authConfig.reset_password_secret,
        {
          expiresIn: authConfig.reset_password_secret_expires_in as any,
        },
      );

      const resetLink = `${process.env.FRONTEND_URL}/password/reset?token=${resetToken}`;
      const emailService = new EmailService();
      await emailService.sendResetPasswordEmail(user.email, resetLink);

      return Send.success(
        res,
        null,
        'An email has been sent to reset your password',
      );
    } catch (error) {
      console.error('Reset password failed:', error);
      return Send.error(res, null, 'Reset password failed.');
    }
  }

  public static async confirmResetPassword(req: Request, res: Response) {
    const { token, newPassword } = req.body;

    try {
      const decoded = jwt.verify(
        token,
        authConfig.reset_password_secret,
      ) as DecodedToken;
      if (!decoded) return Send.unauthorized(res, null, 'Invalid token');

      const user = await prisma.user.findUnique({
        where: { id: decoded.userId as number },
      });
      if (!user) return Send.notFound(res, null, 'User not found');

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await prisma.user.update({
        where: { id: user.id },
        data: {
          password: hashedPassword,
        },
      });

      return Send.success(res, null, 'Password reset successfully');
    } catch (error) {
      console.error('Confirm reset password failed:', error);
      return Send.error(res, null, 'Confirm reset password failed.');
    }
  }
}
