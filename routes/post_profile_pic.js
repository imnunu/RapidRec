"use strict";

const express = require('express');
const multer = require('multer');
const app = express();

const storage= multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './public/uploads');
  },
  filename: function(req, file, callback) {
    callback(null, Date.now() + '-' +file.originalname );

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

      console.log("success upload & this is req files: ", req.files);

      function user_image(userid) {
//  uncomment when testing for users who are already logged in and previously uploaded a picture
        // knex('users')
        //   .select('image')
        //   .where('id', '=', userid)
        //   .limit(1)
        //   .returning('image')
        //   .then((results)=> {
        //     console.log("results", results);
        //     return Promise.resolve();
        //   });
        false
      }
// use code below as parameter for user image funct
      // req.session.user_id
      let user_image_var = user_image("hi");

      if (!user_image_var) {
        let templateVars = {
          update_profile_pic: req.files[0].originalname,
          update_pic_name: req.files[0].originalname
        }
        if (!(req.files.length)) {
          return res.send("Please choose a file before pressing the upload button put link here or a flash and redirect bak to hmepage");
        }
        return templateVars;
      }

      if (user_image_var) {
        let templateVars = {
          // sql_profile_pic:
          // sql_pic_name:
        }
        return templateVars;
      }

      knex.insert({
        image: req.files[0].originalname
      })
      .into('users')
      .then(function(){
      res.render('index', templateVars);
      console.log('congrats, file uploaded');
      });
    });
  });

  return app;
}
