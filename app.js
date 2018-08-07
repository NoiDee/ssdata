var express = require("express");
var bodyParser = require("body-parser");
var request = require('request');

var app = express();
var port = process.env.PORT || 3000;

//set body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//set static files
app.use(express.static(__dirname + "/data"));
app.use(express.static(__dirname + "/pages"));

// homepage
app.get("/", function (req, res) {
    res.sendFile(__dirname + "/pages/index.html");
});

// select characters
app.get("/api/characters/", function (req, res) {
    request('https://ssherder.com/data-api/characters/', function (error, response, body) {
      if (!error && response.statusCode == 200) {
        res.send(body)
      }
      else{
        res.sendFile(__dirname + "/pages/404.html", 404);
      }
    });
});

// page not found
app.get('*', function (req, res) {
    res.sendFile(__dirname + "/pages/404.html", 404);
});

app.listen(port, function () {
    console.log('Running on http://localhost:' + port);
});