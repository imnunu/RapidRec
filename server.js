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

// Seperated Routes for each Resource
const usersRoutes = require("./routes/users");
const usersRoutesLogin = require("./routes/user_login");
const usersRoutesRegister = require("./routes/user_register");

const postsRoutesFactory = require("./routes/posts");
const dataHelpersFactory = require("./dataHelpers")(knex);


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

// code below is used for uploading a picture from the internet(over 1 from your phone)
// const multer = require('multer');
// const storage= multer.diskStorage({
//   destination: function (req, file, callback) {
//     callback(null, './uploads');
//   },
//   filename: function(req, file, callback) {
//     callback(null, file.fieldname + '-' + Date.now());
//   }
// });
// const upload = multer({ storage: storage }).any();

app.use(express.static("public"));

// Mount all resource routes
app.use("/api/users", usersRoutes(knex));
app.use("/api/login", usersRoutesLogin(knex));
app.use("/api/register", usersRoutesRegister(knex));

app.use("/posts", postsRoutesFactory(dataHelpersFactory));


//requiring profile_pic route
// const postPicRoutes = require('./routes/post_profile_pic');
// const getPostRoutes = require('./routes/get_profile_pic');

// app.use('/api/uploadID/picture', postPicRoutes());
// app.use('/api/uploadID/picture', getPostRoutes());

// Home page
app.get("/", (req, res) => {
  res.redirect("/index");
});

app.get("/index", (req, res) => {
  let id = req.session.user_id;
  console.log(id);
  let templateVars = {id: id};
  res.status(200).render('index', templateVars);
});

app.get("/createEvent", (req, res) => {

});

app.post("/logout", (req, res) => {
  delete req.session.user_id;
  res.redirect("/index");
});

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
