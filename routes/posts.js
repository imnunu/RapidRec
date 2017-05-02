"use strict";

const express       = require('express');
const router  = express.Router();

module.exports = (knex) => {

  router.get("/posts", (req, res) => {
    knex
      .select("*")
      .from("posts")
      .then((results) => {
        res.json(results);
      });
    });
  return router;
// }
  //  knex("posts")
  //     .join('users', 'posts.user_id', 'users.id')
  //     .select('first_name', 'posts.created_at', 'content', 'post_type')
  //     .where({
  //       game_id: game_id
  //     })
  //     .orderBy('posts.created_at', 'desc').then(function(rows) {
  //     callback(null,rows);
  //   })
  //   .catch(function(error) {
  //     callback(error,null);
  //   });
  //   return router;
  // });

  router.post("/", (req, res) => {
    knex.insert({
      post_type: true,
      content: newPost.content,
      created_at: newPost.created_at,
      game_id: newPost.game_id,
      user_id: newPost.user_id
    }).into("posts").then(callback()).catch(callback);
  });
  return router;
}
