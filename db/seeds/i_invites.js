exports.seed = function(knex, Promise) {
  return knex('invites').del()
    .then(function () {
      return Promise.all([
  // invite to play a game !
        knex('invites').insert({game_id: 1, user_id: 1, status: false}),
        knex('invites').insert({game_id: 2, user_id: 1, status: true}),
        knex('invites').insert({game_id: 2, user_id: 2, status: true})
      ]);
    });
};
