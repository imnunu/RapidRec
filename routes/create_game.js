"use strict";

const express = require('express');
const router = express.Router();


module.exports = (knex) => {

  function endsBeforeStart(start, end) {
    if (end <= start) {
      return true;
    }
  }

router.post('/', (req, res) => {
  let date = new Date();
  let r = req.body;
  let badTime = endsBeforeStart(r.start_time, r.end_time);
  let loggedInUser = req.session.user_id;

  if (badTime) {
      res.status(400).send("Please start your basketball game before the end time");
  } else {
    knex.insert({
      location: r.location,
      start_time: r.start_time,
      end_time: r.end_time,
      equipment: r.equipment,
      description: r.description,
      number_of_players: r.number_of_players,
      created_at: date,
      title: r.title,
      lat: r.lat,
      lng: r.lng
    })
    .into('games')
    .returning('id')
    .then(function(id) {
      console.log(id);
      var newParticipant = {
        game_id: Number(id),
        user_id: Number(loggedInUser),
        created_at: date
      }
      knex.insert(newParticipant)
        .into('participations')
        .then(function () {
        res.json(id);
      });
      // res.json(id);
    });
  }
});

  return router;
}
