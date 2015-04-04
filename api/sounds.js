var request = require('request');
var redisStore = require('../redis-store').redisStore;

exports.search = function(req, res) {
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
};

exports.downloadsound = function(req, res) {
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
};

exports.sounddata = function(req, res) {
    request({
        method: 'GET',
        uri: 'http://www.freesound.org/apiv2/sounds/' + req.params.id,
        qs: {
            token : process.env.FREESOUND_API_TOKEN || '8390a6d1330cbb30bb4b79794f3a0a36ed95b877'
        }
    }, function(error, response, body) {
        res.send(body);
    });
};
