var express = require('express');
var app = express();

app.use(express.static(__dirname + '/build'));

app.get('/', function(req, res) {
  res.redirect('/index.html');
})

app.listen(process.env.PORT || 3000, function() {
  console.log('server listening');
});