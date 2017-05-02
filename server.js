"use strict";

require('dotenv').config();

const PORT        = process.env.PORT || 8080;
const ENV         = process.env.ENV || "development";
const express     = require("express");
const bodyParser  = require("body-parser");
const cookieSession = require('cookie-session');
const sass        = require("node-sass-middleware");
const app         = express();
const bcrypt      = require('bcrypt');
const flash       = require('connect-flash');
app.use(flash());

const knexConfig  = require("./knexfile");
const knex        = require("knex")(knexConfig[ENV]);
const morgan      = require('morgan');
const knexLogger  = require('knex-logger');


// uploading picture files (profile picture)
const multer = require('multer');
const storage= multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './public/uploads');
  },
  filename: function(req, file, callback) {
    callback(null, file.originalname );
  },
});

const upload = multer({ storage: storage }).any();
//  -------- uploading files constants end

// Seperated Routes for each Resource
const usersRoutes = require("./routes/users");
const usersRoutesLogin = require("./routes/user_login");
const usersRoutesRegister = require("./routes/user_register");
const eventRoutes = require("./routes/event");
const eventsRoutes = require("./routes/events");
const gamesRoutesCreate = require("./routes/create_game");
// const friendRoutesAdd = require("./routes/add_friend");

const postsRoutesFactory = require("./routes/posts");
const dataHelpersFactory = require("./dataHelpers")(knex);
const usersRoutesPicture = require('./routes/post_profile_pic');

// knex queries
const profileData = require('./profile_data.js')(knex);



// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

// Log knex SQL queries to STDOUT as well
app.use(knexLogger(knex));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
  name: 'session',
  keys: [process.env.SESSION_SECRET || 'development']
}));
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));


app.use(express.static("public"));

// Mount all resource routes
app.use("/api/users", usersRoutes(knex));
app.use('/api/picture', usersRoutesPicture(knex));
app.use("/api/login", usersRoutesLogin(knex));
app.use("/api/register", usersRoutesRegister(knex));
app.use("/api/event", eventRoutes(knex));
app.use("/api/events", eventsRoutes(knex));
app.use("/api/games/new", gamesRoutesCreate(knex));
// app.use("/api/user/friend", friendRoutesAdd(knex));

app.use("/posts", postsRoutesFactory(dataHelpersFactory));

// Home page
app.get("/", (req, res) => {
  res.redirect("/index");
});

app.get("/index", (req, res) => {
  let id = req.session.user_id;
  let templateVars = {id: id};
  res.status(200).render('index', templateVars);
});

app.get('/create_event', (req, res) => {
  let id = req.session.user_id;
  if (!id) {
    res.status(401).send('Please log in first');
    return;
  } else {
    res.render('create_event', {id: id});
  }
});

app.get('/event/:id', (req, res) => {
  let id = req.session.user_id;
  let url = req.params.id;
  if (!id) {
    res.status(401).send('Please log in first');
    return;
  } else {
    res.render('event', {id: url});
  }
});

app.post("/create_game/:id", (req, res) => {
  res.redirect('/events/' + data);
});

app.get('/create_game/:id', (req, res) => {
  res.render('event')
});

// routes used for navigating profile + edit profile
app.get('/user/:id/profile', (req, res) => {
  return profileData.queryProfileData(req.params.id)
    .then(data => {
      let loggedInId = req.session.user_id[0];
      let friendsArr = req.session.friends
      console.log("this is req.sessionid[0]: ", req.session.user_id[0]);
      console.log("this is req.sessionid.friends: ", req.session.friends);
      // console.log("loggedIn Id", loggedInId);
      // console.log("this is usr friends dataaa: ", data.user_friends.friends);
      // let idsOfFriends = [];

      // for (let friend of data.user_friends.friends) {
      //   // if (loggedInId === friend.user_id) {
      //     idsOfFriends.push(friend.other_id);
      //   // }
      // }

      // req.session.friends = idsOfFriends;
      // console.log("this is req.session.friends: ", req.session.friends);

      // console.log(idsOfFriends);
      // res.json(data);
      console.log("this is data:", data.user_friends.friends);
      let templateVars = {
        seshId: loggedInId,
        // id: req.params.id,
        profile: data,
        urlId: req.params.id,
        friendsArr: friendsArr
      }
      res.render('profile', templateVars);
    })
});

app.get("/user/:id/edit", (req, res) => {
  return profileData.queryProfileData(req.params.id)
    .then(data => {
      // res.json(data);
      let templateVars = {
        id: req.session.user_id,
        profile: data
      }
    res.render('profile_edit', templateVars);
  })
});

app.post("/logout", (req, res) => {
  delete req.session.user_id;
  res.redirect('index');
});

app.post("/user/:id/friend", (req, res) => {
    knex.insert({
      user_id: req.session.user_id[0],
      other_id: req.params.id,
      status: 'Approved'
    })
    .into("relationships")
    .then(() => {
      req.session.friends.push(req.params.id);
      console.log("this is updated array of friedns", req.session.friends);
      // congrats
    });
});

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
