const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const ejs = require("ejs");

const app = express();

app.use(express.static("Public"));
app.use(express.static("HomePage"));
app.use(bodyParser.urlencoded({extended: true}));

// sign in page
app.get("/", function(req, res) {
    res.sendFile(__dirname + "/signIn.html");
})

app.post("/", function(req, res) {
    res.sendFile(__dirname + "/HomePage/homepage.html");
})

// connects to webpage
app.listen(process.env.PORT || 3000, function() {

})
