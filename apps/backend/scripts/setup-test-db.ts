import { execSync } from 'child_process';
import * as dotenv from 'dotenv';
import * as path from 'path';
import fs from 'fs';

// Load environment variables from the backend .env file
dotenv.config({ path: path.join(__dirname, '../.env') });

const rawTestDbUrl = process.env.TEST_DATABASE_URL;
if (!rawTestDbUrl) {
  console.error('❌ TEST_DATABASE_URL not found');
  process.exit(1);
}

let databaseUrl: URL;
try {
  databaseUrl = new URL(rawTestDbUrl);
} catch {
  console.error('❌ Invalid TEST_DATABASE_URL format');
  process.exit(1);
}

// If the tests are executed from the host machine (not inside a container),
// replace the docker service hostname with localhost so the connection works.
const runningInsideDocker = fs.existsSync('/.dockerenv');
if (!runningInsideDocker && databaseUrl.hostname === 'postgres') {
  databaseUrl.hostname = 'localhost';
}

console.log(`🔧 Using test database URL: ${databaseUrl.toString()}`);

try {
  const backendRoot = path.join(__dirname, '..');

  // Prisma will create the database if it does not exist when migrate deploy runs
  console.log('🔄 Running prisma migrate deploy...');
  execSync('npx prisma migrate deploy --schema=./prisma/schema.prisma', {
    env: { DATABASE_URL: databaseUrl.toString() },
    stdio: 'inherit',
    cwd: backendRoot,
  });

  console.log('✅ Test database ready');
} catch (error: any) {
  console.error('❌ Error setting up test database:', error.message);
  process.exit(1);
}
