import AuthController from '@controllers/auth.controller';
import BaseRouter, { RouteConfig } from './router';
import ValidationMiddleware from '@middlewares/validation.middleware';
import authSchema from 'schema/auth.schema';
import AuthMiddleware from '@middlewares/auth.middleware';

class AuthRouter extends BaseRouter {
  protected routes(): RouteConfig[] {
    return [
      {
        // login
        method: 'post',
        path: '/login',
        middlewares: [ValidationMiddleware.validateBody(authSchema.login)],
        handler: AuthController.login,
      },
      {
        // register
        method: 'post',
        path: '/signup',
        middlewares: [ValidationMiddleware.validateBody(authSchema.signup)],
        handler: AuthController.register,
      },
      {
        // logout
        method: 'post',
        path: '/logout',
        middlewares: [AuthMiddleware.authenticateUser],
        handler: AuthController.logout,
      },
      {
        // refresh token
        method: 'post',
        path: '/refresh-token',
        middlewares: [AuthMiddleware.refreshTokenValidation],
        handler: AuthController.refreshToken,
      },
      {
        // reset password
        method: 'put',
        path: '/reset-password',
        middlewares: [
          ValidationMiddleware.validateBody(authSchema.resetPassword),
        ],
        handler: AuthController.resetPassword,
      },
      {
        // verify reset password token
        method: 'put',
        path: '/confirm-reset-password',
        middlewares: [
          ValidationMiddleware.validateBody(authSchema.confirmResetPassword),
        ],
        handler: AuthController.confirmResetPassword,
      },
    ];
  }
}

export default new AuthRouter().router;
