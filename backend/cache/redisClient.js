

// cache/redisClient.js
import { createClient } from 'redis';

const redisClient = createClient();

redisClient.on('error', (err) => console.error('Redis Client Error', err));

await redisClient.connect(); // dùng await nếu file gọi là module ESM

export default redisClient;
