const sharp = require('sharp');
const redis = require('ioredis');

const redisÌmage = redis.createClient({
    db: 1,
});

redisÌmage.on('error', (err) => {
    console.error('Redis error:', err);
});

module.exports = async (req, res, next) => {
    next();
};
