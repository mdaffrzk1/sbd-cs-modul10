const Redis = require("ioredis");

const redis = new Redis({
    port: 6379, // Port Redis
    host: "127.0.0.1", // Host Redis
    db: 0,

});

module.exports = redis;