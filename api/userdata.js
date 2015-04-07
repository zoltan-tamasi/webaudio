var users = require('../users').users;

exports.post = function(req, res) {
  debugger;
  var data = req.body;
  if (!data.sounds  ) {
    res.end(JSON.stringify({
      success: false,
      message: "Invalid format"
    }));
    return;
  }

  var email = req.session.user.email;

  users.update({ email: email }, { $set: { sounds: data.sounds } }, function(err, count) {
    if (err) throw err;
    if (count) {
      res.end(JSON.stringify({
        success: true,
        message: "Userdata updated"
      }));
    } else {
      res.end(JSON.stringify({
        success: false,
        message: "User not found"
      }));
    }
  });
};