import AuthMiddleware from '@middlewares/auth.middleware';
import BaseRouter, { RouteConfig } from './router';
import PlaidController from '@controllers/plaid.controller';
import ValidationMiddleware from '@middlewares/validation.middleware';
import z from 'zod';

class PlaidRouter extends BaseRouter {
  protected routes(): RouteConfig[] {
    return [
      {
        method: 'get',
        path: '/generate-link-token/:accountId',
        middlewares: [
          AuthMiddleware.authenticateUser,
          AuthMiddleware.authenticateAccount,
          AuthMiddleware.authenticatePro,
        ],
        handler: PlaidController.generateLinkToken,
      },
      {
        method: 'put',
        path: '/set-access-token',
        middlewares: [
          AuthMiddleware.authenticateUser,
          AuthMiddleware.authenticateAccount,
          AuthMiddleware.authenticatePro,
          ValidationMiddleware.validateBody(
            z.object({
              publicTokenFromClient: z.string().min(1, 'Password is required'),
              accountId: z.number().min(1, 'Account ID is required'),
            }),
          ),
        ],
        handler: PlaidController.exchangePublicToken,
      },
    ];
  }
}

export default new PlaidRouter().router;
