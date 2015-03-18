var express = require('express');
var app = express();
var request = require('request');
    
app.use(express.static(__dirname));

app.set('views', __dirname);
app.set('view engine', 'jade');

app.get('/', function(req, res) {
    res.render('index');
});

app.get('/textsearch/:text', function(req, res) {
    request({
        method: 'GET',
        uri: 'http://www.freesound.org/apiv2/search/text/',
        qs: {
            query : req.params.text,
            token : process.env.FREESOUND_API_TOKEN
        }
    }, function(error, response, body) {
        res.send(body);
    });
});

app.listen(process.env.VCAP_APP_PORT || 3000);
