"use strict";

const express = require('express');
const multer = require('multer');
const router = express.Router();

const storage= multer.diskStorage({
  destination: function (req, file, callback) {
    console.log("inside destination>>>, file: ", file)
    callback(null, './public/uploads');
  },
  filename: function(req, file, callback) {
    console.log("inside filename>>>, file: ", file)
    callback(null, Date.now() + '-' +file.originalname );

  },
});

const upload = multer({ storage: storage }).any();




module.exports = (knex) => {

  router.post("/", (req, res) => {
    upload(req, res, (err) => {

      console.log('req files--->>>: ', req.files);
      if (err) {
        console.log("this is error message: ", err);
        return res.send('Error uploading your file. <a href="/user/:id/edit" >Back</a>');
      }
      if (!(req.files.length)) {
        return res.send('Please choose a file before pressing the upload button. <a href="/user/:id/edit" >Back</a>');
      }

      console.log("success upload");

      function user_image(userid) {
        console.log("inside user image function, this is param value", userid, "(logged in user id)");
        let results = "results didnt' get redefined";
// this function handles updating profile pic. returns true if an image already exists in db
        return knex('users')
          .select('image')
          .where('id', '=', userid)
          .limit(1)
          .returning('image')
          .then((filteredRows)=> {
            if(filteredRows.length == 1) {
              return filteredRows[0].image;
            }
            // return;
            // console.log("results in user_ image funct inside pic handler", filteredRows);
            // return Promise.resolve(image);
          })
          .then((image)=> {
            console.log("this is the row i want: ", image);
            return image;
          });
         // always returning undefined, need rowIwant returned as value from function
      }

      // function readFilePromise(filename) {
      //   return new Promise((resolve, reject) => {
      //     fs.readFile(filename, (err, data) => {
      //       if(err) {
      //         return reject(err);
      //       }

      //       resolve(data);
      //     });
      //   })
      // }

      // readFile('filename.txt').then(data => { }).catch(error => { })

      let userImageVar = user_image(req.session.user_id);
      let templateVars;
      if (!userImageVar) {
        console.log("this is user_image return value", uuserImageVar);
        let templateVars = {
          update_profile_pic: req.files[0].originalname,
          update_pic_name: req.files[0].originalname
        }
        return templateVars;
      }
      console.log("here i am!");
      if (userImageVar) {
        console.log("this is user_image return value IN TRUE STATEMENT FUNCT", userImageVar);
        let templateVars = {
          // sql_profile_pic:
          // sql_pic_name:
        }
        return templateVars;
      }
      console.log("noooo here i am!");
      knex.insert({
        image: templateVars.update_profile_pic || templateVars.sql_profile_pic
      })
      .into('users')
      .then(function(){
      res.render('profile_edit', templateVars);
      console.log('congrats, file uploaded');
      });
    });
  });

  return router;
}
