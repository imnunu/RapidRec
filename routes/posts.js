"use strict";

const express       = require('express');
const postsRoutes  = express.Router();

module.exports = function(dbHelpers) {

  postsRoutes.get("/:game_id", function(req, res) {
    dbHelpers.getPosts(req.params.game_id, (err, posts) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        console.log(posts);
        res.json(posts);
      }
    });
  });

  postsRoutes.post("/", function(req, res) {
    if (!req.body.content) {
      res.status(400).json({ error: 'invalid request: no data in POST body'});
      return;
    }

    const post = {
    game_id: req.body.game_id,
    user_id: req.body.user_id,
    post_type: req.body.post_type,
    content: req.body.content,
    created_at: new Date()
  };

    dbHelpers.savePost(post, (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(201).send();
      }
    });
  });

  return postsRoutes;

}
