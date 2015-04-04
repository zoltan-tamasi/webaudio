var redis = require("redis");
var config = require("./config").config;

var redisStore = redis.createClient(config.REDIS_DB_PORT, config.REDIS_DB_HOST);

redisStore.auth(config.REDIS_DB_PASS);
redisStore.on('connect', function() {
    console.log('connected to redis');
});

exports.redisStore = redisStore;
