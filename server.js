var express = require('express');
var app = express();
var nodemailer = require("nodemailer");

// app.use(express.logger());
app.use(express.errorHandler({
  dumpExceptions: true
}));
app.set('views', __dirname + '/app/views');
app.set('view engine', 'jade');
app.use(express['static'](__dirname + '/app/static'));

app.get('/', function(req, res) {
  res.render('index', {});
});

app.listen(8000, function() {
  console.log('Listening 8000')
});