import dotenv from 'dotenv';

// Load .env file
dotenv.config();

// Override DATABASE_URL only for tests
if (process.env.TEST_DATABASE_URL) {
  process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;
}
