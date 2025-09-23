import AuthMiddleware from '@middlewares/auth.middleware';
import UserController from '@controllers/user.controller';
import BaseRouter, { RouteConfig } from '@routes/router';
import userSchema from '@schema/user.schema';
import ValidationMiddleware from '@middlewares/validation.middleware';

class UserRoutes extends BaseRouter {
  protected routes(): RouteConfig[] {
    return [
      {
        method: 'get',
        path: '/',
        middlewares: [AuthMiddleware.authenticateUser],
        handler: UserController.getUser,
      },
      {
        method: 'delete',
        path: '/',
        middlewares: [AuthMiddleware.authenticateUser],
        handler: UserController.deleteUser,
      },
      {
        method: 'put',
        path: '/password',
        middlewares: [
          AuthMiddleware.authenticateUser,
          ValidationMiddleware.validateBody(userSchema.updatePassword),
        ],
        handler: UserController.updatePassword,
      },
    ];
  }
}

export default new UserRoutes().router;
