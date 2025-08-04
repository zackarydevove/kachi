import AuthMiddleware from '@middlewares/auth.middleware';
import UserController from '@controllers/user.controller';
import BaseRouter, { RouteConfig } from './router';
import AssetController from '@controllers/asset.controller';

class AssetRoutes extends BaseRouter {
  protected routes(): RouteConfig[] {
    return [
      {
        method: 'get',
        path: '/all',
        middlewares: [AuthMiddleware.authenticateUser],
        handler: AssetController.getAllAssets,
      },
    ];
  }
}

export default new AssetRoutes().router;
