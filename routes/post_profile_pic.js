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
    callback(null, file.originalname );

  },
});

const upload = multer({ storage: storage }).any();




module.exports = (knex) => {

  router.post("/", (req, res) => {
    upload(req, res, (err) => {
      let idIsNumb = Number(req.session.user_id);
      console.log('req files--->>>: ', req.files);
      if (err) {
        console.log("this is error message: ", err);
        return res.send('Error uploading your file. <a href="/user/:id/edit" >Back</a>');
      }
      if (!(req.files.length)) {
        return res.send('Please choose a file before pressing the upload button. <a href="/user/:id/edit" >Back</a>');
      }

      console.log("success upload");

      knex('users')
      .where({id: idIsNumb})
      .update({
        image: req.files[0].originalname
      })
      .then(function(){
      res.redirect('/user/' + idIsNumb + '/edit');
      });
    });
  });

  return router;
}



