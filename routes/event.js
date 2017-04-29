"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {

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
  //   dbHelpers.getGameInfo(req.params.id, (err, info) => {
  //     if (err) {
  //       console.log(JSON.toString(err));
  //       res.status(500).json({ error: err.message });
  //     } else {
  //       console.log(info);
  //       res.json(info);
  //     }
  //   });
  // });
  return router;
}
