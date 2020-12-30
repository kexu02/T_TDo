const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const ejs = require("ejs");

const app = express();

app.use(express.static("Public"));
app.use(bodyParser.urlencoded({extended: true}));

// homepage
app.get("/", function(req, res) {
    res.sendFile(__dirname + "/signIn.html");
})

app.post("/", function(req, res) {
    res.sendFile(__dirname + "/homepage.html");
})

// connects to webpage
app.listen(process.env.PORT || 3000, function() {

})
