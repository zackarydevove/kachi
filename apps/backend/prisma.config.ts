import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    // Dummy to bypass error during build as app runner doesn't have env yet
    url:
      env('DATABASE_URL') || 'postgresql://dummy:password@localhost:5432/dummy',
  },
});
