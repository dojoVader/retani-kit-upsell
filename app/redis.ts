import Redis from "ioredis";

declare global {
  // eslint-disable-next-line no-var
  var redisGlobal: Redis;
}

function createRedisClient() {
  if (process.env.REDIS_URL) {
    return new Redis(process.env.REDIS_URL);
  }

  return new Redis({
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: Number(process.env.REDIS_PORT) || 6379,
    username: process.env.REDIS_USERNAME || undefined,
    password: process.env.REDIS_PASSWORD || undefined,
    db: Number(process.env.REDIS_DB) || 0,
  });
}

if (process.env.NODE_ENV !== "production") {
  if (!global.redisGlobal) {
    global.redisGlobal = createRedisClient();
  }
}

const redis = global.redisGlobal ?? createRedisClient();

export default redis;
