// packages/redis/index.ts
import { createClient, RedisClientType } from 'redis';

let redis: RedisClientType;

declare global {
  var _redis: RedisClientType | undefined;
}

if (!global._redis) {
  redis = createClient({ url: 'redis://localhost:6379' });
  redis.on('error', (err: Error) => {
    console.error(' Redis Client Error', err.message);
  });
  global._redis = redis;
} else {
  redis = global._redis;
  
}

export default redis;
