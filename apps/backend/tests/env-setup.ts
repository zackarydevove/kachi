import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load .env file
dotenv.config();

// Override DATABASE_URL only for tests
if (process.env.TEST_DATABASE_URL) {
  process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;
}

// When running tests from the host machine, the docker service name `postgres`
// is not resolvable. In that case, map it to localhost so connections succeed.
if (process.env.DATABASE_URL?.includes('@postgres:')) {
  process.env.DATABASE_URL = process.env.DATABASE_URL.replace(
    '@postgres:',
    '@localhost:',
  );
}

// Ensure Redis URL points to an address reachable from the test runner
if (process.env.TEST_REDIS_URL) {
  process.env.REDIS_URL = process.env.TEST_REDIS_URL;
} else if (
  !process.env.REDIS_URL ||
  process.env.REDIS_URL.includes('redis://redis')
) {
  process.env.REDIS_URL = 'redis://localhost:6379';
}
