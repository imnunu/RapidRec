// "use strict";

// const express = require('express');
// // const router = express.Router();
// const multer = require('multer');
// const app = express();
// const storage= multer.diskStorage({
//   destination: function (req, file, callback) {
//     console.log('inside diskSt destination, file & req body: ', file, req.body);
//     callback(null, './uploads');
//   },
//   filename: function(req, file, callback) {
//     // file.fieldname
//     console.log('inside diskSt filename, file & req body: ', file, req.body);
//     callback(null, file.originalname + '-' + Date.now());
//   },
//   // preservePath: function(req, file, cb) {
//   //   console.log('inside preserve path, file', file);
//   // }
// });
// const upload = multer({ storage: storage }).any();

// module.exports = () => {

//   app.post("/", (req, res) => {
//     console.log('inside profile pic handler');
//     upload(req, res, (err) => {
//       console.log('this is req params & req body & req files: ', req.params, req.body, req.files);
//       if (err) {
//         return res.end('Error uploading file. put a link back to profile page here');
//         console.log('Error uploadig file.');
//       }
//       res.redirect('/')
//       console.log('congrats, file uploaded');
//     });
//   });
//   return app;
// }
