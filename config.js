if (process.env.VCAP_SERVICES) {
    redisData = JSON.parse(process.env.VCAP_SERVICES)["redis-2.2"][0];
    mongoData = JSON.parse(process.env.VCAP_SERVICES)["mongodb2-2.4.8"][0];
} else {
    redisData = {
        credentials : {
            port : 6379,
            host : "localhost",
            password : ""
        }
    },
    mongoData = {
    	credentials : {
            port : 6379,
            host : "localhost",
            password : ""
        }	
    }
}

var config = {
	"MONGO_DB_HOST" : mongoData.credentials.hostname,
	"MONGO_DB_USER" : mongoData.credentials.username,
	"MONGO_DB_PASS" : mongoData.credentials.password,
	"MONGO_DB_PORT" : mongoData.credentials.port,
	"MONGO_DB_DB" : mongoData.credentials.db,

	"REDIS_DB_HOST" : redisData.credentials.host,
	"REDIS_DB_PORT" : redisData.credentials.port,
	"REDIS_DB_PASS" : redisData.credentials.password
}

exports.config = config;