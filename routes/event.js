"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {

// function joinExistingUser(user_id) {
//   return knex
//   .select('user_id')
//   .from('participations')
//   .where({user_id : user_id})
//   .limit(1)
//   .then((results) => {
//     if (results.length) {
//       return Promise.resolve(user_id);
//     } else {
//       return Promise.resolve();
//     }
//   })
// }

  router.get("/:id", (req, res) => {
    knex("games")
    .select('location', 'start_time', 'end_time', 'description', 'number_of_players', 'title', 'lat', 'lng')
    .where ({
      id: req.params.id
    }).then(function(rows) {
      console.log(rows);
      res.json(rows)
    });
  });

  router.post("/:id/join", (req, res) => {
    const loggedInUser = req.session.user_id;
    const gameId = req.params.id;
    knex.insert({
      user_id: Number(loggedInUser),
      game_id: Number(gameId),
      equipment: req.body.data
    })
    .into('participations')
    .then(function(rows) {
      res.json(rows)
    });
  });

  router.post("/:id/drop", (req, res) => {
    const loggedInUser = req.session.user_id;
    const gameId = req.params.id;
    knex('participations')
    .where ({
      user_id: Number(loggedInUser),
      game_id: Number(gameId)
    })
    .del()
    .then(
      res.json('done')
      );

  // router.post("/:id/delete", (req, res) => {
  //   const loggedInUser = req.session.user_id;
  //   const gameId = req.params.id;
  //   knex('participations')
  //   .where ({
  //     user_id: Number(loggedInUser),
  //     game_id: Number(gameId)
  //   })
  //   .del()
  //   .then(
  //     res.json('done')
  //     );
  });
  return router;
};

