var express = require("express");
var bodyParser = require("body-parser");

var charactersData = require("./data/characters.json")

var app = express();
var port = process.env.PORT || 8080;

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
    res.send(JSON.stringify(charactersData));
});

app.listen(port, function() {
    console.log('Running on http://localhost:' + port);
});