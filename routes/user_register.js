"use strict";

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

module.exports = (knex) => {

  function findExistingEmail(email) {
    return knex
      .select('email')
      .from('users')
      .where({email: email})
      .limit(1)
      .then((results) => {
        if (results.length) {
          return Promise.resolve(email);
        } else {
          return Promise.resolve();
        }
      })
  }

  // function createNewUser(firstName, lastName, email, password, )

  router.post("/", (req, res) => {

    let date = new Date();
    let existingEmail = findExistingEmail(req.body.email);

    existingEmail.then((email) => {
      if (email) {
        res.send("Error: An account already exists with that email");
        // res.redirect('/');
      } else {
        knex.insert({
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          email: req.body.email,
          password: bcrypt.hashSync(req.body.password, 10),
          created_at: date
        })
        .into('users')
        .returning('id')
        .then(function(id){
          req.session.user_id = id;
          res.json('id');
        })
      }
    })
  });
  return router;
}
