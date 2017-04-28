"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {

  router.post("/:id/join", (req, res) => {
    const loggedInUser = req.session.user_id;
    const gameId = req.params.id;
    knex.insert({
      user_id: Number(loggedInUser),
      game_id: Number(gameId)
    })
    .into('participations')
    .then(function(rows) {
      console.log(rows);
      res.json(rows)
    });
  });

  return router;
}
