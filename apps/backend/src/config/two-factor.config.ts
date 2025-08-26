const twoFactorConfig = {
  secretKey: process.env.TWO_FACTOR_SECRET_KEY as string,
  algorithm: 'aes-256-cbc',
  ivLength: 16,
};

export default twoFactorConfig;
