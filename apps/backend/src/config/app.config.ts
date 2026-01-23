import dotenv from 'dotenv';

dotenv.config();

interface Config {
  frontendUrl: string;
  frontendPort: number;
  backendPort: number;
  nodeEnv: string;
  host: string;
}

const appConfig: Config = {
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  frontendPort: Number(process.env.FRONTEND_PORT) || 3000,
  backendPort: Number(process.env.BACKEND_PORT) || 8080,
  nodeEnv: process.env.NODE_ENV || 'development',
  host: process.env.HOST || 'localhost',
};

export default appConfig;
