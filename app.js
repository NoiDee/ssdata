const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const fs = require("fs");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

//set body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

//set static files
app.use(express.static(__dirname + "/data"));
app.use(express.static(__dirname + "/pages"));
app.use(express.static(__dirname + "/node_modules"));

// homepage
app.get("/", function (req, res) {
    res.sendFile(__dirname + "/pages/index.html");
});

// select characters
app.get("/api/characters/", function (req, res) {
    request('https://ssherder.com/data-api/characters/', function (error, response, body) {
        res.send(body)
    });
});

// lib
app.get("/node_modules/*", function (req, res) {
    let path = __dirname + req.url;
    let stat = fs.statSync(path);
    if (fs.existsSync(path) && stat.isFile()) {
        res.sendFile(path);
    } else {
        res.sendFile(__dirname + "/pages/404.html", 404);
    }
});

// page not found
app.get("*", function (req, res) {
    res.sendFile(__dirname + "/pages/404.html", 404);
});

app.listen(port, function () {
    console.log('Running on http://localhost:' + port);
});