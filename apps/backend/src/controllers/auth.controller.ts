import { Request, Response } from 'express';
import Send from '@utils/response.util';
import { prisma } from 'db';
import authSchema from 'schema/auth.schema';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import authConfig from '@config/auth.config';
import { DecodedToken } from '@middlewares/auth.middleware';

export default class AuthController {
  public static async login(req: Request, res: Response) {
    const { email, password } = req.body as z.infer<typeof authSchema.login>;

    try {
      // Check user exist
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user)
        return Send.unauthorized(res, null, 'Invalid email or password');

      // Check password valid
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid)
        return Send.unauthorized(res, null, 'Invalid email or password.'); // Don't send only password otherwise it gives information for hackers

      const accessToken = jwt.sign({ userId: user.id }, authConfig.secret, {
        expiresIn: authConfig.secret_expires_in as any,
      });

      const refreshToken = jwt.sign(
        { userId: user.id },
        authConfig.refresh_secret,
        { expiresIn: authConfig.refresh_secret_expires_in as any },
      );

      await prisma.user.update({
        where: { email },
        data: { refreshToken },
      });

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

      return Send.success(res, {
        user: {
          id: user.id,
          email: user.email,
        },
      });
    } catch (error) {
      console.error('Login Failed:', error);
      return Send.error(res, null, 'Login failed.');
    }
  }

  public static async register(req: Request, res: Response) {
    const { email, password, confirmPassword } = req.body as z.infer<
      typeof authSchema.signup
    >;

    try {
      // Check if user credentials already exist
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return Send.conflict(res, null, 'Email is already in use.');
      }

      // Check if password match (but should already check in schema middleware)
      if (password != confirmPassword) {
        return Send.badRequest(res, null, 'Passwords are not matching');
      }
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
        },
      });

      return Send.success(
        res,
        {
          id: newUser.id,
          email: newUser.email,
        },
        'User successfully registered.',
      );
    } catch (error) {
      console.error('Registration failed:', error);
      return Send.error(res, null, 'Registration failed.');
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

      console.log('user: ', user);
      console.log('refreshToken: ', refreshToken);

      if (!user || !user.refreshToken) {
        return Send.unauthorized(res, 'Refresh token not found');
      }

      console.log('user.refreshToken', user.refreshToken);

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
}
