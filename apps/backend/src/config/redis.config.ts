import { createClient } from 'redis';

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

redisClient.on('connect', () => console.log('Redis Client Connected'));

redisClient.on('error', (err) => console.log('Redis Client Error', err));

// Connect when the module is imported
redisClient.connect().catch(console.error);

export default redisClient;
