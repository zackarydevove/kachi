// not sure if this is useful
import dotenv from 'dotenv';

dotenv.config();

interface Config {
  port: number;
  nodeEnv: string;
}

const config: Config = {
  port: Number(process.env.BACKEND_PORT) || 8080,
  nodeEnv: process.env.NODE_ENV || 'development',
};

export default config;
