var express = require('express');
var app = express();
var request = require('request');
    
app.use(express.static(__dirname));

app.set('views', __dirname);
app.set('view engine', 'jade');

app.get('/', function(req, res) {
    res.render('index');
});

app.get('/downloadsound/:id', function(req, res) {
    var id = req.params.id ? req.params.id : 1908;
    request({
        method: 'GET',
        uri: 'https://www.freesound.org/apiv2/sounds/' + id + '/download/',
        headers: {
            'Authorization' : 'Bearer ' + process.env.OAUTH_TOKEN || '64cc9bc606503df50cda5d97ee7b922d401ea77c'
        }
    }).pipe(res);
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

app.listen(process.env.VCAP_APP_PORT || 3000);
