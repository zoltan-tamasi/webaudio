var crypto = require('crypto');

var users = require('./users').users;

var len = 128;

var iterations = 12000;

function hash(pwd, salt, fn) {
  if (3 == arguments.length) {
    crypto.pbkdf2(pwd, salt, iterations, len, function(err, hash) {
      fn(err, (new Buffer(hash, 'binary')).toString('base64'));
    });
  } else {
    fn = salt;
    crypto.randomBytes(len, function(err, salt) {
      if (err) return fn(err);
      salt = salt.toString('base64');
      debugger;
      crypto.pbkdf2(pwd, salt, iterations, len, function(err, hash){
        if (err) return fn(err);
        fn(null, salt, (new Buffer(hash, 'binary')).toString('base64'));
      });
    });
  }
}; 

exports.authenticate = function(email, password, fn) {
  console.log('authenticating %s:%s', email, password);
  users.findOne({ email : email }, function(err, user) {
    if (err) { console.log (err); }
    if (!user) return fn(new Error('cannot find user'));
    hash(password, user.salt, function(err, hash) {
      if (err) return fn(err);
      if (hash == user.hash) return fn(null, user);
      fn(new Error('invalid password'));
    });
  });
}

exports.getSalt = function() {
  return crypto.randomBytes(48).toString('hex');
}

exports.restrict = function(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.end(JSON.stringify({
      success: false,
      message: "User not authenticated"
    }));
  }
}

exports.hash = hash;