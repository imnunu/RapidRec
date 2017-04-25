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

  console.log('Post to Create Games', r, badTime);
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
      title: r.title
    })
    .into('games')
    .returning('id')
    .then(function(id){
      console.log(id);
      res.json(id);
    });
  }
});

  return router;
}
