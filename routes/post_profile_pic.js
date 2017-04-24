"use strict";

const express = require('express');
const multer = require('multer');
const app = express();

const storage= multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './uploads');
  },
  filename: function(req, file, callback) {
    callback(null, Date.now() + '-' + file.originalname );
  },
});

const upload = multer({ storage: storage }).any();




module.exports = (knex) => {

  app.post("/", (req, res) => {
    upload(req, res, (err) => {

      console.log('req files--->>>: ', req.files);
      if (err) {
        return res.end('Error uploading file. put a link back to profile page here');
      }

      if (!(req.files.length)) {
        return res.send("Please choose a file before pressing the upload button put link here or a flash and redirect bak to hmepage");
      }

      console.log("success upload & this is req files: ", req.files);
      let templateVars = {
        profile_pic: req.files[0].originalname,
        pic_name: req.files[0].originalname
      }

      knex.insert({
        image: req.files[0].originalname
      })
      .into('users')
      .then(function(){


// ---- must use ajax insteada this way -----


      res.render('index', templateVars);
      console.log('congrats, file uploaded');
      });
    });
  });

  return app;
}





