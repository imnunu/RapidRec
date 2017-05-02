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
const moment      = require('moment');
const timezone    = require('moment-timezone');
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

//const postsRoutes = require("./routes/posts");
const usersRoutesPicture = require('./routes/post_profile_pic');

// knex queries

const profileData = require('./routes/profile_data.js')(knex);




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

//app.use("/api/posts", postsRoutes(knex));

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
  console.log("this is req params id", req.params.id);
  if (!id) {
    res.status(401).send('Please log in first');
    return;
  } else {
    Promise.all([
      profileData.queryUserGames(Number(id)),
      knex('posts').select('*').where({ game_id: url })
        .then(posts => {
          const postIds = posts.map(post => post.id);
          return knex('comments').select('*').whereIn('post_id', postIds)
            .then(comments => {
              comments.forEach(comment => {
                const post = posts.find(post => post.id === comment.post_id);
                post.comments = post.comment || [];
                post.comments.push(comment)
              });
              return posts;
            })
        })
    ]).then(([profile, posts]) => {
      const templateVars = {
        id: url,
        profile: '',
        posts: '',
        partUserId: '',
        gameId: req.params.id
      };
      // res.render('event', templateVars);
      res.render('event', templateVars);
    }).catch(error => {
      res.status(500).json({ error: error.message });
    })
    // return profileData.queryUserGames(Number(id))
    //   .then(data => {
    //     // res.json(data);
    //     console.log('THIS IS THE DATAAAAAA', data);
    //     let templateVars = {
    //       id: url,
    //       first_name: data.user.first_name,
    //       last_name: data.user.last_name,
    //       img: data.user.img,
    //       equipment: data.user.equipment,
    //       partUserId: data.user.partUserId
    //     }
    //     console.log('THIS IS THE TEMPLATE VARS:', templateVars);
    //     res.render('event', templateVars);
    //   })
  };
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
    .then(result => {
      console.log("this is array of all games~~~~~~~~", result.user_games.games);
      let currentTime = moment.utc().tz('America/Los_Angeles');
      let pasts = 1;
      let future = 1;
      let count = 0;
      let all_games = {
        past_games: [],
        upcoming_games: []
      };

      result.user_games.games.forEach(game => {
        count = count + 1;
        // let date = new Date();
        let startTime = moment.utc(game.start_time).tz('America/Los_Angeles');
        let endTime = moment.utc(game.end_time).tz('America/Los_Angeles');

        // --- UPCOMING GAMES
        if (startTime > currentTime) {
          console.log("pushing game ", future++, "into upcoming games array");
          all_games.upcoming_games.push({
            id: game.id,
            title: game.title,
            location: game.location,
            start_time: game.start_time,
            end_time: game.start_time
          });
        }
        // --- PAST GAMES
        if (endTime < currentTime) {
          console.log("pushing game ", pasts++, "into past games array");
          all_games.past_games.push({
            id: game.id,
            title: game.title,
            location: game.location,
            start_time: game.start_time,
            end_time: game.end_time
          });
        }
      });
      console.log("***************************************************************")
      console.log(count + " games were sorted");
      console.log("this is array of past games", all_games.past_games);
      console.log("this is array of upcoming games", all_games.upcoming_games);
      // res.json(data);

      // let arr = [];
      // all_games.past_games.reduce((currentTime, game) => {
      //   game.start_time.push(arr);

      // }, currentTime);

      // let pastSorted = arr.sort(function(a, b) {
      //   return b - a;
      // });
      let templateVars = {
        id: req.params.id,
        profile: result,
        past_games: all_games.past_games.reverse(),
        upcoming_games: all_games.upcoming_games.reverse(),
        timeNow: moment().tz('America/Los_Angeles')
      }
      res.render('profile', templateVars);
    });
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

app.post("/addComment", (req, res) => {
  console.log("posting to addd comment");
  knex.insert({
    post_id: '',
    user_id: '',
    content: '',
    created_at: new Date()
  })
  .into('comments')
  .then(() =>{
    console.log("you're done");
  });
});

app.post("/logout", (req, res) => {
  delete req.session.user_id;
  res.redirect('index');
});

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
