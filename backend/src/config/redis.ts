import Redis from "ioredis";
import { logger } from "./logger";

let redisClient: Redis | null = null;

// In-memory cache fallback for development when Redis is not running
interface CacheItem {
  value: string;
  expiry: number;
}
const memoryCache = new Map<string, CacheItem>();

const memoryGet = (key: string): string | null => {
  const item = memoryCache.get(key);
  if (!item) return null;
  if (Date.now() > item.expiry) {
    memoryCache.delete(key);
    return null;
  }
  return item.value;
};

const memorySet = (key: string, value: string, ttlSeconds: number) => {
  memoryCache.set(key, {
    value,
    expiry: Date.now() + ttlSeconds * 1000,
  });
};

const memoryDel = (key: string) => {
  memoryCache.delete(key);
};

export const connectRedis = async (): Promise<void> => {
  try {
    redisClient = new Redis({
      host: process.env.REDIS_HOST || "localhost",
      port: Number(process.env.REDIS_PORT) || 6379,
      password: process.env.REDIS_PASSWORD || undefined,
      lazyConnect: true,
      retryStrategy: (times) => {
        // Stop retrying after 3 attempts in development to prevent log spamming
        if (times > 3) {
          logger.warn("⚠️ Redis connection attempts exceeded. Using in-memory fallback.");
          return null; // Stop reconnecting
        }
        const delay = Math.min(times * 100, 1000);
        return delay;
      },
    });

    redisClient.on("connect", () => logger.info("✅ Redis Connected"));
    redisClient.on("error", (err) => {
      // Log errors only if we are connected or still attempting initial connection
      if (redisClient?.status === "ready") {
        logger.error("Redis Error:", err);
      }
    });
    redisClient.on("reconnecting", () => {
      logger.warn("Redis reconnecting...");
    });

    await redisClient.connect();
  } catch (error) {
    logger.warn("⚠️ Redis unavailable — continuing with in-memory fallback");
    redisClient = null;
  }
};

export const getRedis = (): Redis | null => redisClient;

// Helper to check if Redis is active and ready
const isRedisReady = (): boolean => {
  return redisClient !== null && redisClient.status === "ready";
};

// ─── Cache Helpers ───────────────────────────────────────────────────────────

export const cacheGet = async <T>(key: string): Promise<T | null> => {
  if (isRedisReady() && redisClient) {
    try {
      const data = await redisClient.get(key);
      return data ? (JSON.parse(data) as T) : null;
    } catch {
      // fallback to memory
    }
  }
  const localData = memoryGet(key);
  if (!localData) return null;
  try {
    return JSON.parse(localData) as T;
  } catch {
    return null;
  }
};

export const cacheSet = async (
  key: string,
  value: unknown,
  ttlSeconds = 300
): Promise<void> => {
  const stringValue = JSON.stringify(value);
  if (isRedisReady() && redisClient) {
    try {
      await redisClient.setex(key, ttlSeconds, stringValue);
      return;
    } catch {
      // fallback to memory
    }
  }
  memorySet(key, stringValue, ttlSeconds);
};

export const cacheDel = async (...keys: string[]): Promise<void> => {
  if (isRedisReady() && redisClient) {
    try {
      await redisClient.del(...keys);
      return;
    } catch {
      // fallback to memory
    }
  }
  keys.forEach(memoryDel);
};

export const cacheDelPattern = async (pattern: string): Promise<void> => {
  if (isRedisReady() && redisClient) {
    try {
      const keys = await redisClient.keys(pattern);
      if (keys.length > 0) await redisClient.del(...keys);
      return;
    } catch {
      // fallback to memory
    }
  }
  // Simplified pattern matching for memory cache (converts redis wildcard * to regex)
  const escapedPattern = pattern.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&').replace(/\\\*/g, '.*');
  const regex = new RegExp(`^${escapedPattern}$`);
  for (const key of memoryCache.keys()) {
    if (regex.test(key)) {
      memoryCache.delete(key);
    }
  }
};

// ─── OTP / Token Storage ─────────────────────────────────────────────────────

export const storeOTP = async (key: string, otp: string): Promise<void> => {
  const ttl = (Number(process.env.OTP_EXPIRES_IN_MINUTES) || 10) * 60;
  await cacheSet(`otp:${key}`, otp, ttl);
};

export const verifyOTP = async (
  key: string,
  otp: string
): Promise<boolean> => {
  const stored = await cacheGet<string>(`otp:${key}`);
  if (stored === otp) {
    await cacheDel(`otp:${key}`);
    return true;
  }
  return false;
};

export const storeRefreshToken = async (
  userId: string,
  token: string
): Promise<void> => {
  const ttl = 7 * 24 * 60 * 60; // 7 days
  await cacheSet(`refresh:${userId}`, token, ttl);
};

export const getRefreshToken = async (
  userId: string
): Promise<string | null> => {
  return cacheGet<string>(`refresh:${userId}`);
};

export const deleteRefreshToken = async (userId: string): Promise<void> => {
  await cacheDel(`refresh:${userId}`);
};

// ─── Rate Limiting ───────────────────────────────────────────────────────────

export const incrementRateLimit = async (
  key: string,
  windowMs: number
): Promise<number> => {
  if (isRedisReady() && redisClient) {
    try {
      const count = await redisClient.incr(`rate:${key}`);
      if (count === 1) {
        await redisClient.pexpire(`rate:${key}`, windowMs);
      }
      return count;
    } catch {
      // fallback to memory
    }
  }
  
  const memoryKey = `rate:${key}`;
  const now = Date.now();
  const item = memoryCache.get(memoryKey);
  if (!item || now > item.expiry) {
    memoryCache.set(memoryKey, {
      value: "1",
      expiry: now + windowMs,
    });
    return 1;
  }
  const nextVal = parseInt(item.value, 10) + 1;
  item.value = nextVal.toString();
  return nextVal;
};
