if (process.env.VCAP_SERVICES) {
    redisData = JSON.parse(process.env.VCAP_SERVICES)["redis-2.2"][0];
    mongoData = JSON.parse(process.env.VCAP_SERVICES)["mongodb2-2.4.8"][0];
} else {
    redisData = {
        credentials : {
            port : 10000,
            host : "127.0.0.1",
            password : "fa9a1a0c-3aa3-4679-bb05-f0bcc599c9ba"
        }
    },
    mongoData = {
    	credentials : {
            port : 10001,
            hostname : "localhost",
            password : "f09eca35-ee36-4e3d-a80f-a5868b0a88b2",
            username: "d63c765e-da46-4427-b52a-51b93108b37e",
            db : "db"
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