import AuthMiddleware from '@middlewares/auth.middleware';
import UserController from '@controllers/user.controller';
import BaseRouter, { RouteConfig } from './router';
import AssetController from '@controllers/asset.controller';
import ValidationMiddleware from '@middlewares/validation.middleware';
import { assetFormDataSchema } from 'schema/asset.schema';

class AssetRoutes extends BaseRouter {
  protected routes(): RouteConfig[] {
    return [
      {
        method: 'get',
        path: '/all',
        middlewares: [AuthMiddleware.authenticateUser],
        handler: AssetController.getAllAssets,
      },
      {
        method: 'post',
        path: '/',
        middlewares: [
          AuthMiddleware.authenticateUser,
          ValidationMiddleware.validateBody(assetFormDataSchema),
        ],
        handler: AssetController.createAsset,
      },
      {
        method: 'put',
        path: '/:id',
        middlewares: [
          AuthMiddleware.authenticateUser,
          ValidationMiddleware.validateBody(assetFormDataSchema),
        ],
        handler: AssetController.editAsset,
      },
      {
        method: 'delete',
        path: '/:id',
        middlewares: [AuthMiddleware.authenticateUser],
        handler: AssetController.deleteAsset,
      },
    ];
  }
}

export default new AssetRoutes().router;
