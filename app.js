const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.use(express.static("Public"));
app.use(express.static("HomePage"));
app.use(bodyParser.urlencoded({
  extended: true
}));

mongoose.connect("mongodb+srv://admin-ke:password123!@cluster0.gwmp3.mongodb.net/T_TDO", { useNewUrlParser: true }, { useUnifiedTopology: true });

// creating user schema
const userSchema = {
  email: String,
  password: String
};

const User = new mongoose.model("User", userSchema);

// sign in page
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signIn.html");
})

app.post("/", function(req, res) {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({email: email}, function(err, foundAcc) {
    if (!err) {
      if (foundAcc) {
        if (foundAcc.password === password) {
          res.sendFile(__dirname + "/HomePage/homepage.html");
        }
      }
    }
  });
})

// app.get("/signUp", function(req, res) {
//   res.sendFile(__dirname + "/signUp.html");
// })

app.post("/signUp", function(req, res) {
  const newUser = new User({
    email: req.body.email,
    password: req.body.password
  });

  newUser.save(function(err) {
    if (!err) {
      res.sendFile(__dirname + "/signIn.html");
    }
  });
})

// connects to webpage
app.listen(process.env.PORT || 3000, function() {

})
