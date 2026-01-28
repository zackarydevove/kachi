import { Request, Response } from 'express';
import Send from '@utils/response.util';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import crypto from 'crypto';

export default class S3Controller {
  private static s3Client: S3Client | null = null;

  private static getS3Client(): S3Client {
    if (!this.s3Client) {
      const region = process.env.AWS_S3_REGION || 'eu-west-3';
      // No credentials needed as the SDK finds them on the EC2 automatically
      this.s3Client = new S3Client({ region });
    }
    return this.s3Client;
  }

  private static isS3Configured(): boolean {
    return !!process.env.AWS_S3_BUCKET_NAME;
  }

  static getSignedUrl = async (req: Request, res: Response) => {
    try {
      // Check if S3 is configured
      if (!this.isS3Configured()) {
        return Send.error(
          res,
          { error: 'S3 is not configured' },
          'S3 is not configured',
        );
      }

      const { fileType, fileSize } = req.body;

      // Validate file type (only images)
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!fileType || !allowedTypes.includes(fileType)) {
        return Send.badRequest(
          res,
          { error: 'Invalid file type. Only images are allowed.' },
          'Invalid file type',
        );
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (!fileSize || fileSize > maxSize) {
        return Send.badRequest(
          res,
          { error: 'File size must be less than 5MB' },
          'File size too large',
        );
      }

      // Generate unique filename (UUID)
      const fileExtension = fileType.split('/')[1];
      const fileName = `${crypto.randomUUID()}.${fileExtension}`;
      const key = `avatars/${fileName}`;

      // Generate pre-signed URL
      const bucketName = process.env.AWS_S3_BUCKET_NAME;
      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        ContentType: fileType,
        CacheControl: 'max-age=31536000',
      });

      const preSignedUrl = await getSignedUrl(this.getS3Client(), command, {
        expiresIn: 300, // 5 minutes
      });

      return Send.success(res, {
        preSignedUrl,
        key,
      });
    } catch (error) {
      console.error('Error generating signed URL:', error);
      return Send.error(res, { error }, 'Failed to generate signed URL');
    }
  };
}
