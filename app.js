var express = require("express");
var bodyParser = require("body-parser");


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
    var data = require("./data/characters.json")
    res.send(JSON.stringify(data));
});

// select customer where id = ?
app.get("/api/customers/:_id", function (req, res) {
    db.find({ _id: req.params._id }, function (err, docs) {
        res.json(docs[0]);
    });
});


// insert into customers
app.post("/api/customers", function (req, res) {
    var user = req.body;
    db.insert(user, function () {
        res.json({ success: true });
    });
});

// delete from customers where id = ?
app.delete("/api/customers", function () {
    // db.remove({ _id: req.params }, function (err, numRemoved) {
    //     res.json({ success: true });
    // });
});

app.listen(port, function() {
    console.log('Our app is running on http://localhost:' + port);
});