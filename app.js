var express = require('express');
var app = express();

app.use(express.static(__dirname));


app.set('views', __dirname);
app.set('view engine', 'jade');

app.get('/', function(req, res){
  res.render('index');
});

app.listen(process.env.VCAP_APP_PORT || 3000);
