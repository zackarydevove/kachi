import { OAuth2Client } from 'google-auth-library';
import { prisma } from '../db';
import AuthService from './auth.service';
import { Response } from 'express';
import SnapshotService from './snapshot.service';

interface GoogleUserInfo {
  id: string;
  email: string;
  name: string;
  picture: string;
}

export default class GoogleOAuthService {
  private static oauth2Client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI,
  );

  public static getAuthUrl(): string {
    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
      ],
      prompt: 'consent',
    });
  }

  public static async handleCallback(code: string, res: Response) {
    try {
      // Exchange authorization code for tokens
      const { tokens } = await this.oauth2Client.getToken(code);

      if (!tokens.access_token) {
        throw new Error('Failed to get access token from Google');
      }

      // Get user info from Google
      const userInfo = await this.getGoogleUserInfo(tokens.access_token);

      // Check if user exists
      let user = await prisma.user.findUnique({
        where: { email: userInfo.email },
        select: {
          id: true,
          email: true,
          googleId: true,
          password: true,
          isVerified: true,
          twoFactorEnabled: true,
          isPro: true,
        },
      });

      if (user) {
        // Existing user - update googleId if not already set
        if (!user.googleId) {
          await prisma.user.update({
            where: { id: user.id },
            data: { googleId: userInfo.id },
          });
          user.googleId = userInfo.id;
        }
      } else {
        // New user - create with Google info
        const data = await prisma.$transaction(async (tx) => {
          const newUser = await tx.user.create({
            data: {
              email: userInfo.email,
              googleId: userInfo.id,
              isVerified: true, // Google users are pre-verified
            },
            select: { id: true, email: true, googleId: true, isVerified: true },
          });

          const newAccount = await tx.account.create({
            data: {
              name: userInfo.name || 'My Account',
              userId: newUser.id,
              avatar: userInfo.picture || '/avatars/shadcn.jpg',
            },
            select: { id: true, name: true, avatar: true },
          });

          const snapshotService = new SnapshotService();
          await snapshotService.initializeAccountSnapshots(newAccount.id, tx);

          return {
            user: newUser,
            accounts: [newAccount],
          };
        });

        // Update the user variable with the complete user data
        user = {
          id: data.user.id,
          email: data.user.email,
          googleId: data.user.googleId,
          password: null, // Google users don't have passwords
          isVerified: data.user.isVerified,
          twoFactorEnabled: false, // New Google users start with 2FA disabled
          isPro: false,
        };
      }

      // Ensure user exists and has required fields
      if (!user) {
        throw new Error('Failed to create or retrieve user');
      }

      // Generate JWT tokens (same as regular login)
      const accounts = await AuthService.generateTokens(
        res,
        user.id,
        user.email,
      );

      return {
        user: {
          id: user.id,
          email: user.email,
          twoFactorEnabled: user.twoFactorEnabled || false,
          isPro: user.isPro,
        },
        accounts,
      };
    } catch (error) {
      console.error('Google OAuth callback failed:', error);
      throw error;
    }
  }

  private static async getGoogleUserInfo(
    accessToken: string,
  ): Promise<GoogleUserInfo> {
    const response = await fetch(
      `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`,
    );

    if (!response.ok) {
      throw new Error('Failed to fetch user info from Google');
    }

    return response.json();
  }
}
