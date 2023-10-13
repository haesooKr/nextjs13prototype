import Redis from "ioredis";
import { getEnvVariable } from "./helpers";

const globalForRedis = global as unknown as { redisClient: Redis };

export const redisClient =
  globalForRedis.redisClient || new Redis(getEnvVariable("REDIS_URL"));

if (process.env.NODE_ENV !== "production") {
  globalForRedis.redisClient = redisClient;
}

export default redisClient;
