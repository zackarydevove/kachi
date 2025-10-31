import { execSync } from 'child_process';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const dbUrl = process.env.TEST_DATABASE_URL;
if (!dbUrl) {
  console.error('❌ TEST_DATABASE_URL not found');
  process.exit(1);
}

// Parse database URL (handle query parameters like ?schema=public)
const urlMatch = dbUrl.match(
  /postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/([^?]+)/,
);
if (!urlMatch) {
  console.error('❌ Invalid DATABASE_URL format');
  process.exit(1);
}

const [, username, password, host, port, database] = urlMatch;

console.log('🔧 Setting up test database:', database);

try {
  console.log('📦 Checking if test database exists...');
  const checkCmd = `docker-compose exec -T postgres psql -U ${username} -d postgres -tc "SELECT 1 FROM pg_database WHERE datname = '${database}'"`;
  const result = execSync(checkCmd, { encoding: 'utf-8', stdio: 'pipe' });
  const exists = result.trim().includes('1');

  if (!exists) {
    console.log('📦 Creating test database...');
    const createCmd = `docker-compose exec -T postgres psql -U ${username} -d postgres -c "CREATE DATABASE \\"${database}\\""`;
    execSync(createCmd, { stdio: 'inherit' });
    console.log('✅ Test database created');
  } else {
    console.log('✅ Test database already exists');
  }

  // Run migrations
  // If running from host, replace 'postgres' hostname with 'localhost' for Prisma
  // (Docker service names only work inside Docker containers)
  let migrationDbUrl = dbUrl;
  if (host === 'postgres') {
    // Reconstruct URL with localhost instead of postgres
    const queryParams = dbUrl.includes('?') ? dbUrl.split('?')[1] : '';
    migrationDbUrl = `postgresql://${username}:${password}@localhost:${port}/${database}${queryParams ? '?' + queryParams : ''}`;
  }

  console.log('🔄 Running migrations...');
  const backendRoot = path.join(__dirname, '..');
  execSync('npx prisma migrate deploy --schema=./prisma/schema.prisma', {
    env: { ...process.env, DATABASE_URL: migrationDbUrl },
    stdio: 'inherit',
    cwd: backendRoot,
  });

  console.log('✅ Test database setup complete!');
} catch (error: any) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
