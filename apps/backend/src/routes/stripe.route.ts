import StripeController from '@controllers/stripe.controller';
import BaseRouter, { RouteConfig } from './router';
import AuthMiddleware from '@middlewares/auth.middleware';

class StripeRoutes extends BaseRouter {
  protected routes(): RouteConfig[] {
    return [
      {
        method: 'post',
        path: '/',
        handler: StripeController.webhookListener,
      },
    ];
  }
}
export default new StripeRoutes().router;
