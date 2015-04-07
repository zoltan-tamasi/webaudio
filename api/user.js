var users = require('../users').users;
var pass = require('../pass');

exports.get = function(req, res) {
  res.end(JSON.stringify({
    "user" : (function() {
      return {
        username : req.session.user.username,
        email : req.session.user.email,
        sounds : req.session.user.sounds
      }
    })()
  }));
};

exports.post =function(req, res) {
  var data = req.body;

  users.findOne({ email : data.email }, function(err, user) {
    if (err) { res.end(err.toString()); return; }
    if (user) {
      res.end(JSON.stringify({
        success: false,
        message: "User with email already registered"
      }));
      return;
    }
    var salt = pass.getSalt();
    pass.hash(data.password, function(err, salt, hash) {
      if (err) { res.end(err.toString()); return; }
      users.insert({ 
        username : data.username,
        email : data.email,
        hash: hash,
        salt: salt,
        usersounds: []
      }, function(err, user) {
        if (err) { res.end(err.toString()); return; }
        res.end(JSON.stringify({
          success: true,
          message: "User with email " + data.email + " registered",
        }));
      });
    });
  });
};