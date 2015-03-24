var express = require('express');
var app = express();
var request = require('request');
var redis = require('redis');

var redisData = JSON.parse(process.env.VCAP_SERVICES)["redis-2.2"][0];
var redisStore = redis.createClient(redisData.credentials.port, redisData.credentials.host);
redisStore.auth(redisData.credentials.password);
redisStore.on('connect', function() {
    console.log('connected to redis');
});

var refreshTokenJob;

function refreshToken() {
    redisStore.mget(['oauthToken', 'refreshToken'], function(err, reply) {
        if (err) { console.log(err); return;}
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

            console.log('The new access token is:' + tokenStore.oauthToken);
            console.log('The new refresh token is:' + tokenStore.refreshToken);

            redisStore.set('oauthToken', tokenStore.oauthToken);
            redisStore.set('refreshToken', tokenStore.refreshToken);
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
        request({
            method: 'GET',
            uri: 'https://www.freesound.org/apiv2/sounds/' + id + '/download/',
            headers: {
                'Authorization' : 'Bearer ' + reply[0]
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

//refreshToken();
refreshTokenJob = setInterval(refreshToken, 12 * 60 * 60 * 1000);

app.listen(process.env.VCAP_APP_PORT || 3000);
console.log("Server is listening on port: " + (process.env.VCAP_APP_PORT || 3000));