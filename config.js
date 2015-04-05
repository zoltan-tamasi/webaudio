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
            port : 10000,
            hostname : "localhost",
            password : "d61081b4-af3e-41bc-92fc-745b1ac2057b",
            username: "1d6e9561-4415-4a9b-86d1-251cbc2b0841",
            db : "db"
        }	
    }
}

/*mongoData = {
	credentials: {
		port : 33079,
		hostname : "ds033079.mongolab.com",
		password : "sylvain84",
		username : "zoltan_tamasi",
		db : "todo-app"
	}
}*/

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