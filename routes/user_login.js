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
    // knex("users")
    //   .select("id", "password")
    //   .where({email: req.body.email})
    //   .limit(1)
    //   .then((rows) => {
    //     const user = rows[0];
    //     if (!user){
    //     req.flash("error", "Please enter a valid email and password to log in");
    //     res.redirect("/");
    //       return Promise.reject({
    //       });
    //     }
    //     const comparePasswords = bcrypt.compare(req.body.password, user.password);
    //     return comparePasswords.then((passwordsMatch) => {
    //       if (!passwordsMatch) {
    //     req.flash("error", "Please enter a valid email and password to log in");
    //     res.redirect("/");
    //         return Promise.reject({
    //           type:409,
    //           message: "Bad Credentials"
    //         });
    //       }
    //       return Promise.resolve(user);
    //     });
    //   })
    //   .then((user) => {
    //     req.session.user_id = user.id;
    //     res.redirect("/");
    //   })
    //   .catch((err) => {
    //     req.flash('errors', err.message);
    //     res.redirect('/');
    //   });
  });
  return router;
}
