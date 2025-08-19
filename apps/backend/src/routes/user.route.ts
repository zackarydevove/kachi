import AuthMiddleware from '@middlewares/auth.middleware';
import UserController from '@controllers/user.controller';
import BaseRouter, { RouteConfig } from './router';

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
    ];
  }
}

export default new UserRoutes().router;
