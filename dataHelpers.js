"use strict";

module.exports = function makeDataHelpers(db) {
  return {

    // Save new post to the database
    savePost: function(newPost, callback) {
      //db("posts").insertOne(newPost);
        callback(null, true);
    },

    // sort messages by newest in databsae
    getPosts: function(callback) {
      //db("posts").find().toArray(callback);
    }
  };
};
