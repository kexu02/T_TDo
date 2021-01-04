const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const findOrCreate = require("mongoose-findorcreate");

require('dotenv').config();

const app = express();

app.use(express.static("Public"));
app.use(express.static("HomePage"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

//session initial configuration
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}));

//set up session with passport
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb+srv://admin-ke:password123!@cluster0.gwmp3.mongodb.net/T_TDO", {
    useNewUrlParser: true
}, {
    useUnifiedTopology: true
});
mongoose.set('useUnifiedTopology', true);
mongoose.set("useCreateIndex", true);

// creating user schema
const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    googleId: String
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

// Google OAuth
passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "https://fierce-falls-82195.herokuapp.com/auth/google/T_TDO",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    passReqToCallback   : true
  },
  function(request, accessToken, refreshToken, profile, done) {
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return done(err, user);
    });
  }
));

// homepage
app.get("/", function(req, res) {
    if (req.isAuthenticated()) {
        res.sendFile(__dirname + "/HomePage/homepage.html");
    } else {
        res.redirect("/signIn");
    }
});

// sign in page
app.get("/signIn", function(req, res) {
    res.sendFile(__dirname + "/signIn.html");
});

app.post("/signIn", function(req, res) {
    const user = new User({
        username: req.body.username,
        password: req.body.password,
        googleId: req.body.googleId
    });

    req.login(user, function(err) {
        if (!err) {
            passport.authenticate("local")(req, res, function() {
                res.redirect("/");
            })
        }
    });
});

//sign up page
app.post("/toSignUp", function(req, res) {
    res.redirect("/signUp");
});

app.get("/signUp", function(req, res) {
    res.sendFile(__dirname + "/signUp.html");
});

app.post("/signUp", function(req, res) {
    User.register({ username: req.body.username, googleId: req.body.googleId }, req.body.password, function(err, user) {
        if (!err) {
            passport.authenticate("local")(req, res, function() {
                res.redirect("/");
            });
        }
    });
});

// Google Sign in
app.get("/auth/google",
  passport.authenticate("google", {scope: ["profile"]})
);

app.get("/auth/google/T_TDO",
    passport.authenticate("google", {failureRedirect: "/signIn"}),
    function(req, res) {
      res.redirect("/");
    });

// log out
app.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/signIn");
});

// connects to webpage
app.listen(process.env.PORT || 3000, function() {

});
