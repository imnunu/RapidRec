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
// const friendRoutesAdd = require("./routes/add_friend");

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
// app.use("/api/user/friend", friendRoutesAdd(knex));

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
    res.status(401).send('<p>You have not logged in.</p><a href="/index">Login Here</a>');
    return;
  } else {
    res.render('create_event', {id: id});
  }
});

app.get('/event/:id', (req, res) => {
  let user_id = Number(req.session.user_id);
  let game_id = Number(req.params.id);
  console.log("this is req params id", req.params.id);

  if (!user_id) {
    res.status(401).send('<p>You have not logged in.</p><a href="/index">Login Here</a>');
    return;
  } else {
    Promise.all([
      profileData.queryUserGames(user_id),
      profileData.getPostsAndCommentsForGame(game_id),
      profileData.queryPartPlayers(game_id)
      // profileData.someOtherQuery(whatever)
    ]).then(([profile, posts, info]) => {
      const templateVars = {
<<<<<<< HEAD
        game_id,
        user_id,
        profile,
        posts,
        info
=======
        id: url,
        seshId: id,
        profile: '',
        posts: '',
        partUserId: '',
        gameId: req.params.id
>>>>>>> 8eecc76dc72425109384e60b145aa488976f3521
      };
      // res.render('event', templateVars);
      res.render('event', templateVars);
    }).catch(error => {
      res.status(500).json({ error: error.message });
    });
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
  }
});


app.post("/create_game/:id", (req, res) => {
  res.redirect('/events/' + data);
});

app.get('/create_game/:id', (req, res) => {
  console.log("create game event page loggedin user id is: ", req.session.user_id);
  res.render('event', {id: req.session.user_id});
});

app.get('/user/:id/profile', (req, res) => {
  return profileData.queryProfileData(req.params.id)
    .then(result => {
      // console.log("this is array of all games~~~~~~~~", result.user_games.games);
      let loggedInId = req.session.user_id;
      console.log("this is req.session.friends~~~~~~~~~~~~~~: ", req.session.friends);
      console.log("this is req.params.id in profile + in ajax add friends: ", req.params.id);
      let friendsArr = req.session.friends;
      let session = req.session;
      // console.log("TOTAL UPDATE thisis howmany friends you have: ", friendsArr);
      console.log("**************************")
      let currentTime = moment.utc(new Date(),"YYYY/MM/DD HH:mm:ss").tz('America/Los_Angeles');
      console.log("current___", moment.tz('America/Los_Angeles').format());
      console.log("current time ", currentTime);
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
        console.log("start", startTime);
        console.log("end", endTime);
        totalCount = totalCount + 1;
        // console.log('this is current time----:', currentTime);
        // console.log('this is start time:~~~~~', startTime);
        // console.log('this is end time:~~~~~', endTime);
        let upcoming = startTime - currentTime;
        let past = currentTime - endTime;
        // console.log('this is math UPCOMING: >>>', upcoming);
        // console.log('this is math PAST: >>>', past);
        // if (upcoming > - 25200000 && upcoming < 0) {
        //   console.log("true");
        // } else {
        //   console.log("false");
        // }


        // --- TODAYS GAMES
        if (upcoming > - 25200000 && upcoming < 0) {
          console.log("pushing game ", gameCount++, "into todays games array");
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
          console.log("pushing game ", gameCount++, "into upcoming games array");
          all_games.upcoming_games.push({
            id: game.id,
            title: game.title,
            location: game.location,
            start_time: game.start_time,
            end_time: game.start_time
          });
        }

        // --- PAST GAMES
        // endTime <= currentTime
        if (upcoming < - 25200000) {
          console.log("pushing game ", gameCount++, "into past games array");
          all_games.past_games.push({
            id: game.id,
            title: game.title,
            location: game.location,
            start_time: game.start_time,
            end_time: game.end_time
          });
        }
      });
      console.log("FRIENDS");
      console.log("***************************************************************")
      console.log("GAMES");
      console.log(totalCount + " games were sorted");
      console.log("this is array of todays games", all_games.todays_games);
      console.log("this is array of upcoming games", all_games.upcoming_games);
      console.log("this is array of past games", all_games.past_games);

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
  console.log("this is req.params", req.params);
  return profileData.queryProfileData(req.params.id)
    .then(data => {
      console.log("this is edit data to work w ", data);
      // res.json(data);
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
    console.log("you're done");
  });
});


app.post("/logout", (req, res) => {
  delete req.session.user_id;
  res.redirect('index');
});

app.post("/user/:id/friend", (req, res) => {
  console.log("this is user SESSION examine me: ", req.session.user_id);
  console.log("this is user PARAMS examine me: ", req.params.id);
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
          // console.log("this is result friends in BUTTON PRESSED ADD FRIEND", result.user_friends.friends);
          console.log("req session.friends -BEFORE- push/concat <<>>", req.session.friends);
          // for (let friend of result.user_friends.friends) {

            req.session.friends = req.session.friends.concat([{
              other_id: Number(req.params.id),
              status: 'Approved'
            }]);
          // }
          console.log("req session.friends -AFTER- push/concat <<>>", req.session.friends);

          // congrats
      });

    });
});

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
