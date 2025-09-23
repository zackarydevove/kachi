import BaseRouter, { RouteConfig } from '@routes/router';
import ValidationMiddleware from '@middlewares/validation.middleware';
import AuthMiddleware from '@middlewares/auth.middleware';
import TwoFactorController from '@controllers/two-factor.controller';
import twoFactorSchema from '@schema/two-factor.schema';

class TwoFactorRouter extends BaseRouter {
  protected routes(): RouteConfig[] {
    return [
      {
        // Generate 2FA
        method: 'post',
        path: '/generate',
        middlewares: [AuthMiddleware.authenticateUser],
        handler: TwoFactorController.generate2FA,
      },
      {
        // Verify 2FA
        method: 'post',
        path: '/verify',
        middlewares: [
          AuthMiddleware.authenticateUser,
          ValidationMiddleware.validateBody(twoFactorSchema.validateSchema),
        ],
        handler: TwoFactorController.verify2FA,
      },
      {
        // Login with 2FA
        method: 'post',
        path: '/login',
        middlewares: [ValidationMiddleware.validateBody(twoFactorSchema.login)],
        handler: TwoFactorController.login2FA,
      },
    ];
  }
}

export default new TwoFactorRouter().router;
