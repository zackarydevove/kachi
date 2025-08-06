import ValidationMiddleware from '@middlewares/validation.middleware';
import BaseRouter, { RouteConfig } from './router';
import AccountController from '@controllers/account.controller';
import { accountFormSchema } from 'schema/account.schema';
import AuthMiddleware from '@middlewares/auth.middleware';

class AccountRoutes extends BaseRouter {
  protected routes(): RouteConfig[] {
    return [
      {
        method: 'post',
        path: '/',
        middlewares: [
          AuthMiddleware.authenticateUser,
          ValidationMiddleware.validateBody(accountFormSchema),
        ],
        handler: AccountController.addAccount,
      },
    ];
  }
}
export default new AccountRoutes().router;
