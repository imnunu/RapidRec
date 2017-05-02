"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {

  router.get("/", (req, res) => {
    knex
      .select("*")
      .from("games")
      .then((results) => {
        res.json(results);
    });
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
