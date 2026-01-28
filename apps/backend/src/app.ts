import express, { Express } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoutes from '@routes/auth.route';
import appConfig from '@config/app.config';
import userRoutes from '@routes/user.route';
import accountRoutes from '@routes/account.route';
import assetRoutes from '@routes/asset.route';
import twoFactorRoutes from '@routes/two-factor.route';
import stripeRoutes from '@routes/stripe.route';
import plaidRoutes from '@routes/plaid.route';
import s3Routes from '@routes/s3.route';

export default class App {
  public app: Express;

  constructor() {
    this.app = express();

    this.initMiddlewares();
    this.initRoutes();
  }

  private initMiddlewares() {
    this.app.use(
      express.json({
        // Need rawBody for stripe webhook
        verify(req, res, buf) {
          if ((req as any).path.includes('stripe')) {
            (req as any).rawBody = buf.toString(); // sets raw string in req.rawBody variable
          }
        },
      }),
    );
    this.app.use(cookieParser());
    this.app.use(
      cors({
        origin: [appConfig.frontendUrl],
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true, // to get the httpOnly cookies
      }),
    );
  }

  private initRoutes() {
    this.app.get('/health', (req, res) => {
      res.status(200).send('OK - Backend is running');
    });
    this.app.use('/api/auth', authRoutes);
    this.app.use('/api/user', userRoutes);
    this.app.use('/api/account', accountRoutes);
    this.app.use('/api/asset', assetRoutes);
    this.app.use('/api/2fa', twoFactorRoutes);
    this.app.use('/api/stripe', stripeRoutes);
    this.app.use('/api/plaid', plaidRoutes);
    this.app.use('/api/s3', s3Routes);
  }

  public start() {
    const { backendPort, host } = appConfig;

    this.app.listen(backendPort, host, () => {
      console.log(`server is running on http://${host}:${backendPort}`);
    });
  }
}
