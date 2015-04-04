var monk = require('monk');
var config = require('./config').config;
var uri = "mongodb://" + config.MONGO_DB_HOST + ":" + config.MONGO_DB_PORT + "/" + config.MONGO_DB_DB;
var db = monk(uri, {
    username : config.MONGO_DB_USER,
    password : config.MONGO_DB_PASS
});

exports.users = db.get("users");