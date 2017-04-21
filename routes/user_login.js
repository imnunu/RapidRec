"use strict";

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

module.exports = (knex) => {
  router.post("/", (req, res) => {
    knex('users')
      .select('id', 'password')
      .where('email', req.body.email)
      .limit(1)
      .then((results) => {
        const user = results[0];
        if(!user) {
          return Promise.reject({
            message: 'Please enter a valid email and password to log in'
          });
        }

        return Promise.all([bcrypt.compare(req.body.password, user.password), user]);
      })
      .then((results) => {
        const match = results[0];
        const user = results[1];
        if(!match) {
          return Promise.reject({
            message: 'Incorrect password'
          });
        }

        req.session.user_id = user.id;
        res.redirect('/');
      })
      .catch((error) => {
        req.flash('errors', error.message);
        res.redirect('/');
      });
  });

  return router;
}
