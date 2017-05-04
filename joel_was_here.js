
function runMyTest(knex){
    function getPostsAndCommentsForGame(game_id = 27) {
    return knex('posts')
      .select('posts.id','posts.created_at', 'posts.content', 'users.first_name', 'users.last_name')
      .join('users', 'posts.user_id', '=', 'users.id')
      .where({ game_id })
      .orderBy('created_at', 'desc')
      .then(posts => {

        const postIds = posts.map(post => post.id);

        posts.forEach(post => {
          post.comments = [];
        });

        return knex('comments').select('comments.*', 'users.first_name', 'users.last_name').whereIn('post_id', postIds)
          .innerJoin('users', 'comments.user_id', 'users.id')
          .then((comments) => {
            comments.forEach(comment => {
              const myPost = posts.find(post => post.id === comment.post_id);
              myPost.comments.push(comment);
            });
            return posts;
          })
      })
  }
  getPostsAndCommentsForGame()
    .then((data) => {
      console.log('Final', data);
    });
}
require('dotenv').config();
const PORT        = process.env.PORT || 8080;
const ENV         = process.env.ENV || "development";
const knexConfig  = require("./knexfile");
const knex        = require("knex")(knexConfig[ENV]);
runMyTest(knex);
