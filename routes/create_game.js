"use strict";

const express = require('express');
const router = express.Router();


module.exports = (knex) => {

  function findExistingTitle(title) {

    return knex
      .select('title')
      .from('games')
      .where({title: title})
      .limit(1)
      .then((results) => {
        if (results.length) {
          return Promise.resolve(title);
        } else {
          return Promise.resolve();
        }
      });
  }

  function endsBeforeStart(start, end) {
    if (end <= start) {
      return true;
    }
  }

  router.post('/', (req, res) => {
    let date = new Date();
    let r = req.body;
    let existingTitle= findExistingTitle(r.title);
    let badTime = endsBeforeStart(r.start_time, r.end_time);


    existingTitle.then((title) => {
      if (title) {
        res.send('Sorry, but title: ' + req.body.title + ' already exists, please choose another ADD LNK back to hmepage');
        return;
      }
    });
      if (badTime) {
        res.send("error", "Please start your basketball game before the end time");
        res.redirect("/create_event.html");
        return;
      }
        knex.insert({
          location: r.location,
          start_time: r.start_time,
          end_time: r.end_time,
          equipment: r.equip,
          description: r.descr,
          number_of_players: r.numbPlayas,
          created_at: date,
          title: r.title
        })
        .into('games')
        .returning('id')
        .then(function(id){
          console.log(id);
          res.redirect('/');
        });
  });
  return router;
}


