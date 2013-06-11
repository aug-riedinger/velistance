var express = require('express');
var app = express();
var nodemailer = require("nodemailer");
var fs = require('fs');
var mime = require('mime');


var photosFile = __dirname + '/app/data/photos.json';

// app.use(express.logger());
app.use(express.errorHandler({
  dumpExceptions: true
}));
app.set('views', __dirname + '/app/views');
app.set('view engine', 'jade');
app.use(express.bodyParser());
app.use(express['static'](__dirname + '/app/static'));

app.get('/', function(req, res) {
  res.render('index');
});

app.get('/photos', function(req, res) {
  fs.readFile(photosFile, 'utf8', function (err, data) {
    res.setHeader('Content-Type','application/json');
    res.end(data);
  });
});

app.post('/photos', function(req, res) {

  if (mime.lookup(req.body.url).indexOf('image/') >= 0) {
    openFileForModif(req, res, function(photos) {
      photos.push({
        url: req.body.url,
        love: 1,
        flag: 0
      });
      return photos;
    });
  } else {
    res.writeHead(406, { 'Content-Type': 'application/json' });
    res.end('{"text": "L\'URL n\'a pas le bon format. Il ne s\'agit pas d\'une image."}');
  }
});

app.post('/love', function(req, res) {
  openFileForModif(req, res, function(photos) {
    for (var i=0; i< photos.length; i++) {
      if(photos[i].url == req.body.url) {
        photo = photos[i];
        photo.love +=1;
        photos[i] = photo;
        break;
      }
    }
    return photos;
  });
});

app.post('/flag', function(req, res) {
  openFileForModif(req, res, function(photos) {
    for (var i=0; i< photos.length; i++) {
      if(photos[i].url == req.body.url) {
        photo = photos[i];
        photo.flag +=1;
        photos[i] = photo;
        break;
      }
    }

    if(photos[i].flag > 10) {
      photos.splice(i, 1);
    }

    return photos;
  });
});

var port = process.env.PORT || 8000;
app.listen(port, function() {
  console.log('Listening on port ' + port + ' in ' + app.get('env') + ' mode');
});

var openFileForModif = function(req, res, modif) {
  fs.readFile(photosFile, 'utf8', function (err, data) {
    if (err) {
      return console.log('Error: ' + err);
    }
    var photos = JSON.parse(data);

    photos = modif(photos);

    fs.writeFile(photosFile, JSON.stringify(photos), function(err) {
      if (err) {
        return console.log('Error: ' + err);
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end('{"text": "Successfull"}');
    });

  });
};