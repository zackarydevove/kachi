import express, { Express } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoutes from '@routes/auth.route';
import appConfig from '@config/app.config';
import userRoutes from '@routes/user.route';

export default class App {
  private app: Express;

  constructor() {
    this.app = express();

    this.initMiddlewares();
    this.initRoutes();
  }

  private initMiddlewares() {
    this.app.use(express.json());
    this.app.use(cookieParser());
    this.app.use(
      cors({
        origin: [
          'http://localhost:3000',
          // 'https://mywebsite.com',
        ],
        methods: ['GET', 'POST', 'DELETE'],
        credentials: true, // to get the httpOnly cookies
      }),
    );
  }

  private initRoutes() {
    this.app.use('/api/auth', authRoutes);
    this.app.use('/api/user', userRoutes);
  }

  public start() {
    const { backendPort, host } = appConfig;

    this.app.listen(backendPort, host, () => {
      console.log(`server is running on http://${host}:${backendPort}`);
    });
  }
}
