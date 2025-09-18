import { Request, Response } from 'express';
import authConfig from '../config/auth.config';
import Send from '../utils/response.util';
import { prisma } from '../db';
import * as jwt from 'jsonwebtoken';
import TwoFactorService from '../services/two-factor.service';
import AuthService from 'services/auth.service';

export default class TwoFactorController {
  private static twoFactorService = new TwoFactorService();

  /**
   * Generate 2FA setup - creates secret, encrypts it, stores in DB, and returns QR code
   */
  static generate2FA = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).userId;

      // Check if user exists and doesn't already have 2FA enabled
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          twoFactorSecret: true,
          twoFactorEnabled: true,
        },
      });

      if (!user) {
        return Send.notFound(res, {}, 'User not found');
      }

      if (user.twoFactorEnabled) {
        return Send.badRequest(res, {}, '2FA is already enabled for this user');
      }

      let secret: string;

      // If no secret exists, generate new one
      if (!user.twoFactorSecret) {
        secret = this.twoFactorService.generateTwoFactorSecret();
        const encryptedSecret =
          this.twoFactorService.encryptTwoFactorSecret(secret);

        // Store the encrypted secret temporarily (user needs to validate OTP to enable)
        await prisma.user.update({
          where: { id: userId },
          data: { twoFactorSecret: encryptedSecret },
        });
      } else {
        // Decrypt existing secret for QR code generation
        secret = this.twoFactorService.decryptTwoFactorSecret(
          user.twoFactorSecret,
        );
      }

      // Generate QR code
      const qrCodeDataUrl = await this.twoFactorService.generateTwoFactorQRCode(
        secret,
        user.email,
      );

      return Send.success(res, {
        qrCode: qrCodeDataUrl,
      });
    } catch (error) {
      console.error('Error generating 2FA:', error);
      return Send.error(res, {}, 'Failed to generate 2FA setup');
    }
  };

  /**
   * Verify 2FA OTP and enable 2FA for user
   */
  static verify2FA = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).userId;
      const { otp } = req.body;

      if (!otp || otp.length !== 6) {
        return Send.badRequest(
          res,
          {},
          'Please enter a valid 6-digit OTP code',
        );
      }

      // Get user with encrypted secret
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, twoFactorSecret: true, twoFactorEnabled: true },
      });

      if (!user) {
        return Send.notFound(res, {}, 'User not found');
      }

      if (user.twoFactorEnabled) {
        return Send.badRequest(res, {}, '2FA is already enabled for this user');
      }

      if (!user.twoFactorSecret) {
        return Send.badRequest(
          res,
          {},
          '2FA setup not initiated. Please generate QR code first.',
        );
      }

      // Decrypt the secret
      const decryptedSecret = this.twoFactorService.decryptTwoFactorSecret(
        user.twoFactorSecret,
      );
      const currentOTP =
        this.twoFactorService.generateCurrent2FAOTP(decryptedSecret);

      // Validate OTP
      const isValid = this.twoFactorService.validateTwoFactorOTP(
        decryptedSecret,
        otp,
      );

      if (!isValid) {
        return Send.badRequest(res, {}, 'Invalid OTP code. Please try again.');
      }

      // Enable 2FA for user
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          twoFactorEnabled: true,
          // Keep the encrypted secret for future OTP validation
        },
        select: {
          id: true,
          twoFactorEnabled: true,
        },
      });

      return Send.success(res, { user: updatedUser });
    } catch (error) {
      console.error('Error verifying 2FA:', error);
      return Send.error(res, {}, 'Failed to verify 2FA code');
    }
  };

  /**
   * Complete login for users with 2FA enabled
   */
  static login2FA = async (req: Request, res: Response) => {
    try {
      const { email, otp } = req.body;

      if (!email || !otp) {
        return Send.badRequest(res, null, 'Email and OTP are required');
      }

      if (otp.length !== 6) {
        return Send.badRequest(res, null, 'OTP must be exactly 6 digits');
      }

      // Find user and check if 2FA is enabled
      const user = await prisma.user.findUnique({
        where: { email },
        select: {
          id: true,
          email: true,
          twoFactorSecret: true,
          twoFactorEnabled: true,
        },
      });

      if (!user) {
        return Send.unauthorized(res, null, 'Invalid email or password');
      }

      if (!user.twoFactorEnabled) {
        return Send.unauthorized(
          res,
          null,
          '2FA is not enabled for this account',
        );
      }

      if (!user.twoFactorSecret) {
        return Send.unauthorized(res, null, '2FA secret not found');
      }

      // Decrypt the secret and validate OTP
      const decryptedSecret = this.twoFactorService.decryptTwoFactorSecret(
        user.twoFactorSecret,
      );
      const isValid = this.twoFactorService.validateTwoFactorOTP(
        decryptedSecret,
        otp,
      );

      if (!isValid) {
        return Send.unauthorized(res, null, 'Invalid OTP code');
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
      console.error('2FA Login Failed:', error);
      return Send.error(res, null, '2FA login failed');
    }
  };
}
