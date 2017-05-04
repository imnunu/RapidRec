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
const usersRoutesPicture = require('./routes/post_profile_pic');

// knex queries

const profileData = require('./routes/profile_data.js')(knex);




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
    res.status(401).send('<p>You have not logged in.</p><a href="/index">Login Here</a>');
    return;
  } else {
    res.render('create_event', {id: id});
  }
});

app.get('/foo', (req, res) => {
  profileData.getPostsAndCommentsForGame(req.query.gameId).then(data => {
    res.json(data);
  })
})

app.get('/event/:id', (req, res) => {
  let user_id = Number(req.session.user_id);
  let game_id = Number(req.params.id);
  console.log("GAME IDDDD", req.params);

  if (!user_id) {
    res.status(401).send('<p>You have not logged in.</p><a href="/index">Login Here</a>');
    return;
  } else {
    Promise.all([
      profileData.queryUserGames(user_id),
      profileData.getPostsAndCommentsForGame(game_id),
      profileData.queryPartPlayers(game_id)
    ]).then(([profile, posts, info]) => {
      const templateVars = {
        game_id,
        user_id,
        profile,
        posts,
        time: moment(posts.created_at).fromNow(),
        info


      };
      res.render('event', templateVars);
    }).catch(error => {
      res.status(500).json({ error: error.message });
    });
  }
});


app.post("/create_game/:id", (req, res) => {
  res.redirect('/events/' + data);
});

app.get('/create_game/:id', (req, res) => {
  res.render('event', {id: req.session.user_id});
});

app.get('/user/:id/profile', (req, res) => {
  return profileData.queryProfileData(req.params.id)
    .then(result => {
      let loggedInId = req.session.user_id;
      let friendsArr = req.session.friends;
      let session = req.session;
      let currentTime = moment.utc(new Date(),"YYYY/MM/DD HH:mm:ss").tz('America/Los_Angeles');
      let gameCount = 1;
      let totalCount = 0;

     let all_games = {
        todays_games: [],
        upcoming_games: [],
        past_games: []
      };

      // --- PRINTING OUT INDIVIDUAL GAMES
      result.user_games.games.forEach(game => {
        let startTime = moment.utc(game.start_time,"YYYY/MM/DD HH:mm:ss");
        let endTime = moment.utc(game.end_time,"YYYY/MM/DD HH:mm:ss");
        totalCount = totalCount + 1;

        let upcoming = startTime - currentTime;
        let past = currentTime - endTime;



        // --- TODAYS GAMES
        if (upcoming > - 25200000 && upcoming < 0) {
          all_games.todays_games.push({
            id: game.id,
            title: game.title,
            location: game.location,
            start_time: game.start_time,
            end_time: game.start_time
          });
        }

        // --- FUTURE GAMES
        if (startTime > currentTime) {

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
          all_games.past_games.push({
            id: game.id,
            title: game.title,
            location: game.location,
            start_time: game.start_time,
            end_time: game.end_time
          });
        }
      });

      let templateVars = {
        seshId: loggedInId,
        urlId: req.params.id,
        friendsArr: friendsArr,
        // addFriendsArray: addFriendsArray,
        session: session,
        profile: result,
        todays_games: all_games.todays_games.reverse(),
        upcoming_games: all_games.upcoming_games.reverse(),
        past_games: all_games.past_games.reverse(),
        timeNow: moment().tz('America/Los_Angeles')
      }
      res.render('profile', templateVars);
    });
});

app.get("/user/:id/edit", (req, res) => {
  return profileData.queryProfileData(req.params.id)
    .then(data => {
      let templateVars = {
        seshId: req.session.user_id,
        profile: data
      }
    res.render('profile_edit', templateVars);
  })
});

app.post("/event/:id/addPosts", (req, res) => {
  knex.insert({
    game_id: req.params.id,
    user_id: req.session.user_id,
    content: req.body.content,
    created_at: new Date()
  })
  .into('posts')
  .then(() =>{
    res.json('success');
  });
});


app.post("/logout", (req, res) => {
  delete req.session.user_id;
  res.redirect('index');
});

app.post("/user/:id/friend", (req, res) => {
    knex("relationships")
    .insert([
    {
      user_id: Number(req.session.user_id),
      other_id: Number(req.params.id),
      status: 'Approved'
    },
    {
      user_id: Number(req.params.id),
      other_id: Number(req.session.user_id),
      status: 'Approved'
    }
    ])
    .returning('status')
    .then (() => {
      return profileData.queryProfileData(req.session.user_id)
        .then(result => {
            req.session.friends = req.session.friends.concat([{
              other_id: Number(req.params.id),
              status: 'Approved'
            }]);
      });

    });
});

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
