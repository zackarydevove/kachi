import AuthMiddleware from '@middlewares/auth.middleware';
import BaseRouter, { RouteConfig } from '@routes/router';
import S3Controller from '@controllers/s3.controller';

class S3Routes extends BaseRouter {
  protected routes(): RouteConfig[] {
    return [
      {
        method: 'post',
        path: '/get-signed-url',
        middlewares: [AuthMiddleware.authenticateUser],
        handler: S3Controller.getSignedUrl,
      },
    ];
  }
}

export default new S3Routes().router;
