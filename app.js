var express = require('express');
var app = express();
var request = require('request');
var redis = require('redis');
var CronJob = require('cron').CronJob;

var redisData, redisStore;
if (process.env.VCAP_SERVICES) {
    redisData = JSON.parse(process.env.VCAP_SERVICES)["redis-2.2"][0];
} else {
    redisData = {
        credentials : {
            port : 6379,
            host : "localhost",
            password : ""
        }
    }
}

var redisStore = redis.createClient(redisData.credentials.port, redisData.credentials.host);

redisStore.auth(redisData.credentials.password);
redisStore.on('connect', function() {
    console.log('connected to redis');
});

var job = new CronJob('0 20 * * * *', refreshToken, null, false, 'Europe/Berlin');
job.start();

function getDateTime() {
    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return year + ":" + month + ":" + day + ":" + hour + ":" + min + ":" + sec;
}

function refreshToken() {
    redisStore.mget(['oauthToken', 'refreshToken'], function(err, reply) {
        if (err) { console.log(err); return; }
        request.post('https://www.freesound.org/apiv2/oauth2/access_token/', {
            form: {
                'client_id' : process.env.CLIENT_ID || 'e4cd6c8ea6167f5ae50d',
                'client_secret' : process.env.CLIENT_SECRET || '8390a6d1330cbb30bb4b79794f3a0a36ed95b877',
                'grant_type' : 'refresh_token',
                'refresh_token' : reply[1]
            }
        }, function(error, response, body) {
            var tokenStore = {
                oauthToken : JSON.parse(response.body).access_token,
                refreshToken : JSON.parse(response.body).refresh_token
            };

            console.log(getDateTime()  + ': new access token is:' + tokenStore.oauthToken);
            console.log(getDateTime() + ': new refresh token is:' + tokenStore.refreshToken);

            if (tokenStore.oauthToken !== undefined) {
                redisStore.set('oauthToken', tokenStore.oauthToken);
                redisStore.set('refreshToken', tokenStore.refreshToken);
                redisStore.set('oauthTokenDateTime', getDateTime());
            } else {
                console.log("Retrieving oauthToken failed");
            }
        });
    }); 
}

app.use(express.static(__dirname));

app.set('views', __dirname);
app.set('view engine', 'jade');

app.get('/', function(req, res) {
    res.render('index');
});

app.get('/setToken/:oauth/:refresh', function(req, res) {
    redisStore.set('oauthToken', req.params.oauth);
    redisStore.set('refreshToken', req.params.refresh);
    res.send('Tokens set');
});

app.get('/getToken', function(req, res) {
    redisStore.mget(['oauthToken', 'refreshToken'], function(err, reply) {
        res.send(reply);
    });
});

app.get('/downloadsound/:id', function(req, res) {
    var id = req.params.id;
    redisStore.mget(['oauthToken', 'refreshToken'], function(err, reply) {
        //var oauthToken = "0d698e90de50d73bf0bcb391e05b81fa5fcc4424";
        var oauthToken = reply[0];
        request({
            method: 'GET',
            uri: 'https://www.freesound.org/apiv2/sounds/' + id + '/download/',
            headers: {
                'Authorization' : 'Bearer ' + oauthToken
            }
        }).pipe(res);
    });
});

app.get('/textsearch/:text/:page', function(req, res) {
    var page = req.params.page ? req.params.page : 1;
    request({
        method: 'GET',
        uri: 'http://www.freesound.org/apiv2/search/text/',
        qs: {
            query : req.params.text,
            page : page,
            token : process.env.FREESOUND_API_TOKEN || '8390a6d1330cbb30bb4b79794f3a0a36ed95b877'
        }
    }, function(error, response, body) {
        res.send(body);
    });
});

app.get('/sounddata/:id', function(req, res) {
    request({
        method: 'GET',
        uri: 'http://www.freesound.org/apiv2/sounds/' + req.params.id,
        qs: {
            token : process.env.FREESOUND_API_TOKEN || '8390a6d1330cbb30bb4b79794f3a0a36ed95b877'
        }
    }, function(error, response, body) {
        res.send(body);
    });
});

app.get('/mongotest', function(req, res) {
    require('mongodb').connect(mongourl, function(err, conn){
        conn.collection('ips', function(err, coll){
            /* Simple object to insert: ip address and date */
            object_to_insert = { 'ip': req.connection.remoteAddress, 'ts': new Date() };

            /* Insert the object then print in response */
            /* Note the _id has been created */
            coll.insert( object_to_insert, {safe:true}, function(err){
                res.writeHead(200, {'Content-Type': 'text/plain'});
                res.write(JSON.stringify(object_to_insert) + err);
                res.end('\n');
            });
        });
    });
});

app.listen(process.env.VCAP_APP_PORT || 3000);
console.log("Server is listening on port: " + (process.env.VCAP_APP_PORT || 3000));

if(process.env.VCAP_SERVICES){
    var env = JSON.parse(process.env.VCAP_SERVICES);
    var mongo = env['mongodb2-2.4.8'][0]['credentials'];
    console.log(mongo);
}
else{
    var mongo = {
        "hostname":"localhost",
        "port":27017,
        "username":"",
        "password":"",
        "name":"",
        "db":"db"
    }
}

var generate_mongo_url = function(obj){
    obj.hostname = (obj.hostname || 'localhost');
    obj.port = (obj.port || 27017);
    obj.db = (obj.db || 'test');

    if(obj.username && obj.password){
        return "mongodb://" + obj.username + ":" + obj.password + "@" + obj.hostname + ":" + obj.port + "/" + obj.db;
    }
    else{
        return "mongodb://" + obj.hostname + ":" + obj.port + "/" + obj.db;
    }
}

var mongourl = generate_mongo_url(mongo);
