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
          return Promise.reject(
            res.send('Please enter a valid email and password to log in')
          );
        }

        return Promise.all([bcrypt.compare(req.body.password, user.password), user]);
      })

      .then((results) => {
        const match = results[0];
        const user = results[1];
        // console.log("THIS IS MATCH LOGIN:", match);
        // console.log("THIS IS USER:", user);
        if(!match) {
          return Promise.reject(
            res.send('Incorrect Credentials')
          );
        } else {
          req.session.user_id = user.id;
          return knex('relationships')
            .select('relationships.status', 'relationships.other_id', 'relationships.user_id')
            .where('relationships.user_id', '=', req.session.user_id)
            .then(rows => {
              const result = {
                friends: []
              }
              rows.forEach(row => {
                if(row.other_id) {
                  result.friends.push({
                    other_id: row.other_id,
                    status: row.status
                  });
                }
              });
              req.session.friends = result.friends;
              console.log("this is req.session up LOGIN: ", req.session);
              // console.log("what are RESULTS.. too late?no: ", results);
              res.json(results)
            })
        }
      })
      .catch((error) => {
        res.json('error')
      });
  });

  return router;
}
