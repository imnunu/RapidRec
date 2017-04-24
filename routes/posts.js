"use strict";

const express       = require('express');
const postsRoutes  = express.Router();

module.exports = function(DataHelpers) {

  postsRoutes.get("/", function(req, res) {
    DataHelpers.getPosts((err, posts) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json(posts);
      }
    });
  });

  postsRoutes.post("/", function(req, res) {
    if (!req.body.text) {
      res.status(400).json({ error: 'invalid request: no data in POST body'});
      return;
    }

    // const user = req.body.user ? req.body.user : userHelper.generateRandomUser();
    const post = {
      // user: user,
      content: {
        text: req.body.text
      },
      created_at: Date.now()
    };

    DataHelpers.savePost(post, (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(201).send();
      }
    });
  });

  return postsRoutes;

}
