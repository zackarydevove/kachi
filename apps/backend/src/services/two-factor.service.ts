import * as speakeasy from 'speakeasy';
import * as QRCode from 'qrcode';
import * as crypto from 'crypto';
import twoFactorConfig from '@config/two-factor.config';

export default class TwoFactorService {
  public encryptTwoFactorSecret(secret: string): string {
    const key = crypto.scryptSync(twoFactorConfig.secretKey, 'salt', 32);
    const iv = crypto.randomBytes(twoFactorConfig.ivLength);

    const cipher = crypto.createCipheriv(twoFactorConfig.algorithm, key, iv);
    let encrypted = cipher.update(secret, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return iv.toString('hex') + ':' + encrypted;
  }

  public decryptTwoFactorSecret(encryptedSecret: string): string {
    const key = crypto.scryptSync(twoFactorConfig.secretKey, 'salt', 32);

    const parts = encryptedSecret.split(':');
    const iv = Buffer.from(parts[0], 'hex');
    const encrypted = parts[1];

    const decipher = crypto.createDecipheriv(
      twoFactorConfig.algorithm,
      key,
      iv,
    );
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }

  public generateTwoFactorSecret(): string {
    // Generate a proper base32 secret for TOTP
    const secret = speakeasy.generateSecret({
      name: 'Kachi Portfolio',
      length: 32,
    });

    if (!secret.base32) {
      throw new Error('Failed to generate valid base32 secret');
    }

    return secret.base32;
  }

  public async generateTwoFactorQRCode(
    secret: string,
    email: string,
  ): Promise<string> {
    // Ensure secret is valid base32
    if (!this.isValidBase32(secret)) {
      throw new Error('Invalid base32 secret provided for QR code generation');
    }

    // Manually construct the otpauth URL to prevent speakeasy from modifying the secret
    const otpauthUrl = `otpauth://totp/${encodeURIComponent(email)}?secret=${secret}&issuer=${encodeURIComponent('Kachi Portfolio')}&algorithm=SHA1&digits=6`;

    const qrCode = await QRCode.toDataURL(otpauthUrl);

    return qrCode;
  }

  public validateTwoFactorOTP(secret: string, token: string): boolean {
    // Ensure secret is valid base32
    if (!this.isValidBase32(secret)) {
      console.error('Invalid base32 secret provided for OTP validation');
      return false;
    }

    const result = speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token,
      window: 2, // Allow 2 time step tolerance (60 seconds total)
      algorithm: 'sha1',
      digits: 6,
    });

    return result;
  }

  public generateCurrent2FAOTP(secret: string): string {
    if (!this.isValidBase32(secret)) {
      throw new Error('Invalid base32 secret provided for OTP generation');
    }

    return speakeasy.totp({
      secret,
      encoding: 'base32',
      digits: 6,
      algorithm: 'sha1',
    });
  }

  private isValidBase32(str: string): boolean {
    // Base32 regex: only allows A-Z, 2-7, and =
    const base32Regex = /^[A-Z2-7]+=*$/;
    return base32Regex.test(str);
  }
}
