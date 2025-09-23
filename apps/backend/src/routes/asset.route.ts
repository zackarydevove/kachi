import AuthMiddleware from '@middlewares/auth.middleware';
import BaseRouter, { RouteConfig } from '@routes/router';
import AssetController from '@controllers/asset.controller';
import ValidationMiddleware from '@middlewares/validation.middleware';
import { assetRequestSchema } from 'schema/asset.schema';
import { z } from 'zod';
import AssetMiddleware from '@middlewares/asset.middleware';

class AssetRoutes extends BaseRouter {
  protected routes(): RouteConfig[] {
    return [
      {
        method: 'get',
        path: '/all/:accountId',
        middlewares: [
          AuthMiddleware.authenticateUser,
          AuthMiddleware.authenticateAccount,
        ],
        handler: AssetController.getAllAssets,
      },
      {
        method: 'post',
        path: '/',
        middlewares: [
          AuthMiddleware.authenticateUser,
          ValidationMiddleware.validateBody(assetRequestSchema),
          AuthMiddleware.authenticateAccount,
        ],
        handler: AssetController.createAsset,
      },
      {
        method: 'put',
        path: '/:assetId',
        middlewares: [
          AuthMiddleware.authenticateUser,
          ValidationMiddleware.validateBody(assetRequestSchema),
          AuthMiddleware.authenticateAccount,
          AssetMiddleware.authenticateAccountOwnAsset,
        ],
        handler: AssetController.editAsset,
      },
      {
        method: 'delete',
        path: '/:assetId',
        middlewares: [
          AuthMiddleware.authenticateUser,
          ValidationMiddleware.validateBody(
            z.object({ accountId: z.number() }),
          ),
          AuthMiddleware.authenticateAccount,
          AssetMiddleware.authenticateAccountOwnAsset,
        ],
        handler: AssetController.deleteAsset,
      },
    ];
  }
}

export default new AssetRoutes().router;
