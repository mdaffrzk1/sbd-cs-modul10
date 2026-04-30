const Redis = require("ioredis");

const redis = process.env.REDIS_URL 
    ? new Redis(process.env.REDIS_URL) 
    : new Redis({
        port: 6379, // Port Redis Lokal
        host: "127.0.0.1", // Host Redis Lokal
        db: 0,
    });

module.exports = redis;