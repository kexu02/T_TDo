require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const findOrCreate = require("mongoose-findorcreate");
var session = require('expess-session');
var flash = require('connect-flash');

const app = express();

app.use(express.static("Public"));
app.use(express.static("HomePage"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));


//flash message initialization
app.user(session({
    secret: 'secret',
    cookie: { maxAge: 600000 },
    resave: false,
    saveUninitialized: false
}));
app.user(flash());

//session initial configuration
app.use(session({
    secret: "ssss",
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

//creating task schema
const taskSchema = new mongoose.Schema({
  item: String,
  description: String,
  date: Date
});

// creating user schema
const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    googleId: String,
    list: [taskSchema]
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const Task = new mongoose.model("Task", taskSchema);
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
<<<<<<< HEAD
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "https://ttdo.herokuapp.com/auth/google/ttdo",
        userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    function(accessToken, refsreshToken, profile, done) {
        User.findOrCreate({ googleId: profile.id }, function(err, user) {
            return done(err, user);
        });
    }
=======
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "https://ttdo.herokuapp.com/auth/google/ttdo",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
  },
  function(accessToken, refsreshToken, profile, done) {
    User.findOrCreate({ googleId: profile.id, username: profile.emails[0].value}, function (err, user) {
      return done(err, user);
    });
  }
>>>>>>> 33e606bfce94a41f55f7bc55f7beafa6e116daa6
));

// Google Sign in
app.get("/auth/google",
<<<<<<< HEAD
    passport.authenticate('google', { scope: ["profile"] })
=======
  passport.authenticate('google', { scope: ["profile", "email"] })
>>>>>>> 33e606bfce94a41f55f7bc55f7beafa6e116daa6
);

app.get("/auth/google/ttdo",
    passport.authenticate('google', { failureRedirect: "/signIn" }),
    function(req, res) {
        res.redirect("/");
    });

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
    });

    req.login(user, function(err) {
        if (!err) {
            passport.authenticate("local")(req, res, function() {
                res.redirect("/");
            })
        } else {
            res.redirect("/signIn");
            request.flash('message', 'Incorrect username or password');
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
    User.register({ username: req.body.username }, req.body.password, function(err, user) {
        if (!err) {
            passport.authenticate("local")(req, res, function() {
                res.redirect("/");
            });
        }
    });
});

// To do list
var items = [];

app.get("/list", function(req, res) {
    res.render("list", { newListItems: items });
})


app.post("/list", function(req, res) {
    item = req.body.newItem;
    items.push(item);
    res.redirect("/list");
})

// log out
app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/signIn");
});

// connects to webpage
app.listen(process.env.PORT || 3000, function() {

});