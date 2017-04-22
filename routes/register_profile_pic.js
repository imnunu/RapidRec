"use strict";

const express = require('express');
// const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }).single('avatar');
const app = express();
const storage= multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './uploads');
  }
})

app.post("/profile_pic", (req, res) => {
  upload(req, res, (err) => {
    if (err) {

      return
    }
    console.log('what happens when this code is run? req res');
    console.log("this is req.file: ", req.file);
  })
});
