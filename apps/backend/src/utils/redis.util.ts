import redisClient from '@config/redis.config';

const DEFAULT_EXPIRATION = 3600;

export default class RedisUtil {
  public static async getOrSetCache<T>(
    key: string,
    fetchCallback: () => Promise<T>,
    expiration: number = DEFAULT_EXPIRATION,
  ): Promise<T> {
    try {
      // Try to get cached value
      const cachedData = await redisClient.get(key);
      if (cachedData) {
        return JSON.parse(cachedData) as T;
      }

      // Otherwise fetch fresh data and save to cache
      return await this.setCache(key, fetchCallback, expiration);
    } catch (error) {
      console.error('Redis getOrSetCache error:', error);
      // Fallback: fetch directly if Redis fails
      return fetchCallback();
    }
  }

  public static async setCache<T>(
    key: string,
    fetchCallback: () => Promise<T>,
    expiration: number = DEFAULT_EXPIRATION,
  ): Promise<T> {
    try {
      const freshData = await fetchCallback();

      await redisClient.setEx(key, expiration, JSON.stringify(freshData));

      return freshData;
    } catch (error) {
      console.error('Redis setCache error:', error);
      // Fallback: fetch directly if Redis fails
      throw error;
    }
  }

  public static async deleteCache(key: string): Promise<void> {
    try {
      const keys = await redisClient.keys(key);
      if (keys.length > 0) {
        await redisClient.del(keys);
        console.log(
          `Invalidated ${keys.length} cache entries matching pattern: ${key}`,
        );
      }
    } catch (error) {
      console.error('Redis invalidateCacheByPattern error:', error);
    }
  }
}
