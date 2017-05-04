"use strict";

const express = require('express');
const router  = express.Router();
const moment = require('moment');

module.exports = (knex) => {

  router.get("/", (req, res) => {
    var currentDate = moment().tz("America/Los_Angeles").format();
    //var startTime = moment(games.start_time).tz("America/Los_Angeles").format();
    knex('games')
      .where('games.start_time', '>', currentDate)
      .select("*")
      .then((results) => {
        res.json(results);
    });
      return router;
  });

  router.get('/:game_id/comments', (req, res) => {
    const { game_id } = req.params;
    knex('posts')
      .where({ game_id })
      .select('*')
      .then(data => res.json(data))
      .catch(err => {
        res.status(500).json({ error: err.message });
      })
  })

  router.post('/:game_id/addComments', (req, res) => {
    console.log(req.body)
    knex.insert({
    post_id: req.body.post_id,
    user_id: req.session.user_id,
    content: req.body.content,
    created_at: new Date()
  })
  .into('comments')
  .then((results) =>{
    console.log(results);
    res.json(results);
    console.log("you're done");
  });
});



  return router;
}
