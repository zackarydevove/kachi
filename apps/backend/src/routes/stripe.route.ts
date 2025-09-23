import StripeController from '@controllers/stripe.controller';
import BaseRouter, { RouteConfig } from '@routes/router';
import AuthMiddleware from '@middlewares/auth.middleware';

class StripeRoutes extends BaseRouter {
  protected routes(): RouteConfig[] {
    return [
      {
        method: 'post',
        path: '/',
        handler: StripeController.webhookListener,
      },
      {
        method: 'get',
        path: '/invoices',
        middlewares: [AuthMiddleware.authenticateUser],
        handler: StripeController.getCustomerInvoices,
      },
    ];
  }
}
export default new StripeRoutes().router;
