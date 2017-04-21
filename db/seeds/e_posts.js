
exports.seed = function(knex, Promise) {
  return knex('posts').del()
    .then(function () {
      return Promise.all([
//  post_type = commment deleted ? worry about later.
        knex('posts').insert({game_id: 1, user_id: 3, post_type: true, content: 'What a sick game man'}),
        knex('posts').insert({game_id: 2, user_id: 3, post_type: true, content: 'I really like these bball courts'}),
        knex('posts').insert({game_id: 3, user_id: 2, post_type: true, content: 'Too bad it rained'})
      ]);
    });
};
