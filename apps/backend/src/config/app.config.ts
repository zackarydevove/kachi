import dotenv from 'dotenv';

dotenv.config();

interface Config {
  frontendPort: number;
  backendPort: number;
  nodeEnv: string;
  host: string;
}

const appConfig: Config = {
  frontendPort: Number(process.env.FRONTEND_PORT) || 3000,
  backendPort: Number(process.env.BACKEND_PORT) || 8080,
  nodeEnv: process.env.NODE_ENV || 'development',
  host: process.env.HOST || 'localhost',
};

export default appConfig;
