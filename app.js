
var fileSystem = require('fs');
var path = require('path');
var express = require('express');
var app = express();
var request = require('request');
var mongoClient = require("mongodb").MongoClient;
var CronJob = require('cron').CronJob;
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressSession = require('express-session');

var session = require('./api/session');
var sounds = require('./api/sounds');
var user = require('./api/user');

var config = require('./config').config;
var pass = require('./pass');
var users = require('./users.js').users;


var redisStore = require('./redis-store').redisStore;

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
app.use(cookieParser());
app.use(bodyParser());
app.use(expressSession({ secret: 'keyboard cat' }));

app.get('/', function(req, res) {
    var filePath = path.join(__dirname, 'index.html');
    var readStream = fileSystem.createReadStream(filePath);
    readStream.pipe(res);
});

app.get('/api/session', session.get);

app.delete("/api/session", session.delete);

app.get('/downloadsound/:id', sounds.downloadsound);

app.get('/textsearch/:text/:page', sounds.search);

app.get('/sounddata/:id', sounds.sounddata);

app.get('/api/user', pass.restrict, user.get);

app.post('/api/user', user.post);

app.get('/mongotest', function(req, res) {
    res.send(users.find());
});

app.listen(process.env.VCAP_APP_PORT || 3000);
console.log("Server is listening on port: " + (process.env.VCAP_APP_PORT || 3000));