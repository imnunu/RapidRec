"use strict";

module.exports = (db) => {

  // (newPost:{user_id, }) -> Promise({id, post_type, content, created_at})
  function savePost(newPost, callback) {
     db.insert({
      post_type: true,
      content: newPost.content,
      created_at: newPost.created_at,
      game_id: newPost.game_id,
      user_id: newPost.user_id
    }).into("posts").then(callback()).catch(callback);
  }

  // sort messages by newest in databsae
  function getPosts(game_id, callback) {
    db("posts")
      .join('users', 'posts.user_id', 'users.id')
      .select('first_name', 'posts.created_at', 'content', 'post_type')
      .where({
        game_id: game_id
      })
      .orderBy('posts.created_at', 'desc').then(function(rows) {
      callback(null,rows);
    })
    .catch(function(error) {
      callback(error,null);
    });
  };

// function getGameInfo(id, callback) {
//   db("games")
//   .select('location', 'start_time', 'end_time', 'description', 'number_of_players')
//   .where({
//     game_id: id
//   }).then(function(rows){
//     console.log(rows);
//     callback(error, null);
//   }).catch(function(error) {
//     callback(error, null);
//   });
// };

  return {
    savePost: savePost,
    getPosts: getPosts,
    // getGameInfo: getGameInfo
  };

}
