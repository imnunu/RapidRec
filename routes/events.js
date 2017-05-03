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

  router.post('/:game_id/addComment', (req, res) => {
    const { game_id } = req.params;

  });

  return router;
}
